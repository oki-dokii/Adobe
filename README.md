# Brand AI Readiness Audit

Adobe University Hackathon 2026 — Round 3: Agent Skill Marketplace

A deterministic, zero-LLM agent skill suite for evaluating how automated AI crawlers, retrieval engines, and conversational assistants discover, parse, cite, and hand off public brand websites.

---

## Quick Start

### Installation & Dependencies

The audit engine requires Python 3.10+ and standard parsing libraries. It uses zero language model API keys, zero local model weights, and zero headless browser binaries.

```bash
# Clone the repository
git clone https://github.com/oki-dokii/Adobe.git
cd Adobe/brand-ai-readiness-audit

# Install required dependencies
pip install beautifulsoup4 requests pytest
```

### Running an Audit

The `audit-orchestrator` skill is the unified entrypoint for the 11-skill marketplace. It accepts any public domain or URL and produces synchronized JSON and Markdown reports.

```bash
# Run audit on any website (saves both JSON and Markdown reports)
PYTHONPATH=scripts python3 skills/audit-orchestrator/scripts/run.py \
  --url https://example.com \
  --json-out report.json \
  --md-out report.md
```

#### CLI Parameters

| Flag | Default | Description |
|---|---|---|
| `--url` | *(Required)* | Target domain or URL (e.g., `https://example.com` or bare `example.com`). |
| `--page-cap` | `40` | Maximum number of internal pages to sample during crawl. |
| `--render-max` | `10` | Maximum number of pages to evaluate through the DOM hydration expansion pipeline. |
| `--max-seconds`| `280` | Wall-clock execution deadline. Triggers graceful timeout ladders if exceeded. |
| `--json-out` | `None` | File path to write the canonical structured JSON report. |
| `--md-out` | `None` | File path to write the executive Markdown report with BLUF disclosure. |

### Running the Test Suite

```bash
# Run all 156 regression and unit tests
PYTHONPATH=scripts python3 -m pytest tests/ -q
```

---

## Architecture & System Pipeline

The system operates as a single shared crawl snapshot piped through a directed acyclic graph (DAG) of nine stateless detection skills, a deterministic deduplication/admission layer, and a research-grounded business impact scoring engine.

```mermaid
flowchart TD
    subgraph Ingestion ["1. INGESTION & TRANSPORT"]
        URL["Target URL Input"] --> Norm["Scheme Normalization & SSRF Guard"]
        Norm --> Crawler["RFC 9309 Compliant Crawler\n(Read-Only GET/HEAD, Token Simulation)"]
        Crawler --> Snapshot["Shared CrawlSnapshot\n(Raw HTML, Main Text, Headers, Status)"]
    end

    subgraph DAG ["2. SKILL EXECUTION PIPELINE (DAG)"]
        Snapshot --> V["site-type-classifier\n(Multi-Label Taxonomy A-F)"]
        Snapshot --> D["render-extract-audit\n(Dual-Fetch DOM Hydration Delta)"]
        
        V & D --> C["crawl-access-audit\n(Robots, Sitemaps, WAF)"]
        V & D --> CIT["citation-extractability-audit\n(Table Headers, Qualifier Splits)"]
        V & D --> K["ai-answerability-audit\n(K1-K13 Closed-Book Fact Spans)"]
        V & D --> ENT["entity-identity-audit\n(Schema Graphs, Collision Risks)"]
        V & D --> FRESH["freshness-audit\n(Copyright Drift, Modified Dates)"]
        V & D --> H["engagement-handoff-audit\n(Viewport, Deep-Links, Scent)"]
        V & D --> CORR["corroboration-consistency-audit\n(Cross-Web Authority Cross-Checks)"]
    end

    subgraph Admission ["3. ADMISSION & DEDUPLICATION"]
        C & CIT & K & ENT & FRESH & H & CORR --> Dedupe["Template Cluster Deduplication\n& Consecutive ID Re-Indexing (F-001, F-002...)"]
        Dedupe --> Canonical["Canonical Finding Set\n(Preserved Evidence Tiers & Confidence Basis)"]
    end

    subgraph BusinessImpact ["4. BUSINESS IMPACT & CAUSAL REASONING"]
        Canonical --> BIL["business-impact-layer\n(34 Mechanism Causal Chains, 4 Dimensions)"]
        BIL --> Scoring["Dimension Scores (Discoverability, Understanding, Trust, Engagement)\n& Funnel Attribution (Awareness, Consideration, Decision)"]
    end

    subgraph Reporting ["5. SYNCHRONIZED DUAL REPORTING"]
        Scoring --> JSON["Canonical JSON Report\n(Machine-Readable Contract)"]
        Scoring --> MD["Executive Markdown Report\n(BLUF Opening, Coverage Basis, Action Snippets)"]
    end
```

### Timeout Ladders & Graceful Degradation

The orchestrator enforces a strict 280-second hard execution budget to guarantee sub-5-minute runs regardless of origin responsiveness:
- **Normal Operation**: Full crawl, rendering up to `render_max` pages, all 9 detection skills, and corroboration verification.
- **Budget Threshold 1 (< 120s remaining)**: Corroboration external fetches are skipped to conserve latency.
- **Budget Threshold 2 (< 60s remaining)**: DOM rendering expansion is bypassed; skills operate directly on raw fetched HTML.
- **Budget Threshold 3 (< 30s remaining)**: K-question evaluation narrows to primary intent queries (K3, K6, K13).
- **Core Invariant**: `crawl-access-audit` and core brand identity checks run unconditionally to ensure a valid report is always emitted.

---

## Marketplace Skills & Research Grounding

The engine decomposes into 11 discrete skills registered in `marketplace.json`. Each skill implements detection mechanics derived from academic information retrieval benchmarks, web specifications, and empirical AI citation studies.

| Skill Identifier | Category | Primary Function | Theoretical & Empirical Research Grounding |
|---|---|---|---|
| `audit-orchestrator` | Orchestration | Coordinates crawl lifecycle, executes skill DAG, enforces timeouts, deduplicates findings, and renders synchronized reports. | Modular agent skill architecture; RFC 3986 URL parsing; deterministic pipeline design (`data/Z_agent_skill_design_patterns.md`, `data/AB_dual_output_json_markdown.md`). |
| `crawl-access-audit` | Crawlability | Detects AI bot disallows, fail-closed 5xx errors, sitemap freshness drift, and WAF/anti-bot challenge screens. | **RFC 9309** (Robots Exclusion Protocol standards for 5xx fail-closed rules); AI bot user-agent tokens (`GPTBot`, `ClaudeBot`, `PerplexityBot`); Web crawler resource budgeting (`data/A_ai_discovery_mechanics.md`, `data/C_crawlability_architecture.md`). |
| `render-extract-audit` | Rendering | Measures extractability delta between static HTML and client-rendered DOM (`<noscript>`, `<template>`, Next.js `__NEXT_DATA__`). | Client-side hydration mechanics; Dual-fetch DOM analysis; CSS content hiding (`display:none`, `aria-hidden`) in headless scraping (`data/D_machine_readability.md`, `data/E_content_extraction_parsing.md`). |
| `site-type-classifier` | Classification | Maps sites into 6 behavioral clusters (A: YMYL/Advice, B: Directory/Nonprofit, C: Gov/Edu, D: Technical Docs, E: Media, F: SaaS/Commerce). | Schema.org type hierarchy (`SoftwareApplication`, `Product`, `MedicalWebPage`); Google Search Quality Rater Guidelines (YMYL standards) (`data/V_site_type_differentiation.md`). |
| `citation-extractability-audit` | Extractability | Audits table headers (`<th>`, `scope`), pricing qualifier splits, and schema-to-visible fact consistency. | **WikiTableQuestions** benchmark (Pasupat & Liang) on table QA failure modes; Split-span extraction decay in RAG chunkers (`data/B_ai_citation_mechanics (1).md`, `data/L_content_quality_density.md`). |
| `ai-answerability-audit` | Answerability | Evaluates 13 essential closed-book buyer questions (K1–K13) via sentence-level fact span extraction. | **HotpotQA** multi-hop sentence span grounding; Closed-book QA evaluation without generative hallucination (`data/G_ai_answerability_metrics.md`, `data/W_query_page_matching_intent.md`, `data/AG_out_of_the_box_questions.md`). |
| `entity-identity-audit` | Entity Identity | Identifies name collisions with prominent entities, validates JSON-LD Organization graphs, and inspects `sameAs` authorities. | Schema.org Organization Graph specifications; Knowledge Base Entity Linking & Disambiguation principles (`data/I_entity_resolution_graph.md`, `data/J_structured_data_schemas.md`). |
| `freshness-audit` | Freshness | Flags stale copyright dates, outdated schema `dateModified` fields, and HTTP `Last-Modified` temporal drift. | Temporal information retrieval models; Query freshness signals in dense vector reranking (`data/F_freshness_lifecycle.md`, `data/P_performance_budget_crawler_impact.md`). |
| `corroboration-consistency-audit` | Corroboration | Cross-checks first-party claims against explicitly linked external authorities (Wikidata, Wikipedia, partner registries). | Multi-source consensus verification in automated fact-checking; Cross-web factual consistency (`data/K_trust_corroboration.md`, `data/Q_cross_web_consistency.md`). |
| `engagement-handoff-audit` | Conversion | Inspects initial viewport identity, Scroll-to-Text-Fragment (STTF) anchor survival, and navigational information scent. | W3C Scroll-to-Text Fragment specification; Information Scent theory (Pirolli & Card); First-viewport 50ms credibility heuristics (`data/N_onsite_engagement_conversion.md`, `data/X_ai_to_human_handoff.md`). |
| `business-impact-layer` | Reasoning | Translates raw findings into research-grounded 3-step causal chains, 4 dimension scores, and buyer funnel stages. | Causal graph modeling; Multi-criteria utility scoring; Buyer decision stage attribution (`data/R_scoring_severity_framework.md`, `data/S_root_cause_analysis_causal_chains.md`, `data/AF_agent_reasoning_quality.md`). |

---

## Detailed Skill Specifications

### 1. `crawl-access-audit`
- **What it analyzes**: `robots.txt` policy rules, HTTP response codes, XML sitemaps, canonical tags, and WAF challenge bodies.
- **Specific detection mechanisms**:
  - RFC 9309 compliance: Validates that 5xx status on `robots.txt` causes compliant crawlers to fail closed.
  - User-agent token detection: Inspects disallow blocks specifically targeting `GPTBot`, `ClaudeBot`, `PerplexityBot`, `CCBot`, `Google-Extended`, `anthropic-ai`, and `Bytespider`.
  - Challenge page recognition: Identifies Cloudflare, PerimeterX, DataDome, and AWS WAF challenge tokens (`client challenge`, `_fs-ch-`, `cf-browser-verification`) returning false 200 or 403 pages.
  - Sitemap freshness: Flags sitemaps where all URLs share identical `lastmod` timestamps, nullifying crawler prioritization.

### 2. `render-extract-audit`
- **What it analyzes**: Raw network HTML payloads versus rendered DOM structures.
- **Specific detection mechanisms**:
  - Unwraps `<noscript>` fallback containers and `<template>` tags to isolate text invisible to raw parsers.
  - Extracts and decodes Next.js `__NEXT_DATA__` JSON payloads to uncover client-hydrated catalogs and descriptions.
  - Detects permanent CSS hiding: Scans for inline or class-based `display: none`, `visibility: hidden`, and `aria-hidden="true"` on elements containing core entity facts with no reveal mechanism.

### 3. `site-type-classifier`
- **What it analyzes**: Seed URL, path structures, keyword frequency histograms, and Schema.org JSON-LD `@type` arrays.
- **Specific detection mechanisms**:
  - Multi-label voting assigns weights across six clusters (A: YMYL/Advice, B: Nonprofit/Directory, C: Government/Academic, D: Technical Documentation, E: Editorial/News, F: Commercial SaaS/E-Commerce).
  - Explicit schema validation elevates confidence when authoritative types (`SoftwareApplication`, `Product`, `MedicalWebPage`, `GovernmentOrganization`) are present.
  - Suppresses false defects: Automatically marks pricing queries (K6) as expected structural gaps on government (`.gov`), academic (`.edu`), documentation, and charitable non-profit domains.

### 4. `citation-extractability-audit`
- **What it analyzes**: HTML tabular structures, numeric price claims, and adjacent text qualifiers.
- **Specific detection mechanisms**:
  - Headerless data tables: Identifies `<table>` elements lacking semantic `<th>` tags or `scope` attributes, which prevents tabular RAG models from binding cell values to column concepts.
  - Qualifier splits: Detects visual pricing disclosures where qualifying clauses (e.g., "per user/month", "billed annually", "plus tax") reside in disconnected sibling or child containers.
  - Schema-to-DOM price parity: Cross-references `Product.offers.price` in JSON-LD against visible currency figures on the page, flagging factual contradictions.

### 5. `ai-answerability-audit`
- **What it analyzes**: Crawled corpus text against the 13 canonical closed-book buyer questions (K1–K13).
- **Specific detection mechanisms**:
  - Requires explicit sentence-level support spans (HotpotQA methodology) rather than loose keyword co-occurrence.
  - Evaluates questions: Identity (K1/K2), Offering (K3), Audience (K4), Geography/Service Region (K5), Pricing/Quotes (K6), Integrations (K7), Support (K8), Awards (K9), Competitors (K10), Compliance/Security (K11), Leadership (K12), and Human Contact (K13).
  - Flags "wrong page" conditions when a core answer exists within the domain but is absent from the primary query landing page.
  - Explicit method boundary disclosure: Declares confidence ceilings plainly in findings (`"Detected via deterministic keyword/pattern matching; treat 'insufficient' as 'not found via automated pattern match'"`) to prevent overclaiming negative omniscience.

### 6. `entity-identity-audit`
- **What it analyzes**: JSON-LD semantic graphs, Open Graph metadata, title tag conventions, and authoritative external references.
- **Specific detection mechanisms**:
  - Name collision detection: Evaluates whether brand names share common tokens with high-prominence dictionary words or global trademarks without disambiguation.
  - Passive disambiguator suppression: Suppresses false-positive collision alerts when robust meta descriptions or structured `disambiguatingDescription` fields are present.
  - Validates `sameAs` links targeting Wikidata, Wikipedia, Crunchbase, and GitHub, flagging dead 404 links that degrade authority signals.

### 7. `freshness-audit`
- **What it analyzes**: Copyright footer declarations, HTTP caching headers, and structured publication dates.
- **Specific detection mechanisms**:
  - Copyright year drift: Flags pages where the footer copyright date is multiple calendar years behind the current audit epoch.
  - Schema dateModified divergence: Compares `dateModified` in JSON-LD against visible page text and HTTP `Last-Modified` headers.
  - Preserves intentional historical archives by exempting multi-year date ranges (e.g., `2018–2026`).

### 8. `corroboration-consistency-audit`
- **What it analyzes**: Explicitly linked authoritative profiles and reference sites.
- **Specific detection mechanisms**:
  - Follows verified `sameAs` and press links to verify that external entity attributes (headquarters, founding year, key personnel) match first-party claims.
  - Operates strictly on explicitly linked sources; never initiates open-web speculative search queries.
  - Gracefully falls back to offline reference verification when network budget is restricted.

### 9. `engagement-handoff-audit`
- **What it analyzes**: First-viewport DOM geometry, anchor links, text fragments, and conversion pathways.
- **Specific detection mechanisms**:
  - Viewport brand identity: Evaluates whether brand name, value proposition, and key visual cues appear within the initial 800 vertical pixels.
  - Scroll-to-Text-Fragment (STTF) validation: Tests text fragment URLs generated by AI search engines to ensure dynamic DOM scripts do not break browser scroll-anchor positioning.
  - Navigational scent continuity: Identifies landing pages that omit clear hierarchical breadcrumbs or direct pathways toward the commercial conversion surface.

### 10. `business-impact-layer`
- **What it analyzes**: Merged canonical findings, page reach ratios, and question taxonomy metrics.
- **Specific detection mechanisms**:
  - 34 dedicated research-grounded causal chains: Maps every technical finding to a distinct 3-step sequence (`Observed DOM Condition` -> `Parser/Chunker Impact` -> `Conversational Assistant Consequence`).
  - Funnel stage mapping: Assigns findings to Buyer Funnel Stages (*Awareness*, *Consideration*, *Decision*).
  - Business exposure severity: Evaluates blast radius (*Isolated*, *Cluster*, *Broad*) while capping heuristic markup findings (e.g., `table_no_th`) to prevent artificial severity inflation.

---

## Output Excellence & Defensibility

The audit output is engineered to provide defensible, reproducible, and actionable reports for both automated ingestion and executive review:

### 1. Strict Zero-LLM Determinism
Every score, finding, and recommendation is calculated using deterministic parsing rules, regex grammar, and structural heuristics. 
- Running the audit multiple times against the same crawl snapshot yields identical output.
- Zero generative hallucinations, zero model drift, and zero reliance on third-party API availability.

### 2. Transparent Sampling & Coverage Disclosure (`coverage_basis`)
Rather than claiming complete omniscience over a massive enterprise domain from a sample crawl, every report prominently discloses its sampling boundary in lines 1–3:
```markdown
# Brand AI readiness audit — example.com

example.com audit: Checked crawl access, machine readability, citation mechanics, answerability, entity identity, freshness, and handoff across 3 of ~200 estimated pages sampled (2% coverage). Result: 0 critical, 1 high, 1 medium, 0 low findings. Top priority: [F-001] ...
```
This explicit boundary calibration prevents false accusations of missing content that may reside on uncrawled pages.

### 3. Distinct, Research-Grounded Causal Chains (Zero Boilerplate)
Generic templates like *"Observed condition reduces AI likelihood"* have been completely eradicated. All 34 finding types feature custom causal chains grounded in technical reality:
- **`robots_fail_closed`**: `5xx HTTP on robots.txt` -> `RFC 9309 mandates crawlers assume full disallow` -> `Domain dropped from AI indexing`.
- **`table_no_th`**: `Table lacks <th>/scope` -> `Parser flattens rows into unassociated strings (WikiTableQuestions)` -> `Assistant misattributes pricing tiers`.
- **`unanswerable`**: `Corpus lacks sentence fact span` -> `Dense retrieval returns low similarity (HotpotQA)` -> `Assistant hallucinates or cites competitor`.

### 4. High-Precision Findings with Copy-Pasteable Remediations
Each finding provides a rich `suggested_action` dictionary with concrete guidance:
```json
{
  "id": "F-001",
  "title": "Data table lacks header cells",
  "severity": "medium",
  "evidence": "table has_th=false on https://example.com/pricing",
  "confidence": "high",
  "confidence_basis": "deterministic reproduced or RFC-grounded",
  "evidence_tier": "OBS",
  "contributing_skills": ["citation-extractability-audit"],
  "coverage_basis": "3 of ~50 estimated pages sampled (6% coverage)",
  "suggested_action": {
    "summary": "Add <th> or scope attributes so cells keep units/labels.",
    "priority": "medium",
    "what": "Semantic <th> elements with scope attributes",
    "where": "https://example.com/pricing",
    "how": "Replace the first <tr> row with: <thead><tr><th scope='col'>Header1</th><th scope='col'>Header2</th></tr></thead>",
    "why": "LLMs parse tables row-by-row; without explicit headers, numerical facts lose semantic labels.",
    "cost_tier": "markup"
  }
}
```

### 5. Balanced Severity Calibration
Technical severity is anchored to direct evidence:
- Critical severity is reserved for fatal crawl access barriers (`robots_fail_closed`, `ai_token_disallow`) that blind all AI agents.
- Formatting defects (such as missing `<th>` tags) are capped at `medium` or `high` and never inflated to `critical` based solely on heuristics.
- Non-profit, educational, and governmental domains are automatically exempted from commercial pricing defects.

---

## Verification & Submission Integrity

The package has been verified end-to-end:
- **156 Automated Tests Passing**: Comprehensive test suite verifying all skills, timeout ladders, edge cases, and CLI handlers.
- **Root-Level Compliance**: Generated zip package (`brand-ai-readiness-audit-submission.zip`, 0.11 MB) contains `marketplace.json` and `README.md` at root level.
- **Clean Read-Only Network Behavior**: Enforces read-only HTTP GET/HEAD requests, strictly respecting target server policies.
