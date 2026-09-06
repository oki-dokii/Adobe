# Phase 19 — Revised Architecture (candidate v1)

Rebuilt from attacks. **Folder count remains 10.** This is not a patch list; it is the candidate to red-team.

Marketplace: `brand-ai-readiness-audit`  
Entrypoint: `audit-orchestrator`

## Skills (unchanged names, changed contracts)

1. **audit-orchestrator** — clock, snapshot, DAG, U-flow, T parent_id, S, AC, AB, coverage. Non-goal: checks.
2. **site-type-classifier** — multi-label V; YMYL findings; never-fire owner. Conservative unknown.
3. **crawl-access-audit** — Gate 1 including AI tokens, traps, orphans+AE22. Canonicals only with dup evidence. Optional TTFB metric.
4. **render-extract-audit** — Gate 2; flags; D41; U9/U10; landmarks. Not CSS-accordion-in-DOM.
5. **citation-extractability-audit** — Gate 3 named types including schema_visible_mismatch, comparison_self_win_table. Consumes flags.
6. **entity-identity-audit** — collision; identity schema fields; sameAs 404. No search API.
7. **ai-answerability-audit** — unanswerable vs wrong_page vs expected_gap; span-or-invalid; budget subset.
8. **freshness-audit** — date signals + time-indexed conflicts only.
9. **corroboration-consistency-audit** — linked third-party GETs; contradiction vs uncorroborated; skip-if-poor; on-site **same-time** typed conflicts (AC12 lite).
10. **engagement-handoff-audit** — viewport, scent, STTF, wayfinding; in-DOM not visible.

## Why not 8 or 12

8 would merge I+H or ENT+H and mix fetch/robots/time. 12 would pad G/W/N/O.

## Infra (mandatory)

http+SSRF every hop, robots shared (third parties too), crawl+simhash+θ language, renderer fallback, extract, fact_store+compare_claim, suppress admit(), merge, sanitizer delimiters, rate limit.

## Execution

See `15_ORCHESTRATION_AUDIT.md`. **D before CIT/K/X.**

## Evidence / severity / confidence

Closed `finding_type` enum. No 0–100. Joint severity = max. V beats generic.

## Runtime

Skip-ladder. Skills get `deadline_ts`. No recrawl.

## Deferred / rejected

Unchanged plus explicit: AH8 unspecified; AH9 opportunistic; AG15 NLP off; live probe off; search API off.

## Known limitations

Partial crawl FNs; no search collision; no unlinked wiki; no OCR-all; no interaction-all; H-02 unproven citation causality; 40/60 unvalidated.
