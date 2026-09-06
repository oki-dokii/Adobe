# Brand AI readiness audit — www.shopify.com

www.shopify.com audit: 0 critical, 2 high, 0 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 3
- Stopped: early_stop

## Site type
- {
  "cluster": "F",
  "secondary": [
    "B"
  ],
  "ymyl": false,
  "multilingual": true,
  "product_like": true,
  "ecommerce": true,
  "saas": false,
  "confidence": "high",
  "votes": {
    "A": 0,
    "B": 2,
    "C": 0,
    "D": 0,
    "E": 0,
    "F": 5
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.
- Render budget exhausted: render_max=10, performed=10, skipped_budget=30, protected_requests=40. Protected categories affect fetch/render priority only; the cap is hard.

## Findings
### F-002: Closed-book: site does not answer K3 (What does this organization offer or do?)
- Severity: high
- Evidence: No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 200, 'templates': 3, 'k_categories_hit': ['K3', 'K6'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 37, 't-2': 1, 't-3': 2}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 40, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 46, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 2, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-001: On-site typed facts disagree (prices)
- Severity: high
- Evidence: values=['0', '1', '114', '19', '2.30', '2100'] urls=['https://www.shopify.com/in/pricing', 'https://www.shopify.com/in/pricing', 'https://www.shopify.com/in/pricing', 'https://www.shopify.com/in/pricing']
- Suggested action: Reconcile current prices and mark superseded pages (e.g. old press) as historical.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-002, F-001
- INCOMPLETE AREAS: (none)