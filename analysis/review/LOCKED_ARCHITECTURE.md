# LOCKED ARCHITECTURE (v3-locked)

**Status:** Source of truth for implementation.  
**Supersedes:** `analysis/07_FINAL_SKILL_ARCHITECTURE.md`, `analysis/11_ORCHESTRATOR.md`, and `analysis/cursor/*` wherever they conflict.  
**Does not implement code.**  
**Marketplace:** `brand-ai-readiness-audit`  
**Version:** 1.0.0 (until first scored zip)

---

## 1. Final skill list (10)

| id | folder |
|----|--------|
| `audit-orchestrator` | skills/audit-orchestrator (**entrypoint**) |
| `site-type-classifier` | skills/site-type-classifier |
| `crawl-access-audit` | skills/crawl-access-audit |
| `render-extract-audit` | skills/render-extract-audit |
| `citation-extractability-audit` | skills/citation-extractability-audit |
| `entity-identity-audit` | skills/entity-identity-audit |
| `ai-answerability-audit` | skills/ai-answerability-audit |
| `freshness-audit` | skills/freshness-audit |
| `corroboration-consistency-audit` | skills/corroboration-consistency-audit |
| `engagement-handoff-audit` | skills/engagement-handoff-audit |

---

## 2. Exact purpose of every skill

- **audit-orchestrator:** One run: validate, robots, crawl snapshot, budget clock, invoke skills, `admit()`, T-merge, score, dual report, coverage/limitations. No website checks except those meta statements.
- **site-type-classifier:** Multi-label V cluster A–F + YMYL + multilingual. Emits type-gated findings (e.g. missing reviewer). Owns never-fire table keys.
- **crawl-access-audit:** Gate 1 — can a compliant crawler obtain public URLs (transport, RFC 9309, AI tokens, meta/X-Robots, canonicals **if dups**, sitemaps, traps, orphans **with coverage**).
- **render-extract-audit:** Gate 2 — decision facts in parseable text without interaction; dual-fetch; media/PDF; landmarks; **D41** permanent hide; sets `extractability_flags`.
- **citation-extractability-audit:** Gate 3 — quotable, specific, qualifier-safe, table-headered claims; **schema_visible_mismatch**; gated **comparison_self_win_table**.
- **entity-identity-audit:** Name-collision mix-up risk; disambiguators; identity `sameAs` **404**; no Wikidata-absence defect.
- **ai-answerability-audit:** Closed-book corpus QA with **span-or-invalid**; classes `unanswerable` | `wrong_page` | `expected_gap` | `partial`; flagship subcheck; metrics only for composite citability.
- **freshness-audit:** Date-signal credibility **and all on-site typed fact conflicts** (old vs new and same-time).
- **corroboration-consistency-audit:** **Off-site linked** GETs only; `linked_contradiction` vs `uncorroborated` (latter ≤ Low).
- **engagement-handoff-audit:** After citation: first-viewport identity, scent, STTF (in-DOM visibility), wayfinding. Not “not in DOM” (that is D).

---

## 3. Exact non-goals (product-wide)

POST/PUT/DELETE; auth; site changes; hard-coded eval sites; model weights; paid APIs; live ChatGPT/Gemini probing; verbalized 0–100 confidence; “will be cited”; GEO 40%; llms.txt required; missing schema as Critical; Lighthouse suite; full WCAG; personalization/referrer/returning visitor; inventing AH8; AG15 NLP hard findings; web search APIs; recommending superlatives or listicle homepages.

---

## 4. Exact skill boundaries

| Topic | Owner | Not owner |
|-------|-------|-----------|
| robots 5xx | C | everyone else skips crawl |
| JS fact absent in raw | D root | CIT/K/X amplifier or omit |
| Accordion: in DOM, closed | X if central cited claim | D |
| Accordion: inserted on click | D | X |
| Qualifier split | CIT | K |
| Fact never in corpus | K `unanswerable` | CIT |
| Fact on URL B not landing URL A | K `wrong_page` | C unless orphan |
| JSON-LD ≠ visible price | CIT `schema_visible_mismatch` | ENT |
| Organization sameAs 404 | ENT | H |
| Wikipedia value ≠ site (linked) | H | ENT |
| 2019 press vs 2026 price on-site | I | H |
| Two current pages price A≠B | I | H, AG15 |
| Collision without disambiguation | ENT | H |
| YMYL reviewer | V | CIT hedge |
| Coverage % | orch | AG isolation must carry it |

**V beats generic content findings** on direct contradiction (e.g. V-F no public price).

---

## 5. Skill dependencies

```
orch: validate → robots → crawl raw → V
C  (parallel with V after graph exists)
render subset → D (flags)
then parallel: CIT, ENT, I
then K (needs V, flags, extract)
then parallel: X (needs claims), H (if time ≥ T_h)
then admit → merge → report
```

H does not depend on K. X depends on claim list from K and/or CIT.

---

## 6. Shared infrastructure

`http_client` (GET/HEAD, max_bytes, timeouts, **SSRF every hop**), `robots_policy` (all origins including third-party), `url_normalize`, `sitemap_parser` (fanout cap), `crawl_planner` (time-primary), `simhash_cluster` (one AE∩AF subsystem; θ for report language), `renderer` (timeout + raw fallback), `html_parse`, `metadata_extract`, `structured_data_parse`, `page_classifier`, `entity_extract`, `fact_store` + `compare_claim_against_source` (P order: materiality → infobox>Wikidata → timestamps → company profiles low directionality), `evidence_store`, `admit()` U-flow, `merge` finding_key+parent_id, `confidence_normalize`, `sanitizer`+delimiters, `rate_limiter`.

Skills **must not** recrawl. They read `CrawlSnapshot`.

---

## 7. Common data contracts (additions to `09_DATA_CONTRACTS.md`)

**Page** also: `language`, `robots_meta`, `content_simhash`, `unfetched`, `extractability_flags`: `{in_raw, in_rendered, in_visible, notes}`, `render_status`.

**Finding** also: `finding_type` (enum below), `parent_id`, `causal_role`: `root|amplifier|joint`, `admission`: `{emitted|suppressed, rule}`.

**FinalAuditReport.limitations[]** required (always include Y-01; include render/search/H skips when they happened).

**SkillResult** includes `deadline_honored: boolean`.

---

## 8. Finding schema

Handout floor: `id, title, severity, evidence, suggested_action`.

Closed **finding_type** enum:

`robots_fail_closed`, `ai_token_disallow`, `orphan`, `trap_facet`, `canonical_dup`, `js_fact_lock`, `interaction_insert`, `d41_hidden`, `pdf_only_fact`, `image_locked_fact`, `qualifier_split`, `table_no_th`, `schema_visible_mismatch`, `comparison_self_win`, `unanswerable`, `wrong_page`, `expected_gap`, `flagship_gap`, `collision_risk`, `sameas_404`, `date_divergence`, `on_site_fact_conflict`, `linked_contradiction`, `uncorroborated`, `viewport_identity`, `sttf_fail`, `scent_break`, `ymy_disclosure`, `coverage_statement` (orch, not severity spam).

Evidence: reproducible URLs + short quotes. `suggested_action` object with what/where/how/why (see `10_FINDING_STANDARD.md`).

---

## 9. Orchestrator flow

1. Reject non-http(s), userinfo, non-public IP seed.
2. robots; 5xx fail-closed → C finding + report.
3. Crawl until time or AE stop; always AE22 coverage.
4. V; unknown → conservative (don’t suppress pricing).
5. C.
6. Render top-M fact URLs; D flags.
7. CIT, ENT, I.
8. K subset (protect K3).
9. X; H if `remaining ≥ T_h` (default 45s) else skip with limitation.
10. `admit()` every finding (U1–U18).
11. Attach parents; drop redundant children if parent ≥ high unless different owner action.
12. Template rollup AF 2–3 confirms; two-tier language.
13. Severity; jointly-necessary = **max**.
14. Cap **15** user-facing; overflow appendix; JSON keeps suppressed with reason.
15. Render MD from JSON (no second LLM pass).

---

## 10. Runtime budget

Wall **< 300s**. Skills receive `deadline_ts`.

**Skip-ladder** (drop first → last):

1. H fetches  
2. Shrink K question set (keep protect-list)  
3. CIT/ENT LLM (keep det)  
4. Reduce M renders (keep homepage + seed + pricing/about if exist)  
5. X paraphrase LLM  

**Protect-list (never drop while run continues):** V, dual-fetch on identified fact URLs, CIT deterministic qualifier/table/schema-parity, **K3**, U admit, coverage, report.

40/60 crawl/analysis is a **hypothesis**, not a KPI. Clock + ladder is binding.

Defaults (tunable): fetch ~8s; render ~8s; M_max=10; sitemap URL cap; per-host concurrency 1–2; H GETs ≤5.

---

## 11. Safety model

GET/HEAD only. Shared robots. SSRF: http(s) only; resolve IP **each hop**; block RFC1918, 127/8, 169.254/16, IPv6 ULA/loopback; max 5 redirects. No cookie jar. Size caps. Timeouts. Trap: depth + param + simhash-flat. Delimiter-wrap all page/third-party text to LLMs; hidden-text strip supplementary. `allowed-tools` ≠ sandbox. Error `SSRF_BLOCKED`.

---

## 12. Severity model

`critical | high | medium | low`

- **critical:** total access fail; robots fail-closed; core identity/price/legal **fact-bearing** JS-lock or misquote  
- **high:** K3 missing (if applicable); collision **with evidence**; on-site decision-fact conflict; linked material contradiction; cited central claim not user-visible  
- **medium:** AI-token disallow with Googlebot allowed (explain intent); date-signal mess; table th; weak scent  
- **low:** OG; schema missing with good prose; crumbs on hierarchical sites; uncorroborated; TTFB>10s homepage optional  

Materiality fail → cap low. YMYL disclosure high only cluster A.

---

## 13. Confidence model

`high | medium | low` + **basis string**. Never %.  
high: det + 2 URLs or RFC. medium: hybrid / single page. low: LLM-only / skipped fetch / heuristic collision.  
Merge: min, then boost only if **independent** (not parent-child) skills agree. H-02: corroboration findings evidence_tier may be HYP for *citation impact*.

---

## 14. Root-cause model

Walk gates: access → parse → quote → complete/place → identity → time/internal → external → arrival.  
First failing gate is `root`. Later = `amplifier` + `parent_id` or omit.  
T jointly-necessary: one cluster, severity max.

---

## 15. Deduplication model

`finding_key = hash(finding_type + template_or_url + normalized_claim)`.  
Template: one finding, `affected_pages_count`, examples.  
Never merge on URL alone.  
Never silent drop: `suppressed` + rule.

---

## 16. Testing strategy

Fixtures per U1–U8, U9–U11; V each cluster; SPA raw-has-facts TN; SPA raw-missing-price TP; qualifier $49 TP; mission-page TN; V-F quote CTA; K10 not defect; uncited K answer invalid; evergreen docs TN; bakery no-wiki TN; flat site crumbs TN; 47 clones → 1 finding; robots 4xx vs 5xx; SSRF redirect; D-before-K no double Critical; H skip when no time.

---

## 17. Deferred items

Live-citation-probe; directory-presence; AH9 aggregator bake-off; KG completeness score; heavy OCR/video; full ReAct; AG15 NLP findings; AF embedding topic clusters; Y9 SPA back; AH8 (unspecified); search-API collision; per-K HITS.

---

## 18. Explicit rejected items

llms.txt required; email analog; personalization audit; GEO 40%; standalone CWV skill; generic meta-description skill; micro-skills per K/C item; structured-data **folder**; query-alignment **folder**; five site graphs; two AF implementations.

---

## 19. Remaining known limitations

Single vantage (geo TLS FN); partial crawl; no click-all; no OCR-all; no unlinked third parties; hidden-text detector incomplete; WhoQA without search; fake dateModified without snapshot; 5-min incompleteness; composite citability unvalidated vs live; headless may be absent.

---

## 20. Why this is better than the initial architecture

v0 picked the right **folders** and the wrong **wiring**. v3-locked keeps 10 skills (independent discovery agrees) but: sequences gates so symptoms do not all fire Critical; makes W/G/D41/U-flow/AC12-typed visible; splits I (on-site) vs H (linked off-site); forbids search fantasy; puts a protect-list on the 5-minute budget so the zip cannot degrade into a sitemap checker.

---

## Closed `admit()` outline

1. U14 minimum evidence else `insufficient_evidence`  
2. U17/U18 site-type exception → suppress  
3. U16 sampling: no site-wide language without 2–3 template confirms  
4. U12 no non-citation claims  
5. U1–U11 table  
6. AA-01 confidence from proxies  

---

## Compare_claim order (P)

materiality → Wikipedia infobox overrides Wikidata → revision timestamps → company-owned profiles (low directionality) → press as snapshot unless large recent gap.
