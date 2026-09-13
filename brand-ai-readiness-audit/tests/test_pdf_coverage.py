"""PDF architecture coverage mapped into the existing 10 skills. Generic fixtures only."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from lib.admit import admit
from lib.clock import Clock, plan_skip_ladder
from lib.crawl import crawl
from lib.findings import make_finding, reset_ids
from lib.models import SiteType, SuggestedAction
from lib.skill_c import run as run_c
from lib.skill_cit import run as run_cit
from lib.skill_d import run as run_d
from lib.skill_k import run as run_k
from lib.skill_x import run as run_x
from test_skills_orchestrator import BASE, C, HOME, NEWS, routes_for


HOME_MIN = """<!doctype html><html lang="en"><head><title>Northwind Lab</title></head>
<body><main>
<h1>Northwind Lab</h1>
<p>We are a research archive for historians.</p>
<p><a href="/gone">Gone</a> <a href="/a">A</a> <a href="/b">B</a> <a href="/pricing">P</a></p>
</main></body></html>"""

GONE = """<!doctype html><html><head>
<meta name="robots" content="noindex">
<title>Page not found</title>
</head><body><main><p>This page does not exist. 404.</p></main></body></html>"""

DUP = """<!doctype html><html><head><title>Clone</title></head><body><main>
<p>We are a research archive for historians. Identical body for canonical cluster.</p>
</main></body></html>"""

NESTED = """<!doctype html><html><head><title>Buy</title>
<script type="application/ld+json">{"@type":"Product","name":"Widget","offers":{"@type":"Offer","price":"10.00","priceCurrency":"USD"}}</script>
</head><body><main><p>Add to cart. Price $99.00</p></main></body></html>"""

PRICING_ISOLATED = """<!doctype html><html><head><title>Pricing</title></head>
<body><main><h1>Pricing</h1><p>Plans start at $12 per month.</p></main></body></html>"""

ROBOTS_GOOGLE_GONE = """User-agent: Googlebot
Disallow: /gone
User-agent: *
Allow: /
"""


def test_skip_ladder_adds_k4_k5_when_time_remains():
    tight = plan_skip_ladder(Clock.start_run(10))
    assert tight.k_ids == ["K3"]
    mid = plan_skip_ladder(Clock.start_run(100))
    assert mid.k_ids == ["K3", "K6", "K13"]
    wide = plan_skip_ladder(Clock.start_run(280))
    assert wide.k_ids == ["K3", "K4", "K5", "K6", "K13"]


def test_soft_404_and_noindex_robots_conflict():
    routes = routes_for({"/": HOME_MIN, "/gone": GONE, "/a": DUP, "/b": DUP, "/pricing": PRICING_ISOLATED}, robots=ROBOTS_GOOGLE_GONE)
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=10)
    c = run_c(snap)
    types = {f.finding_type for f in c.findings}
    assert "soft_404" in types
    assert "noindex_robots_conflict" in types
    assert "canonical_dup" in types


def test_locale_template_copies_are_not_canonical_dup():
    home = """<!doctype html><html><head><title>Lab</title></head><body><main>
    <h1>Lab</h1><p>We are a research archive for historians.
    <a href="/in/about">IN</a> <a href="/au/about">AU</a></p></main></body></html>"""
    about = """<!doctype html><html><head><title>About</title></head><body><main>
    <p>We are a research archive for historians. About copy shared across locales.</p>
    </main></body></html>"""
    snap = crawl(
        BASE + "/",
        C(routes_for({"/": home, "/in/about": about, "/au/about": about})),
        Clock.start_run(30),
        page_cap=8,
    )
    c = run_c(snap)
    assert not any(f.finding_type == "canonical_dup" for f in c.findings)


def test_nested_json_ld_offer_mismatch():
    routes = routes_for({"/": NESTED})
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=2)
    run_d(snap)
    cit = run_cit(snap)
    assert any(f.finding_type == "schema_visible_mismatch" for f in cit.findings)


def test_k5_expected_gap_on_news_cluster():
    snap = crawl(BASE + "/", C(routes_for({"/": NEWS})), Clock.start_run(30), page_cap=2)
    snap.site_type = SiteType(cluster="E")
    k = run_k(snap, question_ids=["K3", "K5"])
    assert k.metrics["per_question"].get("K5") == "expected_gap"
    assert not any(f.finding_type == "unanswerable" and "K5" in f.title for f in k.findings)


def test_k4_answered_by_audience_grammar():
    snap = crawl(BASE + "/", C(routes_for({"/": HOME})), Clock.start_run(30), page_cap=2)
    k = run_k(snap, question_ids=["K3", "K4"])
    assert k.metrics["per_question"].get("K4") == "answered"


def test_scent_break_when_pricing_unlinked_from_home():
    home = """<!doctype html><html><head><title>Acme Cloud</title></head>
<body><main><h1>Acme Cloud</h1><p>We are a workspace platform for teams.</p></main></body></html>"""
    routes = routes_for({"/": home, "/pricing": PRICING_ISOLATED})
    # Force pricing into the crawl via sitemap-like extra path: linked from a hidden extra fetch by putting it in sitemap... routes_for 404s sitemap.
    # Seed plus explicit second URL: add a footer link without commercial words.
    home2 = """<!doctype html><html><head><title>Acme Cloud</title></head>
<body><main><h1>Acme Cloud</h1><p>We are a workspace platform for teams. <a href="/pricing">More</a></p></main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": home2, "/pricing": PRICING_ISOLATED})), Clock.start_run(30), page_cap=6)
    x = run_x(snap)
    assert any(f.finding_type == "scent_break" and "Commercial page" in f.title for f in x.findings)


def test_orphan_suppressed_as_coverage_artifact():
    reset_ids()
    f = make_finding(
        skill_id="crawl-access-audit",
        finding_type="orphan",
        title="orphan",
        severity="medium",
        evidence="0 in-edges",
        action=SuggestedAction(summary="link"),
        urls=["https://site.test/deep"],
    )
    y = admit(f, SiteType(cluster="F"), coverage_pct=0.1)
    assert y.suppressed and y.suppress_reason == "U16_coverage_artifact"


def test_cart_orphan_u8():
    reset_ids()
    f = make_finding(
        skill_id="crawl-access-audit",
        finding_type="orphan",
        title="orphan",
        severity="medium",
        evidence="0 in-edges",
        action=SuggestedAction(summary="link"),
        urls=["https://site.test/cart"],
    )
    y = admit(f, SiteType(cluster="F"), coverage_pct=1.0)
    assert y.suppressed and y.suppress_reason == "U8"


def test_shopify_locale_canonical_suppression():
    """Verify that Shopify-style /about vs /au/about vs /by/about are not flagged as canonical_dup."""
    from lib.models import Page
    from lib.skill_c import run as run_c
    snap = crawl(BASE + "/", C(routes_for({"/": HOME})), Clock.start_run(30), page_cap=1)
    
    # Create 4 pages simulating Shopify's about cluster with identical simhash
    sim = 123456789
    p1 = Page(id="p1", url="https://site.test/about", final_url="https://site.test/about", status=200, content_simhash=sim, canonical="https://site.test/about")
    p2 = Page(id="p2", url="https://site.test/au/about", final_url="https://site.test/au/about", status=200, content_simhash=sim, canonical="https://site.test/au/about")
    p3 = Page(id="p3", url="https://site.test/by/about", final_url="https://site.test/by/about", status=200, content_simhash=sim, canonical="https://site.test/by/about")
    p4 = Page(id="p4", url="https://site.test/eg/about", final_url="https://site.test/eg/about", status=200, content_simhash=sim, canonical="https://site.test/eg/about")
    snap.pages = [p1, p2, p3, p4]
    
    res = run_c(snap)
    dup_findings = [f for f in res.findings if f.finding_type == "canonical_dup"]
    assert len(dup_findings) == 0, f"Expected 0 canonical_dup findings for localized cluster, got: {dup_findings}"

