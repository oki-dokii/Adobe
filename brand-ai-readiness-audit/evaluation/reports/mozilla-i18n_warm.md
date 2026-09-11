# Brand AI readiness audit — www.mozilla.org

www.mozilla.org audit: 0 critical, 0 high, 3 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 4
- Stopped: early_stop

## Site type
- {
  "cluster": "F",
  "secondary": [],
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
    "E": 0,
    "F": 2
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.
- Render budget exhausted: render_max=10, performed=10, skipped_budget=30, protected_requests=40. Protected categories affect fetch/render priority only; the cap is hard.

## Findings
### F-001: High-value URL has no inbound links in the crawled graph
- Severity: medium
- Evidence: 0 in-edges for https://www.mozilla.org/about/legal/acceptable-use/. Coverage 40/41. Isolation may be a coverage artifact.
- Suggested action: Add an inbound link from a higher-centrality page to this URL.

### F-003: Closed-book: site does not answer K6 (What does it cost / how is it priced?)
- Severity: medium
- Evidence: No supporting span in crawled corpus for K6. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 41, 'templates': 4, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 5, 't-2': 9, 't-3': 3, 't-4': 23}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 40, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 48, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 4, 'ssrf_blocks': 0}. K6
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-002: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://www.mozilla.org/en-US/about/legal/terms/subscription-services/: 'your information. Your Payment Payment. We offer the Services as automatically renewing subscription services. When you sign up for the paid version '; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001, F-003, F-002
- INCOMPLETE AREAS: (none)