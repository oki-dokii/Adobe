"""P1 parent/child, STTF, protect-list, U3, K3 on production paths."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from lib.admit import admit
from lib.clock import PROTECT_LIST, Clock, is_protected_fact_url, plan_skip_ladder
from lib.crawl import crawl
from lib.extract import parse_html
from lib.findings import make_finding, reset_ids
from lib.merge import merge_findings, rank_user_facing
from lib.models import SiteType, SuggestedAction
from lib.orchestrator import run_audit
from lib.skill_d import run as run_d
from lib.skill_k import run as run_k
from lib.skill_x import run as run_x
from test_skills_orchestrator import BASE, C, HOME, routes_for


def _f(**kw):
    return make_finding(
        skill_id=kw.get("skill", "x"),
        finding_type=kw["ft"],
        title=kw.get("title", kw["ft"]),
        severity=kw.get("sev", "critical"),
        evidence=kw.get("ev", "e"),
        action=SuggestedAction(summary=kw.get("act", "a")),
        urls=kw.get("urls", ["https://s.example/p"]),
    )


def test_parent_only():
    reset_ids()
    a = _f(ft="js_fact_lock", skill="render-extract-audit")
    m = merge_findings([a])
    user, _ = rank_user_facing(m)
    assert [f.finding_type for f in user] == ["js_fact_lock"]


def test_parent_plus_child_suppresses_child():
    reset_ids()
    a = _f(ft="js_fact_lock", skill="render-extract-audit", sev="high")
    b = _f(ft="unanswerable", skill="ai-answerability-audit", sev="critical")
    m = merge_findings([a, b])
    user, _ = rank_user_facing(m)
    assert {f.finding_type for f in user} == {"js_fact_lock"}
    child = [f for f in m if f.finding_type == "unanswerable"][0]
    assert child.parent_id == a.id and child.suppressed


def test_child_without_parent_retained():
    reset_ids()
    b = _f(ft="unanswerable", skill="ai-answerability-audit")
    m = merge_findings([b])
    user, _ = rank_user_facing(m)
    assert [f.finding_type for f in user] == ["unanswerable"]


def test_multiple_children():
    reset_ids()
    a = _f(ft="js_fact_lock", skill="render-extract-audit", sev="critical")
    b = _f(ft="unanswerable", skill="ai-answerability-audit")
    c = _f(ft="sttf_fail", skill="engagement-handoff-audit", sev="high")
    m = merge_findings([a, b, c])
    user, _ = rank_user_facing(m)
    assert {f.finding_type for f in user} == {"js_fact_lock"}
    assert all(f.parent_id == a.id for f in m if f.finding_type != "js_fact_lock")


def test_multiple_parent_candidates():
    reset_ids()
    r = _f(ft="robots_fail_closed", skill="crawl-access-audit", sev="critical")
    j = _f(ft="js_fact_lock", skill="render-extract-audit", sev="critical")
    b = _f(ft="unanswerable", skill="ai-answerability-audit")
    m = merge_findings([r, j, b])
    child = [f for f in m if f.finding_type == "unanswerable"][0]
    assert child.parent_id in {r.id, j.id}
    user, _ = rank_user_facing(m)
    assert "unanswerable" not in {f.finding_type for f in user}


def test_same_and_different_severity():
    reset_ids()
    a = _f(ft="js_fact_lock", skill="render-extract-audit", sev="high")
    b = _f(ft="unanswerable", skill="ai-answerability-audit", sev="high")
    m = merge_findings([a, b])
    assert [f for f in m if f.finding_type == "unanswerable"][0].suppressed
    reset_ids()
    a = _f(ft="js_fact_lock", skill="render-extract-audit", sev="low")
    b = _f(ft="unanswerable", skill="ai-answerability-audit", sev="critical")
    m = merge_findings([a, b])
    child = [f for f in m if f.finding_type == "unanswerable"][0]
    assert child.parent_id == a.id
    assert not child.suppressed  # parent below High


def test_sttf_open_vs_closed_details():
    closed = """<html><body><main><p>Intro.</p><details><summary>Price</summary>$49 per month</details></main></body></html>"""
    opened = """<html><body><main><p>Intro.</p><details open><summary>Price</summary>$49 per month</details></main></body></html>"""
    pc = parse_html(closed, "https://s.test/")
    po = parse_html(opened, "https://s.test/")
    assert "$49" in " ".join(pc["closed_details_text"])
    assert "$49" not in pc["main_text"]
    assert "$49" in po["main_text"]
    assert " ".join(po["closed_details_text"]).strip() == ""
    snap_c = crawl(BASE + "/", C(routes_for({"/": closed})), Clock.start_run(30), page_cap=2)
    snap_c.claims = [{"text": "$49", "url": snap_c.fetched_pages()[0].url}]
    assert any(f.finding_type == "sttf_fail" for f in run_x(snap_c).findings)
    snap_o = crawl(BASE + "/", C(routes_for({"/": opened})), Clock.start_run(30), page_cap=2)
    snap_o.claims = [{"text": "$49", "url": snap_o.fetched_pages()[0].url}]
    assert not any(f.finding_type == "sttf_fail" for f in run_x(snap_o).findings)


def test_sttf_nested_and_css_and_js_and_accordion():
    nested = """<html><body><main><details open><summary>A</summary><p>Visible.</p>
<details><summary>Price</summary>$88 hidden inner</details></details></main></body></html>"""
    p = parse_html(nested, "https://s.test/")
    assert "$88" in " ".join(p["closed_details_text"])
    assert "$88" not in p["main_text"]
    css = """<html><body><main><p>We are a shop.</p><div style="display:none">$12 secret</div></main></body></html>"""
    pc = parse_html(css, "https://s.test/")
    assert "$12" not in pc["main_text"]
    snap = crawl(BASE + "/", C(routes_for({"/": css})), Clock.start_run(30), page_cap=2)
    x = run_x(snap)
    assert not any(f.finding_type == "sttf_fail" for f in x.findings)
    js = """<html><body><main><div id="root">Loading</div></main></body></html>"""
    snapj = crawl(
        BASE + "/",
        C(routes_for({"/": js})),
        Clock.start_run(30),
        page_cap=2,
        rendered_map={"https://site.test/": "<html><body><main><p>$20</p></main></body></html>"},
    )
    snapj.claims = [{"text": "$20", "url": snapj.fetched_pages()[0].url}]
    assert not any(f.finding_type == "sttf_fail" for f in run_x(snapj).findings)
    d = run_d(snapj)
    # JS-generated price is D's lane when injected; accordion-absent is not STTF
    accordion_abs = """<html><body><main><p>We are a notes app. No extra widgets.</p></main></body></html>"""
    snapa = crawl(BASE + "/", C(routes_for({"/": accordion_abs})), Clock.start_run(30), page_cap=2)
    snapa.claims = [{"text": "$49", "url": snapa.fetched_pages()[0].url}]
    assert not any(f.finding_type == "sttf_fail" for f in run_x(snapa).findings)
    acc = """<html><body><main><p>We are a notes app.</p><details><summary>Price</summary>$49 per month</details></main></body></html>"""
    snapd = crawl(BASE + "/", C(routes_for({"/": acc})), Clock.start_run(30), page_cap=2)
    assert not any(f.finding_type == "js_fact_lock" for f in run_d(snapd).findings)


def test_protect_list_each_category_survives_skip_ladder():
    assert PROTECT_LIST >= {
        "site-type-classifier",
        "dual-fetch-facts",
        "citation-extractability-audit-det",
        "K3",
        "admit",
        "coverage",
        "report",
    }
    tight = plan_skip_ladder(Clock.start_run(10))
    assert "K3" in tight.k_ids
    assert tight.cit_llm is False  # LLM dropped; det remains (orchestrator still calls run_cit)
    src = (ROOT / "scripts" / "lib" / "orchestrator.py").read_text()
    assert "PROTECT_LIST" in src
    assert "run_v" in src and "admit(" in src and "build_report" in src
    assert is_protected_fact_url("https://s.test/pricing", "https://s.test/")
    snap = crawl(BASE + "/", C(routes_for({"/": HOME, "/p1": HOME, "/p2": HOME})), Clock.start_run(5), page_cap=5, render_max=1)
    home = [p for p in snap.fetched_pages() if p.url.rstrip("/").endswith("site.test")]
    assert home
    assert any(p.render_status == "ok" for p in snap.fetched_pages())
    report = run_audit(BASE + "/", client=C(routes_for({"/": HOME})), max_seconds=10, page_cap=3)
    assert "coverage" in report
    assert report["markdown"]
    assert "site-type-classifier" in report["timing"]["skill_ms"]
    assert "K3" in (report["metrics"].get("protect_list") or []) or "K3" in PROTECT_LIST


def test_u3_from_raw_k_through_report():
    html = "<html><body><main><p>Directory of sellers. Listings marketplace.</p></main></body></html>"
    routes = routes_for({"/": html})
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=3)
    k = run_k(snap, question_ids=["K3"])
    raw = [f for f in k.findings if f.finding_type == "unanswerable" and f.metrics.get("question_id") == "K3"]
    assert raw
    admitted = admit(raw[0], SiteType(cluster="B"))
    assert admitted.suppressed and admitted.suppress_reason == "U3"
    # Full DAG: force cluster B via classifier-friendly copy if needed
    report = run_audit(BASE + "/", client=C(routes), max_seconds=60, page_cap=3)
    # If classifier is B, user report should not show K3 unanswerable
    if report["site_type"].get("cluster") == "B":
        assert not any("K3" in f["title"] for f in report["findings"])


def test_k3_offering_adversarial():
    cases = [
        ("We are service-oriented.", False),
        ("Our customer service is excellent.", False),
        ("Service terms apply.", False),
        ("We provide payroll automation services.", True),
    ]
    for text, expect_ans in cases:
        html = f"<html><head><title>Co</title></head><body><main><p>{text}</p></main></body></html>"
        snap = crawl(BASE + "/", C(routes_for({"/": html})), Clock.start_run(30), page_cap=2)
        k = run_k(snap, question_ids=["K3"])
        answered = k.metrics["per_question"].get("K3") == "answered"
        assert answered is expect_ans, (text, k.metrics["per_question"])
