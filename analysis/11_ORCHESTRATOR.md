# Phase 12 — Orchestrator

Entrypoint skill: **audit-orchestrator**  
Invoked once with a URL/domain. Internally calls other skills (not the user).

## Execution graph (derived, not the brief’s example blindly)

```
INPUT url
  → validate (http(s), no file:, no credentials)
  → origin + robots_policy
       fail_closed / DNS/TLS total fail → SK-C findings only → report (early stop)
  → sitemap + homepage seed
  → crawl_planner (time budget B_crawl)
  → dual-fetch subset (render budget)
  → extract + simhash + graph
  → SK-V site-type-classifier
  → parallel:
       SK-C, SK-D, SK-CIT, SK-ENT, SK-I
  → SK-K (needs extract + V + K lexicon coverage)
  → SK-X (needs candidate claims from SK-K/SK-CIT)
  → SK-H (needs facts; extra GETs inside remaining budget)
  → per-finding U/AA suppression
  → T merge / template rollup
  → S severity + Z rank recs
  → AC proactive (only with opportunity evidence)
  → AB render JSON + Markdown from one object
```

## Parallel vs dependent

| Parallel | Depends on |
|----------|------------|
| SK-C, SK-D, SK-CIT, SK-ENT, SK-I | Crawl+extract (+V for gating) |
| SK-K | Extract + V |
| SK-X | SK-K or CIT claim list |
| SK-H | Facts + remaining time |
| Merge/report | All SkillResults |

## Expensive ops
Render, LLM (K, some CIT/ENT/V), third-party H fetches.

## LLM policy
Temperature 0; untrusted HTML sanitized (AD); closed-book for K (no parametric company knowledge).

## Caching
robots, sitemap, page bodies, simhash, JSON-LD parse — once per run_id.

## Early stopping
- Origin unreachable
- robots fail-closed
- AE early-stop on crawl
- If time < T_min for K, skip SK-H extras first, then reduce K question count (keep K3/K6/K13)

## Orchestrator must not
Reimplement checks; POST; ignore robots; hard-code example.com as a special case.
