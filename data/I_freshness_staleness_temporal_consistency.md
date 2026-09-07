# Topic I — Freshness, Staleness & Temporal Consistency (I1–I26)
**Researcher:** Pulkit | **Research Area:** I — Freshness, Staleness & Temporal Consistency
**Priority:** High (explicitly named as a Round-2 target failure mode in the brief)

---

## 0. Framing — Topic I's relationship to prior research, and the two genuinely distinct mechanisms this topic must not conflate

Freshness has come up as a *secondary* concern in nearly every prior topic I've researched — Topic A's A21 (search freshness, deferred here), A15 (reranking's freshness-vs-relevance tradeoff), Topic C's Cluster VI (sitemap `lastmod` credibility, C-03/C34), and Topic E's E29/E33 (date qualifying-context, temporal ambiguity, both explicitly deferred to this document). This is the document where all of those deferred threads get resolved and given their own full treatment, as the brief requests.

**Before going sub-topic by sub-question, there is one structural distinction that must organize this entire document, because conflating it would produce an incoherent set of findings:**

1. **Ranking/retrieval-stage freshness** — whether a page's *recency* affects whether it gets *retrieved and ranked* in the first place. This is the domain of Google's documented "Query Deserves Freshness" (QDF) systems and general reranking-stage freshness weighting (Topic A's A15).
2. **Generation-stage freshness (knowledge-conflict)** — whether an AI system's *underlying model* already "knows" something (frozen at its training cutoff — "parametric knowledge") that conflicts with what's actually current on the live web, and which one wins when they disagree. This is a **completely different mechanism**, governed by an actively-researched NLP subfield called "knowledge conflict" (parametric vs. contextual knowledge), not by anything resembling Google's QDF system.

**Why this distinction is the single most important thing to get right in this document:** a stale fact on a website can fail for either reason, or both simultaneously, and the fixes are different. If the failure is (1) — the page just doesn't get *retrieved* for a freshness-sensitive query because a newer competing page exists — the fix is about updating and re-signaling the page. If the failure is (2) — the AI system's own frozen training data contains an old fact and *keeps stating it even when better information exists on the live web* — the fix is about making the *current* fact so clearly, unambiguously, and repeatedly stated that it can actually overturn the model's default assumption, which the peer-reviewed knowledge-conflict literature shows is not guaranteed even when correct external information is provided. This document treats these as two parallel, interacting causal chains, not one blended "staleness" concept.

---

## 1. Legend
Same as all prior topics: **FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**.

---

## Cluster I — Date signals & timestamp mechanics
**Covers:** I1 (publication dates), I2 (last-modified dates), I3 (dateModified schema), I4 (visible update dates), I5 (hidden update dates)

### A. What we need to understand
What are the actual, distinct timestamp mechanisms a page can carry, how reliable is each as a freshness signal, and — critically, extending the finding I already surfaced in Topic C — what happens when these signals are gamed or inconsistent.

### B. Why it matters
This cluster is the raw input layer for everything else in this document; getting the taxonomy of "which date means what, and how much do search/AI systems actually trust each one" right is foundational.

### C. Current evidence
- **FACT (first-party, Google, directly and explicitly quoted, genuinely important — this is the single most load-bearing quote in this entire cluster and directly extends what I found in Topic C's `lastmod` research):** Google's own "Creating Helpful, Reliable, People-First Content" documentation asks site owners to self-audit against exactly this question: **"Are you changing the date of pages to make them seem fresh when the content has not substantially changed?"** — and answers its own rhetorical question directly: **"(No, it won't [help])."** This is a first-party, explicit, unambiguous statement that superficial date manipulation is a known, named anti-pattern Google actively discounts — not a hypothesis, a directly stated policy.
- **FACT (first-party, Google, already established in my Topic C research, directly relevant here too):** Google's sitemap documentation states `<lastmod>` is used only "if it's consistently and verifiably" accurate, with independently-corroborated secondary reporting describing detection and subsequent disregard of domains whose `lastmod` values follow implausible (e.g., uniformly-recent) patterns.
- **INFERENCE (synthesizing I1-I5 into a reliability hierarchy, a genuinely useful organizing structure not stated directly in any single source but a reasonable synthesis of established points across this whole project):** The various date signals a page can carry form a rough **reliability/trust hierarchy** from a system's perspective, not a flat list of equally-weighted signals:
  - **Highest inferred trust: substantive content-diff-verified change.** A date is most credible when it can be corroborated by an actual, detectable change in the page's substantive content (not just its timestamp) — this is the mechanism directly implied by Google's own "verifiably accurate" language for `lastmod`, and by extension plausibly applies to visible on-page dates too.
  - **Medium trust: `dateModified`/`datePublished` schema (I3), server `Last-Modified` HTTP header, sitemap `lastmod` (I2)** — machine-readable, but per Topic B's F3 finding (schema not reliably parsed at live-query time by at least ChatGPT/Perplexity) and per this cluster's own gaming-detection finding, these signals are **necessary but not sufficient** — they must also be *accurate*, and accuracy is checked against corroborating evidence, not taken at face value.
  - **Lower/contested trust: visible on-page date text alone (I4), with no corroborating content-change evidence** — a date string is trivially easy to update without any substantive change, which is exactly the gamed pattern Google's own documentation calls out.
  - **Lowest/riskiest: hidden update dates (I5)** — a date that exists only in non-visible metadata (schema, HTTP headers) with **no corresponding visible date at all** inherits the same schema-vs-visible-text extraction risk already established in Topic B's F3 and Topic D's D-01: if at least ChatGPT/Perplexity extract from visible text rather than parsing schema at live-query time, a hidden-only update date may not functionally exist for freshness-signaling purposes at the point an AI assistant is actually answering a question, even though it may still contribute to crawl-time/index-time freshness signals (the same index-time-vs-query-time distinction already established in Topic D's Cluster I).

### D. Important mechanisms
The core, connected-diagnosis insight for this cluster, synthesizing across I1-I5: **a trustworthy freshness signal requires at least two of three things to align: a machine-readable date (schema/header/sitemap), a visible date (for the live-query-time extraction pathway established in Topic B/D), and genuine, detectable content change corroborating that date.** A page with only one of these three (e.g., schema `dateModified` updated with no visible date and no actual content change) is exhibiting exactly the gamed pattern Google's documentation explicitly discounts, and is at elevated risk of being functionally invisible to AI assistants that don't reliably parse schema at query time in the first place.

### E. Concrete website signals
- Presence and mutual consistency of: visible on-page date text, `dateModified`/`datePublished` schema, HTTP `Last-Modified` header, and sitemap `lastmod`.
- Whether a claimed update date correlates with an actual, detectable content change (requires either a stored prior-crawl snapshot for comparison across audit runs, or — for a single-run audit — a heuristic check for internal consistency, e.g., does the visible page contain any indication of *what* changed, like a changelog note or "updated to reflect X").
- Whether a date signal exists *only* in non-visible form (schema/header, I5) with no visible counterpart (I4) — directly reusing the schema-vs-visible-text parity check infrastructure already established in Topic B's F3/`structured-data-visible-text-parity`.

### F. How the signal could be detected automatically
Fully deterministic: extract all four date-signal types where present, check mutual consistency (do they broadly agree, or does one show a recent update while others show a stale date — a mismatch pattern), and check for the schema-only/no-visible-date pattern (I5) using the exact infrastructure already built for Topic B's F3.

### G. What evidence the skill should report
Which date signals are present, whether they're mutually consistent, and — specifically — whether any update date exists only in non-visible form with no visible counterpart, flagged with the same "may be functionally invisible to live-query extraction" framing already established for schema generally.

### H. Possible severity logic
- **Medium:** date signals present but mutually inconsistent (e.g., visible text says "Updated 2024," schema says a materially different date) — a credibility-undermining pattern.
- **Medium:** update date exists only in schema/header form, absent from visible text — inherits F3's severity framing.
- **Low/Info:** all date signals present and mutually consistent — not a defect, included for completeness.

### I. Correct remediation
Ensure a visible, human-readable update date accompanies any machine-readable date signal; only update dates when genuine, substantive content change has occurred (directly following Google's own explicit guidance); where feasible, briefly note *what* changed near the date (a changelog-style note), which both corroborates the date's legitimacy and directly serves the on-site-engagement mandate by helping human visitors understand what's new.

### J. False-positive cases
A page with a stable, unchanged `lastmod`/visible date over a long period is not itself a defect — this is the **correct** behavior for genuinely stable/evergreen content, and must not be conflated with staleness (a distinction the brief itself, and Google's own documentation, both explicitly warn against collapsing — "one outdated statement" or one old date "≠ globally stale website").

### K. False-negative risks
A single-audit-run check cannot definitively confirm whether a claimed content change actually occurred without a prior snapshot to diff against — our confidence in flagging a "gamed" date pattern is necessarily lower for a single-run audit than it would be for a system (like Google's, operating continuously over time) that can observe actual change patterns across repeated crawls.

### L. Counterexamples
A page could have a genuinely very old, accurate, unmodified `lastmod` and visible date, and be entirely correct/non-stale in its actual substantive content — old timestamps and stale content are not the same thing, and this cluster's checks are about signal *consistency/credibility*, not a proxy for actual content staleness (which is Cluster II's separate, distinct concern).

### M. Generalizes?
Yes, completely — universal across site types; the specific reliability hierarchy is grounded in general, cross-vendor-plausible mechanics (Google's documented behavior plus Topic B's cross-vendor schema-extraction findings), not Google-specific alone.

### N. Candidate skill(s)
**`freshness-signal-credibility`** — extends and consolidates the `lastmod`-credibility check already flagged for deferred ownership from Topic C (C-03/C34), now given its proper full home here, plus the visible/hidden date-parity check reusing Topic B's F3 infrastructure.

### O. Relationship to other skills
Directly absorbs and resolves the Topic C (Cluster VI, `lastmod`) and Topic B (F3, schema-visible-text-parity) deferred-ownership flags — explicit confirmation these are now owned here, not duplicated.

---

## Cluster II — Category-specific staleness risk
**Covers:** I6 (stale pricing), I7 (stale product information), I8 (stale leadership information), I9 (stale contact information), I10 (stale addresses), I11 (stale statistics), I12 (stale case studies), I13 (stale software versions), I14 (stale screenshots), I15 (stale legal information), I16 (stale documentation)

### A. What we need to understand
Whether these eleven named categories require genuinely distinct detection mechanisms, or — consistent with the pattern I've now found repeatedly across Topics C, D, and E — whether they reduce to one general mechanism with category-specific risk/severity weighting.

### B. Why it matters
Applying the same disciplined scrutiny I applied in Topic E's Cluster B (fact-type taxonomy): I want to avoid manufacturing eleven separate findings where the evidence supports a smaller number of genuine mechanisms, while still being honest about where real distinctions exist.

### C. Current evidence
- **INFERENCE (the central, honest finding for this cluster, directly parallel to Topic E's Cluster B pattern):** These eleven categories are not eleven independent detection problems. They split into **two genuinely distinct detection mechanisms**, not one and not eleven:
  1. **Change-rate-relative staleness** (does this specific fact type change often enough, and has enough time passed since the last verified update, that staleness risk is elevated) — this requires knowing the *typical* change frequency for each fact type, which genuinely does vary by category (this is the real, non-arbitrary distinction worth preserving).
  2. **Cross-source corroboration mismatch** (does this page's stated value for the fact disagree with what's stated elsewhere — a company's own other pages, or third-party sources) — this is a different mechanism, more closely related to Harsh's Topic H/P (cross-web consistency) territory than to pure on-page freshness-signal-checking, and should be flagged for coordination rather than built independently here.
- **Category-specific change-rate table, synthesized from general business/product-management knowledge and reasonable inference (not a single external citation, but consistent, uncontroversial domain knowledge) — this is the cluster's genuine, non-arbitrary contribution:**

| Category | Typical change-rate expectation | Why staleness is especially damaging here |
|---|---|---|
| **I6 Pricing** | Frequent (often quarterly/annually, sometimes more) | Directly, immediately actionable/transactional — a stale price creates a concrete expectation-mismatch at the point of purchase decision, the exact mechanism the brief's own JS-only-pricing root-cause example describes |
| **I7 Product information** | Frequent, especially for software/tech products | Feature/capability claims that no longer match reality directly mislead purchase decisions |
| **I8 Leadership information** | Infrequent but high-consequence when it changes (executive transitions) | A named individual no longer in a stated role is a specific, checkable, often-embarrassing factual error with real reputational stakes |
| **I9 Contact information** | Infrequent | Directly blocks the on-site-engagement mandate (a user following stale contact info hits a dead end) — one of the clearest cases where staleness directly causes an engagement failure, not just a discoverability one |
| **I10 Addresses** | Infrequent | Same mechanism as I9; additionally connects to Topic E's E28 (location extraction) qualifying-context taxonomy |
| **I11 Statistics** | Varies widely by domain; fast-moving in tech/market data, slow-moving for foundational research citations | A stale statistic stated with confident, unhedged specificity (exactly the citation-worthy phrasing pattern Topic B's F1 established as *more* likely to be lifted into an AI answer) creates a genuinely important tension: the same content property that makes a statistic quotable also makes a *stale* statistic more likely to be quoted and propagated as if current |
| **I12 Case studies** | Infrequent updates expected, but implicit "recency" assumption if undated | Case studies often lack any explicit date at all, creating ambiguity about whether the described results/relationship are current — connects to I19-I21 below |
| **I13 Software versions** | Frequent, often the fastest-changing category on a technical site | A stated version number is a concrete, easily-outdated, easily-verified-wrong fact type — directly related to Topic E's E26 (product-spec extraction) |
| **I14 Screenshots** | Frequent for actively-developed software UIs | A uniquely *visual* staleness risk — connects directly to Topic D's Cluster VI (non-text media) since a stale screenshot's content isn't independently text-checkable the way a stale prose statement is, compounding the detection difficulty |
| **I15 Legal information** | Infrequent but high-consequence (compliance/regulatory changes) | Highest-stakes category in this table — stale legal/compliance information carries genuine liability risk beyond mere user confusion |
| **I16 Documentation** | Frequent for actively-maintained software/APIs | Directly connects to Topic C's Cluster III research on AI-vendor API documentation itself (a nice, self-referential example) and to the "When LLMs Lag Behind" API-evolution research below |

### D. Important mechanisms
The single most important, evidence-backed synthesis connecting this cluster to the rest of the document: **a peer-reviewed, actively-growing body of NLP research on "knowledge conflict" (parametric vs. contextual/retrieved knowledge) directly explains why category-specific staleness matters differently than a simple "old content ranks worse" story would suggest.** Specifically:
- **FACT (peer-reviewed, a genuinely important, directly-relevant academic finding):** "When LLMs Lag Behind: Knowledge Conflicts from Evolving APIs in Code Generation" constructed a benchmark of 270 real-world API updates specifically because models "may confidently generate code using outdated methods that no longer compile" when their parametric knowledge is stale relative to an evolved API — a directly analogous mechanism to I13/I16 (stale software versions/documentation), now with a concrete, peer-reviewed empirical study behind it rather than mere plausibility.
- **FACT (peer-reviewed, general knowledge-conflict finding, directly relevant across this whole cluster):** Prior research (cited within the "Analysing the Residual Stream" paper) found LLMs "tend to prefer contextual knowledge (e.g., retrieved passages) over their parametric knowledge" **in general**, which is reassuring for freshness-remediation purposes (providing current, retrievable information can override stale training-data assumptions) — **but** the same body of research shows this preference is **not absolute or fully reliable**: models "cannot fully suppress internal knowledge even when explicitly instructed to do so" (from the API-evolution paper), and a separate paper ("Whose Facts Win?") found that **"repeating information can flip preferences"** in knowledge-conflict resolution — meaning a fact repeated many times in the model's training data (a company's old pricing page indexed and referenced repeatedly before the cutoff) may be more resistant to being overridden by a single current, correct source than a less-repeated fact would be.
- **INFERENCE (a genuinely important, non-obvious synthesis directly relevant to I17 below, connecting this peer-reviewed literature to the website-audit context):** This gives a concrete, mechanism-level explanation for why **old, heavily-linked, widely-syndicated stale content (e.g., an old press release, syndicated across many news/aggregator sites before a fact changed) is disproportionately dangerous** relative to an equally-old but less-widely-repeated stale fact — it's not just that the old content is still crawlable, it's that its *repetition* across many training-data instances may make it more resistant to being overridden even when correct, current information exists and is retrieved.

### E. Concrete website signals
For each category: presence/absence of a corroborating date signal (Cluster I's infrastructure) appropriate to that category's typical change-rate expectation — e.g., a pricing page with no visible/verifiable recent-update signal is a higher-risk pattern than a legal/compliance page with the same signal absence, given the differing change-rate expectations in the table above.

### F. How the signal could be detected automatically
Deterministic pattern-detection per category (regex/NER for pricing figures, version numbers, named individuals in leadership-adjacent page sections, contact details, dates near case-study content) cross-referenced against Cluster I's freshness-signal-credibility output, with the category-specific change-rate table informing severity weighting rather than detection logic itself.

### G. What evidence the skill should report
The detected fact-type category, its typical change-rate expectation, the available freshness-signal evidence (or lack thereof), and — where feasible — cross-referenced with Harsh's Topic H/P territory for any corroboration-mismatch evidence available.

### H. Possible severity logic
Severity scales by the table's "why staleness is especially damaging" column — legal/compliance (I15) and pricing (I6) at the high end given direct liability/transactional consequences; case studies (I12) and screenshots (I14) generally lower unless the described claims are load-bearing for a purchase decision.

### I. Correct remediation
Category-specific update cadences informed by the table above; for I11 (statistics) specifically, the genuinely novel, non-obvious recommendation is to **periodically re-verify and re-date frequently-cited statistics precisely because their citation-worthy phrasing makes them more likely to be propagated once stale** — a real tension between Topic B's F1 finding (specific/quotable language is good for citation) and this cluster's finding (that same specificity is risky once outdated), worth flagging explicitly in the report as a genuine tradeoff, not resolved falsely in either direction.

### J. False-positive cases
Infrequently-changing categories (I9, I10, I15) should not be penalized merely for having an old timestamp if the underlying fact is genuinely stable — directly consistent with Cluster I's own false-positive handling; old ≠ stale, and severity should reflect actual category-appropriate expectations, not a flat "recency is always better" assumption.

### K. False-negative risks
A single-audit-run cannot verify the actual current truth of a stated fact (e.g., confirm a named executive is still in their role) without an external corroboration check — this cluster's detection is necessarily about *risk signals* (category + staleness-signal absence), not verified ground truth, and should be labeled accordingly; genuine fact-verification against external sources is Harsh's Topic H/P territory.

### L. Counterexamples
A well-maintained software changelog/documentation page with an actively current version number despite the *page's own* `lastmod` being old (because the versioning is templated/auto-generated and always current) illustrates that date-signal absence and actual staleness can diverge in either direction — reinforcing why this cluster's checks should be treated as risk indicators, not certainties.

### M. Generalizes?
Yes, well — all eleven categories are broadly applicable across commercial site types, with I10 (addresses) sharing E28's site-type-dependence (irrelevant for purely digital businesses) and I13/I16 (versions/documentation) being especially concentrated in software/SaaS/developer-tool site types.

### N. Candidate skill(s)
Extends **`freshness-signal-credibility`** (Cluster I) with the category-specific change-rate taxonomy as configuration data — consistent with the now-repeated pattern (Topic E's Cluster B) of correctly not manufacturing separate skills for what is genuinely one mechanism with category-specific weighting.

### O. Relationship to other skills
The knowledge-conflict literature synthesis here is a genuinely new, well-evidenced contribution to the whole project, not previously drawn on — recommend flagging this peer-reviewed body of research to the team generally, since it's directly relevant to any topic touching on "will correct information actually override what the AI already believes," a question several topics (this one, and implicitly Topic K) depend on.

---

## Cluster III — Old content dominance & conflicting facts
**Covers:** I17 (old press releases dominating newer information), I18 (conflicting historical/current facts)

### A. What we need to understand
The specific, concerning failure mode where old content doesn't just persist alongside new content, but actively **outcompetes or contradicts** it in an AI system's output — the most acute, "actively harmful" version of the staleness problem, distinct from mere absence-of-freshness-signal.

### B. Why it matters
This is arguably the most reputationally dangerous failure mode in this entire document — not "the AI doesn't know the current fact" (a gap) but "the AI confidently states the *wrong, outdated* fact" (an active misstatement), which is a stronger, more damaging failure than simple invisibility.

### C. Current evidence
- **FACT (peer-reviewed, directly established in Cluster II above, re-applied here as the core mechanism):** The knowledge-conflict literature's "repetition flips preferences" finding (from "Whose Facts Win?") is the single most directly relevant piece of evidence for I17 specifically: an old press release that was **widely syndicated and cross-linked** before a fact changed (e.g., an old funding announcement, an old executive appointment, an old product-launch price) has, in effect, been "repeated" many times across what would become a model's training corpus — plausibly making it more resistant to being overridden by a single, more recent, correct source, even when that correct source is successfully retrieved.
- **FACT (peer-reviewed, directly relevant, establishing the general shape of the problem):** The broader knowledge-conflict literature (TruthfulRAG, FaithfulRAG, StruEdit, and the "Navigating Unreliable Parametric and Contextual Knowledge" paper, all independently converging) confirms that **when retrieved context and parametric knowledge disagree, the outcome is not guaranteed to favor the (correct) retrieved context** — this is presented across multiple papers as an open, actively-being-solved research problem, not a solved one, which is itself an important, honest calibration point: **we cannot assume that simply having the correct, current fact live on the web is sufficient to guarantee an AI system states it correctly**, especially where a well-established, widely-repeated old fact contradicts it.
- **OBSERVATION (general, well-established practitioner knowledge about content syndication, not requiring a specific new citation for the basic mechanic):** Press releases are, by design and by the nature of PR distribution services, syndicated across many third-party news/aggregator domains simultaneously — meaning a single outdated press release doesn't just exist as one page, it potentially exists as dozens of near-identical copies across the web, each an independent "vote" for the old fact in a system's training corpus or retrieval candidate pool, directly connecting to Topic A's A20 (multi-source answer construction, deferred to Harsh's Topic H/P) and now giving that deferred topic a concrete, freshness-specific mechanism worth flagging to Harsh directly.

### D. Important mechanisms
This is the clearest, most concrete instance in this entire document of the "root cause over symptom" principle the brief asks for: **I17/I18 is not a separate defect from I6-I16's category-specific staleness — it is what happens when a category-specific stale fact (Cluster II) also happens to have been widely syndicated/repeated before it went stale**, compounding an ordinary staleness risk into an active-misstatement risk via the repetition-resistance mechanism documented in the peer-reviewed knowledge-conflict literature. The genuinely actionable, non-obvious insight: **the most dangerous stale facts are not the most recently-stale ones, but the most widely-repeated ones from before they went stale** — a website audit that only checks "how long ago did this page last change" misses this entirely; what matters additionally is "how widely was the old version of this fact syndicated/repeated before it changed."

### E. Concrete website signals
- Detection of press-release-pattern content (structural/linguistic markers common to press releases: dateline format, "FOR IMMEDIATE RELEASE," boilerplate "About [Company]" closing paragraphs) containing fact types from Cluster II's table (pricing, leadership, product claims) that have since demonstrably changed elsewhere on the same site (an internal consistency check — does the press-release-page's stated fact match the current, authoritative page's stated fact for the same fact type).
- Where feasible (connecting to Topic Q's competitive-intelligence/live-query capability, if built), a check for whether an AI assistant's stated answer for a specific fact type matches the site's *current* authoritative page or an older, superseded page/press-release — this is fundamentally a live-query validation, not a static-crawl-detectable signal, and should be flagged for that capability rather than attempted via static analysis alone.

### F. How the signal could be detected automatically
Hybrid: deterministic press-release-pattern detection (structural/linguistic markers) combined with an internal cross-page consistency check (does this old press release's stated fact match the site's current authoritative statement of the same fact) — the internal-consistency version of this check is achievable within a static crawl; the external "does the AI actually state the old fact" version requires live-query capability (Topic R/A18's `live-citation-probe`).

### G. What evidence the skill should report
Specific old press-release/announcement pages containing fact types that conflict with the site's own current authoritative statement of the same fact, explicitly flagged with the repetition-resistance mechanism explained in plain language (why an old, once-widely-syndicated fact is specifically risky, not just old).

### H. Possible severity logic
- **High:** internally-detected conflict between an old press release/announcement and the site's own current authoritative page for a consequential fact type (pricing, leadership, legal/compliance) — this is the strongest, most confidently-detectable version of this finding.
- **Medium:** old content matching Cluster II's staleness-risk categories without a directly-detectable internal conflict (i.e., staleness risk present, but no confirmed contradiction against current authoritative content).

### I. Correct remediation
For genuinely superseded press releases/announcements: add a clear, visible "this information may be outdated; see [current page] for current details" notice (directly serving both the AI-discoverability concern and the on-site-engagement mandate, since a human visitor stumbling on an old press release faces the identical confusion risk); where feasible, apply `noindex`-with-crawl-access (not the robots.txt-plus-noindex contradiction pattern already flagged in Topic C's Cluster IV) to genuinely obsolete announcement pages that serve no ongoing informational purpose; ensure the site's current, authoritative page for each fact type is itself maximally clear, specific, and freshness-signaled (Cluster I) to maximize its odds of winning a knowledge-conflict resolution per the "prefer contextual knowledge" general tendency established in the literature.

### J. False-positive cases
Historical/archival content that's *clearly labeled as historical* (e.g., a "company history" or "our story" page presenting past milestones in an explicitly retrospective frame) is not exhibiting this defect even though it describes past states of fact — the risk is specifically about content that *presents old information as if still current*, not historical content that's honestly framed as historical.

### K. False-negative risks
Our internal-consistency check can only detect conflicts *within the same site* — an old press release syndicated to third-party news sites is entirely outside our own site's crawl scope and cannot be directly checked via this mechanism (though it's exactly the kind of cross-web corroboration/conflict question that connects to Harsh's Topic H/P territory, worth flagging there for their consideration of freshness-conflict detection across sites, not just within one).

### L. Counterexamples
A press release about a *past event* that remains permanently, correctly true (e.g., "Company X was founded in 2015" or "Company X won Award Y in 2020") is not exhibiting staleness risk at all — the concern is specifically about facts that were true when published but have since changed (pricing, leadership, specs), not permanently-true historical facts.

### M. Generalizes?
Yes, well — press-release/announcement patterns and the internal-conflict-detection mechanism are universal; the underlying knowledge-conflict/repetition-resistance mechanism is peer-reviewed and general (not tied to any specific site type), though prevalence of the press-release pattern specifically is higher for companies with active PR/media presence.

### N. Candidate skill(s)
Extends **`freshness-signal-credibility`** with an internal cross-page fact-consistency check specifically targeting press-release/announcement-pattern content — a genuinely novel, evidence-backed addition given the peer-reviewed knowledge-conflict grounding.

### O. Relationship to other skills
Directly connects to, and gives concrete mechanism to, Topic A's A20 (multi-source answer construction, deferred to Harsh) — recommend sharing this cluster's synthesis directly with Harsh, since it gives their corroboration/conflict-resolution research a specific, freshness-relevant mechanism (repetition-resistance) they may not otherwise have surfaced. Also connects to Topic Q (Competitive Intelligence, mine) for the live-query validation half of this finding.

---

## Cluster IV — Temporal language & query-type expectations
**Covers:** I19 (temporal qualifiers), I20 ("as of" language), I21 (event-date vs. publication-date confusion), I22 (content update frequency), I23 (freshness by content type), I24 (freshness expectations by query type), I25 (freshness mismatch across first/third-party sources), I26 (stale snippets/search representations)

### A. What we need to understand
How explicit temporal language functions as a freshness-disambiguation mechanism, and — the genuinely important, previously-deferred question from Topic E's E33 — how freshness *expectations themselves* vary systematically by query type and content type, which determines what "stale" even means in a given context.

### B. Why it matters
This cluster resolves the central, easily-overlooked point that "freshness" is not a single, universal property a page either has or lacks — it's a **relative, context-dependent match between a query's temporal expectation and a page's actual currency**, directly paralleling the "citation ≠ relevance in isolation" lesson already established elsewhere in this project (Topic A's A19, "rank ≠ citation").

### C. Current evidence

**I19/I20 (temporal qualifiers, "as of" language):**
- **INFERENCE (directly extending Topic E's E33, now given full treatment):** Explicit "as of [date]" framing is the single cheapest, highest-value linguistic fix for temporal ambiguity — it converts an inherently unstable relative-time claim ("currently," "now") into an absolute, self-documenting, extraction-robust claim that remains accurate/interpretable even when read out of its original publication context (which is exactly the risk scenario Topic E's E33 identified: relative language becomes misleading once decontextualized by chunk-based retrieval). This directly reuses the "atomic fact decontextualization" academic framing already introduced in Topic E (Hu et al. 2024, Gunjal and Durrett 2024) — an "as of [date]" qualifier is precisely what makes a fact successfully "decontextualized" in that literature's sense.

**I21 (event-date vs. publication-date confusion):**
- **INFERENCE (a genuinely distinct, non-obvious sub-concern worth separating from I19/I20):** A page can have an unambiguous, correctly-labeled publication date while still creating confusion about a *different* date embedded in its content — e.g., a news article published today about an event that occurred last month, or a case study published in 2024 describing a client engagement that took place in 2022. The publication date (Cluster I's territory) and the event date (a fact embedded in the content itself) are genuinely different things, and conflating them is a real, common source of confusion — directly connects to Cluster II's I12 (case studies), where this exact confusion is most likely to occur.

**I22/I23 (content update frequency, freshness by content type):**
- **INFERENCE (directly extends Cluster II's category-specific change-rate table to the page-type level rather than the fact-type level):** Just as different *fact types* have different appropriate change-rate expectations (Cluster II), different *content types* (a blog post vs. a pricing page vs. a documentation page vs. a static "about" page) carry different implicit reader/system expectations about how current they should be — this is the same underlying principle applied one level up, from individual facts to whole pages/content categories.

**I24 (freshness expectations by query type) — the most evidenced, load-bearing sub-topic in this cluster:**
- **FACT (first-party, Google, directly and repeatedly confirmed across multiple documentation pages already cited in this project):** Google's own ranking-systems guide explicitly confirms QDF is **query-dependent, not a universal ranking boost** — "query deserves freshness systems designed to show fresher content for queries where it would be expected," with the explicit example of a recently-released movie. This directly, formally confirms that freshness weighting is not a flat property applied uniformly across all searches.
- **OBSERVATION (commercial analysis, methodologically transparent about its scale though not peer-reviewed, genuinely useful as a concrete, quotable data point):** An Ahrefs analysis of approximately 17 million citations across seven AI platforms found AI-search citations skew **25.7% fresher on average than organic Google search results** — a striking, specific, if OBSERVATION-tier, indication that **AI answer engines may weight freshness more heavily than traditional search does**, not merely inheriting Google's QDF behavior uniformly. This is a genuinely important, non-obvious finding worth flagging clearly as OBSERVATION-tier (a single commercial analysis, not independently replicated or peer-reviewed) rather than treating as settled fact, but it's concrete and directionally significant enough to include with appropriate hedging.
- **INFERENCE (connecting I24 directly to Topic A's A13, search-intent research, a natural, well-grounded synthesis):** A13 already established a taxonomy of query-intent types (informational, navigational, commercial-investigation, transactional, comparison, "best X," temporal, problem-solving). Layering QDF's query-dependence onto that taxonomy gives a genuinely useful, actionable refinement: **temporal-intent queries and "trending/breaking" variants of comparison/recommendation queries** (e.g., "best X **right now**," "latest Y") are where freshness matters most acutely; **stable, definitional, or foundational-explainer queries** ("what is X," a genuinely evergreen informational-intent query) are where freshness matters comparatively little, and a well-aged, authoritative page should not be penalized in our audit's severity logic for simply being old if its content type/query-intent match is evergreen by nature.

**I25 (freshness mismatch across first/third-party sources):**
- **INFERENCE (directly extends Cluster III's I17/I18 finding to the routine, non-adversarial case, and connects to Harsh's territory as already flagged there):** Even without any press-release/syndication-driven repetition-resistance effect, ordinary first-party vs. third-party freshness mismatch is a common, mundane occurrence — a company updates its own pricing page promptly, but a third-party review/comparison site (which Topic B's B2 research already established AI systems may weight comparably or even preferentially to first-party sources for certain query-intent types) may lag behind, creating exactly the "AI cites the stale third-party figure over the current first-party one" failure mode. This is a genuinely important, concrete instance of Topic B's B2 finding (source-type preference by query intent) combined with this cluster's freshness concern — worth flagging as a connected finding, not two separate ones.

**I26 (stale snippets/search representations):**
- **INFERENCE (a genuinely distinct, easily-overlooked sub-concern):** A search engine's or AI system's own **cached representation** of a page (a meta-description snippet, a cached preview, a previously-generated summary) can lag behind the page's actual current content even when the live page itself has been correctly, promptly updated — this is a caching/propagation-delay problem distinct from anything on the site owner's side, directly analogous to Topic D's Cluster III finding about Google's rendering-service potentially "ignoring caching headers" and serving stale JS/CSS. This is a genuine, acknowledged limitation largely outside a site owner's direct control (beyond requesting re-crawl/re-indexing where such tools exist), and should be flagged in the report as a "this may resolve on its own with re-crawling, distinct from an on-page defect" category rather than treated identically to a genuine content-staleness finding.

### D. Important mechanisms
The unifying, load-bearing insight for this entire cluster: **freshness severity in our audit's scoring must be a function of (query-type/content-type expectation) × (actual signal staleness), not staleness alone.** A page can be "old" by any absolute measure and be entirely correctly, appropriately un-updated (an evergreen explainer); conversely, a page can be recently-updated by absolute measure and still be functionally stale relative to a fast-moving query-type/content-type expectation (e.g., a software-pricing page updated six months ago in a category where competitors update monthly). This directly parallels, and should be implemented consistently with, Topic A's A15 finding (freshness is one of several competing reranking factors, traded off against relevance/authority/diversity, not an absolute, standalone signal).

### E. Concrete website signals
- Presence of "as of [date]" or equivalent absolute-time framing near relative-temporal-language claims (I19/I20).
- Detected event-dates embedded in content, cross-referenced against the page's own publication/update date to flag potential confusion where they diverge significantly (I21).
- Content-type classification (blog/news vs. pricing vs. documentation vs. evergreen-explainer) cross-referenced against Cluster I/II's freshness-signal evidence, with content-type-appropriate expectations informing severity (I22/I23).
- Query-intent classification (reusing A13's existing taxonomy) cross-referenced with freshness-signal evidence, specifically flagging temporal/trending-intent-relevant pages with weak freshness signals as elevated-priority findings (I24).
- Where feasible via live-query capability: comparison of AI-stated facts against both first-party current pages and known third-party sources for detectable lag patterns (I25) — a live-query-dependent check, not purely static.
- Explicit flagging of the caching/propagation-delay category (I26) as a distinct, lower-actionability finding type.

### F. How the signal could be detected automatically
Deterministic pattern-detection for I19-I23 (temporal-language patterns, content-type classification via existing infrastructure); reuses A13's existing query-intent classification for I24; I25/I26 require live-query capability and should be scoped accordingly (deferred to whichever skill owns that capability, consistent with how I've handled similar live-query-dependent findings in Topics A/B/C).

### G. What evidence the skill should report
For I19-I23: specific instances of relative-temporal language lacking absolute-date anchoring, and content-type/freshness-signal mismatches. For I24: an explicit statement of the page's evident query-intent category and whether its freshness-signal strength is appropriately matched to that category's typical expectation (not simply "is this page old"). For I25/I26: flagged as live-query-dependent or caching-dependent findings respectively, with appropriately scoped confidence language.

### H. Possible severity logic
- **Medium-High:** weak freshness signals on content serving evident temporal/trending query-intent (I24) — this is where staleness is most consequential.
- **Low:** weak/absent freshness signals on evidently evergreen, definitional content — directly avoiding the false-positive trap of penalizing appropriately-stable content.
- **Medium:** relative-temporal language without absolute-date anchoring on consequential fact types (connects to Cluster II's severity table).
- **Info/Low, distinctly labeled:** I26-type caching/propagation-delay findings, since these are generally self-resolving and less directly actionable than genuine on-page staleness.

### I. Correct remediation
Add "as of [date]" framing to relative-temporal claims; align update cadence to content-type/query-intent-appropriate expectations rather than a flat schedule; for I21, clearly distinguish publication date from any event date embedded in the content itself; for I26, where a re-crawl/re-indexing request mechanism exists for the relevant platform, recommend using it after a substantive update, while being honest that this is a partial mitigation, not a full fix, for propagation-delay issues outside the site owner's direct control.

### J. False-positive cases
Evergreen, definitional, foundational-explainer content should not be penalized for staleness merely due to age — this is the single most important false-positive risk in this cluster, directly following from I24's core finding and consistent with the brief's own explicit warning against "one outdated statement = globally stale website" logic applied indiscriminately.

### K. False-negative risks
Query-intent classification (reused from A13) is itself an inference, not a certainty — a page could be misclassified as evergreen when it actually serves a more temporally-sensitive purpose than its content type suggests, leading to under-flagged staleness risk.

### L. Counterexamples
A "best practices" style page that reads as evergreen/definitional in tone could nonetheless describe specific, time-sensitive recommendations (e.g., "best practices" that reference a since-deprecated technology or regulation) — content-type classification alone (I22/I23) is a useful heuristic but not infallible, and should be combined with Cluster II's fact-type detection (does the page contain specific, checkable facts of the categories already identified as staleness-prone) rather than relying on content-type alone.

### M. Generalizes?
Yes, well — the query-type/content-type-relative freshness-expectation principle is universal; I25's first/third-party mismatch mechanism connects to and inherits the site-type variation already established in Topic B's B2 (query-intent-dependent source-type preference).

### N. Candidate skill(s)
Extends **`freshness-signal-credibility`** with query-intent/content-type-aware severity weighting (reusing A13's classification infrastructure) — the genuinely new, standalone-worthy piece is the temporal-language/absolute-date-anchoring check (I19-I21), which could be folded into the same linguistic-detection layer already proposed in Topic E's Cluster C (negation/conditional/hedge detection), since it's mechanistically similar (detecting a linguistic pattern that creates decontextualization risk).

### O. Relationship to other skills
Directly reuses A13 (Topic A, search intent) and B2 (Topic B, query-intent-dependent source preference); directly extends Topic E's Cluster C linguistic-detection layer; I25/I26 connect to Harsh's Topic H/P (cross-web consistency) and to the live-query capability shared across A18/Topic Q/Topic R.

---

## 2. Findings register
*(Selecting the strongest, most load-bearing, most novel findings from across all four clusters.)*

---
**FINDING ID:** I-01
**Researcher:** Pulkit
**Research Area:** I — Freshness, Staleness & Temporal Consistency
**Research Question:** Cluster III (I17/I18) — Why are old, widely-syndicated facts (e.g., stale press releases) especially dangerous, beyond simply being old?
**Observation:** A peer-reviewed, actively-growing body of NLP research on "knowledge conflict" (parametric vs. contextual/retrieved knowledge) establishes that when an LLM's frozen training-data knowledge disagrees with correctly-retrieved current information, the outcome is not guaranteed to favor the correct, current source — and one paper ("Whose Facts Win?") specifically found that repetition of a fact across training data can "flip preferences" in knowledge-conflict resolution, meaning more-repeated facts are more resistant to being overridden even when incorrect.
**Evidence:** "Whose Facts Win? LLM Source Preferences under Knowledge Conflicts" (arXiv 2601.03746); "When LLMs Lag Behind: Knowledge Conflicts from Evolving APIs in Code Generation" (arXiv 2604.09515, 270-API benchmark); "Analysing the Residual Stream of Language Models Under Knowledge Conflicts" (NeurIPS 2024 workshop paper), and the broader convergent literature (TruthfulRAG, FaithfulRAG, StruEdit) all independently confirming knowledge conflict as an open, unsolved research problem.
**Sources:** See Cluster III section C for full citations.
**Pattern:** Old, widely-syndicated content (press releases distributed across many third-party news/aggregator domains) is disproportionately dangerous not merely because it's old, but because its wide repetition before going stale may make the old fact more resistant to being overridden by correct, current information — a genuine, evidence-backed, non-obvious mechanism most competing teams checking simple "page age" would miss entirely.
**Counterexamples:** Historical content clearly framed as historical (not presented as current) does not exhibit this risk; permanently-true facts (e.g., founding date, past awards) are not subject to this concern regardless of repetition.
**Hypothesis:** N/A for the core knowledge-conflict/repetition-resistance mechanism (peer-reviewed); the specific application to press-release syndication patterns is our own reasonable, evidence-consistent extension, not independently tested.
**Signal:** Press-release-pattern content containing fact types from Cluster II's staleness-risk table that conflict with the site's own current authoritative statement of the same fact.
**How to Detect:** Deterministic press-release-pattern detection + internal cross-page fact-consistency check.
**Evidence Output:** Specific conflicting old/current page pairs, with the repetition-resistance mechanism explained in plain language.
**False Positives:** Clearly-labeled historical content; permanently-true facts.
**False Negatives:** Cannot detect cross-site syndication/repetition outside our own crawl scope; cannot directly confirm an AI system actually states the stale fact without live-query testing.
**Severity:** High for internally-detected conflicts on consequential fact types (pricing, leadership, legal).
**Recommended Fix:** Add visible "may be outdated, see [current page]" notices to superseded announcements; ensure current authoritative pages are maximally clear and freshness-signaled to maximize their odds in knowledge-conflict resolution.
**Generalization:** Universal mechanism; prevalence of the press-release pattern specifically scales with a company's PR/media activity level.
**Candidate Skill:** Extends `freshness-signal-credibility` with an internal fact-consistency check.
**Related Skills:** Topic A's A20 (multi-source construction, Harsh's H/P), Topic Q (Competitive Intelligence, mine).
**Confidence:** HIGH for the underlying peer-reviewed knowledge-conflict/repetition-resistance mechanism / MEDIUM for its specific application to the press-release-syndication scenario, which is our own reasonable inference rather than a directly-tested claim.

---
**FINDING ID:** I-02
**Researcher:** Pulkit
**Research Area:** I — Freshness, Staleness & Temporal Consistency
**Research Question:** I24 — Does freshness matter equally for all queries, or is it query-dependent, and do AI answer engines weight it differently than traditional search?
**Observation:** Google's own first-party documentation confirms QDF (Query Deserves Freshness) is explicitly query-dependent, not a universal boost; a commercial analysis of approximately 17 million citations across seven AI platforms found AI-search citations skew 25.7% fresher on average than organic Google search results, suggesting AI answer engines may weight freshness even more heavily than traditional search.
**Evidence:** developers.google.com/search/docs/appearance/ranking-systems-guide (fetched directly, first-party); Ahrefs commercial analysis (OBSERVATION-tier, ~17M citations, not peer-reviewed or independently replicated).
**Sources:** See Cluster IV section C.
**Pattern:** Freshness severity in our audit must be a function of query-type/content-type expectation multiplied by actual staleness signal strength, not staleness in isolation — directly paralleling Topic A's A15 finding that freshness is one of several competing, traded-off reranking factors, not an absolute standalone signal.
**Counterexamples:** Evergreen, definitional, foundational-explainer content is correctly, appropriately un-updated and should not be penalized for age.
**Hypothesis:** N/A for Google's own QDF confirmation (first-party); the specific "AI cites fresher content than Google" comparative claim is a single commercial analysis, not independently verified.
**Signal:** Query-intent classification (reusing A13) cross-referenced against freshness-signal strength (Cluster I).
**How to Detect:** Deterministic content-type/query-intent classification combined with the freshness-signal-credibility infrastructure from Cluster I.
**Evidence Output:** Page's evident query-intent category and whether freshness-signal strength appropriately matches that category's typical expectation.
**False Positives:** Evergreen content flagged merely for age, without regard to query-intent appropriateness.
**False Negatives:** Query-intent misclassification could under-flag genuine staleness risk on content that reads as evergreen but is actually time-sensitive.
**Severity:** Medium-High for weak freshness signals on evident temporal/trending-intent content; Low for evergreen content.
**Recommended Fix:** Align update cadence and freshness-signaling to query-intent/content-type-appropriate expectations, not a flat schedule.
**Generalization:** The query-dependence principle is well-established (Google, first-party); the specific AI-vs-traditional-search freshness-weighting comparison should be treated as a single, unreplicated data point pending further verification.
**Candidate Skill:** Extends `freshness-signal-credibility` with query-intent-aware severity weighting.
**Related Skills:** A13 (Topic A, search intent), A15 (Topic A, reranking tradeoffs), B2 (Topic B, query-intent-dependent source preference).
**Confidence:** HIGH for Google's own QDF query-dependence statement / LOW-MEDIUM for the specific 25.7% AI-freshness-skew figure, given its single-source, commercial, non-peer-reviewed origin — should be cited as an illustrative, directional data point, not a precise, reliable statistic.

---
**FINDING ID:** I-03
**Researcher:** Pulkit
**Research Area:** I — Freshness, Staleness & Temporal Consistency
**Research Question:** I1-I5 — What makes a freshness/date signal actually credible, versus superficially present but discounted?
**Observation:** Google's own "Creating Helpful, Reliable, People-First Content" documentation explicitly, directly names and discounts the "change the date without substantive content change" anti-pattern ("No, it won't [help]"), directly extending and reinforcing the sitemap-specific `lastmod` finding already established in Topic C's research.
**Evidence:** developers.google.com/search/docs/fundamentals/creating-helpful-content (fetched directly, first-party, direct quote).
**Sources:** See Cluster I section C.
**Pattern:** A trustworthy freshness signal requires convergence across machine-readable date signals, visible date text, and genuine detectable content change — a single date-string update without corroborating substance is a known, explicitly-named, actively-discounted anti-pattern, not a hypothesis.
**Counterexamples:** Genuinely stable, unchanged content with an old, accurate timestamp is correct behavior, not a defect.
**Hypothesis:** N/A — direct reading of Google's own explicit documentation.
**Signal:** Mutual consistency across visible date, schema `dateModified`, HTTP `Last-Modified`, and sitemap `lastmod`; absence of a visible date counterpart to any machine-readable-only date signal.
**How to Detect:** Deterministic extraction and cross-referencing of all four date-signal types; reuses Topic B's F3 schema-vs-visible-text infrastructure for the visible/hidden distinction.
**Evidence Output:** Date-signal presence/consistency findings, with specific flagging of schema-only (no visible counterpart) update dates.
**False Positives:** Old but genuinely accurate, unchanged content.
**False Negatives:** Single-audit-run cannot confirm whether a claimed update actually reflects genuine content change without a prior snapshot to diff against.
**Severity:** Medium for inconsistent or schema-only date signals; Low/Info for consistent, corroborated signals.
**Recommended Fix:** Ensure visible dates accompany machine-readable ones; only update dates for genuine, substantive changes.
**Generalization:** Universal, and grounded in general, cross-vendor-plausible mechanics (not solely Google-specific), given Topic B's independent cross-vendor schema-extraction findings.
**Candidate Skill:** `freshness-signal-credibility` — the anchor skill for this entire topic.
**Related Skills:** Topic C (Cluster VI, `lastmod`), Topic B (F3, schema-visible-text parity) — both explicitly resolved/absorbed here.
**Confidence:** HIGH — directly sourced from Google's own current, explicit, first-party documentation.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
The distinction between **ranking-stage freshness** (Google's documented, query-dependent QDF mechanism) and **generation-stage freshness/knowledge-conflict** (the peer-reviewed "parametric vs. contextual knowledge" literature) is the single most important organizing insight in this document, and it resolves something the brief's own framing could otherwise leave ambiguous: "stale facts" as a target failure mode has (at least) two genuinely distinct root causes requiring different fixes — a page not being *retrieved* because it's insufficiently fresh-signaled for a freshness-sensitive query, versus a page being retrieved correctly but the AI system's answer still reflecting older, more-repeated, more training-data-entrenched information regardless. Our skill's findings should be explicitly labeled by which of these two mechanisms they address, mirroring the "which gate" labeling discipline already established for the three-gate retrieval/citation model in Topics A/B.

**Strongest unvalidated hypothesis:**
That widely-syndicated, once-heavily-repeated stale content (I17, old press releases) is measurably *more* resistant to correction via current, retrieved information than an equally-stale but less-repeated fact would be — a direct, reasonable extension of the peer-reviewed "repetition flips preferences" finding, but not independently tested at the level of a specific website-freshness scenario by any source found. This would be a genuinely valuable thing to validate empirically (e.g., via a controlled live-query test comparing AI-stated answers for a fact type with high versus low historical syndication) if Topic R's experiment-design phase has capacity — and would be one of the more novel, defensible findings in the entire research project if confirmed.

**Strongest candidate skill:**
**`freshness-signal-credibility`**, consolidating: (a) the date-signal-consistency/hidden-date-parity check (Cluster I, directly absorbing the Topic C `lastmod` and Topic B F3 deferred flags), (b) the category-specific staleness-risk taxonomy (Cluster II, informed by the peer-reviewed knowledge-conflict literature), (c) the internal press-release/old-content fact-consistency check (Cluster III, the most novel and evidence-backed addition), and (d) query-intent/content-type-aware severity weighting (Cluster IV, reusing A13's existing classification). This is a well-evidenced, appropriately-scoped, genuinely differentiated skill — the brief's own explicit call-out of "stale facts" as a target failure mode is fully answered by this consolidated design, not by a scattered collection of eleven separately-named category checks.

**Weakest assumption we should investigate next:**
The 25.7% AI-freshness-skew statistic (I-02) rests on a single commercial analysis (Ahrefs, ~17M citations) that is not peer-reviewed, not independently replicated, and whose exact methodology (how "citation" and "freshness" were operationalized, which seven platforms, over what time window) I was not able to independently verify at the level of rigor applied to the peer-reviewed sources elsewhere in this document. Before this figure is used to inform any specific severity weighting or presented in the final report as anything beyond an illustrative, directional data point, it should be re-verified against the original methodology (if a full report is available) or treated with the same appropriate skepticism this project has consistently applied to other single-source commercial statistics (e.g., the contested citation-concentration figures already flagged as unreliable in Topic B's B2 research).

---

## 4. Cross-references for the Combine & Code phase

- **Cluster I ↔ Topic C's Cluster VI (`lastmod` credibility, C-03/C34) and Topic B's F3 (schema-visible-text parity):** Both deferred-ownership flags are now formally, fully resolved here — `freshness-signal-credibility` is the authoritative home for this detection logic; no duplication should occur in either of those topics' skill implementations.
- **Cluster II's knowledge-conflict literature ↔ Harsh's Topic H/P (cross-web consistency, corroboration) and Topic A's A20 (multi-source construction, previously deferred to Harsh):** This is a genuinely new, well-evidenced body of peer-reviewed research not previously surfaced in this project — strongly recommend sharing Clusters II/III directly with Harsh, since the "repetition flips preferences" mechanism is directly relevant to how corroboration/conflict-resolution should be modeled in their research area, and they may not otherwise encounter this specific literature.
- **Cluster III (press-release/old-content conflict detection) ↔ Topic Q (Competitive Intelligence, mine) and Topic R (Experiment Design, mine):** The live-query validation half of this finding (does an AI system actually state the stale fact) requires the shared live-query capability already flagged across A18/B1/this document — consistent, non-duplicated infrastructure recommendation.
- **Cluster IV (I19-I21, temporal-language detection) ↔ Topic E's Cluster C (negation/conditional/hedge linguistic-detection layer, mine):** Recommend folding the absolute-date-anchoring check into the same linguistic-detection layer proposed there, given the mechanistic similarity (both detect decontextualization-risk language patterns) — avoiding a redundant, separately-built linguistic-analysis component.
- **Cluster IV (I24, query-intent-aware severity) ↔ A13 (Topic A) and B2 (Topic B):** Directly, consistently reuses existing classification infrastructure rather than building new query-intent logic — confirmed non-duplicate.
- **I10/I9 (addresses/contact) and I13/I16 (versions/documentation) ↔ Topic V (Soham, Site-Type Differentiation):** Explicit site-type-dependence flags, consistent with how similar variation has been handled throughout this project (e.g., Topic E's E28) — severity should consume Topic V's site-type classifier as an input.
- **Overall meta-note for the Combine phase:** This is the fourth topic in this research project (after C, D, E) where the research process surfaced that a large, fine-grained sub-topic list collapses into a smaller number of well-evidenced underlying mechanisms — worth raising as a standing discussion point before final skill-folder decisions are locked in, since it has now recurred consistently enough to be treated as a genuine finding about the marketplace's ideal architecture, not a one-off simplification.
