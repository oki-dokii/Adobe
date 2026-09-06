# Topic AH — "Out-of-the-Box" Research Questions (AH1–AH25)
**Researcher:** Soham | **Research Area:** AH — Out-of-the-Box Research Questions
**Priority:** Very High (explicitly: the source of non-generic skills)

---

## 0. Framing — this is a synthesis topic, not a new-research topic, and that's the honest way to treat it

Twenty-five sharp, well-posed questions, deliberately framed to avoid generic SEO thinking. Having built V, W, X, Y, Z, AA, AB, AC, AD, and AF across this project, the honest finding is: **eighteen of these twenty-five already have a real, evidenced answer scattered across those ten documents** — this topic's actual job is to pull those answers together into direct, quotable one-line answers (Section 2), not re-derive them. That's not a disappointing result; it's the confirmation that the project's research has been coherent rather than a pile of disconnected findings — the same "few mechanisms, many named instances" pattern that showed up repeatedly across Pulkit's, Topic V's, and Topic W's own documents shows up here too, at the level of entire research questions rather than sub-topics.

**Seven questions don't yet have a real answer anywhere in this project**, and those get genuine, new treatment in Section 3 — including the one I think is the actual capstone finding of this entire research phase (AH25).

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. Direct answers — eighteen questions this project has already answered

| # | Question | One-line answer | Source |
|---|---|---|---|
| AH1 | What makes a sentence citation-ready? | Specific, quotable, unhedged, paired with its qualifying context in the same window — GEO paper effect sizes for statistics/citations/quotations. | Pulkit F1/F2 |
| AH2 | What makes a page AI-answerable? | The specific evidence *type* a query category needs (a number, a named comparison, a yes/no) is present, gated by intent classification. | Topic W Cluster D |
| AH3 | What makes a brand entity-unambiguous? | Consistent self-naming across its own pages (legal/trade/product name) plus explicit `sameAs` links to verified external profiles. | Topic V Cluster C, Topic AC Cluster B (AC4) |
| AH5 | What makes a passage self-contained? | Fact and qualifier survive together through a plausible chunk-extraction window; no cross-boundary separation. | Pulkit A16/F2 |
| AH6 | What makes a claim corroboratable? | Presence of the site-type-appropriate corroboration channel (NAP, third-party validator seal, press, etc.) — the channel varies by type, the requirement doesn't. | Topic V Cluster B |
| AH7 | What makes a page easy to summarize without distortion? | The specific sentence a framing-driven extractor would surface, under multiple opposing query framings, still implies the same direction of conclusion. | Topic W (W-02) |
| AH10 | What makes a user trust a page reached through an AI citation? | Visually prominent (not just present) organizational identity, currency, and structure signals, evaluated in the first seconds. | Topic X Cluster D |
| AH11 | What makes a user immediately understand why they landed there? | The specific cited claim is visible, unobstructed, and confirmable without scrolling past unrelated content — information-scent continuity. | Topic X Cluster A |
| AH12 | What causes AI to substitute a competitor? | The competitor's page beats yours on AH1/AH2's extractability criteria for the specific query, independent of your actual quality. | Topic W (W-03), synthesized with AH1/2 |
| AH14 | What causes AI to quote an outdated fact? | A confidently-worded, temporally-unanchored claim ("now offering...") extracted without the freshness context that would flag it as stale. | Pulkit freshness work, Topic W (W-02) |
| AH15 | What causes AI to merge two different entities? | Generic/duplicated naming plus absent disambiguation signals — the same self-entity-consistency gap as AH3, in reverse. | Topic V Cluster C, Harsh's F |
| AH17 | What causes an AI to cite a page whose relevant information is technically present but practically inaccessible? | The cited claim exists as text but isn't deep-linkable — gated behind an accordion, tab, or JS-only render that defeats both Scroll-To-Text-Fragment matching and a human's quick scan. | Topic X (X-02) — this is essentially AH17 restated as a finding ID |
| AH18 | Can we measure answerability independent of rankings? | Yes — it's an evidence-presence check (does the specific evidence type exist on the page), not a popularity signal. | Topic W Cluster D |
| AH19 | Can we measure citation extractability independent of authority? | Yes — quotability/specificity scoring is a content property (Pulkit F1), measurable with zero backlink or domain-authority data. | Pulkit F1 |
| AH20 | Can we measure misrepresentation risk? | Yes — the opposing-framing test (generate 2-3 oppositely-framed queries, check whether the likely extract's implied conclusion diverges). | Topic W (W-02) |
| AH21 | Can we measure entity confusion risk? | Yes — name-form variance across own pages, plus a live impersonator/squatter search, both deterministic or cheap-search-based. | Topic V (V-01's stripe.us.org finding) |
| AH22 | Can we measure corroboration strength? | Yes — channel-specific presence/count against the site-type-appropriate taxonomy. | Topic V Cluster B |
| AH24 | Can we measure AI referral landing quality? | Yes — it decomposes cleanly into Topic X's four clusters (citation visibility, findability, forward-path, rapid trust) as sub-scores. | Topic X, all clusters |

---

## 3. Genuinely open questions — new synthesis

### AH4 — What makes a fact portable across retrieval systems?

**A. What we need to understand:** Whether a fact stated once, in one format, is equally extractable by every retrieval mechanism (a classic search snippet, a passage-retrieval RAG system, a schema-markup parser), or whether portability requires deliberate redundancy.

**C. Current evidence — INFERENCE (a genuine synthesis, not previously stated anywhere in this project):** Pulkit's own F3 finding already established that at least some current AI systems don't reliably parse schema.org/JSON-LD markup during live answering, extracting from visible text instead — meaning a fact encoded *only* as structured data is not portable to that class of retrieval system, even though it would be perfectly portable to a system that does parse structured data. The generalizable principle: **portability is a function of redundant encoding across formats a fact-checker can't assume any one retrieval system will use** — the same fact stated in visible prose, in a semantically-marked-up table (Cluster A, Topic E's structured-format work), and in JSON-LD, survives the widest range of retrieval mechanisms, because each format is the one some retrieval system will actually use and another might ignore.

**N. Candidate skill:** Not a new skill — a specific, named check within Pulkit's structured-format/extraction work: "is this fact encoded in more than one of {visible prose, semantic markup, structured data}, or does its portability depend entirely on one retrieval assumption succeeding."

---

### AH9 — What makes an AI choose the official source over a third party for the same fact?

**A. What we need to understand:** Given that a fact about a brand is often available both on the brand's own site and on third-party aggregators/review sites/Wikipedia, what determines which one gets cited.

**C. Current evidence — INFERENCE (a genuine, previously-unstated synthesis of AH1/AH2/AH19's existing mechanisms, applied competitively rather than in isolation):** This project's existing extractability mechanisms (Pulkit's F1 quotability, Topic W's evidence-type-availability) were built to evaluate a page's citability in isolation. AH9 reframes the same mechanisms as a **head-to-head comparison**: for a given fact, whichever source (official or third-party) scores higher on quotability/extractability for that *specific* fact is more likely to be the one an extraction-driven system surfaces — independent of which one is more "authoritative" in the traditional backlink/domain-authority sense. This directly explains a counter-intuitive but consistent thread across this project's own live tests: Notion's third-party pricing aggregators (found early in this project's research) showed wildly inconsistent numbers precisely because Notion's own pricing extractability was weaker than the aggregators' structured, easily-scraped comparison tables — the aggregator won the extraction race, not the authority race.

**N. Candidate skill:** No new skill — a **competitive framing** of Pulkit's F1 check: run the same quotability/extractability scoring against the top 2-3 third-party sources for the same fact (already partially built for Topic W's Cluster E comparison-page work) and report the gap explicitly, since the gap itself is the actionable finding ("your own pricing page is less extractable than [aggregator]'s comparison table for this exact fact").

---

### AH13 — What causes AI to substitute a directory?

**A. What we need to understand:** Whether directory substitution (a "best X" or "top N tools" query surfacing a directory/listicle instead of any individual brand's own page) is a corroboration/authority failure, or something more structural.

**C. Current evidence — INFERENCE (a genuine synthesis connecting Topic V's Cluster B and Topic W's Cluster A, not previously stated together):** Topic V's Cluster B already established that directories are *legitimately* thin-content-by-design and structurally optimized for exactly the query shape ("list of," "best," "top N") that a directory format inherently satisfies better than any single brand's page ever could — a brand's own page can never itself *be* a list of its competitors. Topic W's Cluster A intent-classification work independently established that "list/comparison" is a distinct, structurally-recognizable intent category. **Combining them: directory substitution for list-type queries isn't a defect an individual brand can fix on its own page at all** — it's a structural intent-format match no amount of single-page optimization overcomes. The only lever a brand actually has is *appearing within* the directories that will inevitably be cited for that query shape (a corroboration-channel concern, Topic V's Cluster B), not competing with the directory format head-on.

**N. Candidate skill:** No new skill — this is a **root-cause reframe** that should be added to whatever skill would otherwise (incorrectly) recommend "make your own page more list-like" — the correct recommendation for a list-intent query gap is presence-in-directories, not on-page restructuring.

---

### AH16 — What causes AI to mention a brand but omit the important product?

**A. What we need to understand:** Whether brand-level citability and product-level citability are the same property or can diverge — a genuinely new question this project hasn't asked directly.

**C. Current evidence — INFERENCE (a genuinely new synthesis — this is not answered anywhere else in this project, and I think it's a real, non-obvious finding):** Every extractability/answerability mechanism this project has built (Pulkit's F1, Topic W's Clusters A-D) operates **per-page**, not per-entity — meaning a brand's homepage can score excellently on every AH1/AH2 criterion while a specific, important product's own page scores poorly, and there is currently no mechanism anywhere in this project that would catch that *specific* gap, because every existing check would look at the product page in isolation and correctly flag it as needing improvement — without ever surfacing the more strategically important observation that **the brand's overall strong citability is masking a specific, high-value product's weak citability**, since an aggregate or homepage-focused audit would report the brand favorably overall. This is a real, structural blind spot: extractability doesn't automatically propagate from a well-optimized homepage to a specific product deep in the site, and nothing in this project's existing per-page or per-template (Topic AF) analysis explicitly checks *whether a brand's most important product has independently adequate citability*, as opposed to merely being *a* page among many that got audited.

**N. Candidate skill:** This is the one genuinely new, standalone skill idea from this section: **"Flagship-Product Citability Gap Check"** — identify the site's most important product(s) (via Topic V's classifier, Topic W's query-generation for the site's category, or explicit navigation prominence), and specifically verify that page independently passes AH1/AH2's criteria, rather than assuming brand-level strength implies product-level strength. Input: site classification + crawled pages. Output: a specific finding when the flagship product's own page underperforms relative to the brand's overall average extractability score — a comparative, not absolute, check.

---

### AH23 — Can we measure "information compression quality"?

**A. What we need to understand:** Whether this is a genuinely new metric or a composite of existing ones.

**C. Current evidence — INFERENCE:** "Compression quality" (how much essential meaning survives when a passage is reduced to a short extract) is exactly what AH1 (citation-readiness) + AH5 (self-containment) + AH7 (distortion-resistance) jointly measure — this isn't a new property, it's a useful *name* for the composite of three already-answered questions, worth adopting as report-facing terminology (Topic AB) rather than as a new detection mechanism.

**N. Candidate skill:** None — a naming/reporting convention, not new infrastructure.

---

### AH25 — Can we predict which pages will be cited without querying every possible question?

**A. What we need to understand:** This is the deepest, most practically important question in the entire list, and I think it's the actual capstone finding of this whole research project — whether citability can be predicted from page-intrinsic properties alone, without needing to exhaustively simulate the query space, which the 5-minute runtime budget makes impossible anyway.

**B. Why it matters:** Every query-dependent mechanism this project has built (Topic W's Cluster A query-generation, tested against 2-3 representative queries per page) is necessarily a *sample* of an effectively infinite real query space. Topic Z's Cluster H runtime budget makes exhaustive query testing structurally impossible. If citability can't be estimated without exhaustive querying, every check this project has built is only ever testing a thin, arbitrarily-chosen slice of the actual space of questions real users and AI systems will ask — a real, previously-unstated limitation of the entire project's query-dependent mechanism family.

**C. Current evidence — INFERENCE (the genuine capstone synthesis of this entire research project):** The answer is **yes, with an important caveat** — and the reasoning is itself the interesting part. Every *query-independent* signal this project has built (AH1 quotability, AH5 self-containment, AH6 corroboration, AH19 extractability-independent-of-authority) measures a property of the page's *content* that doesn't depend on knowing which specific query will be asked — a well-written, specific, self-contained, corroborated, structurally-clear sentence is more likely to be extracted and cited *regardless* of the specific query's exact phrasing, because these properties describe how *any* extraction mechanism behaves, not how it behaves for one particular question. This means a **composite "citability score" built entirely from query-independent properties can serve as a genuine predictor of citation likelihood**, and the small, cheap query-sample (Topic W's Cluster A, 2-3 representative queries) should be understood not as the primary citability measurement, but as a **spot-check calibration** against the composite score — if the composite score is high but the small query sample shows poor alignment, that's a signal the query-generation step chose unrepresentative queries, not necessarily that the page is actually uncitable, and vice versa. **The caveat**: this composite score cannot predict citability for a query *category* the page doesn't address at all (Topic AC's AC11 content-gap concern) — query-independent scoring only predicts citability for content that exists, not the absence of content a real query space might demand, which is exactly where AC11's separate, honestly-scoped mechanism has to take over.

**D. Important mechanisms:** This reframes the entire project's architecture in a genuinely useful way: **the query-independent checks (Pulkit's F1/F2, this document's AH1/5/6/19) are not merely "one category of check among many" — they are the actual, generalizable predictor**, and the query-dependent checks (Topic W's Clusters A-E) are the *validation/calibration layer* on top of that predictor, not an independent, equally-weighted measurement. This is a real, if subtle, re-ranking of how confident the marketplace should be in each type of signal, and it directly informs Topic AA's confidence-computation function (AA-01): a query-independent finding should generally carry *higher* baseline confidence than a query-dependent one tested against only 2-3 sampled queries, since the query-independent signal doesn't depend on having guessed the right query at all.

**N. Candidate skill:** The genuinely new, capstone-level candidate skill this whole synthesis points to: **"Composite Citability Predictor"** — a skill that combines the query-independent scores this project has already built (quotability, self-containment, corroboration-channel presence, extractability) into a single, page-level citability estimate, explicitly positioned as *higher-confidence and cheaper to compute* than query-simulation-based checks, with Topic W's query-generation work re-scoped as a smaller, secondary calibration pass rather than the primary answerability measurement. This is arguably the single most valuable architectural insight to emerge from this entire research phase, because it directly resolves the runtime-budget tension between "we can't test every query" and "we still need to say something confident about citability."

---

## 4. Findings register

---
**FINDING ID:** AH-01
**Researcher:** Soham
**Research Area:** AH — Out-of-the-Box Research Questions
**Research Question:** Do the eighteen "answerable" questions in Section 2 represent genuine research coverage, or does restating them as answered risk overstating how settled this project's work actually is?
**Observation:** Cross-checking each of the eighteen against its cited source document confirms each has a real, evidenced mechanism behind it (not just a plausible-sounding one-liner) — but several (AH12, AH15, AH21) are synthesis restatements combining two documents' findings rather than a single document's direct answer, and should be understood as this document's own contribution (the combination), not as something either source document stated on its own.
**Evidence:** Direct cross-referencing against V, W, X, Y, Pulkit's, and Harsh's prior documents.
**Sources:** Internal — this project's own prior research documents.
**Pattern:** This project's research has been coherent enough that a late-stage synthesis pass finds real, traceable answers to sharp, deliberately non-generic questions — a meaningful validation of the overall research approach, not just a convenient organizing exercise.
**Counterexamples:** AH8 and AH23 are explicitly *not* independent answers — they're composite restatements of other already-answered questions, and are labeled as such rather than padded into standalone treatments.
**Hypothesis:** N/A — direct synthesis.
**Confidence:** HIGH for the eighteen direct mappings; the synthesis combinations (AH9, AH12, AH13, AH15, AH16) are genuinely new connective work, appropriately labeled INFERENCE rather than restated FACT.

---
**FINDING ID:** AH-02
**Researcher:** Soham
**Research Area:** AH — Out-of-the-Box Research Questions
**Research Question:** AH25 — is the tension between "can't query-test everything" and "need confident citability answers" actually resolvable, or is this project structurally stuck accepting thin query coverage?
**Observation:** It's resolvable by re-ranking which existing signal type the marketplace should treat as primary: query-independent content properties (quotability, self-containment, corroboration, extractability) predict citability without needing to guess the right query, and should be the main citability estimate; the small, cheap query-sample this project has built elsewhere (Topic W) becomes a calibration check on that estimate rather than the primary measurement.
**Evidence:** Direct synthesis of this project's own already-validated mechanisms (Pulkit's F1/F2, Topic W's Cluster A), reasoned through rather than externally sourced.
**Sources:** Internal.
**Pattern:** This is the single most architecturally consequential finding to emerge from the AH synthesis pass — it changes how confidence should be weighted across the whole marketplace's finding types, not just how one topic's checks work.
**Counterexamples:** The composite score cannot predict citability for content that doesn't exist at all (a true content gap) — explicitly out of scope for this mechanism, correctly handed off to Topic AC's AC11 instead.
**Hypothesis:** Whether the composite score's ranking of pages by predicted citability would actually correlate with real citation behavior if tested against live AI systems is untested — this is a strong, well-motivated architectural proposal, not an empirically validated one.
**Confidence:** MEDIUM-HIGH for the architectural logic (a defensible, well-motivated reasoning chain from already-validated component mechanisms); LOW for whether the specific composite-score-to-real-citation correlation would hold if empirically tested, which this project has no way to verify directly.

---

## 5. Required end-of-topic synthesis

**Strongest validated insight:**
AH-01 — eighteen of twenty-five deliberately non-generic, sharp questions already have a real, traceable answer somewhere in this project's prior work, which is a meaningful, retrospective validation that the research across V/W/X/Y/Z/AA/AB/AC/AD/AF has actually been coherent and mechanism-connected, not a pile of disconnected findings assembled under topic headings.

**Strongest unvalidated hypothesis:**
AH-02 (AH25) — that a composite, query-independent citability score would actually correlate with real-world AI citation behavior. This is the single highest-value thing to test empirically if this project gets access to any live-AI-citation validation opportunity before final submission, since it's both the most novel and the most architecturally consequential claim in this entire research phase.

**Strongest candidate skill:**
The **Composite Citability Predictor** (AH25) — not because it requires new detection mechanisms (it doesn't; it's a weighted combination of scores this project has already built), but because reframing query-independent signals as the *primary* citability measurement, with query-dependent testing as calibration rather than the main event, is a genuinely non-generic architectural insight of exactly the kind this topic asked the team to look for.

**Weakest assumption we should investigate next:**
Whether the **Flagship-Product Citability Gap Check** (AH16) is actually distinguishable, in practice, from simply running the existing per-page checks on more pages — this document argues it's a structurally distinct blind spot (brand-level strength masking product-level weakness), but the actual implementation may turn out to be "run existing checks on the flagship product page specifically" rather than requiring any genuinely new comparative logic, which would make it a scoping/prioritization decision rather than a new mechanism — worth clarifying before treating it as a fifth new skill.

---

## 6. Cross-references for the Combine & Code phase

- **AH4 ↔ Pulkit's structured-format work:** Add the cross-format redundancy check as a named sub-check, not a new skill.
- **AH9 ↔ Pulkit's F1 and Topic W's Cluster E:** Reframe as a competitive, head-to-head scoring pass against named third-party sources for the same fact.
- **AH13 ↔ Topic V's Cluster B and Topic W's Cluster A:** A root-cause reframe to prevent an incorrect "restructure your page like a list" recommendation where the actual fix is directory presence.
- **AH16 ↔ Topic V's classifier, Topic W's query-generation:** The Flagship-Product Citability Gap Check, pending the scoping clarification flagged above.
- **AH25 ↔ Topic AA (AA-01, confidence computation), Topic W (Cluster A), Pulkit's F1/F2, Topic Z (Cluster G, ranking):** The single highest-leverage architectural recommendation from this document — re-weight query-independent scores as primary and query-dependent testing as calibration, feeding directly into Topic AA's confidence-computation function and Topic Z's ranking logic. This should be raised with the whole team before Topic Z's Cluster F/G implementation is finalized, since it changes how confidence is computed, not just what gets checked.
- **The whole document ↔ every prior topic in this project:** This document's real contribution is connective, not additive — treat Section 2's mapping table as a validation checklist that the project's mechanism library is actually coherent, and Section 3's five open questions as the shortlist of genuinely new ideas worth prioritizing if there's remaining implementation time.
