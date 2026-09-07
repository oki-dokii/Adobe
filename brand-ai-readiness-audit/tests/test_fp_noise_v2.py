"""False-positive noise: rate cards, K3 identity, dates, K6 site-type, YMYL, collision."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from lib.clock import Clock
from lib.crawl import crawl
from lib.models import SiteType
from lib.skill_cit import amount_is_isolated, run as run_cit
from lib.skill_d import run as run_d
from lib.skill_ent import run as run_ent
from lib.skill_i import date_signals_diverge, run as run_i
from lib.skill_k import k3_span, k6_is_expected_gap, run as run_k
from lib.skill_v import run as run_v
from test_skills_orchestrator import BASE, C, HOME, PRICING_SPLIT, routes_for


def test_rate_card_not_qualifier_split():
    text = (
        "Standard 1.7% + A$0.30 for domestic cards* "
        "3.5% + A$0.30 for international cards* "
        "US$10.00 per month billed annually "
        "US$500.00 one-off setup fee"
    )
    # Each fee carries its condition in-sentence / nbsp-normalized neighborhood.
    html = f"<html><head><title>Pricing</title></head><body><main><p>{text}</p></main></body></html>"
    snap = crawl(BASE + "/", C(routes_for({"/": HOME, "/pricing": html.replace("Pricing", "Pricing", 1)})), Clock.start_run(30), page_cap=8)
    # Seed home + dedicated pricing path
    pricing = """<!doctype html><html><head><title>Pricing</title></head><body><main>
    <h2>1.7% + A$0.30</h2><p>for domestic&nbsp;cards*</p>
    <h2>3.5% + A$0.30</h2><p>for international&nbsp;cards*</p>
    <p>Radar. US$10.00 per&nbsp;month Learn more</p>
    <p>US$500.00 one-off setup fee (includes GST)</p>
    </main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": HOME, "/pricing": pricing})), Clock.start_run(30), page_cap=8)
    run_d(snap)
    cit = run_cit(snap)
    splits = [f for f in cit.findings if f.finding_type == "qualifier_split"]
    assert splits == [], [f.evidence for f in splits]


def test_listed_amount_still_qualifier_split():
    snap = crawl(
        BASE + "/",
        C(routes_for({"/": HOME, "/pricing": PRICING_SPLIT})),
        Clock.start_run(30),
        page_cap=10,
    )
    run_d(snap)
    cit = run_cit(snap)
    splits = [f for f in cit.findings if f.finding_type == "qualifier_split"]
    assert any("$49" in f.evidence for f in splits)


def test_amount_is_isolated_helper():
    isolated = "The listed amount is $49. Additional terms apply. then billed annually unless cancelled."
    # $49 is the only offer-like span if page_type pricing
    from lib.money import iter_offer_prices

    text = isolated
    m = next(iter_offer_prices(text, page_type="pricing"), None)
    assert m
    assert amount_is_isolated(text, m.start(), m.end(), page_type="pricing")
    together = "1.7% + A$0.30 for domestic cards then more"
    m2 = next(iter_offer_prices(together, page_type="pricing"), None)
    assert m2
    assert not amount_is_isolated(together, m2.start(), m2.end(), page_type="pricing")
    zip_fee = "49% + A$0.30 for Zip See more payment methods"
    m3 = next(iter_offer_prices(zip_fee, page_type="pricing"), None)
    assert m3
    assert not amount_is_isolated(zip_fee, m3.start(), m3.end(), page_type="pricing")


def test_k3_hero_copy_and_not_progress():
    assert k3_span("Transform your plain text into static websites and blogs.")
    assert k3_span("The library for web and native user interfaces")
    assert k3_span("Northwind is a research archive for historians.")
    assert k3_span("I'm a software developer in Chicago.")
    assert k3_span("We provide payroll automation services.")
    assert not k3_span("We'll share more as we make progress.")
    assert not k3_span("We are service-oriented.")
    assert not k3_span("The help you need, when you need it 24/7 support")


def test_k3_jekyll_like_page_answered():
    html = """<html><head><title>Jekyll</title></head><body><main>
    <p>Transform your plain text into static websites and blogs.</p>
    </main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": html})), Clock.start_run(30), page_cap=2)
    run_v(snap)
    k = run_k(snap, question_ids=["K3"])
    assert k.metrics["per_question"].get("K3") == "answered"


def test_k6_gap_on_news_and_docs_not_saas():
    assert k6_is_expected_gap(SiteType(cluster="E"))
    assert k6_is_expected_gap(SiteType(cluster="D"))
    assert k6_is_expected_gap(SiteType(cluster="C"))
    assert k6_is_expected_gap(SiteType(cluster="A"))
    assert not k6_is_expected_gap(SiteType(cluster="F", saas=True))
    news = """<html><head><title>Daily</title></head><body><main>
    <p>Opinion byline published today. Subscribe to newsletter.</p>
    </main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": news})), Clock.start_run(30), page_cap=2)
    run_v(snap)
    k = run_k(snap, question_ids=["K3", "K6"])
    assert k.metrics["per_question"].get("K6") == "expected_gap"
    assert not any(f.finding_type == "unanswerable" and "K6" in f.title for f in k.findings)


def test_date_history_not_divergence():
    assert not date_signals_diverge(["2025", "1900", "1948"], ["2026-08-14T18:31:16+01:00"], now_year=2026)
    assert not date_signals_diverge(["2026", "2012", "1959", "1963"], ["2023-07-25T11:19:07-04:00"], now_year=2026)
    assert date_signals_diverge(["2026"], ["2019-01-01"], page_type="home", now_year=2026)


def test_locale_pricing_paths_not_conflict():
    a = """<html><head><title>Pricing</title></head><body><main><p>Plans start at $19 per month</p></main></body></html>"""
    b = """<html><head><title>Pricing</title></head><body><main><p>Plans start at $29 per month</p></main></body></html>"""
    routes = {
        f"{BASE}/robots.txt": (200, {"content-type": "text/plain"}, "User-agent: *\nAllow: /\n"),
        f"{BASE}/sitemap.xml": (404, {}, b""),
        f"{BASE}/pricing": (200, {"content-type": "text/html"}, a),
        f"{BASE}/in/pricing": (200, {"content-type": "text/html"}, b),
    }
    snap = crawl(BASE + "/pricing", C(routes), Clock.start_run(30), page_cap=5)
    i = run_i(snap)
    assert not any(f.finding_type == "on_site_fact_conflict" for f in i.findings)
    html = """<html><head><title>Pricing</title></head><body><main>
    <p>Plans start at $19 per month or $29 per month.</p>
    </main></body></html>"""
    snap = crawl(BASE + "/pricing", C(routes_for({"/pricing": html})), Clock.start_run(30), page_cap=3)
    i = run_i(snap)
    assert not any(f.finding_type == "on_site_fact_conflict" for f in i.findings)


def test_locale_root_is_home_not_other():
    from lib.extract import classify_page_type

    assert classify_page_type("https://brand.example/in", "Home", "") == "home"
    assert classify_page_type("https://brand.example/in/pricing", "Pricing", "") == "pricing"
    gov = """<html><head><title>Agency</title></head><body><main>
    <p>Official government site. We provide public records.</p>
    </main></body></html>"""
    snap = crawl("https://agency.gov/", C({
        "https://agency.gov/robots.txt": (200, {"content-type": "text/plain"}, "User-agent: *\nAllow: /\n"),
        "https://agency.gov/sitemap.xml": (404, {}, b""),
        "https://agency.gov/": (200, {"content-type": "text/html"}, gov),
    }), Clock.start_run(30), page_cap=3)
    v = run_v(snap)
    assert snap.site_type.cluster == "C"
    assert not any(f.finding_type == "ymy_disclosure" for f in v.findings)


def test_medical_advice_still_ymyl():
    html = """<html><head><title>Clinic</title></head><body><main>
    <p>Medical diagnosis and physician advice online. No reviewed by line.</p>
    </main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": html})), Clock.start_run(30), page_cap=2)
    v = run_v(snap)
    assert snap.site_type.ymyl
    assert any(f.finding_type == "ymy_disclosure" for f in v.findings)


def test_acronym_title_not_collision():
    html = """<html><head><title>ABCD</title></head><body><main>
    <p>Welcome. Explore programs and news.</p>
    </main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": html})), Clock.start_run(30), page_cap=2)
    ent = run_ent(snap)
    assert not any(f.finding_type == "collision_risk" for f in ent.findings)


def test_common_name_still_collision_without_disambiguator():
    html = """<html><head><title>Apex</title></head><body><main>
    <p>Welcome to the homepage. Contact us.</p>
    </main></body></html>"""
    snap = crawl(BASE + "/", C(routes_for({"/": html})), Clock.start_run(30), page_cap=2)
    ent = run_ent(snap)
    assert any(f.finding_type == "collision_risk" for f in ent.findings)
