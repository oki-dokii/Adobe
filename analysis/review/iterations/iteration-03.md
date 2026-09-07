# Iteration 03 — v2 → v3 (tighten, no SoC change)

**Architecture version:** v3  
**Baseline:** v2

## Issues found (third pass)
1. SK-I name vs scope might confuse implementers into date-only.
2. TTFB metric could become fake CWV finding.
3. Flagship gap might fire on sites without products.
4. Composite citability might be sold as citation proof.
5. Closed finding_type list still not written in one place.

## Changes
- SK-I purpose sentence: “on-site temporal credibility **and** typed internal fact conflicts.” Folder id unchanged.
- TTFB: coverage metric only; **no finding** unless TTFB > 10s **and** homepage (Low). Not Lighthouse.
- Flagship: only V-F product-like sites with ≥2 product URLs.
- Composite citability: `metrics` only; evidence_tier HYP; never a finding title “low citability score.”
- Publish closed finding_type enum in LOCKED.

## Reasons
O weakest assumption; AH25 unvalidated; AH16 scoping.

## New risks
None material.

## Tests
Novelty (no SEO TTFB spam); site-type flagship; H-02 language.

## vs previous
Spec tightening only. **No skill add/remove/merge/split.**
