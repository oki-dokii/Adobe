# Phase 13 — Crawling Strategy

Binding constraint: **wall-clock < 5 minutes for the whole audit**. Time is primary (AE Cluster C). Starting split **unvalidated**: ~40% crawl/render, ~60% analysis — tune on real sites.

## Initial URL
Normalize; if path deep, still fetch homepage + given URL as seeds.

## robots.txt
Once per origin. Honor Disallow for our user-agent **and** document AI-token matrix as findings (SK-C) without violating Disallow. 5xx fail-closed: do not crawl.

## Sitemap
Fetch first (cheap). Pre-score listed URLs. Missing sitemap ≠ Critical.

## Prioritization (AE Cluster A)
`score = lexicon(K3–K19) + sitemap_bonus + locality_from_important + (-depth)`  
Never pure DFS.

## Sampling
Stratify by template; **≥2 pages/template** (AE) and **2–3 confirms** (AF) before site-wide claims. One clustering subsystem only (JOIN-002): SimHash online during crawl + θ-shared-node report language. Do not also assign the same `template_id` from embeddings or WCC.

## Importance
Homepage, about, pricing, contact, product, legal if YMYL.

## Depth
Hard ceiling (trap defense) + time backstop.

## Duplicates
URL normalize then SimHash content; don’t skip pricing/spec pages without value diff.

## Dynamic URLs
Strip session/utm; facet caps.

## Rendering budget
Only top-N priority pages; per-page render timeout << remaining crawl budget; fallback raw.

## Request budget
Global limiter; concurrency 1–2 per host; timeout ~8s fetch (illustrative).

## Retry
2 retries on timeout/5xx only.

## Early stop
K categories hit + template discovery flat + 2 samples, **or** time.

## Failure recovery
One URL fail ≠ crawl abort; log partial.

## Honesty
Always AE22 coverage in report.

Optimize **evidence quality**, not page count.
