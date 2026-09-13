# Perception Console

**Module ID:** `perception-console`  
**Repo paths (create):**  
- `frontend/lib/perception/types.ts`  
- `frontend/lib/perception/questions.ts`  
- `frontend/lib/perception/build-context.ts`  
- `frontend/lib/perception/ground.ts`  
- `frontend/app/api/perception/route.ts`  
- `frontend/components/audit/perception-console.tsx`  
- `frontend/hooks/use-perception.ts`

**Does not replace:** `AuditExperience`, `AuditTree`, `ResultsView`, orchestrator, or the 11 marketplace skills.

---

# Purpose

Turn a completed `AuditResult` into **what an assistant would say** about the brand, using only facts the 10-skill DAG made extractable. The console is the judge-facing “mind.” The tree remains the evidence microscope.

It must never claim a live ChatGPT/Perplexity/Gemini citation (product rule U12). Answers are **grounded generation over audit evidence**, or an explicit **refusal**, or a labeled **substitution counterfactual**.

---

# Why It Exists

| Lens | Effect |
|---|---|
| Judge perception | They watch an AI answer, not a linter score. |
| User value | Brand questions map to site extractability. |
| Marketplace | Skills become inputs to one composing skill (`ai-perception-engine` as a visor, not a 11th crawler). |
| AI-native | Output is answers, memory, traces — not only findings. |
| Demo | Interrogation is wow-moment #1. |

---

# User Experience

## Where it lives

Visible only when `phase === 'results'` and `focusedSite.result` is defined.

**Layout (lg+):**  
- Center: existing `AuditCanvas` (tree).  
- Right: existing `ResultsView` (`lg:w-[22.5rem]`).  
- **Left dock:** Perception Console, `lg:w-[22rem]`, `lg:inset-y-20 lg:left-5`, hairline `border-border`, `bg-background`.  
- Tree wrapper: add `lg:left-[23rem]` in addition to existing `lg:right-[23.5rem]` when perception is open.

**Default:** open in results. Collapse control in console header (`aria-expanded`). Collapsed = 40px rail labeled `PERCEPTION`.

**Mobile:** Perception is a tab in `ResultsView` named `Perceive` (alongside Diagnose / Causes / Findings). Do not add a third floating sheet.

## Exact chrome

```
PERCEPTION                    [SIMULATED · NOT A LIVE MODEL SCRAPE]
Ask what an assistant would say from extractable evidence.

( ) What is this organization?
( ) What do they offer?
(•) What should I do next?

[ ASK ]

status: grounded | refused | substituted
confidence: high | medium | low

Answer
  [chip] sentence one
  [chip] sentence two

Traces (module 02)
Memory (module 05) — compact 6-cell
Substitution (module 06) — only if status=substituted
Gravity (module 07) — one line
```

Landing must already show (separate copy change in `landing-view.tsx`):

> Read-only extractability audit. We do not claim ChatGPT cited you.

## Interactions

1. User finishes audit (`AUDIT_COMPLETED` / `AUDIT_PARTIAL` → `phase === 'results'`).
2. Console mounts. Default selected question = `org`.
3. Auto-run **once** on first results for default question (so the demo is live without an extra click). Subsequent questions require **ASK**.
4. Click a question radio → updates `selectedQuestionId` only (does not fetch).
5. **ASK** → `POST /api/perception` with current `AuditResult` snapshot + `skippedSkillIds`.
6. Click an answer chip → fires `onTraceSelect(span)` (module 02) → tree highlight (module 03).
7. If skill marketplace skip set changes (module 04), show banner `Evidence set changed — re-ask` and disable stale answer (`stale: true`) until ASK.
8. Escape: existing `AuditExperience` handler; also clear `activeSpanId` in perception state. Do **not** unmount console.

## Transitions / motion

- Dock: `transition-[left] duration-300 ease-[cubic-bezier(0.2,0,0,1)]`.
- Answer body: `opacity` 240ms. No word-by-word reveal.
- Chips: no bounce. Selected chip: `border-signal` 1px.
- `prefers-reduced-motion`: opacity only, duration 0.

## Loading

- Button label `ASKING…`, `aria-busy="true"`.
- Skeleton two lines in answer well (zinc hairline blocks, not pulse-rainbow).
- Tree unchanged during load.

## Errors

| Condition | UI |
|---|---|
| No `result` | Console hidden |
| API 4xx/5xx | `Could not simulate perception. Evidence is still on the tree.` + retry |
| Timeout (8s) | Same + `Used extract-only fallback` if client fallback succeeded |
| Empty findings | Still allow refusal answers |

---

# Inputs

## Runtime (from session)

| Field | Source |
|---|---|
| `site: Site` | `focusedSite` |
| `skippedSkillIds: SkillId[]` | new session field, default `[]` |
| `questionId` | `'org' \| 'offer' \| 'next'` |

## Question catalog

File: `frontend/lib/perception/questions.ts`

```ts
export const PERCEPTION_QUESTIONS = [
  {
    id: 'org',
    prompt: 'What is this organization?',
    skillHint: ['entity-identity-audit', 'site-type-classifier'] as const,
  },
  {
    id: 'offer',
    prompt: 'What do they offer?',
    skillHint: ['citation-extractability-audit', 'ai-answerability-audit', 'render-extract-audit'] as const,
  },
  {
    id: 'next',
    prompt: 'What should I do next?',
    skillHint: ['engagement-handoff-audit'] as const,
  },
] as const
```

## POST `/api/perception` body

```json
{
  "host": "linear.app",
  "url": "https://linear.app",
  "questionId": "offer",
  "skippedSkillIds": ["freshness-audit"],
  "result": { },
  "skills": [
    {
      "id": "render-extract-audit",
      "status": "warning",
      "progress": 1,
      "pagesInspected": 18,
      "findingEmitted": true
    }
  ]
}
```

`result` **must** be the UI `AuditResult` already in memory (from `adaptBackendResult` or mock). Do not re-fetch the engine in v1.

## Evidence pack (built client or server)

`buildPerceptionContext(result, skills, skippedSkillIds)` in `build-context.ts`:

- Drop findings whose `skillId` is in `skippedSkillIds`.
- Drop findings with `isLimitation === true` from **answer grounding** (still pass them as `limitations[]` for honesty).
- Collect `evidence[].detail`, `evidence[].url`, `finding.title`, `finding.description`, `skillId`, `severity`.
- Include `rootCauses[]` labels for substitution copy.
- Max 12 findings, max 8000 characters total pack (truncate longest `description` first).

```json
{
  "host": "linear.app",
  "questionId": "offer",
  "skippedSkillIds": [],
  "findings": [
    {
      "id": "f-render",
      "skillId": "render-extract-audit",
      "title": "Pricing injected after hydration",
      "severity": "high",
      "description": "…",
      "evidence": [
        { "id": "e1", "label": "Home", "detail": "price node empty in first HTML", "url": "https://linear.app/" }
      ]
    }
  ],
  "causes": [
    { "id": "rc-client-rendering", "label": "Client-rendered key content", "parentId": null }
  ],
  "limitations": [],
  "dimensionScores": [
    { "dimension": "discoverability", "score": 62, "label": "at-risk" }
  ]
}
```

---

# Outputs

## `PerceptionResult`

File: `frontend/lib/perception/types.ts`

```ts
import type { Confidence, SkillId } from '@/lib/audit/types'

export type PerceptionStatus = 'grounded' | 'refused' | 'substituted'
export type PerceptionQuestionId = 'org' | 'offer' | 'next'

export interface PerceptionSpan {
  id: string
  text: string
  start: number
  end: number
  findingIds: string[]
  skillIds: SkillId[]
  evidenceIds: string[]
  causeIds: string[]
  grounding: 'supported' | 'unsupported' | 'inferred'
}

export interface PerceptionResult {
  questionId: PerceptionQuestionId
  status: PerceptionStatus
  confidence: Confidence
  answer: string
  spans: PerceptionSpan[]
  disclaimer: 'simulated_extract_grounded'
  stale: boolean
  usedFallback: boolean
  skippedSkillIds: SkillId[]
}
```

## Example (grounded)

```json
{
  "questionId": "org",
  "status": "grounded",
  "confidence": "medium",
  "answer": "Linear is a software organization. The site identifies the product as issue tracking for product teams.",
  "spans": [
    {
      "id": "s0",
      "text": "Linear is a software organization.",
      "start": 0,
      "end": 34,
      "findingIds": [],
      "skillIds": ["entity-identity-audit"],
      "evidenceIds": [],
      "causeIds": [],
      "grounding": "inferred"
    }
  ],
  "disclaimer": "simulated_extract_grounded",
  "stale": false,
  "usedFallback": false,
  "skippedSkillIds": []
}
```

## Example (refused)

```json
{
  "questionId": "offer",
  "status": "refused",
  "confidence": "low",
  "answer": "I cannot state pricing or a concrete offer from extractable first-party HTML. Key facts appear only after client render.",
  "spans": [],
  "disclaimer": "simulated_extract_grounded",
  "stale": false,
  "usedFallback": true,
  "skippedSkillIds": []
}
```

If `status === 'substituted'`, module 06 payload is attached (see `06_SUBSTITUTION_COUNTERFACTUAL.md`). Gravity attaches always (module 07). Memory always (module 05). Console is the **orchestrator of those three**; they are computed in the same API response as optional fields:

```ts
export interface PerceptionBundle {
  perception: PerceptionResult
  memory: BrandMemory
  substitution: SubstitutionResult | null
  gravity: GravityResult
}
```

---

# Internal Logic

## Execution flow

```
ASK
  → if phase !== results: no-op
  → buildPerceptionContext(result, skills, skipped)
  → POST /api/perception (timeout 8000ms)
  → on success: set bundle, stale=false
  → on fail: run groundExtractOnly(context) on client (no LLM)
  → usedFallback=true
```

## Server decision tree (`ground.ts` + route)

```
if questionId === 'org':
  if entity-identity-audit status in (critical, warning) OR findings on that skill:
    prefer grounded-with-hedge OR inferred spans
  else:
    grounded from entity evidence + host name

if questionId === 'offer':
  if render-extract-audit or citation-extractability-audit has severity high|critical
     AND skipped does not already exclude them:
    status = refused OR substituted (if corroboration/answerability mentions third party)
  else:
    grounded offer sentence from citation evidence

if questionId === 'next':
  if engagement-handoff-audit warning|critical:
    status = refused ("I cannot identify a machine-legible next action")
  else:
    grounded CTA from engagement evidence
```

**Substitution vs refuse:** if any `rootCauses` id contains `substitut` OR finding titles/descriptions match `/competitor|third-party|aggregat/i` → `substituted`. Else `refused`.

## LLM (optional)

Env: `PERCEPTION_LLM_URL` or `OPENAI_API_KEY`. If unset, **always** `groundExtractOnly`.

If set: prompt must include:

- Pack JSON
- “Answer only from pack. If missing, refuse. Never claim a live AI product cited this brand.”
- Return JSON matching `PerceptionResult` (no markdown)

Temperature 0. Deterministic fallback if parse fails.

## State transitions

```
idle → loading → ready
ready + skippedSkillIds change → stale
stale + ASK → loading → ready
ready + question change (no ASK) → idle_question (answer still visible, dimmed 50%)
```

## Edge cases

- `AUDIT_PARTIAL`: still run; prepend “Partial audit.” to answer if `site.phase === 'partial'`.
- Orchestrator skill: never skip; not in `RUN_ORDER` skips.
- Multiple findings per skill: attach all ids to span, cap 4.
- Empty `spans`: whole answer is one inferred span with `skillHint` of the question.

## Failure modes

- Do not invent prices, names, or CTAs not in the pack.
- Do not use `Date.now()` in the answer text.
- Do not hydrate-mismatch: console is client-only (`'use client'`), fetch after mount.

---

# Integration Points

| System | How |
|---|---|
| Orchestrator | Perception runs **after** `AUDIT_COMPLETED`. No new skill in `RUN_ORDER`. |
| 11 skills | Context filter by `skippedSkillIds`; span `skillIds` ⊆ `SkillId`. |
| Findings | `findingIds` on spans; clicking span selects those findings in list (optional: `highlightedIds`). |
| Tree | Module 03 consumes `skillIds` from active span. |
| Evidence | `evidenceIds` must exist on the finding. |
| Causes | `causeIds` from `finding.rootCauseId`. |
| Export | Module 08 serializes last `PerceptionBundle`. |
| Session | `useAuditSession` + `usePerception(focusedSite, skippedSkillIds)`. |

`AuditExperience` new state:

- `skippedSkillIds: SkillId[]`
- `activeSpan: PerceptionSpan | null`  
- pass `highlightedSkillIds={activeSpan?.skillIds ?? highlightedSkills}` with span taking precedence when set.

---

# Backend Requirements

**v1 API:** Next.js App Router `POST /api/perception` only. Do not call Python orchestrator.

**Caching:** memory Map key = `hash(host + questionId + skipped.sort() + finding ids joined)`. TTL 10 minutes. Demo: cache hit is good.

**Perf:** p95 < 8s with LLM; fallback < 50ms.

**Auth:** none. Rate-limit 30/min per IP optional.

---

# Frontend Requirements

- `PerceptionConsole` presentational; `usePerception` owns fetch.
- No new page. Still `app/page.tsx` → `AuditExperience`.
- Do not call `setState` of parent inside child `setState` updaters (see `FindingsList` fix).
- a11y: radios named `perception-question`; live region `aria-live="polite"` for answer; chips are `button`.
- Contrast: chips use `text-foreground` on `bg-surface`.

---

# Success Metrics

- Auto-ask on results produces an answer in < 8s.
- Changing skip set marks stale.
- Refusal path triggers when demo origin has render finding.
- Zero U12 language in UI (`ChatGPT cited`, `Perplexity ranks`).
- No React setState-during-render / hook-order errors.

---

# Demo Value

Judge asks a brand question; the system answers as a constrained assistant; clicking a sentence X-rays the tree. This is the 95-point centerpiece.

---

# Marketplace Alignment

Perception is a **composing skill**: it does not crawl. It consumes marketplace skill outputs. Skipping a skill is skipping an input to composition (module 04).

---

# Risks

| Risk | Mitigation |
|---|---|
| LLM hallucinates a price | Fallback rules + “unsupported” spans |
| Judges think it scraped ChatGPT | Persistent `SIMULATED` kicker |
| Left dock crowds the tree | Collapse rail; perception tab on small screens |
| False refusal | If no high/critical on hint skills, force grounded-inferred |

---

# Future Extensions

SSE token stream; per-model cards; question pack from `ai-answerability-audit` checks; live orchestrator extracts as pack instead of findings-only.
