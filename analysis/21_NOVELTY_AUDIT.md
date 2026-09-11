# Phase 24 — Novelty Audit

## Conventional (still required, not our differentiator)
- HTTP/TLS, redirects, robots syntax, sitemaps, canonicals (SK-C core)
- Generic UX: breadcrumbs presence (SK-X subset)
- Schema *validity* as SEO rich-results (kept Low)

These exist because HO-008 gate 1 is real, not because we want an SEO checklist.

## Differentiated (mechanism-backed)

| Capability | Why not generic SEO | Evidence |
|------------|---------------------|----------|
| Dual-fetch **fact-bearing** JS delta | Tied to RAG retrieval, not “SPA is bad” | A11, D, U2 |
| Citation extractability + misquote risk | Sentence/window, not backlinks | ALCE, B-F2, E |
| Closed-book answerability with abstention | Completeness vs extractability | K, SQuAD 2.0 |
| Entity collision / silent mix-up | WhoQA, not “add Organization schema” | F-01 |
| Knowledge-conflict stale syndication | Not page-age | I-01 |
| Materiality-gated corroboration | Not E-E-A-T score | P-03, H-02 |
| AI referral landing / STTF matchability | Citation click, not bounce-rate SEO | X-01 X-02 |
| Site-type gating including YMYL hedges-as-correct | FP control | V, U |
| Template rollup + coverage honesty | 5-min audit integrity | AE AF T |
| Confidence from proxies not verbalized % | AA-01 | orch |
| RFC 9309 robots 5xx fail-closed | Rare in naive checkers | C |

## Strongest differentiation
1. **Misrepresentation chain** (chunk/qualifier/table/negation) — most teams will only do “get cited”.
2. **Answerability abstention protocol** — most will ask an LLM and believe it.
3. **Classifier-gated FPs** — SaaS price, YMYL hedges, thin directories.
4. **Handoff after citation** — Round 3 on-site half with foraging + STTF, not Lighthouse.

## Do not claim novelty for
Lighthouse CWV, “add FAQ schema”, llms.txt, keyword stuffing, inventing ChatGPT ranking weights.
