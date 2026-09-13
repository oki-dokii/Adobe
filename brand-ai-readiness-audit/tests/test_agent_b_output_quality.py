"""Agent B — Output quality and capability surfacing tests (TDD)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from lib.findings import make_finding
from lib.models import Finding, SuggestedAction
from lib.business_impact import annotate, _QUESTIONS
from lib.report import render_markdown


def test_b_k7_in_questions_and_scorecard():
    assert "K7" in _QUESTIONS
    ann = annotate([], 5, per_question={"K7": "answered"})
    sc = ann["buyer_question_scorecard"]
    k7_item = next((x for x in sc["items"] if x["id"] == "K7"), None)
    assert k7_item is not None
    assert k7_item["status"] == "answered"
    assert k7_item["funnelStage"] in ("consideration", "decision")


def test_b_product_brand_gap_and_schema_only_fact_enriched():
    f1 = make_finding(
        skill_id="entity-identity-audit",
        finding_type="product_brand_gap",
        title="Product page missing brand",
        severity="medium",
        evidence="Title SuperWidget != Acme",
        action=SuggestedAction(summary="Add brand name to product page", priority="medium"),
        urls=["https://site.test/widget"],
    )
    f2 = make_finding(
        skill_id="render-extract-audit",
        finding_type="schema_only_fact",
        title="Schema price absent from text",
        severity="medium",
        evidence="JSON-LD $299 not in visible text",
        action=SuggestedAction(summary="Add price to visible text", priority="medium"),
        urls=["https://site.test/widget"],
    )
    ann = annotate([f1, f2], sampled_pages=3)
    for f in ann["findings"]:
        assert "whyAiSystemsCare" in f["businessImpact"]
        assert "potentialConsequence" in f["businessImpact"]
        assert len(f["consequenceChain"]) == 3
        assert f["businessImpact"]["businessInterpretation"] != ""


def test_b_scoring_methodology_surfaced():
    ann = annotate([], 5)
    assert "scoring_methodology" in ann
    assert "Deductions" in ann["scoring_methodology"] or "deductions" in ann["scoring_methodology"]


def test_b_markdown_surfaces_scores_scorecard_and_chains():
    report = {
        "site": "helix.test",
        "summary": {"critical": 0, "high": 1, "medium": 0, "low": 0, "total_findings": 1},
        "coverage_basis": "10 pages sampled",
        "coverage_summary": "Sampled 10 pages.",
        "overall_index": 81,
        "dimension_scores": [
            {"dimension": "discoverability", "score": 90},
            {"dimension": "understanding", "score": 81},
            {"dimension": "trust", "score": 90},
            {"dimension": "engagement", "score": 90},
        ],
        "top3PriorityActions": [
            {"finding_id": "F-001", "summary": "Allow AI bots in robots.txt", "priority": "high"}
        ],
        "buyer_question_scorecard": {
            "items": [
                {"id": "K3", "question": "What does org do?", "funnelStage": "awareness", "funnelPriority": "Low", "status": "answered"},
                {"id": "K6", "question": "Pricing?", "funnelStage": "decision", "funnelPriority": "High", "status": "unanswerable"},
            ],
            "total": 2,
            "answered": 1,
            "unanswered": 1,
            "not_run": 0,
        },
        "findings": [
            {
                "id": "F-001",
                "title": "Pricing is unanswerable",
                "severity": "high",
                "businessExposureSeverity": "high",
                "evidence": "No pricing found",
                "confidence": "high",
                "confidence_basis": "deterministic",
                "evidence_tier": "OBS",
                "suggested_action": {"summary": "Publish pricing page", "priority": "high"},
                "businessImpact": {
                    "whyAiSystemsCare": "RAG models require pricing facts to answer buyer purchase questions.",
                    "potentialConsequence": "AI assistants report pricing as unknown or recommend transparent competitors.",
                },
                "consequenceChain": [
                    "Pricing table is absent from crawled pages.",
                    "Assistant cannot ground buyer cost inquiries.",
                    "Buyer is directed to competitor with transparent pricing.",
                ],
            }
        ],
        "missingFacts": [{"id": "F-001", "title": "Pricing is unanswerable"}],
        "corroboration": "No corroboration issues detected",
    }
    md = render_markdown(report)
    assert "# Brand AI readiness audit — helix.test" in md
    assert "## Dimension scores & AI readiness index" in md
    assert "81/100" in md
    assert "## Top priority business actions" in md
    assert "## Buyer question scorecard" in md
    assert "Why AI systems care:" in md
    assert "Causal consequence chain:" in md
    assert "Pricing table is absent from crawled pages." in md
