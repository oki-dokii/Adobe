# ai-answerability-audit

## 1. Purpose
Measure whether crawled site text contains complete, correctly scoped answers to realistic questions about the organization — including abstention when absent.

## 2. Scope
K taxonomy filtered by SK-V; W intent alignment; AH flagship gap; composite citability as a metric. HotpotQA-style supporting page counts.

## 3. Non-Goals
Live assistant queries (DEFER CS-033). Scoring K9/K10 as defects. Recommending “we are the best”. Using parametric knowledge.

## 4. Research Basis
K-01 K-02; W-01..W-04; R-02; AH; SQuAD 2.0; HotpotQA.

## 5. Problem
A page can be crawlable and well-chunked and still never state pricing, audience, or offering.

## 6. Mechanism
Closed-book QA over extracted corpus; models over-answer unless abstention is first-class.

## 7. Inputs
Extracted pages; site_type; K bank from references.

## 8. Outputs
Per-question: answered|partial|unanswerable + cited URLs + hop count. Findings for should-be-answerable gaps.

## 9. Preconditions
Crawl covering lexicon categories or honest miss. SK-V done.

## 10. Procedure
1. Select applicable questions (drop K9/K10 from defect scoring; filter geography for digital-only, etc.).
2. For each, LLM with only crawled text; require spans.
3. Reject answers without matching evidence_items (AA).
4. Count distinct pages (K25).
5. W: map intent class to landing page type.
6. Flagship product page vs home extractability comparison (AH).
7. K21/K22: raw materials test not self-superlative.
8. Composite metric from CIT scores (AH-02) as supporting metric.

## 11. Deterministic Checks
K-D1 question applicability matrix from V. K-D2 uncited answers dropped. K-D3 K10 not in defect set. K-D4 contact regex as weak prior for K13.

## 12. Semantic / LLM Checks
Question + corpus → {answer, spans, pages} or cannot_determine. Uncertain → unanswerable not guessed.

## 13. Metrics
`answerability_rate = answered / applicable`; `multi_hop_share`; `flagship_gap`.

## 14. Confidence
Medium (LLM) unless spans exact-match. Never verbalized %.

## 15. Severity
Unanswerable K3/K6 (if applicable): high/critical. K14/K16: low. Structural gaps: not defects.

## 16–18.
B2B quote CTA TN; open source no price; logos-only K4 FN.

## 19. Root-Cause
If unanswerable because JS-locked, parent is SK-D not “add content”.

## 20. Evidence
Question, outcome, quoted spans, URLs.

## 21. Remediation
Add explicit sentences for the missing applicable question; for K21 provide category/differentiators not superlatives.

## 22. Proactive
Comparison table of own plans (not competitor slam).

## 23. Dependencies
After extract+V. SK-X uses claim list. Parallel not with those needing K.

## 24. Runtime
Most expensive LLM; cap questions (always K3 K6 K13 if applicable).

## 25–27. `scripts/closed_book_qa.py`; `references/k_question_bank.md`; `references/applicability_matrix.md`.

## 28. Testing
Empty about page TP; K10 TN; hallucinated answer rejected.

## 29. Generalization
Bank parameterized by {brand}; no live web in prompt.

## 30. Example
K6 unanswerable: no price or quote-CTA in corpus. Suggested: add pricing page or “contact for quote” in text.
