# Brand AI readiness audit — www.redcross.org

www.redcross.org audit: 0 critical, 0 high, 0 medium, 1 low findings (coverage: 1 pages fetched).

## Coverage
- Pages fetched: 1
- Pages rendered: 0
- Templates: 1
- Stopped: budget

## Site type
- {
  "cluster": "unknown",
  "secondary": [],
  "ymyl": false,
  "multilingual": false,
  "product_like": false,
  "ecommerce": false,
  "saas": false,
  "confidence": "low",
  "votes": {
    "A": 0,
    "B": 0,
    "C": 0,
    "D": 0,
    "E": 0,
    "F": 0
  }
}

## Limitations
- Y-01: referrer personalization, geo, and returning-visitor behavior are untestable in a stateless crawl.
- Access limitation: https://www.redcross.org/: HTTP 403 (HTTP 403 forbidden (body not used as public brand evidence)). These bodies were not used as brand/answerability evidence.
- Headless render unavailable or skipped; dual-fetch used raw HTML as rendered unless tests injected rendered_html.

## Findings
### F-001: Insufficient evidence: no usable public HTML for closed-book questions
- Severity: low
- Evidence: fetched_pages=0; access_kinds=['forbidden_content']; pages=1. Challenge/WAF/HTTP-error bodies are audit limitations, not missing-brand-content.
- Suggested action: Treat this origin as inaccessible for this audit; do not infer content gaps from block pages.


## Skill outcomes
- SUCCESSFUL SKILLS: site-type-classifier, crawl-access-audit, render-extract-audit, citation-extractability-audit, entity-identity-audit, freshness-audit, ai-answerability-audit, engagement-handoff-audit, corroboration-consistency-audit
- FAILED SKILLS: (none)
- SKIPPED DEPENDENT SKILLS: (none)
- COMPLETED FINDINGS: F-001
- INCOMPLETE AREAS: (none)