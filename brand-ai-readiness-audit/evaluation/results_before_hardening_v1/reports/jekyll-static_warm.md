# Brand AI readiness audit — jekyllrb.com

jekyllrb.com audit: 0 critical, 2 high, 2 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 21
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

## Findings
### F-004: Closed-book: site does not answer K3 (What does this organization offer or do?)
- Severity: high
- Evidence: No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 200, 'templates': 21, 'k_categories_hit': ['K3', 'K6'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 1, 't-2': 11, 't-3': 6, 't-4': 1, 't-5': 1, 't-6': 1, 't-7': 1, 't-8': 4, 't-9': 1, 't-10': 1, 't-11': 1, 't-12': 2, 't-13': 1, 't-14': 1, 't-15': 1, 't-16': 1, 't-17': 1, 't-18': 1, 't-19': 1, 't-20': 1, 't-21': 1}, 'render_max': 10, 'http_requests': 42, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-003: Brand name looks collision-prone and pages lack an early category/geo disambiguator
- Severity: high
- Evidence: short/common-looking name 'Assets'; no 'we are a {category}' sentence on https://jekyllrb.com/docs/assets/. No web search was used.
- Suggested action: Add an early sentence of the form “{Brand} is a {category} in {geo}.”

### F-001: High-value URL has no inbound links in the crawled graph
- Severity: medium
- Evidence: 0 in-edges for https://jekyllrb.com/docs/code_of_conduct/. Coverage 40/200. Isolation may be a coverage artifact.
- Suggested action: Add an inbound link from a higher-centrality page to this URL.

### F-002: High-value URL has no inbound links in the crawled graph
- Severity: medium
- Evidence: 0 in-edges for https://jekyllrb.com/docs/history/. Coverage 40/200. Isolation may be a coverage artifact.
- Suggested action: Add an inbound link from a higher-centrality page to this URL.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-004, F-003, F-001, F-002
- INCOMPLETE AREAS: (none)