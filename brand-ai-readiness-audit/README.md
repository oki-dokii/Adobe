# Brand AI Readiness Audit Marketplace

`audit-orchestrator` is the sole entrypoint. It validates one public URL, performs one shared robots-respecting crawl, routes that snapshot through the skill implementations, applies the existing admission and finding-type/finding-key merge logic, and emits the final JSON report.

`crawl-access-audit` feeds Discoverability by reporting observed crawl policy, transport, and coverage barriers as canonical findings. `render-extract-audit` also feeds Discoverability by checking the shared raw/rendered representation and producing extractability findings and flags.

`site-type-classifier` feeds Understanding by classifying the sampled site so later checks apply the existing context gates. `citation-extractability-audit` feeds Understanding with quote-safety findings from DOM and structured-data evidence, while `ai-answerability-audit` feeds Understanding with buyer-question span findings.

`entity-identity-audit` feeds Trust with on-site disambiguation and observed sameAs-link findings. `freshness-audit` feeds Trust with date and on-site fact-consistency findings. `corroboration-consistency-audit` feeds Trust by comparing material facts only against explicitly linked, robots-permitted public sources.

`engagement-handoff-audit` feeds Engagement with first-viewport identity, wayfinding, and handoff findings. `business-impact-layer` does not detect defects: it annotates merged canonical findings with ordinal exposure, derives the four dimension scores and overall index, and selects priority actions without inventing commercial estimates.

These are genuine separation-of-concerns boundaries: access, extraction, quote integrity, answer support, temporal consistency, external corroboration, identity, and user handoff each operate on different evidence and have distinct failure semantics. The business layer is deliberately post-detection so it cannot influence evidence collection or create a duplicate root cause.

The runtime strategy is a single crawl snapshot, a 40-page/40-render default cap, and the engine's deadline skip ladder. Rendering and linked-source corroboration are reduced or skipped before the protected core checks when time is scarce. Default runtime is capped at 280 seconds; for slow origins, lower `--page-cap` and `--render-max` rather than allowing every skill to recrawl.

Run:

```sh
PYTHONPATH=scripts python3 skills/audit-orchestrator/scripts/run.py --url https://your-domain.example/ --json-out report.json
```
