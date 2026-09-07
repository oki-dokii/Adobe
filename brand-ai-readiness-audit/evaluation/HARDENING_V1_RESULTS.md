# Hardening V1 — before / after (same 19-site matrix)

**Matrix:** `evaluation/sites.yaml` — 19 origins × cold + warm = 38 runs.  
**Config:** `max_seconds=280`, `page_cap=40`, `render_max=10` (production defaults).  
**Baseline:** `evaluation/results_before_hardening_v1/` (first real-world pass).  
**After:** `evaluation/results/` (this pass).  
**Unit tests:** `pytest tests -q` → **106 passed** (prior 92 + 14 hardening).

| | Before | After |
|---|---|---|
| Completed audits | 38/38 | 38/38 |
| Skill crashes | 0 | 0 |
| Median runtime | 31.4s | 18.7s |
| Slowest | 101.9s (Stripe) | 77.4s (Stripe) |
| Under 300s | 38/38 | 38/38 |
| `render_count > render_max` | 21 runs (Stripe 39, Shopify 40, GOV.UK 39, …) | **0** |

---

## ISSUE 1 — Price materiality

### BEFORE
Currency regex (`PRICE_RE`) treated any `$` amount as a commercial price. Combined with `qualifier_split` and `page_type=pricing` from **host substring** (`stripe.com` contains `price`), this produced **Critical** findings on business metrics.

- Stripe cold: **7 Critical** `qualifier_split`, including `$500 million` ARR / annual recurring language.
- Shopify cold: **1 Critical** on `US$250,000` annual credit (not a plan price).
- Across 38 runs: **25** `qualifier_split` (**16 Critical**); **10** of those evidence strings were metric-like (million / ARR / revenue / raised / `$500` million).

### FIX
- Typed classifier `scripts/lib/money.py`: **metric** (scale words, compact `$5B`, closed metric *roles*, amounts ≥ 1e6) vs **offer** (rate units, structural frames, commercial lead-in) vs **unknown** (abstain).
- Facts, CIT qualifier/schema, K6, SK-I, SK-D price-lock, and SK-X STTF consume **offer** spans only.
- `Finding.materiality` stays `pass` on offer splits; architecture cap `materiality fail → low` is wired in `admit()`.
- `classify_page_type` uses **path segments**, not host substrings.
- Pricing-page promotion of unlabeled amounts only if `0 < amount < 10_000` (sticker/fee range), not credit-line figures.

### AFTER
- ARR / `$500 million` **no longer** appears as a price Critical.
- Shopify `$250,000` credit Critical **gone** (0 Critical on Shopify cold).
- Stripe cold: **15 Critical** `qualifier_split` on **https://stripe.com/au/pricing** — fee per card (`A$0.30`), `per month` plans, reader hardware, `US$500.00 one-off setup fee`. These are commercial prices/fees, not ARR.
- Genuine fixtures still fire (`$29/month`, `Plans start at $49`, `Pricing: $99 per user`, listed-amount qualifier split).

**False price Criticals (metric language):** 7 Stripe + 1 Shopify (cold) **→ 0**.  
**Real pricing still fires:** yes (Stripe AU pricing rate card / plans).

---

## ISSUE 2 — 403 / WAF / bot-wall

### BEFORE
Etsy and Red Cross returned 403/challenge HTML. That body was treated as the site, producing **K3 + K6 + K13 `unanswerable`** (3 each, cold).

Philz previously returned usable HTML (10 renders).

### FIX
`classify_http_access` + `content_usable` on the crawl path. Challenge/captcha/401/429/5xx/empty/HTTP≥400 bodies are **not** `fetched_pages()`. Skills abstain with `per_question=insufficient` and a **low** `coverage_statement`. Independent URLs still crawl. Limitations record the access class. Legitimate long 403 HTML is `forbidden_content` (not automatically WAF) but still not public brand evidence.

### AFTER (cold)

| Origin | access_kind | usable pages | K3/K6/K13 unanswerable | Marked |
|---|---|---|---|---|
| Etsy | `captcha` | 0 | **0** (was 3) | coverage_statement + limitation |
| Red Cross | `forbidden_content` (403, substantial HTML, no challenge chrome) | 0 | **0** (was 3) | coverage_statement + limitation |
| Philz | `captcha` | 0 | **0** | coverage_statement (origin now blocked vs prior crawl) |

False answerability from challenge bodies: **6 (Etsy+Red Cross cold) → 0**.  
Inaccessible pages are explicit in `coverage.access_kinds`, `limitations[]`, and the coverage finding.

---

## ISSUE 3 — `render_max` bypass

### BEFORE
`do_render = protected or render_used < plan_max` plus substring tokens (`price` in `stripe.com`) made the cap unbounded.

| Origin (cold) | render_count |
|---|---|
| Stripe | 39 |
| Shopify | 40 |
| GOV.UK | 39 |
| Mozilla | 36 |
| Harvard | 28 |
| Python docs | 27 |

### FIX
Hard cap: `do_render = render_used < plan_max`. Protected path segments (`/pricing`, `/about`, `/contact`, seed) **boost heap priority only**. No extra slots. Coverage: `render_max`, `renders_requested`, `renders_performed`, `renders_skipped_budget`, `protected_render_requests`, `protected_render_exceptions=0`.

When the budget is exhausted, further pages (including protected) are **skipped** and recorded; they do not replace an already rendered page.

### AFTER
Every run: `render_count <= 10` (`render_max`). Stripe/Shopify/GOV.UK/Mozilla/Harvard/Python docs cold: **10**.  
`protected_render_exceptions`: **0**.

**Runtime:** median 31.4s → 18.7s; Stripe 101.9s → 77.4s (fewer dual-fetch expansions).

---

## Other notes (not in the three-issue gate)

- K3/K6 `unanswerable` on **usable** origins (example.com, Wikipedia, docs, Shopify K3) is largely the existing closed-book regex / “we are …” span, plus a smaller rendered sample. Not scored as a WAF false positive.
- Shopify still emits `on_site_fact_conflict` across several offer-like numbers on `/in/pricing` (locale pricing table).
- Cloudflare blog: 1 `challenge` page among 40; other pages remained usable.
