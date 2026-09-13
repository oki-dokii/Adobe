---
name: crawl-access-audit
description: Diagnose compliant crawler reachability, robots policy, and crawl coverage from a shared snapshot.
license: MIT
---

## When to use
Use after the shared crawl to assess reachability and access policy. It does not assess rendered text, citations, or user handoff.

## Inputs
An audit-orchestrator-created `CrawlSnapshot` containing robots, HTTP, sitemap, and page coverage data. Standalone use accepts `--url` and creates an independent bounded crawl; orchestrated use accepts `--snapshot` and does not recrawl.

## Procedure
1. Run `scripts/run.py --snapshot <trusted-snapshot.pickle>`; it invokes the tested `scripts/lib/skill_c.py` check.
2. That deterministic check evaluates robots tokens, transport/HTTP observations, crawl traps, canonical/coverage evidence, and RFC 9309 policy.

## Output
`SkillResult` JSON with `findings`: `{ id, finding_type, finding_key, title, severity, businessExposureSeverity: null, evidence, suggested_action, confidence }`; no finding is emitted where the evidence rule does not pass.

## Confidence & failure handling
Robots disallow is reported with observed policy; 403/challenges and missing data are retained as limitations or LOW-confidence/omitted findings. This skill never bypasses robots or fabricates coverage.

## Declared tool needs
Read-only local snapshot access and Python execution. Upstream crawl may use rate-limited GET/HEAD to the target domain only and must respect robots.txt.
