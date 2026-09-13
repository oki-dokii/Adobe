# REAL_WORLD_VALIDATION.md

First evaluation pass of `brand-ai-readiness-audit` against **unseen public origins**. Production architecture was not redesigned. Safety mechanisms were not disabled.

**Harness:** `evaluation/run_evaluation.py`  
**Config:** `evaluation/sites.yaml` (URLs are not in `scripts/lib/`)  
**When:** 2026-09-06  
**Budget:** `max_seconds=280`, `page_cap=40` (production defaults)  
**Runs:** 19 sites × cold + warm = **38 audits**  
**Safety preflight:** passed (`evaluation/results/safety_preflight.json`)

Live 5-minute constraint: **MEASURED** on these origins (all 38 finished under 300s). This is still not a claim that every website on the internet will.

---

## Decision gate

**B. NEEDS HARDENING BEFORE DEMO**

Evidence, not unit-test confidence:

| Gate | Evidence |
|------|----------|
| Real-site success | 38/38 orchestrator completions, 0 process crashes, 0 PARTIAL skill failures |
| Runtime | Slowest cold run **101.9s** (stripe.com); median **31.4s**; **38/38 under 300s** |
| Safety | GET/HEAD, hop SSRF, robots consulted, 0 SSRF blocks, no cookies/POST |
| Generalization | Thin/WAF origins (Etsy, Red Cross) look like empty brands; V cluster often mismatches the labeled type |
| Finding quality | **Critical qualifier/price findings on Stripe/Shopify are not product-price defects**; date-year mismatches flood gov/edu; K3-unanswerable on 403 bodies is misleading |

Not **A**: a demo would currently show Stripe with **7 Critical** “price qualifier split” findings on a `$500 million` ARR sentence.

Not **C**: the locked 10-skill DAG ran end-to-end on live HTTP. Problems are heuristic/implementation quality and crawl coverage against bot walls, not a missing skill folder.

---

## 1. Number of sites tested

**19 unique public origins** (enabled in `sites.yaml`). Each: 1 cold + 1 warm.

## 2. Site types (labeled in config)

static, saas, ecommerce, documentation, developer_platform, javascript_heavy, blog, news, university, government, nonprofit, multilingual, local_business, marketplace, directory, portfolio. Sizes small/medium/large. Stress tags: sitemap-heavy, JS-heavy, many-URLs, many-redirects, corroboration-heavy.

## 3. Successful audits

**38/38** `success=true`, `audit_status=ok` (no failed skills).

## 4. Partial audits

**0** (no skill exceptions, no skipped dependents from failures).

Skip-ladder still recorded **H/K subset** only when remaining time was low — it was **not** the limiter here. Crawls stopped on **page_cap** (`early_stop`) or **empty graph** (`budget` with 1 page).

## 5. Failed audits

**0** process failures. Several **completed** audits are **semantically failed crawls** (HTTP 403 / one-page challenge documents): Etsy, Red Cross. Wikipedia.org stayed at 1 page because almost all links leave `wikipedia.org` (language subdomains are different registrable hosts under our `same_registrable` rule).

## 6. Runtime statistics (from live `timing.*`, not inferred)

All 38 runs:

| Stat | ms | seconds |
|------|----|---------|
| Fastest | 482 | 0.48 (redcross warm) |
| Slowest | 101914 | **101.9** (stripe cold) |
| Median | 31358 | **31.4** |
| Mean | 35473 | 35.5 |
| p90 | 69729 | **69.7** |
| Under 300s | 38/38 | |

Cold vs warm: most large sites were faster on warm (NASA −66s, Harvard −33s, GOV.UK −31s) without an application HTTP cache — DNS/TLS/OS cache. React.dev was essentially unchanged.

**Crawl dominates** every non-trivial run (typically 85–95% of `total_ms`). Skills are seconds; report/merge are sub-millisecond to ~2ms.

`llm_calls` = **0** on every run. `extraction_ms` remains **0** (extraction is folded into crawl/render; not a separate clock).

## 7. Slowest cases (cold)

1. stripe.com — 101.9s, 60 HTTP, 40 pages, **39 renders**
2. nasa.gov — 98.0s, 60 HTTP, 40 pages, 19 renders
3. shopify.com — 73.6s, 46 HTTP, 40 pages, **40 renders**
4. taniarascia.com — 69.0s, 52 HTTP, 40 pages, 11 renders, **6 external GETs** (H)
5. gov.uk — 69.7s, 57 HTTP, 40 pages, **39 renders**

## 8. Skill success rates (19 cold sites)

| skill | sites_run | success_rate | findings (user-facing, cold) | errors | partial_runs | typical runtime | known_issues |
|-------|-----------|--------------|------------------------------|--------|--------------|-----------------|--------------|
| site-type-classifier | 19 | 100% | 3 YMYL | 0 | 0 | &lt;1ms | Mis-labels example.com as cluster D; Etsy/Wiki/Red Cross unknown |
| crawl-access-audit | 19 | 100% | 1 AI-token, 5 orphan | 0 | 0 | ms–11ms | Orphans are often crawl-graph artifacts |
| render-extract-audit | 19 | 100% | 0 js_fact_lock | 0 | 0 | 0–5s | No JS-lock on JS-tagged sites; dual-fetch ≈ raw |
| citation-extractability-audit | 19 | 100% | 12 qualifier_split, 5 table_no_th | 0 | 0 | 0–1s | **Critical** splits on ARR/credit dollar amounts |
| entity-identity-audit | 19 | 100% | 1 collision, 1 sameAs 404 | 0 | 0 | ms–2.3s | Jekyll “collision” is weak |
| freshness-audit | 19 | 100% | 34 date_divergence, 8 price conflicts | 0 | 0 | ms–44ms | Year lists vs schema on history pages |
| ai-answerability-audit | 19 | 100% | 19 unanswerable, 8 wrong_page | 0 | 0 | ms–37ms | Unanswerable on 403 bodies |
| corroboration-consistency-audit | 19 | 100% | 0 linked_contradiction | 0 | 0 | ms–4.5s | Correctly silent without useful sameAs; Tania fetched 6 URLs |
| engagement-handoff-audit | 19 | 100% | 1 scent_break | 0 | 0 | ms–1s | STTF not seen on this matrix |
| audit-orchestrator | 19 | 100% | n/a | 0 | 0 | = total | Page cap binds before 280s |

## 9. Findings by category (cold, user-facing)

| finding_type | n |
|--------------|---|
| date_divergence | 34 |
| unanswerable | 19 |
| qualifier_split | 12 |
| on_site_fact_conflict | 8 |
| wrong_page | 8 |
| orphan | 5 |
| table_no_th | 5 |
| ymy_disclosure | 3 |
| ai_token_disallow | 1 |
| collision_risk | 1 |
| scent_break | 1 |
| sameas_404 | 1 |

Absent (good vs prior P0/P1 bugs): missing schema, missing sitemap, missing canonical, uncorroborated-because-no-sameAs, parent+child dual Criticals on JS-lock (no JS-lock fired).

## 10. Suspected false positives

| Case | Mark | Why |
|------|------|-----|
| Stripe ×7 Critical `qualifier_split` on “$500 million of annual recurring…” | **FALSE POSITIVE** | Not a purchasable plan price; severity Critical is wrong |
| Shopify Critical `$250,000` annual credit / `$200,000` rewards | **FALSE POSITIVE** | Same PRICE_RE + split heuristic |
| Shopify `on_site_fact_conflict` values `0,1,114,19,2.30,200000` | **LIKELY FALSE POSITIVE** | Mixed numerals, not one SKU price |
| NASA/Harvard/GOV.UK `date_divergence` (body years vs schema) | **LIKELY FALSE POSITIVE** | Historical content vs `dateModified` |
| NASA/BBC/GOV.UK `ymy_disclosure` High | **UNKNOWN / LIKELY FP** | Cluster A + YMYL lexicon; not medical advice pages |
| Etsy/Red Cross K3/K6/K13 unanswerable High/Med | **FALSE POSITIVE as brand defect** | 403/challenge corpus; remediation “add a sentence” is nonsense |
| example.com K3 High | **TRUE POSITIVE** of emptiness | IETF example is not a brand; still a poor demo exhibit |
| Jekyll `collision_risk` High | **LIKELY FALSE POSITIVE** | Distinctive product name |
| BBC `ai_token_disallow` | **TRUE POSITIVE** | Intentional robots split; Medium is aligned |
| Orphans on sitemap-priority URLs | **UNKNOWN** | Graph is a 40-page sample |

## 11. Suspected false negatives

| Case | Mark | Why |
|------|------|-----|
| react.dev / nextjs.org no `js_fact_lock` | **UNKNOWN** | Homepages already had large raw HTML; inner client-only facts not proven |
| No `linked_contradiction` on 19 sites | **UNKNOWN** | Linked-only scope; many sites have no fetchable sameAs |
| Wikipedia language editions not crawled | **EXPECTED LIMITATION** | `same_registrable` keeps `en.wikipedia.org` out of `wikipedia.org` |
| Etsy marketplace thin-directory U3 | **FALSE NEGATIVE of U3 path** | Never classified cluster B because the page was a 403 stub |

## 12. Render gaps

See `evaluation/render-gap-study.md`. Dual-fetch delta was **0** on 17/19 seeds; **+23 chars** on gov.uk; **403** on Etsy/Red Cross.

## 13. Crawl gaps

- **page_cap=40** hit on most “real” sites (`stopped_reason=early_stop`). Coverage is a sample, not a site map.
- **`render_max` did not bind** when URLs contain `price`/`about`/`contact` (protect-list token match). Stripe 39 renders, Shopify 40, GOV.UK 39 vs intended M≈10. **CONFIRMED implementation bug** (documented, not patched in this pass).
- **Bot walls:** Etsy/Red Cross → 1 page.
- **Cross-host language portals:** Wikipedia.
- **`stopped_reason=budget` on 1-page sites** is a misleading label (heap empty / no in-scope links), not the 280s clock.

## 14. Security incidents

None observed. No SSRF blocks on these public hostnames. Redirect hops checked (stripe/shopify/philz seeds used 1 hop). Robots fetched (`ok` / `missing` / `fail_open` for Red Cross). No forms, no cookies, no POST.

Red Cross `robots_status=fail_open` then a 403 homepage is a **P2-class robots/timeout vs WAF** interaction, not an exploit.

## 15. Runtime bottlenecks

1. Serial GET + 0.2s rate limiter × up to 40 pages (crawl_ms).
2. Unbounded dual-fetch when protect-list tokens match too many URLs.
3. HTML parse on large pages (D/X ~1–5s on Stripe).
4. H extra GETs only showed up clearly on Tania (~2.4s external_fetch_ms, 6 fetches).

Skip-ladder did **not** drop H (remaining ≫ 45s). Page cap, not T_h, stopped work. **No HTTP cache** in the client.

## 16. Generalization problems

- **Works better** on server-rendered docs/marketing (Python docs, MDN, Jekyll, Philz) than on WAF-fronted consumer marketplaces.
- **Overfires** date and dollar heuristics on large CMS (NASA, Harvard, GOV.UK, Stripe).
- **Cannot distinguish** “tiny brand with no offering sentence” from “we fetched a 403 document.”
- **V cluster** is a weak prior on live homepages (Shopify→F not ecommerce-only; example.com→D).
- Strongest **actionable** live finding in this set is likely BBC AI-token disallow, not Stripe Criticals.

## 17. Top implementation bugs (do not fix in this pass except as already noted)

1. Protect-list URL tokens (`price`, `about`) explode `render_max`. **CONFIRMED**
2. PRICE_RE + qualifier_split + Critical on non-offer currency. **CONFIRMED**
3. `on_site_fact_conflict` treats unrelated numbers as one fact type. **LIKELY**
4. `stopped_reason=budget` for empty frontier. **LIKELY**
5. 403/challenge pages scored as content gaps. **CONFIRMED**

## 18. Top architecture concerns

1. Linked-only H stays silent on most marketing sites — expected, but demos will look “empty” for corroboration.
2. Dual-fetch without a browser cannot claim Gate 2 (JS-lock) on real SPAs; this matrix did not produce a clean JS-lock TP.
3. Single vantage / no challenge solving (Y-01, WAF) is a locked limitation, not a missing skill.

## 19. What is working well

- Live GET path with hop SSRF and robots did not explode or hang past 280s.
- All 11 marketplace skills ran; isolation was untested by live exceptions (none occurred).
- No sameAs-absence spam; no missing-schema/sitemap/canonical spam.
- Warm runs show crawl is the only lever that matters.
- Instrumentation (`http_requests`, `pages_rendered`, `robots_status`, `timeout_count`, `redirect_hops_total`) came from the run, not a post-hoc guess.

## 20. What needs fixing (before demo)

1. Dollar-amount Criticals (materiality: offer price vs any `$`).
2. WAF/403 detection → limitation, not K3 High.
3. Tighten dual-fetch protect URLs so `render_max` is real.
4. Date-divergence on historical years.
5. Relabel empty-frontier stop reason.
6. Curate demo origins (avoid example.com and 403 sites as hero cases).

---

## False-positive checklist (prior P0/P1 classes)

| Class | Observed on live matrix |
|-------|-------------------------|
| SPA chrome as JS-lock | Not fired (TN or FN — see render study) |
| Missing schema | Not emitted |
| Missing sitemap | Not emitted |
| Missing canonical | Not emitted |
| SaaS without pricing | Stripe had prices in HTML; not V-F |
| Thin-by-design directory | Wikipedia/Etsy not classified B; U3 unused |
| Mission-page voice | Not isolated |
| Accordions/details | No STTF in this set |
| Wikipedia absence as defect | Not emitted |
| Parent/child Critical duplication | No JS-lock parent present |
| Generic “service” K3 | Not the failure mode here |
| Linked-only H | Silent except Tania sameAs 404 (ENT) |

---

## Problem confidence

**CONFIRMED PROBLEM**

- Stripe/Shopify Critical qualifier splits on non-offer money.
- `render_max` bypass via protect-list URL tokens.
- 403 origins reported as answerability defects.
- Dual-fetch ≈ no-op on seed HTML for this set.

**LIKELY PROBLEM**

- Date-divergence volume on gov/edu history pages.
- Numeric “price conflicts” across unrelated figures.
- YMYL High on NASA/GOV.UK.
- Misleading `stopped_reason=budget`.

**UNKNOWN**

- Whether a headless browser would create true JS-lock TPs on inner app routes.
- Whether skip-ladder T_h ever binds on slower networks (not seen here).
- Ground truth for every Medium finding (orphans, wrong_page, tables).

---

## How to reproduce

```bash
cd brand-ai-readiness-audit
PYTHONPATH=scripts:evaluation .venv/bin/python evaluation/run_evaluation.py
PYTHONPATH=scripts:evaluation .venv/bin/python evaluation/run_render_probe.py
```

Per-run metrics: `evaluation/results/runs/`  
Finding dumps: `evaluation/results/findings/`  
Aggregate: `evaluation/results/summary.json`
