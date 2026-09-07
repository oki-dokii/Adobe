# START HERE (implementation agent)

Do **not** re-research. Do **not** invent extra skills. Do **not** implement until the human approves — this pack is the spec the next agent executes after approval.

## What we are building
Adobe Round 3 marketplace `brand-ai-readiness-audit`: 10 skills, **one entrypoint** `audit-orchestrator`, read-only, robots.txt, <5 min, zip ≤50MB, report with `id, title, severity, evidence, suggested_action`.

## Read in this order
1. `01_ARCHITECTURE.md` (this folder)
2. `02_MARKETPLACE_SPEC.md`
3. `03_COMMON_INFRASTRUCTURE.md`
4. `04_DATA_CONTRACTS.md`
5. `05_ORCHESTRATOR.md`
6. `06_IMPLEMENTATION_PLAN.md`
7. Every `skill-*.md` in this folder

Authoritative research trace: `../` (especially `06_SKILL_DECISIONS.md`, `07_FINAL_SKILL_ARCHITECTURE.md`, `15_FALSE_POSITIVE_DEFENSE.md`).

## Hard rules
- No POST/PUT/DELETE, no auth, no site changes
- No hard-coded evaluation websites
- No “missing schema/llms.txt” as Critical
- No verbalized 0–100 confidence
- No live ChatGPT probing in v1
- Merge template clones; cap finding spam
- SK-V gates suppressions; V beats generic pricing defects

## Final skills
audit-orchestrator, site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, ai-answerability-audit, freshness-audit, corroboration-consistency-audit, engagement-handoff-audit
