# Brand AI readiness audit — www.nasa.gov

www.nasa.gov audit: 0 critical, 3 high, 8 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 19
- Templates: 3
- Stopped: early_stop

## Site type
- {
  "cluster": "A",
  "secondary": [
    "C",
    "E"
  ],
  "ymyl": true,
  "multilingual": false,
  "product_like": false,
  "ecommerce": false,
  "saas": false,
  "confidence": "high",
  "votes": {
    "A": 3,
    "B": 0,
    "C": 3,
    "D": 0,
    "E": 2,
    "F": 0
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-011: Closed-book: site does not answer K3 (What does this organization offer or do?)
- Severity: high
- Evidence: No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 40, 'pages_rendered': 19, 'render_count': 19, 'estimated_pages': 200, 'templates': 3, 'k_categories_hit': ['K3', 'K6'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 37, 't-2': 1, 't-3': 2}, 'render_max': 10, 'http_requests': 64, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 20, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-010: On-site typed facts disagree (prices)
- Severity: high
- Evidence: values=['1', '2'] urls=['https://www.nasa.gov/about-glenn-research-center/', 'https://www.nasa.gov/history/centaur-launched-a-generation-of-interplanetary-missions/']
- Suggested action: Reconcile current prices and mark superseded pages (e.g. old press) as historical.

### F-001: YMYL pages lack a named reviewer or license disclosure
- Severity: high
- Evidence: Cluster A lexicon matched; sampled pages have no 'reviewed by' / license strings.
- Suggested action: Add a named reviewer, license, and jurisdiction in visible text on advice pages.

### F-002: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2012', '1959', '1963'] schema=['2023-07-25T11:19:07-04:00', '2023-07-25T11:19:07-04:00', '2012-02-16T16:30:00Z'] on https://www.nasa.gov/history/glenn-orbits-the-earth/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-003: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2019', '2019', '2019'] schema=['2023-07-26T15:17:08-04:00', '2023-07-26T15:17:08-04:00', '2019-04-09T21:00:00Z'] on https://www.nasa.gov/centers-and-facilities/glenn/from-sky-gazing-to-astronaut-janet-kavandi-reaches-the-astronaut-hall-of-fame/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-004: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2019', '1946', '1946'] schema=['2024-06-28T12:48:33-04:00', '2024-06-28T12:48:33-04:00', '2019-08-29T17:00:00Z'] on https://www.nasa.gov/history/naca-test-pilot-competed-in-cleveland-national-air-races/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-005: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2008', '1947', '1949'] schema=['2024-03-13T14:28:37-04:00', '2024-03-13T14:28:37-04:00', '2008-04-10T22:46:00Z'] on https://www.nasa.gov/centers/glenn/about/history/crashtst.html
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-006: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2012', '1964', '1957'] schema=['2025-05-22T15:52:35-04:00', '2025-05-22T15:52:35-04:00', '2012-12-12T19:56:00Z'] on https://www.nasa.gov/centers/glenn/about/history/centaur.html
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-007: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2013', '1966', '1962'] schema=['2024-03-14T09:38:53-04:00', '2024-03-14T09:38:53-04:00', '2013-03-01T23:13:00Z'] on https://www.nasa.gov/centers/glenn/about/history/centaur_anniv.html
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-008: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2015', '1915', '1958'] schema=['2024-06-28T12:59:27-04:00', '2024-06-28T12:59:27-04:00', '2015-03-06T19:48:00Z'] on https://www.nasa.gov/aeronautics/airplanes-or-langleys-and-other-tales-of-the-naca/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-009: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2019', '1969', '1958'] schema=['2023-09-20T07:33:44-04:00', '2023-09-20T07:33:44-04:00', '2019-07-24T16:17:00Z'] on https://www.nasa.gov/aeronautics/apollo-11s-return-to-earth-rooted-in-aeronautics-research/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-011, F-010, F-001, F-002, F-003, F-004, F-005, F-006, F-007, F-008, F-009
- INCOMPLETE AREAS: (none)