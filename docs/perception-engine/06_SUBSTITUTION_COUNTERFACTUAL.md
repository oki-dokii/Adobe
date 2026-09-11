# Substitution Counterfactual

**Module ID:** `substitution-counterfactual`  
**Paths:**  
- `frontend/lib/perception/substitution.ts`  
- `frontend/components/audit/substitution-panel.tsx`

**Product constraint:** **Must not** claim a live scrape of ChatGPT, Perplexity, Gemini, or Google AI Overviews (U12). Label every line `SIMULATED FROM FIRST-PARTY GAPS`.

---

# Purpose

When extractability is too weak to answer, show **who an assistant would likely cite instead** — derived from existing corroboration/answerability findings and root causes (`rc-substitution` family), not from SERP APIs.

---

# Why It Exists

This is the business punchline (source substitution) already in `rootCauses` / mock `rc-substitution`. Make it visible as AI behavior, not a bullet in Causes.

---

# User Experience

## When visible

Only if `perception.status === 'substituted'` OR `buildSubstitution()` returns `active: true`.

Panel below memory:

```
SUBSTITUTION  ·  SIMULATED FROM AUDIT GAPS  ·  NOT A LIVE CITATION SCRAPE

First-party  [weak]
Likely cite  Wikipedia / category aggregators / competitors with extractable specs

Why
  Machine extraction gap → weak evidence → answerability risk → source substitution
  (walk parent_id chain labels, max 5)

[ Show on tree ]
```

**Show on tree:** highlight skills on the active cause’s findings (`handleSelectCause`).

## Loading

Hidden until bundle ready.

## Errors

If no matching cause, do not show panel (use refusal without substitution).

## Motion

240ms opacity. No particles.

---

# Inputs

`AuditResult.rootCauses`, `findings`, `perception.status`.

Known cause ids in mock-data (must also work for backend ids):

- Prefer cause whose `label` or `id` matches `/substitut/i`
- Else last node in `parentId` chain (walk until no child)

---

# Outputs

```ts
export interface SubstitutionResult {
  active: boolean
  disclaimer: 'simulated_from_audit_gaps'
  firstParty: 'strong' | 'adequate' | 'weak'
  likelyCite: string
  causeChain: { id: string; label: string }[]
  skillIds: SkillId[]
  findingIds: string[]
}
```

```json
{
  "active": true,
  "disclaimer": "simulated_from_audit_gaps",
  "firstParty": "weak",
  "likelyCite": "Third-party sources with extractable specs (aggregators, encyclopedic pages, competitors).",
  "causeChain": [
    { "id": "rc-client-rendering", "label": "Client-rendered key content" },
    { "id": "rc-extraction-gap", "label": "Machine extraction gap" },
    { "id": "rc-substitution", "label": "Potential source substitution" }
  ],
  "skillIds": ["render-extract-audit", "ai-answerability-audit"],
  "findingIds": ["f-render", "f-answer"]
}
```

**Forbidden strings** in `likelyCite`: `ChatGPT`, `Perplexity`, `Gemini`, `Bing Copilot` as **measured** citers. Generic “assistants” OK.

---

# Internal Logic

```
firstParty = min(dimensionScores.understanding, trust, discoverability)
  map score: >=75 strong, >=55 adequate, else weak

active =
  perception.status === 'substituted'
  OR firstParty === 'weak' AND (answerability OR citation finding high|critical)
  OR rootCauses some substitut

causeChain = orderCauses(rootCauses) existing helper in root-cause-chain.tsx — extract to lib/audit/causes.ts

skillIds = unique skills on cause.findingIds
```

Do not call the network.

---

# Integration Points

Causes tab: same chain.  
Tree: `Show on tree` uses module 03.  
Export: include disclaimer verbatim.  
Marketplace: skipping corroboration may reduce `active` (recompute).

---

# Backend Requirements

None.

---

# Frontend Requirements

Kicker always visible when panel shown. Contrast on disclaimer `text-muted-foreground`.  
a11y: `role="note"`.

---

# Success Metrics

Demo with substitution cause → panel shows.  
Copy review: zero live-citation claims.  
Show on tree highlights ≥1 skill.

---

# Demo Value

Wow #3: “I’d cite someone else” with the causal walk.

---

# Marketplace Alignment

Substitution is an **emergent property of composed skills**, not a 11th crawler.

---

# Risks

Judges hear “Wikipedia” as a live measurement — **disclaimer is mandatory**.  
Over-firing panel on every audit — require weak first-party **and** a high/critical finding.

---

# Future Extensions

Optional opt-in live SERP (off by default, legal review). Wikidata `sameAs` if entity skill emits it.
