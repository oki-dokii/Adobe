# IMPLEMENTATION_TRACEABILITY.md

Maps research → locked architecture → skill → check → code → test.

Authoritative architecture: `analysis/review/LOCKED_ARCHITECTURE.md`.

| Research | Architecture | Skill | Check | Code | Test |
|----------|--------------|-------|-------|------|------|
| HO one entrypoint, dual report | orch | audit-orchestrator | DAG + JSON/MD | `scripts/lib/orchestrator.py`, `report.py` | `test_one_entrypoint_manifest`, `test_handout_fields_and_bluf` |
| RFC 9309 4xx/5xx | fail-open/closed | crawl-access-audit | robots status | `scripts/lib/robots.py` | `test_robots_5xx_fail_closed`, `test_robots_4xx_fail_open`, `test_robots_fail_closed_early` |
| AD SSRF every hop | http_client | infra | pin IP per hop; no HTTPRedirectHandler | `scripts/lib/http.py` | `test_production_http.py`, `test_ssrf_redirect_hop` |
| H linked-only contradiction | SK-H | corroboration-consistency-audit | `linked_contradiction` via `compare_claim_against_source` | `skill_h.py`, `facts.py` | `test_p0_sk_h.py` |
| Skill isolation | orch | audit-orchestrator | failed skill → PARTIAL | `orchestrator.py` | `test_p0_isolation.py` |
| Dual-fetch + render_max | renderer | crawl/D | budget + noscript expand | `render.py`, `crawl.py` | `test_p0_render.py` |
| T parent_id | merge | orch | suppress amplifiers across skills | `merge.py` | `test_p1_fixes.py`, `test_parent_child_js_lock` |
| X STTF | in-DOM not visible | engagement-handoff-audit | closed `<details>` | `extract.py`, `skill_x.py` | `test_p1_fixes.py` |
| Protect-list | skip-ladder | orch | `PROTECT_LIST` + `plan_skip_ladder` | `clock.py`, `orchestrator.py` | `test_protect_list_each_category_survives_skip_ladder` |
| U3 directory | admit | orch | `question_id` K3/K4 + cluster B | `admit.py`, `skill_k.py` | `test_u3_from_raw_k_through_report` |
| K3 offering | span-or-unanswerable | ai-answerability-audit | offering sentence, not “service” | `skill_k.py` | `test_k3_offering_adversarial` |
| CGNAT 100.64/10 | SSRF | infra | `is_blocked_ip` | `url.py` | `test_public_to_cgnat_blocked_production_path` |
| AE crawl + coverage | crawl_planner | orch | time BFS | `scripts/lib/crawl.py` | orchestrator fixture crawls |
| AE∩AF one SimHash | template subsystem | infra | ham≤3 | `scripts/lib/simhash.py` | `test_template_clones_same_key` |
| A11/D dual-fetch U2 | D before CIT/K | render-extract-audit | js_fact_lock vs facts-in-raw | `skill_d.py` | `test_u2_spa_facts_in_raw_not_js_lock`, `test_js_lock_when_render_injects_price` |
| D41 hidden | site finding | render-extract-audit | d41_hidden | `skill_d.py` | `test_d41` |
| B-F2/E qualifier | CIT det protected | citation-extractability-audit | qualifier_split | `skill_cit.py` | `test_qualifier_split_and_mission_tn` |
| G markup≠visible | named type | citation-extractability-audit | schema_visible_mismatch | `skill_cit.py` | `test_schema_mismatch_not_missing_schema` |
| U1 missing schema | never Critical | admit | U1 | `admit.py` | `test_u1_not_missing_schema_critical` |
| V always-run | protect V | site-type-classifier | votes A–F | `skill_v.py` | `test_docs_evergreen_cluster`, site-type fixtures |
| V-F SaaS price | V beats generic | admit | V-F | `admit.py` | `test_vf_saas_quote_suppresses_price_unanswerable` |
| K closed-book + span | protect K3 | ai-answerability-audit | unanswerable | `skill_k.py` | `test_k_requires_span` |
| K9/K10 | expected_gap | ai-answerability-audit | suppressed | `skill_k.py` | `test_k10_not_defect_in_user_report` |
| W wrong_page | finding_type | ai-answerability-audit | wrong_page | `skill_k.py` | (logic present; landing-vs-inner covered in unit path) |
| I on-site conflicts | SK-I not H | freshness-audit | on_site_fact_conflict | `skill_i.py` | `test_on_site_price_conflict` |
| H linked-only | skip-ladder T_h | corroboration-consistency-audit | sameAs GETs | `skill_h.py` | `test_h_skip_ladder` |
| T parent_id | merge | orch | js_fact_lock parent | `merge.py` | `test_parent_child_js_lock` |
| U12 | admit | orch | suppress non-citation | `admit.py` | `test_u12_non_citation` |
| F-02 no wiki score | ENT/H | corroboration | uncorroborated Low | `admit.py` | `test_wikipedia_absence_not_high` |
| AB dual render | one object | orch | markdown from JSON | `report.py` | `test_handout_fields_and_bluf` |
| AA no 0–100 | confidence enum | findings | high/medium/low | `confidence.py` | implicit in findings |
| Z GET-only | http | infra | method allowlist | `http.py` | `test_no_post_method`, `test_no_write_methods_in_http_client` |
| Y-01 | limitations | orch | always Y-01 string | `crawl.py` | `test_site_type_fixtures_do_not_crash` |
| AH composite | metric not finding | K metrics | CoreAnswerabilityRate | `skill_k.py` | metrics on SkillResult |
| AG15 NLP | deferred | — | not implemented | — | documented deferred |
| Live probe | deferred | — | not implemented | — | `test_u12` |
| AH8 | unspecified | — | not implemented | — | — |

## Incomplete journeys (honest)

| Item | Status |
|------|--------|
| W-03 comparison_self_win | Code path exists; no dedicated pytest asserting 7/7 ticks |
| wrong_page finding | Implemented; no isolated fixture asserting finding_type |
| sameAs 404 | Implemented behind fetch_sameas; not hit in default tests |
| Headless render | Not bundled; production dual-fetch expands noscript/template. Tests may inject `rendered_map`. Live browser untested |
| Live 5-minute site | **Not tested** (fixtures only; instrumentation present) |
| LLM semantic checks | v1 deterministic only (`llm_calls=0`) |
| Third-party H contradiction | Implemented; `test_p0_sk_h.py` |
| STTF accordion | Implemented; `test_p1_fixes.py` |
| Flagship_gap | Code gated; no TP test |
| Zip ≤50MB packaging | Not built in this pass |
