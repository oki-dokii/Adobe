"""P0 SK-H linked-only corroboration on the production skill path."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from fake_http import make_opener, public_resolve
from lib.clock import Clock
from lib.crawl import crawl
from lib.http import HttpClient
from lib.orchestrator import run_audit
from lib.skill_h import run as run_h
from test_skills_orchestrator import BASE, C, HOME, routes_for


def test_a_no_sameas_is_not_a_user_finding():
    report = run_audit(BASE + "/", client=C(routes_for({"/": HOME})), max_seconds=280, page_cap=5)
    titles = [f["title"] for f in report["findings"]]
    assert not any("sameAs" in t for t in titles)
    assert not any("third-party" in t.lower() for t in titles)
    internal_types = [f.get("finding_type") for f in report.get("findings_internal") or []]
    assert "uncorroborated" not in internal_types
    assert "linked_contradiction" not in internal_types


def test_c_linked_price_contradiction():
    html = """<!doctype html><html><head><title>Acme</title>
<script type="application/ld+json">{"@type":"Organization","sameAs":["https://wiki.example/Acme"]}</script>
</head><body><main><p>We are a platform. Price $50</p></main></body></html>"""
    wiki = "<html><body><p>Acme costs $999</p></body></html>"
    routes = routes_for({"/": html})
    routes["https://wiki.example/robots.txt"] = (200, {"content-type": "text/plain"}, b"User-agent: *\nAllow: /\n")
    routes["https://wiki.example/Acme"] = (200, {"content-type": "text/html"}, wiki)
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=5)
    h = run_h(snap, client=C(routes), max_gets=5)
    cons = [f for f in h.findings if f.finding_type == "linked_contradiction"]
    assert cons
    f = cons[0]
    assert f.metrics.get("claim")
    assert f.metrics.get("source")
    assert f.metrics.get("conflicting_source")
    assert f.metrics.get("extracted_values")
    assert f.metrics.get("comparison_basis")
    assert f.confidence
    assert f.severity in ("high", "medium")
    assert "50" in f.evidence and "999" in f.evidence


def test_b_linked_agrees_no_finding():
    html = """<!doctype html><html><head><title>Acme</title>
<script type="application/ld+json">{"@type":"Organization","sameAs":["https://wiki.example/Acme"]}</script>
</head><body><main><p>We are a platform. Price $50</p></main></body></html>"""
    wiki = "<html><body><p>Acme list price $50 per month</p></body></html>"
    routes = routes_for({"/": html})
    routes["https://wiki.example/robots.txt"] = (200, {"content-type": "text/plain"}, b"User-agent: *\nAllow: /\n")
    routes["https://wiki.example/Acme"] = (200, {"content-type": "text/html"}, wiki)
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=5)
    h = run_h(snap, client=C(routes), max_gets=5)
    assert not any(f.finding_type == "linked_contradiction" for f in h.findings)
    assert h.metrics.get("corroboration_status") == "agree"


def test_d_stale_linked_source():
    html = """<!doctype html><html><head><title>Acme</title>
<script type="application/ld+json">{"@type":"Organization","sameAs":["https://wiki.example/Acme"]}</script>
</head><body><main><p>We are a platform. Price $80</p></main></body></html>"""
    wiki = "<html><body><p>As of 2018 the product cost $12</p></body></html>"
    routes = routes_for({"/": html})
    routes["https://wiki.example/robots.txt"] = (200, {"content-type": "text/plain"}, b"User-agent: *\nAllow: /\n")
    routes["https://wiki.example/Acme"] = (200, {"content-type": "text/html"}, wiki)
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=5)
    h = run_h(snap, client=C(routes), max_gets=5)
    assert h.metrics.get("corroboration_status") in ("stale", "contradict")
    assert any(f.finding_type == "linked_contradiction" for f in h.findings)


def test_e_unusable_linked_source():
    html = """<!doctype html><html><head><title>Acme</title>
<script type="application/ld+json">{"@type":"Organization","sameAs":["https://wiki.example/Acme"]}</script>
</head><body><main><p>We are a platform. Price $50</p></main></body></html>"""
    routes = routes_for({"/": html})
    routes["https://wiki.example/robots.txt"] = (200, {"content-type": "text/plain"}, b"User-agent: *\nDisallow: /\n")
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=5)
    h = run_h(snap, client=C(routes), max_gets=5)
    assert h.metrics.get("corroboration_status") == "unusable"
    assert not h.findings


def test_f_insufficient_evidence():
    html = """<!doctype html><html><head><title>Acme</title>
<script type="application/ld+json">{"@type":"Organization","sameAs":["https://wiki.example/Acme"]}</script>
</head><body><main><p>We are a platform. Price $50</p></main></body></html>"""
    wiki = "<html><body><p>Acme is a company based in a city. No numbers here.</p></body></html>"
    routes = routes_for({"/": html})
    routes["https://wiki.example/robots.txt"] = (200, {"content-type": "text/plain"}, b"User-agent: *\nAllow: /\n")
    routes["https://wiki.example/Acme"] = (200, {"content-type": "text/html"}, wiki)
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=5)
    h = run_h(snap, client=C(routes), max_gets=5)
    assert h.metrics.get("corroboration_status") == "insufficient"
    assert not any(f.finding_type == "linked_contradiction" for f in h.findings)
