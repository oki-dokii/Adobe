# Brand AI readiness audit — www.bbc.com

www.bbc.com audit: 0 critical, 3 high, 3 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 10
- Templates: 16
- Stopped: early_stop

## Site type
- {
  "cluster": "A",
  "secondary": [
    "D"
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
    "C": 0,
    "D": 3,
    "E": 0,
    "F": 0
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-003: Price amount is separated from its qualifying condition
- Severity: high
- Evidence: Isolated '$1' vs later qualifier in ia's avocado boom Trump $1 coin makes him first li… / later span on https://www.bbc.com/
- Suggested action: Put the amount and its condition in one self-contained sentence.

### F-004: On-site typed facts disagree (prices)
- Severity: high
- Evidence: values=['1', '1.95'] urls=['https://www.bbc.com/', 'https://www.bbc.com/']
- Suggested action: Reconcile current prices and mark superseded pages (e.g. old press) as historical.

### F-001: YMYL pages lack a named reviewer or license disclosure
- Severity: high
- Evidence: Cluster A lexicon matched; sampled pages have no 'reviewed by' / license strings.
- Suggested action: Add a named reviewer, license, and jurisdiction in visible text on advice pages.

### F-002: AI crawler tokens are disallowed while Googlebot is allowed
- Severity: medium
- Evidence: Disallowed tokens: GPTBot, ChatGPT-User, Google-Extended, anthropic-ai, ClaudeBot, PerplexityBot, Bytespider, CCBot, Applebot-Extended. This may be intentional.
- Suggested action: If public AI citation is desired, allow the relevant AI user-agents on citable paths; keep admin/search disallowed.

### F-005: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://www.bbc.com/pages/privacy-policy: 'h Broadcasting Corporation (the ‘BBC’). We are a global business operating as BBC Studios Distribution, BBC Studios Productions, and BBC Globa'; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.

### F-006: First viewport text may not identify the brand
- Severity: medium
- Evidence: Title 'BBC Home - Breaking News, World News, US News, Sports, Business, Innovation, Climate, Culture, Travel, Video & AudioBritish Broadcasting CorporationBritish Broadcasting Corporation' not in first 400 chars; no H1. Heuristic 640×700 not device-tested.
- Suggested action: Place brand + category in the first viewport as visible text.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-003, F-004, F-001, F-002, F-005, F-006
- INCOMPLETE AREAS: (none)