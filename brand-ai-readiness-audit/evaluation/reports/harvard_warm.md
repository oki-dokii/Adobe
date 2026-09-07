# Brand AI readiness audit — www.harvard.edu

www.harvard.edu audit: 0 critical, 1 high, 14 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 14
- Stopped: early_stop

## Site type
- {
  "cluster": "C",
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
    "C": 3,
    "D": 0,
    "E": 0,
    "F": 0
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.
- Render budget exhausted: render_max=10, performed=10, skipped_budget=30, protected_requests=27. Protected categories affect fetch/render priority only; the cap is hard.

## Findings
### F-015: Closed-book: site does not answer K3 (What does this organization offer or do?)
- Severity: high
- Evidence: No supporting span in crawled corpus for K3. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 200, 'templates': 14, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 6, 't-2': 9, 't-3': 6, 't-4': 5, 't-5': 3, 't-6': 3, 't-7': 1, 't-8': 1, 't-9': 1, 't-10': 1, 't-11': 1, 't-12': 1, 't-13': 1, 't-14': 1}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 27, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 60, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 6, 'ssrf_blocks': 0}. 
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-016: Closed-book: site does not answer K6 (What does it cost / how is it priced?)
- Severity: medium
- Evidence: No supporting span in crawled corpus for K6. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 200, 'templates': 14, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 6, 't-2': 9, 't-3': 6, 't-4': 5, 't-5': 3, 't-6': 3, 't-7': 1, 't-8': 1, 't-9': 1, 't-10': 1, 't-11': 1, 't-12': 1, 't-13': 1, 't-14': 1}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 27, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 60, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 6, 'ssrf_blocks': 0}. K6
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-001: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2013', '2013', '1990', '1986'] schema=['2024-04-17T15:30:35+00:00'] on https://www.harvard.edu/about/history/nobel-laureates/chemistry/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-002: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['1995', '1966', '1995', '2006'] schema=['2024-04-17T17:00:51+00:00'] on https://www.harvard.edu/about/history/nobel-laureates/literature/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-003: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['1985', '1980', '1950', '1948'] schema=['2024-04-17T17:05:18+00:00'] on https://www.harvard.edu/about/history/nobel-laureates/peace/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-004: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2023', '2019', '2019', '2016'] schema=['2024-04-23T14:59:21+00:00'] on https://www.harvard.edu/about/history/nobel-laureates/economic-sciences/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-005: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2005', '1956', '2002', '1973'] schema=['2024-04-23T15:18:36+00:00'] on https://www.harvard.edu/about/history/nobel-laureates/physics/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-006: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026'] schema=['2025-09-16T13:08:58+00:00'] on https://www.harvard.edu/about/harvard-in-the-world/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-007: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2024', '2024', '1984', '1992'] schema=['2026-03-24T14:14:09+00:00'] on https://www.harvard.edu/about/history/nobel-laureates/medicine/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-008: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2025', '2025', '2025', '2025'] schema=['2026-03-25T15:04:42+00:00'] on https://www.harvard.edu/about/endowment/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-009: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2022', '2022', '1936', '1982'] schema=['2026-07-31T19:26:16+00:00'] on https://www.harvard.edu/about/history/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-010: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2010', '1901', '1903', '1903'] schema=['2026-07-31T19:37:23+00:00'] on https://www.harvard.edu/about/history/timeline/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-011: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2010', '1901', '1903', '1903'] schema=['2026-07-31T19:37:23+00:00'] on https://www.harvard.edu/about/history/timelinehttps://www.harvard.edu/about/history/timeline#1700s
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-012: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026'] schema=['2025-09-16T13:08:58+00:00'] on https://www.harvard.edu/about-harvard/harvard-in-the-world/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-013: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2026'] schema=['2025-06-24T17:34:28+00:00'] on https://www.harvard.edu/academics/professional-and-lifelong-learning/
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

## Appendix (overflow)
- F-014: Date signals disagree across visible text and metadata

## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-015, F-016, F-001, F-002, F-003, F-004, F-005, F-006, F-007, F-008, F-009, F-010, F-011, F-012, F-013
- INCOMPLETE AREAS: (none)