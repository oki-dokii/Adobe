# Brand AI Readiness Audit

Adobe University Hackathon 2026 — Round 3: Agent Skill Marketplace

---

## Overview

`brand-ai-readiness-audit` is a read-only, robots-respecting agent skill pack that audits any public website for two classes of failure: off-site AI discoverability (whether an AI assistant can find, parse, and accurately cite the site) and on-site engagement (whether a visitor referred by an AI assistant finds enough structure to convert or continue).

The system performs a single shared crawl, routes the resulting snapshot through a directed acyclic graph of detection skills, merges and deduplicates findings through a deterministic admission layer, and emits a structured JSON report with four normalized dimension scores and a ranked list of suggested actions.

---

## Approach

### Problem framing

AI assistants cite websites through a pipeline that is fundamentally different from a search-engine referral. A crawler must be able to reach the content, a parser must extract structured facts, a retrieval step must surface the correct page for a query, and a generation step must produce an attributable quote. A failure at any stage causes the brand to be omitted, misrepresented, or cited with incorrect claims. On the engagement side, a visitor arriving from an AI citation lands on a page with no prior context: wayfinding, above-fold identity, and handoff to conversion surfaces all behave as if the visitor is new.

Round 2 mapped the failure modes analytically. Round 3 encodes them as reusable detection skills so that any agent, given a URL, can produce a concrete, evidenced report without manual analysis.

### Research methodology

Before writing any skill, we conducted live field audits across a 38-domain corpus spanning SaaS platforms, e-commerce stores, developer documentation, news publishers, government domains, and personal portfolios. Each site was evaluated by querying representative AI assistants, observing the citations and misrepresentations produced, and then examining the corresponding page structure to identify the upstream cause. The patterns that consistently separated cited from ignored or misrepresented sites were distilled into structural rules — none of which reference specific brand names or hostnames.

The findings clustered into eight structural failure categories, each of which maps to a discrete skill:

1. **Crawl access barriers** — `robots.txt` directives blocking AI-specific user-agent tokens (GPTBot, ClaudeBot, PerplexityBot, CCBot, Google-Extended, anthropic-ai, Bytespider) before the retrieval pipeline even begins.

2. **Rendering gaps** — Facts serialized inside JavaScript bundles, `<noscript>` fallbacks, `<template>` elements, or Next.js `__NEXT_DATA__` payloads that are invisible to static HTML parsers used by most retrieval systems.

3. **Citation extractability failures** — Pricing qualifiers split across sibling DOM elements that appear continuous visually but are not when extracted as text spans. Headerless `<table>` structures that prevent LLMs from associating cell values with column intent.

4. **Buyer question gaps** — Absence of answerable spans for the 13 questions a prospective buyer would ask: identity, offering, pricing, audience, geography, integrations, support, trust signals, and comparison. Missing spans force a generative model to either hallucinate or decline to answer.

5. **Entity identity and collision** — Brand names that collide with more-prominent entities in knowledge bases, combined with absent structured disambiguation (`sameAs` links, `Organization` JSON-LD with `addressCountry` or `disambiguatingDescription`).

6. **Temporal inconsistency** — Copyright footer years, schema `dateModified` values, and visible claim dates that diverge in ways that cause a retrieval system to distrust or downrank the content.

7. **Corroboration failures** — Explicitly linked public profiles (`sameAs` targets, press pages, partner directories) that contradict the material claims on the site, or that return 404 and therefore undermine the authority the site claims.

8. **Engagement and wayfinding failures** — Absence of brand identity in the first viewport, broken Scroll-to-Text-Fragment deep links that cause AI-generated citations to land on unrelated page sections, and navigation gaps between the AI-cited landing page and the commercial conversion surface.

### Architectural constraints

The following constraints were treated as invariants throughout implementation:

- **Read-only operation.** The system issues only `GET` and `HEAD` requests. `frozenset({"GET", "HEAD"})` is enforced at the HTTP client layer.
- **`robots.txt` compliance.** The RFC 9309 crawl policy is fetched and evaluated before any page request. A 4xx response is treated as fail-open; a 5xx response is treated as fail-closed.
- **No host allowlists.** All detection rules are structural — path shape, grammar patterns, DOM structure, byte signatures. No site-specific logic exists anywhere in the codebase.
- **No external model weights or APIs.** Detection is implemented as deterministic heuristics over parsed HTML, JSON-LD, and HTTP metadata.
- **Deterministic completion within budget.** A 280-second hard deadline is enforced through a skip-ladder that degrades gracefully: rendering is reduced, then corroboration is skipped, then rendering is omitted entirely, while the protected core always runs.

---

## Skill Architecture

The system decomposes into 11 marketplace skills registered in `brand-ai-readiness-audit/marketplace.json`. One skill is the orchestration entrypoint; nine are stateless detection units operating on a shared `CrawlSnapshot`; one is a post-detection annotation layer that scores and ranks without fabricating evidence.

### Orchestrator

`audit-orchestrator` is the sole public entrypoint. It validates the seed URL (scheme check, credential stripping, SSRF guard), performs a single shared crawl up to the configured page cap, constructs a `CrawlSnapshot`, routes it through the skill DAG, runs the admission and merge layers, invokes the business-impact annotation, and assembles the final report in JSON and optionally Markdown.

The DAG encodes one hard dependency: `render-extract-audit` must complete before `citation-extractability-audit`, `ai-answerability-audit`, and `engagement-handoff-audit`, because those skills operate on the rendered page representation. All other skills are independent after the crawl.

### Detection Skills

**`crawl-access-audit`** examines the observed crawl policy, transport, and coverage. It emits findings for AI-specific user-agent disallow directives, noindex/robots conflicts, soft-404 responses (HTTP 200 with not-found language and thin body), canonical duplicates across non-locale URL clusters, and uniform sitemap `lastmod` stamps that indicate a CMS is publishing stale freshness signals.

**`render-extract-audit`** compares the static HTML representation against the expanded representation after unwrapping `<noscript>` blocks, `<template>` elements, and Next.js `__NEXT_DATA__` payloads. Facts that exist only in the expanded representation are flagged as render-gap extractions. The dual-fetch approach avoids any dependency on a headless browser binary, keeping the package within the submission size constraint.

**`site-type-classifier`** assigns each site to one of six clusters (SaaS platform, e-commerce, news or media, developer documentation, government or institutional, personal or portfolio) using a combination of keyword-frequency voting and JSON-LD schema.org type extraction. When a schema.org type is present (`SoftwareApplication`, `Product`, `NewsArticle`, `MedicalWebPage`, `GovernmentOrganization`), classification confidence is elevated deterministically. The site type gates downstream question selection in the answerability skill and expected-gap rules in the freshness skill.

**`citation-extractability-audit`** identifies two classes of LLM citation failures: qualifier splits, where a pricing amount and its condition clause appear in sibling DOM elements rather than the same text node; and headerless tables, where absence of `<th>` or `<thead>` prevents a language model from associating cell values with their column intent. It also checks for schema-visible price mismatches, comparing JSON-LD `Product.offers.price` values against visible offer strings and flagging contradictions, not mere absences.

**`ai-answerability-audit`** evaluates the site's crawled corpus against 13 canonical buyer questions (K1 through K13), each defined by a grammar pattern rather than a keyword list. Questions span: brand identity, core offering, pricing, target audience, geography, integrations, support availability, founding story, comparison differentiation, certifications, and regulatory compliance. Questions are gated by site type and by crawl budget, with a time-remaining ladder that reduces the active question set rather than truncating mid-check.

**`entity-identity-audit`** identifies brand name collision risk — names that share tokens with more-prominent entities in general knowledge bases — and dead `sameAs` link targets. Collision risk is assessed against a closed list of generic tokens; all-caps acronyms and unique compound names are excluded. Structured JSON-LD disambiguators (`addressCountry`, `disambiguatingDescription`) suppress false-positive warnings when present.

**`freshness-audit`** compares copyright footer years, schema `dateModified` values, and visible date claims across the crawled page set. It skips date spans of four or more years that indicate a documented history rather than a stale claim, and ignores intra-site price comparisons across locale-prefixed URL variants, which represent the same catalog in different markets rather than conflicting claims.

**`corroboration-consistency-audit`** fetches explicitly linked, robots-permitted public sources from `sameAs` targets and linked partner or press pages. It compares material factual claims against the corresponding claims on the audited site. Only sources the audited page explicitly names and links are checked; no web search is performed.

**`engagement-handoff-audit`** examines the post-referral experience. It checks for brand identity signals in the first viewport, evaluates Scroll-to-Text-Fragment anchors on pages that AI assistants commonly cite, and detects wayfinding scent breaks where a landing page lacks navigational signals toward the commercial conversion surface that corresponds to the buyer question that generated the citation.

### Annotation Layer

**`business-impact-layer`** receives the merged canonical finding set and computes four normalized dimension scores (Discoverability, Understanding, Trust, Engagement) and a composite overall-readiness index. It sorts findings by a priority function derived from severity and dimension weight, and selects the top priority actions for the report summary. It performs no detection, emits no new findings, and does not modify evidence fields.

---

## Output Schema

```json
{
  "url": "string",
  "audited_at": "ISO-8601 timestamp",
  "overall_index": "integer 0-100",
  "dimension_scores": {
    "discoverability": "integer",
    "understanding": "integer",
    "trust": "integer",
    "engagement": "integer"
  },
  "summary": {
    "total": "integer",
    "critical": "integer",
    "high": "integer",
    "medium": "integer",
    "low": "integer"
  },
  "top3PriorityActions": ["SuggestedAction"],
  "findings": ["Finding"]
}
```

Each `Finding` carries: `id`, `title`, `severity`, `evidence`, `evidence_summary` (120-character preview), `finding_type`, `finding_key`, and `suggested_action` with fields `summary`, `priority`, `what`, `where`, `how`, `why`, `cost_tier`, and `proactive`.

The `how` field contains a copy-pasteable markup or configuration snippet for every finding type that has a deterministic fix.

---

## Usage

```sh
# From the brand-ai-readiness-audit/ directory
PYTHONPATH=scripts python3 skills/audit-orchestrator/scripts/run.py \
  --url https://example.com \
  --json-out report.json
```

Bare domain inputs such as `example.com` are automatically normalized to `https://example.com`. Use `--page-cap` and `--render-max` to reduce the crawl scope on slow origins. The default page cap is 40 and the default render budget is 10 pages.

**Run tests:**

```sh
PYTHONPATH=scripts pytest tests/ -q
```

---

## Repository Structure

```
brand-ai-readiness-audit/
├── marketplace.json
├── skills/
│   ├── audit-orchestrator/
│   ├── crawl-access-audit/
│   ├── render-extract-audit/
│   ├── site-type-classifier/
│   ├── citation-extractability-audit/
│   ├── ai-answerability-audit/
│   ├── entity-identity-audit/
│   ├── freshness-audit/
│   ├── corroboration-consistency-audit/
│   ├── engagement-handoff-audit/
│   └── business-impact-layer/
├── scripts/lib/
├── tests/
└── decisions.md
```

`decisions.md` contains the engineering diary: every false positive encountered during live testing, the structural rule used to resolve it, and the regression test that prevents recurrence.

---

## Dependencies

```
beautifulsoup4
requests
pytest
```

No model weights, no paid APIs, no headless browser binaries.
