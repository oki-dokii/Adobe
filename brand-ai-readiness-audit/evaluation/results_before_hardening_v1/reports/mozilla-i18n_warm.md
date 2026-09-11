# Brand AI readiness audit — www.mozilla.org

www.mozilla.org audit: 0 critical, 3 high, 2 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 36
- Templates: 4
- Stopped: early_stop

## Site type
- {
  "cluster": "F",
  "secondary": [],
  "ymyl": false,
  "multilingual": false,
  "product_like": true,
  "ecommerce": false,
  "saas": true,
  "confidence": "medium",
  "votes": {
    "A": 0,
    "B": 0,
    "C": 0,
    "D": 0,
    "E": 0,
    "F": 2
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-002: Price amount is separated from its qualifying condition
- Severity: high
- Evidence: Isolated '$700,000' vs later qualifier in ing annual revenue from $700,000 to over $12 million, ex… / later span on https://www.mozilla.org/en-US/about/leadership/
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-003: Price amount is separated from its qualifying condition
- Severity: high
- Evidence: Isolated '$12' vs later qualifier in e from $700,000 to over $12 million, expanding the … / later span on https://www.mozilla.org/en-US/about/leadership/
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-006: On-site typed facts disagree (prices)
- Severity: high
- Evidence: values=['1', '10', '12', '2', '26', '30'] urls=['https://www.mozilla.org/en-US/about/legal/terms/mozilla/', 'https://www.mozilla.org/en-US/about/legal/terms/subscription-services/', 'https://www.mozilla.org/en-US/about/legal/terms/services/', 'https://www.mozilla.org/en-US/about/legal/terms/mdn-plus/']
- Suggested action: Reconcile current prices and mark superseded pages (e.g. old press) as historical.

### F-001: High-value URL has no inbound links in the crawled graph
- Severity: medium
- Evidence: 0 in-edges for https://www.mozilla.org/about/legal/acceptable-use/. Coverage 40/41. Isolation may be a coverage artifact.
- Suggested action: Add an inbound link from a higher-centrality page to this URL.

### F-007: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://www.mozilla.org/en-US/about/legal/terms/subscription-services/: 'your information. Your Payment Payment. We offer the Services as automatically renewing subscription services. When you sign up for the paid version '; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-002, F-003, F-006, F-001, F-007
- INCOMPLETE AREAS: (none)