# Brand AI readiness audit — stripe.com

stripe.com audit: 15 critical, 0 high, 0 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 7
- Stopped: early_stop

## Site type
- {
  "cluster": "F",
  "secondary": [
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
    "D": 0,
    "E": 0,
    "F": 5
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.
- Render budget exhausted: render_max=10, performed=10, skipped_budget=30, protected_requests=40. Protected categories affect fetch/render priority only; the cap is hard.

## Findings
### F-001: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$0.30' vs later qualifier in es include GST. 1.7% + A$0.30 for domestic cards* 3.5… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-002: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$0.30' vs later qualifier in domestic cards* 3.5% + A$0.30 for international cards… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-003: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$10.00' vs later qualifier in mer portal on Stripe. US$10.00 per month Learn more Po… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-005: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$0.10' vs later qualifier in erson payments. 1.7% + A$0.10 for domestic cards* 3.5… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-006: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$0.10' vs later qualifier in domestic cards* 3.5% + A$0.10 for international cards… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-007: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$0.15' vs later qualifier in  cards* +
  
  
  
    A$0.15 per authorisation for T… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-008: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$0.07' vs later qualifier in  to Pay +
  
  
  
    A$0.07 per authorisation for o… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-009: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$89.00' vs later qualifier in d management at scale. A$89.00 BBPOS WisePad 3 Excl. G… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-010: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$449.00' vs later qualifier in OS WisePad 3 Excl. GST A$449.00 Stripe Reader S710 Excl… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-011: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$449.00' vs later qualifier in  Reader S710 Excl. GST A$449.00 Stripe Reader S700 Excl… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-012: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$469.00' vs later qualifier in  Reader S700 Excl. GST A$469.00 Stripe Reader T600 Excl… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-013: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$23.00' vs later qualifier in y for free for 30 days A$23.00 per month Annual subscr… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-014: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$101.00' vs later qualifier in y for free for 30 days A$101.00 per month Annual subscr… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-015: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '$500.00' vs later qualifier in r 83(b) tax election. US$500.00 one-off setup fee (incl… / later span on https://stripe.com/au/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-016: Price amount is separated from its qualifying condition
- Severity: critical
- Evidence: Isolated '€0.25' vs later qualifier in internationally. 2.5% + €0.25 for UK cards +
  
  
  … / later span on https://stripe.com/en-at/pricing
- Suggested action: Put the amount and its condition in one self-contained sentence.

## Appendix (overflow)
- F-017: Price amount is separated from its qualifying condition
- F-018: Price amount is separated from its qualifying condition
- F-019: Price amount is separated from its qualifying condition
- F-020: Price amount is separated from its qualifying condition
- F-021: Price amount is separated from its qualifying condition
- F-023: Price amount is separated from its qualifying condition
- F-024: Price amount is separated from its qualifying condition
- F-025: Price amount is separated from its qualifying condition
- F-026: Price amount is separated from its qualifying condition
- F-027: Price amount is separated from its qualifying condition
- F-028: Price amount is separated from its qualifying condition
- F-029: Price amount is separated from its qualifying condition
- F-030: Price amount is separated from its qualifying condition
- F-031: Price amount is separated from its qualifying condition
- F-032: Price amount is separated from its qualifying condition
- F-033: Price amount is separated from its qualifying condition
- F-034: Price amount is separated from its qualifying condition
- F-035: Price amount is separated from its qualifying condition
- F-036: Price amount is separated from its qualifying condition
- F-043: Price amount is separated from its qualifying condition
- F-048: Price amount is separated from its qualifying condition
- F-049: Price amount is separated from its qualifying condition
- F-050: Price amount is separated from its qualifying condition
- F-054: Price amount is separated from its qualifying condition
- F-055: Price amount is separated from its qualifying condition
- F-058: Price amount is separated from its qualifying condition
- F-061: Price amount is separated from its qualifying condition
- F-062: Price amount is separated from its qualifying condition
- F-065: Price amount is separated from its qualifying condition
- F-066: Price amount is separated from its qualifying condition
- F-067: Price amount is separated from its qualifying condition
- F-068: Price amount is separated from its qualifying condition
- F-069: Price amount is separated from its qualifying condition
- F-070: Price amount is separated from its qualifying condition
- F-071: Price amount is separated from its qualifying condition
- F-072: Price amount is separated from its qualifying condition
- F-077: Price amount is separated from its qualifying condition
- F-099: Price amount is separated from its qualifying condition
- F-100: Price amount is separated from its qualifying condition
- F-101: Price amount is separated from its qualifying condition
- F-102: Price amount is separated from its qualifying condition
- F-103: Price amount is separated from its qualifying condition
- F-104: Price amount is separated from its qualifying condition
- F-106: Price amount is separated from its qualifying condition
- F-107: Price amount is separated from its qualifying condition
- F-108: Price amount is separated from its qualifying condition
- F-109: Price amount is separated from its qualifying condition
- F-110: Price amount is separated from its qualifying condition
- F-111: Price amount is separated from its qualifying condition
- F-112: Price amount is separated from its qualifying condition
- F-113: Price amount is separated from its qualifying condition
- F-114: Price amount is separated from its qualifying condition
- F-115: Price amount is separated from its qualifying condition
- F-116: Price amount is separated from its qualifying condition
- F-117: Price amount is separated from its qualifying condition
- F-118: Price amount is separated from its qualifying condition
- F-121: Price amount is separated from its qualifying condition
- F-122: Price amount is separated from its qualifying condition
- F-123: Price amount is separated from its qualifying condition
- F-124: Price amount is separated from its qualifying condition
- F-125: Price amount is separated from its qualifying condition
- F-126: Price amount is separated from its qualifying condition
- F-127: Price amount is separated from its qualifying condition
- F-128: Price amount is separated from its qualifying condition
- F-129: Price amount is separated from its qualifying condition
- F-146: Price amount is separated from its qualifying condition
- F-150: Price amount is separated from its qualifying condition
- F-153: Price amount is separated from its qualifying condition
- F-154: Price amount is separated from its qualifying condition
- F-155: Price amount is separated from its qualifying condition
- F-171: Price amount is separated from its qualifying condition
- F-172: Price amount is separated from its qualifying condition
- F-175: Price amount is separated from its qualifying condition
- F-176: Price amount is separated from its qualifying condition
- F-181: Price amount is separated from its qualifying condition
- F-207: Closed-book: site does not answer K3 (What does this organization offer or do?)
- F-206: On-site typed facts disagree (prices)

## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001, F-002, F-003, F-005, F-006, F-007, F-008, F-009, F-010, F-011, F-012, F-013, F-014, F-015, F-016
- INCOMPLETE AREAS: (none)