# Decisions log

Living record of what we implemented in `brand-ai-readiness-audit`, what went wrong on real sites, how we approached it, and why the code looks the way it does.

Authoritative architecture remains `analysis/review/LOCKED_ARCHITECTURE.md`. This file is the engineering diary for the pack, not a second spec.

Last updated: 2026-09-07.

---

## 0. Constraints we refused to break

These are product decisions, not style preferences.

- **Exactly 10 marketplace skills.** PDF KEEP names map *into* existing folders. No 11th skill, no `live-citation-probe`, no Chromium-as-a-zip-requirement.
- **GET/HEAD only.** No search APIs, no ChatGPT probes, no paid APIs, no model weights.
- **No host allowlists.** Fixes must be structural (path shape, grammar, page_type, counts, locale segments). A site that improves tomorrow should improve without us naming it.
- **Missing schema is never a defect.** JSON-LD is only compared when it *contradicts* visible text.
- **Missing sitemap is never a defect.** Uniform `lastmod` is a weak freshness *statement*, not “add a sitemap.”

---

## 1. Live false positives (before the PDF gap work)

### What went wrong

Cold audits of public origins (Stripe, Jekyll, NASA, BBC, Shopify) produced findings that were technically matching regexes but were not useful defects:

| Noise | Why it fired | Why it was wrong |
|---|---|---|
| CIT `qualifier_split` on Stripe rate cards | `$` / `%` amounts with conditions on the next heading or `for cards` | RAG windows on a dense pricing page already have many self-contained rate lines; splitting every fee is noise |
| K3 High unanswerable on Jekyll-like copy | Offering regex wanted `we provide/offer` | Real identity is copula / transform grammar (`is a …`, `transform X into Y`, `the X for Y`) |
| K6 unanswerable on news/docs/gov | “What does it cost?” always scored | Wrong closed-book question for those clusters |
| I `date_divergence` on NASA-style history | Years 1948–2026 on one page vs CMS `dateModified` | History pages are not stale homepages |
| I price conflicts on one URL / one locale path | `/in/pricing` vs `/pricing` treated as two catalogs | Same offer, locale prefix |
| ENT `collision_risk` on NASA / ALL-CAPS titles | Short tokens treated as generic names | Acronyms and one-off titles are not “Apple”-class collisions |
| V YMYL / `.gov` ⇒ cluster A | Word `invest` inside `investigation`; `.gov` as advice | False YMYL and wrong cluster |
| Path classified by hostname substrings | Host contained `about` / locale | Locale-only path `/in` is a homepage, not an about page |

### Approach

1. Reproduce on generic fixtures (`site.test`, `brand.example`), never by special-casing Stripe/NASA.
2. Prefer **skip rules** (dense pricing, legal pages, history year-span) over adding vocab lists (GST, Zip, card brands).
3. Add regressions in `tests/test_fp_noise_v2.py`.

### Changes and reasoning

- **`skill_cit.py`:** Qualifier is same-sentence / `% + amount` / `for|per <word>`. Skip dense `page_type==pricing` with ≥4 offer spans. *Reason:* rate cards are one intended document, not 15 Critical splits.
- **`skill_k.py`:** K3 identity is grammar-only. Skip `we make progress`. Skip legal pages for K3. K6 is `expected_gap` on clusters A/C/D/E (not SaaS/ecom). *Reason:* completeness gaps must match site type; mission/legal pages are not offerings.
- **`skill_i.py`:** Ignore years &lt; 1990; year-span ≥4 ⇒ history; schema newer than body ⇒ no flag; price conflict needs ≥2 URLs and ≥2 locale-stripped paths; about-page facts excluded from price conflict; BCP-47 first segment stripped. *Reason:* freshness is “stale claim vs current claim,” not “this encyclopedia contains dates.”
- **`skill_v.py`:** Advice regex tightened; `.gov`/`.edu` vote C; “no reviewed by” must not count as disclosure. *Reason:* YMYL is for health/finance *advice pages*, not every government site.
- **`skill_ent.py`:** Collision only on a closed `COMMON` generic-token list; 2–6 letter ALL-CAPS stay low risk. *Reason:* WhoQA mix-up is “Acme the bank vs Acme the widgets,” not “NASA” in a title.
- **`extract.py`:** Classify by **path segments**, not host substrings; locale-only path ⇒ `home`. *Reason:* `/in` is a localized homepage.

---

## 2. PDF architecture vs this pack

### What we did *not* do

The Markdown Live Preview PDF describes ~13 KEEP checks. We did **not** add zip skills. Mapping:

| PDF idea | Owner in this pack |
|---|---|
| crawlability | `crawl-access-audit` |
| crawl-render | `render-extract-audit` (noscript/template dual-fetch, not Chromium) |
| structured-data integrity | **inside CIT** (`schema_visible_mismatch` only) |
| content substance | CIT |
| entity-identity | ENT (no web search) |
| freshness + cross-source | I on-site + H linked GETs |
| corroboration | H |
| ai-answerability | K |
| query-to-page alignment | K `wrong_page` + X scent |
| referral landing / context retention | X |
| site-type | V |
| suppression / scoring / report | `admit.py`, `merge.py`, orchestrator |
| live-citation-probe | **do not ship** |

### Approach

Implement **unused contract types** and PDF-shaped checks *inside* C / CIT / K / X / admit. If a type already existed in `FINDING_TYPES` / `GATE_ORDER` but no skill emitted it (`canonical_dup`), that was a gap, not a new product surface.

---

## 3. PDF coverage implementation

### Crawl-access (`skill_c.py`, `extract.py`, `crawl.py`)

**What was wrong:** C documented canonicals, soft-404, and robots/noindex conflict in the architecture but never emitted them. `canonical` was parsed from HTML and discarded.

**Changes:**

- Persist `Page.canonical`; fold `x-robots-tag` into `robots_meta`.
- Record sitemap `lastmod` onto pages and `coverage.sitemap_lastmod_n` / `_unique`.
- Emit:
  - `noindex_robots_conflict` — noindex **and** Googlebot `Disallow` on a URL we still fetched (our UA is allowed; Googlebot is not).
  - `soft_404` — HTTP 200 + not-found language + thin body.
  - `canonical_dup` — same content simhash, ≥2 URLs, no single shared canonical.
  - `coverage_statement` when ≥20 sitemap lastmods are identical (Shopify-shaped stamp).

**Reasoning:** These are Gate-1 access/IA failures. Soft-404 needs a thin-body gate so a docs page titled “HTTP 404” does not fire. Uniform lastmod is explicitly *not* missing-sitemap.

### Citation (`skill_cit.py`)

**What was wrong:** Schema vs visible price used a shallow dump/`PRICE_RE` on JSON-LD, so nested `Product.offers.price` could be missed or confused with unrelated digits.

**Change:** Walk JSON-LD nodes; collect `price` / `lowPrice` / `highPrice`; compare to visible offer strings. Fire only if schema tokens and visible tokens have **no overlap**.

**Reasoning:** Integrity is contradiction, not absence. Nested Offer is the common Shopify/Stripe markup shape.

### Answerability (`skill_k.py`, `clock.py`)

**What was wrong:** Skip-ladder always ran K3/K6/K13 (or K3 only). PDF taxonomy also wants audience (K4) and location (K5), but running all 24 questions always-on recreates unanswerable floods.

**Changes:**

- Remaining &lt; 80s → `K3` only.
- 80–140s → `K3`, `K6`, `K13`.
- ≥140s → add `K4`, `K5`.
- `question_is_expected_gap`: K9/K10 always gap; K6 by cluster; K4 gap on B; K5 gap on B/D/E.
- K4/K5 patterns are grammar (`built for`, `based in`, `we are a … in City`), not vertical word lists.

**Reasoning:** Budget is the skip-ladder’s job. Site-type expected gaps prevent “where are you based?” High findings on a news homepage.

### Engagement (`skill_x.py`)

**What was wrong:** Query-to-page / scent was only “no nav on a deep site.” Cited users still bounce when pricing/contact exists but the landing page does not point at it.

**Change:** If a crawled URL is `page_type` pricing or contact, and home/nav text lacks commercial or contact wayfinding, emit low `scent_break`. Later added `\bconnect\b` so “Connect with …” counts.

**Reasoning:** This is X (recovery after citation), not K (corpus has no span) and not C (the URL is reachable).

### Admit / orchestrator

**What was wrong:** Orphans on a 12-of-200 crawl look like isolation defects. Cart/search orphans are junk IA, not brand gaps. `admit()` was called with `coverage_pct=None`.

**Changes:** Pass `pages_fetched / estimated_pages`. Suppress orphans when coverage &lt; 35% (`U16_coverage_artifact`). Extend U8 junk paths (`/cart`, `/search`, `/admin`, `/login`, `/checkout`, `/wishlist`, `/account`) to orphan and `trap_facet`.

**Reasoning:** Architecture already says orphans **with coverage**. Sparse samples must not pretend the graph is complete.

### Types / merge

Added `soft_404` and `noindex_robots_conflict` to `FINDING_TYPES` and `GATE_ORDER` so merge/RCA can rank them.

---

## 4. Second live pass (after PDF checks)

Cold audits, `max_seconds=95`, `page_cap=12`: Stripe, Jekyll, NASA, BBC, Shopify.

### What went wrong

- **Stripe + Shopify `canonical_dup`:** Locale/country templates (`/in/pricing`, `/en-at/pricing`, `/au/about`) share a simhash. That is hreflang, not competing index documents.
- **NASA `scent_break`:** `/contact/` is real; home mega-nav did not contain `contact`/`email`/`support`. Borderline true: contact is not in the first-viewport scent we measure. Left as **low**.
- **Shopify `wrong_page` (K3):** Identity sentence on `/in/about`, not home. Older K behavior; not introduced by the PDF batch.
- **BBC:** AI-token disallow (true positive). Viewport identity from a stuffed `<title>` and no H1 (pre-existing heuristic noise).
- **Stripe/Jekyll:** Clean (0 user findings) after locale canonical skip.
- **95s budget:** K4/K5 did **not** run (`remaining` at plan time &lt; 140).

### Approach

Do not add `stripe.com` / `shopify.com` exceptions. Ask: “what URL shape is this?”

### Change

Skip `canonical_dup` when **every** URL in the simhash cluster has a locale/country first path segment (`is_locale_path_segment` in `url.py`: `en`, `in`, `en-at`). `/a` vs `/b` clones without locale still flag (see `tests/test_pdf_coverage.py`).

**Reasoning:** Localized clones almost always self-canonicalize + hreflang. Flagging them recreates the Stripe rate-card disaster at Gate 1. True dups are `/page` vs `/page-copy` on non-locale paths.

Shopify identical sitemap lastmod was kept: it is a real weak signal and severity **low**.

---

## 5. Tests

- `tests/test_fp_noise_v2.py` — first FP round (rate cards, K3 grammar, dates, K6 clusters, collision).
- `tests/test_pdf_coverage.py` — soft-404, noindex×robots, nested Offer mismatch, K4/K5 ladder and gaps, scent, admit U8/U16, locale canonical skip.

Do not put real brand hostnames in lib or tests.

---

## 6. Known leftovers (not “fixed,” documented)

| Item | Status | Why we have not closed it |
|---|---|---|
| Shopify K3 `wrong_page` on locale about | Open | Home vs `/in/about` is a real query-to-page shape; gating it needs a locale-home rule that does not hide genuine inner-only identity |
| BBC viewport / stuffed title | Open | First-400-chars + “title not in body” is crude; fixing it without hiding real brandless heroes needs a better viewport definition |
| NASA contact scent | Open / low | Footer vs first-viewport; `nav_texts` often empty on mega-menus dumped into `main` |
| Dual-fetch ≠ Chromium | By design | Zip constraint; limitations already say so |
| Live citation / search | Rejected | Non-determinism, ToS, U12 |

---

## 7. How to extend this file

When you change detection:

1. **Symptom** — which origin, which finding_type, why it was wrong or missing.
2. **Approach** — structural rule you will try (not a hostname).
3. **Change** — files and the rule in one sentence.
4. **Reasoning** — what user action the finding is supposed to drive, and why this rule preserves that.
5. **Regression** — test name on `*.example` / `site.test` fixtures.
)
