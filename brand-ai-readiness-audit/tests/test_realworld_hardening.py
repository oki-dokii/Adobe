"""Regression tests for real-world hardening: price materiality, access walls, render_max."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from lib.access import classify_http_access, content_usable
from lib.clock import Clock, is_protected_fact_url
from lib.crawl import crawl
from lib.extract import PRICE_RE, classify_page_type
from lib.facts import extract_facts
from lib.models import Page
from lib.money import classify_money_span, has_offer_price
from lib.orchestrator import run_audit
from lib.skill_cit import run as run_cit
from lib.skill_d import run as run_d
from lib.skill_k import run as run_k
from test_skills_orchestrator import BASE, C, HOME, routes_for


def _kind(text: str) -> str:
    m = PRICE_RE.search(text)
    assert m, text
    return classify_money_span(text, m.start(), m.end())


def test_price_arr_revenue_funding_not_offers():
    cases = [
        "We're on track to pass $500 million ARR",
        "annual revenue of $50M",
        "raised $100 million",
        "company valuation: $5B",
        "serves a $20B market",
        "customers processed $10M in payments",
        "Series B funding of $80 million",
        "salary of $180,000",
    ]
    for t in cases:
        assert _kind(t) == "metric", t
        assert not has_offer_price(t), t


def test_price_genuine_offers_still_fire():
    cases = [
        "Plans start at $29/month",
        "$299 per year",
        "Plans start at $49",
        "Pricing: $99 per user",
        "Subscription fee: $20/month",
        "list price $50 per month",
        "Price $99.00",
    ]
    for t in cases:
        assert _kind(t) == "offer", t
        assert has_offer_price(t), t


def test_price_facts_skip_metrics_keep_plans():
    metric = Page(
        id="p1",
        url=f"{BASE}/about",
        final_url=f"{BASE}/about",
        status=200,
        main_text="raised $100 million with $500 million ARR",
        page_type="about",
    )
    offer = Page(
        id="p2",
        url=f"{BASE}/pricing",
        final_url=f"{BASE}/pricing",
        status=200,
        main_text="Plans start at $49 per month",
        page_type="pricing",
    )
    facts = extract_facts([metric, offer])
    assert all(f.type != "price" or ("100" not in f.value and "500" not in f.value) for f in facts)
    assert any(f.type == "price" and "49" in f.value for f in facts)


def test_qualifier_split_ignores_arr_keeps_listed_amount():
    arr_home = """<!doctype html><html><head><title>Acme Cloud</title></head><body><main>
    <h1>Acme Cloud</h1>
    <p>We are a workspace platform for teams.</p>
    <p>we're on track to pass $500 million of annual recurring then billed nonsense</p>
    </main></body></html>"""
    snap_arr = crawl(BASE + "/", C(routes_for({"/": arr_home})), Clock.start_run(30), page_cap=3)
    run_d(snap_arr)
    cit_arr = run_cit(snap_arr)
    assert not any("$500" in (f.evidence or "") for f in cit_arr.findings if f.finding_type == "qualifier_split")

    from test_skills_orchestrator import PRICING_SPLIT

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


def test_host_stripe_is_not_pricing_page_type():
    assert classify_page_type("https://stripe.com/", "Stripe", "payments") == "home"
    assert classify_page_type("https://stripe.com/pricing", "Pricing", "") == "pricing"
    assert not is_protected_fact_url("https://stripe.com/sessions/foo", "https://stripe.com/")
    assert is_protected_fact_url("https://stripe.com/pricing", "https://stripe.com/")
    assert is_protected_fact_url("https://stripe.com/", "https://stripe.com/")


def test_classify_http_status_matrix():
    assert classify_http_access(status=401, headers={}, body="<html>login</html>") == "unauthorized"
    assert classify_http_access(status=429, headers={}, body="slow down") == "rate_limited"
    assert classify_http_access(status=503, headers={}, body="unavailable") == "unavailable"
    assert classify_http_access(status=403, headers={}, body="  ") == "empty"
    cap = classify_http_access(
        status=403,
        headers={"server": "cloudflare"},
        body="<html>please complete the captcha hcaptcha</html>",
    )
    assert cap == "captcha"
    ch = classify_http_access(
        status=403,
        headers={"cf-mitigated": "challenge"},
        body="<html>Just a moment... checking your browser</html>",
    )
    assert ch == "challenge"
    cf = classify_http_access(
        status=403,
        headers={"server": "cloudflare"},
        body="<html>short</html>",
    )
    assert cf == "challenge"
    legit = classify_http_access(
        status=403,
        headers={"content-type": "text/html"},
        body="<html><body><article>" + ("This resource is members-only. " * 40) + "</article></body></html>",
    )
    assert legit == "forbidden_content"
    assert not content_usable(legit, 403)
    ok = classify_http_access(status=200, headers={"content-type": "text/html"}, body="<html><body>ok</body></html>")
    assert ok == "ok"
    assert content_usable(ok, 200)


def _status_routes(status: int, body: str, headers: dict | None = None):
    h = {"content-type": "text/html"}
    h.update(headers or {})
    return {
        f"{BASE}/robots.txt": (200, {"content-type": "text/plain"}, "User-agent: *\nAllow: /\n"),
        f"{BASE}/sitemap.xml": (404, {}, b""),
        f"{BASE}/": (status, h, body),
    }


def test_challenge_body_not_k_unanswerable():
    body = "<html><body>Just a moment... checking your browser cf-browser-verification</body></html>"
    snap = crawl(
        BASE + "/",
        C(_status_routes(403, body, {"cf-mitigated": "challenge"})),
        Clock.start_run(30),
        page_cap=3,
    )
    assert snap.fetched_pages() == []
    assert snap.pages[0].access_kind == "challenge"
    assert any("Access limitation" in x for x in snap.limitations)
    k = run_k(snap)
    assert not any(f.finding_type == "unanswerable" for f in k.findings)
    assert k.metrics["per_question"].get("K3") == "insufficient"
    assert any(f.finding_type == "coverage_statement" for f in k.findings)


def test_captcha_and_waf_and_empty_403_and_401_429_503():
    specs = [
        (401, "<html>auth</html>", {}, "unauthorized"),
        (429, "rate", {}, "rate_limited"),
        (503, "down", {}, "unavailable"),
        (403, "", {}, "empty"),
        (403, "<html>enable javascript and cookies cf-challenge</html>", {"server": "cloudflare"}, "challenge"),
    ]
    for status, body, hdr, kind in specs:
        snap = crawl(BASE + "/", C(_status_routes(status, body, hdr)), Clock.start_run(30), page_cap=2)
        assert snap.pages[0].access_kind == kind, (status, snap.pages[0].access_kind)
        k = run_k(snap)
        assert not any(f.finding_type == "unanswerable" for f in k.findings)


def test_full_audit_challenge_not_answerability_gap():
    body = "<html>Why have I been blocked Attention Required cloudflare</html>"
    report = run_audit(
        BASE + "/",
        client=C(_status_routes(403, body, {"server": "cloudflare"})),
        max_seconds=60,
        page_cap=3,
    )
    titles = " ".join(f["title"] for f in report["findings"])
    internal = report.get("findings_internal") or []
    assert not any(f.get("finding_type") == "unanswerable" for f in internal)
    assert "Closed-book" not in titles
    assert any("limitation" in x.lower() or "Access" in x for x in report["limitations"])


def test_legitimate_403_not_classified_waf():
    body = "<html><body><h1>Members only</h1><p>" + ("Confidential policy text. " * 50) + "</p></body></html>"
    kind = classify_http_access(status=403, headers={"content-type": "text/html"}, body=body)
    assert kind == "forbidden_content"
    snap = crawl(BASE + "/", C(_status_routes(403, body)), Clock.start_run(30), page_cap=2)
    assert snap.pages[0].access_kind == "forbidden_content"
    assert snap.fetched_pages() == []


def _hub(links: list[str], extra: str = "") -> str:
    nav = "".join(f'<a href="{p}">{p}</a>' for p in links)
    return (
        f"<!doctype html><html><head><title>Acme Cloud</title></head><body><main>"
        f"<p>We are a workspace platform for teams.{extra}</p><nav>{nav}</nav></main></body></html>"
    )


def _leaf(text: str) -> str:
    return f"<html><body><main><p>{text}</p></main></body></html>"


def test_render_max_hard_cap_many_protected_urls():
    links = [f"/pricing/p{i}" for i in range(40)]
    pages = {"/": _hub(links)}
    for p in links:
        pages[p] = _leaf("Plans start at $9 per month")
    snap = crawl(BASE + "/", C(routes_for(pages)), Clock.start_run(60), page_cap=40, render_max=10)
    assert snap.coverage["render_count"] <= 10
    assert snap.timing.render_count <= 10
    assert snap.coverage["renders_performed"] <= snap.coverage["render_max"]
    assert snap.coverage["protected_render_exceptions"] == 0
    assert snap.coverage["renders_skipped_budget"] >= 1
    assert is_protected_fact_url(BASE + "/pricing/p0", BASE + "/")


def test_render_max_many_normal_and_mixed_and_duplicates():
    normal = [f"/docs/n{i}" for i in range(30)]
    prot = [f"/about/a{i}" for i in range(20)]
    dup = ["/about/a0", "/pricing"]
    links = normal + prot + dup
    pages = {"/": _hub(links)}
    for p in normal:
        pages[p] = _leaf("Reference page")
    for p in prot:
        pages[p] = _leaf("About the company")
    pages["/pricing"] = _leaf("Plans start at $12 per month")
    snap = crawl(BASE + "/", C(routes_for(pages)), Clock.start_run(60), page_cap=40, render_max=8)
    assert snap.coverage["render_count"] <= 8
    assert snap.coverage["renders_requested"] >= snap.coverage["renders_performed"]
    assert (
        snap.coverage["renders_performed"] + snap.coverage["renders_skipped_budget"]
        == snap.coverage["renders_requested"]
    )


def test_render_all_protected_still_capped():
    links = [f"/contact/c{i}" for i in range(25)]
    pages = {"/": _hub(links)}
    for p in links:
        pages[p] = _leaf("Email us")
    snap = crawl(BASE + "/", C(routes_for(pages)), Clock.start_run(60), page_cap=26, render_max=5)
    assert snap.coverage["render_count"] <= 5
    assert snap.coverage["protected_render_requests"] >= 1


def test_render_budget_exhausted_skips_later_protected():
    links = [f"/docs/n{i}" for i in range(15)] + [f"/pricing/late{i}" for i in range(10)]
    pages = {"/": _hub(links, extra=" Price $1 per month")}
    for p in links:
        pages[p] = _leaf("Plans start at $3 per month" if "/pricing/" in p else "Doc")
    snap = crawl(BASE + "/", C(routes_for(pages)), Clock.start_run(60), page_cap=30, render_max=3)
    assert snap.coverage["render_count"] == 3
    assert snap.coverage["renders_skipped_budget"] >= 1
    skipped_prot = [
        p
        for p in snap.pages
        if p.render_status == "skipped" and is_protected_fact_url(p.url, BASE + "/")
    ]
    assert skipped_prot or snap.coverage["protected_render_requests"] <= 3


def test_interaction_insert_detector():
    from lib.skill_d import run as run_d
    html = """<!doctype html><html><head><title>Pricing</title></head><body><main>
    <h1>Plans</h1>
    <p>We provide enterprise cloud analytics.</p>
    <button onclick="toggle()">Show Pricing</button>
    <div style="display:none"><p>Pro Plan $99 per month</p></div>
    </main></body></html>"""
    routes = routes_for({"/pricing": html})
    snap = crawl(BASE + "/pricing", C(routes), Clock.start_run(30), page_cap=2)
    d = run_d(snap)
    assert any(f.finding_type == "interaction_insert" for f in d.findings)


def test_entity_structured_disambiguators():
    from lib.skill_ent import run as run_ent
    html = """<!doctype html><html><head><title>Apex</title>
    <script type="application/ld+json">
    {"@type": "Organization", "name": "Apex", "address": {"@type": "PostalAddress", "addressCountry": "US"}, "description": "Cloud telemetry infrastructure"}
    </script>
    </head><body><main><p>Platform solutions.</p></main></body></html>"""
    routes = routes_for({"/": html})
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=2)
    ent_res = run_ent(snap)
    assert snap.entities[0].disambiguators["geo"] == "US"
    assert "telemetry" in snap.entities[0].disambiguators["category"]
    # Disambiguated via schema, so collision_risk finding is suppressed
    assert not any(f.finding_type == "collision_risk" for f in ent_res.findings)


def test_qualifier_vat_and_seat_recognition():
    from lib.skill_cit import amount_is_isolated
    # Amount with local VAT qualifier in same sentence is NOT isolated
    s1 = "Our enterprise tier is $50 per seat/month plus VAT."
    assert not amount_is_isolated(s1, s1.index("$50"), s1.index("$50") + 3, page_type="pricing")
    # Isolated amount with later VAT condition in next sentence IS isolated
    s2 = "Our tier is $50. Additional fees apply. All listed amounts are excl. VAT and billed annually."
    assert amount_is_isolated(s2, s2.index("$50"), s2.index("$50") + 3, page_type="pricing")
