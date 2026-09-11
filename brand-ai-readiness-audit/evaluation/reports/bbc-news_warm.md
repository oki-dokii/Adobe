# Brand AI readiness audit — www.bbc.com

www.bbc.com audit: 0 critical, 1 high, 4 medium, 0 low findings (coverage: 40 pages fetched).

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
- Render budget exhausted: render_max=10, performed=10, skipped_budget=30, protected_requests=1. Protected categories affect fetch/render priority only; the cap is hard.

## Findings
### F-001: YMYL pages lack a named reviewer or license disclosure
- Severity: high
- Evidence: Cluster A lexicon matched; sampled pages have no 'reviewed by' / license strings.
- Suggested action: Add a named reviewer, license, and jurisdiction in visible text on advice pages.

### F-002: AI crawler tokens are disallowed while Googlebot is allowed
- Severity: medium
- Evidence: Disallowed tokens: GPTBot, ChatGPT-User, Google-Extended, anthropic-ai, ClaudeBot, PerplexityBot, Bytespider, CCBot, Applebot-Extended. This may be intentional.
- Suggested action: If public AI citation is desired, allow the relevant AI user-agents on citable paths; keep admin/search disallowed.

### F-004: Closed-book: site does not answer K6 (What does it cost / how is it priced?)
- Severity: medium
- Evidence: No supporting span in crawled corpus for K6. Coverage={'pages_fetched': 40, 'pages_content_usable': 40, 'pages_rendered': 10, 'render_count': 10, 'estimated_pages': 200, 'templates': 16, 'k_categories_hit': ['K3'], 'stopped_reason': 'early_stop', 'pages_verified_per_template': {'t-1': 1, 't-2': 1, 't-3': 1, 't-4': 13, 't-5': 8, 't-6': 2, 't-7': 3, 't-8': 2, 't-9': 2, 't-10': 1, 't-11': 1, 't-12': 1, 't-13': 1, 't-14': 1, 't-15': 1, 't-16': 1}, 'render_max': 10, 'renders_requested': 40, 'renders_performed': 10, 'renders_skipped_budget': 30, 'protected_render_requests': 1, 'protected_render_exceptions': 0, 'access_kinds': {'ok': 40}, 'http_requests': 43, 'robots_status': 'ok', 'timeout_count': 0, 'redirect_hops_total': 0, 'ssrf_blocks': 0}. K6
- Suggested action: Add a visible, extractable sentence that answers this question on the intent-matched page.

### F-003: K3 is answered on an inner page, not the likely landing page
- Severity: medium
- Evidence: Span on https://www.bbc.com/pages/privacy-policy: 'h Broadcasting Corporation (the ‘BBC’). We are a global business operating as BBC Studios Distribution, BBC Studios Productions, and BBC Globa'; homepage lacks it.
- Suggested action: Put the answer on the query-landing page or make that inner URL the obvious canonical answer.

### F-005: First viewport text may not identify the brand
- Severity: medium
- Evidence: Title 'BBC Home - Breaking News, World News, US News, Sports, Business, Innovation, Climate, Culture, Travel, Video & AudioBritish Broadcasting CorporationBritish Broadcasting Corporation' not in first 400 chars; no H1. Heuristic 640×700 not device-tested.
- Suggested action: Place brand + category in the first viewport as visible text.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001, F-002, F-004, F-003, F-005
- INCOMPLETE AREAS: (none)