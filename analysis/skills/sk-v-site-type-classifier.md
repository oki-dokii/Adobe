# site-type-classifier

## 1. Purpose
Assign V clusters (A–F) + YMYL + multilingual axis so other skills apply the right gates and so YMYL disclosure gaps can be found.

## 2. Scope
Classification + cluster-A disclosure checks. Not 20 micro-skills.

## 3. Non-Goals
Punishing hedges on YMYL; inferring revenue model as a score.

## 4. Research Basis
V-01..V-04, V clusters, U17, Z-F precedence.

## 5. Problem
Flat rubrics false-positive (SaaS prices, directory thinness) and false-negative (missing medical reviewer).

## 6. Mechanism
Sites share mechanisms by cluster not by marketing vertical name; hybridity is common (V empirical).

## 7. Inputs
Required: crawled homepage/about/nav. Optional: more pages.

## 8. Outputs
SkillResult with `metrics.site_type` object + optional findings (missing YMYL disclosures).

## 9. Preconditions
At least homepage extract.

## 10. Procedure
1. Features: TLD, nav labels, keywords, schema types, outbound-directory patterns.
2. Deterministic cluster votes.
3. LLM only if votes conflict (hybrid domains).
4. Multi-label allowed.
5. YMYL disclosure checks if cluster A.
6. Never-fire list emitted to suppression context.

## 11. Deterministic Checks
| ID | Name | Input | Op | Threshold | Failure | Evidence |
|----|------|-------|-----|-----------|---------|----------|
| V-D1 | Always run | any site | classifier invoked | must run | skipped | log |
| V-D2 | Docs version cues | /docs, changelog | regex | cluster D candidate | | URLs |
| V-D3 | Ecommerce cues | Add to cart, sku | regex | cluster F ecom | | snippets |
| V-D4 | YMYL lexicon | health/finance/legal | keyword | cluster A candidate | | terms |

## 12. Semantic / LLM Checks
Input: conflicting votes + snippets. Question: primary cluster + secondary? Allowed: A–F labels + confidence. Uncertain → `insufficient_evidence` cluster with conservative gates (don’t suppress pricing; do treat hedges leniently).

## 13. Metrics
`cluster`, `secondary[]`, `ymyl: bool`, `multilingual: bool`.

## 14. Confidence
High if 2+ deterministic cues agree; else medium/low.

## 15. Severity
Missing YMYL mandatory disclosure: high (cluster A only). Classification itself: no severity.

## 16–18. FP/FN/Exceptions
See 15 and 16_SITE_TYPE. Bookstore on .edu is not SaaS.

## 19. Root-Cause
Mis-classification is our error; findings from it should be suppressed not blamed on the site.

## 20. Evidence
Snippets and URLs used for votes; never “feels like SaaS”.

## 21. Remediation
WHAT: add named reviewer / license / jurisdiction. WHERE: topic pages. HOW: visible text. WHY: YMYL harm.

## 22. Proactive
If cluster F SaaS and quote-CTA is clear, note as appropriate pattern (not a defect).

## 23. Dependencies
Consumes extract. Produces classification. Parallel after crawl. Gates all.

## 24. Runtime
Cheap; one LLM only on conflict.

## 25–27. Tools/Scripts/Refs
`scripts/classify.py`; `references/v_clusters.md`; `references/never_fire.md`.

## 28. Testing
V-01 hybrid fixtures; nonprofit thin OK; clinic missing reviewer.

## 29. Generalization
No brand lists; cue tables in references.

## 30. Example
Title: "Health-topic pages lack a named clinical reviewer". Evidence: 4 article URLs, no reviewer byline.
