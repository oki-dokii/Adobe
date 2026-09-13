---
name: business-impact-layer
description: Annotate canonical audit findings with ordinal business exposure, dimension scores, and priority actions without creating findings or estimating commercial loss.
license: MIT
---

## When to use
Use only after findings have been admitted and merged. It is separate from detection because it translates already-observed evidence into report ordering and never inspects a site.

## Inputs
Canonical `Finding[]` JSON and the shared crawl's sampled-page count.

## Procedure
1. Run `scripts/run.py --findings-json <canonical-findings.json> --sampled-pages <n>`.
2. The script invokes `scripts/lib/business_impact.py`, the executable port of the existing business-impact presentation code; it assigns ordinal exposure and computes dimension/overall scores from canonical findings.

## Output
JSON object with `findings`, where each item is `{ id, finding_type, finding_key, title, severity, businessExposureSeverity, evidence, suggested_action, confidence }`, plus `dimension_scores`, `overall_index`, and `top3PriorityActions`.

## Confidence & failure handling
This layer preserves the source finding confidence. Missing evidence or sampled-page counts results in LOW-confidence source findings or omitted finding output; it never invents a metric, loss estimate, or placeholder. HTTP, robots, and bot challenges are outside this layer and remain limitations from upstream.

## Declared tool needs
Read-only local file access and Python execution only; no network, authentication, form submission, or writes to a target site.
