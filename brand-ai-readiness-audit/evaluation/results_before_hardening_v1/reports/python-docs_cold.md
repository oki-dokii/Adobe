# Brand AI readiness audit — docs.python.org

docs.python.org audit: 0 critical, 1 high, 1 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 27
- Templates: 20
- Stopped: early_stop

## Site type
- {
  "cluster": "D",
  "secondary": [],
  "ymyl": false,
  "multilingual": false,
  "product_like": false,
  "ecommerce": false,
  "saas": false,
  "confidence": "high",
  "votes": {
    "A": 0,
    "B": 0,
    "C": 0,
    "D": 3,
    "E": 0,
    "F": 0
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-001: Closed-book: site does not answer K3 (What does this organization offer or do?)
- Severity: high
- Evidence: No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 40, 'pages_rendered': 27, 'render_count': 27, 'estimated_pages': 40, 'templates': 20, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 2, 't-2': 1, 't-3': 1, 't-4': 1, 't-5': 5, 't-6': 6, 't-7': 1, 't-8': 4, 't-9': 2, 't-10': 2, 't-11': 2, 't-12': 1, 't-13': 1, 't-14': 4, 't-15': 2, 't-16': 1, 't-17': 1, 't-18': 1, 't-19': 1, 't-20': 1}, 'render_max': 10, 'http_requests': 42, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-002: Closed-book: site does not answer K6 (What does it cost / how is it priced?)
- Severity: medium
- Evidence: No supporting span in crawled corpus for K6. Coverage={'pages_fetched': 40, 'pages_rendered': 27, 'render_count': 27, 'estimated_pages': 40, 'templates': 20, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 2, 't-2': 1, 't-3': 1, 't-4': 1, 't-5': 5, 't-6': 6, 't-7': 1, 't-8': 4, 't-9': 2, 't-10': 2, 't-11': 2, 't-12': 1, 't-13': 1, 't-14': 4, 't-15': 2, 't-16': 1, 't-17': 1, 't-18': 1, 't-19': 1, 't-20': 1}, 'render_max': 10, 'http_requests': 42, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. K6
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001, F-002
- INCOMPLETE AREAS: (none)