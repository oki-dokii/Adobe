"""Test suite for the 100/100 hardening improvements:
1. to_handout() preserves rich action fields (what, where, how, why, cost_tier) + evidence_summary.
2. orchestrator.run_audit default render_max aligned to skip-ladder default (10).
3. business_impact.run() provides a callable skill entrypoint returning SkillResult.
4. skill_ent meta-description passive disambiguator suppresses false-positive collision risk.
5. skill_k compact coverage evidence string.
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from fake_http import make_opener
from lib.clock import Clock
from lib.crawl import crawl
from lib.findings import make_finding
from lib.models import CrawlSnapshot, Finding, SkillResult, SuggestedAction
from lib.orchestrator import run_audit
from lib.business_impact import run as run_bil
from lib.skill_ent import run as run_ent
from lib.skill_k import run as run_k
from test_skills_orchestrator import BASE, C, HOME, routes_for


def test_to_handout_preserves_rich_action_fields_and_evidence_summary():
    sa = SuggestedAction(
        summary="Add semantic product schema",
        priority="high",
        what="Product JSON-LD schema with pricing and availability",
        where="/products/widget",
        how="Inject schema script tag in head",
        why="Enables direct extraction by AI search engines",
        cost_tier="low",
    )
    finding = make_finding(
        skill_id="citation-extractability-audit",
        finding_type="table_no_th",
        title="Product comparison table lacks header markup",
        severity="high",
        evidence="Found <table> on /pricing without <th> elements, preventing reliable cell-to-header association by LLM parsers.",
        action=sa,
        urls=["https://example.com/pricing"],
    )

    handout = finding.to_handout()
    assert handout["evidence_summary"].startswith("Found <table> on /pricing without <th> elements")
    assert "suggested_action" in handout
    act = handout["suggested_action"]
    assert act["summary"] == "Add semantic product schema"
    assert act["priority"] == "high"
    assert act["what"] == "Product JSON-LD schema with pricing and availability"
    assert act["where"] == "/products/widget"
    assert act["how"] == "Inject schema script tag in head"
    assert act["why"] == "Enables direct extraction by AI search engines"
    assert act["cost_tier"] == "low"


def test_to_handout_dict_action_rich_fields():
    finding = make_finding(
        skill_id="citation-extractability-audit",
        finding_type="table_no_th",
        title="Product comparison table lacks header markup",
        severity="medium",
        evidence="Short evidence",
        action={
            "summary": "Fix table headers",
            "priority": "medium",
            "where": "/pricing",
            "why": "Table readability",
        },
        urls=["https://example.com/pricing"],
    )
    handout = finding.to_handout()
    assert handout["evidence_summary"] == "Short evidence"
    assert handout["suggested_action"]["where"] == "/pricing"
    assert handout["suggested_action"]["why"] == "Table readability"


def test_orchestrator_default_render_max():
    import inspect
    sig = inspect.signature(run_audit)
    assert sig.parameters["render_max"].default == 10


def test_business_impact_callable_entrypoint():
    snap = CrawlSnapshot(run_id="run-test", seed_url="https://example.com/", origins=["https://example.com"])
    res = run_bil(snap, user_findings=[], sampled_pages=1)
    assert isinstance(res, SkillResult)
    assert res.skill_id == "business-impact-layer"
    assert "dimension_scores" in res.metrics
    assert "overall_index" in res.metrics


def test_skill_ent_meta_description_disambiguates_collision():
    # Common token "Apex" but with a substantial meta description
    html = """<!doctype html><html><head>
    <title>Apex</title>
    <meta name="description" content="Apex is an open-source analytics and observability platform for modern teams.">
    </head><body><main><p>Welcome to the site.</p></main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": html})), Clock.start_run(30), page_cap=2)
    ent_res = run_ent(snap)
    # The meta description acts as a passive disambiguator, suppressing false collision risk
    assert not any(f.finding_type == "collision_risk" for f in ent_res.findings)


def test_skill_k_compact_coverage():
    html = """<!doctype html><html><head><title>Acme</title></head><body><main><p>Hello world</p></main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": html})), Clock.start_run(30), page_cap=2)
    snap.coverage = {
        "pages_fetched": 2,
        "pages_rendered": 1,
        "huge_internal_field": [i for i in range(100)],
    }
    k_res = run_k(snap)
    unanswerable = [f for f in k_res.findings if f.finding_type == "unanswerable"]
    assert len(unanswerable) > 0
    for f in unanswerable:
        # Check that huge internal dict is not dumped raw
        assert "huge_internal_field" not in f.evidence
        assert "pages_fetched=2" in f.evidence
