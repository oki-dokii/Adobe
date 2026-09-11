# freshness-audit

## 1. Purpose
Assess whether time-sensitive facts have credible, consistent freshness signals and whether old on-site copies contradict current ones.

## 2. Scope
I-03 date convergence; I-02 query-deserves-freshness weighting; I-01 internal stale vs current. Sitemap lastmod honesty.

## 3. Non-Goals
Punishing evergreen/docs versioning (U6 V-D); encoding Ahrefs 25.7% as a constant; claiming we observed AI repeating the stale fact without live probe.

## 4. Research Basis
I-01 I-02 I-03; Google helpful-content date anti-pattern; C lastmod.

## 5. Problem
Fake date bumps and syndicated old press releases are more dangerous than “page is old”.

## 6. Mechanism
QDF is query-dependent; knowledge-conflict literature: repeated old facts resist override.

## 7. Inputs
Extracted dates; fact_store; page_type; V cluster.

## 8. Outputs
Inconsistent date signals; internal fact conflicts; weak dates on time-sensitive templates.

## 9. Preconditions
Pages with dates or time-sensitive types (pricing, news, leadership).

## 10. Procedure
1. Collect visible date, schema dates, HTTP Last-Modified, sitemap lastmod.
2. Flag schema-only dates; mutually inconsistent dates.
3. Classify content time-sensitivity (not blog-age alone).
4. Align facts of same type across pages; conflict → I-01 finding.
5. U6/U7 gates.

## 11. Deterministic Checks
I-D1 date fields disagree > X days. I-D2 schema dateModified without visible date. I-D3 pricing page with no date and “as of” missing (medium, not critical). I-D4 two prices for same SKU on different URLs.

## 12. Semantic / LLM Checks
Is this page historical vs claiming current? Allowed: historical|current|uncertain.

## 13. Metrics
`date_agreement`; `internal_conflicts`.

## 14. Confidence
High on on-site conflicts; low that AI will state the stale fact.

## 15. Severity
High: conflicting current vs old on price/leadership/legal. Medium: inconsistent dates. Low: old accurate timestamp.

## 16–18.
History pages TN; news homepage always today; no snapshot FN.

## 19. Root-Cause
Stale copy vs never-updated current page — remediation differs.

## 20. Evidence
Date tuples; conflicting excerpts.

## 21. Remediation
Visible dates only when substance changed; supersede banners on old PR; strengthen current canonical.

## 22. Proactive
“As of {date}” on YMYL rates.

## 23. Dependencies
Extract; fact_store. Parallel with CIT/ENT.

## 24. Runtime
Cheap.

## 25–27. `scripts/dates.py`; `scripts/fact_conflicts.py`; `references/time_sensitive_types.md`.

## 28. Testing
Press vs pricing TP; docs version TN.

## 29. Generalization
Sensitivity table by V cluster.

## 30. Example
2019 “we charge $9” press vs /pricing $29 — High internal conflict.
