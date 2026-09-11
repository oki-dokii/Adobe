# Phase 15 — Orchestration Audit

## Order (revised)

```
validate URL
→ robots (fail-closed → C findings + report)
→ sitemap + seeds
→ crawl time budget (no render)
→ extract raw + simhash + graph
→ SK-V (heuristic; LLM if ambiguous)
→ SK-C (uses graph)
→ dual-fetch/render top-M
→ SK-D (sets extractability_flags)
→ parallel: SK-CIT, SK-ENT, SK-I   # CIT/ENT/I read flags
→ SK-K (flags + V + subset Q)
→ SK-X (claim list from K/CIT)
→ SK-H if remaining ≥ T_h
→ U13–U18 per finding
→ T merge parent_id
→ S severity (max in cluster)
→ AC opportunities (evidence only)
→ AB render
```

v0 ran C/D/CIT/ENT/I in parallel **before** D flags exist → **wrong**. C can parallel with raw crawl; D must precede CIT/K/X.

## Independent skills?

Packaging: each folder runnable on a snapshot. Runtime: they are **not** independent crawlers. Entrypoint does crawl; skills consume.

## Entrypoint too much?

Owns DAG, budget, merge, report — correct. Must not inline CIT regex.

## Failure isolation

Skill throw → SkillResult failed, continue. Only robots fail-closed / invalid URL / SSRF on seed stop the run.

Partial output always: `status: partial`, coverage, limitations.

## Interfaces

Stable: CrawlSnapshot + SkillResult. Finding `finding_type` enum versioned.

## Duplicates

Merge engine in orch only. Skills may emit overlapping types; orch applies parent rules.
