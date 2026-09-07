# Phase 9 — False Negative Attack

Fool the auditor into missing a real problem. Then harden (without exploding runtime).

| Skill | FN | Mitigation | Residual |
|-------|----|------------|----------|
| C | Geo-split TLS | State limitation | Unfixable from one vantage |
| C | robots allow our UA, block GPTBot | Token matrix | New UA tokens |
| C | Well-connected in partial graph, orphan in full | AE22 on isolation | Partial crawl |
| C | Canonicalized-away important page | Detect canonical targets off-section | Soft |
| D | Canvas/WebGL prices | Sample 1–2 OCR optional; else FN + limitation | OCR budget |
| D | Click-fetches HTML we never click | Don’t claim we interacted; optional 1 click on pricing if budget | Under-click |
| D | Shadow DOM | Renderer required; raw-only miss | Headless missing |
| D | D41 via zero-font / offscreen not display:none | Supplementary hidden-text heuristics; incomplete | AD ceiling |
| CIT | CSS-grid “tables” | Heuristic role=table / grid | FN |
| CIT | Qualifier 4 paragraphs away | Window N too small | Tune; don’t infinite |
| CIT | Negation in other language | Primary lang only | FN |
| ENT | Homonym not in our gazetteer | Linked Wikipedia title compare if sameAs | Search FN |
| ENT | Non-English collision | lang sample | FN |
| K | Fact in image; D missed | If D flag uncertain, K abstain not “answered” | Conservative FN |
| K | Fact on page 400 we didn’t crawl | Coverage; don’t claim site-wide absence | AE22 |
| K | Paraphrase offering in slogan | LLM with span still required | FN |
| I | Fake dateModified, content unchanged | No prior snapshot | FN stated |
| I | Stale in JS blob D missed | Depends D | |
| H | Unlinked aggregator wrong price (AH9) | Defer | **Accepted FN** |
| H | Third-party robots block | errors[] partial | |
| X | Citation paraphrases page | One paraphrase check central claims | FN |
| X | Mobile fold ≠ desktop | Heuristic 600px; no real device | FN |
| X | Cookie banner covers identity | Optional banner in render | FN |
| V | Hybrid finance widget on media | Multi-label | FN |
| All | Template issue on unsampled variant | 2–3 confirms; AF two-tier language | FN |
| All | Prompt injection flips LLM skills | Delimiters; prefer det | Residual |

## Architecture change

Honesty > fake completeness: every absence finding needs coverage modifier. Prefer **conservative FN** on K/ENT over FP. Document accepted FNs in `limitations[]`.
