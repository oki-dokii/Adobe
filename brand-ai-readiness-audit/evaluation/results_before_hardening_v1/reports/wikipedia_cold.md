# Brand AI readiness audit — www.wikipedia.org

www.wikipedia.org audit: 0 critical, 1 high, 1 medium, 0 low findings (coverage: 1 pages fetched).

## Coverage
- Pages fetched: 1
- Pages rendered: 1
- Templates: 1
- Stopped: budget

## Site type
- {
  "cluster": "unknown",
  "secondary": [],
  "ymyl": false,
  "multilingual": false,
  "product_like": false,
  "ecommerce": false,
  "saas": false,
  "confidence": "low",
  "votes": {
    "A": 0,
    "B": 0,
    "C": 0,
    "D": 0,
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
- Evidence: No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 1, 'pages_rendered': 1, 'render_count': 1, 'estimated_pages': 1, 'templates': 1, 'k_categories_hit': ['K6'], 'stopped_reason': 'budget', 'pages_verified_per_template': {'t-1': 1}, 'render_max': 10, 'http_requests': 4, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-002: Closed-book: site does not answer K13 (How can a human contact the organization?)
- Severity: medium
- Evidence: No supporting span in crawled corpus for K13. Coverage={'pages_fetched': 1, 'pages_rendered': 1, 'render_count': 1, 'estimated_pages': 1, 'templates': 1, 'k_categories_hit': ['K6'], 'stopped_reason': 'budget', 'pages_verified_per_template': {'t-1': 1}, 'render_max': 10, 'http_requests': 4, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001, F-002
- INCOMPLETE AREAS: (none)