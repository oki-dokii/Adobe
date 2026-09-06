# Brand AI readiness audit — www.shopify.com

www.shopify.com audit: 1 critical, 2 high, 1 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 40
- Templates: 3
- Stopped: early_stop

## Site type
- {
  "cluster": "F",
  "secondary": [
    "B"
  ],
  "ymyl": false,
  "multilingual": true,
  "product_like": true,
  "ecommerce": true,
  "saas": false,
  "confidence": "high",
  "votes": {
    "A": 0,
    "B": 2,
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
### F-002: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$250,000' vs later qualifier in ement credit on up to US$250,000 of annual eligible purc… / later span on https://www.shopify.com/in/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-001: Price amount is separated from its qualifying condition
- Severity: high
- Evidence: Isolated '$200,000' vs later qualifier in am offers rewards up to $200,000 and bonuses for outstan… / later span on https://www.shopify.com/in/bugbounty/about
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-004: On-site typed facts disagree (prices)
- Severity: high
- Evidence: values=['0', '1', '114', '19', '2.30', '200000'] urls=['https://www.shopify.com/in/about', 'https://www.shopify.com/in/bugbounty/about', 'https://www.shopify.com/in/pricing', 'https://www.shopify.com/in/pricing']
- Suggested action: Reconcile current prices and mark superseded pages (e.g. old press) as historical.

### F-005: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://www.shopify.com/in/legal/privacy: 'vance, unless we are legally forbidden. We help merchants and partners meet their privacy obligations Many of the merchants and partners using Shopify do not ha'; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-002, F-001, F-004, F-005
- INCOMPLETE AREAS: (none)