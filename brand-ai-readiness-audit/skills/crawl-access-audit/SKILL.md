---
name: crawl-access-audit
description: Diagnose why compliant crawlers cannot reach public URLs: DNS/TLS/HTTP, RFC 9309 robots, AI tokens, traps, orphans with coverage. Use after crawl snapshot exists.
license: MIT
---
# crawl-access-audit

## When to use
Gate 1: reachability and access policy.

## Procedure
robots fail-closed Critical; AI token matrix Medium if Googlebot allowed; orphans only with coverage string; faceted traps. Missing sitemap or missing canonical without dup evidence is not a defect.

## FP/FN
U8 admin/search disallow is not a defect. Geo TLS is a stated limitation.
