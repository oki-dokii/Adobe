# Phase 6 — Skill Decisions

Adobe rewards genuine separation of concerns, not skill count.

**Policy:** One skill per distinct **mechanism + evidence type + remediation owner**. Infrastructure is not a skill unless it emits user-facing findings of its own.

## KEEP (10) — become marketplace skills

| ID | Canonical name | Why KEEP |
|----|----------------|----------|
| CS-001 | audit-orchestrator | Handout: exactly one entrypoint; Z-02 DAG |
| CS-002 | site-type-classifier | V empirical: must run always; emits YMYL disclosure findings; gates FPs |
| CS-004+003+036+037 | crawl-access-audit | One access-gate skill (HTTP+robots+index+IA crawl graph). Splitting HTTP vs robots is padding. |
| CS-006 | render-extract-audit | Distinct mechanism from access (HO-008 gate 2); different owner (front-end) |
| CS-010 | citation-extractability-audit | Distinct gate 3; B-F1/F2/E/J |
| CS-015 | entity-identity-audit | WhoQA is a different failure (mix-up) than missing quotes |
| CS-012 | ai-answerability-audit | Completeness ≠ extractability (K framing) |
| CS-014 | freshness-audit | Temporal mechanism; I-01 unique |
| CS-017+018 | corroboration-consistency-audit | App D; H+P same fetcher |
| CS-021+019+020+022 | engagement-handoff-audit | Human-side of Round 3; M+X+Y one visitor-experience mechanism |

## MERGE (into KEEP)

| Candidates | Into | Reason |
|------------|------|--------|
| CS-003 HTTP | crawl-access | Same fetch stack; C-O says compose |
| CS-005 crawl-render-audit | SPLIT into crawl-access + render-extract | Handout example over-merged two gates; research insists C≠D |
| CS-007 validity | entity-identity (identity types) + citation (parity) as subchecks | Avoid schema-as-skill padding; D-MYTH |
| CS-008 009 011 023 060 | citation-extractability | Same detection pass, two lenses |
| CS-013 031 032 035 049 | ai-answerability | W is query-conditioned K; AH predictor is scoring not a skill |
| CS-016 | citation + entity | Parity check |
| CS-024 038 039 057 058 | render-extract | Non-text / landmarks |
| CS-026 L canonicals | crawl-access | Duplicate C |
| CS-026 titles/H1 | citation-extractability | Identity sentence extractability not “SEO” |
| CS-025 CLS | engagement first-viewport | O-01 |
| CS-027 041 042 043 044 046 059 | orchestrator + shared libs | Not separable user skills |
| CS-028 029 030 | shared crawl infra; findings via crawl-access / templates | AE author: not a detection skill |
| CS-040 | site-type-classifier | YMYL disclosures are type-gated |
| CS-047 | procedure inside hybrid skills | Not a skill folder |
| CS-048 | freshness + corroboration | Internal graph |
| CS-050 OG | engagement Low optional subcheck | Link preview ≠ extraction |
| CS-051 | crawl-access + classifier | hreflang is access/IA |
| CS-036 037 | crawl-access subchecks | |

## DEFER (good ideas, not v1 runtime)

| ID | Reason |
|----|--------|
| CS-033 live-citation-probe | 5 min, non-determinism, U12 sample size, ToS; R forbids overclaim |
| CS-052 directory-presence | Off-site, budget, site-type specific; AC opportunistic only if time remains |
| CS-055 KG completeness score | F-02; Wikidata bias |
| Heavy OCR / video transcription | Runtime; sample 1–2 images only in render-extract |
| Full ReAct loops | AA-02 cap |
| AG15 hard claim-conflict findings | Graph layer may store claims; user-facing conflict findings wait on E2E FP test (AG-031) |
| AF embedding topic clusters | Only if AC12 ships with budget; do not duplicate SimHash template IDs |
| Y9 SPA history-back interaction | Needs extra interaction budget; optional; do not fabricate session tests (Y-01) |

## REJECT

| ID | Reason |
|----|--------|
| CS-034 llms.txt required | Google ignores; not evidenced elsewhere as necessary |
| CS-053 email analog | Out of website audit scope |
| CS-054 personalization | Y-01 structurally untestable |
| CS-056 GEO 40% | F-00 rejected claim |
| Standalone CS-025 CWV suite | O-01 redundant; lab CWV ≠ AI citation |
| Generic meta-description skill | L: no AI-mechanism evidence |
| Micro-skills per K3–K24 | E-02/K pattern: config not skills |
| Micro-skills per C1–C50 | C author clustered already |

## Pairwise “would split improve composability?”

- crawl vs render: **YES** — different evidence, remediation, severity psychology (policy vs bug).
- citation vs answerability: **YES** — “can’t quote” vs “never said”.
- entity vs corroboration: **YES** — mix-up vs agreement.
- freshness vs corroboration: **YES** — dates vs other sources.
- M vs X vs Y: **NO** — same visitor-orientation mechanism; split would be padding.
- H vs P: **NO** — same third-party fetch and fact compare.
- classifier vs orchestrator: **YES** — classifier is reusable, testable, has own findings.

## Counts

| Decision | Count of CS-* |
|----------|----------------|
| KEEP (folders) | **10** |
| MERGE into those 10 | **35** |
| DEFER | **8** (5 original + AG15 hard findings, AF topic-embeddings, Y9 SPA-back) |
| REJECT | **10** |

(60 CS-* candidates: 10 keep + 35 merge + 5 defer + 10 reject. Three additional *mechanisms* deferred from extractor join notes, not extra CS IDs.)
