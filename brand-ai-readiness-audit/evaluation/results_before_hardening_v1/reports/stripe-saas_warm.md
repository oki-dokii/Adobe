# Brand AI readiness audit — stripe.com

stripe.com audit: 7 critical, 1 high, 6 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 39
- Templates: 20
- Stopped: early_stop

## Site type
- {
  "cluster": "F",
  "secondary": [
    "D",
    "B"
  ],
  "ymyl": false,
  "multilingual": false,
  "product_like": true,
  "ecommerce": true,
  "saas": false,
  "confidence": "high",
  "votes": {
    "A": 0,
    "B": 2,
    "C": 0,
    "D": 3,
    "E": 0,
    "F": 5
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-001: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$500' vs later qualifier in  we're on track to pass $500 million of annual recur… / later span on https://stripe.com/sessions/2024/product-roadmap-revenue-and-finance-automation
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-002: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$3' vs later qualifier in  to a revenue impact of $3.4 billion for these bus… / later span on https://stripe.com/sessions/2024/product-roadmap-revenue-and-finance-automation
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-003: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$50' vs later qualifier in  it’ll be, for example, $50 a month and it’ll have … / later span on https://stripe.com/sessions/2025/product-roadmap-revenue-billing-tax-and-data
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-004: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$50' vs later qualifier in gebacks cost businesses $50 billion every year, and… / later span on https://stripe.com/sessions/2025/product-roadmap-payments
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-005: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$1' vs later qualifier in etwork. We process over $1.4 trillion annually acr… / later span on https://stripe.com/sessions/2025/product-roadmap-payments
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-008: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '100 USD' vs later qualifier in ide the product price ( 100 USD ) by the exchange rate … / later span on https://docs.stripe.com/payments/currencies/localize-prices/fx-quotes-api#pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-009: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '94.29 EUR' vs later qualifier in nclusive of the FX fee: 94.29 EUR . If you don’t want to … / later span on https://docs.stripe.com/payments/currencies/localize-prices/fx-quotes-api#pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-021: On-site typed facts disagree (prices)
- Severity: high
- Evidence: values=['0.30', '0.86', '0.88', '1', '1.00', '1.05'] urls=['https://stripe.com/in/sessions/2024/product-roadmap-revenue-and-finance-automation', 'https://stripe.com/in/sessions/2024/product-roadmap-revenue-and-finance-automation', 'https://stripe.com/in/sessions/2024/product-roadmap-revenue-and-finance-automation', 'https://stripe.com/in/sessions/2024/product-roadmap-revenue-and-finance-automation']
- Suggested action: Reconcile current prices and mark superseded pages (e.g. old press) as historical.

### F-006: Data table lacks header cells
- Severity: medium
- Evidence: table has_th=false on https://docs.stripe.com/api/prices/create#create_price-product_data
- Suggested action: Add <th> or scope attributes so cells keep units/labels.

### F-011: Data table lacks header cells
- Severity: medium
- Evidence: table has_th=false on https://docs.stripe.com/api/prices/object#price_object-active
- Suggested action: Add <th> or scope attributes so cells keep units/labels.

### F-015: Data table lacks header cells
- Severity: medium
- Evidence: table has_th=false on https://docs.stripe.com/api/prices
- Suggested action: Add <th> or scope attributes so cells keep units/labels.

### F-018: Data table lacks header cells
- Severity: medium
- Evidence: table has_th=false on https://docs.stripe.com/api/prices/list
- Suggested action: Add <th> or scope attributes so cells keep units/labels.

### F-019: Data table lacks header cells
- Severity: medium
- Evidence: table has_th=false on https://docs.stripe.com/api/prices/update
- Suggested action: Add <th> or scope attributes so cells keep units/labels.

### F-022: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://stripe.com/sessions/2024/product-roadmap-revenue-and-finance-automation: "ear and beyond. So let's start with how we help businesses grow faster with Stripe Billing . I'd like to turn it over to Shankar, t"; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001, F-002, F-003, F-004, F-005, F-008, F-009, F-021, F-006, F-011, F-015, F-018, F-019, F-022
- INCOMPLETE AREAS: (none)