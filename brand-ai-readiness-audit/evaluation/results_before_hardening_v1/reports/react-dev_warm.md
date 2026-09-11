# Brand AI readiness audit — react.dev

react.dev audit: 0 critical, 0 high, 1 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 40
- Stopped: early_stop

## Site type
- {
  "cluster": "D",
  "secondary": [
    "E",
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
    "E": 2,
    "F": 2
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-001: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more: 'till exploring, and we’ll share more as we make progress. For more information on what Activity '; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001
- INCOMPLETE AREAS: (none)