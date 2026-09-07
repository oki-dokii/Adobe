# entity-identity-audit

## 1. Purpose
Detect name-collision and identity-fragmentation risk that can cause silent misattribution.

## 2. Scope
Collision risk, early disambiguators, aliases, sameAs consistency, merger narrative. Schema as reinforcement only.

## 3. Non-Goals
Wikidata completeness scores; Entity SEO checklists; F-00 commercial GEO claims.

## 4. Research Basis
F-00 F-01 F-02; App D; P-02 sameAs.

## 5. Problem
WhoQA: same-name contexts collapse accuracy; some models fail silently.

## 6. Mechanism
Retrieval mixes same-string entities; missing category/geo/function lets the model pick the wrong one.

## 7. Inputs
Extracts; Organization/Person JSON-LD; outbound sameAs.

## 8. Outputs
collision_risk; findings when risk medium/high AND weak disambiguation.

## 9. Preconditions
Brand name string from title/H1/schema.

## 10. Procedure
1. Extract primary name + aliases.
2. On-page disambiguators: category, geo, founding, product class in first screen/about.
3. sameAs URLs fetch HEAD/GET if robots allow; detect 404/mismatch.
4. Collision: bounded optional public search GET if possible; else on-page only + lower confidence (22_FINAL_REVIEW #3).
5. Never High solely for missing schema or missing wiki.

## 11. Deterministic Checks
ENT-D1 name in title. ENT-D2 schema Organization name matches visible. ENT-D3 sameAs 404. ENT-D4 legal vs DBA both present without linking sentence.

## 12. Semantic / LLM Checks
Does first 200 words uniquely identify this org vs a generic same name? Allowed: unique|ambiguous|uncertain.

## 13. Metrics
`collision_risk`; `disambiguator_count`.

## 14. Confidence
Medium on production assistants (F-01 caveat); high on missing sameAs 404.

## 15. Severity
High: high collision + no disambiguation. Else no-finding or low reinforcement rec.

## 16–18.
Coined brand TN; low-prominence homonym; artist=product.

## 19. Root-Cause
Mix-up vs corroboration disagreement (different chains).

## 20. Evidence
Name string; competing entity type if found; missing sentence location.

## 21. Remediation
Add “{Brand} is a {category} based in {geo}…”; verified sameAs; merger history paragraph.

## 22. Proactive
sameAs as identity glue, framed as clues not citation hacks.

## 23. Dependencies
Extract; optional extra GET. Parallel with CIT. SK-H may reuse identity facts.

## 24. Runtime
Keep search optional and capped.

## 25–27. `scripts/identity.py`; `references/whoqa_caveats.md`.

## 28. Testing
Acme Plumbing vs Acme Inc synthetic; unique brand TN; wiki-missing FP test.

## 29. Generalization
Language-limited collision search disclosed.

## 30. Example
"Brand name matches a listed company and a TV show; homepage never states industry or HQ."
