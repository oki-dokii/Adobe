# Phase 14 — Finding Merging

## Duplicate
Same `finding_key` or (same URL+selector AND same mechanism). Merge evidence arrays; `contributing_skills` union; confidence = min then boost if independent skills agree (S multi-signal).

## Similar phrasing
LLM confirm only if evidence overlap; never merge on URL alone (Z-F counterexample: a11y vs pricing).

## Site-wide / template-wide
If AF cluster and 2+ samples fail the same check → **one** finding with `affected_pages_count` and examples, not N findings.

## Page-specific
Unclustered unique defect stays page-level.

## Parent/child
Render-lock is parent; “unanswerable pricing” and “no quotable price” are children. Report parent as root_cause; children `causal_role: amplifier` or omit if redundant.

## Symptom vs cause (T)
JS-only price: keep **render** as primary; citation/answerability mention via merge note, not three Criticals.

## Conflicts
**Site-type/context (SK-V) beats generic content findings** on direct contradiction (Z-F). Example: missing public price on enterprise SaaS → suppress or low.

## Conflicting facts
Internal price A vs B: freshness/consistency finding, do not drop both.

## Cap
Prefer ≤ ~15 user-facing findings after merge (alert fatigue S). Overflow goes to appendix in human report, still in JSON if required.

## Never silent drop
Suppressed findings logged with reason.
