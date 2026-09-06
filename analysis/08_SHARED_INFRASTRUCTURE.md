# Shared Infrastructure

Do not reimplement per skill. All paths under marketplace `scripts/lib/` (implementation phase).

## 1. http_client
- **Purpose:** Read-only GET/HEAD with timeouts, retries, size caps.
- **In:** URL, method GET|HEAD, timeout_s, max_bytes
- **Out:** status, headers, body_ref, timing_ms, error_code
- **Consumers:** all fetchers
- **Runtime:** dominant cost
- **Failure:** FETCH_TIMEOUT / 4xx no retry / 5xx retry ≤2 / never POST / SSRF_BLOCKED
- **Rules:** no cookies jar for auth; no credential headers
- **SSRF (AD):** before every hop (including redirects), allow only http(s); resolve IP and reject RFC1918, 127/8, 169.254/16. Hostname-only checks are insufficient (DNS rebinding).

## 2. robots_policy
- **Purpose:** RFC 9309 parse once per origin; fail-open 4xx, fail-closed 5xx
- **In:** origin
- **Out:** rules by user-agent; fetch_status
- **Consumers:** crawl, any extra SK-H fetch
- **Failure:** 5xx → treat site as disallowed; emit SK-C finding; stop crawl

## 3. url_normalize
- **Purpose:** Strip session/tracking params; trailing slash policy; fragment ignore except STTF analysis
- **In:** URL
- **Out:** canonical_key, trap_flags
- **Consumers:** crawl frontier, dedup

## 4. sitemap_parser
- **Purpose:** Cheap seed list + lastmod
- **In:** robots Sitemap: + /sitemap.xml
- **Out:** url[], lastmod?, sitemap_index_split
- **Failure:** missing sitemap is not Critical

## 5. crawl_planner
- **Purpose:** AE priority queue
- **Score:** K-lexicon path/anchor + sitemap bonus + topic-locality + depth penalty
- **Budgets:** time-primary; page cap safety; per-host concurrency 1–2; render timeout separate
- **Stop:** AE20/21 or time
- **Out:** CrawlResult + coverage statement

## 6. simhash_cluster (single subsystem — AE ∩ AF)
- **Purpose:** One template/dup/trap fingerprint service. Pulkit AE (online SimHash, Hamming, ≥2 samples) and Soham AF (corpus θ shared-nodes, 2–3 confirm, two-tier report) **must not be two implementations**.
- **In:** DOM tag-path signature; main-text
- **Out:** template_id, near_dup_skip, shared_node_theta, `pages_verified`
- **Rule:** never skip K high-value fact pages on content-hash alone without value compare
- **Report language:** AF two-tier — site-wide iff θ-shared + 2–3 confirms; else “N of M sampled”
- **Do not merge** template clusters with topical/embedding clusters or WCC isolation IDs (JOIN-006)

## 7. renderer
- **Purpose:** Optional headless render with hard timeout (AE19)
- **Out:** RenderedPage or RENDER_TIMEOUT → analyze raw only, flag
- **Budget:** few pages (priority URLs first)

## 8. html_parse / main_content
- **Purpose:** Trafilatura/Readability-like; prefer `<main>` landmark
- **Out:** ExtractedContent
- **Consumers:** all content skills

## 9. metadata_extract
- **Purpose:** title, meta, canonical, robots, OG, JSON-LD blocks
- **Out:** structured fields + parse errors

## 10. structured_data_parse
- **Purpose:** JSON-LD/Microdata validity
- **Out:** objects[], errors[]

## 11. page_classifier
- **Purpose:** homepage/about/pricing/docs/product/article/legal/other
- **Consumers:** V, K, X, crawl scoring

## 12. entity_extract
- **Purpose:** org names, aliases, places — deterministic NER-lite + LLM optional
- **Consumers:** SK-ENT, SK-H, SK-I facts

## 13. fact_store + `compare_claim_against_source`
- **Purpose:** typed facts (price, leader, geo) with source URL + span
- **Shared compare (P-016):** materiality gate → Wikipedia infobox-overrides-Wikidata + revision timestamps → company-owned profiles (low directionality confidence) → press as snapshot unless recent+large gap
- **Consumers:** SK-I conflict, SK-H, SK-ENT sameAs — **one function**, not three
- **AG15 claim-conflict:** infrastructure OK; **do not emit hard user-facing findings** until E2E FP rate is tested (AG-031)

## 14. evidence_store
- **Purpose:** url, method, selector/STTF, extracted_text, screenshot optional no
- **Rule:** claim must paraphrase-match evidence (AA)

## 15. logging
- **Purpose:** skill timing, robots hits, partial failures
- **Not user-facing except coverage**

## 16. finding_normalize
- **Purpose:** map SkillResult → Finding envelope

## 17. severity_normalize / confidence_normalize
- **Purpose:** S axes; AA-01 proxies; min-propagation on merge (Z-27)

## 18. suppression_registry
- **Purpose:** U table + V never-fire
- **Out:** suppressed:true + reason (never silent drop)

## 19. rate_limiter
- **Purpose:** global per-host delay; skills must not each hammer
- **Failure:** RATE_LIMITED skip URL

## 20. sanitizer
- **Purpose:** AD-01 strip hidden text from LLM prompts; delimiter-wrap untrusted HTML

## Failure codes (closed)
`FETCH_TIMEOUT, ROBOTS_DISALLOWED, PARSE_FAILURE, RATE_LIMITED, SKILL_INTERNAL_ERROR, RENDER_TIMEOUT, DNS_FAILURE, TLS_FAILURE, SSRF_BLOCKED`

Every component: if it fails, skills return `status: partial` with errors[], orchestrator continues unless robots fail-closed or origin unreachable.
