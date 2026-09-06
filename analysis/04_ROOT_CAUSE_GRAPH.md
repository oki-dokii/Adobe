# Phase 4 — Root-Cause Graph

Prefer one finding at the **mechanism** node, with symptoms listed as effects.

## Shared causal chains

### Chain 1 — Client-only facts
```
SYMPTOM: AI omits price / assistant cites a third party
DIRECT CAUSE: fact absent from raw HTML
MECHANISM: crawler/indexer stores unrendered or pre-interaction DOM
WEBSITE SIGNAL: dual-fetch delta on fact-bearing nodes; accordion/API
DETECTION: deterministic text-in-raw vs rendered vs after-click (no click-as-write; only if content already in DOM hidden)
EVIDENCE: URL, excerpts raw vs rendered, selector
SEVERITY: Critical if core commercial/identity facts; else High
REMEDIATION: SSR/prerender those facts as visible text
SKILLS: render-extract-audit (cause); citation/answerability (symptoms)
```

### Chain 2 — Qualifier split
```
SYMPTOM: cited but wrong (“$49” without “intro, then $99”)
DIRECT CAUSE: fact and condition in different passages/cells
MECHANISM: RAG window / table cell isolation
SIGNAL: price/spec regex vs nearby qualifier lexicon; table without th
DETECTION: hybrid
EVIDENCE: isolated vs full-context quotes
SEVERITY: Critical for price/legal/safety
REMEDIATION: one self-contained sentence; proper <th>
SKILL: citation-extractability-audit
```

### Chain 3 — Access policy vs outage
```
SYMPTOM: total invisibility
CAUSE A: TLS/DNS/5xx (unintentional) vs CAUSE B: robots/noindex (often intentional)
MECHANISM: fetch abort vs fail-closed robots 5xx
DETECTION: staged HTTP; RFC 9309 status handling
REMEDIATION: infra vs robots review
SKILL: crawl-access-audit
U8: disallow of junk paths is not a defect
```

### Chain 4 — Entity collision
```
SYMPTOM: AI attributes another org’s facts to the brand
CAUSE: common name + no early disambiguators + no verified sameAs
MECHANISM: WhoQA-style silent mix-up
DETECTION: collision probe (bounded search) + on-page disambiguation
SEVERITY: High only if collision risk measured
REMEDIATION: “Brand is a {category} in {geo}…” + accurate Organization schema
SKILL: entity-identity-audit
```

### Chain 5 — Missing answer vs unextractable answer
```
SYMPTOM: “what does the company do?” unanswered
CAUSE A: never stated (K) vs CAUSE B: stated only in hero image (D)
DETECTION: closed-book QA abstention vs dual-fetch image-only
REMEDIATION: add prose vs add text equivalent
SKILLS: answerability vs render-extract; T jointly-necessary if both
```

### Chain 6 — Stale repetition
```
SYMPTOM: AI states old CEO/price
CAUSE: old press release still live + contradicts current page
MECHANISM: knowledge conflict; repetition resistance (I-01)
DETECTION: internal fact graph inconsistency
REMEDIATION: date/supersede banners; strengthen current canonical page
SKILL: freshness-audit (+ corroboration if off-site copies)
```

### Chain 7 — Third-party substitution
```
SYMPTOM: aggregator cited instead of brand
CAUSE: their table is more extractable (AH) OR brand blocks crawlers OR no category sentence
NOT CAUSE: “page isn’t listicle enough” (AH-list)
SKILLS: citation + crawl-access + answerability; remediation must match cause
```

### Chain 8 — Arrival bounce
```
SYMPTOM: AI traffic doesn’t engage
CAUSE: cited span not visible; identity below fold; broken scent
MECHANISM: information foraging (X-01)
DETECTION: STTF-matchability; first-viewport text; nav label match
SKILL: engagement-handoff-audit
```

### Chain 9 — Site-type false defect
```
SYMPTOM: “no public pricing”
CAUSE: enterprise sales motion (V-F) not forgetfulness
DETECTION: classifier + contact-for-quote pattern
ACTION: suppress or Informational
```

## Shared-cause index

| Root cause | Symptom skills that must not all fire independently |
|------------|------------------------------------------------------|
| SPA fact lock | render, citation, answerability, engagement |
| Template defect | N pages → 1 template finding (AF) |
| robots.txt 5xx fail-closed | all discovery skills downstream skipped with one Critical |
| Name collision | entity (cause); corroboration (optional amplifier) |
| Schema/text mismatch | G check inside entity/citation; not three findings |

Orchestrator T-01 classifies chains as single-sufficient vs jointly-necessary vs primary+amplifier.
