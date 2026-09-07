# Phase 3 — Skill-by-Skill Interrogation (v0)

Verdict vocabulary: KEEP AS-IS | IMPROVE | MERGE | SPLIT | REPLACE | REMOVE.

---

## SK-ORCH `audit-orchestrator`

1. Problem: composition, budget, merge, report. 2. Real. 3. Z, AB, S, T, HO. 4. Mechanism understood. 5. Meta-cause. 6. No other skill should own DAG. 7–8. Unique (coverage, limitations). 9. Required by Adobe. 10. Automatable. 11. Signal = process health. 12. FP: finding spam if merge fails. 13. FN: drop Critical on merge. 14. General. 15. Cheap if thin. 16. Yes — must not reimplement checks. 17. Add skip-ladder + parent_id merge. 18. Stronger: **explicit producer contracts**. 19. Name OK. 20. Boundaries: currently also AC/T/S — correct (policy vs pipe). 21. Useless if it prints 80 Low SEO nits. 22. Abstain: invalid URL / robots fail-closed still reports.

**Verdict: IMPROVE** (skip-ladder, U-flow, parent_id, coverage always).

---

## SK-V `site-type-classifier`

Always-run gating + YMYL disclosures. Research V-01. Unique never-fire owner. FP: hybrid campus bookstore as SaaS. FN: embedded YMYL widget. Cascade: wrong suppressions. Automatable hybrid. Worth cost (cheap). Name OK. Not infra-only because it **emits findings**.

**Verdict: IMPROVE** — conservative unknown cluster; never suppress pricing unless F-cluster confidence high; multi-label hybrids.

---

## SK-C `crawl-access-audit`

Gate 1. Real. Evidence RFC/HTTP. Root cause for invisibility. Overlap with graph orphans (AG) — OK if coverage attached. Unique remediations (infra vs robots). Conventional — **required, not differentiator**. FP: missing sitemap Critical; U8 disallow. FN: geo TLS. Runtime cheap.

**Verdict: IMPROVE** — L canonicals only if duplication evidenced; optional TTFB metric not a finding; AI-token matrix as Medium explain, not Critical if Googlebot allowed (site may intend).

---

## SK-D `render-extract-audit`

Gate 2. Dual-fetch fact-bearing only (U2). Distinct from C. Overlap with X accordions and CIT “unquotable” if text missing. Unique rem: SSR. FP: any SPA. FN: canvas/OCR. D41 missing.

**Verdict: IMPROVE** — emit D41; set `extractability_flags`; interaction-gated (not in DOM) vs CSS-hidden-with-toggle (not a D defect).

---

## SK-CIT `citation-extractability-audit`

Gate 3. B-F1/F2/E/J/G. Distinct from “never said” (K). Unique rem: rewrite sentence / th / schema match. Broad folder risk (looks like padding). FP: mission voice; missing schema. FN: div tables.

**Verdict: IMPROVE** — named `finding_type`s including `schema_visible_mismatch` and `comparison_self_win_table` (W-03); consume D flags so JS-missing price is not a second Critical.

---

## SK-ENT `entity-identity-audit`

WhoQA mix-up. Distinct from H agreement. Unique rem: early disambiguators. FP: no Wikidata. FN: no search API, non-English. **Automation hole.**

**Verdict: IMPROVE** — on-page + linked sameAs only for v1; `collision_risk` heuristic; never High without measured homonym evidence; if heuristic weak, Low/insufficient_evidence.

---

## SK-K `ai-answerability-audit`

Closed-book completeness. Distinct. High LLM cost. Hallucination FP. Site-type expected gaps. W flattened.

**Verdict: IMPROVE** — require evidence spans; split `unanswerable` vs `wrong_page`; skip questions whose facts D marked unextractable (child of D); 2–3 W calibration queries max; K subset under budget.

---

## SK-I `freshness-audit`

Temporal. Distinct from H off-site. FP: evergreen, history pages, fake-update undetectable without snapshot. Unique rem: supersede banners / honest dates.

**Verdict: IMPROVE** — own **time-indexed** conflicts only; QDF weighting; never age-only; attach coverage.

---

## SK-H `corroboration-consistency-audit`

Material drift vs linked sources; H-02 wording. Overlap with I (on-site) and ENT (sameAs 404). Runtime/robots fragile. Research wants search; spec is linked-only.

**Verdict: IMPROVE** — **off-site linked sources only**; finding classes `contradiction` vs `uncorroborated` (latter ≤ Low, often suppress); skip entire skill if time < T_h; NAP for cluster B. Do **not** REMOVE (unique third-party evidence). Do **not** MERGE with I (different fetch/robots/bias).

---

## SK-X `engagement-handoff-audit`

Round 3 human mandate. Foraging/STTF/trust. Overlap D accordion and K claims. FP: minimalist = untrustworthy; crumbs on one-pager. FN: paraphrase STTF.

**Verdict: IMPROVE** — central claims only; STTF: exact then optional one paraphrase LLM; breadcrumbs not required on flat sites; CLS proxy Low; do not click-test Y9.

---

## Cross-skill structural verdicts

| Move | Why not |
|------|---------|
| MERGE D+CIT | Different owners and remediations (SSR vs rewrite). |
| MERGE CIT+K | “Can’t quote” vs “never said.” |
| MERGE ENT+H | Mix-up vs drift. |
| MERGE I+H | Dates vs third-party GETs. |
| MERGE M/X/Y | Already merged — correct. |
| SPLIT C HTTP vs robots | Padding. |
| SPLIT G schema skill | Duplicate pass. |
| SPLIT W folder | Same QA corpus. |
| REMOVE H | Loses App D / P; instead skip-if-poor. |
| REMOVE X | Violates dual mandate. |
| REPLACE any with Lighthouse | Research O/N/L against it. |

No skill is KEEP AS-IS. None REMOVE/SPLIT/REPLACE at folder level.
