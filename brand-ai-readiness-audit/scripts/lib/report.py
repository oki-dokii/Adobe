"""Dual JSON + Markdown from one object (AB)."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any

from lib.models import Finding, SkillResult, TimingLog


def build_report(
    *,
    site: str,
    findings: list[Finding],
    overflow: list[Finding],
    site_type: dict[str, Any],
    coverage: dict[str, Any],
    limitations: list[str],
    timing: TimingLog,
    metrics: dict[str, Any],
) -> dict[str, Any]:
    user = [f for f in findings if not f.suppressed]
    counts = {
        "total_findings": len(user),
        "critical": sum(1 for f in user if f.severity == "critical"),
        "high": sum(1 for f in user if f.severity == "high"),
        "medium": sum(1 for f in user if f.severity == "medium"),
        "low": sum(1 for f in user if f.severity == "low"),
    }
    handout = [f.to_handout() for f in user]
    proactive_recs = []
    for f in user:
        sa = f.suggested_action
        if hasattr(sa, "proactive") and sa.proactive:
            proactive_recs.append({
                "summary": sa.summary,
                "priority": sa.priority,
                "finding_id": f.id,
                "context": f.title,
            })
    report = {
        "site": site,
        "audited_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "summary": counts,
        "coverage": coverage,
        "site_type": site_type,
        "limitations": limitations,
        "findings": handout,
        "findings_internal": [f.to_internal() for f in user],
        "appendix_overflow": [f.to_handout() for f in overflow],
        "suppressed": [f.to_handout() | {"reason": f.suppress_reason} for f in findings if f.suppressed],
        "proactive_recommendations": proactive_recs,
        "metrics": metrics,
        "timing": {
            "crawl_ms": timing.crawl_ms,
            "render_ms": timing.render_ms,
            "extraction_ms": timing.extraction_ms,
            "skill_ms": timing.skill_ms,
            "llm_ms": timing.llm_ms,
            "llm_calls": timing.llm_calls,
            "external_fetch_ms": timing.external_fetch_ms,
            "merge_ms": timing.merge_ms,
            "report_ms": timing.report_ms,
            "total_ms": timing.total_ms,
            "skipped": timing.skipped,
            "http_requests": timing.http_requests,
            "pages_fetched": timing.pages_fetched,
            "pages_rendered": timing.pages_rendered,
            "render_count": timing.render_count,
            "external_requests": timing.external_requests,
        },
    }
    return report


def render_markdown(report: dict[str, Any]) -> str:
    s = report["summary"]
    bluf = (
        f"{report['site']} audit: {s['critical']} critical, {s['high']} high, "
        f"{s['medium']} medium, {s['low']} low findings "
        f"(coverage: {report.get('coverage', {}).get('pages_fetched', '?')} pages fetched)."
    )
    lines = [
        f"# Brand AI readiness audit — {report['site']}",
        "",
        bluf,
        "",
        "## Coverage",
        f"- Pages fetched: {report.get('coverage', {}).get('pages_fetched')}",
        f"- Pages rendered: {report.get('coverage', {}).get('pages_rendered')}",
        f"- Templates: {report.get('coverage', {}).get('templates')}",
        f"- Stopped: {report.get('coverage', {}).get('stopped_reason')}",
        "",
        "## Site type",
        f"- {json.dumps(report.get('site_type', {}), indent=2)}",
        "",
        "## Limitations",
    ]
    for lim in report.get("limitations") or []:
        lines.append(f"- {lim}")
    lines += ["", "## Findings"]
    for f in report["findings"]:
        sa = f["suggested_action"]
        if isinstance(sa, dict):
            action_text = f"[{sa.get('priority', 'medium').upper()}] {sa.get('summary', '')}"
        else:
            action_text = str(sa)
        lines += [
            f"### {f['id']}: {f['title']}",
            f"- Severity: {f['severity']}",
            f"- Evidence: {f['evidence']}",
            f"- Suggested action: {action_text}",
            "",
        ]
    if report.get("appendix_overflow"):
        lines.append("## Appendix (overflow)")
        for f in report["appendix_overflow"]:
            lines.append(f"- {f['id']}: {f['title']}")
    lines += [
        "",
        "## Evidence status",
        f"- Missing facts: {report.get('missingFacts', 'Not assessed') if isinstance(report.get('missingFacts'), str) else 'See finding objects'}",
        f"- Corroboration: {report.get('corroboration', 'Not assessed') if isinstance(report.get('corroboration'), str) else 'See finding objects'}",
    ]
    ss = report.get("skill_status") or report.get("metrics", {}).get("skill_status") or {}
    if ss:
        lines += [
            "",
            "## Skill outcomes",
            f"- SUCCESSFUL SKILLS: {', '.join(ss.get('successful_skills') or []) or '(none)'}",
            f"- FAILED SKILLS: {', '.join(ss.get('failed_skills') or []) or '(none)'}",
            f"- SKIPPED DEPENDENT SKILLS: {', '.join(ss.get('skipped_dependent_skills') or []) or '(none)'}",
            f"- COMPLETED FINDINGS: {', '.join(ss.get('completed_findings') or []) or '(none)'}",
            f"- INCOMPLETE AREAS: {', '.join(ss.get('incomplete_areas') or []) or '(none)'}",
        ]
    return "\n".join(lines)
