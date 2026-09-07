# Phase 6 — Root-Cause Review

v0 graph (`04_ROOT_CAUSE_GRAPH.md`) is directionally right and **under-enforced**.

## Where v0 treats symptoms as causes

| Symptom finding | True parent | v0 risk |
|-----------------|-------------|---------|
| K unanswerable price | D JS-lock or C robots | Parallel K/D both Critical |
| CIT no quotable price | D or K missing | Three Criticals |
| X claim not in viewport | D interaction-gated | Accordion double-count |
| H sameAs 404 | ENT identity graph | Two skills |
| I stale + H conflict | One knowledge-conflict | Two narratives |
| O “slow” | D JS-lock | If someone adds CWV |

## Over-split causes

Access policy vs outage already one skill (C) with two remediations — good.

M vs X vs Y already one skill — good.

H vs P already one — good.

G vs CIT: cause is “markup not aligned with visible fact.” Splitting folders would split one compare.

## Over-merged causes

W WRONG_PAGE merged into K unanswerable — **wrong cause** (IA vs missing content).

D41 cloaking merged into sanitizer — **wrong owner** (site vs our prompt).

## Improved causal graph

```
UNREACHABLE
  C: transport | robots-fail-closed | disallow-of-public-facts | orphan (with coverage)
       ↓ (if reached)
UNPARSED
  D: raw-missing-fact | interaction-insert | media-lock | D41-no-reveal-hide
       ↓ (if parsed)
UNQUOTABLE
  CIT: qualifier-split | table-th | negation | vague-on-factual-template | schema≠visible
       ↓ (if quotable somewhere)
INCOMPLETE / MISPLACED
  K: never-stated | stated-on-wrong-page (W) | flagship-weaker (AH)
       ↓
IDENTITY
  ENT: collision without disambiguators
       ↓
TEMPORAL
  I: date-signal lie | old-artifact vs current
       ↓
EXTERNAL
  H: linked-source material contradiction (not absence)
       ↓
ARRIVAL
  X: identity-below-fold | cited-span not user-visible | scent break
```

**Rule:** walk top-down; first failing gate is `root_cause`; later skills may attach `causal_role: amplifier` with `parent_id` or abstain.

Jointly-necessary (T): e.g. collision AND no category sentence AND no sameAs — severity = max, one cluster.

## Remediation must match node

Do not “add schema” for D. Do not “improve SEO” for K missing offering. Do not “listicle-ize” brand page for AH list-intent (AH-list).

## Downstream duplication rule

If parent severity ≥ High, child default omit from user-facing list unless it adds a **different owner/action** (e.g. D SSR **and** CIT qualifier rewrite on the rendered text that *does* exist).
