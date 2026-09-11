# Phase 1 — Research Extraction

Every item below is extracted from a full read of the 34 research files plus the Adobe Round 3 handout. Hypothesis ≠ fact. Proprietary assistant internals that are unpublished are labeled as such.

Confidence: H = high, M = medium, L = low.  
Type abbreviations: RQ, OBS, FACT, HYP, INF, PAT, CE, SIG, MET, CHK, SKL, REM, IMP, WARN, FP, FN, UNC, SITE, EXP.

---

## Handout (Adobe Round 3)

| RID | Source | Section | Topic | Type | Claim/finding | Evidence | Conf | Relevance | Skill relationship |
|-----|--------|---------|-------|------|---------------|----------|------|-----------|-------------------|
| HO-001 | PDF p.1 | Intro | Mission | FACT | Marketplace must audit arbitrary sites for AI discoverability AND on-site engagement | Handout text | H | H | Orchestrator scope |
| HO-002 | PDF p.1 | Learn from the wild | Generalization | FACT | No test-site list; judged on unseen sites; design for patterns not examples | Handout | H | H | All skills: no hard-coded sites |
| HO-003 | PDF p.1–2 | Submit | Packaging | FACT | agentskills.io SKILL.md + scripts/references; marketplace.json; exactly one entrypoint | Handout | H | H | Marketplace structure |
| HO-004 | PDF p.2 | Report schema | Output | FACT | Min finding fields: id, title, severity, evidence, suggested_action; plus site, audited_at, severity counts | Sample JSON | H | H | Finding contract (superset allowed) |
| HO-005 | PDF p.2 | Guardrail | Safety | FACT | Recommend-only; no live-site modification; no destructive/authenticated/site-altering actions | Handout | H | H | All scripts GET-only |
| HO-006 | PDF p.3 | Rubric | Composition | FACT | Decomposition rewarded if genuine SoC; single well-built skill not penalized; padding penalized | Rubric | H | H | KEEP/MERGE policy |
| HO-007 | PDF p.4 | Constraints | Runtime | FACT | Zip ≤50MB no model weights; audit <5 min typical site; respect robots.txt; portable; no external service to resolve manifest | Handout | H | H | AE crawl + Z Cluster H |
| HO-008 | PDF App A | 3-gate | Mechanism | FACT | Crawler let in → can read → can pick out the specific fact | Appendix | H | H | Crawl / render / citation chain |
| HO-009 | PDF App B | Assistants | Mechanism | FACT | Many assistants search/fetch then cite pages that are easy to reach, read, and quote | Appendix | H | H | Citation extractability |
| HO-010 | PDF App C | Reading | Mechanism | FACT | Client-assembled / non-text facts can be invisible to simple readers | Appendix | H | H | Render-extract |
| HO-011 | PDF App D | Trust | Mechanism | FACT | Independent agreement increases trust; name collisions cause mix-ups | Appendix | H | H | Corroboration + entity |
| HO-012 | PDF App E | Personalization | Mechanism | FACT | Assistants use prior user context; two people can get different brands | Appendix | H | H | Y-01: not fully testable |
| HO-013 | PDF App F | Email | Mechanism | FACT | Non-text / filler-buried content disappears from summaries | Appendix | H | M | Analogous to page extractability |
| HO-014 | PDF p.2 | Example layout | Illustrative | FACT | Example skills: audit-orchestrator, crawl-render-audit, freshness-corroboration, engagement-audit — illustrative not mandatory | “illustrative — any structure is fine” | H | H | Do not copy blindly |
| HO-015 | PDF p.3 | Proactive | Rec | FACT | Suggestions may go beyond detected defects | Handout | H | H | AC layer |

---

## A — AI Discovery Mechanics (Pulkit)

| RID | Section | Type | Claim | Evidence | Conf | Skill |
|-----|---------|------|-------|----------|------|-------|
| A-001 | A1–A4 | FACT | ChatGPT/Perplexity/Gemini/Claude documented pipelines share decide-search → query → retrieve → rank → generate → cite | Vendor docs | H | Generic-pipeline skills, not vendor trivia |
| A-002 | A1–A4 | OBS | OpenAI historically Bing then own crawler; Claude search via Brave — not vendor-confirmed as FACT | Independent writeups | M | Do not hard-code providers |
| A-003 | A11 | FACT | Retrieval is a necessary gate; generation quality is moot if page never retrieved | RAG literature + vendors | H | Crawl + render |
| A-004 | A11 | CHK | Dual-fetch raw HTTP vs rendered DOM; flag fact-bearing JS-only content | Proposed | H | render-extract-audit |
| A-005 | A11 | FP | JS-heavy interactive widgets are not automatically defects | Stated | H | U2 |
| A-006 | A12 | FACT | Gemini/Claude can issue multiple reformulated queries per prompt | Vendor docs | H | Query set in K/W, not one string |
| A-007 | A12 | HYP | Single-phrasing facts miss reformulations | Untested | L | Weak signal only; semantic retrieval counterexample |
| A-008 | A13 | INF | Comparison/“best X” queries need explicit category + differentiators | GEO-bench + IR intent | M | answerability + citation |
| A-009 | A16 | FACT | Passage/chunk quality: self-contained facts; “Lost in the Middle” | Peer-reviewed chunking | H | citation-extractability |
| A-010 | A17 | FACT | SIGIR 2026 “What Gets Cited”: citation allocation ≠ rank position | Named paper in research | H | Competitiveness ≠ SEO rank |
| A-011 | A18 | INF | Source substitution when brand page is hard to quote | Pipeline logic | M | Extractability vs third-party |
| A-012 | A22 | INF | Template-level findings need clustering + 2+ samples | Deferred to AE/AF | H | Shared crawl infra |
| A-013 | N | SKL | Candidate `crawl-render-audit` (also absorbs C/D) | Author proposal | M | SPLIT later: access vs render |
| A-014 | Findings A-01..A-03 | FACT | Register findings exist in file (pipeline shape; citation vs rank; dual-fetch) | File §findings | H | See coverage audit |

Additional extracted checks: candidate-generation vs rerank (A14/A15); entity retrieval handed to F; do not encode Bing market share.

---

## B — AI Citation Mechanics (Pulkit)

Note: Foundational IDs F-01..F-03 in this file collide with Topic F’s F-01. Canonical remap: **B-F1, B-F2, B-F3**.

| RID | Section | Type | Claim | Evidence | Conf | Skill |
|-----|---------|------|-------|----------|------|-------|
| B-F1 | Citation-worthiness | FACT | ALCE: incomplete citation support ~50% on ELI5; passage quality beats prompt tricks | Gao et al. EMNLP 2023 | H | citation-extractability |
| B-F1b | GEO | FACT | Quotations/statistics/attributed phrasing lift visibility ~30–40% in GEO-bench | Aggarwal et al. 2024 | M | Passage attractiveness |
| B-F1c | FP | FP | Do not penalize mission/brand-voice pages | Stated | H | Site-type gate |
| B-F2 | Misrepresentation | FACT | SourceCheckup 50–90% unsupported citations in medical RAG | Peer-reviewed | H | Qualifier-separation risk |
| B-F2b | Mechanism | INF | Chunk splits fact from qualifier → “faithful” but misleading citation | Synthesis A16+ALCE | M | Same check, two lenses |
| B-F3 | Schema live parse | OBS | Williams-Cook + SearchVIU: ChatGPT/Perplexity treat JSON-LD as text; invalid JSON-LD still “extracted” | Practitioner tests | M | Do not treat missing schema as Critical |
| B-001 | Perplexity A vs B | INF | Cite-ability = reach + read + quote, not brand fame alone | Handout B + B research | M | Composite of C+D+citation |
| B-002 | Competition | INF | List/directory sources often win comparison queries | A18 + AH | M | AH list-intent reframe |

Groundedness vs faithfulness vs factuality must be labeled separately in misrepresentation findings.

---

## C — Crawlability (Pulkit)

| RID | Cluster | Type | Claim | Evidence | Conf | Skill |
|-----|---------|------|-------|----------|------|-------|
| C-HTTP | I | FACT | DNS/TLS/4xx/5xx are universal fetch blockers | RFCs | H | crawl-access-audit first |
| C-TLS | I | OBS | Incomplete cert chain: works in Chrome, fails fresh clients | Ops literature | H | High severity |
| C-REDIR | II | FACT | Loops always bad; hop limits for AI crawlers unconfirmed | RFC 9110; OBS hop counts | H/L | Flag loops; hedge hop thresholds |
| C-RFC | III | FACT | RFC 9309: 4xx robots.txt fail-open; 5xx fail-closed; 500 KiB cap | RFC 9309 | H | Non-obvious check |
| C-BOTS | III | FACT | Distinct AI crawler tokens (OAI-SearchBot, Claude-SearchBot, etc.) | Vendor robots docs | H | Report token-level allow/disallow |
| C-U8 | III | FP | Disallow of admin/search/tag archives is often intentional | U + C | H | Suppression |
| C-META | IV | FACT | noindex / X-Robots-Tag page-level | Google docs | H | Distinct from robots.txt |
| C-CANON | V | FACT | Canonical conflicts / self-canonical issues | Google canonicalization | H | Crawl-access |
| C-SITEMAP | VI | FACT | Sitemaps surface orphans; lastmod can be gamed | Google + I-03 | H | Seed crawl + freshness |
| C-GRAPH | VII | INF | Depth + orphans hurt discoverability | Link-graph practice | M | AG + crawl |
| C-FACET | VIII | FACT | Faceted URL explosion is a top crawl-waste class (Illyes ~half of crawl issues cited) | Google faceted-nav docs | H | Trap defense AE |
| C-URL | IX | CHK | Normalize session IDs, tracking params, slash/case | Standard | H | Shared URL util |
| C-404 | X | CHK | Soft 404 / broken internal links | Standard | H | Crawl-access |
| C-BUDGET | XI | FACT | Google crawl budget ≠ our 5-min budget but same multi-dimension idea | Google crawl-budget docs | M | AE time-primary budget |
| C-01..C-04 | Register | FACT | Strongest C findings recorded in file | File | H | Coverage audit |

Candidate skills named: `http-accessibility-audit` (run first), rest of C in `crawlability-audit`.

---

## D — Rendering / Machine Readability (Pulkit)

| RID | Cluster | Type | Claim | Evidence | Conf | Skill |
|-----|---------|------|-------|----------|------|-------|
| D-MYTH | Intro | FACT | Google AI-optimization guide: no mandatory chunking; structured data not required for generative AI search; llms.txt ignored by Google Search | developers.google.com 2026-07-10 | H | REJECT llms.txt-as-required; schema never Critical for “AI comprehension” |
| D-SCOPE | Intro | WARN | Mythbusting is Google-specific; extractability still universal | Author distinction | H | Label vendor scope |
| D-SD | I | INF | Schema value = rich results + entity clues, not live LLM parse | Google + B-F3 | H | Low severity validity check |
| D-OG | I | FACT | OG/Twitter = link unfurl, not content extraction | ogp.me | H | Low / engagement-adjacent |
| D-LAND | II | FACT | Google: browser agents inspect DOM + accessibility tree | Google AI opt guide | H | Landmarks in render-extract |
| D-MAIN | II | FACT | Boilerplate removal is a 20+ year IR field (Boilerpipe, Readability, Trafilatura) | SIGIR 2023 comparison | H | Shared extractor |
| D-SSR | III | FACT | Google JS SEO: only rendered-HTML-visible content indexed; two-wave crawl/render | Google JS SEO | H | Dual fetch + render timeout |
| D-INT | IV | CHK | Click/scroll/accordion-gated facts | Mechanism C appendix | H | render-extract + X |
| D-API | V | CHK | Client API-only facts | Same | H | Dual fetch |
| D-MEDIA | VI | CHK | Image/PDF/video/canvas-trapped facts | Appendix C | H | U9/U10 gates |
| D-HIDE | VIII | CHK | CSS-hidden / cookie walls / boilerplate ratio | Standard | M | Careful FPs |
| D-01..D-03 | Register | FACT | File register | File | H | |

Candidate: lightweight `structured-data-validity`; main skill `crawl-render-audit` overlapping A11.

---

## E — Extraction & IA (Pulkit)

| RID | Type | Claim | Evidence | Conf | Skill |
|-----|------|-------|----------|------|-------|
| E-01 | FACT | Negation-scope is hard (xNot360 GPT-4 ~0.78); compounds with chunk split | NLP literature | H/M | citation-extractability linguistic layer |
| E-02 | INF | Pricing/spec/contact/etc. are one mechanism + qualifier taxonomy | Synthesis | H | Config not 7 skills |
| E-03 | FACT | HTML tables are non-trivial QA (WikiTableQuestions); `<th>`/`scope` high leverage | Pasupat & Liang 2015 | H | Deterministic table check |
| E-IA | INF | Heading/nav IA affects chunking and human orientation | Overlap A16 + Y | M | Shared, not extra skill |

---

## F — Entity (Harsh)

| RID | Type | Claim | Evidence | Conf | Skill |
|-----|------|-------|----------|------|-------|
| F-00 | OBS | GEO/Entity-SEO commercial content systematically overclaims | vs Google docs + arXiv 2607.14035 | H | Process: primary sources only |
| F-01 | FACT | WhoQA: same-name conflict collapses accuracy; some models fail silently | arXiv 2410.15737 | H | entity-identity-audit |
| F-02 | FACT | No primary causal link Organization schema/Wikidata completeness → assistant citation | Google docs + GEO survey | H | Never score KG absence as Critical |
| F-alias | INF | Aliases/legal names need on-page + sameAs consistency | Topic F body | M | entity-identity |
| F-merger | INF | Post-merger identity needs explicit narrative | Topic F | M | Conservative scoring |
| F-coll | FP | Low-prominence homonyms must not fire High | F-01 FP | H | Collision-risk gate |

---

## G — Structured Data (Harsh)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| G-01 | Schema invalid / type-wrong / unparseable JSON-LD is a real defect for consumers that do parse it (search rich results, some KG ingest) | H | validity subcheck, Low–Medium |
| G-02 | Schema↔visible-text disagreement is the high-value check (can cause misrepresentation if any consumer trusts markup) | H | Shared with B-F3; entity + citation |

Do not emit “add more schema to get cited by ChatGPT.”

---

## H — Trust / Corroboration (Harsh)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| H-01 | Independent multi-source agreement is the handout D mechanism | H | corroboration-consistency |
| H-02 | “Mechanism well-established, causal impact on citation unproven” must be a confidence state | H | S schema |
| H-03 | Shared third-party fetch/identity infrastructure across H/F/P | H | Shared fetcher |
| H-04 | Awareness-only notes exist; do not overclaim E-E-A-T as a ranking API | M | Language discipline |

Runtime: limited, robots-respecting, public third-party pages only; no paid APIs (Z38).

---

## I — Freshness (Pulkit)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| I-01 | Stale syndicated facts resist override (knowledge conflict / repetition) | H/M | Internal old-vs-current conflict |
| I-02 | Freshness is query-dependent (Google QDF); AI-vs-Google 25.7% figure is single commercial OBS | H / L | Severity weighting |
| I-03 | Date-only updates without substance are discounted by Google | H | freshness-audit |
| I-evergreen | FP | Evergreen/docs versioning ≠ calendar staleness | H | V cluster D + U6 |

Candidate: `freshness-signal-credibility`.

---

## J — Content Quality (Harsh)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| J-01 | Vague unfalsifiable marketing vs specific claims | H | MERGE into citation-extractability (B-F1) |
| J-02 | Thin/near-duplicate templates | H | MERGE; AF sampling; U3 thin-by-design |

---

## K — AI Answerability (Pulkit)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| K-01 | Closed-book QA with required abstention (SQuAD 2.0) + supporting-fact page counts (HotpotQA) | H | ai-answerability-audit |
| K-02 | K9 limitations / K10 competitors are structurally expected gaps — do not score as defects | H | Taxonomy config |
| K-B2B | SITE | Enterprise “contact for quote” is valid pricing pattern | H | V cluster F |
| K-halluc | FP | LLM overstates answerability unless citation-to-crawl required | H | AA + closed book |
| K-21 | INF | “Best for X” tests raw materials (category, differentiators), not self-superlatives | H | Avoid F1 conflict |

Question bank K3–K24 is configuration, not 22 skills.

---

## L — Technical Discovery Signals (Harsh)

| RID | Type | Claim | Conf | Disposition |
|-----|------|-------|------|-------------|
| L-01 | Titles/H1 as extractable identity statements can matter; generic meta-description SEO does not have evidenced AI-citation causality | M | MERGE title/H1 into citation/entity; REJECT generic meta checklist |
| L-02 | Canonical/internal-link overlap with C | H | MERGE into crawl-access |

---

## M — On-site Engagement (Harsh)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| M-01 | First-viewport must answer “what is this / is it for me” | H | engagement-handoff |
| M-02 | Information scent / nav labels matching promise | H | engagement-handoff |
| M-03 | Dual confidence: mechanism H, combination hypothesis L | H | S dual-confidence |
| M-X | Overlap with X landing audit | H | MERGE M+X+Y |

---

## N — Accessibility (Harsh)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| N-01 | Alt/transcripts for fact-bearing non-text | H | MERGE render-extract |
| N-02 | Do not overclaim alt-text → citation | M | Confidence language |

---

## O — Performance (Harsh)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| O-01 | No standalone skill; CLS-proxy folds to M first-viewport; LCP/INP redundant with render | H | MERGE/REJECT standalone |

---

## P — Cross-Web Consistency (Harsh)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| P-01 | On-site vs Wikipedia/Wikidata/LinkedIn/etc. fact drift | M | corroboration-consistency |
| P-02 | sameAs target mismatch | H | Shared with F |
| P-03 | Materiality = objective-verifiability × decision-relevance; fail either → max Informational | H | S gating |

---

## Q / R — Methodology (Pulkit)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| Q-01 | Field research ≠ runtime audit crawl | H | REJECT as skill |
| Q-02 | Wild patterns inform checks | M | Design input |
| R-01 | Measurement QA / sample size | H | U12: don’t claim invisibility from 1 query |
| R-02 | Query construction must cover intents/paraphrases | H | W/K query gen |
| R-live | WARN | Live assistant probing is slow, non-deterministic, ToS-sensitive | H | DEFER live-citation-probe |

---

## S — Scoring (Harsh)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| S-01 | Three axes: evidence strength, materiality, causal structure | H | Orchestrator |
| S-02 | Borrow CVSS structure not formula; composite=max for jointly necessary; per-category calibration | H | Orchestrator |
| S-alert | FACT | Alert fatigue is a documented tool-failure mode | H | Cap finding count via merge |

---

## T — Root Cause (Harsh)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| T-01 | Classify single-sufficient / jointly-necessary / primary+amplifiers | H | Orchestrator merge |
| T-02 | Consistent page/entity/claim anchors across skills | H | Data contracts |
| T-03 | Don’t average jointly-necessary severities | H | Prioritization |

---

## U — False Positives (Soham)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| U-table | CHK | U1–U8, U12 never-fire table | H | Shared suppression registry |
| U9 | FACT | PDF OK as fixed artifact; not sole format for live decision facts; must be tagged | H | render-extract |
| U10 | INF | Images OK when they ARE the product; not for baked-in prices | H | render-extract |
| U11 | INF | Linking to authoritative regulator is a positive pattern | H | Suppression + AC |
| U-flow | IMP | Evidence → site-type gate → sampling → corroboration → severity | H | Pre-finalization (AA Cluster E) |
| U-01 U-02 | Register | File | H | |

---

## V — Site Type (Soham)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| V-map | INF | 20 types → 6 clusters + multilingual orthogonal | H | site-type-classifier |
| V-A | FACT | YMYL: hedging is correct; missing mandatory disclosure is High | H | Gated checks |
| V-B | INF | Directories: thin + outbound links are the product | H | U3 U11 |
| V-C | INF | University/gov commercial activity often off-domain | H | Don’t flag missing pricing |
| V-D | INF | Docs freshness = version not calendar | H | I + U6 |
| V-E | INF | News/blog/portfolio authorship spectrum | M | J/H gates |
| V-F | INF | SaaS price-gating legitimate; ecommerce missing price is a flag | H | K6 |
| V-01..V-04 | EXP | Live-site hybridity falsified naive size heuristics; classifier must run always | H | No size gate |
| V-20 | INF | Multilingual is an axis: hreflang/in-language facts | M | Conditional |

---

## W — Query→Page (Soham)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| W-01 | INF | Intent-type alignment: page must match query class | H | MERGE into answerability |
| W-02 | INF | Phrasing/extraction bias; buried answers | H | citation + answerability |
| W-03 | CHK | Comparison-table win-rate tally (deterministic) | M | Subcheck |
| W-04 | INF | Don’t punish missing first-party comparison page if none exists; third-party numeric consistency instead | H | FP control |
| W-SKL | SKL | Query-to-Page Alignment Auditor | — | MERGE K |

---

## X — AI–Human Handoff (Soham)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| X-01 | FACT | Information Foraging: weak scent → abandon | H | engagement-handoff |
| X-02 | FACT | Scroll-To-Text-Fragment is real; Google classic search uses it; generative products unconfirmed | H/M/UNK | Deterministic claim-visibility |
| X-03 | FACT | Stanford Web Credibility: look/prominence drives fast trust | H | Distinct from H verification |
| X-SKL | SKL | AI Referral Landing Experience Auditor | — | MERGE M+Y |

---

## Y — Context Retention (Soham)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| Y-01 | FACT | Cannot test real referrer, geo-personalization, returning-visitor state | H | Report limitations (AB) |
| Y-02 | FACT | Breadcrumbs help (NN/g qualitative); popular % stats unverified — do not cite | H/L | Deterministic IA check |
| Y-self | CHK | In-page orientation without session: headings, nav, “you are here” | H | engagement-handoff |

---

## Z — Skill Design (Soham)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| Z-01 | FACT | SKILL.md requires name+description; allowed-tools does NOT sandbox | H | Packaging |
| Z-02 | INF | DAG already implied by V/W/X/Y | H | Orchestrator |
| Z-B | FACT | Progressive disclosure; SKILL.md lean; refs/scripts | H | SKILL.md design |
| Z-D | IMP | Shared input/output envelopes; status partial first-class | H | Contracts |
| Z-E | IMP | Determinism, timeouts, retries, error taxonomy | M (numbers unvalidated) | Shared HTTP |
| Z-F | IMP | Hash finding IDs; merge overlapping evidence; V beats generic on contradiction; confidence = min | H | Merge engine |
| Z-G | IMP | Recs must cite finding_ids; rank severity × corroboration × cost-tier | H | AC+orchestrator |
| Z-H | FACT | Read-only, robots, rate limit, <5 min, 50MB, no paid APIs | H | Compliance |

Illustrative timeouts (unvalidated): crawl 60s, fetch 8s, skill 45s, report 15s.

---

## AA — Reasoning Quality (Soham)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| AA-01 | FACT | Verbalized LLM confidence is overconfident; do not use as primary confidence | H | Confidence function |
| AA-02 | FACT | ReAct pattern; bound to 1 verification round | H/M | Hybrid checks |
| AA-test | IMP | Deterministic iff fully specified input, identical verdict, no meaning judgment | H | Check tagging |
| AA-E | IMP | Pre-finalization suppression consultation | H | U registry |
| AA-insuf | IMP | insufficient_evidence first-class | H | Schema |

---

## AB — Report Design (Soham)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| AB-01 | IMP | Dual JSON + human from one object; BLUF exec summary | H | Orchestrator render |
| AB-02 | IMP | No bare % confidence; quoted evidence; STTF deep links; template sample counts | H | Finding render |
| AB-lim | IMP | Surface Y-01 untestable items + AE coverage | H | Report.limitations |

---

## AC — Proactive Recs (Soham)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| AC-01 | IMP | Proactive recs still need evidence of opportunity, not vibes | H | Rec generator |
| AC-02 | IMP | Internal completeness + opportunistic competitor scan | M | Budgeted; no paid SEO APIs |
| AC-good | INF | Recognize already-good patterns (U11) | M | Positive findings optional |

---

## AD — Security (Soham)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| AD-01 | WARN | Page text can contain prompt-injection / hidden text targeting our LLM checks | H | Sanitize extracted text; ignore CSS-hidden instructions |
| AD-RO | FACT | No POST/PUT/DELETE; no auth | H | CI grep |

---

## AE — Crawling (Pulkit)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| AE-01 | FACT | SimHash Hamming ≤3 (paper example) for near-dup; use DOM-path for templates, text for dups | H | Shared crawl |
| AE-02 | FACT | No universal spider-trap detector; layered defense | H | Crawl resilience |
| AE-prio | INF | Homepage + sitemap seed; score by K taxonomy; topic locality | M | Crawl planner |
| AE-40/60 | HYP | ~40% crawl / 60% analysis split | L | Tune empirically |
| AE-stop | INF | Stop when K cats covered, 2 samples/template, cluster discovery flattens | M | Early stop |
| AE-22 | IMP | Always report coverage estimate | H | Report |

---

## AF — Templates (Soham)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| AF-01 | IMP | Corpus-wide template clustering is a pipeline stage | H | Shared with AE-01 |
| AF-2 | INF | ≥2 samples before site-wide extrapolation | H | Merge engine |

---

## AG — Site Graph (Pulkit)

| RID | Type | Claim | Conf | Home |
|-----|------|-------|------|------|
| AG-01 | IMP | Graph library downstream of crawl (orphans, hubs, depth) | H | Shared infra |
| AG-02 | IMP | Use graph for IA/orphan evidence, not a user-facing “knowledge graph skill” | H | crawl-access + engagement |

---

## AH — Out of the Box (Soham)

| RID | Type | Claim | Conf | Skill |
|-----|------|-------|------|-------|
| AH-01 | INF | Multi-encoding of facts (prose + markup + schema) is robustness, not “schema for LLM” | H | Proactive / G |
| AH-02 | INF | Composite citability predictor cheaper than exhaustive query simulation | M | MERGE citation+answerability scoring |
| AH-flagship | SKL | Flagship product page vs brand-average extractability | M | Check inside answerability/citation |
| AH-list | INF | List-intent gaps: directory presence, not “make page more list-like” | H | Remediation language |

---

## Extraction completeness statement

- **34/34** research Markdown files fully processed.
- **1/1** Adobe handout fully processed.
- **Named FINDING IDs in source files:** 79 register findings (A-01..AH-02 as listed by grep), plus **B-file F-01..F-03** remapped to B-F1..B-F3 to avoid collision with Topic F.
- **Additional cluster-level items** in this document: HO-001..HO-015 and the per-topic rows above.

Total extracted research items in this synthesis register (RID rows): **approximately 220 named rows**, covering every file’s load-bearing claims, candidate skills, FP/FN, and implementation constraints. Cluster A–O bodies contain further check lists that are normalized in `03_CANONICAL_PROBLEM_MAP.md` and traced in `20_COVERAGE_AUDIT.md` rather than duplicated sentence-by-sentence.

**ID collision recorded, not silently resolved:** Topic B foundational IDs `F-01..F-03` vs Topic F `F-01..F-02` vs Topic B later `B-01`. Canonical IDs used going forward: `B-F1`, `B-F2`, `B-F3`, `B-01`, `B-02`, `F-00`, `F-01`, `F-02`.
