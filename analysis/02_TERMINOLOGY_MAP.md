# Phase 2 — Terminology Map

Do not silently resolve contradictions. Competing claims stay listed.

## Canonical concepts

| Variant wording in research | Canonical concept | Related | Likely skill / infra |
|-----------------------------|-------------------|---------|----------------------|
| crawlability, let in, robots, indexability, HTTP accessibility | **Access / crawl gate** | HO-008 gate 1 | crawl-access-audit |
| JS-only, SPA shell, client-rendered, render queue, dual-fetch | **Render extractability** | HO-008 gate 2; A11; D III | render-extract-audit |
| passage quality, chunk safety, self-containment, quotability, citation-worthiness | **Citation extractability** | HO-008 gate 3; A16; B-F1 | citation-extractability-audit |
| misrepresentation, faithfulness, groundedness, qualifier split, negation scope | **Citation accuracy risk** | B-F2; E-01 | same skill, second finding class |
| structured data, JSON-LD, schema.org, Microdata | **Structured data as identity/rich-results, not live LLM parse** | D-MYTH; B-F3; G; F-02 | entity + low-sev validity |
| entity collision, WhoQA, sameAs, aliases, brand identity | **Entity disambiguation** | App D; F-01 | entity-identity-audit |
| answerability, closed-book QA, “does the site say X” | **On-site answer completeness** | K | ai-answerability-audit |
| query-page match, intent alignment, win-rate | **Query–page alignment** | W | merged into answerability |
| freshness, lastmod, QDF, staleness, knowledge conflict | **Temporal credibility** | I | freshness-audit |
| corroboration, agreement, E-E-A-T, third-party | **Independent corroboration** | H; App D | corroboration-consistency-audit |
| cross-web consistency, Wikipedia drift, sameAs mismatch | **Fact consistency across sources** | P | same skill |
| orientation, scent, first viewport, handoff, landing | **AI-to-human landing experience** | M, X | engagement-handoff-audit |
| breadcrumbs, wayfinding, context retention | **On-page orientation (stateless)** | Y | same skill |
| site type, YMYL, SaaS vs ecommerce | **Site-type gating** | V | site-type-classifier |
| template, SimHash, stratified sample | **Template clustering** | AE, AF, A22 | shared crawl |
| severity, CVSS, materiality, causal cluster | **Scoring composition** | S, T | orchestrator |
| false positive, never-fire, suppression | **Finding admission control** | U, AA-E | shared registry |
| orchestrator, entrypoint, DAG | **Single composition skill** | Z, HO-003 | audit-orchestrator |
| llms.txt, chunking for AI, more schema for ChatGPT | **Unsupported optimization tactics** | D-MYTH | REJECT as required checks |
| GEO 40% visibility | **Unreliable commercial claim** | F-00; arXiv 2607.14035 | never encode as threshold |
| verbalized confidence 0–100 | **Uncalibrated self-report** | AA-01 | forbidden as primary |
| allowed-tools | **Pre-approval hint, not sandbox** | Z-01 | AD runtime |

## Duplicate ideas (same mechanism, different names)

1. A11 dual-fetch ≡ D Cluster III ≡ C client-side redirect check — **one dual-fetch pipeline**.
2. A16 self-containment ≡ B-F2 misrepresentation ≡ E-02 fact-type extractors ≡ E-03 tables — **one extractability skill**.
3. B-F1 vague marketing ≡ J-01 knowledge density — **one specificity check**.
4. M first-viewport ≡ X scent/landing ≡ Y self-orientation — **one engagement skill**.
5. H corroboration fetch ≡ P third-party compare ≡ F sameAs targets — **one bounded off-site fetch**.
6. AE SimHash ≡ AF templates ≡ A22 site-wide extrapolation — **one clustering layer**.
7. K closed-book QA ≡ W query-page alignment (W is query-conditioned completeness) — **merge**.
8. G schema↔text ≡ B-F3 schema-as-text — **same parity check**.
9. N landmarks ≡ D Cluster II — **render-extract**.
10. O CLS ≡ M first viewport — **engagement**.
11. L canonicals ≡ C Cluster V — **crawl-access**.
12. S scoring ≡ Z Cluster F/G plumbing — **policy vs pipe**: S/T policy, Z mechanics.

## Overlapping but not identical

| A | B | Difference |
|---|---|------------|
| Render extractability | Citation extractability | Reachable text vs quotable self-contained fact |
| Answerability | Citation extractability | Fact exists at all vs fact is chunk-safe |
| Freshness | Answerability K24 | Stale-but-present vs missing |
| Entity collision | Corroboration | Mix-up of identities vs agreement of claims |
| H trust verification | X-03 visual trust | Verifiable authority vs perceived prominence |
| Crawl trap (our crawler) | Faceted nav (their crawlability) | Same pattern, two consumers |

## Contradictions and competing hypotheses (unresolved)

| ID | Tension | Resolution in architecture |
|----|---------|----------------------------|
| CX-1 | Google: schema not required for generative AI vs marketing: “add schema to get cited” vs G: invalid schema still matters | **Validity/parity Low–Medium; never Critical “missing schema”; never claim ChatGPT parses JSON-LD** |
| CX-2 | Google mythbust: don’t chunk vs A16 chunk literature | **Author for humans; still flag fact/qualifier splits because extraction windows exist in many RAG systems. Do not recommend arbitrary 200-word chunks.** |
| CX-3 | Some crawlers render JS vs many lightweight fetches do not | **Report raw-vs-rendered delta with confidence: defect if fact-bearing AND raw missing; do not claim all AI crawlers fail JS** |
| CX-4 | Dense retrieval makes synonym coverage weak vs A12 synonym hypothesis | **A12 never above Low; not Critical** |
| CX-5 | WhoQA shows collision harm vs production assistants may have undisclosed mitigations | **F-01 MEDIUM on production generalization; High only with measured collision + no disambiguation** |
| CX-6 | CVSS as scoring model vs arXiv 2412.20087 domain-transfer failure | **Borrow axes, not weights (S-02)** |
| CX-7 | Live citation probing vs 5-min + ToS + R-01 sample size | **DEFER live probes; use on-site proxies (AH-02)** |
| CX-8 | K6 missing price as Severe vs V-F SaaS gating | **V beats generic (Z-F precedence)** |
| CX-9 | K21 “best for X” vs B-F1 anti-superlative | **Test raw materials, never recommend “claim you are the best”** |
| CX-10 | Breadcrumb % stats in blogs vs NN/g “no exact usage %” | **Qualitative only (Y-02)** |
| CX-11 | Ahrefs 25.7% fresher AI citations vs unreplicated commercial | **Do not encode 25.7% as a constant (I-02)** |
| CX-12 | Topic B file IDs F-01 vs Topic F F-01 | **Remap B-F1** |
| CX-13 | Handout example merges crawl+render; research splits C vs D | **Split: different mechanisms, remediations, owners** |
| CX-14 | allowed-tools vs sandbox | **Z-01: harness/scripts policy, not frontmatter** |
| CX-15 | ReAct unbounded vs 5-minute | **Cap 1 verification hop (AA-02)** |

## Broad vs narrow nesting

- “AI SEO / GEO” (broad, reject as justification) contains: access, render, extract, entity, corroboration (narrow, keep).
- “Engagement” contains: orientation, scent, handoff, context (keep as one skill).
- “Crawlability” contains: HTTP, robots, sitemap, canonical, facets (keep as one skill).
- “Answerability” contains: K taxonomy + W alignment + AH flagship (one skill).

## Technical cause vs business symptom

| Symptom | Typical cause |
|---------|----------------|
| Brand missing from AI answers | Access fail, JS-locked facts, no quotable sentence, entity mix-up, third-party substitution |
| Cited but wrong | Qualifier split, schema/text mismatch, stale syndicated copy |
| User bounces after AI click | Weak scent, claim not visible without click, missing first-viewport identity |
| “No schema” complaint | Often irrelevant to generative citation (CX-1) |
