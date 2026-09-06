"""P0 render budget + runtime instrumentation on the production crawl path."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from lib.clock import Clock
from lib.crawl import crawl
from lib.orchestrator import run_audit
from lib.render import expand_noscript
from test_skills_orchestrator import BASE, C, HOME, routes_for


def test_render_max_enforced():
    pages = {f"/p{i}": f"<html><body><main><p>We are a workspace platform page {i}. Price $1</p></main></body></html>" for i in range(8)}
    pages["/"] = HOME
    routes = routes_for(pages)
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=9, render_max=2)
    rendered = [p for p in snap.fetched_pages() if p.render_status == "ok"]
    skipped = [p for p in snap.fetched_pages() if p.render_status == "skipped"]
    assert snap.coverage["render_max"] == 2
    assert snap.coverage["render_count"] <= 2
    assert snap.timing.render_count <= 2
    assert snap.coverage["protected_render_exceptions"] == 0
    assert skipped or len(rendered) <= 2
    assert snap.timing.render_ms >= 0


def test_dual_fetch_noscript_on_production_path():
    html = """<html><body><main><p>We are a workspace platform.</p>
<noscript><p>Plans start at $77 per month</p></noscript></main></body></html>"""
    assert "$77" in expand_noscript(html)
    routes = routes_for({"/": html})
    snap = crawl(BASE + "/", C(routes), Clock.start_run(30), page_cap=2, render_max=10)
    page = snap.fetched_pages()[0]
    assert page.render_status == "ok"
    assert "$77" not in page.main_text
    assert "$77" in (page.rendered_html or "")


def test_audit_timing_instrumentation():
    report = run_audit(BASE + "/", client=C(routes_for({"/": HOME})), max_seconds=60, page_cap=5)
    t = report["timing"]
    for key in (
        "total_ms",
        "crawl_ms",
        "render_ms",
        "skill_ms",
        "http_requests",
        "pages_fetched",
        "pages_rendered",
        "render_count",
        "external_requests",
        "llm_calls",
    ):
        assert key in t
    assert t["llm_calls"] == 0
    assert t["http_requests"] >= 1
    assert t["pages_fetched"] >= 1
    assert t["pages_rendered"] >= 1
    assert t["total_ms"] >= 0
    # Do not claim sub-5-minute live readiness from this fixture
    assert t["total_ms"] < 60_000
