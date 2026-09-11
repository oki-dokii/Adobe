# Brand AI readiness audit — www.taniarascia.com

www.taniarascia.com audit: 0 critical, 1 high, 1 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 11
- Templates: 28
- Stopped: early_stop

## Site type
- {
  "cluster": "D",
  "secondary": [
    "F"
  ],
  "ymyl": false,
  "multilingual": false,
  "product_like": true,
  "ecommerce": false,
  "saas": true,
  "confidence": "high",
  "votes": {
    "A": 0,
    "B": 0,
    "C": 0,
    "D": 3,
    "E": 0,
    "F": 2
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-002: Closed-book: site does not answer K3 (What does this organization offer or do?)
- Severity: high
- Evidence: No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 40, 'pages_rendered': 11, 'render_count': 11, 'estimated_pages': 200, 'templates': 28, 'k_categories_hit': ['K3', 'K6'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 2, 't-2': 6, 't-3': 1, 't-4': 1, 't-5': 1, 't-6': 2, 't-7': 2, 't-8': 3, 't-9': 1, 't-10': 1, 't-11': 1, 't-12': 1, 't-13': 1, 't-14': 1, 't-15': 1, 't-16': 1, 't-17': 1, 't-18': 1, 't-19': 1, 't-20': 1, 't-21': 1, 't-22': 1, 't-23': 1, 't-24': 3, 't-25': 1, 't-26': 1, 't-27': 1, 't-28': 1}, 'render_max': 10, 'http_requests': 43, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-001: Organization sameAs URL returns 404
- Severity: medium
- Evidence: https://bsky.app/profile/tania.dev status=404
- Suggested action: Fix or remove dead sameAs URLs.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-002, F-001
- INCOMPLETE AREAS: (none)