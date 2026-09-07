# crawl-access-audit

## 1. Purpose
Detect gate-1 failures: a compliant crawler cannot reach or is told not to fetch public, citable URLs.

## 2. Scope
DNS/TLS/HTTP, redirects/loops, RFC 9309 robots including AI tokens, meta/X-Robots, canonicals, sitemaps, orphans/depth, faceted traps, URL duplication.

## 3. Non-Goals
JS completeness; content quality; treating all Disallow as defects (U8).

## 4. Research Basis
C clusters I–XI; C-01..C-04; AE-02; L canonical overlap; HO-008.

## 5. Problem
If fetch fails or policy blocks, later quality is irrelevant.

## 6. Mechanism
HTTP clients abort on transport failure; RFC 9309 5xx robots fail-closed; faceted URL spaces consume crawl budget.

## 7. Inputs
CrawlResult, robots, graph.

## 8. Outputs
Findings per defect class; metrics hop counts, token matrix.

## 9. Preconditions
http_client + robots_policy ran (or failed visibly).

## 10. Procedure
1. Classify origin transport.
2. Parse robots; evaluate 4xx vs 5xx.
3. Token matrix for known AI UAs (from references, not hardcoded as “must allow”).
4. Sample redirects; detect loops.
5. Sitemap vs link-graph orphans.
6. Facet/param explosion heuristics.
7. Canonical conflicts.
8. Apply U8 before firing Disallow findings.

## 11. Deterministic Checks
| ID | Name | Op | Failure |
|----|------|----|---------|
| C-D1 | DNS/TLS | handshake | NXDOMAIN/expired/incomplete chain |
| C-D2 | robots 5xx | status>=500 | fail-closed Critical |
| C-D3 | robots 4xx | 4xx | fail-open, not a defect |
| C-D4 | redirect loop | cycle | Critical |
| C-D5 | single hop https | 1 hop | not a defect |
| C-D6 | AI token Disallow | path match | High if unique public content; else U8 |
| C-D7 | noindex on home | meta | High |
| C-D8 | facet cardinality | param combos | Medium if trap-like |

## 12. Semantic / LLM Checks
Only: “does this Disallow path look like unique public content vs admin/search?” Allowed: public_unique | internal_junk | uncertain→no High.

## 13. Metrics
`tls_days_to_expiry`; `redirect_hops_max`; `ai_tokens_blocked[]`; `orphan_count_est`.

## 14. Confidence
High for transport/RFC; medium for orphan estimates.

## 15. Severity
Critical: total down, cert fail, robots 5xx, home noindex, loops. High: AI bots blocked on unique content. Low: missing sitemap.

## 16–18. FP/FN/Exceptions
U8; geo TLS FN; deep docs vs traps.

## 19. Root-Cause
Policy vs outage labeled separately (Chain 3).

## 20. Evidence
Status codes, cert dates, robots snippet, example URLs.

## 21. Remediation
WHAT/WHERE/HOW/WHY: renew cert at host; fix robots 5xx; collapse redirects; allowlist AI tokens if public citation desired; add internal links to orphans.

## 22. Proactive
Sitemap index by section as crawl hint.

## 23. Dependencies
Consumes CrawlResult. Parallel with D/CIT/ENT/I. Produces access findings.

## 24. Runtime
Cheap vs render.

## 25–27. Tools
`scripts/check_access.py`; `references/rfc9309.md`; `references/ai_crawler_tokens.md`.

## 28. Testing
Loop fixture; robots 5xx; HTTPS redirect TN; search Disallow TN.

## 29. Generalization
Token list in references, updatable; unknown bots not invented.

## 30. Example
"robots.txt returned 503; RFC 9309 fail-closed — compliant crawlers must treat the host as fully disallowed."
