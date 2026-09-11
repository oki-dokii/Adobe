# Sentence Tracing

**Module ID:** `sentence-tracing`  
**Paths:**  
- `frontend/lib/perception/types.ts` (`PerceptionSpan`)  
- `frontend/lib/perception/spans.ts`  
- `frontend/components/audit/perception-answer.tsx`

**Depends on:** Perception Console output (`PerceptionResult.spans`).  
**Drives:** Tree Highlighting (03), FindingsList highlight, optional cause highlight.

---

# Purpose

Bind each sentence (or clause) of the perception answer to `findingIds`, `skillIds`, `evidenceIds`, and `causeIds` so a click is a precise pointer into the existing audit graph — not a fuzzy “related skills.”

---

# Why It Exists

Judges must see **receipts**. Marketplace skills become citable units. Demo wow: click the lie / click the refusal.

---

# User Experience

## What they see

The answer is not a `<p>`. It is a sequence of `<button>` chips (`PerceptionAnswer`).

- Default: `border-border`, `text-[13px]`, `leading-relaxed`, wrap as inline-block with 4px gap.
- `grounding === 'supported'`: 1px left accent `var(--success)`.
- `inferred`: accent `var(--signal)`.
- `unsupported`: accent `var(--warning)`.
- Selected: `border-signal`, `aria-pressed="true"`.
- Hover (120ms): opacity 1; siblings 0.7.

Tooltip (existing `SkillTooltip` pattern, 120ms delay):  
`[SUPPORT] citation-extractability-audit · 2 evidence`  
or `[UNSUPPORTED] no first-party span`.

## Step-by-step

1. `PerceptionResult` arrives with `spans` covering `answer` without overlap, sorted by `start`.
2. If spans do not cover full string, `normalizeSpans(answer, spans)` fills holes as `inferred` with `skillHint` of the question.
3. Click span → `onSelect(span)`.
4. Parent sets `activeSpanId`.
5. Module 03 highlights `span.skillIds` (and limb trunks).
6. `FindingsList` `highlightedIds={span.findingIds}`.
7. If `causeIds[0]`, do **not** auto-switch Results tab (keeps Perceive visible). Store `previewCauseId` for Causes tab if user opens it.
8. Second click on same span deselects (`activeSpanId = null`), restore previous `highlightedSkills` from findings/causes mode.
9. Keyboard: Left/Right between chips; Enter/Space toggles.

## Loading

Chips hidden; answer skeleton from module 01.

## Errors

If `start/end` invalid, show whole answer as one unsplit paragraph button (`id: 's-all'`).

## Motion

Selection only (border/opacity). No layout shift. `prefers-reduced-motion`: instant.

---

# Inputs

```ts
function PerceptionAnswer(props: {
  answer: string
  spans: PerceptionSpan[]
  activeSpanId: string | null
  onSelect: (span: PerceptionSpan | null) => void
  reduced: boolean
})
```

`normalizeSpans` input = `answer` + raw spans.

---

# Outputs

Events to parent (not a store):

```ts
type TraceEvent =
  | { type: 'span_select'; span: PerceptionSpan }
  | { type: 'span_clear' }
```

Normalized spans JSON:

```json
{
  "id": "s1",
  "text": "Key facts appear only after client render.",
  "start": 80,
  "end": 124,
  "findingIds": ["f-render"],
  "skillIds": ["render-extract-audit"],
  "evidenceIds": ["e1"],
  "causeIds": ["rc-client-rendering"],
  "grounding": "supported"
}
```

---

# Internal Logic

## `normalizeSpans(answer, spans)`

1. Clamp `start/end` to `[0, answer.length]`, skip empty.
2. Sort by start; if overlap, keep first, truncate second.
3. Fill gaps with inferred spans, `id = s-gap-{i}`, `skillIds` from `PERCEPTION_QUESTIONS[questionId].skillHint`.
4. `text = answer.slice(start, end)`.
5. Reject if `text` mismatch > 0 characters (rebuild from slices).

## Mapping findings → spans (server `groundExtractOnly`)

For each sentence (`answer.split(/(?<=\.)\s+/)`):

- Token overlap: if ≥2 significant tokens (len>3) appear in `finding.description + evidence.detail`, attach that finding.
- Else if sentence matches refuse lexicon (`cannot`, `empty shell`, `hydration`) attach render/citation findings if present.
- Else inferred.

## Decision tree

```
click span
  if span.id === activeSpanId → clear
  else → select
clear
  restore highlight from treeMode (diagnose=none, findings=finding skills, chain=cause skills)
```

## Edge cases

- `status === 'refused'` and `spans.length === 0`: one chip = full answer, `skillIds` = question hint, `grounding: unsupported`.
- Duplicate skillIds: `uniq`.
- `audit-orchestrator` never attached unless no other skill.

## Failure

Never throw in render. Fallback single chip.

---

# Integration Points

| System | Contract |
|---|---|
| Orchestrator | None |
| Skills | `skillIds` ⊆ `SkillId` |
| Findings | `findingIds` ⊆ `result.findings.id` |
| Tree | `setHighlightedSkills(span.skillIds)` via `AuditExperience` |
| Evidence | Inspector still uses finding.evidence; tooltip can show first evidence.detail |
| Causes | `causeIds` must be `result.rootCauses.id` |
| Export | Dump `activeSpan` + all spans |

`handleSelectFinding` must **not** fight span selection: if `activeSpanId` set, finding clicks update findings tab but span remains until cleared.

Implement: `highlightSource: 'span' | 'finding' | 'cause' | 'guide'`. Span wins.

---

# Backend Requirements

Span construction is in `/api/perception` (01). No extra endpoint.

---

# Frontend Requirements

- `PerceptionAnswer` only.
- Focus rings `focus-visible:ring-2 focus-visible:ring-signal`.
- `aria-label={`${grounding}: ${text}`}`.

---

# Success Metrics

- Clicking a supported span highlights ≥1 tree skill that matches `skillIds`.
- Gap-fill never leaves uncovered characters.
- Keyboard can select every chip.

---

# Demo Value

Wow #1 and #4: click the sentence that names the failure; the limb lights.

---

# Marketplace Alignment

Each chip is an **attribution to a skill unit**. Skipping that skill (04) should change which chips appear on re-ask.

---

# Risks

Over-linking every sentence to every finding → dim the whole tree (useless). **Cap `skillIds` at 3 per span.**  
User confusion: inferred vs supported — keep the 1px accent + tooltip.

---

# Future Extensions

Character offsets into original HTML; DOM highlight in a page preview (out of scope).
