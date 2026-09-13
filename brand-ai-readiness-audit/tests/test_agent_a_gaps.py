"""Agent A — Research-gap tests (TDD: written before implementation)."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from fake_http import make_opener, public_resolve
from lib.clock import Clock
from lib.crawl import crawl
from lib.http_client import HttpClient
from lib.models import SiteType
from lib.skill_c import run as run_c
from lib.skill_d import run as run_d
from lib.skill_ent import run as run_ent
from lib.skill_k import run as run_k
from lib.skill_v import run as run_v
from test_skills_orchestrator import BASE, C, routes_for


# ── Gap 1 ─────────────────────────────────────────────────────────────────────
# K6 SaaS partial must emit a user-visible coverage_statement finding

SAAS_QUOTE_PAGE = """\
<!doctype html><html><head><title>Enterprise SaaS</title></head><body><main>
<h1>Helix SaaS</h1>
<p>We provide a cloud API platform for developers. Contact us for a quote. Talk to sales.</p>
</main></body></html>"""


def test_k6_saas_partial_emits_coverage_statement():
    snap = crawl(BASE + "/", C(routes_for({"/": SAAS_QUOTE_PAGE})), Clock.start_run(30), page_cap=2)
    snap.site_type = SiteType(cluster="F", saas=True, ecommerce=False)
    result = run_k(snap, question_ids=["K6"])
    per_q = result.metrics.get("per_question", {})
    assert per_q.get("K6") == "partial", f"expected partial, got {per_q}"
    cov_findings = [f for f in result.findings if f.finding_type == "coverage_statement"]
    assert cov_findings, (
        f"K6 partial must emit coverage_statement; got {[f.finding_type for f in result.findings]}"
    )
    assert cov_findings[0].severity == "low"


# ── Gap 2 ─────────────────────────────────────────────────────────────────────
# K4 broadened patterns: "trusted by", "used by", "ideal for"

def _snap_for_text(text):
    html = f"<html><head><title>Co</title></head><body><main><p>{text}</p></main></body></html>"
    return crawl(BASE + "/", C(routes_for({"/": html})), Clock.start_run(30), page_cap=2)


def test_k4_trusted_by_is_answered():
    snap = _snap_for_text("We are a productivity tool. Trusted by over 500 teams globally.")
    r = run_k(snap, question_ids=["K4"])
    assert r.metrics["per_question"].get("K4") == "answered", str(r.metrics["per_question"])


def test_k4_used_by_is_answered():
    snap = _snap_for_text("A DevOps platform used by engineering teams at scale.")
    r = run_k(snap, question_ids=["K4"])
    assert r.metrics["per_question"].get("K4") == "answered", str(r.metrics["per_question"])


def test_k4_ideal_for_is_answered():
    snap = _snap_for_text("Ideal for small businesses and freelancers managing invoices.")
    r = run_k(snap, question_ids=["K4"])
    assert r.metrics["per_question"].get("K4") == "answered", str(r.metrics["per_question"])


# ── Gap 3 ─────────────────────────────────────────────────────────────────────
# K7 differentiator question added to QUESTIONS

def test_k7_present_in_questions():
    from lib.skill_k import QUESTIONS
    ids = [q["id"] for q in QUESTIONS]
    assert "K7" in ids, f"K7 missing from QUESTIONS; found: {ids}"


def test_k7_unlike_phrasing_answered():
    snap = _snap_for_text("Unlike other tools, we offer real-time collaboration without plugins.")
    r = run_k(snap, question_ids=["K7"])
    assert r.metrics["per_question"].get("K7") == "answered", str(r.metrics["per_question"])


def test_k7_the_only_phrasing_answered():
    snap = _snap_for_text("We are the only platform that combines billing and analytics in one dashboard.")
    r = run_k(snap, question_ids=["K7"])
    assert r.metrics["per_question"].get("K7") == "answered", str(r.metrics["per_question"])


def test_k7_generic_copy_is_unanswerable():
    snap = _snap_for_text("We build software tools for teams.")
    r = run_k(snap, question_ids=["K7"])
    assert r.metrics["per_question"].get("K7") in ("unanswerable", "insufficient"), str(r.metrics["per_question"])


def test_k7_not_expected_gap_for_commercial_site():
    snap = _snap_for_text("We provide a SaaS platform for accounting teams.")
    snap.site_type = SiteType(cluster="F", saas=True, ecommerce=False)
    r = run_k(snap, question_ids=["K7"])
    assert r.metrics["per_question"].get("K7") != "expected_gap", str(r.metrics["per_question"])


# ── Gap 4 ─────────────────────────────────────────────────────────────────────
# skill_ent product/brand relationship (F17/F18)

HOME_BRAND = """\
<!doctype html><html><head><title>Acme Corporation</title></head><body><main>
<h1>Acme Corporation</h1><p>We are a hardware manufacturer based in San Jose. <a href="/widget">SuperWidget Pro</a></p>
</main></body></html>"""

PRODUCT_NO_REL = """\
<!doctype html><html><head><title>SuperWidget Pro</title></head><body><main>
<h1>SuperWidget Pro</h1><p>The most powerful widget. Add to cart. $299.</p>
</main></body></html>"""

PRODUCT_WITH_REL = """\
<!doctype html><html><head><title>SuperWidget Pro</title></head><body><main>
<h1>SuperWidget Pro</h1><p>SuperWidget Pro is a product by Acme Corporation. Add to cart. $299.</p>
</main></body></html>"""


def test_ent_product_missing_brand_relationship_flagged():
    snap = crawl(BASE + "/", C(routes_for({"/": HOME_BRAND, "/widget": PRODUCT_NO_REL})), Clock.start_run(30), page_cap=3)
    result = run_ent(snap)
    assert any(f.finding_type == "product_brand_gap" for f in result.findings), (
        f"Missing brand relationship should emit product_brand_gap; got {[f.finding_type for f in result.findings]}"
    )


def test_ent_product_with_brand_relationship_not_flagged():
    snap = crawl(BASE + "/", C(routes_for({"/": HOME_BRAND, "/widget": PRODUCT_WITH_REL})), Clock.start_run(30), page_cap=3)
    result = run_ent(snap)
    assert not any(f.finding_type == "product_brand_gap" for f in result.findings), (
        f"Explicit brand relationship should NOT flag; got {[(f.finding_type, f.title) for f in result.findings]}"
    )


# ── Gap 5 ─────────────────────────────────────────────────────────────────────
# skill_v YMYL legal/finance expansion

LEGAL_NO_DISC = """\
<!doctype html><html><head><title>LawFirm</title></head><body><main>
<h1>LawFirm</h1>
<p>We provide legal advice on employment disputes. Contact an attorney today.</p>
<p>Our services cover contract law and liability claims.</p>
</main></body></html>"""

LEGAL_WITH_DISC = """\
<!doctype html><html><head><title>LawFirm</title></head><body><main>
<h1>LawFirm</h1>
<p>Licensed attorneys in California. Bar license #CA-2024. Jurisdiction: California.</p>
<p>We provide legal advice on employment disputes.</p>
</main></body></html>"""

FINANCE_NO_DISC = """\
<!doctype html><html><head><title>WealthAdvisor</title></head><body><main>
<h1>WealthAdvisor</h1><p>We offer investment advice and tax advice for high-net-worth individuals.</p>
</main></body></html>"""


def test_ymyl_legal_no_disclosure_flagged():
    snap = crawl(BASE + "/", C(routes_for({"/": LEGAL_NO_DISC})), Clock.start_run(30), page_cap=2)
    result = run_v(snap)
    disc_findings = [f for f in result.findings if "disclosure" in f.title.lower() or "ymyl" in f.finding_type.lower()]
    assert disc_findings, (
        f"Legal page without license should emit disclosure finding; got {[f.finding_type for f in result.findings]}"
    )


def test_ymyl_legal_with_disclosure_not_flagged():
    snap = crawl(BASE + "/", C(routes_for({"/": LEGAL_WITH_DISC})), Clock.start_run(30), page_cap=2)
    result = run_v(snap)
    disc_findings = [f for f in result.findings if "disclosure" in f.title.lower() or "ymyl" in f.finding_type.lower()]
    assert not disc_findings, (
        f"Legal page with license should NOT flag; got {[(f.finding_type, f.title) for f in result.findings]}"
    )


def test_ymyl_finance_no_disclosure_flagged():
    snap = crawl(BASE + "/", C(routes_for({"/": FINANCE_NO_DISC})), Clock.start_run(30), page_cap=2)
    result = run_v(snap)
    disc_findings = [f for f in result.findings if "disclosure" in f.title.lower() or "ymyl" in f.finding_type.lower()]
    assert disc_findings, (
        f"Finance advice page should emit disclosure finding; got {[f.finding_type for f in result.findings]}"
    )


# ── Gap 6 ─────────────────────────────────────────────────────────────────────
# skill_c sitemap lastmod threshold: n >= 5, not n >= 20

def _snap_with_lastmod(n_urls, n_unique):
    snap = crawl(BASE + "/", C(routes_for({"/": "<html><body><p>Hello</p></body></html>"})), Clock.start_run(30), page_cap=2)
    snap.coverage["sitemap_lastmod_n"] = n_urls
    snap.coverage["sitemap_lastmod_unique"] = n_unique
    return snap


def test_sitemap_lastmod_fires_at_5():
    result = run_c(_snap_with_lastmod(5, 1))
    hits = [f for f in result.findings if f.finding_type == "coverage_statement" and "lastmod" in f.title.lower()]
    assert hits, f"n=5, unique=1 should fire; got {[f.title for f in result.findings]}"


def test_sitemap_lastmod_no_fire_at_4():
    result = run_c(_snap_with_lastmod(4, 1))
    hits = [f for f in result.findings if f.finding_type == "coverage_statement" and "lastmod" in f.title.lower()]
    assert not hits, f"n=4 should NOT fire; got {[f.title for f in result.findings]}"


def test_sitemap_lastmod_no_fire_on_diverse_dates():
    result = run_c(_snap_with_lastmod(30, 15))
    hits = [f for f in result.findings if f.finding_type == "coverage_statement" and "lastmod" in f.title.lower()]
    assert not hits, f"Diverse dates should NOT fire; got {[f.title for f in result.findings]}"


# ── Gap 7 ─────────────────────────────────────────────────────────────────────
# skill_d schema-vs-visible-text parity (B-F3)

SCHEMA_PRICE_HIDDEN = """\
<!doctype html><html><head><title>Buy Widget</title>
<script type="application/ld+json">{"@type":"Offer","price":"299.00","priceCurrency":"USD"}</script>
</head><body><main><h1>Widget Pro</h1><p>Add to cart. Our product is the best.</p></main></body></html>"""

SCHEMA_PRICE_VISIBLE = """\
<!doctype html><html><head><title>Buy Widget</title>
<script type="application/ld+json">{"@type":"Offer","price":"299.00","priceCurrency":"USD"}</script>
</head><body><main><h1>Widget Pro</h1><p>Get Widget Pro for $299.00. Add to cart.</p></main></body></html>"""

SCHEMA_ADDR_HIDDEN = """\
<!doctype html><html><head><title>Acme Corp</title>
<script type="application/ld+json">{"@type":"Organization","name":"Acme Corp","address":{"streetAddress":"123 Main St","addressLocality":"Springfield"}}</script>
</head><body><main><h1>Acme Corp</h1><p>We are a software company. Contact us online.</p></main></body></html>"""


def test_schema_price_absent_from_visible_flagged():
    snap = crawl(BASE + "/", C(routes_for({"/": SCHEMA_PRICE_HIDDEN})), Clock.start_run(30), page_cap=2)
    result = run_d(snap)
    hits = [f for f in result.findings if f.finding_type == "schema_only_fact"]
    assert hits, f"Schema price absent from visible text should emit schema_only_fact; got {[f.finding_type for f in result.findings]}"
    assert hits[0].severity == "medium"


def test_schema_price_in_visible_not_flagged():
    snap = crawl(BASE + "/", C(routes_for({"/": SCHEMA_PRICE_VISIBLE})), Clock.start_run(30), page_cap=2)
    result = run_d(snap)
    hits = [f for f in result.findings if f.finding_type == "schema_only_fact"]
    assert not hits, f"Schema price present in visible text should NOT flag; got {[(f.finding_type, f.title) for f in result.findings]}"


def test_schema_address_absent_from_visible_flagged():
    snap = crawl(BASE + "/", C(routes_for({"/": SCHEMA_ADDR_HIDDEN})), Clock.start_run(30), page_cap=2)
    result = run_d(snap)
    hits = [f for f in result.findings if f.finding_type == "schema_only_fact"]
    assert hits, f"Schema address absent from visible text should emit schema_only_fact; got {[f.finding_type for f in result.findings]}"
