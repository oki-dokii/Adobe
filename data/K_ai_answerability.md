# Topic K — AI Answerability (K1–K25)
**Researcher:** Pulkit | **Research Area:** K — AI Answerability
**Priority:** Very High (explicitly flagged as one of the highest-value additions to the research map)

---

## 0. Framing — why K is genuinely different from everything researched so far, and what that difference actually is

Every prior topic in this project (A-E, I) has asked some version of: **can a machine reach this content, extract it correctly, and trust that it's current?** Topic K asks a different, higher-level question that sits *downstream* of all of that: **assuming the content is reachable, extractable, and fresh, does the website actually contain a clear, complete, correctly-scoped answer to a specific, realistic question a person might ask an AI about this company?**

This is a genuinely important distinction, and I want to state precisely why it's not redundant with Topics A/B/D/E:

- A page can pass every crawlability check (Topic C), render perfectly (Topic D), have perfectly self-contained, chunk-safe passages (Topic A's A16, Topic B's F2) — and still **never actually state** who the target customer is, what the pricing model is, or what the product's limitations are. Extractability is about *whether a fact that exists can be gotten out cleanly*; answerability is about *whether the fact exists on the site at all, in a form that answers a specific, realistic question.*
- This is the difference between a **content-quality/extraction audit** (does the machinery work) and a **content-completeness audit** (does the site actually say the things a prospective customer, journalist, or curious person would want to ask about). Topic K is the second kind, and it is the one place in this entire research project where the central question is genuinely "what does the site say," not "can a machine get at what the site says."

**This has a direct, important methodological consequence:** Topic K cannot be answered by static DOM/HTML analysis alone the way most of Topics A-E could. Determining "can the site answer K6 (pricing)" requires either (a) an LLM reading the crawled content and attempting to actually answer the question, reporting whether it could, or (b) a live-query test against a real AI system. This makes Topic K the first topic in this research project where **LLM-based question-answering simulation is the core detection mechanism**, not a secondary escalation step for ambiguous cases — a meaningful shift in how the eventual skill should be built, and worth flagging explicitly.

---

## 1. Legend
Same as all prior topics: **FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**.

---

## Cluster A — The answerability-testing mechanism itself
**Covers:** K1 (common questions about itself), K2 (who/what/why/how), K25 (answering without combining five pages) — grouped together because they define the *methodology* the other 22 sub-topics all depend on.

### A. What we need to understand
Before asking "can the site answer pricing/leadership/competitors questions," we need a rigorous, defensible, non-arbitrary methodology for *what it means to test answerability* at all — otherwise K3-K24 becomes a checklist run through vibes rather than a principled evaluation.

### B. Why it matters
This cluster is where the entire "AI Answerability Score" concept either becomes a rigorous, defensible metric or a hand-wavy marketing number — getting the underlying methodology right is the single highest-leverage research task in this topic.

### C. Current evidence

**K25 (multi-page combination) — the most academically substantive sub-topic in this entire cluster, and arguably in the whole topic:**
- **FACT (peer-reviewed, foundational, directly and precisely relevant — this is a genuinely strong find):** HotpotQA (Yang et al., EMNLP 2018, Carnegie Mellon/Stanford/Université de Montréal) is a large-scale (113,000 question-answer pairs), widely-cited benchmark built specifically around **multi-hop question answering** — questions that "require finding and reasoning over multiple supporting documents to answer," as opposed to single-document/single-passage QA. Critically, HotpotQA provides a **formal taxonomy of multi-hop reasoning types**, independently useful for structuring K25's own detection logic: **Bridge-entity reasoning** (must infer an intermediate entity connecting two separate pieces of evidence before resolving the actual question — e.g., "What is the price of the product made by the company founded by X?" requires first resolving "the company founded by X," then finding that company's product pricing), **Intersection reasoning** (the answer is defined by the intersection of properties stated on different pages), and explicit **Comparison reasoning** ("which of A or B is larger/older/cheaper," directly relevant to K20/K21).
- **FACT (directly from the same paper, a genuinely useful, transferable evaluation-design insight):** HotpotQA's evaluation methodology doesn't just score final-answer accuracy — it also requires and scores **"supporting facts"**: sentence-level annotations of exactly which sentences, on which pages, were necessary to derive the answer. The paper explicitly frames this as enabling "explainable" QA — a system must not just produce a correct answer but **show its work**, identifying precisely which pieces of evidence, from which sources, were combined. **This maps almost exactly onto what K25 is asking for**: not just "can the site answer this," but "how many distinct pages/passages had to be combined, and which ones."
- **INFERENCE (a direct, well-grounded translation of HotpotQA's methodology into the website-audit context — this is the core proposed mechanism for K25, and by extension the whole cluster):** A defensible way to operationalize "can this site answer a question without combining five pages" is to **directly reuse HotpotQA's own supporting-facts methodology**: have an LLM attempt to answer a realistic question about the company using only the crawled site content, and require it to **cite which specific page(s)/passage(s) it drew from** for each component of the answer. The **count of distinct pages cited** becomes a direct, interpretable, defensible metric — not an arbitrary "five pages" threshold invented for this project, but a metric with a genuine academic precedent (HotpotQA explicitly distinguishes single-hop, 2-hop bridge, and more complex multi-hop reasoning chains, and reports that even in their curated dataset, a small residual fraction of questions turned out to be effectively single-hop or unanswerable on reflection — i.e., even careful question-writers sometimes overestimate how many hops a question actually requires, a useful humility check for our own question-set design).

**K1/K2 (general answerability framing) — grounded in a second, complementary, equally foundational benchmark:**
- **FACT (peer-reviewed, foundational, directly relevant to K1/K2's core framing):** SQuAD 2.0 (Rajpurkar et al., 2018, Stanford) extended the original SQuAD reading-comprehension benchmark specifically by adding over 50,000 **unanswerable questions** — questions that are "look-alikes" of answerable ones (plausible, well-formed, on-topic) but for which the provided passage genuinely does not contain the answer. The paper's central, explicitly-stated finding is that **a system must learn to know when it doesn't know** — correctly abstaining from answering when the passage doesn't support an answer is presented as a distinct, harder skill than simply extracting an answer when one is present, and models that perform well on plain extraction often perform substantially worse once unanswerable questions are mixed in.
- **INFERENCE (a direct, load-bearing translation of SQuAD 2.0's core insight to our audit context, and arguably the single most important methodological point in this entire document):** This gives K1/K2's underlying "answerability" concept real formal precision, and reveals a **critical asymmetry our audit must guard against**: an LLM asked "does this website state its pricing" might, absent careful prompting, produce a plausible-sounding answer even when the actual pricing information is **not present** on the crawled content — essentially hallucinating an answer rather than correctly reporting "unanswerable from the provided content," exactly the failure mode SQuAD 2.0 was built to expose and measure. **Our answerability-testing skill must be explicitly designed and prompted to support and even encourage "cannot be determined from the provided content" as a valid, first-class output** — not as a fallback but as the *specific thing being measured*. This is a genuinely important, non-obvious design requirement most competing teams building an "answerability score" would likely miss, defaulting instead to a naive "ask an LLM and see what it says" approach that would systematically overstate answerability due to the same abstention-failure problem SQuAD 2.0 identified in QA models generally.

### D. Important mechanisms
Synthesizing K1/K2/K25 into one coherent methodology: **"AI Answerability" should be operationalized as a controlled, closed-book QA evaluation** — an LLM is given (a) a specific, realistic question (from the K3-K24 taxonomy below) and (b) *only* the crawled site content (not general world knowledge, not an open web search) — and must produce one of exactly three outcomes: **(1) a direct, well-supported answer with cited source page(s)**, **(2) an explicit "cannot be determined from the provided content" abstention**, or **(3) a partial/uncertain answer with explicit caveats about what's missing.** This three-way outcome design directly borrows SQuAD 2.0's answerable/unanswerable distinction (adding a third, genuinely useful "partial" category our audit needs that SQuAD 2.0's binary framing didn't require), and the **page-citation-count** for outcome (1) directly borrows HotpotQA's supporting-facts methodology to operationalize K25.

### E. Concrete website signals
For each question in the K3-K24 taxonomy, run this closed-book QA protocol against the crawled site content and record: (a) which of the three outcomes resulted, (b) for direct answers, how many distinct pages were cited as supporting evidence, and (c) the specific answer text produced, for human review/spot-checking.

### F. How the signal could be detected automatically
This is explicitly, necessarily an **LLM-centric mechanism**, not a deterministic one — this is a case where the brief's "use LLM reasoning only where semantic interpretation is actually required" guidance is fully satisfied, since "can this content answer this specific question" is inherently a comprehension task, not a pattern-matching one. The deterministic component that *does* exist: feeding the LLM only the crawled, extracted content (reusing all of Topics A/D/E's extraction infrastructure as the input pipeline) rather than allowing it to draw on general world knowledge, which is essential for the closed-book design to actually measure the *website's* answerability rather than the LLM's own general knowledge of the company.

### G. What evidence the skill should report
Per question: the outcome category (answered / partial / unanswerable), the specific answer given (if any), the specific page(s) cited, and the page-count for K25's specific metric. This directly, naturally aggregates into the "AI Answerability Score" the user's own framing anticipates — see Cluster D below for the scoring design.

### H. Possible severity logic
Deferred to Cluster D (scoring design) — this cluster establishes the *measurement* mechanism; severity/scoring synthesis is addressed once the full K3-K24 taxonomy's category-specific stakes are established.

### I. Correct remediation
General, cluster-level remediation: for any question landing in the "unanswerable" or "partial" outcome, the fix is to add clear, explicit content addressing that specific question — not vaguely "add more content," but specifically the missing fact identified by the failed QA attempt, which is a genuinely precise, actionable output this methodology produces almost for free.

### J. False-positive cases
**The single most important false-positive risk for this entire methodology, directly following from the SQuAD 2.0 finding:** if the underlying LLM used for testing is prone to the same over-confident-hallucination failure SQuAD 2.0 identified in QA models generally, our audit could systematically **overstate** answerability — reporting a website as answering a question when it actually doesn't, because the LLM filled the gap with plausible-sounding but ungrounded content rather than correctly abstaining. This must be actively tested and guarded against (e.g., via explicit prompting requiring citation for every claim, and treating any answer without a specific, verifiable page-citation as suspect) rather than assumed away.

### K. False-negative risks
The reverse failure is also possible and must be guarded against with equal care: an overly conservative LLM might report "unanswerable" for a question the site actually does answer, if the answer is phrased indirectly or requires a small amount of reasonable inference (e.g., a site listing specific enterprise-scale customer logos without explicitly stating "we serve large enterprises" — does this count as answering K4, target customers? A reasonable case can be made either way, and the skill's prompting/scoring should make an explicit, disclosed choice about how much inference to credit, rather than leaving this ambiguous).

### L. Counterexamples
Not every question in the K3-K24 taxonomy is equally appropriate for every site type — a purely open-source, non-commercial project's website has no meaningful answer to K6 (pricing) or K14 (company size) in the same sense a SaaS company does, and "unanswerable" for such a question on such a site is not a defect, it's a correct, non-applicable result. The scoring design (Cluster D) must account for this rather than penalizing every "unanswerable" result identically regardless of whether the question was ever applicable.

### M. Generalizes?
Yes, extremely well — the three-way closed-book QA methodology and the page-citation-count mechanism are both completely site-type- and question-agnostic; the specific *question set* (K3-K24) is what needs site-type-aware scoping (per the false-positive point above), not the underlying measurement mechanism.

### N. Candidate skill(s)
**`ai-answerability-audit`** — the anchor skill for this entire topic, implementing the three-way closed-book QA protocol against the K3-K24 question taxonomy, using crawled content as input (reusing extraction infrastructure from Topics A/D/E) and producing the structured outcome-plus-citation-count data needed for the Answerability Score.

### O. Relationship to other skills
Consumes the output of nearly every extraction-focused skill built in prior topics (A16, F1-F3, D's various clusters, E's structured-format extraction) as its input pipeline — this is a genuinely good example of one topic's skill being architecturally *downstream* of several others, not a competing or overlapping concern.

---

## Cluster B — The question taxonomy: identity, offering, and commercial facts
**Covers:** K3 (primary offering), K4 (target customers), K5 (geography), K6 (pricing), K7 (differentiators), K8 (features), K9 (limitations), K10 (competitors), K11 (use cases), K12 (eligibility requirements), K13 (contact information), K14 (company size), K15 (industry), K16 (founding information), K17 (leadership), K18 (customer evidence), K19 (product availability)

### A. What we need to understand
Whether these seventeen named question categories require genuinely distinct detection logic, or whether — consistent with the now-repeated pattern across Topics C/D/E/I — they reduce to the single Cluster A methodology applied with a category-specific question bank, with the real research value lying in *which questions to ask* and *why each category matters differently*.

### B. Why it matters
Applying the same disciplined scrutiny used in prior topics' analogous clusters: the genuine research contribution here is the **question bank itself and its stakes-differentiation**, not a claim of 17 different detection mechanisms.

### C. Current evidence
- **INFERENCE (the central, honest, now-familiar finding for this cluster):** All seventeen categories use **exactly the same Cluster A mechanism** (closed-book QA against crawled content, three-way outcome, citation counting). What genuinely differs, and is worth researching properly rather than treating as self-evident, is **(a) which specific question phrasing best represents how a real person would ask, (b) how directly answerable each category typically is from a well-built site's existing content structure, and (c) what the real-world stakes of an "unanswerable" result are per category.**
- **Category-specific analysis table, synthesized from direct connections to prior research in this project plus reasonable business-context inference:**

| Category | Natural question phrasing | Where the answer typically lives (if present) | Real-world stakes of "unanswerable" |
|---|---|---|---|
| **K3 Primary offering** | "What does [company] do/sell?" | Homepage, about page — directly connects to Topic A's A13 (category/positioning clarity), already established as high-value | Severe — this is the most fundamental identity question; failing it means the site fails at its most basic communicative purpose |
| **K4 Target customers** | "Who is [company]'s product for?" | Homepage, about page, sometimes only implicit via customer logos/case studies (the inference-credit ambiguity flagged in Cluster A's false-negative discussion) | High — directly affects whether an AI would ever recommend the company to a matching prospect |
| **K5 Geography** | "Where does [company] operate/ship/serve?" | Contact/about page, footer, terms of service | Medium-High, especially for physical/regulated businesses; low for genuinely global-by-default digital products where geography is inapplicable |
| **K6 Pricing** | "How much does [company]'s product cost?" | Dedicated pricing page — directly connects to the JS-only-pricing root-cause example the brief itself uses, and to Topic I's I6 (stale pricing) and Topic E's E24 (pricing extraction qualifying-context) | Severe — the single most consequential category for purchase-decision-relevant AI answers, repeatedly identified as the flagship example throughout this entire research project |
| **K7 Differentiators** | "What makes [company] different from competitors?" | Rarely explicit (companies are often reluctant to name competitors) — directly connects to Topic A's A13 finding about this exact tension | High but structurally hard — this is a case where "unanswerable" is a common, expected finding even for well-built sites, not necessarily a simple oversight |
| **K8 Features** | "What features/capabilities does [product] have?" | Feature pages, documentation — connects to Topic E's E25 (feature extraction) | High for product-comparison-relevant queries |
| **K9 Limitations** | "What does [product] NOT do / what are its limitations?" | Almost never explicitly, proactively stated by a company about itself — a genuinely structural, near-universal gap | Medium — an "unanswerable" result here is extremely common and expected; this category's value is less about flagging a fixable defect and more about honestly informing the audit's own limitations (see discussion below) |
| **K10 Competitors** | "Who are [company]'s competitors / alternatives to [company]?" | Almost never stated (same reluctance as K7) — directly connects to Topic A's A18 (source substitution) and A13 | High-stakes but structurally near-universal-gap, same caveat as K9 |
| **K11 Use cases** | "What is [product] used for? What problems does it solve?" | Feature/solution pages, case studies | High — directly overlaps with K3/K4 but from a problem-oriented rather than product-oriented angle |
| **K12 Eligibility requirements** | "Who can use/qualify for [product/service]?" | Terms, FAQ, signup flow — connects to Topic E's E34 (conditional statements) directly | Medium-High, especially for regulated/eligibility-gated services (financial products, age-restricted, region-restricted) |
| **K13 Contact information** | "How do I contact [company]?" | Contact page, footer — directly connects to Topic I's I9 (stale contact info) and the on-site-engagement mandate | Medium for AI-discoverability, but High for the on-site-engagement mandate specifically — a rare case where failing this question harms a human visitor as much as an AI query |
| **K14 Company size** | "How big is [company]? How many employees?" | About page, sometimes only via funding-announcement press releases (connects to Topic I's I17 finding about press-release staleness) | Low-Medium — often genuinely optional information many legitimate businesses choose not to disclose |
| **K15 Industry** | "What industry/category is [company] in?" | Same as K3, closely related — connects to Topic B's B10 (entity recognition/disambiguation) and A13 | High — directly relevant to entity disambiguation per Topic B's B10 finding about name-collision risk |
| **K16 Founding information** | "When was [company] founded? By whom?" | About page — a permanently-true fact type once established, per Topic I's Cluster III false-positive handling | Low-Medium — genuinely optional, though useful for entity-establishment/credibility |
| **K17 Leadership** | "Who leads/runs [company]?" | About/team page — directly connects to Topic I's I8 (stale leadership information) | Medium, with the staleness-risk caveat from Topic I being the more common actual failure mode (wrong answer) rather than pure unanswerability (no answer) |
| **K18 Customer evidence** | "Who uses/has used [company]'s product? What results have they gotten?" | Case studies, testimonials, logos — connects to Topic I's I12 (stale case studies) and I21 (event-date vs. publication-date confusion) | Medium-High — directly relevant to trust/credibility-focused queries |
| **K19 Product availability** | "Is [product] currently available? In what markets/tiers?" | Pricing/product pages — connects to K5 (geography) and Topic I's freshness concerns generally | Medium-High, time-sensitive by nature |

### D. Important mechanisms
The single most important, non-obvious synthesis from this table: **K9 (limitations) and K10 (competitors) are structurally different from the other fifteen categories** — for most companies, these questions are *near-universally* unanswerable from the company's own site, not because of a fixable content gap, but because companies structurally, deliberately avoid stating their own limitations or naming competitors on their own properties. This means a naive Answerability Score that penalizes every "unanswerable" result equally would systematically and unfairly punish every site roughly the same amount on these two categories, providing no differentiating signal and no actionable remediation (a company is very unlikely to add a "here are our competitors" section just because our audit flagged it). **The correct handling is to either exclude K9/K10 from the core weighted score entirely, or report them as a distinct, separately-labeled "structurally expected gap" category** rather than blending them into the same severity treatment as, say, K6 (pricing), where "unanswerable" is a genuine, fixable, consequential defect. This is a genuinely important, evidence-grounded refinement to the Answerability Score's design that a naive implementation would miss.

### E. Concrete website signals
Reuses Cluster A's methodology entirely, with the question-phrasing and "where the answer typically lives" columns above serving as the question bank and expected-source hints for the LLM-based QA protocol.

### F. How the signal could be detected automatically
No new mechanism beyond Cluster A — this cluster's contribution is the question bank and the structural distinction between "genuinely expected-to-be-unanswerable" categories (K9, K10) and "should generally be answerable, unanswerable is a real defect" categories (the other fifteen).

### G. What evidence the skill should report
Per-category outcome from Cluster A's protocol, with K9/K10 explicitly, visibly separated in the report's presentation from the other fifteen categories, consistent with the structural distinction established above.

### H. Possible severity logic
Directly informed by the table's "real-world stakes" column — K6 (pricing) and K3 (primary offering) at the severe end; K16 (founding info) and K14 (company size) at the low-medium end; K9/K10 excluded from standard severity scoring per the structural-gap handling above.

### I. Correct remediation
Category-specific, directly actionable: for any "should be answerable" category landing in the unanswerable/partial outcome, add explicit, clear content addressing that specific question (the QA protocol's failure mode itself tells you precisely what's missing) — genuinely one of the most directly actionable outputs across this entire research project, since the diagnostic method and the remediation gap are the same thing.

### J. False-positive cases
K9/K10's structural-gap handling (see Cluster D above) is the primary, most important false-positive guard for this cluster — without it, nearly every site in the marketplace's target population would be flagged similarly on these two categories, producing no useful differentiation and a misleading "many critical gaps" impression that doesn't reflect genuine, fixable defects.

### K. False-negative risks
The inference-credit ambiguity flagged in Cluster A (does implicit evidence like customer logos count as "answering" K4) applies most acutely to K4, K11, and K18 in this taxonomy, where indirect/implicit answers are common and legitimate; an overly strict QA protocol that only credits explicit statements could under-credit sites that communicate effectively through implication and social proof rather than direct statement.

### L. Counterexamples
A B2B enterprise software company legitimately may not publish pricing (K6) at all, by deliberate sales-process design ("contact us for a quote") — this is not the same failure mode as a company that simply forgot to state pricing, and the remediation should differ (acknowledging "contact for pricing" as a valid, if lower-completeness, answer pattern rather than treating it identically to true silence on the topic).

### M. Generalizes?
Yes, well, with the important site-type caveats already established throughout this table (K5/K19 geography-dependence, K6's B2B-enterprise exception, K9/K10's structural-gap handling) — consistent with how site-type variation has been handled in every prior topic.

### N. Candidate skill(s)
The question bank (this cluster's core contribution) is configuration data for the `ai-answerability-audit` skill established in Cluster A — not a separate skill.

### O. Relationship to other skills
Extensively cross-references nearly every prior topic in this research project (A13, A18, B10, D's various clusters, E24/E25/E34, I6/I8/I9/I12/I17/I21) — this cluster functions as a genuine synthesis point drawing together threads from across the whole project into one coherent, high-value question bank.

---

## Cluster C — The question taxonomy: comparative and situational questions
**Covers:** K20 (comparison questions), K21 ("best for X" questions), K22 ("alternative to X" questions), K23 (location-specific questions), K24 (time-sensitive questions)

### A. What we need to understand
Whether these five sub-topics require genuinely different testing logic from Cluster B's straightforward factual-QA methodology, given that they're phrased as more complex query types (comparisons, recommendations, situational qualifiers) rather than simple factual lookups.

### B. Why it matters
This cluster is where Topic K most directly connects to, and validates, Topic A's A13 (search-intent taxonomy) and HotpotQA's comparison-reasoning category (Cluster A above) — it's the point where "answerability" testing must handle genuinely more complex reasoning than simple fact retrieval.

### C. Current evidence
- **FACT (directly reusing HotpotQA's own explicit category, established in Cluster A):** HotpotQA formally includes "Comparison" as one of its named multi-hop reasoning types — "directly compare two entities across a shared property" — giving K20 specifically a direct, precise academic precedent rather than requiring new grounding: comparison-question answerability testing should follow the same closed-book QA protocol as Cluster B, but explicitly requires the LLM to evaluate whether the site provides **comparable, structured information about the compared entities**, not just information about itself in isolation.
- **INFERENCE (directly extending Topic A's A13, already established in this project, now applied specifically to the testing methodology):** A13 already established that comparison/recommendation-type queries ("best X," "X vs Y," "alternatives to X") require a site to have **explicitly stated its own category membership and differentiators** to be competitive for such queries — meaning K20-K22 are not just testing "can the site answer a comparison question" in the abstract, they're specifically testing whether the **prerequisite content K7 (differentiators) and K3/K15 (offering/category)** already established in Cluster B actually exists in a form usable for comparative reasoning. This makes K20-K22 substantially **downstream, composite tests** built on top of Cluster B's more atomic questions, not independent new content requirements.
- **INFERENCE (K21/K22, "best for X" and "alternative to X," a genuinely important, non-obvious point about testing methodology specifically):** Because K7/K10 (differentiators/competitors) were already established in Cluster B as **structurally, near-universally unanswerable from a company's own site** (companies don't name competitors or admit weaknesses about themselves), **K21 and K22 specifically are testing something the site being audited can never fully, directly answer about itself, by the nature of self-published content.** A company's own website cannot honestly and completely answer "is [company] the best choice for [use case] compared to alternatives" or "what are alternatives to [company]" in an unbiased way — this is fundamentally a question that requires **external, third-party corroboration** (Harsh's Topic H/P territory) to answer well, not something a first-party site audit can fully resolve. **This is a genuinely important scoping correction**: K21/K22 should be tested for whether the site provides the *raw materials* a third party or AI system would need to construct such a comparison (clear category, clear differentiators, clear use-case framing) rather than expecting the site itself to directly, completely answer the comparative question — a subtly different, more realistic testing target than a naive reading of "can it answer 'best for X' questions" would suggest.
- **INFERENCE (K23, location-specific questions, directly reuses K5 from Cluster B):** "Does [company] serve [specific location]?" is a direct, specific instantiation of K5's general geography question, requiring the same underlying content (clear geographic/service-area statements) but tested against specific, concrete locations rather than the general "where do you operate" phrasing — a useful refinement (specific-instance testing tends to surface gaps general-phrasing testing might miss, e.g., a site with a vague "we serve customers worldwide" statement that doesn't actually clarify support/shipping/compliance specifics for a particular country) rather than a fundamentally new mechanism.
- **INFERENCE (K24, time-sensitive questions, directly reuses Topic I's entire Cluster IV, already established):** "Is [product] currently available? What's the current price?" phrased with explicit temporal framing directly tests the same freshness/currency concerns already comprehensively researched in Topic I — K24 doesn't need new mechanism research, it needs Topic I's `freshness-signal-credibility` output to be incorporated as a direct input/modifier to the answerability score (a page might pass the basic Cluster A "is pricing stated" test while still failing K24 if the stated pricing is stale per Topic I's findings) — a genuine, valuable point of integration between the two topics that should be implemented as shared infrastructure, not duplicated logic.

### D. Important mechanisms
The single most important synthesis for this cluster: **K20-K24 are not five new content requirements — they are five different *lenses* applied to content requirements already established in Cluster B and Topic I, with K21/K22 specifically requiring a genuine, important scoping correction** (testing for raw materials rather than expecting direct self-answering of an inherently third-party-appropriate question). This cluster's research value is almost entirely in this scoping correction and the explicit cross-referencing, not in establishing new detection mechanisms.

### E. Concrete website signals
K20/K23: direct extensions of Cluster A's methodology with comparison/location-specific question phrasing. K21/K22: a **modified** test — instead of asking the LLM "does the site answer 'is X the best choice,'" ask whether the site provides the specific raw materials (clear category statement, clear differentiator statements, clear use-case framing) that would be *necessary inputs* for a third party to construct such an answer — a genuinely different, more realistic test design than Cluster B's direct-question pattern. K24: direct integration with Topic I's existing freshness-credibility output as a modifier on Cluster A/B's base answerability result.

### F. How the signal could be detected automatically
K20/K23 extend Cluster A's LLM-based QA protocol directly. K21/K22 require a distinctly-designed prompt testing for raw-material presence rather than direct self-answering (a meaningfully different LLM task, not just a different question string). K24 is primarily an integration/data-composition task (combining Cluster A/B's answerability result with Topic I's freshness result), not a new detection mechanism.

### G. What evidence the skill should report
K20/K23: standard Cluster A outcome reporting. K21/K22: explicitly reframed reporting — not "the site failed to answer 'is it the best,'" but "the site does/doesn't provide the differentiator and category-clarity raw materials a third party would need to construct a comparative recommendation," which is both a more honest and more actionable framing. K24: the base answerability outcome plus an explicit freshness-modifier flag drawn from Topic I's output.

### H. Possible severity logic
K20/K23 inherit Cluster B's category-specific severity (comparison/location questions inherit K7/K5's stakes respectively). K21/K22 should be scored on the raw-materials test, not a direct-answer test, avoiding the systematic "every company fails this" problem already flagged for K9/K10 in Cluster B (K21/K22 share the same structural issue and should receive the same careful, non-punitive scoring treatment). K24 severity is directly modulated by Topic I's freshness severity output.

### I. Correct remediation
K20/K23: same as the underlying Cluster B category being tested (differentiators, geography). K21/K22: the fix is ensuring the raw materials exist (same fix as K7/K3/K15), not attempting to make a company directly, self-servingly claim to be "the best" (which would be a credibility-damaging, inappropriate recommendation for us to make). K24: the fix is Topic I's freshness remediation, applied to whichever specific fact type failed the time-sensitivity check.

### J. False-positive cases
Directly inherited from Cluster B's K7/K9/K10 false-positive handling, now extended to K21/K22 — treating every "cannot directly self-answer 'are you the best'" result as a defect would be both unfair (structurally near-universal) and would risk implicitly encouraging inappropriate, self-serving superlative claims, which would cut against this project's own broader finding (Topic B's F1) that vague, unhedged superlative language is itself a citation-worthiness problem — a genuinely interesting tension worth flagging: over-correcting K21/K22 could push a site toward exactly the vague-marketing-language pattern F1 already identified as counterproductive.

### K. False-negative risks
K24's integration-based design means its accuracy is entirely dependent on Topic I's own detection accuracy and false-negative risks (already documented there) — no additional new false-negative risk specific to K24 itself, beyond what's inherited.

### L. Counterexamples
A company that *does* maintain a genuine, well-sourced "how we compare" page (a legitimate, if less common, practice — sometimes done via neutral, factual spec-comparison tables rather than subjective superlative claims) would correctly pass a properly-designed K20/K21 test, illustrating that the "structurally near-universal gap" framing for K21/K22 is a strong prior, not an absolute rule, and the audit should genuinely test for and credit this when present rather than assuming its absence.

### M. Generalizes?
Yes, well, with the same site-type dependencies already established for the underlying Cluster B categories each of these extends.

### N. Candidate skill(s)
No new skill — extends `ai-answerability-audit` (Cluster A) with comparison/location/time-specific question variants and the K21/K22 raw-materials-test design, plus direct integration with Topic I's freshness output for K24.

### O. Relationship to other skills
K24 is the clearest, most direct integration point between Topic K and Topic I in this entire document — recommend this be implemented as genuinely shared/composed infrastructure (Topic I's freshness-credibility output consumed directly by the answerability skill) rather than two independently-built systems that happen to check similar things.

---

## Cluster D — The AI Answerability Score: scoring design
**Covers:** the user's own explicit framing — synthesizing Clusters A-C into a single, defensible metric.

### A. What we need to understand
Given everything established above, what would a genuinely defensible "AI Answerability Score" formula look like — not as an afterthought, but as a first-class research question in its own right, since a poorly-designed aggregate score could misrepresent everything the underlying testing correctly measured.

### B. Why it matters
The user explicitly flagged this as "a powerful metric" the research should lead to — meaning the scoring design itself deserves real research attention, not just a naive average of per-question pass/fail results.

### C. Current evidence and design reasoning
- **INFERENCE (synthesizing the entire topic's findings into a scoring design — this is original synthesis work, not drawn from an external source, since I found no existing "AI Answerability Score" precedent in the literature searched):** A defensible score design must incorporate at least three of this document's established findings, or it will misrepresent what was actually measured:
  1. **Three-way outcomes, not binary** (Cluster A, from SQuAD 2.0): a "partial" answer should score between "answered" and "unanswerable," not be forced into a binary bucket.
  2. **Category weighting reflecting real-world stakes, not flat averaging** (Cluster B's table): a failure on K6 (pricing) should weigh more than a failure on K16 (founding date) in an aggregate score, per the differentiated stakes established there.
  3. **Structural-gap exclusion or separate reporting for K9/K10/K21/K22** (Clusters B and C): including these in a flat average would penalize every site similarly for a near-universal, often-inappropriate-to-fix pattern, destroying the score's differentiating power and potentially incentivizing bad remediation (self-serving superlative claims).
  4. **Page-citation-count as a secondary, distinct dimension** (Cluster A, from HotpotQA): a site that answers every question directly from one clear page per question is meaningfully more AI-friendly than one that technically contains all the same facts but scattered across many pages requiring difficult multi-hop synthesis — this should be reported as a **distinct sub-score** (e.g., "answer concentration") alongside the core answerability rate, not blended into a single number that would hide this genuinely different, separately-actionable dimension.
- **Proposed formula structure (our own synthesis, clearly labeled as such, not an established external standard):**
  - **Core Answerability Rate** = weighted average of (Answered=1.0, Partial=0.5, Unanswerable=0.0) across the *applicable, non-structurally-excluded* question set (Cluster B's fifteen core categories plus K20/K23/K24, weighted by the stakes table), explicitly excluding or separately reporting K9/K10/K21/K22.
  - **Answer Concentration Score** = a separate, distinct metric based on average page-citation-count per answered question (directly operationalizing K25), reported alongside, not blended into, the Core Answerability Rate.
  - **Freshness-Adjusted flag** = for K24-relevant questions specifically, an explicit modifier/flag drawing on Topic I's output, since a stale answer is a different (arguably worse) failure mode than a missing one and shouldn't be silently averaged away.

### D. Important mechanisms
The core, most important design principle: **a single blended number would hide more than it reveals**, given how differently-behaved the underlying categories are (near-universal structural gaps vs. genuine fixable defects vs. freshness-contingent answers). The score should be presented as a **small dashboard of 2-3 distinct, clearly-labeled numbers** (Core Answerability Rate, Answer Concentration, Freshness-Adjusted flag count) rather than one composite figure, directly consistent with this entire research project's repeated finding that aggregating distinct mechanisms into one number or one check systematically loses diagnostic value.

### E-L.
Not applicable in the standard A-O sense — this cluster is a synthesis/design deliverable, not an independent empirical claim requiring its own evidence/detection/severity treatment; its validity rests entirely on the soundness of Clusters A-C's underlying findings, already documented above.

### M. Generalizes?
Yes — the scoring design principles (three-way outcomes, stakes-weighted categories, structural-gap exclusion, separate concentration metric) are universal design principles, not site-type-specific, though the specific category weights should be adjustable per site type (Topic V integration point, consistent with every prior topic's handling of site-type variation).

### N. Candidate skill(s)
The scoring/aggregation logic itself — likely belonging to the report-synthesis layer (Soham's Topic S/AB territory) consuming `ai-answerability-audit`'s raw per-question outcome data, rather than being computed inside the answerability-testing skill itself, consistent with the separation-of-concerns principle already established across this project (detection skills produce evidence; scoring/severity synthesis happens at the report layer).

### O. Relationship to other skills
The single clearest, most explicit connection point in this entire research project between a Pulkit-researched topic and Soham's scoring/report-design territory — strongly recommend this scoring design be shared directly and discussed before Soham's Topic S/AB work is finalized, since the "don't blend structurally-different categories into one number" principle has implications beyond just Topic K.

---

## 2. Findings register
*(Selecting the strongest, most load-bearing, most novel findings.)*

---
**FINDING ID:** K-01
**Researcher:** Pulkit
**Research Area:** K — AI Answerability
**Research Question:** K1/K2/K25 — What is a rigorous, defensible methodology for testing "answerability," and how should multi-page-combination specifically be measured?
**Observation:** Two foundational, widely-cited NLP benchmarks directly and precisely inform this methodology: SQuAD 2.0 (Rajpurkar et al. 2018) establishes that correctly abstaining ("cannot be determined") is a distinct, measurable skill separate from answer extraction, and models without explicit abstention testing systematically overstate their own answerability; HotpotQA (Yang et al., EMNLP 2018) provides both a formal multi-hop reasoning taxonomy (bridge-entity, intersection, comparison) and a "supporting facts" methodology requiring systems to cite exactly which sources, across how many documents, were combined to produce an answer.
**Evidence:** Rajpurkar et al. 2018 (SQuAD 2.0); Yang et al. 2018, EMNLP (HotpotQA), aclanthology.org/D18-1259, arxiv.org/abs/1809.09600.
**Sources:** See Cluster A section C for full citation detail.
**Pattern:** A defensible "AI Answerability" testing protocol must (a) explicitly support and encourage "cannot be determined from the provided content" as a valid, measured outcome rather than only measuring successful extraction, and (b) operationalize "does this require combining multiple pages" via an explicit page-citation-count directly borrowed from HotpotQA's supporting-facts methodology, rather than an arbitrary threshold.
**Counterexamples:** N/A — this is foundational methodology design, not a claim requiring counterexample-testing itself.
**Hypothesis:** N/A — direct application of established, peer-reviewed benchmark methodology to a new domain (website auditing).
**Signal:** Three-way QA outcome (answered/partial/unanswerable) plus page-citation-count, per question, from closed-book LLM evaluation against crawled site content only.
**How to Detect:** LLM-based closed-book question-answering, explicitly prompted to cite sources and to abstain when content is insufficient — the core, necessary use of LLM reasoning for this entire topic, consistent with the brief's hybrid-approach guidance.
**Evidence Output:** Per-question outcome, answer text, cited page(s), and citation count.
**False Positives:** An LLM prone to confident hallucination could overstate answerability by filling gaps with plausible but ungrounded content — the single most important risk to actively test against, directly following from SQuAD 2.0's own core finding.
**False Negatives:** An overly conservative LLM could under-credit legitimate indirect/inferential answers (e.g., customer logos implying target-customer segment).
**Severity:** N/A directly — this is the measurement mechanism; severity is established per-category in Cluster B.
**Recommended Fix:** N/A directly — methodology finding.
**Generalization:** The methodology is fully site-type- and question-agnostic; extremely high generalization.
**Candidate Skill:** `ai-answerability-audit` — the anchor skill for the entire topic.
**Related Skills:** Consumes extraction infrastructure from A16, F1-F3, D's clusters, E's structured-format work.
**Confidence:** HIGH — grounded directly in two foundational, highly-cited, peer-reviewed NLP benchmarks, applied via a clearly-reasoned, disclosed translation to a new domain.

---
**FINDING ID:** K-02
**Researcher:** Pulkit
**Research Area:** K — AI Answerability
**Research Question:** K9/K10/K21/K22 — Should "can the site name its own limitations/competitors" and "can it answer 'best for X'/'alternative to X'" be scored the same way as other answerability categories?
**Observation:** K9 (limitations) and K10 (competitors) are structurally, near-universally unanswerable from a company's own self-published site by the basic economics of self-presentation — companies do not typically volunteer their own weaknesses or name competitors. K21/K22 inherit this same structural issue, since "is X the best" and "alternatives to X" are inherently third-party-appropriate questions a first-party site cannot honestly, completely self-answer.
**Evidence:** Direct synthesis of Topic A's A13 (differentiator-naming reluctance, already established) applied systematically to this topic's question taxonomy; no new external citation required beyond this project's own prior, already-evidenced finding.
**Sources:** Internal synthesis, building on A13.
**Pattern:** A flat, equally-weighted Answerability Score would systematically, unfairly penalize nearly every site similarly on these four categories, producing no differentiating signal and no genuinely actionable remediation — and could perversely incentivize the exact vague, self-serving superlative language Topic B's F1 already identified as a citation-worthiness problem.
**Counterexamples:** Companies that do maintain genuine, factual, neutrally-framed comparison content (spec-comparison tables, honest limitations sections) exist and should be credited when found — the structural-gap framing is a strong prior, not an absolute rule.
**Hypothesis:** N/A — direct, disclosed scoring-design reasoning built on already-established prior findings.
**Signal:** Same underlying QA mechanism (Cluster A), but K21/K22 specifically require a redesigned prompt testing for "raw materials" (category/differentiator clarity) rather than direct self-answering.
**How to Detect:** Modified LLM-QA-protocol prompt design for K21/K22; standard protocol for K9/K10 with separated reporting.
**Evidence Output:** Explicitly, visibly separated reporting for these four categories, distinct from the core weighted score.
**False Positives:** Treating a structurally-expected gap as an equally-weighted defect alongside genuinely fixable gaps (e.g., K6 pricing).
**False Negatives:** Failing to credit genuine, existing comparison/limitations content when a company has, atypically, provided it.
**Severity:** Excluded from core weighted severity scoring; reported as a separate, distinctly-labeled category.
**Recommended Fix:** For K9/K10, no forced remediation recommendation (inappropriate to push self-critical content); for K21/K22, remediation targets the underlying raw materials (K3/K7/K15), not direct superlative self-claims.
**Generalization:** The structural pattern is broadly universal across commercial site types; exceptions (genuine comparison pages) are real but comparatively rare.
**Candidate Skill:** Scoring-design input for `ai-answerability-audit` and the report-synthesis layer (Soham's territory).
**Related Skills:** A13 (Topic A), F1 (Topic B) — the superlative-language tension is a genuine, worth-flagging cross-topic interaction.
**Confidence:** HIGH — this is a direct, low-inference-risk application of an already well-evidenced prior finding (A13) to a new but structurally identical situation.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
Topic K's answerability testing cannot be built as a naive "ask an LLM if the site answers X" implementation — it must be built with SQuAD 2.0's core, peer-reviewed insight (abstention is a distinct, measurable skill, and QA systems systematically overstate answerability without explicit testing for it) as a first-class design constraint. This is the single most load-bearing methodological finding in this document: get this wrong, and the entire "AI Answerability Score" becomes an unreliable, overstated metric regardless of how well-designed the underlying question taxonomy is.

**Strongest unvalidated hypothesis:**
That the Answer Concentration sub-score (K25's page-citation-count metric, directly borrowed from HotpotQA's supporting-facts methodology) meaningfully predicts real-world AI citation behavior — i.e., that sites requiring fewer pages to answer common questions are genuinely more likely to be correctly, completely represented in real AI assistant answers. This is a well-grounded, mechanism-consistent hypothesis (directly connecting to Topic A's entire retrieval/chunking research program) but has not been empirically validated against real AI assistant behavior in this research pass — a strong candidate for Topic R's experiment-design phase, potentially using the same live-query infrastructure already flagged for validation work in Topics B, C, and I.

**Strongest candidate skill:**
**`ai-answerability-audit`** — a genuinely novel, well-grounded, high-value skill that is architecturally distinct from (though consuming input from) every extraction-focused skill built in prior topics. This is arguably the single most differentiated, hard-to-replicate skill to emerge from this entire research project, since it requires the specific combination of (a) a carefully-designed, stakes-weighted question taxonomy (this document's Cluster B/C contribution) and (b) a methodologically rigorous, abstention-aware LLM-QA protocol (grounded in SQuAD 2.0/HotpotQA) — most competing teams are likely to either skip this kind of testing entirely (defaulting to extraction-quality checks alone) or implement a naive version vulnerable to the exact overstatement failure mode this document specifically identifies and guards against.

**Weakest assumption we should investigate next:**
The proposed scoring formula (Cluster D) is entirely our own original synthesis — I found no existing "AI Answerability Score" precedent in the academic or commercial literature to validate the specific weighting/structure against. While each individual design principle is well-grounded in this document's own established findings, the *combination* into a specific formula is untested. Before finalizing specific category weights or the exact Core Answerability Rate calculation, this should be pressure-tested against a small set of real websites with manually-verified "ground truth" answerability (a human carefully checking whether each site actually answers each question) to confirm the LLM-based protocol's outcomes align with careful human judgment — directly analogous to how SQuAD 2.0 and HotpotQA themselves were validated against human-annotated ground truth during their own construction.

---

## 4. Cross-references for the Combine & Code phase

- **Cluster A's abstention-testing requirement ↔ every extraction-focused skill in Topics A/D/E:** `ai-answerability-audit` is architecturally downstream of nearly the entire prior research project — its input pipeline should directly reuse existing extraction infrastructure rather than re-implementing content extraction independently.
- **K9/K10/K21/K22's structural-gap handling ↔ Topic B's F1 (superlative-language finding):** A genuine, non-obvious tension worth flagging explicitly to whoever finalizes remediation-recommendation logic — pushing too hard on these categories risks encouraging exactly the vague, unhedged language F1 already identified as counterproductive.
- **K24's freshness integration ↔ Topic I (`freshness-signal-credibility`, mine):** Should be implemented as directly shared/composed infrastructure, not duplicated — the clearest, most direct integration point between any two topics in this project so far.
- **Cluster D's scoring design ↔ Topic S/AB (Soham, Scoring & Report Design):** The single most explicit, ready-to-hand-off design deliverable in this entire research project for Soham's territory — strongly recommend direct discussion before that work is finalized, given the "don't blend structurally-different categories into one number" principle's broader applicability beyond just this topic.
- **Cluster B's extensive cross-referencing (A13, A18, B10, multiple Topic D/E/I sub-findings) ↔ overall marketplace synthesis:** Topic K functions as a genuine capstone/integration point for this entire research project — recommend it be one of the last skills finalized in the Combine phase specifically because its question taxonomy and scoring design benefit from, and depend on, nearly everything else being settled first.
- **K-02's untested scoring-formula weakness ↔ Topic R (Experiment Design, mine):** A strong, concrete candidate for a validation experiment — human-annotated ground-truth answerability testing against a small site sample, directly modeled on how SQuAD 2.0/HotpotQA themselves validated their own annotation methodology.
