# corroboration-consistency-audit

## 1. Purpose
Find material identity/offer facts that are internally inconsistent or contradict linked public sources; avoid uncorroborated high-stakes claims being stated as if widely agreed.

## 2. Scope
On-site graph conflicts; sameAs/target pages; a **small** set of linked official profiles. P-03 materiality. H-02 language.

## 3. Non-Goals
Paid SEO APIs; E-E-A-T scores; High for “no Wikipedia”; exhaustive web crawl.

## 4. Research Basis
H-01..H-04; P-01..P-03; HO App D; Z38.

## 5. Problem
Machines treat widely agreed facts as more reliable; first-party-only claims are fragile — but absence of wiki is often notability bias (F-02).

## 6. Mechanism
Compare typed facts; independent sources reduce mix-up and support.

## 7. Inputs
Facts; sameAs; remaining time budget; robots for third parties.

## 8. Outputs
Material conflicts; fragile high-stakes uncorroborated claims at medium/low with H-02 wording.

## 9. Preconditions
Identity name known. Extra fetches optional.

## 10. Procedure
1. Build on-site fact pairs (name, geo, leaders, prices).
2. Materiality gate.
3. Fetch only linked sameAs / official social if robots allow (cap 3–5).
4. Compare; ignore slogan-level immaterial diffs.
5. If no third-party available, say so — do not invent citations.
6. Confidence language: mechanism established, citation impact unproven.

## 11. Deterministic Checks
H-D1 sameAs 404. H-D2 numeric employee/price mismatch beyond epsilon. H-D3 NAP mismatch for local (cluster B).

## 12. Semantic / LLM Checks
Are two descriptions the same entity/offer? Allowed: same|different|immaterial.

## 13. Metrics
`third_party_fetched`; `material_conflicts`.

## 14. Confidence
High on-site; medium off-site; never claim we know ChatGPT’s trust function.

## 15. Severity
High only for material on-site or linked-source contradictions. Missing wiki: no finding or low proactive.

## 16–18.
Bakery without press TN; Wikidata bias; Candid widget good.

## 19. Root-Cause
Inconsistency vs lack of notability.

## 20. Evidence
Paired quotes + URLs.

## 21. Remediation
Align facts; fix sameAs; for local, consistent NAP.

## 22. Proactive
Link official profiles; don’t restated regulated rates (U11 positive).

## 23. Dependencies
After facts/ENT. Last in DAG. Uses global rate limiter.

## 24. Runtime
Skip if time low (orchestrator).

## 25–27. `scripts/compare_facts.py`; `references/materiality.md`.

## 28. Testing
Employee count mismatch TP; missing wiki TN.

## 29. Generalization
Only follow site’s own links + sameAs — no hard-coded directories except optional well-known paths if linked.

## 30. Example
Homepage “Series B $40M” vs /press “seed $2M” both presented as current — material conflict.
