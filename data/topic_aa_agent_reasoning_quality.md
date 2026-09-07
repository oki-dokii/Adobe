# Topic AA — Agent Reasoning Quality (AA1–AA20)
**Researcher:** Soham | **Research Area:** AA — Agent Reasoning Quality
**Priority:** Very High

---

## 0. Framing — a meta-topic, and three overlaps that need disclosing before anyone builds this twice

Like Topic Z, AA isn't about website signals — it's about the quality of the *reasoning process* the marketplace's own skills use while producing findings. That makes it easy to accidentally duplicate work already done elsewhere in this project, so three boundaries need stating up front:

- **Cluster A (AA1–AA4, deterministic vs. LLM) is not re-litigating Topic Z's Cluster E.** Z already established the *tagging convention* (`deterministic` / `hybrid` / `LLM-judgment`) and the *plumbing* around it (temperature-0 for consistency, confidence-field visibility). AA's job is the *decision criteria* — the actual test for which side of that line a given check belongs on, and what goes wrong when a team gets it wrong in either direction.
- **Cluster B (AA5, AA6, AA10, AA11, evidence-first reasoning) is not Pulkit's F1/F2.** Pulkit's work audits whether the *target website's* content is faithful/well-supported. AA audits whether **our own marketplace's LLM-judgment steps** stay grounded in the evidence they extracted, rather than filling gaps from the model's general knowledge about "what websites like this usually do." Same underlying faithfulness/grounding concept, applied to two different subjects — easy to conflate, worth stating plainly so it isn't.
- **Cluster E (AA12, AA13, cross-checking/contradiction) is not Topic Z's Cluster F.** Z's dedup/conflict-resolution is mechanical merge logic applied *after* findings exist. AA's cross-checking is a reasoning discipline applied *before* a finding is finalized at all — actively trying to falsify a candidate finding, mirroring the "actively search for counterexamples" standard this entire project has held itself to at the research level, now applied to the *runtime* agent's own behavior.

The twenty sub-topics collapse into seven clusters.

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. Cluster map

| Sub-topics | Cluster |
|---|---|
| AA1, AA2, AA3, AA4 | **A — Deterministic/LLM boundary criteria** |
| AA5, AA6, AA10, AA11 | **B — Evidence-first reasoning & claim extraction** |
| AA7, AA8 | **C — Hypothesis-driven verification loop** |
| AA9, AA17, AA18 | **D — Confidence calibration & uncertainty states** |
| AA12, AA13 | **E — Active contradiction-seeking & cross-checking** |
| AA14, AA15, AA16 | **F — Structured reasoning, decision trees & fallback** |
| AA19, AA20 | **G — Explainability & reproducibility** |

---

## Cluster A — Deterministic/LLM boundary criteria
**Covers:** AA1 (deterministic vs. LLM judgment), AA2 (where LLM reasoning is useful), AA3 (where deterministic code is better), AA4 (hybrid architecture)

### A. What we need to understand
A genuine test — not a vibe — for deciding which side of the deterministic/LLM line a given check belongs on, since this project has repeatedly invoked the principle ("use LLM reasoning only where semantic interpretation is actually required") without ever stating the test itself.

### B. Why it matters
Every prior topic in this project (V, W, X, Y, Z) has assumed this classification is doable but deferred the actual criteria to "common sense" — that's a gap AA is positioned to close, and getting it wrong in either direction has a real cost: over-using LLM judgment where code would do inflates runtime/cost against the 5-minute budget and introduces the overconfidence risk documented in Cluster D; under-using it produces shallow pattern-matching dressed up as a "check" where genuine interpretation was actually needed.

### C. Current evidence

**INFERENCE (a concrete, three-question test, synthesized from this project's own accumulated examples across V/W/X/Y rather than external literature)** — A check belongs on the deterministic side if and only if all three hold: (1) the check's *inputs* are fully specified by the crawl (raw HTML, a JSON-LD block, a URL pattern) with no ambiguity about what counts as a match; (2) two independent implementations of the check, given identical input, would produce the identical verdict; (3) the check doesn't require weighing competing plausible interpretations of *meaning* (only of *structure*). Concrete examples already used across this project that pass all three: Topic X's Scroll-To-Text-Fragment matchability check (X-02), Topic V's Candid/GuideStar widget-URL detection (V-04), Topic W's comparison-table win-rate tally (W-03). A check belongs on the LLM-judgment side when it fails test (3) specifically — e.g., Topic W's "does this hedge represent appropriate caution or content-free evasion" (W's Cluster A cross-reference to Topic V's Cluster A) is structurally simple to locate (a hedge phrase near a claim) but requires genuine semantic judgment to interpret.

**INFERENCE** — The *hybrid* pattern this project has converged on repeatedly (a deterministic first pass that narrows candidates, followed by LLM judgment only on the narrowed set) isn't a compromise between the two — it's the pattern that actually wins on every axis simultaneously: it's cheaper than running LLM judgment on every page (Cluster H's runtime budget from Topic Z), and it's more reliable than pure LLM judgment because Cluster D's overconfidence research (below) suggests the LLM's *scope* of judgment should be kept as narrow as possible, not because narrowing improves the model's calibration directly, but because a narrower, more specific judgment call is easier for a human reviewer to verify against the flagged evidence.

### D. Important mechanisms
The unifying insight: the three-question test above isn't novel invention — it's an explicit, checkable formalization of a boundary this project's own prior work has already drawn correctly by instinct in a dozen separate instances; AA's contribution is making that instinct into something a new skill author can apply without having read all five prior documents first.

### E. Concrete artifacts
A short decision-tree document (see Cluster F) any skill author consults before writing a check: "input fully specified? → verdict reproducible? → no meaning-judgment required? → deterministic. Otherwise → hybrid, narrow the LLM's scope to the smallest possible judgment call."

### F. How this gets verified
Code review checklist item: for every check submitted, its author states which of the three questions failed (if any) and why it's tagged the way it is — a one-line justification, not a lengthy debate, but a required one.

### G. What evidence to report
N/A directly to end users — an internal engineering-quality gate.

### H. Criticality
Medium — a wrongly-tagged check doesn't crash anything, but systematically wrong tagging across many skills compounds into real runtime/cost/reliability problems.

### I. Correct implementation
Apply the three-question test at design time, before writing the check, not retroactively.

### J. Anti-patterns to avoid
Defaulting to LLM judgment because it's easier to write a prompt than to write a parser, even when the check genuinely passes all three deterministic-test questions; defaulting to deterministic pattern-matching for something that actually requires interpreting meaning (producing a check that looks rigorous but is shallow).

### K. Failure modes if missed
Silent quality/cost degradation, not a hard failure — the kind of thing that only becomes visible in aggregate at scale.

### L. Counterexamples
Some checks are genuinely borderline (Topic V's site-type classification narrowly fails the "fully specified input" test because of hybrid-domain edge cases documented in V-01/V-02) — these are correctly tagged hybrid, not a failure of the test, but an honest reflection of real ambiguity.

### M. Portable?
Yes — this test is content-agnostic and applies to any future skill, not just the ones already designed.

### N. Deliverable
The three-question decision test, published as shared guidance (belongs in Topic Z's Cluster B `references/` convention).

### O. Relationship to other clusters
Directly extends, rather than duplicates, Topic Z's Cluster E tagging infrastructure — Z stores the tag; AA supplies the test that produces it.

---

## Cluster B — Evidence-first reasoning & claim extraction
**Covers:** AA5 (evidence-first reasoning), AA6 (claim extraction), AA10 (reasoning from evidence), AA11 (avoiding unsupported conclusions)

### A. What we need to understand
How to structure an LLM-judgment step so its conclusion is actually derived from the specific evidence extracted during the crawl, rather than from the model's prior/general knowledge about what a site "like this" typically looks like — a distinct failure mode from getting the deterministic/LLM boundary wrong (Cluster A), since this can happen even when a check is correctly tagged as needing LLM judgment.

### B. Why it matters
This is precisely the mechanism behind a subtle, hard-to-catch failure: an LLM-judgment check that produces a *plausible-sounding* finding that isn't actually grounded in what was crawled — for example, confidently describing a company's pricing model as "typical SaaS freemium" because that's a common pattern in the model's training data, rather than because the extracted evidence actually showed it. This would produce a finding with an authoritative tone and no real evidentiary backing, which is worse than an honest "insufficient evidence" (Cluster D) because it looks reliable.

### C. Current evidence

**INFERENCE (a direct architectural implication, not requiring new external research beyond what Pulkit's project-wide faithfulness work already established for the *website-auditing* direction)** — The correct structure for every LLM-judgment step in this marketplace is **claim-extraction-then-verification**, not free-form reasoning-to-conclusion: (1) first, extract the specific, quoted evidence spans the judgment will be based on (this is AA6, and it should be a distinct, visible step in the reasoning trace, not folded silently into the final answer); (2) then, and only then, reason from *that extracted set*, explicitly barred from introducing claims not present in it. This mirrors, at the level of our own marketplace's internal reasoning, the same "ground the conclusion in retrieved evidence rather than parametric knowledge" principle that the broader RAG/faithfulness literature (already cited via Pulkit's ALCE/SourceCheckup references) established for the *target website's* content — applied here reflexively, to our own system.

**INFERENCE** — "Avoiding unsupported conclusions" (AA11) is operationalized concretely by requiring every finding's `claim` field (per Topic Z's output contract) to be traceable to at least one specific item in its `evidence` array — not as a courtesy, but as a hard schema-validation rule Topic Z's Cluster D infrastructure can enforce mechanically: a finding with a claim that doesn't paraphrase-match anything in its own evidence array should fail validation before it ever reaches the aggregation stage, catching this failure mode structurally rather than relying on the model to self-police it.

### D. Important mechanisms
The unifying insight: this is a **structural, enforceable fix**, not a prompting nicety — by requiring the extraction step to produce a visible, separately-validated artifact (the evidence array) before the reasoning step runs, the system makes "reasoning beyond the evidence" a schema violation, not just a quality hope.

### E. Concrete artifacts
A two-step prompt/execution structure for every LLM-judgment check: Step 1 outputs only extracted spans (no interpretation); Step 2 takes Step 1's output as its sole input and reasons only over it. Enforced by Topic Z's `Evidence` schema validation (claim-to-evidence traceability check).

### F. How this gets verified
Automated: schema/paraphrase-overlap check between a finding's `claim` and its `evidence[].extracted_text` fields, flagging any claim with no supporting evidence entry as a validation failure, not a quality suggestion.

### G. What evidence to report
The extraction-step output should itself be retained (even if not surfaced in the final user-facing report) as an internal audit trail — directly useful for Cluster G's reproducibility requirement.

### H. Criticality
High — this is the specific mechanism protecting the marketplace's own credibility; a hallucinated-but-confident finding is a worse look for the marketplace than an admitted gap.

### I. Correct implementation
Split every LLM-judgment skill's logic into the two-step structure above at design time, not as a later refactor.

### J. Anti-patterns to avoid
A single prompt that asks for both extraction and conclusion in one pass, where the model can (and empirically, per general LLM behavior, sometimes will) blend in outside knowledge without either the model or a reviewer easily noticing.

### K. Failure modes if missed
Confidently-stated findings that don't survive a "where exactly does the evidence say this" challenge — exactly the failure mode this cluster exists to prevent.

### L. Counterexamples
Genuinely inferential findings (e.g., Topic V's "this pattern likely extends to similar institutions," explicitly labeled INFERENCE throughout this project's own documents) are legitimate and shouldn't be forced into a false appearance of direct evidence — the discipline here is *labeling* inference as inference, not eliminating it, which is exactly the FACT/OBSERVATION/INFERENCE/SPECULATION labeling convention this whole project has already used throughout its own research documents, now recommended as the *runtime* output convention too.

### M. Portable?
Yes — a general-purpose grounding discipline, applicable to any LLM-judgment skill regardless of content.

### N. Deliverable
The two-step extraction-then-reasoning prompt pattern, and the claim-to-evidence schema validation rule (implemented within Topic Z's Cluster D infrastructure).

### O. Relationship to other clusters
Directly implemented via Topic Z's Cluster D output contract; the FACT/OBSERVATION/etc. labeling convention this project's own documents use is recommended for the runtime findings themselves, not just the human research phase.

---

## Cluster C — Hypothesis-driven verification loop
**Covers:** AA7 (hypothesis generation), AA8 (hypothesis verification)

### A. What we need to understand
Whether the runtime audit agent should generate a candidate finding and then actively verify it with further tool calls before finalizing — mirroring, at runtime, the exact research discipline this whole project's human phase has followed (Research Question → Evidence → Observation → Pattern → Counterexample → Refined Hypothesis).

### B. Why it matters
This is a genuinely elegant, low-effort-to-justify design choice: the project's own required human-research methodology *is* a hypothesis-verification loop, and there's an established, well-cited agentic pattern for implementing exactly this at runtime rather than inventing one from scratch.

### C. Current evidence

**FACT (a foundational, widely-cited agentic-LLM paper, directly applicable)** — ReAct (Yao et al., 2022/2023, Princeton/Google Research) interleaves reasoning traces with tool-based actions in a loop, allowing the model to "induce, track, and update action plans" and "handle exceptions" using information gathered from external sources rather than relying solely on internal knowledge. The paper's own reported result is directly relevant here: ReAct "overcomes prevalent issues of hallucination and error propagation in chain-of-thought reasoning" specifically *because* it interleaves reasoning with tool-grounded fact-gathering, and produces "more interpretable" trajectories than reasoning-only approaches — a direct, primary-source connection between this pattern and both Cluster B's grounding concern and Cluster G's explainability requirement.

**INFERENCE (the direct application to this project)** — A per-page or per-check audit loop structured as: **(1) generate a candidate finding (hypothesis) from an initial pass of evidence → (2) identify what additional evidence would confirm or disconfirm it → (3) take the action to gather that evidence (an additional fetch, a targeted re-read of a specific page section) → (4) only then finalize the finding, with the verification step's outcome included in the evidence array** — is a direct, runtime instantiation of the ReAct pattern, and simultaneously operationalizes this project's own stated research principle ("actively search for counterexamples") as an executable step rather than a research-phase aspiration.

### D. Important mechanisms
The unifying insight: this project didn't need to invent a runtime reasoning architecture from scratch — the discipline it already committed to for its own human research phase *is* a well-established, separately-validated agentic pattern (ReAct), and recognizing that connection is itself the useful research contribution here, not a new mechanism.

### E. Concrete artifacts
A loop structure within any hybrid-tagged skill: hypothesis → identify-disconfirming-test → tool-call → confirm-or-revise → finalize, with each step's output retained in the evidence trail.

### F. How this gets verified
Given the 5-minute runtime budget (Topic Z, Cluster H), this loop needs a hard iteration cap (e.g., at most one verification round per candidate finding, not an open-ended ReAct-style loop) — tested by asserting the loop terminates within its allotted per-check timeout (Topic Z's Cluster E) even in the worst case.

### G. What evidence to report
The verification step's specific outcome (what was checked, what was found) should appear in the finding's evidence array as its own entry, distinguishable from the initial-pass evidence — this is directly useful corroboration-strength information for Topic Z's Cluster F aggregation stage.

### H. Criticality
Medium-high — this is the mechanism most directly responsible for catching a plausible-but-wrong initial hypothesis before it becomes a finalized, reported finding, which is a real quality lever, but it's bounded by the runtime budget and can't be applied unboundedly.

### I. Correct implementation
Implement the loop with the hard iteration cap from the start, rather than an open-ended version that gets capped reactively after a timeout problem surfaces.

### J. Anti-patterns to avoid
An unbounded verify-and-revise loop that could, in principle, consume the entire per-skill timeout budget on a single difficult candidate finding while starving other checks the skill was supposed to also perform.

### K. Failure modes if missed
Without this loop, checks finalize on first-pass evidence alone — not necessarily wrong, but missing the specific error-correction mechanism this cluster adds; a plausible-but-wrong initial read (e.g., misreading a hedge as evasive when it's actually appropriate, per Topic V's Cluster A) would go unchecked.

### L. Counterexamples
Fully deterministic checks (Cluster A) have no need for this loop at all — hypothesis-verification is specifically a hybrid/LLM-judgment-tier pattern, not a universal one.

### M. Portable?
Yes — ReAct is a general-purpose, content-agnostic agentic pattern; the one-verification-round cap is this project's own specific, budget-driven adaptation of it.

### N. Deliverable
The bounded hypothesis-verification loop template, for use within any hybrid-tagged skill.

### O. Relationship to other clusters
Directly extends Cluster B's grounding discipline with an active-verification step; bounded by Topic Z's Cluster E timeout infrastructure; its output feeds Cluster G's explainability requirement (the verification trace is itself an explanation).

---

## Cluster D — Confidence calibration & uncertainty states
**Covers:** AA9 (confidence calibration), AA17 (uncertainty handling), AA18 ("insufficient evidence" states)

### A. What we need to understand
Whether a model's own self-reported ("verbalized") confidence score can be trusted as the basis for the `confidence` field in Topic Z's output contract, or whether that field needs to be derived some other way — this turns out to have a clear, current, well-evidenced answer.

### B. Why it matters
Nearly every finding across V, W, X, Y, and Z's own contract design assumes a `confidence` value exists and means something — if the mechanism producing that number is unreliable by default, every downstream severity/ranking/aggregation decision (Topic Z's Clusters F/G) inherits that unreliability silently.

### C. Current evidence

**FACT (a strong, current, multiply-corroborated body of evidence — genuinely one of the best-evidenced findings in this whole project)** — Multiple independent 2024–2026 studies converge on the same result: LLMs' self-reported ("verbalized") confidence is generally poorly calibrated, predominantly via **overconfidence** — one study found the majority of predictions clustered in the 90–100% self-reported confidence band regardless of whether the model's actual accuracy supported that level. A separate, more recent study states this even more starkly: models "verbalize their overconfidence *irrespective of* whether their answers are correct." A third finds that verbalized-confidence reliability depends heavily on *how the model is prompted* for it, and that even among large (70B+ parameter) models, calibration error remains substantial (Expected Calibration Error ≈0.1), with most of whatever calibration improvement exists coming from the model simply being more *accurate*, not from it becoming less overconfident. One study did find GPT-4 relatively better-calibrated than other tested models — but its own authors caution this may be a byproduct of GPT-4's higher raw accuracy rather than genuinely superior self-assessment, an important nuance against over-crediting any specific current model's self-reported numbers.

**INFERENCE (the direct, load-bearing architectural implication)** — Given this, **the marketplace's `confidence` field (Topic Z's Cluster D contract) should not be populated by simply asking the model "how confident are you, 0–100"** — that would inherit a documented, well-evidenced overconfidence bias directly into a number every downstream severity and ranking decision depends on. Instead, confidence should be derived from **objective, observable proxies** already established across this project: whether the check is deterministic vs. hybrid/LLM-judgment (Cluster A's tag — deterministic checks warrant categorically higher default confidence); the number of independently-corroborating skills (Topic Z's `contributing_skills`, Z-24/Z-25); and whether Cluster C's verification loop actually ran and confirmed the initial hypothesis, versus finalizing on first-pass evidence alone. A verbalized self-report, if used at all, should be treated as one weak input among these, never the primary signal.

**INFERENCE (AA18, "insufficient evidence" as a first-class state, not a fallback)** — Because overconfidence is the documented default failure mode, **explicitly training/prompting the check's LLM-judgment step to prefer "insufficient evidence to conclude" over a low-confidence guess is a direct, evidence-motivated mitigation** — not a generic "be humble" instruction, but a specific counter to a specific, well-documented bias. This should be a real, distinct output state in Topic Z's schema (a finding can legitimately resolve to "insufficient evidence," which is itself informative and different from either "found" or "not found"), not silently absent from the schema's enum of possible states.

### D. Important mechanisms
The unifying insight: this cluster's evidence doesn't just support a general "handle uncertainty carefully" platitude — it supports a *specific, falsifiable design decision* (don't use raw verbalized confidence as the primary signal) backed by multiple independent, current, converging studies, which is a rare level of grounding for a reasoning-architecture choice.

### E. Concrete artifacts
A confidence-computation function: `confidence = f(deterministic_tag, contributing_skill_count, verification_loop_ran_and_confirmed, [weak: verbalized_self_report])` rather than `confidence = verbalized_self_report` directly; an explicit `insufficient_evidence` state alongside `found`/`not_found` in the finding-status enum.

### F. How this gets verified
Where feasible, spot-check a sample of the marketplace's own finalized findings against manual review to see whether the computed confidence tracks actual correctness better than a naive verbalized-confidence baseline would have — a lightweight, internal calibration check, not a full academic study, but directly modeled on the methodology the cited papers themselves use (compare stated confidence to actual accuracy).

### G. What evidence to report
The confidence value's basis (which of the objective proxies contributed) could be surfaced in a report appendix or internal log — directly useful for anyone auditing the marketplace's own reliability later.

### H. Criticality
High — this is a foundational input to nearly every downstream ranking/severity decision in Topic Z's Clusters F and G; getting it wrong doesn't crash anything but silently corrupts prioritization throughout the whole report.

### I. Correct implementation
Build the confidence-computation function as shared infrastructure (Topic Z's Cluster D/E shared library), not something each skill computes ad hoc.

### J. Anti-patterns to avoid
Prompting a model for a 0–100 confidence score and using it directly and uncritically — this is precisely the practice the cited research shows is unreliable, and it's also the most obvious, easiest-to-default-into implementation, which is exactly why it's worth flagging explicitly rather than assuming a team would avoid it unprompted.

### K. Failure modes if missed
Systematically overconfident findings throughout the report, with the overconfidence invisible because it looks like a normal, plausible number rather than an obvious defect.

### L. Counterexamples
None found in the cited research suggesting verbalized confidence is reliable in this project's context — the one partial counterpoint (GPT-4's relatively better showing) is explicitly caveated by its own authors as possibly just reflecting higher accuracy, not genuine calibration skill, and shouldn't be read as license to trust verbalized confidence from any specific current model without independent verification.

### M. Portable?
Yes — this is a general property of LLM behavior demonstrated across many models and tasks, not specific to any one vendor or to this project's content.

### N. Deliverable
The objective-proxy confidence function and the `insufficient_evidence` schema state, implemented within Topic Z's contract infrastructure.

### O. Relationship to other clusters
Directly feeds Topic Z's Cluster F (confidence propagation, Z-27) with a better-grounded input than a raw verbalized score would provide; connects to Cluster C (whether the verification loop ran is itself a confidence input).

---

## Cluster E — Active contradiction-seeking & cross-checking
**Covers:** AA12 (cross-checking findings), AA13 (contradiction detection)

### A. What we need to understand
Whether the runtime agent should actively try to find evidence *against* its own candidate findings before finalizing them, distinct from Topic Z's mechanical post-hoc conflict resolution between different skills' outputs (Section 0's disclosed boundary).

### B. Why it matters
This is the runtime-agent-level implementation of the same "actively search for counterexamples" discipline this project's human research phase has applied throughout (visible in nearly every V/W/X/Y finding's explicit counterexamples section) — extending a research-quality practice into the system's own operational behavior, not just its design process.

### C. Current evidence

**INFERENCE (a direct extension of Cluster C's ReAct-grounded verification loop, applied specifically to self-contradiction rather than general evidence-gathering)** — Cluster C's verification step should specifically include, as one of its possible actions, checking for evidence that would *contradict* the candidate finding, not only evidence that would further confirm it — a subtle but important distinction, since a verification step that only looks for confirming evidence is vulnerable to confirmation bias in exactly the way this project's own research standard explicitly warns against for the human research phase. Concretely: if a candidate finding is "this page lacks a clear pricing statement" (Topic W's Cluster D territory), the contradiction-seeking step should specifically check whether pricing is legitimately, appropriately gated (Topic V's Cluster F enterprise-SaaS norm) before finalizing — i.e., this cluster's job is to actively invoke the relevant suppression/context rule from Topic U/V *as a check*, not assume the initial pattern-match is already correct.

**INFERENCE** — Cross-checking (AA12) at the runtime level is best implemented as: before finalizing a finding, query whether any *other already-computed* finding or context signal (site-type classification, a different skill's output already available in `upstream_outputs` per Topic Z's contract) would change the interpretation of this one — this is cheap (no new fetches needed, just consulting already-available context) and directly catches the exact class of false positive this whole project has repeatedly identified (V's Cluster A hedging, V's Cluster F pricing-gating, Y's Cluster E audience/location context).

### D. Important mechanisms
The unifying insight: this cluster is genuinely cheap to implement relative to its value, because it doesn't require new evidence-gathering (unlike Cluster C's verification loop, which may require a new tool call) — it requires consulting context the pipeline already has, per Topic Z's `upstream_outputs` contract, and checking it against a specific, itemizable list of known suppression rules (which this project has already assembled across every prior topic's "never-fire" catalogs).

### E. Concrete artifacts
A pre-finalization checklist step: "does any upstream classification or suppression rule (per the accumulated V/W/X/Y/U catalogs) directly contradict this candidate finding? If yes, either suppress or downgrade confidence explicitly, with the contradicting signal named in the output."

### F. How this gets verified
Unit tests with synthetic scenarios specifically constructed to trigger a known suppression rule (e.g., a simulated enterprise-SaaS pricing page) and asserting the check correctly downgrades/suppresses rather than finalizing the naive finding.

### G. What evidence to report
If a finding was checked against a suppression rule and passed (i.e., not suppressed), that check itself could be noted — directly consistent with the "explicitly state when a hedge/suppression was evaluated and found appropriate" convention already established in Topic V and W's documents.

### H. Criticality
High — this is the most direct, cheapest-to-implement, runtime enforcement point for every suppression rule this entire project has painstakingly documented; without it, all that research risks being advisory documentation nobody actually consults at the moment it matters.

### I. Correct implementation
Wire this checklist step as a mandatory, non-optional stage immediately before any finding is added to a skill's output, not as an optional enhancement.

### J. Anti-patterns to avoid
Treating the suppression-rule catalogs (V/W/X/Y/U's collective "never-fire" lists) as documentation for human reference only, never actually consulted by the runtime agent — this would waste the single largest concentration of false-positive-prevention work in the entire project.

### K. Failure modes if missed
Every false-positive pattern painstakingly documented across V, W, X, Y would still occur at runtime despite being "known" — the classic gap between documenting a risk and actually mitigating it.

### L. Counterexamples
None — this is close to a pure, low-cost win, structurally similar to Topic Z's finding on breadcrumbs (Y-02) in that respect: there's very little downside to checking.

### M. Portable?
Yes — the mechanism (consult already-available context before finalizing) is general; the specific suppression-rule catalog is this project's own accumulated content, which will keep growing as more skills are built.

### N. Deliverable
The pre-finalization suppression-check stage, consuming the actual accumulated rule catalogs from V/W/X/Y/U as its configuration data (per Topic Z's Cluster B `references/` convention).

### O. Relationship to other clusters
This is the runtime enforcement mechanism for essentially every "never-fire" rule documented across this entire project — arguably the single highest-leverage, lowest-cost cluster in this document.

---

## Cluster F — Structured reasoning, decision trees & fallback
**Covers:** AA14 (reasoning chains), AA15 (structured decision trees), AA16 (fallback logic)

### A. What we need to understand
Whether a check's reasoning should be represented as free-form chain-of-thought or as an explicit, inspectable decision structure, and what a check should do when a required input or upstream dependency isn't available.

### B. Why it matters
An inspectable decision structure is directly what makes Cluster G's explainability requirement achievable in practice, rather than aspirational; fallback logic is what keeps Topic Z's Cluster E partial-failure handling from cascading into degraded-but-silent findings.

### C. Current evidence

**INFERENCE (a direct, practical synthesis, not requiring new external grounding beyond Cluster C's ReAct citation, which already established that structured reasoning traces improve interpretability over unstructured chain-of-thought)** — Every hybrid/LLM-judgment check in this marketplace should be representable as an explicit decision tree with named branches (not necessarily literally implemented as a tree data structure, but describable as one): e.g., Topic V's Cluster A YMYL-hedging check is exactly: *is topic YMYL-classified? → is a hedge present near the claim? → does the hedge pair with a genuinely concrete claim, or is it content-free? → appropriate / evasive.* Writing every check this way, as a matter of design discipline, forces the same clarity Cluster B's evidence-extraction step forces on grounding — it becomes structurally harder to smuggle in an ungrounded judgment call when the branches are named explicitly.

**INFERENCE (AA16, fallback logic)** — Every check that depends on an upstream output (per Topic Z's `upstream_outputs` contract) needs an explicit, named fallback for when that upstream output is itself in a `partial` or `insufficient_evidence` state (Cluster D) — e.g., if Topic V's site-type classification returns `insufficient_evidence`, a downstream check that would otherwise apply Topic V's Cluster A YMYL severity gating should default to the **more cautious** of the two possible interpretations (treat as potentially YMYL, applying the stricter check, rather than skipping the check) rather than silently proceeding as if classification had succeeded — a specific, conservative default consistent with this project's own "don't turn weak signals into hard rules" principle, applied here as "don't turn missing signals into an assumed-safe default" either.

### D. Important mechanisms
The unifying insight: structured decision trees and fallback logic are two faces of the same discipline — naming every branch explicitly, including the branch for "the input I expected isn't actually available."

### E. Concrete artifacts
A lightweight, per-check documentation convention (a short branch-list, not a formal tree diagram) required alongside every hybrid/LLM-judgment skill's `SKILL.md`; an explicit fallback branch for every declared upstream dependency.

### F. How this gets verified
Code review requirement: every hybrid check's `SKILL.md` includes its branch list; every declared `upstream_outputs` dependency has a corresponding fallback documented and tested (feed it a synthetic `insufficient_evidence` upstream value and assert the conservative-default behavior, not a crash or a silent skip).

### G. What evidence to report
The specific branch taken for a given finding could be included in the finding's internal metadata (not necessarily user-facing) — directly useful for Cluster G's reproducibility and explainability.

### H. Criticality
Medium-high — doesn't crash without it, but a check with undocumented branches is much harder to debug when it produces an unexpected result, and undocumented fallback behavior is a specific, plausible source of the "silent quality degradation" failure mode Topic Z's Cluster C already flagged as the worst kind of failure.

### I. Correct implementation
Write the branch list and fallback behavior at design time, as part of the same design pass as Cluster A's deterministic/LLM classification — these are naturally done together, not sequentially.

### J. Anti-patterns to avoid
A hybrid check with an undocumented, implicit fallback (e.g., a null upstream value silently treated as "false" rather than as an explicit, considered branch) — a classic, easy-to-introduce bug class.

### K. Failure modes if missed
Exactly Topic Z's Cluster C concern: silent, hard-to-diagnose quality degradation when an upstream dependency doesn't behave as expected.

### L. Counterexamples
Fully deterministic checks (Cluster A) with no upstream LLM-judgment dependency have a simpler fallback story (typically: report the specific extraction failure via Topic Z's error-code taxonomy and move on) — this cluster's more elaborate branch-naming discipline matters most for hybrid/LLM-judgment checks specifically.

### M. Portable?
Yes — general software-design discipline, applicable to any check regardless of content.

### N. Deliverable
The branch-list documentation convention and the conservative-default fallback rule for missing/partial upstream dependencies.

### O. Relationship to other clusters
Directly enables Cluster G's explainability; directly extends Topic Z's Cluster E partial-failure handling to the semantic (not just infrastructural) level.

---

## Cluster G — Explainability & reproducibility
**Covers:** AA19 (explainable findings), AA20 (reproducible findings)

### A. What we need to understand
The distinction between Topic Z's Cluster E determinism/idempotency (a *code-level* property: does the same input produce the same output) and this cluster's explainability/reproducibility (a *reasoning-level* property: can a human follow why the system concluded what it concluded, and would a knowledgeable reviewer, given the same evidence, reach the same conclusion).

### B. Why it matters
A finding can be technically reproducible (the code is deterministic, or the LLM call is temperature-0) while still being *unexplainable* if the reasoning trace that produced it isn't retained or isn't structured clearly — and an unexplainable finding is much harder for a judge, or a site owner reading the report, to trust or verify.

### C. Current evidence

**FACT (directly from the ReAct paper already cited in Cluster C)** — The paper's own stated contribution includes "improved human interpretability and trustworthiness" as a direct benefit of interleaving reasoning traces with actions, specifically because a human can inspect the trace to understand the decision basis — this is a primary-source claim that structured, retained reasoning traces are not just a nice-to-have but a *measured* benefit of the architecture this project has already adopted for Cluster C.

**INFERENCE (the direct synthesis across this document's own clusters)** — Explainability, in this project's architecture, is not a separate feature to bolt on — it falls out for free from correctly implementing Clusters B, C, E, and F: if claim-extraction is a visible step (B), if the verification loop's actions are retained (C), if the suppression-check consultation is logged (E), and if the decision branch taken is recorded (F), then an explanation is simply "surface these four already-produced artifacts together," not a new thing to generate after the fact. **Reproducibility (AA20)** follows the same logic: Topic Z's Cluster E determinism/idempotency guarantees the *deterministic* portions reproduce exactly; for the *hybrid/LLM-judgment* portions, reproducibility means "given the same retained evidence and reasoning trace, would a human reviewer reach the same conclusion" — a weaker, appropriately humbler standard than byte-identical output, consistent with Cluster D's finding that verbalized LLM outputs carry irreducible uncertainty.

### D. Important mechanisms
The unifying insight: this cluster is best understood as a **specification of what "done" looks like for every other cluster in this document**, not an independent mechanism — if AA1–AA18 are implemented as designed, explainability and a reasonable standard of reproducibility are already satisfied; if this cluster reveals a gap, it's diagnostic of an earlier cluster being under-implemented, not evidence that a new, separate "explainability module" needs to be built.

### E. Concrete artifacts
A `reasoning_trace` field in the internal (not necessarily end-user-facing) finding record, assembled from the four already-produced artifacts named above; a documented, human-readable standard for what counts as "reproducible enough" for hybrid checks (same evidence + same reasoning trace → same reviewer conclusion), distinct from the stricter code-level determinism standard Topic Z already owns.

### F. How this gets verified
Spot-check: take a sample of finalized findings, give a human reviewer only the retained evidence and reasoning trace (not the original page), and check whether they reach the same conclusion the system did — a direct, practical test of both explainability (could they follow it) and reproducibility (did they agree).

### G. What evidence to report
Whether and how much of the reasoning trace is worth surfacing in the actual user-facing report (versus kept as an internal audit artifact) is a Topic AB (Report Design) decision, not this cluster's to make unilaterally — flagged as a cross-reference, not resolved here.

### H. Criticality
Medium — this cluster mostly aggregates value already created elsewhere rather than creating new value itself, but its absence would make every other cluster's careful design invisible and thus harder to trust or debug.

### I. Correct implementation
Treat this cluster as a checklist/verification pass over Clusters B/C/E/F's actual implementations, run late in the build process, rather than a separate component built in parallel.

### J. Anti-patterns to avoid
Building a separate "explanation generator" that summarizes a finding after the fact from scratch, disconnected from the actual reasoning trace that produced it — this risks the explanation itself becoming an ungrounded, Cluster-B-violating artifact.

### K. Failure modes if missed
A report that states findings confidently with no way for a skeptical reader (or judge) to verify the reasoning behind them — directly costly against any rubric criterion valuing evidence quality and detection-accuracy transparency.

### L. Counterexamples
None specific — this cluster is close to strictly beneficial, contingent on the cost of retaining the trace data staying small (a documentation/logging cost, not a runtime-budget one, so it shouldn't meaningfully threaten Topic Z's 5-minute constraint).

### M. Portable?
Yes — general good practice for any explainable-AI system, not specific to this project's content.

### N. Deliverable
The `reasoning_trace` internal field and the human-reviewer spot-check protocol as a pre-submission quality gate.

### O. Relationship to other clusters
Directly downstream of, and diagnostic for, Clusters B/C/E/F; coordinates with (doesn't decide) Topic AB's decision about what to surface to end users.

---

## 3. Findings register

---
**FINDING ID:** AA-01
**Researcher:** Soham
**Research Area:** AA — Agent Reasoning Quality
**Research Question:** Can the marketplace's `confidence` field be safely populated by simply asking the model to self-report a confidence score?
**Observation:** Multiple independent, current (2024-2026) studies converge on LLM verbalized confidence being poorly calibrated, predominantly via overconfidence — one study found the majority of self-reported confidence scores fell in the 90-100% band regardless of whether accuracy supported it; another states plainly that models "verbalize their overconfidence irrespective of whether their answers are correct"; a third finds reliability strongly prompt-method-dependent, with even 70B+ parameter models showing substantial calibration error (ECE ~0.1), and most calibration improvement coming from increased accuracy rather than reduced overconfidence. One study's finding that GPT-4 showed relatively better calibration is explicitly caveated by its own authors as possibly a byproduct of higher accuracy rather than genuine self-assessment skill.
**Evidence:** "Overconfidence is Key: Verbalized Uncertainty Evaluation in Large Language and Vision-Language Models" (arXiv:2405.02917); "ADVICE: Answer-Dependent Verbalized Confidence Estimation" (arXiv:2510.10913); "On Verbalized Confidence Scores for LLMs" (arXiv:2412.14737); "Taming Overconfidence in LLMs: Reward Calibration in RLHF" (arXiv:2410.09724).
**Sources:** As listed above — four independent, current papers, converging on the same qualitative conclusion.
**Pattern:** This is a rare case of strong, multiply-corroborated, current external evidence directly answering a concrete architecture question this project needed to answer anyway — the confidence field's design is not a stylistic choice, it's constrained by a well-documented model-behavior fact.
**Counterexamples:** None found suggesting verbalized confidence is reliable in general; the GPT-4 partial exception is explicitly self-caveated by its own study's authors.
**Hypothesis:** N/A — direct synthesis of converging empirical findings.
**Signal:** N/A — an architecture finding, not a website signal.
**How to Detect:** N/A.
**Evidence Output:** The objective-proxy confidence function (Cluster D, Section E).
**False Positives:** N/A.
**False Negatives:** N/A.
**Severity:** High if ignored — every downstream severity/ranking decision (Topic Z's Clusters F/G) inherits whatever the confidence field's reliability actually is.
**Recommended Fix:** Compute confidence from objective proxies (deterministic-tag, corroborating-skill count, verification-loop outcome), not from a raw verbalized self-report.
**Generalization:** High — demonstrated across multiple models, tasks, and studies, not specific to one vendor.
**Candidate Skill:** Shared confidence-computation function within Topic Z's Cluster D infrastructure.
**Related Skills:** Topic Z (Z27, confidence propagation).
**Confidence:** HIGH — directly, multiply corroborated by current, independent primary sources.

---
**FINDING ID:** AA-02
**Researcher:** Soham
**Research Area:** AA — Agent Reasoning Quality
**Research Question:** Is there an established agentic-LLM pattern this project can adopt for hypothesis generation/verification, rather than inventing a runtime reasoning architecture from scratch?
**Observation:** ReAct (Yao et al., 2022/2023) directly matches the need: it interleaves reasoning traces with tool-grounded actions specifically to reduce hallucination and error propagation relative to pure chain-of-thought, and its own reported benefits (reduced hallucination, improved interpretability/trustworthiness) map directly onto this project's Cluster B (grounding) and Cluster G (explainability) concerns.
**Evidence:** "ReAct: Synergizing Reasoning and Acting in Language Models" (arXiv:2210.03629), a highly-cited (5,000+ citations per Semantic Scholar) foundational agentic-LLM paper.
**Sources:** arxiv.org/pdf/2210.03629; react-lm.github.io; corroborating secondary coverage (verifywise.ai, Semantic Scholar citation record).
**Pattern:** This project's own committed human-research discipline (Research Question → Evidence → ... → Refined Hypothesis) is structurally the same loop ReAct formalizes for runtime agents — recognizing this connection let this cluster be grounded in established, well-cited work rather than an invented pattern.
**Counterexamples:** The paper itself notes ReAct "isn't perfect" and documents failure examples (e.g., on ALFWorld) — it's a strong pattern, not a guaranteed-correct one, and this project's own bounded, single-verification-round adaptation is a further, unvalidated constraint on top of the original pattern.
**Hypothesis:** Whether a single bounded verification round (this project's runtime-budget-driven adaptation) captures most of ReAct's benefit relative to the original paper's more open-ended loop is untested by this project directly.
**Signal:** N/A.
**How to Detect:** N/A.
**Evidence Output:** The bounded hypothesis-verification loop template (Cluster C, Section E).
**False Positives:** N/A.
**False Negatives:** N/A.
**Severity:** Medium — a missed verification round means a first-pass finding goes unchecked, not a crash.
**Recommended Fix:** Implement the bounded loop as designed in Cluster C.
**Generalization:** High for the underlying pattern (widely validated across many tasks in the original paper and its extensive citation record); untested for this project's own specific one-round budget adaptation.
**Candidate Skill:** The hypothesis-verification loop template, used within any hybrid-tagged skill.
**Related Skills:** Topic Z (Cluster E, timeout budget).
**Confidence:** HIGH for the underlying pattern's validity and citation strength; MEDIUM for how well this project's specific bounded adaptation preserves the original pattern's benefits.

---

## 4. Required end-of-topic synthesis

**Strongest validated insight:**
AA-01 (confidence should be computed from objective proxies, not raw verbalized self-report) — this is unusually strongly evidenced for an architecture decision, resting on four independent, current, converging empirical studies rather than a single source or a plausible-sounding inference, and it directly, concretely changes how Topic Z's Cluster D contract field should actually be populated.

**Strongest unvalidated hypothesis:**
Whether this project's own bounded, single-verification-round adaptation of ReAct (Cluster C) preserves enough of the original pattern's hallucination-reduction benefit to be worth its runtime cost — the original paper's benefits were demonstrated with a more open-ended loop, and this project's budget-driven constraint on it is untested.

**Strongest candidate skill:**
Not a new skill — the strongest, most leverage-dense deliverable in this document is Cluster E's pre-finalization suppression-check stage, because it's the mechanism that actually enforces, at runtime, the entire accumulated catalog of "never-fire" rules this project has painstakingly documented across V, W, X, Y, and U. Without it, that documentation work risks being advisory only.

**Weakest assumption we should investigate next:**
Whether Cluster B's claim-to-evidence schema validation (checking that a finding's claim paraphrase-matches something in its evidence array) can actually be implemented as a reliable automated check, or whether it itself requires an LLM-judgment call sophisticated enough to reintroduce the exact grounding risk it's meant to prevent — this document assumes a paraphrase-overlap check is tractable but doesn't specify or test the actual matching mechanism, which is a real, unresolved implementation detail rather than a settled design.

---

## 5. Cross-references for the Combine & Code phase

- **Cluster A ↔ Topic Z (Cluster E):** AA supplies the decision test; Z owns the tag storage and the resulting timeout/temperature-0 treatment.
- **Cluster B ↔ Pulkit's F1/F2:** Explicitly disclosed as parallel-but-distinct — Pulkit audits the target website's faithfulness; AA audits the marketplace's own reasoning faithfulness. The FACT/OBSERVATION/etc. labeling convention this project's research documents already use is recommended as the runtime output convention too, not just a human-research-phase habit.
- **Cluster C ↔ Topic Z (Cluster E, timeouts):** The verification loop's iteration cap must be sized against Z's per-skill timeout budget — a direct, numeric dependency to resolve jointly, not independently.
- **Cluster D ↔ Topic Z (Z27, confidence propagation):** AA-01's objective-proxy function is the actual input Z's min-propagation rule should operate on — this needs to be built before Z's Cluster F aggregation logic is finalized, not after.
- **Cluster E ↔ Topics V, W, X, Y, U (all suppression/never-fire catalogs):** This cluster's entire configuration data is the accumulated suppression-rule catalog from every prior topic — it should consume that directly (per Topic Z's Cluster B `references/` convention) rather than re-deriving or duplicating it.
- **Cluster F ↔ Topic Z (Cluster E, partial failure):** Extends Z's infrastructural partial-failure handling to the semantic/upstream-dependency level with the conservative-default fallback rule.
- **Cluster G ↔ Topic AB (Report Design):** What portion of the internal reasoning trace gets surfaced to end users is explicitly AB's decision, not resolved by this document — flagged for direct coordination.
