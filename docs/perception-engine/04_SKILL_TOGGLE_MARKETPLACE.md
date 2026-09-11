# Skill Toggle Marketplace

**Module ID:** `skill-toggle-marketplace`  
**Paths:**  
- `frontend/hooks/use-audit-session.ts`  
- `frontend/lib/audit/engine.ts` (`runSiteAudit` skip)  
- `frontend/components/audit/skill-marketplace.tsx`  
- `frontend/components/audit/audit-experience.tsx`  
- `frontend/components/audit/running-view.tsx`

**Canonical skill list:** `RUN_ORDER` in `frontend/lib/audit/skills.ts` (9 branch skills). Orchestrator is **not** togglable.

---

# Purpose

Let a judge **skip marketplace skills** before (and conceptually after) a run so the orchestrator composes a subset. Perception re-ask uses the same skip set. This is the Adobe “skills are units” demo — not a storefront.

---

# Why It Exists

Without skip, “10 production skills” is a static architecture diagram. With skip, composition is visible: uncheck Render → offer question refuses.

---

# User Experience

## Placement

**Landing:** do not show 9 toggles (clutter). Show one line under URL: `9 marketplace skills armed` linking to Guide.

**Auditing + Results:** horizontal strip **top of canvas**, below `AppHeader`, `top-14`, `z-[3]`, `pointer-events-auto`.

```
MARKETPLACE    Crawl  Render  Classify  Entity  Citation  Answer  Fresh  Corrob.  Engage
               [on]   [on]    [on]      [on]    [on]      [on]    [off]  [on]     [on]
```

Use `SKILL_MAP[id].short`. `off` = skipped.

**During `phase === 'auditing'`:** toggles **disabled** (`aria-disabled`). Tooltip: `Skills lock during a run`.

**Results:** toggles enabled. Changing a toggle:

1. Updates `skippedSkillIds`.
2. Does **not** automatically re-crawl.
3. Marks perception `stale`.
4. Banner on console: `Marketplace inputs changed. ASK again.`
5. Optional small text: `Tree still shows last full audit. Perception uses skipped evidence filter.`

**Honesty:** v1 skip in results **filters evidence for perception only** unless you also implement replay. **MVP:** filter perception context + show skipped nodes as `skipped` overlay **without** rewriting findings (findings stay; perception ignores those skills’ findings).

**Ideal (same spec, flag `PERCEPTION_RERUN_AUDIT=false` default):** full `begin()` rerun with skip — **do not** do this in MVP (too slow/risky). Documented in Future.

## Interactions

- Click short name to toggle skip (button `aria-pressed={!skipped}`).
- Cannot skip all 9: if last on would turn off, `aria-invalid` and toast text `At least one skill must remain`.
- Orchestrator node never appears in the strip.

## Motion

120ms opacity on off state (0.4). No layout animation.

## Loading

Strip hidden until `phase` is `auditing` | `results`.

## Errors

Unknown skill id in URL hash: ignore.

---

# Inputs

Session:

```ts
skippedSkillIds: SkillId[]  // subset of RUN_ORDER
setSkippedSkillId: (id: SkillId, skipped: boolean) => void
```

Persist in `sessionStorage` key `bair.skippedSkills` JSON array (optional).

---

# Outputs

- `skippedSkillIds` passed to `POST /api/perception`
- `SkillRun.status === 'skipped'` for skipped ids **in results overlay** (derived): map `focusedSite.skills` for display:

```ts
displaySkills = site.skills.map(s =>
  skippedSkillIds.includes(s.id) ? { ...s, status: 'skipped' as const } : s
)
```

Do not mutate stored run unless you rerun the engine.

---

# Internal Logic

```
toggle(id):
  if phase === 'auditing': return
  if !RUN_ORDER.includes(id): return
  if skipping && remainingOn === 1: return
  setSkippedSkillIds
  setPerceptionStale
```

**Engine MVP:** `runSiteAudit` unchanged (still runs all skills in mock/playback). Skip is a **perception and display** lens.

**Engine ideal:** `buildTimeline` skips events for skipped ids; those skills `SKILL_COMPLETED` with `status: 'skipped'`.

## Edge

- Guide `guideFocus === 'skills'` still highlights all branch skills.
- Multi-site: skip set is session-global (simpler for demo).

## Failure

Never skip `crawl-access-audit` **and** `render-extract-audit` together without warning copy: `Discoverability will be empty.` Allow it (dramatic demo) but show the copy.

---

# Integration Points

| System | |
|---|---|
| Orchestrator | Story: orchestrator composes remaining skills. No code change MVP. |
| Skills | `RUN_ORDER` + `SKILL_MAP.short` |
| Findings | Unfiltered in Diagnose/Findings tabs (truth of last audit). Perception filters. **Label this in UI.** |
| Tree | Display status skipped (grey node, no pulse) |
| Perception | Context builder drops findings for skipped skills |
| Export | List skipped skills in markdown |

---

# Backend Requirements

None for MVP. Ideal: orchestrator CLI `--skip=freshness-audit`.

---

# Frontend Requirements

- `SkillMarketplace` component.
- Colors: on = `text-foreground`; off = `text-muted-foreground`; never rainbow per skill.
- a11y: `group` `role="group"` `aria-label="Marketplace skills"`.

---

# Success Metrics

- Uncheck Render, ASK offer question → `status` refused or substituted.
- Cannot disable all skills.
- Toggles disabled while running.

---

# Demo Value

Wow #2: skip a skill, the AI’s answer changes.

---

# Marketplace Alignment

This **is** the marketplace demo: discover (strip), configure (toggle), compose (perception), observe (tree status).

---

# Risks

Judges think findings disappeared — **copy: last audit frozen; perception uses filtered evidence.**  
Implementing full rerun in 3 days — **don’t** unless playback is instant.

---

# Future Extensions

True `--skip` in Python orchestrator; skill install from a second JSON pack; dependency disable (skip crawl → auto-skip render) matching orchestrator procedure steps 3–9 in `skills/audit-orchestrator/SKILL.md`.
