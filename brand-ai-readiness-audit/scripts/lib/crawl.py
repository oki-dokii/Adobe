"""Priority BFS crawl with time budget, depth cap, SimHash, coverage."""

from __future__ import annotations

import time
import uuid
from collections import defaultdict
from heapq import heappop, heappush
from typing import Optional

from lib.access import classify_http_access, content_usable
from lib.clock import Clock, is_protected_fact_url
from lib.extract import fill_page_from_html
from lib.http import HttpClient, HttpError, USER_AGENT
from lib.models import CrawlSnapshot, Page
from lib.money import has_offer_price
from lib.render import apply_render
from lib.robots import fetch_robots
from lib.simhash import TemplateClusterer
from lib.sitemap import fetch_sitemaps
from lib.url import canonical_key, origin, same_registrable, trap_flags

LEXICON = (
    ("pricing", 8),
    ("price", 8),
    ("about", 7),
    ("contact", 6),
    ("product", 7),
    ("features", 5),
    ("docs", 4),
    ("blog", 2),
    ("legal", 3),
    ("privacy", 3),
)

DEPTH_CAP = 6
PAGE_CAP = 40

_ACCESS_LABEL = {
    "challenge": "bot-challenge / WAF interstitial",
    "captcha": "captcha / bot verification",
    "unauthorized": "HTTP 401 unauthorized",
    "rate_limited": "HTTP 429 rate limit",
    "unavailable": "HTTP 5xx unavailable",
    "empty": "empty or invalid response body",
    "forbidden_content": "HTTP 403 forbidden (body not used as public brand evidence)",
    "error_document": "HTTP error document",
}


def _score(url: str, depth: int, sitemap_bonus: bool, seed: str = "") -> float:
    u = url.lower()
    s = 1.0
    for word, w in LEXICON:
        if word in u:
            s += w
    if sitemap_bonus:
        s += 2
    if seed and is_protected_fact_url(url, seed):
        s += 12  # priority within the cap — never extra renders
    s -= depth * 1.5
    return -s  # heap is min-heap


def crawl(
    seed: str,
    client: HttpClient,
    clock: Clock,
    page_cap: int = PAGE_CAP,
    depth_cap: int = DEPTH_CAP,
    rendered_map: Optional[dict[str, str]] = None,
    render_max: int = 10,
) -> CrawlSnapshot:
    run_id = str(uuid.uuid4())
    orig = origin(seed)
    t0 = time.time()
    robots = fetch_robots(client, seed)
    snap = CrawlSnapshot(
        run_id=run_id,
        seed_url=seed,
        origins=[orig],
        robots_status=robots.status,
        robots_body=robots.body,
        deadline_ts=clock.deadline_ts,
        limitations=["Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl."],
    )
    if robots.status == "fail_closed":
        snap.coverage = {
            "pages_fetched": 0,
            "pages_rendered": 0,
            "estimated_pages": None,
            "templates": 0,
            "k_categories_hit": [],
            "stopped_reason": "robots",
            "robots_status": robots.status,
            "timeout_count": 0,
            "redirect_hops_total": 0,
            "ssrf_blocks": 0,
            "render_max": render_max,
            "renders_requested": 0,
            "renders_performed": 0,
            "renders_skipped_budget": 0,
            "protected_render_requests": 0,
            "protected_render_exceptions": 0,
        }
        snap.timing.crawl_ms = (time.time() - t0) * 1000
        return snap

    sitemap_urls = []
    try:
        sitemap_urls = fetch_sitemaps(client, orig, robots.body)
    except Exception:
        sitemap_urls = []
    sitemap_set = {canonical_key(x["url"]) for x in sitemap_urls}

    clusterer = TemplateClusterer()
    seen: set[str] = set()
    heap: list[tuple[float, int, str, int]] = []
    seq = 0
    heappush(heap, (_score(seed, 0, False, seed), seq, seed, 0))
    seq += 1
    for item in sitemap_urls[:30]:
        heappush(heap, (_score(item["url"], 1, True, seed), seq, item["url"], 1))
        seq += 1

    pages: list[Page] = []
    graph_edges: list[tuple[str, str]] = []
    n = 0
    k_hit: set[str] = set()
    render_used = 0
    renders_requested = 0
    renders_skipped_budget = 0
    protected_render_requests = 0
    render_ms = 0.0
    pages_fetched = 0
    access_counts: dict[str, int] = defaultdict(int)
    access_notes: list[str] = []

    while heap and n < page_cap and clock.honor(2.0):
        _, _, url, depth = heappop(heap)
        key = canonical_key(url)
        if key in seen:
            continue
        seen.add(key)
        if not same_registrable(url, seed):
            continue
        flags = trap_flags(url)
        if "facet" in flags and depth > 2:
            continue
        if depth > depth_cap:
            continue
        if not robots.allows(USER_AGENT, url):
            p = Page(id=f"p-{n+1}", url=url, final_url=url, unfetched=True, fetch_error="ROBOTS_DISALLOWED", depth=depth)
            pages.append(p)
            continue
        try:
            resp = client.request(url, method="GET")
        except HttpError as e:
            p = Page(
                id=f"p-{n+1}",
                url=url,
                final_url=url,
                unfetched=True,
                fetch_error=e.code,
                depth=depth,
                content_usable=False,
                access_kind="empty",
            )
            pages.append(p)
            if e.code in ("DNS_FAILURE", "TLS_FAILURE") and n == 0:
                snap.coverage = {
                    "pages_fetched": 0,
                    "pages_rendered": 0,
                    "stopped_reason": "unreachable",
                    "robots_status": robots.status,
                    "timeout_count": 1 if e.code == "FETCH_TIMEOUT" else 0,
                    "redirect_hops_total": 0,
                    "ssrf_blocks": 1 if e.code == "SSRF_BLOCKED" else 0,
                    "fetch_error": e.code,
                    "render_max": render_max,
                    "renders_requested": 0,
                    "renders_performed": 0,
                    "renders_skipped_budget": 0,
                    "protected_render_requests": 0,
                    "protected_render_exceptions": 0,
                }
                snap.timing.crawl_ms = (time.time() - t0) * 1000
                snap.pages = pages
                snap.limitations.append(
                    f"Temporary network/transport failure ({e.code}); origin is not scored as a content-quality gap."
                )
                return snap
            continue
        html = resp.body.decode("utf-8", errors="replace")
        ctype = resp.headers.get("content-type", "text/html")
        page = Page(
            id=f"p-{n+1}",
            url=url,
            final_url=resp.final_url,
            status=resp.status,
            redirect_hops=resp.redirect_hops,
            raw_html=html if "html" in ctype or "xml" in ctype or ctype == "" else "",
            headers=resp.headers,
            depth=depth,
            timing_ms=resp.timing_ms,
        )
        if "pdf" in ctype:
            page.headers["content-type"] = ctype
        kind = classify_http_access(
            status=resp.status,
            headers=resp.headers,
            body=html,
            content_type=ctype,
        )
        page.access_kind = kind
        page.content_usable = content_usable(kind, resp.status)
        access_counts[kind] += 1
        fill_page_from_html(page)
        if not page.content_usable:
            # Keep raw HTML for the limitation record; do not treat as brand corpus.
            page.out_links = []
            access_notes.append(
                f"{page.final_url or page.url}: HTTP {page.status} ({_ACCESS_LABEL.get(kind, kind)})"
            )
            page.template_id = clusterer.assign(page.id, page.raw_html or page.main_text)
            pages.append(page)
            n += 1
            pages_fetched += 1
            continue
        page.template_id = clusterer.assign(page.id, page.raw_html or page.main_text)
        if has_offer_price(page.main_text, page_type=page.page_type):
            k_hit.add("K6")
        if any(w in page.main_text.lower() for w in ("we are", "we help", "platform", "company")):
            k_hit.add("K3")
        rmap = rendered_map or {}
        rhtml = rmap.get(canonical_key(page.final_url)) or rmap.get(page.url)
        plan_max = render_max
        if clock.remaining() < 40:
            plan_max = min(4, render_max)
        protected = is_protected_fact_url(page.url, seed) or is_protected_fact_url(page.final_url, seed)
        renders_requested += 1
        if protected:
            protected_render_requests += 1
        # Hard cap: protected pages change priority only, never extra slots.
        do_render = render_used < plan_max
        if do_render:
            render_used += 1
        else:
            renders_skipped_budget += 1
        dt = apply_render(page, rhtml, do_render=do_render)
        render_ms += dt
        pages.append(page)
        n += 1
        pages_fetched += 1
        for href in page.out_links:
            if same_registrable(href, seed):
                graph_edges.append((page.final_url, canonical_key(href)))
                nk = canonical_key(href)
                if nk not in seen:
                    heappush(heap, (_score(href, depth + 1, nk in sitemap_set, seed), seq, href, depth + 1))
                    seq += 1

    in_deg: dict[str, int] = defaultdict(int)
    nodes = {canonical_key(p.final_url or p.url) for p in pages}
    for _src, dst in graph_edges:
        if dst in nodes:
            in_deg[dst] += 1
    home = canonical_key(seed)
    orphans = []
    for p in pages:
        if p.unfetched:
            continue
        k = canonical_key(p.final_url or p.url)
        p.in_degree = in_deg.get(k, 0)
        if p.in_degree == 0 and k != home and p.page_type not in ("home",):
            orphans.append(p.url)

    rendered_n = sum(1 for p in pages if p.render_status == "ok")
    snap.pages = pages
    snap.graph = {"nodes": len(pages), "orphans_suspected": orphans, "edges": len(graph_edges)}
    usable_n = sum(1 for p in pages if p.content_usable and not p.unfetched)
    snap.coverage = {
        "pages_fetched": sum(1 for p in pages if not p.unfetched),
        "pages_content_usable": usable_n,
        "pages_rendered": rendered_n,
        "render_count": render_used,
        "estimated_pages": max(len(sitemap_urls), len(pages)) or None,
        "templates": len(clusterer.centroids),
        "k_categories_hit": sorted(k_hit),
        "stopped_reason": "budget" if not heap else "early_stop",
        "pages_verified_per_template": {t: len(m) for t, m in clusterer.members.items()},
        "render_max": render_max,
        "renders_requested": renders_requested,
        "renders_performed": render_used,
        "renders_skipped_budget": renders_skipped_budget,
        "protected_render_requests": protected_render_requests,
        "protected_render_exceptions": 0,
        "access_kinds": dict(access_counts),
        "http_requests": getattr(client, "request_count", 0),
        "robots_status": robots.status,
        "timeout_count": sum(1 for p in pages if p.fetch_error == "FETCH_TIMEOUT"),
        "redirect_hops_total": sum(int(p.redirect_hops or 0) for p in pages),
        "ssrf_blocks": sum(1 for p in pages if p.fetch_error == "SSRF_BLOCKED"),
    }
    snap.timing.crawl_ms = (time.time() - t0) * 1000
    snap.timing.render_ms = render_ms
    snap.timing.pages_fetched = pages_fetched
    snap.timing.pages_rendered = rendered_n
    snap.timing.render_count = render_used
    snap.timing.http_requests = getattr(client, "request_count", 0)
    if access_notes:
        shown = access_notes[:6]
        snap.limitations.append(
            "Access limitation: "
            + "; ".join(shown)
            + (f" (+{len(access_notes) - 6} more)" if len(access_notes) > 6 else "")
            + ". These bodies were not used as brand/answerability evidence."
        )
    if rendered_n == 0:
        snap.limitations.append("Headless render unavailable or skipped; dual-fetch used raw HTML as rendered unless tests injected rendered_html.")
    else:
        snap.limitations.append(
            "Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). "
            "No claim is made that wall-clock stays under 5 minutes."
        )
    if renders_skipped_budget:
        snap.limitations.append(
            f"Render budget exhausted: render_max={render_max}, performed={render_used}, "
            f"skipped_budget={renders_skipped_budget}, protected_requests={protected_render_requests}. "
            "Protected categories affect fetch/render priority only; the cap is hard."
        )
    return snap
