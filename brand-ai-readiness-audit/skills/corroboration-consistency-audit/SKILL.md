---
name: corroboration-consistency-audit
description: Compare material on-site facts only with explicitly linked third-party sameAs sources under a bounded budget.
license: MIT
---

## When to use
Use after on-site facts are extracted when checking linked-source consistency. It is separate from freshness because it never treats internal drift as external corroboration.

## Inputs
Shared `CrawlSnapshot`, extracted facts, and the orchestrator's remaining time and bounded HTTP client. Standalone use accepts `--url` and creates an independent bounded crawl with one bounded client for permitted linked-source reads; orchestrated use accepts `--snapshot` and does not recrawl.

## Procedure
1. The orchestrator invokes `scripts/lib/skill_h.py` only when budget permits; standalone `scripts/run.py --snapshot` performs no extra network fetch.
2. The implementation deterministically reads only explicit sameAs links, fetches their robots policy, then compares usable linked evidence.

## Output
`SkillResult` JSON with `findings`: `{ id, finding_type, finding_key, title, severity, businessExposureSeverity: null, evidence, suggested_action, confidence }` and corroboration metrics.

## Confidence & failure handling
Robots disallow, 403s, challenges, missing links, or ambiguous linked evidence are recorded as unusable/LOW confidence or omitted. It does not search the web or invent corroboration.

## Declared tool needs
Read-only local execution plus orchestrator-authorized, rate-limited GET/HEAD to explicit linked public sources, each respecting robots.txt; no authentication or forms.
