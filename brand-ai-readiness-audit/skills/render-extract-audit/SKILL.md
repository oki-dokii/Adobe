---
name: render-extract-audit
description: Check whether decision facts exist as extractable text without interaction (dual-fetch), including D41 permanently hidden text. Use after raw crawl; sets extractability_flags for later skills.
license: MIT
---
# render-extract-audit

## When to use
Gate 2: humans see facts that extractors might miss.

## Procedure
Compare raw vs rendered for fact-bearing prices. U2: JS chrome with facts in raw is not a defect. Accordion content already in DOM is not this skill (handoff). D41: hidden text with no toggle. Do not recommend llms.txt.

## Output
extractability_flags on pages; js_fact_lock, d41_hidden, pdf_only_fact, image_locked_fact.
