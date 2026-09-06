# Topic W — User Query → Page Matching (W1–W12)
**Researcher:** Soham | **Research Area:** W — User Query → Page Matching
**Priority:** Very High

---

## 0. Framing — what's genuinely new here vs. what overlaps with already-established work

Topic W sits at a different *granularity* than Pulkit's already-established A16 (chunk/passage quality) and F1/F2 (citation-worthiness, misrepresentation risk), and it's worth being precise about the difference rather than quietly duplicating either. A16/F2 ask: **given a chunk of this page, is it internally self-contained and non-misleading?** Topic W asks a prior, different question: **given a query a real user or AI system would plausibly issue, does *this page* (or *this passage of it*) actually answer that specific query — and does what got promised about the page (via a search snippet, meta description, or an AI's citation) match what the page actually delivers once you're on it?** The first is about content integrity; the second is about *fit* between a specific information need and a specific piece of content, and about *consistency* between the promise and the delivery.

Two of the twelve named sub-topics (W3, W4, W6 — query-to-heading, query-to-answer, and question-answer matching) genuinely do sit close to A16's existing heading-to-content and chunk-completeness work, and I've disclosed that overlap explicitly in Cluster B rather than re-deriving it as if it were new. The other nine sub-topics — especially the promise-vs-delivery cluster (W7–W10) — are where this topic's real, load-bearing new research lives, and I found a genuinely strong, concrete, *pre-AI* evidentiary anchor for it that I did not expect going in (Section on Cluster C).

The twelve sub-topics collapse into **five clusters**, one of which (E, comparison pages) is really a specific, high-value instance of Cluster A rather than a fully independent mechanism — disclosed honestly below rather than padded into a separate treatment.

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. Cluster map — W1–W12 collapsed to five mechanisms

| Sub-topic | Cluster | Why it groups here |
|---|---|---|
| W1 intent-page alignment, W2 query-to-page semantic similarity, W5 landing-page relevance | **A — Intent-type alignment** | All three ask the same page-level question: does this page match the *category* of need (informational/navigational/transactional) a plausible query implies |
| W3 query-to-heading similarity, W4 query-to-answer similarity, W6 question-answer matching | **B — Structural/passage-level query matching** | Overlaps substantially with Pulkit's A16; the new angle here is matching *from* a hypothesized query rather than checking a chunk's self-containment in isolation |
| W7 content mismatch after AI citation, W8 promise vs. delivery, W9 snippet vs. destination consistency, W10 citation-context mismatch | **C — Promise-delivery & citation-context consistency** | The genuinely new, most evidenced cluster: what happens when a snippet/meta-description/AI citation sets an expectation the destination page doesn't match |
| W11 query-specific evidence availability | **D — Evidence-type availability** | A narrower, distinct question: for *this specific query type* (price lookup, comparison, feature confirmation), does the page contain the specific evidence *type* needed, independent of general topical relevance |
| W12 competitor comparison landing pages | **E — Comparison-intent special case** | Not an independent mechanism — a specific, commercially important instance of Cluster A (intent alignment) applied to comparison-shopping queries, with its own detectable bias pattern |

---

## Cluster A — Intent-type alignment
**Covers:** W1 (intent-page alignment), W2 (query-to-page semantic similarity), W5 (landing-page relevance)

### A. What we need to understand
Whether a page's content actually matches the *type* of need behind a plausible query aimed at it — not just whether the words overlap, but whether an informational query lands on informational content, a transactional query lands on a page that supports the transaction, and so on.

### B. Why it matters
This is the mechanism behind two Round-2 failure modes at once: an AI surfacing/citing a page for a query type the page doesn't actually serve (discoverability side), and a human visitor arriving expecting one kind of experience and finding another (engagement side) — directly unifying the project's two stated halves rather than treating them separately.

### C. Current evidence

**FACT** — Andrei Broder's foundational taxonomy of web search (2002) formally classifies queries into three intent categories — navigational (reach a specific site), informational (acquire information assumed to exist on the web), and transactional (perform a web-mediated activity, e.g., shop, download) — and empirically found informational queries make up under half of all web searches, with the remainder split between navigational and transactional. This taxonomy remains the standard reference point cited across subsequent query-intent classification research (e.g., the ORCAS-I dataset explicitly builds its labeling scheme directly on Broder's three categories).

**FACT** — Broder's own paper explicitly cautions that "there is no assumption here that this intent can be inferred with any certitude from the query" — later summarized by other researchers as intent inference being "at best an inexact science, but usually a wild guess." **This is a genuine, source-stated epistemic limit, not a hedge I'm adding myself** — any automated intent classifier built on this taxonomy inherits documented uncertainty, and the skill's confidence-handling needs to reflect that rather than presenting intent classification as a solved, deterministic step.

**INFERENCE** — A page can match a query's *topic* (word/semantic overlap) while failing to match its *intent type* — e.g., a transactional query ("buy noise-cancelling headphones") landing on an informational blog post that discusses headphones without a purchase path is a topic match and an intent mismatch simultaneously, and generic semantic-similarity scoring (embedding cosine similarity) would not by itself distinguish these two outcomes, since both are topically similar.

**FACT (confirmed via live practitioner sources as a commonly-audited, named failure pattern, not a speculative concern)** — This exact failure mode is explicitly documented in current SEO practice as a common, real audit finding: "a common structural flaw happens when a content director audits their site and realizes highly transactional terms are currently pointing to long-form educational blog posts" — confirming Cluster A's core concern is a recognized, recurring pattern rather than a theoretical construction.

**INFERENCE (a genuine refinement, not just corroboration)** — Current practitioner framing treats intent as a **percentage-based spectrum** (e.g., "70% transactional, 30% commercial") rather than a strict three-way classification, and recognizes a well-established **fourth category, "commercial investigation"** — a user who has essentially decided to buy but is still actively comparing options. This directly legitimizes Cluster E (comparison-intent) as a genuinely distinct intent category in established practice, not merely a special case this document invented by splitting Cluster A. It also suggests the skill's intent classifier should output a distribution or dominant-category-with-confidence rather than a single hard label, consistent with Broder's own documented uncertainty (W-01).

**FACT (a concrete, low-cost corroborating signal)** — A practical, established method for verifying inferred intent is to inspect what already ranks for a given query: if page-one results are predominantly how-to/guide content, the intent is informational; if they are predominantly product/category pages with shopping features, the intent is transactional. This is a genuinely cheap way to cross-check an LLM-inferred intent classification against independent, observable evidence (existing search-result composition) rather than relying on query-text classification alone.

### D. Important mechanisms
The unifying insight: semantic similarity (W2) is necessary but not sufficient — intent-type classification is an orthogonal axis that has to be checked separately, and Broder's own explicit uncertainty caveat means this check should report a confidence band, not a binary match/no-match verdict.

### E. Concrete website signals
Presence/absence of a supporting mechanism for the inferred intent type (a "buy"/"add to cart"/"contact sales" element for transactional; a clear, direct textual answer for informational; a single, unambiguous canonical destination for navigational); semantic-similarity score between a representative query set and the page's core content as a first-pass filter, with intent-type classification as a separate, second check layered on top.

### F. How the signal could be detected automatically
Hybrid: semantic similarity is a cheap, deterministic embedding-based check; intent-type classification for a given plausible query is the genuinely judgment-requiring LLM step (informed directly by Broder's three-category scheme as the classification target), reported with an explicit confidence level rather than a hard label, consistent with the source material's own documented uncertainty.

### G. What evidence the skill should report
The specific representative query used, the inferred intent type and its confidence, the page's semantic-similarity score, and — where a mismatch is flagged — the specific missing intent-supporting element (no purchase path, no direct answer, ambiguous destination).

### H. Possible severity logic
Higher severity where a transactional-intent query lands on a page with no supporting transaction path at all (a hard mismatch); lower/informational severity for softer cases (a mostly-informational page that could add a clearer next step) — severity should scale down as classification confidence drops, given the documented unreliability of intent inference from query text alone.

### I. Correct remediation
Add the missing intent-supporting element (a clear CTA for transactional pages, a direct-answer passage for informational pages, canonicalization/consolidation for navigational ambiguity) rather than rewriting content wholesale.

### J. False-positive cases
A page can legitimately serve multiple intents at different points in a user's journey (a product page that's informational for a first-time visitor and transactional for a returning one) — flagging every non-transactional element on a product page as a "missing CTA" defect would over-fire; the check should look for *presence somewhere*, not dominance.

### K. False-negative risks
Given Broder's own documented inference difficulty, a low-confidence classification could be wrongly treated as "no finding" when the real issue is that the query itself is genuinely ambiguous in intent (Broder's own example) — this should be reported as an explicit uncertainty, not silently dropped.

### L. Counterexamples
A page that appears to mismatch a naive query's inferred intent may be intentionally serving a narrower, correctly-scoped audience (a wholesale-only page correctly lacking a retail "buy now" button) — site-type context (Topic V) should gate this check the same way it gates others.

### M. Generalizes?
Yes — Broder's taxonomy is domain-agnostic and has held up as a reference standard for over two decades of subsequent query-intent research.

### N. Candidate skill(s)
Core module of the proposed **Query-to-Page Alignment Auditor** (see Section 4) — this cluster supplies the top-level intent-classification layer the rest of the skill's checks build on.

### O. Relationship to other skills
Feeds directly into Topic V's site-type classifier (a transactional-intent expectation should be calibrated by V's commercial-vs-institutional cluster) and into Topic X (AI-to-human handoff), since a visitor arriving with a specific intent already inferred by an AI needs that same intent honored on landing.

---

## Cluster B — Structural / passage-level query matching
**Covers:** W3 (query-to-heading similarity), W4 (query-to-answer similarity), W6 (question-answer matching)

### A. What we need to understand
Whether, once a page is confirmed topically and intent-relevant (Cluster A), its *internal structure* (headings, specific answer passages) is organized so that a specific query would actually resolve to the right passage — not just whether the page as a whole is relevant.

### B. Why it matters
This is the mechanism most directly responsible for a specific, common failure: a page that's a good overall match for a topic but where the *specific* answer to a *specific* query is buried, poorly headed, or not clearly paired with its question — the classic "the answer's in there somewhere" complaint.

### C. Current evidence

**INFERENCE (explicit cross-reference, not new territory)** — This cluster substantially overlaps with Pulkit's already-established A16 findings on heading-to-content proximity and chunk-level self-containment, and Topic D's D18 finding on heading-immediately-above-answer patterns. **I am not re-deriving that mechanism here.** The genuinely distinct angle this cluster adds is directional: A16 checks a chunk's internal quality in isolation; this cluster checks it *from the query side* — given a specific, representative query, does the page's heading structure and answer placement actually resolve to that query's answer efficiently, which requires generating representative queries first (Cluster A's output) rather than just auditing structure in a vacuum.

**INFERENCE** — A page can have excellent internal chunk quality (per A16) and still fail this check if its headings use internal jargon or marketing language that doesn't match how a real query would be phrased (e.g., a heading "Our Approach" versus a query "how does [product] work") — this is a *query-to-heading vocabulary gap*, a distinct failure mode from A16's self-containment concern, and the one genuinely new contribution of this cluster.

### D. Important mechanisms
The unifying insight: this cluster's real, non-duplicated value is the **vocabulary-gap check between how users/AI systems phrase queries and how the page phrases its own headings/answers** — not a new structural-quality mechanism, since that's already A16's territory.

### E. Concrete website signals
Semantic-similarity score between a representative query set (from Cluster A) and the page's heading text specifically (not just body text); presence of a direct, extractable answer within a short window of the heading that most closely matches a representative query.

### F. How the signal could be detected automatically
Deterministic embedding-similarity scoring between headings and representative queries; reuses A16's existing self-containment/proximity infrastructure entirely rather than building a parallel one.

### G. What evidence the skill should report
The representative query, the best-matching heading, their similarity score, and whether a direct answer is reachable within a short window of that heading — explicitly citing A16's methodology rather than presenting this as a new mechanism.

### H. Possible severity logic
Inherits A16's severity tiers directly; the query-to-heading vocabulary gap is a contributing signal that lowers confidence in "this page would resolve this query well," not a separately-scored defect.

### I. Correct remediation
Add or adjust headings toward how real queries are phrased (without resorting to unnatural keyword-stuffing) — a light-touch fix, not a rewrite.

### J. False-positive cases
Technical/expert-audience sites are expected to use precise, technical heading vocabulary that won't match a naive/general-audience query phrasing — this should be gated by audience-sophistication context (already established in Pulkit's A12/A13 handling), not flagged uniformly.

### K. False-negative risks
A page could coincidentally use query-matching vocabulary in a heading that doesn't actually lead to a complete answer nearby — vocabulary match alone isn't sufficient evidence; it must be paired with A16's proximity/completeness check to avoid a shallow, keyword-only verdict.

### L. Counterexamples
A page with unusual but authoritative terminology (a medical or legal term used correctly in a heading) shouldn't be dinged just because a lay query wouldn't use the same words — the appropriate fix there is often an added lay-term synonym nearby, not renaming the heading itself.

### M. Generalizes?
Yes — the vocabulary-gap mechanism applies to any content type; its practical stakes are highest on pages meant to directly answer specific questions (support docs, product pages, FAQs).

### N. Candidate skill(s)
No new skill — a query-vocabulary-gap check layered onto Pulkit's existing A16 heading/chunk infrastructure, feeding the same **Query-to-Page Alignment Auditor** as configuration/query input, not a parallel detection mechanism.

### O. Relationship to other skills
Directly, explicitly built on top of A16 (Topic A) and D18 (Topic D); should be implemented as an extension, not a duplicate skill — flagged for discussion at merge time.

---

## Cluster C — Promise-delivery & citation-context consistency
**Covers:** W7 (content mismatch after AI citation), W8 (promise vs. delivery), W9 (snippet vs. destination consistency), W10 (citation-context mismatch)

### A. What we need to understand
Whether the *expectation* set by a snippet, meta description, title tag, or an AI's citation/summary actually matches what a visitor or downstream reader finds once they reach the destination page — and, critically, whether this is a genuinely new AI-era problem or an older, already-documented one that AI citation simply inherits and potentially amplifies.

### B. Why it matters
This is the cluster with the single strongest evidentiary anchor I found in this entire research pass, and it reframes the whole problem usefully: **this mismatch mechanism predates generative AI entirely** and is a documented property of extraction-by-query-phrasing itself, not an LLM-specific hallucination issue — which means the fix is a page-design/content-structure problem the site owner can actually act on, not something that depends on any particular AI vendor's behavior.

### C. Current evidence

**FACT (concrete, recent, directly relevant, and genuinely strong)** — A 2024 investigation (Sarah Presch, Dragon Metrics) found that Google's Featured Snippets pull **contradictory statements from the same source article** depending purely on how a query is phrased: searching "link between coffee and hypertension" surfaces a snippet from a Mayo Clinic article emphasizing that caffeine can spike blood pressure, while searching "no link between coffee and hypertension" surfaces a *different* snippet from the *same* article instead emphasizing that caffeine has no long-term effect — with similar contradictions documented across health, political, and news topics.

**FACT** — Google's own internal engineers were quoted (in documents dated 2016, resurfaced in coverage of this study) acknowledging a foundational limitation directly relevant to this mechanism: **"We do not understand documents – we fake it."** This is a rare, direct, named-source admission that snippet/passage extraction is fundamentally a similarity-and-phrasing-driven selection process, not genuine document comprehension — a mechanism-level fact, not our own inference.

**FACT** — Google has publicly acknowledged and iterated on this exact problem multiple times over several years: reports of "improbable or laughably incorrect" featured snippets led to product changes; a 2018 update introduced "multifaceted" snippets to show more than one interpretation of an ambiguous query; a later update tied snippet answers to cross-referencing "multiple high-quality sources" via Google's MUM model specifically to reduce single-source-driven contradictions, and to suppress snippets entirely for "false premise" queries.

**FACT (direct, controlled, current-model evidence — the strongest single finding in this document)** — A 2026 controlled experiment (Yun et al., arXiv:2604.05051) tested exactly this mechanism on 8 current LLMs, **including Claude Sonnet 4.5 and GPT-5.1**, in a RAG setting where the underlying evidence documents were held fixed and only query framing (positive vs. negative) varied. Paired responses to identically-framed queries agreed on the evidence's directional conclusion 76.2% of the time; paired responses to oppositely-framed queries — given the *exact same* underlying evidence — agreed only 72.0% of the time, a statistically significant drop (p < .001) present in every model tested, amplified across multi-turn conversations. This is no longer a search-engine analogy extended by inference; it is a **direct demonstration that current frontier LLMs draw different conclusions from identical source evidence purely as a function of how the question was asked.**

**INFERENCE (the direct, load-bearing synthesis for this cluster, now resting on the above fact rather than an untested extension)** — Because this effect is now demonstrated directly on current-generation models rather than inferred from search-engine behavior, the practical implication for website content is immediate: **a nuanced or two-sided source page is at genuine, demonstrated risk of being selectively summarized by an AI system to match the asker's apparent framing**, and the fix (ensuring any single extractable sentence remains accurate and caveated in isolation) is squarely the page owner's to make.

**INFERENCE (W8, promise vs. delivery, a related but distinct sub-mechanism)** — A page's title tag and meta description function as an explicit, self-authored "promise" about what the page contains; when that promise doesn't match the actual on-page content (a common, longstanding on-page SEO problem — an aspirational or clickbait-style title over thinner or different actual content), the mismatch is fully within the site owner's own control to detect and fix, unlike W7/W9/W10's more probabilistic query-phrasing risk. This is a clean, deterministic, comparatively simple check relative to the rest of this cluster.

### D. Important mechanisms
The unifying insight: this cluster has two genuinely distinct sub-mechanisms sharing a common symptom (expectation ≠ delivery). One (W8) is a **direct, checkable, page-owner-controlled promise** (title/meta vs. body content — deterministic). The other (W7/W9/W10) is a **phrasing-driven, extraction-side selection risk** that the page owner only indirectly controls, by writing balanced, clearly-scoped content that resists being validly quoted in a misleading, one-sided way regardless of how a query is phrased — and it's a documented, pre-AI phenomenon that generative AI plausibly inherits, not a uniquely AI problem.

### E. Concrete website signals
Title-tag/meta-description text compared semantically against actual page-body content (W8, deterministic); presence of nuanced or two-sided claims on a topic where a narrow, single-framing extraction could misrepresent the page's actual overall position (W7/W9/W10) — detectable by checking whether a sentence-level extract, tested against multiple plausible opposing-framing queries, would produce meaningfully different apparent conclusions.

### F. How the signal could be detected automatically
W8 is cheap and deterministic: semantic-similarity scoring between title/meta and body content. W7/W9/W10 require a genuinely more involved hybrid check: generate 2–3 plausible, oppositely-framed queries for a page's topic (reusing Cluster A's query-generation step), extract what a passage-level retriever would most likely surface for each, and flag cases where the extracts would leave a reader with meaningfully different impressions of the page's actual, full position — an LLM-judgment step, since "meaningfully different impression" is inherently a semantic call, not a string-matching one.

### G. What evidence the skill should report
For W8: the specific title/meta claim and how it doesn't match body content. For W7/W9/W10: the specific opposing query framings tested, the specific extract each would likely surface, and a plain-language note on how a reader's takeaway would differ — directly reusing the evidence-output convention already established in Pulkit's F2 misrepresentation-risk findings, since this is a closely related but distinct downstream risk.

### H. Possible severity logic
W8: scales with how consequential the mismatched promise is (a pricing page whose title implies "free" but body reveals paid tiers only after signup is higher severity than a stylistic title flourish). W7/W9/W10: scales with topic sensitivity (reusing Topic V's Cluster A/YMYL gating — a health or civic-topic page at risk of this kind of framing-driven selective extraction is higher severity than the same pattern on a low-stakes topic).

### I. Correct remediation
W8: align title/meta with actual body content, or update body content to actually deliver on the promise. W7/W9/W10: this is the harder, more novel remediation — the fix is **not** to write one-sided content in either direction, but to ensure that *whichever* single sentence gets extracted for *either* framing of a query, that sentence itself remains accurate and appropriately caveated in isolation (a direct extension of the fact/qualifier self-containment principle already established elsewhere, now applied specifically to opposing-framing robustness rather than just chunk-boundary robustness).

### J. False-positive cases
A page taking a genuinely one-sided, correct position on a settled question (e.g., a page correctly stating vaccines do not cause autism) should not be flagged for "lacking balance" — the check is about whether a *nuanced, genuinely two-sided* topic is being selectively distorted by extraction, not a mandate that every page present "both sides" of settled questions; this needs the same settled-vs-genuinely-contested distinction Topic V's Cluster A already draws for legal/medical hedging.

### K. False-negative risks
A page might pass this check for the specific 2–3 test-query framings generated but still be vulnerable to a framing not tested — this check can demonstrate the *presence* of the risk pattern but can't exhaustively prove its *absence*, and the report should say so rather than implying a clean pass means fully robust.

### L. Counterexamples
Short, single-claim pages (a simple fact page, a single-answer FAQ entry) have little room for this kind of framing-dependent selective extraction to occur in the first place — the risk concentrates on longer, more nuanced pages covering genuinely contested or multi-sided topics, and the check should scale its priority accordingly rather than running at equal intensity everywhere.

### M. Generalizes?
Yes, well — the underlying mechanism (phrasing-driven extraction is inherently selective) is demonstrated independent of any specific search engine or AI vendor, which is a stronger generalization argument than most findings in this document get to make.

### N. Candidate skill(s)
Core, most novel module of the proposed **Query-to-Page Alignment Auditor** — W8's deterministic check and W7/W9/W10's hybrid check should likely be two distinct sub-checks within the same skill given their different cost/complexity profiles, not merged into one.

### O. Relationship to other skills
Directly extends Pulkit's F2 (misrepresentation risk) with an opposing-framing-robustness angle specific to query-driven extraction rather than chunk-boundary separation; connects to Topic X (AI-to-human handoff) since a visitor arriving via a citation that oversold or mis-framed the page is a direct handoff failure; gated by Topic V's YMYL severity tier for topic-sensitivity scaling.

---

## Cluster D — Query-specific evidence availability
**Covers:** W11 (query-specific evidence availability)

### A. What we need to understand
Whether a page contains the *specific type* of evidence a given query category actually needs (a number for a price query, a named comparison for a "vs" query, an explicit yes/no for a feature-confirmation query) — distinct from general topical relevance, which the page can have without containing the specific evidence type at all.

### B. Why it matters
A page can be topically perfect and intent-aligned (Cluster A) and structurally well-organized (Cluster B) and still fail a specific query because the *evidence type* itself simply isn't present — this is the "page is about the right thing but doesn't actually contain the answer" failure mode, a real and distinct gap from anything the other clusters check.

### C. Current evidence

**INFERENCE** — Different query categories imply different required evidence *types*, not just different topics: a pricing query needs an extractable number; a comparison query needs an explicit named comparison or differentiation statement; a feature-confirmation query ("does X support Y") needs an explicit yes/no or capability statement, not just general discussion of the feature area. A page can discuss a feature area extensively (satisfying topical relevance) while never actually confirming or denying the specific capability a query asks about.

**INFERENCE** — This connects directly to, and is essentially the query-driven mirror image of, the fact-type qualifying-context taxonomy Pulkit already built (pricing/features/specs/etc.) — the difference is directional: Pulkit's taxonomy asks "if this fact type is present, what context does it need"; this cluster asks "does the specific evidence type a query needs exist on the page at all."

### D. Important mechanisms
The unifying insight: evidence-type presence should be checked as a **binary gate per query category** before any relevance or structural scoring is even meaningful — a page can score well on every other cluster and still simply not answer the question if the specific evidence type is absent.

### E. Concrete website signals
Presence/absence of an extractable number near price-related query framing (reuses E24's pricing-extraction signal from Pulkit's work); presence/absence of an explicit named comparison statement for comparison-category queries; presence/absence of an explicit affirmative/negative statement for feature-confirmation queries.

### F. How the signal could be detected automatically
Mostly deterministic pattern-matching once the query category is known (reusing existing fact-type extraction infrastructure); the query-category classification itself is the one LLM-judgment step, and it's a narrower, cheaper classification than Cluster A's full intent-type classification.

### G. What evidence the skill should report
The specific query category tested, the specific evidence type expected, and its presence/absence — a page failing this check should get a very specific, actionable finding ("no explicit statement confirming/denying [capability]"), not a vague "may not fully answer this query."

### H. Possible severity logic
High for query categories central to the page's own apparent purpose (a pricing page missing extractable pricing); lower for tangential query categories a page was never really meant to answer.

### I. Correct remediation
Add the specific missing evidence type directly (an explicit number, an explicit named comparison, an explicit yes/no) rather than expanding general topical content, which wouldn't fix this specific gap.

### J. False-positive cases
Not every page needs to answer every query category about its topic — a product's marketing page legitimately might not need to contain a full comparison table if a dedicated comparison page exists elsewhere on the site; this check should be scoped to pages that are themselves the most-likely-intended answer for that query category (Cluster A's output), not applied to every page mentioning the topic.

### K. False-negative risks
A page could contain the right evidence type in a form the deterministic extractor doesn't recognize (an unusual price format, an implicit rather than explicit comparison) — this is a real, acknowledged limitation of pattern-based extraction, mitigated only partially by LLM escalation within the runtime budget.

### L. Counterexamples
A deliberately vague pricing page ("contact us for a custom quote") is not necessarily a defect for enterprise-motion products (already established as a legitimate norm in Topic V's Cluster F) — this cluster's finding should be gated by that same norm, not treated as an absolute evidence requirement regardless of business model.

### M. Generalizes?
Yes — the mechanism (map query category to required evidence type, then check presence) is domain-agnostic; the specific evidence-type taxonomy is an extension of Pulkit's already-established, broadly-applicable fact-type categories.

### N. Candidate skill(s)
No new skill — a query-category-specific evidence-gate check within the **Query-to-Page Alignment Auditor**, consuming Pulkit's fact-type extraction infrastructure directly as configuration.

### O. Relationship to other skills
Directly reuses Pulkit's E24–E30 fact-type extraction infrastructure; gated by Topic V's Cluster F (commercial norms) for the pricing-specific case.

---

## Cluster E — Comparison-intent special case
**Covers:** W12 (competitor comparison landing pages)

### A. What we need to understand
Whether comparison-shopping queries ("X vs Y") have a distinct, checkable risk pattern beyond ordinary intent-type alignment — specifically, whether vendor-authored comparison pages have a detectable, systematic bias signature worth checking for.

### B. Why it matters
Comparison queries are high commercial intent and increasingly likely to be answered or summarized directly by an AI assistant rather than requiring the user to click through and read critically — if the source an AI draws from for a "should I use X or Y" answer is a vendor's own self-comparison page, the AI's answer inherits that page's bias without necessarily flagging it as vendor-authored.

### C. Current evidence

**OBSERVATION (from live-site testing, see W-03 below)** — A live comparison of how "Notion vs Asana" is actually answered across the web found a clear, structural pattern: the first-party vendor's own comparison page (published on notion.com) presents a feature table where **every single row favors Notion**, using a ✔/❌ format across all seven compared features, paired with a headline claim of a third-party rating advantage. By contrast, multiple independent third-party sources (Cloudwards, a dedicated tools-comparison site; Jotform's blog; an agency-focused comparison site) gave genuinely mixed, context-dependent verdicts — "Asana wins for pure task management on larger teams," "Notion wins for documentation-heavy smaller teams" — rather than a uniform winner.
**Evidence:** Live `web_search` results for "Notion vs Asana comparison page" (2026-09-01), directly comparing notion.com's own comparison page structure against four independent third-party sources.
**Sources:** notion.com/en-gb/compare-against/comparison-notion-vs-asana (primary, vendor-authored); cloudwards.net, jotform.com, agencysupply.co, breeze.pm (independent, third-party).

**OBSERVATION (follow-up test, see W-04 below — this materially changes the cluster's design)** — A parallel test in a different industry (Progressive vs. GEICO, auto insurance) found **no first-party comparison page at all** — every result was a third-party site. This means the win-rate heuristic above cannot simply be applied universally; the classifier first needs to check *whether a first-party comparison page exists*, and this check itself varies meaningfully by industry (plausibly due to differing advertising/regulatory norms, though this specific explanation is inference, not confirmed). Where no first-party page exists, the more relevant risk shifts entirely: the insurance test found the same "average premium" fact reported inconsistently across third-party sources, ranging from roughly $1,200 to over $2,050 for ostensibly the same comparison — a nearly 2x spread with no reconciling context, a direct, concrete instance of the cross-web-consistency problem this project cares about, distinct from the vendor-bias concern this cluster originally focused on.

**INFERENCE** — A first-party vendor comparison page showing a **100%-win-rate pattern** across every listed comparison row is a cheap, structurally detectable signal (count wins-per-row in a comparison table; if one named party wins literally every row, flag it) that reliably distinguishes vendor-authored comparison content from genuinely balanced third-party comparison content, in the one tested case where a first-party page existed at all — but this check is now understood to be conditional on a first-party page actually existing, not a universal comparison-query check.

### D. Important mechanisms
The unifying insight: this cluster doesn't need new detection infrastructure — it needs Cluster A's intent-alignment check applied specifically to comparison-category queries, plus one cheap, novel structural heuristic (row-level win-rate in a comparison table) that most teams are unlikely to have thought to check, since it requires actually looking at *who wins each individual row*, not just whether a comparison page exists.

### E. Concrete website signals
Presence of a dedicated "X vs Y" or "X alternative" page; for such pages, the per-row win distribution in any comparison table (100% one-party win rate as the flaggable pattern); whether the page discloses its own vendor authorship anywhere near the comparison itself (a legitimate, cheap transparency fix).

### F. How the signal could be detected automatically
Deterministic, now a two-branch check following the pressure-test correction: **first**, check whether any top result for the comparison query belongs to either named entity's own domain (a cheap domain-match check); **if yes**, parse that page's comparison-table structure and tally which named entity "wins" each row, flagging a 100%-or-near-100% win rate for the page's own host entity; **if no first-party page is found**, switch to checking numeric-claim consistency for the same fact across the top third-party results instead (reusing Pulkit's fact-extraction infrastructure), since that is the risk that actually materializes in industries without vendor-authored comparison content.

### G. What evidence the skill should report
The specific comparison page, the row-level win tally, and whether authorship/vendor relationship is disclosed near the comparison.

### H. Possible severity logic
This is better framed as a **disclosure/transparency finding**, not a "content is wrong" finding — the vendor is entitled to make their own case; the actual issue for an AI-discoverability audit is whether an assistant citing this page as *the* answer to a neutral "X vs Y" query would be presenting one-sided content as if it were balanced, which is a citation-context risk (directly connects to Cluster C) more than a defect in the page itself.

### I. Correct remediation
Not "make the comparison more balanced" (a vendor's own comparison page is legitimately allowed to advocate for itself) — instead, ensure the page clearly discloses its own vendor authorship near the comparison table itself, so a downstream reader or AI system has the context needed to weight it appropriately.

### J. False-positive cases
A vendor's comparison page winning every row is not itself illegitimate or dishonest — this finding should never be framed as "this page is lying," only as "this page is self-authored and should be weighted/disclosed as such," since the underlying feature claims could be entirely accurate.

### K. False-negative risks
A more subtly biased comparison page (winning most but not literally all rows, or omitting a category where it would lose entirely) would not trigger the simple 100%-win-rate heuristic — this is a real, acknowledged limitation of the cheap deterministic version of this check; a more thorough version would need to check for *omitted* comparison categories, which is harder and would require LLM judgment against a broader, independently-sourced feature list.

### L. Counterexamples
A vendor could legitimately and accurately win every row of a fair comparison if its product genuinely is superior on every listed dimension — the heuristic flags a *pattern worth surfacing*, not a proven defect, and should be reported as such.

### M. Generalizes?
Yes — vendor-authored "X vs Y" and "X alternative" pages are a widespread, common content pattern across software/SaaS and other competitive commercial categories; the specific evidence here comes from one tested pair (Notion/Asana) and should be treated as a strong illustrative case rather than a statistically established base rate.

### N. Candidate skill(s)
No new skill — a specific, cheap sub-check within the **Query-to-Page Alignment Auditor**'s Cluster A module, activated specifically when a page matches comparison-intent query patterns.

### O. Relationship to other skills
Directly connects to Cluster C (citation-context consistency) — the more consequential risk isn't the vendor page itself, it's an AI system citing it as if it were neutral; also connects to Topic V's Cluster F (commercial norms).

---

## 3. Findings register

---
**FINDING ID:** W-01
**Researcher:** Soham
**Research Area:** W — User Query → Page Matching
**Research Question:** Is there an authoritative, generalizable taxonomy of query intent to build page-alignment checks on, and how reliable is intent inference from query text?
**Observation:** Broder's 2002 taxonomy (navigational/informational/transactional) remains the standard reference for query-intent classification over two decades later, but Broder's own paper explicitly states intent cannot be inferred from query text with certainty — a documented epistemic limit, not a hedge added by later researchers.
**Evidence:** Broder, "A Taxonomy of Web Search" (SIGIR Forum, 2002); ORCAS-I dataset paper building its labeling scheme directly on Broder's categories; multiple secondary sources (Calderon-Benavides et al. 2010, Rose and Levinson 2004) using and extending the same taxonomy with varying measured category proportions across different datasets and eras.
**Sources:** sigir.org/files/forum/F2002/broder.pdf; arxiv.org/pdf/2205.00926 (ORCAS-I); searchstudies.org (Deriving Query Intents survey).
**Pattern:** A well-established, decades-old, still-cited taxonomy exists and should anchor Cluster A's classification — but any implementation must carry forward Broder's own documented uncertainty as an explicit confidence signal, not present intent classification as a solved, binary check.
**Counterexamples:** Different studies measured meaningfully different proportions of each intent category depending on dataset/era/method — a reminder that even the base rates aren't fixed, let alone per-query classification accuracy.
**Hypothesis:** N/A — directly grounded in an established, peer-reviewed taxonomy.
**Signal:** See Cluster A section E.
**How to Detect:** See Cluster A section F — hybrid, LLM-judgment-based with explicit confidence reporting.
**Evidence Output:** Inferred intent type, confidence level, and the specific missing intent-supporting element where a mismatch is flagged.
**False Positives:** Pages legitimately serving multiple intents at different points in a journey.
**False Negatives:** Genuinely ambiguous queries (Broder's own documented category) being silently treated as "no finding" rather than an explicit uncertainty.
**Severity:** Scales down as classification confidence drops.
**Recommended Fix:** Add the missing intent-supporting element.
**Generalization:** High — domain-agnostic, decades-validated taxonomy.
**Candidate Skill:** Core module of the Query-to-Page Alignment Auditor.
**Related Skills:** Topic V (site-type gating), Topic X (handoff).
**Confidence:** HIGH for the taxonomy's validity and standing; HIGH (by the source's own admission) that per-query intent inference carries genuine, irreducible uncertainty that must be surfaced, not hidden.

---
**FINDING ID:** W-02
**Researcher:** Soham
**Research Area:** W — User Query → Page Matching
**Research Question:** Is citation/snippet-vs-destination mismatch a novel AI-era problem, or a pre-existing, already-documented property of phrasing-driven extraction — and does it actually affect current-generation LLMs, or only older search engines?
**Observation:** Two independent, mutually-reinforcing pieces of evidence, one historical/mechanism-establishing and one direct/current-model-tested. **(1) Pre-AI mechanism:** A 2024 investigation found Google's Featured Snippets pull contradictory statements from the *same* source article depending purely on query phrasing (e.g., "link between coffee and hypertension" vs. "no link between coffee and hypertension," both drawing opposing-sounding snippets from the same Mayo Clinic article), and Google has publicly iterated on this exact problem for years (a leaked 2016 internal admission: "We do not understand documents – we fake it"). **(2) Direct, controlled, current-model test:** A 2026 controlled experiment (Yun et al.) tested exactly this mechanism on 8 current LLMs — **including Claude Sonnet 4.5 and GPT-5.1** — in a RAG setting where the *same* underlying evidence documents (Cochrane systematic-review abstracts) were held fixed, varying only whether the query was framed positively ("How effective is X for Y?") or negatively ("How ineffective is X for Y?"). Result: paired responses to same-framing queries agreed on the evidence's direction 76.2% of the time; paired responses to *opposite*-framing queries (identical underlying evidence) agreed only 72.0% of the time — a statistically significant drop (β = −.219, p < .001) present in **every one of the 8 models tested**, amplified further across multi-turn conversations, and unaffected by whether the query used technical or plain language.
**Evidence:** Dragon Metrics investigation (via Search Engine Journal, Stan Ventures, ~2024); Yun, Kapoor, Mackert, Kouzy, Xu, Li, Wallace, "This Treatment Works, Right? Evaluating LLM Sensitivity to Patient Question Framing in Medical QA" (arXiv:2604.05051, 2026) — a controlled, pre-registered-style experiment with 6,614 query pairs across 8 LLMs.
**Sources:** searchenginejournal.com/google-search-snippets-show-contradictory-information-study-finds; arxiv.org/pdf/2604.05051 (primary source, fetched and read directly).
**Pattern:** This is no longer an inference bridging two separate literatures — it's now a **directly demonstrated fact** that current-generation frontier LLMs (including the Claude family) produce measurably different conclusions from *identical* underlying evidence purely as a function of how a query is phrased, in a controlled RAG setting closely analogous to how an AI assistant would answer a user's question using a website's content as its source. The pre-AI search-engine evidence and this direct LLM study now corroborate each other as two independent demonstrations of the same underlying mechanism (phrasing-driven selective interpretation of source evidence) at two different points in the AI pipeline's evolution.
**Counterexamples:** The framing effect, while statistically significant and consistent across all 8 models, was described by the study's own authors as producing only "negligible differences" in surface-level similarity/overlap metrics (cosine similarity, entity/citation/numerical overlap) between paired responses — the effect shows up specifically in the *directional conclusion* the model draws (higher/lower/same), not in gross textual dissimilarity, meaning a shallow text-similarity check would miss this risk entirely. Also: Google's own iterative fixes (multi-source cross-referencing, false-premise suppression) show the problem is at least partially mitigable at the extraction-engine level.
**Hypothesis:** The magnitude and pattern of this effect in a general web-content-citation context (rather than the tested medical-QA/RCT-abstract context specifically) remains unconfirmed — the study's authors themselves note their RCT-abstract dataset may not generalize to "real-world, less structured settings," and flag this as a limitation of their own work, not something this project has independently tested either.
**Signal:** See Cluster C section E; refined to specifically target *directional/conclusion-level* consistency, not surface text similarity, given the study's own finding that surface metrics don't capture this risk.
**How to Detect:** Generate 2–3 plausible, oppositely-framed queries for a page's central claim (reusing Cluster A's query-generation step), extract what a passage-level retriever would most likely surface for each, and specifically compare the *directional conclusion* implied by each extract (not just textual overlap) — directly modeled on the tested study's own evaluation methodology (an LLM-as-judge assessing "higher/lower/same/uncertain" rather than a similarity score).
**Evidence Output:** The specific opposing framings tested, the directional conclusion each would likely produce, and a plain-language note on how a reader's takeaway would differ.
**False Positives:** Pages taking a correct, one-sided position on settled (not genuinely contested) questions.
**False Negatives:** A surface-level text-similarity check would systematically miss this risk, per the study's own reported "negligible" surface-metric differences alongside a significant directional-conclusion difference — the skill must check conclusion-direction specifically, not textual overlap.
**Severity:** Scales with topic sensitivity (Topic V's YMYL gating) — directly reinforced by this cluster's evidence coming from a medical-QA context, the highest-stakes case in Topic V's Cluster A.
**Recommended Fix:** Ensure any single extractable sentence remains accurate and appropriately caveated in isolation, regardless of query framing; for genuinely nuanced/two-sided evidence, avoid a single dominant "punchline" sentence that a framing-driven extractor could isolate to support either framing.
**Generalization:** HIGH for the mechanism itself — now demonstrated directly on current-generation Claude and GPT models, not inferred from search-engine analogy. MEDIUM for how far it extends beyond the tested medical-QA/RAG context to general web content and to live (not RAG-controlled) AI search/answer products, which the source study itself flags as untested.
**Candidate Skill:** Core, most novel module of the Query-to-Page Alignment Auditor.
**Related Skills:** Pulkit's F2 (misrepresentation risk); Topic X (handoff); Topic V (YMYL severity gating).
**Confidence:** HIGH — this finding moved from "reasonable inference" to "directly demonstrated in a controlled experiment on the actual model families this hackathon evaluates against (Claude, GPT)" during this pressure-testing pass, which is a substantive, verified upgrade, not a restated assumption.

---
**FINDING ID:** W-03
**Researcher:** Soham
**Research Area:** W — User Query → Page Matching
**Research Question:** Do vendor-authored "X vs Y" comparison pages have a detectable, systematic bias signature distinguishable from genuinely balanced third-party comparisons?
**Observation:** A live comparison of "Notion vs Asana" content found the vendor's own comparison page (notion.com) winning literally every row of its own feature-comparison table (7/7), while four independent third-party sources gave genuinely mixed, use-case-dependent verdicts instead of a uniform winner.
**Evidence:** Direct `web_search` results comparing notion.com's comparison page against cloudwards.net, jotform.com, agencysupply.co, and breeze.pm (2026-09-01).
**Sources:** notion.com/en-gb/compare-against/comparison-notion-vs-asana; cloudwards.net/notion-vs-asana; jotform.com/blog/notion-vs-asana; agencysupply.co/notion-vs-asana; breeze.pm/articles/compare/notion-vs-asana.
**Pattern:** A 100%-win-rate pattern across a self-authored comparison table is a cheap, purely structural, deterministically-detectable signal that reliably flags vendor-authored comparison content in at least this one tested case — worth surfacing as a citation-context disclosure signal rather than a content-accuracy defect.
**Counterexamples:** A vendor could legitimately and accurately win every row if genuinely superior on every listed dimension — the heuristic flags a pattern worth surfacing, not a proven defect.
**Hypothesis:** This pattern likely generalizes across the broader software/SaaS "X vs Y" and "X alternative" content genre, which is extremely common — untested beyond this single comparison pair.
**Signal:** Per-row win tally in a detected comparison table.
**How to Detect:** Deterministic table-structure parsing and win-marker tallying; no LLM judgment required for the core signal.
**Evidence Output:** The comparison page, its row-level win tally, and whether vendor authorship is disclosed near the table.
**False Positives:** Genuinely, accurately superior products winning every listed row.
**False Negatives:** Subtler bias (winning most-but-not-all rows, or omitting unfavorable categories) would not trigger this specific heuristic.
**Severity:** Framed as a disclosure/transparency finding, not a content-accuracy defect.
**Recommended Fix:** Disclose vendor authorship near the comparison table.
**Generalization:** The mechanism (self-comparison content is common in SaaS/software) is broadly plausible; the specific 100%-win-rate signal is validated on one tested pair only.
**Candidate Skill:** Cheap sub-check within the Query-to-Page Alignment Auditor's Cluster A module.
**Related Skills:** Cluster C (citation-context consistency); Topic V's Cluster F (commercial norms).
**Confidence:** HIGH for the specific observation (directly verified, multiple independent sources checked); LOW-MEDIUM for how representative a single comparison pair is of the broader vendor-comparison-page genre.

---
**FINDING ID:** W-04
**Researcher:** Soham
**Research Area:** W — User Query → Page Matching
**Research Question:** Does W-03's vendor-comparison-bias heuristic generalize to a non-SaaS industry — and what actually happens in a category where neither party publishes a self-comparison page?
**Observation:** A live search for "Progressive vs GEICO" (auto insurance) found a genuinely different landscape than the SaaS case: **neither Progressive nor GEICO publishes a direct first-party "us vs. them" comparison page at all** — every result was a third-party site (a mix of personal-finance blogs, insurance-broker sites, and what appear to be SEO/affiliate content-farm domains). W-03's specific heuristic (check for a 100%-self-win-rate table on the vendor's own page) simply doesn't apply here, since there's no vendor-authored comparison page to check. But a different, arguably more serious problem appeared instead: the same basic fact — "average annual premium" for the same two companies — was reported wildly inconsistently across these third-party sources: $1,353, $1,543, $1,200, $1,300, $1,763, $1,998, $2,052, and $2,057 all appeared as supposed "average" figures for the same companies within the same general timeframe, a spread of nearly 2x with no reconciling context.
**Evidence:** Live `web_search` results for "Progressive vs Geico car insurance comparison page" (2026-09-01), across choosefi.com, blakeinsurancegroup.com, insurancebrokers.com, learnandserve.org, insurancebrokersgroup.com, and nerdwallet.com.
**Sources:** As listed above — six independent domains, all third-party (none affiliated with Progressive or GEICO).
**Pattern:** Two distinct, genuine findings, not one: (1) **W-03's specific heuristic is industry-conditional, not universal** — vendor-authored direct comparison pages are common in SaaS/software (where Notion vs. Asana was tested) but were entirely absent in this insurance search, plausibly because insurance advertising practices and regulatory norms around comparative claims differ from software marketing norms (this specific causal explanation is our own plausible inference, not independently confirmed). The classifier/checklist needs to detect *whether* a vendor comparison page exists before applying W-03's heuristic, rather than assuming one exists. (2) **A different, arguably more consequential risk surfaces in categories dominated by third-party content**: wildly inconsistent numeric claims about the same real-world fact across independent sources, with no source visibly reconciling the discrepancy — a concrete, live instance of exactly the cross-web-consistency/corroboration problem this whole project is built around, and a direct extension of Cluster D's evidence-availability concern into evidence-*reliability* territory (the evidence type is present nearly everywhere, but is not consistent, which Cluster D's original treatment didn't fully anticipate).
**Counterexamples:** The Notion/Asana case (W-03) shows the opposite pattern is real too — self-comparison pages do exist and do show the 100%-win-rate bias signature in at least some industries. Neither pattern is universal; both need to be checked for.
**Hypothesis:** Regulated or heavily-litigated advertising categories (insurance, pharmaceuticals, financial services) may systematically avoid direct competitor-naming comparison content due to regulatory/legal risk, pushing comparison-query traffic entirely toward third-party aggregators instead — this is a plausible explanation for the pattern observed, not independently confirmed against insurance industry advertising regulation specifically.
**Signal:** For comparison-intent queries, first check whether a first-party comparison page exists at all (gating which of W-03's or this finding's checks apply); where no first-party page is found, check numeric-claim consistency across the top third-party results instead.
**How to Detect:** Deterministic: search-result domain classification (does any result belong to either named entity's own domain) as the gate; numeric-claim extraction and cross-source comparison (reusing Pulkit's fact-extraction infrastructure) for the consistency check.
**Evidence Output:** Whether a first-party comparison page was found; if not, the specific numeric claims found across third-party sources and their spread.
**False Positives:** Legitimately different numbers can reflect genuinely different methodologies, time periods, or driver/customer profiles (as several of the sources here explicitly noted, e.g., rates varying "based on individual factors including age, driving record, location") — a spread alone isn't proof of unreliable content; the finding should note whether sources explain their methodology, not just flag any numeric disagreement as a defect.
**False Negatives:** A category where a vendor comparison page *does* exist but wasn't found in the specific search performed would incorrectly appear to be a "no first-party page" case — this is a search-completeness limitation, not a structural one.
**Severity:** Scales with how consequential the specific numeric fact is (a 2x spread on an "average premium" figure is significant for a purchase decision; more caveated or clearly-methodology-disclosed spreads are lower severity).
**Recommended Fix:** N/A for the page owner directly in the no-first-party-page case (this is a market-structure observation, not a fixable defect on any one page) — the more useful output here is a citation-context caution rather than a remediation instruction.
**Generalization:** The gating logic (check for first-party comparison page existence before applying W-03's heuristic) generalizes well and is now a necessary, evidenced correction to the classifier design. The specific "regulated industries avoid direct comparison" hypothesis is plausible but tested in exactly one category (insurance) and shouldn't be assumed for others without further checking.
**Candidate Skill:** Refines Cluster E's sub-check within the Query-to-Page Alignment Auditor: add a first-party-page-existence gate before the win-rate heuristic, and add a separate third-party-numeric-consistency check for the no-first-party-page branch.
**Related Skills:** Cluster D (evidence-type availability, now extended to evidence-*reliability*); Harsh's P (Cross-Web Consistency) — this finding may be more naturally owned there, similar to how V-02 was flagged as an F-topic item.
**Confidence:** HIGH for the specific observation (directly verified via live search, six independent sources); MEDIUM for the regulatory-explanation hypothesis (plausible but not independently confirmed); HIGH that the general lesson (check for first-party-page existence before applying any vendor-bias heuristic) is a necessary design correction regardless of the underlying cause.

---

## 4. Required end-of-topic synthesis

**Strongest validated insight (upgraded after pressure-testing):**
The promise-delivery/citation-context mismatch mechanism (Cluster C) is not merely well-motivated inference anymore — it is now **directly demonstrated on current-generation frontier LLMs**. A controlled 2026 experiment (Yun et al.) found that Claude Sonnet 4.5, GPT-5.1, and six other models drew statistically significantly different directional conclusions from *identical* underlying evidence, purely based on how the query was phrased (76.2% vs. 72.0% agreement, p < .001), with the effect invisible to surface-level text-similarity metrics and only detectable by checking the actual conclusion direction. Combined with the independently-documented, multi-year pre-AI precedent in Google's own featured-snippet system, this is now the best-evidenced finding in this entire research pass — grounded in a primary, controlled, peer-reviewed-style study of the actual model families this hackathon cares about, not an analogy or an untested extension.

**Strongest unvalidated hypothesis (revised, since the prior version is now resolved):**
Whether this same effect size and pattern holds for **general web content and live commercial AI answer products** (ChatGPT, Claude.ai, Gemini, Perplexity as actually deployed) rather than the tested controlled RAG-over-Cochrane-abstracts medical QA setting. The source study's own authors flag this generalization gap explicitly as a limitation of their work, and this project has not independently tested it either — this is the honest, specific, narrowed-down version of what remains open, replacing the broader and now-resolved "does this affect real AI systems at all" question.

**Strongest candidate skill:**
The **Query-to-Page Alignment Auditor**, composed of Cluster A's intent-classification layer (with Broder-taxonomy grounding and explicit confidence handling), Cluster C's promise-delivery/citation-context checks (one deterministic sub-check for W8, one hybrid sub-check for W7/W9/W10 — now with materially stronger evidentiary backing following this pressure-test pass), Cluster D's evidence-type-availability gate, and Cluster E's cheap comparison-page bias heuristic — with Cluster B correctly identified as an extension of Pulkit's existing A16 skill rather than a new component. This is a genuinely coherent single skill, not a padded collection of loosely related checks, because every cluster ultimately answers the same root question (does this page deliver, for a specific plausible query, what was promised about it) from a different, non-overlapping angle.

**Weakest assumption we should investigate next (narrowed further after this pass):**
Two specific, narrower gaps remain, both explicitly flagged rather than assumed away: (1) whether Cluster C's now-strongly-evidenced framing effect generalizes from controlled medical-QA RAG to general commercial web content and live AI products, as noted above; and (2) whether the industry-conditional pattern found in Cluster E (SaaS companies publish self-comparison pages; the one non-SaaS category tested, auto insurance, does not) extends to other industries — the classifier's new first-party-page-existence gate is a necessary correction either way, but the underlying "why" (regulatory caution vs. simply different marketing convention) remains an untested hypothesis, and the third-party numeric-inconsistency risk it surfaced (W-04) is itself a new, not-yet-fully-specified check that would benefit from its own dedicated pressure-testing pass rather than being treated as fully resolved by one example.

---

## 5. Cross-references for the Combine & Code phase

- **Cluster A ↔ Topic V (Site-Type Differentiation):** Intent-type expectations (transactional vs. informational vs. navigational) should be calibrated by V's cluster output, not assumed uniformly — a wholesale-only B2B page correctly lacking a retail CTA is Topic V's Cluster F norm, not a Cluster A defect.
- **Cluster B ↔ Pulkit's A16 and Topic D's D18:** Should be implemented as a query-vocabulary-gap extension of A16's existing skill, not a separate detection mechanism — explicit flag against padding, consistent with how Pulkit handled similar overlaps in Topic E.
- **Cluster C ↔ Pulkit's F2 (misrepresentation risk) and Topic X (AI-to-human handoff, mine):** W-02's opposing-framing-robustness check is F2's fact/qualifier-separation principle applied to query-driven extraction rather than chunk-boundary separation; a visitor arriving via a mis-framed citation is a direct Topic X handoff failure, not a separate concern.
- **Cluster D ↔ Pulkit's E24–E30 (fact-type extraction taxonomy):** Directly reuses that infrastructure as the evidence-type detector; no new extraction mechanism needed.
- **Cluster E ↔ Topic V's Cluster F (commercial norms) and Cluster C above:** The comparison-page bias signal is a disclosure/citation-context concern, not a standalone content-quality defect — should not be scored as if the vendor page itself is wrong.
- **The whole Query-to-Page Alignment Auditor ↔ Topic U (False Positives, mine):** Every never-fire/gating rule named across this document's clusters (multi-intent pages, settled-vs-contested topics, enterprise pricing-gating norms, genuinely superior vendor comparisons) should be registered in the `false-positive-suppression` skill's rule set with this document cited as justification.
- **↔ Topic Z (Agent Skill Design, mine):** Given Cluster A's query-generation step is a shared input to Clusters B, C, D, and E, the entrypoint orchestrator should generate the representative query set once per audited page/template and pass it to all downstream checks, rather than each cluster regenerating its own — a direct efficiency and consistency requirement for staying inside the 5-minute runtime budget.
