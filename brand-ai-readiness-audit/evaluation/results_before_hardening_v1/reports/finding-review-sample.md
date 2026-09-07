# Finding review sample (manual)

Ground truth is only claimed when the live evidence string is enough. UNKNOWN otherwise.

| Site | Finding | Severity | Evidence supports? | Severity OK? | Actionable for owner? | Mark |
|------|---------|----------|--------------------|--------------|------------------------|------|
| stripe.com | qualifier_split ×7 “$500 million of annual recurring” | critical | Mechanism fired on a real dollar span | No — not a checkout price | Misleading | **FP** |
| shopify.com | qualifier_split “US$250,000 of annual eligible” | critical | Span exists | No | Misleading | **FP** |
| shopify.com | on_site_fact_conflict many numbers | high | Numbers exist on multiple URLs | Unlikely one product price | Low | **LIKELY FP** |
| bbc.com/news | ai_token_disallow | medium | Robots split is a real policy | Yes | Yes (intent) | **TP** |
| example.com | K3 unanswerable | high | Truly no offering sentence | Yes for the page; bad demo | N/A | **TP** (wrong exhibit) |
| etsy.com | K3 unanswerable | high | Corpus is 403 HTML | No as a brand gap | No | **FP** |
| nasa.gov | date_divergence Glenn history years vs schema | medium | Years exist | Weak — historical article | Dubious | **LIKELY FP** |
| taniarascia.com | sameAs 404 | medium | ENT fetched a linked URL | Plausible | Yes if link is stale | **UNKNOWN** (not opened in browser here) |
| jekyllrb.com | collision_risk | high | Name “Jekyll” is common English | Weak | No | **LIKELY FP** |
| python docs | low finding count (1 high) | — | Docs site with extractable text | — | — | **TN-ish** vs overfire |

Browser verification of Stripe/Shopify/Etsy/NASA was not a full visual QA pass; Stripe/Shopify FPs are from the quoted evidence itself. Etsy 403 is in `render_probe.json` (`status: 403`, 52 bytes).
