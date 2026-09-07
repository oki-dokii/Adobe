# IMPLEMENTATION_REVIEW_V2

Independent hostile audit of `brand-ai-readiness-audit/` against `analysis/review/LOCKED_ARCHITECTURE.md`.

**Method:** Read locked spec, then read production source. Did not treat `IMPLEMENTATION_AUDIT.md` as evidence. Added `tests/test_hostile_audit.py` only to **prove** defects. Production code was not changed.

**Suite after this pass:** 48 tests passing (35 prior + 13 hostile). Passing tests do not imply production readiness.

**Verdict: NOT READY FOR REAL-WORLD TESTING**

---

## Locked-requirement scorecard

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Exact 10-skill set | IMPLEMENTED CORRECTLY | `marketplace.json` matches LOCKED §1 |
| Exactly one entrypoint | IMPLEMENTED CORRECTLY | `entrypoint: true` only on `audit-orchestrator`; tested |
| Skill folder names / SKILL.md | IMPLEMENTED CORRECTLY | `test_all_skill_md_exist` |
| D before CIT/K/X | IMPLEMENTED CORRECTLY | `orchestrator.py` calls `run_d` then CIT/ENT/I then K then X |
| `extractability_flags` | PARTIALLY IMPLEMENTED | D sets flags; CIT skips `not in_raw`; K skips **only K6**, not K3; `in_visible` always `True` |
| `parent_id` | PARTIALLY IMPLEMENTED | Set for js_lock → unanswerable; **both remain user-facing Criticals** (`test_js_lock_and_k_unanswerable_both_remain_user_critical`) |
| `admit()` U13–U18 | PARTIALLY IMPLEMENTED | Function exists; U1/U3/U5/U8/U16 are string-gated and mostly never match real titles; `pages_verified=2` hardcoded |
| SK-I on-site conflicts + dates | PARTIALLY IMPLEMENTED | Price conflicts and crude year mismatch exist; no leader/geo conflict path of similar strength |
| SK-H linked-only off-site | INCORRECT | Linked URL collection is linked-only (good, no search API). **Never emits `linked_contradiction`** — compare loops `continue`/`pass` (`test_h_never_emits_linked_contradiction`). Always emits Low `uncorroborated` when no sameAs (`test_every_site_without_sameas_gets_uncorroborated_finding`) |
| W unanswerable vs wrong_page vs expected_gap | PARTIALLY IMPLEMENTED | Types exist. K3 regex `\bservice\b` false-answers (`test_k3_false_positive_on_generic_service_word`). `wrong_page` untested in v1 suite except code path |
| G `schema_visible_mismatch` | PARTIALLY IMPLEMENTED | Fires on JSON-LD price ≠ visible; U1 admit rule is a no-op on real evidence strings |
| D41 | PARTIALLY IMPLEMENTED | Fires on `display:none` without toggle; misses off-screen/zero-font; `has_toggle` anywhere on page suppresses D41 |
| No search API | IMPLEMENTED CORRECTLY | No DuckDuckGo/SERP usage in `scripts/lib` |
| Skip-ladder | PARTIALLY IMPLEMENTED | H skipped if `remaining < 45s`; K shrunk if `remaining < 80s` **including a 280s run after a 40ms crawl? No — 280 stays full. A 60s cap always shrinks K.** Decisions made **before D**. Does not reduce render M. Does not skip X paraphrase (none exists). |
| Protect-list | MISSING | `PROTECT_LIST` in `clock.py` is **never imported** by orchestrator (`test_protect_list_is_never_consulted_by_orchestrator`) |
| SSRF every redirect hop | INCORRECT | Manual hop check exists **only if** 3xx is returned to Python. Production `build_opener(HTTPHandler(), HTTPSHandler())` **still includes `HTTPRedirectHandler`** (`test_production_opener_still_includes_redirect_handler`). Existing SSRF tests use Fake opener that does not follow. CGNAT `100.64.0.0/10` not blocked (`test_cgnat_ipv4_not_blocked`). DNS rebinding: resolve then urllib resolves again. |
| Shared SimHash templates | PARTIALLY IMPLEMENTED | One clusterer during crawl; θ report language not applied to user-facing wording; `render_max` unused |
| Shared infra (no recrawl per skill) | IMPLEMENTED CORRECTLY | Skills read snapshot; H may extra-GET linked sameAs (allowed) |
| Deferred items stay deferred | IMPLEMENTED CORRECTLY | No live ChatGPT, no AG15 NLP findings, no Y9, no AH8 invention, no embedding clusters |
| Dual-fetch / headless | PARTIALLY IMPLEMENTED | Default `render_status=skipped`, rendered=raw; JS-lock only if tests inject `rendered_map`. Live SPA JS-lock will **not** detect |
| RFC 9309 | IMPLEMENTED CORRECTLY | 5xx fail-closed, 4xx fail-open; tested |
| GET-only | IMPLEMENTED CORRECTLY | Method allowlist; POST raises |
| Coverage AE22 | PARTIALLY IMPLEMENTED | Coverage object present; orphan findings mention counts; not a first-class user `coverage_statement` finding |
| Sanitizer / injection | PARTIALLY IMPLEMENTED | `wrap_as_data` used only in H and **result unused** for comparison; K/CIT/V never delimiter-wrap; no LLM in v1 so risk is latent |
| 5-minute budget | UNTESTED | Fixture total ~45ms. No live origin, no render timeout soak |
| Parallel CIT/ENT/I | MISSING | Sequential. Functionally OK, not as specified |

---

## A. Correctly implemented

- Marketplace identity: 10 skills, one entrypoint, SKILL.md name/description.
- Read-only intent: GET/HEAD only; no cookie jar; no form POST.
- DAG order D → CIT/ENT/I → K → X (H optional).
- Robots 5xx fail-closed stops crawl.
- No search API; no eval hostnames in lib.
- Missing sitemap / missing canonical **not** emitted as defects (tested).
- U2: SPA with prices in raw HTML is not `js_fact_lock` (tested).
- Accordion-in-DOM is not treated as JS-lock (tested).
- K10/K9 `expected_gap` suppressed (tested).
- Template `finding_key` collapse 47→1 (tested).
- Handout fields `id, title, severity, evidence, suggested_action` on user findings (tested).
- Y-01 limitation string always on snapshot.
- Deferred research (live probe, AG15 NLP, AH8, Y9) not quietly shipped as fake checks.

---

## B. Partially implemented

- **admit():** exists but is mostly dead vs real finding titles (U3 requires `"thin"` in title; U1 requires `"good prose"` and not `"mismatch"`; U16 requires the words `"site-wide"`). V-F works only if evidence contains `quote`/`contact` **and** classifier set `saas`.
- **Flags:** set, but `in_visible` never computed; K3 still answers from raw even when prices are JS-locked.
- **Skip-ladder:** H and K-subset only; protect-list unused; render budget `render_max` ignored.
- **SimHash:** clustering yes; AF two-tier “site-wide vs N/M” wording no.
- **CIT:** qualifier/table/schema paths exist; W-03 comparison win-rate barely exercised; `allow_llm` ignored.
- **ENT:** heuristic collision; `sameAs` 404 only if `fetch_sameas` and LLM flag (orchestrator sets `allow_ent_llm=False`, so **404 checks never run** in the real DAG).
- **X:** viewport heuristic exists; STTF condition is self-defeating (see C).
- **Report:** JSON+MD from one object; `suggested_action` flattened to a string; `proactive_recommendations` always `[]`.
- **Confidence:** enum + basis; never 0–100. Merge “min then boost if independent” **boost never implemented**.

---

## C. Incorrect

1. **Production HTTP follows redirects automatically** (`HTTPRedirectHandler` still installed). Hop-by-hop SSRF is not what the default client does. **P0**
2. **SK-H does not emit `linked_contradiction`** even when a linked page contains a different price. Skill is a no-op besides “no sameAs” Low noise. **P0** for that skill’s locked purpose
3. **STTF / accordion visibility:** parser puts `<details>` text into `main_text`, so X requires `txt not in main_text[:200]` and **does not fire** (`test_sttf_does_not_fire_when_details_text_is_also_in_main`). **P1**
4. **Parent/child Critical duplication:** amplifiers with a different `skill_id` are kept. JS-lock + K unanswerable both Critical. **P1**
5. **Unreachable origin uses `finding_type: robots_fail_closed`** — wrong type, wrong remediation. **P2**
6. **K3 “answered” on generic `service`/`platform`.** **P1** false completeness
7. **Every site without JSON-LD sameAs gets a user-facing `uncorroborated` finding.** Contradicts “often suppress” / absence ≠ defect. **P1** alert fatigue
8. **`timed()` has no try/except.** One skill `RuntimeError` aborts the process with no partial report (`test_skill_exception_aborts_entire_audit`). **P0**
9. **CGNAT `100.64.0.0/10` allowed** by `is_blocked_ip`. **P1** SSRF
10. **Robots fetch failure (timeout) is fail-open** except SSRF — may crawl a site whose robots.txt is 5xx behind a timeout. **P2**

---

## D. Missing

- Protect-list enforcement.
- Isolation of skill failures / `status: failed` continuation.
- `interaction_insert` detector (enum only).
- `canonical_dup` detector (enum only; L said only with dup evidence — not built).
- Dual-fetch in production (no renderer).
- Reducing M renders on skip-ladder.
- `compare_claim` Wikipedia-infobox-over-Wikidata order (function stub; unused by H).
- Delimiter wrapping of page text for any skill that would use an LLM.
- Real AF θ site-wide vs sampled language.
- Orchestrator-owned coverage finding as specified (`coverage_statement`).

Unjustified extra behavior (not in architecture as a default finding): **universal Low “no sameAs” corroboration finding.**

---

## E. Untested (even after hostile tests)

- Live network crawl, TLS, real robots, real sitemaps, 5-minute wall clock.
- Headless / JS render path in production (`rendered_map` is test-only).
- `wrong_page` end-to-end fixture.
- `comparison_self_win`, `flagship_gap`, `sameas_404` in DAG.
- Cookie-banner covering identity.
- Multilingual K language mixing.
- Facet trap crawl explosion on a live catalog.
- IPv6 ULA is blocked (fd00) — OK locally; rebinding not tested.
- Zip size, `skills-ref validate`.

---

## F. Security concerns

| Issue | Sev |
|-------|-----|
| Default urllib redirect handler bypasses per-hop `_check_host` | P0 |
| CGNAT 100.64/10 not blocked | P1 |
| DNS rebinding (check then connect re-resolves) | P1 |
| `fetch_robots` fail-open on timeout | P2 |
| Unbounded-ish HTML parse on 2MB pages (capped at max_bytes — OK) | — |
| Prompt-injection delimiters unused except discarded H wrap | P2 latent |
| Skill crash = no report (availability / eval fail) | P0 |
| `same_registrable` treats any subdomain as in-scope (can follow attacker.example.com if linked from example.com — actually `attacker.example.com` endswith `.example.com` — **intended**. `example.com.evil.test` not in scope. OK) | — |
| file: redirect blocked on **manual** hop path (tested) | good |

---

## G. Runtime concerns

- `page_cap=40`, depth 6, sitemap 200: can still do tens of serial GETs + up to 5 H GETs. Unmeasured on slow hosts.
- Skip-ladder with `max_seconds=60` **always** drops K6/K13 because remaining starts &lt; 80s — surprising, not a 5-min problem.
- Default 280s: H almost always runs (T_h=45) even when low value.
- No per-skill timeout; a hung GET uses 8s each, 40 pages ≈ 320s **before** analysis if hosts stall — can miss 5 min. **P0 for live eval**
- `render_ms`/`extraction_ms` always 0 in timing (folded into crawl). Instrumentation incomplete vs the implementation brief.

---

## H. False-positive concerns

| Class | Protected? |
|-------|------------|
| SPA chrome as JS-lock | **Yes** when render skipped/equal; **No** live JS-lock detection either (FN) |
| Missing schema | **Yes** (never emitted) |
| Missing sitemap | **Yes** |
| Missing canonical | **Yes** |
| SaaS no public price | **Partial** — V-F admit needs `saas` flag + quote words in the **unanswerable evidence**. Classifier `saas` requires SAAS_TERMS without ecom; “Contact us for a quote” test passed. Sites that say only “Pricing on request” may still fire K6 |
| Thin-by-design directories | **No** — U3 never matches real K titles (`test_u3_thin_title_gate_never_matches_real_k_titles`) |
| Mission-page voice | **Partial** — CIT skips non-factual types; `about` + vague adjectives explicitly `pass` |
| Accordion-in-DOM as D | **Yes** not JS-lock; **X STTF does not fire** (FN not FP) |
| Wikipedia absence as High | **Partial** — severity cap if title contains “wikipedia”; actual finding title is “No linked third-party sameAs” so cap **does not apply**; still Low emit always |
| Parent/child Critical | **No** — both remain |

Additional FPs: K3 `platform`/`software`/`service`; CIT `table_no_th` on layout tables; ENT “Acme Cloud” short-name collision heuristic; X `viewport_identity` if title is a slogan not in first 400 chars.

---

## I. Generalization concerns

- Classifier is English lexicon + TLD. Multilingual `somos una plataforma` may miss K3 and V.
- Price regex is `$€£` / USD/EUR/GBP — yen/rupee missed (FN).
- `page_type` from URL path tokens — many sites won’t have `/pricing`.
- No renderer ⇒ JS-heavy production sites look “fine” (U2 TN) even when facts are client-only (FN).
- H fetches Wikipedia only if sameAs linked — correct scope — but then does nothing with the body.
- Site-type fixtures in tests are mostly one HTML blob, not 19 live types.

---

## J. Highest-priority fixes

**P0 — blocks reliable evaluation**

1. Replace default opener with a **no-follow** redirect handler; re-check SSRF on each `Location` (including CGNAT, unspecified, metadata). Add a test that uses the **same** opener construction as production, not only Fake.
2. Wrap each skill in `timed()` with try/except → `SkillResult(status=failed)` and continue; always emit a report.
3. Bound total GET time so 40×8s cannot exceed 280s (clock already exists; crawl should stop; **skills must not ignore a spent budget**).
4. Implement H `linked_contradiction` or **stop emitting** a skill that cannot contradict. Do not ship a dummy Low finding on every brand.

**P1 — scoring risk**

5. Drop (or demote) K/CIT amplifiers when parent `js_fact_lock` is High/Critical unless the child action is truly different.
6. Fix STTF: treat closed `<details>` as not user-visible even if present in the DOM string.
7. Tighten K3 patterns; require category/offering sentence, not `service`.
8. Make U3/V-B actually suppress completeness nits on directory/listing templates.
9. Stop default `uncorroborated` on missing sameAs (suppress unless cluster B NAP).
10. Honor `PROTECT_LIST`; do not decide K subset before D; never drop K3 (already mostly true).
11. Either ship a timeout-bounded renderer or state **JS-lock is untestable in v1** in every report limitation (today the limitation exists only when `pages_rendered==0`, which is always — good, but judges may still read Critical JS-lock from injected tests as if production had a browser).

**P2**

12. Fix unreachable `finding_type`.
13. ENT sameAs 404 in the real DAG (not behind dead `allow_ent_llm`).
14. Use `wrap_as_data` if any LLM is added.
15. Instrument render vs extract timings.
16. Apply AF two-tier language using cluster member counts.

**P3**

17. Remove unused `allow_cit_llm` / dead loops / unused `start`/`end` in CIT.
18. Sequential vs parallel CIT/ENT/I — cosmetic if clock is honest.

---

## Skill-by-skill (short)

| Skill | Responsibility OK? | Detects intended? | Evidence | Abstain |
|-------|--------------------|-------------------|----------|---------|
| orch | Yes | Composition yes; failure isolation no | Timing/coverage yes | Seed invalid exits 2 — no JSON |
| V | Yes | Crude English votes | Vote dict | Unknown cluster possible |
| C | Yes | Access yes; canonical_dup no | RFC yes | Sitemap absence OK |
| D | Yes | JS-lock only with injected render | Excerpts yes | Correctly refuses lock when render skipped |
| CIT | Yes | Qualifier/table/schema yes | Quotes yes | Skips JS-lock pages |
| ENT | Yes | Weak without search | Low confidence on heuristic | Distinctive names OK |
| K | Yes | Types yes; regex too wide | Span-or-unanswerable | Expected gaps suppressed |
| I | Yes | Price A≠B yes | URLs+values | Docs U6 only if date_divergence High — I rarely emits High |
| H | Yes on paper | **Does not detect contradictions** | Weak | Should abstain; instead nags sameAs |
| X | Yes | Viewport maybe; STTF no | Heuristic | One-pager crumbs skipped if ≤3 pages |

---

## Schema

`SkillResult` includes `deadline_honored`. `Finding` has locked extras. Handout export drops structured `suggested_action` to a string — Adobe floor still satisfied.

`build_report` then orchestrator **overwrites** `findings` — consistent enough.

---

## Test quality

Prior 35 tests were mostly happy-path fixtures + a few FP TNs. They did **not** cover production urllib redirects, skill crashes, H contradictions, STTF, protect-list, U3, CGNAT, dual Criticals.

Hostile tests now cover those as **failing architecture claims** (tests pass because they assert the bug exists). That is documentation of debt, not a green-light.

---

## Final classification

**NOT READY FOR REAL-WORLD TESTING**

Reasons that survive “but pytest is green”:

- Default HTTP client is not the SSRF client the tests mocked.
- A single skill exception yields no Adobe report.
- Corroboration skill does not corroborate.
- Live JS-lock and 5-minute behavior are unmeasured.
- Several locked FP defenses are inert (U3, parent Critical, sameAs nag).

Do not add features until P0 items 1–4 are fixed and re-tested on the **production** opener and a **partial-failure** orchestrator path.
