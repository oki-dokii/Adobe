# Topic AB — Report Design (AB1–AB23)
**Researcher:** Soham | **Research Area:** AB — Report Design
**Priority:** Very High

---

## 0. Framing — the report is where every other topic's work either pays off or gets wasted, and four boundaries need stating first

The handout is explicit that the minimum report needs findings with evidence/severity, prioritized suggested actions, plus site/timestamp/severity-count metadata. That's a floor, not a ceiling — but before adding anything above it, four overlaps need disclosing so this document specifies *presentation*, not re-derives *computation* that other topics already own:

- **AB2–AB6, AB9 (the finding-record fields) are rendering Topic Z's Cluster D output contract, not inventing a new schema.** AB's job here is which fields to show, in what order, and how — the data itself already has a home.
- **AB7 (root cause) is rendering Harsh's T, not re-deriving causal analysis.** AB8 (why it matters) is the one genuinely new piece in this pair — connecting a root cause to a stakes statement is a presentation/narrative-construction task, not an analytical one.
- **AB10–AB17 (impact, priority, effort, quick wins vs. strategic fixes) are rendering Topic Z's Cluster G ranking function and Topic AC's recommendation content, not computing a new ranking.** AB's contribution is the specific presentation pattern (a two-bucket quick-wins/strategic-fixes split, not just a flat sorted list) and the concrete fields a rendered recommendation needs.
- **AB19–AB21 (limitations, checks not performed, evidence coverage) are the direct, required extension of Topic Y's Y-01 finding** — Y-01 established *that* several sub-topics can't be assessed by a stateless crawl; AB is where that gets surfaced to the actual reader, which is the only place it does any good.

What's genuinely new in this document: the structural argument for *why* two coordinated outputs (machine-readable and human-readable) need to be generated from one source of truth rather than two independent passes, and a concrete answer to the report's single hardest design tension — severity-first ranking vs. effort-first ranking — grounded in an established writing convention this project hadn't yet drawn on.

The 23 sub-topics collapse into five clusters.

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. Cluster map

| Sub-topics | Cluster |
|---|---|
| AB1, AB22, AB23 | **A — Report structure & dual-format output** |
| AB2, AB3, AB4, AB5, AB6, AB9 | **B — Finding record fields (rendering Z's contract)** |
| AB7, AB8 | **C — Causal narrative: root cause & stakes (rendering Harsh's T + new: "why it matters")** |
| AB10, AB11, AB12, AB13, AB14, AB15, AB16, AB17 | **D — Remediation presentation & prioritization (rendering Z's Cluster G + AC)** |
| AB18, AB19, AB20, AB21 | **E — Scope transparency & proactive recommendations (extending Y-01; cross-ref AC)** |

---

## Cluster A — Report structure & dual-format output
**Covers:** AB1 (executive summary), AB22 (machine-readable output), AB23 (human-readable output)

### A. What we need to understand
How one underlying finding set (Topic Z's aggregated output) becomes two coordinated artifacts — a machine-readable structure a downstream system could consume, and a human-readable document a site owner actually reads — without drifting out of sync with each other, and how the executive summary at the top of the human-readable version should actually be written.

### B. Why it matters
The handout's minimum schema is inherently machine-shaped (`id, title, severity, evidence, suggested_action` reads like an API response); a report that stops there is technically compliant but practically useless to the actual human who has to act on it. Getting both right, from one source, is what separates "passes the rubric's stated schema" from "is actually good work."

### C. Current evidence

**INFERENCE (a direct architectural conclusion, not requiring new external research beyond what Topic Z's Cluster D already established)** — The only reliable way to keep two output formats from drifting apart is to generate both from the same in-memory finding-set object, at the same stage, rather than generating the human-readable report as a separate summarization pass over the machine-readable one (which reintroduces exactly the "reasoning beyond the evidence" risk Topic AA's Cluster B was built to prevent — a summarization step is itself an LLM-judgment step, and summarizing a report is not exempt from that risk just because the input is already structured).

**FACT (a well-established, decades-old writing convention, directly applicable to AB1)** — BLUF ("Bottom Line Up Front"), originating in U.S. military communication and structurally identical to the "inverted pyramid" convention long used in journalism, places the conclusion first and supporting detail after — explicitly the opposite of academic writing's build-up-to-a-conclusion structure. The convention exists specifically because it "respects the reader's time" and "ensures the key message is not missed" for a reader who may stop reading at any point — exactly the situation a busy site owner skimming an audit report is in.

**INFERENCE (a genuinely pointed, self-referential observation)** — This project's own Topic W findings (W-02 specifically, on phrasing-driven extraction bias, and the general finding that front-loaded, clearly-stated claims survive extraction and citation better) describe exactly the mechanism BLUF is designed around, applied to *website* content. **The marketplace's own executive summary should follow the same discipline it's checking for** — severity counts and the single most severe/most-corroborated finding stated in the first sentence, not after three paragraphs of methodology — both because it's simply good writing practice (BLUF's original justification) and because it would be a visible inconsistency for a report that flags other sites for burying their lede to bury its own.

### D. Important mechanisms
The unifying insight: **the human-readable report is not "the machine-readable output, but nicer to look at"** — it requires its own generation discipline (BLUF-structured, narrative sections) built from the same underlying data, and the two should be validated against each other (does every finding in the machine-readable output appear, at minimum, as a count in the human-readable severity summary) rather than trusted to independently agree.

### E. Concrete artifacts
Two outputs from one finding-set object: a JSON/schema-validated machine-readable file (per Topic Z's contract, extended with report-level metadata: `site`, `timestamp`, `severity_counts`), and a structured human-readable document (Markdown or equivalent) opening with a BLUF-structured executive summary: one sentence stating the overall verdict and severity distribution, before any methodology or scope discussion.

### F. How this gets verified
A consistency check: total finding counts, severity counts, and every `finding_id` present in the machine-readable output must also appear (findings themselves, not necessarily every field) in the human-readable version — a straightforward diff/reconciliation check, not a judgment call.

### G. What evidence to report
N/A — this cluster is about structure, not content.

### H. Criticality
High for the consistency check (a mismatch between the two formats would be a visible, credibility-damaging bug); medium for the BLUF-specific executive-summary discipline (a quality/polish factor, not a correctness one).

### I. Correct implementation
Generate the machine-readable structure first (it's the more constrained, schema-validated artifact), then generate the human-readable document as a templated rendering of it plus BLUF-structured prose for the executive summary specifically — not as an independent free-form pass.

### J. Anti-patterns to avoid
Writing the human-readable report as a fully separate LLM generation pass "in the spirit of" the findings rather than a direct rendering of them — this is exactly the kind of ungrounded-summarization risk Topic AA's Cluster B warns about, applied to our own output.

### K. Failure modes if missed
Two report versions that disagree on a severity count or omit a finding present in the other — a subtle, credibility-damaging inconsistency that a reconciliation check would catch immediately and cheaply.

### L. Counterexamples
None — generating both formats from one source is a strict improvement with no legitimate reason to do otherwise.

### M. Portable?
Yes — a standard single-source-of-truth documentation-generation pattern, independent of this project's specific content.

### N. Deliverable
The shared finding-set-to-two-formats rendering pipeline, plus the BLUF-structured executive-summary template.

### O. Relationship to other clusters
Consumes Topic Z's Cluster D output contract directly; the executive summary references Cluster B's severity-summary rendering.

---

## Cluster B — Finding record fields (rendering Topic Z's contract)
**Covers:** AB2 (severity summary), AB3 (finding IDs), AB4 (evidence snippets), AB5 (URLs), AB6 (affected pages), AB9 (confidence)

### A. What we need to understand
How to render each field of Topic Z's already-specified finding object into something a human reader can actually use, given that several of these fields (raw finding IDs, a `selector_or_offset` string) are meaningful to a machine but not self-explanatory to a person.

### B. Why it matters
This is the literal minimum the handout requires — get this wrong and the submission may not even satisfy the stated floor, regardless of how good the underlying detection work is.

### C. Current evidence

**INFERENCE (direct rendering guidance, not new mechanism — genuinely just a presentation decision)** — `finding_id` (Z22's deterministic hash format) should be shown to a human reader as a short, stable reference tag (e.g., `W-C3-a91f`) rather than the full hash, with the full value retained only in the machine-readable output — a human doesn't need the hash's collision-resistance properties, only a stable way to refer to "finding #12" across a conversation about the report. **Evidence snippets** (AB4) should render the `extracted_text` field directly, quoted verbatim (not paraphrased — paraphrasing evidence in the report reintroduces exactly the grounding risk this project has spent significant effort designing against in Topic AA's Cluster B), with the `url` and, where available, Topic X's Scroll-To-Text-Fragment-compatible `selector_or_offset` rendered as an actual clickable deep link, not just cited as text — directly reusing X-02's mechanism for a second, independently useful purpose (a human reviewer can click straight to the highlighted passage). **Affected pages** (AB6) should be rendered as a count with representative examples ("found on 4 of 12 sampled pages using this template — see: [url1], [url2]") rather than either a single URL (understating scope) or an exhaustive list (overwhelming for a large site) — directly consistent with Pulkit's AF template-sampling honesty convention already established elsewhere in this project.

**INFERENCE (AB9, confidence — directly building on Topic AA's Cluster D finding)** — Given Topic AA's AA-01 finding that raw verbalized LLM confidence is unreliable, the confidence value rendered in the report should **never be presented as a bare percentage without qualification** (e.g., "73% confident") — that specific presentation format implies a level of statistical precision the underlying mechanism (an objective-proxy computation, not a calibrated probability) doesn't actually support. Instead, confidence should render as a small number of named tiers (e.g., "High — confirmed by 3 independent checks," "Medium — single-source, deterministic extraction," "Low — requires manual verification") that communicate *why* the confidence level is what it is, directly surfacing Topic AA's confidence-computation basis rather than hiding it behind a number.

### D. Important mechanisms
The unifying insight: nearly every field in this cluster has the same underlying design principle — **render the machine data honestly rather than dressing it up with false precision or false simplicity.** A hash isn't a defect to hide, but it doesn't need to be shown in full; a confidence score isn't meaningless, but presenting it as a bare percentage overstates what it actually measures.

### E. Concrete artifacts
A rendering template per finding: short reference tag, one-line title, tiered confidence label (with basis), quoted evidence snippet with clickable deep link, affected-page count with representative examples, severity label.

### F. How this gets verified
Template unit tests against synthetic finding objects, asserting every required field renders and that confidence never appears as a bare unqualified percentage.

### G. What evidence to report
This cluster *is* the evidence-reporting layer — its own deliverable.

### H. Criticality
High — this is the handout's stated floor; a missing required field (severity, evidence, or suggested action, per the handout's own listed minimum) is a compliance gap, not a polish issue.

### I. Correct implementation
Build the per-finding rendering template once, apply it uniformly — not a bespoke rendering per skill.

### J. Anti-patterns to avoid
Paraphrasing evidence instead of quoting it verbatim; presenting confidence as a bare percentage; listing every single affected page for a large site instead of a representative sample with an honest count.

### K. Failure modes if missed
A report that looks complete but is missing the handout's stated minimum fields, or one that overstates its own precision (a false-precision confidence percentage) in a way a careful reader would (rightly) distrust once they noticed it.

### L. Counterexamples
For a very small site where every page actually was checked (no sampling needed), AB6 should say so explicitly ("checked all 6 pages") rather than awkwardly forcing a "representative sample" framing where none was needed.

### M. Portable?
Yes — standard report-rendering discipline, independent of specific finding content.

### N. Deliverable
The per-finding rendering template.

### O. Relationship to other clusters
Directly renders Topic Z's Cluster D schema; reuses Topic X's X-02 deep-linking mechanism; reuses Topic AA's confidence-computation basis (AA-01) and Pulkit's AF sampling-honesty convention.

---

## Cluster C — Causal narrative: root cause & stakes
**Covers:** AB7 (root cause), AB8 (why it matters)

### A. What we need to understand
How to present a finding's causal chain (Harsh's T territory) and its real-world stakes in a way that connects a technical symptom to a business-relevant consequence — directly the handout's own worked example (JS-only pricing → AI lacks pricing evidence → third-party source fills the gap → user expectation mismatch), rendered as report prose rather than internal analysis.

### B. Why it matters
A finding presented as an isolated technical fact ("missing `<th>` attribute on table at /pricing") is far less persuasive and actionable than the same finding connected to its actual consequence ("this table's price-to-plan mapping could be misread by an AI system, leading to a customer expectation mismatch at signup") — this is the difference between a checklist item and something a business actually prioritizes fixing.

### C. Current evidence

**INFERENCE (a direct rendering discipline, deferring the actual causal analysis to Harsh's T)** — `root_cause` (AB7) should render as a short causal chain, not a single sentence — the handout's own example is explicitly multi-step, and collapsing it to "pricing isn't extractable" loses exactly the connective reasoning that makes the finding persuasive. **`why_it_matters` (AB8)** is the one genuinely new piece of content this cluster contributes beyond rendering: it's a business-stakes translation step, connecting the root cause's *final* link (e.g., "user expectation mismatch") to a plain-language consequence a non-technical site owner would recognize as worth fixing — this should be written as its own distinct sentence, not folded into the root-cause chain, since root cause answers "what's wrong and why" while why-it-matters answers "why should I, a business owner, care."

### D. Important mechanisms
The unifying insight: keeping root-cause (technical/causal) and why-it-matters (business/consequential) as two visually and structurally distinct fields, rather than blending them into one paragraph, makes the report legible to two different reader modes — a technical implementer who wants the causal chain, and a decision-maker who wants to know if this is worth their team's time.

### E. Concrete artifacts
A two-field template per finding: `root_cause` (a short, numbered or arrow-connected causal chain, e.g., "JS-rendered pricing table → not extractable by static crawlers → AI systems lack reliable pricing evidence → third-party aggregator may be cited instead → visitor arrives with mismatched price expectation") and `why_it_matters` (one plain-language sentence translating the final link into a business consequence).

### F. How this gets verified
Manual review spot-check: does the why-it-matters sentence require any technical knowledge to understand? If yes, it hasn't done its translation job.

### G. What evidence to report
The causal chain itself is the reportable artifact for this cluster.

### H. Criticality
Medium-high — doesn't affect compliance with the handout's stated minimum, but is a direct, visible quality differentiator between a mechanically-generated checklist and a genuinely useful audit.

### I. Correct implementation
Write `why_it_matters` last, after the causal chain is fully specified, specifically checking it doesn't reintroduce jargon the chain itself required.

### J. Anti-patterns to avoid
Generic, copy-pasted why-it-matters statements ("this could hurt your SEO") that aren't actually connected to the specific root cause above them — this is a real, easy-to-fall-into anti-pattern precisely because it's tempting to templatize this field, and doing so would defeat its entire purpose.

### K. Failure modes if missed
A report that reads as a dry technical checklist rather than something that persuades a reader to act — a real, if hard-to-quantify, quality cost.

### L. Counterexamples
Some findings genuinely have a short, one-step root cause (a broken link) where forcing an elaborate multi-step chain would be padding, not clarity — the chain's length should match the actual causal complexity, not a fixed template length.

### M. Portable?
Yes — general narrative-writing discipline.

### N. Deliverable
The two-field root-cause/why-it-matters template.

### O. Relationship to other clusters
Directly renders Harsh's T root-cause analysis; the handout's own worked pricing example is the canonical template instance this cluster should be validated against.

---

## Cluster D — Remediation presentation & prioritization
**Covers:** AB10 (impact), AB11 (suggested action), AB12 (implementation guidance), AB13 (priority), AB14 (effort estimate), AB15 (expected impact), AB16 (quick wins), AB17 (strategic fixes)

### A. What we need to understand
How to present Topic Z's Cluster G ranking output (severity × corroboration × cost) and Topic AC's recommendation content so a reader can act on the report efficiently, rather than working through an undifferentiated list.

### B. Why it matters
The rubric explicitly rewards actionable, prioritized suggestions "beyond the detected problems" — and this project's own stated goal is explicitly *not* to produce "a big SEO checklist," which is exactly the failure mode a flat, unsorted recommendation list produces regardless of how good each individual suggestion is.

### C. Current evidence

**INFERENCE (a direct, concrete presentation pattern building on Topic Z's Cluster G ranking function)** — Rather than one flat, severity-sorted list, the report should present recommendations in **two explicitly labeled buckets**: **"Quick wins" (AB16)** — low-effort-tier fixes (per Topic Z's three-tier cost heuristic: markup/attribute-level) regardless of whether their severity is high or medium, surfaced first specifically because they're the ones a reader can act on immediately; and **"Strategic fixes" (AB17)** — higher-effort-tier fixes (content-rewrite or structural/architectural level), which may be higher-severity but require real planning to address. This is a direct, deliberate departure from pure severity-first ordering, justified by the same logic Topic Z's Cluster G already established (an unranked-by-effort list buries actionable cheap wins under severe-but-expensive fixes) — AB's contribution is that this needs to be a **visible, two-section structure**, not just an invisible tie-breaker in a single sorted list, because the reader benefit is precisely in being able to see "here's what I can fix today" separately from "here's what needs a project."

**INFERENCE** — Each individual recommendation (AB11–AB15) needs, at minimum: `suggested_action` (what to do, one sentence — the handout's own required field), `implementation_guidance` (AB12, slightly more detail — e.g., "add `scope=\"col\"` to the header row" rather than just "fix the table headers," giving the specific artifact-level instruction Topic Z's Cluster A/E infrastructure would have identified during detection), `priority` (AB13, the bucket assignment above plus its position within that bucket), `effort_estimate` (AB14, the three-tier cost heuristic rendered as a label: "markup fix" / "content update" / "structural change"), and `expected_impact` (AB15, tied directly to the finding's severity and corroboration strength — "addresses a high-severity, independently-confirmed-by-3-checks issue" reads very differently, and more credibly, than an unsupported "high impact" label).

### D. Important mechanisms
The unifying insight: **the quick-wins/strategic-fixes split is a presentation decision that makes Topic Z's already-computed three-dimensional ranking legible** — the ranking function alone (a sorted list) doesn't communicate the *reason* for the ordering as clearly as two visibly separated, labeled sections do.

### E. Concrete artifacts
Two report sections ("Quick Wins" and "Strategic Fixes"), each containing recommendation cards with the five fields specified in Section C, sorted within each section by severity/corroboration.

### F. How this gets verified
Template test: every recommendation renders all five required sub-fields; the quick-wins/strategic-fixes bucket assignment matches Topic Z's cost-tier field exactly (a mechanical consistency check, not a judgment call at render time).

### G. What evidence to report
This cluster's output is itself the reportable artifact.

### H. Criticality
Medium-high — directly affects the rubric's "suggested action quality" axis; doesn't block basic handout compliance (which only requires *a* suggested action per finding) but is a clear differentiator above the floor.

### I. Correct implementation
Build the two-bucket split as a rendering-time grouping of Topic Z's already-ranked list, not a separate re-ranking pass.

### J. Anti-patterns to avoid
A single flat list sorted by severity alone (buries quick wins, directly the failure mode Topic Z's Cluster G was designed to avoid, now reintroduced at the presentation layer if this cluster isn't implemented); vague implementation guidance that just restates the finding's title instead of giving an actual next step.

### K. Failure modes if missed
A technically-complete but practically-unhelpful report — exactly the "big SEO checklist" outcome this entire project has been explicitly instructed to avoid.

### L. Counterexamples
A report with very few findings (a well-built site) may not need the two-section split at all if everything fits in a short single list — the structure should degrade gracefully to a simple list rather than forcing two mostly-empty sections for a small report.

### M. Portable?
Yes — a standard impact/effort prioritization-matrix presentation pattern, applied here with the specific two-bucket rendering choice as this project's own adaptation.

### N. Deliverable
The two-section recommendation template and its five-field-per-recommendation rendering.

### O. Relationship to other clusters
Directly renders Topic Z's Cluster G ranking output; consumes Topic AC's recommendation text; the "implementation guidance" field should draw its specificity directly from whatever evidence Topic Z's Cluster B (or the relevant detecting skill) already captured, not require new analysis at render time.

---

## Cluster E — Scope transparency & proactive recommendations
**Covers:** AB18 (proactive recommendations), AB19 (limitations), AB20 (checks that could not be performed), AB21 (evidence coverage)

### A. What we need to understand
How the report should honestly represent what it did and didn't check — directly required by, and the necessary payoff of, Topic Y's Y-01 finding that several sub-topics (referrer context, returning-user context) simply cannot be assessed by a stateless crawl.

### B. Why it matters
Y-01 established the *logical* necessity of this scope statement; this cluster is where that necessity actually reaches a reader. Without it, Y-01's careful, disciplined scoping work has no effect on the actual deliverable — the report would silently look more comprehensive than it is, which is a credibility risk this project has explicitly tried to avoid at every other stage.

### C. Current evidence

**INFERENCE (the direct, required rendering of Y-01, plus Topic Z's Cluster E partial-failure handling)** — The report needs an explicit, visible **Limitations** section (AB19) stating, in plain language, which context-retention sub-topics were not assessable (Y-01's own list: referrer-based personalization, returning-visitor experience) and why (a stateless, single-visit, read-only crawl cannot observe session or request-level state) — framed as a property of the audit method, not a failure of this particular site's audit. **Checks that could not be performed** (AB20) is the run-specific complement: which *specific* checks failed or were skipped *for this particular site* during *this particular run* (per Topic Z's `status: partial` and error-code taxonomy) — e.g., "3 of 12 sampled pages could not be checked for query-alignment due to fetch timeouts." **Evidence coverage** (AB21) quantifies both of the above together: what fraction of the site was actually sampled (Pulkit's AF template-sampling honesty) and which check categories ran to completion versus partially versus not at all — a single, scannable coverage summary a reader can check before trusting the findings' apparent comprehensiveness.

**INFERENCE (AB18, proactive recommendations)** — This sub-topic is explicitly, directly Topic AC's content (per Section 0's disclosed boundary) — AB's only contribution here is where it renders: proactive recommendations (suggestions for things the site is *not* currently doing wrong but could improve, distinct from findings about actual problems) should render in their own clearly-separated section, **after** the Quick Wins/Strategic Fixes sections (Cluster D), not interleaved with them — mixing "you have a defect" findings with "here's an idea" suggestions in the same list would blur a distinction the report should keep clear for the reader's sake.

### D. Important mechanisms
The unifying insight: this cluster is the report-level instantiation of a discipline this project has held itself to throughout its own research process — separating what's known from what's inferred, and what was checked from what wasn't — now applied to the deliverable itself rather than just the internal research documents.

### E. Concrete artifacts
A "Limitations" section (static-ish content, reflecting Y-01's findings, updated only if the audit's own capabilities change); a "Coverage" section per run (dynamic, reflecting this specific run's actual completion status); a separated "Additional Opportunities" section for AC's proactive recommendations, positioned after the core findings/remediation sections.

### F. How this gets verified
The Coverage section's numbers should be mechanically derived from Topic Z's actual per-skill `status` fields and Pulkit's AF sampling metadata — not manually written prose that could drift from what actually happened during the run.

### G. What evidence to report
This cluster's entire output is itself the evidence-reporting layer for scope and coverage.

### H. Criticality
High — this is a direct credibility safeguard; a report that implies more coverage than it achieved is a specific, identified risk (Y-01) that this cluster is the required fix for, not an optional enhancement.

### I. Correct implementation
Derive the Coverage section programmatically from run metadata; write the Limitations section once as part of the report template (since it reflects the tool's fixed capabilities, not per-run variation), updating it only if the tool's own capabilities change.

### J. Anti-patterns to avoid
Omitting the Limitations/Coverage sections because "the findings speak for themselves" — this is precisely the omission Y-01 was written to prevent; blending proactive recommendations into the main findings list, making it unclear which suggestions address actual problems versus optional improvements.

### K. Failure modes if missed
A report that reads as more comprehensive than it actually is — the specific, named risk Y-01 identified, now realized at the deliverable level if this cluster isn't implemented.

### L. Counterexamples
None — scope transparency is a straightforward net positive with no legitimate reason to omit it, though its *prominence* (a dedicated section vs. a footnote) is a legitimate design choice depending on report length.

### M. Portable?
Yes — general audit/report transparency discipline, independent of this project's specific content.

### N. Deliverable
The Limitations section template (static), the Coverage section (dynamically generated per run), and the separated Additional Opportunities section.

### O. Relationship to other clusters
Directly, explicitly required by Topic Y's Y-01; consumes Topic Z's Cluster E status/error data and Pulkit's AF sampling metadata; hands off to Topic AC for the actual proactive-recommendation content.

---

## 3. Findings register

---
**FINDING ID:** AB-01
**Researcher:** Soham
**Research Area:** AB — Report Design
**Research Question:** Is there an established writing convention for structuring an executive summary that this project can adopt rather than inventing one, and does it connect meaningfully to this project's own prior findings?
**Observation:** BLUF ("Bottom Line Up Front"), a U.S. military-originated communication principle structurally identical to journalism's "inverted pyramid," places the conclusion first specifically to respect a time-constrained reader who may stop reading at any point. This project's own Topic W findings (front-loaded, clearly-stated claims survive extraction/citation better; W-02's phrasing-driven-extraction-bias research) describe essentially the same underlying reader/extractor behavior this convention is built around, applied to website content rather than to the marketplace's own report.
**Evidence:** Wikipedia's BLUF (communication) entry; multiple independent secondary sources (thinkinsights.net, legalclarity.org) describing BLUF's origin and its explicit contrast with inductive/academic presentation; this project's own Topic W document (W-02 and related findings).
**Sources:** en.wikipedia.org/wiki/BLUF_(communication); thinkinsights.net/consulting/bottomline-upfront-bluf; legalclarity.org/bottom-line-up-front-bluf-what-it-is-and-how-to-use-it.
**Pattern:** This is a case where an established, decades-old (older than the web itself) writing convention turns out to directly validate a design choice for a very current, AI-adjacent deliverable — and doing so lets this document point out a genuine, somewhat pointed consistency requirement: a report that checks other sites for burying their lede should not itself bury its own.
**Counterexamples:** One secondary source's specific claim ("55% of AI Overview citations come from the first 30% of a page") comes from a content-marketing glossary site, not a primary study, and should not be cited as verified fact — the general BLUF convention is well-established; that specific statistic is not independently verified by this research pass and is deliberately excluded from this document's evidentiary claims.
**Hypothesis:** N/A — direct application of an established writing convention.
**Signal:** N/A — a report-design finding, not a website signal.
**How to Detect:** N/A.
**Evidence Output:** The BLUF-structured executive summary template (Cluster A, Section E).
**False Positives:** N/A.
**False Negatives:** N/A.
**Severity:** Medium — a non-BLUF executive summary doesn't break compliance with the handout's stated minimum, but is a visible quality/consistency gap given this project's own findings about the same underlying mechanism.
**Recommended Fix:** Structure the executive summary as: overall verdict + severity distribution first, methodology/scope discussion after.
**Generalization:** High — a general-purpose writing convention, independent of this project's specific content.
**Candidate Skill:** Not a skill — a template/rendering convention within the report-generation pipeline.
**Related Skills:** Cluster A; cross-references Topic W (W-02).
**Confidence:** HIGH for the BLUF convention's validity and standing (well-documented, decades of use across military, journalism, and legal/regulatory writing); explicitly LOW/excluded for the specific unverified "55%" statistic found during this research, which this document declines to adopt.

---
**FINDING ID:** AB-02
**Researcher:** Soham
**Research Area:** AB — Report Design
**Research Question:** Should recommendations be presented as a single severity-sorted list, or does a different structure better serve the report's actual purpose — and is the two-bucket split a reasoned-but-untested design choice, or established industry practice?
**Observation:** Topic Z's Cluster G already established that a three-dimensional ranking (severity × corroboration × cost) is necessary because severity-only ordering buries cheap, high-value fixes beneath severe-but-expensive ones. **A follow-up pressure test found this isn't just a reasoned design choice — it's widespread, converging industry practice.** Independent examples across three separate audit categories all use the identical impact×effort, quick-wins-vs-strategic-fixes structure: a real Lighthouse-based AI SEO report schema uses `impact: critical/serious/moderate/minor` severity tiers alongside a `prioritized_recommendations` field; a Lighthouse MCP tool catalog offers dedicated `optimize_prioritize` ("ROI-based ranking, effort vs. impact matrix") and `issues_comprehensive` ("quick wins identification... with effort estimates") tools as first-class features; and multiple independent UI/UX and SEO audit service providers explicitly market "quick wins + long-term improvements" or "quick wins vs long-term fixes" as their report's core prioritization structure, scoring each item on an impact scale (e.g., 1-5) paired with an effort tier (small/medium/large).
**Evidence:** A Lighthouse-based AI-optimized SEO report TypeScript schema (glama.ai, AgentDeskAI browser-tools-mcp); a Lighthouse MCP tools catalog explicitly listing "quick wins identification" and "effort vs. impact matrix" as dedicated tool capabilities; multiple independent UI/UX and SEO audit service listings (Dribbble, Gumroad) marketing "quick wins + long-term improvements" as their deliverable's core structure; a first-person account of an AI-generated SEO audit whose "prioritization matrix" sorted every recommendation into quadrants by impact score (1-5) and effort tier (small/medium/large), with the author specifically calling this matrix "the part that changed everything" about the audit's usefulness.
**Sources:** glama.ai/mcp/servers/@AgentDeskAI/browser-tools-mcp (SEO report schema); glama.ai/mcp/servers/@mizchi/lighthouse-mcp (MCP tools catalog); dribbble.com/services/141619-UI-UX-Audit-That-Unlocks-Growth; justinlevitt.medium.com (first-person AI-audit account).
**Pattern:** This upgrades the finding from "a reasonable extension of Topic Z's ranking logic" to "the standard presentation convention across the actual, adjacent professional-audit industry (SEO, performance, UX)" — multiple independently-run businesses and tools, with no coordination between them, converged on the same impact/effort two-bucket structure, which is meaningfully stronger evidence than this project's own internal reasoning alone.
**Counterexamples:** A report with very few findings doesn't need the two-section structure and should degrade gracefully to a single list (Cluster D's L) — none of the real-world examples found addressed this small-report edge case directly, so it remains this project's own reasonable extension.
**Hypothesis:** N/A — no longer a hypothesis; directly validated as convergent industry practice, not merely inferred from first principles.
**Signal:** N/A.
**How to Detect:** N/A.
**Evidence Output:** The two-section (Quick Wins / Strategic Fixes) recommendation template, now with a validated real-world precedent to cite if the design choice is questioned during judging.
**False Positives:** N/A.
**False Negatives:** N/A.
**Severity:** Medium-high — directly affects the rubric's actionability/suggested-action-quality axis.
**Recommended Fix:** Implement the two-bucket rendering as a grouping of Topic Z's already-ranked list, using an impact score (reuse severity) plus an explicit effort tier label (small/medium/large), matching the real-world schema pattern found above.
**Generalization:** High — now evidenced as a convergent pattern across at least three independent real-world audit categories, not just a standard impact/effort matrix in the abstract.
**Candidate Skill:** The report-rendering template (Cluster D).
**Related Skills:** Topic Z (Cluster G); Topic AC.
**Confidence:** HIGH — upgraded during pressure-testing from "internally reasoned" to "directly, independently validated against real, unrelated industry examples."

---

## 4. Required end-of-topic synthesis

**Strongest validated insight:**
AB-01's connection between BLUF (an external, decades-old, well-documented writing convention) and this project's own Topic W findings (W-02) about phrasing/framing effects on extraction is a genuinely satisfying, self-referential result — it means the report's own executive summary should be held to the same discipline the marketplace checks *other* sites for, which is both good practice on its own evidentiary merits and a matter of internal consistency for a tool whose entire purpose is auditing exactly this kind of thing.

**Strongest unvalidated hypothesis:**
With AB-02 now upgraded to a validated, industry-corroborated pattern, the strongest remaining open question is narrower: whether the *specific* rendering choices within that pattern — the tiered confidence labels in Cluster B, and the small/medium/large effort-tier vocabulary itself — communicate clearly to a non-technical reader, or need further simplification. The overall two-bucket *structure* is no longer in question; its exact wording and labels haven't been tested with an actual reader.

**Strongest candidate skill:**
Not a new skill — the strongest deliverable in this document is the single-source-of-truth rendering pipeline (Cluster A) that generates both machine- and human-readable outputs from one finding-set object, since it's the structural safeguard against the most visible, most credibility-damaging failure mode a report could have (the two formats disagreeing with each other).

**Weakest assumption we should investigate next:**
Whether the tiered confidence labels proposed in Cluster B ("High — confirmed by 3 independent checks," etc.) actually communicate Topic AA's underlying confidence-computation basis clearly to a non-technical reader, or whether they need further simplification — this document assumes the tier-plus-basis format is legible, but hasn't tested it against an actual reader unfamiliar with how the confidence score was computed.

---

## 5. Cross-references for the Combine & Code phase

- **Cluster A ↔ Topic Z (Cluster D) and Topic AA (Cluster B):** The dual-format pipeline consumes Z's contract directly; generating the human-readable version as a rendering (not a re-summarization) is a direct application of AA's grounding discipline to the marketplace's own output.
- **Cluster B ↔ Topic Z (Cluster D), Topic X (X-02), Topic AA (AA-01), Pulkit's AF:** Nearly every field in this cluster renders data already specified elsewhere — this cluster's job is presentation discipline, not new computation.
- **Cluster C ↔ Harsh's T (Root-Cause Analysis):** AB7 renders T's causal analysis directly; AB8 (why it matters) is the one new content type this document introduces, and should be coordinated with Harsh so root-cause output includes enough structure to support the translation.
- **Cluster D ↔ Topic Z (Cluster G) and Topic AC:** The two-bucket presentation renders Z's ranking; the actual recommendation text comes from AC — this cluster only specifies the rendering structure and required fields.
- **Cluster E ↔ Topic Y (Y-01), Topic Z (Cluster E), Pulkit's AF, Topic AC:** This cluster is the required, direct payoff of Y-01's scoping discipline — without it, that work has no effect on the actual deliverable. AB18 is explicitly deferred to AC for content.
- **The whole document ↔ the handout's own stated minimum schema:** Every cluster in this document treats the handout's required fields (`id, title, severity, evidence, suggested_action`, plus site/timestamp/severity-counts) as a floor that Topic Z's contract already exceeds — AB's job is ensuring the *rendered* report actually surfaces that floor clearly, not just contains it somewhere in a larger structure.
