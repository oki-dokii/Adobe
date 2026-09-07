# Topic H — Trust, Authority & Corroboration
**Researcher:** Harsh | **Research Area:** H — Trust, Authority & Corroboration (independent agreement, source diversity, provenance, E-E-A-T, reputation)
**Priority:** Very High

---

## 0. Framing — what Topic H is actually for

Topic H is not "get more backlinks" as trivia. It exists to answer one design question for the marketplace:

> **Given a factual claim a brand makes about itself, does independent evidence exist elsewhere that corroborates it — and, separately from whether corroboration exists, does an AI system's documented tendency to weight *volume* and *popularity* of corroborating evidence (rather than genuine independence) create a detectable, exploitable, or at least honestly-reportable gap between "well-corroborated" and "actually trustworthy"?**

Every sub-topic below is evaluated against that question, not against "is this interesting trust-signal trivia."

The master research map's F1–F10 (fact corroboration, source consistency, review presence, news mentions, third-party references, directory listings, authoritativeness, E-E-A-T signals, social proof, cross-domain consistency) and H1–H40 together form Topic H's raw subtopic list — 50 items. Following the same condense-and-focus approach used for Topic F, I am organizing this document around **four genuinely distinct investigation units** rather than fifty near-duplicate line items, because close reading of the raw list shows most of H1–H40 are restatements or sub-cases of a small number of underlying mechanisms:

1. **§1 — Corroboration volume vs. independence** (H3–H6, H24–H26, plus the master-list's F1–F2, F4–F6, F9–F10): does an AI system's demonstrated *volume/popularity* bias mean naive corroboration-counting is actively the wrong metric to build?
2. **§2 — Source-type credibility hierarchy** (H1–H2, H9–H19, plus F3, F7): given that not all corroborating sources are equal, what does the evidence say about *which* source types actually carry more weight, and is this checkable?
3. **§3 — E-E-A-T and the authority-signal mythology** (H27–H28, H39, plus F7–F8): what is actually documented about Google's E-E-A-T framework, and how does it differ from what the surrounding commercial content claims?
4. **§4 — Provenance, transparency, and conflicting-evidence resolution** (H29–H38, H40): does a brand's own on-page provenance/transparency function as a distinct, site-controlled trust signal, and what happens when corroborating sources actually disagree with each other or with the brand?

**Constraint from the handout, re-read carefully:** Appendix D states: "Machines tend to treat a fact as more trustworthy when many independent places say the same thing... A claim that lives in only one spot is fragile." Pulkit's Topic A document (A20) explicitly hands this exact mechanism off to Topic H, noting the GEO/retrieval literature identifies *that* multi-source corroboration matters but does not resolve *how* conflicting or unequal-quality sources get weighted — that gap is this document's central task.

---

## 1. FACT vs OBSERVATION vs HYPOTHESIS vs INFERENCE vs SPECULATION — global legend

Same legend as Pulkit's Topic A and my own Topic F documents, used identically here for cross-document consistency:
- **FACT** — documented by the vendor/standards body, or established in peer-reviewed/archival literature.
- **OBSERVATION** — reported by independent researchers/practitioners running real, methodologically transparent trials (not vendor-confirmed).
- **HYPOTHESIS** — our proposed testable claim, not yet validated by us.
- **INFERENCE** — reasonable derivation from FACT/OBSERVATION, one logical step removed.
- **SPECULATION** — plausible but unconfirmed; flagged, not built on.

**A note on source quality control that shaped this entire document, continuing the pattern established in Topic F.** Every search pass in this topic surfaced the same kind of unreliable commercial content already flagged in Topic F's Finding F-00 — but Topic H surfaced a genuinely new and more concerning variant worth naming explicitly: at least one source found in this research pass (groundingpage.com) is a page **structurally designed to be an AI-ingestible "fact page"** about Google's own Quality Rater Guidelines — it presents itself with metadata like "this page supports entity resolution, disambiguation and retrieval stabilization in AI-powered search and answer systems," essentially a content artifact built specifically to be picked up by the exact retrieval/corroboration mechanisms this topic studies. Separately, a "DollarPocket (2025)" correlation study claiming "E-E-A-T-related signals correlate with approximately 8% of ranking weight across all queries, jumping to roughly 24% for YMYL topics" appears in commercial content with no retrievable methodology, dataset, or independent confirmation — the same F-00 pattern of precise-sounding statistics with no verifiable source. **I am not building any detection logic on either of these**, and I flag the groundingpage.com case specifically because it is a preview of a genuinely new category of problem this document needs to address in its own right (see §1, Finding H-04): content deliberately engineered to game the exact corroboration mechanism a trust-and-authority audit is supposed to measure honestly.

---

## §1 — Corroboration volume vs. independence

### A. What we need to understand
The handout's own appendix states that machines treat a fact as more trustworthy when "many independent places say the same thing." The word doing the most work in that sentence is "independent." Does the peer-reviewed evidence show LLM/RAG systems actually detecting and weighting *independence*, or do they instead respond to raw *volume* and *popularity* of repetition — and if it's the latter, does that mean corroboration-counting is not just an imperfect proxy but an actively gameable, misleading one?

### B. Why it matters for the hackathon
This is the single highest-stakes methodological question in Topic H. If AI systems genuinely detect independence, then a corroboration-check skill should score *diversity of independent source types*. If AI systems instead respond to raw volume/popularity regardless of independence, then (a) a brand with many low-quality, non-independent mentions (e.g., syndicated press-release copies, directory listings pulling from the same feed) could appear "well-corroborated" to both our skill and the AI system it's modeling, while (b) our skill's *honest* design goal shifts from "does independent corroboration exist" to "does the AI's actual behavior make independence-based corroboration checking predictive of anything real" — a genuinely uncomfortable but important question the brief's "never assume correlation means causation" instruction requires us to confront directly rather than assume away.

### C. Current evidence
- **FACT (peer-reviewed, directly on point, the single most load-bearing citation in this entire document):** Xie et al. 2023 (cited extensively within Xu, Qi et al.'s comprehensive survey "Knowledge Conflicts for LLMs: A Survey," arXiv 2403.08319) directly tested how LLMs behave under inter-context conflict and found models "exhibit a predisposition towards emphasizing information related to entities of higher popularity and answers that are corroborated by a larger volume of documents within the given context." This is a directly documented, peer-reviewed finding: **volume of repetition and entity popularity are demonstrated behavioral biases in tested LLMs, described in these exact terms** — not merely "corroboration helps," but specifically *volume* and *popularity*, which are different things from *independence*.
- **FACT (peer-reviewed, the same survey, on a separate but related mechanism):** Jin et al. 2024a (also cited within the same survey) independently found that LLMs "favor evidence that appears most frequently within the context" — a second, independent confirmation of volume-sensitivity (as distinct from independence-sensitivity) in a different experimental setup.
- **FACT (peer-reviewed, directly on the "independence vs. volume" distinction, genuinely the most precise evidence available on this exact question):** Wan et al. 2024 (cited in the same survey, and separately corroborated by the survey's own text) investigated "the text features that affect LLMs' assessment of document credibility when faced with conflicting information" and found that "existing models heavily prioritize the relevance of a document to the query but often overlook stylistic features that humans consider important, such as the presence of scientific references or a neutral tone in the text." This is a direct, peer-reviewed finding that tested LLMs' credibility assessment does **not** reliably track markers a human evaluator would use to judge genuine source quality/independence — reinforcing that volume/relevance, not independence-markers, dominate.
- **FACT (peer-reviewed, directly on point, a second independent research group, adding a genuinely important nuance):** "Whose Facts Win? LLM Source Preferences under Knowledge Conflicts" (ACL 2026 / arXiv, Fioroni et al. and colleagues, a tightly-controlled evaluation of 13 open-weight LLMs using synthetic sources specifically designed to avoid inheriting the biases of any specific real-world source) found that **LLMs do show a genuine, measurable preference for institutionally-corroborated information** (their synthetic "government or newspaper source" type) **over information from people and social media** — this is a real, controlled, methodologically careful finding that source *type* does matter, which is an important complication: it is not simply "more volume wins regardless of source type." **However, the same paper found this source-type preference "can be reversed by simply repeating information from less credible sources"** — meaning volume can override type-based credibility preference given enough repetition. This is the single cleanest piece of evidence directly answering this unit's core question: **both mechanisms are real and in tension — source-type credibility is a genuine, measurable factor, but it is not robust; sufficient repetition/volume from lower-credibility sources can override it.**
- **INFERENCE, synthesizing the above:** the evidence supports a nuanced, non-binary answer to this unit's research question: naive corroboration-*counting* (raw number of mentions) is a documented behavioral driver in tested LLMs and therefore not a meaningless metric to model — but it is a metric that can be satisfied by *non-independent* repetition (syndicated content, directory-feed duplication, low-credibility-source volume), meaning a corroboration-check skill that only counts mentions, without any source-type/independence weighting, would be both (a) modeling a real bias and (b) simultaneously vulnerable to being gamed by exactly the kind of low-quality volume that the second paper shows can override type-based credibility. **The two evidenced mechanisms point toward the same practical design conclusion from different directions**: check both volume *and* source-type diversity, and treat "high volume, low type-diversity" (e.g., ten mentions, but all directory-listing syndication) as a distinct, lower-confidence corroboration profile from "moderate volume, high type-diversity" (e.g., four mentions, but spanning news, government, and independent industry sources).

### D. Important mechanisms
This is a genuine two-factor mechanism, not a single scale: **(1) volume/popularity bias** (Xie et al., Jin et al. — real, replicated across independent studies) operates largely independent of **(2) source-type credibility preference** (Whose Facts Win — real, but reversible by volume). A corroboration-check skill that collapses these into one score would misrepresent the evidence; they should be reported as two separate signals that combine into an overall confidence read, not a single number.

### E. Concrete website signals
This unit's evidence is about *AI system behavior* under conflict, not directly about *website* signals — the website-side signal is the input the corroboration-check skill assembles before that AI behavior would apply: (1) raw mention-volume count across the open web for a specific, checkable claim the brand makes about itself; (2) source-type diversity of those mentions (institutional/news/government vs. directory/social/user-generated, mapped onto the credibility-type distinction the Whose Facts Win paper actually tested); (3) whether the mentions are independently authored or traceable to a single syndicated origin (e.g., an identical press-release paragraph appearing verbatim across many "different" domains is volume without independence).

### F. How the signal could be detected automatically
Hybrid, deterministic-first, bounded by the 5-minute runtime: (1) deterministic — extract a small set of specific, checkable claims from the brand's own site (the same claim taxonomy discussed in relation to Topic P's cross-web consistency work: pricing, founding facts, leadership, specific quantitative claims); (2) deterministic — for each claim, run a bounded web search and classify each returned mention by domain type (news/government/.edu vs. directory/aggregator vs. social/forum vs. brand's own other properties) using domain-pattern heuristics; (3) deterministic — flag near-verbatim text matches across multiple "independent" mentions as a syndication/non-independence signal, lowering the effective independence-weighted score even if raw volume is high; (4) escalate to a single LLM semantic check only for genuinely ambiguous source-type classification (e.g., a niche industry publication that isn't obviously news/government/directory).

### G. What evidence the skill should report
For each checked claim: raw mention-volume count; source-type breakdown (how many of each category); a flagged syndication/duplication ratio if near-verbatim text is detected across sources; and — critically, per the "two separate signals" design in §D — the report should present volume and type-diversity as **two distinct sub-scores**, not one collapsed number, with an explicit note when the two disagree (e.g., high volume but low type-diversity/high syndication ratio).

### H. Possible severity logic
- **This unit does not itself generate severity for a "defect"** — it is a corroboration-*strength* assessment, not a pass/fail check, and should be framed accordingly (a low-corroboration finding is informational context, not a hard defect, per the false-positive guardrails established throughout this document).
- A brand with **zero independent, diverse-type corroboration** for a claim it makes prominently on its own site (e.g., a specific, checkable statistic with no independent confirmation anywhere) is a genuine, reportable finding — the claim exists in exactly the "fragile, lives in only one spot" state the handout's own appendix warns about.
- A brand with **high volume but low type-diversity/high syndication** should be reported as a distinct, lower-confidence profile — not treated as equivalent to genuine diverse corroboration, and not treated as a defect either (syndicated press coverage is often entirely legitimate) — simply reported honestly as what the evidence shows it is.

### I. Correct remediation
Where a checkable claim has genuinely no independent corroboration: pursue coverage from a source *type* the evidence shows carries more weight (institutional/news/government per the Whose Facts Win finding) rather than simply pursuing more mentions of any kind, since the evidence shows type matters even though it can be overridden by volume. Where high volume is entirely syndicated/non-independent: this is not necessarily something to "fix" (syndicated press coverage is often a legitimate PR outcome) but should not be reported to the brand as if it were equivalent to genuine independent corroboration.

### J. False-positive cases
A genuinely new or niche company will have low corroboration volume through no fault of its own — this must never be scored as a "corroboration failure" in the way the brief explicitly warns against ("no backlink = failure" is the brief's own named forbidden pattern, and this is structurally the same error). Severity/confidence language must be conditioned on company age/category (a hook to Topic V, site-type differentiation), and absence of corroboration for a claim that is genuinely new (e.g., a very recent product launch) is expected, not a defect.

### K. False-negative risks
A bounded, single-pass web search for corroboration is a snapshot, not exhaustive — genuine corroboration could exist in sources our search doesn't surface within the time budget (e.g., paywalled news archives, non-English-language coverage for a claim that's genuinely corroborated internationally). This composes with the same language/locale limitation flagged throughout Topic F's collision-detection units.

### L. Counterexamples
The Whose Facts Win paper's own finding that volume can override type-based credibility preference is itself a counterexample to any naive assumption that "quality sources always beat quantity" — meaning a skill's confidence language should not overstate how robust source-type weighting actually is, since the evidence shows it is a real but reversible effect, not an absolute hierarchy.

### M. Does this generalize across site types?
The underlying mechanism (volume bias + reversible type-credibility preference) is a general LLM behavioral finding, not site-type-specific, so it applies universally. The *practical corroboration profile* a brand can realistically achieve varies enormously by site type and size (a large public company vs. a solo local business), meaning severity/expectation calibration must be site-type-conditioned even though the underlying mechanism is universal.

### N. Candidate skill(s)
**`cross-source-corroboration-check`** — the primary detection skill for this unit, reporting volume and type-diversity as separate sub-scores per §G, explicitly avoiding a single collapsed "corroboration score."

### O. Relationship to other potential skills
Directly answers the evidence gap Pulkit's Topic A document (A20) explicitly flagged and handed off ("conflicting-fact resolution mechanics... not directly documented by any vendor and not covered by the papers I found") — this unit supplies the missing mechanism (volume/popularity bias, and its interaction with source-type credibility) with genuine peer-reviewed backing. Composes with Topic F's `entity-identity-audit` (strong independent corroboration can mitigate entity-collision severity, per Topic F §F41–F46 note L) and with Topic P (cross-web consistency — the same web-search infrastructure used to check consistency can supply corroboration-volume/type data, and these two checks should likely share a crawl pass rather than duplicating web searches).

---

## §2 — Source-type credibility hierarchy

### A. What we need to understand
Given §1's finding that source *type* is a genuine (if reversible) factor in LLM credibility assessment, what does the evidence say about the *specific* hierarchy — which source types actually carry more weight, and is this something a website audit can meaningfully act on, given that the brand being audited usually doesn't control which third-party source types cover it?

### B. Why it matters
This determines whether a corroboration-check skill's remediation advice ("pursue coverage from higher-credibility source types") is actionable guidance or an empty platitude — a brand can't simply will a government agency to mention it, so this unit needs to be honest about what is and isn't within a brand's practical control.

### C. Current evidence
- **FACT (peer-reviewed, directly on point, primary source for this entire unit):** the Whose Facts Win paper (§1 above) is the single cleanest, most methodologically careful source on this exact question — a **controlled, synthetic-source study specifically designed to avoid inheriting the biases of real-world sources**, testing 13 open-weight LLMs and finding a genuine preference for **institutionally-corroborated information (government or newspaper-type sources) over information from people and social media.** This is a rare case in this research area of a study designed with exactly the right methodology to isolate the variable in question (source type, independent of confounds like a specific real source's actual reputation or writing style).
- **FACT (peer-reviewed, general convergent evidence from a different research tradition):** the broader knowledge-conflicts survey (arXiv 2403.08319, §1 above) separately reports that Wan et al. 2024 found LLMs "heavily prioritize... relevance" over "stylistic features that humans consider important, such as the presence of scientific references or a neutral tone" — this is a partially *contradictory* nuance worth surfacing honestly: it suggests LLMs may be *less* sensitive to some human-legible credibility markers (citations, neutral tone) than a human evaluator would be, even while (per Whose Facts Win) still showing genuine source-*type* sensitivity. These two findings are not strictly contradictory (type and stylistic markers are different things) but they do suggest the credibility-assessment mechanism is uneven — sensitive to some credibility signals, less sensitive to others a human would expect to matter.
- **Google's own documented framework, directly relevant but requiring careful handling (see §3 below for full treatment):** Google's Search Quality Rater Guidelines formalize a human-rater source-hierarchy-adjacent framework (E-E-A-T) that has partial conceptual overlap with the "institutional vs. social/UGC" distinction tested in Whose Facts Win, but — critically, per the primary documentation itself — **E-E-A-T is explicitly, repeatedly stated by Google to not be a direct ranking factor**; it trains human raters whose aggregated judgments feed into algorithm development, not a scored input applied to individual pages. This distinction matters enormously for this unit and is treated fully in §3.
- **INFERENCE:** combining the Whose Facts Win finding (institutional/news-type sources are genuinely preferred, though reversibly) with the practical reality that a brand cannot directly control third-party coverage, the actionable version of this finding is narrower than "get better press" — it is: **when a brand has a choice about how to supply corroborating information about itself (e.g., which channels to prioritize for outreach, which third-party listings to prioritize claiming/updating), the evidence supports prioritizing institutional/news/government-adjacent channels over social/UGC channels, all else equal** — but this is guidance about *prioritization under limited effort*, not a claim that social/UGC corroboration is worthless (per §1, sufficient volume can still matter).

### D. Important mechanisms
The source-type hierarchy is a **real but bounded and reversible** signal, not an absolute rule — this must be communicated with the same epistemic care as every other finding in this document. It is also a signal largely **outside direct site-owner control** (a brand's own website cannot manufacture a government citation), which changes what kind of finding this can generate: not "your site is missing X," but rather "the corroborating evidence that exists for your brand skews toward [type], which the evidence suggests is [more/less] robust than [type]" — an honest, informational finding rather than a prescriptive defect.

### E. Concrete website signals
Same underlying data collection as §1 (the corroboration-check skill's web-search pass) — this unit adds the source-*type classification* dimension as the primary lens rather than raw volume.

### F. How the signal could be detected automatically
Shares infrastructure with §1 — see that unit's §F. The type-classification step (domain-pattern heuristics distinguishing institutional/news/government from directory/social/UGC) is the component specific to this unit.

### G. What evidence the skill should report
The type-breakdown component of §1's report — same underlying data, viewed through the type-hierarchy lens rather than the volume lens.

### H. Possible severity logic
Not independently scored — this unit refines §1's type-diversity sub-score rather than generating a separate finding.

### I. Correct remediation
Framed as prioritization guidance, not a defect-fix: where a brand has active outreach/PR capacity, the evidence supports prioritizing institutional/news-type coverage opportunities over purely social/UGC ones, while being explicit that this is a "where evidence points, given limited effort," not "social/UGC corroboration doesn't count."

### J. False-positive cases
A brand's corroborating evidence skewing toward social/UGC sources (e.g., a consumer product with heavy genuine customer review presence but little press coverage) is not a defect — many legitimate, successful businesses are primarily corroborated this way, and the finding must not imply this is a problem to fix, only inform the brand of what the broader evidence suggests about relative signal strength.

### K. False-negative risks
Domain-pattern-based type classification is a heuristic and will misclassify some sources (a well-regarded independent industry publication might pattern-match as neither clearly "news" nor clearly "directory") — escalation to LLM judgment (per §1 §F) partially mitigates but doesn't eliminate this.

### L. Counterexamples
The reversibility finding from Whose Facts Win itself is the direct counterexample to treating this hierarchy as absolute — a brand with very high volume from lower-type-hierarchy sources may still achieve strong practical corroboration effect despite the type-hierarchy pointing the other way.

### M. Generalizes?
The mechanism generalizes universally; the practically achievable source-type mix varies enormously by industry and site type (a government contractor will naturally accumulate government-adjacent mentions a consumer app never will) — severity/expectation calibration is site-type-dependent even though the underlying evidence is general.

### N. Candidate skill(s)
Folds into **`cross-source-corroboration-check`** as the type-classification refinement of §1's core detection logic — not a standalone skill.

### O. Relationship to other potential skills
Directly composes with §1 (shares detection infrastructure) and with §3 below (must not be conflated with, or presented to the user as, "E-E-A-T optimization," given §3's finding that E-E-A-T itself is not a direct ranking mechanism).

---

## §3 — E-E-A-T and the authority-signal mythology

### A. What we need to understand
"E-E-A-T" (Experience, Expertise, Authoritativeness, Trustworthiness) is one of the most commonly invoked terms in the surrounding SEO/GEO commercial content this document has repeatedly flagged as unreliable. What does Google's own primary documentation actually say E-E-A-T is and does, and how far does that diverge from how the term is used in the commercial content this hackathon's source material warns us against uncritically absorbing?

### B. Why it matters for the hackathon
This is a load-bearing methodological check for the entire marketplace, not just Topic H: "E-E-A-T" is likely to appear as a justification in other teammates' research (it's explicitly named in the master research map under multiple topics, including within Topic F's own raw F7–F8 items). Getting the primary-source facts right here, once, properly sourced, prevents the whole project from inheriting a common but documented mischaracterization.

### C. Current evidence
- **FACT (Google, first-party, direct, the single most important and clearest fact in this entire document):** Google's own Search Quality Rater Guidelines blog post states plainly and directly: **"these guidelines are what are used by our search raters to help evaluate the performance of our various search ranking systems, and they don't directly influence ranking."** This is an unambiguous, first-party, repeatedly-reiterated statement. E-E-A-T is not a score applied to individual pages; it is a framework used by human raters whose aggregated assessments (not individual page scores) are used to evaluate and refine Google's automated ranking *systems* — an indirect, systemic feedback mechanism, not a per-page ranking input.
- **FACT (Google, first-party, direct):** Google's "Creating Helpful, Reliable, People-First Content" documentation states directly that "search raters have no control over how pages rank" and "rater data is not used directly in our ranking algorithms." Again unambiguous and repeated across multiple Google-authored pages, not a one-off statement.
- **FACT (Google, first-party, on the actual current framework):** the current framework is **E-E-A-T** (Experience, Expertise, Authoritativeness, Trust), with "Experience" added in December 2022 as a distinct pillar from "Expertise" specifically to give weight to firsthand/lived experience with a topic or product, separate from formal credentials — this is a genuine, documented evolution of the framework worth being precise about (many older commercial sources still refer only to "E-A-T").
- **FACT (Google, first-party, on scope):** E-E-A-T is applied with particularly high standards for **YMYL ("Your Money or Your Life") topics** — content that could impact a person's health, financial stability, safety, or society's welfare — a formally defined category within the Quality Rater Guidelines, meaning E-E-A-T's practical relevance is not uniform across all site types and topics; it is explicitly weighted higher for a defined, narrower category.
- **OBSERVATION, converging across independent secondary sources but consistent with (not contradicting) the primary-source facts above:** multiple independent secondary summaries (a peer-reviewed-adjacent academic paper analyzing the E-A-T model and QRG, and several practitioner explainers) consistently characterize the practitioner-community consensus accurately: E-E-A-T is "controversial in SEO circles" regarding its indirect influence, cannot be directly "optimized for" in the way a title tag can, and functions as what one source aptly calls "a quality compass, not a ranking lever." This OBSERVATION-tier characterization is consistent with, not contradicting, the FACT-tier primary-source statements above — a rare case in this research area where the secondary commentary is actually careful and accurate rather than overclaiming.
- **OBSERVATION, explicitly downgraded (source-quality note applies in full, a direct case study in the pattern flagged throughout this document):** a "DollarPocket (2025)" correlation study claiming precise E-E-A-T-to-ranking-weight percentages ("approximately 8% of ranking weight across all queries... roughly 24%" for YMYL) appears with no retrievable methodology, dataset, or independent replication — **directly contradicting** the primary-source fact that E-E-A-T is not a scored, weighted ranking input at all. This is not a minor imprecision; it is a specific, quantified claim that is incompatible with Google's own repeated, direct statements about how the framework actually functions. **I am rejecting this claim outright, not merely downgrading it**, and flag it as a clean example of exactly the F-00/H-04 pattern: a fabricated-sounding precise statistic contradicting primary-source documentation.

### D. Important mechanisms
The correct, evidence-grounded way to use E-E-A-T in this marketplace's skill design is as a **conceptual organizing framework for what *kinds* of on-page and cross-web signals are worth checking** (does content show genuine firsthand experience/expertise, is authorship/provenance transparent, does independent corroboration exist) — **not** as a claimed direct ranking or citation mechanism, and never described to the end user as something that can be "optimized for" as a discrete, scoreable target. This directly parallels and reinforces Topic F's Finding F-02 (structured data as reinforcement/context, not a proven independent citation-boosting lever) — E-E-A-T should receive the identical epistemic treatment.

### E. Concrete website signals
E-E-A-T itself is not directly detectable as a score — but its **component concepts**, each separately evidenced elsewhere in this document, are: author/provenance transparency (→ §4 below), independent corroboration (→ §1), and — a distinct concept not otherwise covered in this document — **demonstrated firsthand experience markers** (specific, concrete, first-person-verifiable details vs. generic claims), which is closer to a content-quality signal (Topic J territory, per the master research map's own note that "first-hand experience" and "specific examples" appear under Topic J, not Topic H) than a trust-and-authority signal per se.

### F. How the signal could be detected automatically
Not a standalone detection routine — this unit's primary output is **negative/corrective**: preventing the marketplace's skills (this one and others) from mischaracterizing E-E-A-T as a direct, scoreable ranking or citation mechanism in their documentation, findings language, or remediation advice.

### G. What evidence the skill should report
Where E-E-A-T-adjacent concepts are referenced in `cross-source-corroboration-check`'s or `entity-identity-audit`'s output, the language should be scoped to the specific underlying signal actually being measured (corroboration volume/type, provenance transparency) rather than invoking "E-E-A-T" as if it were itself a measured or scored quantity.

### H–L.
Not applicable as a standalone severity/false-positive/counterexample analysis — this unit is methodological, informing how other units' findings are worded, not generating its own findings.

### M. Generalizes?
The methodological correction generalizes across the entire marketplace, not just Topic H — any skill (in any topic) that invokes E-E-A-T should be held to the same primary-source-grounded standard established here.

### N. Candidate skill(s)
None standalone — informs confidence/remediation language in `cross-source-corroboration-check` and should be flagged to Pulkit and Soham given E-E-A-T's appearance across multiple raw master-list topics beyond Topic H alone.

### O. Relationship to other potential skills
Directly parallel to Topic F's Finding F-02 (same epistemic pattern: a real, documented framework/mechanism whose *existence* is fact but whose *causal directness* is overclaimed in commercial content) — recommend these two findings be cited together in the Combine phase as the marketplace's two clearest worked examples of the evidence-hierarchy discipline the whole team should apply.

---

## §4 — Provenance, transparency, and conflicting-evidence resolution

### A. What we need to understand
Two related but distinct questions: (1) does a brand's own on-page provenance and transparency (author identification, sourcing of its own claims, ownership/contact transparency) function as a genuine, site-controlled trust signal distinct from external corroboration? (2) When corroborating sources actually *disagree* with each other or with the brand's own claims — not merely "corroboration is absent" but "corroboration is contradictory" — what does the evidence say happens, and is this a distinctly detectable, higher-severity case than simple absence of corroboration?

### B. Why it matters
Question (1) is fully within a brand's own control, unlike most of §1–§3, making it high-leverage remediation. Question (2) is a genuinely different failure mode from "no corroboration" — contradictory corroboration is closer to Topic F's entity-collision mechanism (a specific, higher-severity misattribution risk) than to simple absence, and deserves distinct treatment rather than being folded into a generic "low corroboration" bucket.

### C. Current evidence
- **On provenance/transparency (question 1):** this connects directly to the E-E-A-T "Trustworthiness" pillar's documented components (§3) — Google's own QRG materials describe transparency about site purpose, ownership, and sourcing as part of what human raters assess, though (per §3's core finding) this is rater-training material, not a direct per-page ranking input. The more directly useful evidence here is architectural: because retrieval-based AI systems (per Pulkit's Topic A findings) fetch and read actual page content rather than consulting a rater's judgment, a brand's own transparent sourcing/authorship is at minimum a plain-text signal available to any system reading the page directly, independent of whatever indirect effect it may or may not have via Google's rating pipeline specifically.
- **On conflicting corroboration (question 2), FACT, peer-reviewed, directly on point:** the knowledge-conflicts survey (arXiv 2403.08319) formally categorizes exactly this scenario as **"inter-context conflict"** — conflict among multiple pieces of retrieved contextual knowledge, as distinct from conflict between context and the model's own parametric memory ("context-memory conflict") or inconsistency within the model's own memory across different phrasings ("intra-memory conflict"). This three-way taxonomy is a directly useful, evidence-grounded framework: a brand whose corroborating sources disagree with each other is triggering "inter-context conflict" specifically, a formally studied category with its own documented behaviors, distinct from the "brand is simply under-corroborated" case.
- **FACT (peer-reviewed, on model behavior under inter-context conflict specifically):** the same survey reports that detecting/resolving inter-context conflict is a **demonstrated weakness** across tested models — citing findings that contradiction-detection between documents is "a significant challenge," and that when models manage to detect a conflict exists, they "struggle to determine the specific conflicting segments and produce a response with distinct answers amidst conflicting information" (Wang et al., cited within the survey). This directly parallels Topic F's WhoQA finding (models often fail to cleanly resolve conflicting information, sometimes silently) but for the *source-disagreement* case rather than the *entity-collision* case specifically — a structurally similar failure mode with a different root cause.
- **FACT (peer-reviewed, directly on point for a genuinely important nuance — misinformation persistence):** the same survey reports (Pan et al. 2023a, cited within) that models are demonstrably susceptible to fabricated information inserted into an otherwise-authentic corpus, "irrespective of whether the fake articles are manually crafted or generated by models" — meaning a single contradictory or false third-party source is not necessarily "diluted away" by surrounding accurate corroboration; contamination is a real, evidenced risk, not merely a volume-weighted average.
- **INFERENCE:** combining §1's volume/type-bias findings with this unit's inter-context-conflict findings, a brand facing *actively contradictory* third-party information (e.g., an outdated directory listing with wrong facts, a defunct old domain still indexed with stale claims) is in a measurably worse-evidenced position than a brand with merely *sparse* corroboration — the former is a documented trigger for a formally studied conflict category with demonstrated resolution failures; the latter is comparatively less severe (absence, not active contradiction). This distinction should be reflected in severity logic: **contradictory corroboration should score as a higher-severity, more specific finding than simply low corroboration volume**, and the report should identify which specific case applies rather than reporting both as generically "low trust."

### D. Important mechanisms
This unit surfaces a genuinely important root-cause distinction the brief's own worked example (JS-only pricing) doesn't cover but which follows the same "one connected diagnosis" principle: **"low corroboration" and "contradictory corroboration" are mechanistically different problems** (absence vs. active conflict) requiring different remediation (pursue more corroboration vs. correct/update the specific contradicting source) and warranting different severity treatment (the peer-reviewed evidence supports contradiction being the more severe, more specifically diagnosable case).

### E. Concrete website signals
For provenance: presence of author bylines with identifiable credentials on claim-heavy content, clear ownership/contact/about-page transparency, and — specifically distinguishing this from Topic F's entity-identity work — whether *claims* (not just entity identity) cite their own sourcing (data provenance, dated "as of" markers on time-sensitive claims). For conflicting corroboration: during the same web-search pass used in §1, detect when returned third-party sources state a **materially different value** for the same checkable claim the brand makes (not just "absent," but "different"), distinguishing this from simple absence.

### F. How the signal could be detected automatically
For provenance: deterministic — check for author-attribution markup/bylines on substantive content pages, presence of "about"/ownership/contact transparency, and dated sourcing language near claim-heavy statements (numbers, statistics). For conflicting corroboration: deterministic extraction of the specific claim value from each third-party source found during §1's search pass, compared against the brand's own stated value — flag *material* discrepancies (using the same claim-taxonomy discipline recommended for Topic P's general cross-web consistency work, distinguishing decision-relevant discrepancies from trivial phrasing/formatting differences) rather than any textual difference.

### G. What evidence the skill should report
For provenance: presence/absence of author attribution, ownership transparency, and claim-sourcing, with location. For conflicting corroboration: the specific claim, the brand's stated value, the contradicting third-party value(s) and source(s), and — where determinable — which appears more current/authoritative, directly reusing the "directionality" reporting principle recommended for Topic P's cross-source-fact-consistency work.

### H. Possible severity logic
- **Medium-High:** a checkable claim has **actively contradictory** third-party corroboration (not merely absent) — per §C's evidence that this is a distinctly harder, more specifically diagnosable failure mode than simple sparsity.
- **Low-Medium:** a claim-heavy page lacks basic provenance/sourcing transparency (author attribution, dated claims) — cheap to fix, fully within site control.
- **Low/Informational:** simple absence of corroboration for a claim, especially where independent notability signals are weak (per the false-positive guardrail established in §1 and reinforced by Topic F's F37–F40 treatment of the identical principle for KG absence).

### I. Correct remediation
For contradictory corroboration: correct or request correction of the specific contradicting source where the brand's own site is verifiably more current/accurate (directly paralleling Topic F's F37–F40 remediation logic for mismatched external KG profiles); for provenance gaps: add author attribution, ownership transparency, and dated sourcing to claim-heavy pages — cheap, fully site-controlled fixes.

### J. False-positive cases
Not every third-party discrepancy is a "conflict" worth flagging — legitimate variation (regional pricing, different snapshot dates, rounding) must be filtered using the same claim-taxonomy discipline recommended for Topic P, or this unit will reproduce exactly the "one outdated statement = globally stale website" false-positive trap the brief explicitly warns against. A brand with no visible author bylines is not automatically untrustworthy — many entirely legitimate organizational/institutional sites (not blogs or personal brands) don't use bylines as a convention, and this should be scored as a minor, optional improvement, not a defect, absent other evidence of a problem.

### K. False-negative risks
The bounded web-search pass may miss genuinely contradictory sources that don't surface in a time-boxed query (paywalled, non-English, or simply lower-ranked in search results) — a "no contradiction found" result should be reported as "no contradiction found within search scope," not "no contradiction exists."

### L. Counterexamples
A brand's own site being factually wrong while third-party sources are correct is the mirror-image case this detection logic must handle symmetrically — the directionality analysis (§G) must not assume the brand's own site is always the ground truth; the report should present the discrepancy and available evidence for which side is more current/authoritative without presupposing the brand is correct.

### M. Generalizes?
Yes, fully — the inter-context-conflict mechanism and the provenance-transparency check are both general, site-type-agnostic mechanisms, though (as elsewhere) the practical likelihood of triggering the contradictory-corroboration case scales with how much third-party coverage a brand has at all (a very small/new brand is less likely to have this specific problem simply because it has less third-party coverage of any kind to conflict).

### N. Candidate skill(s)
The provenance-transparency check folds into **`cross-source-corroboration-check`** as a site-controlled sub-check; the conflicting-corroboration detection is the most tightly-coupled sub-check with Topic P and should likely be implemented as shared infrastructure (see §O).

### O. Relationship to other potential skills
The conflicting-corroboration mechanism is nearly identical in shape to Topic P's general cross-source-fact-consistency work and to Topic F's F37–F40 external-KG-consistency check — all three are instances of the same underlying "compare a brand's own claim against an independently-sourced claim and report directionality" pattern. Strong recommendation for the Combine phase: implement this comparison logic **once**, as shared infrastructure, called by `entity-identity-audit` (F37–F40), `cross-source-corroboration-check` (this unit), and whatever skill Topic P produces — building it three times would directly contradict the brief's stated preference for genuine separation of concerns over accidental duplication.

---

## 2. Findings register (structured, per the required format)

---
**FINDING ID:** H-01
**Researcher:** Harsh
**Research Area:** H — Trust, Authority & Corroboration
**Research Question:** §1 — does corroboration function as a volume signal, an independence signal, or both, in tested LLM behavior?
**Observation:** Multiple independent peer-reviewed studies converge on a two-factor answer: LLMs show a documented behavioral bias toward higher-volume, higher-popularity corroborated information (Xie et al. 2023, Jin et al. 2024a), while a separately controlled, synthetic-source study finds a genuine but *reversible* preference for institutionally-corroborated (news/government-type) sources over social/UGC sources, with the preference reversible by sufficient repetition from lower-credibility sources (Whose Facts Win, ACL 2026).
**Evidence:** Xu, Qi et al., "Knowledge Conflicts for LLMs: A Survey," arXiv 2403.08319 (citing Xie et al. 2023, Jin et al. 2024a, Wan et al. 2024 within); "Whose Facts Win? LLM Source Preferences under Knowledge Conflicts," ACL Anthology 2026.acl-long.1357 / arXiv, 13 open-weight LLMs tested with synthetic sources.
**Sources:** See §1 §C.
**Pattern:** Naive corroboration-*counting* (raw mention volume) is a documented behavioral driver, but is satisfiable by non-independent repetition (syndication, directory duplication); source-*type* credibility is a real, separate, evidenced factor, but not robust to sufficient volume from lower-credibility sources.
**Counterexamples:** The reversibility finding itself is the built-in counterexample to over-trusting the type-hierarchy — high volume from lower-tier sources can still dominate.
**Hypothesis:** A corroboration-check skill reporting volume and type-diversity as two separate sub-scores (rather than one collapsed number) more honestly represents this evidenced two-factor mechanism than any single "corroboration score."
**Signal:** Mention-volume count per checkable claim; source-type classification (institutional/news/government vs. directory/social/UGC) per mention; syndication/near-duplicate-text detection across "independent" mentions.
**How to Detect:** Deterministic bounded web search + domain-pattern type classification + near-duplicate text detection; escalate ambiguous type classifications to a single LLM check.
**Evidence Output:** Volume sub-score, type-diversity sub-score, syndication-ratio flag, reported separately per claim.
**False Positives:** New/niche brands with low volume through no fault of their own must never be scored as a "corroboration failure"; must condition severity on company age/category.
**False Negatives:** Bounded, single-locale, single-language search is a snapshot; genuine corroboration in paywalled/non-English/lower-ranked sources may be missed.
**Severity:** Informational/contextual by default; not a pass/fail defect check.
**Recommended Fix:** Where a brand has active outreach capacity, prioritize institutional/news-type coverage per the evidenced (if reversible) type-hierarchy; do not treat social/UGC-skewed corroboration as inherently deficient.
**Generalization:** High — underlying mechanism is a general LLM behavioral finding, not site-type-specific; practical achievable corroboration profile varies by site type/size, requiring severity calibration per Topic V.
**Candidate Skill:** `cross-source-corroboration-check`
**Related Skills:** Topic F (`entity-identity-audit` — corroboration mitigates collision severity), Topic P (shared web-search infrastructure), Pulkit's Topic A (A20 handoff, directly answered here).
**Confidence:** HIGH (the underlying two-factor mechanism, evidenced by multiple independent peer-reviewed studies) / MEDIUM (precise thresholds for what counts as "sufficient" volume to override type-hierarchy, which the evidence shows is real but doesn't quantify precisely enough for our detection thresholds).

---
**FINDING ID:** H-02
**Researcher:** Harsh
**Research Area:** H — Trust, Authority & Corroboration
**Research Question:** §3 — is E-E-A-T a direct ranking/citation mechanism, as widely implied in commercial content, or something narrower?
**Observation:** Google's own, repeated, first-party documentation states directly and unambiguously that E-E-A-T is a rater-training framework whose aggregated judgments inform algorithm development, and that individual rater assessments do not directly influence individual page rankings. A specific commercial claim quantifying E-E-A-T's "ranking weight" (8% overall, 24% for YMYL, attributed to an unretrievable "DollarPocket 2025" study) directly contradicts this primary-source fact and is rejected outright, not merely downgraded.
**Evidence:** developers.google.com/search/blog/2022/12/google-raters-guidelines-e-e-a-t; developers.google.com/search/docs/fundamentals/creating-helpful-content; Google Search Quality Rater Guidelines (services.google.com/fh/files/misc/hsw-sqrg.pdf).
**Sources:** See §3 §C.
**Pattern:** A real, well-documented Google framework (E-E-A-T) is systematically overclaimed in commercial content as a direct, scoreable ranking mechanism, when Google's own primary documentation repeatedly and explicitly states the opposite — directly parallel to Topic F's Finding F-02 pattern (structured data/schema completeness similarly overclaimed relative to primary-source documentation).
**Counterexamples:** E-E-A-T is not *meaningless* — it is a real, documented, actively-maintained framework (most recently updated with an "Experience" pillar in Dec 2022, and further AI Overview-specific evaluation guidance in a Sept 2025 revision per secondary sources) that genuinely shapes which qualities Google's automated systems are *designed* to reward, even though it is not itself a scored per-page input.
**Hypothesis:** Any marketplace skill (in this or other topics) that invokes "E-E-A-T" should use it only as a conceptual organizing label for genuinely separately-evidenced component signals (corroboration, provenance, demonstrated experience), never as a claimed direct scoring/ranking mechanism in its own right.
**Signal:** N/A — this is a methodological/language-discipline finding, not a website signal.
**How to Detect:** N/A.
**Evidence Output:** Governs remediation/finding language elsewhere in this document and should govern it across the marketplace.
**False Positives:** N/A.
**False Negatives:** Risk of under-crediting E-E-A-T's genuine indirect, systemic influence by being *too* dismissive — the correct position is "real framework, indirect mechanism," not "irrelevant."
**Severity:** N/A (methodological finding).
**Recommended Fix:** N/A directly.
**Generalization:** Applies across the whole marketplace's research and skill-documentation language, not just Topic H.
**Candidate Skill:** Governs language in `cross-source-corroboration-check`; no standalone skill.
**Related Skills:** Directly parallel to Topic F's Finding F-02; flag to Pulkit and Soham given E-E-A-T's appearance across multiple raw master-list topics.
**Confidence:** HIGH — based on repeated, unambiguous, first-party Google statements, not inference.

---
**FINDING ID:** H-03
**Researcher:** Harsh
**Research Area:** H — Trust, Authority & Corroboration
**Research Question:** §4 — is "contradictory corroboration" (third-party sources actively disagreeing with the brand or each other) a distinct, more severe failure mode than simple "low corroboration" (absence)?
**Observation:** The knowledge-conflicts literature formally categorizes disagreement-among-retrieved-sources as "inter-context conflict," a distinct, separately-studied category from simple information absence, with documented model weaknesses in detecting and cleanly resolving such conflicts, and documented susceptibility to contamination by even a single fabricated/incorrect source within an otherwise-accurate corpus.
**Evidence:** Xu, Qi et al., "Knowledge Conflicts for LLMs: A Survey," arXiv 2403.08319 (inter-context conflict taxonomy; Wang et al. and Pan et al. 2023a findings cited within).
**Sources:** See §4 §C.
**Pattern:** "No corroboration found" and "contradictory corroboration found" are mechanistically different problems with different evidenced severity and different remediation — this document's severity logic (§4 §H) explicitly separates them rather than collapsing both into a generic "low trust" bucket.
**Counterexamples:** Not every third-party discrepancy is a genuine conflict — legitimate variation (regional pricing, snapshot-date differences) must be filtered by claim-taxonomy discipline before being treated as "inter-context conflict" in the sense this literature means, or the check will reproduce the brief's named "one outdated statement = globally stale website" false-positive trap.
**Hypothesis:** A checkable claim with actively contradictory third-party corroboration should score higher severity than the same claim with simply absent corroboration, and the skill should report which specific case applies rather than a single "low trust" verdict.
**Signal:** Material-value discrepancy between the brand's stated claim and an independently-sourced claim for the same fact (as distinct from mere absence of any independent mention).
**How to Detect:** Deterministic claim-value extraction from both the brand's site and third-party sources found during the corroboration search pass, compared using the same claim-taxonomy/materiality discipline recommended for Topic P.
**Evidence Output:** The specific claim, brand's value, contradicting value(s) and source(s), and directionality assessment (which appears more current/authoritative) where determinable.
**False Positives:** Trivial phrasing/formatting/snapshot-date differences must not be flagged as "conflict"; requires the same materiality filtering as Topic P's cross-source-consistency work.
**False Negatives:** Bounded search may miss genuinely contradictory sources outside its scope; "no contradiction found" must be reported as scope-limited, not as "no contradiction exists."
**Severity:** Medium-High for genuine, material contradiction; Low/Informational for simple absence.
**Recommended Fix:** Correct or pursue correction of the specific contradicting source where the brand is verifiably more current; the directionality analysis must not presuppose the brand's own site is always correct.
**Generalization:** High — the mechanism is general; practical likelihood of triggering this specific case scales with how much third-party coverage exists at all.
**Candidate Skill:** Shared infrastructure across `cross-source-corroboration-check` (this topic), `entity-identity-audit` (Topic F, F37–F40), and Topic P's cross-source-consistency work — explicitly recommended to be built once, not three times.
**Related Skills:** Topic F (F37–F40), Topic P (cross-web consistency, directly overlapping mechanism).
**Confidence:** HIGH (the formal conflict taxonomy and documented model weaknesses are well-evidenced) / MEDIUM (how precisely to calibrate the severity gap between "absent" and "contradictory" without a study directly measuring brand-reputation-specific instances of this distinction).

---
**FINDING ID:** H-04
**Researcher:** Harsh
**Research Area:** H — Trust, Authority & Corroboration
**Research Question:** Meta-finding — beyond the general unreliable-commercial-content pattern already flagged in Topic F (Finding F-00), does Topic H's research surface a *new*, more specific risk: content deliberately engineered to game the corroboration/retrieval mechanisms this topic studies?
**Observation:** At least one source encountered in this research pass (groundingpage.com) is not merely low-quality commercial content but a page structurally designed and self-described as built "to support entity resolution, disambiguation and retrieval stabilization in AI-powered search and answer systems" — i.e., a content artifact purpose-built to be machine-ingested by the exact mechanisms a corroboration-and-trust audit is meant to evaluate honestly.
**Evidence:** groundingpage.com "Google Search Quality Rater Guidelines" fact page, encountered during this research pass's search results.
**Sources:** Direct observation of the source's own self-described metadata/purpose.
**Pattern:** Beyond simply unreliable commercial content (F-00's pattern), there exists a further category of content specifically engineered to be picked up as "corroboration" by retrieval/AI systems — meaning a corroboration-volume signal could in principle be inflated by content that exists *for the purpose of* being counted as corroboration, not because it reflects genuine independent verification.
**Counterexamples:** This is a single observed instance in this research pass, not a systematically studied phenomenon with peer-reviewed backing — this finding should be treated as a flagged risk worth further investigation, not an established, quantified threat.
**Hypothesis:** A corroboration-check skill should be aware that "independent mention count" is a gameable metric in principle, reinforcing (from a different angle) this document's §1 recommendation to weight type-diversity and flag syndication/near-duplicate patterns rather than trusting raw volume.
**Signal:** N/A as an independently detectable website signal in this research pass — flagged as a risk-awareness finding for skill design, not a specific detection routine.
**How to Detect:** N/A directly; the syndication/near-duplicate detection already recommended in §1 §F is a partial, incidental mitigation.
**Evidence Output:** N/A directly.
**False Positives:** N/A.
**False Negatives:** This document does not propose a dedicated "AI-content-farm detection" check — that would be a significant scope expansion beyond Topic H's brief, and is flagged here only as an awareness note for the Combine phase, not a committed detection feature.
**Severity:** N/A (awareness/risk finding, not a website defect).
**Recommended Fix:** N/A directly.
**Generalization:** Potentially relevant to any topic relying on web-search-based corroboration/consistency checking (Topic P, Topic F's F37-F40) — flagged as a shared awareness note.
**Candidate Skill:** None — awareness note only.
**Related Skills:** Topic P, Topic F (F37–F40) — anywhere web-search-sourced "independent" evidence is treated as corroboration.
**Confidence:** LOW-MEDIUM — a single observed instance, explicitly not generalized into a quantified claim; flagged as a risk worth the team's awareness, not a validated threat model.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
Corroboration is not one signal but at least two, evidenced by independent peer-reviewed sources: a documented **volume/popularity bias** (Xie et al., Jin et al.) and a separate, genuine but **reversible source-type credibility preference** (Whose Facts Win's tightly-controlled synthetic-source study). A skill that collapses these into one "corroboration score" would misrepresent what the evidence actually shows; reporting them as two distinct sub-scores is both more honest and more actionable. This directly and specifically fills the evidence gap Pulkit's Topic A document explicitly flagged and handed off (A20).

**Strongest unvalidated hypothesis:**
That "contradictory corroboration" should be scored at meaningfully higher severity than "absent corroboration" (§4, Finding H-03). The underlying conflict taxonomy and general model-weakness findings are well-evidenced in peer-reviewed literature, but no study directly measures this distinction in the specific context of brand/business fact-checking (as opposed to general QA benchmarks) — this severity gap is a reasonable, evidence-grounded design choice, not a directly proven one, and should be flagged as such in the skill's documentation.

**Strongest candidate skill:**
`cross-source-corroboration-check` — combining the volume/type dual-signal design (§1, highest-confidence peer-reviewed backing), source-type-hierarchy-aware prioritization guidance (§2, genuinely actionable within its evidenced limits), rigorous E-E-A-T-language discipline (§3, preventing a specific, common, primary-source-contradicted overclaim from entering the marketplace's own documentation), and provenance/conflicting-evidence detection (§4, the most novel and highest-severity-ceiling component, directly parallel to Topic F's strongest finding).

**Weakest assumption we should investigate next:**
The precise point at which "volume from lower-credibility sources" is sufficient to override the type-based credibility preference (Whose Facts Win's own reversibility finding) is evidenced as real but not quantified in a way this document's detection thresholds can directly use — we do not know, for instance, whether "10 directory mentions" is enough to functionally equal "2 news mentions" in practice, only that some such tradeoff point exists. Before finalizing `cross-source-corroboration-check`'s scoring weights, this should be treated as an explicitly approximate, conservatively-designed heuristic rather than a precisely calibrated formula, and the report language should reflect that honestly.

---

## 4. Cross-references for the Combine & Code phase (flags for Pulkit/Soham)

- **§1/§4 ↔ Topic A20 (Pulkit, Multi-source answer construction):** This document directly answers the evidence gap Pulkit's A20 write-up explicitly flagged and handed off — recommend Pulkit's A20 section be updated to reference Findings H-01 and H-03 directly, closing the loop on that handoff.
- **H-02 (E-E-A-T meta-finding) ↔ Topic F's Finding F-02, and any other topic invoking E-E-A-T:** These two findings are directly parallel (a real, documented mechanism systematically overclaimed relative to primary-source documentation) and should be cited together as the marketplace's clearest worked examples of the evidence-hierarchy discipline. E-E-A-T appears explicitly in the master research map under multiple raw topic listings beyond H alone — recommend flagging this finding broadly, not just within Topic H's own document.
- **§4 (conflicting-corroboration detection) ↔ Topic F's F37–F40 and Topic P (Cross-Web Consistency, Harsh's own upcoming topic):** All three are instances of the same underlying "compare brand's own claim against independently-sourced claim, report directionality" mechanism. Strong recommendation: implement once as shared infrastructure rather than three times — this is now flagged consistently across two of my own topic documents (F and H) and should be a settled Combine-phase decision by the time Topic P is written.
- **H-04 (content engineered to game retrieval) ↔ Topic P, Topic F F37–F40:** A risk-awareness note, not a committed feature, relevant anywhere web-search results are treated as independent corroborating evidence — flagged for shared team awareness rather than proposed as a new detection skill, given it rests on a single observed instance rather than validated evidence.
