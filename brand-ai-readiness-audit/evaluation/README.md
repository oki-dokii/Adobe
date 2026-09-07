# Real-world evaluation harness

Config-driven audits of **unseen public websites** using the production orchestrator.

This directory is **not** the marketplace. URLs live only in `sites.yaml` (and result files), never in `scripts/lib/`.

## Safety

`run_evaluation.py` refuses to start unless production safety checks pass:

- GET/HEAD only
- SSRF hop inspection (no urllib auto-redirect)
- blocked loopback / private / CGNAT / metadata
- redirect cap
- timeouts
- crawl page cap
- no cookie jar / no form POST

Safety is **not** disabled to make a site pass.

## Run

From `brand-ai-readiness-audit/`:

```bash
.venv/bin/python evaluation/run_evaluation.py
.venv/bin/python evaluation/run_evaluation.py --only example-small
.venv/bin/python evaluation/run_evaluation.py --skip-warm
.venv/bin/python evaluation/run_render_probe.py
```

Defaults match production budget: `--max-seconds 280`, `--page-cap 40`.

Each enabled site is audited **cold** then **warm** (process-level; there is no HTTP cache in the client).

Outputs:

- `results/runs/*.json` — per-run metrics captured from the live report
- `results/findings/*.json` — user-facing + internal findings
- `results/summary.json` — aggregate
- `reports/` — human write-ups (`REAL_WORLD_VALIDATION.md`, `render-gap-study.md`)

## Site list

Edit `sites.yaml`. Set `enabled: false` to skip without deleting the entry.

## What this does not do

- No new skills
- No architecture redesign
- No demo website
- No claim of sub-5-minute readiness without `results/` evidence
