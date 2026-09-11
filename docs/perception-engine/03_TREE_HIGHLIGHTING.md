# Tree Highlighting

**Module ID:** `tree-highlighting`  
**Paths (modify, do not fork):**  
- `frontend/components/audit/audit-experience.tsx`  
- `frontend/components/audit/audit-tree.tsx`  
- `frontend/components/audit/audit-canvas.tsx`  
- `frontend/components/audit/tree-branch.tsx`

**Existing behavior to extend:** `highlightedSkillIds`, `selectedSkillId`, `viewMode`, `causalPath` `useMemo` (must stay **above** any `width===0` return — hooks rule).

---

# Purpose

When perception (or findings/causes) names skills, the radial tree shows **related limbs and twigs** and dims the rest. This is the X-ray for the Perception Console.

---

# Why It Exists

Without this, interrogation is a chatbot next to a pretty graph. With it, Adobe sees composition: root → dimension → skill.

---

# User Experience

## Visual rules (results + auditing)

| State | Trunk | Twig | Node |
|---|---|---|---|
| No highlight | structural zinc, full opacity | status color | rings |
| Highlighted skill | limb trunk emphasized (`emphasized`) | `emphasized`, opacity 1 | selected ring if also selected |
| Unrelated while highlight set nonempty | opacity 0.18 | opacity 0.12 | opacity 0.35 (`dimmed`) |
| Span highlight | same as highlight set = `span.skillIds` | plus optional pulse **once** (not infinite) | |

Do **not** draw the inspector horizontal tether line (removed earlier; do not bring back).

Causal path SVG (`causalPath`): show when `highlightSet.size >= 1` **and** (`viewMode === 'chain'` OR `highlightSource === 'span'`). Stroke `var(--signal)`, width 1.25, opacity 0.55, no dash chase except while `phase === 'auditing'`.

Camera: keep existing mild pan (`camScale` max 1.06). Span select uses same `cameraTargetId` = first skill in set.

## Step-by-step

1. `AuditExperience` computes `treeHighlightSkillIds`:
   - if `activeSpan`: `activeSpan.skillIds`
   - else `highlightedSkills` (findings/causes/guide)
2. Pass to `AuditCanvas` as `highlightedSkillIds`.
3. Pass `highlightPulseToken={activeSpan?.id ?? ''}` so tree can fire a one-shot opacity pulse on those twigs.
4. Clear span → revert to previous highlight rules for `treeMode`.

## Loading

No change. Tree already mounted.

## Errors

If skill id not in layout (should not happen), skip node; do not crash.

## Motion

Pulse: 400ms opacity 0.4→1 on emphasized twigs only if `!prefers-reduced-motion`.  
Camera: existing 850ms cubic.

---

# Inputs

```ts
// AuditCanvas / AuditTree existing props plus:
highlightPulseToken?: string
```

`highlightedSkillIds: SkillId[]` — already exists.

---

# Outputs

None. Pure view of props. Side effect: camera transform.

---

# Internal Logic

`audit-tree.tsx` already builds `highlightSet`. **Do not** auto-add all finding skills when `viewMode === 'findings'` if `highlightedSkillIds.length > 0` (current code adds all findings when set is empty — keep that). When span provides ids, parent passes nonempty array → no auto-fill.

**Decision:**

```
if highlightedSkillIds.length > 0:
  highlightSet = those ids
else if phase==results && viewMode==findings:
  all defect skill ids
else if viewMode==chain:
  all cause-related skill ids
```

Span path is just nonempty `highlightedSkillIds`.

**Hooks:** `causalPath` `useMemo` must remain before `if (width===0) return null`.

**Edge:** `selectedSkillId` still dim-others via `hasHighlight`. Span + selected skill: both in emphasize set (union).

**Failure:** invalid id ignored.

---

# Integration Points

| System | |
|---|---|
| Orchestrator | Root node emphasize if span empty but status refused? **No.** Only listed skills. |
| Skills | `LIMBS` membership defines trunk emphasize (existing `related.some`) |
| Findings | Finding click still `handleSelectFinding` |
| Perception | Span click sets highlight |
| Export | Not required |
| Marketplace skip | Skipped skills render `status: 'skipped'` (04); highlight still allowed if span references them from stale answer — if stale, dim whole tree 0.5 and show banner; do not highlight skipped as active |

---

# Backend Requirements

None.

---

# Frontend Requirements

- Keep SVG + HTML overlay architecture.
- Dim `pointer-events` still on for all interactive skills (don’t disable skipped except 04).
- a11y: tree nodes already have `aria-label`; when highlighted, `aria-current="true"` on those buttons.

---

# Success Metrics

- Span with `render-extract-audit` emphasizes Find limb + that twig only (plus shared trunk).
- Diagnose mode with no span: no dimming.
- No extra hooks after early return.

---

# Demo Value

The “X-ray” after interrogation.

---

# Marketplace Alignment

Highlighted nodes **are** marketplace skills. The trunk is the dimension package.

---

# Risks

Camera motion + left dock = cramped. Keep pan factor 0.16 (current).  
Highlighting 9 skills = no hierarchy. **Spans cap 3 skills** (02).

---

# Future Extensions

Animate packet along `branch.flowPath` for the active span only (reuse `DataPulse`, one-shot, not infinite).
