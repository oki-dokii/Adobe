---
name: engagement-handoff-audit
description: Check on-site post-referral identity, wayfinding, and action handoff from shared extracted content.
license: MIT
---

## When to use
Use after render extraction and answerability to assess what a referred visitor can understand and do on-site. It does not determine whether facts are crawlable.

## Inputs
Shared `CrawlSnapshot` with parsed DOM/landmark information and page types. Standalone use accepts `--url` and creates an independent bounded crawl; orchestrated use accepts `--snapshot` and does not recrawl.

## Procedure
1. Run `scripts/run.py --snapshot <trusted-snapshot.pickle>`.
2. `scripts/lib/skill_x.py` deterministically evaluates existing viewport, navigation, and in-DOM handoff signals.

## Output
`SkillResult` JSON with `findings`: `{ id, finding_type, finding_key, title, severity, businessExposureSeverity: null, evidence, suggested_action, confidence }`.

## Confidence & failure handling
Personalization or unavailable DOM evidence is disclosed as a limitation or LOW confidence; robots restrictions, 403s, and bot challenges are never bypassed or replaced with placeholders.

## Declared tool needs
Read-only snapshot/Python execution; upstream crawl is read-only, target-domain GET/HEAD, rate-limited, and robots-respecting.
