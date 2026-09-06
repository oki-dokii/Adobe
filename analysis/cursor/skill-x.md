# engagement-handoff-audit

## 1. Purpose
Detect why a visitor who arrives from an AI citation (or any deep link) cannot quickly confirm the promised fact and orient.

## 2. Scope
First-viewport identity (M); information scent (M/X); STTF-matchability of central claims (X-02); prominent trust cues (X-03); breadcrumbs/persistent nav (Y-02). CLS only as orientation proxy (O-01).

## 3. Non-Goals
Referrer personalization, geo, returning visitor (Y-01). Punishing long docs. Requiring Google-classic STTF as proven for all chat products (unknown).

## 4. Research Basis
M-01..M-03; X-01 X-02 X-03; Y-01 Y-02; Information Foraging; Stanford credibility.

## 5. Problem
Citation promise vs page effort; users abandon when scent dies.

## 6. Mechanism
Foraging + prominence-interpretation; optional text-fragments.

## 7. Inputs
Rendered/raw HTML; candidate claims from SK-K/SK-CIT; V audience.

## 8. Outputs
Findings: identity not in first viewport; claim not visible without click; scent mismatch; missing crumbs on hierarchical sites.

## 9. Preconditions
HTML for landing-like pages (home, cited templates). Claims list optional — then use H1/offering sentence.

## 10. Procedure
1. First N characters / approximate viewport of home and key templates: org identity present?
2. For each central claim: exact text in static DOM without details/summary closed? (X-02)
3. Nav labels vs target H1 (scent).
4. Breadcrumbs if depth>1 and not flat.
5. Trust cues present vs prominent (don’t score “pretty”).
6. Limitations section already at report level for Y-01.

## 11. Deterministic Checks
X-D1 identity keywords in first 500 text chars. X-D2 claim string in raw HTML. X-D3 claim only inside closed `<details>`. X-D4 breadcrumb ol/nav present on depth≥2. X-D5 nav href text vs destination title overlap.

## 12. Semantic / LLM Checks
Does first viewport answer what/for whom? Allowed: yes|no|uncertain. Trust-minimalism vs missing contact (audience-dependent).

## 13. Metrics
`claim_visible_rate`; `scent_mismatch_count`.

## 14. Confidence
High STTF/DOM; medium viewport heuristic (no real browser viewport); X-02 generative STTF unknown — language must say “deep-linkable / visible text”, not “ChatGPT will scroll”.

## 15. Severity
High: central cited-like claim hidden. Medium: weak home identity. Low: crumbs on deep docs.

## 16–18.
Long tutorial TN; flat site no crumbs TN; paraphrase FN; FAQ secondary accordion OK.

## 19. Root-Cause
Hidden claim may be SK-D interaction-gate; merge.

## 20. Evidence
Claim text, selector, screenshot not required; quoted HTML.

## 21. Remediation
Put confirming sentence in visible HTML; align nav labels; accurate breadcrumbs; surface existing trust (contact, org name) without fake badges.

## 22. Proactive
Provide `#:~:text=`-friendly unique phrasing (X-02) even if vendor use unknown.

## 23. Dependencies
After SK-K or CIT claims. Parallel with H if needed.

## 24. Runtime
Mostly deterministic; few LLM calls.

## 25–27. `scripts/visibility.py`; `scripts/scent.py`; `references/y01_limitations.md`.

## 28. Testing
Accordion TP; one-pager crumbs TN; paraphrase FN documented.

## 29. Generalization
Works without knowing the actual referrer (honest proxy).

## 30. Example
AI-likely claim “SOC 2 Type II” only inside closed FAQ; first viewport is a video autoplay with no org name.
