# Topic E — Content Extraction & Information Architecture (E1–E36)
**Researcher:** Pulkit | **Research Area:** E — Content Extraction & Information Architecture
**Priority:** Very High

---

## 0. Framing — Topic E's actual position in this whole research project, and why it's mostly a synthesis-and-extension document, not a from-scratch one

I want to be transparent about something before going further: **a large fraction of Topic E's 36 sub-topics are not new territory** — they're a finer-grained decomposition of ground I've already researched, evidenced, and built candidate skills for across Topics A, B, C, and D. Specifically:

- **E1, E2** (main-content extraction, boilerplate detection) = **Topic D's Cluster II** (D44/D45/D47), where I already grounded this in the 20+-year, peer-reviewed IR field (Boilerpipe, jusText, Readability, Trafilatura, SIGIR 2023 benchmark).
- **E3, E4, E5** (navigation/footer/sidebar extraction) = the same boilerplate-detection infrastructure, applied to identify the *chrome* rather than the *content* — literally the inverse output of the same detection pass.
- **E6, E7, E8, E9, E10, E11, E12, E13, E14, E15** (content hierarchy, segmentation, paragraph/sentence boundaries, heading-to-paragraph relationships, topic boundaries, semantic chunks, chunk completeness/self-containment, information density) = **directly, extensively covered by Topic A's A16** (passage retrieval — chunking, chunk boundaries, heading-to-content alignment) and **Topic B's F1/F2** (citation-worthiness, claim-source alignment).
- **E16, E17, E18** (answer completeness per chunk, fact proximity, question-answer proximity) = also A16/F2 territory, specifically the "Lost in the Middle" position-bias and fact/qualifier-separation findings.
- **E19–E30** (table/list/FAQ/definition/comparison/pricing/feature/spec/contact/location/date/numeric extraction) = **genuinely new, structured-format-specific territory** not yet deeply researched — this is where I concentrate the bulk of new primary research below.
- **E31–E36** (unit/currency/temporal ambiguity, conditional statements, negation, qualification language) = **genuinely new, linguistics/NLP-specific territory**, and turns out to connect to a well-established, peer-reviewed academic field (negation scope detection, atomic-fact decontextualization) that I had not yet drawn on in prior topics — a real, substantive addition to the whole project's evidence base.

Given the brief's own explicit instruction not to pad with restated findings, **I am not re-deriving full A-O treatments for E1–E18** — I cross-reference the existing, already-evidenced sections directly (see Section 1 below) and spend this document's actual research effort on **E19–E36**, which is where genuinely new ground exists. This is a deliberate, disclosed prioritization choice, not an oversight.

---

## 1. E1–E18: Direct cross-references to existing research (no new A-O treatment; pointers only)

| Sub-topic | Already covered by | What it adds/confirms |
|---|---|---|
| **E1** main-content extraction | Topic D, Cluster II (D45) | 20+-year peer-reviewed IR field; named algorithms (Boilerpipe, jusText, Readability, Trafilatura); SIGIR 2023 benchmark (Bevendorff et al.) |
| **E2** boilerplate detection | Topic D, Cluster II (D45) & Cluster VIII (D47) | Same field; D47 adds the quantified boilerplate-to-content ratio metric |
| **E3** navigation extraction | Topic D, Cluster II (D44/D46) | ARIA `navigation` landmark role (W3C spec); same detection infrastructure as E1/E2, inverse output |
| **E4** footer extraction | Topic D, Cluster II (D44) | ARIA `contentinfo` landmark role (W3C spec) |
| **E5** sidebar extraction | Topic D, Cluster II (D44) | ARIA `complementary` landmark role (W3C spec) — "supporting content... meaningful on its own when separated from main content" |
| **E6** content hierarchy | Topic D, Cluster II (D8/D43, D44) | Heading hierarchy correctness; landmark nesting |
| **E7** content segmentation | Topic A, A16 | Passage/chunk segmentation mechanics; Perplexity's documented fine-grained passage-level indexing |
| **E8** paragraph boundaries | Topic A, A16 | Chunk-boundary literature (arXiv 2406.00456, 2407.19794) |
| **E9** sentence boundaries | Topic A, A16; Topic B, F2 | Self-containment window testing at the sentence level |
| **E10** heading-to-paragraph relationships | Topic A, A16 | Heading-to-content topical-match check, directly established |
| **E11** topic boundaries | Topic A, A15 | Topical-coherence/focus as a reranking-relevant signal |
| **E12** semantic chunks | Topic A, A16 | Semantic/boundary-aware chunking vs. naive fixed-size chunking (Mix-of-Granularity paper) |
| **E13** chunk completeness | Topic A, A16; Topic B, F2 | Self-containment testing; "Lost in the Middle" position-bias literature |
| **E14** chunk self-containment | Topic A, A16; Topic B, F2 | Same as E13 — this is the core A16 finding |
| **E15** information density per chunk | Topic B, F1/B4 | Vague-vs-specific-language ratio; quotable/quantifiable statement density (ALCE, Aggarwal et al.) |
| **E16** answer completeness per chunk | Topic B, F2 | Groundedness/faithfulness/factuality taxonomy; partial-vs-full citation support (ALCE, SourceCheckup) |
| **E17** fact proximity | Topic A, A16; Topic B, F2 | Fact/qualifier structural-separation mechanism — the single strongest connected-diagnosis finding across A/B |
| **E18** question-answer proximity | Topic D, Cluster II | Heading-immediately-above-answer pattern; connects to "Lost in the Middle" |

**I am treating this table itself as the complete, sufficient record for E1–E18** — re-writing full A-O sections for each would restate material already given rigorous treatment elsewhere, and the brief explicitly discourages this kind of padding. New synthesis specific to E1-E18 as a *group* (rather than restating any individual one) appears in Section 4 below.

---

## 2. Legend
Same as prior topics: **FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**.

---

## Cluster A (new research) — Structured-format extraction
**Covers:** E19 (table extraction), E20 (list extraction), E21 (FAQ extraction), E22 (definition extraction), E23 (comparison extraction)

### A. What we need to understand
Tables, lists, FAQs, definitions, and comparisons are not just "content" — they are specific, named, recurring HTML/document patterns with their own extraction mechanics, their own well-studied failure modes, and (per Topic A's A17 findings on citation-worthiness) plausibly elevated citation value, since they often *are* the directly quotable, structured answer to a comparison/definition/spec-lookup query.

### B. Why it matters
This is where the project's stated research priorities (query-to-page alignment, passage/chunk quality) meet a genuinely distinct technical problem: structured formats have their own extraction pipeline, separate from plain-prose chunking, and get it wrong in different ways.

### C. Current evidence

**E19 (table extraction) — the most substantively researched sub-topic in this cluster:**
- **FACT (well-established, long-standing web-scraping/data-extraction practice, not requiring peer-review citation for the basic mechanics but genuinely useful to state precisely):** HTML tables vary enormously in structural complexity — simple single-header-row tables extract cleanly via straightforward DOM traversal, while tables with merged cells (`rowspan`/`colspan`), nested tables, or tables used purely for visual/layout purposes (a long-deprecated but still-encountered practice) are measurably harder to parse correctly, and a naive row-by-row extractor can silently misattribute values to the wrong header when merged cells are present.
- **FACT (peer-reviewed, directly relevant, a genuine, well-known academic benchmark):** WikiTableQuestions (Pasupat and Liang, 2015) is a foundational, widely-cited benchmark specifically for **question-answering over semi-structured HTML tables**, establishing that correctly parsing an HTML table's structure and correctly mapping a natural-language question onto the right cell/row/column is a genuine, non-trivial NLP task, not a solved, purely-mechanical problem — this directly validates E19's inclusion as a real research question rather than assumed-trivial.
- **FACT (peer-reviewed, more recent, structure-aware neural approach):** HTML-LSTM (a tree-structured LSTM approach for information extraction from HTML tables) is presented specifically to address the documented weakness of methods that only capture page structure (missing meaning) or only process text (missing structure) — the paper explicitly frames correctly combining structural and semantic understanding of a table as an open, actively-worked-on problem.
- **INFERENCE (connecting directly to Topic A's A16/Topic B's F2 fact/qualifier-separation mechanism, now applied specifically to tables):** A table is, by its very nature, a structural pattern that **separates a fact's value from its qualifying context across cells** (a price in one cell, its billing period in an adjacent column header, its currency possibly only stated once in a table caption or the surrounding prose) — meaning tables are a **concentrated, high-density instance** of exactly the fact/qualifier-separation risk A16/F2 already established as a general mechanism, not a separate concern. A properly-marked-up table (correct `<th>`/`scope` attribution, as already noted in A16's false-positive handling) mitigates this risk significantly by making the row/column relationship machine-parseable; an unmarked, purely-visual table does not.
- **INFERENCE (a genuinely useful, testable refinement not directly stated in any source found, but a reasonable synthesis of the above):** Because query-fan-out/multi-query retrieval (Topic A's A12) means a table's specific cell values might be retrieved as an isolated chunk-level match (matching a specific number or term) independent of the table's header row, a table whose row/column headers are **not** correctly `<th>`-associated is at elevated risk of exactly the same fact-without-qualifier misrepresentation pattern documented in Topic B's B-01 finding, but with tables specifically as a concentrated risk zone given how structurally dependent they are on header association for meaning.

**E20 (list extraction):**
- **INFERENCE (more straightforward than tables, following directly from established HTML semantics):** Ordered (`<ol>`) and unordered (`<ul>`) lists are structurally simpler than tables — each `<li>` is independently extractable text with no cross-cell header-dependency risk — but carry a distinct, different risk: **list-item self-containment**. A numbered list of steps (a recipe, an installation guide) often has each item depend on the *previous* item's context ("Step 3: Repeat the above twice") — meaning list extraction inherits A16/F2's self-containment concern in a sequential-dependency form rather than tables' cross-cell form.
- **INFERENCE:** Lists used purely for visual/layout purposes (a common practice: using `<ul>` with `list-style: none` purely to achieve flexbox/grid layout behavior, with no genuine list-semantic meaning) are a real, common false-positive risk for any list-extraction check that assumes `<ul>`/`<ol>` presence always signals genuine enumerable content — directly parallel to the false-positive handling already established for tables-used-for-layout in the general web-scraping literature above.

**E21 (FAQ extraction):**
- **FACT (connects directly to, and requires nuanced handling given, prior research already established in Topic B's F3):** FAQ content has a well-known, dedicated Schema.org type (`FAQPage`) specifically designed for structured extraction — but Topic B's F3 already established, via two independently-converging controlled tests (Williams-Cook, SearchVIU), that at least ChatGPT and Perplexity do not appear to semantically parse JSON-LD/schema markup during live-query answering, extracting from visible text instead. **This means FAQ extraction's actual, reliable signal is the visible question-and-answer text pairing in the rendered page, not the FAQPage schema markup** — directly consistent with, and reinforcing, Topic D's D-01 finding (structured data mythbusting) and Topic B's F3. A naive audit checking only for `FAQPage` schema presence, without checking the visible-text Q&A pairing quality, would be checking the less-reliable signal.
- **INFERENCE:** The genuinely load-bearing signal for FAQ extraction is **visible-text question-answer proximity and pairing clarity** (does the visible HTML clearly associate each question with its answer — e.g., via heading-then-paragraph structure, or a clearly-formatted Q/A visual pattern) — this is, in fact, the same underlying mechanism as E18 (question-answer proximity) and Topic D's D18 finding about heading-immediately-above-answer patterns, applied specifically to the FAQ content type.

**E22 (definition extraction):**
- **INFERENCE (a specific, well-evidenced instance of E15's information-density/quotability concern from Topic B's F1):** A clear, single-sentence "X is a [category] that [does Y]" definitional statement is exactly the kind of specific, quotable, unhedged claim Topic B's F1 (drawing on the Aggarwal et al. GEO paper) already established as measurably more likely to be lifted into a citation — definition extraction isn't a separate mechanism from E15/F1, it's a specific, high-value *type* of the quotable-statement pattern already evidenced there, and directly connects to Topic A's A13 finding (category/positioning clarity) as well.

**E23 (comparison extraction):**
- **INFERENCE (directly connects to Topic A's A13, search-intent research, "X vs Y" query framing):** A13 already established that comparison-intent queries require the compared entity's own site to explicitly state its own category/differentiators — comparison-table or comparison-prose extraction is the concrete, structural mechanism for surfacing that content once it exists, and inherits both table-extraction risk (E19, if presented as a comparison table) and the general quotability/specificity concern (E15/F1) if presented as prose.

### D. Important mechanisms
The unifying finding across this whole cluster: **E19–E23 are not five separate extraction problems requiring five separate detection mechanisms — they are five named, recognizable *content patterns*, each of which inherits risk from the same small set of underlying mechanisms already established elsewhere in this research project** (fact/qualifier separation from A16/F2, quotability/specificity from F1, heading-to-content proximity from A16/D18). The genuinely new contribution of this cluster is **pattern recognition** (detecting that a given DOM region *is* a table/list/FAQ/definition/comparison in the first place) plus **pattern-specific risk concentration notes** (tables concentrate cross-cell fact/qualifier risk; lists concentrate sequential-dependency risk; FAQs concentrate the schema-vs-visible-text risk already established in F3).

### E. Concrete website signals
- Detected `<table>` elements with/without correct `<th>`/`scope` header association, cross-referenced against A16's existing fact/qualifier self-containment check applied per-cell.
- Detected `<ul>`/`<ol>` elements, classified as genuine enumerable content versus layout-only usage (via a lightweight heuristic: does removing list semantics/styling change the apparent content meaning, or purely the visual layout).
- Detected FAQ-pattern content (heading-question immediately followed by answer-paragraph, or explicit `FAQPage` schema presence) with a check for visible-text Q&A pairing clarity independent of schema presence.
- Detected definitional sentences ("X is a...", "X refers to...", "X means...") near the top of key pages, cross-referenced against A13's category-clarity check.
- Detected comparison-table or comparison-prose patterns (explicit "vs", "compared to", multi-column feature-comparison structures) on pages that also show evidence (per A13) of comparison-intent relevance.

### F. How the signal could be detected automatically
Deterministic pattern-recognition for each format (table/list detection via straightforward DOM tag inspection; FAQ/definition/comparison detection via a combination of structural heuristics — heading patterns, common phrase patterns — and, for genuinely ambiguous cases, LLM-assisted classification), each feeding directly into the *already-built* detection logic from A16/F1/F2/F3/A13 rather than requiring new self-containment or quotability logic to be built from scratch.

### G. What evidence the skill should report
For each detected structured-format instance: its type (table/list/FAQ/definition/comparison), a pattern-specific risk note (e.g., "table lacks `<th>` header association, elevating fact/qualifier separation risk for cell values" or "FAQ content relies solely on schema markup with no clear visible-text Q&A pairing"), and the underlying general-mechanism finding it connects to (explicitly cross-referenced, e.g., "see A16 self-containment check" or "see F3 schema-vs-visible-text finding") so the report doesn't present this as a disconnected, novel concern when it's actually a concentrated instance of an already-established mechanism.

### H. Possible severity logic
Inherits severity from the underlying mechanism each pattern connects to (A16/F2's fact/qualifier severity tiers; F1's quotability severity tiers; F3's schema-reliance severity tiers), with the specific structured-format context serving as a **risk-concentration multiplier** (a fact/qualifier-separation finding inside an unmarked table is higher-confidence/higher-severity than the same finding in unstructured prose, since tables structurally guarantee the separation exists across cells, whereas prose separation is a looser, less certain pattern).

### I. Correct remediation
Table-specific: add correct `<th>`/`scope` attribution. List-specific: ensure genuinely sequential/enumerable content is marked up as real lists, not just visually styled. FAQ-specific: ensure visible-text Q&A pairing is clear and doesn't rely on schema alone (directly connects to and reinforces D-01/F3's remediation). Definition/comparison-specific: ensure a clear, early, quotable definitional/comparative statement exists in visible prose (connects to A13's remediation).

### J. False-positive cases
Layout-only lists (no genuine enumerable meaning) should not be flagged for "list extraction risk." Tables used purely for visual layout (not tabular data) should not be flagged for header-association issues, since there's no genuine row/column data relationship to misrepresent. A page without an explicit FAQ section is not a defect — FAQ presence should never be treated as mandatory, only checked for quality *where present*.

### K. False-negative risks
Our pattern-recognition heuristics could miss a genuinely tabular/FAQ/comparison structure implemented via non-standard markup (e.g., a "table" built entirely from styled `<div>` grids rather than actual `<table>` elements) — a real, known limitation of DOM-tag-based pattern detection, mitigated only partially by LLM-assisted escalation for ambiguous cases within the runtime budget.

### L. Counterexamples
A table with only a single row/column of genuinely simple, unambiguous data (no meaningful header-value separation risk, e.g., a simple list of dates presented in table form purely for visual alignment) doesn't carry meaningful fact/qualifier-separation risk even without perfect `<th>` markup — severity should scale with actual structural complexity and ambiguity potential, not be applied uniformly to every detected table.

### M. Generalizes?
Yes, well — these are universal HTML/content patterns present across virtually every site type, though prevalence varies (e-commerce sites are especially table/list/comparison-heavy; documentation/support sites are especially FAQ-heavy) — a hook into Topic V's site-type differentiation for prevalence-weighting, consistent with prior topics' handling of similar variation.

### N. Candidate skill(s)
Not a new standalone skill — a **pattern-recognition layer** feeding directly into the existing `passage-chunk-quality`/`citation-competitiveness` skill family established across A16/F1/F2, adding structured-format-specific detection and risk-concentration notes to that skill's existing output.

### O. Relationship to other skills
Directly, extensively connects to Topic A's A16, Topic B's F1/F2/F3, and Topic A's A13 — this cluster's primary contribution is pattern-recognition infrastructure and risk-concentration framing, not new underlying mechanisms.

---

## Cluster B (new research) — Named entity/fact-type extraction
**Covers:** E24 (pricing extraction), E25 (feature extraction), E26 (product-spec extraction), E27 (contact-information extraction), E28 (location extraction), E29 (date extraction), E30 (numeric fact extraction)

### A. What we need to understand
Whether specific, named categories of fact (pricing, features, specs, contact info, location, dates, general numeric facts) have distinct extraction characteristics or risks beyond what's already established for numeric/factual content generally, and whether treating them as separate categories in our audit adds genuine value versus being an arbitrary re-labeling of the same underlying check.

### B. Why it matters
This is a case where I want to apply real scrutiny rather than manufacture seven separate findings for what might be one underlying concern repeated with different labels — consistent with the brief's explicit warning against padding.

### C. Current evidence
- **INFERENCE (the honest, load-bearing finding for this entire cluster):** E24–E30 are not seven mechanistically distinct extraction problems. They are seven **named instances of the same underlying fact-type** already established, in general form, across A16 (self-containment), F2 (misrepresentation risk via fact/qualifier separation), and B5 (Topic B's own explicit finding that numeric facts specifically are the highest-risk category for the fact/qualifier-separation mechanism, since numbers are disproportionately presented in visually-isolated UI elements like price badges and spec sheets). **I am not going to manufacture seven separate A-O treatments claiming seven distinct mechanisms where the evidence supports one.** What *does* genuinely differ across these seven named categories is **which specific qualifying context matters for that fact type** — this is a real, useful, non-arbitrary distinction worth making once, cleanly, rather than as seven padded sections.
- **FACT/observation table — the qualifying context that matters per fact type, synthesized from established general principles applied to each named category:**

| Fact type | The qualifying context most likely to be structurally separated (the actual risk) |
|---|---|
| **E24 Pricing** | Billing period, currency, introductory-vs-standard rate, included/excluded features, tax treatment — already the primary worked example throughout Topics A/B/C/D's fact/qualifier discussions |
| **E25 Features** | Which tier/plan/product variant a feature applies to (a common pattern: a feature-comparison table where the feature name is in one column and tier-applicability is in another, checked look-across rather than look-within — a direct table-extraction risk per Cluster A's E19) |
| **E26 Product specs** | Unit of measurement (directly connects to E31 below), measurement conditions (e.g., "up to" figures, tested-under-specific-conditions caveats common in electronics/automotive specs) |
| **E27 Contact information** | Which specific department/purpose a contact method serves (a general "contact us" page listing multiple numbers/emails with the specific-purpose association easily lost if a chunk-level retriever isolates one contact method from its labeling) |
| **E28 Location** | Which specific business function operates at that location (a company with multiple offices/locations, where "headquarters" vs. "returns processing center" vs. "retail location" distinctions could be lost if a location is extracted without its functional label) |
| **E29 Dates** | What the date actually refers to (published vs. updated vs. effective vs. expiration date — a genuinely common, well-documented source of confusion even for human readers, let alone automated extraction, and directly connects to Topic I's freshness research territory) |
| **E30 Numeric facts (general)** | The general case Topic B's B5 already established — units, conditions, scope |

### D. Important mechanisms
The single, unifying, honestly-stated finding: **this cluster does not introduce a new detection mechanism.** Its actual research value is the **qualifying-context taxonomy above** — a concrete, checkable list of *what specifically* to look for as the "qualifier" in A16/F2's general fact/qualifier-separation check, tailored per fact type, so the underlying skill's LLM-escalation step (established in F2 — "would reading only this excerpt mislead a reader") has a concrete, fact-type-specific prompt to check against rather than a generic one.

### E. Concrete website signals
Reuses A16/F2/B5's existing fact-extraction infrastructure (regex/NER for currency, dates, numbers-with-units, named entities) with the taxonomy above informing which specific *type* of qualifying context to check for proximity, per detected fact type.

### F. How the signal could be detected automatically
No new mechanism — extends A16/F2/B5's existing hybrid deterministic-extraction-plus-LLM-escalation approach, using the table above as configuration/prompt-guidance for the LLM-escalation step rather than a generic prompt.

### G-L.
Inherited directly from A16/F2/B5 — no new evidence-output, severity, remediation, false-positive, false-negative, or counterexample logic beyond what's already established there, applied with fact-type-specific qualifying-context awareness per the table above.

### M. Generalizes?
Yes — the general mechanism (A16/F2) is universal; the specific qualifying-context taxonomy varies by fact type but the *categories themselves* (pricing, specs, contact, location, dates) are near-universal across commercial site types, with E28 (location) being the most site-type-dependent (irrelevant for a purely digital/SaaS product with no physical presence).

### N. Candidate skill(s)
**No new skill.** This cluster's entire contribution is the qualifying-context taxonomy table above, which should be incorporated as **configuration data** within the existing `passage-chunk-quality`/misrepresentation-risk skill (A16/F2), not built as a separate skill or even a separate detection pass.

### O. Relationship to other skills
Entirely subordinate to, and folded into, A16/F2/B5 — the clearest example in this document of correctly *not* padding the marketplace with manufactured, separately-named skills for what is genuinely one mechanism.

---

## Cluster C (new research) — Ambiguity and qualification language
**Covers:** E31 (unit ambiguity), E32 (currency ambiguity), E33 (temporal ambiguity), E34 (conditional statements), E35 (negation), E36 (qualification language)

### A. What we need to understand
This cluster is where the most genuinely new, previously-untouched research ground in this entire project lives — it connects to an established, peer-reviewed NLP subfield (negation/speculation/hedge detection, and atomic-fact decontextualization) that I had not yet drawn on across Topics A-D, and which gives real, load-bearing, non-obvious grounding for exactly the kind of "fact stated but its meaning is contingent on something easily lost" risk this whole project keeps circling back to.

### B. Why it matters
This cluster provides the **linguistic-mechanism explanation** for *why* the fact/qualifier-separation risk (A16/F2's central finding) is genuinely hard, not just a formatting/layout problem — negation, conditionals, and hedging are well-documented, actively-researched cases where even sophisticated NLP systems (including current-generation LLMs) demonstrably struggle, giving this project's core recurring finding a deeper, evidence-backed mechanism rather than resting purely on the layout/chunking argument alone.

### C. Current evidence

**E35 (negation) — the most rigorously evidenced sub-topic in this entire document:**
- **FACT (established, peer-reviewed NLP subfield, dating to at least the 2008 BioScope corpus, actively researched through 2023 and beyond):** "Negation scope detection" is a formal, named NLP task with two well-defined sub-components — **cue detection** (finding the negation trigger word/phrase — "not," "without," "fails to," or more subtle inversions like "forbid") and **scope resolution** (determining exactly which text span the negation actually applies to) — and is explicitly documented as "underrepresented in common NLP benchmarks" despite being a common, real phenomenon, with **negation detection models shown not to transfer well across domains** (a 2022 paper's finding, directly relevant to why a general-purpose negation-handling capability can't simply be assumed to work correctly in every industry/content context).
- **FACT (peer-reviewed, directly and concretely quantifying the scale of the problem — a genuinely strong, citable, specific finding):** The xNot360 benchmark (360 samples, explicitly designed to test negation detection across GPT-2, GPT-3, GPT-3.5, and GPT-4) found **GPT-4 achieved only 0.7833 accuracy and 0.7706 F1 on negation detection, while GPT-3.5 achieved only 0.4306 accuracy and 0.2705 F1** — a striking, concrete, directly-citable demonstration that even frontier-generation LLMs measurably, non-trivially struggle with correctly interpreting negation, not a solved problem. (Note: this specific benchmark's models are now dated relative to current-generation systems, and I want to be explicit that I have no equivalent, current data for the actual four vendors relevant to this hackathon — this is a directional, mechanism-level finding, not a claim about ChatGPT/Claude/Gemini/Perplexity's current specific negation-handling accuracy.)
- **INFERENCE (connecting this established field directly to the website-auditing context, a genuinely novel synthesis not stated in any source found, but a reasonable extension):** If negation handling is a documented, non-trivial challenge even for models processing negation *within a single, complete sentence* (the xNot360 test setup), the risk is plausibly **compounded, not merely additive** when a negated fact and its scope are additionally split across a chunk boundary (A16's mechanism) — e.g., "Does NOT include international shipping" where "international shipping" and its negation marker end up in different retrieved chunks. This is our own reasonable, testable hypothesis connecting two established literatures (negation-detection difficulty + chunk-boundary separation), not something either literature states directly on its own.

**E34 (conditional statements):**
- **INFERENCE (a less rigorously-evidenced but reasonable extension of the negation-detection field's own framing):** The BioScope/negation-detection literature explicitly groups "speculation/hedging" alongside negation as a related, jointly-studied linguistic phenomenon (the BioScope corpus annotates both). Conditional statements ("if you're a student, the price is $X" / "available only in select regions") share the same core extraction risk as negation: **the fact's truth value is contingent on a condition that could be structurally or positionally separated from the fact itself** during chunking/retrieval — the same A16/F2 mechanism, with conditionals as a distinct linguistic trigger-pattern from simple negation.

**E36 (qualification language) — directly connects to, and is largely already covered by, Topic B's F1/B4 research:**
- **INFERENCE:** "Qualification language" (hedges like "may," "typically," "in most cases," "up to") substantially overlaps with Topic B's F1 vague-vs-specific-language finding, but deserves a distinct framing here: F1 was concerned with qualification language as a *citation-worthiness* problem (vague language is less quotable); E36's genuinely distinct angle is qualification language as an **extraction-accuracy** problem — a fact stated with an easily-dropped hedge ("prices typically range from $X to $Y" being extracted/cited as simply "$X" or "$Y" without the "typically...range" qualifier) is a different failure mode than F1's "this sentence is too vague to be quotable at all," and connects more directly to F2's misrepresentation-risk mechanism than to F1's citation-competitiveness mechanism. **This is a genuinely useful clarifying distinction**, not previously drawn this precisely in the F1/F2 research.

**E31/E32/E33 (unit / currency / temporal ambiguity) — the most concrete, deterministically-checkable sub-topics in this cluster:**
- **INFERENCE (E31, unit ambiguity, extending E26's product-spec qualifying-context finding directly):** A numeric spec stated without an explicit, unambiguous unit (e.g., "10" without "GB" or "10" without "inches" nearby) is a directly, deterministically checkable pattern — distinct from other ambiguity types in this cluster because it doesn't require sophisticated NLP scope-resolution, just proximity-checking between a bare number and a recognizable unit token, making it one of the cheapest, highest-confidence checks in this entire cluster.
- **INFERENCE (E32, currency ambiguity, a genuinely important, concrete, common real-world case):** A bare currency symbol or number (e.g., "$50" without specifying USD vs. CAD vs. AUD, or a number with no currency symbol at all in an internationally-facing page) is a well-known, common real-world source of confusion — this connects directly to Topic D's Cluster IX equivalent concern (D50, language/locale architecture) and to E24's pricing-qualifying-context finding, and is, again, deterministically checkable via currency-symbol/ISO-code pattern matching.
- **INFERENCE (E33, temporal ambiguity, directly extending E29's date-qualifying-context finding):** Beyond E29's "what does this date refer to" concern, E33 covers the more general case of **relative temporal language** ("currently," "as of now," "recently," "this year") which is inherently unstable/ambiguous once extracted from its original publication context and re-served in a different temporal context (a genuinely direct connection to Topic I, Freshness, which I have not yet written — flagging this explicitly as a cross-topic concern I will resolve in Topic I's ownership rather than duplicate here).

### D. Important mechanisms
The single, most important synthesized insight for this entire cluster: **negation, conditionals, and qualification language are not merely "hard to write clearly" — they are a documented, actively-researched category of genuine NLP difficulty, with concrete, citable evidence (the xNot360 benchmark's striking accuracy figures) that even frontier LLMs measurably struggle with negation specifically.** This gives A16/F2's general "fact/qualifier separation is risky" finding a **linguistic mechanism**, not just a layout/chunking-boundary mechanism — meaning the risk isn't purely about *where* content sits in the DOM/chunk structure, it's also about *how linguistically complex* the qualifying relationship is in the first place. A negated or conditional fact is at elevated risk even *within* a single, well-formed, non-chunk-boundary-split sentence, which A16/F2's layout-focused framing alone wouldn't fully capture.

### E. Concrete website signals
- **E31/E32 (cheapest, most deterministic):** bare numbers/currency symbols without proximate, recognizable unit/currency tokens.
- **E35 (negation):** presence of negation cue words/phrases ("not," "without," "excludes," "does not," "no longer") near fact-bearing content, flagged for LLM-escalated scope-verification (does the negation clearly, unambiguously apply to the specific claim, or is the scope genuinely ambiguous even to a careful human reader) given the documented, non-trivial difficulty of this task.
- **E34 (conditionals):** presence of conditional-trigger phrases ("if," "only if," "unless," "provided that," "except") near fact-bearing content, similarly flagged for scope-clarity verification.
- **E36 (qualification language):** presence of hedge words ("typically," "up to," "may," "in most cases," "approximately") near numeric/factual claims, checked for whether the hedge and the specific value would likely survive together through a plausible chunk-extraction window (reusing A16's window-testing methodology).
- **E33 (temporal ambiguity):** presence of relative-time language ("currently," "now," "recently," "as of today") unaccompanied by an absolute, extractable date — connects directly to the freshness-credibility concern already flagged for Topic I ownership.

### F. How the signal could be detected automatically
Hybrid, appropriately scoped by sub-topic cost/complexity: E31/E32 (unit/currency proximity) are cheap, high-confidence, purely deterministic pattern-matching checks — implement these first, as the highest-confidence, lowest-cost members of this cluster. E35/E34/E36 (negation/conditional/hedge scope-clarity) require LLM-escalation given the documented, genuine difficulty of automated scope-resolution even for sophisticated systems — a deterministic first-pass cue-word detector (cheap) flags candidates, with LLM judgment reserved for actually assessing whether the scope is clear or genuinely ambiguous (appropriately reserving the more expensive resource for where semantic judgment is actually needed, consistent with the brief's hybrid-approach guidance). E33 defers to Topic I's ownership for its temporal-specific detection logic.

### G. What evidence the skill should report
For E31/E32: the specific bare number/currency instance and its location. For E35/E34/E36: the specific negated/conditional/hedged claim, the LLM's assessment of scope clarity, and — where genuinely ambiguous — a plain-language explanation of what a reader might incorrectly conclude (directly reusing F2's evidence-output format, since this is the same underlying misrepresentation-risk framing, now with a linguistic rather than purely structural trigger).

### H. Possible severity logic
- **Medium-High:** negation/conditional scope ambiguity on consequential fact types (pricing, eligibility, legal/compliance terms) — directly inheriting F2's severity tiers for the same fact-type categories, since a misread negation on a pricing/eligibility claim has the same real-world consequence as a structurally-separated fact/qualifier.
- **Low-Medium:** unit/currency ambiguity — a real but generally lower-stakes, cheaper-to-fix issue than negation-scope ambiguity.
- **Low:** qualification-language findings where the hedge and value are already closely co-located (low actual separation risk despite the hedge's presence).

### I. Correct remediation
Rewrite negated/conditional statements to make scope unambiguous even in isolation (e.g., "Does NOT include international shipping" → "International shipping is not included in this price" — restructuring to keep the negation and its scope in obviously the same clause); always pair bare numbers with explicit units/currency codes; keep qualifying hedge language immediately adjacent to the value it qualifies, not separated by intervening unrelated content.

### J. False-positive cases
Not every negation/conditional/hedge is genuinely ambiguous — many are perfectly clear even to a careful reader ("Free shipping is not available for orders under $50" has an obvious, unambiguous scope) — the LLM-escalation step's entire purpose is to distinguish genuinely ambiguous cases from clearly-scoped ones, and a naive deterministic-only check (flagging every instance of "not"/"if"/"typically") would produce substantial false positives; this cluster's hybrid design is specifically structured to avoid that trap.

### K. False-negative risks
Subtle, implicit negation (e.g., "forbid," "lacks," "fails to meet" — cue words the deterministic first-pass might not include in its trigger-word list) could be missed by a first-pass that only checks common, explicit negation markers like "not"; the peer-reviewed literature explicitly notes negation can be "formulated both explicitly... or implicitly," a genuine, acknowledged detection-completeness limitation.

### L. Counterexamples
A page written for a genuinely expert/technical audience might use precise, unambiguous conditional/technical language that would only seem "ambiguous" to a naive check applying general-audience clarity standards — severity/flagging should account for evident audience sophistication, consistent with how Topic A's A12/A13 research already handles the jargon-vs-plain-language tradeoff for expert-audience sites.

### M. Generalizes?
Yes, well — negation/conditional/qualification-language risk is a genuinely universal linguistic phenomenon, present in any natural-language content regardless of site type or industry, though its *stakes* (severity) vary by fact-type context per the taxonomy in Cluster B above.

### N. Candidate skill(s)
Extends the existing `passage-chunk-quality`/misrepresentation-risk skill (A16/F2) with a new, linguistically-grounded detection layer (negation/conditional/hedge scope-clarity checking) — not a new standalone skill, but a genuinely new, well-evidenced *capability* within that skill, backed by a citable, concrete piece of evidence (the xNot360 accuracy figures) that most competing teams are unlikely to have surfaced.

### O. Relationship to other skills
Directly extends A16/F2 (Topics A/B) with a linguistic-mechanism layer; E33 (temporal ambiguity) explicitly deferred to Topic I; E31/E32 connect to Topic D's D50 (locale architecture) for the internationalization angle.

---

## 3. Findings register
*(Selecting the genuinely new, load-bearing findings from Clusters A-C; E1-E18 are represented by the cross-reference table in Section 1, not restated here.)*

---
**FINDING ID:** E-01
**Researcher:** Pulkit
**Research Area:** E — Content Extraction & Information Architecture
**Research Question:** E35 (negation) — Is negation-scope ambiguity a genuine, evidenced NLP difficulty, or a manufactured concern?
**Observation:** Negation scope detection is a formal, peer-reviewed NLP subfield dating to at least 2008 (BioScope corpus), with documented poor cross-domain transfer; a specific benchmark (xNot360) directly testing GPT-2 through GPT-4 found even GPT-4 achieved only 0.78 accuracy / 0.77 F1 on negation detection, with GPT-3.5 at just 0.43 accuracy / 0.27 F1.
**Evidence:** BioScope/Genia Event corpora comparison paper; "Improving negation detection with negation-focused pre-training" (NAACL 2022, cites cross-domain transfer failure); xNot360 benchmark results as reported in "Balancing Exploration and Exploitation in LLM using Soft RLLF for Enhanced Negation Understanding" (arXiv).
**Sources:** See Cluster C section C for full citations.
**Pattern:** Negation-scope ambiguity is a genuine, well-evidenced, actively-researched difficulty, not a manufactured concern — and plausibly compounds with (not merely adds to) the already-established chunk-boundary fact/qualifier-separation risk (A16/F2), since a negated fact split across a chunk boundary combines two independently-documented difficulties.
**Counterexamples:** Many negated statements are perfectly unambiguous even in isolation; the finding is about genuinely ambiguous scope, not negation's mere presence.
**Hypothesis:** The compounding relationship between negation-scope difficulty and chunk-boundary separation is our own reasonable synthesis of two established literatures, not independently tested as a joint hypothesis by any source found.
**Signal:** Negation cue words/phrases near fact-bearing content, with LLM-escalated scope-clarity assessment.
**How to Detect:** Deterministic cue-word first pass, LLM escalation for scope-ambiguity judgment.
**Evidence Output:** Specific negated claim, scope-clarity assessment, plain-language explanation of potential misreading.
**False Positives:** Clearly-scoped negation should not be flagged; only genuine ambiguity.
**False Negatives:** Implicit/non-explicit negation markers (forbid, lacks, fails to meet) may be missed by a cue-word-only first pass.
**Severity:** Medium-High for negation ambiguity on consequential fact types (pricing, eligibility, legal terms).
**Recommended Fix:** Restructure negated statements to keep negation and scope in the same clause, avoiding ambiguity even in isolation.
**Generalization:** Universal linguistic phenomenon; the specific xNot360 figures are dated (older-generation models) and should not be assumed to directly transfer to current-generation ChatGPT/Claude/Gemini/Perplexity without acknowledging this limitation.
**Candidate Skill:** Extends `passage-chunk-quality`/misrepresentation-risk skill (A16/F2) with a new linguistic-detection layer.
**Related Skills:** A16, F2 (Topic B).
**Confidence:** HIGH for the underlying academic field and the general difficulty of negation-scope detection (peer-reviewed, well-established) / MEDIUM for the specific xNot360 figures' relevance to current frontier models, given the benchmark's dated model roster.

---
**FINDING ID:** E-02
**Researcher:** Pulkit
**Research Area:** E — Content Extraction & Information Architecture
**Research Question:** E24-E30 — Do "pricing extraction," "spec extraction," "contact extraction," etc. require seven separate detection mechanisms?
**Observation:** All seven named fact-type extraction categories reduce to the same underlying mechanism already established in A16/F2/B5 (fact/qualifier structural separation risk) — the only genuine, non-arbitrary distinction between them is *which specific qualifying context* matters per fact type (billing period for pricing, unit for specs, department for contact info, date-type for dates, etc.).
**Evidence:** Direct synthesis of already-established A16 (Topic A), F2 (Topic B), and B5 (Topic B) findings, applied systematically across the seven named categories.
**Sources:** Internal synthesis; no new external sources required beyond what's already cited in A16/F2/B5.
**Pattern:** A significant fraction of the E-topic's apparent 36-sub-topic breadth is, like a similar pattern already found in Topic D, a surface-level naming of a small number of shared underlying mechanisms — reinforcing a consistent finding across this entire research project.
**Counterexamples:** None of these seven categories exhibit a genuinely distinct extraction mechanism from the general fact/qualifier pattern; the honest finding is convergence, not divergence.
**Hypothesis:** N/A — this is a direct, disclosed research-scoping decision, not an empirical hypothesis.
**Signal:** Reuses A16/F2/B5's existing extraction infrastructure entirely.
**How to Detect:** No new detection mechanism; the qualifying-context taxonomy serves as configuration data for the existing LLM-escalation step.
**Evidence Output:** Inherited from A16/F2/B5.
**False Positives/Negatives:** Inherited from A16/F2/B5.
**Severity:** Inherited from A16/F2/B5, with fact-type context as a risk-concentration input.
**Recommended Fix:** N/A directly — see A16/F2/B5.
**Generalization:** The qualifying-context taxonomy is broadly applicable; E28 (location) is the most site-type-dependent (irrelevant for purely digital businesses).
**Candidate Skill:** No new skill — configuration data for the existing skill.
**Related Skills:** A16, F2, B5 (all Topics A/B).
**Confidence:** HIGH — this is a disclosed scoping/consolidation decision grounded directly in already-well-evidenced prior findings, not a new empirical claim requiring its own confidence rating.

---
**FINDING ID:** E-03
**Researcher:** Pulkit
**Research Area:** E — Content Extraction & Information Architecture
**Research Question:** E19 (table extraction) — Is HTML table parsing a solved, purely mechanical problem, or a genuine extraction-risk zone?
**Observation:** WikiTableQuestions (Pasupat and Liang, 2015), a foundational, widely-cited NLP benchmark, was created specifically because question-answering over semi-structured HTML tables is a genuine, non-trivial task; more recent work (HTML-LSTM) explicitly frames combining structural and semantic table understanding as an open problem, not a solved one.
**Evidence:** Pasupat and Liang 2015 (WikiTableQuestions); HTML-LSTM paper (arXiv 2409.19445).
**Sources:** See Cluster A section C.
**Pattern:** Tables structurally concentrate the fact/qualifier-separation risk already established in A16/F2 (value and header context are, by table design, in different cells), making correct `<th>`/`scope` markup a genuinely high-leverage, low-cost fix — directly extending A16's existing false-positive handling (well-marked-up tables are not inherently risky) with positive academic grounding for why the distinction matters.
**Counterexamples:** Simple, single-row/column tables with unambiguous data carry low risk even without perfect markup.
**Hypothesis:** N/A — direct grounding in established academic benchmarks.
**Signal:** Table presence with/without correct header association, cross-referenced against A16's fact/qualifier self-containment logic applied per-cell.
**How to Detect:** Deterministic DOM inspection for `<th>`/`scope` attributes; LLM-escalation for ambiguous cases.
**Evidence Output:** Specific table instances lacking header association, with the specific cell-value/context-separation risk implied.
**False Positives:** Layout-only tables with no genuine tabular data relationship.
**False Negatives:** Non-standard "tables" built from styled `<div>` grids rather than actual `<table>` elements.
**Severity:** Elevated relative to equivalent prose findings, given tables' structural guarantee of value/context separation.
**Recommended Fix:** Add correct `<th>`/`scope` attribution to genuinely tabular content.
**Generalization:** Universal; especially prevalent on e-commerce/spec-sheet-heavy site types.
**Candidate Skill:** Pattern-recognition extension of `passage-chunk-quality` (A16/F2), not a new skill.
**Related Skills:** A16, F2 (Topic B).
**Confidence:** HIGH — grounded in an established, peer-reviewed NLP benchmark tradition.

---

## 4. Required end-of-topic synthesis

**Strongest validated insight:**
The single most important finding across this entire Topic E research pass is a **meta-finding, not a new mechanism**: a large majority of the assigned 36 sub-topics — genuinely all of E1–E18 and most of E24–E30 — are surface-level, differently-named instances of a small number of mechanisms this research project already established and evidenced rigorously in Topics A (A16), B (F1/F2/B5), and D (Cluster II). This is now the **third time** this exact pattern has appeared across this research project (Topic C's crawlability clusters, Topic D's rendering clusters, and now Topic E), which itself becomes a validated, higher-confidence structural insight about the whole marketplace: **the underlying mechanisms genuinely worth building deterministic skills around are few — full-DOM-text-presence checking, raw-vs-rendered comparison, main-content/boilerplate identification, and fact/qualifier structural-separation risk — and the assignment's fine-grained sub-topic lists are best understood as a thorough enumeration of *where* these few mechanisms apply, not as 150+ independent problems requiring 150+ independent solutions.**

**Strongest unvalidated hypothesis:**
That negation-scope difficulty and chunk-boundary fact/qualifier separation **compound** (not merely co-occur) when both are present in the same instance — i.e., a negated fact that's also split across a chunk boundary is at meaningfully *higher* combined risk than either factor alone would predict. This is a novel synthesis of two independently well-evidenced literatures (A16's chunking research and the negation-scope-detection field newly introduced in this document) that neither literature states directly, and would be a genuinely valuable thing to test empirically if Topic R's experiment-design phase has capacity.

**Strongest candidate skill:**
No new skill emerges from Topic E as a standalone entity — the strongest outcome of this research pass is confirming and *strengthening* the existing `passage-chunk-quality`/misrepresentation-risk skill family (A16/F2) with (a) a structured-format pattern-recognition layer (Cluster A: tables/lists/FAQs/definitions/comparisons), (b) a fact-type-specific qualifying-context taxonomy (Cluster B), and (c) a genuinely new, well-evidenced linguistic-detection layer for negation/conditional/hedge-scope ambiguity (Cluster C, backed by the concrete, citable xNot360 finding). This is a case where the "candidate skill" answer is correctly "make the existing skill better," not "build a new skill" — a valuable, disciplined outcome given the brief's explicit warning against padding the marketplace with narrowly-differentiated, low-value skills.

**Weakest assumption we should investigate next:**
The xNot360 benchmark's negation-detection accuracy figures (E-01) are based on GPT-2 through GPT-4 — a now-dated model roster relative to the current frontier systems (Claude, GPT-5-class models, Gemini 3, current Perplexity) actually relevant to this hackathon. While the *general mechanism* (negation-scope detection is a genuine, non-trivial NLP challenge, evidenced by an actively-researched academic field going back to 2008) is well-grounded and unlikely to have simply disappeared, the *specific accuracy figures* should not be assumed to directly describe current-generation model behavior, and this should be flagged in the skill's confidence language rather than presented as if freshly measured against the actual four vendors this project cares about.

---

## 5. Cross-references for the Combine & Code phase

- **E1-E18 collectively ↔ A16 (Topic A), F1/F2 (Topic B), Cluster II (Topic D):** Confirmed non-duplicate; Section 1's cross-reference table is the authoritative record — no new skill folders needed for these sub-topics.
- **Cluster A (structured-format extraction) ↔ A16/F1/F2/F3/A13:** Should be implemented as a pattern-recognition *extension* of the existing skill, not a separate skill — explicit flag against padding the marketplace.
- **Cluster B (fact-type taxonomy) ↔ A16/F2/B5:** The qualifying-context taxonomy table is genuinely useful *configuration data*, not a new mechanism — should be handed directly to whoever implements the A16/F2 skill's LLM-escalation prompts.
- **Cluster C (negation/conditional/hedge) ↔ A16/F2:** The single genuinely new *capability* to emerge from Topic E — recommend this be prioritized for implementation given its strong, concrete evidentiary backing (xNot360) and its non-obvious value (most competing teams are unlikely to have connected website auditing to the negation-scope-detection literature).
- **E33 (temporal ambiguity) ↔ Topic I (mine, Freshness):** Explicit, deferred ownership flag, consistent with how I've handled similar cross-topic overlaps (e.g., Topic C's `lastmod` credibility question) — will resolve fully when Topic I is written, not duplicated here.
- **E28 (location extraction) ↔ Topic V (Soham, Site-Type Differentiation):** Explicitly flagged as the most site-type-dependent sub-topic in this entire document (irrelevant for purely digital/SaaS businesses with no physical presence) — severity should consume Topic V's site-type classifier as an input.
- **Meta-finding (mechanism convergence across Topics C, D, and now E) ↔ Topic S (Soham, Scoring & Severity) and the overall marketplace architecture:** This is now a three-times-repeated structural finding worth surfacing explicitly to the whole team before the Combine phase — the marketplace likely needs far fewer genuinely-distinct skills than the raw sub-topic count across all research areas would suggest, and I recommend an explicit team discussion of this before skill-folder decisions are finalized.
