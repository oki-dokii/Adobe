# Brand AI readiness audit — blog.cloudflare.com

blog.cloudflare.com audit: 0 critical, 0 high, 3 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 13
- Templates: 9
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
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-001: High-value URL has no inbound links in the crawled graph
- Severity: medium
- Evidence: 0 in-edges for https://cloudflare.com/contact/. Coverage 40/200. Isolation may be a coverage artifact.
- Suggested action: Add an inbound link from a higher-centrality page to this URL.

### F-003: Closed-book: site does not answer K6 (What does it cost / how is it priced?)
- Severity: medium
- Evidence: No supporting span in crawled corpus for K6. Coverage={'pages_fetched': 40, 'pages_rendered': 13, 'render_count': 13, 'estimated_pages': 200, 'templates': 9, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 28, 't-2': 1, 't-3': 1, 't-4': 1, 't-5': 2, 't-6': 1, 't-7': 1, 't-8': 4, 't-9': 1}, 'render_max': 10, 'http_requests': 47, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 2, 'ssrf_blocks': 0}. K6
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-002: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://blog.cloudflare.com/aligning-our-prices-and-packaging-with-the-problems-we-help-customers-solve/: ' prices and packaging with the problems we help customers solve | Cloudflare Blog Skip to content Produc'; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001, F-003, F-002
- INCOMPLETE AREAS: (none)