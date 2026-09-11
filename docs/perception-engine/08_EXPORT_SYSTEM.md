# Export System

**Module ID:** `export-system`  
**Paths:**  
- `frontend/lib/audit/export.ts` (extend `generateAuditMarkdown`)  
- `frontend/lib/perception/export-perception.ts`  
- `frontend/components/audit/app-header.tsx`  
- `frontend/components/audit/results-view.tsx` (existing `downloadMarkdownReport` if present)

---

# Purpose

One click downloads a Markdown file a judge can keep: audit diagnosis **plus** last perception bundle. Reuse existing markdown generator; do not add PDF native in MVP (print-to-PDF is enough).

---

# Why It Exists

Business takeaway. Research artifact. Proves methodology (`llm_calls`, robots, simulated perception).

---

# User Experience

**Header** (`AppHeader`): when `phase === 'results'`, button `Export` next to Help.

Click → download `{host}-ai-readiness.md`.

Toast not required; use `aria-live` `Report downloaded`.

Disabled if no `focusedSite.result`.

**Optional:** Results Diagnose footer duplicate button.

No new page.

---

# Inputs

```ts
downloadDiagnosticReport(site: Site, bundle: PerceptionBundle | null): void
```

`site` includes `result`, `host`, `url`, `skills`.  
`bundle` from `usePerception` last success.

---

# Outputs

File: `linear.app-ai-readiness.md` (host sanitized).

Must include sections in order:

1. Existing `generateAuditMarkdown(site)` body (do not delete eval corpus table if present).
2. `## Perception simulation`  
   - Disclaimer: simulated extract-grounded; **not** a live citation scrape.  
   - Question, status, confidence, answer  
   - Spans table: text, grounding, skill ids, finding ids  
   - Brand memory six cells  
   - Substitution (if any) + cause chain  
   - Gravity  
   - Skipped marketplace skills  

3. `## Skill marketplace`  
   - For each `RUN_ORDER` id: status from `site.skills`, skipped yes/no

---

# Internal Logic

```
click Export
  if !result: return
  md = generateAuditMarkdown(site) + perceptionAppendix(bundle, skippedSkillIds)
  blob = new Blob([md], { type: 'text/markdown;charset=utf-8' })
  <a download>
```

No `window.print` in MVP unless `?print=1`.

Edge: `bundle === null` → appendix `Perception not asked.`  
Failure: catch; `console.error`; `aria-live` error.

---

# Integration Points

All modules 01–07. Orchestrator listed as coordinator not skipped. Findings/causes already in part 1.

---

# Backend Requirements

None. Client-only download.

---

# Frontend Requirements

`AppHeader` needs `onExport?: () => void` and `exportEnabled: boolean`.  
Do not use glass; hairline button like `New audit`.

---

# Success Metrics

File opens in VS Code; contains disclaimer; contains host; contains at least one finding title from `result`.

---

# Demo Value

Minute 4:30 of the script — physical artifact.

---

# Marketplace Alignment

Exported skill table is the marketplace receipt.

---

# Risks

Percentile in current export is **derived from score**, not eval — if judges probe, say `illustrative from score, not the 38-site rank`. Optional: remove percentile line if not computed from corpus (honesty). **Recommended edit:** if you cannot join eval JSON, delete the fake percentile row in `generateAuditMarkdown`.

---

# Future Extensions

PDF via print CSS; attach findings JSON; email.

---

# Success Metrics (honesty)

No invented ChatGPT ranks in the file.
