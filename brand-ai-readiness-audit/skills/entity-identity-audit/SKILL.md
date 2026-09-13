---
name: entity-identity-audit
description: Detect collision-prone on-site identity evidence and observed dead sameAs links without search enrichment.
license: MIT
---

## When to use
Use after extraction for entity disambiguation. It is distinct from linked-source corroboration because it never searches or compares off-site facts.

## Inputs
Shared `CrawlSnapshot`; the orchestrator may supply its bounded HTTP client for sameAs verification. Standalone use accepts `--url` and creates an independent bounded crawl with the same bounded client; orchestrated use accepts `--snapshot` and does not recrawl.

## Procedure
1. Run `scripts/run.py --snapshot <trusted-snapshot.pickle>` for local snapshot checks.
2. `scripts/lib/skill_ent.py` deterministically parses identity and sameAs evidence; the orchestrator alone may perform its budgeted read-only verification.

## Output
`SkillResult` JSON with `findings`: `{ id, finding_type, finding_key, title, severity, businessExposureSeverity: null, evidence, suggested_action, confidence }`.

## Confidence & failure handling
Absent identity signals, unavailable links, robots disallow, 403s, and ambiguous names yield LOW confidence or omission. No external search, identity assertion, or placeholder is fabricated.

## Declared tool needs
Read-only snapshot/Python execution; optional orchestrator-owned GET/HEAD to explicitly linked public URLs only, respecting their robots policy.
