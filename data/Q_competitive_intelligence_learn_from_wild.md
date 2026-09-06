# Topic Q — Competitive Intelligence / "Learn From the Wild" (Q1–Q24)
**Researcher:** Pulkit | **Research Area:** Q — Competitive Intelligence / Empirical Field Research Methodology
**Priority:** Critical (this is the handout's own explicitly-mandated research method, not an optional add-on)

---

## 0. Framing — Topic Q is fundamentally different from every prior topic, and that difference must shape this whole document

Every prior topic in this project (A-E, I, K) asked: **what mechanism explains a class of failure, and what website-level signal detects it?** Topic Q asks a different, prior question: **how do we actually go find, out in the real world, the evidence that validates or invalidates everything the other topics hypothesized?** This is not a mechanism to research — it is the **empirical research program itself**, and the handout is explicit that this is not optional: *"We won't hand you a list of test sites. Part of the challenge is field research: go find real websites that AI assistants cite well versus ones they ignore or misrepresent, and work out what makes the difference... Design for patterns, not fit-to-examples."*

Given this, Topic Q's job is not to produce more A-O findings about website mechanics — it's to produce a **rigorous, defensible, replicable methodology** for the dataset-building and comparative-analysis work Q1-Q24 describe, so that whoever executes this research (during the hackathon's actual field-research phase) does it in a way that produces real signal rather than noise, confirmation bias, or overfit anecdotes. I'm treating this document accordingly: less "here is a finding," more "here is how to not fool ourselves while looking for findings" — which is itself the correct, evidence-based posture, grounded in how actual empirical/epidemiological research handles exactly this class of problem (comparing an "affected" group against a "control" group to find what differs).

**One critical, load-bearing methodological choice made up front:** I ground Q1-Q20's comparative-study design in **matched case-control study methodology** — a mature, decades-old epidemiological research tradition built for exactly this shape of problem (comparing an outcome group against a control group to identify what differs, while guarding against confounding) — and I ground Q24 in the **formal statistics of interaction/synergy effects**, which gives the user's own worked example ("entity clarity + explicit claims + corroboration + clean extraction = strong predictor") a precise, checkable mathematical structure rather than leaving it as an intuition. Both choices are explained and justified below.

---

## 1. Legend
Same as all prior topics: **FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**.

---

## Cluster A — Dataset construction methodology
**Covers:** Q1 (cited-site dataset), Q2 (uncited-site dataset), Q3 (misrepresented-site dataset), Q4 (stale-information dataset), Q5 (engagement-problem dataset)

### A. What we need to understand
Before any comparison (Q6-Q20) can mean anything, the five underlying datasets must be constructed in a way that avoids the most common, most damaging failure mode of exactly this kind of research: **building a biased sample that confirms whatever hypothesis was already suspected**, rather than a sample that could actually surface a *surprising*, non-obvious pattern.

### B. Why it matters
This is the foundation everything else in this topic (and arguably several prior topics' unvalidated hypotheses — e.g., Topic I's I-01 press-release-repetition hypothesis, Topic B's B-01 misrepresentation-risk hypothesis) depends on for actual empirical validation, not just plausible reasoning.

### C. Current evidence and design reasoning

**The core methodological grounding — matched case-control design, directly and formally established in epidemiological research:**
- **FACT (well-established, primary methodological literature, directly and precisely transferable to this problem shape):** Matched case-control study design is described in the epidemiological methods literature as comparing a "case" group (has the outcome of interest) against a "control" group (does not), with **matching on known or suspected confounding variables** at the design stage specifically to isolate the effect of the variable(s) actually being studied — "comparing like with like." This is formally, precisely the same problem shape as Q1 vs. Q2 (cited vs. uncited sites): we want to know what differs between the two groups *that actually explains the citation outcome*, not what differs incidentally.
- **FACT (directly from the same literature, a genuinely important, non-obvious caution that must inform this entire cluster's design):** The literature is explicit and emphatic that **matching does not, by itself, establish causation**, and that matching on the *wrong* variable can actively introduce bias rather than remove it: matching on a variable that is not a true confounder can reduce statistical efficiency; matching on a variable that lies *on the causal pathway* between the exposure and the outcome ("overmatching") "will contribute bias that cannot be removed in the analysis." **This is a directly, concretely important warning for our own dataset design**: if we match cited and uncited sites on, say, "domain age" without first establishing whether domain age is a genuine confounder or is itself partly caused by (or a proxy for) the very things we're trying to isolate (e.g., older domains may simply have had more time to accumulate the corroboration/entity-clarity signals we actually care about), we risk overmatching and destroying our own ability to detect the real signal.
- **INFERENCE (translating the case-control framework directly onto Q1-Q5):** Each of the five named datasets is a distinct "case" (or "case-variant") population requiring its own matched "control" population for the comparisons in Cluster B to be meaningful:
  - **Q1 (cited) vs. Q2 (uncited)** is the most direct case-control pair — but per the overmatching warning above, "uncited" must be carefully defined: a site that's uncited because it's genuinely irrelevant to any tested query is not a meaningful control; the meaningful control is a site that is **topically relevant and plausibly should have been cited, but wasn't** — this distinction is critical and easy to get wrong.
  - **Q3 (misrepresented)** is a **distinct third category, not a subtype of Q2** — directly following from Topic B's F2 finding (citation presence ≠ citation accuracy). A misrepresented site *was* cited/retrieved, but incorrectly — this requires its own dataset and its own control group (correctly-represented cited sites), not simply being folded into "uncited."
  - **Q4 (stale-information)** is likewise distinct from Q2/Q3 — a stale site could be cited-but-wrong (overlapping with Q3) or simply not cited due to freshness-signal weakness (Topic I's Cluster I/IV), and the dataset construction should explicitly track which of these applies per site, since Topic I's own research already established these are different mechanisms with different fixes.
  - **Q5 (engagement-problem)** is the most methodologically distinct of the five, since it requires a **different outcome measure entirely** — not "was this cited by an AI" but "does a human visitor arriving at this page actually understand/trust/navigate/act on it." This dataset cannot be built via the same citation-observation method as Q1-Q4 at all; it requires either direct usability-style evaluation (a human or LLM proxy assessing the page as a first-time visitor would) or behavioral proxy signals (though we have no direct access to real user behavioral data, an important, honest limitation).

### D. Important mechanisms
The single most important design principle for this entire cluster: **each dataset needs an explicit, disclosed, pre-registered-style definition of inclusion criteria, written *before* looking at results** — directly borrowing epidemiological practice's emphasis on defining case/control criteria at the design stage, not adjusting the definition after seeing which sites "fit the story." This is the single most effective, well-established guard against exactly the confirmation-bias risk this cluster exists to prevent.

### E. Concrete methodology (this cluster's "signal," reframed for a methodology topic)
For each dataset, an explicit protocol: (1) a fixed, disclosed set of test queries spanning the intent taxonomy already established in Topic A's A13, (2) a fixed, disclosed method for running those queries against real AI assistants (respecting each vendor's terms of service and the hackathon's own read-only, non-abusive constraints), (3) explicit, pre-defined criteria for what counts as "cited," "uncited-but-relevant," "misrepresented," "stale," and "engagement-failing" — decided before data collection begins, not derived post-hoc from whichever sites happen to appear.

### F. How this could be executed within the hackathon's actual constraints
This is where Topic Q must directly confront the hackathon's own stated rules (handout: read-only, no rate abuse, respect robots.txt, 5-minute runtime target for the *marketplace's own audits*) — **the Q1-Q24 dataset-building work is explicitly a one-time, pre-submission research activity by the team, not something the shipped marketplace skill does at audit-time.** This distinction matters enormously and should be stated explicitly: the *skills* we build encode the *patterns* discovered during this research phase; they do not themselves re-run a live multi-site comparative study every time someone audits a website (that would blow the 5-minute runtime budget many times over, and isn't what any single-site audit needs to do). Q1-Q24 is R&D methodology for *us*, informing skill design — not a runtime feature of the shipped product. I want to flag this explicitly because the sub-topic numbering and phrasing could otherwise be misread as describing a marketplace feature.

### G. What evidence this research phase should produce
For each of the five datasets: a disclosed list of sites/pages (kept internal per the handout's own statement that specific studied sites won't be asked about or used in grading), the query/method used to classify each, and — critically — the specific signals (per Topics A-K, I) each site does/doesn't exhibit, recorded systematically enough to support Cluster B/D's comparative analysis.

### H. Possible severity logic
Not applicable in the per-finding sense used elsewhere in this project — this cluster establishes data-collection methodology, not a detectable website defect.

### I. Correct remediation
Not applicable directly — this cluster's "remediation" is methodological: adopting matched case-control principles and pre-registered inclusion criteria to maximize the odds that Cluster B/D's findings reflect real signal rather than sampling artifacts.

### J. False-positive cases (methodological, not per-site)
The single most important false-positive risk for this entire cluster: **selecting "uncited" or "misrepresented" example sites that were chosen because they already looked like they'd confirm a suspected hypothesis** (e.g., specifically picking JS-heavy sites for the uncited dataset because we already suspect JS-rendering is the cause) — this would make Cluster B's comparisons circular and uninformative. The fix is exactly the pre-registered, criteria-first approach established in Section D.

### K. False-negative risks
A dataset built only from sites the researchers happened to think of or encounter casually risks systematic **sampling bias** toward familiar industries/site types, missing genuine patterns that only appear in underrepresented site types (this connects directly to Q9's structured-vs-unstructured and Q11's short-vs-long comparisons — if the sample doesn't have real variation on these dimensions, no comparison can detect anything).

### L. Counterexamples
None in the traditional sense — this cluster establishes methodology rather than making a falsifiable claim about website mechanics.

### M. Generalizes?
The case-control methodology itself is a mature, general-purpose research design used across many fields (epidemiology, social science, economics) — its applicability to this specific comparative-website-research problem is a well-grounded, low-risk translation, not a novel or speculative application.

### N. Candidate skill(s)
Not a skill at all — this cluster (and this entire topic) describes **research process**, which informs the *design* of the skills built in Topics A-K/I, but does not itself become a shipped marketplace skill.

### O. Relationship to other skills
Foundational to the credibility of essentially every hypothesis flagged as "unvalidated" across every prior topic's end-of-topic synthesis (Topic A's A18 substitution hypothesis, Topic B's B-01 root-cause hypothesis, Topic I's I-01 repetition-resistance hypothesis, Topic K's K-02 scoring-formula validation need) — Topic Q is the connective research phase that could actually test these, not a separate, unrelated research area.

---

## Cluster B — Pairwise comparative dimensions
**Covers:** Q6 (cited vs. uncited pages), Q7 (cited vs. ignored domains), Q8 (official vs. third-party), Q9 (structured vs. unstructured), Q10 (static vs. JS-heavy), Q11 (short vs. long pages), Q12 (information-dense vs. marketing-heavy), Q13 (fresh vs. stale), Q14 (explicit vs. implicit claims), Q15 (entity-clear vs. entity-ambiguous), Q16 (corroborated vs. isolated claims), Q17 (one-page vs. fragmented answers), Q18 (strong vs. weak navigation)

### A. What we need to understand
Whether these thirteen named comparisons require genuinely distinct methodology, or — consistent with this project's now-repeated finding across Topics C/D/E/I/K — whether they're thirteen applications of the *same* matched-pair comparison method to thirteen different variables, each of which happens to correspond to a hypothesis already established (with varying confidence) in a prior topic.

### B. Why it matters
This is exactly the point of the case-control framing established in Cluster A: each of these thirteen "compare X vs Y" instructions is a **testable hypothesis derived from prior research**, not a new mechanism requiring new theory — Topic Q's job is to specify *how to actually test it*, and to honestly map which prior-topic finding each comparison would validate or challenge.

### C. Current evidence — mapping each comparison to its prior-topic hypothesis and specifying its test design

| Comparison | Prior-topic hypothesis being tested | What "matching" should control for |
|---|---|---|
| **Q6/Q7 Cited vs. uncited (page/domain level)** | The foundational comparison underlying nearly this entire project — no single prior finding, but the aggregate hypothesis space of Topics A/B/C/D | Topical relevance and query-intent match (per A13) must be held constant — comparing a cited page against an uncited page on a *different* topic tells us nothing |
| **Q8 Official vs. third-party** | Topic B's B2 (query-intent-dependent source-type preference — the contested Reddit/UGC vs. earned-media finding) and Topic A's A18 (source substitution) | Query-intent type (informational/comparison/transactional, per A13) — B2 already established source-type preference varies sharply by this variable, so it must be a matched/stratified dimension, not ignored |
| **Q9 Structured vs. unstructured** | Topic D's D-01 (structured-data mythbusting) — this comparison could directly *test* whether Google's own "not required" statement and Topic B's F3 schema-extraction findings hold up empirically | Content quality/extractability (Topic A's A16) must be held roughly constant, or a "structured but poorly-written" site could confound the result |
| **Q10 Static vs. JS-heavy** | Topic A's A11 and Topic D's entire Cluster III (rendering pipeline mechanics) — the most directly, mechanistically-grounded comparison in this whole cluster | Fact-bearing-content presence in *rendered* DOM should be held constant (comparing a JS-heavy site with genuinely present rendered content against a static site tests the *crawl-timing* mechanism specifically, not a confounded "JS sites have worse content" effect) |
| **Q11 Short vs. long pages** | Directly tests the brief's own explicitly-named forbidden assumption ("short content = bad... long content = good") — this comparison is explicitly designed to check whether that assumption holds at all, which the brief itself already suggests it doesn't | Information density (Q12) is the likely true confounder — a short page can be dense; a long page can be diluted; length alone conflates with density unless separately measured |
| **Q12 Information-dense vs. marketing-heavy** | Topic B's F1 (vague-vs-specific language, quotable/quantifiable statement density, Aggarwal et al.) | Page length (Q11) and topical relevance should be matched, isolating density specifically |
| **Q13 Fresh vs. stale** | Topic I's entire research program — directly testable | Fact-type/category (Topic I's Cluster II table) must be stratified, since staleness stakes vary sharply by category — comparing fresh/stale pricing pages should be a separate analysis from fresh/stale founding-date pages |
| **Q14 Explicit vs. implicit claims** | Topic B's F1/B4 and Topic E's Cluster C (negation/hedging/qualification language) | Fact type and consequentiality (Topic I's Cluster II stakes table) — an implicit claim about a low-stakes fact is a different test than an implicit claim about pricing |
| **Q15 Entity-clear vs. entity-ambiguous** | Topic B's B3/B10 (AmbER sets, name-collision/popularity-bias findings) — one of this project's strongest peer-reviewed-grounded hypotheses, genuinely worth empirical field validation | Brand recognition tier (Topic B's B10) should be held roughly constant, since B10 already established recognition tier independently affects how much on-page content matters at all |
| **Q16 Corroborated vs. isolated claims** | The handout's own Appendix D (many independent sources agreeing) and Topic A's A20/deferred Harsh territory | Claim consequentiality and entity clarity (Q15) — a corroboration effect could be confounded with entity clarity if not separately tested |
| **Q17 One-page vs. fragmented answers** | Topic K's entire Cluster A methodology (K25's page-citation-count, directly borrowed from HotpotQA) — this comparison is essentially a live-query validation of Topic K's own proposed metric | Fact type/complexity — some genuinely complex facts *require* synthesis across sources legitimately; the comparison should control for whether fragmentation is genuinely avoidable |
| **Q18 Strong vs. weak navigation** | Topic D's Cluster II (semantic structure/landmarks) and Cluster VII (link-graph/crawl depth) — connects the on-site-engagement mandate directly to the AI-discoverability mandate, since navigation quality plausibly affects both | Site size/complexity, since navigation "strength" expectations scale with site scope (Topic C's Cluster VII already established this for crawl-depth specifically) |

### D. Important mechanisms
The single most valuable synthesis from this table, and the primary original contribution of this cluster: **every one of these thirteen comparisons already has a specific, identifiable confounding variable that prior research in this project has independently flagged** — meaning Topic Q's dataset design isn't starting from scratch; it can be built directly informed by (and explicitly designed to stress-test) the hypotheses this entire research project has already generated. This is a genuinely disciplined, non-arbitrary way to prioritize which comparisons to run first: **the comparisons with the clearest, most specific, most already-articulated confounding variable to control for (Q10, Q13, Q15, Q17) are the ones most likely to produce a clean, interpretable result**, while comparisons with vaguer or multiple plausible confounders (Q11, Q18) will need larger samples or more careful stratification to produce a trustworthy signal.

### E. Concrete methodology
For each comparison: hold the identified confounder(s) constant via matching (select pairs of sites/pages that are similar on the confounder but differ on the variable being tested) or via stratification (bucket the sample by the confounder and compare within each bucket), directly following the matched case-control principles established in Cluster A.

### F. How to execute this within constraints
Each comparison requires a modest, disclosed sample (the epidemiological literature's own guidance that small samples are workable with proper matched-pair statistical methods — McNemar's test, paired analysis — is directly relevant and reassuring given the hackathon's realistic time constraints; a large-N study is not required for a valid, if lower-powered, matched-pair comparison).

### G. What evidence this phase should produce
Per comparison: the matched-pair sample, the specific outcome measured (citation presence, accuracy, engagement proxy), and an honest statement of effect size and confidence given sample size — explicitly avoiding the temptation to overstate confidence from a small, hackathon-timeline sample.

### H-L.
Inherited from Cluster A's general false-positive/negative and counterexample handling — the core risks (confounding, overmatching, circular sample selection) apply identically across all thirteen comparisons, differentiated only by which specific confounder matters most per the table above.

### M. Generalizes?
The methodology generalizes completely; which comparisons are highest-priority to run first (per Section D) is itself a genuinely useful, disclosed prioritization the team can use given realistic time constraints.

### N. Candidate skill(s)
Not a skill — research methodology informing skill design, consistent with Cluster A.

### O. Relationship to other skills
This cluster is the most extensive, explicit cross-referencing document in this entire research project — it touches nearly every finding established in Topics A, B, C, D, E, I, and K, and should be treated as the empirical validation roadmap for the whole project's collection of "strongest unvalidated hypothesis" entries.

---

## Cluster C — Cross-cutting comparisons and repeated measurement
**Covers:** Q19 (across query types), Q20 (across AI assistants), Q21 (repeat over time)

### A. What we need to understand
Three comparisons that cut *across* Cluster B's variable-specific comparisons rather than adding new variables of their own — testing whether the patterns found in Cluster B hold consistently, or whether they're contingent on query type, assistant, or time.

### B. Why it matters
This is where the case-control methodology's own generalization concern gets directly addressed: a pattern found once, in one query type, on one assistant, at one point in time, is a **fragile, potentially non-generalizable finding** — exactly the kind of "fit to examples" the handout explicitly warns against rewarding.

### C. Current evidence
- **INFERENCE (Q19, directly reusing Topic A's A13 taxonomy, already established as foundational infrastructure across this entire project):** Every Cluster B comparison should ideally be re-run across multiple query-intent types (informational, comparison, transactional, "best X," etc.) before being trusted as a general finding — a signal that holds for transactional-intent queries but not informational ones is a **real, important, but narrower** finding than a signal holding across all intent types, and our research should explicitly track and report this distinction rather than collapsing it.
- **INFERENCE (Q20, directly connects to and validates the four-vendor-pipeline-convergence finding already established in Topic A):** Topic A's A1-A4 research established that all four assistants share the same broad pipeline shape (retrieve→rank→generate→cite) despite different implementations — Q20 is the empirical test of whether this structural similarity actually produces *similar* citation behavior in practice, or whether vendor-specific implementation differences (e.g., Perplexity's documented fine-grained passage-level indexing vs. the less-detailed public documentation for others) produce meaningfully different citation patterns for the same site/query. **This is a genuinely important test given that several prior findings in this project were explicitly flagged as vendor-specific and not yet confirmed to generalize** (Topic B's F3 schema-extraction finding, confirmed for ChatGPT/Perplexity but not Claude; Topic C's per-vendor bot-token confidence being uneven across vendors) — Q20 is the natural place to close these specific, already-flagged gaps.
- **FACT (general methodological principle, well-established across essentially all empirical/scientific research, not requiring a domain-specific citation but worth stating precisely for this context):** A finding that fails to replicate across repeated measurement is not automatically wrong, but it does require the finding to be stated with appropriately reduced confidence — **Q21's explicit call for repetition directly serves this basic scientific-hygiene function**, and is especially important given that AI assistant behavior is documented (across this entire project's research) to be actively, rapidly evolving — a pattern confirmed once could plausibly reflect a since-changed model version, not a stable, generalizable website-level signal.

### D. Important mechanisms
The unifying principle for this cluster: **Cluster B's thirteen comparisons produce hypotheses; Cluster C's three cross-cutting checks are what convert a hypothesis into a genuinely trustworthy, generalizable finding.** A finding that holds across query types (Q19), across assistants (Q20), and across repeated time-separated trials (Q21) is meaningfully stronger evidence than one that holds in a single test — directly mirroring the confidence-tiering discipline (FACT/OBSERVATION/HYPOTHESIS) already used consistently throughout this entire research project, now applied at the level of the empirical research program itself rather than just literature review.

### E. Concrete methodology
Re-run Cluster B's matched-pair comparisons stratified by query-intent type (Q19) and separately per assistant (Q20); re-run the same comparisons at a second, later point in time before the hackathon submission deadline if feasible (Q21), explicitly comparing results across runs.

### F. How to execute this within constraints
This is the most time-intensive part of Topic Q's proposed program, and realistically may need to be scoped down given the hackathon's timeline — my recommendation (a disclosed, explicit scoping choice, not a silent omission) is to prioritize Q20 (cross-assistant) over exhaustive Q19 (cross-query-type) coverage, specifically because Q20 directly closes several already-identified, already-flagged confidence gaps from prior topics (the F3/Claude gap, the per-vendor bot-token confidence gap), giving it the highest expected research value per unit of effort within a constrained timeline.

### G. What evidence this phase should produce
For each Cluster B finding: an explicit tag indicating how many query types, how many assistants, and how many time points it was confirmed across — directly feeding the confidence-tiering language every prior topic's findings register already uses.

### H-L.
Inherited from Clusters A/B.

### M. Generalizes?
The cross-cutting-validation principle is universal good research practice; its specific execution is necessarily bounded by the hackathon's realistic time constraints, requiring the explicit prioritization disclosed in Section F.

### N. Candidate skill(s)
Not a skill — research-validation methodology.

### O. Relationship to other skills
Directly closes confidence gaps already flagged in Topics A (four-vendor generalization), B (F3's Claude gap), and C (per-vendor bot-token confidence) — the most direct, concrete "unfinished business" resolution mechanism in the whole project.

---

## Cluster D — False positive/negative logging and signal-interaction discovery
**Covers:** Q22 (record false positives), Q23 (record false negatives), Q24 (look for combinations of signals — explicitly flagged by the user as especially important)

### A. What we need to understand
Q22/Q23 establish research-hygiene discipline (systematically tracking when our own hypotheses are wrong, not just when they're right); Q24 is the capstone of this entire topic and, arguably, of this entire research project's methodology — moving from single-variable findings to **genuine interaction effects**, which the user's own worked example correctly identifies as "much more interesting than another checklist."

### B. Why it matters
Q24 deserves the most rigorous treatment in this document, both because the user explicitly flagged it as especially important and because it represents a genuine, formal statistical concept this project hasn't yet drawn on — giving the marketplace's eventual scoring/severity logic (Soham's Topic S territory) a mathematically precise foundation for exactly the kind of multi-signal combination reasoning the user's example describes.

### C. Current evidence

**Q22/Q23 (false positive/negative logging):**
- **INFERENCE (directly extending the disciplined false-positive/false-negative sections already present in every prior topic's A-O treatments throughout this project):** Every skill proposed across Topics A-K/I includes an explicit "false positive cases" and "false negative risks" section — Q22/Q23's contribution is converting these from *anticipated, reasoned-through* risks (as documented so far) into *empirically observed, logged* instances during the actual field-research phase. A false positive discovered empirically (a site our hypothesis says should fail but that AI assistants handle correctly anyway) is more valuable evidence than an anticipated one, since it directly tests whether our mechanism-level reasoning actually holds in the wild — exactly the "actively search for counterexamples" instruction the brief gives.

**Q24 (signal combinations) — the most rigorously and formally grounded sub-topic in this entire document:**
- **FACT (well-established statistical concept, directly and precisely relevant, with a formal, named, directly-applicable metric):** "Interaction effect" (called "synergy effect" in applied/marketing contexts) is a formal, well-established statistical concept describing exactly the phenomenon the user's worked example describes: "two or more features/variables combined have a significantly larger effect... as compared to the sum of the individual variables alone." Critically, this is **distinct from and not automatically implied by** each variable's individual effect — a standard "additive" model (each factor contributes independently) can be explicitly tested against an "interaction" model (factors combine super-additively or sub-additively), and the difference between the two models' predictions **is** the interaction effect, a precisely defined, statistically testable quantity, not merely a qualitative impression.
- **FACT (a genuinely valuable, directly transferable, formal metric for measuring interaction strength, originating in epidemiological genetics research but directly, precisely applicable to our problem):** The **"Synergy Factor" (SF)**, defined as SF = OR₁₂ / (OR₁ × OR₂) — the ratio of the *observed* combined odds ratio (both factors present together) to the *predicted* odds ratio *assuming the factors act independently* (the product of each factor's individual odds ratio) — is presented as "easy to use and clear to interpret," explicitly designed to be usable "by non-statisticians," and works "unlike logistic regression analysis... with datasets of any size, however small" (a genuinely important practical point given this project's realistic hackathon-timeline sample-size constraints). **This gives the user's own worked example a precise, directly-computable structure**: if entity clarity alone has odds ratio OR₁ for being correctly cited, explicit claims alone has OR₂, and the combination has observed odds ratio OR₁₂, then SF = OR₁₂/(OR₁×OR₂) — an SF significantly greater than 1 is quantitative, checkable evidence of genuine synergy (not just "both are good signs"), while an SF near 1 would indicate the factors are simply additive, and an SF *less* than 1 would indicate the factors are actually redundant with each other (each capturing some of the same underlying signal, so combining them adds less than expected) — a genuinely important third possible outcome the user's example doesn't explicitly consider, but that our research should actively watch for.
- **FACT (general regression-methodology literature, directly relevant to scaling this beyond simple two-factor comparisons):** For combinations of more than two factors (the user's example uses four: entity clarity, explicit claims, corroboration, clean extraction), the standard statistical approach is a **multiple regression model with interaction terms** — fitting a model that includes both the individual ("main effect") terms and the pairwise (or higher-order) interaction terms, then testing whether the interaction terms are statistically significant beyond the main effects alone. This is more complex than the two-factor Synergy Factor but is the correct, established extension when testing genuinely multi-way combinations, and the literature explicitly warns that testing many possible interactions requires appropriate control for multiple-comparisons/family-wise error (a real, technical risk of finding spurious "interactions" by chance if many combinations are tested without correction) — a genuinely important methodological caution for Q24 specifically, since testing all possible combinations of this project's dozens of established signals would create exactly this multiple-comparisons risk if not handled carefully.

### D. Important mechanisms
The single most valuable, load-bearing insight this cluster (and arguably this entire document) contributes: **the user's own example is not just a plausible narrative, it is a precisely testable statistical hypothesis**, and this project already has a strong, principled, non-arbitrary way to select *which* signal combinations to test first for interaction effects, rather than blindly testing all possible combinations (which the multiple-comparisons warning above shows would be methodologically risky). **The correct prioritization is to test interaction effects specifically between signals that this project's own prior research has already flagged as mechanistically connected, not independent** — this is not an arbitrary shortlist, it's directly derivable from this entire research project's own "Relationship to other skills" cross-referencing work. Concretely:
- **Entity clarity (Topic B's B10/B3) × Corroboration (Harsh's H/P territory, flagged repeatedly)**: Topic B's B10 already established that entity recognition/fame level changes how much *on-page content itself* matters — this directly predicts a plausible interaction with corroboration (a well-corroborated but entity-ambiguous brand might still fail, while a well-corroborated, entity-clear brand should synergistically succeed) rather than the two factors simply adding.
- **Clean extraction (Topic A's A16/Topic D's rendering clusters) × Explicit claims (Topic B's F1)**: A16/F1 are already established as adjacent, interacting mechanisms (a specific, quotable claim that's also chunk-boundary-safe should be more citation-competitive than either property alone predicts) — directly testable via the Synergy Factor on a matched sample.
- **Freshness signal strength (Topic I) × Corroboration**: Topic I's I-01 hypothesis (repetition-resistance) already implies an interaction — a stale fact's resistance to correction plausibly depends on *both* how stale it is and how widely corroborated the *old* version was, exactly the kind of two-way interaction the Synergy Factor is designed to test.

### E. Concrete methodology
For each prioritized signal pair (or small group), construct a matched sample stratified into four cells (neither signal present, only signal 1, only signal 2, both present), compute the observed citation/accuracy rate in each cell, derive the implied odds ratios, and compute the Synergy Factor — a concrete, replicable, non-arbitrary procedure directly following the established methodology above.

### F. How to execute this within constraints
Given realistic hackathon time constraints, a full multi-way regression-with-interaction-terms analysis (the more rigorous, more-than-two-factor approach) is likely infeasible; the pragmatic, disclosed scoping recommendation is to prioritize **pairwise Synergy Factor calculations** on the three prioritized combinations above (Section D), which is tractable even with a small sample per the literature's own explicit point about SF's usability at small sample sizes, and defer full four-way interaction modeling (the user's exact worked example) to a stretch goal if time permits.

### G. What evidence this phase should produce
For each tested pair: the four-cell contingency table, the derived odds ratios, the computed Synergy Factor, and an honest statement of confidence given sample size (directly avoiding the temptation to overstate a single small-sample SF calculation as definitive).

### H. Possible severity logic
This is where Q24's findings, if validated, should directly inform the *combination logic* of the final report's scoring/severity system (Soham's territory) — a validated positive interaction (SF > 1) between two signals means the report's severity logic should treat the co-occurrence of both problems as **more severe than the sum of their individual severities**, not merely additive, directly implementing the user's own stated insight in the report's actual scoring mechanics.

### I. Correct remediation
Where a positive interaction is confirmed, remediation guidance should note that partial fixes (addressing only one of two interacting signals) may yield **less than proportional benefit** compared to addressing both together — a genuinely more sophisticated, evidence-backed remediation framing than a flat, independent per-finding fix list.

### J. False-positive cases
The multiple-comparisons risk flagged in Section C is the primary false-positive concern for this entire cluster: testing many possible signal combinations without correction risks finding apparent "interactions" that are simply statistical noise — the disclosed, prioritized shortlist in Section D is the primary mitigation, directly avoiding an unprincipled fishing expedition across all possible signal pairs.

### K. False-negative risks
A genuine interaction effect could be missed if the sample size is too small to detect it statistically (a real, honest limitation given hackathon timeline constraints) — the report's confidence language for any Q24 finding should explicitly account for this, consistent with this entire project's practice of never overstating confidence beyond what the sample/methodology actually supports.

### L. Counterexamples
Not every plausible-sounding combination will show positive interaction — some signal pairs may show SF ≈ 1 (simply additive) or even SF < 1 (redundant, not synergistic), and this project should report these outcomes honestly too, since a "no interaction found" result for a plausible-sounding pair is itself useful, disconfirming evidence (directly consistent with the brief's "actively search for counterexamples" instruction) rather than something to omit because it's less exciting than a positive finding.

### M. Generalizes?
The Synergy Factor methodology itself is a general, well-established, domain-agnostic statistical tool; which specific signal pairs are worth testing is specific to this project's own accumulated hypothesis set, and should be revisited if the underlying signal taxonomy changes.

### N. Candidate skill(s)
Not a skill in the conventional sense, but this cluster's output — a validated (or disconfirmed) set of signal interactions — is a **direct, high-value input to whichever skill or report-layer logic computes final severity/scoring** (most directly connecting to Topic K's Cluster D scoring-design work, already flagged there as needing empirical validation, and to Soham's Topic S/AB territory).

### O. Relationship to other skills
The single most explicit, concrete bridge between this entire research project's accumulated hypotheses and the marketplace's actual scoring mechanics — Q24's output should be treated as a required input to Topic S/AB's final design, not an optional enrichment.

---

## 2. Findings register
*(This topic's "findings" are primarily methodological; the register below captures the most load-bearing methodology decisions rather than website-mechanism claims, consistent with this document's actual content.)*

---
**FINDING ID:** Q-01
**Researcher:** Pulkit
**Research Area:** Q — Competitive Intelligence / Learn From the Wild
**Research Question:** Q1-Q20 — What research design should govern the comparative "cited vs. uncited" style investigations the handout mandates?
**Observation:** Matched case-control study design, an established epidemiological methodology for comparing outcome groups against control groups while controlling for confounding, is a precise, directly transferable framework for this exact problem shape — with an important, explicit warning from that literature that matching does not by itself establish causation, and that matching on the wrong variable (overmatching, especially on variables lying on the causal pathway) can introduce rather than remove bias.
**Evidence:** Multiple peer-reviewed epidemiological methods sources (PMC2827892, Cambridge "Case-Control Studies" Ch.3, PubMed 21293153, JSTAGE ace/4/2, Springer BMC Medical Research Methodology).
**Sources:** See Cluster A section C.
**Pattern:** Every one of the handout's thirteen named pairwise comparisons (Q6-Q18) has an identifiable, prior-research-grounded confounding variable that must be matched or stratified for the comparison to produce a trustworthy, non-circular result — this project's own accumulated research (Topics A-K, I) directly supplies the confounder-identification work needed to design each comparison properly.
**Counterexamples:** N/A — this is methodology-selection reasoning, not a falsifiable empirical claim.
**Hypothesis:** N/A — direct application of established methodology.
**Signal:** N/A directly — this establishes how to detect signals, not a signal itself.
**How to Detect:** N/A.
**Evidence Output:** A disclosed, pre-registered-style set of inclusion criteria and confounder-matching design per comparison, decided before data collection.
**False Positives:** Circular sample selection (choosing example sites that already confirm a suspected hypothesis).
**False Negatives:** Sampling bias toward familiar site types/industries, missing genuine patterns in underrepresented segments.
**Severity:** N/A.
**Recommended Fix:** N/A directly — this is the methodology itself.
**Generalization:** The case-control framework is domain-general and well-established; its application here is low-risk.
**Candidate Skill:** None — research methodology informing skill design, not a shipped skill.
**Related Skills:** Provides the empirical-validation roadmap for unvalidated hypotheses flagged across nearly every prior topic.
**Confidence:** HIGH — grounded in a mature, decades-old, peer-reviewed methodological tradition, applied via a clearly-reasoned, explicitly-justified translation to a new domain.

---
**FINDING ID:** Q-02
**Researcher:** Pulkit
**Research Area:** Q — Competitive Intelligence / Learn From the Wild
**Research Question:** Q24 — How should "combinations of signals" be tested rigorously, rather than left as a qualitative impression?
**Observation:** "Interaction effect" (or "synergy effect") is a formal, well-established statistical concept precisely describing the phenomenon in the user's own worked example; the "Synergy Factor" (SF = OR₁₂/(OR₁×OR₂)) is a specific, well-documented, small-sample-friendly metric from epidemiological genetics research that gives this exact question a precise, computable structure, explicitly designed to be usable by non-statisticians and workable even with small datasets.
**Evidence:** "The synergy factor: a statistic to measure interactions in complex diseases," BMC Research Notes / PMC2706251; general interaction-effect/regression literature (Medium/TDS Archive, STHDA, Statistics By Jim) for the >2-factor extension via regression interaction terms.
**Sources:** See Cluster D section C.
**Pattern:** The user's worked example (entity clarity + explicit claims + corroboration + clean extraction = strong predictor, while each alone is weak) is a directly testable hypothesis, not just a plausible narrative — and this project's own accumulated cross-topic research already identifies which specific signal pairs are most mechanistically plausible to show genuine interaction, giving a principled, non-arbitrary prioritization for testing rather than an unguided search across all possible combinations (which would risk a multiple-comparisons false-positive problem).
**Counterexamples:** Not every plausible-sounding signal pair will show positive interaction (SF > 1) — some may be purely additive (SF ≈ 1) or even redundant (SF < 1), and both outcomes are valuable, honest findings that should be reported, not just positive interactions.
**Hypothesis:** The three prioritized pairs identified (entity clarity × corroboration; clean extraction × explicit claims; freshness × corroboration) are our own reasoned, cross-topic-grounded predictions, not yet empirically tested.
**Signal:** Four-cell contingency table (neither/only-A/only-B/both signals present) cross-referenced against citation/accuracy outcome.
**How to Detect:** Matched-sample data collection per Cluster A/B methodology, followed by direct Synergy Factor computation.
**Evidence Output:** Observed vs. predicted-under-independence odds ratios, computed SF, and honest confidence-given-sample-size statement.
**False Positives:** Testing many combinations without correction for multiple comparisons risks spurious apparent interactions.
**False Negatives:** Genuine interactions could be missed with too-small a sample to detect statistically.
**Severity:** N/A directly, but validated positive interactions should directly inform the report's severity logic to treat co-occurring interacting signals as more-than-additively severe.
**Recommended Fix:** N/A directly — this is a measurement methodology; its output should inform Topic S/AB's scoring design.
**Generalization:** The Synergy Factor methodology is domain-general and well-established; the specific prioritized signal pairs are specific to this project's own hypothesis set.
**Candidate Skill:** Direct input to Topic S/AB's scoring/severity design, not a skill itself.
**Related Skills:** Topic K's Cluster D (scoring design, already flagged as needing empirical validation) — this cluster provides exactly that validation mechanism.
**Confidence:** HIGH for the underlying statistical methodology (well-established, directly transferable) / LOW-MEDIUM for any specific interaction claim until actually tested, since none of the three prioritized pairs have yet been empirically evaluated in this research pass.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
That the handout's own Q1-Q24 instructions are not a checklist of independent tasks but a **coherent empirical research program** that this project already has the theoretical infrastructure to execute well — every one of the thirteen Cluster B comparisons has an identifiable confounder already flagged somewhere in this project's prior research (Topics A, B, C, D, E, I, K), meaning Topic Q's dataset-building work can be designed with genuine methodological rigor (matched case-control principles) rather than ad hoc example-gathering, directly serving the handout's own explicit "design for patterns, not fit-to-examples" instruction.

**Strongest unvalidated hypothesis:**
The three prioritized Q24 signal-interaction predictions (entity clarity × corroboration; clean extraction × explicit claims; freshness × corroboration) — each is a well-reasoned, cross-topic-grounded prediction with a precise, computable test (the Synergy Factor), but none has actually been tested against real data in this research pass. This is, appropriately, both the strongest *hypothesis* and the highest-priority item for the team's actual field-research phase, exactly matching the user's own framing of Q24 as "especially important."

**Strongest candidate skill:**
None directly — Topic Q correctly produces no shipped marketplace skill of its own, consistent with the important distinction established in Section 0/Cluster A (this is R&D methodology informing skill design, not a runtime feature). If a "candidate skill" framing must be forced, the closest analog is: **the Synergy Factor computation logic (Cluster D) could become a small, reusable internal utility** for whichever skill ultimately computes combined severity scores, allowing the marketplace's scoring logic to apply empirically-validated interaction multipliers rather than naive additive scoring — but this is scoring infrastructure, not an audit-facing skill.

**Weakest assumption we should investigate next:**
Q5 (the engagement-problem dataset) is the least methodologically resolved sub-topic in this entire document — I identified that it requires a fundamentally different outcome measure (human engagement/comprehension, not AI citation) but did not find or propose a fully rigorous, replicable way to measure this without access to real user behavioral data, which is realistically unavailable within this hackathon's scope. This is the most significant, honestly-disclosed methodological gap in this document and deserves further thought — likely resolved via an LLM-as-first-time-visitor proxy evaluation (conceptually similar to Topic K's closed-book QA protocol, but testing comprehension/trust/navigation rather than factual answerability), which should be explicitly designed before Q5's dataset construction is attempted.

---

## 4. Cross-references for the Combine & Code phase

- **Cluster A/B's entire confounder-mapping table ↔ every prior topic (A-K, I):** This is the single most extensive cross-referencing document in this research project by design — recommend it be read as a companion/index document alongside the individual topic write-ups when the team plans the actual field-research phase, since it directly maps each comparison to the specific prior finding it would test.
- **Cluster C's Q20 (cross-assistant validation) ↔ Topic B's F3 (Claude gap) and Topic C's per-vendor bot-token confidence gap:** Directly, explicitly prioritized as the highest-value use of limited field-research time, since it closes two already-identified, already-flagged confidence gaps rather than generating a new hypothesis from scratch.
- **Cluster D's Q24 (signal interactions) ↔ Topic K's Cluster D (scoring design) and Topic S/AB (Soham, Scoring & Report Design):** The most important, concrete deliverable this entire topic produces — recommend this be treated as a required input to finalizing the marketplace's severity/scoring logic, not an optional enrichment, directly implementing the "combinations are more interesting than a checklist" principle the user themselves identified as the core value of this research area.
- **Q5 (engagement-problem dataset) ↔ Topic K's answerability-testing design (mine) and Topic AB (Soham, likely report/UX-adjacent):** Flagged as this document's weakest-resolved point and a genuine open design question — recommend explicit discussion before Q5's methodology is finalized, likely via an LLM-as-first-time-visitor comprehension-proxy protocol structurally similar to Topic K's QA methodology.
- **Overall meta-note:** Unlike Topics C, D, E, and I (which each surfaced the recurring finding that many sub-topics collapse into few underlying mechanisms), Topic Q's sub-topics do **not** collapse in the same way — each of the 24 items here genuinely requires distinct methodological attention (different dataset, different confounder, different statistical treatment), because this topic operates one level up (research methodology) from the mechanism-level topics where that collapsing pattern was observed. This is itself a useful, disclosed observation about why Topic Q reads differently from every prior document in this project.
