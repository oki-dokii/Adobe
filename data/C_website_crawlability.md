# Topic C — Website Crawlability (Full Rebuild: C1–C50)
**Researcher:** Pulkit | **Research Area:** C — Website Crawlability
**Priority:** Very High

---

## 0. Framing — why this is a rebuild, and how it's organized

The assignment gives 50 specific sub-topics. I'm **not** treating these as 50 independent checks — many are the same underlying technical concern named at different granularities (e.g., C8, C18, and C28-adjacent all touch redirect chains; C1/C20/C21/C22 are all robots.txt; C24/C25/C26/C27/C28 are all robots-meta/X-Robots-Tag directives). Per the user's own explicit instruction — *"Google's current documentation separately treats crawling/indexing, robots controls, canonicalization, JavaScript, metadata, sitemaps and crawl-budget behavior as distinct technical areas, so these should not be collapsed into one generic 'SEO' check"* — I've organized this document around **Google's own documentation taxonomy**, which is also, not coincidentally, a clean way to map to distinct, well-scoped skills:

| Cluster | Sub-topics covered | Google's own doc category |
|---|---|---|
| **I. HTTP & Network Accessibility** | C9, C11, C12, C13, C14, C15, C16 | Crawling infrastructure / HTTP basics |
| **II. Redirects** | C8, C17, C18 | Crawling infrastructure |
| **III. robots.txt** | C1, C20, C21, C22 | Robots controls |
| **IV. Robots meta tags / X-Robots-Tag** | C3, C4(partial), C23, C24, C25, C26, C27, C28 | Robots controls (page-level) |
| **V. Canonicalization** | C4, C29, C30, C31, C36 | Canonicalization |
| **VI. Sitemaps** | C2, C32, C33, C34, C35 | Sitemaps |
| **VII. Crawl depth, link graph & orphan pages** | C5, C10, C37, C38, C39, C40 | Crawling infrastructure |
| **VIII. Pagination & faceted/parameterized URLs** | C41, C42, C43 | Crawling infrastructure (faceted nav doc) |
| **IX. URL duplication & normalization** | C44, C45, C46, C47, C48, C49, C50 | Canonicalization / URL structure |
| **X. Broken links & soft 404s** | C6, C19 | Crawling infrastructure |
| **XI. Crawl budget** | C7 | Crawling infrastructure (dedicated doc) |

Each cluster below follows the full A-O research chain for its combined scope, then the sub-topics are individually indexed inside for traceability back to the assignment's exact numbering. This avoids 50 near-duplicate A-O writeups while still directly answering every numbered item.

**One clarification on prior work:** My first pass at "Topic C" (before this rebuild was requested) covered C1/C2-equivalent ground (robots.txt spec, AI bot tokens, redirects, sitemaps) at deep detail. That material is **preserved and integrated** into Clusters II, III, and VI below rather than discarded, since it remains accurate and well-sourced — I'm extending, not replacing, that research.

---

## 1. Legend
Same as Topics A/B: **FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**.

---

## Cluster I — HTTP & Network Accessibility
**Covers:** C9 (server response codes), C11 (HTTP accessibility), C12 (HTTPS configuration), C13 (DNS failures), C14 (TLS/certificate problems), C15 (HTTP 4xx errors), C16 (HTTP 5xx errors)

### A. What we need to understand
Before any content, structure, or metadata question is even relevant, can an automated agent establish a basic, valid HTTP(S) connection to the site at all — DNS resolution, TLS handshake, and a well-formed HTTP response? This is the true zero-th gate, prior to even robots.txt (C1's own AI-bot analysis assumes the site is reachable in the first place).

### B. Why it matters
This cluster is boring, foundational, and exactly the kind of thing that gets skipped in favor of more interesting content-quality checks — but a DNS or TLS failure is a **total, silent, unconditional blackout** for every downstream check (ours and every AI crawler's), and it's cheap to verify deterministically in well under a second per site.

### C. Current evidence
- **FACT (foundational internet infrastructure, not requiring AI-specific research):** DNS resolution failure, TLS handshake failure/certificate errors, and malformed/non-standard HTTP responses are well-defined, standardized failure modes (DNS per RFC 1035 and successors; TLS per RFC 8446; HTTP semantics per RFC 9110) that any HTTP client, including every AI vendor's crawler, must handle — typically by aborting the fetch.
- **INFERENCE:** Since every AI-vendor crawler documented in my earlier Topic C research (OpenAI's OAI-SearchBot, Anthropic's Claude-SearchBot, etc.) is fundamentally an HTTP(S) client, none of them can be expected to have special-cased handling for a broken TLS chain or DNS misconfiguration — a connectivity failure here is a universal blocker, not a vendor-specific nuance, unlike much of Clusters III/IV.
- **OBSERVATION (widely and consistently reported across security/ops literature, not contested):** Common, real-world causes of intermittent DNS/TLS failures that a site owner might not notice themselves (since their own browser caches DNS/TLS state, and CDN edge nodes can fail unevenly by geography) include: expired or soon-to-expire TLS certificates, incomplete certificate chains (missing intermediate certificates — a classic "works in Chrome, fails for a fresh HTTP client" bug), DNS records with very short or misconfigured TTLs causing inconsistent resolution, and DNSSEC validation failures. This class of "asymmetric visibility" bug — broken for automated/fresh clients, invisible to the site owner's own browsing session — is a genuinely non-obvious, high-value thing for our audit to catch specifically because a human site owner would be very unlikely to discover it themselves through normal use.

### D. Important mechanisms
The key insight distinguishing this cluster from Clusters III/IV (robots.txt, meta tags): those are **policy** signals (the site owner is choosing to restrict access), while Cluster I failures are **infrastructure** failures (the site owner almost certainly does *not* want this, and may not know about it) — this should carry different severity psychology in our report: a robots.txt block might be a deliberate choice; a TLS chain failure is essentially never a deliberate choice, and should be flagged with more urgency and less hedging about "maybe this is intentional."

### E. Concrete website signals
- DNS resolution success/failure and latency, checked against the domain as given.
- TLS handshake success/failure; certificate validity window (not expired, not not-yet-valid); complete certificate chain (intermediate certificates present, not just the leaf cert); certificate hostname match.
- HTTP response class for the root URL and a small sample of key pages (2xx expected; explicit distinction between 4xx client-error and 5xx server-error classes, per C15/C16).
- HTTP-to-HTTPS behavior: does the site properly redirect HTTP requests to HTTPS (a common, expected, benign pattern) or serve mixed/inconsistent behavior.

### F. How the signal could be detected automatically
Fully deterministic: perform DNS resolution, TLS handshake (capturing certificate chain and validity dates), and an HTTP request in sequence; record and classify any failure at each stage separately rather than collapsing them into one generic "site down" error, since each failure type has a different fix.

### G. What evidence the skill should report
Which specific stage failed (DNS / TLS / HTTP) with the specific underlying error (e.g., certificate expired on [date], incomplete chain missing intermediate for [issuer], DNS NXDOMAIN, connection timeout); this level of specificity is what makes the finding actionable for whoever manages the site's infrastructure.

### H. Possible severity logic
- **Critical, always:** total DNS failure, complete TLS handshake failure, or persistent 5xx on the root URL — the site is effectively invisible to any automated agent, AI or otherwise.
- **Critical:** expired TLS certificate (many HTTP clients, and essentially all AI-vendor crawlers behaving as standard HTTPS clients, will refuse to proceed).
- **High:** incomplete certificate chain (works in some browsers due to certificate caching/AIA fetching, fails for many programmatic clients that don't perform out-of-band chain completion).
- **Info:** HTTP-to-HTTPS redirect present and working correctly (this is the expected, correct pattern, not a defect — noted for completeness, not flagged).

### I. Correct remediation
DNS: verify records with the domain registrar/DNS host. TLS: renew certificates before expiry (recommend automation, e.g., ACME/Let's Encrypt auto-renewal) and ensure the server serves the full chain, not just the leaf certificate. These are infrastructure/hosting fixes, not content fixes — should be clearly flagged as such so the finding reaches the right person (often not the same person who owns website content).

### J. False-positive cases
A site correctly redirecting HTTP→HTTPS is not a defect (this is standard, expected practice) — should never be flagged. A brief, single-instance timeout during our own audit run (network noise on our end, not necessarily the site's fault) shouldn't be reported as a confirmed Critical finding without at least one retry — this mirrors the 5xx-robots.txt honesty caveat from my earlier robots.txt research.

### K. False-negative risks
Certificate and DNS issues can be geographically or CDN-node-specific — our single-vantage-point audit could pass while the site fails for users/crawlers in a different region hitting a different, misconfigured edge node; this should be stated as a real limitation, not silently assumed away.

### L. Counterexamples
A site legitimately serving different content/behavior via IP-based geo-routing or A/B-tested infrastructure could show variation across audit runs that isn't a "problem" in the usual sense — our audit should note if multiple checks within the same run show inconsistent results rather than assuming a single result is universally representative.

### M. Generalizes?
Yes, completely — pure internet-infrastructure mechanics, identical regardless of site type, content, or industry.

### N. Candidate skill(s)
**`http-accessibility-audit`** — a fast, cheap, fully deterministic, near-zero-false-positive-risk skill; strong candidate to run **first**, before any other check, both because it's foundational (nothing else matters if this fails) and because it's the fastest, lowest-cost check to run within the 5-minute budget, and can short-circuit/contextualize everything downstream.

### O. Relationship to other skills
The true foundation of the entire crawlability cluster and, by extension, the entire marketplace — every other skill's findings should be understood as conditional on this cluster passing.

---

## Cluster II — Redirects
**Covers:** C8 (redirect chains), C17 (redirect loops), C18 (redirect chains — duplicate assignment number, treated as the same sub-topic as C8)

### A. What we need to understand
*(Note: C8 and C18 are worded identically in the assignment — "redirect chains" — so I treat them as one sub-topic rather than inventing an artificial distinction between them.)* How do redirect chains and loops specifically affect automated crawl success, distinct from the general HTTP mechanics in Cluster I?

### B. Why it matters
This is substantially the same research I did in my first Topic C pass (there labeled "C3"), preserved and re-integrated here under the corrected numbering.

### C. Current evidence
- **FACT (general web standard, RFC 9110):** HTTP redirect status codes (301, 302, 307, 308) and their defined semantics (permanent vs. temporary, method-preserving vs. not) are standard, well-documented HTTP infrastructure.
- **OBSERVATION (consistently reported across multiple independent secondary sources, though I could not verify an exact, vendor-published "N-hop limit" for any specific AI crawler):** Real-time search/citation-purpose AI crawlers are reported to tolerate fewer redirect hops than bulk training crawlers, plausibly due to real-time/user-facing latency constraints on the citation pathway versus no such urgency for bulk training crawls. **This remains OBSERVATION-tier — no specific hop-count threshold should be hard-coded as if vendor-confirmed.**
- **INFERENCE:** Independent of any specific hop-count claim, a genuine redirect **loop** (not just a long chain, but a cycle that never terminates) is unambiguously bad for any crawler, compliant or not, real-time or bulk — a safe, high-confidence check regardless of the more uncertain hop-tolerance question.
- **FACT (from Google's own faceted-navigation documentation, directly relevant and newly sourced for this rebuild):** Google explicitly recommends *against* redirect chains as a best practice for crawl-budget preservation, and independent technical sources consistently describe each redirect hop as consuming crawl-capacity resources — while I don't have a precise Google-published "cost per hop" figure, the general principle (fewer hops is better, chains should be collapsed to direct redirects) is well-established, non-contested guidance.

### D. Important mechanisms
A redirect chain or loop is a retrieval-gate failure (per Topic A's A11 framing) with a distinct signature from a hard connectivity failure (Cluster I) or a policy block (Cluster III/IV): the target exists and is reachable, but the *path* to it is broken or inefficient — this matters for root-cause labeling in our report (different fix, different owner, typically a routing/redirect-rule configuration issue rather than DNS/TLS or robots.txt).

### E. Concrete website signals
- Redirect chain length from canonical entry points (homepage, sitemap-listed URLs, and internally-linked key pages) to final destination.
- Redirect loops (a genuine, unambiguous, always-critical defect).
- Client-side (meta-refresh or JS-based) redirects instead of server-side HTTP redirects — reuses A11's raw-vs-rendered dual-fetch infrastructure to detect divergence between what a non-JS-executing crawler sees versus what actually happens in a browser.

### F. How the signal could be detected automatically
Fully deterministic: follow redirect chains via direct HTTP requests, count hops, detect loops (revisiting a previously-seen URL in the same chain), and cross-check against the rendered/headless-browser behavior for client-side-redirect divergence.

### G-L. (Evidence output / severity / remediation / false positives / false negatives / counterexamples)
Unchanged from my original Topic C research: loops and client-side-only redirects on canonical URLs are Critical/High severity; single-hop standard redirects (non-www→www, HTTP→HTTPS) are completely benign and must not be flagged; exact hop-tolerance thresholds should be treated as approximate/hedged given the lack of vendor-confirmed specifics.

### M. Generalizes?
Yes, completely.

### N. Candidate skill
Part of **`crawlability-audit`**, reusing Cluster I's HTTP-fetch and A11's dual-fetch infrastructure.

### O. Relationship to other skills
Composes directly with Cluster I (a redirect chain that terminates in a Cluster-I failure is a compound finding, not two unrelated ones) and A11 (client-side-redirect detection shares infrastructure).

---

## Cluster III — robots.txt
**Covers:** C1 (robots.txt), C20 (robots.txt syntax), C21 (robots.txt rule scope), C22 (crawler-specific directives)

### A. What we need to understand
The formal protocol specification (syntax, parsing, scope rules) and, distinctly, the practical reality of per-vendor, per-purpose AI crawler tokens. This cluster is the most extensively pre-researched from my original Topic C pass and is preserved here with corrected sub-topic numbering.

### B. Why it matters
Unchanged from original research: this is one of the few places in the whole marketplace where we can claim near-100% deterministic detection confidence, and the per-vendor-token nuance (C22 specifically) is one of the single highest-value, most non-obvious findings in the entire crawlability research area.

### C. Current evidence

**C1/C20 (protocol syntax) — FACT, primary standard, RFC 9309:**
- Published as an IETF Proposed Standard in September 2022, formalizing syntax, parsing, caching, and error-handling for robots.txt for the first time since the informal 1994 convention (authored with direct Google involvement: Gary Illyes, Henner Zeller, Lizzi Sassman, alongside original author Martijn Koster).
- Formal syntax rules directly from the RFC: product tokens (`User-agent` values) must contain only `a-z`, `A-Z`, `_`, `-`; crawlers MUST support wildcard (`*`) and end-of-match (`$`) special characters in `Allow`/`Disallow` paths; rules outside any `User-agent` group SHOULD be ignored; the file must be UTF-8, at the root path, matching protocol/host/port.
- Explicit, asymmetric HTTP-status handling: a 4xx response to the robots.txt fetch means the file is "unavailable" (crawling **permitted** — fail open); a 5xx response means "unreachable" (crawlers required to assume **full disallow** until resolved — fail closed). This is a genuinely non-obvious, spec-mandated rule almost no naive checker implements, and it means a site whose robots.txt endpoint itself intermittently 5xx's could be silently telling every RFC-9309-compliant crawler to fully back off.
- 500 KiB file-size cap, above which crawlers MAY ignore the remainder.

**C21 (rule scope) — FACT, from RFC 9309, directly relevant to scope/precedence questions:**
- **Longest-match-wins** precedence for overlapping `Allow`/`Disallow` rules at the same specificity defaults to `Allow` (per the RFC-conformant patch behavior documented in independent engineering writeups explicitly implementing and citing RFC 9309's precedence rules) — a naive first-match-wins parser (a common bug in hand-rolled checkers) produces **wrong** verdicts on any robots.txt using both directives for overlapping paths, which is common in real-world files.
- Group-fallback scope rule: a crawler looks for its specific `User-agent` token first; if no matching group exists, it falls back to the wildcard (`*`) group — meaning a bot with no explicitly-named group is still governed by the wildcard rules, not left unrestricted by default.

**C22 (crawler-specific directives / AI vendor tokens) — the highest-value finding in this cluster, verified directly against primary sources:**

*OpenAI (verified directly from `developers.openai.com/api/docs/bots`):*
| Token | Vendor's own stated purpose | Consequence if blocked (vendor's own words) |
|---|---|---|
| `OAI-SearchBot` | Surfaces websites in ChatGPT's search features | "Sites that are opted out of OAI-SearchBot will not be shown in ChatGPT search answers, though can still appear as navigational links" |
| `GPTBot` | Crawls content for generative AI foundation model training | Content excluded from future model training data |
| `ChatGPT-User` | User-triggered fetch (a user asks ChatGPT to visit a URL) | Explicitly, per OpenAI: "not used for crawling the web in an automatic fashion... robots.txt rules may not apply" and "not used to determine whether content may appear in Search" — a genuinely important, easily-conflated distinction from OAI-SearchBot |
| `OAI-AdsBot` | Validates ad landing pages | Out of scope for AI discoverability |

*Anthropic (verified directly from `support.claude.com`, current as of April 7, 2026 — supersedes older secondary-source references to a legacy `anthropic-ai` token no longer in current documentation):*
| Token | Vendor's own stated purpose | Consequence if blocked (vendor's own words) |
|---|---|---|
| `ClaudeBot` | Training data collection | "signals that the site's future materials should be excluded from our AI model training datasets" |
| `Claude-User` | User-triggered fetch | "prevents our system from retrieving your content in response to a user query, which may reduce your site's visibility for user-directed web search" |
| `Claude-SearchBot` | Search-quality improvement/indexing | "prevents our system from indexing your content for search optimization, which may reduce your site's visibility and accuracy in user search results" |

**Important honest note, preserved from original research:** Anthropic's own documentation draws the Claude-User/Claude-SearchBot distinction slightly differently from OpenAI's sharp ChatGPT-User/OAI-SearchBot separation — Anthropic's wording suggests both tokens have some bearing on search visibility, while OpenAI explicitly states ChatGPT-User has none. **Vendor token semantics should not be assumed parallel across vendors just because names rhyme.**

- **OBSERVATION (not directly vendor-confirmed at OpenAI/Anthropic's level of documentation rigor):** Perplexity is commonly, consistently reported to use `PerplexityBot` (indexing/search) and `Perplexity-User` (user-triggered fetch) tokens following the same general pattern — should be independently verified against Perplexity's own primary documentation before being hard-coded with the same confidence as the OpenAI/Anthropic tables.
- **OBSERVATION:** Google's AI-training opt-out token is `Google-Extended`, separate from `Googlebot` (which must remain allowed for any general search visibility). Gemini's live grounding pathway appears to run through Google Search's existing infrastructure rather than a separately-controllable dedicated bot token in the same sense as the other three vendors — a structural difference worth flagging explicitly rather than forcing Gemini into the same table shape.
- **OBSERVATION (consistently reported, important for remediation-honesty):** Some crawlers — most consistently named: ByteDance's `Bytespider` — have a documented history of non-compliance with robots.txt directives, reinforcing RFC 9309's own point that the protocol is advisory, not enforced.

### D. Important mechanisms
The core reframe, unchanged from original research: **"AI crawler blocking" is not one binary switch per vendor — it's 2-3 independent, separately-controllable policy decisions per vendor** (training / search-citation / user-fetch), each with different, vendor-documented consequences. A single "robots.txt looks fine" pass/fail verdict actively misleads site owners about which specific lever controls AI-citation visibility.

### E-L. (Signals / detection / evidence / severity / remediation / false positives / false negatives / counterexamples)
Unchanged from original research: spec-compliant per-token parsing; severity scaled by whether the *search/citation-purpose* token specifically is blocked (Critical) versus only the training-purpose token (Medium, legitimate policy choice) versus the user-fetch token (Low); absence of robots.txt entirely is not a defect (RFC 9309's own fail-open rule for 4xx/unavailable); persistent 5xx on the robots.txt endpoint itself is Critical (spec-mandated full disallow).

### M. Generalizes?
Detection mechanism: yes, completely, protocol-level. Severity interpretation: should scale by site type/intent (Topic V hook) — an internal tool blocking everything is not a defect; a public marketing site blocking search-purpose bots is.

### N. Candidate skill(s)
**`crawlability-audit`** (robots.txt sub-module) — fully deterministic, near-zero false-positive risk for the parsing itself; the per-vendor-token mapping carries uneven confidence across vendors (HIGH for OpenAI/Anthropic, MEDIUM for Perplexity/Google) and should be labeled as such.

### O. Relationship to other skills
Directly composes with Topic A's A11 (retrieval gate) and A19 (three-gate model) — this is the most concrete, deterministic, first-gate evidence source for that abstract framework, and a strong candidate to be the entrypoint's very first substantive check after Cluster I's connectivity check.

---

## Cluster IV — Robots meta tags & X-Robots-Tag (page-level directives)
**Covers:** C3 (noindex tags), C4 (canonical tags — partial, canonicalization proper is Cluster V), C23 (robots meta tags), C24 (X-Robots-Tag), C25 (noindex), C26 (nofollow), C27 (noarchive), C28 (nosnippet / snippet-control mechanisms)

### A. What we need to understand
Distinct from robots.txt (a site-wide/path-wide, pre-fetch signal), robots meta tags and the `X-Robots-Tag` HTTP header are **page-level, post-fetch** directives — meaning, critically, the crawler must already have successfully fetched the page to see and obey them. This creates a genuinely important, easily-missed interaction with Cluster III that most naive audits get backwards.

### B. Why it matters
The **noindex-behind-a-robots.txt-block interaction** is a classic, well-documented, real-world misconfiguration that produces the *opposite* of the intended effect, and it's exactly the kind of subtle, mechanism-level finding this hackathon rewards over a generic checklist item.

### C. Current evidence — verified directly from Google's own primary documentation
- **FACT (first-party, Google Search Central, directly fetched):** "We have to crawl your page in order to see `<meta>` tags and HTTP headers. If a page is still appearing in results, it's probably because we haven't crawled the page since you added the noindex rule." This is an explicit, first-party confirmation of the crawl-precondition mechanism: **a `noindex` directive on a robots.txt-blocked page is silently ineffective**, because the crawler is never permitted to fetch the page and therefore never sees the `noindex` tag telling it to drop the page from the index. This is a genuinely common, well-documented real-world footgun (a site owner blocks a path in robots.txt *and* adds noindex to "be extra safe," not realizing the robots.txt block makes the noindex tag unreachable and thus moot) — Google's own guidance explicitly warns against this exact combination.
- **FACT (first-party, Google Search Central, `X-Robots-Tag`):** The `X-Robots-Tag` HTTP header supports the same directive vocabulary as the `<meta name="robots">` tag but can be applied to **non-HTML resources** (PDFs, images, video files) where an HTML `<meta>` tag isn't possible — an important distinction since many site audits only check HTML `<meta>` tags and miss header-level directives entirely, especially on document/media file types.
- **FACT (first-party, Google Search Central):** Conflicting robots rules resolve to **the more restrictive rule** — explicit Google example: if a page has both `max-snippet:50` and `nosnippet`, the `nosnippet` rule (more restrictive) applies. This is a useful, deterministic conflict-resolution rule for our own parser to implement correctly rather than guessing.
- **FACT (first-party, Google Search Central, directly quoted):** Rules can be scoped per-crawler within a single `X-Robots-Tag` set (e.g., `X-Robots-Tag: googlebot: nofollow` alongside `X-Robots-Tag: otherbot: noindex, nofollow` in the same response) — rules specified without a user-agent apply to all crawlers; the header, user-agent name, and values are all case-insensitive.
- **FACT (first-party, Google Search Central, on `nofollow` specifically, C26):** Since 2019, Google treats `nofollow` as a **hint**, not a strict directive, for crawling/indexing purposes — it usually prevents PageRank transfer but Google "may still follow the links for discovery if it finds them elsewhere." This is an important, dated shift (many older SEO guides and some naive checkers still treat `nofollow` as an absolute block) that our skill should reflect accurately rather than propagating outdated assumptions.
- **FACT (first-party, Google Search Central, on `noindex` persistence, C25):** `noindex` doesn't stop crawling — Google continues to periodically revisit a noindexed page to check if the directive has changed; if a page remains noindexed long enough, Google eventually **reduces crawl frequency** for it and begins treating its outbound links as `nofollow` — a genuinely non-obvious secondary effect (a long-noindexed page's *outbound links* lose their link-discovery value over time) worth surfacing if detectable.
- **FACT (first-party, Google Search Central, on `noarchive`/`nosnippet`, C27/C28):** `noarchive` prevents a cached-link display; `nosnippet` prevents a text snippet from being generated **and also functions as an implicit `noarchive`** (per one of the practitioner sources, consistent with and elaborating on Google's own documented rule set) — meaning `nosnippet` is the more encompassing of the two, not merely a narrower sibling.

### D. Important mechanisms — the connected diagnosis
The single most valuable, non-obvious finding in this cluster: **`robots.txt Disallow` + page-level `noindex` on the same URL is a contradictory, self-defeating configuration**, not a "double-safe" one as many site owners intuitively assume. The correct pattern is either: (a) robots.txt-block *only* (prevents crawling entirely, but the page could theoretically still appear in results via other signals like external links, without a crawled description — Google's own documented behavior for disallowed-but-discovered URLs), or (b) **allow crawling, but noindex at the page level** (the crawler can see and obey the noindex, reliably removing it from the index) — never both, since combining them means the noindex directive is never actually seen. This is directly analogous to, and should be reported alongside, the JS-only-pricing root-cause chain example from the handout: one misconfiguration, one connected diagnosis, not two unrelated findings.

### E. Concrete website signals
- Presence and value of `<meta name="robots">` tags and `X-Robots-Tag` headers on crawled pages, correctly parsed for the full directive vocabulary (`noindex`, `nofollow`, `noarchive`, `nosnippet`, `max-snippet`, `none`, etc.), including per-crawler-scoped variants.
- **The specific contradictory-configuration signal:** a URL that is both `Disallow`-blocked in robots.txt (Cluster III) *and* would (if reachable) carry a `noindex` directive that can never actually be observed/obeyed — detectable indirectly by checking whether a robots.txt-disallowed path has historically appeared in the site's own sitemap with implied noindex intent, or, more directly and reliably, simply flagging **any robots.txt-disallowed path that the site owner also seems to be trying to noindex via other means** (e.g., a documented pattern in site configuration/CMS settings, where inspectable) as a configuration-conflict risk worth manual review.
- `X-Robots-Tag` headers specifically on non-HTML resources (PDFs, key document downloads) — a commonly-missed check since many audits only inspect HTML `<meta>` tags.

### F. How the signal could be detected automatically
Fully deterministic: parse `<meta name="robots">` tags from rendered/raw HTML and `X-Robots-Tag` headers from the HTTP response for both HTML pages and non-HTML resources; cross-reference against Cluster III's robots.txt parse to detect the disallow+noindex contradiction pattern specifically on pages our own crawl attempt is blocked from reaching (a directly detectable case: if we, respecting robots.txt per the hackathon's own read-only/robots.txt-respecting constraint, cannot fetch a page to check its meta tags, and that page is nonetheless indexed/discoverable via sitemap or internal links, this is itself indirect evidence of the exact contradiction pattern worth flagging).

### G. What evidence the skill should report
The specific directive(s) found per page/resource; explicit flag and plain-language explanation for the robots.txt-block + intended-noindex contradiction pattern where detectable; explicit flag for `X-Robots-Tag` presence/absence on non-HTML resources specifically, since this is commonly overlooked.

### H. Possible severity logic
- **High:** the disallow+noindex contradiction pattern, since it produces the *opposite* of the site owner's evident intent (they wanted the page out of the index, and their own configuration is preventing that from working).
- **Medium:** missing `X-Robots-Tag` on sensitive non-HTML resources (e.g., internal/draft PDFs) that plausibly should be excluded but aren't.
- **Info:** correct, non-contradictory use of noindex/nofollow/noarchive/nosnippet — not a defect, included for completeness.

### I. Correct remediation
Choose one mechanism per URL, not both: either block via robots.txt (accepting the page may still surface without a crawled snippet if discovered via other means) or allow crawling and rely on page-level noindex (the more reliable way to guarantee index removal) — this exact guidance is directly sourced from Google's own documented mechanism, not invented.

### J. False-positive cases
A site correctly using `noindex` on crawlable (non-robots.txt-blocked) pages — e.g., internal search results pages, thank-you/confirmation pages — is standard, correct practice and must not be flagged; only the *combination* of robots.txt-block plus intended noindex on the *same* URL is the actual defect pattern.

### K. False-negative risks
Our audit, itself respecting robots.txt per the hackathon's own constraints, cannot directly fetch and inspect the `<meta>` tags of a robots.txt-disallowed page — meaning direct confirmation of the contradiction pattern is inherently limited to indirect evidence (sitemap/CMS-configuration hints); we cannot always definitively prove a specific disallowed page also carries a noindex tag, only flag the *risk pattern* where circumstantial evidence suggests it.

### L. Counterexamples
A site owner might deliberately robots.txt-block a path (e.g., `/admin/`) with no noindex intent at all — the mere presence of a robots.txt disallow is not itself evidence of the contradiction; the finding should only fire when there's specific, positive evidence that noindex was *also* intended for that path.

### M. Generalizes?
Yes, completely — this is pure protocol-interaction mechanics, universal across site types.

### N. Candidate skill(s)
Part of **`crawlability-audit`**, as a page-level-directive sub-module composing directly with the robots.txt sub-module (Cluster III).

### O. Relationship to other skills
Directly composes with Cluster III (robots.txt) — genuinely the same underlying "is this page meant to be found" question, checked at two different protocol layers, and the contradiction-detection logic requires both layers' data simultaneously.

---

## Cluster V — Canonicalization
**Covers:** C4 (canonical tags, full treatment here), C29 (canonical conflicts), C30 (canonical pointing elsewhere), C31 (canonical inconsistency), C36 (sitemap/canonical mismatch)

### A. What we need to understand
What does `rel="canonical"` actually do, formally, and — critically, and this is the cluster's single most important finding — is it a command or a signal, and what happens when it conflicts with other signals?

### B. Why it matters
This is a widely, confidently misunderstood mechanism even among experienced practitioners — the common assumption ("I set the canonical tag, so that's the URL Google will use") is **directly contradicted by Google's own documentation**, and getting this right is essential for any check that reasons about canonical conflicts (C29-C31) or canonical/sitemap mismatches (C36).

### C. Current evidence — verified directly from Google's own primary documentation
- **FACT (first-party, Google Search Central, `developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls`, directly fetched):** Google explicitly ranks canonicalization signals **in order of strength**: (1) **Redirects** are the strongest signal that the redirect's target should become canonical; (2) **`rel="canonical"` link annotations** are described as "a strong signal" but explicitly not absolute; (3) **Sitemap inclusion** is explicitly stated to be only "a weak signal." Google's own documentation states plainly: **"none of them are required; your site will likely do just fine without specifying a canonical preference,"** and these signals "can stack and thus become more effective when combined."
- **FACT (first-party, same source, directly relevant to C29/C30/C31):** Google's own explicit best-practice list includes: don't specify *different* canonical URLs for the same page using different methods (e.g., one URL in the sitemap, a different URL via `rel="canonical")` — this exact inconsistency pattern is Google's own named example of what NOT to do, and is directly what C29/C31 ("canonical conflicts," "canonical inconsistency") are asking about. Google explicitly warns this kind of **signal conflict** forces their system to "fall back on weaker signals," per the second corroborating source below.
- **OBSERVATION (from a Google Search Relations team member, reported via a podcast, not a written primary-source document I could directly fetch, so treated as OBSERVATION not FACT despite being an on-record Google statement):** Allan Scott from Google's "Dups" (duplicate-detection) team is reported to have stated Google assesses **around 40 distinct signals** to determine canonical status, and that when strong signals (canonical tags, redirects) **conflict with each other**, Google's system falls back on weaker signals to break the tie — this is a valuable, specific, on-record elaboration of the general "canonical is a signal not a command" principle, but I'm labeling it OBSERVATION-tier since I'm relying on a secondary write-up of a podcast rather than a directly fetched primary transcript.
- **FACT (first-party, Google Search Central Blog, "Alternate page with proper canonical tag" documentation, and independently corroborated by Google Search Console's own reporting UI, per multiple consistent secondary sources describing the same GSC feature):** Google Search Console has a specific, named reporting category — **"Duplicate, Google chose different canonical than user"** — for exactly the case where Google's algorithmic choice overrides the site owner's explicit `rel="canonical")` tag. The existence of this dedicated GSC report category is itself strong evidence that canonical-tag override is a common, expected, non-error occurrence that Google explicitly surfaces to site owners, not an edge case.
- **OBSERVATION (consistent across multiple independent secondary sources, directionally consistent with but not verbatim from Google's primary documentation):** Additional signals reported to feed Google's canonical-selection algorithm beyond the three explicitly ranked in the primary doc include: internal link volume/pattern (the version receiving more internal links is treated as more likely to be the intended primary version), HTTPS vs HTTP (HTTPS is generally preferred when otherwise equivalent), and relative content completeness/quality between near-duplicate versions.

### D. Important mechanisms
The core, load-bearing reframe for this entire cluster: **`rel="canonical"` is advisory, exactly like robots.txt (Cluster III) — a strong signal, not a command, and Google's own documentation is explicit and unambiguous about this.** This means our audit's canonical-related checks should never claim "this page's canonical is [X]" as a certainty about what any AI system's underlying retrieval infrastructure will actually treat as canonical — we can only report the site owner's **stated intent** (the canonical tag as declared) and flag **internal inconsistencies in that stated intent** (C29/C30/C31/C36 — conflicting or contradictory signals across different mechanisms), which is a more honest and more actionable framing than pretending canonical tags are deterministic.

### E. Concrete website signals
- **C4 (canonical tags, general):** presence, well-formedness, and self-consistency of `rel="canonical")` tags across the site; self-referencing canonicals on pages with no actual duplicate (a completely normal, Google-recommended defensive pattern, not a defect).
- **C29/C31 (canonical conflicts/inconsistency):** a page whose `rel="canonical")` tag points to URL X, while other signals (its own sitemap listing, its own internal-link-most-pointed-to version, or a redirect elsewhere in the site pointing to a *different* URL Y for what's evidently the same content) disagree with X — this is Google's own named anti-pattern.
- **C30 (canonical pointing elsewhere):** a canonical tag pointing to a URL that itself 404s, redirects further, is robots.txt-blocked, or is on a different domain entirely without clear justification — a broken or suspicious canonical chain.
- **C36 (sitemap/canonical mismatch):** the specific case where a sitemap lists URL A as an indexable entry, but URL A's own `rel="canonical")` tag points to a *different* URL B — directly the named anti-pattern from Google's own best-practices list above.

### F. How the signal could be detected automatically
Fully deterministic: parse `rel="canonical")` tags across all crawled pages; cross-reference against the sitemap (Cluster VI) and against redirect targets (Cluster II) to build a consistency graph; flag any page where these three signals (canonical tag, sitemap entry, redirect target) disagree about the "true" URL for a given piece of content. Separately, verify canonical targets actually resolve successfully (not 404, not blocked, not endlessly redirecting) for C30.

### G. What evidence the skill should report
The specific conflicting signals found (e.g., "sitemap lists /product/123 as canonical; /product/123's own `rel=canonical` tag points to /product/123-old"), framed explicitly as a **signal-consistency** issue rather than a claim about what any search/AI system will actually do, per the "signal not command" framing established above.

### H. Possible severity logic
- **High:** sitemap/canonical mismatch (C36) or canonical pointing to a broken/inaccessible target (C30) — both are Google's own named anti-patterns and directly increase the odds Google/AI systems "fall back to weaker signals," making canonical selection less predictable.
- **Medium:** canonical pointing cross-domain or to a very different-looking page without obvious justification (could be legitimate syndication, but worth a flag).
- **Low/Info:** self-referencing canonicals (correct, defensive practice, not a defect — included so the audit doesn't accidentally flag good practice).

### I. Correct remediation
Align all three signal types (canonical tag, sitemap listing, redirect target) to name the same, single preferred URL for any piece of duplicated/near-duplicated content — directly following Google's own explicit best-practice guidance.

### J. False-positive cases
Self-referencing canonicals are correct, recommended practice, not a defect (explicitly noted above). Legitimate content syndication (the same article intentionally appearing on multiple domains with a canonical pointing to the original) is not a defect even though it's cross-domain — should not be flagged without additional evidence of an actual error.

### K. False-negative risks
Because canonicalization is explicitly advisory and algorithmically overridable (the ~40-signals point, OBSERVATION-tier), even a perfectly internally-consistent set of canonical signals from the site owner's side doesn't guarantee any specific AI/search system will actually honor it — our check can only verify the site owner's own signals are internally consistent, not that the outcome will match their intent.

### L. Counterexamples
A large e-commerce site with many genuinely near-identical product variants (color/size variations) may have deliberately complex, non-obvious canonical relationships that aren't errors — the check should look for genuine *contradictions* (signal A says X, signal B says Y, both about literally the same URL), not merely "complex" canonical structures.

### M. Generalizes?
Yes, completely — canonicalization mechanics and Google's documented signal-hierarchy are universal, though the volume/complexity of canonical relationships to check scales with site size (larger e-commerce/catalog sites have proportionally more surface area for this class of error).

### N. Candidate skill(s)
Part of **`crawlability-audit`**, as a canonicalization-consistency sub-module cross-referencing Clusters II (redirects) and VI (sitemaps).

### O. Relationship to other skills
Directly composes with Cluster VI (sitemaps) for C36 specifically, and Cluster II (redirects) since redirects are the *strongest* canonicalization signal per Google's own ranking — a page's redirect behavior should be checked for consistency with its stated canonical tag as part of the same pass.

---

## Cluster VI — Sitemaps
**Covers:** C2 (sitemap.xml), C32 (sitemap existence), C33 (sitemap correctness), C34 (sitemap freshness), C35 (sitemap completeness)

### A. What we need to understand
The sitemap protocol's actual specification, Google's documented usage of it, and the specific, well-evidenced anti-patterns that undermine its usefulness — preserved and re-integrated from my original Topic C research with corrected numbering.

### B. Why it matters
Unchanged from original research: sitemaps are the site owner's most direct discovery signal, but the specification is narrower and less influential than commonly believed, and there's a specific, well-documented anti-pattern (blanket/fake `lastmod` updates) directly relevant to both crawlability and freshness (Topic I) research.

### C. Current evidence
- **FACT (primary standard, sitemaps.org, Sitemap Protocol 0.9):** A sitemap is an XML file listing URLs with optional `lastmod`, `changefreq`, `priority` fields; all URLs in a single sitemap file must share one host; sitemap index files can reference multiple sitemap files for large sites.
- **FACT (first-party, Google Search Central, directly fetched):** Google explicitly states it **ignores `<priority>` and `<changefreq>` values entirely** — a first-party statement that a sitemap generator or CMS plugin spending effort tuning these two fields is spending effort on something with zero effect for Google specifically.
- **FACT (first-party, Google Search Central):** Google **conditionally uses `<lastmod>`**, only "if it's consistently and verifiably" accurate — independently corroborated across multiple secondary technical-SEO sources describing Google detecting and subsequently **disregarding** a domain's `lastmod` signal entirely when it follows implausible patterns (e.g., a uniform date applied across many/all URLs, especially matching the sitemap's own generation date rather than genuine content-change dates) — **C34 (sitemap freshness)'s core finding**: a common, well-intentioned CMS default (auto-stamping every URL with the build date) is plausibly counterproductive, risking the *entire domain's* freshness signal being disregarded going forward.
- **FACT (protocol-level, sitemaps.org and Google, consistent):** A sitemap listing 50,000+ URLs or exceeding 50 MiB uncompressed must be split via a sitemap index — relevant to C33/C35 for large sites.
- **FACT (Wikipedia, citing Google's own webmaster guidance):** "Using a sitemap doesn't guarantee that all the items in your sitemap will be crawled and indexed" — a sitemap is a discovery accelerant and completeness signal, not a crawl guarantee (directly relevant to C35, sitemap completeness — even a "complete" sitemap doesn't guarantee complete indexing).
- **NEW for this rebuild — C35 (sitemap completeness), FACT (first-party, Google Search Central, directly fetched, from the "large sitemaps" documentation):** Sitemap index files require specific tags and support optional `lastmod` scheduling hints at the index level; and — genuinely useful for C35 specifically — Google's own guidance elsewhere in the same documentation family explicitly warns against including non-canonical URL variants, redirecting URLs, or `noindex`-tagged URLs in a sitemap, since this "sends contradictory signals" (directly connecting to Cluster V's canonical-consistency findings and Cluster IV's noindex mechanics) — **completeness is not just "are all real pages present" but also "are only real, canonical, indexable pages present" (no false inclusions).**
- **NEW for this rebuild — C32 (sitemap existence), FACT (first-party, Google Search Central):** Google's own guidance explicitly frames sitemap necessity as scaling with site characteristics: large sites, sites with content that's frequently updated, or sites with **isolated pages** (few internal links pointing to them) benefit most; small, well-linked sites may not need one at all — this directly informs C32's severity logic (existence-absence should not be flat-penalized for all sites equally).

### D. Important mechanisms
Unchanged core insight: the durable, genuinely useful sitemap signal is **which canonical URLs the site owner considers indexable, and (conditionally) when they last meaningfully changed** — not the `changefreq`/`priority` metadata that generic SEO tooling still often emphasizes. New for this rebuild: **sitemap correctness (C33) and completeness (C35) are two distinct failure modes** — correctness failures are "the sitemap lies" (broken URLs, non-canonical inclusions, contradictory signals per the Cluster IV/V connections above); completeness failures are "the sitemap is silent" (real, important pages simply missing) — these deserve separate detection logic and separate severity framing, since a "wrong" sitemap actively misleads crawlers while an "incomplete" sitemap merely under-informs them.

### E. Concrete website signals
- **C32:** sitemap exists, discoverable via robots.txt's `Sitemap:` directive and/or conventional `/sitemap.xml` path.
- **C33:** valid XML per the 0.9 schema; listed URLs actually return 200 and are canonical (not redirects, not `noindex`, not duplicate parameter variants — directly reusing Cluster IV/V's detection logic).
- **C34:** `lastmod` accuracy — statistical uniformity check for the "suspiciously identical across many URLs" fake-freshness anti-pattern.
- **C35:** completeness — a sample-based comparison of URLs discoverable via internal-link crawling (Cluster VII) against URLs actually present in the sitemap, to surface real, linked, seemingly-important pages that are nonetheless sitemap-absent (most valuable for the "isolated pages" case Google's own documentation flags as the scenario where sitemaps matter most).

### F. How the signal could be detected automatically
Fully deterministic across all four: fetch/validate sitemap XML; sample-check listed URLs' actual HTTP status and canonical-consistency (cross-referencing Clusters IV/V); statistical `lastmod` uniformity check; and a link-graph-vs-sitemap diff (requires Cluster VII's crawl data) for completeness.

### G-L. (Evidence output / severity / remediation / false positives / false negatives / counterexamples)
Unchanged in substance from original research, extended to the newly-split C33/C35 distinction: correctness failures (C33) should generally carry higher severity than completeness gaps (C35), since incorrect entries actively mislead while gaps merely under-inform; small well-linked sites should have C32 severity suppressed per Google's own explicit guidance; a genuine bulk content refresh could produce a uniform-`lastmod` false positive for C34 and should be flagged as a pattern worth checking, not an assumed defect.

### M. Generalizes?
Yes, completely — protocol mechanics are universal; severity scaling by site size/depth (C32) is the main site-type-sensitive dimension.

### N. Candidate skill
Part of **`crawlability-audit`**; the C34 `lastmod`-credibility sub-check has a genuine secondary home in Topic I (Freshness) — ownership to be finalized when Topic I is written, flagged here to avoid duplication.

### O. Relationship to other skills
Directly composes with Cluster IV (noindex-in-sitemap contradiction), Cluster V (canonical/sitemap mismatch, C36), and Cluster VII (link-graph-vs-sitemap completeness diff, C35) — genuinely one of the most cross-cutting clusters in this entire research area.

---

## Cluster VII — Crawl depth, internal link graph & orphan pages
**Covers:** C5 (crawl depth), C10 (orphan pages), C37 (orphan pages — duplicate of C10), C38 (crawl depth — duplicate of C5), C39 (internal link graph), C40 (dead-end pages)

### A. What we need to understand
*(C5/C38 and C10/C37 are worded identically in the assignment, so treated as single sub-topics each, same handling as the C8/C18 redirect-chains duplication above.)* How does a site's internal link structure — depth from the homepage, presence of unlinked/orphaned pages, and dead-ends — affect discoverability independent of any single page's own content quality?

### B. Why it matters
This is a genuinely different failure category from everything in Clusters I-VI: those are all about whether a *specific, known* URL is reachable/correctly-signaled; this cluster is about whether a crawler can **discover** the URL's existence in the first place through normal link-following, which is the primary discovery mechanism absent a sitemap (and even with one, per Cluster VI's "sitemap isn't a guarantee" finding).

### C. Current evidence
- **FACT (foundational web/IR concept, not requiring new research — standard crawler behavior across all documented systems in Topic A's A1-A4 research):** All crawlers, AI-vendor or traditional, discover new URLs primarily through two mechanisms: sitemap listings (Cluster VI) and following links from already-known pages. A page with **zero inbound internal (or external) links** — a true orphan — is invisible to link-following discovery entirely and depends completely on sitemap inclusion (Cluster VI) or external backlinks to ever be found.
- **INFERENCE (combining the above with Cluster VI's "isolated pages" finding, and Google's own crawl-budget documentation on prioritization):** Crawl depth (how many link-hops from the homepage a page sits at) is a reasonable, if imperfect, proxy for how much crawl priority/attention a page is likely to receive, since crawlers — per Google's own crawl-budget documentation, and by extension plausibly other systems following similar economically-motivated crawling strategies — must prioritize somehow, and pages closer to the site's "important" entry points are more likely to be discovered quickly and recrawled often.
- **OBSERVATION (a specific, quotable, first-party-adjacent statistic already surfaced in Cluster VIII below, but directly relevant here too):** Google's Gary Illyes reportedly attributed roughly **half of all reported crawling issues** to faceted-navigation-driven link-graph problems specifically — while this statistic is about faceted navigation specifically (Cluster VIII), it's strong indirect evidence that **link-graph structure problems broadly** (of which faceted-navigation sprawl is one major cause) are a leading, not marginal, real-world crawlability failure category, lending weight to this cluster's overall importance.

### D. Important mechanisms
A **dead-end page** (C40) — a page with no outbound internal links at all, or only links back to already-visited pages — doesn't just fail to help discovery of *other* pages; it represents a wasted opportunity in the link graph, since crawlers (and, plausibly, page-importance-signal propagation of the kind referenced in Cluster V's "internal link volume" canonical-selection signal) use outbound links as part of how they assess and propagate a sense of which pages matter. A site with many dead-end pages has a structurally weaker internal link graph even where every individual page is otherwise perfectly crawlable.

### E. Concrete website signals
- **C5/C38 (crawl depth):** minimum number of link-hops from the homepage (or other primary entry points) to reach each page, computed via breadth-first traversal of the internal link graph.
- **C10/C37 (orphan pages):** pages that exist (known via sitemap, or provided directly by the person requesting the audit) but have **zero** discoverable inbound internal links from anywhere else on the crawled portion of the site.
- **C39 (internal link graph):** broader structural properties — average/median crawl depth across the site, distribution shape (a healthy site typically has most important content within a few hops of the homepage; a "flat" vs. "deep" structure has different implications), and identification of structurally important "hub" pages versus isolated clusters.
- **C40 (dead-end pages):** pages with no outbound internal links, or whose only outbound links lead to already-otherwise-linked pages, contributing nothing new to link-graph traversal.

### F. How the signal could be detected automatically
Fully deterministic, but computationally distinct from most other checks in this document: requires an actual **multi-page crawl** (not just single-page or few-page fetches like most other C-cluster checks) to build the internal link graph — this has direct, important implications for the 5-minute runtime budget (Topic AE territory) since building a meaningful link graph requires visiting a non-trivial sample of the site's pages, not just the homepage and robots.txt/sitemap. Breadth-first traversal from the homepage naturally computes crawl depth for every visited page; orphan detection requires cross-referencing the visited/linked-to set against the full known-URL set (from the sitemap) to find URLs that exist in the sitemap but were never discovered via link-following during the crawl.

### G. What evidence the skill should report
Depth distribution summary (e.g., "80% of sitemap-listed pages are within 3 hops of the homepage; 12% are 5+ hops deep"); specific list of detected orphan pages (sitemap-present, zero inbound internal links found); specific list of dead-end pages if found among high-value page types (e.g., a product page with no links back to category pages or elsewhere).

### H. Possible severity logic
- **High:** an orphan page that's also a high-apparent-value page (e.g., present in the sitemap with high implied priority, or matching key content patterns like pricing/product pages) — combines discoverability risk with business importance.
- **Medium:** high crawl depth (5+ hops) for pages that otherwise seem important based on sitemap presence or naming conventions.
- **Low/Info:** dead-end pages that are evidently intentional terminal states (e.g., a checkout confirmation page, a 404 page) — not every dead-end is a defect.

### I. Correct remediation
Add internal links from higher-traffic/higher-depth-priority pages to orphaned or deep content; ensure important pages are reachable within a small number of hops from the homepage or other major entry points; add "related content" or category-navigation links from dead-end pages back into the broader site structure.

### J. False-positive cases
Many legitimate page types are *intentionally* dead-ends or effectively orphaned by design — a printer-friendly page, a legal/terms page linked only from a footer, a genuinely standalone landing page for a specific ad campaign not meant for organic discovery — these should not be flagged as defects without considering evident page purpose/type.

### K. False-negative risks
Our crawl-graph analysis is necessarily bounded by the 5-minute runtime budget and can only sample a portion of a large site — a genuinely orphaned page deep in a large site's structure that we simply didn't reach during our bounded crawl would be a false negative (undetected, not because it's fine, but because we ran out of budget) — this limitation should be stated honestly rather than implying a complete link-graph audit.

### L. Counterexamples
A page could be "deep" by hop-count from the homepage but still be well-discoverable in practice via a strong external backlink profile or direct sitemap inclusion — hop-count-from-homepage is one useful proxy for discoverability risk, not the only signal, and shouldn't be treated as decisive in isolation from Cluster VI's sitemap-completeness findings.

### M. Generalizes?
Yes, well — link-graph structural analysis is universal, though "healthy" depth/structure norms vary somewhat by site type (a large e-commerce catalog naturally has different structural norms than a small marketing site) — a hook into Topic V.

### N. Candidate skill(s)
Genuinely distinct infrastructure from the rest of `crawlability-audit`, given it requires actual multi-page crawling rather than single-URL checks — strong candidate to be its own sub-component, **`link-graph-analysis`**, feeding both this cluster's findings and directly enabling Topic AG (Site Graph, also mine) and the template-clustering infrastructure discussed in my original Topic A research (A22).

### O. Relationship to other skills
Directly shares crawl infrastructure with Topic AE (Crawling Strategy) and Topic AG (Site Graph) — this cluster's link-graph-building work is likely the *same underlying crawl* that AE/AG need, not a separate one, and should be designed once, jointly, rather than duplicated.

---

## Cluster VIII — Pagination & faceted/parameterized URLs
**Covers:** C41 (pagination), C42 (faceted navigation), C43 (parameter URLs)

### A. What we need to understand
How do paginated series, faceted/filterable navigation, and URL query parameters generally affect crawl efficiency and duplicate-content risk — and is this actually a major, evidenced problem or a minor edge case?

### B. Why it matters
Genuinely major, evidenced problem, not a minor edge case — this cluster contains one of the strongest, most quotable, most directly-attributable-to-Google findings in this entire document.

### C. Current evidence
- **FACT (first-party, Google Search Central, "Managing crawling of faceted navigation URLs," directly fetched):** Faceted navigation (filtering by size, color, price, etc.) can generate **near-infinite URL variations** from combinatorial parameter combinations, creating what Google's own documentation and independent commentary consistently call "crawl traps" — URL spaces that consume disproportionate crawl resources without corresponding content value.
- **FACT/OBSERVATION (Google Search Relations team, Gary Illyes, quoted consistently and specifically across multiple independent secondary sources describing what appears to be the same on-record statement, though I could not locate and directly fetch a single canonical primary transcript, so treating as strong OBSERVATION rather than FACT despite being attributed to an on-record Google spokesperson):** Illyes is reported to have stated faceted navigation accounts for **roughly half of all crawling issues** site owners report to Google — a striking, specific, quotable statistic that, even hedged as OBSERVATION-tier, strongly reinforces that this cluster deserves serious weight in our audit, not treatment as a minor edge case.
- **FACT (first-party, Google Search Central, specific technical guidance directly relevant to C43):** Google's documentation gives concrete, actionable technical guidance: use the industry-standard `&` character as the URL parameter separator (characters like comma, semicolon, and brackets are "hard for crawlers to detect as parameter separators"); if filters are encoded in the URL *path* rather than query parameters, the logical order of filters must stay consistent and no duplicate filter combinations should be reachable via different paths; return an HTTP 404 for filter combinations that yield no results (rather than a 200 with an empty-results page — directly connecting to Cluster X's soft-404 mechanism below).
- **FACT (first-party, Google Search Central, 2014 foundational guidance, still referenced and consistent with the 2024/2025 update):** Google distinguishes **valuable parameters** (those that create genuinely unique, search-worthy content combinations searchers would want — e.g., `item-id`, `category-id`) from **unnecessary parameters** (session IDs, arbitrary sort orders, narrow price-range slices) that "only cause duplication" — the practical guidance is to ensure unnecessary parameters are never *required* in the click-path to reach any given piece of unique content, and to use `nofollow`/robots.txt/canonical-tag combinations (composing directly with Clusters III/IV/V) to prevent crawl-budget waste on the unnecessary-parameter URL space specifically.

### D. Important mechanisms
This cluster is a genuine, well-evidenced instance of the handout's own "root cause over symptom" mandate: faceted-navigation/parameter sprawl doesn't produce one isolated finding — it simultaneously **wastes crawl budget** (Cluster XI), **creates duplicate-content/canonical-inconsistency risk** (Cluster V), and **can produce soft-404-like empty-result pages** (Cluster X) if not handled correctly (returning 200 for empty filter combinations) — a single root architectural pattern (unconstrained combinatorial parameter generation) with multiple, connected downstream symptoms, exactly matching the brief's own JS-only-pricing example format.

### E. Concrete website signals
- Presence of paginated series (`?page=N` or similar) and whether pagination is correctly signaled (each page reachable, not accidentally `noindex`'d or orphaned mid-series — composing with Clusters IV/VII).
- Presence of faceted-navigation-style URL parameters (multiple filter/sort query parameters observed across crawled internal links) and whether the site shows evidence of unconstrained combinatorial generation (e.g., internal links to many different parameter *combinations*, not just individual filter values).
- Whether unnecessary parameters (session IDs, arbitrary sort params) are blocked from crawling (robots.txt pattern-disallow, or `nofollow`'d internal links) versus freely crawlable and generating large numbers of low-value URL variants.
- Whether empty-result filter/facet combinations return proper 404s or improperly return 200-with-empty-content (directly checkable via Cluster X's soft-404 detection logic).

### F. How the signal could be detected automatically
Deterministic, building on Cluster VII's link-graph crawl: during the internal-link-graph traversal, classify discovered URLs by parameter pattern (same base path, varying query strings) and flag evidence of combinatorial explosion (a rapidly growing count of distinct parameter combinations discovered relative to crawl depth, suggesting an effectively unbounded URL space); separately, sample a few filter/facet URLs directly to check response behavior for empty-result combinations.

### G. What evidence the skill should report
Estimated or sampled evidence of combinatorial URL generation (e.g., "found N distinct query-parameter combinations for the /products path within the first M crawled pages, suggesting a potentially unbounded facet space"); specific examples of unnecessary parameters that appear freely crawlable; specific examples of empty-filter-result pages returning 200 instead of 404, if found.

### H. Possible severity logic
- **High:** clear evidence of unconstrained combinatorial parameter generation with no apparent robots.txt/nofollow/canonical mitigation — directly matches Illyes's own "half of all crawling issues" framing, a genuinely high-impact, well-evidenced problem category.
- **Medium:** pagination series present but with inconsistent signaling (some pages in a series orphaned or inconsistently canonicalized).
- **Medium:** empty-filter-combination pages returning 200 instead of 404 (a soft-404-adjacent pattern, connecting to Cluster X).

### I. Correct remediation
Directly per Google's own documented guidance: use `&` as the parameter separator; keep filter order consistent if path-encoded; block crawling of unnecessary-parameter combinations via robots.txt pattern rules or `nofollow` on internal links to them; return proper 404s for empty filter results; consolidate canonical signals for filter combinations that are near-duplicates of a "base" category/listing page.

### J. False-positive cases
Faceted navigation itself is not a defect — it's a legitimate, common, valuable UX pattern (Google's own documentation explicitly frames it as something to *manage*, not eliminate). Only **unconstrained, unmanaged combinatorial sprawl** with no crawl-budget mitigation is the actual defect pattern; a well-managed faceted-navigation implementation (with proper parameter blocking, canonicalization, and 404 handling) should score well on this check, not be penalized simply for having filters at all.

### K. False-negative risks
Our bounded, 5-minute-budget crawl (Cluster VII's own limitation) may not discover enough of a large site's parameter space to reliably detect a genuine combinatorial-explosion pattern — a site with a severe faceted-navigation crawl-trap problem that happens to not surface heavily within our specific bounded crawl sample would be a false negative.

### L. Counterexamples
A site with many query parameters that are all genuinely valuable/unique (e.g., each parameter combination corresponds to real, distinctly search-worthy content, per Google's own "valuable parameters" framing) is not exhibiting the anti-pattern even though it has many parameterized URLs — the check should specifically target *unnecessary*, non-content-differentiating parameters, not parameter usage in general.

### M. Generalizes?
Yes, well — faceted navigation and pagination are especially common on e-commerce, marketplace, and large content-catalog site types specifically (a genuine site-type-dependent prevalence, not a universal concern for all site types equally, e.g., a small marketing site is unlikely to have this problem at all) — a clear hook into Topic V for both prevalence-weighting and severity calibration.

### N. Candidate skill(s)
Part of **`crawlability-audit`**, as a parameter/pagination-analysis sub-module building directly on Cluster VII's link-graph crawl data.

### O. Relationship to other skills
Directly composes with Cluster V (canonicalization of near-duplicate filter combinations), Cluster X (soft-404 empty-filter-result pages), and Cluster XI (crawl-budget consumption) — this cluster is a genuine root cause feeding into three other clusters' symptom categories, a strong candidate for prominent "connected diagnosis" framing in the final report per the brief's explicit guidance.

---

## Cluster IX — URL duplication & normalization
**Covers:** C44 (duplicate URLs), C45 (URL normalization), C46 (HTTP/HTTPS duplication), C47 (www/non-www duplication), C48 (trailing slash inconsistencies), C49 (case-sensitive URL duplication), C50 (language/locale URL architecture)

### A. What we need to understand
Beyond parameter-driven duplication (Cluster VIII), what simpler, more mechanical forms of URL duplication commonly occur, and how does Google's/the web's documented canonicalization-signal framework (Cluster V) apply to each specific pattern?

### B. Why it matters
These are individually small, mechanical issues, but collectively common, and each has a specific, well-established correct-handling pattern — this cluster is more "get the mechanics right" than "discover something novel," and I want to be honest about that rather than manufacturing false novelty for what is genuinely well-trodden, settled technical ground.

### C. Current evidence
- **FACT (general web/HTTP standards, RFC 3986 URI syntax, not requiring AI-specific research):** URLs differing only in scheme (`http://` vs `https://`), host prefix (`www.` vs. no prefix), trailing slash presence, or letter case in the path (on case-sensitive server configurations) are, from a technical/server perspective, **distinct URLs** that can each independently return content — even when a human user perceives them as "the same page." This is the root mechanical cause underlying C46-C49 collectively.
- **FACT (directly established in Cluster V above, re-applied here):** Google's own documented canonicalization-signal hierarchy (redirects strongest, then canonical tags, then sitemap inclusion) is the correct, established framework for resolving exactly this class of duplication — C44-C49 are not a separate mechanism from Cluster V, they are the **specific, common instances** that Cluster V's general framework is designed to handle.
- **FACT (widely established, uncontested, standard web practice, consistent across primary and secondary sources):** The correct handling pattern for scheme/host/trailing-slash duplication is a **301 (permanent) redirect** from the non-preferred variant(s) to the single preferred canonical form — since Cluster V/II already established redirects are Google's *strongest* canonicalization signal, this is the most reliable available mechanism for this specific duplication class, stronger than relying on `rel="canonical")` tags alone for these particular cases.
- **FACT (from Cluster V's own sourced material, re-applied):** Google's documentation, and independently corroborated secondary sources, note Google **generally prefers HTTPS over HTTP** when otherwise equivalent — relevant to C46 specifically, and connecting directly to Cluster I's HTTPS/TLS findings (a site should have working HTTPS *and* redirect HTTP to it, not merely have both technically function independently).
- **INFERENCE (C50, language/locale URL architecture — a genuinely more complex sub-topic than C44-C49, requiring its own distinct treatment rather than folding into the simple-redirect pattern):** Locale/language variants are fundamentally different from C44-C49's duplication patterns because they are **not true duplicates** — a French and English version of the same page are legitimately different content, not accidental duplication, and therefore should **not** be resolved via redirect or canonical-collapse (which would incorrectly hide one legitimate language version) but via the separate `hreflang` annotation mechanism, which explicitly tells search/AI systems "these are equivalent-but-distinct language versions, serve the appropriate one per user locale" rather than "these are duplicates, pick one." **I did not do deep original research into `hreflang`'s full specification for this pass** (it's a large enough topic to warrant its own dedicated research effort if the marketplace scope requires deep locale-handling coverage) — flagging this as a real, acknowledged gap rather than presenting shallow treatment as complete.

### D. Important mechanisms
The single most important distinction across this whole cluster: **C44-C49 (true accidental duplication) should be resolved via redirect/canonical collapse; C50 (legitimate language/locale variation) must NOT be collapsed the same way**, since doing so would actively harm the site by hiding legitimate, intentionally-distinct content from users/systems that should see it. A naive "collapse everything that looks like a URL variant" implementation would incorrectly damage a well-internationalized site — this is a genuine, important false-positive risk worth stating explicitly.

### E. Concrete website signals
- **C44/C45:** general detection of multiple distinct URLs serving byte-identical or near-identical rendered content, beyond the specific named patterns below.
- **C46:** both HTTP and HTTPS versions of the same path independently returning 200 (rather than HTTP properly redirecting to HTTPS).
- **C47:** both `www.` and bare-domain versions independently returning 200 for the same path (rather than one redirecting to the other).
- **C48:** both trailing-slash and non-trailing-slash versions of the same path independently returning 200 without a redirect between them.
- **C49:** on case-sensitive server configurations, differently-cased versions of the same path (e.g., `/Product/123` vs `/product/123`) independently returning 200 with identical content, without redirect/canonical consolidation.
- **C50:** presence and correctness of `hreflang` annotations where multiple language/locale versions of similar content exist — specifically checking that `hreflang` is used (not redirect/canonical collapse) for genuinely distinct-language content.

### F. How the signal could be detected automatically
Fully deterministic: for a sample of key URLs, systematically test the scheme/host/trailing-slash/case variant forms and record whether each independently returns 200 (a duplication risk) or correctly redirects to a single canonical form; for C50, check for `hreflang` tag presence and internal consistency (reciprocal `hreflang` links, correct language-code formatting) where multiple locale-path patterns are detected (e.g., `/en/`, `/fr/` path prefixes, or `lang=` parameters).

### G. What evidence the skill should report
Which specific variant(s) independently return 200 without proper redirection, for each of C46-C49; whether `hreflang` is present/correctly reciprocal where locale variants exist (C50).

### H. Possible severity logic
- **Medium:** each of C46-C49 individually, since these are common, well-understood, cheaply-fixed issues that nonetheless genuinely dilute canonicalization signal strength and waste crawl resources on redundant fetches (composing with Cluster XI).
- **Medium-High:** C50 missing/broken `hreflang` on a genuinely multi-locale site, since this risks the wrong-language version being surfaced to users, a direct on-site-engagement harm (connecting to the project's second core mandate, not just AI discoverability).

### I. Correct remediation
C44-C49: implement 301 redirects consolidating all variant forms to one single preferred canonical form (a standard, well-established, low-complexity server/CDN configuration fix). C50: implement or repair `hreflang` annotations rather than redirecting/collapsing language variants.

### J. False-positive cases
**The most important false-positive risk in this entire cluster:** treating legitimate language/locale variants (C50) as if they were simple accidental duplication (C44-C49's pattern) and recommending redirect-collapse — this would be actively harmful advice, hiding legitimate content. This risk is severe enough that I recommend the skill's implementation logic explicitly special-case and separate C50 detection/remediation from C44-C49's shared logic, rather than treating all seven as instances of one generic "URL duplication" check.

### K. False-negative risks
Case-sensitivity duplication (C49) only manifests as a real issue on case-sensitive server/filesystem configurations (common on Linux-based hosting, not on case-insensitive configurations) — a check that doesn't first establish whether the site's hosting is case-sensitive could either waste effort checking a non-issue or, worse, miss genuinely distinct content that happens to share a case-insensitive-equivalent path on a case-sensitive server.

### L. Counterexamples
A site might deliberately serve different content at trailing-slash vs. non-trailing-slash variants of the same path for legacy/compatibility reasons (unusual, but possible) — the check should verify content is actually near-identical before flagging, not assume based on path pattern alone.

### M. Generalizes?
C44-C49: yes, completely — universal web/HTTP mechanics. C50: generalizes well as a *concept* (any genuinely multi-locale site needs this), but obviously doesn't apply at all to single-locale sites, so its severity/relevance should be conditional on detected site characteristics (a legitimate site-type/characteristic gate, not a universal check).

### N. Candidate skill(s)
Part of **`crawlability-audit`**, as a URL-normalization sub-module; C50 specifically should be flagged as needing more research depth than this pass provided if the marketplace's scope includes serious international-site coverage — a candidate for follow-up research rather than shipping with only the shallow treatment given here.

### O. Relationship to other skills
Directly composes with Cluster V (canonicalization framework generally) and Cluster I (C46 specifically, HTTPS/TLS). C50 connects to the project's on-site-engagement mandate more directly than most of this document's other findings, which are almost entirely AI-discoverability-focused — worth noting as a rare crawlability finding with direct human-user-engagement relevance too.

---

## Cluster X — Broken links & soft 404s
**Covers:** C6 (broken links), C19 (soft 404s)

### A. What we need to understand
Two related but genuinely distinct problems: C6, links (internal or external) that point to genuinely non-existent/broken destinations; and C19, the specific, well-documented, more subtle case of pages that *appear* to work (200 OK) but whose content signals "nothing here" to a sophisticated crawler.

### B. Why it matters
C19 (soft 404s) is the more novel, higher-value finding of the two — it's a genuinely non-obvious mechanism (a page can be technically "working" and still be effectively invisible/excluded) that directly parallels this entire document's recurring theme (technical correctness ≠ actual discoverability/effectiveness).

### C. Current evidence
- **C6, FACT (basic web mechanics, well-established, not requiring new research):** A broken internal link (pointing to a URL that returns 4xx/5xx, composing directly with Cluster I) wastes crawl-graph traversal effort (Cluster VII) and, if pointing to what should be valid content, represents a straightforward, easily-detectable defect.
- **C19, FACT (first-party, Google Search Central Blog, directly and explicitly defined):** "A soft 404 occurs when a webserver responds with a 200 OK HTTP response code for a page that doesn't exist rather than the appropriate 404 Not Found." Google's own documentation explicitly states soft 404s "can limit a site's crawl coverage by search engines because these duplicate URLs may be crawled instead of pages with unique content" — directly connecting soft 404s to crawl-budget waste (Cluster XI), the same mechanism already established for faceted-navigation sprawl (Cluster VIII).
- **C19, FACT (first-party-adjacent, reported directly from a Google Search Relations team member, John Mueller, via a specific, well-corroborated technical detail that's more concrete/checkable than most "Google spokesperson said" claims):** Google's soft-404 classification can differ **by device type** for the exact same URL — e.g., a page whose mobile template fails to load critical data (a JavaScript error or missing server-side logic specific to the mobile rendering path) while the desktop version renders correctly can be classified as a soft 404 **on mobile only**. This is a genuinely important, non-obvious, easily-missed nuance: a naive single-fetch soft-404 check (especially one that only tests a desktop user-agent) could completely miss a mobile-specific soft-404 problem — directly relevant given AI-vendor crawlers (per Topic A/C's earlier research) plausibly have their own distinct rendering/fetching behaviors that may not map cleanly onto either classic "desktop" or "mobile" Googlebot categories, an honest uncertainty worth flagging rather than assuming parity.
- **INFERENCE (connecting C19 to Topic B's B1 findings on Perplexity/general AI extraction behavior):** Since AI-answer-engine citation extraction (per Topic B's research) fundamentally depends on finding genuine, substantive, extractable content on a fetched page, a soft-404 page — even though it returns 200 and is technically "reachable" — very plausibly presents the same practical extraction failure to an AI system as it does to Google's classic search index, even though I found no AI-vendor-specific study directly confirming this generalization; this is a reasonable, low-risk inference given the underlying mechanism (empty/thin/error-signaling content) is extraction-relevant regardless of which downstream system is doing the extracting.

### D. Important mechanisms
Soft 404s are a genuine instance of this entire document's core theme: **a page can be perfectly reachable by every technical measure in Clusters I-III (DNS resolves, TLS works, HTTP 200, robots.txt allows it) and still functionally fail** at the content/purpose level — directly paralleling Topic A/B's repeated finding that technical crawlability is necessary but not sufficient. Soft 404s sit at the boundary between this document's "can it be reached" scope and Topic K's (AI Answerability) "is there anything worth answering with" scope — worth flagging explicitly as a cross-topic connection.

### E. Concrete website signals
- **C6:** internal links (discovered during Cluster VII's crawl) or explicitly-provided external links pointing to URLs that return 4xx/5xx (composing directly with Cluster I's status-code detection).
- **C19:** pages returning 200 OK whose actual content signals "not found"/empty/error despite the success status code — detectable via content-pattern analysis (near-empty body, presence of phrases like "no results found," "page not found," "product unavailable" despite a 200 status, or a rendered page that's suspiciously thin/templated with no substantive unique content) and, per the device-specific nuance above, checked separately for at least a desktop-equivalent and a mobile-equivalent fetch where feasible within the runtime budget.

### F. How the signal could be detected automatically
C6: fully deterministic, direct extension of Cluster I/VII's existing crawl-and-status-check infrastructure. C19: hybrid — deterministic content-thinness heuristics (body text length, presence of known "not found"/"no results" phrase patterns) as a fast first pass, escalated to an LLM semantic check for ambiguous cases (does this page, despite returning 200, actually communicate "there's nothing here" to a reader) — a legitimate use of LLM reasoning per the brief's hybrid-approach guidance, since "does this page functionally signal emptiness" requires semantic judgment beyond simple pattern-matching for genuinely ambiguous cases.

### G. What evidence the skill should report
C6: list of broken internal links with their source page and target status code. C19: flagged pages with the specific evidence used to classify them as soft-404-like (e.g., detected phrase pattern, content-length anomaly, or LLM-judged emptiness), explicitly noting if the classification differs between a desktop-equivalent and mobile-equivalent fetch.

### H. Possible severity logic
- **Medium (C6):** broken internal links, scaled by how many/how prominent (a broken link from the homepage nav is more severe than one from a rarely-visited archive page).
- **High (C19):** soft 404s on pages that appear, based on sitemap presence or URL naming, to be intended as substantive content (product pages, articles) — this represents genuinely wasted, misdirected crawl/citation potential.
- **Medium (C19):** device-specific-only soft 404s (works on one rendering path, fails on another) — a real but narrower-scoped issue than a universal soft 404.

### I. Correct remediation
C6: fix or remove broken links; redirect to a valid replacement if the target content has moved. C19: either restore genuine content to the page, or — if the page is genuinely, permanently gone — return a proper 404/410 status instead of a false 200, per Google's own explicit recommendation.

### J. False-positive cases
A legitimately short, minimal page (e.g., a simple contact page with just an address and phone number) is not a soft 404 merely for being short — the check should look for specific "emptiness-signaling" language patterns or genuine content-purpose mismatch, not merely apply a length threshold, to avoid penalizing legitimately concise pages (directly consistent with the brief's own explicit warning against "short content = bad").

### K. False-negative risks
A soft 404 using content-pattern phrasing not covered by our heuristic list (e.g., a creatively-worded "we couldn't find that" message not matching common patterns) could be missed by the fast deterministic pass and would depend on the LLM-escalation catching it, which isn't guaranteed for every page within the runtime budget's sampling limits.

### L. Counterexamples
A page that's *intentionally* thin by design and genuinely 200-appropriate (e.g., a simple redirect-hub/link-in-bio style page, or a minimal but complete single-fact page like a store's hours-and-location page) should not be flagged — the distinguishing signal is emptiness/error-signaling language and apparent content-purpose mismatch, not brevity alone.

### M. Generalizes?
Yes, well — both broken-link detection and soft-404 pattern detection are universal mechanics; the specific "emptiness-signaling phrase" heuristic list may need light site-type/language adaptation (different languages/industries may phrase "no results" differently) but the underlying concept generalizes completely.

### N. Candidate skill(s)
Part of **`crawlability-audit`**, directly building on Cluster VII's crawl infrastructure for C6, and requiring the hybrid deterministic+LLM approach described above for C19.

### O. Relationship to other skills
C19 (soft 404s) is a genuine bridge finding between this entire Topic C document's "can it be reached" scope and Topic K's (AI Answerability, also mine) "is there anything worth answering with" scope — worth explicit cross-referencing when Topic K is written, since the underlying detection mechanism (does this page have genuine, substantive, extractable content) is very likely shared infrastructure between a soft-404 check and a general answerability check.

---

## Cluster XI — Crawl budget
**Covers:** C7 (crawl budget)

### A. What we need to understand
What is "crawl budget," formally and specifically (per Google's own current documentation), and — critically, an honest question this document must not skip — does the concept, as Google defines and manages it, actually transfer meaningfully to AI-vendor crawlers, or is it a Google-specific mechanism we'd be wrong to assume generalizes?

### B. Why it matters
Crawl budget is one of the most commonly invoked, and most commonly vaguely/incorrectly explained, concepts in all of technical SEO — getting the actual mechanism right, and being honest about the real limits of what's known for AI-vendor crawlers specifically, is important given how directly this connects to the hackathon's own explicit "crawling strategy under a 5-minute runtime" research priority (our own crawler needs to think about budget allocation too, not just diagnose the target site's).

### C. Current evidence
- **FACT (first-party, Google Search Central / Google Crawling Infrastructure documentation, directly fetched, current as of a July 2026-dated page — Google recently restructured this documentation into its own dedicated "Crawling Infrastructure" section, itself a signal Google treats crawling as a first-class topic distinct from general "Search" documentation, directly validating this document's own decision to treat Topic C as its own cluster-organized research area rather than folding it into generic SEO):** Google formally defines crawl budget as **the combination of two independent factors**: **crawl capacity limit** (how much crawling a site's server can handle without being overloaded — Google adjusts this automatically based on server response health, increasing it when a site responds quickly and reliably, decreasing it when responses slow or 5xx errors appear) and **crawl demand** (how much Google's systems actually *want* to crawl a given site's content, based on factors including staleness/how often content needs rechecking, and site-wide events like migrations that can temporarily spike demand).
- **FACT (first-party, directly quoted from the current documentation, a specific and important recent clarification):** "Every site starts with the same default, conservative crawl capacity limit. If there is demand to crawl more and the site remains healthy, Google's systems will automatically adjust this limit over time." This is a meaningful, relatively recent (per the secondary source dated July 2026 describing this as an updated/rewritten section of Google's documentation) clarification: crawl capacity is not a fixed, pre-allocated site-specific quota from day one, but an adaptive limit that grows with demonstrated server reliability and demand.
- **FACT (first-party, directly quoted):** Google explicitly states crawl budget optimization is **"not something most publishers have to worry about"** and is primarily relevant for large sites (very roughly, sites in the range of a million-plus pages with moderate update frequency, or sites of even a few thousand pages with very high update frequency) — Google's own documentation actively discourages small/medium site owners from over-indexing on this concept, which is a useful, honest calibration point for our own severity logic (this should not be a universally-high-severity finding for every site).
- **FACT (first-party):** Crawl capacity is explicitly stated to be **shared across all of a vendor's different crawlers** — meaning, for Google specifically, high demand from one Google crawler (e.g., Googlebot Image) can reduce capacity available for others (e.g., Googlebot News) on the same site. This is directly, plausibly analogous to the AI-vendor multi-bot-token findings from Cluster III (a single vendor running 2-3 functionally distinct bots) — if a similar shared-capacity mechanism applies to AI vendors' own multi-bot setups (their training bot, search bot, and user-fetch bot potentially competing for the same underlying capacity budget against a given site), that would be a genuinely interesting, non-obvious extension — **but I want to be explicit this is my own INFERENCE/speculation extending a Google-specific documented mechanism to AI vendors, not something I found directly confirmed for OpenAI, Anthropic, or Perplexity specifically.**
- **HONEST LIMITATION, stated directly:** Everything sourced above is **Google-specific**, drawn entirely from Google's own crawl-budget documentation. **I found no equivalent, vendor-published "crawl budget" documentation from OpenAI, Anthropic, or Perplexity** describing their own AI-search-crawler resource-allocation logic in comparable detail. This is a genuine, significant evidence gap for this specific sub-topic, and our skill's language must not imply Google's crawl-budget mechanics are known to transfer directly to AI-vendor crawlers — the most honest framing is: **crawl-budget-relevant site *symptoms* (slow server response times, excessive redirect chains, faceted-navigation sprawl, broken links wasting crawl-graph traversal — all from Clusters I, II, VIII, X) are plausible, mechanism-consistent risk factors for reduced AI-crawler attention by analogy to Google's well-documented behavior, but we cannot claim AI vendors implement an identical "crawl budget" concept with the same specific mechanics.**

### D. Important mechanisms
The most useful, honest synthesis for our audit: **crawl budget isn't a separate, new signal to detect — it's the aggregate consequence of several other clusters' findings** (server response health from Cluster I, redirect efficiency from Cluster II, URL-space sprawl from Cluster VIII, and broken-link waste from Cluster X). Rather than building a standalone "crawl budget score," the more defensible, mechanism-sound approach is to **synthesize findings from those other clusters into a crawl-efficiency narrative**, explicitly scaled by site size (per Google's own "most publishers don't need to worry about this" calibration) and explicitly hedged regarding AI-vendor applicability specifically.

### E-L. (Signals / detection / evidence / severity / remediation / false positives / false negatives / counterexamples)
No new standalone detection mechanism beyond what Clusters I, II, VIII, and X already provide — this cluster's primary contribution is **synthesis and honest scoping**, not a new independent check. Severity/applicability should scale sharply by site size (Google's own explicit guidance: this mostly matters for very large sites) — flagging crawl-budget concerns prominently for a small marketing site would be a real false-positive-adjacent miscalibration.

### M. Generalizes?
The synthesis approach generalizes well. The underlying Google-specific mechanics should not be presented as confirmed-universal across AI vendors, given the explicit evidence gap noted above.

### N. Candidate skill
Not a standalone skill — a **synthesis/narrative layer** drawing on Clusters I, II, VIII, and X's findings, most naturally belonging to whichever skill or entrypoint-level logic produces the final report narrative (Soham's Topic S/AB territory) rather than a new Pulkit detection skill.

### O. Relationship to other skills
Genuinely cross-cutting — the single clearest example in this entire document of the brief's instruction to prefer "one connected diagnosis" over "several unrelated findings": crawl-budget framing is the connective narrative tissue that ties Clusters I, II, VIII, and X together into a coherent "why is this site hard to crawl efficiently" story, rather than four separate unrelated bullet points.

---

## 2. Findings register
*(Selecting the strongest, most novel findings for the formal register rather than restating all 50 sub-topics — the full A-O treatment above serves as the complete record.)*

---
**FINDING ID:** C-01
**Researcher:** Pulkit
**Research Area:** C — Website Crawlability
**Research Question:** Cluster IV (C25) — Does combining a robots.txt block with a page-level noindex tag actually work as site owners commonly intend?
**Observation:** Google's own documentation explicitly states crawlers must successfully fetch a page to see its `<meta>` robots tags or `X-Robots-Tag` headers — meaning a robots.txt-disallowed page's noindex directive can never actually be observed or obeyed, silently defeating the site owner's evident intent.
**Evidence:** developers.google.com/search/docs/crawling-indexing/block-indexing (fetched directly, first-party).
**Sources:** See Cluster IV section C for full citation and quoted text.
**Pattern:** "Block in robots.txt AND noindex, to be extra safe" is a common, intuitive, but self-defeating misconfiguration — the two mechanisms should never be combined on the same URL; one or the other should be chosen based on whether the page should be crawlable-but-excluded (noindex, requires crawl access) or entirely uncrawled (robots.txt block, accepts residual index-appearance risk without a snippet).
**Counterexamples:** A robots.txt block with no noindex intent at all (e.g., blocking `/admin/`) is completely legitimate and not evidence of this contradiction pattern by itself.
**Hypothesis:** N/A — direct reading of Google's own documented mechanism.
**Signal:** Cross-reference between Cluster III's robots.txt parse and any detectable evidence of intended noindex on the same, robots.txt-blocked URLs.
**How to Detect:** Deterministic parsing of both signal layers, cross-referenced; direct confirmation limited by our own audit's robots.txt-respecting constraint (we cannot fetch a blocked page to directly check for a noindex tag we're not permitted to retrieve).
**Evidence Output:** Flagged URL(s), the contradictory signal pair, and plain-language explanation of why this produces the opposite of the evident intent.
**False Positives:** Robots.txt blocks with no noindex intent.
**False Negatives:** Direct confirmation is inherently limited since we respect robots.txt ourselves; relies on indirect evidence.
**Severity:** High — produces the opposite of the site owner's evident intent, a genuinely surprising and valuable finding for a non-expert.
**Recommended Fix:** Choose one mechanism per URL: robots.txt block (accept residual indexing risk without snippet) or allow-crawl-plus-noindex (reliable removal).
**Generalization:** Universal — pure protocol-interaction mechanics.
**Candidate Skill:** `crawlability-audit` (Cluster IV sub-module).
**Related Skills:** Cluster III (robots.txt).
**Confidence:** HIGH — directly sourced from Google's own primary documentation, unambiguous.

---
**FINDING ID:** C-02
**Researcher:** Pulkit
**Research Area:** C — Website Crawlability
**Research Question:** Cluster V (C29-C31, C36) — Is `rel="canonical"` a reliable, deterministic signal, and what happens when it conflicts with other signals?
**Observation:** Google's own documentation explicitly ranks canonicalization signals by strength (redirects strongest, canonical tags "strong" but not absolute, sitemap inclusion explicitly "weak"), states plainly that none are required and a site "will likely do just fine" without them, and maintains a dedicated Search Console report category ("Duplicate, Google chose different canonical than user") specifically for the common case where Google's algorithm overrides an explicit canonical tag.
**Evidence:** developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls (fetched directly, first-party); corroborated by multiple independent secondary sources describing the same GSC report category consistently.
**Sources:** See Cluster V section C.
**Pattern:** `rel="canonical"` is advisory, not deterministic — our audit should report canonical-signal internal consistency (do the site's own signals agree with each other) rather than claiming certainty about what any downstream system will actually treat as canonical.
**Counterexamples:** Self-referencing canonicals and legitimate cross-domain syndication are both normal, non-defective patterns that superficially resemble "canonical complexity" but aren't errors.
**Hypothesis:** N/A — direct reading of Google's documented signal-hierarchy.
**Signal:** Internal consistency across canonical tags, sitemap listings, and redirect targets for the same apparent content.
**How to Detect:** Deterministic cross-referencing of Clusters II, V, and VI's respective parsed data.
**Evidence Output:** Specific conflicting-signal examples (e.g., sitemap says X, canonical tag says Y for the same content), framed as a signal-consistency issue.
**False Positives:** Self-referencing canonicals; legitimate syndication.
**False Negatives:** Even fully internally-consistent signals don't guarantee any specific system honors them, given documented algorithmic override behavior.
**Severity:** High for sitemap/canonical mismatches (C36) and broken canonical targets (C30); Medium for other inconsistencies.
**Recommended Fix:** Align canonical tag, sitemap listing, and redirect target to name the same single preferred URL.
**Generalization:** Universal mechanics; volume of surface area scales with site/catalog size.
**Candidate Skill:** `crawlability-audit` (Cluster V sub-module).
**Related Skills:** Cluster II (redirects), Cluster VI (sitemaps).
**Confidence:** HIGH for Google's own documented signal ranking (first-party) / MEDIUM for the specific "~40 signals" and podcast-sourced elaboration (on-record but secondarily reported, not a directly fetched primary transcript).

---
**FINDING ID:** C-03
**Researcher:** Pulkit
**Research Area:** C — Website Crawlability
**Research Question:** Cluster VIII (C42) — How significant is faceted-navigation/parameter sprawl as a real-world crawlability problem, versus being a minor edge case?
**Observation:** Google's own faceted-navigation documentation explicitly frames combinatorial parameter generation as a "crawl trap" risk, with a Google Search Relations team member reported to have specifically attributed roughly half of all crawling issues reported to Google to this exact problem category.
**Evidence:** developers.google.com/crawling/docs/faceted-navigation (fetched directly, first-party); Gary Illyes statement reported consistently across multiple independent secondary sources (OBSERVATION-tier, not a directly fetched primary transcript).
**Sources:** See Cluster VIII section C.
**Pattern:** Unconstrained combinatorial parameter/filter generation is a major, well-evidenced, high-impact crawlability problem category — not a minor edge case — and produces multiple connected downstream symptoms (crawl-budget waste, duplicate-content/canonical-inconsistency risk, soft-404-like empty-filter pages) from one root architectural cause.
**Counterexamples:** Faceted navigation itself is a legitimate, valuable UX pattern per Google's own framing — only unmanaged, unconstrained sprawl (no parameter-blocking, no canonical consolidation, no proper 404 handling for empty results) is the actual defect.
**Hypothesis:** N/A for the core Google-documented mechanism; the specific "half of all crawling issues" figure should be treated as a strong but not fully primary-verified statistic.
**Signal:** Evidence of unconstrained combinatorial parameter/filter URL generation discovered during link-graph crawling, without apparent mitigation (parameter blocking, canonicalization, proper 404 handling).
**How to Detect:** Deterministic, building on Cluster VII's link-graph crawl — classify discovered URLs by parameter pattern, flag evidence of combinatorial growth without mitigation.
**Evidence Output:** Sample of distinct parameter combinations found, evidence of mitigation presence/absence, specific empty-result-handling examples if checked.
**False Positives:** Well-managed faceted navigation with proper blocking/canonicalization/404-handling should not be flagged merely for having filters.
**False Negatives:** Bounded 5-minute crawl budget may under-sample a large site's true parameter space.
**Severity:** High when unconstrained sprawl with no mitigation is evident, given the well-evidenced real-world impact.
**Recommended Fix:** Use `&` as parameter separator; block unnecessary parameters via robots.txt/nofollow; ensure canonical consolidation for near-duplicate filter combinations; return proper 404s for empty filter results.
**Generalization:** Especially prevalent on e-commerce/marketplace/catalog site types; less relevant for small marketing sites — genuine site-type-dependent prevalence.
**Candidate Skill:** `crawlability-audit` (Cluster VIII sub-module).
**Related Skills:** Cluster V (canonicalization), Cluster X (soft 404s), Cluster XI (crawl budget) — a genuine multi-symptom root cause.
**Confidence:** HIGH for the core documented mechanism (first-party) / MEDIUM-HIGH for the specific "half of all issues" statistic (consistently reported, on-record Google spokesperson, but secondarily sourced).

---
**FINDING ID:** C-04
**Researcher:** Pulkit
**Research Area:** C — Website Crawlability
**Research Question:** Cluster X (C19) — What exactly is a soft 404, and does its detection require more than a simple content-length check?
**Observation:** Google's own documentation defines soft 404s precisely (200 status, content signals "not found"/empty) and explicitly, distinctly notes that soft-404 classification can differ by device type for the same URL, since mobile-specific rendering failures (JS errors, missing server-side logic on the mobile path) can produce a soft 404 on mobile while desktop renders correctly for the identical URL.
**Evidence:** developers.google.com/search/blog/2010/06/crawl-errors-now-reports-soft-404s (fetched, first-party definition); device-specific detection detail reported via a Google Search Relations team member statement, consistently described across independent secondary sources (OBSERVATION-tier).
**Sources:** See Cluster X section C.
**Pattern:** A single-fetch, single-user-agent soft-404 check risks missing device-specific soft-404 problems entirely; a page can be "fine" by one rendering path's evidence and effectively broken by another's.
**Counterexamples:** A legitimately short, minimal but complete page (e.g., a simple contact/hours page) is not a soft 404 merely for brevity — detection must target emptiness/error-signaling language and content-purpose mismatch, not length alone.
**Hypothesis:** N/A for the core Google-documented definition; our own extension to AI-vendor-crawler relevance is INFERENCE, not directly confirmed for any AI vendor specifically.
**Signal:** 200-status pages whose content signals emptiness/error despite success status, checked across at least a desktop-equivalent and mobile-equivalent fetch where feasible.
**How to Detect:** Hybrid — deterministic content-thinness/phrase-pattern heuristics as a fast first pass, LLM semantic-escalation for ambiguous cases.
**Evidence Output:** Flagged pages with specific classification evidence, noting any desktop/mobile classification divergence.
**False Positives:** Legitimately short/minimal-but-complete pages; intentionally minimal landing pages.
**False Negatives:** Soft-404 phrasing patterns not covered by heuristics, not caught by LLM escalation within budget-limited sampling.
**Severity:** High for apparently-important pages (per sitemap/naming) exhibiting soft-404 patterns; Medium for device-specific-only cases.
**Recommended Fix:** Restore genuine content, or return a proper 404/410 status instead of a false 200.
**Generalization:** Universal mechanics; phrase-pattern heuristics may need light language/site-type adaptation.
**Candidate Skill:** `crawlability-audit` (Cluster X sub-module), sharing infrastructure with Topic K (AI Answerability) — a genuine cross-topic bridge.
**Related Skills:** Cluster I (HTTP status), Cluster VII (crawl infrastructure), Topic K (AI Answerability).
**Confidence:** HIGH for the core soft-404 definition and mechanism (first-party) / MEDIUM for the device-specific-classification detail (on-record but secondarily reported) / LOW-MEDIUM (explicit INFERENCE, clearly labeled) for generalizing the mechanism's relevance to AI-vendor crawlers specifically, which is not directly confirmed by any source found.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
The recurring, cross-cluster pattern that **Google's own documentation repeatedly distinguishes "technically present/reachable" from "actually effective/honored,"** and this distinction is almost always first-party-documented, not speculative: `noindex` requires crawl access it may not have (Cluster IV); `rel="canonical"` is explicitly advisory, not a command, with a dedicated GSC report category for when it's overridden (Cluster V); a sitemap doesn't guarantee crawling/indexing (Cluster VI); a page can return 200 and still be functionally a 404 (Cluster X). This is a genuinely load-bearing, well-evidenced meta-pattern for the whole marketplace, not just Topic C: **the correct mental model throughout this entire research area is "signals and preconditions," never "guarantees,"** and our audit's language should consistently reflect this rather than overclaiming certainty anywhere.

**Strongest unvalidated hypothesis:**
That Google's documented crawl-budget mechanics (Cluster XI) — particularly the shared-capacity-across-multiple-bots-per-vendor structure — extend by analogy to AI vendors' own multi-token bot setups (Cluster III's training/search/user-fetch token families potentially competing for shared underlying capacity against a given site, the way Google's own Image/News/Web bots do). This is a plausible, mechanism-consistent extension given the structural parallel (multiple purpose-specific bots per vendor is a pattern both Google and the AI vendors clearly share), but it is explicitly my own inference, not confirmed by any AI vendor's own documentation, and should be validated (or explicitly caveated as unconfirmed) before being encoded into any severity logic.

**Strongest candidate skill:**
The unified **`crawlability-audit`** skill, composed of the eleven clusters above sharing common crawl/fetch infrastructure (particularly Cluster I's HTTP layer and Cluster VII's link-graph crawl, which most other clusters build directly on top of). This is a fully deterministic, low-false-positive-risk, high-generalization skill — genuinely one of the strongest candidates in the entire marketplace for exactly the reasons established in my original Topic C research: it's cheap, fast, near-zero-hallucination-risk, and gates/contextualizes nearly every other skill's findings, making it a natural first check in the entrypoint's execution order.

**Weakest assumption we should investigate next:**
The entire AI-vendor-specific portion of Cluster III (the per-token purpose table) carries genuinely uneven confidence across vendors — HIGH for OpenAI and Anthropic (both directly verified against current, first-party documentation), but only MEDIUM/OBSERVATION-tier for Perplexity (consistent secondary reporting, not independently verified against an equally authoritative primary source) and structurally uncertain for Google/Gemini (whose citation pathway may run through general Google Search infrastructure rather than a dedicated, separately-controllable AI bot token). Before finalizing the skill's per-vendor severity logic, Perplexity's own official crawler documentation should be directly fetched and verified with the same rigor applied to OpenAI/Anthropic in this research pass, and Gemini's actual grounding-pathway crawl mechanics should be explicitly researched rather than left as an acknowledged gap.

---

## 4. Cross-references for the Combine & Code phase

- **Cluster III (AI bot tokens) ↔ Topic A (A11, A19, mine):** The most concrete, deterministic, first-gate evidence source for Topic A's abstract three-gate retrieval model — should run early in the entrypoint's execution sequence.
- **Cluster IV/V (noindex+robots.txt contradiction; canonical-signal-conflict) ↔ Topic S (Soham, Scoring & Severity):** Both findings represent genuinely surprising, high-value, "the site owner's own configuration defeats their own intent" patterns — strong candidates for prominent placement in the report's narrative synthesis, not buried as minor technical footnotes.
- **Cluster VI (`lastmod` credibility, C34) ↔ Topic I (mine, Freshness):** Explicit, still-unresolved ownership flag carried over from my original Topic C research — will finalize whether this lives in `crawlability-audit` or a separate freshness skill when Topic I is written, and will not duplicate the detection logic under two names.
- **Cluster VII (link-graph crawl infrastructure) ↔ Topic AE (Crawling Strategy, mine) and Topic AG (Site Graph, mine):** This cluster's link-graph-building work is very likely the *same underlying crawl* that AE/AG need — should be designed once, jointly, when those topics are written, not duplicated.
- **Cluster VIII (faceted navigation) ↔ Cluster V, Cluster X, Cluster XI:** The clearest single example of "one connected diagnosis, not several unrelated findings" in this entire document — recommend the entrypoint's report explicitly narrates this as one root-cause story with multiple downstream symptoms, directly modeling the brief's own JS-only-pricing example format.
- **Cluster VIII/C42 severity weighting; Cluster IX/C49 case-sensitivity applicability ↔ Topic V (Soham, Site-Type Differentiation):** Both findings have severity/relevance that should scale by detected site type/characteristics (e-commerce/catalog prevalence for faceted navigation; hosting-configuration dependence for case-sensitivity) — should consume Topic V's site-type classifier as an input rather than building weaker parallel logic.
- **Cluster X/C19 (soft 404s) ↔ Topic K (AI Answerability, mine):** A genuine bridge finding between this document's "can it be reached" scope and Topic K's "is there anything worth answering with" scope — the underlying detection mechanism (genuine, substantive, extractable content present or not) is very likely shared infrastructure, to be resolved when Topic K is written.
- **Cluster IX/C50 (language/locale architecture) ↔ future research:** Explicitly flagged as receiving only shallow treatment in this pass; recommend dedicated follow-up research on `hreflang` mechanics if the marketplace's scope requires serious international-site coverage, rather than shipping the current shallow treatment as if it were complete.
- **Cluster XI (crawl budget) ↔ Topic AE (Crawling Strategy, mine):** Google's documented crawl-budget mechanics (crawl capacity adapts to server health, starts conservative) are directly relevant design input for how *our own* crawler should behave politely and efficiently within the 5-minute runtime budget — worth explicit cross-reference when Topic AE is written, since the same underlying mechanics (don't overwhelm a slow/struggling server, respect Crawl-delay where present) apply to our own crawling agent, not just to the target site's relationship with Google/AI vendors.
