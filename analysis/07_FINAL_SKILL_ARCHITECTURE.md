# Phase 7 — Final Skill Architecture

Marketplace: **brand-ai-readiness-audit**  
Entrypoint: **audit-orchestrator**  
Detection skills: 9  
Total skills: **10**

## Skill catalog

### SK-ORCH — audit-orchestrator
- **Purpose:** Validate input, run crawl, invoke skills, merge, score, render report.
- **Scope:** Composition only; no unique website checks except coverage/limitations statements.
- **Non-goals:** Reimplementing checks inline.
- **Research:** Z, AB, S, T, AA, U, AC, AE, AD, HO.
- **I/O:** URL in; FinalAuditReport out.
- **Runtime:** Remaining budget after skills; report <15s target.

### SK-V — site-type-classifier
- **Purpose:** Assign cluster A–F + YMYL + multilingual; emit type-gated findings (e.g. missing medical reviewer).
- **Non-goals:** 20 independent vertical skills.
- **Research:** V-01..V-04, U17.
- **Mechanism:** URL/nav/prose features + bounded LLM.
- **FP:** Hybrid campus bookstore ≠ “must have SaaS pricing”.
- **Outputs:** `SiteTypeClassification` consumed by all.

### SK-C — crawl-access-audit
- **Purpose:** Gate 1: can a compliant crawler reach public URLs.
- **Scope:** DNS/TLS/HTTP, redirects/loops, robots.txt RFC 9309 + AI tokens, meta/X-Robots, canonicals, sitemaps, orphans/depth (AG), faceted traps, URL duplication.
- **Non-goals:** JS completeness (SK-D); content quality.
- **Research:** C, AE-02, L canonicals.
- **Remediation:** Infra vs robots vs IA — labeled separately.

### SK-D — render-extract-audit
- **Purpose:** Gate 2: facts available as text without interaction.
- **Scope:** Dual-fetch delta, interaction-gated, API-only, PDF/image/video (U9/U10), landmarks/`<main>`, hidden text (AD).
- **Non-goals:** “Add schema”; CWV lab scores as citation levers.
- **Research:** D, A11, N, U9–U10, AD-01.

### SK-CIT — citation-extractability-audit
- **Purpose:** Gate 3: quotable, self-contained, hard-to-misquote passages.
- **Scope:** Specificity vs fluff (B-F1/J), qualifier windows (B-F2/A16/E-02), tables (E-03), negation (E-01), schema↔text parity (G/B-F3), title/H1 as identity sentence (L).
- **Non-goals:** Whether the fact exists (SK-K); vendor citation prediction.
- **Research:** A16, B, E, J, G, AH-01.

### SK-ENT — entity-identity-audit
- **Purpose:** Reduce name-collision misattribution.
- **Scope:** Collision risk, disambiguating prose, aliases, sameAs consistency, merger narrative.
- **Non-goals:** Wikidata completeness scores; “Entity SEO” checklists.
- **Research:** F-00, F-01, F-02.

### SK-K — ai-answerability-audit
- **Purpose:** Closed-book: can crawled text answer realistic questions.
- **Scope:** K taxonomy (site-type filtered), W intent alignment, AH flagship gap, composite citability as **metric not finding spam**.
- **Non-goals:** Live ChatGPT queries; scoring K9/K10 as defects; recommending superlatives.
- **Research:** K, W, R-02, AH.

### SK-I — freshness-audit
- **Purpose:** Credible recency for time-sensitive facts; internal temporal contradictions.
- **Scope:** Date-signal convergence (I-03), query-deserves-freshness weighting (I-02), press-release vs current (I-01).
- **Non-goals:** Punishing evergreen/docs versions (U6, V-D).
- **Research:** I, C lastmod.

### SK-H — corroboration-consistency-audit
- **Purpose:** Fragile uncorroborated claims; on-site vs public third-party drift for **material** facts.
- **Scope:** Bounded public GETs (Wikipedia/Wikidata/official social if linked); P-03 materiality gate; H-02 confidence language.
- **Non-goals:** Paid SEO APIs; E-E-A-T scores; exhaustive web.
- **Research:** H, P, HO App D.

### SK-X — engagement-handoff-audit
- **Purpose:** After an AI citation, can a human confirm and proceed.
- **Scope:** First viewport (M), scent (M/X), STTF-matchability (X-02), prominent trust cues (X-03), breadcrumbs/persistent nav (Y-02).
- **Non-goals:** Referrer-aware personalization, returning-visitor tests (Y-01).
- **Research:** M, X, Y, O-01 CLS.

## Relationship graph

```
                    URL
                     │
              SK-ORCH validate + robots
                     │
              shared crawl (AE/AF/AG)
                     │
              SK-V classifier
                     │
        ┌────────────┼────────────┐
        v            v            v
      SK-C         SK-D         (pages)
        │            │
        └──── extract ────┬─────────── SK-CIT
                          ├─────────── SK-ENT
                          ├─────────── SK-K  (needs SK-V + queries)
                          ├─────────── SK-I
                          ├─────────── SK-H  (needs extra fetches)
                          └─────────── SK-X  (needs SK-K/W claims)
                     │
              U suppression + T merge + S score + AC recs
                     │
              FinalAuditReport
```

Parallel after crawl+V: C, D, CIT, ENT, I can run together.  
K after extract. X after K (or after heuristic claim list). H after identity facts extracted.  
C may short-circuit if site unreachable.

## Shared non-skill modules (not marketplace skills)

`lib/http`, `lib/robots`, `lib/crawl`, `lib/extract`, `lib/simhash`, `lib/suppress`, `lib/merge`, `lib/confidence`, `lib/report`.
