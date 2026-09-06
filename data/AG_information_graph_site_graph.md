# Topic AG — Information Graph / Site Graph (AG1–AG15)
**Researcher:** Pulkit | **Research Area:** AG — Information Graph / Site Graph
**Priority:** High (this is the shared data structure that lets Topic AE's crawl output become genuinely analyzable, rather than just a pile of fetched pages)

---

## 0. Framing — AG is the data structure Topic AE's crawl fills, not a new crawling method

Topic AE answered "what should the crawler fetch, in what order, within budget." Topic AG answers the next question: **once pages are fetched, what structure should we build out of them so that graph-level questions — which pages matter most, which content is isolated, which topics/entities/claims map to which pages — become answerable at all?** This is a genuinely distinct concern from AE's traversal/budget engineering: AE decides what to visit; AG decides what to *build* from what was visited, and what to *ask* of that structure once built.

I want to name the organizing principle up front, since it resolves what would otherwise look like five separate, unrelated graph types (AG1-AG4): **AG1 (page graph), AG2 (link graph), AG3 (entity graph), AG4 (topic graph), and AG15 (claim-to-source mapping) are not five different graphs requiring five different data structures. They are one underlying page-level link graph (AG1/AG2, the literal, directly-observable structure), annotated with increasingly semantic layers (AG3 entities, AG4 topics, AG13/AG14 topic/entity-to-page mappings, AG15 claim-to-source mappings) that attach richer meaning to the same underlying nodes and edges.** This document treats AG1/AG2 as the foundational data structure (Cluster A), and AG3/AG4/AG13/AG14/AG15 as annotation layers built on top of it (Cluster C), with AG6-AG12 (Cluster B) being the analytical operations — centrality, connectivity, isolation — that can be run against either the bare structural graph or its annotated version.

---

## 1. Legend
Same as all prior topics: **FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**.

---

## Cluster A — The foundational structure: page graph and link graph
**Covers:** AG1 (page graph), AG2 (link graph)

### A. What we need to understand
What is the actual, precise data structure being built here, and how does it relate to the crawl data Topic AE's crawler produces?

### B. Why it matters
Getting the basic structure right — nodes, edges, direction — is what makes every subsequent analytical operation in this document (Clusters B and C) well-defined rather than ambiguous.

### C. Current evidence
- **FACT (foundational, well-established, not requiring extensive new citation — the standard formalization used throughout the web-graph literature already drawn on in Topic AE):** A website's page graph is formally a **directed graph**: nodes are pages (URLs), and a directed edge exists from page A to page B if A contains a hyperlink to B. This is precisely the structure Topic AE's Cluster A crawl (BFS/priority-queue traversal) discovers incrementally as it fetches pages and extracts their outbound links — **AG1/AG2 is not new data to collect, it is the direct, natural output of Topic AE's crawl, reformalized as an explicit graph object** rather than left as an implicit byproduct of the crawl process.
- **INFERENCE (a precise, useful distinction worth making explicit, since the topic names both AG1 "page graph" and AG2 "link graph" separately):** I interpret "page graph" (AG1) as the node set plus whatever page-level attributes are attached (URL, template cluster per Topic AE's Cluster B, crawl depth per Topic C's Cluster VII, content fingerprint), and "link graph" (AG2) as specifically the edge structure connecting those nodes — the same underlying object, described from two complementary angles (what the nodes carry vs. how they connect). Treating them as one annotated directed graph, rather than two separate structures to build and reconcile, avoids redundant engineering effort.
- **FACT (a well-established, directly relevant formal property of web graphs generally, useful context for calibrating expectations about AG1/AG2's structure):** The web graph literature (Manning, Raghavan, and Schütze's IR textbook, already used as a source in this project's Topic R research) and the broader "Webgraph" research area establish that web graphs are used as the basis for exactly the operations this document's Cluster B addresses — PageRank computation, community/topic detection via co-citation patterns, and hub/authority identification via HITS — meaning AG1/AG2's directed-graph formalization is not a novel design choice, it's the standard, well-proven substrate every subsequent operation in this document (and in the wider web-graph research tradition) is built on.

### D. Important mechanisms
The key design implication: **because AG1/AG2 is directly derived from Topic AE's crawl, its completeness is bounded by Topic AE's own coverage** — a page never fetched (whether due to budget exhaustion, robots.txt exclusion, or trap-avoidance cutoffs) simply doesn't exist as a node in this graph, and its would-be edges are invisible. This means every analytical finding in Clusters B and C below inherits Topic AE's own AE22 coverage-estimation caveat directly and automatically — the site graph is a graph of *what was crawled*, not a claim about the *complete* site structure, and this document's findings should be reported with that inherited limitation explicit, not as if the graph were exhaustive.

### E. Concrete methodology
Build the graph incrementally during Topic AE's crawl: each fetched page becomes a node (carrying its Topic AE/C-derived attributes); each extracted outbound link becomes a directed edge (to either an already-visited node or a not-yet-visited URL, which still gets recorded as a node with an "unfetched" status, since even an undiscovered link target's *existence* is structurally informative for Cluster B's centrality/isolation analysis).

### F. How this could be executed within the 5-minute constraint
Negligible additional cost beyond Topic AE's crawl itself — building and maintaining this graph structure is bookkeeping on top of data the crawler is already gathering, not a separate fetching or analysis phase.

### G. What evidence this produces
The graph object itself: a node list with attributes, an edge list with direction, serving as the direct input to every operation in Clusters B and C.

### H-L.
Not applicable in the standard defect-detection sense — this cluster establishes a data structure, not a detectable finding.

### M. Generalizes?
Yes, completely — directed-graph representation of hyperlink structure is a universal, site-type-agnostic formalization.

### N. Candidate skill(s)
Core shared infrastructure — the graph-construction step that sits directly downstream of Topic AE's crawl-orchestration layer, and directly upstream of every other cluster in this document.

### O. Relationship to other skills
Directly, entirely derived from Topic AE's Cluster A (crawl traversal); directly reuses Topic C's Cluster VII (crawl-depth/link-graph groundwork, which this document formalizes into an explicit, queryable graph object rather than an implicit crawl byproduct) and Topic AE's Cluster B (template-cluster and content-fingerprint node attributes).

---

## Cluster B — Structural analysis: centrality, hubs, authority, and isolation
**Covers:** AG6 (hub pages), AG7 (authority flow), AG8 (isolated content), AG9 (orphan content), AG10 (weakly connected content), AG11 (important-page centrality), AG12 (navigation centrality)

### A. What we need to understand
Given the graph built in Cluster A, what specific, named, well-established graph-analysis algorithms answer the questions AG6-AG12 pose, and — critically — do these seven sub-topics require seven distinct algorithms, or do they map onto a smaller number of established techniques?

### B. Why it matters
This is where the topic's naming (hub pages, authority, centrality, isolation) directly, precisely maps onto a genuinely rich, decades-old body of formal graph-theory and web-IR research — getting the correspondence right means this cluster can borrow enormous rigor from established science rather than inventing ad hoc heuristics.

### C. Current evidence

**AG6/AG7 (hub pages, authority flow) — directly, precisely named after a specific, foundational algorithm:**
- **FACT (foundational, peer-reviewed, directly and unambiguously matching the topic's own terminology):** The HITS algorithm (Kleinberg, 1998, "Hypertext Induced Topic Search") formally defines exactly the two concepts AG6 and AG7 name: **"Good authorities are pages that are pointed to by good hubs and good hubs are pages that point to good authorities"** — a mutual-reinforcement relationship computed via two coupled recursive equations, where the authority vector is the dominant eigenvector of L^T·L and the hub vector is the dominant eigenvector of L·L^T (L being the graph's adjacency matrix). **AG6 (hub pages) is precisely HITS's hub score; AG7 (authority flow) is precisely HITS's authority score** — this is not an analogy, the terminology in the topic's own naming directly matches a specific, formally-defined, 25+-year-old, extremely well-established algorithm.
- **FACT (a precise, important, non-obvious distinction directly relevant to how AG6/AG7 should be scoped for our specific use case):** PageRank and HITS, while both eigenvector-centrality-based and closely related mathematically, differ in one critical respect: **PageRank is "a global computation on the Web graph"** producing "a query-independent prestige score," while **HITS is explicitly query-dependent**, computed over a topic-specific subgraph constructed in response to a specific query. **INFERENCE, directly relevant to our audit context:** For our single-site audit, there is no external "query" driving subgraph construction — but there is a natural analog: **Topic K's question-taxonomy categories (pricing, about, contact, etc.) can serve the same role HITS's query does**, defining topic-specific subgraphs (e.g., "all pages related to pricing") within which hub/authority scores are computed, rather than computing one global hub/authority score across the whole site. This gives AG6/AG7 a genuinely useful, non-arbitrary refinement: report hub/authority scores *per Topic K category*, not just as one undifferentiated site-wide ranking — directly closing the loop between this document's graph-analysis machinery and Topic K's already-established question taxonomy.
- **FACT (a well-documented practical caution about HITS, directly relevant to false-positive handling for AG6/AG7):** The HITS literature explicitly notes the algorithm is "susceptible to *link spamming*" — because hub scores can be inflated simply by adding many outbound links regardless of their genuine quality, a page with an artificially high hub score isn't necessarily a genuinely useful navigational page. This is a real, honest caution: AG6/AG7's raw scores should be treated as one input to importance assessment, not an infallible, gameable-proof ranking.

**AG11/AG12 (important-page centrality, navigation centrality):**
- **INFERENCE (directly building on the HITS/PageRank distinction just established, and directly connecting to Topic AE's Cluster A crawl-scoring work):** AG11 (important-page centrality) is best served by the **query-scoped HITS authority score** described above (per-Topic K-category authority — which pages are most "pointed to" by other pages *in the context of* a specific business-fact category), directly reusing and validating Topic AE's own crawl-priority scoring function (which was independently derived from the same Topic K taxonomy) — **this is a genuinely satisfying convergence: the same category-derived scoring logic that guides *what to crawl* (Topic AE) can, once the graph is built, be formally validated and refined via HITS authority computation**, closing the loop between a heuristic crawl-time proxy and a more rigorous post-crawl graph analysis.
- **INFERENCE (AG12, navigation centrality, best served by the hub-score half of HITS, or a simpler degree-centrality proxy where computational budget is tight):** AG12 is precisely HITS's hub concept — pages whose primary value is pointing *to* other important pages, i.e., navigational infrastructure (a site's main nav bar, a category-listing page, a sitemap-like index page) rather than destination content itself. **A cheaper, simpler alternative worth noting explicitly, given this project's consistent time-budget-consciousness:** for a small-scale, single-site graph (as opposed to the web-scale graphs HITS/PageRank were designed for), simple **out-degree** (raw count of outbound links) may serve as an adequate, computationally trivial proxy for navigational centrality without needing full eigenvector computation — a legitimate, disclosed simplification given our tight runtime budget, though full HITS hub-scoring remains available as a more rigorous option if computational budget allows.

**AG8/AG9/AG10 (isolated, orphan, and weakly connected content) — three genuinely distinct points on one connectivity spectrum, not three synonyms, grounded in precise graph-theoretic definitions:**
- **FACT (formal graph theory, precisely and unambiguously defined, directly matching AG10's own terminology):** A directed graph's **weakly connected component** is defined precisely: "a subgraph is weakly connected if it is undirected or if the only connections that exist for some vertex pairs go against the edge directions" — equivalently, "replacing all of its directed edges with undirected edges produces a connected (undirected) graph." The Weakly Connected Components (WCC) algorithm partitions a graph into such components with linear time complexity (O(|V|+|E|)), making it computationally cheap and well-suited to our tight budget.
- **INFERENCE (the key, precise distinction between AG8/AG9/AG10 that this cluster's research clarifies — genuinely important, since these three terms are often used loosely/interchangeably in casual discussion but have precise, different meanings here):**
  - **AG9 (orphan content)** = a node with **zero inbound edges** from anywhere else in the crawled graph — directly, precisely matching Topic C's Cluster VII's own already-established orphan-page definition (a page discoverable only via sitemap or direct URL, never via link-following).
  - **AG8 (isolated content)** = the more general case, best interpreted as a node (or small node-set) forming its **own weakly connected component**, entirely separate from the graph's main component — this is a *stronger*, more complete form of disconnection than AG9's orphan definition (a page could have zero *inbound* links from the main graph, per AG9, while still linking *outward* to the main component, making it weakly connected to it overall, not fully isolated per AG8's stricter sense) — this distinction (directed inbound-only disconnection vs. full weak-component isolation) is precisely, formally captured by the difference between "orphan" (a directed-edge property) and "isolated"/weakly-connected-component membership (an undirected-connectivity property), and is exactly the kind of distinction the formal graph-theory literature is built to make precisely.
  - **AG10 (weakly connected content)**, read most usefully in this precise taxonomy, refers to nodes that **are** connected to the main component, but only weakly — i.e., through a small number of edges, a long path, or (per the directed-graph WCC definition) only via edges running "against" the natural navigational direction (e.g., a page that links *out* to the main site but that nothing in the main site links *back* to) — a genuinely important, softer, more common failure mode than full isolation (AG8) or strict orphaning (AG9), and one a naive "is this page linked at all" check would completely miss.

### D. Important mechanisms
The unifying, load-bearing synthesis for this entire cluster: **AG6-AG12's seven named sub-topics resolve into two well-established graph-analysis families, applied at two different scopes.** The **centrality family** (HITS hub/authority, or degree-centrality as a cheaper proxy) answers AG6/AG7/AG11/AG12 — "which pages matter most, and in what role (destination vs. navigation)" — and should be computed *per Topic K category* for maximum diagnostic value, not just globally. The **connectivity family** (weakly connected components, precisely distinguishing zero-inbound "orphan" from fully-isolated "component-separate" from merely "weakly attached") answers AG8/AG9/AG10 — "which pages are structurally cut off, and how severely." Both families are well-established, computationally cheap (linear or near-linear time) graph algorithms, not novel research — this cluster's genuine contribution is the precise mapping from the topic's own named sub-questions onto this established science, plus the specific refinement of scoping centrality computation to Topic K's categories rather than leaving it as an undifferentiated global score.

### E. Concrete methodology
Compute weakly connected components (linear time) to classify every node as main-component, isolated (AG8), or (via inbound-edge-count specifically) orphaned (AG9); compute degree centrality as a cheap default, with HITS hub/authority as a more rigorous option scoped per Topic K category where budget allows, to answer AG6/AG7/AG11/AG12.

### F. How to execute this within the 5-minute constraint
All of these algorithms (WCC, degree centrality, even full HITS at the scale of a single-site graph, which will have vastly fewer nodes than the web-scale graphs these algorithms were originally designed for) are computationally trivial relative to the actual page-fetching cost that dominates Topic AE's crawl budget — this entire cluster's analysis can run essentially instantaneously once Cluster A's graph is built, making it a very high-value-per-unit-of-budget addition to the marketplace.

### G. What evidence this phase should produce
Per-category (Topic K-scoped) hub/authority rankings; a list of orphaned pages (AG9, directly cross-referencing Topic C's Cluster VII findings, now formally computed rather than informally described); a list of isolated components (AG8) with their size and content summary; a list of weakly-connected pages (AG10) with the specific structural weakness identified (few inbound edges, long path from main component, or directionally-backward-only connection).

### H. Possible severity logic
- **High:** a page matching a Topic K high-value category (pricing, contact) that is orphaned (AG9) or isolated (AG8) — directly combining this cluster's structural finding with Topic K's stakes-weighting, a genuinely valuable severity-composition example.
- **Medium:** a Topic K-relevant page that is only weakly connected (AG10) — reachable, but structurally under-supported, a real but less severe version of the same underlying concern.
- **Low/Info:** low centrality scores on pages that don't correspond to any Topic K high-value category (e.g., a low-hub-score legal boilerplate page) — not every low-centrality page is a problem, only ones the audit has independent reason to care about.

### I. Correct remediation
Add inbound links from higher-centrality pages to orphaned/isolated/weakly-connected high-value content — directly, precisely actionable given this cluster's graph-based diagnosis (unlike a vague "improve navigation" recommendation, this analysis can specify *which* high-authority page should link to *which* isolated page).

### J. False-positive cases
Directly inherited from the HITS link-spamming caution above: a page with an artificially inflated hub score (many low-quality outbound links) shouldn't be treated as a genuinely important navigational page without corroborating evidence; and — directly consistent with this document's Cluster A framing — low centrality on a page never actually crawled (due to Topic AE's budget limits, not genuine site structure) is a coverage artifact, not a real finding, and must be labeled as such rather than presented as a confirmed structural defect.

### K. False-negative risks
A page could show adequate centrality within our necessarily-partial crawled graph (Cluster A's inherited limitation) while actually being poorly connected in the full, uncrawled site — directly, honestly inheriting Topic AE's own AE22 coverage-estimation caveat, and reinforcing why this document's findings should always be reported alongside that coverage statement, not independently.

### L. Counterexamples
A deliberately isolated page (e.g., a legal disclaimer page intentionally not linked from primary navigation, or a page meant only for direct-link sharing via email/ads, not organic site navigation) is not a defect merely for showing low centrality — the severity logic's Topic K-category-relevance gating (per Section H above) is the primary safeguard against over-flagging intentionally minimal-navigation pages.

### M. Generalizes?
Yes, completely — HITS, PageRank, degree centrality, and WCC are all domain-agnostic, extensively validated graph-theory techniques; their application here (scoped to Topic K categories) is a reasoned, well-motivated adaptation, not a novel or speculative technique.

### N. Candidate skill(s)
Core analytical layer built directly on Cluster A's graph structure — genuinely reusable, well-established algorithmic infrastructure, best implemented as a shared graph-analysis library the entrypoint calls once the crawl-derived graph is built.

### O. Relationship to other skills
Directly, precisely reuses Topic K's question taxonomy (for category-scoped centrality) and Topic C's Cluster VII (orphan-page concept, now given a formal, algorithmic definition); directly validates/refines Topic AE's Cluster A crawl-priority scoring function post-hoc.

---

## Cluster C — Semantic annotation layers: entities, topics, and claim-source mapping
**Covers:** AG3 (entity graph), AG4 (topic graph), AG5 (content clusters), AG13 (topic-to-page mapping), AG14 (entity-to-page mapping), AG15 (claim-to-source mapping)

### A. What we need to understand
How do the more semantic graph concepts (entities, topics, claims) relate to the structural graph established in Clusters A/B — are these genuinely separate graphs requiring separate construction, or annotation layers on the same underlying node/edge structure?

### B. Why it matters
This is where the topic's naming could most easily mislead toward building redundant, disconnected infrastructure (four separate "graphs") rather than recognizing that this project has already built most of the necessary extraction machinery elsewhere (Topics B, E, K) and this cluster's job is connecting it to Cluster A's structure, not reinventing it.

### C. Current evidence

- **INFERENCE (the central, disciplined finding for this cluster, consistent with this project's now well-established pattern of correctly refusing to manufacture redundant infrastructure):** **AG3 (entity graph) and AG4 (topic graph) are not new graphs to construct from scratch — they are annotation layers on Cluster A's existing page-graph nodes.** Specifically:
  - **AG4 (topic graph) / AG13 (topic-to-page mapping):** directly, precisely reuses Topic K's own question-taxonomy categories (K3-K24) as the topic vocabulary, and Topic AE's Cluster A crawl-scoring lexicon (already built to detect exactly these categories in URL paths and anchor text) as the detection mechanism. A "topic graph" in this context is simply: each Cluster A node annotated with which Topic K categories it addresses (already computed as a byproduct of Topic AE's crawl-scoring and Topic K's answerability-testing pipeline), plus edges representing topical similarity between pages (directly reusable from Topic AE's Cluster B SimHash content-fingerprinting, or PageRank's own "topic drift" finding that short random-walk neighborhoods in a link graph tend to be topically homogeneous — meaning the *existing* link-graph structure from Cluster A already substantially approximates topical clustering, without needing a wholly separate topic-similarity computation).
  - **AG3 (entity graph) / AG14 (entity-to-page mapping):** directly, precisely reuses Topic B's B3/B10 entity-recognition/disambiguation research (the AmbER-sets-grounded work on entity clarity and name-collision risk) as the entity-extraction mechanism — annotating each Cluster A node with which entities (the company itself, named competitors, named individuals/leadership per Topic K's K17, named locations per K5) it mentions, again as a layer on the existing graph rather than a separately-constructed structure.
- **AG5 (content clusters) — INFERENCE, directly and precisely resolved by infrastructure already built in Topic AE:** "Content clusters" is best understood as **directly identical to Topic AE's Cluster B template clusters** (the SimHash-based DOM-structure clustering already established there) when the clustering dimension is structural, or as the **weakly-connected-component analysis from this document's own Cluster B** when the clustering dimension is link-structure-based, or as a **topic-annotation grouping** (per AG4/AG13 above) when the clustering dimension is semantic — "content cluster" is not one single new concept requiring new infrastructure, it's a description that applies to the *output* of three already-established clustering mechanisms, and the report should specify *which* clustering dimension (structural, link-based, or topical) any given "content cluster" finding refers to, rather than leaving the term ambiguous.
- **AG15 (claim-to-source mapping) — the most genuinely novel sub-topic in this cluster, directly and precisely connecting to, and formalizing, work already established across Topics B, K, and Q:**
- **INFERENCE (directly synthesizing Topic B's F2/B-01 misrepresentation-risk research, Topic K's Cluster A three-way QA-outcome methodology, and Topic R's Cluster A groundedness/faithfulness taxonomy):** A "claim-to-source mapping" is the natural, direct output of extending Cluster A's page graph with a **third node type** beyond pages: **claims** (specific, extracted factual statements, per Topic E's fact-extraction infrastructure and Topic B's F1/F2 quotability/self-containment work) — with edges connecting each claim node to the specific page node it was extracted from (a direct "supports" edge, precisely matching HotpotQA's own "supporting facts" methodology, already adopted in Topic K's Cluster A). This produces a genuinely useful, three-layer graph structure: **pages → claims → (optionally) cross-references between claims that corroborate or contradict each other** (directly connecting to the handout's own Appendix D corroboration concept, and to Topic I's Cluster III press-release-conflict-detection work, now given a formal graph representation — a contradiction between two claim nodes extracted from different pages is a directly, precisely detectable graph pattern: two claim nodes with incompatible values, both linked to the same underlying fact-type, sourced from different page nodes).
- **INFERENCE (a genuinely valuable, non-obvious synthesis point, directly closing a loop across three separate topics):** This claim-level graph layer is precisely the structure needed to formally detect Topic I's I17/I18 finding (old press releases conflicting with current authoritative pages) as a **graph query** rather than an ad hoc, one-off check: find claim-node pairs sharing the same fact-type annotation but differing in value, trace each back to its source page node, and check the source pages' freshness-signal-credibility scores (Topic I's own established metric) to determine which claim is more likely current — turning what Topic I described as a bespoke detection mechanism into a general, reusable graph-pattern query once this claim layer exists.

### D. Important mechanisms
The unifying, disciplined finding for this entire cluster, consistent with the now-repeated pattern across this whole research project: **AG3-AG5 and AG13-AG15 do not require new extraction or clustering infrastructure — they require formalizing already-built extraction outputs (Topic K's categories, Topic B's entity work, Topic E's fact extraction, Topic AE's template clustering) as explicit annotation layers and additional node types on Cluster A's single underlying graph.** The one genuinely new, valuable idea this cluster contributes is the **three-layer graph structure (pages → claims → cross-claim relationships)**, which gives several previously separately-described mechanisms (Topic I's press-release-conflict detection, the handout's own corroboration concept, Topic B's misrepresentation-risk research) a single, formal, queryable representation rather than leaving them as independently-implemented, disconnected checks.

### E. Concrete methodology
Extend Cluster A's page-graph object with: topic annotations per node (reusing Topic K/AE's existing category-detection lexicon), entity annotations per node (reusing Topic B's B3/B10 entity-extraction work), and a new claim-node layer with "extracted-from" edges to page nodes (reusing Topic E's fact-extraction and Topic B's F1/F2 quotability/self-containment infrastructure) plus "conflicts-with"/"corroborates" edges between claim nodes sharing a fact-type annotation.

### F. How to execute this within the 5-minute constraint
This cluster adds essentially no new extraction cost — every piece of extraction machinery it relies on (Topic K's category matching, Topic B's entity work, Topic E's fact extraction) is already budgeted for as part of those topics' own detection skills; this cluster's actual new work is purely the **graph-construction/annotation step** (attaching already-computed labels to already-existing nodes, and adding lightweight claim-comparison edges), which is cheap, in-memory bookkeeping, not additional fetching or LLM-calling.

### G. What evidence this phase should produce
An annotated graph object (pages with topic/entity labels, claim nodes with source edges and conflict/corroboration edges) that other skills — especially a Topic I-style freshness-conflict check or a Topic Q-style corroboration analysis — can query directly rather than needing their own bespoke data-gathering pass.

### H. Possible severity logic
Directly inherited from whichever underlying topic's finding a given graph pattern surfaces (a detected claim-conflict inherits Topic I's I17/I18 severity logic; an entity-annotation gap inherits Topic B's B3/B10 severity logic) — this cluster is infrastructure/formalization, not a new independent severity system.

### I. Correct remediation
Directly inherited from the underlying topic each graph pattern connects to.

### J. False-positive cases
Two claim nodes sharing a fact-type annotation but describing genuinely different, non-conflicting scopes (e.g., "$49/month for the Starter plan" and "$199/month for the Enterprise plan" — both pricing claims, not actually in conflict) must not be flagged as contradictory — the claim-comparison logic needs to check not just fact-type match but genuine referential identity (same specific plan/product/entity being described) before flagging a conflict, directly reusing Topic E's Cluster B qualifying-context taxonomy to make this distinction correctly.

### K. False-negative risks
A genuine conflict between two claims phrased differently enough that simple fact-type matching doesn't recognize them as addressing the same underlying question (directly connecting to and inheriting Topic E's Cluster A negation/hedging detection difficulty) could be missed — this cluster's claim-matching logic is only as good as the underlying extraction/classification work it depends on.

### L. Counterexamples
A page explicitly, correctly framed as historical/archival (per Topic I's Cluster III false-positive handling) containing an old claim value is not a genuine conflict with the current authoritative page — the claim-conflict-detection logic must inherit Topic I's own historical-content exclusion logic, not merely compare raw values.

### M. Generalizes?
Yes, well — the three-layer graph structure (pages/claims/relationships) and the annotation-layer approach generalize completely across site types; specific topic/entity vocabularies are Topic K/B-derived and already established as broadly applicable there.

### N. Candidate skill(s)
Not a new detection skill — this cluster is the **data-integration layer** that lets several already-established detection skills (Topic I's conflict detection, Topic B's misrepresentation work, Harsh's corroboration research) share one underlying graph representation rather than each independently re-gathering and re-structuring the same extracted facts.

### O. Relationship to other skills
The most extensively cross-referencing cluster in this document — directly formalizes and connects Topic K (categories), Topic B (entities, misrepresentation), Topic E (fact extraction), Topic I (conflict/freshness), and the handout's own corroboration concept (likely also central to Harsh's Topic H/P) into one shared, queryable structure.

---

## 2. Findings register
*(Selecting the strongest, most load-bearing, most novel findings.)*

---
**FINDING ID:** AG-01
**Researcher:** Pulkit
**Research Area:** AG — Information Graph / Site Graph
**Research Question:** AG6/AG7/AG11/AG12 — What specific, established algorithm answers "hub," "authority," and "centrality" for a crawled site graph, and should it be computed globally or per-category?
**Observation:** The HITS algorithm (Kleinberg, 1998) formally, precisely defines hub and authority scores via mutual-reinforcement recursive equations (authority = dominant eigenvector of L^T·L; hub = dominant eigenvector of L·L^T), directly matching the topic's own terminology; critically, HITS is query-dependent (computed over a topic-specific subgraph) while PageRank is query-independent (global) — and Topic K's already-established question taxonomy can directly serve the "query" role HITS expects, enabling category-scoped rather than undifferentiated site-wide centrality scoring.
**Evidence:** Kleinberg 1998 (HITS, foundational); Franceschet, "PageRank: Standing on the shoulders of giants," arXiv 1002.2858 (direct formal comparison of HITS and PageRank); "The structure of broad topics on the Web," arXiv cs/0203024 (PageRank's global/query-independent nature and topic-drift finding).
**Sources:** See Cluster B section C.
**Pattern:** Computing hub/authority scores per Topic K category (rather than one global ranking) directly closes the loop between Topic AE's crawl-priority scoring (independently derived from the same Topic K taxonomy) and this document's post-crawl graph analysis — the crawl-time heuristic and the post-crawl rigorous computation reinforce and validate each other rather than being disconnected mechanisms.
**Counterexamples:** HITS is documented as susceptible to link-spamming (artificially inflated hub scores from many low-quality outbound links) — raw scores should not be treated as an infallible importance signal without corroboration.
**Hypothesis:** N/A — direct application of a 25+-year-old, extremely well-established algorithm.
**Signal:** Per-Topic-K-category hub and authority eigenvector scores over the crawled page graph.
**How to Detect:** Deterministic linear-algebra computation (power iteration for eigenvector approximation), computationally cheap at single-site graph scale.
**Evidence Output:** Ranked hub/authority scores per category, cross-referenced against Topic AE's independent crawl-priority ranking for validation.
**False Positives:** Link-spamming-inflated hub scores; low scores on pages never crawled due to Topic AE's budget limits (a coverage artifact, not a real finding).
**False Negatives:** A genuinely important page could show low centrality within our necessarily-partial crawled graph while being well-connected in the full, uncrawled site.
**Severity:** N/A directly — a structural finding that combines with Topic K's category stakes-weighting for downstream severity (High when a Topic K high-value category shows low centrality).
**Recommended Fix:** N/A directly — informs Topic K/Cluster B's "add inbound links from high-centrality pages" remediation.
**Generalization:** Complete — HITS/PageRank are domain-agnostic, extensively validated across 25+ years of web-IR research.
**Candidate Skill:** Core graph-analysis library, shared infrastructure downstream of Topic AE's crawl.
**Related Skills:** Topic K (category taxonomy, reused as the "query" scope); Topic AE Cluster A (crawl-priority scoring, now validated/refined).
**Confidence:** HIGH — grounded in one of the most extensively studied, validated algorithm families in all of web information retrieval.

---
**FINDING ID:** AG-02
**Researcher:** Pulkit
**Research Area:** AG — Information Graph / Site Graph
**Research Question:** AG8/AG9/AG10 — Are "isolated," "orphan," and "weakly connected" content the same concept described three ways, or three genuinely distinct, precisely definable structural states?
**Observation:** Formal graph theory precisely distinguishes these: "orphan" (AG9) is a directed-edge property (zero inbound links), "isolated" (AG8) is a stronger, undirected-connectivity property (forming its own weakly connected component, entirely separate from the main graph), and "weakly connected" (AG10) describes nodes attached to the main component only tenuously (few edges, long paths, or edges running only against the natural navigational direction) — three genuinely distinct points on one connectivity spectrum, each requiring a different check and representing a different severity of structural problem.
**Evidence:** Formal weakly-connected-component definitions (Wikipedia "Weak component," MathWorld "Weakly Connected Component," Wikipedia "Connectivity (graph theory)"); WCC algorithm documentation (TigerGraph, FalkorDB, Memgraph) confirming O(|V|+|E|) linear-time computability.
**Sources:** See Cluster B section C.
**Pattern:** A page can be "orphaned" (per AG9's strict zero-inbound-link definition) while still linking outward to the main site, making it weakly connected to it overall rather than fully isolated (AG8) — this distinction, easily collapsed in casual usage, is precisely, formally captured by directed vs. undirected connectivity properties in graph theory, and a naive single-category "is this page linked" check would miss the meaningful difference between these three severities.
**Counterexamples:** A deliberately, intentionally minimal-navigation page (e.g., a legal disclaimer meant only for direct sharing) is not a defect merely for showing low connectivity — severity gating should depend on Topic K category-relevance, not connectivity status alone.
**Hypothesis:** N/A — direct application of precise, established graph-theoretic definitions.
**Signal:** Node classification via Weakly Connected Components algorithm (main-component / isolated-component membership) cross-referenced with directed inbound-edge count (orphan check) and edge-directionality/path-length analysis (weak-connection check).
**How to Detect:** Deterministic, linear-time graph algorithm (WCC), computationally trivial at single-site scale.
**Evidence Output:** Classified node list (main-component / isolated / orphaned / weakly-connected) with the specific structural evidence for each classification.
**False Positives:** Intentionally minimal-navigation pages; pages unfetched due to Topic AE's budget limits, misread as structurally disconnected rather than simply uncrawled.
**False Negatives:** A page could appear well-connected within the necessarily-partial crawled graph while being poorly connected in the full site.
**Severity:** High for Topic K high-value categories showing AG8/AG9 status; Medium for AG10; gated by category-relevance to avoid over-flagging intentionally minimal pages.
**Recommended Fix:** Add inbound links from higher-centrality pages (directly actionable, specific — unlike a vague "improve navigation" recommendation).
**Generalization:** Complete — formal graph-theoretic definitions, domain-agnostic.
**Candidate Skill:** Core graph-analysis library, shared infrastructure.
**Related Skills:** Topic C's Cluster VII (orphan-page concept, now formally defined); Topic K (category-relevance severity gating).
**Confidence:** HIGH — grounded in precise, unambiguous, long-established graph-theoretic definitions and a computationally well-understood, linear-time algorithm.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
That AG1-AG15's fifteen sub-topics resolve into a small, well-established set of graph-theoretic concepts (directed page/link graph as the substrate; HITS hub/authority and WCC connectivity as the two analytical families answering AG6-AG12; a three-layer pages/claims/relationships extension answering AG3/AG4/AG13/AG14/AG15) rather than requiring fifteen independent techniques — and, genuinely satisfyingly, nearly every one of these established techniques (HITS, WCC, SimHash-based clustering) is decades-old, extensively validated, and computationally cheap at the scale of a single site's graph, meaning this entire topic's analytical machinery can run essentially free, time-budget-wise, once Topic AE's crawl has built the underlying data.

**Strongest unvalidated hypothesis:**
That computing HITS hub/authority scores per Topic K category (rather than a single global ranking) produces a genuinely more diagnostically useful signal than global scoring would — this is a well-motivated, mechanism-consistent proposal (directly closing the loop with Topic AE's independently-derived category-based crawl-priority scoring) but has not been tested against real site data in this research pass. This is a natural, concrete candidate for validation during actual development/testing, comparing category-scoped versus global centrality rankings against real sites to see whether the category-scoped version genuinely surfaces more actionable findings.

**Strongest candidate skill:**
The **graph-construction and analysis library** synthesizing Clusters A-C — not a detection skill in its own right, but genuinely foundational, reusable infrastructure that gives several other topics' previously bespoke, independently-implemented mechanisms (Topic I's press-release-conflict detection, Topic C's orphan-page concept, Topic B's misrepresentation-risk corroboration checking) a single, shared, formally well-defined data structure to query against, rather than each maintaining its own separate, potentially-inconsistent version of similar logic.

**Weakest assumption we should investigate next:**
The claim-node conflict-detection mechanism proposed in Cluster C (AG15) — comparing claim nodes sharing a fact-type annotation for value conflicts — depends entirely on the underlying fact-type-matching and referential-identity-checking logic (directly inherited from Topic E's Cluster B qualifying-context taxonomy) being accurate enough to avoid the false-positive risk explicitly flagged there (e.g., correctly recognizing that "$49/month Starter" and "$199/month Enterprise" are not a genuine pricing conflict). This dependency chain (AG15 → Topic E's Cluster B → Topic B's F2) is untested end-to-end in this research pass, and validating that claim-conflict detection produces acceptably few false positives in practice — not just in principle — should be an early priority during actual implementation and testing.

---

## 4. Cross-references for the Combine & Code phase

- **Cluster A (page/link graph) ↔ Topic AE's Cluster A (crawl traversal, mine) and Topic C's Cluster VII (mine):** This graph is the direct, formalized output of Topic AE's crawl — should be implemented as one continuous pipeline (crawl → graph construction), not as separate, sequential systems with a data-handoff gap between them.
- **Cluster B (HITS/WCC analysis) ↔ Topic AE's Cluster A crawl-priority scoring (mine) and Topic K's question taxonomy (mine):** The category-scoped centrality proposal directly reuses and validates infrastructure from both — recommend these three pieces (Topic K's category lexicon, Topic AE's crawl scoring, this document's post-crawl HITS analysis) be implemented with genuinely shared configuration, not three independently-maintained category lists.
- **Cluster C's AG15 (claim graph) ↔ Topic I's Cluster III (press-release/conflict detection, mine), Topic B's F2 (misrepresentation risk, mine), and Harsh's Topic H/P (corroboration):** This is the most valuable, most extensively cross-cutting proposal in this entire document — recommend it be discussed jointly with Harsh, since a shared claim-level graph structure could serve as common infrastructure for both Pulkit's and Harsh's research areas' corroboration/conflict-detection needs, avoiding duplicated, potentially-inconsistent independent implementations of very similar logic.
- **AG8/AG9's coverage-dependency ↔ Topic AE's Cluster E (coverage estimation, mine):** Every finding in this document inherits Topic AE's own AE22 coverage-estimation caveat directly and automatically — recommend the report always present this document's structural findings alongside Topic AE's coverage statement, never independently, to avoid an isolated-node finding being misread as a confirmed defect when it might simply reflect incomplete crawl coverage.
- **Overall meta-note, extending the pattern named across Topics C, D, E, I, and K:** Topic AG's 15 sub-topics **do** collapse substantially into a small number of underlying mechanisms (directed graph substrate; two centrality/connectivity algorithm families; one three-layer semantic-annotation extension) — putting this topic back in the "mechanism-level, collapses well" category alongside C/D/E/I/K, rather than the "operates one level up, doesn't collapse" category observed for Topics Q, R, and AE. This is a useful, disclosed observation about where AG sits relative to the rest of this research project's overall structure.
