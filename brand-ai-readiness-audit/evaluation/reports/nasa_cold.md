# Brand AI readiness audit — www.nasa.gov

www.nasa.gov audit: 0 critical, 2 high, 7 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 2
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
- Access limitation: https://www.nasa.gov/centers/glenn/about/history/namechng.html: HTTP 404 (HTTP error document). These bodies were not used as brand/answerability evidence.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.
- Render budget exhausted: render_max=10, performed=10, skipped_budget=29, protected_requests=10. Protected categories affect fetch/render priority only; the cap is hard.

## Findings
### F-002: Brand name looks collision-prone and pages lack an early category/geo disambiguator
- Severity: high
- Evidence: short/common-looking name 'NASA'; no 'we are a {category}' sentence on https://www.nasa.gov/. No web search was used.
- Suggested action: Add an early sentence of the form “{Brand} is a {category} in {geo}.”

### F-001: YMYL pages lack a named reviewer or license disclosure
- Severity: high
- Evidence: Cluster A lexicon matched; sampled pages have no 'reviewed by' / license strings.
- Suggested action: Add a named reviewer, license, and jurisdiction in visible text on advice pages.

### F-009: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://www.nasa.gov/privacy/: 'nsent from the child’s parent. Finally, we provide many on-line tools and services in support of NASA’s mission. A child under 13 years old m'; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.

### F-003: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2012', '1959', '1963'] schema=['2023-07-25T11:19:07-04:00', '2023-07-25T11:19:07-04:00', '2012-02-16T16:30:00Z'] on https://www.nasa.gov/history/glenn-orbits-the-earth/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-004: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2019', '2019', '2019'] schema=['2023-07-26T15:17:08-04:00', '2023-07-26T15:17:08-04:00', '2019-04-09T21:00:00Z'] on https://www.nasa.gov/centers-and-facilities/glenn/from-sky-gazing-to-astronaut-janet-kavandi-reaches-the-astronaut-hall-of-fame/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-005: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2019', '1946', '1946'] schema=['2024-06-28T12:48:33-04:00', '2024-06-28T12:48:33-04:00', '2019-08-29T17:00:00Z'] on https://www.nasa.gov/history/naca-test-pilot-competed-in-cleveland-national-air-races/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-006: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2008', '1947', '1949'] schema=['2024-03-13T14:28:37-04:00', '2024-03-13T14:28:37-04:00', '2008-04-10T22:46:00Z'] on https://www.nasa.gov/centers/glenn/about/history/crashtst.html
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-007: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2012', '1964', '1957'] schema=['2025-05-22T15:52:35-04:00', '2025-05-22T15:52:35-04:00', '2012-12-12T19:56:00Z'] on https://www.nasa.gov/centers/glenn/about/history/centaur.html
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-008: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026', '2013', '1966', '1962'] schema=['2024-03-14T09:38:53-04:00', '2024-03-14T09:38:53-04:00', '2013-03-01T23:13:00Z'] on https://www.nasa.gov/centers/glenn/about/history/centaur_anniv.html
- Suggested action: Align dateModified/visible dates or drop fake update stamps.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-002, F-001, F-009, F-003, F-004, F-005, F-006, F-007, F-008
- INCOMPLETE AREAS: (none)