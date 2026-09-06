# Brand AI readiness audit — www.gov.uk

www.gov.uk audit: 0 critical, 2 high, 13 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 39
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

## Findings
### F-018: On-site typed facts disagree (prices)
- Severity: high
- Evidence: values=['10000', '25000', '500'] urls=['https://www.gov.uk/government/organisations/disclosure-and-barring-service/about/publication-scheme', 'https://www.gov.uk/government/organisations/disclosure-and-barring-service/about/publication-scheme', 'https://www.gov.uk/government/organisations/disclosure-and-barring-service/about/publication-scheme']
- Suggested action: Reconcile current prices and mark superseded pages (e.g. old press) as historical.

### F-001: YMYL pages lack a named reviewer or license disclosure
- Severity: high
- Evidence: Cluster A lexicon matched; sampled pages have no 'reviewed by' / license strings.
- Suggested action: Add a named reviewer, license, and jurisdiction in visible text on advice pages.

### F-019: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://www.gov.uk/government/organisations/disclosure-and-barring-service/about/accessible-documents-policy: ' documents. When we produce a document, we make sure to: provide a plain text webpage (‘HTML’) '; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.

### F-002: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2025', '2025', '2025', '2025'] schema=['2026-08-21T08:12:22+01:00', '2025-12-19T14:01:25+00:00'] on https://www.gov.uk/contact-child-benefit-office
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-003: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['1979', '2012', '2012', '1948'] schema=['2026-09-04T10:35:03+01:00', '2026-08-20T15:34:57+01:00'] on https://www.gov.uk/government/organisations/department-for-work-pensions/about/complaints-procedure
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-004: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2018', '2024', '2018', '2024'] schema=['2026-09-04T10:32:24+01:00', '2024-01-31T15:33:59+00:00'] on https://www.gov.uk/guidance/contact-the-department-for-work-and-pensions-about-its-policies
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-005: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2018', '2024', '2018', '2024'] schema=['2026-09-04T10:32:24+01:00', '2024-01-31T15:33:59+00:00'] on https://www.gov.uk/guidance/contact-the-department-for-work-and-pensions-about-its-policies.cy
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-006: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['1974', '1974', '1975', '1974'] schema=['2026-08-06T16:18:38+01:00', '2026-06-15T13:03:29+01:00'] on https://www.gov.uk/government/organisations/disclosure-and-barring-service/about
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-007: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2018', '2018', '2018', '2018'] schema=['2026-07-31T15:37:28+01:00', '2025-09-04T13:56:28+01:00'] on https://www.gov.uk/government/organisations/disclosure-and-barring-service/about/accessible-documents-policy
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-008: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2010', '2018', '2025', '2010'] schema=['2026-07-31T15:37:38+01:00', '2025-06-03T17:03:37+01:00'] on https://www.gov.uk/government/organisations/disclosure-and-barring-service/about/equality-and-diversity
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-009: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2000', '2012', '2023', '2024'] schema=['2026-08-05T14:55:03+01:00', '2024-09-30T11:11:47+01:00'] on https://www.gov.uk/government/organisations/disclosure-and-barring-service/about/publication-scheme
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-010: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['1997'] schema=['2026-07-31T15:37:38+01:00', '2025-12-04T11:03:25+00:00'] on https://www.gov.uk/government/organisations/disclosure-and-barring-service/about/welsh-language-scheme
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-011: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2018', '2018'] schema=['2026-07-31T15:37:38+01:00', '2018-06-19T16:20:04+01:00'] on https://www.gov.uk/government/organisations/disclosure-and-barring-service/about/personal-information-charter
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-012: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2025'] schema=['2026-09-02T16:03:47+01:00', '2025-06-01T00:01:01+01:00'] on https://www.gov.uk/help/privacy-notice
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

### F-013: Date signals disagree across visible text and metadata
- Severity: medium
- Evidence: visible years=['2023'] schema=['2026-09-02T16:04:07+01:00', '2023-09-27T15:45:58+01:00'] on https://www.gov.uk/help/about-govuk
- Suggested action: Align dateModified/visible dates or drop fake update stamps.

## Appendix (overflow)
- F-014: Date signals disagree across visible text and metadata
- F-015: Date signals disagree across visible text and metadata
- F-016: Date signals disagree across visible text and metadata
- F-017: Date signals disagree across visible text and metadata

## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-018, F-001, F-019, F-002, F-003, F-004, F-005, F-006, F-007, F-008, F-009, F-010, F-011, F-012, F-013
- INCOMPLETE AREAS: (none)