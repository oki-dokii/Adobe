# 🧠 Brand AI Readiness Diagnostic — docs.python.org

```
  Site         : https://docs.python.org/3/
  Audit ID     : python-docs-audit-run
  Generated    : 2026-09-13T04:59:58.761Z
  Engine       : Brand AI Readiness Engine v1 (llm_calls=0, deterministic)
  Methodology  : Dual-Fetch Static + Hydrated DOM Analysis
  Standards    : RFC 9309 · Schema.org · robots.txt
```

> **Read-Only Non-Invasive Audit.** All evaluations performed via standard HTTP GET/HEAD with zero mutation.


---


## 1. 📊 Executive Summary

| Metric | Value |
|---|---|
| **AI Readiness Index** | **87 / 100** (Grade **A−**) |
| **Overall Verdict** | **AI-ready** |
| **Defect Register** | 0 Critical · 1 High · 0 Medium · 1 Low |
| **Total Findings** | 2 actionable findings |
| **Inspection Boundaries** | 0 audit-scope limitations |
| **Pages Crawled** | 40 |
| **Pages Rendered (JS)** | 10 |
| **HTTP Requests** | 42 |
| **Templates Identified** | 19 |
| **Robots.txt Status** | ok |
| **Total Wall-Clock** | 10.07s |

**Strategic Assessment:**

> "Closed-book: site does not answer K6 (What does it cost / how is it priced?)" represents the primary citation barrier in Understanding (79/100). Resolving this is the highest leverage action to ensure automated AI engines cite and surface this domain accurately.

**AI Readiness Score:**
```
█████████████████░░░ 87/100 (A−)
```


---


## 2. 🎯 Top 3 Priority Actions (Ranked by Business Exposure)

> Ranked by business-exposure risk (funnel stage criticality and crawl reach) — not discovery order.


### 1. 🟡 [MEDIUM] Publish direct answers for 1 core buyer questions (K3)

- **Recommended Fix:** Add visible, extractable answers on intent-matched canonical landing pages — Deploy concise declarative sentences answering K3 to prevent conversational AI inquiry abandonment.
- **Exposure Drivers:** Low (Awareness) Funnel · Broad Query Reach (K3)
- **Business Consequence:** Prospective buyers querying AI assistants cannot qualify your offering, pricing, or contact path, leading assistants to redirect traffic to competitors.
- **Estimated Effort:** `LOW`


---


## 3. 📈 Corpus Benchmark (38-Site Empirical Distribution)

| Position | Score | Status |
|---|---|---|
| **This Brand** | 87 / 100 | Grade A− |
| Corpus Median | 67 / 100 | ✅ Above median (+20 pts) |
| Top Quartile (75th percentile) | 82 / 100 | 🏆 Citation Leader |
| Corpus Best | 91 / 100 | Reference Benchmark |


---


## 4. 🔬 Causal Dimension Breakdown

| Dimension | Score | Visual | Status | Description |
|---|---|---|---|---|
| **Discoverability** | 90/100 | `███████████░` | ✅ STRONG | Can automated systems reach and read the site at all? |
| **Understanding** | 79/100 | `█████████░░░` | ✅ STRONG | Can machines parse what the brand is and what it offers? |
| **Trust** | 90/100 | `███████████░` | ✅ STRONG | Is the information consistent, corroborated and current? |
| **Engagement** | 90/100 | `███████████░` | ✅ STRONG | Can an AI hand a user off to the right next action? |


---


## 5. 💔 Lost-Point Inventory (Score Decomposition)

Total Deductions: **−13 points**

| Severity | Deduction | Finding | Dimension |
|---|---|---|---|
| 🟢 LOW | −2 pts | Closed-book: site does not answer K3 (What does this organization offer or do?) | Understanding |
| 🟠 HIGH | −8 pts | Closed-book: site does not answer K6 (What does it cost / how is it priced?) | Understanding |


---


## 6. 🔗 Systemic Root Causes & Downstream AI Impact


### 🟢 AI Answerability [LOW]

- **Structural Origin:** Closed-book: site does not answer K3 (What does this organization offer or do?)
- **Propagated Finding Count:** 2
- **Finding IDs:** `F-001, F-002`



---


## 7. 🔍 Actionable Findings — Full Detail

> Each finding below mirrors exactly what is shown in the audit dialog. Every field is derived from the live crawl — no fabrication.

### 🟠 [HIGH] 1 of 4 Core Buyer Questions Unanswered Anywhere on Site

| Field | Value |
|---|---|
| **Finding ID** | `F-BUYER-SCORECARD` |
| **Severity** | 🟠 HIGH (Business Exposure: Consideration Stage) |
| **Confidence** | HIGH |
| **Skill** | AI Answerability Audit (`ai-answerability-audit`) |
| **Dimension** | AI Understanding |
| **Questions Unanswered** | 1 of 4 applicable buyer questions |
| **Pages Sampled** | 40 |

**📋 Buyer-Question Coverage Scorecard:**

| # | Question | Funnel Stage | Answered? | Where (if yes) / Business Note |
|---|---|---|---|---|
| **K3** | What does this organization offer or do? | `AWARENESS` | ❌ No | ❌ Unanswered anywhere in crawled corpus |
| **K4** | Who is the intended audience? | `CONSIDERATION` | ✅ Yes | ✅ Confirmed answered on intent-matched canonical page |
| **K5** | Where is this organization based or serving? | `CONSIDERATION` | ✅ Yes | ✅ Confirmed answered on intent-matched canonical page |
| **K6** | What does it cost / how is it priced? | `DECISION` | ⚪ N/A | N/A — Classified as non-commercial reference/informational corpus (Cluster DOCS; pricing not applicable) |
| **K13** | How can a human contact the organization? | `DECISION` | ✅ Yes | ✅ Confirmed answered on intent-matched canonical page |

**📋 Technical Observation:**

> Crawled corpus contains zero extractable declarative answers for 1 core buyer questions (K3).

**❓ Why This Matters for AI Systems:**

> When an AI assistant attempts to answer direct user questions regarding these attributes, retrieval-augmented generation (RAG) pipelines fail closed or hallucinate answers from secondary third-party sources.

**💼 Business Impact:**

> Anyone using an AI assistant to evaluate your product or research pricing before buying cannot get answers sourced from your own site — they will either abandon the inquiry or receive outdated third-party numbers.

**💥 Blast Radius:**

> Confirmed site-wide completeness barrier across 1 core buyer questions; impacts 100% of conversational search queries touching these funnel stages.

**✅ Recommended Action:**

| Field | Value |
|---|---|
| **Action** | Publish direct, extractable declarative answers for all unanswered buyer questions |
| **Detail** | Add visible, machine-readable sentences answering K3 (What does this organization offer or do?) on intent-matched canonical landing pages. |
| **Priority** | HIGH |
| **Effort** | LOW |

**⛓ Causal Consequence Chain:**

1. High-intent prospective buyers query AI assistants for pricing, audience suitability, or procurement specifications.
2. AI knowledge retrieval pipelines scan crawled pages and encounter complete factual voids across core buyer questions.
3. Assistants recommend accessible competitors with clear specifications or advise prospects that information is unavailable.

<details>
<summary>📋 JIRA Ticket</summary>

```
Title: [AI-READINESS][HIGH] Resolve 1 Unanswered Core Buyer Questions
Labels: ai-readiness, ai-answerability-audit, high
Priority: Medium

Problem: Site fails to answer 1 core buyer questions in public extractable HTML.
Why It Matters: AI assistants fail closed or substitute competitors on high-intent commercial queries.
Acceptance Criteria: Add visible declarative answers for K3 on canonical pages.
Skill: AI Answerability Audit | Dimension: AI Understanding | Finding ID: F-BUYER-SCORECARD
```

</details>

---

> ℹ️ **How Severity is Calculated:** Business-Exposure Severity is derived from an ordinal matrix combining **Funnel Priority** (High: Decision-stage e.g. pricing, purchasing, contact; Medium: Consideration-stage e.g. audience, geography, specifications; Low: Awareness-stage e.g. discovery, crawl access, identity) and **Reach Tier** (Broad: ≥50% pages affected or global directive; Cluster: 10–49% pages affected; Isolated: <10% pages affected). Broad Decision issues evaluate to CRITICAL; Isolated Decision / Broad Consideration evaluate to HIGH; Isolated Consideration / Broad Awareness evaluate to MEDIUM; Isolated Awareness evaluates to LOW.


## 8. 🧠 AI Perception Console — Simulated Assistant Grounding

> **DISCLAIMER:** Simulated extract-grounded perception. NOT a live citation scrape. Deterministic analysis of first-party HTML extractability.


### Interrogation Question: "What do they offer?"

| Field | Value |
|---|---|
| **Simulated Status** | `GROUNDED` |
| **Grounding Confidence** | `MEDIUM` |
| **Fallback Used** | Yes — local deterministic extraction fallback |
| **Stale** | No |
| **Skipped Skills** | None |

**🗣 Assistant Synthesized Answer:**

> "Extractable first-party statements are sufficient to describe what docs.python.org offers, without quoting a price that is missing from the initial HTML."

**📍 Sentence Attribution & Evidence Receipts (Trace Spans):**

> Each row shows which sentence is grounded in evidence, which skills produced it, and which findings it implicates.

| Clause | Grounding | Skills | Finding IDs |
|---|---|---|---|
| "Extractable first-party statements are sufficient to describe what docs.python.o…" | ✅ `supported` | `ai-answerability-audit` | `F-001, F-002` |


---


### 🧩 Brand Working Memory (6-Cell Extraction Register)

> These 6 cells represent the factual profile a language model builds about your brand. Empty cells = real extraction failures.

| Cell | State | Extracted Value | Source | Skills |
|---|---|---|---|---|
| **IDENTITY** | ✅ FILLED | docs.python.org | `🟢 EVIDENCE` | `entity-identity-audit` |
| **CATEGORY** | ✅ FILLED | Developer Infrastructure & Documentation | `🟡 INFERRED` | `site-type-classifier` |
| **OFFER** | ✅ FILLED | Extractable first-party statements verified in DOM | `🟢 EVIDENCE` | `citation-extractability-audit, render-extract-audit` |
| **PROOF** | ✅ FILLED | On-site claims are internally consistent | `🟢 EVIDENCE` | `corroboration-consistency-audit` |
| **ACTION** | ✅ FILLED | Machine-legible handoff action present | `🟢 EVIDENCE` | `engagement-handoff-audit` |
| **RECENCY** | ✅ FILLED | Temporal recency signals verified | `🟢 EVIDENCE` | `freshness-audit` |

**Missing Facts (unresolvable gaps from audit):**
- Closed-book: site does not answer K6 (What does it cost / how is it priced?)


---


### 🌐 Recommendation Gravity Analysis

| Field | Value |
|---|---|
| **Gravity Class** | `NAMED` |
| **Classification** | **NAMED** |
| **Assessment** | A machine-legible offer and next action exist. An AI assistant can reference this brand specifically. |
| **Contributing Skills** | `engagement-handoff-audit, ai-answerability-audit, citation-extractability-audit` |
| **Gravity Score** | 82/100 |


---


### 🩺 AI Perception MRI Vitals

> Composite health indicators derived from all skill outputs.

| Vital | Value | Visual |
|---|---|---|
| **Retrieval Fidelity** | 96/100 | `██████████████░` |
| **Grounding Integrity** | 77/100 | `████████████░░░` |
| **Hallucination Risk** | 8/100 | `██████████████░` |


---


## 9. ⚙️ Skill Marketplace Composition

| # | Skill | ID | Dimension | Status | Skipped | Pages Inspected | Confidence |
|---|---|---|---|---|---|---|---|
| 1 | **Site Type Classifier** | `Site Type` | `UNDERSTANDING` | ⏳ `DORMANT` | — | 0 | — |
| 2 | **Crawl Access** | `Crawl Access` | `DISCOVERABILITY` | ⏳ `DORMANT` | — | 0 | — |
| 3 | **Render & Extract** | `Render & Extract` | `DISCOVERABILITY` | ⏳ `DORMANT` | — | 0 | — |
| 4 | **Entity Identity** | `Entity Identity` | `UNDERSTANDING` | ⏳ `DORMANT` | — | 0 | — |
| 5 | **Citation Extractability** | `Citation Extractability` | `TRUST` | ⏳ `DORMANT` | — | 0 | — |
| 6 | **AI Answerability** | `AI Answerability` | `UNDERSTANDING` | ⏳ `DORMANT` | — | 0 | — |
| 7 | **Freshness** | `Freshness` | `TRUST` | ⏳ `DORMANT` | — | 0 | — |
| 8 | **Corroboration** | `Corroboration` | `TRUST` | ⏳ `DORMANT` | — | 0 | — |
| 9 | **Engagement Handoff** | `Engagement Handoff` | `ENGAGEMENT` | ⏳ `DORMANT` | — | 0 | — |
| 10 | **Audit Orchestrator** | `orch` | `COORDINATION` | ✅ `COMPLETED` | — | — | — |


### Skill Internal Check Results


**Site Type Classifier:**
- ⏳ Template detection
- ⏳ Content taxonomy
- ⏳ Commerce signals
- ⏳ Locale detection

**Crawl Access:**
- ⏳ robots.txt
- ⏳ Status codes
- ⏳ Challenge responses
- ⏳ Sitemap coverage

**Render & Extract:**
- ⏳ Server-rendered content
- ⏳ Client-only content
- ⏳ DOM stability
- ⏳ Main content ratio

**Entity Identity:**
- ⏳ Organization identity
- ⏳ Brand aliases
- ⏳ Entity ambiguity
- ⏳ Cross-source consistency

**Citation Extractability:**
- ⏳ Self-contained facts
- ⏳ Structured data
- ⏳ Attributable claims
- ⏳ Stable anchors

**AI Answerability:**
- ⏳ Question coverage
- ⏳ Answer grounding
- ⏳ Confidence margin
- ⏳ Source substitution risk

**Freshness:**
- ⏳ Published dates
- ⏳ Modified signals
- ⏳ Stale claims
- ⏳ Update cadence

**Corroboration:**
- ⏳ Internal consistency
- ⏳ Third-party agreement
- ⏳ Content provenance credentials
- ⏳ Canonical source

**Engagement Handoff:**
- ⏳ Primary actions
- ⏳ Action legibility
- ⏳ Contact paths
- ⏳ Conversion clarity


---


## 10. 📡 Coverage & Timing Telemetry

**Crawl Coverage:**

| Metric | Value |
|---|---|
| Pages Fetched | 40 |
| Pages Rendered (JS) | 10 |
| Render Count | 10 |
| Templates Identified | 19 |
| HTTP Requests | 42 |
| Robots.txt Status | ok |
| Crawl Stopped Reason | early_stop |
| Skipped Skill Count | 0 |
| Scope Limitations | 0 |

**Execution Timing:**

| Phase | Duration |
|---|---|
| Total Wall-Clock | 10.07s |
| Crawl Phase | 8.57s |
| Render Phase | 0.03s |

| Skill | Duration |
|---|---|
| Site Type Classifier | 0.00s |
| Crawl Access | 0.00s |
| Render & Extract | 0.76s |
| Citation Extractability | 0.00s |
| Entity Identity | 0.01s |
| Freshness | 0.01s |
| AI Answerability | 0.01s |
| Engagement Handoff | 0.36s |
| Corroboration | 0.35s |


---


## 12. 📚 Methodological Disclosure

1. **Read-Only Non-Invasive Audit:** All evaluations via standard HTTP GET/HEAD with zero mutation.
2. **RFC 9309 Adherence:** Crawl respects `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` exclusion rules.
3. **Dual-Fetch Rendering Verification:** Compares raw server-rendered HTML against client-side hydrated DOM to detect JS-gated extraction barriers.
4. **Citation Extractability vs Live Ranking:** Measures structural extractability — physical preconditions for AI ingest — not stochastic query volume.
5. **Zero LLM Calls:** All analysis is deterministic and rule-based. No external AI API calls during audit.
6. **Simulated Perception Disclaimer:** The Perception Console simulates LLM extraction capability. It is NOT a live query to any AI system.


---

*Report produced by Brand AI Readiness Diagnostic Engine*  
*Audit ID: `python-docs-audit-run` · Generated: 2026-09-13T04:59:58.761Z*
