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


def test_k3_tagline_grammar_and_meta_fallback():
    from lib.skill_k import k3_span
    # Tagline grammar without "we are a"
    assert k3_span("Acme builds tools for developers to automate testing.") is not None
    assert k3_span("Design suite crafted for creators and engineers.") is not None
    assert k3_span("Everything you need to deploy modern applications.") is not None
    # Main text is visual-only, but meta description has the identity
    meta = "Apex provides high-performance telemetry infrastructure for cloud native systems."
    assert k3_span("Welcome. Explore art.", meta_desc=meta) is not None


def test_skill_v_json_ld_schema_voting():
    from lib.skill_v import run as run_v
    html = """<!doctype html><html><head>
    <title>ToolHub</title>
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"SoftwareApplication","name":"ToolHub"}</script>
    </head><body><main><p>Welcome to our application.</p></main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": html})), Clock.start_run(30), page_cap=2)
    v_res = run_v(snap)
    assert snap.site_type.cluster == "F"
    assert snap.site_type.saas is True


def test_render_nextjs_hydration_expansion():
    from lib.render import expand_noscript
    html = """<html><body><div id="__next"></div><script id="__NEXT_DATA__" type="application/json">{"props":{"pageProps":{"description":"NextGen observability platform","tier":"Enterprise $99"}}}</script></body></html>"""
    expanded = expand_noscript(html)
    assert "dual-fetch-hydration" in expanded
    assert "NextGen observability platform" in expanded


def test_action_snippets_how_populated():
    from lib.skill_cit import run as run_cit
    table_html = """<html><body><main><table><tr><td>Plan</td><td>Price</td></tr><tr><td>Pro</td><td>$29</td></tr></table></main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": table_html})), Clock.start_run(30), page_cap=2)
    cit_res = run_cit(snap)
    tbl_findings = [f for f in cit_res.findings if f.finding_type == "table_no_th"]
    assert len(tbl_findings) > 0
    assert "scope='col'" in tbl_findings[0].suggested_action.how


def test_bare_domain_auto_healing():
    report = run_audit("example.org", client=C(routes_for({"/": HOME})), max_seconds=30, page_cap=2)
    assert report["site"] == "example.org"
    assert report["run_id"] is not None


def test_finding_to_handout_and_enriched_metadata():
    from lib.business_impact import annotate
    action = SuggestedAction(summary="Fix robots", priority="critical")
    f1 = make_finding(
        skill_id="crawl-access-audit",
        finding_type="robots_fail_closed",
        title="Robots fail closed",
        severity="critical",
        evidence="robots.txt 500 error",
        action=action,
        urls=["https://example.com/robots.txt"],
        confidence="high",
        confidence_basis="http_status_code",
        evidence_tier="OBS",
        contributing_skills=["crawl-access-audit"],
    )
    handout = f1.to_handout(coverage_basis="5 of 10 pages")
    assert handout["confidence_basis"] == "http_status_code"
    assert handout["evidence_tier"] == "OBS"
    assert handout["contributing_skills"] == ["crawl-access-audit"]
    assert handout["coverage_basis"] == "5 of 10 pages"

    ann = annotate([f1], sampled_pages=5)
    enriched = ann["findings"][0]
    assert enriched["confidence_basis"] == "http_status_code"
    assert enriched["evidence_tier"] == "OBS"
    assert enriched["contributing_skills"] == ["crawl-access-audit"]
    assert "consequenceChain" in enriched
    assert len(enriched["consequenceChain"]) == 3
    assert "businessImpact" in enriched


def test_distinct_consequence_chains_across_finding_types():
    from lib.business_impact import annotate
    types_to_test = ["robots_fail_closed", "table_no_th", "unanswerable", "stale_copyright", "collision_risk"]
    findings = [
        make_finding(
            skill_id="test",
            finding_type=ft,
            title=f"Finding for {ft}",
            severity="high",
            evidence=f"Evidence for {ft}",
            action=SuggestedAction(summary=f"Fix {ft}", priority="high"),
            urls=["https://example.com/test"],
        )
        for ft in types_to_test
    ]
    ann = annotate(findings, sampled_pages=5)
    chains = [tuple(f["consequenceChain"]) for f in ann["findings"]]
    interpretations = [f["businessImpact"]["businessInterpretation"] for f in ann["findings"]]
    consequences = [f["businessImpact"]["potentialConsequence"] for f in ann["findings"]]
    # All consequence chains must be pairwise distinct
    assert len(set(chains)) == len(types_to_test)
    # All business interpretations must be pairwise distinct
    assert len(set(interpretations)) == len(types_to_test)
    # All potential consequences must be pairwise distinct
    assert len(set(consequences)) == len(types_to_test)


def test_markdown_opening_bluf_coverage_basis_and_top_finding():
    from lib.report import render_markdown
    report = {
        "site": "example.com",
        "summary": {"critical": 1, "high": 0, "medium": 1, "low": 0, "total_findings": 2},
        "coverage_basis": "5 of ~50 estimated pages sampled (10% coverage)",
        "coverage_summary": "Sampled 5 pages.",
        "findings": [
            {
                "id": "F-001",
                "title": "Robots disallows AI bots",
                "severity": "critical",
                "evidence": "Disallow: / on GPTBot",
                "suggested_action": {"summary": "Allow GPTBot in robots.txt", "priority": "critical"},
                "confidence": 0.99,
                "confidence_basis": "deterministic",
                "evidence_tier": "OBS",
                "contributing_skills": ["crawl-access-audit"],
                "coverage_basis": "5 of ~50 estimated pages sampled (10% coverage)",
            },
            {
                "id": "F-002",
                "title": "Missing meta description",
                "severity": "medium",
                "evidence": "No meta desc found",
                "suggested_action": {"summary": "Add meta description", "priority": "medium"},
                "confidence": 0.90,
                "confidence_basis": "deterministic",
                "evidence_tier": "OBS",
            },
        ],
    }
    md = render_markdown(report)
    lines = md.splitlines()
    assert lines[0] == "# Brand AI readiness audit — example.com"
    bluf = lines[2]
    assert "example.com audit:" in bluf
    assert "Checked crawl access, machine readability" in bluf
    assert "5 of ~50 estimated pages sampled (10% coverage)" in bluf
    assert "Top priority: [F-001] Robots disallows AI bots (CRITICAL)" in bluf
    assert "**Coverage Basis**:" in md
    assert "**Primary Finding**:" in md


def test_k_answerability_pattern_coverage_and_disclosure():
    from lib.skill_k import _find_span, QUESTIONS, k6_is_expected_gap, run as run_k
    from lib.models import SiteType, CrawlSnapshot, Page
    # 1. K4 pattern matches expanded audience terms
    k4_pats = next(q["pats"] for q in QUESTIONS if q["id"] == "K4")
    assert _find_span("We have activities designed for kids and families.", k4_pats) is not None
    assert _find_span("Educational resources for educators across the district.", k4_pats) is not None
    assert _find_span("Tax preparation assistance for taxpayers and individuals.", k4_pats) is not None

    # 2. K5 pattern matches geographic jurisdiction terms
    k5_pats = next(q["pats"] for q in QUESTIONS if q["id"] == "K5")
    assert _find_span("Official government organization in the United States.", k5_pats) is not None
    assert _find_span("Nonprofit serving the United States and Canada.", k5_pats) is not None

    # 3. K6 is expected gap for Cluster B (charities/directories)
    st_b = SiteType(cluster="B")
    assert k6_is_expected_gap(st_b) is True

    # 4. Confidence basis disclosure on unanswerable findings
    snap = CrawlSnapshot(run_id="run-k", seed_url="https://example.com/", origins=["https://example.com"])
    snap.pages.append(Page(
        id="p1",
        url="https://example.com/",
        final_url="https://example.com/",
        status=200,
        raw_html="<html><body><main><p>Short text.</p></main></body></html>",
        main_text="Short text.",
        page_type="home",
    ))
    res = run_k(snap, question_ids=["K3"])
    unans = [f for f in res.findings if f.finding_type == "unanswerable"]
    assert len(unans) > 0
    assert "deterministic keyword/pattern matching" in unans[0].confidence_basis


def test_table_no_th_exposure_capped():
    from lib.business_impact import annotate
    f = make_finding(
        skill_id="citation-extractability-audit",
        finding_type="table_no_th",
        title="Data table lacks header cells",
        severity="medium",
        evidence="table has_th=false",
        action=SuggestedAction(summary="Add th", priority="medium"),
        urls=["https://example.com/pricing", "https://example.com/features"],
    )
    res = annotate([f], sampled_pages=2)
    # Business exposure should be high, never critical, for a markup defect
    assert res["findings"][0]["businessExposureSeverity"] == "high"



