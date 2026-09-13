# Hardening V1 audit

**Date:** 2026-09-07  
**Scope:** three confirmed real-world defects only. No new skills, no DAG redesign, no search APIs, no live AI probes, no OCR, no ReAct, no demo frontend.

**Decision:** **READY FOR DEMO** of the locked 10-skill auditor, with documented residual answerability FNs that were **not** the hardening gate.

The three assigned defects are closed with before/after evidence on the **same** 19-site matrix.

---

## 1. Fixes implemented

1. **Price materiality** — `scripts/lib/money.py` classifies monetary spans as `offer | metric | unknown`. Finding generation (facts, CIT, K6, I, D price-lock, X) uses offers only. Path-based page types. Materiality fail caps severity in `admit()`.
2. **Access / WAF** — `scripts/lib/access.py` + crawl tagging (`access_kind`, `content_usable`). Unusable bodies excluded from `fetched_pages()`. K abstains (`insufficient` + `coverage_statement`). Limitations on snapshot.
3. **Render budget** — production crawl: `render_count <= render_max` always. Protected URLs change **priority**, never extra renders. Instrumentation on coverage.

Supporting: `scripts/lib/clock.py` path-segment `is_protected_fact_url`; `extract.classify_page_type` no longer matches `price` inside `stripe.com`.

## 2. Tests added

`tests/test_realworld_hardening.py`:

- PRICE: ARR, revenue, funding, valuation, transaction/volume, market size, salary; genuine monthly/annual/plan/fee/subscription; facts + qualifier_split regression; host ≠ pricing type.
- ACCESS: 401, 403 empty, 429, 503, captcha, challenge, CF-style, legitimate forbidden HTML, full-audit no K unanswerable.
- RENDER: many `/pricing` URLs, mixed/normal, duplicates, all-protected, budget exhausted (including later protected). Proves `render_count <= render_max`.

`tests/test_p0_render.py` now asserts a **hard** cap (no protect-list overflow).

## 3. Tests passing

```
pytest tests -q
106 passed
```

Previous 92 remain green.

## 4. Real-world before/after

See `evaluation/HARDENING_V1_RESULTS.md` and `evaluation/results_before_hardening_v1/` vs `evaluation/results/`.

- 38/38 success, 0 partial, 0 skill crashes, all &lt; 300s.
- Median 31.4s → 18.7s; slowest 101.9s → 77.4s.

## 5. Remaining false positives

- Stripe AU **pricing** page: up to 15 Critical `qualifier_split` on per-card fees and plan/hardware amounts. These **are** commercial prices; the split heuristic is noisy on dense rate tables (GST / card type often in the next window). Not ARR.
- Shopify `on_site_fact_conflict` on one locale pricing URL (several offer-like numbers). Not a metric-ARR Critical.

## 6. Remaining false negatives

- K3 still misses many homepages that do not match `we are a …` / `we provide …` (Shopify, Harvard, docs, portfolios). Pre-existing span policy; tightening money detection and render cap did not invent this, and can slightly **reduce** corpus for K3.
- K6 `unanswerable` on news/gov/docs sites without public commercial offers — often correct abstention for “what does it cost?”
- Unlabeled `$49` on a non-pricing page with no rate/frame/lead stays `unknown` (intentional abstention).
- Red Cross 403 classified `forbidden_content` (long HTML, no challenge chrome) rather than `challenge`. Body still unused; not labeled WAF.

## 7. Runtime impact

Render cap dominates: fewer dual-fetch expansions. Median **−40%**, Stripe **−24s**. Crawl remains the dominant component.

## 8. Render budget behavior

| Rule | Semantics |
|---|---|
| Cap | `renders_performed <= render_max` (clock may shrink to 4). |
| Priority | Seed + path segments `pricing|price|prices|about|about-us|contact` score higher. |
| Exhaustion | Further pages `render_status=skipped`; counted in `renders_skipped_budget`. |
| Replacement | None — no kicking a prior render for a later protected URL. |
| Exceptions | `protected_render_exceptions = 0` (no unbounded exception). |

Observed: **0** runs exceed the cap (was 21).

## 9. 403 / WAF handling

Kinds: `ok | challenge | captcha | unauthorized | rate_limited | unavailable | empty | forbidden_content | error_document`.  
Not every 403 is WAF. Challenge HTML does not drive K3/K6/K13 defects. Etsy: captcha + explicit limitation. Independent pages continue when some URLs fail (Cloudflare blog: 1 challenge + 39 ok).

## 10. Price-materiality behavior

Evidence order: scale/role/large amount → metric; rate/frame/lead-in → offer; else unknown; pricing/product pages may promote small unlabeled amounts only. Public report uses “price” only for offer-backed findings.

## 11. Architecture

Unchanged: 11 marketplace skills, one orchestrator entrypoint, locked finding types, skip-ladder, protect-list **skills**, P-order compare, dual report. No new marketplace skill for WAF or pricing.

## 12. Demo gate

The first validation pass was **NEEDS HARDENING BEFORE DEMO** for (1) ARR Criticals, (2) challenge-as-content K findings, (3) unbounded renders.

Those three are fixed with regression tests and a full matrix re-run.

Residual K3 span misses and noisy-but-plausible Stripe rate-card splits are **not** the same class of demo-breaking bugs.

**READY FOR DEMO**
