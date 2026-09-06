# Brand AI readiness audit — www.bbc.com

www.bbc.com audit: 0 critical, 2 high, 3 medium, 0 low findings (coverage: 40 pages fetched).

## Coverage
- Pages fetched: 40
- Pages rendered: 13
- Templates: 33
- Stopped: early_stop

## Site type
- {
  "cluster": "A",
  "secondary": [],
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
    "D": 0,
    "E": 0,
    "F": 0
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Dual-fetch used the production renderer (noscript/template expansion and/or injected DOM). No claim is made that wall-clock stays under 5 minutes.

## Findings
### F-004: On-site typed facts disagree (prices)
- Severity: high
- Evidence: values=['1', '1.95', '110', '12000', '14000', '15000'] urls=['https://www.bbc.com/business', 'https://www.bbc.com/business', 'https://www.bbc.com/business', 'https://www.bbc.com/business']
- Suggested action: Reconcile current prices and mark superseded pages (e.g. old press) as historical.

### F-001: YMYL pages lack a named reviewer or license disclosure
- Severity: high
- Evidence: Cluster A lexicon matched; sampled pages have no 'reviewed by' / license strings.
- Suggested action: Add a named reviewer, license, and jurisdiction in visible text on advice pages.

### F-002: AI crawler tokens are disallowed while Googlebot is allowed
- Severity: medium
- Evidence: Disallowed tokens: GPTBot, ChatGPT-User, Google-Extended, anthropic-ai, ClaudeBot, PerplexityBot, Bytespider, CCBot, Applebot-Extended. This may be intentional.
- Suggested action: If public AI citation is desired, allow the relevant AI user-agents on citable paths; keep admin/search disallowed.

### F-003: High-value URL has no inbound links in the crawled graph
- Severity: medium
- Evidence: 0 in-edges for https://www.bbc.com/home. Coverage 40/200. Isolation may be a coverage artifact.
- Suggested action: Add an inbound link from a higher-centrality page to this URL.

### F-005: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://www.bbc.com/pages/privacy-policy: 'h Broadcasting Corporation (the ‘BBC’). We are a global business operating as BBC Studios Distribution, BBC Studios Productions, and BBC Globa'; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-004, F-001, F-002, F-003, F-005
- INCOMPLETE AREAS: (none)