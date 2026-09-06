# Phase 4 — Redundancy Matrix

Overlap: NONE / LOW / MEDIUM / HIGH / CRITICAL.

Pairs among 9 detection skills + orch (ORCH, V, C, D, CIT, ENT, K, I, H, X).

| Pair | Inputs | Signals | Evidence | Mechanism | Remediation | Findings | Class | Action |
|------|--------|---------|----------|-----------|-------------|----------|-------|--------|
| ORCH×all | all | merge | union | composition | n/a | coverage | LOW | Producer |
| V×all | sample pages | type | type | gating | disclosures | YMYL | LOW | Producer |
| C×D | HTTP bodies | reach vs parse | status vs delta | **different gates** | robots vs SSR | invisibility | MEDIUM | Sequential gates |
| C×K | crawl | missing pages | 404 vs unanswerable | access vs content | crawl vs write | incomplete | HIGH | If C blocked, K must not also Critical “never said” |
| D×CIT | extract | missing text vs bad text | delta vs quotes | render vs chunk | SSR vs rewrite | unquotable | **HIGH** | parent D, child CIT |
| D×K | extract | missing | same | render vs corpus QA | SSR vs add prose | unanswerable | **HIGH** | K consumes flags |
| D×X | DOM | accordion | hidden vs STTF | interaction vs forage | SSR vs open-by-default | claim not visible | **HIGH** | Split: not-in-DOM=D; in-DOM-not-visible=X |
| CIT×K | text | quote vs exist | spans | chunk vs closed-book | rewrite vs add | overlap language | **HIGH** | Different finding_type |
| CIT×ENT | schema | identity JSON-LD | sameAs vs parity | G vs WhoQA | fix markup vs disambiguate | schema | MEDIUM | G parity=CIT; identity fields=ENT |
| ENT×H | name, sameAs | 404, mismatch | URLs | mix-up vs drift | disambiguate vs update listing | sameAs | **HIGH** | sameAs 404 → ENT only; value drift → H |
| I×H | facts | conflict | quotes | time vs third-party | dated vs off-site | inconsistency | **HIGH** | I time-indexed; H off-site |
| I×K | dates | K24 stale | | present-but-stale vs missing | update vs add | | MEDIUM | K flags, I diagnoses |
| H×K | facts | uncorroborated | | presence vs agreement | | | LOW | |
| X×K | claims | landing | viewport | completeness vs arrival | | | MEDIUM | X consumes K/CIT claim list |
| C×I | lastmod | sitemap dates | | access metadata vs credibility | | | LOW | I consumes, C does not severity |
| CIT×J-thin | text | density | | same as B-F1 | | | NONE extra | already one skill |
| V×K | type | K6 price | | gating | | | MEDIUM | V wins |

## CRITICAL overlaps (must not emit independent Criticals)

1. SPA fact lock: D primary; CIT/K/X amplifiers or omit.
2. robots fail-closed: C only; all else skipped.
3. Template clones: one finding (AF).
4. sameAs 404: ENT not also H.
5. Old press vs new price: I not also H unless third-party involved.

## Shared infra that was at risk of duplication

`compare_claim_against_source` — F, G, H, P, I. **One function.**

SimHash — AE, AF, AD traps, AG attributes. **One service.**

Dual-fetch — A11, D, C client redirect. **One pipeline.**

## Decision

No folder merges. **Redefine boundaries + parent/child + skip-if-upstream-critical.**
