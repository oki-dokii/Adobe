"""SK-I freshness + on-site typed fact conflicts."""

from __future__ import annotations

import re
import time
from collections import defaultdict
from datetime import datetime, timezone
from urllib.parse import urlparse

from lib.confidence import attach_confidence
from lib.facts import extract_facts, material
from lib.findings import make_finding
from lib.models import CrawlSnapshot, SkillResult, SuggestedAction
from lib.url import is_locale_path_segment


def _canonical_price_path(url: str) -> str:
    """Strip a leading BCP-47 locale segment so /en-au/pricing ≡ /pricing."""
    parts = [p for p in (urlparse(url).path or "/").split("/") if p]
    if parts and re.fullmatch(r"[a-z]{2}(?:-[a-z]{2})?", parts[0], re.I):
        parts = parts[1:]
    return "/" + "/".join(parts)


def _year_ints(values: list[str]) -> list[int]:
    out: list[int] = []
    for x in values or []:
        s = (x or "").strip()
        if len(s) >= 4 and s[:4].isdigit():
            y = int(s[:4])
            # Pre-1990 years are historical/epoch, not freshness claims.
            if y >= 1990:
                out.append(y)
    return out


def date_signals_diverge(
    visible: list[str],
    schema: list[str],
    *,
    page_type: str = "",
    footer: list[str] | None = None,
    localized: bool = False,
    now_year: int | None = None,
) -> bool:
    """True only for stale metadata vs current claims — not history pages or newer CMS stamps."""
    if page_type in ("article", "docs") or localized:
        return False
    vis = _year_ints(visible)
    sch = _year_ints(schema)
    if not vis or not sch:
        return False
    # Copyright/footer years are presentation chrome, not evidence that the
    # page's substantive content is stale. Require a non-footer visible year.
    footer_years = _year_ints(footer or [])
    substantive = [y for y in vis if y not in footer_years]
    if not substantive:
        return False
    # Many years on one page → historical / CMS corpus, not a freshness defect.
    if max(vis) - min(vis) >= 4:
        return False
    schema_year = max(sch)
    vis_max = max(substantive)
    year = now_year if now_year is not None else datetime.now(timezone.utc).year
    if schema_year >= vis_max:
        return False
    if vis_max >= year - 1 and schema_year <= vis_max - 2:
        return True
    return False


def _is_true_price_conflict(scoped_facts: list, snapshot: CrawlSnapshot) -> bool:
    urls = [g.url for g in scoped_facts]
    path_keys = {_canonical_price_path(u) for u in urls}
    if len(path_keys) < 2:
        return False
    # If e-commerce site or multiple product paths (e.g. /products/sku1 vs /products/sku2), prices naturally differ
    if snapshot.site_type and (snapshot.site_type.ecommerce or snapshot.site_type.cluster == "C"):
        return False
    if any("/product" in u.lower() or "/item" in u.lower() for u in urls):
        return False

    # If any page has an explicit historical date (e.g. past press release / old news), it's a conflict
    now_year = datetime.now(timezone.utc).year
    has_historical_page = False
    for g in scoped_facts:
        pg = snapshot.page_by_url(g.url)
        if pg:
            schema_years = _year_ints(pg.dates.get("schema") or [])
            if any(y <= now_year - 2 for y in schema_years):
                has_historical_page = True
                break
            url_l = pg.url.lower()
            if any(k in url_l for k in ("/press", "/news", "/blog", "/archive", "/changelog", "/releases")):
                vis_years = _year_ints(pg.dates.get("visible") or [])
                if any(y <= now_year - 2 for y in vis_years):
                    has_historical_page = True
                    break
    if has_historical_page:
        return True
    # If pages are home vs pricing claiming conflicting single prices
    types = {snapshot.page_by_url(g.url).page_type for g in scoped_facts if snapshot.page_by_url(g.url)}
    if "home" in types and "pricing" in types:
        home_prices = {g.value for g in scoped_facts if snapshot.page_by_url(g.url) and snapshot.page_by_url(g.url).page_type == "home"}
        pricing_prices = {g.value for g in scoped_facts if snapshot.page_by_url(g.url) and snapshot.page_by_url(g.url).page_type == "pricing"}
        if len(home_prices) == 1 and len(pricing_prices) == 1 and home_prices != pricing_prices:
            return True
    return False


def run(snapshot: CrawlSnapshot) -> SkillResult:
    t0 = time.time()
    findings = []
    facts = extract_facts(snapshot.fetched_pages())
    snapshot.facts = facts
    docs = snapshot.site_type.cluster == "D" or "D" in snapshot.site_type.secondary

    for p in snapshot.fetched_pages():
        vis = p.dates.get("visible") or []
        schema = p.dates.get("schema") or []
        path_parts = [part for part in (urlparse(p.final_url or p.url).path or "/").split("/") if part]
        localized = bool(path_parts and is_locale_path_segment(path_parts[0]))
        if schema and vis and not docs and date_signals_diverge(
            vis,
            schema,
            page_type=p.page_type,
            footer=p.dates.get("footer") or [],
            localized=localized,
        ):
            f = make_finding(
                skill_id="freshness-audit",
                finding_type="date_divergence",
                title="Date signals disagree across visible text and metadata",
                severity="medium",
                evidence=f"visible years={vis[:4]} schema={schema[:3]} on {p.url}",
                action=SuggestedAction(
                    summary="Align dateModified/visible dates or drop fake update stamps.",
                    where=p.url,
                    why="Staleness is about fact change, not age-only (U7).",
                ),
                urls=[p.url],
                category="freshness",
            )
            attach_confidence(f, deterministic=True, reproduced=False)
            findings.append(f)

    by_type: dict[str, list] = defaultdict(list)
    for fact in facts:
        if material(fact):
            by_type[fact.type].append(fact)
    for typ, group in by_type.items():
        if typ != "price":
            continue
        scoped = []
        for g in group:
            pg = snapshot.page_by_url(g.url)
            if pg is None or pg.page_type in ("pricing", "product", "home", "article"):
                scoped.append(g)
        if not scoped:
            continue
        vals = {(g.value, g.url) for g in scoped}
        uniq = {v for v, _ in vals}
        urls = [g.url for g in scoped]
        path_keys = {_canonical_price_path(u) for u in urls}
        # Same path after locale-strip = one catalog, not two competing prices.
        if len(uniq) >= 2 and len(set(urls)) >= 2 and len(path_keys) >= 2 and _is_true_price_conflict(scoped, snapshot):
            f = make_finding(
                skill_id="freshness-audit",
                finding_type="on_site_fact_conflict",
                title="On-site typed facts disagree (prices)",
                severity="high",
                evidence=f"values={sorted(uniq)[:6]} urls={urls[:4]}",
                action=SuggestedAction(
                    summary="Reconcile current prices and mark superseded pages (e.g. old press) as historical.",
                    why="Internal knowledge conflict; this is not an off-site corroboration finding.",
                ),
                urls=list(dict.fromkeys(urls))[:5],
                category="freshness",
            )
            attach_confidence(f, deterministic=True, reproduced=len(set(urls)) >= 2)
            findings.append(f)
    return SkillResult("freshness-audit", snapshot.run_id, findings=findings, metrics={"facts": len(facts)}, timing_ms=(time.time() - t0) * 1000)
