# Phase 25 — Hostile Architecture Review

| # | Problem | Sev | Why | Correction |
|---|---------|-----|-----|------------|
| 1 | 11 marketplace skills still heavy for 5 min | H | LLM K+CIT+V + render + H fetches | Budget: K subset; H last; render top-N |
| 2 | SK-H off-site is fragile | H | robots, rate, Wikipedia bias | Strict materiality; skip if time; never High on missing wiki |
| 3 | Collision “search” may need a search API | M | Z38 no paid APIs | Use on-site only + linked sameAs first; optional DuckDuckGo HTML GET if robots allow; else degrade to on-page disambiguation only with lower confidence |
| 4 | Dual-fetch without real browser | M | Under-detect SPA | Document RENDER_TIMEOUT; try lightweight JS runtime if present else raw-only honesty |
| 5 | Over-merge hide distinct issues | M | T risk | URL-alone never merges |
| 6 | Under-merge template spam | H | Rubric padding look | AF 2-sample rule mandatory |
| 7 | SK-CIT too broad | M | Padding appearance | One skill OK: one mechanism (extractable claim unit); keep checks as scripts not folders |
| 8 | Classifier errors cascade | H | Wrong suppressions | Conservative fallback: treat unknown as possibly YMYL for hedges; don’t suppress pricing without F-cluster confidence |
| 9 | Closed-book K still leaks parametric knowledge | H | False answerability | Require verbatim evidence span; reject uncited answers |
| 10 | STTF exact match FN | M | Paraphrase | Optional one LLM paraphrase check on central claims only |
| 11 | Unsupported “will be cited” language | H | Rubric | Risk/mechanism wording only |
| 12 | Shared lib outside skill folders | L | Portability | Duplicate thin wrappers per skill that import lib; README explains |
| 13 | Timeout numbers unvalidated | M | AE/Z hypothesis | TASK 019 empirical |
| 14 | Report too long | M | Non-expert | Cap findings; BLUF |
| 15 | Adobe example crawl-render merged | L | Judges expect example names | Names differ for SoC; README maps to example |

## Does it satisfy Adobe?
Yes if: one entrypoint, recommend-only, robots, schema floor, both halves of Round 2, generalization, no padding. Residual risk is **runtime** and **H/ENT external fetches**.

## Remediation soundness
Each KEEP skill maps fix to mechanism (SSR vs add sentence vs disambiguate vs dates vs landing visibility). Forbidden: “do GEO”, “add llms.txt”, “claim you’re the best”.
