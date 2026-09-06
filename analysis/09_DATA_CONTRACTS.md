# Phase 10 — Data Contracts

JSON-like schemas. Skills MUST fit these.

## 1. CrawlResult
```json
{
  "run_id": "uuid",
  "seed_url": "https://example.com/",
  "origins": ["https://example.com"],
  "robots": {"status": "ok|fail_open|fail_closed|missing", "body_ref": "..."},
  "coverage": {
    "pages_fetched": 0,
    "pages_rendered": 0,
    "estimated_pages": null,
    "templates": 0,
    "k_categories_hit": ["K3"],
    "stopped_reason": "budget|early_stop|unreachable|robots"
  },
  "pages": ["Page.id..."],
  "graph": {"nodes": 0, "orphans_suspected": []}
}
```

## 2. Page
```json
{
  "id": "p-...",
  "url": "https://...",
  "final_url": "https://...",
  "status": 200,
  "redirect_hops": 0,
  "template_id": "t-...",
  "page_type": "home|about|pricing|product|article|docs|contact|legal|other",
  "raw_html_ref": "...",
  "headers": {"content-type": "text/html"}
}
```

## 3. RenderedPage
```json
{
  "page_id": "p-...",
  "rendered_html_ref": "...",
  "render_status": "ok|timeout|skipped",
  "text_delta_ratio": 0.0
}
```

## 4. ExtractedContent
```json
{
  "page_id": "p-...",
  "title": "",
  "main_text": "",
  "headings": [{"level": 1, "text": ""}],
  "landmarks": {"main": true, "nav": true},
  "dates": {"visible": [], "schema": [], "http_last_modified": null, "sitemap_lastmod": null},
  "json_ld": [],
  "tables": [{"has_th": true}],
  "extraction_method": "static_html|rendered_dom"
}
```

## 5. Entity
```json
{
  "name": "",
  "aliases": [],
  "type": "Organization|Person|Product",
  "same_as": [],
  "disambiguators": {"category": "", "geo": ""},
  "collision_risk": "low|medium|high",
  "evidence": []
}
```

## 6. Fact
```json
{
  "id": "fact-...",
  "type": "price|offering|leader|geo|contact|date|other",
  "value": "",
  "qualifiers": [],
  "url": "",
  "span": "",
  "freshness_sensitive": true
}
```

## 7. Evidence
```json
{
  "url": "",
  "selector_or_offset": "#:~:text=...",
  "extracted_text": "",
  "extraction_method": "static_html|rendered_dom|http_header|third_party|llm_span"
}
```

## 8. SkillResult
```json
{
  "skill_id": "crawl-access-audit",
  "run_id": "uuid",
  "status": "ok|partial|failed",
  "findings": [],
  "metrics": {},
  "errors": [{"code": "", "message": "", "recoverable": true}],
  "timing_ms": 0
}
```

## 9. Finding (internal; see also 10_FINDING_STANDARD)
Superset of handout. Handout-required fields always populated.

## 10. Recommendation
```json
{
  "summary": "",
  "priority": "critical|high|medium|low",
  "finding_ids": ["F-001"],
  "what": "",
  "where": "",
  "how": "",
  "why": "",
  "cost_tier": "markup|content|architecture",
  "proactive": false
}
```

## 11. FinalAuditReport
```json
{
  "site": "example.com",
  "audited_at": "2026-09-06T00:00:00Z",
  "summary": {
    "total_findings": 0,
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "coverage": {},
  "site_type": {},
  "limitations": [],
  "findings": [],
  "proactive_recommendations": []
}
```

Human Markdown is a **render** of this object (AB-01), not a second LLM pass.

## Answerability metrics (report layer, not a fourth skill)

From Topic K Cluster D — original synthesis, **not** a published standard. Do not freeze weights without human-labeled calibration (K-030).

```
applicable = K3–K8, K11–K20, K23–K24 minus V-inapplicable
exclude_from_core = {K9, K10, K21, K22}  # report separately
score(q) = 1.0 if answered, 0.5 if partial, 0.0 if unanswerable
CoreAnswerabilityRate = weighted_mean(score(q) for q in applicable)
AnswerConcentration = mean(distinct_pages_cited | q answered)  # HotpotQA supporting-facts; NOT a "five page" cutoff
FreshnessAdjustedFlags = count(K24-relevant q where Topic I says stale)
```

W query-page checks: **2–3 calibration queries**, not an exhaustive grid (AH-02 / JOIN-004). Composite citability (AH25) is the cheap primary **metric**; live probes remain DEFERRED.
