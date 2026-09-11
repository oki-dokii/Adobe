# Render gap study

Empirical comparison of **raw HTML** vs the production dual-fetch path (`expand_noscript` / `<template>` unwrap). No headless browser was added.

**Method:** `evaluation/run_render_probe.py` used the production `HttpClient` (SSRF, robots, GET-only) to fetch the seed URL of every enabled matrix site, then parsed raw HTML and noscript-expanded HTML with the production extractor.

**When:** 2026-09-06. Artifact: `evaluation/results/render_probe.json`.

## What the current implementation can observe

- Bytes returned by a single GET of the seed URL (after hop-checked redirects).
- Visible text the HTML parser extracts from that payload (not CSS-hidden, not closed `<details>`, not `<script>`).
- Extra text that exists in `<noscript>` or `<template>` in that same payload.
- Prices matching the existing `PRICE_RE` in those text views.

## What it cannot observe

- DOM after client JavaScript (React/Next hydration, client fetches).
- Content behind bot/WAF interstitial HTML (HTTP 403 with a tiny body).
- Screenshots / canvas / WebGL.
- Click-to-insert accordion content that is **absent from the initial HTML**.
- Logged-in or geo-personalized variants (Y-01).

## Probe results (seed URL only)

| Site | HTTP | Raw chars | Expanded chars | Delta | Noscript nodes | Notes |
|------|------|-----------|----------------|-------|----------------|-------|
| example.com | 200 | 142 | 142 | 0 | 0 | Static IETF page. Current path sufficient. |
| jekyllrb.com | 200 | 1245 | 1245 | 0 | 0 | Static marketing. Sufficient for homepage facts. |
| stripe.com | 200 | 10761 | 10761 | 0 | 0 | Prices already in raw (`$1`, `$5`). Dual-fetch added nothing. |
| shopify.com | 200 | 7402 | 7402 | 0 | 0 | Prices in raw. 1 redirect hop. |
| docs.python.org/3/ | 200 | 3187 | 3187 | 0 | 0 | Docs HTML is in the first response. |
| MDN | 200 | 6232 | 6232 | 0 | 0 | Same. |
| react.dev | 200 | 7606 | 7606 | 0 | 0 | Substantial HTML in first response; not an empty SPA shell. |
| nextjs.org | 200 | 7362 | 7362 | 0 | 0 | Same. |
| blog.cloudflare.com | 200 | 7750 | 7750 | 0 | 0 | Article chrome in raw. |
| bbc.com/news | 200 | 9667 | 9667 | 0 | 8 | Noscript present but **no extra main_text after unwrap** (payload already duplicated or empty of extra facts). |
| harvard.edu | 200 | 9359 | 9359 | 0 | 0 | CMS HTML in raw. |
| nasa.gov | 200 | 9943 | 9943 | 0 | 0 | Same. |
| gov.uk | 200 | 4456 | 4479 | **+23** | 1 | Only site with a measurable noscript/template delta on the seed. |
| redcross.org | **403** | 210 | 210 | 0 | 0 | WAF/challenge body. Human browser would see a different page. |
| mozilla.org | 200 | 2379 | 2379 | 0 | 0 | Locale homepage HTML present. |
| philzcoffee.com | 200 | 3023 | 3023 | 0 | 0 | Prices `$22.50` already in raw. 1 hop. |
| etsy.com | **403** | 52 | 52 | 0 | 0 | Bot wall. Human site not observed. |
| wikipedia.org | 200 | 6221 | 6221 | 0 | 0 | Portal HTML + donation `$2.75` in raw. |
| taniarascia.com | 200 | 3499 | 3499 | 0 | 0 | Static-ish personal site. |

## Four buckets

### 1. Current implementation succeeds

Static and mostly server-rendered origins where decision text is in the first HTML: example.com, jekyllrb.com, docs.python.org, MDN, philz (prices in HTML), wikipedia.org portal.

A full audit of react.dev / nextjs.org also fetched 40 HTML pages with non-trivial `main_text`. For those **homepages**, noscript expansion was a no-op because the framework already emitted HTML.

### 2. Current implementation misses relevant information

- **etsy.com, redcross.org:** probe GET is 403; audit stored 1 page and treated the challenge/error document as the brand. Offering/pricing/contact “unanswerable” findings are about the wall, not the real site.
- **Closed `<details>`:** extractor intentionally keeps collapsed text out of `main_text`. That is correct for STTF, but closed-book K questions will not see those facts unless X/STTF fires (needs claims).
- **Client-only prices after hydration:** not observed on these seed URLs (prices that existed were already in raw). This sample **does not prove** SPAs without SSR are handled.

### 3. A human sees content the implementation cannot observe

- Etsy and Red Cross in a normal browser (JS + cookies + challenge pass).
- Any “Loading…” then product grid that never appears in the initial HTML (not evidenced on react.dev/nextjs.org homepages in this probe).
- BBC noscript nodes exist (8) but did not change extracted main text — a human using noscript-disabled Firefox might still see a different bundle than our unwrap.

### 4. A likely headless browser would materially change the result

**Would change (high confidence):** etsy.com, redcross.org — need a real document, not 403 HTML. Headless may still fail Cloudflare; it is not guaranteed.

**Might change (unknown):** inner app routes that are client-only; cookie/geo banners covering identity (Y-01 still untestable).

**Would probably not change the seed-page text:** stripe.com, shopify.com, gov.uk, python docs, jekyll — first HTML already has the marketing/docs facts.

**gov.uk +23 characters** is the only positive dual-fetch delta. That is not a reason to ship Playwright yet; it is a reason to keep noscript unwrap.

## Conclusion

Noscript/template dual-fetch is **not sufficient as a general JS-lock detector**. On this matrix it was almost always a no-op on the seed URL. It **is** an honest fallback and caught a tiny gov.uk delta.

JS-lock findings did **not** fire on react.dev or nextjs.org in the full audit, matching “raw already has text.” Whether inner docs pages hide prices behind JS was **not** isolated.

**Do not add a headless browser until** bot-wall handling and price-regex false Criticals are reviewed; a browser would amplify cost (stripe already ~102s crawl) without fixing WAF 403s by itself.

Classification:

- CONFIRMED: dual-fetch ≈ identity on 17/19 seeds; 403 sites are unobserved.
- LIKELY: Playwright would not fix Etsy/Red Cross without a challenge solver (out of scope).
- UNKNOWN: inner SPA routes on JS frameworks.
