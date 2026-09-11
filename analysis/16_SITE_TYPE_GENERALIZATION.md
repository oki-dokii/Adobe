# Phase 17 — Site-Type Generalization

Classifier clusters (V): A YMYL, B multi-entity/thin-OK, C institutional, D docs, E authorship, F commercial, plus multilingual axis.

## Universal checks (all types)
- HTTP/TLS reachability
- robots 5xx fail-closed
- Dual-fetch for **fact-bearing** nodes if those facts are claimed
- Main content extractable
- Closed-book K3-like identity if the site represents an org/person/product
- Report coverage + Y-01 limitations
- Prompt-injection sanitization

## Conditional

| Cluster | Extra | Don’t fire |
|---------|-------|------------|
| A YMYL | Reviewer/license/jurisdiction; stale rates High | “Hedge = unclear” |
| B directory/local/nonprofit | NAP consistency; outbound is OK | Thin-content; “add longform” |
| C uni/gov | Off-domain bookstores/shops | Missing ecommerce price on .edu shop third party |
| D docs | Version freshness; task success | Calendar last-updated required |
| E news/blog/portfolio | Authorship/cadence; images as product | Duplicate syndication as always-bad (U5) |
| F SaaS | Extractable plans OR explicit quote CTA | Public SKU price required |
| F ecommerce | Price/availability extractable | Price gating as OK |
| Multilingual | Language/hreflang consistency | English-only synonym lists |

## Types from the brief mapped to clusters
SaaS→F; ecommerce→F; news/blog/media/portfolio→E; docs/developer→D; university/government→C; nonprofit/local/marketplace/directory→B; multilingual→axis.

## Checks that must not fire
- K9/K10 as Critical
- llms.txt missing
- Schema missing when prose sufficient
- Breadcrumbs on single-page
- Wikidata absence as High
- Live personalization gaps
