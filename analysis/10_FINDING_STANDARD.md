# Phase 11 — Finding Standard

Every field has a purpose. Handout floor: `id, title, severity, evidence, suggested_action`.

## Canonical Finding

| Field | Required | Purpose |
|-------|----------|---------|
| id | yes | Stable short id `F-001` for humans; machine `finding_key` hashed |
| finding_key | internal | Z-22 hash(skill + normalized claim + url/template) for dedup |
| skill_id | yes | Provenance |
| title | yes | One-line non-expert |
| category | yes | `access\|render\|citation\|entity\|answerability\|freshness\|corroboration\|engagement\|site_type` |
| severity | yes | critical\|high\|medium\|low (handout sample used these) |
| confidence | yes | high\|medium\|low **with basis**, never bare % (AA-01, AB) |
| evidence_tier | yes | FACT/OBS/HYP/INF used in *our* check design, shown if HYP |
| root_cause | yes | Mechanism sentence |
| description | yes | What + why it matters (AB8 stakes) |
| evidence | yes | String for handout; internally Evidence[] |
| evidence_items | internal | Structured Evidence[] |
| affected_urls | yes | Representative list |
| affected_pages_count | yes | Honesty with sampling |
| template_id | if clustered | AF merge |
| metrics | if any | Ratios, hop counts |
| suggested_action | yes | Object: summary + priority (+ what/where/how/why) |
| contributing_skills | after merge | Corroboration |
| causal_role | after T | single\|joint\|amplifier |
| materiality | claim-facts | P-03 pass/fail |
| suppressed | if U fired | reason |
| status | | found\|insufficient_evidence |

Do **not** add unused fields (no GEO score, no 0–100 confidence).

## suggested_action (handout + AC)

```json
{
  "summary": "SSR the pricing table so amounts exist in initial HTML.",
  "priority": "high",
  "what": "Expose current plan prices as visible text in server-rendered HTML.",
  "where": "https://example.com/pricing (template t-pricing)",
  "how": "Move price nodes out of client-only fetch; keep qualifier in same sentence.",
  "why": "Dual-fetch showed $ amounts only after JS; lightweight crawlers never see them."
}
```

## Severity labels
Match handout sample: `critical`, `high`, `medium`, `low`. Informational uses `low` plus description, or omit from counts if suppressed.

## Evidence string (user-facing)
Must be reproducible: counts, URLs, short quotes. Example handout: “Crawled 12 product pages; 0/12 contain schema.org markup.” Prefer mechanism-true evidence even when schema is Low severity.
