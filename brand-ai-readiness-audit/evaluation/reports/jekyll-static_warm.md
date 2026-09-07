# Brand AI readiness audit — jekyllrb.com

jekyllrb.com audit: 0 critical, 1 high, 3 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 19
- Stopped: early_stop

## Site type
- {
  "cluster": "D",
  "secondary": [
    "B"
  ],
  "ymyl": false,
  "multilingual": false,
  "product_like": false,
  "ecommerce": false,
  "saas": false,
  "confidence": "high",
  "votes": {
    "A": 0,
    "B": 2,
    "C": 0,
    "D": 3,
    "E": 0,
    "F": 0
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.
- Render budget exhausted: render_max=10, performed=10, skipped_budget=30, protected_requests=1. Protected categories affect fetch/render priority only; the cap is hard.

## Findings
### F-003: Closed-book: site does not answer K3 (What does this organization offer or do?)
- Severity: high
- Evidence: No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 200, 'templates': 19, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 17, 't-2': 1, 't-3': 5, 't-4': 1, 't-5': 1, 't-6': 1, 't-7': 1, 't-8': 1, 't-9': 1, 't-10': 1, 't-11': 2, 't-12': 1, 't-13': 1, 't-14': 1, 't-15': 1, 't-16': 1, 't-17': 1, 't-18': 1, 't-19': 1}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 1, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 42, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-001: High-value URL has no inbound links in the crawled graph
- Severity: medium
- Evidence: 0 in-edges for https://jekyllrb.com/docs/code_of_conduct/. Coverage 40/200. Isolation may be a coverage artifact.
- Suggested action: Add an inbound link from a higher-centrality page to this URL.

### F-002: High-value URL has no inbound links in the crawled graph
- Severity: medium
- Evidence: 0 in-edges for https://jekyllrb.com/docs/history/. Coverage 40/200. Isolation may be a coverage artifact.
- Suggested action: Add an inbound link from a higher-centrality page to this URL.

### F-004: Closed-book: site does not answer K6 (What does it cost / how is it priced?)
- Severity: medium
- Evidence: No supporting span in crawled corpus for K6. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 200, 'templates': 19, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 17, 't-2': 1, 't-3': 5, 't-4': 1, 't-5': 1, 't-6': 1, 't-7': 1, 't-8': 1, 't-9': 1, 't-10': 1, 't-11': 2, 't-12': 1, 't-13': 1, 't-14': 1, 't-15': 1, 't-16': 1, 't-17': 1, 't-18': 1, 't-19': 1}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 1, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 42, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. K6
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-003, F-001, F-002, F-004
- INCOMPLETE AREAS: (none)