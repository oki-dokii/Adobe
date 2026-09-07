# Topic A — AI Discovery Mechanics
**Researcher:** Pulkit | **Research Area:** A — AI Discovery Mechanics (core mechanism: retrieval, query interpretation, source selection, ranking, RAG/search behavior)
**Priority:** Very High

---

## 0. Framing — what Topic A is actually for

Topic A is not "how do ChatGPT/Perplexity/Gemini/Claude work" as trivia. It exists to answer one design question for the marketplace:

> **At which specific stage of the retrieve→rank→select→generate→cite pipeline does a typical brand's website fail to make it into an AI answer, and what on-page/on-site evidence would let a read-only crawler detect that failure in under 5 minutes?**

Every sub-topic below (A1–A22) is evaluated against that question, not against "is this interesting."

I'm treating A1–A10 (the four assistants + the eight named mechanisms) as the **conceptual map**, and A11–A22 as the actual **research investigation units**, because A11–A22 already decompose the pipeline into checkable stages. I answer A1–A10 concisely inside the relevant A11–A22 sections rather than as three separate isolated write-ups, to avoid restating the same four-assistant comparison eight times.

**Critical constraint from the handout, re-read carefully:** page 6 of the handout (Appendix, section B) explicitly tells us *not* to over-claim: "What ends up in the answer depends on what the assistant can find and use at that moment... the pages that get picked as sources tend to be the ones a machine could easily reach, easily read, and easily quote a clear fact from." This is the handout's own framing of the retrieval→extraction→citation chain, and it matches what the primary literature says (below). Our skills should encode *this exact mechanism*, not vendor-specific trivia about e.g. Bing market share, which will rot and doesn't generalize.

---

## 1. FACT vs OBSERVATION vs HYPOTHESIS vs INFERENCE vs SPECULATION — global legend

Used throughout:
- **FACT** — documented by the vendor, or established in peer-reviewed/archival literature.
- **OBSERVATION** — reported by independent researchers/practitioners running real trials (not vendor-confirmed, but methodologically transparent).
- **HYPOTHESIS** — our proposed testable claim, not yet validated by us.
- **INFERENCE** — reasonable derivation from FACT/OBSERVATION, one logical step removed.
- **SPECULATION** — plausible but unconfirmed; flagged, not built on.

---

## A1–A4: How does each assistant search? (documented behavior only)

| System | FACT (vendor-documented) | Notes on architecture we do NOT know |
|---|---|---|
| **ChatGPT (OpenAI)** | ChatGPT search can turn a prompt into one or more search queries, retrieve results, and generate an answer with source links; automatic or manual triggering; Chat Completions vs Responses API differ in whether search is forced or model-decided.<br>Two web search modes: non-reasoning (fast, no internal planning, passes along search-tool output) and agentic search with reasoning models (model actively manages/iterates the search process). | OpenAI has **not** published a full architecture diagram of ranking/reranking internals. Historically launched on Bing infrastructure; OpenAI has since built its own crawler/index and reportedly draws on multiple providers — this is corroborated by independent technical writeups but not a single OpenAI statement, so it's **OBSERVATION**, not FACT. |
| **Perplexity** | Documented as retrieval-augmented: interprets intent → retrieves across sources → LLM synthesizes cited answer. Perplexity's own Search API blog states their infrastructure "divides documents up into fine-grained units" (sub-document/passage-level indexing) that are individually scored against the query — this is a direct, first-party technical claim about **passage-level indexing**, which is highly relevant to A16. | Exact ranking formula, exact hybrid-retrieval weighting, and reranker architecture are not published. Third-party reverse-engineering (BM25 + dense embeddings + multi-tier reranker) is **OBSERVATION**, not FACT. |
| **Gemini (Google)** | Fully documented, first-party, technically precise: a **prediction/classifier score (0–1)** decides whether a prompt would benefit from grounding (default threshold 0.3, developer-configurable); if triggered, the model generates one or more search queries, executes them against Google Search, processes/synthesizes results, and returns a grounded response with inline citations + "Search Suggestions." This is the **most transparent documented pipeline of the four** because it's an API product with a published request/response contract. | Internal Search ranking signals used *within* that Google Search call are Google's general search-ranking internals — not disclosed at this level of detail. |
| **Claude (Anthropic)** | Documented: Claude decides agentically whether search would help, generates a targeted query, retrieves results, analyzes for key info, and answers with citations; can chain multiple searches ("agentic search / refinement") up to a configurable `max_uses`; supports `allowed_domains`/`blocked_domains`; uses a third-party search provider (independently reported as Brave Search — **OBSERVATION**, not an Anthropic doc statement in the sources I pulled) and encrypts intermediate result content for multi-turn context management (Anthropic-documented mechanism, undisclosed algorithm). | Claude's own citation-selectivity ("cites 2–4 sources vs 4–8 for ChatGPT") is a third-party claim from an SEO vendor — **OBSERVATION at best, possibly SPECULATION** — must not be treated as ground truth in a skill. |

**Cross-cutting FACT common to all four:** every documented pipeline is a *variant of the same shape*: **(1) decide whether to search → (2) formulate query/queries → (3) retrieve candidate documents from an index → (4) rank/filter → (5) generate an answer conditioned on the surviving subset → (6) attach citations.** This four/five/six-stage shape recurring identically across four independently-built systems, all disclosed by their own vendors, is the single most load-bearing FACT for the whole marketplace: it means our skills can target **stages of a generic pipeline**, not vendor-specific internals, and still generalize. This directly satisfies the hackathon's "design for patterns, not fit-to-examples" instruction.

**Sources:** OpenAI Help Center (help.openai.com), OpenAI Platform docs (platform.openai.com/docs/guides/tools-web-search), Google AI for Developers (ai.google.dev/gemini-api/docs/google-search), Google Cloud docs (docs.cloud.google.com/gemini-enterprise-agent-platform), Anthropic (claude.com/blog/web-search-api, support.claude.com), Perplexity (perplexity.ai/hub/blog/introducing-the-perplexity-search-api).

---

## A5–A10: Core mechanisms — condensed, evidence-anchored

I'm not writing separate essays for A5–A10 in isolation; they are the *vocabulary* used inside A11–A22. Quick anchors:

- **A5 RAG pipelines / A11 retrieval vs generation** — see A11 below.
- **A6 Source selection** — see A17/A18/A19 below; this is where the *strongest, most novel, peer-reviewed evidence* exists (SIGIR 2026 "What Gets Cited" paper).
- **A7 Citation generation** — folded into A17–A20; note the important **FACT** from the "Think Before Writing" paper (arXiv 2604.19113): in generative engines, **visibility is now citation-allocation, not rank position** — a page can rank fine in the underlying retrieval and still get zero exposure because it wasn't the one or two sources chosen to be cited. This reframes the entire audit: our skill should not ask "would this page rank well" but "would this page be *picked to cite* out of a competing set."
- **A8 Retrieval ranking / A15 Reranking** — see A15 below.
- **A9 Entity retrieval / A10 Knowledge graph influence** — genuinely belongs more to Harsh's Topic F (Entity Recognition & Resolution) per the distribution sheet; I note it here only where it bears on *retrieval* (query→entity disambiguation happening *before* a page is even considered), and hand off entity-identity questions to Harsh's F/G. This avoids research duplication per the "Combine & Code" phase in the distribution sheet.

---

## A11 — Retrieval vs. generation

### A. What we need to understand
Where does a web page "enter" an AI pipeline, and what happens to it structurally before it ever reaches the language model that writes the answer?

### B. Why it matters for the hackathon
This is the single most important conceptual model for the whole marketplace, because it draws the line between problems our tools *can* detect (retrieval-stage: crawlability, indexability, extractability) and problems that are effectively invisible to a website auditor (generation-stage: how the model weighs/words/orders the synthesis). If we conflate the two, we'll build unfalsifiable "fix your generation" recommendations, which is exactly the kind of unfounded claim the brief warns against.

### C. Current evidence
- **FACT:** All four assistants' documented pipelines (A1–A4 table) separate a **retrieval step** (search/query/fetch) from a **generation step** (LLM synthesizes response from what retrieval handed it). Anthropic, OpenAI, and Google's docs all describe this as sequential: search happens, *then* the model is given the results to reason over.
- **FACT (academic, foundational):** Retrieval-Augmented Generation as a formal architecture (Lewis et al. 2020, and the survey arXiv:2312.10997 "Retrieval-Augmented Generation for LLMs: A Survey") describes exactly this two-stage decomposition: **indexing/retrieval phase** (candidate generation) and **generation phase** (LLM conditioned on retrieved context).
- **OBSERVATION:** Newer systems (OpenAI's "agentic search with reasoning models," Perplexity's "Deep Research," Claude's "agentic search & refinement") blur the line by interleaving multiple retrieval passes with reasoning — i.e., retrieval and generation are no longer strictly one-shot-sequential in advanced modes, they can loop. This is documented at a high level by vendors but the loop's internal stopping criteria are not published.
- **INFERENCE:** Because retrieval is a discrete, separable step that fetches and reads *pages* (not "the whole internet" or "the model's memory"), a page's failure to be retrieved is a **necessary** (not sufficient) precondition for that page to influence any answer. If retrieval fails, generation quality is moot — this matches the handout's own three-gate model (crawl → read → extract fact) in Appendix A.

### D. Important mechanisms
The handout's own appendix (section A) already states the three-gate model we should encode: crawler let in → crawler can read content → crawler can pick out the specific fact. A11 confirms this is not a hackathon simplification — it matches the documented and academic RAG literature. Adding to it: retrieval itself is not monolithic — it's typically **candidate generation (broad recall) → reranking (narrow precision)** (A14/A15), and only the reranked survivors are handed to generation.

### E. Concrete website signals
A retrieval-stage failure shows up as **absence from the page set the model could possibly see**, which is upstream of anything content-quality related. Signals: page not crawlable (robots.txt block, auth wall, JS-only render with no server-side HTML) → page cannot be a retrieval candidate at all, regardless of how well-written its content is.

### F. How the signal could be detected automatically
Deterministic: fetch page with two request modes — (1) raw HTTP GET (what a lightweight crawler/BM25 indexer sees) and (2) rendered/headless-browser fetch (what a human or a JS-executing crawler sees). Diff the two. A large content delta between raw HTML and rendered DOM for content that matters (the "answerable facts") is evidence the page may fail at the retrieval/extraction gate for indexers that don't render JS. This is a deterministic, generalizable, site-agnostic check — no vendor-specific assumption required.

### G. What evidence the skill should report
- Whether raw-HTML text extraction recovers the key factual content also visible in rendered DOM.
- % content delta between raw and rendered.
- Which specific facts (if identifiable) exist only in the rendered version.

### H. Possible severity logic
- **Critical:** page returns near-empty raw HTML (SPA shell) and the missing content includes core identity/offer facts (what the org does, pricing, contact).
- **High:** raw HTML present but materially incomplete vs. rendered.
- **Low/Info:** minor JS-injected content (e.g., a chat widget, cookie banner) with no bearing on factual content.

### I. Correct remediation
Server-side render (SSR) or static-generate the pages that carry the facts most likely to be quoted (root cause is JS-dependent rendering, not "add more content" or "add schema"). This should connect to Topic D (Machine Readability/Rendering) — same root cause, different symptom framing.

### J. False-positive cases
A JS-heavy page is **not** automatically a failure: (1) many modern crawlers/indexers *do* render JS to some extent (documented for Googlebot; not confirmed at this granularity for OpenAI/Anthropic/Perplexity crawlers, so we must not assume parity); (2) a page can be JS-heavy for *interactive* features (a calculator, a configurator) that were never meant to be machine-extractable facts. We should only flag JS-dependency for content that is *typically fact-bearing* (pricing, specs, dates, named entities), not for decorative/interactive elements.

### K. False-negative risks
A page can pass the raw-vs-rendered diff (i.e., all text present in raw HTML) and still fail retrieval for other reasons entirely (robots.txt disallow, noindex, orphaned/unlinked page, sitemap omission — Topic C's territory). This check alone is not sufficient; it must compose with Topic C (Crawlability) and Topic D (Rendering) checks in the entrypoint's evidence chain, not be treated as a full discoverability verdict on its own.

### L. Counterexamples
A site that is 100% static HTML with zero JS can still be fully invisible to AI assistants if it's blocked by robots.txt or has no external links/sitemap pointing to it — proving JS-dependency is neither necessary nor sufficient for invisibility, only one contributing factor.

### M. Generalizes across site types?
Yes — the raw-vs-rendered diff technique is site-type agnostic; it applies identically to SaaS, e-commerce, news, docs sites. The *severity weighting* (which missing facts matter) should vary by site type, which is a hook into Soham's Topic V (Site-Type Differentiation).

### N. Candidate skill(s)
**`crawl-render-audit`** (matches the handout's own illustrative example skill name in the sample layout) — fetches raw + rendered HTML, diffs them, flags fact-bearing content that's JS-locked. *(Note: this candidate skill also absorbs work from Topics C and D — see composition notes below.)*

### O. Relationship to other potential skills
Feeds the entrypoint's overall "why can't AI find/read this" diagnosis chain together with Topic C (crawlability — is the URL reachable at all) and Topic D (rendering — is the content machine-readable). These three are one causal chain, not three unrelated findings, per the brief's explicit root-cause example (JS-only pricing).

---

## A12 — Query rewriting

### A. What we need to understand
Before retrieval happens, the user's raw question is transformed — expanded, decomposed, or rewritten into different phrasings/sub-queries. Does this matter for a website auditor?

### B. Why it matters
If assistants issue *multiple reformulated queries* per user question (not just the literal string), then a page's discoverability shouldn't be tested against one phrasing — it should be tested against the plausible *set* of queries a real question decomposes into. This directly shapes Topic K (AI Answerability) and Topic R (Experiment Design).

### C. Current evidence
- **FACT:** Documented directly for two of the four systems. Gemini API docs: "If the model decides to execute multiple search queries to answer a single prompt (for example, searching for 'UEFA Euro 2024 winner' and 'Spain vs England Euro 2024 final score' within the same API call), this counts as two billable uses" — this is a first-party, concrete confirmation that a single user prompt can be decomposed into **multiple, differently-worded queries**. Claude docs describe "agentic search & refinement" where later queries are informed by earlier results (multi-query, sequential, not just parallel).
- **INFERENCE:** If retrieval issues multiple reformulated queries per user question, a page optimized for exact-match on one phrasing but not covering related phrasings (synonyms, related entities, comparison framing) is retrievable for a narrower slice of the query space than a page whose text naturally covers the topic in multiple phrasings.
- **HYPOTHESIS (ours, untested):** Pages that state a fact in only one narrow phrasing (e.g., only "cost" never "pricing"/"price"/"plans") are retrieved for a narrower set of the query reformulations a user's question decomposes into, reducing effective discoverability even when the fact exists on the page.

### D. Important mechanisms
Query expansion/decomposition means the "audit query" we use to test AI answerability (Topic R) must itself be **multiple phrasings**, not one canonical string — otherwise our own experiment methodology under-samples what real retrieval does.

### E. Concrete website signals
Lexical diversity of key-fact phrasing on a page: does the page use only one term for a concept that has common synonyms/related phrasings (technical jargon vs. plain language, "pricing" vs. "cost" vs. "plans", full product name vs. common abbreviation)?

### F. How the signal could be detected automatically
Deterministic + light NLP: extract key entity/fact terms from a page, generate a small synonym/paraphrase set (can use an LLM call for this — legitimate use of LLM reasoning for semantic interpretation per the brief's hybrid-approach guidance), and check whether the page's surrounding text uses more than one of these phrasings, OR simply flag if a fact is stated using highly niche/internal terminology with no plain-language synonym anywhere on the page.

### G. What evidence the skill should report
Term(s) checked, phrasings found on page vs. common phrasings not found, example query reformulations that would plausibly miss this page.

### H. Severity
Low-to-Medium — this is a soft signal, not a hard failure; a page missing one synonym is not "broken," just narrower in retrievable surface area.

### I. Remediation
Add plain-language synonyms/aliases near the key fact (e.g., a pricing page that says "$49/mo" should also contain the word "price" or "cost" in prose, not only in a table header).

### J. False positives
Highly technical/specialized sites (e.g., a scientific instrument manufacturer) *should* use precise jargon — forcing lay synonyms could reduce accuracy/credibility for their actual audience. **Must not** flag jargon as a defect on expert-audience sites; severity should be conditioned on site type (hook to Topic V).

### K. False negatives
We cannot observe the assistants' actual query-rewriting output (it's not exposed), so our synonym set is necessarily a guess/approximation — we may miss the actual reformulations a real system generates, or flag synonym gaps that don't matter because retrieval uses semantic (embedding) rather than purely lexical matching, which tolerates paraphrase automatically (see A14 hybrid retrieval — dense retrieval doesn't require exact lexical match).

### L. Counterexamples
For **dense/semantic retrieval**, lexical synonym coverage matters much less, because embeddings capture meaning, not surface form — this is a direct counter to the naive version of this hypothesis and must be stated in the skill's confidence handling: this check is a weak signal that should never alone drive a "critical" severity, given semantic retrieval's documented lexical-invariance in the literature.

### M. Generalizes?
Yes, applies to any content-bearing site; severity should adapt to expected audience sophistication (site-type dependent).

### N. Candidate skill
Fold into a broader **`ai-answerability`** skill (Topic K) as one check, not a standalone skill — this signal alone is too thin to justify its own skill folder (avoids "padding" the marketplace per rubric).

### O. Relationship to other skills
Feeds Topic K (AI Answerability) and Topic R (Experiment Design — informs how we phrase test queries).

---

## A13 — Search intent

### A. What we need to understand
Different query *types* (informational, navigational, commercial-investigation, transactional, comparison, "best X," "X vs Y," "alternatives to X," local, temporal, problem-solving) may retrieve/cite differently. Does a website need different content shapes to be competitive for different intent types?

### B. Why it matters
"Companies that provide X" and "X vs Y" and "best X" are exactly the query types where **brand invisibility** is most damaging (a prospect never hears about you) and where **source substitution** (A18) is most likely, because these are inherently multi-source, comparison-shaped queries — the assistant *must* gather several candidates.

### C. Current evidence
- **FACT (search-intent taxonomy, well-established in IR literature, pre-dates LLMs):** informational / navigational / transactional intent classification is classic IR (Broder 2002 taxonomy), and commercial-investigation was added by Andrei Broder-successor literature/industry (Ahrefs/Moz — practitioner sources, not academic, but widely adopted).
- **OBSERVATION:** Comparison/recommendation queries ("best X," "X vs Y," "alternatives to X") are exactly the shape used in the GEO academic literature's benchmark construction (GEO-bench, arXiv 2311.09735) — the foundational GEO paper explicitly builds its benchmark around queries "across multiple domains" designed to force multi-source synthesis, which is the researcher's own operationalization of high-stakes intent categories.
- **INFERENCE:** For comparison/recommendation-type queries, an assistant *must* retrieve and hold multiple competing sources simultaneously (this is different from a single-fact lookup) — meaning a brand's page not only needs to be retrievable, it needs to **contain the comparison-relevant facts explicitly** (differentiators, category membership, "alternatives to") or it will be a candidate that gets excluded during multi-source synthesis even if retrieved.

### D. Important mechanisms
A page can satisfy "informational intent" about itself but fail "comparison intent" about itself, because it never states its own category membership, competitors, or differentiators in explicit text — assistants synthesizing a "vs" or "alternatives" answer need that framing to exist somewhere retrievable, and companies rarely write it (nobody wants to name competitors on their own site) — this is a genuine, non-obvious tension.

### E. Concrete website signals
Presence/absence of: explicit category self-identification ("X is a [category] tool for..."), comparison or "alternative to" content, structured differentiator statements.

### F. How the signal could be detected automatically
Hybrid: deterministic keyword/structure scan (does homepage/about page contain a category-defining sentence within the first N words of extractable text) + LLM semantic check (does the page ever clearly state what class of product/service it is, in the retrievable text).

### G. What evidence the skill should report
Whether a clear one-sentence category/positioning statement exists in crawlable text, and where.

### H. Severity
Medium — this is a "citation competitiveness" issue, not a "brand invisible entirely" issue.

### I. Remediation
Add explicit, plain-language self-categorization near the top of the homepage/about page ("[Brand] is a [category] that helps [audience] do [outcome]") — this single sentence is disproportionately useful because it's exactly the kind of short, explicit, unambiguous statement the handout's Appendix C says machines extract most reliably.

### J. False positives
Extremely well-known brands (Wikipedia-covered, category-defining themselves) may not need to self-state their category on-page, since third-party corroboration (cross-web consistency, Topic P/H territory) may already supply it — this check should be lower-severity for high-authority/well-corroborated brands.

### K. False negatives
A page might state its category adequately in a way our keyword/LLM check doesn't recognize (e.g., only in an image/logo tagline, or spread across multiple sentences) — LLM semantic pass mitigates but doesn't eliminate this.

### L. Counterexamples
Purely navigational-intent brands (e.g., an internal enterprise tool with no public discovery need) don't need to optimize for "alternatives to X" queries at all — this signal should not fire for site types where the operator doesn't want/need broad AI discovery (e.g., is this even a public-marketing site?). Ties to Topic V.

### M. Generalizes?
Yes — self-categorization is a universal, site-type-agnostic content pattern; only severity weighting is site-type dependent.

### N. Candidate skill
Fold into `ai-answerability` as a specific check ("category/positioning clarity"), not standalone.

### O. Relationship to other skills
Directly upstream of Topic K (AI Answerability) and interacts with Topic F (Entity Resolution — category clarity is part of disambiguating what the entity *is*).

---

## A14 — Retrieval candidate generation

### A. What we need to understand
Lexical (BM25/keyword) vs. semantic (dense/embedding) vs. hybrid retrieval — how candidates are pulled from an index before ranking.

### B. Why it matters
If retrieval is hybrid (lexical + semantic), a page can be recalled two independent ways — meaning it has two independent chances to be discoverable, and weakness in one doesn't guarantee failure. But it also means a website auditor testing only "does this page use the right keywords" (lexical thinking) will miss half the picture.

### C. Current evidence
- **FACT (documented, first-party):** Perplexity's Search API blog explicitly states fine-grained document/passage-level indexing with per-unit scoring — a first-party confirmation of passage-granular retrieval infrastructure.
- **OBSERVATION (third-party technical analysis, consistent across sources):** Multiple independent technical breakdowns (ZipTie.dev, Rankly) describe Perplexity's retrieval as hybrid BM25 + dense embeddings. This is *not* vendor-confirmed at the algorithm-name level, so it's OBSERVATION not FACT — should not be stated in a skill as "Perplexity uses BM25."
- **FACT (general IR/RAG literature):** Hybrid retrieval (combining sparse lexical and dense semantic signals) is the dominant production pattern across the RAG literature broadly (arXiv:2312.10997 survey), independent of any single vendor's specific choice.

### D. Important mechanisms
Because dense/semantic retrieval doesn't require literal keyword match, a website's discoverability is not purely a function of keyword density (classic SEO thinking) — meaning value should shift toward **clear, unambiguous statement of facts** (extractable, literal, unhedged) over keyword-stuffing, which the handout's Appendix C also explicitly supports ("the more explicitly and unambiguously a fact is stated in plain, readable text, the more likely a machine is to extract it correctly").

### E–G. Signals / Detection / Evidence
This mechanism doesn't yield an independently-testable *website* signal beyond what's already captured in A16 (passage retrieval) and A12 (query rewriting) — it's foundational context, not a new check. **Explicitly noting we are not manufacturing a synthetic check here just to have one** — per the brief's instruction not to pad with weak/manufactured findings.

### H–O.
N/A as standalone — see A16, A12.

**Confidence: separating what's usable.** The lexical-vs-semantic distinction is useful conceptual grounding for calibrating severity elsewhere (e.g., don't over-weight exact-keyword-match checks) but does not produce its own detectable signal or skill.

---

## A15 — Reranking

### A. What we need to understand
After candidate retrieval, a reranking stage narrows candidates using relevance/authority/freshness/diversity signals before the generation step even sees them.

### B. Why it matters
This is the stage where "ranked but not cited" happens (A19) — reranking is a second filter *after* recall, and it's where authority/freshness/diversity tradeoffs get made. A page can clear retrieval and still lose here.

### C. Current evidence
- **OBSERVATION (converging across independent technical write-ups):** Multiple sources (ZipTie.dev's Perplexity breakdown, lemniscategrowth's ChatGPT breakdown) independently describe a distinct reranking stage sitting between retrieval and generation, using relevance + reliability/authority + freshness signals. This convergence across independently-written technical analyses (not one single source) raises confidence above a single blog post, but it is still not vendor-confirmed at the mechanism level for any of the four systems — must be labeled OBSERVATION, not FACT.
- **FACT (peer-reviewed, general IR):** Cross-encoder rerankers are a well-established, published IR technique (semantic reranking over a candidate set is standard in modern search/RAG systems generally) — this establishes reranking *as a category of technique that exists and is widely used*, even without vendor-specific confirmation.

### D. Important mechanisms
Reranking trades off relevance vs. authority vs. freshness vs. diversity — meaning a page can be topically perfect but lose to a *more authoritative* or *fresher* competing page, or a reranker enforcing source diversity might *exclude* a page purely because a "good enough" competitor was already selected, independent of quality (see A20, source diversity).

### E. Concrete website signals
Because reranking internals aren't inspectable, we cannot directly detect "did this page get reranked out." What we *can* detect are the **inputs to plausible reranking factors**: page freshness/last-modified signals (Topic I), authority/corroboration signals (Topic H, Harsh's territory), and topical relevance/on-page focus (does the page dilute its core topic with unrelated content, reducing relevance score).

### F. How the signal could be detected automatically
Deterministic: extract `Last-Modified` header / visible dates / schema `dateModified`; measure topical coherence of a page (e.g., ratio of on-topic sentences to total, using simple TF-based topic-consistency or an LLM coherence pass for ambiguous cases).

### G. Evidence output
Freshness signal presence/absence + value; topical-focus score with example of off-topic dilution if found.

### H. Severity
Medium — these are *contributing* factors to a hypothesized reranking disadvantage, not proof of exclusion (we cannot observe exclusion directly — critical honesty point for the report's confidence field).

### I. Remediation
Ensure visible, accurate last-modified dating; keep pages topically focused (split unrelated content onto separate pages) rather than combining unrelated topics.

### J. False positives
A page can be old but still fully accurate/authoritative (age ≠ staleness — must not conflate; ties directly to Topic I's explicit false-positive warning about "one outdated statement = globally stale website").

### K. False negatives
A page can have perfect freshness/focus signals and still lose reranking due to purely relative competitive dynamics (a competitor's page being even better) — something no single-site audit can ever fully detect, since reranking is inherently *comparative*, not absolute. This must be stated plainly in the skill's uncertainty handling.

### L. Counterexamples
Evergreen reference content (e.g., a foundational technical explainer, a historical fact) legitimately has no "freshness" need and shouldn't be penalized for an old modified-date if the content itself doesn't age.

### M. Generalizes?
Yes.

### N. Candidate skill
Fold into **`freshness-corroboration`** (matches handout's own illustrative skill name) for the freshness half; fold topical-focus into a content-extraction/structure skill (Topic E territory).

### O. Relationship to other skills
Directly composes with Topic I (freshness/staleness — deep dive) and Topic H (authority/corroboration — Harsh's).

---

## A16 — Passage retrieval ⭐ (Very high priority, per assignment)

### A. What we need to understand
Retrieval frequently operates at the **passage/chunk level**, not the whole-page level. What determines which specific passage on a page gets retrieved and cited, and what page structures help or hurt this?

### B. Why it matters
This is arguably the single most actionable, generalizable, non-obvious signal in the whole Topic A research area — it converts "is the content good" (vague, subjective) into "is the fact positioned so a chunker/retriever will isolate it cleanly" (structural, deterministic, testable).

### C. Current evidence
- **FACT (first-party, direct):** Perplexity's own engineering blog states their indexing divides documents into **fine-grained sub-document units** individually scored against the query — direct, first-party confirmation that passage-level (not whole-page) retrieval is real infrastructure, not a hypothesis.
- **FACT (peer-reviewed / arXiv, converging across many independent papers):** Chunk size and chunk-boundary quality measurably affect retrieval accuracy in RAG systems. Specific, citable findings:
  - Semantic/boundary-aware chunking is treated as a distinct improvement lever precisely because naive fixed-size chunking risks splitting a coherent fact/argument across a chunk boundary (arXiv 2406.00456 "Mix-of-Granularity"; arXiv 2605.23618 embeddings benchmark paper).
  - A controlled study (arXiv 2407.19794, "Context Window Utilization") finds an optimal chunk size *exists* and both over- and under-sized chunks degrade answer generation — "too small" chunks lack sufficient context, "too large" chunks bury the relevant fact in noise.
  - "Parent Document Retrieval" pattern (cited inside arXiv 2406.00456) — retrieve on a small chunk, but return a larger surrounding block to the generator — is a widely-adopted production pattern precisely *because* isolated small chunks often lack enough context to be usable once retrieved.
  - Industry-standard practical baseline, corroborated across multiple sources (Weaviate engineering blog, Databricks blog): ~256–512 token chunks with 50–100 token overlap is the typical production default — useful as an approximate "typical chunk size" assumption for our detection heuristics (with appropriate caveats that this is a practitioner convention, not a universal constant).
- **FACT (peer-reviewed, directly relevant to *where in a chunk* the fact should sit):** The "Lost in the Middle" effect (Liu et al., original NAACL/TACL-line paper, arXiv 2510.10276 follow-up "emergent property" paper, arXiv 2410.14641, and multiple 2025–2026 follow-ups) is now a well-replicated, multi-paper-confirmed finding: **LLM accuracy at using retrieved information degrades significantly when that information sits in the middle of the provided context, versus the beginning or end** — a U-shaped positional-bias curve, degrading >30% in some measured setups (arXiv/getmaxim.ai summary of the original benchmark's multi-document QA results).

### D. Important mechanisms
Two separate, compounding mechanisms, and this is the key "connected diagnosis" instead of scattered findings (per the brief's root-cause instruction):
1. **Chunk-boundary mechanism:** if a key fact (price, date, spec, claim) is separated from its own supporting context/qualifier by a chunking boundary (e.g., the number "$49" is in one chunk, the word "month" or "per user" is in the next), a chunk-level retriever may retrieve the number without its meaning-defining context, producing either a failed retrieval (the isolated chunk doesn't look relevant enough to the query) or, worse, a **misleading answer** (the assistant states the number without the qualifier).
2. **Position-within-context mechanism (Lost in the Middle):** even if the correct passage IS retrieved and included in the model's context alongside several competing passages, its *position in that context* affects whether the model correctly uses it during generation — this is a generation-stage effect, not a retrieval-stage effect, and it's genuinely outside anything a website author can control directly (we cannot control where the LLM slots our chunk into its context window). **This must be stated honestly as a limitation in the skill's output — we can improve the odds of correct retrieval, we cannot control post-retrieval context ordering.**

### E. Concrete website signals
- Is a fact-bearing sentence self-contained (subject + key qualifier + value in one sentence/short paragraph) or is it split across sentences/elements that a boundary-based chunker would likely separate (e.g., value in a table cell, unit/context in a caption three DOM nodes away; a number in one `<li>`, its meaning in the previous unrelated `<li>`)?
- Are headings semantically matched to the content beneath them (a chunk built from "heading + following paragraph" is a common chunking heuristic — a mismatched or vague heading, e.g. "Details" instead of "Pricing," reduces the odds that heading-based chunking or heading-aware retrieval correctly labels/surfaces that passage for a pricing query)?
- Passage self-containment: can a ~2–4 sentence window around a key fact answer a plausible question about that fact *without* needing content from elsewhere on the page?

### F. How the signal could be detected automatically
Hybrid, deterministic-first:
1. Deterministic: parse DOM/text into heading-delimited sections; for each section, extract sentences containing high-signal fact patterns (currency, dates, numbers with units, named entities via simple regex/NER).
2. Deterministic: check whether the qualifying context for that fact pattern (unit, time period, condition, comparison anchor) appears within the same sentence or same short paragraph/chunk-sized window (e.g., ~2–4 sentences / ~150–300 tokens, using the practitioner-convention chunk size as the audit window — explicitly labeled as an approximation, not a claim about any specific vendor's actual chunk size).
3. Deterministic: check heading-to-content topical match via simple heading-vs-first-sentence keyword overlap; escalate ambiguous cases to a single LLM semantic-coherence call (hybrid approach, per the brief's guidance to use LLM reasoning only where semantic interpretation is genuinely needed).

### G. What evidence the skill should report
- The specific fact-bearing sentence/element flagged.
- What qualifying context is missing from the same local window and where it actually lives on the page (e.g., "price value found in `<td>`, unit found only in a table caption 40 words earlier").
- The synthetic "chunk window" tested and why it fails self-containment.

### H. Possible severity logic
- **High:** the fact is the kind of thing a user would want directly quoted/cited (price, availability, contact/legal facts) AND its meaning-defining qualifier is structurally separated.
- **Medium:** fact is present and locally self-contained but the surrounding heading doesn't match the topic (chunk *findable* but potentially mislabeled by heading-aware retrieval).
- **Low:** minor phrasing/structure issues with non-critical facts.

### I. Correct remediation
Rewrite the fact as a **self-contained sentence** carrying value + qualifier together ("Our Pro plan costs $49 per user per month, billed annually" rather than a bare table row); ensure the heading immediately preceding a fact-bearing block accurately and specifically names that fact's topic. This is a genuinely non-obvious, high-leverage, cheap-to-fix pattern — most teams will check "is there content" but not "is the content chunk-safe."

### J. False-positive cases
- Tables are a *legitimate and common* way to present multi-attribute comparable data (pricing tiers, spec sheets) — flagging "value in a table cell" as inherently bad would be wrong; the check should specifically look for whether the table has proper `<th>`/row-header association (machine-parseable table semantics) before flagging, not treat all tabular data as a defect. A well-marked-up table is not a chunking problem; an unmarked, purely visual/CSS-based grid layout imitating a table is the actual problem.
- Long, well-organized documentation pages with clear heading hierarchies are not automatically "bad chunking" targets just because they're long — long-content-is-bad is explicitly listed as a forbidden assumption in the brief.

### K. False-negative risks
We cannot know any given vendor's actual chunk size/boundary algorithm (not disclosed) — our ~150–300 token audit window is an approximation calibrated from published practitioner defaults, not the real thing; a page could pass our self-containment check on that window and still fail against a real system's different actual chunk boundaries, or vice versa.

### L. Counterexamples
Perplexity's own documented approach (dividing into "fine-grained sub-document units" and scoring them individually) suggests some systems may retrieve at a *finer* grain than our test window assumes, meaning very short, atomic fact statements might actually be *ideal* for some systems and only "too long/diluted" for others — we should test self-containment at more than one window size rather than assuming one universal grain size, and report this as a range rather than a single verdict.

### M. Does this generalize across site types?
Yes, strongly — self-contained fact statements matter identically for e-commerce pricing, SaaS feature specs, university admissions deadlines, or news article key facts. This is one of the most site-type-agnostic signals in the entire research area, and correspondingly high-value.

### N. Candidate skill(s)
**`passage-chunk-quality`** (or fold into `crawl-render-audit` given it composes with A11's raw/rendered extraction — decision point for the entrypoint composition step) — a dedicated skill scanning fact-bearing passages for self-containment and heading-topic alignment.

### O. Relationship to other skills
Directly upstream of Topic E (Content Extraction & Information Architecture — same underlying concern, different framing: E is about page-level structure, A16 is about chunk-level extractability within that structure — likely the *same skill*, and I flag this now to avoid Harsh/Soham accidentally building a duplicate). Also connects to Topic K (AI Answerability — a chunk-safe fact is a directly answerable fact) and Topic B (Citation Mechanics — extractability is a precondition for citation-worthiness).

---

## A17 — Source selection

### A. What we need to understand
Given multiple plausible sources for the same fact, what makes an assistant prefer one over another?

### B. Why it matters
This is the actual "why did the AI cite a competitor/aggregator instead of us" question — the emotionally central question for any brand doing this audit.

### C. Current evidence
- **FACT (peer-reviewed, first controlled experimental study of exactly this question, SIGIR 2026):** "What Gets Cited: Competitive GEO in AI Answer Engines" (Vishwakarma, Kumar, Jamidar — SIGIR '26) ran a **controlled two-document RAG testbed**, injecting exactly two candidate sources differing in exactly one factor at a time, across **six LLMs and 252,000 trials**, with brand-anonymization and counterbalanced source order to isolate content effects from pure position bias. Their headline finding, stated directly in the abstract: **topical relevance and list position are the biggest drivers of being cited first**, across 18 tested content factors. This is genuinely strong, primary, methodologically rigorous evidence — the single best source I found for this whole topic area.
- **FACT (foundational GEO paper, Aggarwal et al. 2024, arXiv 2311.09735):** Established that content features — **adding citations/quotations within the source's own text, adding statistics, authoritative language/phrasing** — measurably increase a source's likelihood of being reflected/quoted in generative-engine answers, with reported 30–40% relative improvement on their visibility metric from these specific interventions, and explicitly noted this effect was **stronger for lower-ranked/smaller sources** — a genuinely important, non-obvious, and directly actionable finding: content-level interventions can partially compensate for lower baseline authority.
- **OBSERVATION (E-GEO / commercial extension paper, arXiv 2511.20867):** Confirms the foundational GEO effect replicates in an e-commerce-specific setting, extending generalizability across site type.

### D. Important mechanisms
Source selection is **relative/competitive**, not absolute — a page isn't "good enough" or "not good enough" in isolation; it wins or loses against whatever else got retrieved for that query. This has a major methodological implication for our audit: **testing a single URL in isolation cannot fully predict citation likelihood** — the strongest audit design tests a brand's page's *content properties* (the things the peer-reviewed literature shows actually move citation odds: topical relevance, explicit statistics/quotes/authoritative statements, position/prominence within the page) rather than pretending we can simulate the full competitive field within a 5-minute single-site crawl.

### E. Concrete website signals
Presence of explicit statistics/numbers, quotable single-sentence claims, direct topical relevance/focus of the specific page to its apparent target query, first-party "authoritative" phrasing (attributed facts, cited data) — matching directly to the peer-reviewed content factors above.

### F. How the signal could be detected automatically
Deterministic: count of quantifiable statements (numbers/stats/dates), presence of directly-quotable single-sentence factual claims (a sentence containing subject+verb+specific-value, no hedging language), topical-relevance-to-heading match (reuse of A16's heading-alignment check).

### G. Evidence output
List of quantifiable/quotable statements found vs. absent for the page's apparent core topic; comparison to the peer-reviewed factor list.

### H. Severity
Medium — these are competitiveness-improving factors, not pass/fail; a page with zero quotable stats is not "broken," it is simply less likely to win a citation contest against a competitor who has them — should be framed as **proactive recommendation**, matching the handout's explicit allowance for "suggested actions beyond detected problems."

### I. Remediation
Add specific, attributable statistics and quotable, unhedged factual sentences near key claims — directly grounded in the highest-quality peer-reviewed finding we have.

### J. False positives
A page whose subject matter genuinely has no natural statistics to cite (e.g., a philosophy/opinion piece, a company values page) shouldn't be penalized for lacking numbers — should scope this check to pages where factual/comparative claims are the evident purpose (product, pricing, spec, FAQ pages), not blanket-applied.

### K. False negatives
We cannot observe the *actual competing field* an assistant retrieved for any real query — we're testing content properties known to correlate with citation odds in controlled experiments, not guaranteeing citation.

### L. Counterexamples
The SIGIR paper explicitly names **list position** as a major driver alongside content, and list position is largely a retrieval/ranking-stage outcome we can't control post-hoc through content edits alone — so content optimization is necessary but not sufficient, and the skill's remediation should say this honestly rather than implying content fixes guarantee citation.

### M. Generalizes?
Yes — the peer-reviewed findings were tested across six different LLMs and (per the E-GEO paper) validated again in a different site-type domain (e-commerce), giving unusually strong cross-model, cross-domain generalization support for this specific area — worth flagging to the team as our highest-confidence finding.

### N. Candidate skill
**`citation-competitiveness`** — checks quotable-statement density, statistic presence, topical relevance-to-heading alignment on key pages. Could be folded into the citation mechanics skill under Topic B rather than duplicated here — flag for Combine phase.

### O. Relationship to other skills
Central hub — connects to Topic B (Citation Mechanics, Pulkit's other area) directly; also connects to A19 (rank vs. citation) and A20 (multi-source construction) below.

---

## A18 — Source substitution

### A. What we need to understand
When an assistant cannot find/use the official website, what does it use instead — and does that reveal a distinct, detectable failure mode?

### B. Why it matters
The brief calls this out explicitly as high-value ("This could reveal major failure modes"). If we can detect *why* a brand's own site would lose to a substitute, we can name the specific root cause rather than a vague "improve SEO."

### C. Current evidence
- **INFERENCE (from A11 + A17 mechanics, not a direct study we found on substitution specifically):** If the official site fails any gate in the retrieve→extract→cite chain (blocked crawl, JS-locked facts, chunk-unsafe fact structure, weak topical relevance/quotability), the *query itself doesn't disappear* — the assistant still needs an answer, so it will select among whatever *does* clear those gates: aggregators, directories, review sites, Wikipedia/Wikidata, news coverage, or even competitor pages that happen to mention the brand. This is a logical inference from the documented pipeline mechanics (A1–A4, A11), not a directly cited study of substitution behavior specifically — **we found no peer-reviewed study measuring this precise substitution phenomenon**, so this section is weaker-evidence than A16/A17 and should be labeled accordingly.
- **HYPOTHESIS (ours):** The specific *type* of substitute source selected is diagnostic of the specific gate that failed — e.g., if a competitor/review-aggregator is cited on *factual* claims (pricing, specs) while the brand's own site is cited on *identity* claims (name, category), this suggests the aggregator specifically has cleaner extractable facts (A16-type failure) even though the brand site is being found/trusted for identity (i.e., not a corroboration/authority problem, a passage-extractability problem) — this is a genuinely novel, falsifiable, and diagnostically useful hypothesis worth validating in Topic R's experiment design.

### D. Important mechanisms
Substitution is not a single failure mode — it's a *symptom* whose root cause could be anywhere upstream (crawl block, render gap, chunk-unsafe structure, weak corroboration/authority per Topic H, or genuine absence of the fact anywhere on-site). Diagnosing *which* substitute type appears for *which* query type is a strong root-cause narrowing technique, which matches the brief's explicit instruction to prefer root causes over symptoms.

### E. Concrete website signals
This one is different from the others — it's not a single-site signal at all, it's a **comparative, live-query signal**, requiring us to actually run test queries against real assistants (ties directly into Topic R, Experiment Design) and observe what's cited when the official site is and isn't the answer.

### F. How the signal could be detected automatically
Not a static crawl check — requires live API calls to search-enabled assistants (where available/permitted) with brand-relevant test queries, then classifying the cited source domain (official / aggregator / review / directory / social / news / Wikipedia / competitor) and cross-referencing which claim type each source was cited for. Must respect API rate limits and cost — bounded query count within the 5-minute runtime budget.

### G. Evidence output
Table: query → cited domain(s) → domain category → claim type cited for. Flag pattern: "brand's own domain not cited in N/M test queries; aggregator X cited instead for [claim type]."

### H. Severity
High if official domain is absent across most/all test queries for core informational queries about the brand itself (a strong invisibility signal); lower if official domain appears for identity queries but loses only on secondary comparative queries.

### I. Remediation
Root-cause-dependent — this signal doesn't fix itself, it *points to* which upstream skill's finding (A11/A16/Topic H) is the actual cause; remediation should defer to whichever upstream check explains the specific substitution pattern observed, not propose a generic "improve visibility" fix.

### J. False-positive cases
For genuinely niche/B2B/enterprise brands, being "substituted" by a legitimate industry directory or analyst report (e.g., Gartner) for a "companies that provide X" query is **expected and appropriate industry behavior**, not a defect — the brief explicitly warns against assuming "no backlink = failure"; the same logic applies here: aggregator citation is not intrinsically bad, especially for comparison-shopping intent where users *want* multi-vendor context.

### K. False-negative risks
A small number of live test queries (bounded by the 5-minute budget and API cost) is a tiny, noisy sample of the true query space — a single run showing no substitution doesn't prove the brand is never substituted, and vice versa; this must be stated as a sampling-limitation in the skill's confidence field, directly matching the brief's own warning: "no citation in one experiment = invisibility" is a forbidden assumption.

### L. Counterexamples
A brand could be legitimately, correctly *not* cited for a query it has no business being an answer to (e.g., testing "best CRM software" against a company that is not a CRM) — query relevance to the brand's actual category must be validated before treating non-citation as a finding at all (ties to A13, category/positioning clarity, and Topic F entity resolution).

### M. Generalizes?
Yes conceptually (the substitution mechanism applies to any site), but the practical *test query set* must be generated per-site based on the site's own apparent category/offerings — this is a dynamic, site-adaptive check, not a fixed checklist, matching the brief's site-type-adaptation research priority.

### N. Candidate skill
**`live-citation-probe`** or similar — a live-query experiment skill, distinct from static crawl-based skills; likely the most expensive/slowest skill in the marketplace in terms of API calls, so its query budget needs careful scoping against the 5-minute runtime limit. This is a design decision for the Combine/Code phase, not resolved here.

### O. Relationship to other skills
This is the skill that *validates* nearly everything else — a great "root cause" diagnosis chain (crawl/render/chunk/corroboration) is only as credible as its ability to predict actual substitution behavior; strong candidate to be the evidence source that *ties the whole report together*, and a natural fit with Topic R (Experiment Design) and Topic Q (Competitive Intelligence).

---

## A19 — Search result position vs. citation probability

### A. What we need to understand
Does ranking highly guarantee citation? Can a lower-ranked page still be cited? Can a highly-ranked page be ignored?

### B. Why it matters
This decouples two things teams will likely conflate: "is this page discoverable/rankable" vs. "is this page citable" — treating them as the same metric would be a methodological error in our own audit design.

### C. Current evidence
- **FACT (direct, from the same SIGIR 2026 controlled study cited in A17):** "list position" is named as one of the two biggest drivers of first-citation in their controlled 252,000-trial study — meaning **position clearly correlates with citation odds**, this is not in dispute.
- **FACT (from the "Think Before Writing" paper, arXiv 2604.19113):** Explicitly frames the paradigm shift: in ranked-list search, exposure ≈ rank position; in generative answer engines, **"citation inclusion rather than rank position determines which sources are surfaced"** — i.e., sources that are not cited receive **effectively zero exposure regardless of relevance or retrieval rank.** This is the clearest, most explicit, first-party-equivalent (peer-reviewed) statement that rank and citation are **decoupled, not equivalent** — a page can theoretically retrieve/rank acceptably and still receive zero user-facing exposure if it isn't among the small cited subset.
- **INFERENCE:** Combining these two facts: position *within the retrieved/reranked candidate set* strongly influences citation odds (A17/A19 first point), but **being retrieved/ranked at all is not the same as being cited** — a page can clear every retrieval gate and still lose entirely at the final citation-selection step, which is a *separate, additional* filter, not a formality.

### D. Important mechanisms
This confirms a **minimum three-gate model**, not the simpler two-gate (crawl→extract) model from the handout's appendix alone: **(1) retrievable at all → (2) ranked competitively within the retrieved set → (3) selected for citation among the ranked survivors.** Each gate can independently fail. Our audit report's severity/confidence language should reflect which gate(s) we have actual evidence for vs. which we can only infer.

### E–G. Signals / Detection / Evidence
No new standalone signal beyond what A16/A17 already capture — this section's primary value is **methodological**: it justifies structuring the audit's live-query evidence (A18) around actual citation presence/absence, not proxy signals like a domain's general search ranking, because the literature explicitly shows the two can diverge.

### H–L.
Not applicable as a standalone check — this is a meta-finding about audit design, not a new check.

### M. Generalizes?
Yes — this three-gate framing generalizes to any site and should inform how the entrypoint report frames confidence per finding (which gate does this evidence actually speak to).

### N. Candidate skill
None standalone — this informs the **entrypoint orchestrator's** report schema/severity logic (Topic S, Soham's territory) more than it produces a new detection skill. Important cross-team note.

### O. Relationship to other skills
Directly informs how findings from A11 (retrieval gate), A15/A17 (ranking/selection gate), and A18 (citation gate) should be labeled with which specific gate they provide evidence for — prevents the report from implying more certainty than the evidence supports.

---

## A20 — Multi-source answer construction

### A. What we need to understand
How do assistants merge multiple sources, handle conflicting facts, and decide when sources corroborate vs. disagree?

### B. Why it matters
This is the direct mechanism behind "why is my brand's info wrong/outdated in an AI answer" — misrepresentation risk (a Soham/AH topic) has its root cause partly here: if multiple sources disagree, the model has to pick or blend, and stale/inconsistent web presence increases the odds of a wrong blend.

### C. Current evidence
- **FACT (handout's own Appendix D, explicitly given to us as background):** "Machines tend to treat a fact as more trustworthy when many independent places say the same thing... A claim that lives in only one spot is fragile." This is stated as established background in the Round 2 appendix, i.e., treat this as a **given FACT-tier assumption for this hackathon**, not something we need to re-derive.
- **OBSERVATION (converging from the source-selection literature, A17):** The GEO literature frames citation as picking from *retrieved candidates that already survived relevance filtering* — conflicting-fact resolution mechanics specifically (e.g., does the model average, pick-the-majority, or pick-the-most-recent) are not directly documented by any vendor and not covered by the papers I found in this search pass — this is a genuine gap. **Flagging this explicitly as an area needing more research**, likely overlapping with Harsh's Topic H (Trust/Authority/Corroboration) and Topic P (Cross-Web Consistency), which are better positioned to own the conflicting-fact-resolution question since they're specifically about cross-source agreement.

### D–L.
Given the evidence gap and the clear ownership overlap with Harsh's Topic H/P, I'm **not** duplicating detailed signal/detection/severity design here — recommend this become primarily Harsh's deliverable, with Pulkit's Topic A contributing only the retrieval-mechanics framing above (i.e., "why would an assistant even be holding multiple conflicting sources simultaneously" — answer: because multi-query retrieval (A12) and hybrid hybrid hybrid recall (A14) commonly surface several pages about the same entity, so conflict-handling is a near-certain occurrence for any moderately-covered brand, not an edge case).

### M–O.
Generalizes broadly; relationship is primarily a **handoff to Harsh's H/P**, explicitly noted here to avoid duplicate research effort per the Combine & Code phase.

---

## A21 — Search freshness

*(Deep-dive ownership is Topic I — "Freshness, Staleness & Temporal Consistency" — also mine. I'm keeping A21 minimal here and will do the full research pass under Topic I to avoid splitting one investigation across two documents.)*

### A–C. Quick anchor evidence
- **FACT:** Gemini's dynamic retrieval threshold and general RAG grounding docs confirm systems can and do decide *whether* to even invoke search based on a recency/benefit prediction — meaning "does this need fresh info" is itself a documented, explicit decision gate in at least one system.
- **INFERENCE:** If a system decides *not* to search because it estimates the model's parametric memory is sufficient, a brand's very-recent changes (new pricing, new leadership, new product) may not be reflected even if the website is perfectly optimized — this is a **generation-stage/policy-stage limitation outside the website's control**, an important honesty point for our report.

Full A21 treatment deferred to the Topic I document to avoid duplication.

---

## A22 — Domain-level vs. page-level signals

### A. What we need to understand
Does the system trust a *domain* as a whole (domain-level reputation propagating to all its pages), or does each page compete independently regardless of domain?

### B. Why it matters
This determines whether our audit should test a **sample of representative pages** (page-level thinking) or focus heavily on **domain-wide signals** (a few domain properties that lift every page) — directly relevant to Topic AE (Crawling Strategy) and Topic AG (Site Graph), also mine.

### C. Current evidence
- **OBSERVATION (general SEO/IR convention, not LLM-specific):** Classic search engines are understood to use both domain-level authority signals and page-level relevance signals in combination — this is long-established web-search convention (not a new LLM-era finding) and none of the sources I pulled in this search pass make an LLM-specific, vendor-documented claim distinguishing domain- vs. page-level weighting for AI assistants specifically.
- **INFERENCE:** Because retrieval indexes are built on crawled *pages* (A1–A4's documented pipelines all describe fetching/reading pages, not "the domain" as an atomic unit), retrieval/candidate-generation is likely page-level at the mechanical level, while any authority/trust weighting applied during reranking (A15) could reasonably incorporate domain-level signals (this is INFERENCE, stacking on the reranking-uses-authority-signals OBSERVATION from A15) — **we do not have direct evidence either way and should not claim certainty in the skill's confidence field.**

### D. Important mechanisms
Practical implication regardless of the unresolved question: a **template-level defect** (a broken pattern repeated across every product/blog/doc page because they share a template) is page-level in mechanism but domain-wide in *impact* — this reframes "domain vs. page" into something we *can* act on: **template-level, site-wide analysis** (explicitly named in our research priorities and directly = Soham's Topic AF, Website Template/Pattern Detection).

### E. Concrete website signals
Whether a defect found on one page (e.g., JS-locked pricing, chunk-unsafe fact structure) recurs identically across a sample of same-template pages (product pages, blog posts) — if yes, the finding should be reported once as a **site-wide/template-level finding**, not once per page, directly matching the brief's request for "template-level/site-wide analysis" and avoiding a report that's just "a big SEO checklist" repeated N times.

### F. How the signal could be detected automatically
Deterministic: cluster crawled pages by DOM structural similarity/template fingerprint (e.g., simplified DOM tag-path signature), run A11/A16-type checks on 1–2 representative pages per cluster instead of every page, and extrapolate the finding to the full cluster with a stated confidence/sample size — this is also the mechanism that makes crawling feasible under the 5-minute runtime budget (Topic AE).

### G. Evidence output
"Found on N/M sampled pages within template cluster X (e.g., all /products/* pages); extrapolated to ~K total pages of this type based on sitemap/site structure."

### H. Severity
Should be **amplified**, not treated per-page, when a defect is template-wide — a JS-locked pricing pattern repeated across 200 product pages is a much bigger problem than an isolated one-page issue, and severity scoring should reflect estimated blast radius.

### I. Remediation
Fix at the template/component level (a single shared component fix propagates to all instances) — genuinely more actionable than page-by-page fixes, and should be called out explicitly in the report as higher-leverage.

### J. False positives
Not every structurally-similar page is the same template with the same defect — some pages may share layout but differ meaningfully in content quality/completeness; sampling must actually verify the specific defect on more than one representative before claiming "site-wide," not just assume identical templates behave identically.

### K. False negatives
Small deliberate per-page differences (a page that manually fixed the issue but wasn't updated in the shared template) would be missed by cluster-level extrapolation from too few samples — sample size/confidence should scale with cluster size within the time budget.

### L. Counterexamples
A large site's product pages might look template-similar in DOM structure but vary hugely in actual JS-dependency (e.g., some product pages load a heavy interactive 3D viewer, others don't) — DOM-shape similarity is a proxy for template similarity, not a guarantee, and should be validated with 2+ samples rather than 1.

### M. Generalizes?
Yes — extremely well-generalizing; this is essential infrastructure for making the whole marketplace runtime-feasible on large sites (e-commerce catalogs, docs sites with thousands of pages) within 5 minutes, regardless of site type.

### N. Candidate skill
This is core infrastructure, not a single findable "defect" skill — likely belongs inside the crawling/sampling logic used by whichever skill(s) do page-level analysis (shared utility across A11/A16 skills), or as its own lightweight **`template-clustering`** pre-pass that other skills call. Strong overlap with Soham's Topic AF (Website Template/Pattern Detection) — **should be co-designed with Soham, not built twice.**

### O. Relationship to other skills
Cross-cutting infrastructure for nearly every other skill in the marketplace; also the direct mechanism that makes Topic AE (Crawling Strategy, mine) and Topic AG (Site Graph, mine) actionable.

---

## 2. Findings register (structured, per the required format)

---
**FINDING ID:** A-01
**Researcher:** Pulkit
**Research Area:** A — AI Discovery Mechanics
**Research Question:** A11 — Does the documented retrieve→generate separation match the handout's own three-gate model, and can it be used as the marketplace's core diagnostic frame?
**Observation:** All four vendor documentation sets (OpenAI, Google, Anthropic, Perplexity) independently describe the same sequential shape: decide-to-search → query → retrieve → rank/filter → generate → cite.
**Evidence:** OpenAI Help Center; ai.google.dev/gemini-api/docs/google-search; claude.com/blog/web-search-api; perplexity.ai/hub/blog/introducing-the-perplexity-search-api; academic RAG survey arXiv:2312.10997.
**Sources:** See A11 section C.
**Pattern:** Retrieval is a discrete, separable, necessary-but-not-sufficient precondition for a page influencing any answer.
**Counterexamples:** Agentic/iterative modes (OpenAI reasoning search, Claude agentic refinement, Perplexity Deep Research) loop retrieval and reasoning rather than strictly one-shot sequencing.
**Hypothesis:** A raw-HTML vs. rendered-DOM diff, restricted to fact-bearing content, is a valid, generalizable proxy for retrieval-stage extractability risk.
**Signal:** % of fact-bearing content present in raw HTML vs. only in rendered DOM.
**How to Detect:** Deterministic dual fetch (HTTP GET vs. headless render) + content diff.
**Evidence Output:** List of facts present only post-render, with % delta.
**False Positives:** Interactive/decorative JS content unrelated to factual claims; content correctly server-rendered by frameworks with SSR.
**False Negatives:** Passes this check but still fails via robots.txt block, noindex, or orphaned URL (needs Topic C composition).
**Severity:** Critical (core identity/offer facts JS-locked) to Low (decorative only).
**Recommended Fix:** SSR/static-generate pages carrying fact content.
**Generalization:** High — technique is site-type and vendor agnostic.
**Candidate Skill:** `crawl-render-audit`
**Related Skills:** Topic C (Crawlability), Topic D (Rendering) — same causal chain.
**Confidence:** HIGH

---
**FINDING ID:** A-02
**Researcher:** Pulkit
**Research Area:** A — AI Discovery Mechanics
**Research Question:** A16 — Does passage/chunk structure measurably affect whether a fact is retrievable and correctly interpreted?
**Observation:** Multiple independent peer-reviewed/arXiv papers converge: chunk size and chunk-boundary placement measurably affect RAG retrieval accuracy; a separate, independently replicated line of research (Lost in the Middle) shows LLM accuracy on retrieved information also depends on its position within the assembled context.
**Evidence:** arXiv 2406.00456, 2407.19794, 2605.23618 (chunking); arXiv 2510.10276, 2410.14641, and original Liu et al. finding (position bias); Perplexity's own engineering blog confirms fine-grained passage-level indexing as real production infrastructure.
**Sources:** See A16 section C.
**Pattern:** A fact separated from its own meaning-defining qualifier by a likely chunk boundary is at elevated risk of failed or misleading retrieval, independent of whether the fact exists on the page at all.
**Counterexamples:** Well-marked-up tables (`<th>`-associated) are a legitimate, non-defective way to present multi-attribute data and should not be penalized; very short atomic statements may be *ideal* for systems doing finer-grained sub-document indexing (per Perplexity's documented approach), so a single "ideal chunk size" assumption is itself a risk of false positives.
**Hypothesis:** Rewriting a fact as a single self-contained sentence (value + qualifier together) measurably improves the odds it survives a chunk-boundary split intact, across differently-configured chunkers.
**Signal:** Self-containment of fact + qualifier within a ~150–300 token local window; heading-to-content topical match.
**How to Detect:** Deterministic sentence/window parsing + fact-pattern regex/NER, escalate ambiguous heading-matches to a single LLM coherence check.
**Evidence Output:** Flagged fact, missing qualifier, location of qualifier elsewhere on page, chunk window tested.
**False Positives:** Properly marked-up tables; long well-structured docs pages (length alone is not a defect).
**False Negatives:** Real chunk boundaries of any specific vendor are undisclosed; our window is an approximation from published practitioner conventions (~256–512 token defaults), not a guaranteed match to any real system.
**Severity:** High for core transactional facts (price, availability, legal/contact); Medium/Low otherwise.
**Recommended Fix:** Rewrite key facts as self-contained sentences; align headings precisely to the content beneath them.
**Generalization:** Very high — one of the most site-type-agnostic findings in the whole research area.
**Candidate Skill:** `passage-chunk-quality` (or merged into content-extraction skill — Topic E overlap).
**Related Skills:** Topic E (Content Extraction & IA), Topic K (AI Answerability), Topic B (Citation Mechanics).
**Confidence:** HIGH (chunking effect on retrieval; position-bias effect on generation) / MEDIUM (our specific detection window's precision, since real vendor chunk configs are undisclosed).

---
**FINDING ID:** A-03
**Researcher:** Pulkit
**Research Area:** A — AI Discovery Mechanics
**Research Question:** A17/A19 — What actually predicts which of several plausible sources gets cited, and is rank the same thing as citation?
**Observation:** A controlled, peer-reviewed 252,000-trial experiment (SIGIR 2026) isolating single content factors found topical relevance and list position are the strongest predictors of being cited first among competing sources; a separate peer-reviewed paper explicitly states that in generative answer engines, citation-inclusion — not rank — determines real user-facing exposure, and non-cited sources get effectively zero exposure regardless of rank.
**Evidence:** arXiv 2605.25517 ("What Gets Cited," SIGIR '26); arXiv 2604.19113 ("Think Before Writing"); foundational GEO paper arXiv 2311.09735 (Aggarwal et al.) showing statistics/quotations/authoritative phrasing improve citation likelihood by 30–40% on their metric, with larger relative gains for lower-ranked sources.
**Sources:** See A17/A19 sections C.
**Pattern:** Retrieval, ranking, and citation-selection are three separable gates; a page can clear the first two and still fail the third. Content-level interventions (explicit stats, quotable unhedged claims, topical focus) measurably shift competitive citation odds, more so for lower-authority sources.
**Counterexamples:** List position — a major driver per the same study — is largely outside direct content-editing control; content optimization is necessary but not sufficient for winning citation.
**Hypothesis:** A page with more explicit, quotable, statistic-bearing statements on a given topic is more likely to be selected for citation when competing with a source of similar topical relevance.
**Signal:** Density of quantifiable/quotable, unhedged factual statements per key topic/page; topical-relevance-to-heading alignment.
**How to Detect:** Deterministic statement/statistic extraction + topical relevance scoring, scoped to pages whose evident purpose is factual/comparative (product, pricing, spec, FAQ).
**Evidence Output:** Count and examples of quotable/quantifiable statements found vs. absent for the page's apparent core claims.
**False Positives:** Pages with no natural quantifiable content (values/opinion pages) shouldn't be penalized for lacking stats.
**False Negatives:** Cannot observe the real competing candidate set for any live query; this is a correlational content-quality proxy, not a citation guarantee.
**Severity:** Medium, framed primarily as a proactive/competitiveness recommendation rather than a hard defect.
**Recommended Fix:** Add specific attributable statistics and clear, unhedged, quotable factual sentences near key claims on factual/comparative pages.
**Generalization:** Very high — validated across six different LLMs in the primary study and replicated in an e-commerce-specific follow-up (E-GEO), i.e., cross-model and cross-domain support.
**Candidate Skill:** `citation-competitiveness` (fold into Topic B — Citation Mechanics — skill).
**Related Skills:** Topic B (Citation Mechanics), A18 (Source Substitution), A20 (Multi-source Construction).
**Confidence:** HIGH — this is our strongest evidence base in the entire Topic A investigation.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
The retrieve → rank → cite pipeline is a **three-gate, not two-gate, model** (retrievable → competitively ranked → selected-for-citation), and the third gate is *decoupled* from the first two — a page can be perfectly crawlable, renderable, and well-ranked and still receive zero citation exposure. This is directly supported by a peer-reviewed, controlled, 252,000-trial study (SIGIR 2026) plus a second independent peer-reviewed paper making the "citation ≠ rank" claim explicitly. This should reshape the entire marketplace's mental model away from "improve SEO ranking" toward "improve odds of being the selected citation among competitors," and should be treated as load-bearing, high-confidence infrastructure for the whole project, not just Topic A.

**Strongest unvalidated hypothesis:**
A18's substitution-type-diagnoses-root-cause hypothesis: the *category* of substitute source cited (aggregator vs. review site vs. Wikipedia vs. competitor) for a *specific claim type* (identity vs. pricing vs. specs) is diagnostic of which specific upstream gate failed for the brand's own site. This is genuinely novel, mechanism-sound, and directly useful for root-cause narrowing — but we found no existing study measuring it; it needs to be tested experimentally (Topic R) before being trusted as a detection heuristic.

**Strongest candidate skill:**
`passage-chunk-quality` (A16) — highest combination of: strong peer-reviewed grounding (two independent, converging bodies of literature: chunking mechanics and lost-in-the-middle position bias), deterministic detectability, very high generalization across site types, cheap/clear remediation, and genuine non-obviousness (most teams will check "is the fact present," not "is the fact structurally safe from a chunk boundary split").

**Weakest assumption we should investigate next:**
Our assumed "audit chunk window" (~150–300 tokens, derived from published practitioner defaults of ~256–512 tokens with 50–100 token overlap) is a convenience approximation, not a confirmed match to any real vendor's actual chunking configuration — none of the four assistants disclose their real chunk size. Before finalizing `passage-chunk-quality`'s detection thresholds, we should (a) test the check at multiple window sizes and report a range rather than a single verdict, and (b) treat Perplexity's confirmed "fine-grained sub-document units" language as a signal that at least one major system may chunk *finer* than the common practitioner default, meaning our thresholds may currently be biased toward too-large a window.

---

## 4. Cross-references for the Combine & Code phase (flags for Harsh/Soham)

- **A16 ↔ Topic E (Harsh is not E — E is Pulkit's own Topic, confirmed in distribution sheet):** A16 and Topic E are very likely the *same skill* under two names — resolve during my own topic E write-up, not a cross-person conflict.
- **A18/A19/A20 ↔ Topic H, Topic P (Harsh):** Conflicting-fact resolution and cross-web-consistency ownership should sit primarily with Harsh's Topic H/P; Topic A contributes only the "why would conflicting sources even be simultaneously retrieved" mechanism.
- **A22 ↔ Topic AF (Soham, Website Template/Pattern Detection):** Template-clustering as shared crawl infrastructure should be co-designed once, not built independently by both of us — flagging now, before Combine phase, per the brief's decomposition-quality rubric criterion.
- **A19 ↔ Topic S (Soham, Scoring & Severity):** The three-gate model should directly inform how confidence/severity is expressed per finding in the report schema — recommend the entrypoint's finding schema include a "which gate does this evidence speak to" field.
