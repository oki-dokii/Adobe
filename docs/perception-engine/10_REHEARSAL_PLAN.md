# Rehearsal Plan

**Owners:** Driver + Talker  
**Venue sim:** 13" laptop → 27" monitor, then projector if available  
**Duration per full run:** 6 minutes including mistakes

---

# Purpose

Make the 5:00 script muscle memory and catch UI races (hydration, highlight, skip stale).

---

# Why It Exists

Execution quality is a judging axis. Crashes at 2:00 are a 54.

---

# User Experience

Rehearsal uses the **same UI as judges**. No extra debug panel.

---

# Inputs

- Script 09  
- Backup 11  
- Checklist below  
- Stopwatch

---

# Outputs

- `REHEARSAL_LOG.md` (create in this folder when you run) with date, origin, pass/fail  
- Go / No-go for live Python vs playback

---

# Internal Logic

## Schedule (3 days)

**Day 1 evening (2×):** Script through 2:20 only (perception + trace). Log errors.

**Day 2 afternoon (3×):** Full 5:00. One run with **skip Render**. One run with **network throttling** (Chrome slow 3G) to see timeout fallback.

**Day 2 night (1×):** Hostile questions (below).

**Day 3 morning (2×):** Full dress. Record backup (11).  
**Day 3 afternoon:** **Freeze code.** Only copy fixes.

## Checklist before each run

- [ ] `sessionStorage` cleared  
- [ ] Hard refresh  
- [ ] Console: no red errors on landing  
- [ ] Sample URL is demo host  
- [ ] Perception kicker visible  
- [ ] Export downloads  
- [ ] Skip Render → ASK offer changes status  
- [ ] Escape clears span  
- [ ] Reduced motion: macOS a11y on, one run (optional)

## Hostile questions (memorize 1-sentence answers)

| Question | Answer |
|---|---|
| Did you scrape ChatGPT? | No. Extract-grounded simulation. Kicker on screen. |
| Is the UI mocked? | The tree is driven by a real evaluation report / live orchestrator (pick the true one). |
| Why 10 skills? | Adobe marketplace units; orchestrator composes them. |
| Why not 100 skills? | Composition > inventory. Perception is the 11th composing skill. |
| Why is Stripe critical in your paper? | Heuristic overfire — we don’t demo that origin; eval is in the report. |
| Can I add a skill? | SKILL.md contract + RUN_ORDER; skip shows composition today. |

## Failure tree

```
Landing broken → backup video
Ingest hangs > 8s → backup from 0:40
Perception 500 → client fallback should still refuse; if blank, video from 1:20
Tree no highlight → continue verbally; don’t restart
```

---

# Integration Points

All modules. Log file notes which module failed.

---

# Backend Requirements

Decide playback vs live **before** Day 2 afternoon.

---

# Frontend Requirements

Driver uses **only** mouse + one URL. Talker never grabs the laptop.

---

# Success Metrics

Two consecutive full runs without console errors. Skip-skill effect visible both times.

---

# Demo Value

Rehearsal is what makes 09 true.

---

# Marketplace Alignment

Hostile Q on “add a skill” is the marketplace oral exam.

---

# Risks

Over-rehearsal into new features Day 3 — **freeze**.

---

# Future Extensions

Teleprompter; clicker.
