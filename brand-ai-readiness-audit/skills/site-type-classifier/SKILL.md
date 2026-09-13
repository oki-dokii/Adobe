---
name: site-type-classifier
description: Classify the shared crawl into engine-supported site clusters and flags for downstream gating.
license: MIT
---

## When to use
Use immediately after the shared crawl and before gated detection skills. It classifies context only; it does not diagnose content defects except its existing disclosure check.

## Inputs
Shared `CrawlSnapshot` containing the sampled public pages and navigation evidence. Standalone use accepts `--url` and creates an independent bounded crawl; orchestrated use accepts `--snapshot` and does not recrawl.

## Procedure
1. Run `scripts/run.py --snapshot <trusted-snapshot.pickle>`.
2. `scripts/lib/skill_v.py` deterministically applies the existing cluster vote logic and stores site type on the snapshot.

## Output
`SkillResult` JSON with `findings`: `{ id, finding_type, finding_key, title, severity, businessExposureSeverity: null, evidence, suggested_action, confidence }`, plus site-type metrics.

## Confidence & failure handling
Sparse or unavailable content yields the engine's unknown/LOW-confidence classification rather than a fabricated vertical. Robots, 403s, and challenges are upstream limitations.

## Declared tool needs
Read-only snapshot/Python execution; no direct network access, authentication, or target-site writes.
