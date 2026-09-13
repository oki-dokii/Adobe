---
name: audit-orchestrator
description: Run the read-only, shared-snapshot Brand AI readiness audit and emit the final JSON report.
license: MIT
---

## When to use
Use when given one public HTTP(S) site or domain and a complete cross-dimension audit is required. It composes specialized skills; it does not replace their checks.

## Inputs
One `url`/domain. Optional `max_seconds` (default 280), `page_cap` (default 40), and `render_max` (default 40).

## Procedure
1. Run `scripts/run_audit.py --url <https-url> --json-out <report.json>`; it validates the public HTTP(S) seed and starts one rate-limited, robots-respecting crawl in `scripts/lib/crawl.py`.
2. Share that single in-memory `CrawlSnapshot` with site-type, access, render, citation, entity, freshness, answerability, corroboration, and handoff implementations. Detection skills do not independently recrawl; only the bounded, explicit linked-source checks may use the orchestrator HTTP client.
3. Invoke the existing skill implementations, apply existing `admit()` and `merge_findings()` finding-type/finding-key logic, then use existing report code and the business-impact presentation layer for dimensions and overall index.
4. Emit the final report. All objective HTTP, robots, parsing, and matching checks are implemented in scripts; this release uses no LLM judgment.

## Output
Final JSON always includes `{ site: string, audited_at: ISO8601 string, summary: { total_findings: number, critical: number, high: number, medium: number, low: number }, findings: [{ id, title, severity, evidence, suggested_action: { summary, priority } }] }`. It additionally includes internal canonical findings, `dimension_scores`, `overall_index`, timing, coverage, limitations, and top actions.

## Confidence & failure handling
Robots disallow stops or constrains crawling and is reported by crawl-access-audit. 403s, bot challenges, missing data, failed dependencies, and ambiguous evidence become limitations, LOW-confidence evidence, or omissions—never fabricated findings. The report remains a partial audit when a skill fails.

## Declared tool needs
Python execution and read-only, rate-limited HTTP GET/HEAD to the target domain; explicit linked public URLs only for corroboration; no authentication, forms, destructive actions, or target-site writes.

## Runtime budget
The default 280-second deadline leaves report overhead inside five minutes. The shared crawl is capped at 40 pages and bounded rendering, and the existing skip ladder reduces work or skips linked corroboration as time runs low. Very slow origins or many render-heavy pages can still exhaust the budget; the concrete mitigation is to lower `--page-cap`/`--render-max`, while retaining the protected core checks.
