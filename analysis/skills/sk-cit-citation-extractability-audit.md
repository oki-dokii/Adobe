# citation-extractability-audit

## 1. Purpose
Gate 3: claims that should be cited are self-contained, specific, and hard to misquote.

## 2. Scope
B-F1 specificity; B-F2/A16/E-02 qualifier windows; E-03 tables; E-01 negation; G/B-F3 schema↔text; title/H1 identity sentence; AH-01 multi-encode as proactive.

## 3. Non-Goals
Predicting who will cite; Critical for missing schema; scoring brand voice pages.

## 4. Research Basis
A16; B-F1 B-F2 B-F3; E-01..E-03; J; G; L-01; D-MYTH.

## 5. Problem
Citation-worthiness ≠ accuracy; incomplete chunks yield “faithful but wrong” answers.

## 6. Mechanism
RAG windows and table cells isolate values from units/conditions/negation scope.

## 7. Inputs
ExtractedContent; page_type; SK-V.

## 8. Outputs
Findings: unquotable core claims; misquote risk; schema parity; table headers.

## 9. Preconditions
Main text extracted.

## 10. Procedure
1. Restrict to factual templates (pricing, spec, about, FAQ) unless YMYL legal.
2. Lexicon vague vs quantified.
3. Pair numbers with qualifier lexicon in a window N sentences / same cell+th.
4. Tables: th/scope.
5. Negation cues → LLM scope.
6. JSON-LD vs visible for same fact types.
7. Homepage H1/title contains category-like identity? (soft)
8. Do not fire U1 missing schema if prose has the fact.

## 11. Deterministic Checks
CIT-D1 vague/specific ratio on factual pages. CIT-D2 price regex without period/condition nearby. CIT-D3 table without th. CIT-D4 schema price ≠ visible price. CIT-D5 JSON-LD invalid JSON.

## 12. Semantic / LLM Checks
Would isolated sentence mislead on price/eligibility? Allowed: misleading|ok|n/a. Hedge appropriate vs evasive (V-A).

## 13. Metrics
`specificity_ratio`; `qualifier_window_fail_count`; `schema_parity_conflicts`.

## 14. Confidence
High deterministic table/schema mismatch; medium LLM mislead.

## 15. Severity
Critical misleading price/legal; medium vague differentiators; low invalid schema with good prose.

## 16–18.
Mission page TN; fashion voice; div-tables FN.

## 19. Root-Cause
Same mechanism for extractability and misquote lenses — one finding with two impacts if both.

## 20. Evidence
Isolated quote + full-context quote.

## 21. Remediation
Rewrite to one sentence with qualifier; add th; fix schema to match visible or remove; pull specifics from buried pages.

## 22. Proactive
Encode key facts in prose (and optionally schema as reinforcement, not as ChatGPT magic).

## 23. Dependencies
Extract; V for voice/YMYL. Parallel after extract.

## 24. Runtime
Medium; LLM only on candidates.

## 25–27. `scripts/qualifiers.py`; `references/qualifying_context_taxonomy.md`; `references/vague_lexicon.md`.

## 28. Testing
$49 intro TP; founding year TN; missing JSON-LD + good prose TN.

## 29. Generalization
Taxonomy in references; site-type fact types.

## 30. Example
Isolated: "$49/mo". Full: "$49/mo for 3 months, then $99". Risk: Critical on pricing template.
