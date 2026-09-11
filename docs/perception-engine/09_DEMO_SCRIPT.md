# Demo Script

**Duration:** 5:00  
**Operator:** 1 (driver) + 1 (talker) if available  
**Environment:** `frontend` `npm run dev`, engine playback or live as implemented  
**Origin:** **Locked eval-clean host** (not Stripe/Shopify if they still emit false Criticals). Default script uses **linear.app** — replace with the host you verified the morning of.

**On-screen disclaimer (always visible in console):** `SIMULATED · NOT A LIVE MODEL SCRAPE`

---

# Purpose

A spoken, timed path that forces wow moments 1–8 and Adobe marketplace + honesty. This is a production runbook, not a pitch deck.

---

# Why It Exists

Unrehearsed trees score 78. Scripted interrogation scores 90+.

---

# User Experience (what judges see)

Follow the product UX in modules 01–08. Do not open Guide unless asked. Do not open browser DevTools.

---

# Inputs

- Cold laptop, 150% Chrome zoom if projector is weak  
- Bookmarked `http://localhost:3000`  
- Backup video queued (11)  
- Sample URL **already in** `SAMPLE_URLS[0]` = demo host  
- `skippedSkillIds` starts empty (sessionStorage cleared)

---

# Outputs

Judges remember the eight lines in “Talk track (must land).”

---

# Internal Logic (timeline)

| T | Action | Talk track (must land) | Module |
|---|---|---|---|
| 0:00 | Landing. Cursor in URL. | “This is a **read-only extractability audit**. We do **not** claim ChatGPT cited you.” | Landing copy |
| 0:20 | Submit demo host. Watch ingest → root. | “The URL becomes the root of a skill marketplace DAG.” | Tree |
| 0:40–1:20 | Let packets run. Point at Find / Understand / Trust / Engage. | “Four dimensions. Ten marketplace skills composed by the orchestrator.” | 04 strip appears |
| 1:20 | Results. Perception auto-answer on **org**. | “Now we ask what an assistant would say **from extractable evidence**.” | 01 |
| 1:40 | ASK **offer**. | Wait for refused/substituted. | 01 |
| 2:00 | Click unsupported/supported chip. Tree highlights. | “Click the sentence — the skill that caused it lights up. That’s the X-ray.” | 02, 03 |
| 2:20 | Point at empty **Offer** memory cell. Click it. | “Working memory: the model cannot retain an offer.” | 05 |
| 2:40 | If substitution panel: Show on tree. | “Simulated substitution from our causal chain — not a live SERP.” | 06 |
| 3:00 | Uncheck **Render & Extract**. ASK offer again. | “Marketplace: we removed a skill. The answer must change. That’s composition.” | 04, 01 |
| 3:20 | Point gravity DISPLACED/GENERIC. | “Recommendation gravity: will an assistant name you or a generic category?” | 07 |
| 3:40 | Causes tab, one click on the chain. | “parent_id causal merge from the orchestrator.” | Existing |
| 4:00 | Findings: one WHAT/WHY/EVIDENCE. | “Detectors stay honest. Perception sits on top.” | Existing |
| 4:20 | Export. | “You leave with the report.” | 08 |
| 4:35 | Footer: 38 sites, GET/HEAD, robots. | “Eval harness — we know Stripe heuristics can overfire; we don’t demo that origin.” | Research |
| 4:50 | Stop. “Questions.” | If asked “is this ChatGPT?” → point at kicker. | |

**If playback is used:** at 0:20 say “This run is a **recorded live evaluation** of {host} driving the same UI events as the orchestrator.” Never say “live crawl” unless Python is actually running.

**If crash:** see 11 — switch to video at 0:10, do not debug on stage.

---

# Integration Points

Uses every module. FindingsList must not setState-in-render (already patched).

---

# Backend Requirements

Whatever Day 1 wired (JSON playback or live). Script branches in the 0:20 line only.

---

# Frontend Requirements

Operator cheat-sheet printed: question order org → offer; which skill to skip (`render-extract-audit`).

---

# Success Metrics

Dry run 4:50–5:10 twice. Zero U12 claims. Skip-skill visibly changes answer.

---

# Demo Value

This file **is** the demo.

---

# Marketplace Alignment

Minute 3:00 is the marketplace proof.

---

# Risks

Talking over packets. **Silence 0:40–1:10 except dimension names.**  
Wrong origin. **Physical sticky note on the laptop.**

---

# Future Extensions

Second origin if time (don’t).
