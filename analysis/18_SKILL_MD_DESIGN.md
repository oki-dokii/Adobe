# Phase 19 — SKILL.md Design (progressive disclosure)

Keep SKILL.md lean (instructions). Details in references/. Code in scripts/.

## Frontmatter (every skill)
- `name`: kebab-case = directory, ≤64 chars
- `description`: **what + when** (discovery mechanism)
- `license`: team choice
- `metadata`: optional
- `allowed-tools`: optional hint only — **not a sandbox** (Z-01)

## SKILL.md body (all skills)
1. When to use
2. Inputs
3. Preconditions
4. Procedure (numbered)
5. Deterministic vs hybrid tagging
6. Output schema pointer
7. FP/FN one-liners
8. Allowed tools (fetch, code exec)

## Split

| In SKILL.md | In references/ | In scripts/ |
|-------------|----------------|-------------|
| Judgment, order, severity intent | Taxonomies, U table, K questions, V clusters | HTTP, parse, hashes, QA runner |

## Per-skill SKILL.md intent

### audit-orchestrator
Description must include: audit website AI discoverability and on-site engagement, compose marketplace skills, emit findings+actions. Procedure = DAG. Output = FinalAuditReport.

### site-type-classifier
When: start of audit or unknown vertical. Do not mention 20 types; mention 6 clusters.

### crawl-access-audit
When: diagnose why crawlers cannot reach public content. RFC 9309 4xx/5xx explicit.

### render-extract-audit
When: facts visible to humans but maybe not text extractors. Dual-fetch. Google mythbust: don’t recommend llms.txt.

### citation-extractability-audit
When: cited wrong / not quoted. Self-containment + specificity. Schema parity not “add schema to rank”.

### entity-identity-audit
When: mix-ups, common names. WhoQA mechanism. No Wikidata score.

### ai-answerability-audit
When: “does the site actually answer X”. Closed-book abstention. Exclude K9/K10 from defect score.

### freshness-audit
When: stale or date-gamed. Not evergreen.

### corroboration-consistency-audit
When: fragile or contradictory claims. Materiality. H-02 wording.

### engagement-handoff-audit
When: AI referral bounce. STTF. Disclose Y-01 untestable.

Full implementation procedures: `analysis/skills/*.md` (30-section specs). Implementers copy lean instructions into SKILL.md, not the entire spec.
