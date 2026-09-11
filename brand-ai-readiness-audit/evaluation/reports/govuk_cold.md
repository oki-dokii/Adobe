# Brand AI readiness audit — www.gov.uk

www.gov.uk audit: 0 critical, 1 high, 14 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 8
- Stopped: early_stop

## Site type
- {
  "cluster": "A",
  "secondary": [
    "C"
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
    "E": 0,
    "F": 0
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.
- Render budget exhausted: render_max=10, performed=10, skipped_budget=30, protected_requests=33. Protected categories affect fetch/render priority only; the cap is hard.

## Findings
### F-001: YMYL pages lack a named reviewer or license disclosure
- Severity: high
- Evidence: Cluster A lexicon matched; sampled pages have no 'reviewed by' / license strings.
- Suggested action: Add a named reviewer, license, and jurisdiction in visible text on advice pages.

### F-023: Closed-book: site does not answer K6 (What does it cost / how is it priced?)
- Severity: medium
- Evidence: No supporting span in crawled corpus for K6. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 40, 'templates': 8, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 1, 't-2': 2, 't-3': 1, 't-4': 20, 't-5': 9, 't-6': 1, 't-7': 5, 't-8': 1}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 33, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 65, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 13, 'ssrf_blocks': 0}. K6
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-022: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://www.gov.uk/government/organisations/department-for-work-pensions/about: 'ring against our objectives. Who we are We provide our services in a number of ways, for example through J'; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.

### F-002: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2025', '2025', '2025', '2025'] schema=['2026-08-14T18:31:16+01:00', '2025-06-30T09:07:49+01:00'] on https://www.gov.uk/government/organisations/hm-revenue-customs/contact/tax-credits-agent-priority-line
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-003: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2025', '2025', '1900', '2025'] schema=['2026-08-14T19:01:31+01:00', '2025-12-19T15:22:09+00:00'] on https://www.gov.uk/government/organisations/hm-revenue-customs/contact/welsh-language-helplines
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-004: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2025', '2025'] schema=['2026-08-14T18:59:16+01:00', '2025-05-14T17:51:58+01:00'] on https://www.gov.uk/government/organisations/hm-revenue-customs/contact/agent-dedicated-line-debt-management
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-005: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2025', '2025'] schema=['2026-08-14T18:52:47+01:00', '2025-05-14T17:51:31+01:00'] on https://www.gov.uk/government/organisations/hm-revenue-customs/contact/central-agent-authorisation-team
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-006: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2025', '2025', '2025', '2025'] schema=['2026-08-14T18:39:14+01:00', '2025-12-19T15:23:35+00:00'] on https://www.gov.uk/government/organisations/hm-revenue-customs/contact/vat-customs-and-excise-and-duties-enquiries-for-welsh-speaking-customers
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-007: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2025', '1900', '1900', '2025'] schema=['2026-08-14T18:56:01+01:00', '2025-05-16T09:38:43+01:00'] on https://www.gov.uk/government/organisations/hm-revenue-customs/contact/budd-dal-plant-ymholiadau-cyffredinol
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-008: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['1979', '2012', '2012', '1948'] schema=['2026-09-04T10:35:03+01:00', '2026-08-20T15:34:57+01:00'] on https://www.gov.uk/government/organisations/department-for-work-pensions/about/complaints-procedure
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-009: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['1979', '2012', '2012', '1948'] schema=['2026-09-04T10:35:03+01:00', '2026-08-20T15:34:57+01:00'] on https://www.gov.uk/government/organisations/department-for-work-pensions/about/complaints-procedure.cy
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-010: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2018', '2024', '2018', '2024'] schema=['2026-09-04T10:32:24+01:00', '2024-01-31T15:33:59+00:00'] on https://www.gov.uk/guidance/contact-the-department-for-work-and-pensions-about-its-policies
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-011: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2023', '2025', '2022', '2023'] schema=['2026-09-04T10:35:04+01:00', '2023-11-02T09:30:01+00:00'] on https://www.gov.uk/government/organisations/department-for-work-pensions/about
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-012: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2018', '2018', '2018', '2018'] schema=['2026-09-04T10:36:15+01:00', '2021-09-13T13:37:25+01:00'] on https://www.gov.uk/government/organisations/department-for-work-pensions/about/accessible-documents-policy
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-013: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2023', '2025', '2010', '2014'] schema=['2026-09-04T10:35:02+01:00', '2024-04-22T10:22:13+01:00'] on https://www.gov.uk/government/organisations/department-for-work-pensions/about/equality-and-diversity
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

## Appendix (overflow)
- F-014: Date signals disagree across visible text and metadata
- F-015: Date signals disagree across visible text and metadata
- F-016: Date signals disagree across visible text and metadata
- F-017: Date signals disagree across visible text and metadata
- F-018: Date signals disagree across visible text and metadata
- F-019: Date signals disagree across visible text and metadata
- F-020: Date signals disagree across visible text and metadata
- F-021: Date signals disagree across visible text and metadata

## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001, F-023, F-022, F-002, F-003, F-004, F-005, F-006, F-007, F-008, F-009, F-010, F-011, F-012, F-013
- INCOMPLETE AREAS: (none)