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

_QUESTIONS = {
    "K3": ("What does this organization offer or do?", "awareness", "Low"),
    "K4": ("Who is the intended audience?", "consideration", "Medium"),
    "K5": ("Where is this organization based or serving?", "consideration", "Medium"),
    "K6": ("What does it cost / how is it priced?", "decision", "High"),
    "K13": ("How can a human contact the organization?", "decision", "High"),
}


def _scorecard(per_question: dict | None) -> dict:
    per_question = per_question or {}
    items = []
    for qid, (question, stage, priority) in _QUESTIONS.items():
        status = per_question.get(qid, "not_run")
        items.append({
            "id": qid,
            "question": question,
            "funnelStage": stage,
            "funnelPriority": priority,
            "status": status,
        })
    return {
        "items": items,
        "total": len(items),
        "answered": sum(1 for x in items if x["status"] == "answered"),
        "unanswered": sum(1 for x in items if x["status"] in {"unanswerable", "insufficient"}),
        "not_run": sum(1 for x in items if x["status"] == "not_run"),
    }


def _business_impact(f: Finding, exposure: str, reach: str, sampled: int) -> dict:
    confirmed = max(0, int(f.affected_pages_count or 0))
    return {
        "technicalFinding": f.title,
        "businessInterpretation": "This observed structural condition can reduce how reliably automated systems discover, understand, trust, or hand off from the site.",
        "whyAiSystemsCare": "The finding changes the public evidence available to a retrieval or answer-generation system.",
        "whoIsAffected": "People whose discovery or evaluation depends on an AI-mediated answer from this site.",
        "potentialConsequence": "The affected information may be omitted, qualified, or harder to connect to the intended next action.",
        "categories": ["discoverability"],
        "quantifiedImpact": f"Confirmed on {confirmed} sampled page(s); sampled-page count={sampled}. No revenue estimate is made.",
        "assumptions": ["This is a mechanism-level interpretation; no live assistant query was performed."],
        "expectedOutcomeAfterFix": "The relevant first-party evidence should be easier for compliant retrieval and handoff systems to use.",
        "reachTier": reach,
        "businessExposureSeverity": exposure,
    }


def _consequence_chain(f: Finding) -> list[str]:
    return [
        f"Observed structural condition: {f.title}.",
        "This condition may reduce the completeness or reliability of the evidence available to a retrieval system.",
        "A downstream answer may therefore need qualification, another source, or a different handoff path.",
    ]

def _exposure(f: Finding, sampled: int) -> str:
    # qualifier_split is heuristic extractability evidence. Even when it
    # affects a shared template, it cannot establish Critical business
    # exposure without independent corroboration of a real offer defect.
    if f.finding_type == "qualifier_split":
        return "high"
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

def annotate(findings: list[Finding], sampled_pages: int, per_question: dict | None = None) -> dict:
    """Return report extras using only canonical findings and existing severity data."""
    dimensions = ("discoverability", "understanding", "trust", "engagement")
    scored = {d: 90 for d in dimensions}
    deductions = {"critical": 14, "high": 9, "medium": 5, "low": 2}
    enriched = []
    for f in findings:
        dimension = _DIMENSION.get(f.skill_id, "understanding")
        exposure = _exposure(f, sampled_pages)
        ratio = f.affected_pages_count / max(sampled_pages, 1)
        reach = "Broad" if f.finding_type in {"robots_fail_closed", "ai_token_disallow"} or ratio >= .5 else ("Cluster" if ratio >= .1 or f.affected_pages_count > 1 else "Isolated")
        f.metrics["businessExposureSeverity"] = exposure
        f.metrics["dimension"] = dimension
        scored[dimension] -= deductions.get(f.severity, 5)
        enriched.append({"id": f.id, "finding_type": f.finding_type, "finding_key": f.finding_key,
                         "title": f.title, "severity": f.severity, "businessExposureSeverity": exposure,
                         "evidence": f.evidence, "suggested_action": f.suggested_action.to_public(),
                         "confidence": f.confidence, "affected_pages": f.affected_pages_count,
                         "sampled_pages": sampled_pages, "blast_radius": {
                             "reach_tier": reach, "affected_pages": f.affected_pages_count,
                             "sampled_pages": sampled_pages, "confirmed": True,
                             "text": f"Confirmed on {f.affected_pages_count} of {sampled_pages} sampled page(s); no site-wide extrapolation asserted."
                         }, "funnelStage": "decision" if str(f.metrics.get("question_id", "")).upper() in {"K6", "K13"} or f.finding_type in _DECISION else ("consideration" if f.finding_type in _CONSIDERATION else "awareness"),
                         "consequenceChain": _consequence_chain(f),
                         "businessImpact": _business_impact(f, exposure, reach, sampled_pages),
                         "buyerQuestionScorecard": _scorecard(per_question)})
    dimension_scores = [{"dimension": d, "score": max(15, min(96, scored[d]))} for d in dimensions]
    overall_index = round(sum(x["score"] for x in dimension_scores) / len(dimension_scores))
    top = sorted(enriched, key=lambda x: ({"critical": 4, "high": 3, "medium": 2, "low": 1}[x["businessExposureSeverity"]], {"critical": 4, "high": 3, "medium": 2, "low": 1}[x["severity"]]), reverse=True)[:3]
    return {"findings": enriched, "dimension_scores": dimension_scores, "overall_index": overall_index,
            "top3PriorityActions": [{"finding_id": x["id"], "summary": x["suggested_action"]["summary"], "priority": x["suggested_action"]["priority"]} for x in top],
            "buyer_question_scorecard": _scorecard(per_question)}
