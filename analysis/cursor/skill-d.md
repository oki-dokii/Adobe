# render-extract-audit

## 1. Purpose
Gate 2: fact-bearing content exists in extractable text without interaction, not only in a human-visible rendered UI.

## 2. Scope
Dual-fetch deltas, interaction/API gated facts, PDF/image/video (U9/U10), landmarks/main, CSS-hidden, sanitizer for hidden prompt text.

## 3. Non-Goals
Requiring schema; llms.txt; flagging decorative JS; full-site OCR.

## 4. Research Basis
D; A11; N; U2 U9 U10; AD-01; Google JS SEO + mythbust (scope-labeled).

## 5. Problem
Machines that read HTML/text miss client-assembled facts (HO App C).

## 6. Mechanism
Raw HTML vs rendered DOM; shadow DOM; fetch-on-click; image-encoded glyphs.

## 7. Inputs
Page + optional RenderedPage + ExtractedContent.

## 8. Outputs
Findings on fact-bearing gaps; `text_delta_ratio`; render timeouts.

## 9. Preconditions
At least raw HTML. Render optional.

## 10. Procedure
1. Extract text raw.
2. Render if budget; extract again.
3. Diff; keep only candidates that look like facts (prices, dates, names, specs) via regex/NER-lite.
4. Detect accordion/details/hidden CSS for those facts.
5. PDF-only decision pages (U9).
6. Image-only prices (U10) — sample, no full OCR.
7. Landmark/`<main>` absence as Medium extractability, not Critical.
8. Feed hidden-text to sanitizer, not as facts.

## 11. Deterministic Checks
D-D1 delta on currency/date regex in rendered not raw → fail. D-D2 `<main>` missing. D-D3 `<details>` contains price regex. D-D4 PDF linked as sole pricing doc. D-D5 display:none contains fact regex.

## 12. Semantic / LLM Checks
Is this delta decorative vs fact-bearing? Allowed: fact|chrome|uncertain→no Critical.

## 13. Metrics
`text_delta_ratio = 1 - |tokens_raw ∩ tokens_rend| / |tokens_rend|` (approx); `facts_js_only_count`.

## 14. Confidence
High if regex fact in rendered not raw; low if no render (timeout).

## 15. Severity
Critical: core identity/price/legal JS-only. High: interaction-gated central claim. Low: missing OG.

## 16–18.
U2 U9 U10; portfolio TN; canvas FN.

## 19. Root-Cause
Chain 1 parent for missing answers/quotes.

## 20. Evidence
Quoted raw excerpt vs rendered excerpt + URL.

## 21. Remediation
SSR/prerender facts; HTML equivalent of PDF; text captions; unhide central claims.

## 22. Proactive
Declare `<main>`; transcripts for flagship videos.

## 23. Dependencies
Crawl. Parallel with C. Produces extractability findings. CIT/K consume extracts.

## 24. Runtime
Render is expensive — top-N only.

## 25–27. `scripts/dual_fetch_diff.py`; `references/u9_u10.md`.

## 28. Testing
SPA price TP; widget JS TN; PDF exhibit TN.

## 29. Generalization
Fact regex language-agnostic numbers; language-specific date words in refs.

## 30. Example
"Pricing amounts appear only after XHR `/api/plans`; raw HTML has no `$`/`€` amounts (0 in raw, 6 in rendered)."
