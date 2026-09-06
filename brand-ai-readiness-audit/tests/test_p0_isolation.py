"""P0 skill failure isolation against the real orchestrator."""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "tests"))

from test_skills_orchestrator import BASE, C, HOME, routes_for
from lib.orchestrator import run_audit
from lib.models import SkillResult


def test_one_skill_failure_yields_partial_report(monkeypatch):
    import lib.orchestrator as orch

    def boom(*_a, **_k):
        raise RuntimeError("classifier exploded")

    monkeypatch.setattr(orch, "run_v", boom)
    report = run_audit(BASE + "/", client=C(routes_for({"/": HOME})), max_seconds=30, page_cap=3)
    ss = report["skill_status"]
    assert "site-type-classifier" in ss["failed_skills"]
    assert report["metrics"]["audit_status"] == "partial"
    assert "SUCCESSFUL SKILLS" in report["markdown"]
    assert "FAILED SKILLS" in report["markdown"]
    assert any(f["error_type"] == "RuntimeError" for f in ss["failures"])
    assert "crawl-access-audit" in ss["successful_skills"]
    assert report["findings"] is not None


def test_multiple_independent_skill_failures(monkeypatch):
    import lib.orchestrator as orch

    monkeypatch.setattr(orch, "run_v", lambda *_a, **_k: (_ for _ in ()).throw(RuntimeError("v")))
    monkeypatch.setattr(orch, "run_c", lambda *_a, **_k: (_ for _ in ()).throw(ValueError("c")))
    report = run_audit(BASE + "/", client=C(routes_for({"/": HOME})), max_seconds=30, page_cap=3)
    ss = report["skill_status"]
    assert "site-type-classifier" in ss["failed_skills"]
    assert "crawl-access-audit" in ss["failed_skills"]
    assert "render-extract-audit" in ss["successful_skills"]


def test_prerequisite_d_failure_skips_cit_k_x(monkeypatch):
    import lib.orchestrator as orch

    def boom(*_a, **_k):
        raise RuntimeError("render exploded")

    monkeypatch.setattr(orch, "run_d", boom)
    report = run_audit(BASE + "/", client=C(routes_for({"/": HOME})), max_seconds=30, page_cap=3)
    ss = report["skill_status"]
    assert "render-extract-audit" in ss["failed_skills"]
    for dep in (
        "citation-extractability-audit",
        "ai-answerability-audit",
        "engagement-handoff-audit",
    ):
        assert dep in ss["skipped_dependent_skills"]
    assert "INCOMPLETE AREAS" in report["markdown"]
    assert "entity-identity-audit" in ss["successful_skills"]


def test_failure_during_external_fetch(monkeypatch):
    import lib.orchestrator as orch

    def boom(*_a, **_k):
        raise OSError("linked fetch exploded")

    monkeypatch.setattr(orch, "run_h", boom)
    html = """<!doctype html><html><head><title>Acme</title>
<script type="application/ld+json">{"@type":"Organization","sameAs":["https://wiki.example/Acme"]}</script>
</head><body><main><p>We are a workspace platform. Price $50</p></main></body></html>"""
    report = run_audit(BASE + "/", client=C(routes_for({"/": html})), max_seconds=280, page_cap=3)
    ss = report["skill_status"]
    assert "corroboration-consistency-audit" in ss["failed_skills"]
    assert "site-type-classifier" in ss["successful_skills"]
    assert report["metrics"]["audit_status"] == "partial"


def test_failure_during_semantic_analysis(monkeypatch):
    import lib.orchestrator as orch

    def boom(*_a, **_k):
        raise RuntimeError("cit semantic exploded")

    monkeypatch.setattr(orch, "run_cit", boom)
    report = run_audit(BASE + "/", client=C(routes_for({"/": HOME})), max_seconds=30, page_cap=3)
    ss = report["skill_status"]
    assert "citation-extractability-audit" in ss["failed_skills"]
    assert "ai-answerability-audit" in ss["successful_skills"]


def test_unexpected_exception_is_structured(monkeypatch):
    import lib.orchestrator as orch

    class Weird(Exception):
        pass

    def boom(*_a, **_k):
        raise Weird("nope")

    monkeypatch.setattr(orch, "run_i", boom)
    report = run_audit(BASE + "/", client=C(routes_for({"/": HOME})), max_seconds=30, page_cap=3)
    fail = [f for f in report["skill_status"]["failures"] if f["skill_id"] == "freshness-audit"][0]
    assert fail["error_type"] == "Weird"
    assert fail["recoverable"] is True
    assert fail["message"]


def test_invalid_seed_still_fatal():
    from lib.orchestrator import validate_seed

    with pytest.raises(ValueError):
        validate_seed("file:///etc/passwd")
