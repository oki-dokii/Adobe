# brand-ai-readiness-audit

Adobe Round 3 marketplace: read-only audit of a website for **AI discoverability** (access → render → quote → completeness → identity → time → linked consistency) and **on-site engagement** after an AI referral.

Authoritative design: `analysis/review/LOCKED_ARCHITECTURE.md` in the research workspace (do not let older analysis docs override it).

## Exactly one entrypoint

`audit-orchestrator` is the only `"entrypoint": true` skill. It owns the crawl snapshot, 5-minute clock, skip-ladder, `admit()`, merge, and dual JSON+Markdown report. Detection skills **do not recrawl**; they read the snapshot.

## Composition DAG (locked)

```
validate URL → robots (RFC 9309) → crawl raw → site-type-classifier
crawl-access-audit
render subset → render-extract-audit (extractability_flags)
parallel: citation-extractability-audit, entity-identity-audit, freshness-audit
ai-answerability-audit (needs flags + V; protect K3)
parallel: engagement-handoff-audit, corroboration-consistency-audit (H if remaining ≥ 45s)
admit() → parent_id merge → report
```

Shared crawl, HTTP, SimHash templates, robots, SSRF, and suppression live in `scripts/lib/` so they are not duplicated inside skills.

## Skills

| Skill | Role |
|-------|------|
| audit-orchestrator | Compose, budget, merge, report |
| site-type-classifier | V clusters A–F, YMYL, never-fire |
| crawl-access-audit | Gate 1: reach public URLs |
| render-extract-audit | Gate 2: facts as text; D41; flags |
| citation-extractability-audit | Gate 3: quote/misquote; schema↔visible |
| entity-identity-audit | Name collision; sameAs 404 |
| ai-answerability-audit | Closed-book QA; unanswerable vs wrong_page |
| freshness-audit | Dates + on-site typed fact conflicts |
| corroboration-consistency-audit | Linked off-site GETs only |
| engagement-handoff-audit | Viewport, scent, STTF (in-DOM visibility) |

## Constraints

- GET/HEAD only. No auth, forms, or site changes.
- Honor robots.txt (4xx fail-open, 5xx fail-closed).
- SSRF: check **every redirect hop**.
- Zip ≤ 50MB, no model weights, no paid APIs, no hard-coded evaluation hostnames.
- Wall clock < 5 minutes with skip-ladder; protect V, dual-fetch on fact URLs, CIT deterministic checks, K3.

## Run

```bash
PYTHONPATH=scripts python3 skills/audit-orchestrator/scripts/run_audit.py --url https://example.com/
```

Fixture / offline:

```bash
PYTHONPATH=scripts python3 -m pytest tests -q
```

`allowed-tools` in SKILL.md is a hint, not a sandbox.
