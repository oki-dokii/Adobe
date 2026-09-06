# Phase 23 — Coverage Audit

Disposition: IMPLEMENTED = in a KEEP skill or shared infra used at runtime. MERGED = into that. DEFERRED / REJECTED as named.

| RID | Source | Topic | Finding | Signal | Candidate | Disposition | Reason | Where | Related | Status |
|-----|--------|-------|---------|--------|-----------|-------------|--------|-------|---------|--------|
| HO-001..015 | PDF | Contest | Dual mandate, 1 entrypoint, schema, 5min, robots, 3-gate | n/a | orch | IMPLEMENTED | Authoritative | SK-ORCH | all | covered |
| A-001 pipeline | A | Discovery | Generic RAG stages | n/a | skills by stage | IMPLEMENTED | Pattern not vendor | all | | covered |
| A-004 dual-fetch | A | Render | Raw vs DOM | delta | CS-006 | IMPLEMENTED | | SK-D | C | covered |
| A-007 synonyms | A | Query rewrite | Narrow phrasing | terms | CS-035 | MERGED | Weak; Low only | SK-K | | covered |
| A-008 comparison intent | A | Intent | Category sentence | prose | CS-012 | IMPLEMENTED | | SK-K | W | covered |
| A-009 A16 | A | Chunks | Self-contain | windows | CS-010 | IMPLEMENTED | | SK-CIT | | covered |
| A-010 citation≠rank | A | Cite | Allocation | n/a | language | IMPLEMENTED | Don’t fake rank | SK-CIT | | covered |
| A-012 A22 | A | Templates | Cluster | simhash | CS-029 | IMPLEMENTED | infra | lib | AF | covered |
| B-F1 quotability | B | Cite | Vague vs specific | lexicon | CS-010 | IMPLEMENTED | | SK-CIT | J | covered |
| B-F2 misrep | B | Cite | Qualifier split | hybrid | CS-010 | IMPLEMENTED | | SK-CIT | E | covered |
| B-F3 schema live | B | Schema | Not parsed as data | tests | CS-007 | MERGED | Low sev | SK-CIT/ENT | D-MYTH | covered |
| C HTTP/TLS | C | Access | Infra fail | det | CS-003 | MERGED | | SK-C | | covered |
| C RFC9309 | C | robots | 4xx/5xx | det | CS-004 | IMPLEMENTED | | SK-C | | covered |
| C AI tokens | C | robots | Per-bot | det | CS-036 | MERGED | | SK-C | | covered |
| C facets | C | Traps | Params | det | CS-037 | MERGED | | SK-C | AE | covered |
| D-MYTH | D | Tactics | No llms.txt/chunk mandate | Google | CS-034 | REJECTED | As required check | AC optional mention | | covered |
| D landmarks | D | Read | main/nav | det | CS-006 | IMPLEMENTED | | SK-D | N | covered |
| D interaction | D | Read | click-gated | det | CS-006 | IMPLEMENTED | | SK-D | X | covered |
| E-01 negation | E | NLP | Scope | hybrid | CS-010 | IMPLEMENTED | | SK-CIT | | covered |
| E-02 taxonomy | E | Extract | One mechanism | config | CS-060 | IMPLEMENTED | refs | SK-CIT | | covered |
| E-03 tables | E | Extract | th/scope | det | CS-010 | IMPLEMENTED | | SK-CIT | | covered |
| F-00 GEO junk | F | Meta | Overclaim | n/a | process | IMPLEMENTED | Design rule | all docs | | covered |
| F-01 WhoQA | F | Entity | Collision | search+prose | CS-015 | IMPLEMENTED | | SK-ENT | | covered |
| F-02 KG cite | F | Entity | Unevidenced | n/a | CS-055 | REJECTED | As score | SK-ENT language | | covered |
| G-01 invalid SD | G | Schema | Parse | det | CS-007 | MERGED | | SK-ENT/CIT | | covered |
| G-02 parity | G | Schema | vs text | det | CS-016 | MERGED | | SK-CIT | | covered |
| H-01 corroboration | H | Trust | Agreement | fetch | CS-017 | IMPLEMENTED | | SK-H | | covered |
| H-02 unproven causal | H | Trust | Confidence state | n/a | S | IMPLEMENTED | | orch | | covered |
| J-01 J-02 | J | Quality | Vague/thin | hybrid | CS-023 | MERGED | | SK-CIT | U3 | covered |
| K-01 QA protocol | K | Answer | Abstention | LLM | CS-012 | IMPLEMENTED | | SK-K | | covered |
| K-02 K9/K10 | K | Answer | Expected gaps | taxonomy | CS-012 | IMPLEMENTED | exclude score | SK-K | | covered |
| L-01 titles | L | Tech | Identity sentence | det | CS-026 | MERGED | | SK-CIT | | covered |
| L-02 canonical | L | Tech | Dup C | det | CS-026 | MERGED | | SK-C | | covered |
| M-01..03 | M | Engage | Viewport/scent | hybrid | CS-019 | MERGED | | SK-X | | covered |
| N-01 alt | N | A11y | Fact images | det | CS-024 | MERGED | | SK-D | | covered |
| O-01 CWV | O | Perf | Redundant | det | CS-025 | REJECTED | Standalone | SK-X CLS proxy | | covered |
| P-01..03 | P | Consistency | Drift/materiality | fetch | CS-018 | MERGED | | SK-H | | covered |
| Q-01 Q-02 | Q | Method | Field ≠ runtime | n/a | none | REJECTED | As skill | design | | covered |
| R-01 R-02 | R | Method | Sample/queries | n/a | none | IMPLEMENTED | U12 + K queries | SK-K U | | covered |
| S-01 S-02 | S | Score | Axes/CVSS structure | n/a | CS-042 | IMPLEMENTED | orch | SK-ORCH | | covered |
| T-01..03 | T | RCA | Causal classes | n/a | CS-041 | IMPLEMENTED | | SK-ORCH | | covered |
| U table/flow | U | FP | Never-fire | rules | CS-027 | IMPLEMENTED | infra | lib | | covered |
| U9 U10 U11 | U | FP | PDF/image/link | rules | CS-038 | MERGED | | SK-D SK-K | | covered |
| V-01..04 | V | Type | Classifier always | hybrid | CS-002 | IMPLEMENTED | | SK-V | | covered |
| W-01..04 | W | Align | Intent/win-rate | hybrid | CS-013 | MERGED | | SK-K | | covered |
| X-01..03 | X | Handoff | Forage/STTF/trust | mixed | CS-021 | MERGED | | SK-X | | covered |
| Y-01 | Y | Context | Untestable | n/a | report | IMPLEMENTED | limitations | SK-ORCH | | covered |
| Y-02 crumbs | Y | Context | Wayfinding | det | CS-022 | MERGED | | SK-X | | covered |
| Z-01 Z-02 | Z | Eng | Spec/DAG | n/a | CS-001 | IMPLEMENTED | | SK-ORCH | | covered |
| AA-01 AA-02 | AA | Reason | Confidence/ReAct | n/a | CS-046 | IMPLEMENTED | | lib | | covered |
| AB-01 AB-02 | AB | Report | Dual/BLUF | n/a | CS-043 | IMPLEMENTED | | SK-ORCH | | covered |
| AC-01 AC-02 | AC | Recs | Proactive | hybrid | CS-044 | IMPLEMENTED | | SK-ORCH | | covered |
| AD-01 | AD | Security | Injection | det | CS-045 | IMPLEMENTED | | lib | | covered |
| AE-01 AE-02 | AE | Crawl | SimHash/traps | det | CS-028 | IMPLEMENTED | infra | lib | | covered |
| AF-01 | AF | Template | Cluster | det | CS-029 | IMPLEMENTED | infra | lib | | covered |
| AG-01 AG-02 | AG | Graph | Orphans | det | CS-030 | IMPLEMENTED | infra | SK-C | | covered |
| AH-01 encodings | AH | Robust | Multi-encode | det | CS-010 | MERGED | proactive | SK-CIT AC | | covered |
| AH-02 composite | AH | Score | Query-free cite | metric | CS-032 | MERGED | metric | SK-K | | covered |
| AH flagship | AH | Product | Hero gap | compare | CS-031 | MERGED | | SK-K | | covered |
| AH-list | AH | Rec | Directories not listicles | language | rem | IMPLEMENTED | rec text | SK-K | | covered |
| CS-033 live probe | R/M | Cite | Real AI | live | CS-033 | DEFERRED | 5min/ToS/U12 | future | | deferred |
| CS-052 directories | AH | Offsite | List presence | fetch | CS-052 | DEFERRED | budget | AC if time | | deferred |
| App E personalization | HO | | Untestable | n/a | CS-054 | REJECTED | Y-01 | limitations | | covered |
| App F email | HO | | Out of scope | n/a | CS-053 | REJECTED | | | | covered |

## Duplicates found
A11≡D III; B-F1≡J-01; M≡X landing; H fetch≡P; AE SimHash≡AF; C facets≡AE traps.

## Conflicts
See `02_TERMINOLOGY_MAP.md` CX-1..CX-15. None left unaccounted.

## No current skill (by design)
Live citation; personalization; email; KG completeness score; llms.txt required; GEO 40%.

## Hypotheses needing validation
AE 40/60 split; AE early-stop order; bounded ReAct benefit; production WhoQA transfer; Google AI Overview STTF reuse; per-K HITS vs global (AG-029); Answer Concentration vs live citation (K-028); composite citability vs live citations (AH25).

## Research-file gap (do not invent)
Topic AH framing lists seven open questions; the file never states **AH8**’s question (extractor note). Disposition: **DEFERRED / unspecified** — do not invent AH8 checks.

## Extractor join (AE×AF×AG×AH)
- Crawl and site graph are **one pipeline** (JOIN-001).
- Shared K lexicon across crawl scoring, SK-K, and optional HITS (JOIN-003/008).
- Query-independent citability primary under 5 min (JOIN-004).
- AG isolation findings always carry AE22 coverage (JOIN-005).

## Promising not in v1
Live probes; directory presence scan; OCR budget increase.
