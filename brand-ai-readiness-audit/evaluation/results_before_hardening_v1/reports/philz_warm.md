# Brand AI readiness audit — www.philzcoffee.com

www.philzcoffee.com audit: 0 critical, 2 high, 0 medium, 1 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 23
- Stopped: early_stop

## Site type
- {
  "cluster": "F",
  "secondary": [],
  "ymyl": false,
  "multilingual": false,
  "product_like": true,
  "ecommerce": true,
  "saas": false,
  "confidence": "high",
  "votes": {
    "A": 0,
    "B": 0,
    "C": 0,
    "D": 0,
    "E": 0,
    "F": 5
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-002: Closed-book: site does not answer K3 (What does this organization offer or do?)
- Severity: high
- Evidence: No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 40, 'templates': 23, 'k_categories_hit': ['K3', 'K6'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 5, 't-2': 3, 't-3': 3, 't-4': 4, 't-5': 3, 't-6': 1, 't-7': 2, 't-8': 1, 't-9': 2, 't-10': 1, 't-11': 2, 't-12': 1, 't-13': 1, 't-14': 1, 't-15': 1, 't-16': 1, 't-17': 2, 't-18': 1, 't-19': 1, 't-20': 1, 't-21': 1, 't-22': 1, 't-23': 1}, 'render_max': 10, 'http_requests': 45, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 1, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-001: On-site typed facts disagree (prices)
- Severity: high
- Evidence: values=['0.00', '10', '100', '12.99', '14.95', '15'] urls=['https://philzcoffee.com/', 'https://philzcoffee.com/', 'https://philzcoffee.com/', 'https://philzcoffee.com/']
- Suggested action: Reconcile current prices and mark superseded pages (e.g. old press) as historical.

### F-003: Deep-ish site sample lacks breadcrumbs and nav landmark
- Severity: low
- Evidence: No breadcrumb/nav landmark on home; not required on a true one-pager.
- Suggested action: Provide persistent wayfinding (nav or breadcrumbs) on hierarchical sites.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-002, F-001, F-003
- INCOMPLETE AREAS: (none)