# Topic B — AI Citation Mechanics
**Researcher:** Pulkit | **Research Area:** B — AI Citation Mechanics (citation-worthiness, extractability, passage quality, claim-source alignment, citation competition)
**Priority:** Very High

---

## 0. Framing — how B relates to A, and what's genuinely new here

Topic A established the **pipeline mechanics** (retrieve → rank → generate → cite) and, inside that, found our single strongest piece of evidence: citation is a decoupled, separate gate from retrieval/ranking (A-03, SIGIR 2026). Topic B goes one level deeper into that final gate specifically: **given that a page was retrieved and is being considered, what makes the specific claims on that page (a) get selected for citation and (b) get represented *correctly* once cited?**

This reframes B around a distinction most teams will miss entirely:

> **Citation-worthiness ≠ citation-accuracy.** A page can be exactly the right source, get cited, and *still* have its claim misrepresented — the citation marker points at the source, but the generated sentence doesn't actually say what the source says. These are two different failure modes with two different root causes and two different fixes, and conflating them is a mistake I want to flag before going further: most SEO/GEO advice online treats "get cited" as the only goal and stops there.

I found strong peer-reviewed evidence on **both** halves, and they lead to genuinely different skills.

---

## 1. Legend
Same as Topic A: **FACT** (vendor-documented or peer-reviewed) / **OBSERVATION** (independently reported, transparent methodology, not vendor-confirmed) / **HYPOTHESIS** (ours, untested) / **INFERENCE** (one logical step from FACT/OBSERVATION) / **SPECULATION** (flagged, not built on).

---

## Section I — Foundational mechanics (originally researched as B1–B4; renumbered to avoid collision with the assigned B1–B10 sub-topics below)

*Note on numbering: my first research pass used "B1–B4" as thematic labels before the assignment's specific numbered sub-topics (B1–B10, "Why does Perplexity cite Site A but not Site B," etc.) were given to me. To avoid two different things sharing the same ID, I've relabeled the original four as **F1–F4** (Foundational) below, and the newly-assigned, specifically-worded B1–B10 questions get their own section (Section II) with the correct numbering. All findings/synthesis have been updated to reference the new F-numbers.*

### F1 — Citation-worthiness: what makes a passage get selected at all

### A. What we need to understand
Distinct from A17's "which whole source wins" question: at the *passage* level, what textual properties make a specific sentence/claim likely to be the one an assistant lifts into its answer and attaches a citation to?

### B. Why it matters
This is the most surgical, actionable layer — it's not "improve the domain" or "improve the page," it's "rewrite this specific sentence." That's a fix a non-technical site owner can actually execute, which matters for the rubric's "a non-expert could act on" requirement.

### C. Current evidence
- **FACT (foundational, peer-reviewed, EMNLP 2023):** Gao et al., "Enabling Large Language Models to Generate Text with Citations" (ALCE benchmark, Princeton NLP) is the first benchmark formalizing citation generation quality along three axes: **fluency, correctness, and citation quality** — and found that even state-of-the-art systems "lack complete citation support 50% of the time" on the ELI5 (long-form explanatory) dataset. Their ablations found two directly actionable, generalizable results: **(1) simply reranking retrieved passages before generation measurably "boosts citation quality"** (their own phrase), and **(2) the "VANILLA" strategy — just putting retrieved passages directly in context — achieves close-to-best performance despite its simplicity**, meaning elaborate prompting tricks add less value than getting good passages into context in the first place. This is a first-party, methodologically transparent, widely-cited (481 citations) academic result, not marketing content — our highest-confidence citation-specific source.
- **FACT (peer-reviewed, GEO foundational, already used in Topic A, re-applied here at passage level):** Aggarwal et al. 2024 found specific **content-level interventions** — adding quotations, adding statistics, using more authoritative/attributed phrasing — increase citation likelihood by 30-40% on their visibility metric, with the effect concentrated at the level of individual passages/statements, not whole-page properties.
- **INFERENCE (combining ALCE + Aggarwal):** Citation-worthiness at the passage level is a property of the **individual sentence/claim's self-sufficiency and evidentiary character** — does it read as a complete, attributable, quotable statement of fact — not a property of the page's overall SEO metadata or backlink profile. This is a genuinely useful reframing: most audits check page-level signals; the actual unit of citation is closer to the sentence.

### D. Important mechanisms
Two separable levers, both actionable independently: **(1) extractability** — can the fact be found and correctly isolated as text at all (this is A16's passage-chunk-quality territory — self-containment, chunk-boundary safety); **(2) citation-attractiveness** — given it's findable, does it read as the kind of statement generative engines are shown to preferentially lift (specific numbers, direct attributed claims, unhedged phrasing) versus vague/marketing-toned prose. A page can pass (1) and fail (2), or vice versa — they are different defects requiring different fixes, and our report should not merge them into one generic "improve content" finding.

### E. Concrete website signals
- Ratio of **hedged/vague marketing language** ("industry-leading," "world-class," "innovative solutions") to **specific, falsifiable claims** (numbers, dates, named comparisons) on pages whose apparent purpose is factual (product/pricing/spec/about pages).
- Presence of direct, quotable, single-sentence factual statements near headings (reuses A16's structural check, scored here for citation-attractiveness rather than chunk-safety).

### F. How the signal could be detected automatically
Hybrid: deterministic — build/maintain a small lexicon of common vague-marketing-language patterns (superlatives without support, unquantified claims) and a pattern-matcher for quantifiable claims (numbers, currency, dates, named comparatives); ratio these per page. Escalate borderline cases (is this vague or is it a legitimate qualitative claim for this content type) to a single LLM pass — appropriate hybrid use per the brief's guidance, since "is this vague marketing language" requires semantic judgment a keyword list alone can't fully make.

### G. What evidence the skill should report
Specific flagged sentences (vague claim, and if available, the same fact expressed with more specificity elsewhere on the site or in structured data — to prove the specific version *exists* and just isn't surfaced where it should be); ratio score with example sentences, not just an aggregate number.

### H. Possible severity logic
- **Medium** on pages whose evident purpose is factual/comparative and vague language dominates the section stating the brand's core value proposition or differentiators.
- **Low/Info** elsewhere (tone/voice pages, mission statements) — vague aspirational language is *appropriate* there and should not be penalized (see false positives).

### I. Correct remediation
Replace vague superlatives with the specific, falsifiable fact that supports the claim (if the fact exists somewhere on the site — pull it forward; if it genuinely doesn't exist, that's a *different*, more fundamental problem — the brand hasn't actually documented its own differentiators, which is itself worth flagging as a proactive/beyond-defect recommendation per the handout's explicit allowance).

### J. False-positive cases
- Brand voice, storytelling, mission/values, and about-page narrative content is **legitimately** more qualitative/aspirational — flagging this as a defect misunderstands the content's purpose. Must scope this check to pages/sections whose evident intent is factual/comparative persuasion (pricing, specs, feature comparisons, FAQs), not blanket-applied site-wide.
- A B2C lifestyle/fashion brand's entire voice may be intentionally emotive rather than spec-driven — this is not a defect, it's a legitimate site-type difference (hook to Topic V).

### K. False-negative risks
A page can have plenty of specific, quotable statements and still not get cited due to competitive/positional factors entirely outside content control (A17/A19's finding that list position matters as much as content) — this check measures *necessary* competitiveness factors, not sufficient ones, and the report's confidence language must say so.

### L. Counterexamples
Highly technical/scientific pages already dense with quantified claims would score well here by construction — this check has limited marginal value for content that's already fact-dense, and should be weighted toward pages that currently read as pure marketing copy where facts might exist elsewhere but aren't surfaced in the persuasive text itself.

### M. Generalizes?
Yes broadly, with the important site-type caveat above (severity, not applicability, should vary).

### N. Candidate skill(s)
Fold into **`citation-competitiveness`** (already named as a candidate in Topic A / A17) as an additional passage-level check, rather than a new standalone skill — avoids padding the marketplace with a near-duplicate.

### O. Relationship to other skills
Directly extends A16 (passage-chunk-quality) and A17 (citation-competitiveness); the two Topic-A skills plus this F1 finding likely converge into one well-scoped "citation & extraction quality" skill during the Combine phase — flagging this convergence explicitly now.

---

### F2 — Citation-accuracy / claim-source alignment (the "cited but wrong" problem)

### A. What we need to understand
Given a claim gets cited to a brand's page, how often is the citation actually *supported* by what the page says — and what page-level properties predict misrepresentation risk?

### B. Why it matters
This is arguably the single most important finding in Topic B, and it's the one most teams will skip entirely, because it inverts the usual framing: instead of "why doesn't my brand get cited," it's **"why is my brand cited incorrectly."** Misrepresentation is explicitly named as a core project deliverable ("WHY IT IS NOT UNDERSTOOD/CITED CORRECTLY... AND WHY INFORMATION IS STALE OR MISREPRESENTED"), and this is direct evidence-based grounding for that half of the problem.

### C. Current evidence
- **FACT (peer-reviewed, first-party benchmark, EMNLP 2023):** ALCE's own headline number, already cited above — even the *best* models achieve incomplete citation support roughly 50% of the time on long-form QA. This is not a fringe finding; it's the foundational benchmark paper's own top-line result.
- **FACT (peer-reviewed, domain-specific replication):** "SourceCheckup," evaluating RAG specifically in medical/health domains, independently found **50–90% of citations in long-form responses are not fully supported by the cited source**, as verified by human annotators — this is a *second, independent* study in a different domain reaching a consistent range, which meaningfully increases confidence this is a general property of RAG citation systems, not an artifact of one benchmark's specific dataset.
- **FACT (formal taxonomy, widely adopted in RAG evaluation practice):** The distinction between **groundedness** (does the generated claim have support in the *retrieved passages actually provided to the model*) and **faithfulness** (does the output stay true to what was retrieved, without drift/contradiction/extrapolation) and **factuality** (is the claim true against general world knowledge, independent of any specific source) is a standard, three-way distinction in current RAG evaluation frameworks (RAGAS, ARES, ALCE-derived work) — this is a useful formal vocabulary for our own report schema: a "misrepresentation" finding should specify *which* of these three failure types it is, since they have different causes and different fixes.
- **FACT (mechanism-level, peer-reviewed):** "A Comparative Analysis of Faithfulness Metrics and Humans in Citation Evaluation" (arXiv 2408.12398) formally distinguishes **full, partial, and no** citation support as three distinct outcome categories (not a binary supported/unsupported), which matters for our own severity design — "partial support" (the citation is directionally right but omits a critical qualifier) is a distinct, common, and arguably more dangerous failure mode than "no support" (a claim with literally no citation-page relationship is more likely to be caught by casual scrutiny; a partially-right claim is more likely to be trusted and spread).

### D. Important mechanisms
**This is where B connects directly back to A16's chunk-quality mechanism, and it's the strongest "connected diagnosis" I have across both topics.** The causal chain: (1) a fact's qualifying context (unit, condition, date, scope) lives structurally separate from the fact's headline value on the source page (A16's chunk-boundary mechanism) → (2) a chunk-based retriever pulls the headline value's chunk without the qualifier's chunk → (3) the generator, faithfully reporting *only what it was given* (per the groundedness/faithfulness framing — the generator isn't necessarily "hallucinating," it may be accurately reporting an incomplete retrieval) → (4) produces a claim attributed to the brand's page that is **technically cited, technically "faithful" to its retrieved context, and still factually incomplete/wrong relative to the page's actual full meaning.** This means a website's own passage-structure defect (A16) is a plausible *root cause* of citation misrepresentation (F2) — not two unrelated findings, but one causal chain with two visible symptoms at different pipeline stages, exactly matching the brief's JS-only-pricing example format.

### E. Concrete website signals
Same structural signal as A16 (fact/qualifier separation), but now scored specifically for **misrepresentation risk**: does the isolated headline fact, read *alone*, assert something meaningfully different or incomplete versus the fact read with its full context? (E.g., "$49" alone vs. "$49 introductory rate, first 3 months only, standard rate $99" — reading only the former is not just incomplete, it's actively misleading.)

### F. How the signal could be detected automatically
Hybrid: deterministic extraction of fact + candidate qualifiers (as in A16), then an LLM semantic check specifically framed as: "if only this isolated sentence were read, would a reasonable person be misled about [price/date/condition/scope]?" — this is a case where LLM judgment is genuinely required (semantic entailment/completeness judgment), matching the brief's guidance to reserve LLM reasoning for where it's actually needed.

### G. What evidence the skill should report
The isolated fact-only excerpt, the full-context version, and a plain-language explanation of what a reader would wrongly conclude from the isolated version alone — this is the kind of concrete, non-obvious evidence that makes a finding persuasive to a non-expert (rubric: "a non-expert could act on").

### H. Possible severity logic
- **Critical:** misrepresentation risk on pricing, legal/compliance, safety, or contractual terms (where an incomplete fact could cause real harm/liability, e.g., a misleading price).
- **High:** misrepresentation risk on core product/service claims.
- **Medium/Low:** misrepresentation risk on less consequential facts (e.g., founding year stated without a minor caveat).

### I. Correct remediation
Same fix as A16 (self-contained fact + qualifier in one sentence/local window) — this reinforces that A16 and F2 should likely be **the same underlying detection logic reported through two lenses** (extractability risk vs. misrepresentation risk) rather than two separate checks, which is a genuine engineering economy worth flagging for the Combine/Code phase.

### J. False-positive cases
Not every fact *has* a meaningful qualifier — a genuinely simple, unconditional fact (e.g., a company's founding year, with no caveats) is not at misrepresentation risk just because it's a short, isolated sentence; this check should only fire where a plausible qualifying/limiting condition actually exists elsewhere on the page or is a common pattern for that fact type (pricing almost always has conditions; "founded in X" usually doesn't).

### K. False-negative risks
We can only test the misrepresentation risk *given the page's own content* — we cannot simulate the actual retrieval+generation pipeline of a real assistant, so we cannot know whether a real system actually would isolate the fact this way; this is a **plausibility/risk signal**, not a proof of actual misrepresentation, and must be labeled with appropriately hedged confidence.

### L. Counterexamples
A page could have the fact/qualifier structurally separated on the page (by our detection heuristic) but a real system with a large enough chunk size or full-page context might retrieve both together without issue — our detection is necessarily a conservative proxy given we don't know real chunk configurations (same honest limitation as A16).

### M. Generalizes?
Yes, very strongly — pricing/condition misrepresentation risk exists on virtually any commercial site; the "isolated fact misleads" pattern is domain- and site-type-agnostic, though the specific fact types worth checking (pricing conditions vs. clinical trial eligibility vs. return policy conditions) should adapt by site type.

### N. Candidate skill
Strong candidate to be part of the **same skill as A16** (`passage-chunk-quality` / extractability), reporting two severities from one detection pass: an "extractability" finding (fact might not be found at all) and a "misrepresentation risk" finding (fact might be found incompletely and misstated) — genuinely two outputs from one underlying check, not two skills.

### O. Relationship to other skills
This is the concrete, evidence-backed mechanism behind the project's explicit "why is information... misrepresented" mandate — should be prominently featured in the entrypoint's synthesis narrative, not buried as a minor finding.

---

### F3 — Structured data (schema.org / JSON-LD) and citation: a genuine, evidence-contested question

### A. What we need to understand
Does adding schema.org/JSON-LD structured data (Product, FAQPage, Organization, etc.) actually increase the odds of correct AI citation — a claim repeated constantly in SEO/GEO marketing content — or is this a widely-believed myth?

### B. Why it matters
This is the single clearest case in my entire research pass of the brief's warning not to assume "missing structured data = failure." If I hadn't dug past the first page of marketing content, I would have walked into the marketplace's design with a false assumption baked into a "critical" finding. This deserves its own careful section specifically because getting it wrong would actively mislead the marketplace's severity logic.

### C. Current evidence — presented as a genuine live dispute, not resolved falsely

**Evidence that structured data has real value for AI systems:**
- **FACT (vendor-documented, but not LLM-answer-specific):** Google's own developer documentation confirms structured data is used for enriched *search* results (rich snippets) and entity understanding; Microsoft's Fabrice Canel is reported (practitioner conference talk, not a formal paper) to have confirmed schema markup helps Microsoft's LLMs understand content — this is a **vendor statement, second-hand reported**, credible but not a primary published source in the results I found.
- **INFERENCE:** Schema likely still matters for the **retrieval/indexing stage** even if not for real-time generation-stage parsing — i.e., it may help a system's crawler *build* its index/entity graph even if the live chat-time model doesn't parse the JSON-LD block as structured data when answering a specific query. This is a meaningful distinction most marketing content collapses.

**Evidence that live LLM query-time answering does NOT semantically parse JSON-LD, and treats it as raw text:**
- **OBSERVATION, but methodologically clear and independently corroborated:** Mark Williams-Cook's controlled test (Feb 2026, widely reported, methodology independently described consistently across multiple secondary write-ups including Search Engine Roundtable and Search Engine Journal) — planted a fictitious company address **only** inside deliberately invalid JSON-LD, with no matching visible text, on a page about a fictional t-shirt company. Both ChatGPT and Perplexity extracted and returned the fake address when asked directly. Because the JSON-LD was invalid (would fail schema validation) and the answer was still produced, the parsimonious explanation — which Williams-Cook and independent commentators converge on — is that the models tokenized the `<script>` block as ordinary page text rather than validating/parsing it as structured schema. Perplexity reportedly even cited "the page's embedded structured data" as its source, suggesting the model recognized the *text* looked like structured data without actually schema-validating it.
- **OBSERVATION (second, independent, larger-scale study, methodologically described as controlled):** The SearchVIU study (reported ~Oct 2025, updated coverage into 2026) ran **8 scenarios** across ChatGPT, Claude, Perplexity, Gemini, and Google AI Mode, deliberately separating "information only in JSON-LD/Microdata/RDFa" from "information in visible HTML" from "information only in JS-rendered content." Reported result: **JSON-LD-only data was extracted by 0 of the 5 tested systems during direct/live fetch** ("not a single one... could use hidden Schema data"); visible HTML was reliably extracted; JS-rendered content was extracted inconsistently (Gemini best at direct fetch, ~50%; ChatGPT ~37.5%) but was picked up more reliably when systems used their pre-built *index* rather than live fetch — an important nuance suggesting **crawl-time indexing and live-query-time fetching may behave differently**, which is a genuinely useful distinction we hadn't captured yet.
- **This is two independently-run, methodologically-described experiments converging on the same conclusion for live/direct-fetch extraction — meaningfully stronger than a single anecdotal test, though still OBSERVATION-tier (informal/practitioner-run, not peer-reviewed, sample sizes small), not FACT-tier.**

**The counter-noise:** A large volume of SEO/GEO marketing content in the same search results makes strong, specific, unsourced claims contradicting the above — e.g., "pages with FAQ schema are 3.2x more likely to appear in AI Overviews," "sites with properly implemented structured data get cited 3.2 times more often," "well-structured JSON-LD was the only factor determining appearance... in controlled experiments" — **none of these citations point to an identifiable, checkable primary study**; they read as vendor/agency marketing copy recycling an unsourced statistic (the repeated, suspiciously specific "3.2x" figure appearing in unrelated articles from different domains is itself a small red flag for citation-laundering rather than independent replication). **These should not be trusted or cited as evidence in our skill design.**

### D. Important mechanisms — our synthesized, honest position
1. Schema likely retains value for **discovery/indexing infrastructure** (helping a crawler build an entity graph, contributing to knowledge-graph-style corroboration — Harsh's Topic G territory) even if it provides **little-to-no benefit at live-query citation time** for at least ChatGPT and Perplexity, per the converging controlled tests above.
2. **The practical implication is the opposite of common advice:** schema should be treated as a *supplementary, low-cost-to-add* signal, never as a *substitute* for stating the same fact in visible, plain-language HTML text — because the visible text is what's actually reliably extracted at answer-time. A site that has accurate JSON-LD but the *same fact absent from visible text* has NOT solved its extractability problem, contrary to what a naive "add schema" checklist item would imply.
3. **Genuine open uncertainty:** we found no equally rigorous controlled test for Claude specifically parsing JSON-LD at live query time (the sources found were ChatGPT/Perplexity/Gemini-focused); Anthropic's own documentation doesn't address this. This should be flagged as an explicit gap, not silently generalized.

### E. Concrete website signals
Presence of a fact **only** in JSON-LD/schema markup with no corresponding statement in visible, crawlable HTML text — this is the actual defect pattern (not "missing schema," but "fact exists only in schema, missing from visible text").

### F. How the signal could be detected automatically
Fully deterministic: extract all JSON-LD blocks, extract their factual field values (price, address, dates, etc.), extract visible rendered text, and check whether each schema-asserted fact has a corresponding textual mention in the visible content. This is a clean, cheap, high-confidence check.

### G. What evidence the skill should report
Specific facts present in schema but absent from visible text, with the schema field name and value, so the fix is unambiguous (add this specific fact to visible copy).

### H. Possible severity logic
- **Medium-High** if a core transactional fact (price, availability, contact info) exists only in schema and not in visible text — given the converging evidence this fact is then likely invisible to at least two major systems' live-query answering.
- **Low** for schema/visible-text mismatches on non-critical facts.
- **Explicitly do NOT treat "no schema markup at all" as, by itself, a defect** — per the false-positive warning below, this would contradict our own evidence.

### I. Correct remediation
Ensure every schema-asserted fact also appears in plain, visible page text — not "add more schema," but "don't rely on schema alone." This is a genuinely counter-intuitive, evidence-grounded recommendation that most competing teams (who will likely just recommend "add JSON-LD") will miss or get backwards.

### J. False-positive cases
**Do not flag "missing schema markup" as a defect in itself** — this is explicitly one of the brief's named forbidden assumptions ("missing structured data = failure"), and our own evidence review supports why: live-query citation-time value of schema is contested/weak per the two converging controlled tests, so a site with zero schema but excellent visible-text extractability is not meaningfully worse off for AI citation than an identical site with schema added. (Schema may still be worth recommending for *other* reasons — traditional search rich results, though even that is narrowing per Google's 2026 FAQ rich-result retirement — but that's a different, lower-priority, non-AI-citation justification and should be labeled as such if mentioned at all.)

### K. False-negative risks
Our detection method assumes the schema/text mismatch is the operative failure mode; if a future model update changes to genuinely parse JSON-LD (SearchVIU's own reporting notes Perplexity "has hinted at better structured data handling"), this check's premise could become stale — the skill's confidence/evidence should note the source dates (Feb–Oct 2025/2026 tests) and flag this as time-sensitive, testable behavior rather than a permanent architectural fact.

### L. Counterexamples
Google's traditional (non-generative) search and AI Overviews may still consume structured data differently than the conversational ChatGPT/Perplexity/Claude products tested — the evidence base here is strongest for conversational-assistant live citation specifically, weaker/mixed for Google's AI Overviews or Bing Copilot, and essentially absent for Claude — this must not be over-generalized to "structured data never matters for any AI system."

### M. Generalizes?
The *detection method* (schema-vs-visible-text fact parity check) generalizes perfectly across site types. The *underlying behavioral claim* (schema ignored at query time) is time-sensitive and vendor/product-specific — should be re-verified periodically, and the skill's evidence citations should be dated so the finding can be understood as time-bound rather than a permanent architectural claim.

### N. Candidate skill
**`structured-data-visible-text-parity`** — a small, sharp, deterministic, high-confidence check; could be a standalone lightweight skill or folded into `crawl-render-audit` (A11) since both compare "what's supposedly there" against "what's actually visible/extractable." Genuine engineering-economy candidate for merging.

### O. Relationship to other skills
Directly informs Topic G (Structured Data & Semantic Web — Harsh's) — **important cross-team flag: Harsh's Topic G should NOT assume schema is straightforwardly beneficial for AI citation without incorporating this evidence review**; recommend I share this section directly with Harsh before he finalizes Topic G's checks, since his topic distribution description ("Schema.org, JSON-LD, entity types, identifiers, sameAs, validation and consistency") could easily produce a "validate and encourage schema" skill that inadvertently overstates schema's live-citation value based on the marketing-content noise I found. Schema likely *does* still matter for entity resolution/knowledge-graph corroboration (Topic F/G's actual core concern), just probably not for live-query text extraction — this nuance matters for how Harsh scopes severity.

---

### F4 — Citation competition (re-anchoring A17 specifically at the citation-generation stage)

### A. What we need to understand
This substantially overlaps A17 (source selection) by design — the distribution sheet explicitly lists "citation competition" under Topic B. Rather than duplicate A17's full A–O treatment, I'm using this section to add the **one genuinely new piece of evidence** I found specifically about competitive citation dynamics that wasn't in the Topic A document.

### B–C. New evidence beyond A17
- **FACT (peer-reviewed, directly extending the SIGIR 2026 paper already used in A17):** The "What Gets Cited" paper's framing explicitly establishes that their study is about **first-citation** — i.e., in a competitive field, being cited *first* (not just *at all*) is itself a distinct, measurable outcome with its own drivers. This implies a further layer our A17 treatment didn't fully draw out: **citation order/prominence within a multi-source answer may itself be a gradient outcome** (first-cited vs. later-cited vs. uncited), not a binary. This is a refinement worth carrying into the report schema — "cited" should ideally be reported with prominence, not just presence, wherever our live-query evidence (A18) allows us to observe it.
- **FACT (from ALCE, re-applied):** The finding that reranking ("RERANK boosts citation quality") measurably improves citation outcomes reinforces, from a second independent academic source, that **which passages reach the generator's context** (not just which page ranks in search) is the proximate lever — consistent with, and reinforcing, A17's core finding.

### D–O.
No new standalone skill — this section exists to (1) confirm A17's findings replicate/extend across a second angle of evidence and (2) flag the citation-prominence-as-gradient nuance for Topic R (Experiment Design) and the report schema (Topic S, Soham's) to consider capturing "first cited / co-cited / uncited" rather than a flat boolean, if our live-query probe (A18's `live-citation-probe`) is built.

---

## Section II — Assigned sub-topics B1–B10

*This section addresses the specific, numbered sub-questions assigned under Topic B. Where a sub-topic's answer is already substantially covered by Section I (F1–F4) or by Topic A, I cross-reference rather than repeat, per the brief's instruction not to pad with restated findings.*

---

### B1 — Why does Perplexity cite Site A but not Site B?

#### A. What we need to understand
Given two sites that are both topically relevant to a query, both crawlable, and both contain the relevant fact, what specifically tips selection toward one over the other? This is the most concrete, practical framing of the whole citation-mechanics topic, and it deserves its own direct answer rather than only the abstract "source selection" framing from A17.

#### B. Why it matters
This is the question a brand owner will actually ask us, verbatim. Our answer needs to be honest about what's knowable (documented/measured factors) versus what isn't (we cannot fully reverse-engineer any single decision), while still being concrete enough to act on.

#### C. Current evidence
- **FACT (peer-reviewed, already established in F1/A17, re-applied here specifically to the "A vs B" framing):** The SIGIR 2026 "What Gets Cited" controlled study directly tested this exact two-way comparison design — two candidate documents, one content factor varied at a time, 252,000 trials — and found **topical relevance and list position** are the largest measured drivers of which of the two gets cited first. This is the single most directly on-point piece of evidence for this specific question in our entire research base.
- **FACT (peer-reviewed, Perplexity-relevant specifically since the question names Perplexity):** Perplexity's own engineering blog confirms **fine-grained, passage-level scoring** of candidate documents against the query (already used in A16) — meaning the "Site A vs Site B" decision for Perplexity specifically is very plausibly happening at the *passage* level, not the domain level: Site A may win not because Site A the domain is better, but because Site A has one specific passage that scores better against the query than anything on Site B.
- **OBSERVATION (Perplexity-specific, converging across the SearchVIU and Williams-Cook tests already used in F3):** Perplexity was observed extracting from visible HTML text reliably while not treating JSON-LD as structured/validated data at live-query time — so for a "why did Perplexity pick A over B" question specifically, a plausible, testable contributing factor is: **does Site B's relevant fact exist only in schema/JS-rendered content while Site A's exists in plain visible text?** This reuses F3's mechanism as a direct, Perplexity-named explanatory hypothesis.
- **INFERENCE (combining the above with A11/A16):** For any specific "why A not B" case, our audit can only meaningfully speak to the *necessary preconditions* we can verify statically (is B crawlable, is B's fact visible in plain text, is B's fact self-contained and chunk-safe, is B's phrasing specific/quotable per F1) — not to the *sufficient, comparative, real-time* decision, which depends on the actual competing candidate set at query time, something a single-site audit cannot observe. This honesty constraint should be stated explicitly in any "why A not B" style output.

#### D. Important mechanisms
The most defensible way to answer "why A not B" without overclaiming is to run our **existing static checks (A11, A16, C1-family crawlability, F1, F3) against Site B specifically** and report which of them B fails that a plausible competitor might pass — turning an unanswerable single-shot causal question into a **checklist of verified, ruled-in/ruled-out preconditions**, which is both more honest and more actionable than a single speculative causal story.

#### E–G. Signals / Detection / Evidence
No new detection mechanism — this sub-topic's contribution is **methodological**: it establishes that "why does X get cited over Y" should be answered by our entrypoint as a **composite report across existing checks**, not a new standalone skill. This directly reuses A18's `live-citation-probe` concept (if built) to actually observe real A-vs-B outcomes, cross-referenced against our static findings.

#### H–L.
Severity/remediation/false-positive/false-negative treatment is inherited entirely from whichever static check (A11/A16/F1/F3/C-family) is implicated in a specific case — this sub-topic doesn't introduce new severity logic of its own.

#### M. Generalizes?
Yes — the meta-lesson ("answer 'why A not B' via composite static evidence, not a single causal claim") applies to any site pair.

#### N. Candidate skill
No standalone skill — this defines how the **entrypoint's synthesis/narrative layer** should compose and present findings from other skills when a user's implicit question is comparative ("why do we lose to a competitor").

#### O. Relationship to other skills
Direct consumer of A11, A16, F1, F3, C1-family, and (if built) A18's live probe — the "glue" logic for comparative narrative, likely belonging to Soham's report-synthesis/scoring skill (Topic S/AB) rather than a new Pulkit skill.

---

### B2 — Characteristics of commonly cited websites

#### A. What we need to understand
Across large-scale observational studies (not controlled experiments), what do frequently-cited domains have in common?

#### B. Why it matters
This is useful as a **sanity check and hypothesis source**, but — critically — needs to be handled with real epistemic care, because most of the available data here is correlational, aggregated at the domain level (not causal, not page-level), and often comes from commercial GEO-tooling vendors with an incentive to publish attention-grabbing numbers. I want to be explicit about this rather than launder marketing statistics as research findings.

#### C. Current evidence — presented with appropriate hedging
- **OBSERVATION (multiple independent large-scale citation-tracking analyses, but methodologically opaque in places and commercially motivated):** Several 2025-2026 studies analyzing millions of AI-answer citations report that a small number of very large, high-authority, user-generated or reference platforms (Reddit, Wikipedia, YouTube, LinkedIn) capture a disproportionate share of citations — one synthesis reports the top 15 domains capturing roughly 68% of citations across ChatGPT/Claude/Gemini/Perplexity/AI Overviews.
- **OBSERVATION (a directly conflicting data point from a different, also-commercial source, and I'm deliberately not resolving this dispute falsely):** A separate large-scale analysis (7,058 unique domains cited across ChatGPT, Google AI Mode, and Perplexity) reports the *opposite* headline: the **top 10 domains cover only 11-13%** of citations, and even the top 50 cover only 29-34% — i.e., citation is actually **long-tailed and highly distributed**, not concentrated.
- **This is a genuine, unresolved contradiction in the secondary evidence, and I flag it as such rather than picking the more convenient number.** Plausible reconciling explanations (my own INFERENCE, not confirmed): the two studies likely used different query sets (broad/generic vs. specific/branded), different measurement windows, and different definitions of "citation" (a source link vs. an inline attributed quote) — aggregate concentration statistics are extremely sensitive to query-sampling methodology, and neither source publishes a fully transparent, reproducible methodology at the level of rigor of the peer-reviewed papers used elsewhere in this document. **I recommend treating both numbers as illustrative of a real phenomenon (large reference/UGC platforms are heavily cited) without adopting either specific percentage as a hard fact.**
- **FACT (peer-reviewed, the strongest source for this sub-topic, already introduced in Section I via arXiv 2601.16858):** The University of Toronto study found AI engines (Claude, GPT-4o, Perplexity) systematically **favor "earned" media (independent journalism/review sites) and "brand" (official) sources over "social" (UGC) sources**, in direct tension with the Reddit-heavy narrative from the commercial studies above — Claude specifically was measured at 65% earned vs. only 1% social in their controlled, methodologically transparent 300-query test. **This is a direct, evidence-based contradiction of the popular "Reddit dominates AI citations" narrative for at least Claude specifically**, and is a good example of why peer-reviewed/methodologically-transparent sources should be weighted far more heavily than aggregated commercial dashboards even when the latter have larger raw citation counts.
- **FACT (same paper):** Source-type composition shifts systematically by **query intent** — informational queries show more variance, consideration/comparison queries converge toward "earned" sources (59-86% across AI engines), and transactional queries sharply favor brand/official sources (52-68%) — this is a genuinely useful, non-obvious, well-evidenced pattern: **the "what kind of site gets cited" answer depends heavily on query intent type**, echoing A13's search-intent research from Topic A.

#### D. Important mechanisms
The apparent contradiction between the commercial concentration studies and the academic source-typology study is itself informative: it suggests **aggregate domain-level citation share and citation-eligibility-by-content-type are different measurements** — a domain can appear frequently in raw citation counts (driven by sheer page volume, e.g., Reddit's billions of threads) while still being systematically *less preferred* than earned/brand sources on a per-query, controlled basis. Our audit shouldn't conflate "this type of site gets cited a lot in aggregate" with "this type of site is preferred when directly competing on the same query," since the evidence suggests these can diverge.

#### E-G. Signals / Detection / Evidence
This sub-topic does not itself yield a new detectable website-level signal — its primary contribution is **calibrating our own confidence and avoiding a bad assumption**: we should not build severity logic that assumes "official/brand pages are systematically disadvantaged vs. UGC/aggregators" as a blanket rule, given the academic evidence points the other way for at least the informational/consideration/transactional query-intent breakdown measured.

#### H-L.
No standalone severity/remediation logic — informs calibration of A18 (source substitution) and A13 (search intent) instead.

#### M. Generalizes?
The query-intent-dependent source-type pattern (FACT-tier, from the peer-reviewed study) generalizes well. The aggregate concentration statistics (OBSERVATION-tier, contested) should not be generalized or hard-coded given the direct contradiction between sources.

#### N. Candidate skill
No standalone skill. Feeds calibration/assumptions for A13, A17, A18.

#### O. Relationship to other skills
Directly informs A18 (source substitution) — the substitute-source-type taxonomy should be informed by the query-intent-dependent pattern here (a comparison-intent query substituting a review/earned-media source is a different, more benign phenomenon than a purely-informational query substituting an aggregator).

---

### B3 — Characteristics of ignored (uncited) websites

#### A. What we need to understand
This is the mirror image of B2 — what do consistently *non-cited* sites tend to have in common, independent of topic relevance?

#### B. Why it matters
This is arguably more directly useful for our audit than B2, since our actual job is diagnosing why *this specific brand's site* might be ignored — a "what does failure look like" pattern library is more actionable than a "what does success look like" one, since failure patterns map more directly onto fixable defects.

#### C. Current evidence
- **INFERENCE (synthesizing across nearly everything already established in Topics A and B, rather than a single new source):** Given the full body of evidence already gathered — A11 (JS-locked/unrendered content), A16/F1 (chunk-unsafe, non-self-contained facts), F1 (vague marketing language lacking quotable specifics), F3 (facts only in unvalidated schema, not visible text), C1-family (crawlability defects) — the honest, evidence-grounded answer to "what characterizes an ignored site" is **not a new independent finding**, but the **union of every upstream defect already documented in Topics A/B, now reframed as a negative-pattern checklist**. I want to be explicit that I did not find a distinct, separate body of research specifically studying "ignored sites" as its own category (as opposed to studying what *does* get cited and inferring the rest) — this is a real evidence gap, not a place I'm inventing false precision.
- **OBSERVATION (from the AmbER sets paper, ACL 2021, peer-reviewed — genuinely new to this document, first introduced here for B10 below but directly relevant to "ignored sites" too):** Retrievers exhibit a measurable **popularity bias** — for entities that share a name with a more prominent entity, retrievers are **twice as likely to retrieve the wrong (more popular) entity's documents** than the correct, less-popular one. This gives a concrete, evidence-backed answer to one specific *reason* a legitimate, on-topic site could be "ignored": not because of any content defect, but because **the brand's name collides with a more prominent same-named entity**, and retrieval systematically favors the more prominent one. This is a genuinely non-obvious, well-evidenced, and currently-uncovered-elsewhere-in-our-research finding.

#### D. Important mechanisms
This surfaces a **new causal category** not fully captured by Topics A/B's existing checks: **name-collision-driven invisibility**, distinct from content-quality or crawlability defects. A site can do everything else right and still be "ignored" because retrieval defaults to a same-named, more prominent entity — this is a site-external factor (driven by the existence of a competing entity, not by the site's own defects), which has different implications for remediation (the fix is disambiguation-focused: explicit, early, repeated entity identification — "X, the [category] company based in [location], not to be confused with...", consistent NAP/entity data — rather than content-quality fixes).

#### E. Concrete website signals
Detectable name-collision risk: does the brand's name (checked via a quick search/knowledge-base lookup) correspond to multiple distinct, unrelated entities, and if so, does the site's own content **proactively disambiguate itself** early and explicitly (stating its category, location, or distinguishing details near the top of key pages) versus assuming its identity is unambiguous?

#### F. How the signal could be detected automatically
Hybrid: deterministic check — does the site's homepage/about page contain explicit disambiguating context (industry/category + location or other distinguishing detail) within the first ~100-200 words of extractable text; a search-based check (web_search for the brand name) to assess whether multiple distinct entities plausibly share the name, escalated to an LLM judgment on ambiguity risk given the search results.

#### G. What evidence the skill should report
Whether the brand name returns multiple distinct entities in a quick search; whether the site's own content disambiguates itself early; concrete example of what a same-named competing entity looks like if found (to make the risk concrete and believable to a non-expert).

#### H. Possible severity logic
- **Medium-High** if the brand name is genuinely, verifiably ambiguous (shares a name with a notably more prominent entity) AND the site does not disambiguate itself early in crawlable text.
- **Low/Info** for genuinely unambiguous, distinctive brand names — most brands, so this should not fire broadly.

#### I. Correct remediation
Add explicit, early, plain-text disambiguating context (category + location/founding details + what makes this entity distinct) near the top of the homepage and about page — a cheap, high-leverage fix directly informed by the AmbER finding's mechanism.

#### J. False-positive cases
Most brand names are not meaningfully ambiguous — this check should only fire when a genuine, verifiable name-collision with a more prominent entity is found via search, not as a blanket "add more identity info" recommendation for every site.

#### K. False-negative risks
Our search-based ambiguity check is necessarily approximate (a single search snapshot, not a comprehensive knowledge-base cross-reference) and could miss subtler or regionally-specific name collisions.

#### L. Counterexamples
A brand deliberately choosing a common/generic name for other business reasons (trademark cost, domain availability) has made a legitimate tradeoff — this finding should be framed as a mitigable risk to address via content, not a criticism of the naming choice itself.

#### M. Generalizes?
Yes, well — name collision is a universal risk category independent of site type, though its severity should scale with how generic/common the brand's chosen name is.

#### N. Candidate skill
Genuinely new candidate: **`entity-disambiguation-risk`** — though this has a clear ownership overlap with Harsh's Topic F (Entity Recognition & Resolution) territory; flagging for cross-team resolution rather than building independently.

#### O. Relationship to other skills
Directly relevant to Topic F/G (Harsh, Entity Resolution/Structured Data) — should be co-designed, not duplicated. Also composes with A13 (category/positioning clarity), since the remediation (early explicit self-categorization) is the same fix pattern.

---

### B4 — Quoted text patterns

#### A. What we need to understand
Beyond F1's general "vague vs. specific" framing, are there more specific, structural patterns in *how* text is phrased that correlate with being lifted as a direct quote?

#### B. Why it matters
If there's a more granular, actionable pattern than "be specific," that's higher-value guidance for site owners.

#### C. Current evidence
- **FACT (peer-reviewed, already used in Section I/F1 — ALCE, Gao et al. 2023):** Confirms passage quality and reranking (not prompt engineering) are the dominant levers — already established, not repeated here.
- **OBSERVATION (large volume of GEO-marketing-content converging on similar specific claims, but NOT peer-reviewed and largely unsourced at the level of methodological detail the other sources in this document provide):** Common claims across multiple independent marketing/practitioner sources include: leading with the key fact/number before qualifiers; one idea per sentence; short (roughly 40-60 word) self-contained answer blocks; avoiding unattributed hedge phrases ("studies show," "experts agree") in favor of named, specific attribution. **I'm explicitly labeling this entire cluster OBSERVATION-tier at best, more accurately "widely-repeated practitioner claims without transparent methodology"** — these are directionally consistent with our stronger peer-reviewed evidence (ALCE's finding that good passages matter more than prompt cleverness; Aggarwal et al.'s finding that authoritative/specific phrasing helps) but the *specific numeric claims* (e.g., "40-60 words") have no traceable primary study behind them in what I found, and should not be hard-coded as precise thresholds in our skill.
- **INFERENCE:** The *directionally consistent* overlap between the peer-reviewed evidence (ALCE, Aggarwal et al.) and the practitioner consensus (lead with the fact, be self-contained, attribute specifically) gives us reasonable confidence in the **qualitative pattern** even though the **precise numeric parameters** are unvalidated — our skill should implement the qualitative check (does the passage lead with the specific claim, is it self-contained, is attribution named rather than vague) without asserting a specific word-count threshold as if it were empirically derived.

#### D-G.
This sub-topic reinforces and slightly sharpens F1's existing detection design (vague-vs-specific language ratio) rather than requiring a new mechanism — the addition is the **named-vs-unnamed attribution check** ("studies show" vs. "a 2026 study by X found"), which is a genuinely distinct, easily detectable pattern not covered in F1's original design.

#### H. Severity
Same tier as F1 (Medium on factual/comparative pages).

#### I. Remediation
Add named, specific attribution instead of vague hedge phrases, in addition to F1's existing specificity guidance.

#### J-L.
Same false-positive/negative/counterexample profile as F1 — this is an extension, not a new independent check.

#### M. Generalizes?
Yes.

#### N. Candidate skill
Fold into `citation-competitiveness` (extends F1, not a new skill).

#### O. Relationship to other skills
Extension of F1/A17.

---

### B5 — Fact extraction patterns

#### A. What we need to understand
This substantially overlaps A16 (passage retrieval/chunking) and F2 (claim-source alignment) — the distribution assigns it separately, so I'm using this section to confirm the overlap explicitly and add one specific new angle: **numeric/quantitative fact extraction** specifically, since numbers have distinct extraction failure modes from prose claims.

#### B-C. New evidence beyond A16/F2
- **INFERENCE (extending A16's chunk-boundary mechanism to a numeric-specific case):** Numeric facts are disproportionately vulnerable to the fact/qualifier-separation problem already documented in A16/F2, because numbers are frequently presented in tables, infoboxes, or isolated UI elements (price badges, spec sheets) *specifically because* that's good human-readable design — but exactly this pattern (isolating a number visually/structurally from its prose context) is what creates chunk-boundary risk. This is not a new mechanism, but it identifies numeric facts specifically as the **highest-risk category** for the A16/F2 mechanism, since good human UI design and good machine-extraction design are often in tension for numbers specifically (tables are great for human scanning, risky for chunk-based extraction unless properly marked up per A16's `<th>`-association caveat).
- **OBSERVATION (already used in F3 — SearchVIU/Williams-Cook tests):** Numeric facts (a fictitious address) were the specific test payload used in both structured-data extraction experiments — reinforcing that numeric/factual data specifically (not prose) was the object of study in the strongest evidence we have on the schema-vs-visible-text question.

#### D-O.
No new standalone skill — this sub-topic confirms A16/F2 already cover this territory, with numeric facts flagged as the highest-priority instance within those checks rather than requiring separate treatment.

---

### B6 — Authority signals

#### A. What we need to understand
Beyond A17's finding that "topical relevance and list position" are the primary measured drivers (SIGIR 2026), what specifically constitutes "authority" in a way we could detect on a single site?

#### B. Why it matters
"Authority" is one of the most overused, vaguest terms in SEO/GEO discourse — grounding it in what's actually measurable is valuable specifically because it's so often used as an unfalsifiable catch-all.

#### C. Current evidence
- **FACT (peer-reviewed, Aggarwal et al. 2024, already used in F1):** Specific, operationalizable authority-adjacent interventions with measured effect: adding citations/quotations, adding statistics, and using authoritative/attributed language each independently and measurably increased citation likelihood.
- **FACT (peer-reviewed, University of Toronto study, newly introduced in B2 above):** "Brand" (official source) citation share sharply increases specifically for transactional-intent queries (52-68%) — suggesting that for at least this query type, being the *canonical, official* source is itself a measurable form of authority, independent of third-party corroboration.
- **INFERENCE:** "Authority" as commonly used conflates at least three genuinely distinct, separately-measurable things: (1) **being the canonical/official source** for a claim about oneself (strong for transactional intent, per the Toronto study), (2) **third-party corroboration/consensus** (the handout's own Appendix D framing — many independent sources agreeing), and (3) **content-level evidentiary quality** (Aggarwal et al.'s stats/quotes/attribution). Our audit should check these three separately rather than producing one vague "authority score," since they have different detection methods and different remediations.

#### D-G.
Each of the three authority sub-types maps onto existing or planned checks: (1) canonical-source-ness is closest to A13's category/positioning clarity work; (2) third-party corroboration is Harsh's Topic H/P territory (explicitly flagged for handoff back in Topic A's A20 section); (3) content-level evidentiary quality is F1/B4's territory. This sub-topic's primary contribution is the **decomposition itself**, preventing a vague, unfalsifiable "authority" metric from being built.

#### H-O.
No new standalone skill — a conceptual clarification informing severity/scoring design across A13, F1/B4, and Harsh's H/P.

---

### B7 — Brand mention frequency

#### A. What we need to understand
Does how often a brand name appears (on its own site, or in the wider web) correlate with citation likelihood, independent of content quality?

#### B. Why it matters
This is a classic SEO-era metric (keyword/brand density) being re-asked for the AI era — worth directly testing whether it still applies or is a stale assumption.

#### C. Current evidence
- **INFERENCE (from A14's dense/semantic retrieval mechanism, already established in Topic A):** Because modern retrieval is substantially semantic/embedding-based rather than purely lexical (A14), raw brand-name repetition count on a single page is unlikely to be a strong direct lever — semantic retrieval doesn't require literal keyword repetition to recognize relevance, unlike classic keyword-density SEO.
- **INFERENCE (from B2's query-intent-dependent source-type findings):** *Cross-web* brand mention frequency (how often the brand is mentioned across many independent third-party sites, not just its own site) is a more plausible signal, and maps directly onto the handout's own Appendix D "corroboration" framing and Harsh's Topic H/P territory (cross-web consistency) rather than being a same-page content-density metric.
- **I did not find a study directly, rigorously testing on-page brand-mention *frequency/density* as an isolated variable for AI citation specifically** — this is a genuine evidence gap, distinct from the well-evidenced cross-web corroboration question.

#### D. Important mechanisms
The useful reframe: "brand mention frequency" as a same-page keyword-density metric is very likely a **stale, pre-LLM-era SEO assumption** that doesn't map well onto semantic retrieval mechanics; "brand mention frequency" as a **cross-web corroboration** metric is a different, better-evidenced, but Harsh-owned question.

#### E-O.
No standalone Pulkit skill — recommend explicitly **not** building a same-page brand-density check (low evidence it matters, risks resurrecting outdated keyword-stuffing advice), and handing the cross-web version to Harsh's H/P territory.

---

### B8 — Page structure patterns

#### A. What we need to understand
This substantially overlaps A16 (chunking/passage structure) and the heading-alignment checks already designed there — using this section to add what's genuinely new: heading hierarchy and section-boundary clarity as a distinct (if related) concern from within-chunk self-containment.

#### B-C. New evidence beyond A16
- **OBSERVATION (converging across multiple practitioner sources, directionally consistent with A16's peer-reviewed chunking literature but not independently peer-reviewed itself):** Multiple independent practitioner sources describe a consistent pattern: question-shaped or keyword-specific headings (matching how a query might be phrased) that sit **immediately above** their answering content, rather than several paragraphs above it, correlate with better extraction — this is consistent with, and a direct restatement of, A16's own heading-to-content topical-match check and the "Lost in the Middle" positional literature (content far from its heading is more likely to be separated from it by chunking, and/or to suffer positional degradation even if retrieved).
- **No new peer-reviewed evidence found beyond what A16 already established** — this sub-topic is confirmed as already covered by A16 rather than requiring new research.

#### D-O.
No new standalone skill — A16 already covers heading-content alignment; this sub-topic doesn't add new detection logic.

---

### B9 — Semantic clarity

#### A. What we need to understand
Distinct from F1's vague-vs-specific language check: does overall semantic/topical coherence (as opposed to individual-sentence clarity) affect citation likelihood?

#### B. Why it matters
A page could have individually well-written, specific sentences that are nonetheless topically scattered/incoherent as a whole — this is a page-level property, not a sentence-level one.

#### C. Current evidence
- **INFERENCE (from A15's reranking research, Topic A):** A15 already established that topical coherence/focus is a plausible input to reranking (a page diluting its core topic with unrelated content reduces relevance score) — semantic clarity at the page level is substantially the same concern already identified in A15, applied to the citation-generation stage rather than the reranking stage specifically.
- **No new distinct evidence found for a citation-generation-specific semantic-clarity effect beyond what A15 already covers for the reranking stage** — the honest assessment is that this sub-topic and A15 are measuring the same underlying page property (topical coherence) at two different, likely-correlated pipeline stages, and I don't have separate evidence they behave differently at each stage.

#### D-O.
No new standalone skill — fold into A15's topical-focus check (already planned for the freshness-corroboration or content-structure skill).

---

### B10 — Entity confidence

#### A. What we need to understand
How confidently must a retrieval/generation system "know" which real-world entity a page is about before it will cite that page, and what page-level signals affect this confidence?

#### B. Why it matters
This is the sub-topic with the strongest, most distinct new peer-reviewed evidence in this entire Section II — genuinely important and underused elsewhere in our research so far.

#### C. Current evidence
- **FACT (peer-reviewed, ACL 2021, Chen et al., "Evaluating Entity Disambiguation and the Role of Popularity in Retrieval-Based NLP," AmbER sets benchmark):** Retrievers tested across multiple open-domain NLP tasks (fact-checking, slot-filling, QA) show a **measurable, quantified popularity bias** in entity disambiguation: when multiple distinct entities share a name, retrievers are **significantly more likely to retrieve documents about the more popular entity**, even when the query context should disambiguate toward the less popular one — the paper's own reported example: retrievers are roughly **twice as likely to retrieve erroneous documents for queries about the less popular entity** sharing a name with a more prominent one.
- **FACT (peer-reviewed, University of Toronto study, Section 3 "Effect of Pre-Training Bias," directly relevant and newly substantive here):** For **popular/well-known entities**, model rankings/answers are highly stable and robust to evidence perturbation (snippet reordering, entity substitution) — the retrieved evidence functions as *confirmation* of an already-stable internal representation, not as the source of new knowledge (Kendall's τ = 0.911-1.000 between direct and pairwise-derived rankings in their controlled test). For **niche/less-known entities**, model outputs are highly sensitive to evidence order and content (Kendall's τ drops to 0.556, and their own snippet-shuffle sensitivity metric roughly doubles) — meaning **for well-known entities, on-page content has proportionally less influence over the final answer** (the model already "knows" what it thinks and uses retrieval mainly for reinforcement/citation formality), **while for lesser-known entities, on-page content has substantially more influence** and quality/framing differences on the page are more likely to directly shape the output. The same paper's citation-miss-rate table is a directly quotable, concrete illustration: well-known entities (Toyota, Honda) were cited/evidence-supported in the vast majority of cases (6%, 3% miss rates) while less mainstream entities in the same category (Cadillac, Infiniti) were missed 58% and 73% of the time despite being objectively part of the same answer set.

#### D. Important mechanisms
This produces a genuinely important, non-obvious, and previously-uncaptured strategic insight for the whole marketplace: **our audit's practical leverage is inversely related to how famous the brand already is.** For a well-known brand, retrieval/citation behavior is dominated by the model's pre-existing (pre-training-derived) representation, and on-page fixes have a measurably smaller marginal effect (the model already "knows" what it thinks, per the near-perfect Kendall's τ). For a lesser-known/niche brand — which is very plausibly the more common and more valuable case for this hackathon's target users — on-page content quality has a **measurably larger, more direct causal effect** on the output, and correspondingly our audit's recommendations have more real leverage. This is a genuinely valuable, evidence-backed way to calibrate expectations in our own report ("how much can fixing your website actually help" is not a constant — it depends on how well-known the entity already is).

#### E. Concrete website signals
Two related but distinct signals: (1) **name-collision/entity-popularity risk** (already covered in B3 above, from the same AmbER paper) — does the brand share a name with a more prominent entity; (2) **brand-recognition tier** (new here) — is this plausibly a "well-known" or "niche" entity in the pre-training-bias sense, which affects how much weight our audit's recommendations should carry and how the report should frame expected impact.

#### F. How the signal could be detected automatically
For (1): reuse B3's search-based ambiguity check. For (2): a rough proxy is feasible but inherently approximate — e.g., checking whether the brand has a dedicated Wikipedia page, a substantial cross-web citation footprint, or other easily-checked popularity proxies within the runtime budget; this should be presented as a rough calibration tier (well-known / moderately-known / niche), not a precise score, given how approximate any single proxy is.

#### G. What evidence the skill should report
The brand's estimated recognition tier and, tied directly to the AmbER/Toronto evidence, an honest framing: "for well-known brands, our on-page recommendations have measurably less independent leverage over AI citation outcomes because retrieval evidence functions mainly as reinforcement of an already-formed model representation; for less-established brands, on-page content quality has a measurably larger, more direct effect" — this is a genuinely valuable, differentiated, evidence-backed piece of expectation-setting most competing teams are unlikely to include.

#### H. Possible severity logic
Not a defect-severity signal in the usual sense — this is a **calibration/context signal** that should modulate how confidently the report frames the expected impact of its other recommendations, rather than being its own pass/fail finding.

#### I. Correct remediation
N/A directly — but this informs how remediation advice for *other* findings should be framed (higher-confidence impact framing for niche/emerging brands, more measured/hedged framing for already-prominent brands).

#### J. False-positive cases
The "well-known" classification is inherently approximate and could misclassify a brand that's well-known within a narrow professional/B2B niche (highly influential in pre-training for in-domain queries) but not broadly famous by generic popularity proxies (Wikipedia presence, etc.) — should be presented as a rough, hedged tier, not a precise, confident classification.

#### K. False-negative risks
The underlying peer-reviewed findings were measured on specific entity types (SUVs/consumer products for the Toronto study; general open-domain entities for AmbER) — generalization to all possible brand/entity types (e.g., highly specialized B2B software, local services) is a reasonable inference but not directly tested in either source.

#### L. Counterexamples
A niche brand with an unusually strong, well-documented Wikipedia/Wikidata presence could behave more like a "well-known" entity in the pre-training-bias sense despite modest general-public fame — recognition tier should be assessed via actual corroboration signals, not assumed from company size or industry alone.

#### M. Generalizes?
The underlying mechanism (popularity bias in entity disambiguation; pre-training-bias dominance for well-known entities) is peer-reviewed and appears robust across the different entity domains tested in the two source papers (open-domain QA/fact-checking/slot-filling for AmbER; consumer products for the Toronto study) — reasonably strong generalization, though the *specific proxies* we'd use to estimate recognition tier within a 5-minute audit are our own approximation.

#### N. Candidate skill
**`entity-recognition-tier`** (or fold into the `entity-disambiguation-risk` skill proposed in B3, since both draw on the same AmbER evidence base and both concern how well-resolved/recognized the brand's entity is) — genuinely one of the strongest new candidate skills to emerge from this Section II research, distinct from anything in Section I or Topic A, and should be a Combine-phase priority alongside `passage-quality-and-citation-risk`.

#### O. Relationship to other skills
Directly informs the report's overall confidence/impact framing across every other skill's recommendations — a strong candidate for the entrypoint's synthesis layer to consume early, alongside crawlability. Overlaps with Harsh's Topic F (Entity Recognition & Resolution) — explicit handoff/co-design flag, same as B3.

---

## 2. Findings register

---
**FINDING ID:** F-01
**Researcher:** Pulkit
**Research Area:** B — AI Citation Mechanics
**Research Question:** F2 — How often are AI citations actually supported by the page they're attributed to, and what does this imply about misrepresentation risk?
**Observation:** Two independent peer-reviewed studies in different domains (ALCE's general long-form QA benchmark; SourceCheckup's medical-domain replication) both find roughly half to the large majority of long-form citations are not fully supported by their cited source (ALCE: ~50% incomplete on ELI5; SourceCheckup: 50–90% not fully supported per human annotation).
**Evidence:** Gao et al. 2023, EMNLP ("Enabling LLMs to Generate Text with Citations," ALCE benchmark, 481 citations, Princeton NLP); SourceCheckup (medical RAG citation study, referenced in CryptoAnalystBench arXiv 2602.11304's literature review).
**Sources:** arxiv.org/abs/2305.14627; aclanthology.org/2023.emnlp-main.398; arxiv.org/pdf/2602.11304.
**Pattern:** Citation presence (a source is linked) is not the same as citation accuracy (the linked source actually supports the specific claim made). This gap is large and appears in more than one domain/study.
**Counterexamples:** Reranking passages before generation measurably improves citation quality per ALCE's own ablations — meaning the gap is not fixed/architectural, it's sensitive to retrieval/context quality, which is exactly what a website's own structure can influence.
**Hypothesis:** Structural separation of a fact from its qualifying context on a source page (A16's mechanism) is a plausible, testable root cause of downstream partial-support/misrepresentation citations, because a chunk-based retriever can supply the fact without its qualifier.
**Signal:** Isolated-fact-vs-full-context semantic delta for key fact types (pricing, dates, conditions, eligibility).
**How to Detect:** Deterministic fact/qualifier extraction (reuse A16 logic) + single LLM semantic-completeness judgment ("would reading only this excerpt mislead a reader about X").
**Evidence Output:** Isolated excerpt, full-context version, plain-language statement of what a reader would wrongly conclude.
**False Positives:** Facts with no meaningful qualifying condition (e.g., unconditional facts like founding year) should not be flagged.
**False Negatives:** Cannot confirm actual real-world misrepresentation without live-query testing (Topic R/A18); this is a risk/plausibility signal, not proof.
**Severity:** Critical (pricing/legal/safety facts) to Low (minor non-consequential facts).
**Recommended Fix:** Rewrite key facts as self-contained sentences carrying value + qualifier together (same fix as A-02/A16).
**Generalization:** Very high — pricing/condition-type misrepresentation risk is close to universal across commercial site types.
**Candidate Skill:** Same detection pass as A16's `passage-chunk-quality`, reporting a second "misrepresentation risk" output alongside "extractability risk."
**Related Skills:** A16 (Passage Retrieval), Topic K (AI Answerability), Topic Q (Competitive Intelligence — misrepresented-site dataset).
**Confidence:** HIGH (the underlying citation-inaccuracy rate is well-evidenced by two independent peer-reviewed studies) / MEDIUM (our specific proposed root-cause mechanism linking it to on-page chunk structure is a plausible, evidence-consistent inference, not yet directly tested).

---
**FINDING ID:** F-02
**Researcher:** Pulkit
**Research Area:** B — AI Citation Mechanics
**Research Question:** F3 — Does schema.org/JSON-LD structured data meaningfully improve live AI-citation accuracy, as commonly claimed?
**Observation:** Two independently-run, methodologically-described controlled tests (Williams-Cook's "duck test," Feb 2026; SearchVIU's 8-scenario multi-system test, 2025–2026) both found that ChatGPT and Perplexity extract information from visible HTML reliably but do **not** semantically validate/parse JSON-LD as structured data during live/direct-fetch query answering — they appear to tokenize it as raw text. In the Williams-Cook test, both systems extracted a fictitious fact that existed *only* in deliberately invalid JSON-LD, indicating the schema wasn't being validated as schema at all.
**Evidence:** seroundtable.com/chatgpt-perplexity-structured-data-text-40862.html; markwilliamscook.substack.com/p/schema-llms-and-the-low-bar-for-evidence; searchviu.com's 2025 test article.
**Sources:** See F3 section C for the full evidence table, including the countervailing (weakly-sourced) marketing claims explicitly presented and rejected.
**Pattern:** A fact stated only in schema markup, absent from visible text, is likely NOT reliably surfaced by at least ChatGPT and Perplexity at live-query time — contradicting widespread SEO/GEO marketing advice to treat schema as a primary AI-citation lever.
**Counterexamples:** Schema may still matter for crawl-time indexing/entity-graph building (a different pipeline stage than live query-time fetch) and for traditional search rich results; JS-rendered content (different from schema) was picked up more reliably via pre-built index than live fetch, suggesting index-time and query-time behavior genuinely differ — an important nuance, not a clean single verdict.
**Hypothesis:** N/A — this section is itself the resolution of a hypothesis (the common "schema improves AI citation" claim), tested against available evidence and found not well-supported for live-query extraction specifically.
**Signal:** Fact present in JSON-LD but absent from visible rendered text.
**How to Detect:** Fully deterministic: parse JSON-LD, extract field values, check for corresponding visible-text mentions.
**Evidence Output:** List of schema-only facts with no visible-text counterpart, by field name and value.
**False Positives:** Absence of schema entirely must NOT be flagged as a defect — only "schema-only, no visible-text counterpart" should be flagged. This is an explicit correction against a plausible, common false-positive pattern.
**False Negatives:** Findings are specific to ChatGPT/Perplexity (and partially Gemini/Google AI Mode); no equally rigorous evidence found for Claude specifically; behavior may change with future model/product updates and should be periodically re-verified.
**Severity:** Medium-High only when a core transactional fact exists solely in schema; otherwise Low.
**Recommended Fix:** Ensure every fact asserted in schema also appears in plain visible text; do not treat schema as a substitute for visible-text extractability.
**Generalization:** Detection method fully generalizes; the underlying behavioral claim is time-sensitive/vendor-specific and should be flagged as such with dated sources.
**Candidate Skill:** `structured-data-visible-text-parity` (standalone or folded into `crawl-render-audit`).
**Related Skills:** Topic G (Structured Data & Semantic Web, Harsh) — explicit cross-team flag recommended.
**Confidence:** MEDIUM — two independently converging controlled tests is meaningfully more than one anecdote, but both are informal/practitioner-run rather than peer-reviewed, with small test scope; treat as OBSERVATION-tier, strong enough to override the (weakly-sourced) contrary marketing claims, not strong enough to state as unqualified FACT.

---
**FINDING ID:** F-03
**Researcher:** Pulkit
**Research Area:** B — AI Citation Mechanics
**Research Question:** F1 — What passage-level textual properties predict citation-worthiness, independent of whole-page/domain authority?
**Observation:** ALCE's ablations found (a) reranking passages before generation improves citation quality and (b) simply supplying good retrieved passages in context ("VANILLA") achieves close-to-best performance versus more elaborate prompting — both point to passage quality/selection, not prompting cleverness, as the dominant lever. The Aggarwal et al. GEO paper separately found specific content interventions (statistics, quotations, attributed/authoritative phrasing) improve citation likelihood 30–40% on their metric.
**Evidence:** Gao et al. 2023 (ALCE, EMNLP); Aggarwal et al. 2024 (arXiv 2311.09735).
**Sources:** aclanthology.org/2023.emnlp-main.398; arxiv.org/pdf/2311.09735.
**Pattern:** Citation-worthiness at the passage level correlates with specific, quotable, attributable, unhedged factual statements — not vague marketing language — independent of overall page/domain authority.
**Counterexamples:** Content types where qualitative/aspirational language is the legitimate norm (brand voice, mission statements) should not be penalized for lacking quantified claims.
**Hypothesis:** Pages with a higher ratio of specific/quotable statements to vague superlatives, on factual/comparative page types specifically, are more competitive for citation.
**Signal:** Ratio of vague-marketing-language patterns to specific/quantifiable claim patterns on factual-intent pages.
**How to Detect:** Deterministic lexicon/pattern matching + LLM escalation for ambiguous cases.
**Evidence Output:** Flagged vague sentences with, where available, the more specific version of the same fact found elsewhere on the site.
**False Positives:** Non-factual-intent pages (about/mission/voice pages) should be excluded from this check.
**False Negatives:** Content-level fixes are necessary but not sufficient — list position/competitive dynamics (A17/A19) also matter and are outside content control alone.
**Severity:** Medium on factual/comparative pages dominated by vague language.
**Recommended Fix:** Replace vague superlatives with specific, falsifiable facts, pulled forward from elsewhere on the site if they already exist.
**Generalization:** High, with site-type-dependent scoping (must exclude legitimately qualitative content types).
**Candidate Skill:** Fold into `citation-competitiveness` (A17).
**Related Skills:** A16 (Passage Retrieval), A17 (Source Selection), Topic E (Content Extraction & IA).
**Confidence:** MEDIUM-HIGH — both underlying studies are peer-reviewed/well-cited; our specific vague-vs-specific-language operationalization is our own reasonable but untested detection design.

---

---
**FINDING ID:** B-01
**Researcher:** Pulkit
**Research Area:** B — AI Citation Mechanics
**Research Question:** B10 — Does entity "fame"/recognition level change how much a website's own content can influence AI citation/answer behavior?
**Observation:** Two independent peer-reviewed studies converge on the same underlying mechanism from different angles: (1) AmbER sets (ACL 2021) found retrievers are roughly twice as likely to mis-retrieve documents for a less-popular entity sharing a name with a more prominent one; (2) the University of Toronto study (2026) found that for well-known/popular entities, model answers are highly stable and largely invariant to retrieved-evidence perturbation (Kendall's τ up to 1.000), while for niche entities, answers are highly sensitive to evidence content and order (τ as low as 0.556) — with a concrete citation-miss-rate illustration showing mainstream entities (Toyota, Honda) cited far more reliably than less-mainstream entities in the same category (Cadillac, Infiniti) despite equal topical relevance.
**Evidence:** Chen et al. 2021, ACL ("Evaluating Entity Disambiguation and the Role of Popularity in Retrieval-Based NLP," AmbER sets); Chen, Wang, Chen, Koudas 2026, arXiv 2601.16858 ("Navigating the Shift").
**Sources:** aclanthology.org/2021.acl-long.345; arxiv.org/html/2601.16858v1.
**Pattern:** Website-level content quality has measurably more leverage over AI citation/answer outcomes for less-famous/niche brands, and measurably less leverage for already-prominent brands, because well-known entities' answers are dominated by stable pre-training-derived representations rather than by the specific retrieved evidence.
**Counterexamples:** A niche brand with unusually strong Wikipedia/Wikidata presence could behave more like a "well-known" entity despite modest general fame; recognition tier should be assessed via actual corroboration signals, not company size or industry assumptions.
**Hypothesis:** A rough, evidence-based "recognition tier" classification (well-known / moderate / niche) can meaningfully calibrate how confidently our audit should frame the expected impact of its other recommendations.
**Signal:** Brand name-collision risk (search-based); rough popularity/corroboration proxies (Wikipedia presence, cross-web citation footprint) within runtime budget.
**How to Detect:** Hybrid — deterministic search-based name-collision check; approximate popularity-tier proxy via corroboration-footprint check.
**Evidence Output:** Estimated recognition tier with supporting evidence; explicit, hedged framing of how this modulates expected impact of other findings.
**False Positives:** Narrow B2B/professional-niche fame not captured by generic popularity proxies.
**False Negatives:** Underlying studies tested specific entity domains (open-domain QA/fact-checking, consumer products); generalization to all brand/entity types is a reasonable but untested inference.
**Severity:** N/A — this is a calibration/context signal, not a pass/fail defect.
**Recommended Fix:** N/A directly; informs framing of other findings' expected impact.
**Generalization:** Strong for the underlying mechanism (peer-reviewed, robust across two different entity domains); weaker for our own specific detection proxies.
**Candidate Skill:** `entity-recognition-tier` (or merged with `entity-disambiguation-risk` from B3).
**Related Skills:** B3 (name-collision risk), Topic F/G (Harsh, Entity Resolution) — explicit handoff flag.
**Confidence:** HIGH — two independent, peer-reviewed, methodologically rigorous studies converging on the same underlying mechanism from different angles is about as strong as evidence gets in this entire research project.

---
**FINDING ID:** B-02
**Researcher:** Pulkit
**Research Area:** B — AI Citation Mechanics
**Research Question:** B2/B3 — What characterizes commonly-cited vs. ignored websites, and does the popular narrative (UGC/Reddit-heavy citation) hold up against rigorous evidence?
**Observation:** Commercial citation-tracking studies show contradictory aggregate concentration statistics (one claims top-15 domains capture 68% of citations; another, analyzing 7,058 unique domains, claims the top 10 capture only 11-13%), while a peer-reviewed, methodologically transparent study found AI engines (especially Claude) systematically favor "earned" media and official "brand" sources over social/UGC sources, with source-type preference shifting predictably by query intent (informational/consideration/transactional).
**Evidence:** Commercial sources (everything-pr.com, ahrefs.com, tryanalyze.ai) presented and explicitly weighed against arXiv 2601.16858 (peer-reviewed-adjacent, methodologically transparent, University of Toronto).
**Sources:** See B2/B3 sections C for full citations and explicit handling of the contradiction.
**Pattern:** Aggregate domain-level citation-share statistics from commercial tools are unreliable/contested and should not be hard-coded into our skill; the query-intent-dependent source-type preference pattern from the peer-reviewed study is far more trustworthy and directly actionable.
**Counterexamples:** The commercial studies' Reddit/UGC-heavy narrative is directly contradicted by the peer-reviewed study's finding of Claude citing 65% earned vs. 1% social — a genuine, unresolved dispute in the evidence base, presented honestly rather than resolved by picking the more convenient number.
**Hypothesis:** N/A — this finding is itself a resolution-in-progress of a contested empirical question, not a proposed hypothesis.
**Signal:** N/A — informs calibration of A13, A17, A18 rather than yielding its own detectable signal.
**How to Detect:** N/A.
**Evidence Output:** N/A — a calibration finding, not a detectable check.
**False Positives:** Building severity logic that assumes "official/brand pages are systematically disadvantaged vs. UGC" would be an evidence-unsupported assumption given the peer-reviewed study's contrary finding.
**False Negatives:** N/A.
**Severity:** N/A.
**Recommended Fix:** N/A — a research-calibration finding.
**Generalization:** The query-intent-dependent pattern (FACT-tier) generalizes; the aggregate concentration statistics (contested OBSERVATION-tier) should not be generalized or hard-coded.
**Candidate Skill:** None standalone — informs A13, A17, A18.
**Related Skills:** A13 (Search Intent), A17 (Source Selection), A18 (Source Substitution).
**Confidence:** MEDIUM-HIGH for the peer-reviewed study's specific findings / LOW for any single aggregate concentration statistic from the commercial sources, which should not be relied upon given the direct contradiction found between them.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
Citation presence and citation accuracy are empirically different things, evidenced by two independent peer-reviewed studies (ALCE, SourceCheckup) finding roughly half to the large majority of long-form AI citations are not fully supported by their cited source. Combined with B-01's root-cause link back to A16's chunk-boundary mechanism, this gives the marketplace a genuine, evidence-backed answer to the project's explicit "why is information misrepresented" mandate — not a generic content-quality checklist, but a specific, testable structural cause (fact/qualifier separation) with a specific, cheap fix.

**Strongest unvalidated hypothesis:**
That the specific *type* of citation failure (no support vs. partial support vs. full-but-wrong-emphasis) is diagnostically linked to a specific *type* of on-page structural defect — e.g., partial-support failures correlating specifically with fact/qualifier chunk-boundary separation, while no-support failures correlate more with retrieval-stage absence (A11/A18). This finer-grained diagnostic mapping is plausible given the mechanisms we've evidenced separately, but we have not tested it as a joint hypothesis.

**Strongest candidate skill:**
Merging A16 + F1 + F2 into one **passage-quality-and-citation-risk** skill: deterministic fact/qualifier extraction feeding two distinct, clearly-labeled outputs (extractability risk — will this be found; misrepresentation risk — will this be found *incompletely* and stated wrong) plus a citation-worthiness sub-check (is this a vague or specific/quotable statement). This single detection pass, grounded in the strongest and most convergent evidence across both Topic A and Topic B, does more diagnostic work per unit of engineering effort than any other candidate skill identified so far.

**Weakest assumption we should investigate next:**
F-02's (originally B-02) schema/JSON-LD finding, while based on two converging tests, rests on informal, practitioner-run experiments (not peer-reviewed, small sample sizes, single-page test constructions) rather than a large-scale academic study — and explicitly has no equivalent test for Claude. Before hard-coding "schema doesn't help live citation" as a scoring assumption, we should ideally either (a) run our own small confirmatory test during Topic R's experiment design phase, using the same "fact only in invalid/isolated schema" methodology across all four assistants including Claude, or (b) keep this check's severity conservative (Medium, not Critical) until independently re-confirmed, given how directly it contradicts widespread practitioner belief and how much downstream design (ours and Harsh's Topic G) could be built on it.

**Additional strongest validated insight (from Section II's B10):**
Entity recognition/fame level measurably changes how much leverage on-page content has over AI citation outcomes — two independent peer-reviewed studies (AmbER sets, ACL 2021; the Toronto pre-training-bias study, 2026) converge on this from different angles. This is a genuinely important addition to the synthesis: it means our audit's own confidence framing should be **conditional on the brand's recognition tier**, not uniform — a finding that didn't exist in the original F1-F4 research pass and meaningfully sharpens the whole marketplace's expectation-setting.

**Additional weakest assumption (from Section II's B2/B3):**
The popular commercial "AI citations are Reddit/UGC-dominated" narrative is directly contradicted by our strongest peer-reviewed source in this section (Claude measured at 65% earned vs. 1% social). Given this is a live, unresolved contradiction in the secondary evidence, we should not hard-code either the "concentration" or the "UGC-dominance" narrative into severity/scoring logic, and should prefer the query-intent-dependent source-type pattern (which both sources' underlying mechanism is at least directionally consistent with) over any single concentration statistic.

---

## 4. Cross-references for the Combine & Code phase

- **F1/F2 ↔ A16 (both mine):** Very likely one skill, not three — flagged for my own consolidation before Combine phase, not a cross-person conflict.
- **F3 ↔ Topic G (Harsh, Structured Data & Semantic Web):** **Important, concrete flag** — Harsh's topic could easily default to "validate schema, recommend more schema" as its core value proposition; this research suggests schema's live-citation value is weakly evidenced and possibly overstated in common practitioner advice, while its value for entity-graph/corroboration purposes (Harsh's actual stated focus: "entity types, identifiers, sameAs") is more plausible and better-suited to what schema is actually for. Recommend sharing section F3 directly with Harsh so Topic G's severity logic doesn't inadvertently overstate live-citation impact.
- **F2 ↔ Topic Q (mine, Competitive Intelligence):** The "cited but wrong" failure mode is exactly the kind of repeatable signal Topic Q should be hunting for when building the cited/uncited/misrepresented site dataset — misrepresented sites are a distinct third category from simply uncited sites, and F2 gives a concrete mechanism to test for when building that dataset.
- **F4 (citation prominence as gradient) ↔ Topic S (Soham, Scoring & Severity) and Topic AB (Soham, Report Design):** If Topic R's live-query probe is built, recommend the report schema capture citation prominence (first-cited/co-cited/uncited) rather than a flat boolean, per the SIGIR paper's own first-citation framing.
- **B3/B10 (`entity-disambiguation-risk` / `entity-recognition-tier`) ↔ Topic F/G (Harsh, Entity Recognition & Resolution):** Both new candidate skills from Section II draw directly on the AmbER sets peer-reviewed evidence base and concern how well-resolved/recognized the brand's entity is — genuinely strong candidates for co-design with Harsh rather than independent construction, to avoid building two overlapping entity-resolution skills.
- **B1 (the "why A not B" framing) ↔ Topic S/AB (Soham, Scoring & Report Design):** Established that comparative "why does a competitor get cited over us" questions should be answered by the entrypoint's synthesis layer composing existing static findings (A11/A16/F1/F3/C-family) rather than via any single new causal-claim skill — a design principle for whichever skill(s) own final report synthesis.
- **B2 (contested commercial citation-concentration statistics) ↔ Topic Q (mine, Competitive Intelligence) and Topic R (mine, Experiment Design):** Recommend Topic Q/R's own methodology be more rigorous/transparent than the commercial sources found here (explicit query-sampling methodology, defined citation criteria) precisely because this research surfaced how unreliable and contradictory similarly-scoped commercial studies can be.
