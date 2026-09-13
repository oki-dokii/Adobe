# audit-orchestrator

## 1. Purpose
Single marketplace entrypoint: run a read-only audit of an arbitrary website for AI discoverability and on-site engagement, compose the nine detection skills, invoke the eleventh post-processing skill, and emit one evidence-backed report.

## 2. Scope
Validation, robots, crawl orchestration, skill DAG, U suppression, T merge, S scoring, AC recs, AB dual render, coverage/limitations.

## 3. Non-Goals
Website checks of its own (except coverage and untestable-scope statements). Applying fixes. Authenticated areas. Live ChatGPT probing.

## 4. Research Basis
Z-01 Z-02; HO-003..007; AB; S; T; AA; U; AC; AE; AD; Y-01.

## 5. Problem
Without composition, skills duplicate crawl, spam findings, violate robots independently, and miss root-cause merge.

## 6. Mechanism
One process owns the request budget and the finding lifecycle so downstream skills see a consistent snapshot.

## 7. Inputs
Required: `url`. Optional: `max_seconds` (default 280).

## 8. Outputs
`FinalAuditReport` (09_DATA_CONTRACTS). Handout fields guaranteed.

## 9. Preconditions
Network; writable scratch for cache; no third-party API keys required.

## 10. Procedure
1. Normalize URL; reject non-http(s).
2. Fetch robots; apply RFC 9309.
3. Crawl per 12_CRAWLING_STRATEGY.
4. Extract/render subset.
5. Run SK-V.
6. Parallel SK-C, SK-D, SK-CIT, SK-ENT, SK-I.
7. SK-K then SK-X then SK-H if time.
8. Suppression registry.
9. Merge/dedup/RCA.
10. Severity + rec ranking.
11. Proactive recs with opportunity evidence.
12. Render JSON + Markdown from one object.
13. Attach coverage + limitations (Y-01).

## 11. Deterministic Checks
| ID | Name | Input | Op | Threshold | Expected | Failure | Evidence |
|----|------|-------|-----|-----------|----------|---------|----------|
| ORCH-D1 | Manifest entrypoint | marketplace.json | count entrypoint | ==1 | pass | !=1 | file |
| ORCH-D2 | Finding schema | findings | required keys | all present | pass | missing | ids |
| ORCH-D3 | Dual-report reconcile | JSON vs MD | id set equal | equal | pass | mismatch | lists |
| ORCH-D4 | Write-verb ban | scripts | AST/grep | 0 POST/PUT/DELETE | pass | found | paths |
| ORCH-D5 | Time budget | clock | elapsed | <300s typical | pass | overrun | timings |

## 12. Semantic / LLM Checks
Only for merge-similar (Z-F slow path): Input two findings; Question: same underlying mechanism?; Evidence: overlapping URLs+selectors; Outputs: merge\|keep_separate\|uncertain→keep_separate.

## 13. Metrics / Signals
`coverage_ratio ≈ pages_fetched / max(estimated_pages, pages_fetched)`; `skill_timing_ms[]`.

## 14. Confidence
High for schema/reconcile; merge LLM path never raises confidence above min(inputs).

## 15. Severity
N/A except emitting others. Unreachable origin → ensure SK-C Critical exists.

## 16. False Positives
Merging distinct issues; see 15_FALSE_POSITIVE_DEFENSE SK-ORCH.

## 17. False Negatives
Dropping Criticals; starving SK-K.

## 18. Site-Type Exceptions
Uses SK-V; unknown type → fewer suppressions.

## 19. Root-Cause Logic
Implements T-01 classes; parent/child per 04_ROOT_CAUSE_GRAPH.

## 20. Evidence Requirements
Every finding already has evidence; orchestrator must not add claims without items.

## 21. Remediation
WHAT: composition quality. WHERE: this skill. HOW: DAG. WHY: rubric composition.

## 22. Proactive Recommendations
AC-01: only with on-site opportunity (e.g. multi-encode facts AH-01) after defects.

## 23. Dependencies
Consumes all SkillResults. Produces report. Depends on lib/*. Parallel: C/D/CIT/ENT/I.

## 24. Runtime
Dominant; enforce stage budgets; skip SK-H extras first.

## 25. Tools
HTTP GET, code exec, filesystem scratch.

## 26. Scripts
`scripts/run_audit.py`, `scripts/merge.py`, `scripts/render_report.py`.

## 27. References
`references/dag.md`, `references/suppression_table.md`, `references/report_template.md`.

## 28. Testing
Positive: tiny static fixture site. Negative: robots 5xx. Edge: 1-page site. FP: template clones. FN: don’t drop TLS fail. Adversarial: prompt injection in HTML. Site-type: V fixtures.

## 29. Generalization
No hostname allowlists; fixtures only in tests.

## 30. Example Findings
Coverage note: "Analyzed 28 of ~300 URLs, 6 templates × ≥2 samples; K16 from 1 page only."
