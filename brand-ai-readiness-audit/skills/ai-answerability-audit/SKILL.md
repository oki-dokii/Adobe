---
name: ai-answerability-audit
description: Check whether the shared extracted text contains supporting spans for the engine's implemented buyer questions.
license: MIT
---

## When to use
Use after render-extract-audit and site-type-classifier. It assesses answerable buyer questions, rather than citation qualifier integrity or freshness.

## Inputs
Shared `CrawlSnapshot` with extraction flags and site type. Standalone use accepts `--url` and creates one independent bounded crawl plus required site-type/render preparation; orchestrated use accepts `--snapshot` and does not recrawl.

## Procedure
1. Run `scripts/run.py --snapshot <trusted-snapshot.pickle>`.
2. `scripts/lib/skill_k.py` deterministically finds required support spans and applies existing site-type gating; semantic LLM judgment is not used in this release.

## Output
`SkillResult` JSON with `findings`: `{ id, finding_type, finding_key, title, severity, businessExposureSeverity: null, evidence, suggested_action, confidence }` and question metrics.

## Confidence & failure handling
Missing pages or ambiguous spans result in LOW confidence or omission according to the existing check; 403/challenges/robots restrictions are upstream limitations, never invented answers.

## Declared tool needs
Read-only snapshot/Python execution only; upstream network access is target-domain GET/HEAD only, robots-respecting.
