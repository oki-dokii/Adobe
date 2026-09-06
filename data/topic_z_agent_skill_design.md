# Topic Z — Agent Skill Design (Z1–Z38)
**Researcher:** Soham | **Research Area:** Z — Agent Skill Design
**Priority:** Very High

---

## 0. Framing — why this document reads differently from V/W/X/Y, and how the A–O letters get reused

Every other topic in this project asks a version of "what website signal predicts a real problem, and how would a skill detect it." Topic Z asks a structurally different question: **how do we actually build and wire together the thing that runs those checks, inside the handout's hard constraints (exactly one entrypoint, <5 min, ≤50MB, read-only, robots-respecting, portable).** There's no "website signal" here — the subject under audit is our own system. I'm keeping the same A–O letter structure purely so this document merges cleanly with the others, but the letters are reinterpreted for engineering content: E ("concrete signals") becomes concrete artifacts/schemas; H ("severity logic") becomes criticality/priority logic for *engineering* failure modes; J ("false positives") becomes anti-patterns; M ("generalizes") becomes "portable across skill implementations, not tied to one skill's content."

Two overlaps need disclosing up front, the same way prior topics disclosed overlaps with each other, so nobody builds the same thing twice under a different name:

- **Cluster F (evidence/finding lifecycle: Z21–Z27) is infrastructure, not policy.** Harsh's S (Scoring & Severity) and T (Root-Cause Analysis) own *what* severity a given finding type deserves and *what* the causal narrative is. Z owns the *mechanics* — the schema a severity value is stored in, the algorithm that deduplicates two skills reporting the same underlying issue, the propagation rule for confidence across an aggregation step. This document specifies the pipe; S/T decide what flows through it.
- **Cluster G (Z28–Z29, recommendations) is the same split** against my own AC (Proactive Recommendations) topic: Z specifies the data structure a recommendation must conform to and how competing recommendations get ranked mechanically; AC owns the actual remediation content and reasoning.

The 38 sub-topics collapse into eight clusters, each mapping to a concrete engineering deliverable.

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. Cluster map — Z1–Z38 collapsed to eight engineering deliverables

| Sub-topics | Cluster | Deliverable |
|---|---|---|
| Z1, Z2, Z3, Z4, Z8 | **A — Skill packaging & spec compliance** | Every skill folder passes spec validation |
| Z5, Z6, Z7 | **B — Progressive disclosure & context budget** | Skills stay cheap to load until actually triggered |
| Z9, Z10, Z11 | **C — Composition & the single entrypoint** | One orchestrator, many narrow skills, explicit call graph |
| Z12, Z13, Z14 | **D — Contracts & structured I/O** | JSON Schemas every skill must honor in and out |
| Z15, Z16, Z17, Z18, Z19, Z20 | **E — Reliability engineering** | The pipeline survives a flaky network and a slow page |
| Z21, Z22, Z23, Z24, Z25, Z26, Z27 | **F — Evidence & finding lifecycle (infrastructure only)** | A merged, deduplicated, provenance-tagged finding set |
| Z28, Z29 | **G — Recommendation layer (infrastructure only)** | A ranked, schema-conformant action list |
| Z30, Z31, Z32, Z33, Z34, Z35, Z36, Z37, Z38 | **H — Runtime safety & submission constraints** | The system that's actually legal to submit and run |

---

## Cluster A — Skill packaging & spec compliance
**Covers:** Z1 (Agent Skills specification), Z2 (SKILL.md structure), Z3 (YAML frontmatter), Z4 (skill descriptions), Z8 (allowed-tools)

### A. What we need to understand
The actual, current, authoritative shape of a spec-compliant skill — not a remembered approximation of it, since this is exactly the kind of product-specific detail that goes stale.

### B. Why it matters
Every one of the marketplace's ~8–15 skills must pass spec validation (tools like `skillscheck` exist specifically to lint this) or they simply won't load in the target harness — this is a hard pass/fail gate before any of the content-quality work in V/W/X/Y matters at all.

### C. Current evidence

**FACT (directly verified against the current specification, agentskills.io/specification, and its Claude Code extensions)** — A skill is a directory containing a required `SKILL.md` (YAML frontmatter + Markdown body) plus optional `scripts/`, `references/`, and `assets/` subdirectories. The frontmatter's **only two required fields are `name` and `description`**. `name` must be ≤64 characters, lowercase letters/numbers/hyphens only, no leading/trailing/consecutive hyphens, and must not use reserved words (e.g., `claude`, `anthropic`). `description` must be 1–1024 characters and — this is explicit in the spec's own guidance, not a style preference — should state **both what the skill does and when to use it**, since this is the only content loaded into every conversation's system prompt regardless of whether the skill fires.

**FACT** — Optional frontmatter fields defined by the open standard are exactly: `license`, `compatibility` (≤500 chars, environment requirements), `metadata` (arbitrary key-value), and `allowed-tools` (a space-separated string of pre-approved tools). **`allowed-tools` is explicitly marked experimental in the spec itself**, with support "vary[ing] between agent implementations" — and critically, per the spec's own caveat, **it does not restrict tool use; it only pre-approves the listed tools, and does not block others.** This is a genuinely important, non-obvious distinction: a team assuming `allowed-tools` functions as a sandbox/permission boundary would be wrong — actual tool restriction has to be enforced by the harness's own permission/deny-rule system, not by this frontmatter field, which is directly relevant to Cluster H's sandboxing requirement (Z33).

**FACT** — Progressive disclosure (formalized further in Cluster B) is a three-tier loading model: metadata (name+description, ~30–100 tokens) loads for every installed skill at all times; the full `SKILL.md` body loads only once the skill is triggered; `references/`/`scripts/`/`assets/` contents load only as needed during execution. This is stated consistently across the spec, its adopters (Agno, PraisonAI), and Anthropic's own skill-creator tooling already present in this project's environment.

### D. Important mechanisms
The one thing worth over-indexing on: **the description field is the marketplace's entire discovery mechanism.** If the entrypoint (or the harness generally) decides which of several narrow skills to invoke based on matching a task to a description, a vague or overlapping description (`"checks for issues"`) is a functional bug, not a style nit — it will cause the wrong skill to fire or none at all.

### E. Concrete artifacts
A validation checklist per skill folder, directly derived from the spec fields above:
```
skill-name/
├── SKILL.md          # name + description mandatory; both machine-checkable
├── scripts/          # deterministic checks (Cluster E) live here
├── references/       # long-form config data (e.g., Pulkit's qualifying-context taxonomy)
└── assets/           # rarely needed for this project
```
`name`: kebab-case, ≤64 chars, matches directory name. `description`: states what + when, includes the specific trigger keywords a task description would contain (e.g., "site-type classification," "YMYL," "pricing page").

### F. How this gets verified automatically
Run `skillscheck` (or an equivalent linter) in CI against every skill folder before packaging for submission — spec compliance, naming rules, and description-quality heuristics are already a solved, off-the-shelf problem; there's no reason to hand-roll this validation.

### G. What the marketplace's own documentation should state
Which frontmatter fields each skill actually uses, and an explicit note that `allowed-tools` (if used at all) is a pre-approval hint, not a security boundary — so nobody on the team mistakenly relies on it for Cluster H's sandboxing requirement.

### H. Criticality if this is wrong
High — a spec violation is a hard failure (skill doesn't load), not a quality degradation; this should be a CI gate, not a manual review step.

### I. Correct implementation
Write descriptions collaboratively with whoever owns the content of each skill (V, W, X, Y, etc.) since only they know the actual trigger conditions; lint before every submission build.

### J. Anti-patterns to avoid
Overlapping descriptions across two skills (causing ambiguous invocation); using `allowed-tools` as if it were an enforced permission boundary; putting large reference data directly in `SKILL.md`'s body instead of `references/`, defeating progressive disclosure (Cluster B).

### K. Failure modes if missed
A skill with a malformed `name` or missing `description` may simply fail to load in the target harness with no useful error — this should be caught by CI, not discovered at demo time.

### L. Counterexamples / exceptions
None — these are hard spec requirements, not judgment calls.

### M. Portable across skill implementations?
Yes — this is the literal purpose of the spec: identical structure regardless of which of the ~8–15 skills it is.

### N. Deliverable
A `skillscheck`-clean skill folder per skill, plus a short internal style guide for description-writing so trigger conditions stay consistent across the whole marketplace.

### O. Relationship to other clusters
Feeds Cluster B (progressive disclosure depends on correct folder structure) and Cluster C (the entrypoint's ability to select the right skill depends entirely on description quality).

---

## Cluster B — Progressive disclosure & context budget
**Covers:** Z5 (progressive disclosure), Z6 (references/), Z7 (scripts/)

### A. What we need to understand
How to actually use the three-tier loading model to keep the marketplace's total context footprint small, given that the entrypoint may need to reason about which of several skills to invoke before any of them are "loaded" in the expensive sense.

### B. Why it matters
With ~8–15 narrow skills (per the project's own design principle of narrow scope over one monolith), the always-loaded tier (every skill's name+description) needs to stay cheap regardless of how many skills exist, or the marketplace's own overhead eats into the 5-minute/token budget before any actual auditing happens.

### C. Current evidence

**FACT** — Per the spec and its adopters' consistent description, only Tier 1 (name+description, tens to ~100 tokens per skill) is unconditionally loaded; Tier 2 (full `SKILL.md` body, spec guidance suggests keeping this under roughly 5,000 tokens) loads only on trigger; Tier 3 (`references/`, `scripts/`) loads only as needed during that skill's execution.

**INFERENCE (a direct, load-bearing design implication for this project specifically)** — Given Cluster A's finding that `references/` is the correct home for large, mostly-static configuration data, **Pulkit's qualifying-context taxonomy (pricing/specs/contact/location/date qualifying contexts) and this document's own Topic V cluster-mapping table belong in `references/` files, not inline in any skill's `SKILL.md` body** — they're exactly the kind of large, rarely-all-needed-at-once reference data the three-tier model exists to defer loading of.

**INFERENCE** — `scripts/` is the correct home specifically for Cluster E's deterministic checks (DOM pattern matching, schema validation, text-fragment matching) — not because the spec mandates a particular split of deterministic-vs-LLM logic, but because executable code that produces the same output for the same input (Z15's determinism requirement) is precisely what a `scripts/` file is for, versus judgment calls that belong in the `SKILL.md` body's instructions to the model.

### D. Important mechanisms
The unifying insight: this cluster isn't really about API mechanics (those are settled, per Cluster A) — it's about a design discipline: **treat Tier 2 (`SKILL.md` body) as instructions for judgment calls, and Tier 3 (`scripts/`, `references/`) as everything that's either executable-deterministic or large-and-occasionally-needed.** Getting this split wrong doesn't break anything technically, it just wastes context budget that's genuinely scarce under this project's runtime constraints.

### E. Concrete artifacts
Per skill: a `SKILL.md` body that stays under roughly 5,000 tokens and reads as instructions, not data; a `references/` directory holding the qualifying-context taxonomy, the V1–V20→cluster mapping, and any other large lookup tables; a `scripts/` directory holding the deterministic extraction/validation code.

### F. How this gets verified
Token-count the `SKILL.md` body in CI (the same linting pass as Cluster A); flag any skill whose body embeds what looks like tabular reference data inline rather than as a `references/` file.

### G. What evidence to report
N/A for end users — this is purely an internal engineering discipline, invisible in the audit's final report.

### H. Criticality
Medium — doesn't break functionality, but at ~8–15 skills a bloated always-loaded tier measurably eats into the runtime/token budget that Cluster H's 5-minute constraint is trying to protect.

### I. Correct implementation
Write the `SKILL.md` body as if explaining the check to a colleague; move anything resembling a lookup table or dataset to `references/`.

### J. Anti-patterns to avoid
Pasting Pulkit's entire fact-type taxonomy inline into a skill's `SKILL.md` body "for completeness" — this directly undermines the point of Tier 3 existing at all.

### K. Failure modes if missed
Not a hard failure — a soft, cumulative cost: larger context footprint per invocation, slower/costlier runs, harder-to-read skill instructions.

### L. Counterexamples
A genuinely short, skill-specific config (a handful of named vendor strings for Topic V's institutional-bookstore check) is small enough that inlining it in the body is fine — this is a judgment call about size, not an absolute rule.

### M. Portable?
Yes — this discipline applies identically regardless of which skill's content it's organizing.

### N. Deliverable
A short internal convention doc (a few sentences) stating the Tier 2 vs. Tier 3 split rule, referenced by whoever implements each skill.

### O. Relationship to other clusters
Directly downstream of Cluster A's folder structure; upstream of Cluster H's runtime-budget constraint.

---

## Cluster C — Composition & the single entrypoint
**Covers:** Z9 (skill composition), Z10 (skill orchestration), Z11 (entrypoint design)

### A. What we need to understand
How exactly one entrypoint composes multiple narrow skills into one coherent audit run, given the explicit handout requirement of "exactly one marketplace entrypoint."

### B. Why it matters
This is the single architectural decision every other topic's cross-references have been implicitly assuming exists — Topic V's classifier output, Topic W's query-generation step, Topic X's dependency on W, Topic Y's dependency on both — none of that works unless something concrete actually sequences it. This cluster is where that gets specified.

### C. Current evidence

**INFERENCE (a direct synthesis of every cross-reference already made across V/W/X/Y in this project)** — The dependency graph established across this project's own prior documents is not arbitrary; it names a required execution order:

```
1. site-type-classifier (V)          — no dependencies; must run first
2. crawl-strategy / template sampler (Pulkit's AF, Z34) — depends on (1)
3. query-generation (W's Cluster A)  — depends on (1)
4. per-page checks, parallelizable:
     - passage/chunk quality (Pulkit A16/F1/F2)
     - query-to-page alignment (W's Clusters B-E) — depends on (3)
     - AI-referral landing audit (X)  — depends on (3), consumes W's output
     - context-retention checks (Y)   — depends on (1), (3)
     - trust/corroboration checks (Harsh H/P) — depends on (1)'s cluster output
5. false-positive-suppression (U)    — depends on all of (4)'s raw findings
6. aggregation/dedup/severity (Cluster F, this doc + Harsh S/T)
7. recommendation generation (Cluster G, this doc + AC)
8. report assembly (AB)
```
This is our own synthesis, not something any single prior document stated end-to-end — but every edge in this graph is a direct citation to a cross-reference already made in V, W, X, or Y's own documents, not a new invented dependency.

**INFERENCE** — "Exactly one entrypoint" (the handout's own phrase) most naturally means one **orchestrator skill or script** that a user/harness invokes once, which then internally calls the other skills — not a literal constraint that only one skill-folder may exist. The other ~7–14 skills are invoked *by* the entrypoint, not directly by the end user; this reading is consistent with the spec's own "skills are composable" framing found in Cluster A's research, and avoids the alternative (and clearly worse) reading that would force cramming all logic into a single monolithic skill, directly contradicting the handout's own stated preference for "multiple narrowly scoped skills."

### D. Important mechanisms
The unifying insight: composition here is not free-form — steps 4's parallel checks genuinely can run concurrently (they don't depend on each other, only on step 1-3's outputs), while steps 1→2/3→4→5→6→7→8 are a strict sequential chain. Getting the parallel/sequential split right is the main lever for actually fitting inside the 5-minute budget (Cluster H).

### E. Concrete artifacts
A single orchestrator (`entrypoint/SKILL.md` or an equivalent top-level script) encoding the dependency graph above; a manifest listing each sub-skill's declared input/output contract (Cluster D) so the orchestrator can validate hand-offs mechanically rather than by convention.

### F. How this gets verified
Integration test: run the full pipeline against a small set of synthetic/known pages and assert the execution order matches the declared graph; assert step-4 checks that don't depend on each other are actually invoked concurrently, not serially (a straightforward timing assertion).

### G. What evidence to report
The orchestrator's own execution log (which skills ran, in what order, with what timing) should be retained internally for debugging even if not surfaced in the end-user report — directly useful for diagnosing Cluster H's runtime-budget violations.

### H. Criticality
High — an incorrect dependency order (e.g., running W's query-generation before V's site-type classification, which W's own document assumes as an input) produces silently degraded results, not a crash — the worse kind of failure.

### I. Correct implementation
Encode the dependency graph explicitly (a DAG, not implicit ordering in code) so it's inspectable and testable, rather than an order that happens to work because of how functions were called.

### J. Anti-patterns to avoid
A monolithic entrypoint that reimplements checks inline instead of delegating to the narrow skills (directly contradicts the handout's stated architecture preference); skills that silently assume another skill already ran without declaring that dependency explicitly.

### K. Failure modes if missed
Race conditions if parallelizable steps aren't actually independent (e.g., if two "parallel" checks both mutate shared state); silent quality degradation if sequencing is wrong but nothing crashes.

### L. Counterexamples
For a very simple, low-page-count site, some of the parallel step-4 checks may have nothing to do (e.g., no comparison pages found, so Topic W's Cluster E never fires) — this isn't a failure, just an empty result, and the orchestrator should treat "skill ran, found nothing" as distinct from "skill failed to run" (directly connects to Cluster E's error-handling design).

### M. Portable?
Yes — the dependency-graph pattern is standard orchestration practice, independent of this project's specific skill content.

### N. Deliverable
The orchestrator skill itself, plus a written (even informally diagrammed) dependency graph the whole team can review before implementation starts.

### O. Relationship to other clusters
This is the cluster every other cluster in this document ultimately serves — Cluster D's contracts are what let the orchestrator validate hand-offs; Cluster E's reliability patterns are what keep the orchestrator's calls from cascading failures; Cluster H's budget constraints are what the orchestrator's scheduling has to respect.

---

## Cluster D — Contracts & structured I/O
**Covers:** Z12 (input contracts), Z13 (output contracts), Z14 (structured outputs)

### A. What we need to understand
The concrete schema every skill must accept and return, so the orchestrator (Cluster C) can validate hand-offs mechanically instead of by convention, and so Cluster F's aggregation step has something uniform to merge.

### B. Why it matters
With ~8-15 independently-developed skills (likely by different team members, per this project's own multi-researcher structure), an undeclared or inconsistent I/O shape is the single most likely integration failure at merge time — this is the direct engineering analogue of the handout's own required finding schema (`id, title, severity, evidence, suggested_action`), extended to *every* internal hand-off, not just the final report.

### C. Current evidence

**INFERENCE (a concrete contract design, synthesized from this project's own accumulated cross-references, not from external literature)** — Every skill in this marketplace should accept a common input envelope and return a common output envelope, regardless of what it checks:

```json
// INPUT contract (every skill)
{
  "run_id": "uuid",
  "target_domain_family": ["stripe.com", "docs.stripe.com", "..."],
  "site_type_classification": { "cluster": "D", "confidence": 0.82, "evidence": ["..."] },
  "crawled_pages": [ { "url": "...", "template_cluster_id": "...", "raw_html_ref": "...", "rendered_dom_ref": "..." } ],
  "upstream_outputs": { "W": {}, "X": {} }
}
```
```json
// OUTPUT contract (every skill)
{
  "skill_id": "query-to-page-alignment-auditor",
  "run_id": "uuid",
  "status": "ok | partial | failed",
  "findings": [
    {
      "finding_id": "W-CLUSTER-C-<hash>",
      "claim": "...",
      "evidence": [ { "url": "...", "selector_or_offset": "...", "extracted_text": "...", "extraction_method": "static_html | rendered_dom | llm_summary" } ],
      "confidence": 0.0,
      "severity_hint": "low | medium | high",
      "suggested_action": "..."
    }
  ],
  "errors": [ { "code": "...", "message": "...", "recoverable": true } ],
  "timing_ms": 0
}
```

**INFERENCE** — Declaring `upstream_outputs` explicitly per skill (rather than giving every skill the entire accumulated state) directly enforces the dependency graph from Cluster C — a skill that tries to read an upstream output it didn't declare should fail validation, catching a broken assumption at integration time rather than at demo time.

### D. Important mechanisms
The unifying insight: **`status: partial` is not an edge case, it's a first-class, expected state** — given the runtime and read-only constraints, some skills will legitimately finish some but not all of their checks (Cluster E), and the contract needs to represent that honestly rather than forcing a binary success/failure that would either hide partial results or crash the whole run over one slow page.

### E. Concrete artifacts
The two JSON Schemas above (input/output envelopes), versioned, and enforced via schema validation at every skill boundary — not just documented as convention.

### F. How this gets verified
Schema-validate every skill's actual output against the declared contract in CI, using real (not mocked) sample runs; fail the build if any skill's output doesn't validate.

### G. What evidence to report
N/A directly to end users — this is the internal plumbing the final report (AB) is built from.

### H. Criticality
High — an inconsistent contract is the most likely single cause of a broken demo, since it's exactly the kind of thing that works fine when one person tests their own skill in isolation and breaks silently at integration.

### I. Correct implementation
Freeze the two schemas early (before most skill implementation work happens) and treat changes to them as a team-wide, reviewed decision, not something any one skill's author changes unilaterally.

### J. Anti-patterns to avoid
Each skill inventing its own ad-hoc output shape "because it's simpler for now"; passing the entire crawl state to every skill instead of the declared subset (defeats the dependency-validation benefit above, and bloats context per Cluster B).

### K. Failure modes if missed
Silent integration failures discovered only at final merge/demo time, which is the most expensive possible time to discover them.

### L. Counterexamples
None — a shared contract is strictly beneficial here; the only real design question is exact field names/shape, not whether to have one.

### M. Portable?
Yes — this is a standard microservice/pipeline contract pattern, independent of this project's specific content.

### N. Deliverable
The two frozen JSON Schemas, published somewhere every skill author references before writing their skill's output logic.

### O. Relationship to other clusters
Directly enables Cluster C's orchestration validation and Cluster F's aggregation (a uniform `findings[]` shape is what makes cross-skill deduplication mechanically possible at all).

---

## Cluster E — Reliability engineering
**Covers:** Z15 (determinism), Z16 (idempotency), Z17 (error handling), Z18 (timeouts), Z19 (retry strategy), Z20 (partial failure)

### A. What we need to understand
How the pipeline behaves when the real world doesn't cooperate — a slow page, a flaky network request, a page that changes between two fetches within the same run, a skill that throws — given that this all has to happen inside a hard 5-minute wall-clock budget with no room for open-ended retries.

### B. Why it matters
Every check documented across V/W/X/Y assumes it gets to run against real, live, unpredictable websites — this cluster is what keeps one uncooperative page from taking down the whole audit.

### C. Current evidence

**INFERENCE (standard, well-established distributed-systems/pipeline engineering patterns, applied to this project's specific constraints)** — A concrete, budgeted design, since "handle errors well" isn't itself an engineering spec:

- **Determinism (Z15):** Every check tagged `deterministic` in Cluster A's classification (per this project's own earlier discipline, established across V/W/X/Y — "use LLM reasoning only where semantic interpretation is actually required") must produce byte-identical output for byte-identical input. Checks tagged `hybrid`/`LLM-judgment` cannot be fully deterministic (model sampling), but should be run at temperature 0 (or the lowest available) specifically to maximize run-to-run consistency, and their non-determinism should be visible in the confidence field (Cluster F), not hidden.
- **Idempotency (Z16):** Re-running the same skill against the same crawled snapshot (not a fresh live fetch) must produce the same finding set. This matters concretely for retry logic (Z19): a retry must not double-count a finding or re-fetch a page that already succeeded.
- **Timeouts (Z18), budgeted explicitly against the 5-minute total:** e.g., crawl/discovery (Cluster C step 1-2): 60s cap; per-page fetch: 8s cap; per-skill total: 45s cap; aggregation/report assembly: 15s cap — these are illustrative starting numbers, not externally validated, and should be tuned against real runs, but the key design point is that **every stage needs its own explicit sub-budget that sums to under 5 minutes**, not one global timeout that lets an early stage silently consume the whole budget.
- **Retry strategy (Z19):** Exponential backoff with a small, bounded attempt count (e.g., 2 retries, base delay 500ms, capped) for transient failures (network timeout, 5xx) only — never retry on 4xx (the page genuinely doesn't exist/isn't accessible) or on a robots.txt disallow, since retrying those wastes budget on a failure that won't resolve.
- **Partial failure (Z20), directly connecting to Cluster D's `status: partial`:** If a skill times out on 2 of 10 sampled pages, it should return findings for the 8 that succeeded with `status: partial` and an explicit error entry for the 2 that didn't — never fail the entire skill (and cascade to fail the entire run) over a subset of failures, and never silently drop the failures without reporting them.
- **Error handling (Z17):** A small, closed taxonomy of error codes (`FETCH_TIMEOUT`, `ROBOTS_DISALLOWED`, `PARSE_FAILURE`, `RATE_LIMITED`, `SKILL_INTERNAL_ERROR`) rather than free-text error messages, so the orchestrator (Cluster C) can make mechanical decisions (retry vs. skip vs. abort) based on the code, not by string-matching a message.

### D. Important mechanisms
The unifying insight: **every reliability decision in this cluster has to be made in terms of the 5-minute budget explicitly, not as an abstract "make it robust" goal** — a retry strategy that's reasonable for a backend service with no time limit (more attempts, longer backoff) is wrong here specifically because of Cluster H's constraint.

### E. Concrete artifacts
A shared timeout-budget table (illustrative numbers above) referenced by every skill; the closed error-code taxonomy; a retry-policy function shared across all skills rather than each reimplementing its own.

### F. How this gets verified
Chaos-style testing: deliberately inject a slow/failing fetch for one page in a test run and assert the overall pipeline still completes within budget with a `partial` status, not a hard failure.

### G. What evidence to report
Partial-failure findings should be visible in the final report as an explicit "N of M pages could not be checked, reason: X" note (this is also Pulkit's AF template-sampling concern — "found on N/M pages" — the same honesty principle applied to failures as to sampling coverage).

### H. Criticality
High — this is what stands between "the tool works" and "the tool times out or crashes on the one real-world site chosen for judging that happens to have a slow page."

### I. Correct implementation
Build the timeout/retry/error-code infrastructure once, in a shared library every skill imports, rather than per-skill — directly connects to Cluster B's `scripts/` convention for shared deterministic code.

### J. Anti-patterns to avoid
Unbounded retries "to be safe" (directly threatens the 5-minute budget); a single global try/catch that swallows all errors into one generic failure state, losing the information needed for Cluster C's orchestrator to make a sensible decision.

### K. Failure modes if missed
Cascading failure (one slow page takes down the whole run) or budget overrun (silent accumulation of retry delays across many pages).

### L. Counterexamples
None — these are foundational reliability requirements given the stated constraints, not situational judgment calls.

### M. Portable?
Yes — entirely standard software-reliability patterns, independent of this project's specific content.

### N. Deliverable
A shared reliability library (timeout wrapper, retry-with-backoff function, error-code enum) used by every skill's `scripts/`.

### O. Relationship to other clusters
Directly enables Cluster D's `status: partial` contract value; directly gated by Cluster H's overall runtime budget.

---

## Cluster F — Evidence & finding lifecycle (infrastructure only — see Section 0's disclosed boundary)
**Covers:** Z21 (evidence provenance), Z22 (finding IDs), Z23 (severity standardization), Z24 (finding deduplication), Z25 (cross-skill aggregation), Z26 (conflict resolution), Z27 (confidence propagation)

### A. What we need to understand
The mechanical pipeline that takes ~8-15 skills' raw, possibly-overlapping, possibly-contradictory findings and turns them into the single, deduplicated, consistently-scored list the handout's own required schema expects — **as infrastructure**, deferring the actual severity/root-cause *policy* to Harsh's S/T per this document's disclosed boundary.

### B. Why it matters
Given how many of this project's own topics (V, W, X, Y, Pulkit's, Harsh's) can plausibly surface *the same underlying problem* from different angles (e.g., a JS-only pricing page could be flagged by Pulkit's extraction work, Topic W's evidence-availability check, and Topic V's commercial-cluster check, all independently), **without a real deduplication mechanism the final report would look padded and low-quality even though every individual finding is legitimate** — this is a direct, concrete risk to the "false positives / signal quality" axis of the rubric.

### C. Current evidence

**INFERENCE (concrete design, synthesized from this project's own findings register conventions used consistently across V/W/X/Y)** — This project has already, informally, converged on a `FINDING ID` format across every document (`V-01`, `W-03`, `X-02`, etc.) — Cluster F formalizes this into an actual system:

- **Finding IDs (Z22):** `<skill-id>-<content-hash-of-normalized-claim+url>` — deterministic (same underlying issue always produces the same ID if found twice), not a random UUID, specifically so Z24's deduplication can use ID collision as one detection signal rather than relying solely on semantic similarity.
- **Evidence provenance (Z21):** Every finding's evidence array (per Cluster D's schema) must carry `url`, `extraction_method` (static_html / rendered_dom / llm_summary), and a `selector_or_offset` precise enough to relocate the exact evidence — directly reusing Topic X's Scroll-To-Text-Fragment mechanism (X-02) as a natural, already-researched way to encode "offset" precisely and in a format that's independently useful (a human reviewer could click through to the exact highlighted passage).
- **Deduplication (Z24):** Two findings from different skills should be merged if (a) their finding IDs collide (same normalized claim+URL), or (b) their evidence arrays overlap on the same URL+selector *and* an LLM-judgment pass confirms they describe the same underlying issue (not just the same page) — pure URL overlap alone is too coarse, since two skills can legitimately find two different real problems on the same page.
- **Cross-skill aggregation (Z25):** A merge, not a simple concatenation — merged findings should retain *all* contributing skills' evidence (strengthening the finding, since independent corroboration from multiple detection angles is itself a positive confidence signal) rather than arbitrarily keeping only one skill's version and discarding the other's evidence.
- **Conflict resolution (Z26):** The genuinely hard case is two skills disagreeing, not duplicating — e.g., Topic V's classifier says a page is enterprise-SaaS (pricing-gating is legitimate) while a naive pricing-extraction check flags missing pricing as a defect. **Resolution policy: site-type/context-classification findings (V) take precedence over generic content-quality findings (Pulkit, W) when they directly contradict**, since V's whole purpose is supplying the context that makes a generic check's verdict correct or incorrect in the first place — this is a specific, concrete precedence rule, not a vague "use judgment" instruction, and should be encoded as an explicit rule table, not left to whichever skill's finding happens to be processed first.
- **Confidence propagation (Z27):** When findings merge (Z24) or when a finding depends on an upstream classification (e.g., a Cluster A/B alignment check that depends on Topic V's site-type confidence), the merged/downstream confidence should be **no higher than the lowest-confidence input** — a simple, conservative, defensible rule (rather than averaging, which can produce a falsely-confident result when one genuinely uncertain input is combined with several confident ones) — directly consistent with the "don't turn weak signals into hard rules" principle already stated as a project-wide standard.

### D. Important mechanisms
The unifying insight: **this entire cluster only works if Cluster D's output contract is actually uniform across every skill** — deduplication, aggregation, and confidence propagation are all mechanically impossible to implement generically if each skill's findings have a different shape. This is the direct payoff of Cluster D's contract discipline, made concrete.

### E. Concrete artifacts
The finding-ID hashing function; the dedup/merge algorithm (ID-collision fast path + evidence-overlap-plus-LLM-confirmation slow path); the conflict-precedence rule table (starting with the one explicit rule above: V-classification beats generic content checks on direct contradiction); the confidence-propagation function (min, not average).

### F. How this gets verified
Unit tests with synthetic duplicate/conflicting findings fed through the pipeline, asserting the expected merge/precedence/confidence outcome.

### G. What evidence to report
The final, merged finding should retain a `contributing_skills` list (which skills independently found this) — this is directly useful, visible evidence of corroboration strength in the final report, not just internal bookkeeping.

### H. Criticality
High — this is the mechanism standing between "a coherent, professional-looking report" and "a padded, repetitive, or self-contradictory one," which directly affects perceived quality independent of any individual check's correctness.

### I. Correct implementation
Build this as a single, shared aggregation stage the orchestrator (Cluster C) runs once, after all skills complete — not something each skill does partially and inconsistently on its own.

### J. Anti-patterns to avoid
Naive concatenation with no dedup at all (padded-looking report); dedup based on exact-string matching only (misses genuine duplicates phrased differently by different skills); resolving conflicts by "whichever skill ran last wins" (arbitrary, not a real policy).

### K. Failure modes if missed
A report with 3 near-identical findings about the same underlying pricing-page issue, which reads as low-quality regardless of how good each individual skill's detection logic is.

### L. Counterexamples
Two findings on the same page that are genuinely different problems (a pricing-staleness issue and an unrelated accessibility issue) must not be merged just because they share a URL — Z24's design explicitly requires the evidence-overlap-plus-confirmation step for exactly this reason.

### M. Portable?
Yes — this is a standard evidence-aggregation pattern; the one project-specific piece is the conflict-precedence rule table, which should grow as more conflict cases are discovered during integration testing, not be assumed complete from this document alone.

### N. Deliverable
The aggregation-stage implementation (dedup, merge, conflict-precedence, confidence-propagation functions), handed the severity *values* by Harsh's S and root-cause *narratives* by Harsh's T, per this document's disclosed infrastructure/policy boundary.

### O. Relationship to other clusters
Directly depends on Cluster D's uniform contract; directly feeds Cluster G's recommendation ranking (a merged, corroborated finding should rank recommendations differently than a single-source one); explicitly coordinates with, rather than duplicates, Harsh's S and T.

---

## Cluster G — Recommendation layer (infrastructure only)
**Covers:** Z28 (recommendation generation), Z29 (recommendation prioritization)

### A. What we need to understand
The mechanical contract and ranking function for turning Cluster F's merged findings into the handout's required `suggested_action` field, and how to rank multiple recommendations when the runtime/report-length budget can't surface all of them with equal prominence.

### B. Why it matters
The rubric explicitly rewards "suggested actions... beyond the detected problems" — but a long, unranked list of remediation suggestions is nearly as unhelpful as none, especially under this project's own stated goal of not producing "a big SEO checklist."

### C. Current evidence

**INFERENCE (concrete design)** — Recommendation *generation* (the actual remediation text) is explicitly out of this cluster's scope per Section 0's disclosed boundary — that's Topic AC's content. What Z28/Z29 own mechanically: **every recommendation must reference the specific finding ID(s) it addresses** (never a free-floating suggestion untraceable to evidence), and **prioritization is a function of (a) the finding's post-aggregation severity (from Harsh's S) and (b) the number of contributing skills (from Cluster F's `contributing_skills`, as a corroboration-strength multiplier) and (c) estimated remediation cost** (a cheap fix — add a `<th>` attribute — should rank above an equally-severe but expensive fix — restructure a page's entire information architecture — when severity is otherwise comparable, since the report's value is partly about what's actually actionable soon, not just what's theoretically worst).

**INFERENCE** — Because remediation-cost estimation is itself a judgment call with no established external metric to ground it in (unlike severity, which at least has Harsh's S to define it), this should default to a simple three-tier heuristic (markup/attribute-level fix vs. content-rewrite-level fix vs. structural/architectural fix) rather than a false-precision numeric cost score — consistent with this project's own repeated principle of not manufacturing false confidence where none is warranted.

### D. Important mechanisms
The unifying insight: prioritization is genuinely three-dimensional (severity × corroboration × cost), and collapsing it to severity alone (the most obvious, simplest approach) would systematically bury cheap, high-value fixes beneath severe-but-expensive ones that a team is less likely to act on soon — directly relevant to the rubric's own emphasis on actionable suggestions.

### E. Concrete artifacts
The ranking function `rank = f(severity, contributing_skill_count, cost_tier)`; the requirement that every recommendation object carries a `finding_ids: []` back-reference.

### F. How this gets verified
Unit tests with synthetic findings at varying severity/corroboration/cost combinations, asserting the ranking matches the intended three-dimensional logic rather than collapsing to severity-only ordering.

### G. What evidence to report
The final report's recommendation list, each entry traceable to its finding(s), ranked per the function above — this is a direct structural requirement of the handout's own output schema, extended with explicit ranking logic the handout doesn't itself specify.

### H. Criticality
Medium-high — doesn't break the pipeline if done naively (severity-only ranking still "works"), but directly affects the perceived actionability quality the rubric rewards.

### I. Correct implementation
Build the ranking function as a pure, testable function separate from whatever generates the recommendation text (AC's territory) — same infrastructure/policy separation as Cluster F.

### J. Anti-patterns to avoid
Free-floating recommendations with no `finding_ids` back-reference (untraceable, looks like generic advice rather than evidence-backed); severity-only ranking that buries cheap wins.

### K. Failure modes if missed
A technically-correct but practically-unhelpful report where the first ten recommendations are all "restructure your information architecture"-scale suggestions and the actually-quick wins are buried on page three.

### L. Counterexamples
None specific — the three-dimensional ranking is a strict improvement over one-dimensional ranking for this use case.

### M. Portable?
Yes — standard prioritization-matrix pattern (impact × effort), applied here with corroboration strength as a third, project-specific dimension.

### N. Deliverable
The ranking function and the `finding_ids`-backed recommendation schema, handed the actual recommendation text by AC.

### O. Relationship to other clusters
Directly consumes Cluster F's merged findings and `contributing_skills` count; coordinates with, doesn't duplicate, Topic AC.

---

## Cluster H — Runtime safety & submission constraints
**Covers:** Z30 (safe read-only execution), Z31 (robots compliance), Z32 (rate limiting), Z33 (sandboxing), Z34 (runtime constraints), Z35 (under-5-minute execution), Z36 (50MB submission constraint), Z37 (provider neutrality), Z38 (no external service dependencies)

### A. What we need to understand
The concrete, checkable engineering requirements that make the submission legal and safe under the handout's own explicit rules — this cluster is the most directly, literally grounded in the handout text of anything in this document.

### B. Why it matters
These aren't quality-of-life engineering nice-to-haves — several are explicit, named disqualifying constraints in the Round 3 handout (read-only, robots.txt-respecting, no rate abuse, ≤50MB, no pretrained weights). Getting any of these wrong risks the submission being invalid regardless of how good the underlying research is.

### C. Current evidence

**FACT (direct restatement of the handout's own stated constraints, not external research)** — Read-only auditing; no destructive actions; respect robots.txt; no authenticated-area manipulation; no rate abuse; portable skills; exactly one entrypoint; <5-minute runtime for a typical site; ≤50MB submission; no pretrained model weights.

**INFERENCE (concrete engineering translation of each)**
- **Safe read-only execution (Z30):** Every skill's `scripts/` code should be auditable as containing no write/POST/PUT/DELETE HTTP calls, no form submission, no authenticated-session usage — enforceable by a simple static grep/AST check in CI (e.g., flag any `requests.post`/`fetch(..., {method: 'POST'})` call) rather than relying on manual review alone.
- **Robots compliance (Z31):** Fetch and parse `robots.txt` once per domain-family (from V's discovery step) at the start of a run, cache the result, and check every subsequent fetch against it before requesting — this should be shared infrastructure (Cluster E's shared library), not reimplemented per skill, since a per-skill reimplementation risks inconsistent compliance.
- **Rate limiting (Z32):** A shared, global (not per-skill) request scheduler enforcing a conservative per-domain concurrency cap and minimum inter-request delay — global specifically because multiple skills fetching the same domain concurrently, each unaware of the others' request rate, is exactly how "no rate abuse" gets accidentally violated even when each individual skill is well-behaved in isolation.
- **Sandboxing (Z33):** Given Cluster A's finding that `allowed-tools` does **not** enforce a boundary, actual execution sandboxing (no filesystem writes outside a designated scratch area, no arbitrary network egress beyond the target domain family) has to be enforced at the harness/runtime level, not assumed from frontmatter declarations — this is a direct, load-bearing correction to a plausible but wrong assumption a team could otherwise make.
- **Runtime constraints / under-5-minute execution (Z34/Z35):** Directly operationalized by Cluster E's per-stage timeout budget table; this sub-topic's contribution beyond Cluster E is the *submission-time* verification — actually timing a full run against a handful of real, diverse test sites (not just unit tests) before submission, since aggregate real-world timing (network latency, actual page complexity) is exactly what per-stage unit budgets can't fully predict in isolation.
- **50MB submission constraint (Z36):** Concretely threatened by two things specifically: bundling any ML model weights (explicitly disallowed anyway) and bundling large reference datasets in `assets/`/`references/` unnecessarily — an audit of total package size should be a CI gate, not a last-minute check, and should specifically flag any binary assets, since the project's actual logic (Markdown instructions, small JSON schemas, short scripts) should be nowhere near this limit if kept lean.
- **Provider neutrality (Z37):** The skill's own instructions and scripts shouldn't hardcode assumptions about which specific LLM vendor/model is running them (e.g., vendor-specific prompt-formatting tricks) — since the spec itself is explicitly adopted across "26+ platforms" (Cluster A's research), and the hackathon's own framing doesn't guarantee a single fixed evaluation harness; deterministic checks (Cluster E) are inherently provider-neutral, and LLM-judgment checks should be written as plain natural-language instructions rather than provider-specific prompt syntax.
- **No external service dependencies (Z38):** No skill should require a paid third-party API (a commercial SEO API, a paid entity-resolution service) as a hard dependency — everything in this project's own accumulated research (Pulkit's extraction work, this document's Clusters A-G, V/W/X/Y's checks) is designed around open web standards, standard libraries, and the model's own reasoning, which is consistent with this constraint by construction rather than needing a late redesign; this should be explicitly double-checked against every skill's actual `scripts/` dependencies before submission, since it's easy to accidentally introduce a dependency (e.g., a convenient but paid geolocation API for Topic V's location checks) without noticing during development.

### D. Important mechanisms
The unifying insight: **almost every item in this cluster is a hard, binary compliance gate, not a quality spectrum** — unlike most of this project's website-facing findings (which involve severity, confidence, and nuance), these should be treated as CI-enforced pass/fail checks precisely because the handout treats them the same way.

### E. Concrete artifacts
A pre-submission checklist/CI pipeline checking: no write-HTTP-verbs in any skill's code; a shared robots.txt-checking and rate-limiting library used by all skills; a total package size check (<50MB, flagging binaries); a dependency audit (no paid/external API calls); a real, timed end-to-end run against several diverse test sites logged and attached to the submission as evidence of the <5-minute claim.

### F. How this gets verified
All of the above, as literal automated CI gates plus one manual real-world timing run — not left to a final read-through.

### G. What evidence to report
Internally: a compliance checklist result attached to the submission. Not necessarily surfaced to end users of the tool itself.

### H. Criticality
Highest in this entire document — several of these are stated, named disqualification risks in the handout, not quality-of-life concerns.

### I. Correct implementation
Build the shared robots/rate-limit library and the write-verb static check early, since every other skill depends on them being correct rather than each skill needing to reinvent compliance.

### J. Anti-patterns to avoid
Assuming `allowed-tools` frontmatter enforces sandboxing (directly corrected in this cluster, per Cluster A's finding); per-skill, uncoordinated rate limiting that collectively violates a global rate cap even though each skill individually looks compliant; discovering the 50MB or 5-minute constraint is violated only at final submission packaging.

### K. Failure modes if missed
Submission disqualification (the worst-case, entirely avoidable outcome) or, short of that, a demo-time failure (timeout, rate-limit block from the target site) in front of judges.

### L. Counterexamples
None — these are hard constraints stated by the handout itself, not judgment calls with legitimate exceptions.

### M. Portable?
Yes — this cluster's checks apply identically regardless of which skill's content triggered them.

### N. Deliverable
The shared compliance library (robots + rate-limiting + write-verb static check), the CI size/dependency gates, and one documented, timed, real-site end-to-end run as submission evidence.

### O. Relationship to other clusters
Directly constrains Cluster E's timeout budgets and Cluster C's orchestration scheduling; corrects a specific, plausible misunderstanding surfaced in Cluster A (`allowed-tools` ≠ sandboxing).

---

## 3. Findings register

---
**FINDING ID:** Z-01
**Researcher:** Soham
**Research Area:** Z — Agent Skill Design
**Research Question:** What does the current, authoritative Agent Skills specification actually require, and is there a common, plausible misunderstanding worth correcting before implementation?
**Observation:** The spec (agentskills.io/specification) requires only `name` and `description` in frontmatter; `allowed-tools` is explicitly experimental and, critically, does **not** restrict tool use — it only pre-approves listed tools without blocking others, per the spec's own stated caveat.
**Evidence:** Direct retrieval of the current specification's frontmatter field table and the `allowed-tools` field description; corroborated by independent third-party documentation (agent-skills Rust crate docs, agentpatterns.ai's Claude Code frontmatter reference) describing the identical caveat.
**Sources:** github.com/agentskills/agentskills/blob/main/docs/specification.mdx; agentpatterns.ai/tool-engineering/skill-frontmatter-reference; docs.rs/crate/agent-skills.
**Pattern:** A team could reasonably but incorrectly assume `allowed-tools` functions as a security/sandboxing boundary (the name itself suggests this) — it does not, and actual execution safety (Cluster H, Z33) has to be enforced by the harness/runtime, not by this frontmatter field.
**Counterexamples:** None — this is the spec's own explicit statement, not an inference.
**Hypothesis:** N/A.
**Signal:** N/A — an engineering/documentation finding, not a website signal.
**How to Detect:** N/A.
**Evidence Output:** A note in the marketplace's own internal documentation flagging this distinction explicitly.
**False Positives:** N/A.
**False Negatives:** N/A.
**Severity:** High if missed — a team relying on this as a security boundary would ship an actually-unsandboxed system believing it was sandboxed.
**Recommended Fix:** Implement real sandboxing at the runtime/harness level (Cluster H); document `allowed-tools` internally as a pre-approval hint only.
**Generalization:** Applies to any team building on this spec, not project-specific.
**Candidate Skill:** N/A — an implementation-discipline finding, not a skill.
**Related Skills:** Cluster H (Z33).
**Confidence:** HIGH — directly sourced from the current, primary specification text.

---
**FINDING ID:** Z-02
**Researcher:** Soham
**Research Area:** Z — Agent Skill Design
**Research Question:** Does this project's own accumulated cross-references (across V, W, X, Y) already imply a concrete required execution order, or does the entrypoint's sequencing need to be invented from scratch?
**Observation:** Synthesizing every "feeds," "depends on," and "gated by" cross-reference already stated across the V, W, X, and Y documents produces a fully specified dependency DAG (Cluster C, Section C) without needing any new external research — the ordering was already implied, just never assembled into one artifact.
**Evidence:** Direct synthesis of this project's own prior documents (V's Section 6, W's Section 5, X's Section 6, Y's Section 5 cross-reference lists).
**Sources:** Internal — this project's own V/W/X/Y research documents.
**Pattern:** This is a case where "new research" for Topic Z means assembling and making explicit something the rest of the project already collectively knew implicitly — directly analogous to how Pulkit found E1-E18 collapsed into already-established mechanisms; here, the entrypoint's design collapses into already-stated dependencies.
**Counterexamples:** None found — every edge in the assembled graph traces to an explicit statement in a prior document; none were invented for this document.
**Hypothesis:** N/A — direct synthesis, not a new empirical claim.
**Signal:** N/A.
**How to Detect:** N/A.
**Evidence Output:** The DAG itself (Cluster C, Section C) as a reviewable artifact.
**False Positives:** N/A.
**False Negatives:** A dependency could exist that no prior document stated explicitly (an implicit assumption never written down) — this synthesis can only be as complete as what was actually documented, and should be re-checked against actual skill implementations, not assumed final.
**Severity:** High if wrong — an incorrect execution order produces silent quality degradation, not a crash (per Cluster C's own finding).
**Recommended Fix:** Team review of the assembled DAG before implementation begins, specifically hunting for undocumented implicit dependencies.
**Generalization:** N/A — project-specific by nature.
**Candidate Skill:** The entrypoint orchestrator itself.
**Related Skills:** All of V, W, X, Y, Pulkit's, Harsh's topics.
**Confidence:** HIGH for the edges that were explicitly stated in prior documents; MEDIUM for completeness (unstated dependencies may still exist).

---

## 4. Required end-of-topic synthesis

**Strongest validated insight:**
The dependency graph assembled in Cluster C (Z-02) isn't new research in the traditional sense — it's the discovery that this project's own five prior documents (V, W, X, Y, plus Pulkit's and Harsh's cross-references) already collectively specified the entrypoint's required execution order, just never in one place. This is a genuinely high-confidence, low-risk deliverable precisely because every edge traces to something already stated and reviewed, not a new invented architecture.

**Strongest unvalidated hypothesis:**
The illustrative per-stage timeout budget numbers in Cluster E (60s crawl, 8s per-page fetch, 45s per-skill, etc.) are a reasonable starting allocation but have not been validated against a real, timed end-to-end run on an actual diverse set of sites — Cluster H's own requirement (a real timed run before submission) is exactly the test this hypothesis needs, and it should be run early enough to leave time to rebalance the budget if the numbers are wrong.

**Strongest candidate skill:**
The **entrypoint orchestrator itself** (Cluster C's deliverable), because it's the one component every other topic's cross-references already assume exists, and because Clusters D, E, F, G, and H all specify infrastructure that has no other natural home besides being invoked by this orchestrator.

**Weakest assumption we should investigate next:**
Two, both flagged explicitly: (1) whether the conflict-resolution precedence rule in Cluster F (site-type classification beats generic content checks on direct contradiction) is actually complete — it's currently a single named rule covering one concrete case (pricing-gating), and more conflict cases will likely surface once V/W/X/Y/Pulkit/Harsh's actual checks are implemented and run together; and (2) whether the 50MB and 5-minute constraints are genuinely comfortable margins or tight ones — this document assumes they're comfortable given how lean the actual logic is (mostly instructions, small schemas, short scripts, no model weights), but that assumption should be verified against an actual packaged build, not assumed from the specification's description of what a skill typically contains.

---

## 5. Cross-references for the Combine & Code phase

- **Cluster A/B ↔ every skill-authoring researcher (Pulkit, Harsh, Soham):** The frontmatter/description-writing convention and the Tier 2/Tier 3 content split should be agreed and documented before individual skill implementation starts, not discovered inconsistently at merge time.
- **Cluster C ↔ all of V, W, X, Y, Pulkit's, Harsh's topics:** The dependency DAG is the literal, concrete home for every "feeds"/"depends on" cross-reference made across this entire project — this document is where those get operationalized, not just cited.
- **Cluster D ↔ the handout's own required finding schema (`id, title, severity, evidence, suggested_action`):** This project's internal contract is a strict superset of that schema, extended with `status`, `confidence`, `contributing_skills`, and `extraction_method` — AB (Report Design) should treat the handout's schema as the minimum, not the whole contract.
- **Cluster F ↔ Harsh's S (Scoring & Severity) and T (Root-Cause Analysis):** Explicit infrastructure/policy boundary — Z owns the merge/dedup/precedence mechanics; S/T own the actual severity values and causal narratives. This needs a direct conversation with Harsh before implementation, not an assumed division.
- **Cluster G ↔ Topic AC (Proactive Recommendations, mine):** Same infrastructure/policy boundary — Z owns the ranking function and schema; AC owns the recommendation text/reasoning.
- **Cluster H ↔ Pulkit's AF (Template Detection):** The crawl-strategy/template-sampling step in Cluster C's dependency graph is AF's deliverable, consumed directly by Cluster H's runtime-budget accounting.
- **Every cluster ↔ Topic U (False Positives, mine):** Cluster F's conflict-resolution rule table is, functionally, an extension of U's suppression-rule registry applied to inter-skill conflicts rather than single-skill false positives — worth discussing whether these should literally be the same rule table or two coordinated ones.
