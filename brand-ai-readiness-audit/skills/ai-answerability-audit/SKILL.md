---
name: ai-answerability-audit
description: Closed-book: does crawled text answer realistic questions with a supporting span? Distinguishes unanswerable vs wrong_page vs expected_gap. Always include K3. Do not score K9/K10 as defects.
license: MIT
---
# ai-answerability-audit

## When to use
Completeness vs extractability.

## Procedure
Regex/span answers only (uncited LLM answers invalid). K3 protected. V-F quote CTA is not a public-price defect. Metrics CoreAnswerabilityRate are report-layer, not findings. Composite citability is a HYP metric, not a finding title.
