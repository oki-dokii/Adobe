# FINAL — Skill Quality Table

Scores 1–10 are audit aids, not keep/kill.

| Skill | Purpose | Unique job | Research | Mechanism | Signals | Evidence | Confidence | Severity | Remediation | FP defenses | FN limits | Site-type | Deps | Runtime | Novelty | Impl. | Value |
|-------|---------|------------|----------|-----------|---------|----------|------------|----------|-------------|-------------|---------|-----------|------|---------|---------|-------|-------|
| orch | Compose | Clock+merge+report | Z AB S T | DAG | coverage | process | high process | n/a | n/a | cap 15 | merge FN | all | all | med | med | med | 9 |
| V | Type+YMYL | Gating owner | V | hybrid | url/nav | cluster | med | high YMYL | disclosures | multi-label | hybrid FN | all | sample | low | high | med | 9 |
| C | Access | Gate 1 | C AE AG L | det | HTTP robots graph | RFC | high | crit fail-closed | infra/robots | U8 L | geo FN | all | crawl | low | low | med | 8 |
| D | Render | Gate 2 + D41 | D N U AD | det | dual-fetch | excerpts | high | crit fact lock | SSR | U2 U9 U10 | canvas FN | all | render | high | high | med | 9 |
| CIT | Quote | Gate 3 + G type | A B E J G W-03 | hybrid | windows tables JSON-LD | quotes | mixed | crit misquote | rewrite | U1 voice | grid tables | factual templates | flags V | med | high | med | 9 |
| ENT | Mix-up | WhoQA | F | hybrid | name sameAs | collision | low–med | high iff evidence | disambiguate | F-02 | no search | orgs | extract | low | high | med | 7 |
| K | Complete | Closed-book + W class | K W AH | LLM+span | Q bank | spans | med | high K3 | add/move prose | V gaps | crawl FN | filtered | V D | high | high | high | 9 |
| I | On-site consistency | Dates + typed conflicts | I AC12 | det+compare | dates facts | quotes | high det | high decision facts | supersede | U6 U7 | fake dates | all | facts | low | med | med | 8 |
| H | Off-site | Linked drift | H P | fetch+compare | sameAs | paired URLs | med | high contradiction | update stale side | P-03 absence | unlinked FN | B NAP; else linked | time | med | med | med | 7 |
| X | Arrival | Human after cite | M X Y O | mixed | viewport STTF | selectors | med | high central | visible claim | flat crumbs | paraphrase | all | claims | low | high | med | 8 |

## Numeric scores

| Skill | Research | Impact | Novelty | Auto | Generalize | Evidence | FP robust | Simple | Mean |
|-------|----------|--------|---------|------|------------|----------|-----------|--------|------|
| orch | 9 | 9 | 5 | 8 | 10 | 8 | 7 | 6 | 7.8 |
| V | 9 | 9 | 8 | 6 | 9 | 7 | 7 | 6 | 7.6 |
| C | 9 | 9 | 3 | 9 | 10 | 9 | 8 | 7 | 8.0 |
| D | 9 | 10 | 8 | 8 | 10 | 9 | 8 | 6 | 8.5 |
| CIT | 9 | 10 | 9 | 6 | 8 | 8 | 7 | 5 | 7.8 |
| ENT | 8 | 8 | 9 | 5 | 7 | 6 | 7 | 5 | 6.9 |
| K | 9 | 10 | 9 | 5 | 8 | 7 | 6 | 4 | 7.3 |
| I | 8 | 8 | 6 | 8 | 9 | 8 | 8 | 7 | 7.8 |
| H | 8 | 7 | 7 | 6 | 7 | 7 | 7 | 6 | 6.9 |
| X | 8 | 8 | 8 | 6 | 8 | 7 | 7 | 6 | 7.3 |

ENT and H score lowest on automation/FN — **keep** because unique mechanisms; degrade/skip rather than delete.

Overall marketplace: strong if skip-ladder preserves D/CIT-det/K3/V.
