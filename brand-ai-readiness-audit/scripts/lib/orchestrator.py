"""Entrypoint orchestrator — locked DAG, skip-ladder, admit, merge, report."""

from __future__ import annotations

import argparse
import json
import sys
import time
import traceback
from pathlib import Path
from typing import Callable, Optional
from urllib.parse import urlparse

from lib.admit import admit
from lib.business_impact import annotate as annotate_business_impact
from lib.clock import PROTECT_LIST, Clock, plan_skip_ladder
from lib.crawl import crawl
from lib.findings import reset_ids
from lib.http import HttpClient, HttpError
from lib.merge import merge_findings, rank_user_facing
from lib.models import CrawlSnapshot, Finding, SkillError, SkillFailure, SkillResult, TimingLog
from lib.report import build_report, render_markdown
from lib.skill_c import run as run_c
from lib.skill_cit import run as run_cit
from lib.skill_d import run as run_d
from lib.skill_ent import run as run_ent
from lib.skill_h import run as run_h
from lib.skill_i import run as run_i
from lib.skill_k import run as run_k
from lib.skill_v import run as run_v
from lib.skill_x import run as run_x
from lib.url import has_userinfo, is_blocked_ip, scheme_ok

ROOT = Path(__file__).resolve().parents[2]

# Independent after crawl: V and C. D before CIT/K/X. H independent of K.
PREREQS: dict[str, list[str]] = {
    "citation-extractability-audit": ["render-extract-audit"],
    "ai-answerability-audit": ["render-extract-audit"],
    "engagement-handoff-audit": ["render-extract-audit"],
}

DEPENDENTS: dict[str, list[str]] = {
    "render-extract-audit": [
        "citation-extractability-audit",
        "ai-answerability-audit",
        "engagement-handoff-audit",
    ],
}


def validate_seed(url: str) -> None:
    if not scheme_ok(url):
        raise ValueError("URL must be http(s)")
    if has_userinfo(url):
        raise ValueError("URL must not contain credentials")
    host = urlparse(url).hostname or ""
    try:
        import ipaddress

        ipaddress.ip_address(host)
        if is_blocked_ip(host):
            raise ValueError("SSRF_BLOCKED seed")
    except ValueError as e:
        if "SSRF" in str(e):
            raise
        if str(e) == "SSRF_BLOCKED seed":
            raise


def _failure_result(skill_id: str, run_id: str, exc: BaseException, affected: list[str]) -> SkillResult:
    err = SkillError(
        code="SKILL_FAILED",
        message=str(exc) or type(exc).__name__,
        recoverable=True,
        error_type=type(exc).__name__,
        dependencies_affected=affected,
    )
    return SkillResult(
        skill_id,
        run_id,
        status="failed",
        findings=[],
        metrics={"error_type": type(exc).__name__},
        errors=[err],
    )


def run_audit(
    url: str,
    *,
    max_seconds: float = 280.0,
    client: Optional[HttpClient] = None,
    rendered_map: Optional[dict[str, str]] = None,
    page_cap: int = 40,
    render_max: int = 10,  # skip-ladder default; override to 40 for benchmark
) -> dict:
    if url and "://" not in url and not url.startswith(("//", "file:", "ftp:", "javascript:", "data:")):
        url = "https://" + url.strip()
    reset_ids()
    validate_seed(url)
    clock = Clock.start_run(max_seconds)
    http = client or HttpClient()
    timing = TimingLog()
    t_all = time.time()
    plan = plan_skip_ladder(clock, render_max_default=render_max)
    # PROTECT_LIST is consulted for every skip decision
    _ = PROTECT_LIST

    snapshot = crawl(
        url,
        http,
        clock,
        page_cap=page_cap,
        rendered_map=rendered_map,
        render_max=plan.render_max,
    )
    timing.crawl_ms = snapshot.timing.crawl_ms
    timing.render_ms = snapshot.timing.render_ms
    timing.pages_fetched = snapshot.timing.pages_fetched
    timing.pages_rendered = snapshot.timing.pages_rendered
    timing.render_count = snapshot.timing.render_count
    snapshot.deadline_ts = clock.deadline_ts

    # Re-plan after crawl so remaining time is honest
    plan = plan_skip_ladder(clock, render_max_default=plan.render_max)
    timing.skipped.extend(plan.skipped)
    snapshot.skipped_skills.extend(s for s in plan.skipped if s not in snapshot.skipped_skills)

    results: dict[str, SkillResult] = {}
    skill_outcomes: dict[str, str] = {}

    def record_failure(name: str, r: SkillResult) -> None:
        affected = DEPENDENTS.get(name, [])
        for err in r.errors:
            snapshot.skill_failures.append(
                SkillFailure(
                    skill_id=name,
                    status=r.status,
                    error_type=err.error_type or err.code,
                    message=err.message,
                    recoverable=err.recoverable,
                    dependencies_affected=err.dependencies_affected or affected,
                )
            )
        snapshot.limitations.append(f"{name} failed ({r.errors[0].error_type if r.errors else 'error'}); continuing with a PARTIAL audit.")
        snapshot.errors.append({"code": "SKILL_FAILED", "url": name, "message": r.errors[0].message if r.errors else ""})

    def timed(name: str, fn: Callable[[], SkillResult], *, prereqs: Optional[list[str]] = None) -> SkillResult:
        prereqs = prereqs if prereqs is not None else PREREQS.get(name, [])
        missing = [p for p in prereqs if results.get(p) and results[p].status == "failed"]
        t0 = time.time()
        if missing:
            affected = DEPENDENTS.get(missing[0], [name])
            r = SkillResult(
                name,
                snapshot.run_id,
                status="skipped",
                findings=[],
                metrics={"skipped_because": missing},
                errors=[
                    SkillError(
                        code="PREREQ_FAILED",
                        message=f"skipped; prerequisite failed: {missing}",
                        recoverable=True,
                        error_type="PREREQ_FAILED",
                        dependencies_affected=affected,
                    )
                ],
            )
            r.timing_ms = (time.time() - t0) * 1000
            r.deadline_honored = clock.honor(0.5)
            timing.skill_ms[name] = r.timing_ms
            results[name] = r
            skill_outcomes[name] = "skipped_dependent"
            snapshot.skipped_skills.append(name)
            snapshot.limitations.append(f"{name} skipped because {missing} failed.")
            snapshot.skill_failures.append(
                SkillFailure(
                    skill_id=name,
                    status="skipped",
                    error_type="PREREQ_FAILED",
                    message=f"prerequisite failed: {missing}",
                    recoverable=True,
                    dependencies_affected=list(missing),
                )
            )
            return r
        try:
            r = fn()
        except Exception as e:
            r = _failure_result(name, snapshot.run_id, e, DEPENDENTS.get(name, []))
            r.metrics["traceback"] = traceback.format_exc(limit=8)
            record_failure(name, r)
            skill_outcomes[name] = "failed"
        else:
            if r.status == "failed":
                record_failure(name, r)
                skill_outcomes[name] = "failed"
            else:
                skill_outcomes[name] = "ok"
        dt = (time.time() - t0) * 1000
        r.timing_ms = dt
        timing.skill_ms[name] = dt
        r.deadline_honored = clock.honor(0.5)
        results[name] = r
        return r

    rv = timed("site-type-classifier", lambda: run_v(snapshot))
    rc = timed("crawl-access-audit", lambda: run_c(snapshot))

    # Never drop V, CIT det, K3, admit, coverage, report
    allow_cit_llm = plan.cit_llm
    k_ids = list(plan.k_ids)
    if "K3" not in k_ids:
        k_ids = ["K3"] + k_ids
    run_h_ok = plan.run_h
    if not run_h_ok:
        snapshot.skipped_skills.append("corroboration-consistency-audit")
        snapshot.limitations.append("H extra GETs skipped (skip-ladder T_h).")

    rd = timed("render-extract-audit", lambda: run_d(snapshot))
    rcit = timed("citation-extractability-audit", lambda: run_cit(snapshot, allow_llm=allow_cit_llm))
    rent = timed(
        "entity-identity-audit",
        lambda: run_ent(snapshot, client=http if allow_cit_llm else None, fetch_sameas=run_h_ok),
    )
    ri = timed("freshness-audit", lambda: run_i(snapshot))
    rk = timed("ai-answerability-audit", lambda: run_k(snapshot, question_ids=k_ids))
    rx = timed("engagement-handoff-audit", lambda: run_x(snapshot))
    if run_h_ok:
        rh = timed("corroboration-consistency-audit", lambda: run_h(snapshot, client=http))
    else:
        rh = None
        skill_outcomes["corroboration-consistency-audit"] = "skipped_budget"

    t_merge = time.time()
    all_findings: list[Finding] = []
    for r in (rv, rc, rd, rcit, rent, ri, rk, rx, rh):
        if r:
            all_findings.extend(r.findings)
    fetched = float((snapshot.coverage or {}).get("pages_fetched") or 0)
    est = float((snapshot.coverage or {}).get("estimated_pages") or 0)
    coverage_pct = (fetched / est) if est else None
    admitted = [
        admit(f, snapshot.site_type, pages_verified=max(2, int(fetched)), coverage_pct=coverage_pct)
        for f in all_findings
    ]
    merged = merge_findings(admitted)
    user, overflow = rank_user_facing(merged, cap=15)
    timing.merge_ms = (time.time() - t_merge) * 1000

    t_rep = time.time()
    timing.total_ms = (time.time() - t_all) * 1000
    timing.http_requests = getattr(http, "request_count", snapshot.timing.http_requests)
    timing.external_requests = snapshot.timing.external_requests
    timing.external_fetch_ms = snapshot.timing.external_fetch_ms
    timing.llm_calls = snapshot.timing.llm_calls
    snapshot.timing = timing
    k_metrics = rk.metrics if rk else {}
    successful = [k for k, v in skill_outcomes.items() if v == "ok"]
    failed = [k for k, v in skill_outcomes.items() if v == "failed"]
    skipped_dep = [k for k, v in skill_outcomes.items() if v == "skipped_dependent"]
    incomplete = list(dict.fromkeys(failed + skipped_dep + list(snapshot.skipped_skills)))
    skill_status = {
        "successful_skills": successful,
        "failed_skills": failed,
        "skipped_dependent_skills": skipped_dep,
        "completed_findings": [f.id for f in user],
        "incomplete_areas": incomplete,
        "failures": [sf.__dict__ for sf in snapshot.skill_failures],
        "by_skill": {k: v.status for k, v in results.items()},
    }
    report = build_report(
        site=urlparse(url).hostname or url,
        findings=user + [f for f in merged if f.suppressed],
        overflow=overflow,
        site_type=snapshot.site_type.__dict__,
        coverage=snapshot.coverage,
        limitations=snapshot.limitations,
        timing=timing,
        metrics={
            "answerability": k_metrics,
            "skills": {k: v.status for k, v in results.items()},
            "skill_status": skill_status,
            "audit_status": "partial" if failed or skipped_dep else "ok",
            "protect_list": sorted(PROTECT_LIST),
        },
    )
    report["findings"] = [f.to_handout() for f in user]
    # Presentation-only enrichment; no new findings or fabricated estimates.
    report.update(annotate_business_impact(user, int(fetched)))
    gap_findings = [
        f for result in (rd, rcit, rk)
        for f in result.findings
        if f.severity in ("high", "critical")
    ]
    report["missingFacts"] = (
        [f.to_handout() for f in gap_findings]
        if gap_findings
        else "No High/Critical answerability, extractability, or render gaps detected"
    )
    if rh is None:
        report["corroboration"] = "Corroboration checks not run (budget skip)"
    elif rh.findings:
        report["corroboration"] = [f.to_handout() for f in rh.findings]
    else:
        report["corroboration"] = "No corroboration issues detected"
    # Serialize enriched metrics as well as the canonical internal Finding shape.
    report["findings_internal"] = [f.to_internal() for f in user]
    report["skill_status"] = skill_status
    report["markdown"] = render_markdown(report)
    timing.report_ms = (time.time() - t_rep) * 1000
    report["timing"]["report_ms"] = timing.report_ms
    report["timing"]["total_ms"] = timing.total_ms
    report["timing"]["http_requests"] = timing.http_requests
    report["timing"]["pages_fetched"] = timing.pages_fetched
    report["timing"]["pages_rendered"] = timing.pages_rendered
    report["timing"]["render_count"] = timing.render_count
    report["timing"]["external_requests"] = timing.external_requests
    report["run_id"] = snapshot.run_id
    report["robots_status"] = snapshot.robots_status
    report["errors"] = snapshot.errors
    report["limitations"] = snapshot.limitations
    return report


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description="Brand AI readiness audit (read-only)")
    p.add_argument("--url", required=True)
    p.add_argument("--max-seconds", type=float, default=280.0)
    p.add_argument("--page-cap", type=int, default=40)
    p.add_argument("--render-max", type=int, default=10)
    p.add_argument("--json-out", default="")
    p.add_argument("--md-out", default="")
    args = p.parse_args(argv)
    try:
        report = run_audit(args.url, max_seconds=args.max_seconds, page_cap=args.page_cap, render_max=args.render_max)
    except (ValueError, HttpError) as e:
        print(str(e), file=sys.stderr)
        return 2
    js = json.dumps({k: v for k, v in report.items() if k != "markdown"}, indent=2, default=str)
    md = report["markdown"]
    if args.json_out:
        Path(args.json_out).write_text(js, encoding="utf-8")
    if args.md_out:
        Path(args.md_out).write_text(md, encoding="utf-8")
    if not args.json_out and not args.md_out:
        print(md)
    return 0


if __name__ == "__main__":
    sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "scripts"))
    raise SystemExit(main())
