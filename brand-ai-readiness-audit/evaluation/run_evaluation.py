"""Repeatable real-origin evaluation. URLs come only from sites.yaml."""

from __future__ import annotations

import argparse
import json
import statistics
import sys
import time
import traceback
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
sys.path.insert(0, str(ROOT / "evaluation"))

from lib.http import HttpError  # noqa: E402
from lib.orchestrator import run_audit  # noqa: E402
from safety_preflight import SafetyError, assert_production_safety  # noqa: E402

RESULTS = ROOT / "evaluation" / "results"
RUNS = RESULTS / "runs"
FINDINGS = RESULTS / "findings"


def _load_yaml(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    try:
        import yaml  # type: ignore

        return yaml.safe_load(text)
    except ImportError:
        pass
    # Minimal subset parser for this file's shape (no nested lists of maps beyond sites).
    import json as _json
    from subprocess import check_output

    # Prefer stdlib-free fallback: convert via python if ruamel missing.
    try:
        import yaml  # type: ignore
    except ImportError:
        data = _simple_sites_yaml(text)
        return data
    return yaml.safe_load(text)


def _simple_sites_yaml(text: str) -> dict:
    """Enough for evaluation/sites.yaml without PyYAML."""
    defaults: dict[str, Any] = {}
    sites: list[dict[str, Any]] = []
    cur: dict[str, Any] | None = None
    mode = None
    list_key = None
    for raw in text.splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        indent = len(raw) - len(raw.lstrip(" "))
        line = raw.strip()
        if indent == 0 and line.startswith("defaults:"):
            mode = "defaults"
            continue
        if indent == 0 and line.startswith("sites:"):
            mode = "sites"
            continue
        if mode == "defaults" and ":" in line and indent == 2:
            k, v = line.split(":", 1)
            defaults[k.strip()] = int(v.strip()) if v.strip().isdigit() else v.strip()
            continue
        if mode == "sites" and line.startswith("- id:"):
            cur = {"id": line.split(":", 1)[1].strip(), "expected": [], "tags": []}
            sites.append(cur)
            list_key = None
            continue
        if cur is None:
            continue
        if line.startswith("- ") and list_key:
            cur[list_key].append(line[2:].strip())
            continue
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        k, v = k.strip(), v.strip()
        if k in ("expected", "tags"):
            list_key = k
            if v.startswith("[") and v.endswith("]"):
                cur[k] = [x.strip() for x in v[1:-1].split(",") if x.strip()]
                list_key = None
            else:
                cur[k] = []
            continue
        list_key = None
        if v in ("true", "false"):
            cur[k] = v == "true"
        elif v.isdigit():
            cur[k] = int(v)
        else:
            cur[k] = v
    return {"defaults": defaults, "sites": sites}


def classify_failure(exc: BaseException | None, report: dict | None) -> tuple[str, str]:
    if exc is None and report:
        cov = report.get("coverage") or {}
        status = (report.get("metrics") or {}).get("audit_status") or "ok"
        if cov.get("stopped_reason") == "robots":
            return "ROBOTS", f"robots_status={cov.get('robots_status')}"
        if cov.get("stopped_reason") == "unreachable":
            return "NETWORK", str(cov.get("fetch_error") or "unreachable")
        if status == "partial":
            fails = (report.get("skill_status") or {}).get("failed_skills") or []
            if fails:
                return "SKILL", ",".join(fails)
            return "ORCHESTRATOR", "partial"
        return "OK", ""
    msg = f"{type(exc).__name__}: {exc}" if exc else "unknown"
    blob = msg.lower()
    if "ssrf" in blob:
        return "SSRF", msg
    if "robot" in blob:
        return "ROBOTS", msg
    if "timeout" in blob or "timed out" in blob:
        return "TIMEOUT", msg
    if "dns" in blob or "unreachable" in blob or "ssl" in blob or "tls" in blob:
        return "NETWORK", msg
    return "UNKNOWN", msg


def extract_metrics(site: dict, phase: str, report: dict | None, exc: BaseException | None, wall_ms: float) -> dict:
    t = (report or {}).get("timing") or {}
    cov = (report or {}).get("coverage") or {}
    summary = (report or {}).get("summary") or {}
    ss = (report or {}).get("skill_status") or (report or {}).get("metrics", {}).get("skill_status") or {}
    metrics_block = (report or {}).get("metrics") or {}
    cause, detail = classify_failure(exc, report)
    success = exc is None and report is not None
    audit_status = metrics_block.get("audit_status") if success else "failed"
    if success and cov.get("stopped_reason") in ("robots", "unreachable") and not (report.get("findings") or []):
        # still a completed orchestrator run
        audit_status = metrics_block.get("audit_status") or "ok"
    return {
        "site_id": site["id"],
        "site": site["url"],
        "site_type": site.get("site_type"),
        "tags": site.get("tags") or [],
        "phase": phase,
        "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "success": success,
        "audit_status": audit_status,
        "failure_class": cause if not success or audit_status == "failed" else ("SKILL" if audit_status == "partial" else "OK"),
        "failure_detail": detail,
        "runtime": {
            "total_ms": t.get("total_ms", wall_ms),
            "wall_ms": wall_ms,
            "crawl_ms": t.get("crawl_ms"),
            "render_ms": t.get("render_ms"),
            "extraction_ms": t.get("extraction_ms"),
            "skill_ms": t.get("skill_ms") or {},
            "external_fetch_ms": t.get("external_fetch_ms"),
            "report_ms": t.get("report_ms"),
            "merge_ms": t.get("merge_ms"),
        },
        "counts": {
            "http_requests": t.get("http_requests") if t.get("http_requests") is not None else cov.get("http_requests"),
            "pages_crawled": cov.get("pages_fetched"),
            "pages_rendered": t.get("pages_rendered") if t.get("pages_rendered") is not None else cov.get("pages_rendered"),
            "render_count": t.get("render_count") if t.get("render_count") is not None else cov.get("render_count"),
            "llm_calls": t.get("llm_calls"),
            "external_fetches": t.get("external_requests"),
            "findings": summary.get("total_findings"),
            "critical": summary.get("critical"),
            "high": summary.get("high"),
            "medium": summary.get("medium"),
            "low": summary.get("low"),
            "templates": cov.get("templates"),
        },
        "robots_status": (report or {}).get("robots_status") or cov.get("robots_status"),
        "timeouts": cov.get("timeout_count"),
        "redirects": cov.get("redirect_hops_total"),
        "ssrf_blocks": cov.get("ssrf_blocks"),
        "stopped_reason": cov.get("stopped_reason"),
        "failed_skills": ss.get("failed_skills") or [],
        "skipped_skills": list(dict.fromkeys((ss.get("skipped_dependent_skills") or []) + list(t.get("skipped") or []))),
        "warnings": (report or {}).get("limitations") or [],
        "skill_by_status": ss.get("by_skill") or {},
        "classified_site_type": (report or {}).get("site_type") or {},
        "run_id": (report or {}).get("run_id"),
        "error": None if exc is None else f"{type(exc).__name__}: {exc}",
    }


def run_one(site: dict, phase: str, max_seconds: float, page_cap: int) -> dict:
    RUNS.mkdir(parents=True, exist_ok=True)
    FINDINGS.mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    report = None
    exc = None
    try:
        report = run_audit(site["url"], max_seconds=max_seconds, page_cap=page_cap)
    except (HttpError, ValueError, OSError, Exception) as e:
        exc = e
    wall_ms = (time.time() - t0) * 1000
    metrics = extract_metrics(site, phase, report, exc, wall_ms)
    stem = f"{site['id']}_{phase}"
    (RUNS / f"{stem}.json").write_text(json.dumps(metrics, indent=2, default=str), encoding="utf-8")
    if report:
        slim = {
            "site": report.get("site"),
            "summary": report.get("summary"),
            "findings": report.get("findings"),
            "findings_internal": report.get("findings_internal"),
            "suppressed": report.get("suppressed"),
            "coverage": report.get("coverage"),
            "site_type": report.get("site_type"),
            "skill_status": report.get("skill_status"),
            "limitations": report.get("limitations"),
            "timing": report.get("timing"),
            "metrics": {k: v for k, v in (report.get("metrics") or {}).items() if k != "answerability" or True},
        }
        (FINDINGS / f"{stem}.json").write_text(json.dumps(slim, indent=2, default=str), encoding="utf-8")
        md = report.get("markdown") or ""
        (ROOT / "evaluation" / "reports" / f"{stem}.md").write_text(md, encoding="utf-8")
    elif exc:
        (RUNS / f"{stem}.exc.txt").write_text(traceback.format_exc(), encoding="utf-8")
    return metrics


def summarize(rows: list[dict]) -> dict:
    ok = [r for r in rows if r.get("success")]
    totals = [r["runtime"]["total_ms"] or 0 for r in ok]
    totals.sort()

    def pct(xs, p):
        if not xs:
            return None
        k = min(len(xs) - 1, max(0, int(round((p / 100) * (len(xs) - 1)))))
        return xs[k]

    by_type: dict[str, list[dict]] = {}
    for r in rows:
        by_type.setdefault(r.get("site_type") or "unknown", []).append(r)

    dominant = []
    for r in ok:
        parts = {
            "crawl_ms": r["runtime"].get("crawl_ms") or 0,
            "render_ms": r["runtime"].get("render_ms") or 0,
            "skills_ms": sum((r["runtime"].get("skill_ms") or {}).values()),
            "external_fetch_ms": r["runtime"].get("external_fetch_ms") or 0,
            "report_ms": r["runtime"].get("report_ms") or 0,
        }
        top = max(parts, key=parts.get)
        dominant.append({"site_id": r["site_id"], "phase": r["phase"], "dominant": top, "share_ms": parts[top]})

    return {
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "n_runs": len(rows),
        "n_success": len(ok),
        "n_partial": sum(1 for r in rows if r.get("audit_status") == "partial"),
        "n_failed": sum(1 for r in rows if not r.get("success")),
        "runtime": {
            "fastest_ms": min(totals) if totals else None,
            "slowest_ms": max(totals) if totals else None,
            "median_ms": statistics.median(totals) if totals else None,
            "p90_ms": pct(totals, 90),
            "mean_ms": statistics.mean(totals) if totals else None,
            "under_300s": sum(1 for x in totals if x < 300_000),
            "n_with_runtime": len(totals),
        },
        "by_site_type": {
            k: {
                "runs": len(v),
                "success": sum(1 for x in v if x.get("success")),
                "partial": sum(1 for x in v if x.get("audit_status") == "partial"),
            }
            for k, v in by_type.items()
        },
        "dominant_component": dominant,
        "runs": rows,
    }


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--sites", default=str(ROOT / "evaluation" / "sites.yaml"))
    p.add_argument("--only", default="", help="comma-separated site ids")
    p.add_argument("--skip-warm", action="store_true")
    p.add_argument("--max-seconds", type=float, default=None)
    p.add_argument("--page-cap", type=int, default=None)
    p.add_argument("--stress-only", action="store_true")
    args = p.parse_args(argv)

    (ROOT / "evaluation" / "reports").mkdir(parents=True, exist_ok=True)
    RUNS.mkdir(parents=True, exist_ok=True)
    FINDINGS.mkdir(parents=True, exist_ok=True)

    print("Safety preflight…", flush=True)
    safety = assert_production_safety()
    (RESULTS / "safety_preflight.json").write_text(json.dumps(safety, indent=2), encoding="utf-8")
    print("Safety preflight OK", json.dumps(safety), flush=True)

    cfg = _load_yaml(Path(args.sites))
    defaults = cfg.get("defaults") or {}
    max_seconds = args.max_seconds if args.max_seconds is not None else float(defaults.get("max_seconds", 280))
    page_cap = args.page_cap if args.page_cap is not None else int(defaults.get("page_cap", 40))
    only = {x.strip() for x in args.only.split(",") if x.strip()}
    sites = []
    for s in cfg.get("sites") or []:
        if not s.get("enabled", True):
            continue
        if only and s["id"] not in only:
            continue
        if args.stress_only and "stress" not in (s.get("tags") or []):
            continue
        sites.append(s)
    if not sites:
        print("No sites enabled", file=sys.stderr)
        return 2

    rows = []
    for site in sites:
        host = urlparse(site["url"]).hostname
        print(f"\n=== COLD {site['id']} {site['url']} ===", flush=True)
        rows.append(run_one(site, "cold", max_seconds, page_cap))
        print(json.dumps({k: rows[-1][k] for k in ("success", "audit_status", "failure_class", "runtime", "counts", "robots_status")}, default=str), flush=True)
        if not args.skip_warm:
            print(f"=== WARM {site['id']} ===", flush=True)
            rows.append(run_one(site, "warm", max_seconds, page_cap))
            print(json.dumps({k: rows[-1][k] for k in ("success", "audit_status", "runtime", "counts")}, default=str), flush=True)

    summary = summarize(rows)
    summary["safety"] = safety
    summary["config"] = {"max_seconds": max_seconds, "page_cap": page_cap, "n_sites": len(sites)}
    (RESULTS / "summary.json").write_text(json.dumps(summary, indent=2, default=str), encoding="utf-8")
    print("\nWrote", RESULTS / "summary.json", flush=True)
    rt = summary["runtime"]
    print(
        f"success={summary['n_success']}/{summary['n_runs']} partial={summary['n_partial']} "
        f"median_ms={rt['median_ms']} slowest_ms={rt['slowest_ms']} under_300s={rt['under_300s']}/{rt['n_with_runtime']}",
        flush=True,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
