# Phase 1 — Second Independent Coverage Audit

Method: re-opened all 34 `data/*.md` files (headings, synthesis sections, candidate-skill recommendations, FP tables) and compared to v0 dispositions in `20_COVERAGE_AUDIT.md`. Disposition codes: **IN** skill, **INFRA**, **METRIC**, **MERGED-OK**, **MERGED-TOO-HARD**, **DEFER**, **REJECT**, **GAP**, **DISAGREE**.

No important idea may vanish. If v0 and research disagree, both are listed.

---

## Per-file audit

| File | Author | Strongest idea | v0 home | Second-pass disposition | Attack |
|------|--------|----------------|---------|-------------------------|--------|
| A | Pulkit | Retrieve→cite pipeline; dual-fetch; A16 self-contain; A22 templates | C/D/CIT/infra | IN | A12 synonyms over-merged as Low inside K — OK. Do not fake vendor rank. |
| B | Pulkit | B-F1 worthiness vs B-F2 accuracy; B-F3 schema not live-parsed | CIT | IN | ID collision F-01 vs Topic F still a documentation hazard. |
| C | Pulkit | HTTP/TLS, RFC 9309, AI tokens, facets, orphans | SK-C | IN | Conventional SEO bulk; must not dominate report. |
| D | Pulkit | Dual-fetch; interaction vs DOM-present accordion; **D41 cloaking** | SK-D | **GAP: D41** | Sanitizer covers *our* LLM; D41 is a *site* finding (permanent hide, no toggle). v0 treated AD as infra-only. |
| E | Pulkit | Qualifier taxonomy; tables; negation | CIT refs | IN | Config not a skill — correct. |
| F | Harsh | WhoQA; reject GEO 40%; KG completeness unevidenced | SK-ENT | IN | Collision without search API is a **degraded** check; v0 under-specified fallback. |
| G | Harsh | Markup↔visible mismatch (Google: validators cannot catch this); `@id` linking | MERGED CIT/ENT | **MERGED-TOO-HARD** | G’s differentiator is not “citation.” Must be a **named finding_type** `schema_visible_mismatch`. `@id` linkage = Low opportunity, not defect. Do **not** add 11th skill. |
| H | Harsh | Independent corroboration; **contradiction > absence**; H-02 unproven citation causality | SK-H | **DISAGREE language** | Research describes a *search pass*. Skill spec is linked-only. **Lock linked-only**; contradiction vs absence must be explicit finding classes. On-site conflicts overlap I. |
| I | Pulkit | Date-signal credibility; QDF; old press vs current | SK-I | IN | Must not punish evergreen/docs. Internal *same-time* conflicts underspecified vs H. |
| J | Harsh | Specificity vs vague; thin/duplicate | CIT | IN | U3 thin-by-design must gate. Duplication detector is AF templates, not a J skill. |
| K | Pulkit | Closed-book QA; K9/K10/K21/K22 not defects; HotpotQA concentration | SK-K | IN | Metrics ≠ skill. Hallucination guard (span required) is load-bearing. |
| L | Harsh | Canonicals only if dup evidence; titles as retrieval/identity not ranking | C + CIT | MERGED-OK | Absence of canonical ≠ defect (L primary). v0 C must not flag missing canonicals blindly. |
| M | Harsh | First viewport; scent; 50ms/3.42s as cite-with-caution | SK-X | IN | Do not encode 75/94/38% marketing. |
| N | Harsh | Alt on **content-bearing** images; no WCAG suite | SK-D | MERGED-OK | WebAIM ~53% missing alt → materiality gate mandatory. |
| O | Harsh | LCP/INP ≡ JS-render symptom; CLS static proxy; **TTFB gap** | REJECT standalone; CLS→X | **GAP (honest)** | O weakest assumption: slow SSR hero image. Optional **TTFB metric** on SK-C, not a skill, not Critical. |
| P | Harsh | Materiality two-axis; Wikipedia infobox > Wikidata; LinkedIn directionality unknown | SK-H + compare_claim | IN | Shared function is correct. |
| Q | Pulkit | Field method, not runtime | REJECT as skill | REJECT | Keep as eval methodology for later. |
| R | Pulkit | Invalid live-query designs; sample size | DEFER live probe; U12 | IN as rule | Never claim non-citation from 2 queries. |
| S | Harsh | Axes not CVSS weights; jointly-necessary = **max** | orch | IN | v0 formula `priority_score` is original synthesis — do not pretend it is a standard. |
| T | Harsh | Symptom vs cause; jointly-necessary; merge | orch | IN | **parent_id missing** in contracts → under-merge/over-fire risk. |
| U | Soham | U1–U12 table; U13–U18 **one admission flow** | suppress infra | **MERGED-TOO-HARD** | v0 has U table; **U13–U18 flow is not a mandatory pre-emit procedure** in skill specs. |
| V | Soham | Always-run classifier; 6 clusters + multilingual; V beats generic | SK-V | IN | Cascade risk if wrong cluster. Conservative fallback required. |
| W | Soham | Intent→page; **WRONG_PAGE vs missing**; comparison 100% win-rate | MERGED SK-K | **MERGED-TOO-HARD** | Unique mechanism lost: fact exists on deep page, homepage asked. W-03 is deterministic on-site, not K. |
| X | Soham | Foraging; STTF; visual trust | SK-X | IN | Accordion overlap with D Cluster IV — boundary needed. |
| Y | Soham | Y-01 untestable; Y-02 crumbs; Y9 SPA-back | SK-X + limitations | DEFER Y9 | Correct. |
| Z | Soham | One entrypoint, DAG, contracts, 5 min / 50MB, allowed-tools ≠ sandbox | orch | IN | |
| AA | Soham | No verbalized %; det vs LLM three-question test; ReAct cap 1 | orch/lib | IN | |
| AB | Soham | Dual render one object; BLUF | orch | IN | |
| AC | Soham | Opportunity vs defect dual threshold; AC12 cross-page | orch recs | **GAP AC12** | Cross-page inconsistency deferred as AG15. Typed-fact version should not wait for NLP claim graph. |
| AD | Soham | Indirect injection; delimiters primary; hidden-text supplementary; SSRF | infra | IN as safety; **GAP as site finding** if D41 not emitted | Microsoft “Summarize with AI” analog is this product. |
| AE | Pulkit | Time-primary crawl; SimHash online; coverage AE22 | infra | IN | 40/60 unvalidated. |
| AF | Soham | Corpus θ, 2–3 confirm, two-tier report language; reconcile Pulkit | infra join | IN if one subsystem | Highest integration risk remains. |
| AG | Pulkit | Graph lib; WCC; HITS; AG15 E2E untested | infra + SK-C orphans | DEFER AG15 hard findings | Isolation without AE22 is a lie. |
| AH | Soham | Composite citability; flagship gap; AH9 competitive extractability; **AH8 missing text** | METRIC + SK-K | DEFER AH8, AH9 third-party grid | AH9 needs extra fetches — opportunistic only. |
| Handout | Adobe | Dual mandate AI+engagement; 1 entrypoint; 3 illustrative gates | orch | IN | Research correctly **splits** crawl vs render vs the example merge. |

---

## Ideas v0 treated as covered that are not actually specified

1. **D41 permanent hidden text** (site finding).
2. **U13–U18 as executable admission control** on every emit.
3. **W finding class WRONG_PAGE** (answer exists, not on the intent-matched URL).
4. **W-03 100% self-win comparison table** (disclosure, not “be fair”).
5. **G named schema↔visible finding type** (mechanism is Google quality-guideline, not RAG chunking).
6. **H contradiction vs absence classes**.
7. **O TTFB as optional metric** (explicit non-JS slowness).
8. **AC12 typed internal conflicts** without AG15 NLP.
9. **Finding `parent_id` / extractability flags** for T chains.
10. **AH8** — cannot implement; research file gap.

## Conflicts preserved (not silently resolved)

| ID | Conflict | This review |
|----|----------|-------------|
| CX-13 | Handout merges crawl+render | Keep split (mechanisms differ). |
| CX-G | G wants a skill folder | Keep as CIT named type, not 11th skill. Document as intentional SoC. |
| CX-H | H search vs linked-only | **Linked-only wins** (runtime, robots, bias). Loss: unlinked Wikipedia drift = FN. |
| CX-W | W vs K merge | Keep one skill; **two finding classes**. |
| CX-AH8 | Seven questions, six stated | Unspecified; do not invent. |

## Verdict of coverage pass

v0 coverage **table is mostly honest** at RID granularity but **over-merged W, G, D41, U-flow, AC12**. Those are specification holes, not missing marketplace skills.
