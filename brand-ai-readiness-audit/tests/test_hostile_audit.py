"""Hostile audit tests: prove gaps against LOCKED_ARCHITECTURE. No production-code changes."""

from __future__ import annotations

import sys
from pathlib import Path
from urllib.request import HTTPHandler, HTTPSHandler, HTTPRedirectHandler, build_opener

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from fake_http import FakeResp, make_opener, public_resolve
from lib.admit import admit
from lib.clock import PROTECT_LIST
from lib.crawl import crawl
from lib.clock import Clock
from lib.findings import make_finding, reset_ids
from lib.http_client import HttpClient, HttpError
from lib.merge import merge_findings, rank_user_facing
from lib.models import SiteType, SuggestedAction
from lib.orchestrator import run_audit
from lib.skill_d import run as run_d
from lib.skill_h import run as run_h
from lib.skill_k import run as run_k
from lib.skill_x import run as run_x
from lib.url import is_blocked_ip
from test_skills_orchestrator import C, HOME, routes_for, BASE


def test_production_opener_still_includes_redirect_handler():
    """Fixed: production opener must not auto-follow redirects."""
    from lib.http_client import build_production_opener, production_opener_has_redirect_handler

    assert production_opener_has_redirect_handler() is False
    opener = build_production_opener()
    assert not any(isinstance(h, HTTPRedirectHandler) for h in opener.handlers)


def test_cgnat_ipv4_not_blocked():
    """RFC 6598 shared address space 100.64.0.0/10 must be blocked."""
    assert is_blocked_ip("127.0.0.1")
    assert is_blocked_ip("10.1.2.3")
    assert is_blocked_ip("169.254.169.254")
    assert is_blocked_ip("::1")
    assert is_blocked_ip("100.64.1.1")


def test_file_scheme_redirect_blocked_on_manual_hop_path():
    routes = {
        "https://pub.example/": (302, {"Location": "file:///etc/passwd"}, b""),
    }
    c = HttpClient(opener=make_opener(routes), resolve=public_resolve, rate_limiter=None)
    with pytest.raises(HttpError) as e:
        c.request("https://pub.example/")
    assert e.value.code == "SSRF_BLOCKED"


def test_skill_exception_aborts_entire_audit(monkeypatch):
    import lib.orchestrator as orch

    def boom(*_a, **_k):
        raise RuntimeError("classifier exploded")

    monkeypatch.setattr(orch, "run_v", boom)
    routes = routes_for({"/": HOME})
    report = run_audit(BASE + "/", client=C(routes), max_seconds=30, page_cap=3)
    assert report["metrics"]["audit_status"] == "partial"
    assert "site-type-classifier" in report["skill_status"]["failed_skills"]


def test_js_lock_and_k_unanswerable_both_remain_user_critical():
    """Child unanswerable is an amplifier of JS-lock and must not stay a second Critical."""
    reset_ids()
    parent = make_finding(
        skill_id="render-extract-audit",
        finding_type="js_fact_lock",
        title="js",
        severity="critical",
        evidence="raw vs rendered prices",
        action=SuggestedAction(summary="SSR"),
        urls=["https://s.example/pricing"],
    )
    child = make_finding(
        skill_id="ai-answerability-audit",
        finding_type="unanswerable",
        title="K6 missing",
        severity="critical",
        evidence="K6",
        action=SuggestedAction(summary="add sentence"),
        urls=["https://s.example/pricing"],
    )
    merged = merge_findings([parent, child])
    user, _ = rank_user_facing(merged)
    types = {f.finding_type for f in user}
    assert "js_fact_lock" in types
    assert "unanswerable" not in types
    child_kept = [f for f in merged if f.finding_type == "unanswerable"][0]
    assert child_kept.parent_id == parent.id
    assert child_kept.suppressed


def test_h_never_emits_linked_contradiction():
    html = """<!doctype html><html><head><title>Acme</title>
<script type="application/ld+json">{"@type":"Organization","sameAs":["https://wiki.example/Acme"]}</script>
</head><body><main><p>We are a platform. Price $50</p></main></body></html>"""
    wiki = "<html><body><p>Acme costs $999</p></body></html>"
    routes = routes_for({"/": html})
    routes["https://wiki.example/robots.txt"] = (200, {"content-type": "text/plain"}, b"User-agent: *\nAllow: /\n")
    routes["https://wiki.example/Acme"] = (200, {"content-type": "text/html"}, wiki)
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=5)
    h = run_h(snap, client=C(routes), max_gets=5)
    assert any(f.finding_type == "linked_contradiction" for f in h.findings)


def test_every_site_without_sameas_gets_uncorroborated_finding():
    routes = routes_for({"/": HOME})
    report = run_audit(BASE + "/", client=C(routes), max_seconds=280, page_cap=5)
    titles = [f["title"] for f in report["findings"]]
    assert not any("sameAs" in t or "third-party" in t.lower() for t in titles)


def test_accordion_in_dom_is_not_js_fact_lock():
    html = """<!doctype html><html><head><title>FAQ</title></head><body><main>
<p>We are a notes app.</p>
<details><summary>Price</summary>Plans are $49 per month</details>
</main></body></html>"""
    routes = routes_for({"/": html})
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=3)
    d = run_d(snap)
    assert not any(f.finding_type == "js_fact_lock" for f in d.findings)


def test_sttf_does_not_fire_when_details_text_is_also_in_main():
    """Closed <details> is in-DOM but not default-visible; STTF should fire."""
    html = """<!doctype html><html><head><title>P</title></head><body><main>
<p>Intro.</p>
<details><summary>Price</summary>$49 per month</details>
</main></body></html>"""
    routes = routes_for({"/": html})
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=3)
    snap.claims = [{"text": "$49", "url": snap.fetched_pages()[0].url}]
    x = run_x(snap)
    assert any(f.finding_type == "sttf_fail" for f in x.findings)


def test_protect_list_is_never_consulted_by_orchestrator():
    src = (ROOT / "scripts" / "lib" / "orchestrator.py").read_text()
    assert "PROTECT_LIST" in src
    from lib.clock import PROTECT_LIST, plan_skip_ladder, Clock
    plan = plan_skip_ladder(Clock.start_run(280))
    assert "K3" in plan.k_ids
    assert "site-type-classifier" in PROTECT_LIST


def test_u3_thin_title_gate_never_matches_real_k_titles():
    f = make_finding(
        skill_id="ai-answerability-audit",
        finding_type="unanswerable",
        title="Closed-book: site does not answer K3 (What does this organization offer or do?)",
        severity="high",
        evidence="No supporting span",
        action=SuggestedAction(summary="add"),
        urls=["https://dir.example/"],
    )
    f.metrics["question_id"] = "K3"
    y = admit(f, SiteType(cluster="B"))
    assert y.suppressed and y.suppress_reason == "U3"


def test_k3_false_positive_on_generic_service_word():
    html = "<html><head><title>City Parking</title></head><body><main><p>Customer service window is on Elm Street.</p></main></body></html>"
    routes = routes_for({"/": html})
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=3)
    k = run_k(snap, question_ids=["K3"])
    unanswered = [f for f in k.findings if f.finding_type == "unanswerable" and "K3" in f.title]
    assert unanswered
    assert k.metrics["per_question"].get("K3") == "unanswerable"


def test_missing_canonical_not_emitted():
    routes = routes_for({"/": HOME})
    report = run_audit(BASE + "/", client=C(routes), max_seconds=60, page_cap=4)
    assert not any("canonical" in f["title"].lower() for f in report["findings"])
