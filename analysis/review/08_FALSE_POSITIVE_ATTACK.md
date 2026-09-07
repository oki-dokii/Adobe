# Phase 8 — False Positive Attack

Adversarial legitimate sites vs each skill. Then logic change.

## Site zoo

Minimal excellent landing; JS-heavy with facts in raw HTML; short SKU pages; private /admin; weird docs IA; multilingual; local bakery; .gov; university; news syndication; ecommerce; huge marketplace; no public price SaaS; hidden until login; SPA; no JSON-LD but excellent prose.

| Skill | FP scenario | Defense |
|-------|-------------|---------|
| V | princeton.edu bookstore classified SaaS → price defect | Multi-label; shop off-domain exception (V-C); V beats K6 |
| V | HIPAA badge on SaaS → medical reviewer required | YMYL reviewer only if **medical advice content**, not compliance marketing |
| C | No sitemap | Not a defect |
| C | Disallow /cart /search | U8 |
| C | HTTP→HTTPS one hop | TN |
| C | Self-canonical absence, no dups | L: no finding |
| C | AI bot Disallow, Googlebot allow | Medium **intent** finding, not Critical invisibility |
| D | Next.js site, prices in HTML | U2: fact in raw |
| D | Chat widget JS-only | Non-fact |
| D | Accordion FAQ in DOM | Not D; maybe X if cited claim |
| D | Portfolio photos | U10 decorative |
| D | 10-K PDF + HTML summary | U9 |
| D | Configurator prices | Not intended public index — V/product-type gate |
| CIT | Mission “world-class” | Factual templates only |
| CIT | Fashion lookbook | V-E voice |
| CIT | No JSON-LD, prices in prose | U1 |
| CIT | YMYL hedges | V-A OK |
| CIT | Vendor comparison 7/7 wins | Disclosure Low, not “be balanced” |
| ENT | Coined unique brand | collision_risk low → abstain |
| ENT | No Wikidata | F-02 no defect |
| ENT | Artist = product name | Intentional; no finding |
| K | Contact for quote B2B | V-F |
| K | K10 competitors absent | Expected gap |
| K | K21 not “best” | Do not recommend superlatives |
| K | LLM “knows” Adobe from weights | Span required or abstain |
| K | Directory “offering is listings” | V-B |
| I | Docs v3.2 | U6 |
| I | History page 2019 | Page type |
| I | News always “today” | Cadence expected |
| I | Accurate old timestamp | U7 substance |
| H | Bakery no press | Absence ≠ High |
| H | LinkedIn slogan ≠ legal name | P-03 immaterial |
| H | Wikidata incomplete | Bias; infobox > wikidata if both |
| H | Regional pricing | Qualifiers |
| X | One-pager no crumbs | Y-02 TN |
| X | Long tutorial scroll | Central claim only |
| X | Minimal Swiss design | X-03 not “untrustworthy” |
| X | Docs left nav | Equivalent wayfinding |
| ORCH | 47 template clones | 1 finding |
| ORCH | Two issues one URL | Don’t merge on URL alone |

## Architecture change

Mandatory **U13–U18 admission** before emit. Site zoo fixtures become tests (TASK-level).
