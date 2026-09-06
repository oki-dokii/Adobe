# Brand AI readiness audit — blog.cloudflare.com

blog.cloudflare.com audit: 0 critical, 0 high, 15 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 11
- Stopped: early_stop

## Site type
- {
  "cluster": "E",
  "secondary": [
    "F"
  ],
  "ymyl": false,
  "multilingual": false,
  "product_like": true,
  "ecommerce": false,
  "saas": true,
  "confidence": "medium",
  "votes": {
    "A": 0,
    "B": 0,
    "C": 0,
    "D": 0,
    "E": 2,
    "F": 2
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Access limitation: https://www.cloudflare.com/plans/enterprise/contact/: HTTP 403 (bot-challenge / WAF interstitial). These bodies were not used as brand/answerability evidence.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.
- Render budget exhausted: render_max=10, performed=10, skipped_budget=29, protected_requests=1. Protected categories affect fetch/render priority only; the cap is hard.

## Findings
### F-001: High-value URL has no inbound links in the crawled graph
- Severity: medium
- Evidence: 0 in-edges for https://cloudflare.com/contact/. Coverage 40/200. Isolation may be a coverage artifact.
- Suggested action: Add an inbound link from a higher-centrality page to this URL.

### F-031: Closed-book: site does not answer K6 (What does it cost / how is it priced?)
- Severity: medium
- Evidence: No supporting span in crawled corpus for K6. Coverage={'pages_fetched': 40, 'pages_content_usable': 39, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 200, 'templates': 11, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 28, 't-2': 1, 't-3': 1, 't-4': 1, 't-5': 1, 't-6': 1, 't-7': 1, 't-8': 1, 't-9': 3, 't-10': 1, 't-11': 1}, 'render_max': 10, 'renders_requested': 39, 'renders_performed': 10, 'renders_skipped_budget': 29, 'protected_render_requests': 1, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 39, 'challenge': 1}, 'http_requests': 47, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 2, 'ssrf_blocks': 0}. K6
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-030: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://blog.cloudflare.com/aligning-our-prices-and-packaging-with-the-problems-we-help-customers-solve/: ' prices and packaging with the problems we help customers solve | Cloudflare Blog Skip to content Produc'; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.

### F-002: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-003: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/tag/product-news/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-004: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/de-de/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-005: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/de-de/tag/product-news/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-006: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/es-es/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-007: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/es-es/tag/product-news/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-008: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/es-la/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-009: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/es-la/tag/product-news/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-010: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/fr-fr/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-011: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/fr-fr/tag/product-news/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-012: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/it-it/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-013: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2026', '2026', '2026'] schema=['CF295E1604697F9CAD18B5A232E871F6'] on https://blog.cloudflare.com/it-it/tag/product-news/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

## Appendix (overflow)
- F-014: Date signals disagree across visible text and metadata
- F-015: Date signals disagree across visible text and metadata
- F-016: Date signals disagree across visible text and metadata
- F-017: Date signals disagree across visible text and metadata
- F-018: Date signals disagree across visible text and metadata
- F-019: Date signals disagree across visible text and metadata
- F-020: Date signals disagree across visible text and metadata
- F-021: Date signals disagree across visible text and metadata
- F-022: Date signals disagree across visible text and metadata
- F-023: Date signals disagree across visible text and metadata
- F-024: Date signals disagree across visible text and metadata
- F-025: Date signals disagree across visible text and metadata
- F-026: Date signals disagree across visible text and metadata
- F-027: Date signals disagree across visible text and metadata
- F-028: Date signals disagree across visible text and metadata
- F-029: Date signals disagree across visible text and metadata

## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001, F-031, F-030, F-002, F-003, F-004, F-005, F-006, F-007, F-008, F-009, F-010, F-011, F-012, F-013
- INCOMPLETE AREAS: (none)