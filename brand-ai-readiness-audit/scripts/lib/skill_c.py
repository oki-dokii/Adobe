"""SK-C crawl-access-audit."""

from __future__ import annotations

import time

from lib.confidence import attach_confidence
from lib.findings import make_finding
from lib.http import USER_AGENT
from lib.models import CrawlSnapshot, SkillResult, SuggestedAction
from lib.robots import AI_TOKENS
from lib.url import trap_flags
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
            finding_type="robots_fail_closed",
            title="Origin unreachable (DNS/TLS/transport)",
            severity="critical",
            evidence="Seed fetch failed at transport layer.",
            action=SuggestedAction(summary="Fix DNS/TLS so the origin responds to GET.", priority="critical"),
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
