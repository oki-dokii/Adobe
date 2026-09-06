# IMPLEMENTATION_FIXES_V1.md

Correctness fixes against `analysis/review/LOCKED_ARCHITECTURE.md` and `IMPLEMENTATION_REVIEW_V2.md`. No new skills, no marketplace expansion, no demo site.

**Suite:** 48 tests before this pass (hostile audit baseline) → **92 passed** after. Live 5-minute crawl: **not measured**.

---

## P0 #1 — Production SSRF redirect protection

**Issue:** Default urllib `build_opener()` still installed `HTTPRedirectHandler`. Fake-opener tests never proved hop inspection on the live client. CGNAT `100.64.0.0/10` was allowed. `strip_userinfo` dropped IPv6 brackets (TOCTOU/parse gap).

**Root cause:** Redirects were followed inside urllib before Python re-checked `Location`. Connect used hostname re-resolution, not the checked IP.

**Code change:** `scripts/lib/http.py` — no `HTTPRedirectHandler`; validate+pin IP **before** each hop; production fetch uses `socket.create_connection` to the pinned IP with `Host`/SNI = original hostname. `scripts/lib/url.py` — block CGNAT; keep IPv6 brackets in `strip_userinfo`. Test-only `unsafe_allow_hosts`/`unsafe_allow_ips` so a loopback HTTPServer can stand in for a public origin without opening SSRF.

**Tests:** `tests/test_production_http.py` (actual production opener: public→public, localhost, 127.0.0.1, private v4/v6, link-local, CGNAT, multi-hop, unsafe hop 2/N, loop, malformed Location, unsupported scheme, GET-only, timeout). Existing Fake tests still cover robots + method allowlist.

**Regression risk:** Third-party HTTPS with unusual SNI; IPv6 literals. Mitigated by bracket fix and SNI wrap.

**Evidence:** 92-test suite green; CGNAT redirect raises `SSRF_BLOCKED` before connect.

---

## P0 #2 — Skill failure isolation

**Issue:** `timed()` had no try/except; one skill exception aborted the audit.

**Root cause:** Orchestrator treated skill callables as infallible.

**Code change:** `orchestrator.py` wraps each skill; records `SkillFailure` (`skill_id`, `status`, `error_type`, `message`, `recoverable`, `dependencies_affected`). Failed D skips CIT/K/X. Report `skill_status` + markdown: SUCCESSFUL / FAILED / SKIPPED DEPENDENT / COMPLETED FINDINGS / INCOMPLETE AREAS. Fatal remains invalid seed URL / seed SSRF.

**Tests:** `tests/test_p0_isolation.py` (one failure, multiple independent, prereq, render, external fetch, semantic, unexpected exception).

**Regression risk:** Swallowing bugs as “partial.” Failures are structured and listed, not silent.

**Evidence:** Classifier `RuntimeError` yields `audit_status=partial` with other skills’ findings preserved.

---

## P0 #3 — SK-H linked corroboration

**Issue:** SK-H never emitted `linked_contradiction`; every site without sameAs got a Low “no sameAs” finding.

**Root cause:** Compare loop `continue`/`pass`; absence treated as a defect.

**Code change:** `skill_h.py` + `facts.compare_claim_against_source`. Linked-only GETs. Cases: A none (metrics only), B agree, C contradict (`linked_contradiction` with claim/source/values/URLs/basis/confidence/severity), D stale, E unusable, F insufficient. No search API.

**Tests:** `tests/test_p0_sk_h.py`.

**Regression risk:** Price regex misses some currencies (pre-existing). Company-profile directionality stays low.

**Evidence:** $50 vs linked $999 emits `linked_contradiction`; HOME without sameAs has no corroboration finding.

---

## P0 #4 — Real render budget + instrumentation

**Issue:** `render_max` unused; dual-fetch only via test injection; timings unmeasured.

**Root cause:** `apply_render` always “skipped” unless `rendered_map` provided.

**Code change:** `render.py` production dual-fetch = noscript/template expansion (honest, no fake browser). `crawl.py` honors `render_max` and protect-listed fact URLs. TimingLog: http_requests, pages_fetched/rendered, render_count, external_requests, llm_calls, skill_ms, total_ms.

**Tests:** `tests/test_p0_render.py`.

**Regression risk:** Noscript expansion can surface dual-fetch deltas that look like JS-lock; that is intended for noscript-only facts. No claim of &lt;5 minutes.

**Evidence:** Fixture audits report `pages_rendered >= 1` and `http_requests >= 1`. Live 5-minute: **NOT YET MEASURED**.

---

## P1 #1 — Parent/child Critical duplication

**Issue:** JS-lock and K unanswerable both stayed user-facing Criticals (`parent_id` set, drop only same `skill_id`).

**Root cause:** `_drop_redundant_children` gated on identical skill.

**Code change:** `merge.py` suppresses amplifiers (`unanswerable`, `qualifier_split`, `sttf_fail`) when parent ≥ High, across skills; keeps `parent_id` and suppressed evidence.

**Tests:** `test_p1_fixes.py` parent-only / +child / child-only / multiple children / multiple parents / same vs different severity.

**Regression risk:** Over-suppression if a child has a truly different action. Current drop list is the locked amplifier set for JS-lock.

---

## P1 #2 — STTF / closed details

**Issue:** Closed `<details>` text was copied into `main_text`, so STTF never fired.

**Root cause:** Parser treated collapsed disclosure as default-visible.

**Code change:** Nested `details` stack; closed text is in-DOM (`closed_details_text`) not `main_text`. X fires STTF when a claim/price is only in closed details. Open details stay visible. CSS-hidden stays D41’s lane. JS-generated (not in raw DOM) is not STTF. Accordion-in-DOM is not D js-lock.

**Tests:** `test_sttf_*` in `test_p1_fixes.py`.

---

## P1 #3 — PROTECT_LIST

**Issue:** `PROTECT_LIST` never imported by the orchestrator.

**Root cause:** Skip-ladder was ad hoc remaining-time ifs.

**Code change:** `clock.plan_skip_ladder()` + orchestrator import. Never drop V, dual-fetch on fact URLs, CIT det, K3, admit, coverage, report.

**Tests:** `test_protect_list_each_category_survives_skip_ladder`.

---

## P1 #4 — U3 thin directory

**Issue:** U3 required `"thin"` in the title; real K titles never matched.

**Root cause:** Title-string gate vs stable IDs.

**Code change:** K sets `finding.metrics["question_id"]`. Admit U3: cluster B + `unanswerable` + question_id K3/K4.

**Tests:** `test_u3_from_raw_k_through_report` (raw K → admit → report).

---

## P1 #5 — K3 “service” false positive

**Issue:** `\bservice\b` counted as an offering.

**Root cause:** Isolated keyword.

**Code change:** Offering sentence: `we are a/an` (not `service`), `we provide|offer|build|make|sell` (not leading `service`), or `we help …`.

**Tests:** Adversarial strings in `test_k3_offering_adversarial`.

---

## P1 #6 — CGNAT

Covered under P0 #1 production path (`test_public_to_cgnat_blocked_production_path`).

---

## Regression audit (post-fix)

| Area | Status |
|------|--------|
| HTTP GET/HEAD, timeouts, size cap | Preserved; production pin-path added |
| robots RFC 9309 | Unchanged `robots.py`; still uses shared client |
| SSRF / redirects | Stronger; every hop + pin |
| crawler | render_max + protect fact URLs |
| rendering | Dual-fetch production expander; injected map still works |
| extractability | Closed details not in visible `main_text` |
| orchestrator | Isolation + protect-list; DAG unchanged |
| merge / severity | Amplifiers suppressed, not deleted |
| SK-H | Linked-only; no search |
| K | Stricter K3; question_id metrics |
| report | Skill outcome sections; timing keys |

**Not claimed:** real-world readiness, live 5-minute success, or headless JS-lock on the public internet.
