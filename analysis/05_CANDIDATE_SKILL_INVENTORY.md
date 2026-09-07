# Phase 5 — Candidate Skill Inventory

Exhaustive candidates from research (including unconventional). Classification is in `06_SKILL_DECISIONS.md`.

IDs: CS-xxx.

| ID | Name | Purpose | Problem | Research | Mechanism | Novelty | Impact | Auto | FP risk | FN risk | Generalize | Runtime | Deps | Overlap |
|----|------|---------|---------|----------|-----------|---------|--------|------|---------|---------|------------|---------|------|---------|
| CS-001 | audit-orchestrator | Compose skills, merge, report | Composition | Z AB S T AA U AC AE | DAG + schemas | Med | H | Mixed | Low | Low | H | Med | all | none if thin |
| CS-002 | site-type-classifier | 6-cluster + YMYL + multilingual | Wrong checks | V V-01 | Hybrid classify | H | H | Hybrid | Med | Med | H | Low | crawl sample | gates all |
| CS-003 | http-accessibility-audit | DNS/TLS/HTTP | Total blackout | C I | Deterministic | L | H | Det | Low | Geo FN | H | Low | none | CS-004 |
| CS-004 | crawlability-audit | robots sitemap canonical facets orphans | Not crawled | C | Det | L–M | H | Det | Med U8 | Med | H | Low | CS-003 | CS-003 |
| CS-005 | crawl-render-audit | Dual fetch JS | Unreadable | A D handout example | Det | M | H | Det | Med U2 | Med crawler JS | H | High render | HTTP | CS-006 |
| CS-006 | render-extract-audit | JS, media, interaction, landmarks | Unreadable | D N U9 U10 | Det+hybrid | M | H | Mixed | Med | OCR FN | H | High | crawl | CS-005 |
| CS-007 | structured-data-validity | JSON-LD valid | Invalid markup | G D | Det | L | L–M | Det | High if over-sev | Low | H | Low | pages | CS-015 |
| CS-008 | passage-chunk-quality | Self-containment | Unquotable | A16 | Hybrid | H | H | Hybrid | Med | Chunk-size unk | H | Med | extract | CS-009 CS-010 |
| CS-009 | citation-competitiveness | Specific vs vague | Not selected | B-F1 J | Hybrid | M | M | Hybrid | High voice | Med | M | Med | CS-008 | CS-010 |
| CS-010 | citation-extractability-audit | Combine 008+009+misrep+tables | Cite wrong/not | A B E J | Hybrid | H | H | Hybrid | Med | Med | H | Med | extract | 008 009 |
| CS-011 | misrepresentation-risk | Isolated fact misleads | Cited wrong | B-F2 | Hybrid | H | H | Hybrid | Med | Proxy | H | Med | 008 | 010 |
| CS-012 | ai-answerability-audit | Closed-book QA | Incomplete | K | LLM | H | H | LLM | Halluc | Conservative FN | H | High | crawl K bank | CS-013 |
| CS-013 | query-page-alignment | Intent match | Wrong page | W | Hybrid | H | H | Hybrid | Med | Med | H | Med | V queries | 012 |
| CS-014 | freshness-signal-credibility | Date convergence | Stale | I | Det | M | H | Det | U6 U7 | No snapshot | H | Low | pages | — |
| CS-015 | entity-identity-audit | Collision + aliases | Mix-up | F | Hybrid | H | H | Hybrid | High if no collision gate | Locale FN | H | Med | offsite search | CS-016 |
| CS-016 | structured-data-integrity | Schema vs text | Contradiction | G | Det | M | M | Det | Low | Low | H | Low | 007 | 015 010 |
| CS-017 | cross-source-corroboration | Independent agreement | Fragile claims | H | Fetch+compare | M | M | Hybrid | H-02 | Budget | M | High | robots third | 018 |
| CS-018 | cross-source-fact-consistency | Drift vs wiki etc | Inconsistent | P | Same | M | M | Hybrid | P-03 | Budget | M | High | 017 | 017 |
| CS-019 | first-viewport-orientation | Above-fold identity | Bounce | M | Hybrid | M | H | Hybrid | Med | Visual FN | H | Low | rendered | 020 021 |
| CS-020 | navigation-scent-check | Label vs destination | Lost | M | Hybrid | M | M | Hybrid | Med | Med | H | Low | nav | 021 |
| CS-021 | ai-referral-landing-auditor | STTF / scent / trust look | Handoff fail | X | Det+hybrid | H | H | Mixed | Accordion FP | Paraphrase FN | H | Med | W claims | 019 Y |
| CS-022 | context-retention-checks | Breadcrumbs etc | Orientation | Y | Det | L | L–M | Det | Flat sites | Inaccurate crumbs | H | Low | DOM | 021 |
| CS-023 | content-substance-check | Density | Thin/vague | J | Hybrid | L | M | Hybrid | U3 U4 | Med | M | Low | 010 | 010 |
| CS-024 | content-substance-a11y | Alt for facts | Image facts | N | Det | L | M | Det | Portfolio | OCR | H | Med | 006 | 006 |
| CS-025 | cwv-performance | LCP/INP/CLS | Slow | O | Det | L | L | Det | Lab≠field | — | M | High | — | 006 019 |
| CS-026 | technical-seo-meta | Title meta canonical | SEO | L | Det | L | L | Det | High padding | — | H | Low | C | 004 |
| CS-027 | false-positive-suppression | Never-fire | Alert fatigue | U AA | Rules | H | H | Det | Over-suppress FN | Under-suppress | H | Low | V | infra |
| CS-028 | crawl-orchestrator-layer | Budgeted crawl | 5 min | AE | Priority+SimHash | H | H | Det | Trap FP | Coverage FN | H | High | robots | infra |
| CS-029 | template-cluster-pipeline | Sample templates | Spam findings | AF | SimHash | H | H | Det | DOM≠template | — | H | Low | 028 | infra |
| CS-030 | site-graph-library | Orphans hubs | IA | AG | Graph | M | M | Det | — | — | H | Low | 028 | 004 |
| CS-031 | flagship-product-citability | Hero SKU vs brand | Product gap | AH | Compare scores | M | M | Hybrid | Wrong flagship | — | M | Low | 010 012 | 012 |
| CS-032 | composite-citability-predictor | Query-free score | Runtime | AH-02 | Weighted signals | H | H | Det | Overfit | — | M | Low | 010 | 012 |
| CS-033 | live-citation-probe | Query real AIs | Ground truth | M mentions R | Live | H | H | LLM | R-01 U12 | ToS | L | Very high | net | DEFER |
| CS-034 | llms-txt-audit | Presence of llms.txt | Fashionable | D-MYTH | Det | L | L | Det | High | — | H | Low | — | REJECT required |
| CS-035 | synonym-coverage | A12 | Query rewrite | A | NLP | L | L | Hybrid | Expert jargon | Dense IR | M | Low | 012 | 012 |
| CS-036 | robots-ai-token-matrix | Per-bot allow | AI bots blocked | C22 | Det | M | H | Det | Intentional block | New tokens | H | Low | 004 | 004 |
| CS-037 | faceted-nav-sprawl | Parameter traps | Crawl waste | C VIII AE | Det | M | M | Det | Real filters | Novel traps | H | Low | 004 028 | 004 |
| CS-038 | pdf-html-equivalent | U9 | PDF-only facts | U D | Hybrid | M | M | Mixed | Exhibit PDFs | — | H | Med | 006 | 006 |
| CS-039 | text-in-image-facts | U10 | Baked prices | D N | Hybrid | M | M | Mixed | Product photos | OCR miss | M | High | 006 | 006 |
| CS-040 | ymy-disclosure-check | Reviewer/license | YMYL harm | V-A | Hybrid | M | H | Hybrid | Non-YMYL | Miss vertical | M | Low | 002 | 002 |
| CS-041 | finding-merge-engine | Dedup RCA | Padding | T Z | Rules+LLM | H | H | Mixed | Over-merge | Under-merge | H | Low | all | 001 |
| CS-042 | severity-composer | S schema | Prioritize | S | Det | M | H | Det | False precision | Hedge FN | H | Low | 041 | 001 |
| CS-043 | report-renderer | JSON+MD BLUF | Output | AB | Template | L | H | Det | — | — | H | Low | 001 | 001 |
| CS-044 | proactive-rec-layer | Beyond defects | Rubric | AC | Hybrid | M | M | Hybrid | Generic SEO | Miss | M | Low | findings | 001 |
| CS-045 | prompt-injection-guard | Hidden text | Our LLM | AD | Det | M | H | Det | — | Novel attacks | H | Low | extract | infra |
| CS-046 | confidence-from-proxies | AA-01 | Overconfidence | AA | Det | H | H | Det | — | — | H | Low | tags | 001 |
| CS-047 | bounded-react-verify | One extra fetch | Wrong hypothesis | AA-02 | Hybrid | M | M | Hybrid | Budget | — | H | Med | hybrid skills | per skill |
| CS-048 | internal-fact-graph | Cross-page contradiction | Inconsistency | I-01 AG | Graph | H | H | Hybrid | Different products | — | H | Med | crawl | 014 018 |
| CS-049 | comparison-table-winrate | W-03 | Competitive pages | W | Det | M | L | Det | No first-party table | — | M | Low | 013 | 013 |
| CS-050 | og-twitter-preview | Link cards | Share appearance | D5 | Det | L | L | Det | — | — | H | Low | 007 | engagement low |
| CS-051 | multilingual-hreflang | V20 | Wrong language facts | V | Det | M | M | Det | — | — | M | Low | 002 | 004 |
| CS-052 | directory-presence | List intent | Substituted | AH | Fetch | M | M | Hybrid | Not applicable | — | L | Med | 017 | DEFER/budget |
| CS-053 | email-summary-analog | App F | N/A websites | HO | — | L | L | — | — | — | — | — | — | REJECT |
| CS-054 | personalization-audit | App E | User-specific answers | Y-01 | Impossible | — | — | — | — | — | — | — | — | REJECT runtime |
| CS-055 | knowledge-graph-completeness-score | Wikidata fill | Entity SEO myth | F-02 | Fetch | L | L | Det | High | Bias | L | Med | paid-ish | REJECT as score |
| CS-056 | geo-visibility-40pct | Encode GEO paper misread | F-00 | — | L | L | — | High | — | — | — | — | REJECT |
| CS-057 | heading-hierarchy-seo | Pretty outline | D II | Det | L | L | Det | High | — | H | Low | 006 | MERGE a11y only |
| CS-058 | cookie-banner-blocker | Interstitial | D VIII | Det | L | L | Det | Med | — | H | Low | 006 | optional Low |
| CS-059 | crawl-coverage-reporter | AE22 honesty | AE | Det | M | H | Det | — | — | H | Low | 028 | 001 |
| CS-060 | qualifying-context-taxonomy | E-02 config | E | Data | H | H | Det | — | — | H | — | 010 | references/ |

Unconventional kept as candidates: CS-031, CS-032, CS-045, CS-048, CS-039, CS-036.

Count: **60 candidates**.
