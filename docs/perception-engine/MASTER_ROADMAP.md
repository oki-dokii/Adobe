# Master Roadmap — Perception Engine (54 → 95 feeling)

**Directory:** `docs/perception-engine/`  
**Platform:** existing Next.js `frontend/` + existing 10-skill DAG + `adaptBackendResult` + `AuditTree` + `parent_id` causes + `evaluation/results`.  
**Do not** add skills to `RUN_ORDER`. **Do not** redesign the tree layout.

---

## Current vs target

| | Score |
|---|---|
| Now | 54 |
| After this program | **88–95 feeling** if live interrogation + skip-skill + honesty all work on stage |
| If Perception ships but UI stays mocked | ≤70 |

100 remains a category-defining bar; this roadmap maximizes **judge memory**.

---

## Dependency graph

```
00 Honesty copy (landing) ─────────────────────────────────┐
00 Kill IS_DEMO / eval JSON playback (engine.ts, adapter) ─┤
                                                           ▼
                    04 Skill skip state (session)
                           │
                           ▼
         01 Perception Console + /api/perception
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
         05 Memory       06 Substitution  07 Gravity
           │               │               │
           └───────┬───────┴───────────────┘
                   ▼
              02 Sentence tracing
                   ▼
              03 Tree highlighting (props only)
                   ▼
              08 Export appendix
                   ▼
              09 Script → 10 Rehearse → 11 Record
```

**Hard deps:** 01 before 02; 02 before 03 span pulse; 04 before skip-demo; 05–07 can ship as functions inside 01’s first PR.  
**Soft:** 08 after bundle shape stable. 09–11 after UI freeze.

---

## Recommended implementation order (Cursor agents)

| Step | Files | Hours | Owner |
|---|---|---|---|
| 0 | `landing-view.tsx` honesty; `SAMPLE_URLS` lock; `export.ts` remove fake percentile if needed | 1 | FE |
| 0b | `engine.ts` playback via `adaptBackendResult` + eval JSON; `IS_DEMO` false on that path | 8 | FE |
| 1 | `lib/perception/*`, `app/api/perception/route.ts`, `perception-console.tsx`, `use-perception.ts`, left dock in `audit-experience.tsx` | 10 | FE |
| 1b | `memory.ts`, `substitution.ts`, `gravity.ts` + three small components inside console | 4 | FE |
| 2 | `perception-answer.tsx`, `normalizeSpans` | 3 | FE |
| 3 | `audit-experience` highlightSource; tree pulse token | 3 | FE |
| 4 | `skill-marketplace.tsx`, session `skippedSkillIds` | 5 | FE |
| 8 | `AppHeader` Export + appendix | 2 | FE |
| 9–11 | Script dry runs, OBS | 6 | PM |

**Total MVP:** ~42 focused hours (≈ 2 days continuous two people, or 3 days one).  
**Ideal add:** live Python route + engine skip events: +10–14h **after** MVP is demo-stable.

---

## Estimated effort

| Version | Hours | What’s in |
|---|---|---|
| **MVP** | 36–44 | 0, 0b, 01, 02, 03, 04 (perception filter only), 05–07, 08, 09–11 |
| **Ideal** | +12 | Live orchestrator API; skip affects playback timeline; packet one-shot on span |
| **Nice** | +8 | `llms.txt`/GPTBot row inside crawl display; print CSS; eval 3-brand strip |

---

## Risk assessment

| Risk | Sev | Mitigation |
|---|---|---|
| LLM hallucination | High | Default `groundExtractOnly`; spans `unsupported` |
| U12 misunderstanding | High | Kicker + script line 0:00 |
| Still mocked | High | Step 0b before perception |
| False Critical origin | High | Never Stripe until patched |
| Hook/setState bugs | Med | Tests: results mount, skip, span click |
| Left dock kills tree | Med | Collapse; perception tab mobile |
| Scope creep (new skills) | High | Forbidden in this folder |

---

## Demo priority ranking

1. Perception ASK offer → refuse/substitute  
2. Click sentence → tree  
3. Skip Render → ASK again  
4. Honesty sentence  
5. Memory empty Offer  
6. Export  
7. Substitution panel  
8. Gravity  
9. Causes `parent_id`  
10. Packets on first run  

---

## Judge impact ranking

1. Interrogation (01)  
2. Skill lever (04+01)  
3. Tracing (02+03)  
4. Real audit data (0b)  
5. Honesty (0)  
6. Substitution (06)  
7. Memory (05)  
8. Marketplace strip (04 UI)  
9. Export (08)  
10. Gravity (07)  

---

## MVP version (must ship)

- Console with 3 questions, extract-only fallback, auto-ask org  
- Spans clickable  
- Tree highlight from span  
- Skip set filters perception findings; strip visible in results  
- Memory + gravity + substitution functions  
- Export appendix  
- Script + one backup recording  

## Ideal version

- LLM path behind env flag  
- Playback skip removes skill events  
- Live orchestrator for one URL  
- Presentation collapse of Guide  

## Nice-to-have

- Bot policy table  
- Eval strip  
- Print CSS  
- Dependency auto-skip (crawl → render)  

---

## File index

| File | Module |
|---|---|
| [01_PERCEPTION_CONSOLE.md](./01_PERCEPTION_CONSOLE.md) | Centerpiece API + UI |
| [02_SENTENCE_TRACING.md](./02_SENTENCE_TRACING.md) | Answer chips |
| [03_TREE_HIGHLIGHTING.md](./03_TREE_HIGHLIGHTING.md) | X-ray |
| [04_SKILL_TOGGLE_MARKETPLACE.md](./04_SKILL_TOGGLE_MARKETPLACE.md) | Adobe composition |
| [05_BRAND_MEMORY.md](./05_BRAND_MEMORY.md) | Six cells |
| [06_SUBSTITUTION_COUNTERFACTUAL.md](./06_SUBSTITUTION_COUNTERFACTUAL.md) | Simulated cite-elsewhere |
| [07_RECOMMENDATION_GRAVITY.md](./07_RECOMMENDATION_GRAVITY.md) | Named / generic / displaced |
| [08_EXPORT_SYSTEM.md](./08_EXPORT_SYSTEM.md) | Markdown takeaway |
| [09_DEMO_SCRIPT.md](./09_DEMO_SCRIPT.md) | 5:00 |
| [10_REHEARSAL_PLAN.md](./10_REHEARSAL_PLAN.md) | Dry runs |
| [11_BACKUP_VIDEO_STRATEGY.md](./11_BACKUP_VIDEO_STRATEGY.md) | Failover |

---

## Implementation notes for a new engineer

1. Read `frontend/lib/audit/types.ts`, `skills.ts`, `adapter.ts`, `engine.ts`, `components/audit/audit-experience.tsx`, `audit-tree.tsx`.  
2. Do **not** add hooks after the `width === 0` return in `AuditTree`.  
3. Do **not** call parent `setState` inside `setState` updaters (`FindingsList` pattern).  
4. Round SVG path floats if you generate new `d` attributes (hydration).  
5. Start at step 0b + 01. If 01 works on mocked result, you still lose judges — **0b is not optional**.

**First Cursor prompt after reading this file:**  
`Implement docs/perception-engine/01_PERCEPTION_CONSOLE.md and 05–07 as pure functions, docked in AuditExperience, using focusedSite.result. Do not add new skills.`
