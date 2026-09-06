# Phase 0 — Current State (pre-attack snapshot)

Snapshot of the **v0 synthesis** in `analysis/` before this review. This is the accused architecture, not the locked one.

Verified against: `06_SKILL_DECISIONS.md`, `07_FINAL_SKILL_ARCHITECTURE.md`, `08_SHARED_INFRASTRUCTURE.md`, `09_DATA_CONTRACTS.md`, `11_ORCHESTRATOR.md`, `23_FINAL_DECISION.md`, `analysis/skills/*`, `analysis/cursor/*`.

Research corpus re-verified: **34/34** Markdown files in `data/` plus the Round 3 handout PDF.

---

## Current skill count

**10** marketplace skills (1 entrypoint + 9 detection).

CS-* inventory claimed 60 candidates → KEEP 10 / MERGE 35 / DEFER 5 CS-IDs (+ 3 extra mechanisms) / REJECT 10.

## Current skill names

| Folder ID | Role |
|-----------|------|
| `audit-orchestrator` | Entrypoint |
| `site-type-classifier` | V gating + YMYL findings |
| `crawl-access-audit` | Gate 1 access |
| `render-extract-audit` | Gate 2 render/DOM |
| `citation-extractability-audit` | Gate 3 quote/misquote |
| `entity-identity-audit` | WhoQA / collision |
| `ai-answerability-audit` | Closed-book completeness + W + AH metrics |
| `freshness-audit` | Temporal credibility |
| `corroboration-consistency-audit` | H+P linked-source / material drift |
| `engagement-handoff-audit` | M+X+Y landing |

Marketplace name: `brand-ai-readiness-audit`.

## Current entrypoint

Exactly one: **`audit-orchestrator`**.

## Current shared infrastructure

`http_client`, `robots_policy`, `url_normalize`, `sitemap_parser`, `crawl_planner`, `simhash_cluster` (AE∩AF), `renderer`, `html_parse/main_content`, `metadata_extract`, `structured_data_parse`, `page_classifier`, `entity_extract`, `fact_store` + `compare_claim_against_source`, `evidence_store`, logging, finding/severity/confidence normalize, `suppression_registry`, `rate_limiter`, `sanitizer`.

Failure codes: FETCH_TIMEOUT, ROBOTS_DISALLOWED, PARSE_FAILURE, RATE_LIMITED, SKILL_INTERNAL_ERROR, RENDER_TIMEOUT, DNS_FAILURE, TLS_FAILURE, SSRF_BLOCKED.

## Current dependencies (claimed DAG)

```
URL → robots → crawl+extract → SK-V
  → parallel: SK-C, SK-D, SK-CIT, SK-ENT, SK-I
  → SK-K → SK-X → SK-H (if time)
  → U + T + S + AC + AB report
```

Early stop: origin unreachable, robots 5xx fail-closed.

## Current data contracts

CrawlResult, Page, RenderedPage, ExtractedContent, Entity, Fact, Evidence, SkillResult, Finding, Recommendation, FinalAuditReport.

Answerability metrics specified as report-layer (not a skill). Finding floor: id, title, severity, evidence, suggested_action.

**Gaps already visible in contracts:** no `parent_id`, no `extractability_flags` on Page, no `language`, no `unfetched` node flag, no mandatory `finding_type` enum, Page missing robots meta.

## Current report structure

Dual JSON + Markdown from one object (AB). BLUF. Coverage + limitations. Cap ~15 user-facing findings. Template rollup.

## Current deferred ideas

Live-citation-probe; directory-presence scan; KG completeness score; heavy OCR/video; full ReAct; AG15 hard claim-conflict findings; AF embedding topic clusters; Y9 SPA history-back; AH8 (question text never stated).

## Current rejected ideas

llms.txt required; email analog; personalization audit; GEO 40%; standalone CWV suite; generic meta-description skill; micro-skills per K question or C check.

## Current unresolved research gaps (v0 admitted)

40/60 crawl/analysis unvalidated; headless availability unknown; collision search without paid API; bounded ReAct untested; SimHash Hamming vs AF θ tunables; AG15 E2E FP; K weights uncalibrated; composite citability vs live citations; per-K HITS; WhoQA production transfer.

## Current implementation assumptions

Read-only GET/HEAD; RFC 9309 4xx fail-open / 5xx fail-closed; zip ≤50MB; <5 min; no model weights; no paid APIs; no hard-coded sites; `allowed-tools` is not a sandbox; V beats generic content findings; schema missing ≠ Critical; confidence not 0–100; implementation **not started**.

## Verification note

v0 **over-claimed GO** for runtime (conditional in 23, still labeled GO). SK-H skill spec is already **linked-source-only**, but architecture prose still talks as if a Wikipedia search pass exists (Topic H research). Topic G’s strongest skill (`structured-data-integrity-check`) was merged into CIT without a named finding type. Topic W’s unique “right fact, wrong page” and 100%-win-rate table checks were flattened into SK-K. These are attack surfaces, not proof of correctness.
