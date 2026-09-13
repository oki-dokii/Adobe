"""Business-impact presentation layer, ported from frontend/lib/audit/business-impact.ts.

It only annotates findings already produced by the detection engine; it never
creates findings or estimates commercial loss.
"""
from __future__ import annotations

from lib.models import Finding

_DIMENSION = {
    "crawl-access-audit": "discoverability", "render-extract-audit": "discoverability",
    "site-type-classifier": "understanding", "citation-extractability-audit": "understanding",
    "ai-answerability-audit": "understanding", "entity-identity-audit": "trust",
    "freshness-audit": "trust", "corroboration-consistency-audit": "trust",
    "engagement-handoff-audit": "engagement",
}
_DECISION = {"qualifier_split", "on_site_fact_conflict", "interaction_insert", "scent_break", "sttf_fail", "table_no_th"}
_CONSIDERATION = {"js_fact_lock", "d41_hidden", "pdf_only_fact", "image_locked_fact", "date_divergence", "linked_contradiction", "comparison_self_win", "flagship_gap", "expected_gap", "uncorroborated"}

def _exposure(f: Finding, sampled: int) -> str:
    question = str(f.metrics.get("question_id", "")).upper()
    if question in {"K6", "K13"} or f.finding_type in _DECISION:
        priority = "high"
    elif question in {"K4", "K5"} or f.finding_type in _CONSIDERATION:
        priority = "medium"
    else:
        priority = "low"
    broad = f.finding_type in {"robots_fail_closed", "ai_token_disallow"} or f.affected_pages_count / max(sampled, 1) >= .5
    cluster = not broad and (f.affected_pages_count > 1 or f.affected_pages_count / max(sampled, 1) >= .1)
    if priority == "high": return "critical" if broad or cluster else "high"
    if priority == "medium": return "high" if broad or cluster else "medium"
    return "medium" if broad else "low"

def annotate(findings: list[Finding], sampled_pages: int) -> dict:
    """Return report extras using only canonical findings and existing severity data."""
    dimensions = ("discoverability", "understanding", "trust", "engagement")
    scored = {d: 90 for d in dimensions}
    deductions = {"critical": 14, "high": 9, "medium": 5, "low": 2}
    enriched = []
    for f in findings:
        dimension = _DIMENSION.get(f.skill_id, "understanding")
        exposure = _exposure(f, sampled_pages)
        f.metrics["businessExposureSeverity"] = exposure
        f.metrics["dimension"] = dimension
        scored[dimension] -= deductions.get(f.severity, 5)
        enriched.append({"id": f.id, "finding_type": f.finding_type, "finding_key": f.finding_key,
                         "title": f.title, "severity": f.severity, "businessExposureSeverity": exposure,
                         "evidence": f.evidence, "suggested_action": f.suggested_action.to_public(),
                         "confidence": f.confidence})
    dimension_scores = [{"dimension": d, "score": max(15, min(96, scored[d]))} for d in dimensions]
    overall_index = round(sum(x["score"] for x in dimension_scores) / len(dimension_scores))
    top = sorted(enriched, key=lambda x: ({"critical": 4, "high": 3, "medium": 2, "low": 1}[x["businessExposureSeverity"]], {"critical": 4, "high": 3, "medium": 2, "low": 1}[x["severity"]]), reverse=True)[:3]
    return {"findings": enriched, "dimension_scores": dimension_scores, "overall_index": overall_index,
            "top3PriorityActions": [{"finding_id": x["id"], "summary": x["suggested_action"]["summary"], "priority": x["suggested_action"]["priority"]} for x in top]}
