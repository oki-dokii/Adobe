---
name: citation-extractability-audit
description: Check whether factual claims are self-contained, qualifier-safe, table-headered, and that JSON-LD matches visible text. Use after extractability_flags exist. Do not treat missing schema as Critical.
license: MIT
---
# citation-extractability-audit

## When to use
Gate 3: cited wrong or unquotable.

## Procedure
Factual templates only. Skip JS-locked pages (parent D). qualifier_split, table_no_th, schema_visible_mismatch, comparison_self_win (first-party vs pages, Low disclosure). Mission-page voice is not a defect.

## Deterministic vs hybrid
v1: deterministic only (protect-list).
