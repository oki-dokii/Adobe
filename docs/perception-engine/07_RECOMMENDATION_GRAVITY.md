# Recommendation Gravity

**Module ID:** `recommendation-gravity`  
**Paths:**  
- `frontend/lib/perception/gravity.ts`  
- `frontend/components/audit/recommendation-gravity.tsx`

---

# Purpose

Answer: **If a user asks an assistant what to use, does this brand get named?** Output a single gravity class from engagement + answerability + offer memory — not a new recommendation engine.

---

# Why It Exists

Adobe/AI-assistant narrative: discovery → understanding → citation → **recommendation**. Maps to `engagement-handoff-audit` + `ai-answerability-audit`.

---

# User Experience

One row under substitution (or under memory if substitution hidden):

```
RECOMMENDATION GRAVITY    NAMED | GENERIC | DISPLACED
                          Assistants can hand off a next action.
```

Color: NAMED `success`, GENERIC `signal`, DISPLACED `warning`. Not crimson unless engagement is `critical` (then DISPLACED + `critical` text).

Click row → highlight `engagement-handoff-audit` and `ai-answerability-audit`.

Tooltip: 1 line from table below.

---

# Inputs

`SkillRun` for those two skills, Offer memory cell filled boolean, `skippedSkillIds`.

---

# Outputs

```ts
export type GravityClass = 'named' | 'generic' | 'displaced'

export interface GravityResult {
  class: GravityClass
  label: string
  detail: string
  skillIds: SkillId[]
}
```

```json
{
  "class": "displaced",
  "label": "DISPLACED",
  "detail": "No extractable offer and weak handoff — an assistant is more likely to name a clearer competitor.",
  "skillIds": ["engagement-handoff-audit", "ai-answerability-audit", "citation-extractability-audit"]
}
```

---

# Internal Logic

Let `eng` = engagement skill status (treat skipped as `critical` for gravity only).  
Let `ans` = answerability status (skipped → `warning`).  
Let `offerFilled` = memory offer cell.

```
if eng in (critical, skipped) OR (offerFilled === false AND ans in (warning, critical, skipped)):
  DISPLACED
else if eng in (warning, partial) OR ans in (warning, partial) OR offerFilled === false:
  GENERIC
else:
  NAMED
```

Copy:

- NAMED: `A machine-legible next action exists; the brand can be the handoff target.`
- GENERIC: `The assistant can speak in category terms but may not name a specific offer.`
- DISPLACED: `Extractable CTA/offer is weak — substitution risk on recommendation.`

Never name a real competitor brand unless it appears in **finding text** (then still don’t — keep generic “competitor”).

---

# Integration Points

Perception bundle field `gravity`.  
Tree highlight on click.  
Export: one line.  
Do not change `Recommendation` objects on findings.

---

# Backend Requirements

None.

---

# Frontend Requirements

`font-mono text-[10px]` label. `role="status"`.

---

# Success Metrics

Skip engagement → DISPLACED.  
Clean demo site with no engagement finding → NAMED or GENERIC, never crash.

---

# Demo Value

Wow #8: gravity reads DISPLACED after skip Engage.

---

# Marketplace Alignment

Two skills compose a higher-order **recommendation** outcome.

---

# Risks

Sounds like you measured ChatGPT recommendations — pair with simulated disclaimer near perception kicker (once globally is enough).

---

# Future Extensions

Calibrate against a labeled gold set of “would you name this brand?” (research).
