"""SK-C crawl-access-audit."""

from __future__ import annotations

import re
import time

from lib.confidence import attach_confidence
from lib.findings import make_finding
from lib.http_client import USER_AGENT
from lib.models import CrawlSnapshot, SkillResult, SuggestedAction
from lib.robots import AI_TOKENS
from lib.url import is_locale_path_segment, trap_flags
from urllib.parse import urlparse
from urllib.robotparser import RobotFileParser


def run(snapshot: CrawlSnapshot) -> SkillResult:
    t0 = time.time()
    findings = []
    if snapshot.robots_status == "fail_closed":
        f = make_finding(
            skill_id="crawl-access-audit",
            finding_type="robots_fail_closed",
            title="robots.txt failed closed (5xx) so compliant crawlers must not fetch",
            severity="critical",
            evidence=f"robots status={snapshot.robots_status}. RFC 9309: 5xx fail-closed.",
            action=SuggestedAction(
                summary="Restore robots.txt to 2xx and valid syntax so crawlers can proceed.",
                priority="critical",
                what="Fix hosting/robots 5xx",
                where=snapshot.origins[0] + "/robots.txt" if snapshot.origins else "",
                how="Return 200 with intended Allow/Disallow groups.",
                why="Fail-closed robots make the public site invisible to compliant agents.",
                cost_tier="markup",
            ),
            urls=snapshot.origins,
            confidence="high",
            category="access",
            evidence_tier="FACT",
        )
        attach_confidence(f, deterministic=True, reproduced=True, rfc=True)
        findings.append(f)
        return SkillResult("crawl-access-audit", snapshot.run_id, findings=findings, timing_ms=(time.time() - t0) * 1000)

    if snapshot.coverage.get("stopped_reason") == "unreachable":
        f = make_finding(
            skill_id="crawl-access-audit",
            finding_type="transport_unreachable",
            title="Origin unreachable; audit incomplete",
            severity="critical",
            evidence=(
                f"Seed fetch failed before any target page was fetched "
                f"({snapshot.coverage.get('fetch_error', 'transport failure')})."
            ),
            action=SuggestedAction(
                summary="Resolve the transport failure, then rerun the audit.",
                priority="critical",
            ),
            urls=[snapshot.seed_url],
            category="access",
            evidence_tier="FACT",
        )
        attach_confidence(f, deterministic=True, reproduced=True)
        findings.append(f)

    if snapshot.coverage.get("stopped_reason") == "robots_disallow":
        f = make_finding(
            skill_id="crawl-access-audit",
            finding_type="robots_disallow",
            title="robots.txt disallows the audit crawler",
            severity="critical",
            evidence="The seed URL was not fetched because robots.txt disallows the audit crawler.",
            action=SuggestedAction(
                summary="Allow compliant crawlers on the public paths intended for AI discovery.",
                priority="critical",
            ),
            urls=[snapshot.seed_url],
            category="access",
            evidence_tier="FACT",
        )
        attach_confidence(f, deterministic=True, reproduced=True)
        findings.append(f)

    if snapshot.coverage.get("stopped_reason") == "access_blocked":
        kinds = snapshot.coverage.get("access_kinds", {})
        f = make_finding(
            skill_id="crawl-access-audit",
            finding_type="access_blocked",
            title="No usable pages were available because the origin returned an access barrier",
            severity="high",
            evidence=(
                f"pages_content_usable=0; access_kinds={kinds}. "
                "Challenge/error bodies were excluded from content analysis."
            ),
            action=SuggestedAction(
                summary="Provide a crawlable public response or rerun from an allowed audit vantage point.",
                priority="high",
            ),
            urls=[snapshot.seed_url],
            category="access",
            evidence_tier="FACT",
        )
        attach_confidence(f, deterministic=True, reproduced=True)
        findings.append(f)

    # AI tokens
    if snapshot.robots_status == "ok" and snapshot.robots_body:
        rp = RobotFileParser()
        rp.parse(snapshot.robots_body.splitlines())
        blocked = [tok for tok in AI_TOKENS if not rp.can_fetch(tok, snapshot.seed_url)]
        google_ok = rp.can_fetch("Googlebot", snapshot.seed_url)
        if blocked and google_ok:
            f = make_finding(
                skill_id="crawl-access-audit",
                finding_type="ai_token_disallow",
                title="AI crawler tokens are disallowed while Googlebot is allowed",
                severity="medium",
                evidence=f"Disallowed tokens: {', '.join(blocked)}. This may be intentional.",
                action=SuggestedAction(
                    summary="If public AI citation is desired, allow the relevant AI user-agents on citable paths; keep admin/search disallowed.",
                    priority="medium",
                    why="Token matrix documents access policy; not automatically a defect.",
                ),
                urls=[snapshot.origins[0] + "/robots.txt"],
                category="access",
            )
            attach_confidence(f, deterministic=True, reproduced=True)
            findings.append(f)

    # Orphans with coverage
    orphans = (snapshot.graph or {}).get("orphans_suspected") or []
    fetched = snapshot.coverage.get("pages_fetched") or 0
    est = snapshot.coverage.get("estimated_pages") or fetched
    cov = f"{fetched}/{est}" if est else str(fetched)
    for u in orphans[:5]:
        f = make_finding(
            skill_id="crawl-access-audit",
            finding_type="orphan",
            title="High-value URL has no inbound links in the crawled graph",
            severity="medium",
            evidence=f"0 in-edges for {u}. Coverage {cov}. Isolation may be a coverage artifact.",
            action=SuggestedAction(
                summary="Add an inbound link from a higher-centrality page to this URL.",
                where=u,
                why="Orphans are hard for crawlers to discover.",
            ),
            urls=[u],
            category="access",
            confidence="low" if fetched < 10 else "medium",
        )
        attach_confidence(f, deterministic=True, reproduced=False)
        findings.append(f)

    # Facet traps
    for p in snapshot.fetched_pages():
        if "facet" in trap_flags(p.url) and p.depth <= 2:
            f = make_finding(
                skill_id="crawl-access-audit",
                finding_type="trap_facet",
                title="Faceted URL parameters can explode crawl space",
                severity="low",
                evidence=f"Facet-like query on {p.url}",
                action=SuggestedAction(summary="Canonicalize or robots-disallow pure facet combinations if they duplicate listings."),
                urls=[p.url],
                category="access",
            )
            attach_confidence(f, deterministic=True, reproduced=False)
            findings.append(f)
            break

    # noindex × robots Disallow (self-defeating; still documents policy)
    rp_all = None
    if snapshot.robots_status == "ok" and snapshot.robots_body:
        rp_all = RobotFileParser()
        rp_all.parse(snapshot.robots_body.splitlines())
    for p in snapshot.fetched_pages():
        if "noindex" not in (p.robots_meta or "").lower():
            continue
        if rp_all is not None and not rp_all.can_fetch("Googlebot", p.final_url or p.url):
            f = make_finding(
                skill_id="crawl-access-audit",
                finding_type="noindex_robots_conflict",
                title="Page is both noindex and robots-disallowed",
                severity="medium",
                evidence=f"robots meta/X-Robots-Tag has noindex and Googlebot Disallow on {p.url}",
                action=SuggestedAction(
                    summary="Pick one control: either allow crawl with noindex, or Disallow without a noindex tag on an unfetched URL.",
                    where=p.url,
                    why="Conflicting signals waste crawl budget and confuse indexers.",
                ),
                urls=[p.url],
                category="access",
            )
            attach_confidence(f, deterministic=True, reproduced=True)
            findings.append(f)
            break

    # Soft-404: HTTP 200 with not-found language and a thin body
    _soft = re.compile(
        r"\b(404|page not found|this page (does not|doesn't) exist|we couldn't find|not found)\b",
        re.I,
    )
    for p in snapshot.fetched_pages():
        if p.status and p.status != 200:
            continue
        blob = f"{p.title} {(p.main_text or '')[:400]}"
        if _soft.search(blob) and len(p.main_text or "") < 1200:
            f = make_finding(
                skill_id="crawl-access-audit",
                finding_type="soft_404",
                title="HTTP 200 response reads like a missing page",
                severity="medium",
                evidence=f"status={p.status or 200} title={p.title!r} body_len={len(p.main_text or '')} on {p.url}",
                action=SuggestedAction(
                    summary="Return a real 404/410 for missing URLs, or replace the placeholder copy with a live page.",
                    where=p.url,
                ),
                urls=[p.url],
                category="access",
            )
            attach_confidence(f, deterministic=True, reproduced=False)
            findings.append(f)
            break

    # Near-duplicate URLs without a shared canonical
    from collections import defaultdict
    from lib.url import canonical_key, is_locale_path_segment

    by_hash: dict[int, list] = defaultdict(list)
    for p in snapshot.fetched_pages():
        if p.content_simhash:
            by_hash[p.content_simhash].append(p)
    for grp in by_hash.values():
        if len(grp) < 2:
            continue
        url_keys = {canonical_key(p.final_url or p.url) for p in grp}
        can_keys = {canonical_key(p.canonical) for p in grp if p.canonical}
        if len(url_keys) < 2:
            continue
        # Server-default variants such as /about/background and
        # /about/background/index.html represent the same path. They are not
        # duplicate-content evidence when canonical targets are absent or
        # normalize to the same directory target.
        def directory_key(url: str) -> str:
            key = canonical_key(url).rstrip("/")
            if key.endswith("/index.html"):
                return key[:-10].rstrip("/") or "/"
            if key.endswith(".html"):
                return key[:-5].rstrip("/") or "/"
            return key

        directory_urls = {directory_key(p.final_url or p.url) for p in grp}
        directory_canonicals = {directory_key(p.canonical) for p in grp if p.canonical}
        if len(directory_urls) == 1 and (not directory_canonicals or len(directory_canonicals) == 1):
            continue
        # Localized template copies (/about vs /au/about vs /by/about vs /in/pricing)
        # are legitimate country/language variants with matching canonicals, not broken duplicate pages.
        from lib.url import locale_stripped_path
        stripped_url_paths = {locale_stripped_path(p.final_url or p.url) for p in grp}
        if len(stripped_url_paths) == 1:
            base_path = next(iter(stripped_url_paths))
            # A localized copy is safe only when each source URL's canonical
            # preserves its own locale segment. A single shared canonical for
            # several locales is signal dilution, not a harmless template copy.
            def locale_segment(url: str) -> str:
                parts = [part for part in urlparse(url).path.split('/') if part]
                return parts[0].lower() if parts and is_locale_path_segment(parts[0]) else ''

            # A missing canonical remains an unknown/omitted signal for this
            # template-copy guard (the legacy behavior covered by the
            # localized-template test). A present canonical must be checked
            # per source URL below.
            if not can_keys:
                continue
            is_locale_cluster = True
            for p in grp:
                if not p.canonical or locale_stripped_path(p.canonical) != base_path:
                    is_locale_cluster = False
                    break
                if locale_segment(p.final_url or p.url) != locale_segment(p.canonical):
                    is_locale_cluster = False
                    break
            if is_locale_cluster:
                continue
        f = make_finding(
            skill_id="crawl-access-audit",
            finding_type="canonical_dup",
            title="Near-duplicate URLs do not share a single canonical",
            severity="medium",
            evidence=f"simhash cluster size={len(grp)} urls={sorted(url_keys)[:4]} canonicals={sorted(can_keys)[:4]}",
            action=SuggestedAction(
                summary="Point duplicate URLs at one canonical, or differentiate the pages.",
                where=grp[0].url,
            ),
            urls=[p.url for p in grp[:4]],
            category="access",
        )
        attach_confidence(f, deterministic=True, reproduced=False)
        findings.append(f)
        break

    n_lm = snapshot.coverage.get("sitemap_lastmod_n") or 0
    u_lm = snapshot.coverage.get("sitemap_lastmod_unique") or 0
    if n_lm >= 20 and u_lm == 1:
        f = make_finding(
            skill_id="crawl-access-audit",
            finding_type="coverage_statement",
            title="Sitemap lastmod values are identical across many URLs",
            severity="low",
            evidence=f"sitemap_lastmod_n={n_lm} unique={u_lm}. Weak freshness signal, not a missing-sitemap defect.",
            action=SuggestedAction(
                summary="Emit real lastmod (or omit it) instead of a single stamp on every URL.",
                priority="low",
            ),
            urls=snapshot.origins[:1],
            category="access",
        )
        findings.append(f)

    # Missing sitemap is NOT a finding (LOCKED FP)

    # Homepage TTFB metric only
    home = next((p for p in snapshot.pages if p.page_type == "home" or p.url.rstrip("/") == snapshot.seed_url.rstrip("/")), None)
    metrics = {"homepage_timing_ms": home.timing_ms if home else None}
    if home and home.timing_ms > 10000:
        f = make_finding(
            skill_id="crawl-access-audit",
            finding_type="coverage_statement",
            title="Homepage time-to-first-byte exceeded 10s (metric, not Lighthouse)",
            severity="low",
            evidence=f"GET timing_ms={home.timing_ms:.0f}",
            action=SuggestedAction(summary="Investigate server response time for the homepage."),
            urls=[home.url],
            category="access",
        )
        findings.append(f)

    return SkillResult("crawl-access-audit", snapshot.run_id, findings=findings, metrics=metrics, timing_ms=(time.time() - t0) * 1000)
