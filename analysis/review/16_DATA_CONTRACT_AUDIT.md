# Phase 16 — Data Contract Audit

## Sufficiency holes in v0

| Object | Missing | Why |
|--------|---------|-----|
| Page | `extractability_flags`, `language`, `robots_meta`, `content_simhash`, `unfetched`, `render_status` | K/X/D/T |
| CrawlResult | `deadline_ts`, `skipped_skills[]`, `coverage.k_categories` already there | skip-ladder |
| Graph node | `unfetched` | AG FN |
| Finding | `finding_type`, `parent_id`, `causal_role`, `admission: {u_rule, suppressed}` | T/U |
| Fact | `as_of`, `page_ids[]` | I vs H |
| Entity | `collision_evidence` | ENT degrade |
| SkillResult | `deadline_honored` | runtime |
| FinalAuditReport | `limitations[]` required, `metrics` (core answerability, not GEO) | honesty |

## Unnecessary

GEO scores, 0–100 confidence, Lighthouse, per-page schema completeness ratios as Critical.

## Merge / trace / confidence / severity

`finding_key` + `parent_id` allow merge and RCA. Confidence min-then-boost if independent skills agree **and** not parent-child duplicates. Severity recalculated at orch after suppress. Non-expert: title + evidence quotes + one action.

## Schema sketch additions

```json
{
  "finding_type": "js_fact_lock",
  "parent_id": null,
  "causal_role": "root",
  "extractability": {"in_raw": false, "in_rendered": true, "in_visible": true}
}
```
