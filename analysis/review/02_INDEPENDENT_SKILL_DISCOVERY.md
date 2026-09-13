# Phase 2 — Independent Skill Discovery

Constraint: derived from the 34 research files + Adobe handout **without treating v0’s 10 names as given**. Then compared.

---

## Responsibilities a marketplace must perform

1. **Compose** one read-only, robots-respecting, time-bounded run and emit one report.
2. **Classify site type** so checks and suppressions are not generic SEO.
3. **Access:** can a compliant crawler obtain public HTML (DNS/TLS/HTTP/robots/sitemaps/canonicals/traps/orphans).
4. **Render/extract:** are decision facts in parseable text without interaction; landmarks; media/PDF; deceptive hidden text.
5. **Quote-safety:** self-contained, specific, qualifier-bound, table-headered, schema-aligned claims.
6. **Completeness:** closed-book: does the crawled corpus answer realistic questions; intent-matched *page*; expected gaps not scored as defects.
7. **Identity:** name-collision / mix-up risk vs distinctive brands.
8. **Time:** date-signal honesty; old-vs-current knowledge conflict.
9. **Agreement:** material facts vs linked third parties; contradiction ≠ absence.
10. **Arrival:** after a citation, can a human confirm identity and the cited span.
11. **Honesty about the audit:** coverage %, limitations, no fake live-citation scores.
12. **Safety of the agent:** SSRF, injection delimiters, rate limits.

## Fresh candidate set (from scratch)

| Proposed skill | Why independent | Reject as skill? |
|----------------|-----------------|------------------|
| `audit-orchestrator` | Handout one entrypoint; Z | No |
| `site-type-classifier` | V always-run; unique YMYL findings; unique suppression owner | No — not mere infra |
| `crawl-access-audit` | Gate 1; infra owner is SRE/robots | No |
| `render-extract-audit` | Gate 2; front-end owner; dual-fetch | No |
| `citation-extractability-audit` | Gate 3; writers; RAG window | No |
| `ai-answerability-audit` | Completeness ≠ quotability (K vs B) | No |
| `entity-identity-audit` | Mix-up ≠ missing quote (WhoQA) | No |
| `freshness-audit` | Temporal mechanism; U6/U7 | No |
| `corroboration-consistency-audit` | Off-site compare; different fetch/robots | No |
| `engagement-handoff-audit` | Round 3 human half; foraging | No |

## Considered and not promoted to skills

| Idea | Independent verdict |
|------|---------------------|
| HTTP vs robots split | Padding. Same fetch. |
| Structured-data integrity skill | **Sub-check.** G’s mechanism is real; folder would duplicate `compare_claim` and CIT pass. |
| Query-page alignment skill | **Finding classes inside K**, not a folder. Same corpus QA. |
| Template clustering | **Infra.** |
| Site graph / HITS | **Infra.** Findings via C (orphans) with coverage. |
| Composite citability | **Metric.** |
| Flagship gap | **Sub-check of K.** |
| Live AI probe | **Defer.** |
| CWV / Lighthouse | **Reject** as skill; CLS proxy in X; TTFB metric optional. |
| Full a11y | **Reject** (N). Alt materiality in D. |
| Prompt-injection auditor (user-facing only) | **Infra + D41 site finding.** |
| Comparison-table win-rate | **Sub-check of CIT** (on-site, deterministic). |
| Directory presence / aggregator bake-off (AH9) | **Defer** extra fetches. |
| KG completeness | **Reject.** |
| llms.txt | **Reject** as required. |

## NEW vs CURRENT

The independently derived **folder set is identical** to v0’s 10.

That is not a defense of v0. It means the **decomposition axis (mechanism + remediation owner + evidence type)** is stable. The failures are **boundaries, admission control, and missing sub-checks**, not missing folders.

## “Might be missing from a naive 10-skill split”

1. D41 cloaking vs accordion.
2. WRONG_PAGE vs UNANSWERABLE.
3. Schema↔visible as named type (G).
4. Contradiction vs uncorroborated (H).
5. U13–U18 pre-emit.
6. Extractability flags consumed by K/X.
7. Linked-only H vs search-H (FN).
8. Collision check without search API.
9. TTFB independent of JS.
10. Comparison 100% win disclosure.
11. Typed internal AC12 without AG15.
12. Multilingual K language.
13. Coverage as first-class user finding/section.
14. Skip-ladder so 11 marketplace skills do not equal 11 LLM passes.
15. STTF paraphrase FN.

None of these justify an 11th skill.
