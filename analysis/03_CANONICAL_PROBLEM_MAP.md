# Phase 3 — Canonical Problem Map

Categories A–AJ from the brief are **lenses**, not skills. What research says actually matters:

## Must-detect (high leverage, evidenced mechanisms)

| Code | Category | Matters? | Why | Primary home |
|------|----------|----------|-----|--------------|
| A | AI discovery/retrieval | YES | HO-008/009; A-001 | crawl + render + citation |
| G | Crawlability | YES | C entire | crawl-access-audit |
| H | Rendering | YES | D; A11 | render-extract-audit |
| I | Machine readability | YES | Landmarks, main vs chrome | render-extract |
| J | Content extraction | YES | A16/E | citation-extractability |
| F | Citation extractability | YES | B-F1 | citation-extractability |
| E | Citation (worthiness + accuracy) | YES | B-F1/F2 | citation-extractability |
| U | AI answerability | YES | K | ai-answerability-audit |
| V | Query-to-page alignment | YES | W | merged into answerability |
| L | Entity recognition | YES | F-01 WhoQA | entity-identity-audit |
| M | Entity resolution / ambiguity | YES | F-01 | entity |
| K | Structured data | CONDITIONAL | Validity/parity yes; coverage-as-citation-lever no | entity + low-sev G |
| P | Freshness | YES | I | freshness-audit |
| Q | Corroboration | YES | App D; H | corroboration-consistency |
| O | Cross-web consistency | YES | P | same skill |
| R | Authority/trust | PARTIAL | H mechanism; citation causality unproven (H-02) | corroboration + X-03 visual |
| S | Content quality / knowledge density | YES | J ≡ B-F1 | citation-extractability |
| T | Knowledge density | YES | same | citation |
| Z | On-site engagement | YES | M | engagement-handoff |
| AA | AI-to-human handoff | YES | X | engagement-handoff |
| AB | Context retention | PARTIAL | Y-01 untestable parts; Y-02 testable | engagement + report limits |
| AC | Accessibility | YES as extractability | N≡D landmarks | render-extract |
| W | IA | YES | nav/orphans/headings | crawl graph + engagement |
| X | Site/template architecture | YES as infra | AE/AF | shared crawl |
| Y | Crawling strategy | YES as infra | AE | orchestrator crawl |
| AE | Root-cause analysis | YES as infra | T | orchestrator |
| AF | Prioritization | YES as infra | S | orchestrator |
| AG | FP prevention | YES as infra | U | shared |
| AH | FN prevention | YES | dual-fetch, abstention QA, collision search | per skill |
| AI | Site-type adaptation | YES | V | site-type-classifier |
| AJ | Orchestration | YES | Z | audit-orchestrator |

## Lower / do-not-overfit

| Code | Category | Decision |
|------|----------|----------|
| B query interpretation | Weak on-site signal (A12); assistants’ rewrites unobservable | Low-severity synonym diversity only |
| C source selection internals | SIGIR citation≠rank is useful; vendor rank formulas unknown | Do not fake ranking APIs |
| N entity KG completeness | F-02 unevidenced as citation lever | Reinforcement only |
| AD performance CWV | O-01 redundant | CLS only as orientation proxy |
| D citation (vendor-specific who cites whom) | R/Q methodology | DEFER live probes |

## Problem map (outcomes judges care about)

```
INVISIBLE
  ├─ cannot connect (DNS/TLS/5xx)
  ├─ robots/meta disallow of public facts
  ├─ not in sitemap and orphaned
  ├─ canonicalized away / trapped in facets
  └─ empty raw HTML for fact-bearing pages

UNREADABLE
  ├─ facts only after JS / click / API
  ├─ facts only in image/PDF/canvas
  └─ main content not separable from chrome

UNQUOTABLE / MISQUOTABLE
  ├─ no self-contained factual sentence
  ├─ fact ≠ qualifier in same window
  ├─ table cells without headers
  ├─ negation-scope ambiguity
  └─ schema contradicts visible text

INCOMPLETE (answerability)
  ├─ never states offering / pricing / contact / audience
  ├─ comparison raw materials missing
  └─ flagship product page weaker than brand home

UNTRUSTED / MIXED-UP
  ├─ name collision without disambiguation
  ├─ identity facts disagree across site or web
  └─ stale syndicated facts vs current page

STALE
  ├─ date signals inconsistent / fake-updated
  └─ time-sensitive facts without credible dates

ARRIVAL FAILURE (engagement)
  ├─ first viewport no identity
  ├─ cited claim not visible (accordion/below fold/paraphrase)
  ├─ weak nav scent
  └─ no wayfinding on deep pages

META-FAILURES (ours)
  ├─ site-type misfire (SaaS price gate)
  ├─ finding spam (template × N pages)
  └─ overconfident LLM judgments
```

Research-supported **non-problems** (do not treat as defects by default): missing llms.txt; missing schema when prose is clear; short directory pages; evergreen undated docs; robots disallow of admin; PDF of a signed exhibit; hedged YMYL language; competitor-list absence on first-party sites.
