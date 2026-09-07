# Phase 5 — Gap Analysis

Question: what important failure can v0 **not** detect (or cannot report honestly)?

| Failure mode | Research | Impact | Detectable? | Evidence | Remediation | Cost | Disposition |
|--------------|----------|--------|-------------|----------|-------------|------|-------------|
| AI discovery internals (vendor rank) | A, C | High but opaque | No | n/a | n/a | n/a | REJECT fake |
| Retrieval of JS-only facts | A11 D | High | Yes | dual-fetch | SSR | High render | IN D |
| Citation of unqualifed number | B-F2 E | High | Yes | window | rewrite | Med | IN CIT |
| Completeness holes | K | High | Yes LLM | spans | add prose | High | IN K |
| Wrong page for intent | W | Med | Yes | URL vs fact location | link/IA | Med | **ADD finding_type in K** |
| Entity mix-up | F | High | Partial | on-page | disambiguate | Med | IN ENT degraded |
| Off-site unlinked wiki drift | H search | Med | Hard | search | claim/update wiki | High | **FN accepted** (linked-only) |
| Stale syndication | I | High | Partial | internal dates | supersede | Low | IN I |
| Schema contradicts visible | G | Med | Yes | JSON-LD vs text | align/remove | Low | **NAMED type in CIT** |
| Missing schema only | G D-MYTH | Low | Yes | absence | none as Critical | Low | U1 |
| Template-wide footer bug | AF | High | Yes | θ+2 | one fix | Low | INFRA |
| Orphan high-value page | AG | Med | Partial graph | WCC+coverage | inbound link | Low | IN C + AE22 |
| Cross-page same-time price A≠B | AC12 AG15 | High | Typed yes; NLP no | fact_store | reconcile | Med | **TYPED in H or I; not AG15 NLP** |
| Hidden injection / cloaking | AD D41 | High (us + them) | Partial | CSS+no toggle | delimiters; site finding | Low | **D41 + sanitizer** |
| PDF-only decision fact | U9 | Med | Hybrid | content-type | HTML equivalent | Med | IN D |
| Image-locked price | U10 N | Med | Weak w/o OCR | img without alt+fact page | text | High | IN D materiality; FN OCR |
| AI referral bounce | X | High | Partial | STTF/viewport | visible claim | Low | IN X |
| Context/personalization | Y-01 | — | No | — | — | — | LIMITATIONS |
| Live non-citation | R U12 | — | Invalid at n=2 | — | — | — | DEFER |
| Aggregator more extractable (AH9) | AH | Med | Extra fetch | 2–3 third parties | improve own extractability | High | DEFER opportunistic |
| Comparison 100% self-win | W-03 | Low | Yes | table tally | disclose authorship | Low | **CIT sub-check** |
| Slow SSR (TTFB/hero) | O weakest | Low–Med | Easy TTFB | timing | optimize asset | Low | **METRIC not finding** unless extreme |
| Multilingual mismatch | V20 | Med | Partial | hreflang/lang | consistent | Low | C + K language |
| Faceted trap | C AE | Med | Partial | URL params | robots/canonical | Low | IN C |
| Crawler trap infinite | AE AD | High (us) | Partial | growth vs hash | stop | Low | INFRA |
| Prompt injection success | AD | High us | Pattern ~35–45% | hidden | delimiters | Low | INFRA; don’t claim catch-all |
| Y9 SPA back | Y | Low | Needs interaction | — | — | Med | DEFER |
| Flagship page weaker | AH16 | Med | Yes | compare scores | strengthen product URL | Low | K sub-check |
| Directory not listed | AH CS-052 | Low | Off-site | — | — | High | DEFER |
| Agent safety SSRF | AD | High us | Yes | IP | block | Low | INFRA |
| Runtime overrun | Z AE | High us | Yes | clock | skip-ladder | — | ORCH |
| Prioritization wrong | S | Med | — | — | max not avg | — | ORCH |
| Root-cause mislabel | T | High | — | parent_id | — | — | **CONTRACT GAP** |
| Accessibility WCAG rest | N | Out of scope | — | — | — | — | REJECT |
| Performance CWV lab | O | Out | — | — | — | — | REJECT skill |

## Gap verdict

No **missing skill**. Missing **capabilities** are sub-checks, flags, and honest FNs. Highest-impact adds: extractability_flags, WRONG_PAGE, D41, named G type, typed internal conflict, U-flow, skip-ladder.
