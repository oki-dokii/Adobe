---
name: site-type-classifier
description: Classify a site into V clusters A–F plus YMYL and multilingual flags so later checks gate correctly. Use at the start of every audit; do not skip.
license: MIT
---
# site-type-classifier

## When to use
Always at the start of an audit, or when vertical is unknown. Six clusters, not 20 vertical skills.

## Inputs
Crawl snapshot (homepage/about/nav).

## Procedure
Deterministic votes from URL, TLD, nav, lexicon. Multi-label hybrids. Unknown cluster: do not suppress pricing. Cluster A: YMYL disclosure finding if no reviewer/license.

## FP/FN
.edu bookstore is not SaaS. HIPAA badge on SaaS is not medical-advice YMYL.

## Output
metrics.site_type; optional ymy_disclosure findings.
