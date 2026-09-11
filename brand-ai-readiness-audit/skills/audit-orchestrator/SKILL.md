---
name: audit-orchestrator
description: Run a read-only Brand AI readiness audit of a website: crawl under robots.txt, compose detection skills, merge findings, and emit JSON+Markdown with evidence and suggested actions. Use when given a public site URL and a 5-minute budget.
license: MIT
---
# audit-orchestrator

## When to use
User provides a public website URL to audit AI discoverability and post-citation engagement.

## Inputs
`url` (required). Optional `max_seconds` (default 280).

## Preconditions
Network or fixture HTTP. No credentials. GET/HEAD only.

## Procedure
1. Validate http(s); reject userinfo and blocked seed IPs.
2. Fetch robots.txt — RFC 9309 4xx fail-open, 5xx fail-closed; stop crawl on fail-closed.
3. Time-bounded crawl (shared lib); SimHash templates; coverage AE22.
4. site-type-classifier (protect V).
5. crawl-access-audit.
6. Dual-fetch/render fact URLs (protect); render-extract-audit sets extractability_flags.
7. Parallel: citation (det protected), entity-identity, freshness.
8. ai-answerability-audit with K3 protected; skip-ladder may shrink other K ids.
9. engagement-handoff-audit; corroboration-consistency-audit only if remaining ≥ 45s.
10. admit() U13–U18; parent_id merge; cap 15 user-facing findings; dual report.

## Deterministic vs hybrid
Orchestration is deterministic. Skills may use bounded LLM; this v1 implementation uses deterministic checks only (llm_calls=0).

## Output
FinalAuditReport JSON (handout fields id, title, severity, evidence, suggested_action) plus Markdown render of the same object.

## FP/FN
Do not emit live “not cited by ChatGPT” claims (U12). Always include Y-01 limitations.

## Allowed tools
Hint only: HTTP GET/HEAD, code execution. Not a sandbox.
