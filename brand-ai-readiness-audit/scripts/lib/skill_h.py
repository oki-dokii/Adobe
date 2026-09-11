"""SK-H linked off-site only. No search API. Absence of sameAs is not a defect."""

from __future__ import annotations

import time

from lib.confidence import attach_confidence
from lib.extract import parse_html
from lib.facts import compare_claim_against_source, extract_facts, material
from lib.findings import make_finding
from lib.http import HttpClient, HttpError
from lib.models import CrawlSnapshot, SkillResult, SuggestedAction
from lib.robots import fetch_robots
from lib.sanitize import wrap_as_data
from lib.url import same_registrable


def _source_kind(url: str) -> str:
    u = url.lower()
    if "wikipedia.org" in u:
        return "wikipedia_infobox"
    if any(x in u for x in ("linkedin", "twitter", "facebook", "instagram")):
        return "company_profile"
    if "wikidata.org" in u:
        return "wikidata"
    return "other"


def run(snapshot: CrawlSnapshot, client: HttpClient | None = None, max_gets: int = 5) -> SkillResult:
    t0 = time.time()
    findings = []
    ext_ms = 0.0
    same_as: list[str] = []
    for p in snapshot.fetched_pages():
        same_as.extend(parse_html(p.raw_html, p.url)["same_as"])
    same_as = [u for u in dict.fromkeys(same_as) if u.startswith("http") and not same_registrable(u, snapshot.seed_url)][:max_gets]

    site_facts = [f for f in (snapshot.facts or extract_facts(snapshot.fetched_pages())) if material(f)]
    outcomes: list[str] = []
    fetched = 0
    external_requests = 0
    statuses: dict[str, str] = {}

    if not same_as:
        # A. no linked corroboration — metrics only; not a user-facing defect
        res = SkillResult(
            "corroboration-consistency-audit",
            snapshot.run_id,
            findings=[],
            metrics={
                "third_party_fetched": 0,
                "corroboration_status": "none",
                "linked_sources": [],
                "outcomes": ["A_no_linked_corroboration"],
            },
            timing_ms=(time.time() - t0) * 1000,
        )
        snapshot.timing.external_fetch_ms += ext_ms
        return res

    if client is None:
        snapshot.limitations.append("H skipped extra GETs (no client).")
        return SkillResult(
            "corroboration-consistency-audit",
            snapshot.run_id,
            status="partial",
            findings=[],
            metrics={"corroboration_status": "unusable", "outcomes": ["E_linked_source_unusable"]},
            timing_ms=(time.time() - t0) * 1000,
        )

    for u in same_as:
        kind = _source_kind(u)
        try:
            pol = fetch_robots(client, u)
            external_requests += 1
            if not pol.allows("BrandAIReadinessAudit/1.0", u):
                snapshot.errors.append({"code": "ROBOTS_DISALLOWED", "url": u})
                statuses[u] = "unusable"
                outcomes.append("E_linked_source_unusable")
                continue
            t1 = time.time()
            resp = client.request(u, method="GET")
            external_requests += 1
            ext_ms += (time.time() - t1) * 1000
            fetched += 1
            if resp.status >= 400:
                statuses[u] = "unusable"
                outcomes.append("E_linked_source_unusable")
                continue
            raw_text = resp.body.decode("utf-8", errors="replace")
            wrap_as_data(raw_text[:50000])  # delimiter wrap retained for any future LLM
            text = parse_html(raw_text, u)["main_text"]
            if not (text or "").strip():
                statuses[u] = "unusable"
                outcomes.append("E_linked_source_unusable")
                continue
            page_had_comparable = False
            for fact in site_facts:
                cmp = compare_claim_against_source(
                    fact.value,
                    text,
                    source_kind=kind,
                    site_as_of=fact.as_of,
                    claim_type=fact.type,
                )
                st = cmp.get("status")
                if st == "insufficient":
                    outcomes.append("F_insufficient_evidence")
                    continue
                if st == "empty":
                    continue
                page_had_comparable = True
                if st == "agree":
                    statuses[u] = "agree"
                    outcomes.append("B_linked_corroboration_agrees")
                    continue
                if st in ("contradict", "stale"):
                    statuses[u] = st
                    outcomes.append("D_linked_source_stale" if st == "stale" else "C_linked_corroboration_contradicts")
                    sev = "medium" if st == "stale" else "high"
                    f = make_finding(
                        skill_id="corroboration-consistency-audit",
                        finding_type="linked_contradiction",
                        title="Linked third-party source contradicts an on-site material claim"
                        if st == "contradict"
                        else "Linked third-party source looks stale relative to the on-site claim",
                        severity=sev,
                        evidence=(
                            f"claim={fact.type}:{fact.value}; source={u}; conflicting_source={u}; "
                            f"extracted_site={cmp.get('extracted_site', [fact.value])}; "
                            f"extracted_source={cmp.get('extracted_source')}; "
                            f"urls={fact.url} vs {u}; comparison_basis={cmp.get('comparison_basis')}; "
                            f"confidence_directionality={cmp.get('directionality')}; note={cmp.get('note')}"
                        ),
                        action=SuggestedAction(
                            summary="Align the stale side after checking which record is current; do not assume the brand page is automatically true.",
                            where=u,
                            why="H-02: citation impact of the contradiction is unproven; the factual mismatch is observed.",
                        ),
                        urls=[fact.url, u],
                        category="corroboration",
                        evidence_tier="HYP",
                    )
                    f.metrics.update(
                        {
                            "claim": f"{fact.type}:{fact.value}",
                            "source": fact.url,
                            "conflicting_source": u,
                            "extracted_values": {
                                "site": cmp.get("extracted_site", [fact.value]),
                                "linked": cmp.get("extracted_source"),
                            },
                            "comparison_basis": cmp.get("comparison_basis"),
                            "confidence": "medium",
                            "corroboration_status": st,
                        },
                    )
                    attach_confidence(f, deterministic=True, reproduced=False)
                    f.confidence = "medium"
                    f.confidence_basis = f"linked GET + compare_claim_against_source ({cmp.get('comparison_basis')})"
                    findings.append(f)
            if not page_had_comparable and statuses.get(u) not in ("agree", "contradict", "stale"):
                statuses[u] = "insufficient"
                outcomes.append("F_insufficient_evidence")
        except HttpError as e:
            snapshot.errors.append({"code": e.code, "url": u})
            statuses[u] = "unusable"
            outcomes.append("E_linked_source_unusable")

    snapshot.timing.external_fetch_ms += ext_ms
    snapshot.timing.external_requests += external_requests
    unique_outcomes = list(dict.fromkeys(outcomes))
    if any(o.startswith("C_") for o in unique_outcomes):
        overall = "contradict"
    elif any(o.startswith("D_") for o in unique_outcomes):
        overall = "stale"
    elif any(o.startswith("B_") for o in unique_outcomes):
        overall = "agree"
    elif any(o.startswith("E_") for o in unique_outcomes):
        overall = "unusable"
    elif unique_outcomes:
        overall = "insufficient"
    else:
        overall = "insufficient"

    return SkillResult(
        "corroboration-consistency-audit",
        snapshot.run_id,
        findings=findings,
        metrics={
            "third_party_fetched": fetched,
            "linked_sources": same_as,
            "corroboration_status": overall,
            "per_source": statuses,
            "outcomes": unique_outcomes,
            "external_requests": external_requests,
        },
        timing_ms=(time.time() - t0) * 1000,
    )
