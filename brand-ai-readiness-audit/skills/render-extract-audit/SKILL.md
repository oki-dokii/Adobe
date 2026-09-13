---
name: render-extract-audit
description: Compare raw and rendered shared-crawl content for extractability of decision facts.
license: MIT
---

## When to use
Use after crawling and before citation or answerability checks. It owns raw-versus-rendered extractability, not whether a fact is well-qualified.

## Inputs
Shared `CrawlSnapshot` with raw HTML and any bounded rendered HTML. Standalone use accepts `--url` and creates an independent bounded crawl; orchestrated use accepts `--snapshot` and does not recrawl.

## Procedure
1. Run `scripts/run.py --snapshot <trusted-snapshot.pickle>`.
2. `scripts/lib/skill_d.py` deterministically parses both representations, updates page extractability flags, and emits evidence-backed findings.

## Output
`SkillResult` JSON with `findings`: `{ id, finding_type, finding_key, title, severity, businessExposureSeverity: null, evidence, suggested_action, confidence }`; updated extractability flags remain in the in-memory orchestrator snapshot.

## Confidence & failure handling
If rendering is unavailable, the script does not claim a render-only defect; it records the limitation and omits unproven findings. 403/challenges and robots restrictions remain upstream evidence with LOW confidence where applicable.

## Declared tool needs
Read-only snapshot/Python execution. Rendering and network fetching are orchestrator-owned, read-only GET/HEAD to the target domain, robots-respecting, and budgeted.
