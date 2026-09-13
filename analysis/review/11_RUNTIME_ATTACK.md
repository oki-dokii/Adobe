# Phase 11 — Runtime Attack

Hard cap: **< 300s** wall clock for the whole marketplace. The 11-skill marketplace plus LLM K/CIT/V + render + H fetches **will overrun** on a JS-heavy huge site if unbounded.

## Cost model (order-of-magnitude, unvalidated)

| Op | Typical | Worst | Notes |
|----|---------|-------|-------|
| DNS/TLS + robots + homepage | 2–8s | 20s | |
| Sitemap | 1–5s | 30s index fanout | Cap sitemap URLs |
| Crawl GET N pages | N×(0.5–2s) serial-ish | Unbounded N | Time-primary; cap pages |
| Render M pages | M×3–15s | Hours/page AE19 | M≤8–12; hard timeout |
| Extract/SimHash/graph | ~0 vs fetch | — | AG “free” |
| SK-C det | <2s | — | |
| SK-D det | <5s + render already | — | |
| SK-CIT det | 2–8s | LLM candidates | Cap candidates |
| SK-ENT | 2s + 0–3 GET | Search explosion | No search |
| SK-K | Q×LLM | Q=24 × long context | **Must subset** |
| SK-I | <3s | — | |
| SK-H | 0–5 GET | Wiki crawl | Linked cap 3–5; skip |
| SK-X | 2–8s | paraphrase LLM | Central claims only |
| SK-V | 1 LLM | — | After sample |
| Merge/report | <5s | LLM merge | Prefer rules |

N×M explosions: K questions × all pages; H search × facts; CIT LLM × all paragraphs; sitemap indexes; facet URLs; render all.

## Skip-ladder (binding)

Priority of **dropping work** when `remaining < threshold`:

1. SK-H extra GETs (first).
2. Reduce K to core IDs: K3, K6 if applicable, K13, plus 2 W queries.
3. CIT LLM off — deterministic only.
4. ENT LLM off — heuristic only.
5. Render M decreased (never 0 homepage).
6. SK-X paraphrase off.
7. Never drop: robots, C access, coverage, V heuristic, U admission, report.

Target split (still **hypothesis**, label it): crawl+render ≤ 120s; analysis ≤ 150s; report ≤ 15s; slack 15s.

## Caching

One GET per URL per run_id. One robots. One JSON-LD parse. Skills read snapshot; **no per-skill recrawl**.

## Worst-case behavior

Infinite calendar/facet: depth+param caps. Soft 5xx: retry 2, continue. Headless missing: raw-only, limitation. One skill exception: `status: failed`, others continue.

## Architecture change

Orchestrator owns a **monotone clock**. Skills receive `deadline_ts` and **must** return partial.
