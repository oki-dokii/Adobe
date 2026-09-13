# IMPLEMENTATION_AUDIT.md

Implementation of locked architecture (`analysis/review/LOCKED_ARCHITECTURE.md`). Older `analysis/07_*` / `analysis/cursor/05_ORCHESTRATOR.md` (parallel C/D/CIT) were **not** followed where they conflict. DAG is D-before-CIT/K/X.

## Files created

Marketplace root: `brand-ai-readiness-audit/`

- `marketplace.json`, `README.md`, `pytest.ini`, `requirements-dev.txt`, `.gitignore`
- `scripts/lib/` — shared infrastructure and skill implementations
- `skills/*/SKILL.md`, `scripts/`, `references/`
- `tests/` — unit + integration + safety
- `IMPLEMENTATION_TRACEABILITY.md`, this file

## Skills implemented (10)

| id | entrypoint | Implementation |
|----|------------|----------------|
| audit-orchestrator | **yes** | `scripts/lib/orchestrator.py` + `skills/audit-orchestrator/scripts/run_audit.py` |
| site-type-classifier | no | `skill_v.py` |
| crawl-access-audit | no | `skill_c.py` |
| render-extract-audit | no | `skill_d.py` |
| citation-extractability-audit | no | `skill_cit.py` |
| entity-identity-audit | no | `skill_ent.py` |
| ai-answerability-audit | no | `skill_k.py` |
| freshness-audit | no | `skill_i.py` |
| corroboration-consistency-audit | no | `skill_h.py` |
| engagement-handoff-audit | no | `skill_x.py` |

## Shared infrastructure

HTTP GET/HEAD + per-hop SSRF, robots RFC 9309, URL normalize/traps, sitemap cap, crawl+SimHash, extract/parse, render fallback, facts+compare_claim, admit() U-flow, merge parent_id, confidence enum, sanitizer delimiters, report JSON+MD, clock skip-ladder.

## Tests

Command: `.venv/bin/pytest tests -q`

**After IMPLEMENTATION_FIXES_V1 (this pass): 92 passed.**

Prior hostile audit baseline: **48 passed** (35 original + 13 tests that documented bugs). Those hostile tests now assert the fixed behavior.

New production-path coverage: `tests/test_production_http.py` (real `HttpClient` + local HTTPServer, no Fake opener), `tests/test_p0_isolation.py`, `tests/test_p0_sk_h.py`, `tests/test_p0_render.py`, `tests/test_p1_fixes.py`.

This **does not** prove a live site completes in <5 minutes. Instrumentation exists (`timing.http_requests`, `pages_rendered`, `render_count`, `llm_calls`, `total_ms`, skill_ms). Fixture totals remain well under a second. Live wall-clock: **NOT YET MEASURED**.

## Runtime measurements (tested)

In-memory fake HTTP audit of a 2-page fixture (`https://site.test/`):

| Bucket | ms (measured) |
|--------|----------------|
| crawl | ~37 |
| skills (sum) | ~8 |
| merge | ~0.03 |
| report | ~0.7 |
| **total** | **~45** |
| llm_calls | **0** |

This **does not** prove a live site completes in <5 minutes. Render explosion, real RTT, and sitemap fanout were not measured on the public internet.

Skip-ladder: with `max_seconds=0.01`, `timing.skipped` is populated (`test_h_skip_ladder`). With `max_seconds=60` (<80s remaining threshold), K subset skip is recorded (`k_subset`) while **K3 remains** in the question set.

## Known limitations (matches LOCKED §19)

No headless browser in the zip; dual-fetch uses injected rendered HTML in tests. No search API. No OCR. No click-all. Linked-only H. Hidden-text detector incomplete. Fake dateModified without snapshot. Composite citability unvalidated vs live assistants.

## Deferred (not implemented)

Live-citation-probe; directory-presence; AH9 bake-off; KG completeness; heavy OCR; full ReAct; AG15 NLP findings; embedding topic clusters; Y9 SPA-back; AH8; search-API collision; per-K HITS; LLM hybrid judgments.

## Unresolved issues

- Live unseen-site validation (TASK 020) was **not** run against public URLs (no hard-coded eval hosts; no network soak).
- Zip size / `skills-ref validate` CLI not run (tool may be absent); SKILL.md frontmatter is present and tested in `test_all_skill_md_exist`.
- `render_ms` is now accumulated during dual-fetch; extraction still occurs inside crawl (not a separate engine).
- Live 5-minute validation still not run. Do not claim real-world readiness.
- W-03, flagship_gap, sameAs 404 still lack dedicated TP tests.
- Headless browser still not bundled; production dual-fetch is noscript/template expansion plus optional injected DOM.

## Adobe compliance

| Requirement | Status |
|-------------|--------|
| marketplace.json, 11 skills, one entrypoint | Tested |
| SKILL.md name+description | Tested |
| Read-only GET/HEAD | Tested |
| robots.txt | Tested |
| Report id/title/severity/evidence/suggested_action | Tested |
| No POST/auth/site mutation | Tested |
| No model weights | Present (none shipped) |
| No hard-coded eval hostnames in lib | Tested |
| <5 min live | **Untested** |
| zip ≤50MB | **Not packaged** |

## Recommendations for next iteration

1. Optional Playwright behind hard timeout; keep raw fallback.
2. Dedicated tests for wrong_page, STTF, W-03, sameAs 404.
3. Time a real crawl on non-anecdote domains **without** baking hostnames into source.
4. Fill qualifier/K lexicons from research files more completely.
5. Package zip and measure size.

Do not claim live citation prediction, Lighthouse scores, or ChatGPT rankings — none are implemented.
