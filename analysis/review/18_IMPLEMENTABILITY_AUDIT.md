# Phase 18 — Implementability Audit

Question: can an engineer implement from v0 specs without inventing policy?

| Area | Ambiguous in v0 | Lock in revised |
|------|-----------------|-----------------|
| Hamming ≤3 vs AF θ | Two numbers, no algorithm | One pipeline: SimHash cluster online; θ-shared-node for **report language**; defaults documented as tunables |
| Render timeout | “aggressive” | e.g. 8s/page, M_max=10 |
| 40/60 | Unvalidated | Label hypothesis; skip-ladder is the real control |
| Collision search | “optional DDG” | **v1: no search API** |
| K weights | Uncalibrated | Don’t freeze; report per-question |
| Window N sentences | Unspecified | Start N=2 + same table row |
| Viewport px | Unspecified | 640×700 heuristic |
| finding_type enum | Missing | Closed enum in LOCKED |
| U13–U18 | Table only | Function `admit(finding) -> emit\|suppress` |
| SK-H search vs linked | Contradicts skill spec | Linked-only |
| Headless lib | Unknown | Interface + raw fallback |
| Qualifier lexicon | File named, not filled | Must ship `references/qualifying_context_taxonomy.md` |
| K question bank | Referenced | Must ship filtered by V |
| AI robots tokens | Unspecified list | Closed list + “unknown UA documented” |
| Alert cap ~15 | Soft | Hard user-facing 15, JSON may keep suppressed |
| priority_score formula | Original | Keep as heuristic, not science |
| Parallel C/D/CIT | Race on flags | Resequence |
| AG15 | Infra vs findings | No hard findings |
| AH8 | Missing | Out of scope |

## Complexity

10 folders is implementable if **80% deterministic**. Hidden dependency: shared lib path vs per-skill import.

## Verdict

v0 is **not implementation-ready** until contracts, skip-ladder, D-before-K, linked-H, and U-flow are locked. After those, GO.
