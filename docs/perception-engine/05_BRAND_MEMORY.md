# Brand Memory

**Module ID:** `brand-memory`  
**Paths:**  
- `frontend/lib/perception/memory.ts`  
- `frontend/components/audit/brand-memory.tsx`

**Computed inside** `POST /api/perception` (same bundle) **or** client `buildBrandMemory(result, skills, skippedSkillIds)` — prefer **pure client function** so it works with fallback.

---

# Purpose

Show the six cells an assistant can **keep in working memory** from extractable evidence: Identity, Category, Offer, Proof, Action, Recency. Empty cells are the demo.

---

# Why It Exists

Ten-second wow. Maps entity / classifier / citation / corroboration / engagement / freshness without new crawlers.

---

# User Experience

## Visual

Inside Perception Console, below the answer, heading `WORKING MEMORY`.

2×3 grid, equal cells, hairline borders:

| Identity | Category |
| Offer | Proof |
| Action | Recency |

Each cell:

- Label: `font-mono text-[10px] tracking-wider text-muted-foreground`
- Value: `text-[12px]` or `—` if empty
- State fill: empty cell `opacity-50`; filled `text-foreground`
- Status pip: 6px square, `success` if filled, `warning` if filled-from-inferred, `muted` if empty

## Interactions

- Click cell → select a synthetic span: `skillIds` from table below, `findingIds` from first matching finding. Reuses module 02/03.
- No edit. Read-only.

## Loading

Six cells with `—` until first perception bundle.

## Errors

If builder throws, show six `—` and `Memory unavailable`.

---

# Inputs

`AuditResult`, `SkillRun[]`, `skippedSkillIds`.

---

# Outputs

```ts
export type MemoryCellId = 'identity' | 'category' | 'offer' | 'proof' | 'action' | 'recency'

export interface MemoryCell {
  id: MemoryCellId
  filled: boolean
  value: string | null
  skillIds: SkillId[]
  findingIds: string[]
  source: 'evidence' | 'inferred' | 'empty'
}

export interface BrandMemory {
  cells: MemoryCell[] // length 6, fixed order
}
```

Example:

```json
{
  "cells": [
    { "id": "identity", "filled": true, "value": "linear.app", "skillIds": ["entity-identity-audit"], "findingIds": [], "source": "inferred" },
    { "id": "category", "filled": true, "value": "SaaS / product collaboration", "skillIds": ["site-type-classifier"], "findingIds": [], "source": "inferred" },
    { "id": "offer", "filled": false, "value": null, "skillIds": ["citation-extractability-audit", "render-extract-audit"], "findingIds": ["f-render"], "source": "empty" },
    { "id": "proof", "filled": false, "value": null, "skillIds": ["corroboration-consistency-audit"], "findingIds": [], "source": "empty" },
    { "id": "action", "filled": true, "value": "Start via primary CTA (extractable)", "skillIds": ["engagement-handoff-audit"], "findingIds": [], "source": "evidence" },
    { "id": "recency", "filled": false, "value": null, "skillIds": ["freshness-audit"], "findingIds": [], "source": "empty" }
  ]
}
```

---

# Internal Logic

`buildBrandMemory`:

| Cell | Fill if | Value |
|---|---|---|
| identity | skill not skipped; no **critical** on entity | `site.host` (always available) + optional first entity evidence detail truncated 80 chars |
| category | classifier not skipped and status not `critical` | `site-type-classifier` check or `"Unclassified"` if skipped |
| offer | **no** high/critical findings on `render-extract-audit` **and** `citation-extractability-audit` among non-skipped | else empty (demo: empty when render finding exists) |
| proof | no high/critical on corroboration | else empty |
| action | no high/critical on engagement | else empty; if pass, `"Machine-legible handoff present"` |
| recency | no high/critical on freshness | else empty |

Skipped skill → that cell `source: 'empty'`, `value: null`, still lists the skill in `skillIds` for click-through.

**Do not** invent product names.

---

# Integration Points

Tree: cell click → highlight `skillIds`.  
Findings: `findingIds`.  
Export: table of six cells.  
Perception status does not override memory (memory is structural).

---

# Backend Requirements

None if client-pure.

---

# Frontend Requirements

`BrandMemoryGrid`. Click handlers call same `onTraceSelect` as chips.  
a11y: each cell `button` with `aria-label={`${id} ${filled ? value : 'empty'}`}`.

---

# Success Metrics

Demo origin with render finding → Offer cell empty.  
Click Offer → Find limb / render twig highlights.

---

# Demo Value

Wow #4: empty Offer cell.

---

# Marketplace Alignment

Each cell is owned by one or two marketplace skills.

---

# Risks

Host as identity looks cheap — acceptable; don’t scrape a brand name.  
All-full memory on a clean site is OK (then demo skip freshness to empty Recency).

---

# Future Extensions

Token-budget visualization; multi-page memory merge from crawl graph.
