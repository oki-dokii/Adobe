---
name: entity-identity-audit
description: Detect name-collision mix-up risk from on-page evidence and dead sameAs URLs. Use after extract. No search API and no Wikidata completeness score.
license: MIT
---
# entity-identity-audit

## When to use
Common brand names, mix-up risk.

## Procedure
Heuristic collision_risk; require category/geo sentence. sameAs 404 if fetched. Never High for missing Wikidata.
