from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from lib.admit import admit
from lib.findings import make_finding, reset_ids
from lib.merge import merge_findings, rank_user_facing
from lib.models import SiteType, SuggestedAction


def f(**kw):
    reset_ids()
    return make_finding(
        skill_id=kw.get("skill", "crawl-access-audit"),
        finding_type=kw.get("ft", "orphan"),
        title=kw.get("title", "x"),
        severity=kw.get("sev", "medium"),
        evidence=kw.get("ev", "evidence here"),
        action=SuggestedAction(summary="do"),
        urls=kw.get("urls", ["https://s.example/a"]),
    )


def test_u1_not_missing_schema_critical():
    # schema_visible_mismatch with mismatch evidence is emitted
    x = f(ft="schema_visible_mismatch", ev="schema=$10 visible=$12 mismatch", title="JSON-LD mismatch")
    y = admit(x, SiteType(cluster="F"))
    assert not y.suppressed


def test_vf_saas_quote_suppresses_price_unanswerable():
    x = f(ft="unanswerable", title="Closed-book K6 price", ev="K6 contact for quote", skill="ai-answerability-audit")
    y = admit(x, SiteType(cluster="F", saas=True, ecommerce=False))
    assert y.suppressed and y.suppress_reason == "V-F"


def test_u12_non_citation():
    x = f(title="Page not cited by ChatGPT", ev="zero citations in 2 queries")
    y = admit(x, SiteType())
    assert y.suppressed and y.suppress_reason == "U12"


def test_wikipedia_absence_not_high():
    x = f(ft="uncorroborated", title="No Wikipedia page", ev="missing wikipedia", sev="high")
    y = admit(x, SiteType())
    assert y.severity == "low"


def test_parent_child_js_lock():
    reset_ids()
    a = make_finding(
        skill_id="render-extract-audit",
        finding_type="js_fact_lock",
        title="js",
        severity="critical",
        evidence="raw vs rendered",
        action=SuggestedAction(summary="ssr"),
        urls=["https://s.example/p"],
    )
    b = make_finding(
        skill_id="ai-answerability-audit",
        finding_type="unanswerable",
        title="no price",
        severity="critical",
        evidence="K6",
        action=SuggestedAction(summary="add"),
        urls=["https://s.example/p"],
    )
    m = merge_findings([a, b])
    child = [x for x in m if x.finding_type == "unanswerable"][0]
    assert child.parent_id == a.id
    assert child.causal_role == "amplifier"


def test_template_clones_same_key():
    reset_ids()
    xs = []
    for i in range(47):
        xs.append(
            make_finding(
                skill_id="citation-extractability-audit",
                finding_type="table_no_th",
                title="table",
                severity="medium",
                evidence="has_th=false",
                action=SuggestedAction(summary="th"),
                urls=[f"https://s.example/p/{i}"],
                template_id="t-1",
            )
        )
    m = merge_findings(xs)
    tables = [x for x in m if x.finding_type == "table_no_th"]
    assert len(tables) == 1
    assert tables[0].affected_pages_count >= 47


def test_cap_15():
    reset_ids()
    xs = [
        make_finding(
            skill_id="x",
            finding_type="scent_break",
            title=str(i),
            severity="low",
            evidence="e",
            action=SuggestedAction(summary="a"),
            urls=[f"https://s.example/{i}"],
        )
        for i in range(20)
    ]
    u, o = rank_user_facing(xs, cap=15)
    assert len(u) == 15
    assert len(o) == 5
