---
name: freshness-audit
description: Detect on-site date-signal divergence and typed fact conflicts in the shared crawl.
license: MIT
---

## When to use
Use after extraction when evaluating time consistency within the audited site. Linked third-party disagreement belongs to corroboration-consistency-audit.

## Inputs
Shared `CrawlSnapshot` with extracted dates, facts, URLs, and site type. Standalone use accepts `--url` and creates an independent bounded crawl; orchestrated use accepts `--snapshot` and does not recrawl.

## Procedure
1. Run `scripts/run.py --snapshot <trusted-snapshot.pickle>`.
2. `scripts/lib/skill_i.py` deterministically compares existing parsed date and fact evidence using the engine's scope guards.

## Output
`SkillResult` JSON with `findings`: `{ id, finding_type, finding_key, title, severity, businessExposureSeverity: null, evidence, suggested_action, confidence }`.

## Confidence & failure handling
Missing dates, inaccessible pages, robots disallow, or ambiguous historical material is omitted or LOW confidence; age alone is not made into a finding. Copyright/footer-only years are ignored, and explicitly localized URL variants are not compared as freshness defects. Template-level findings (`date_divergence`, `canonical_dup`, `scent_break`, `orphan`) are capped at MEDIUM under partial coverage unless observed across at least 3 distinct templates or at least 30% of sampled pages.

## Declared tool needs
Read-only snapshot/Python execution only; upstream target fetching is read-only GET/HEAD and robots-respecting.
