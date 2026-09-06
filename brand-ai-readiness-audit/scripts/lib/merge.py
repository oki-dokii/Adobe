"""Dedup, parent/child RCA, template rollup, severity max, cap 15."""

from __future__ import annotations

from collections import defaultdict

from lib.models import Finding

GATE_ORDER = [
    "robots_fail_closed",
    "ai_token_disallow",
    "orphan",
    "trap_facet",
    "canonical_dup",
    "js_fact_lock",
    "interaction_insert",
    "d41_hidden",
    "pdf_only_fact",
    "image_locked_fact",
    "qualifier_split",
    "table_no_th",
    "schema_visible_mismatch",
    "unanswerable",
    "wrong_page",
    "collision_risk",
    "sameas_404",
    "date_divergence",
    "on_site_fact_conflict",
    "linked_contradiction",
    "sttf_fail",
    "viewport_identity",
    "scent_break",
    "ymy_disclosure",
    "comparison_self_win",
    "flagship_gap",
    "expected_gap",
    "uncorroborated",
    "coverage_statement",
]

SEV_RANK = {"critical": 4, "high": 3, "medium": 2, "low": 1}


def merge_findings(findings: list[Finding]) -> list[Finding]:
    by_key: dict[str, Finding] = {}
    for f in findings:
        if f.finding_key in by_key:
            a = by_key[f.finding_key]
            a.affected_urls = list(dict.fromkeys(a.affected_urls + f.affected_urls))
            a.affected_pages_count = max(a.affected_pages_count, len(a.affected_urls))
            a.contributing_skills = list(dict.fromkeys(a.contributing_skills + f.contributing_skills))
            if SEV_RANK.get(f.severity, 0) > SEV_RANK.get(a.severity, 0):
                a.severity = f.severity
            # min confidence
            order = ["low", "medium", "high"]
            a.confidence = order[min(order.index(a.confidence) if a.confidence in order else 1, order.index(f.confidence) if f.confidence in order else 1)]
        else:
            by_key[f.finding_key] = f
    merged = list(by_key.values())

    # Template rollup already encoded in finding_key via template_id
    merged = _attach_parents(merged)
    merged = _drop_redundant_children(merged)
    return merged


def _attach_parents(findings: list[Finding]) -> list[Finding]:
    by_url: dict[str, list[Finding]] = defaultdict(list)
    for f in findings:
        if f.suppressed:
            continue
        for u in f.affected_urls or [""]:
            by_url[u].append(f)
    for url, group in by_url.items():
        present = {f.finding_type: f for f in group}
        if "js_fact_lock" in present:
            parent = present["js_fact_lock"]
            for child_t in ("unanswerable", "qualifier_split", "sttf_fail"):
                if child_t in present and present[child_t].id != parent.id:
                    c = present[child_t]
                    c.parent_id = parent.id
                    c.causal_role = "amplifier"
        # Multiple earlier-gate parents: first in GATE_ORDER wins
        typed = {f.finding_type: f for f in group}
        for parent_t in GATE_ORDER:
            if parent_t not in typed:
                continue
            parent = typed[parent_t]
            if parent_t not in ("js_fact_lock", "robots_fail_closed", "interaction_insert"):
                continue
            for c in group:
                if c.id == parent.id or c.parent_id:
                    continue
                if GATE_ORDER.index(c.finding_type) if c.finding_type in GATE_ORDER else 99 > GATE_ORDER.index(parent_t):
                    if c.finding_type in ("unanswerable", "qualifier_split", "sttf_fail"):
                        c.parent_id = parent.id
                        c.causal_role = "amplifier"
        if "robots_fail_closed" in present:
            parent = present["robots_fail_closed"]
            for c in group:
                if c.id != parent.id:
                    c.parent_id = parent.id
                    c.causal_role = "amplifier"
    return findings


def _drop_redundant_children(findings: list[Finding]) -> list[Finding]:
    by_id = {f.id: f for f in findings}
    out = []
    for f in findings:
        if f.suppressed:
            out.append(f)
            continue
        if f.parent_id and f.parent_id in by_id:
            p = by_id[f.parent_id]
            if SEV_RANK.get(p.severity, 0) >= 3 and f.causal_role == "amplifier":
                # Same-URL amplifier of a High/Critical earlier-gate finding is not a
                # second user-facing Critical, even across skills. Keep evidence + parent_id.
                different_action = (
                    f.finding_type not in ("unanswerable", "qualifier_split", "sttf_fail")
                    and p.finding_type == "js_fact_lock"
                )
                if not different_action:
                    f.suppressed = True
                    f.suppress_reason = "T_redundant_child"
                    f.admission = {"emitted": "suppressed", "rule": "T_parent"}
        out.append(f)
    return out


def rank_user_facing(findings: list[Finding], cap: int = 15) -> tuple[list[Finding], list[Finding]]:
    emitted = [f for f in findings if not f.suppressed]
    emitted.sort(key=lambda f: (-SEV_RANK.get(f.severity, 0), GATE_ORDER.index(f.finding_type) if f.finding_type in GATE_ORDER else 99))
    return emitted[:cap], emitted[cap:]
