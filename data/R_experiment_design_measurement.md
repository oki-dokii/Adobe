# Topic R — Experiment Design & Measurement (R1–R33)
**Researcher:** Pulkit | **Research Area:** R — Experiment Design & Measurement
**Priority:** Critical (this is the measurement layer that makes Topic Q's field research, and every prior topic's "unvalidated hypothesis," actually testable)

---

## 0. Framing — Topic R's precise relationship to Topic Q, and why this document is deliberately narrow and precise rather than broad

Topic Q established **what to study** (five datasets, thirteen pairwise comparisons, cross-cutting validation, signal-interaction discovery) and the high-level methodological posture (matched case-control design, pre-registered criteria, guarding against confounding). Topic R is the layer underneath that: **the actual operational definitions, metrics, and measurement-quality safeguards** that make Q's comparisons meaningful rather than impressionistic. Where Q asked "what should we compare," R asks "how do we measure each side of that comparison precisely enough that the comparison means something, and how do we know our measurement itself isn't the thing lying to us."

This is a natural, necessary division of labor, and I want to be explicit about the boundary so the two documents don't duplicate each other: **Topic Q owns the *what* and *why* (which comparisons, which confounders); Topic R owns the *how precisely* (operational definitions of outcome categories, the metrics computed from them, and the noise/reliability model that tells us how much to trust any given result).** Every metric and definition in this document is designed to be dropped directly into Topic Q's Cluster A/B/D data-collection protocols as the actual measurement instrument.

**The organizing insight for this entire document, stated up front:** R2-R5 (definitions) must come before R6-R14 (rates/precision/recall), which must come before R15 (inter-rater reliability), which must come before R16-R28 (query sampling), which must come before R29-R33 (noise/variance) — this is not an arbitrary ordering, it's a genuine dependency chain. A rate is meaningless without a precise definition of its numerator category; a precision/recall figure is meaningless without knowing how reliably human/LLM raters agree on what counts as a true positive; a query-sampling frame is meaningless without knowing how much any single measurement varies run-to-run. I've organized the clusters below to respect this dependency chain.

---

## 1. Legend
Same as all prior topics: **FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**.

---

## Cluster A — Operational definitions
**Covers:** R2 (define "cited"), R3 (define "mentioned"), R4 (define "misrepresented"), R5 (define "ignored"), and R1 (how do we measure AI visibility, addressed as the synthesis of the other four)

### A. What we need to understand
Before any rate can be computed (R6-R14), each outcome category needs a precise, disclosed, operational definition — not a fuzzy intuition. This is the single most foundational, and most commonly skipped, step in building any measurement system, and it directly determines whether every downstream number in this document means anything.

### B. Why it matters
Every prior topic in this project has used words like "cited," "mentioned," "misrepresented," and "ignored" fairly loosely, trusting that their meaning was intuitively clear from context. That's fine for a literature-review-style research document. It is **not** fine for a measurement system that Topic Q's comparisons depend on — an ambiguous definition here would silently corrupt every comparison built on top of it.

### C. Current evidence and proposed definitions

**A genuinely important, foundational point before the definitions themselves — the "unit of analysis" problem:**
- **INFERENCE (synthesizing across Topic A's entire retrieval/citation research program, especially A19's three-gate model):** Before defining "cited" or "mentioned," we must fix **what response, to what query, on what date, is being examined** — Topic A's A19 already established that retrieval, ranking, and citation-selection are three separable gates, and Topic I's research established that AI behavior changes over time and that a single observation is a snapshot, not a stable property of a site. This means every one of R2-R5's definitions must be understood as **defined relative to a specific (query, assistant, date/run) tuple**, not as a timeless, context-free property of a website. A site is not simply "cited" or "not cited" in the abstract — it is cited-for-query-X-on-assistant-Y-at-time-Z. This sounds pedantic, but it is the single most important discipline this cluster can enforce, and it directly anticipates and motivates R29-R33 (variance/repeatability).

**R2 — Defining "cited":**
- **Proposed operational definition (our own synthesis, built directly on Topic A's documented pipeline research and standard IR practice):** A source is **cited** for a given (query, assistant, run) if the assistant's response contains an explicit, mechanically-detectable attribution to that source — a hyperlink, a numbered/named citation marker, or an explicitly named source in the "sources" list a system surfaces (per Topic A's A1-A4 research, all four assistants researched document some form of explicit source attribution in their search-grounded responses). This is a **narrow, strict, mechanically-verifiable** definition, deliberately chosen because it can be checked deterministically (does an actual citation marker/link exist pointing to this domain) rather than requiring subjective judgment — directly serving R15's inter-rater-reliability concerns downstream, since a strict, mechanical definition minimizes rater disagreement at the source.

**R3 — Defining "mentioned":**
- **Proposed operational definition, deliberately distinguished from R2 per the precise wording distinction the topic itself draws:** A source/entity is **mentioned** if the assistant's response text refers to the entity (by name, or by an unambiguous alias/description) **without** a formal citation marker or link — e.g., the response says "Acme Corp offers X" in the course of a comparison, without a clickable source attribution to acmecorp.com specifically. This is a **broader, softer** category than "cited," and — this is the important, non-obvious point — **it requires natural-language entity recognition, not mechanical marker-detection**, meaning R3's measurement is inherently less mechanically verifiable than R2's, with direct consequences for R15 (inter-rater reliability will be lower for "mentioned" than for "cited," and this should be expected and reported, not treated as a measurement failure).

**R4 — Defining "misrepresented":**
- **FACT (directly and precisely reusing Topic B's F2 finding, the strongest possible grounding available for this specific definition):** Topic B's F2 already established the formal, peer-reviewed vocabulary for exactly this concept — the **groundedness / faithfulness / factuality** distinction from RAG-evaluation literature (RAGAS, ARES, and the ALCE-derived "full / partial / no citation support" three-way taxonomy from arXiv 2408.12398). **Proposed operational definition, directly adopting this established framework rather than inventing a new one:** A response is **misrepresented** relative to a source if the response is *cited* (R2) or *mentions* (R3) that source for a specific claim, but the claim is **not fully supported** by that source's actual content — using the established three-way outcome (full / partial / no support) rather than a binary right/wrong, directly consistent with how Topic B's F2 and Topic K's Cluster A (the SQuAD-2.0-derived three-way QA outcome) both already established that binary framings lose important information in exactly this kind of evaluation.

**R5 — Defining "ignored":**
- **Proposed operational definition, requiring the most care of the four, directly building on Topic Q's Cluster A's own warning about this exact category:** A source is **ignored** for a given (query, assistant, run) only if it is (a) not cited (R2), (b) not mentioned (R3), **and** (c) independently judged topically relevant/appropriate to the query by a criterion fixed *before* the query is run (directly enforcing Topic Q's pre-registration principle). Without condition (c), "ignored" becomes vacuous — nearly every website in existence is "ignored" for nearly every query, which tells us nothing. This is the single most important definitional correction in this entire cluster, and directly resolves a real ambiguity in the topic's own naming (an unqualified "ignored-site dataset" could otherwise become meaninglessly large).

**R1 (how do we measure AI visibility) — the synthesis:**
- **INFERENCE:** "AI visibility" is not a single number — it is the **combination of R2-R5's four outcome rates, computed relative to a defined, relevant query set** (Cluster C below), reported as a small vector (citation rate, mention rate, misrepresentation rate, ignored-when-relevant rate) rather than one blended score — directly consistent with this entire project's now-repeated finding (Topics D, E, K) that blending distinct mechanisms into one number destroys diagnostic value. This gives R1 a precise, non-circular answer: visibility is *measured*, not defined, by the apparatus built in the rest of this document.

### D. Important mechanisms
The unifying principle for this cluster: **the four definitions form a hierarchy of decreasing mechanical verifiability and increasing subjectivity** (cited > mentioned > misrepresented > ignored, in order of how much judgment each requires), and this hierarchy directly predicts, and should be explicitly cross-referenced against, R15's inter-rater-reliability results — we should *expect* higher agreement on "was this cited" than on "was this misrepresented," and a measurement protocol that doesn't anticipate this will misinterpret low agreement on the harder categories as a methodology failure rather than an expected, inherent property of the task.

### E. Concrete methodology
Each definition above should be operationalized as an explicit, written coding protocol (a decision tree or checklist) handed to whoever/whatever (human rater or LLM-based rater) performs the classification, fixed before data collection, directly serving Topic Q's pre-registration principle.

### F. How this could be executed within constraints
All four definitions are designed to be computable via a combination of deterministic text/link parsing (for R2, mostly) and LLM-assisted classification (for R3/R4, and R5's relevance-judgment component) — consistent with this entire project's hybrid deterministic-plus-LLM design philosophy wherever semantic judgment is genuinely required.

### G. What evidence this produces
A structured, per-(query, assistant, run) classification record for every tested source, feeding directly into Cluster B's rate computations.

### H-L.
Not applicable in the standard sense — this cluster establishes definitions, not a detectable website defect with its own severity/remediation profile.

### M. Generalizes?
Yes, completely — these definitions are query/assistant/site-type-agnostic by design.

### N. Candidate skill(s)
Not a skill — measurement-protocol design informing Topic Q's data-collection instruments and, if built, the `live-citation-probe` skill referenced across Topics A/B/I/K.

### O. Relationship to other skills
Foundational to Topic Q's entire Cluster A/B; directly reuses Topic B's F2 taxonomy (R4) and Topic A's A19 three-gate model (the unit-of-analysis point).

---

## Cluster B — Rate metrics
**Covers:** R6 (citation rate), R7 (mention rate), R8 (source-selection rate), R9 (answer-support rate), R10 (claim-support rate)

### A. What we need to understand
Given Cluster A's definitions, what are the precise formulas for the rate metrics the topic names, and how do they relate to each other — are these five independent numbers, or do some subsume others?

### B. Why it matters
Getting the formulas exactly right, with explicit numerators and denominators, is what separates a rigorous metric from a vague "X% of the time" impression — and, consistent with this project's repeated finding pattern, some of these five may turn out to be the same underlying computation applied to different denominators rather than five independent metrics.

### C. Current evidence and formal definitions

- **R6 Citation rate** = (number of (query, run) pairs where the source was cited, per R2's definition) / (total number of (query, run) pairs where the source was topically relevant, per R5's relevance criterion). This directly reuses R5's pre-registered relevance criterion as the denominator — without it, citation rate is uninterpretable (a site's citation rate would mechanically depend on how many irrelevant queries were included in the test set, which tells us nothing about the site itself).
- **R7 Mention rate** = same structure as R6, substituting R3's "mentioned" definition for the numerator. **INFERENCE:** citation rate and mention rate are not substitutes for each other — a site could have high mention rate but low citation rate (frequently discussed but rarely formally sourced) or the reverse pattern would be unusual but not impossible (formally cited without much discussion) — both numbers should be reported together, and the *gap* between them is itself informative (a large mention-minus-citation gap could indicate the site is topically relevant and known but failing at whatever specific mechanism drives formal citation-marker inclusion, directly connecting to Topic A's A17 citation-competitiveness research).
- **R8 Source-selection rate — INFERENCE, requiring a definitional decision not fully specified by the topic's phrasing:** I interpret this as measuring a **different, upstream** question from R6/R7: given that a source was *retrieved as a candidate* (as opposed to *appearing in the final response* at all), how often is it *selected* into the response (cited or mentioned) versus discarded during generation. This directly operationalizes the retrieval-vs-generation distinction established in Topic A's A11, and Topic A's A19 three-gate model specifically — **critically, this metric requires knowing the retrieval candidate set, which is not directly observable from outside the AI system** (none of the four vendors researched in Topic A publish their actual retrieved-candidate list). This is a genuine, honestly-disclosed measurement limitation: R8 as literally defined may not be directly measurable via external field research at all, only approximated by comparing citation rate (R6) against an *independently constructed* candidate set (e.g., "here are the top 10 organic search results for this query" as a proxy for what was plausibly retrieved) — a proxy, not a direct measurement, and should be labeled as such.
- **R9 Answer-support rate** and **R10 Claim-support rate** — **INFERENCE, and this is the cluster's most important finding:** these two are **not independent metrics**, but two different levels of granularity applied to the exact same underlying question already fully formalized in Cluster A's R4 definition (misrepresentation, via the groundedness/faithfulness taxonomy). **Answer-support rate** = the fraction of *entire responses* citing the source that are fully supported (no partial/no-support claims anywhere in the response); **Claim-support rate** = the fraction of *individual claims* within cited responses that are fully supported — the same full/partial/no-support classification, aggregated at two different units of analysis (whole-response vs. individual-claim). A response can have a high claim-support rate but a lower answer-support rate if it contains many small claims, each mostly correct, but with even one significant unsupported claim being enough to mark the whole answer as not-fully-supported — this is a real, meaningful distinction (arguably claim-support rate is more diagnostically useful for pinpointing *which* specific claims fail, while answer-support rate better reflects end-user-experienced trustworthiness), and both should be reported, but they should be understood as two aggregation levels of one measurement, not two separate metrics requiring separate methodology.

### D. Important mechanisms
The unifying, load-bearing finding for this cluster, consistent with this project's now-repeated pattern: **five named metrics reduce to three genuinely distinct measurement operations** (R6/R7 share one structure differing only in numerator category; R9/R10 share one structure differing only in aggregation granularity; R8 is a genuinely distinct, but only proxy-measurable, upstream metric). This is a useful simplification for implementation, not a claim that the topic's own naming was wrong — R6/R7/R9/R10 are all legitimately worth reporting separately as *numbers*, they just don't require four separate *measurement protocols*.

### E. Concrete methodology
All five metrics are computed from the same underlying per-(query, assistant, run, source) classification records established in Cluster A — R6-R10 are aggregation formulas over that shared dataset, not separate data-collection efforts.

### F. How this could be executed within constraints
R6, R7, R9, R10 are directly computable from Cluster A's data. R8 requires the explicitly-flagged proxy-construction step (an independently-gathered candidate-source list) and should be reported with correspondingly lower confidence, consistent with this project's practice of not overstating measurement precision beyond what's actually achievable.

### G. What evidence this produces
A small, clearly-labeled table of rates per source/site, each with its denominator explicitly stated (critical, since an unstated denominator is the single most common way rate metrics get misinterpreted or gamed).

### H-L.
Not applicable in the standard defect-severity sense.

### M. Generalizes?
Yes, completely.

### N. Candidate skill(s)
Not a skill — aggregation logic for whichever system computes and reports on Topic Q's field-research data.

### O. Relationship to other skills
Directly builds on Cluster A; R9/R10 directly reuse Topic B's F2/ALCE three-way support taxonomy.

---

## Cluster C — Detection quality and reliability metrics
**Covers:** R11 (citation precision), R12 (citation recall), R13 (false positives), R14 (false negatives), R15 (inter-rater agreement)

### A. What we need to understand
Cluster B measured *the website's* citation behavior. Cluster C measures something different and easily conflated with it: **how good is our own measurement apparatus** at correctly detecting citations/mentions/misrepresentation in the first place. This is a genuinely important, easily-overlooked distinction — a low "citation rate" could reflect either a real website problem or a flawed detection methodology, and without Cluster C, these are indistinguishable.

### B. Why it matters
This cluster is where Topic R most directly serves Topic Q's own Q22/Q23 (false positive/negative logging) — but applied one level up, to the *measurement instrument itself* rather than to the *website hypotheses* Q22/Q23 addresses. Getting this distinction right prevents a subtle but serious methodological confusion.

### C. Current evidence

- **FACT (well-established IR/classification-evaluation formalism, directly transferable):** Precision and recall, in the standard IR sense (already used with full formal precision in the sources found — "Precision indicates the percentage of correct predictions among total positive predictions, whereas recall indicates the percentage of correct predictions among total positive cases"), apply directly to R11/R12: **Citation precision** = (detections our methodology correctly identified as citations) / (all things our methodology flagged as citations) — i.e., when our detection protocol says "this response cites site X," how often is that actually true (not a false alarm, e.g., not mistaking a mention for a formal citation). **Citation recall** = (detections our methodology correctly identified as citations) / (all citations that actually, truly occurred) — i.e., of all the genuine citations that occurred, how many did our protocol actually catch (not missing genuine citation markers due to a parsing gap, an unusual link format, etc.).
- **INFERENCE (directly following from the precision/recall formalism):** R13 (false positives) and R14 (false negatives) are not separate metrics from R11/R12 — they are the **raw counts underlying the precision/recall ratios** (precision's denominator includes false positives; recall's denominator includes false negatives) — the topic's own separate naming of these as distinct sub-topics is best served by explicitly reporting both the raw counts (R13/R14, useful for understanding *what kind* of errors occur and debugging the detection methodology) and the derived ratios (R11/R12, useful for comparing overall detection quality across different methodology versions or across different source types).
- **FACT (peer-reviewed, foundational, directly and precisely relevant to R15 — the single strongest, most formally rigorous grounding in this entire cluster):** Cohen's Kappa (κ = (P₀ − Pₑ)/(1 − Pₑ), where P₀ is observed agreement and Pₑ is chance-expected agreement) is the standard, well-established statistic for inter-rater reliability specifically because it **corrects for chance agreement** — two raters could agree simply because one outcome category is common, and raw percent-agreement doesn't distinguish genuine agreement from this artifact. Fleiss' Kappa extends this to more than two raters. The Landis and Koch (1977) interpretation bands are the standard, widely-cited reference for interpreting a computed kappa value: ≤0 poor, 0.0-0.20 slight, 0.20-0.40 fair, 0.40-0.60 moderate, 0.60-0.80 substantial, 0.80-1.00 almost perfect — this gives R15 a precise, checkable, non-arbitrary standard rather than a vague "do the raters mostly agree" impression.
- **FACT (a genuinely important, non-obvious methodological caveat, directly and specifically relevant to our exact measurement situation, not just a generic caveat):** A peer-reviewed methods paper (PubMed 15684123, "Agreement, the F-measure, and reliability in information retrieval") establishes that **traditional kappa statistics break down specifically in exactly the situation we're in**: "studies that involve searching the Internet... usually lack a well-defined number of negative cases," which "prevents the use of traditional interrater reliability metrics like the kappa statistic." This is a direct, precise match to our own R5 "ignored" category's core definitional challenge (already flagged in Cluster A as requiring careful bounding) — if "not cited" is an effectively unbounded category (nearly every website is "not cited" for nearly every query), kappa's chance-agreement correction becomes unstable or uninformative. The same paper's proposed fix — **positive specific agreement, mathematically equivalent to the average F-measure among rater pairs** — is the recommended alternative specifically for this class of problem, and should be adopted for R15's "ignored"/"not cited" judgments specifically, while standard Cohen's/Fleiss' Kappa remains appropriate for the better-bounded categories (R2's strict "cited" definition, which has a clear, small set of possible values per response).
- **FACT (Manning, Raghavan, and Schütze's classic, foundational IR textbook, directly and honestly relevant):** "A human is not a device that reliably reports a gold standard judgment of relevance... humans and their relevance judgments are quite idiosyncratic and variable... human assessors are also imperfect measuring instruments, susceptible to failures of understanding and attention." This is a valuable, humbling, foundational-textbook-level reminder directly relevant to whether our raters are human or (as is more likely feasible given this project's resources and the LLM-centric methodology already established in Topic K) LLM-based: **an LLM-based rater is subject to the same fundamental idiosyncrasy/reliability concerns a human rater is**, and R15's inter-rater-agreement testing should explicitly include LLM-vs-LLM (repeated runs) and, where feasible, LLM-vs-human agreement testing, not assume an LLM rater is a reliable "gold standard" simply because it's automated.

### D. Important mechanisms
The single most valuable, non-obvious synthesis in this cluster: **our own "ignored" category (R5) is precisely the category where standard reliability statistics (Kappa) are known, in the peer-reviewed methods literature, to be least trustworthy** — and this is not a hypothetical concern, it's a direct, precise match between an established methodological warning and our own specific measurement design. This means Topic Q's uncited-site dataset (Q2) and Topic R's R5 definition are jointly the highest-measurement-risk component of this entire research program, deserving the most careful reliability-testing attention (via the positive-specific-agreement/F-measure alternative), not the least.

### E. Concrete methodology
Compute R11/R12 (precision/recall) by validating a sample of our own detection protocol's outputs against careful manual review; compute R15 via Cohen's/Fleiss' Kappa for well-bounded categories (R2's strict citation definition) and via positive specific agreement/F-measure for the "ignored"/unbounded categories, following the peer-reviewed methodological recommendation directly.

### F. How this could be executed within constraints
This requires a modest but real manual-validation sample (a subset of automated classifications double-checked by a second rater, human or independent LLM run) — feasible at small scale within a hackathon timeline, consistent with the small-sample-friendly design philosophy already established for Topic Q's Synergy Factor methodology.

### G. What evidence this produces
Precision/recall figures for our own detection methodology (not the website's citation behavior — a crucial distinction to keep visually and conceptually separate in any report), plus a computed reliability statistic (Kappa or F-measure/positive-specific-agreement, chosen per-category following the distinction established above) with the Landis-Koch interpretation band explicitly stated.

### H. Possible severity logic
Not a website-defect severity — this is measurement-quality severity: a low precision/recall or low inter-rater agreement should reduce our **confidence** in any downstream Cluster B rate or Topic Q comparison built on this data, directly feeding the confidence-tiering language (FACT/OBSERVATION/HYPOTHESIS) this entire project has used consistently.

### I. Correct remediation
If precision/recall or kappa is low: refine the detection protocol's operational definitions (Cluster A) or coding instructions before trusting downstream comparisons — a methodology-improvement loop, not a website fix.

### J. False-positive cases
A low kappa on the "ignored" category specifically should **not** be interpreted as a failed methodology if positive specific agreement/F-measure (the recommended alternative for unbounded-negative-case situations) shows acceptable reliability — this is the single most important false-positive risk in this cluster, directly following from the peer-reviewed literature's own warning.

### K. False-negative risks
A precision/recall validation performed on too small a manual-review sample could give an overly optimistic (or pessimistic) impression of overall detection quality — sample size for this validation step should be disclosed explicitly, consistent with this project's consistent practice around small-sample honesty.

### L. Counterexamples
None in the traditional sense — this cluster establishes measurement-quality-assessment methodology.

### M. Generalizes?
Yes, completely — standard IR/classification evaluation formalism, domain-agnostic.

### N. Candidate skill(s)
Not a skill — measurement-quality-assurance methodology for Topic Q's data-collection instruments.

### O. Relationship to other skills
Directly serves and refines Topic Q's Q22/Q23 (now clearly distinguished: Q22/Q23 log false positives/negatives in *website hypotheses*; this cluster logs false positives/negatives in *our own detection methodology* — a genuinely important, previously-implicit distinction now made explicit).

---

## Cluster D — Query-set construction and sampling
**Covers:** R16 (query-set construction), R17 (representative sampling), R18 (head queries), R19 (long-tail queries), R20 (brand queries), R21 (non-brand queries), R22 (competitor queries), R23 (comparison queries), R24 (recommendation queries), R25 (local queries), R26 (freshness-sensitive queries), R27 (adversarial queries), R28 (ambiguous queries)

### A. What we need to understand
Given Clusters A-C's measurement apparatus, what specific set of queries should actually be run to generate the data — and, consistent with this project's established pattern, whether these thirteen named query types require thirteen independent sampling strategies or reduce to a smaller number of genuinely distinct dimensions.

### B. Why it matters
A measurement apparatus is only as good as the query set fed into it — a biased or narrow query sample would undermine everything built in Clusters A-C regardless of how rigorous those definitions and metrics are.

### C. Current evidence

- **FACT (well-established web-search/IR concept, consistently described across multiple independent sources, not requiring peer-review citation for the basic distributional shape but genuinely useful to state precisely):** Web query distributions follow a **head/long-tail shape** — a small number of very frequent ("head") queries and a very large number of individually-rare but collectively-dominant ("tail") queries. One source's precise, useful framing directly relevant to R18/R19's stakes-differentiation: **"Head vs. tail isn't just a distribution — it's an expression of user certainty. Head queries express exploration. Tail queries... express decision."** This gives R18/R19 real, actionable content beyond "test both kinds": head queries are where broad, exploratory brand-awareness citation matters; tail queries are where specific, decision-stage, often-transactional citation matters — directly connecting to and reinforcing Topic A's A13 intent taxonomy (exploration ≈ informational intent; decision ≈ transactional/commercial-investigation intent), rather than being an independent new dimension.
- **INFERENCE (the central, load-bearing synthesis for this entire cluster):** R20-R27 (brand, non-brand, competitor, comparison, recommendation, local, freshness-sensitive, adversarial) are not eight independent sampling dimensions requiring eight independent strategies — they are **eight specific instantiations of the query-intent taxonomy Topic A's A13 already established**, now given a query-*construction* rather than query-*classification* framing:
  - **R20 Brand queries** ("[Company] pricing," "[Company] reviews") test navigational + informational intent about a known entity — directly connects to Topic B's B10 (entity recognition tier) since brand-query behavior should differ sharply between well-known and niche brands per that finding.
  - **R21 Non-brand queries** ("best CRM software," "project management tools") test the informational/commercial-investigation intent where source-substitution (Topic A's A18) is most likely, since there's no obvious "correct" official site to default to.
  - **R22 Competitor queries** ("[Company] alternatives," "companies like [Company]") directly operationalize Topic A's A18 and Topic K's K10/K22 findings (the structural near-impossibility of a site self-answering this, requiring third-party synthesis).
  - **R23 Comparison queries** ("[Company] vs [Competitor]") directly operationalize Topic A's A13/A20 and Topic K's K20.
  - **R24 Recommendation queries** ("best X for Y use case") directly operationalize Topic A's A13's "best X" category and Topic K's K21.
  - **R25 Local queries** ("[service] near [location]," "[Company] [city] office") directly operationalize Topic A's A13's local-intent category and Topic K's K23/K5.
  - **R26 Freshness-sensitive queries** ("current [Company] pricing," "[Company] news 2026") directly operationalize Topic I's entire Cluster IV (I24 specifically) and Topic K's K24.
  - **R27 Adversarial queries** — the one genuinely new dimension in this list, addressed separately below.
- **R27 (adversarial queries) — INFERENCE, a genuinely distinct and valuable addition, directly connecting to and validating several prior topics' honesty-focused findings:** "Adversarial" in this context should mean queries specifically designed to **stress-test the failure modes this project has already hypothesized** — e.g., a query phrased to specifically invoke the negation/hedging ambiguity risk established in Topic E's Cluster C (deliberately asking about a conditional/negated fact), or a query specifically designed to test whether an old, widely-syndicated press release (Topic I's I-01/I17 hypothesis) gets preferentially surfaced over current information. This is not "trying to break the AI system" in a security-adversarial sense — it's **hypothesis-targeted query construction**, deliberately designed to create the exact conditions under which a specific, already-articulated hypothesis predicts failure, which is a genuinely more rigorous, higher-value approach than random query sampling for testing this project's specific accumulated hypotheses.
- **R28 (ambiguous queries) — INFERENCE, directly connects to Topic B's B3/B10 (AmbER, name-collision) rather than being an independent new concern:** Queries deliberately using a brand name known (or verified via the search-based check already established in Topic B's B3) to collide with a more prominent, differently-named entity — directly testing the AmbER-derived popularity-bias hypothesis empirically, exactly the kind of validation Topic B's own end-of-topic synthesis flagged as needed.

### D. Important mechanisms
The unifying finding for this cluster, now the sixth time this exact pattern has appeared across this research project: **R18-R28's eleven named query types collapse into (a) the head/tail dimension (R18/R19, a genuine, distinct axis) crossed with (b) Topic A's A13 intent taxonomy (which R20-R26 are specific instantiations of) plus (c) two genuinely new, hypothesis-targeted dimensions (R27 adversarial, R28 ambiguous-entity) that specifically exist to stress-test this project's own accumulated hypotheses rather than to sample "typical" query behavior.** A well-constructed query set (R16/R17) should be a **deliberately stratified sample** across the head/tail × intent-type grid, supplemented with a smaller, explicitly-labeled set of hypothesis-targeted adversarial/ambiguous queries — not a large, undifferentiated pile of "queries about the company."

### E. Concrete methodology
Construct the query set as an explicit grid: for each site under study, generate queries crossing {head, tail} × {the A13 intent categories, instantiated as R20-R26} for representativeness, plus a smaller, explicitly-separate set of R27/R28-style queries specifically targeting whichever prior-topic hypothesis is being tested (directly serving Topic Q's Cluster D signal-interaction work, since different hypotheses need different targeted queries to test).

### F. How this could be executed within constraints
This grid-based construction is directly, explicitly scoped to be tractable within realistic time limits — R17's "representative sampling" doesn't require exhaustive coverage of every cell, just deliberate, disclosed coverage of enough cells to avoid the systematic gaps a purely ad hoc query list would risk (directly serving Topic Q's Cluster A anti-bias design principle).

### G. What evidence this produces
A disclosed, reusable query-construction template (the grid above) that can be applied consistently across every site studied in Topic Q's dataset-building work, directly enabling the cross-site comparability Topic Q's Cluster B comparisons require.

### H-L.
Not applicable in the standard defect sense — this cluster establishes sampling methodology.

### M. Generalizes?
Yes, well — the grid structure is site-type-agnostic, though the specific query wordings within each cell should be adapted per site type/industry (a now-familiar pattern across this project).

### N. Candidate skill(s)
Not a skill — query-construction methodology for Topic Q's field research and any live-query capability (`live-citation-probe`) built across this project.

### O. Relationship to other skills
Directly, extensively reuses Topic A's A13 intent taxonomy (now validated as useful at three different levels across this project: retrieval mechanics, answerability testing in Topic K, and query construction here) and Topic B's B3/B10 for R28.

---

## Cluster E — Noise, variance, and repeatability
**Covers:** R29 (repeatability), R30 (variance across models), R31 (variance across runs), R32 (temporal variance), R33 (measurement noise)

### A. What we need to understand
Given everything measured in Clusters A-D, how much does any single measurement actually vary if repeated — and what does this imply about how much confidence any single Topic Q comparison or finding deserves.

### B. Why it matters
This cluster is the final, essential honesty check on this entire measurement program — directly closing the loop with Topic Q's Cluster C (Q19-Q21, cross-cutting validation), now given the precise statistical vocabulary to make "repeatability" a measured quantity rather than a vague aspiration.

### C. Current evidence
- **INFERENCE (directly synthesizing this entire project's repeated observations about AI system evolution and non-determinism, now given formal variance-decomposition structure):** Total observed variance in any Cluster B rate metric decomposes into at least four distinct, separately-attributable sources, each requiring different handling:
  - **R31 (variance across runs)** — the same (query, assistant, date) triple, run multiple times in immediate succession, will not necessarily produce identical results, given that LLM generation is not fully deterministic even holding everything else constant (a well-established, general property of sampling-based LLM generation, not requiring new citation beyond general knowledge already assumed throughout this project's research). This is the "floor" noise level — even a perfectly stable website and perfectly stable model would show some non-zero R31 variance.
  - **R30 (variance across models/assistants)** — directly, precisely what Topic Q's Q20 measures; per Topic A's A1-A4 research, different vendors implement genuinely different retrieval/ranking/generation pipelines despite sharing a common high-level shape, so R30 variance is expected to be **substantially larger** than R31 variance, and a finding that holds despite high R30 variance (i.e., consistently across different assistants) is much stronger evidence than one that only holds for a single assistant.
  - **R32 (temporal variance)** — directly, precisely what Topic Q's Q21 measures; distinct from R31 (immediate-succession noise) in that R32 specifically captures drift over longer time periods, which could reflect either genuine website changes (a confound to control for, directly connecting to Topic I's freshness research) or underlying model/index updates on the AI vendor's side (an entirely external source of variance the website owner cannot control or predict) — these two sub-causes of R32 should be distinguished where possible (did the website change between measurements, or did only the AI system's behavior change) rather than conflated into one "things changed" observation.
  - **R33 (measurement noise)** — the residual variance attributable to **our own measurement apparatus** (Cluster C's precision/recall/kappa figures) rather than to any real underlying variation in website or AI behavior — this is the "floor" below which no comparison should be trusted, and directly closes the loop with Cluster C: a low inter-rater kappa directly implies elevated R33, which should be explicitly subtracted out (or at minimum flagged) before interpreting R30/R31/R32 as reflecting "real" variance rather than measurement artifact.
- **INFERENCE (R29, repeatability, as the synthesis of the above four):** A finding is "repeatable" to the degree that its effect size (per Topic Q's Cluster B comparisons) is large relative to the combined R31+R33 noise floor — this gives repeatability a precise, checkable operational meaning (signal-to-noise framing) rather than a binary "did it replicate or not" judgment, and directly means that Topic Q's Cluster B comparisons should ideally report not just a point estimate (e.g., "cited sites show X% higher rate of Y") but some indication of how that effect size compares to the measured noise floor — even an approximate, disclosed-as-approximate comparison is more honest than a bare percentage difference with no noise context.

### D. Important mechanisms
The single most important, unifying insight for this cluster and arguably for this entire document: **"is this finding real" is not a yes/no question — it's a question of whether the observed effect size clears the noise floor established by R31 (run-to-run) and R33 (measurement-apparatus) variance**, with R30 (cross-model) and R32 (cross-time) variance serving a different function — not noise to be cleared, but **generalization breadth to be reported alongside** any finding, directly implementing this entire project's consistent confidence-tiering discipline at the level of the empirical measurement program itself.

### E. Concrete methodology
Estimate R31 (immediate-repeat variance) via a small number of repeated identical queries per site early in the field-research process, establishing the noise floor before investing effort in the larger Cluster B/D comparative work; estimate R33 directly from Cluster C's precision/recall/kappa validation; report R30/R32 as explicit dimensions of generalization breadth (how many assistants, how much time separation) alongside every Topic Q finding, directly following the confidence-tagging recommendation already made in Topic Q's own Cluster C section.

### F. How this could be executed within constraints
A small, disclosed repeated-query pilot (even 5-10 repeated queries) early in the process is sufficient to give a rough noise-floor estimate without consuming a large fraction of the hackathon's realistic time budget — directly consistent with this project's consistent preference for small, honest, appropriately-hedged measurements over large, infeasible, or falsely-precise ones.

### G. What evidence this produces
A disclosed noise-floor estimate (R31+R33) that every subsequent Topic Q comparison's effect size should be interpreted against, plus explicit generalization-breadth tags (R30/R32) attached to every reported finding.

### H. Possible severity logic
Not a website-defect severity — this cluster's output is a **confidence multiplier** applied to every other finding in Topics Q and R (and, by extension, retroactively to every "unvalidated hypothesis" flagged across Topics A-K/I that this measurement apparatus is eventually used to test).

### I. Correct remediation
Not applicable directly — the "remediation" here is methodological: never report a Topic Q comparative finding without at least a qualitative noise-floor caveat, and prefer findings that clear R30 (cross-model) and R32 (cross-time) generalization checks over single-assistant, single-timepoint findings.

### J. False-positive cases
A finding that appears strong in a single run, on a single assistant, could be entirely an artifact of R31/R33 noise — the single most important false-positive risk this entire cluster exists to guard against, directly reinforcing why the noise-floor-estimation step (Section F) should happen early, before investing effort in comparisons that might turn out to be chasing noise.

### K. False-negative risks
A genuine, real effect could be obscured if R31/R33 noise happens to be unusually high in a particular small sample — directly arguing for repeating any borderline/ambiguous Cluster B comparison rather than accepting a single null result as definitive, consistent with the general small-sample-honesty principle established throughout this project.

### L. Counterexamples
None in the traditional sense — this cluster establishes a variance-decomposition framework, not a falsifiable claim about website mechanics.

### M. Generalizes?
Yes, completely — the four-way variance decomposition (run/model/time/measurement) is a general, domain-agnostic statistical framing.

### N. Candidate skill(s)
Not a skill — a confidence-calibration methodology applied to every other finding this project's field research produces.

### O. Relationship to other skills
Directly closes the loop with Topic Q's Cluster C (Q19-Q21), now giving that cluster's cross-cutting-validation instinct a precise statistical vocabulary; the R33 (measurement noise) component is directly, quantitatively supplied by this document's own Cluster C (precision/recall/kappa).

---

## 2. Findings register
*(Selecting the strongest, most load-bearing, most novel methodological findings.)*

---
**FINDING ID:** R-01
**Researcher:** Pulkit
**Research Area:** R — Experiment Design & Measurement
**Research Question:** R15 — Is Cohen's/Fleiss' Kappa the right reliability statistic for every outcome category in this measurement program?
**Observation:** A peer-reviewed methods paper establishes that traditional kappa statistics specifically break down for tasks — like ours — that lack a well-defined number of negative cases (e.g., "not cited," an effectively unbounded category), recommending positive specific agreement (mathematically equivalent to average F-measure among rater pairs) as the appropriate alternative for exactly this situation.
**Evidence:** "Agreement, the F-measure, and reliability in information retrieval," PubMed 15684123; Cohen's Kappa formalism and Landis & Koch (1977) interpretation bands, corroborated across multiple sources (Wikipedia, arXiv 2512.15302, arXiv 1206.4802).
**Sources:** See Cluster C section C.
**Pattern:** Our own R5 "ignored" category is precisely the category this peer-reviewed warning describes — meaning standard Kappa should be reserved for well-bounded categories (R2's strict citation definition) while positive specific agreement/F-measure should be used specifically for "ignored"/"not cited" reliability testing, a direct, non-obvious, and precise match between an established methodological caution and our own specific measurement design.
**Counterexamples:** A low Kappa on the "ignored" category should not be misinterpreted as poor methodology if positive specific agreement shows acceptable reliability by the appropriate alternative measure.
**Hypothesis:** N/A — direct application of established, peer-reviewed methodological guidance to a precisely-matching situation.
**Signal:** N/A directly — this is a measurement-quality-assessment method.
**How to Detect:** Compute Kappa for bounded categories; compute positive specific agreement/F-measure for unbounded ("ignored") categories.
**Evidence Output:** Reliability statistics with the correct method chosen per category, plus the Landis-Koch interpretation band explicitly stated.
**False Positives:** Treating a low Kappa score on unbounded categories as definitive evidence of poor rater agreement without checking the appropriate alternative statistic.
**False Negatives:** N/A directly.
**Severity:** N/A — a confidence-calibration finding, not a website defect.
**Recommended Fix:** N/A directly — informs measurement methodology choice.
**Generalization:** The distinction is well-established, peer-reviewed, and directly, precisely applicable to our exact measurement situation.
**Candidate Skill:** None — measurement-quality-assurance methodology.
**Related Skills:** Cluster A (R5's definition, which creates the exact unbounded-category situation this finding addresses).
**Confidence:** HIGH — grounded in a specific, directly-matching peer-reviewed methods paper, not a general inference.

---
**FINDING ID:** R-02
**Researcher:** Pulkit
**Research Area:** R — Experiment Design & Measurement
**Research Question:** R18-R28 — Do the eleven named query-type categories require eleven independent sampling strategies?
**Observation:** Eight of the eleven named query types (R20-R26) are specific instantiations of the query-intent taxonomy already established in Topic A's A13; R18/R19 (head/tail) constitute a genuinely distinct, orthogonal axis with a precise, useful characterization (head = exploration, tail = decision); R27/R28 (adversarial, ambiguous) are genuinely new, hypothesis-targeted dimensions specifically designed to stress-test this project's own accumulated prior findings (Topic E's negation/hedging work, Topic I's press-release-repetition hypothesis, Topic B's AmbER-derived entity-ambiguity hypothesis) rather than to sample "typical" query behavior.
**Evidence:** Direct synthesis of Topic A's A13 (already established) with general, consistently-described web-query-distribution literature (searchengineland.com, constructor.com, multiple ACM/ResearchGate sources on head/tail query dynamics).
**Sources:** See Cluster D section C.
**Pattern:** A well-constructed query set should be built as a deliberately stratified {head, tail} × {A13 intent categories} grid, supplemented with a smaller, explicitly hypothesis-targeted set of adversarial/ambiguous queries — not a large, undifferentiated query pile, and not eleven independently-designed sampling strategies.
**Counterexamples:** N/A — this is a sampling-design consolidation finding.
**Hypothesis:** N/A — direct synthesis of already-established prior findings (A13) with general query-distribution literature.
**Signal:** N/A directly — this is sampling methodology.
**How to Detect:** N/A directly.
**Evidence Output:** A reusable, disclosed query-construction grid template.
**False Positives:** N/A directly.
**False Negatives:** A query set that doesn't deliberately stratify across this grid risks systematic gaps (e.g., all head queries, no tail queries) that would bias every downstream Topic Q comparison.
**Severity:** N/A.
**Recommended Fix:** N/A directly — informs query-set construction methodology.
**Generalization:** The grid structure is site-type-agnostic; specific query wordings should be adapted per site type/industry.
**Candidate Skill:** None — query-construction methodology.
**Related Skills:** Topic A's A13 (reused for the third time across this project — retrieval mechanics, Topic K's answerability testing, and here); Topic B's B3/B10 (R28); Topic E's Cluster C and Topic I's I-01 (R27's specific hypothesis-targeting examples).
**Confidence:** HIGH for the A13-instantiation mapping (direct reuse of already-established research) / MEDIUM for the specific head/tail characterization (well-established general concept, but the precise "exploration vs. decision" framing comes from a single non-peer-reviewed industry source and should be treated as illustrative rather than definitive).

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
The precision/recall/Kappa formalism (Cluster C) reveals a genuinely important, easily-conflated distinction this project had not yet explicitly drawn: **measuring the website's citation behavior (Cluster B) is a fundamentally different task from measuring the quality of our own measurement apparatus (Cluster C)**, and conflating the two would let a flawed detection methodology masquerade as a real website-level finding. The R-01 discovery — that our own "ignored" category definition creates precisely the unbounded-negative-case situation the peer-reviewed methods literature warns standard Kappa fails for — is a genuinely valuable, non-obvious, directly-applicable piece of methodological self-awareness that most competing teams building a similar measurement system would likely miss entirely.

**Strongest unvalidated hypothesis:**
That R27's "hypothesis-targeted adversarial query" approach (deliberately constructing queries designed to create the exact conditions under which a specific prior-topic hypothesis predicts failure) will prove more efficient at generating decisive evidence than broader, undifferentiated query sampling, given realistic hackathon time constraints. This is a reasonable, well-motivated methodological choice but is itself untested as a research strategy — the team should watch, during actual field research, whether hypothesis-targeted queries do in fact produce cleaner, more interpretable signal than the broader grid-sampling approach, and adjust the balance between the two if not.

**Strongest candidate skill:**
None directly, consistent with Topic Q's own finding — Topic R, like Topic Q, correctly produces no shipped marketplace skill, since this entire document is measurement methodology for the team's own R&D process. If forced to name the closest analog: the **operational definitions (Cluster A) and three-way support taxonomy (R4, directly reusing Topic B's F2)** are the most directly reusable artifact, since they could plausibly be embedded as the classification logic inside a `live-citation-probe` skill if one is built (as referenced across Topics A, B, I, and K), giving that skill's output a rigorous, well-defined, non-ad-hoc classification scheme rather than an implicit, undocumented one.

**Weakest assumption we should investigate next:**
R8 (source-selection rate) was identified as only approximately, proxy-measurable — the true retrieval-candidate set is not observable from outside any of the four AI systems researched throughout this project, and the proposed workaround (using independently-gathered "top organic search results" as a proxy for the retrieval candidate set) rests on an unverified assumption that organic search ranking and each AI system's actual retrieval candidate generation are reasonably correlated. This assumption should be treated with real skepticism — Topic A's own research (A14) established that retrieval can be lexical, semantic, or hybrid, and there's no guarantee an organic-search-ranking proxy tracks any given AI system's actual candidate-generation process closely. If R8 is pursued at all, this proxy-validity assumption should be flagged prominently wherever R8-derived numbers are reported, rather than presented with the same confidence as R6/R7/R9/R10, which rest on directly observable response content.

---

## 4. Cross-references for the Combine & Code phase

- **Cluster A (R2-R5 definitions) ↔ Topic B's F2 (misrepresentation taxonomy) and Topic K's Cluster A (three-way QA outcome design):** R4's definition directly, precisely reuses F2's established groundedness/faithfulness/factuality framework rather than inventing a new one — confirmed non-duplicate, direct extension.
- **Cluster C's R-01 finding (Kappa vs. F-measure for unbounded categories) ↔ Topic Q's Cluster A (Q1-Q5 dataset construction, especially Q2's uncited-site dataset):** This is a direct, load-bearing methodological correction that should be applied wherever Topic Q's field research involves judging "ignored"/"uncited" status — flagged as a required cross-read before that work begins.
- **Cluster D's query-grid template ↔ Topic A's A13 (reused a third time) and Topic Q's entire Cluster A/B (dataset construction, comparative analysis):** This document's query-construction grid is the concrete, reusable instrument Topic Q's abstract methodology needs — the two documents should be used together, not sequentially-then-discarded.
- **Cluster E's noise-floor/variance framework ↔ Topic Q's Cluster C (Q19-Q21, cross-cutting validation):** Directly gives Topic Q's cross-cutting-validation instinct precise statistical vocabulary (R30/R31/R32/R33) — recommend these two clusters be read and applied jointly, since Q19-Q21 without R29-R33's variance-decomposition framing would remain a good instinct without a precise implementation.
- **R8's flagged proxy-validity weakness ↔ Topic A's A14 (retrieval mechanics):** A concrete, specific item for the team to treat with appropriate skepticism rather than silently trusting — directly connects to, and should be read alongside, A14's own findings about the diversity of possible retrieval mechanisms across vendors.
- **Overall meta-note, extending Topic Q's own closing observation:** Like Topic Q, Topic R's 33 sub-topics do **not** collapse into a small number of underlying mechanisms in the same way Topics C/D/E/I/K did — Clusters A, B, C, D, and E here are five genuinely distinct measurement-methodology concerns (definitions, rates, reliability, sampling, noise) that build on each other sequentially rather than being surface restatements of one mechanism. This is consistent with, and reinforces, Topic Q's own observation that "operate one level up" topics (methodology, rather than website mechanism) behave differently from the mechanism-level topics in this respect.
