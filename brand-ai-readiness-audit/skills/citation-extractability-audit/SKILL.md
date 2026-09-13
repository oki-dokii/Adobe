---
name: citation-extractability-audit
description: Evaluate whether extracted factual claims are self-contained, qualifier-safe, table-readable, and consistent with visible structured data.
license: MIT
---

## When to use
Use after render-extract-audit has set extractability flags. It evaluates quote safety, not crawl access or semantic answer completeness.

## Inputs
Shared `CrawlSnapshot`, including rendered/raw extraction flags. Standalone use accepts `--url` and creates one independent bounded crawl plus required render preparation; orchestrated use accepts `--snapshot` and does not recrawl.

## Procedure
1. Run `scripts/run.py --snapshot <trusted-snapshot.pickle>`.
2. `scripts/lib/skill_cit.py` performs deterministic DOM/text and JSON-LD checks; no LLM judgment is used in this release.

## Output
`SkillResult` JSON with `findings`: `{ id, finding_type, finding_key, title, severity, businessExposureSeverity: null, evidence, suggested_action, confidence }`.

## Confidence & failure handling
Unavailable pages, missing structured data, ambiguous evidence, robots disallow, or bot challenges produce LOW confidence or omission; missing schema alone is not fabricated into a defect.

## Declared tool needs
Read-only snapshot/Python execution only. All target fetching is upstream, read-only GET/HEAD and robots-respecting.
