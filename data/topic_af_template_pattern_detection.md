# Topic AF — Website Template / Pattern Detection (AF1–AF12)
**Researcher:** Soham | **Research Area:** AF — Website Template / Pattern Detection
**Priority:** High (explicitly named as an overlooked area)

---

## 0. Framing — a genuinely distinct mechanism from Pulkit's boilerplate work, plus a note on ownership

I want to flag something directly: in every prior document in this project (V, W, X, Y, Z, AA, AB, AC, AD), I've referred to this exact capability as **"Pulkit's AF (Template Detection)"** — it came up as a cross-reference dependency at least eight separate times, most concretely in Topic Z's Cluster C dependency graph (step 2: "crawl-strategy / template sampler") and Topic AD's Cluster C (crawler-trap defense reuses "AF's template-clustering infrastructure"). This document researches AF directly, but **whoever owns this topic in practice, this needs to be reconciled with Pulkit's own treatment before implementation**, since I've been citing it as existing, already-designed infrastructure throughout this entire project. I'm flagging this plainly rather than quietly proceeding as if there's no coordination question.

With that said, the actual research: this is **not** the same mechanism as Pulkit's already-established single-page boilerplate detection (Boilerpipe/jusText/Readability/Trafilatura, cited extensively in Pulkit's own Topic E document). That work asks, *within one page*, which DOM regions are main content versus chrome. AF asks a different, page-*set*-level question: **across many pages, which ones share the same underlying template, and does a finding on one page's template-generated region generalize to every other page using that template?** Same general subject (site structure), genuinely different mechanism (single-page segmentation vs. cross-page clustering).

The twelve sub-topics collapse into four clusters.

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. Cluster map

| Sub-topics | Cluster |
|---|---|
| AF1, AF2 | **A — Template identification & structural clustering** |
| AF3, AF4, AF5, AF6, AF7 | **B — Named template types (page-level granularity of Topic V's clusters)** |
| AF8 | **C — Content clustering (a distinct, topical axis)** |
| AF9, AF10, AF11, AF12 | **D — Template-level extrapolation & representative sampling (the "found on 1 template × N pages" mechanism)** |

---

## Cluster A — Template identification & structural clustering
**Covers:** AF1 (page-template identification), AF2 (header/footer reuse)

### A. What we need to understand
How to actually detect, algorithmically, which pages on a crawled site share a common template — not by page type/naming convention, but by their real, underlying DOM structure — since this is the foundation everything else in this document depends on.

### B. Why it matters
Without a real template-clustering mechanism, "found on 1 template × 312 pages" (the concrete example this topic opens with) is just a slogan — the entire value proposition depends on being able to actually, algorithmically group pages this way.

### C. Current evidence

**FACT (an established, decades-old, still-active academic subfield, distinct from single-page boilerplate removal)** — Site-level template detection and clustering is a named research area with multiple independent approaches converging on the same core technique: represent each page's DOM structure as a compact fingerprint (via DOM tree paths, tag-structure hashing, or MinHash-based near-duplicate signatures), then cluster pages whose fingerprints are similar. Locality-Sensitive Hashing (LSH) is repeatedly used across this literature specifically because exact DOM-tree comparison (tree edit distance) is too computationally expensive to run at the scale needed, while LSH-based fingerprint comparison is deliberately designed to be cheap and approximate.

**FACT (a concrete, well-specified, directly implementable algorithm from an existing patented system, useful precisely because of its simplicity)** — One documented approach ("SiteLevel(θ)"): sample a set of pages from the site, hash every DOM node on every sampled page, and any DOM node that occurs on at least a **θ fraction** of the sampled pages is deemed part of the template (as opposed to page-specific content). This single, simple mechanism does double duty — it both *identifies* the template (this cluster's job) and *defines the confidence boundary* for extrapolation (Cluster D's job) — the same threshold that says "this node is template-shared" is what justifies "a finding on this node generalizes to every page sharing it."

**FACT (a current, real-world engineering precedent, directly relevant to how this should be built)** — An open-source web-audit tool (Nitpicker) implemented exactly this capability, and its own design notes are directly instructive: DOM-structure template clustering was built as **"a dedicated core phase rather than an AnalyzePlugin, since it needs a corpus-wide batch computation that the per-page... plugin model cannot express."** This is a concrete, load-bearing engineering lesson, not just a validation that the feature is buildable: **template clustering cannot be implemented as a per-page check like most of this project's other skills — it requires the whole crawled page set at once**, before any per-page skill runs.

**INFERENCE (AF2, header/footer reuse — a direct, specific instance of the general mechanism above)** — Header/footer reuse detection doesn't need separate treatment as its own mechanism; it's simply the highest-θ-fraction case of template-node detection (header/footer DOM nodes typically appear on ~100% of a site's pages, the highest possible template-sharing fraction), useful mainly as a sanity-check/calibration case since header/footer sharing is usually the easiest, most obvious template-boundary to verify a clustering implementation against.

### D. Important mechanisms
The unifying insight: **this is a corpus-wide, pre-processing pipeline stage, not a per-page check** — it has to run once, early, on the full crawled page set, and every other AF cluster (and several other topics' extrapolation logic) depends on its output being available before they run.

### E. Concrete artifacts
A DOM-fingerprint function (tag-path/structure hashing, following the established academic pattern above); a clustering step grouping pages by fingerprint similarity (LSH-based for efficiency, given the runtime budget); a per-cluster template-node set (the θ-fraction-shared nodes, following the SiteLevel(θ) pattern) as the output artifact every downstream consumer uses.

### F. How this gets verified
Test against a small, known site structure (a synthetic set of pages with deliberately identical headers/footers and deliberately varied body content) and confirm the clustering correctly groups pages by template and correctly identifies the header/footer nodes as template-shared at a high θ fraction.

### G. What evidence to report
Which template cluster a given page belongs to, and the θ-fraction confidence of that assignment — directly consumable by Cluster D's extrapolation logic and by Topic AD's crawler-trap defense (which reuses this same clustering for a different purpose).

### H. Criticality
High — this is genuinely foundational infrastructure; if it's wrong, every downstream "found on 1 template" claim (this document's entire value proposition) is built on sand.

### I. Correct implementation
Build as a dedicated, corpus-wide pipeline stage that runs once, early (per the Nitpicker precedent), consuming the full crawl-discovery output and producing template-cluster assignments before any per-page content-quality skill (V, W, X, Y, Pulkit's, Harsh's) runs.

### J. Anti-patterns to avoid
Attempting to implement this as a per-page plugin/check, which the Nitpicker precedent explicitly identifies as architecturally wrong for this specific capability; using expensive exact-tree-comparison methods instead of the cheaper, purpose-built LSH/fingerprint approaches the literature has already converged on.

### K. Failure modes if missed
Without this, every other cluster in this document (and the crawler-trap defense in Topic AD) has no foundation — this isn't a partial-value miss, it's a complete dependency failure for the whole topic.

### L. Counterexamples
A very small site (few enough pages that meaningful clustering isn't useful) may not need this stage at all, or may trivially have one cluster — the mechanism should degrade gracefully to "one template, everything in it" rather than failing or producing a meaningless fine-grained clustering on too little data.

### M. Portable?
Yes — this is a general, content-agnostic clustering mechanism, independent of what any specific page is about.

### N. Deliverable
The DOM-fingerprint-and-clustering pipeline stage, run once per site as an early, corpus-wide step.

### O. Relationship to other clusters
Foundational to Clusters B, C, and D in this document; directly consumed by Topic AD's Cluster C crawler-trap defense (same clustering mechanism, different purpose — trap avoidance vs. finding extrapolation); consumed by Topic Z's Cluster C dependency graph (step 2, crawl-strategy/template sampler) and Topic AC's Cluster D (AC12 cross-page consolidation scan).

---

## Cluster B — Named template types (page-level granularity of Topic V's clusters)
**Covers:** AF3 (product-page templates), AF4 (blog templates), AF5 (documentation templates), AF6 (category pages), AF7 (landing pages)

### A. What we need to understand
Whether these five named template types require independent research, or are simply the *per-page-template* application of site-type classification work this project has already built extensively in Topic V.

### B. Why it matters
Getting this mapping right avoids duplicating Topic V's already-substantial research under a new name, while correctly recognizing the one genuine difference in granularity: Topic V classifies a *site* (or a discovered domain-family member); this cluster classifies a *page template within* a site, since a single site can and often does contain multiple template types simultaneously (Topic V's own V-01 Stripe finding already established this: docs, blog, marketing, and community content coexisting across one brand's domain family).

### C. Current evidence

**INFERENCE (a direct mapping, not new research)** — Each named template type here corresponds directly to a cluster already established in Topic V:

| AF template type | Topic V cluster |
|---|---|
| AF3 Product-page templates | Cluster F (commercial/transactional) |
| AF4 Blog templates | Cluster E (authorship/cadence spectrum) |
| AF5 Documentation templates | Cluster D (reference/task-oriented technical) |
| AF6 Category pages | Cluster B (multi-entity/directory-adjacent) |
| AF7 Landing pages | Cluster F (commercial, marketing-specific sub-case) or Cluster A (YMYL, if the landing page is for a regulated offering) |

**INFERENCE (the one genuine addition this cluster contributes)** — Because Cluster A's template-clustering mechanism operates *within* a single crawled site/domain-family, and Topic V's classification can now be applied **per-template-cluster rather than per-site**, a site's overall classification becomes a *set* of (template-cluster, Topic-V-type) pairs rather than one label — directly resolving, at the template-granularity level, the exact hybrid-site problem Topic V's V-01/V-02 findings identified as requiring per-subdomain/per-template classification rather than one whole-domain label.

### D. Important mechanisms
The unifying insight: this cluster's entire contribution is recognizing that **Cluster A's structural clusters and Topic V's type classification are two labels on the same underlying template-cluster object**, not two separate classification systems — once Cluster A identifies "template cluster #3, 47 pages," Topic V's classifier runs once on a representative sample from that cluster and the resulting type label applies to all 47 pages, not to the site as a whole.

### E. Concrete artifacts
The mapping table above, used as configuration data (per Topic Z's Cluster B `references/` convention) so Topic V's classifier is invoked per-template-cluster rather than per-site.

### F. How this gets verified
Directly reuses Topic V's own classifier validation; the only new testable claim is that a hybrid site (Stripe-style, per V-01) produces multiple distinct (template-cluster, type) pairs rather than one forced label.

### G. What evidence to report
Which template clusters exist on the site and their respective Topic V type classifications — directly feeds every other topic's site-type-gated logic (Topic V's Clusters A/B/C/D/E/F, Topic W's intent calibration, Topic Y's audience/depth calibration) at the correct granularity.

### H. Criticality
Medium-high — getting this granularity right is what actually fixes the hybrid-site problem Topic V flagged as its own weakest assumption; without it, Topic V's classifier is forced back to one whole-site label despite its own documented evidence that this is frequently wrong.

### I. Correct implementation
Run Cluster A's clustering first, then invoke Topic V's classifier once per resulting cluster (on a small representative sample from that cluster, per Cluster D below), not once per site.

### J. Anti-patterns to avoid
Treating these five names as requiring five independent detection mechanisms — they don't; the mapping table is the entire contribution.

### K. Failure modes if missed
Reverting to Topic V's own documented weak point (forced single-label classification on genuinely hybrid sites) despite having the infrastructure (Cluster A's clustering) available to fix it.

### L. Counterexamples
A genuinely single-template-type site (a small business with only marketing pages, no docs/blog/directory) correctly produces just one (cluster, type) pair — the mechanism should handle this as the simple, common case, not force artificial sub-clustering.

### M. Portable?
Yes — the mapping mechanism generalizes; the specific five named types are this project's own vocabulary, easily extended if new template types are encountered.

### N. Deliverable
The template-type-to-Topic-V-cluster mapping table, and the per-template-cluster (not per-site) invocation pattern for Topic V's classifier.

### O. Relationship to other clusters
Directly resolves Topic V's own flagged hybrid-site weakness; depends entirely on Cluster A's clustering output.

---

## Cluster C — Content clustering (a distinct, topical axis)
**Covers:** AF8 (content clusters)

### A. What we need to understand
Whether grouping pages by *topic* (what they're about) is the same mechanism as Cluster A's grouping by *structure* (how they're built), and what this axis is actually useful for.

### B. Why it matters
This is a genuinely distinct clustering axis from Cluster A — two pages can share an identical template (both are "blog post" structurally) while covering completely unrelated topics, and two pages can cover the same topic while using different templates (a pricing detail appearing on both a dedicated pricing page and an FAQ entry, which is exactly the scenario Topic AC's AC12 cross-page consolidation check needs to detect).

### C. Current evidence

**INFERENCE (a direct, disclosed connection to work already specified elsewhere in this project)** — Topic AC's Cluster D (AC12, cross-page consolidation) already required "cluster pages by topic overlap" as a prerequisite step for detecting fragmented facts across pages, explicitly citing "reusing Pulkit's AF template/topic clustering" — this document is where that referenced mechanism actually gets specified. Content clustering (by embedding similarity of page text, independent of DOM structure) is the correct, distinct technique for this, since AC12's use case specifically needs topically-related pages *regardless* of which structural template they use.

**INFERENCE** — This axis is also directly useful for Topic AC's Cluster F (AC11, content-gap detection): the "internal completeness check" proposed there (does any crawled page answer a given plausible query) is more efficient if plausible-query-to-page matching is checked against topic clusters first, narrowing the candidate page set, rather than against every crawled page individually.

### D. Important mechanisms
The unifying insight: Cluster A (structural) and Cluster C (topical) are **two independent, non-substitutable clustering axes on the same page set**, and several other topics in this project (AC12, AC11) already assumed this second axis exists without this document having specified it yet — this is the direct, concrete payoff of researching AF explicitly rather than only cross-referencing it.

### E. Concrete artifacts
A topic-embedding-based clustering pass (semantic similarity of page text content, independent of DOM structure), run alongside — not instead of — Cluster A's structural clustering, producing a second, orthogonal cluster-assignment per page.

### F. How this gets verified
Test that two structurally-identical pages (same template) with unrelated topics land in different content clusters, and that two structurally-different pages (different templates) covering the same specific topic land in the same content cluster — confirming the two axes are actually independent in the implementation, not accidentally collapsed into one.

### G. What evidence to report
Content-cluster membership as a data field consumed by other skills (AC11, AC12), not typically surfaced directly to end users on its own.

### H. Criticality
Medium — this document's other clusters (A, B, D) have more direct, singular consumers; this one's value is realized through the topics that already depend on it (AC).

### I. Correct implementation
Build as a second, independent pipeline stage alongside Cluster A's, both consuming the same crawled page set but producing separate cluster-assignment outputs.

### J. Anti-patterns to avoid
Conflating structural and topical clustering into one pass — they answer different questions and a page can score differently on each axis, which is exactly the property AC12 needs (same topic, different template instances) to function.

### K. Failure modes if missed
Topic AC's AC11/AC12 checks (already specified as depending on this) would have no actual mechanism to consume, despite being documented as if the dependency existed.

### L. Counterexamples
None specific — both axes are independently useful and neither substitutes for the other.

### M. Portable?
Yes — topic/semantic clustering is a standard, content-agnostic NLP technique.

### N. Deliverable
The content-clustering pipeline stage, run alongside Cluster A's structural clustering.

### O. Relationship to other clusters
Directly, explicitly required by Topic AC's AC11 and AC12 — this is the most concrete, already-anticipated dependency in this entire document.

---

## Cluster D — Template-level extrapolation & representative sampling
**Covers:** AF9 (template-level problems), AF10 (site-wide vs. page-specific problems), AF11 (representative-page selection), AF12 (finding extrapolation)

### A. What we need to understand
The actual confidence rule for the mechanism this topic opens with — "found on 1 template × 312 pages = site-wide issue" — since this claim needs a real justification, not just a slogan, before a report can responsibly present a single-page finding as applying to 312 pages.

### B. Why it matters
This is the cluster with the most direct, immediate value to the report's credibility and usefulness: correctly done, it turns 312 nearly-identical findings into one clear, high-confidence statement (exactly the outcome this topic's own framing calls for); incorrectly done, it either overclaims (asserting site-wide impact for something that was actually page-specific) or underclaims (reporting the same finding 312 times, the exact outcome this topic exists to prevent).

### C. Current evidence

**INFERENCE (the core mechanism, and the most important design decision in this document — directly derived from Cluster A's SiteLevel(θ) finding, not a separate statistical argument)** — The confidence rule for extrapolation should be **mechanism-based, not sample-size-based**: a finding extrapolates to the full template cluster with high confidence *if and only if* the specific DOM element or content pattern the finding concerns is itself part of the template's shared node set (the θ-fraction-shared nodes Cluster A's clustering already identifies) — **not** because a handful of sampled pages happened to show the same problem. This is a stronger, more defensible justification than generic statistical sampling theory would provide, because it doesn't rely on inferring a population-wide property from a sample's variance — it relies on the same mechanism that *defines* what a template is in the first place: a template-shared node renders identically (or near-identically) across every page using that template, by construction, so a defect confirmed in that specific shared node doesn't need to be independently re-confirmed on all 312 pages any more than a compiler bug needs to be re-tested against every file it compiles.

**INFERENCE (AF10, site-wide vs. page-specific — directly follows from the above)** — This distinction is answered directly by whether the affected content sits inside or outside the template's shared-node set: a missing `<th>` attribute in a header row that's part of the shared header template is a template-level (site-wide) problem; a missing fact/qualifier pairing in page-specific body prose is not, even if it happens to also appear on several other pages, because body content isn't guaranteed identical by the template mechanism the way header/footer/navigation structure is — coincidental repetition across page-specific content is a different, lower-confidence case, more like Topic AC's AC12 cross-page consolidation concern than a true template-level defect.

**INFERENCE (AF11, representative-page selection)** — Given the mechanism-based confidence rule above, representative-page selection doesn't need to optimize for statistical representativeness in the traditional sense (a random or stratified sample large enough to bound estimation error) — it needs to optimize for **confirming which specific elements are actually template-shared** (Cluster A's job) and then checking those specific elements on a small number of pages (2–3) purely to rule out an edge case (a template that renders conditionally differently under some circumstance, e.g., an out-of-stock product page rendering a different header state) rather than to build statistical confidence in a repeated pattern.

**INFERENCE (AF12, finding extrapolation — the report-facing output)** — A template-level finding should be reported once, with an explicit count ("found in the shared template, affecting 312 pages using this template") rather than N times — directly matching the exact framing this topic's own prompt describes — while a page-specific finding that happens to recur across several pages (without being template-shared) should be reported using the honesty convention already established elsewhere in this project (Pulkit's AF-adjacent "found on N/M sampled pages" phrasing) rather than the stronger, mechanism-backed "site-wide" claim, since the two cases have genuinely different evidentiary bases and shouldn't be presented with the same confidence.

### D. Important mechanisms
The unifying insight: **the strength of the site-wide extrapolation claim comes entirely from Cluster A's template-fingerprinting mechanism, not from sample size** — this is a materially stronger, more defensible basis for a confident claim than generic statistical sampling would provide, and it directly explains why representative-page selection (AF11) can be small (2–3 pages) rather than needing a larger, statistically-justified sample: the confidence isn't coming from the sample at all, it's coming from the template-sharing guarantee.

### E. Concrete artifacts
A two-tier finding-report structure: **template-level findings** (element confirmed in the θ-fraction-shared node set) reported once with a page-count multiplier and high confidence; **recurring-but-not-template-shared findings** (Cluster C's content-cluster-adjacent case) reported with the weaker, honest "found on N/M sampled pages" phrasing and appropriately lower confidence, directly reusing Topic AA's AA-01 objective-confidence-proxy convention (a template-confirmed finding is a stronger confidence input than a merely-repeated one).

### F. How this gets verified
Synthetic test: a site with a genuine template-level defect (a shared header missing an attribute) and a separate, coincidentally-repeated page-specific defect (the same typo independently present in several unrelated body-content pages) — confirming the pipeline reports the first as one high-confidence, page-count-multiplied finding and the second as a lower-confidence, honestly-sampled finding, not conflating the two.

### G. What evidence to report
For template-level findings: which template cluster, the θ-fraction confidence that the element is genuinely template-shared, and the total affected page count. For recurring-but-not-template findings: the honest N/M sampled-page phrasing.

### H. Criticality
High — this is the mechanism that delivers this entire topic's headline value proposition; getting the tier-distinction wrong in either direction (overclaiming site-wide impact, or under-consolidating into repeated findings) directly undermines report quality and credibility.

### I. Correct implementation
Build the two-tier structure directly on top of Cluster A's template-fingerprint output — the tier assignment should be a simple lookup (is this element in the shared-node set?) against data Cluster A already produces, not a separate analysis.

### J. Anti-patterns to avoid
Reporting every recurring pattern as "site-wide" regardless of whether it's actually template-shared — this would overclaim confidence exactly where this project has consistently warned against turning weak signals into hard rules; conversely, failing to consolidate genuine template-level findings at all, reproducing the "312 identical findings" problem this topic explicitly exists to solve.

### K. Failure modes if missed
Either an unhelpfully repetitive report (the exact problem this topic's own framing calls out) or an overclaimed, potentially embarrassing "site-wide" assertion about something that was actually specific to a handful of pages.

### L. Counterexamples
A template that renders conditionally (different header state for logged-in vs. logged-out users, or out-of-stock vs. in-stock product pages) could have a shared node set that isn't actually 100% uniform — this is exactly why AF11's small representative sample (2-3 pages, chosen to include any obviously different rendering states if discoverable) still matters even under the mechanism-based confidence model, as a check against conditional-rendering edge cases rather than as a statistical-confidence-building exercise.

### M. Portable?
Yes — the mechanism-based confidence principle (confidence comes from confirmed template-sharing, not sample size) is a general, reusable design decision, independent of this project's specific content.

### N. Deliverable
The two-tier finding-report structure (template-level vs. recurring-but-not-template-shared), built directly on Cluster A's shared-node-set output.

### O. Relationship to other clusters
Entirely dependent on Cluster A's output; directly feeds Topic Z's Cluster F (finding deduplication/aggregation — a template-level finding is, in effect, a pre-deduplicated finding by construction, arguably reducing Z's own dedup burden) and Topic AB's Cluster B (affected-pages rendering, AB6) and Topic AA's confidence-computation (AA-01), since "confirmed template-shared" is exactly the kind of objective proxy AA-01 argued should replace raw verbalized confidence.

---

## 3. Findings register

---
**FINDING ID:** AF-01
**Researcher:** Soham
**Research Area:** AF — Website Template / Pattern Detection
**Research Question:** Is site-level template clustering the same mechanism as single-page boilerplate detection, and is there an established, efficient technique for it at the scale this project needs?
**Observation:** Site-level template clustering (grouping pages by shared DOM structure across a page set) is a distinct, established academic subfield from single-page boilerplate/main-content extraction, with a converging technique across multiple independent sources: DOM-structure fingerprinting (tag paths, node hashing) combined with Locality-Sensitive Hashing for scalable near-duplicate-structure comparison, rather than expensive exact tree-edit-distance computation. One documented, simple, directly implementable variant (SiteLevel(θ)) defines a template's shared-node set as any DOM node appearing on at least a θ fraction of a sampled page set — a mechanism that simultaneously identifies the template *and* defines the confidence boundary for later extrapolation.
**Evidence:** Multiple independent academic sources on DOM-tree-path/LSH-based template clustering (ResearchGate-indexed papers on web page template detection and clustering); a documented patent describing the SiteLevel(θ) algorithm; a current, real-world open-source web-audit tool (Nitpicker) implementing DOM-structure template clustering as a dedicated corpus-wide pipeline phase.
**Sources:** researchgate.net publications on web page template detection/clustering via DOM tree paths and LSH; USPTO patent document describing SiteLevel(θ); github.com/d-zero-dev/nitpicker PR #230 (page-template classification feature).
**Pattern:** This confirms AF is genuinely distinct infrastructure from Pulkit's boilerplate work, not a restatement of it, and supplies both a technique (fingerprint + LSH clustering) and a concrete confidence mechanism (θ-fraction shared-node detection) that directly grounds this document's Cluster D extrapolation logic in something more principled than an assumed sampling heuristic.
**Counterexamples:** None found suggesting this class of technique doesn't scale or doesn't work — the literature and the real-world tool precedent both converge on the same approach without contradiction.
**Hypothesis:** N/A — direct synthesis of converging academic and practical sources.
**Signal:** See Cluster A, Section E.
**How to Detect:** See Cluster A, Section E/F.
**Evidence Output:** Template-cluster assignments and per-cluster shared-node sets.
**False Positives:** N/A specific to this finding.
**False Negatives:** A template with very low structural consistency (rare, but possible with heavily randomized/personalized layouts) could fail to produce a useful shared-node set at any reasonable θ — an acknowledged edge case, not a design flaw.
**Severity:** N/A — an infrastructure finding.
**Recommended Fix:** N/A directly to a website.
**Generalization:** High — general, content-agnostic clustering technique.
**Candidate Skill:** The corpus-wide template-clustering pipeline stage (Cluster A's deliverable).
**Related Skills:** Pulkit's boilerplate-detection work (distinct, complementary); Topic Z's Cluster C (dependency graph); Topic AD's Cluster C (crawler-trap defense, same clustering reused).
**Confidence:** HIGH — multiply corroborated by independent academic sources, a patented system description, and a current real-world tool implementation.

---

## 4. Required end-of-topic synthesis

**Strongest validated insight:**
AF-01's mechanism-based confidence rule (Cluster D) — that extrapolation confidence should come from confirming an element is part of a template's shared-node set, not from sample size — is a genuinely stronger, more defensible justification for the "found on 1 template × 312 pages" claim this topic opens with than a generic statistical-sampling argument would have provided, and it falls directly out of the same mechanism (SiteLevel's θ-fraction) that defines what a template even is.

**Strongest unvalidated hypothesis:**
Whether real websites' template structures are consistent enough in practice for the θ-fraction mechanism to produce clean, high-confidence shared-node sets, or whether conditional rendering (logged-in states, A/B tests, personalization) is common enough to meaningfully degrade the clean template/page-specific split this document's entire Cluster D design depends on — this is assumed workable based on the cited literature's own reported success, but untested against this project's own actual crawl targets.

**Strongest candidate skill:**
The corpus-wide template-clustering pipeline stage (Cluster A), because it's the single piece of infrastructure this entire document depends on and that at least three other topics (Z, AC, AD) have already assumed exists as a dependency.

**Weakest assumption we should investigate next:**
The ownership/coordination question flagged in Section 0 — this document was researched independently of whatever treatment Pulkit may already have given this topic under the same "AF" label, given how consistently it's been cross-referenced as "Pulkit's AF" throughout this project. Before implementation, these two treatments need to be reconciled explicitly, since building two independent, possibly-inconsistent template-clustering implementations under the same name would be a direct, avoidable integration failure.

---

## 5. Cross-references for the Combine & Code phase

- **Cluster A ↔ Topic Z (Cluster C, dependency graph) and Topic AD (Cluster C, crawler traps):** This is foundational, corpus-wide infrastructure that must run before per-page skills and is directly reused (not duplicated) by Topic AD's trap-avoidance logic.
- **Cluster B ↔ Topic V (all clusters):** Resolves Topic V's own flagged hybrid-site weakness by enabling per-template-cluster rather than per-site classification — this should be discussed directly with whoever finalizes Topic V's classifier implementation.
- **Cluster C ↔ Topic AC (AC11, AC12):** Directly, explicitly required by work already specified there — this is the most concrete, already-anticipated dependency in the whole project; AC's documents should be updated to point here once this is implemented.
- **Cluster D ↔ Topic Z (Cluster F, aggregation/dedup), Topic AB (Cluster B, affected-pages rendering), Topic AA (AA-01, confidence computation):** The two-tier finding structure is effectively a pre-deduplication mechanism and a strong, objective confidence input — both should consume this document's output directly rather than re-deriving similar logic.
- **The whole document ↔ Pulkit's own AF treatment, wherever it exists:** Explicit, direct reconciliation needed before implementation, per Section 0 and the weakest-assumption note above — this is the single most important administrative, non-technical action item in this document.
