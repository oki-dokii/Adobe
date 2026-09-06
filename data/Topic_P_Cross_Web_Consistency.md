# Topic P — Cross-Web Consistency
**Researcher:** Harsh | **Research Area:** P — Cross-Web Consistency (website vs. LinkedIn/Wikipedia/Wikidata/Crunchbase/directories/press/reviews/social/partners; consistency of name, description, product, pricing, location, leadership, claims)
**Priority:** Very High

---

## 0. Framing — what Topic P is actually for

Topic P is not "check if your NAP (name/address/phone) matches everywhere" as trivia. It exists to answer one design question for the marketplace:

> **When an independently-sourced claim about a brand disagrees with what the brand's own website says — whether because one side is stale, one side is simply wrong, or both are describing something that legitimately varies — can a read-only audit detect the disagreement, determine which side more plausibly reflects current reality, and report that honestly instead of assuming the brand's site is always the ground truth?**

Every sub-topic below is evaluated against that question, not against "is this interesting cross-platform-consistency trivia."

The master research map lists P1–P26 under this topic. Following the same condense-and-focus approach used for Topics F and H, this document organizes P1–P26 into **three genuinely distinct investigation units**, because close reading shows the raw list is mostly enumerating *which platforms* (P1–P10: LinkedIn, Wikipedia, Wikidata, Crunchbase, directories, Google Business Profile, press, reviews, social, partners) to check against a small, fixed set of *mechanisms* (P11–P26: name/description/product/pricing/location/leadership/employee-count/founded-date/industry/feature/claims/positioning consistency, old information surviving, contradiction detection, provenance, freshness):

1. **§1 — Temporal staleness as the dominant, evidence-backed mechanism**: does the peer-reviewed literature support "which side is stale" as a genuinely detectable, primary signal for resolving cross-source disagreement — as opposed to treating every discrepancy as an undifferentiated "inconsistency"?
2. **§2 — Claim materiality and the taxonomy of what's worth checking**: given that not all discrepancies matter, what distinguishes a decision-relevant contradiction from harmless variance, and can this be operationalized without manufacturing false positives?
3. **§3 — Platform-specific update mechanics and directionality**: for the specific platforms named in P1–P10, what do we actually know (not assume) about how and how fast they update relative to a brand's own site, and what does that mean for which side to trust when they disagree?

**Constraint from the handout, re-read carefully:** the brief explicitly warns against "one outdated statement = globally stale website" as a forbidden assumption. This document treats that warning as the organizing constraint for the entire topic — the goal is not to build a diff tool that flags every textual difference, but to build a system that understands *when* a difference is evidence of a real problem and *when* it is normal, expected variance.

**Cross-references already established before this document was written:** both Topic F (§F37–F40, external KG representation) and Topic H (§4, provenance and conflicting-evidence resolution) explicitly flagged that their "compare the brand's own claim against an independently-sourced claim, report directionality" logic is the same underlying mechanism this topic needs, and recommended it be built once as shared infrastructure rather than three times. This document is written with that shared-infrastructure design as a given, not a new proposal — see §4 for the consolidated design.

---

## 1. FACT vs OBSERVATION vs HYPOTHESIS vs INFERENCE vs SPECULATION — global legend

Same legend as Pulkit's Topic A and my own Topic F/H documents, used identically here for cross-document consistency:
- **FACT** — documented by the vendor/standards body, or established in peer-reviewed/archival literature.
- **OBSERVATION** — reported by independent researchers/practitioners running real, methodologically transparent trials (not vendor-confirmed).
- **HYPOTHESIS** — our proposed testable claim, not yet validated by us.
- **INFERENCE** — reasonable derivation from FACT/OBSERVATION, one logical step removed.
- **SPECULATION** — plausible but unconfirmed; flagged, not built on.

**A note on source quality control, continuing the pattern established in Topics F and H.** This topic's research surfaced the same recurring split seen in both prior documents: a cluster of unreliable commercial "Wikipedia management" and "brand consistency" content (Five Blocks, The Mather Group, and similar PR/reputation-management firms) alongside genuinely useful primary and peer-reviewed sources (a real peer-reviewed paper on detecting stale Wikipedia infobox data, Wikipedia's own template documentation, and a strong, converging 2026 literature on temporal fact validity in knowledge graphs and RAG systems). The commercial PR-firm content in this specific topic is somewhat more directly *useful* than the equivalent content flagged in F-00/H-04 — it accurately describes real, verifiable Wikipedia editorial mechanics (the COI edit-request workflow, WikiAlerts) rather than fabricating statistics — but I am still treating it as OBSERVATION-tier at best (practitioner description of a process, not a controlled study) and cross-checking its procedural claims against Wikipedia's own documentation where possible, consistent with this document series' standing discipline.

---

## §1 — Temporal staleness as the dominant, evidence-backed mechanism

### A. What we need to understand
When a brand's own site and an independent source disagree, is "one of them is simply outdated" the single most common and most detectable explanation — supported by real peer-reviewed evidence on how AI/retrieval systems actually behave when fed stale information — or is this an assumption we'd be smuggling in without support?

### B. Why it matters for the hackathon
If staleness is genuinely the dominant, best-evidenced mechanism (as opposed to one mechanism among many equally-likely ones), it should organize the entire topic's detection priority and severity logic — and, more importantly, it gives us a concrete, evidence-backed answer to "how would this actually mislead an AI system," rather than a vague "inconsistency is bad" intuition.

### C. Current evidence
- **FACT (peer-reviewed, directly on point, the single most load-bearing citation in this document):** a 2026 study, "When Benchmarks Age: Temporal Misalignment through Large Language Model Factuality Evaluation" (arXiv 2510.07238), directly measured what happens when a model is given a *passage containing outdated information* alongside a time-sensitive query — and found that providing the outdated passage **made the model's answers measurably worse than giving no passage at all** (a "Temporal Accuracy Gap" that dropped from +2.67% without the passage to **-12.22% with** the outdated passage, for one tested model). This is a directly quantified, controlled, peer-reviewed demonstration of exactly the mechanism this whole topic is worried about: **stale third-party content doesn't just fail to help — it actively anchors the model toward the wrong answer**, because (per the same paper, citing prior work) "LLMs rely more on contexts instead of memorized knowledge." This is a stronger and more specific finding than a vague "freshness matters" — it is a measured, negative, directional effect of stale retrieved context specifically.
- **FACT (peer-reviewed, directly on point, a second independent research group, on detection difficulty):** "Temporal Validity in Retrieval Memory: Eliminating Stale-Fact Errors for AI Agents over Evolving Knowledge" (arXiv 2606.26511) is a rigorous, carefully-controlled 2026 study that makes a genuinely important methodological point directly relevant to how we should think about detection: the paper shows that **naive similarity-based retrieval cannot reliably distinguish a stale fact from its current replacement when the two are phrased identically except for the changed value** ("surprise-gate" baselines "leak stale [information] 25-60%" of the time even when explicitly designed to catch exactly this). The paper's own methodological insight — that evaluation must use a **"marker-free" design** (no textual "[OUTDATED]" labels, since real-world stale content never announces itself as such) — is directly useful: it confirms that in realistic conditions, distinguishing "this is the current value" from "this is a superseded value" is a genuinely hard problem for retrieval-based systems, not a solved one, reinforcing why website-side prevention (making the *current* value unambiguous and dated) has real value rather than being a redundant nicety.
- **FACT (peer-reviewed, on a distinct but related mechanism — models silently preferring outdated *parametric* memory over correct retrieved context):** "Right Knowledge, Wrong Answer: Test-Time Steering for Temporal Fact Conflicts in Open-Weight Language Models" (arXiv 2606.20959) is a rigorous, controlled study (8,746-record benchmark, four open-weight models across three families) that demonstrates the *inverse* failure mode from the one above: a model may have the **correct, current fact available internally** yet still "surface the outdated fact" under standard prompting, because "the newer fact is stored in parametric memory, but standard prompting preferentially elicits the outdated one." This is a distinct, separately-evidenced mechanism from context-level staleness (§C's first finding) — it means staleness risk exists on *both* sides of the retrieval boundary (in what's fed to the model, and in what the model already "knows" from training), and a website-side fix can only address the first, not the second — an important, honest limitation to state.
- **FACT (peer-reviewed, directly on point for the specific case of company/organization facts):** Barth, "Detecting Stale Data in Wikipedia Infoboxes" (EDBT 2023 workshop, openproceedings.org), is a genuine peer-reviewed paper building an automated system to flag likely-outdated Wikipedia infobox fields (using field-correlation and other change-prediction models) — direct, primary confirmation that (a) Wikipedia infobox staleness is a real, recognized, actively-researched problem within the Wikipedia data-quality research community itself, not a hypothetical concern, and (b) it is significant enough that dedicated automated-detection tooling has been built for editors to address it, which is strong secondary confirmation that this is a nontrivial, ongoing issue rather than a rare edge case.
- **FACT (primary source, mechanically important and directly useful for directionality logic):** Wikipedia's own `Template:Infobox company` documentation states explicitly that for parameters with a "Fallback Wikidata item," **"Local values provided for parameters will always override available Wikidata parameter values"** — this is a directly useful, first-party, mechanical fact: on Wikipedia specifically, a locally-edited infobox value is authoritative *over* the linked Wikidata value for that same field, meaning a genuine Wikipedia/Wikidata mismatch for a company is not necessarily evidence of "conflicting sources" in the way our detection logic might naively assume — it may simply reflect normal template-fallback behavior where the Wikipedia article was manually updated more recently/precisely than the connected Wikidata item, or vice versa. **This is a genuine, non-obvious, mechanism-level fact directly relevant to how the shared "compare against Wikidata" logic (flagged by both Topic F and Topic H) should actually work** — the check must be aware that Wikipedia infobox values and Wikidata item values are not two fully independent sources; they are a single template system with defined override rules.
- **OBSERVATION, moderate confidence (practitioner-sourced but procedurally verifiable):** commercial PR/reputation-management content (Five Blocks, The Mather Group) consistently describes a real, verifiable Wikipedia editorial mechanism — the `{{edit COI}}` template and Talk-page request workflow for conflict-of-interest edits — as the correct, sanctioned way for a company to request a correction to stale information, rather than editing directly. This is checkable against Wikipedia's own conflict-of-interest editing policy and is consistent with how Wikipedia's editorial process is documented to work generally, so I am treating this specific procedural claim as OBSERVATION-tier (plausible, checkable, consistent with known Wikipedia norms) rather than rejecting it outright the way the fabricated-statistics content in F-00/H-04 was rejected — an important distinction in how this document applies the evidence-hierarchy discipline: not all commercial content is equally unreliable, and procedural/mechanical claims that are independently verifiable deserve different treatment than unfootnoted statistics.

### D. Important mechanisms
Two compounding, evidenced mechanisms, forming one connected diagnosis rather than a vague "inconsistency" alarm: **(1) stale retrieved context actively misleads, it doesn't merely fail to help** (the Temporal Accuracy Gap finding — a measured negative effect, not just an absence of positive effect), and **(2) distinguishing current from stale is a genuinely hard retrieval problem when the two are textually similar** (the marker-free benchmark finding) — meaning the *website's own* clear, dated, unambiguous statement of current facts has real, evidenced value as a disambiguating signal, not merely as good practice. This directly parallels and reinforces the "self-disambiguation" mechanism established in Topic F's F41-F46 (WhoQA) — here applied to *temporal* rather than *entity* ambiguity, but the same underlying principle: an AI system relying on ambiguous surrounding context is a documented, real failure mode, and explicit, dated, unambiguous website content is a genuine mitigant, not a nicety.

### E. Concrete website signals
Presence and clarity of dating on time-sensitive claims (explicit "as of [date]" language, visible last-updated indicators, `dateModified` schema — connecting to Topic F's F13-F16 scaffolding); whether a specific, checkable, time-sensitive claim (leadership, pricing, product availability, physical location) is stated *without* any dating context at all, which — per §D's mechanism — leaves the AI system with no basis to determine currency even if the value itself happens to be correct today.

### F. How the signal could be detected automatically
Deterministic: identify time-sensitive claim categories on the site (leadership names/titles, pricing, physical address, product/service availability — reusing the claim-taxonomy work from §2 below) and check for co-located dating signals (visible "as of" language, `dateModified`, or a page-level last-updated indicator). This is a **site-side check, distinct from and prior to** the cross-source comparison work in §4 — it asks "does the brand's own site make its currency legible," independent of whether any external source currently disagrees.

### G. What evidence the skill should report
Which time-sensitive claim categories were found, and whether each has a co-located, legible currency signal (explicit date, `dateModified`, or neither).

### H. Possible severity logic
- **Low-Medium:** a time-sensitive claim (leadership, pricing) exists with no dating signal at all — a cheap, clear, site-controlled improvement per §D's mechanism, but not itself evidence anything is currently wrong.
- **Escalates to Medium-High only when combined with §4's cross-source comparison finding an actual discrepancy** — undated claims are a risk-factor/contributing-cause finding on their own, not a standalone defect, consistent with this document series' consistent practice of not manufacturing severity from a weak signal alone.

### I. Correct remediation
Add explicit, visible "as of [date]" language or `dateModified` schema to time-sensitive claim sections — cheap, fully site-controlled, and directly targets the evidenced mechanism (ambiguous currency, not merely "old content," is the demonstrated risk factor).

### J. False-positive cases
Evergreen, non-time-sensitive content (a foundational explainer, a historical fact, a genuinely stable policy) has no meaningful "staleness" risk and should not be flagged for lacking a date — this directly echoes Pulkit's own Topic A finding (A15) on the identical principle for freshness/reranking, and must be applied consistently here: only claims from the genuinely time-sensitive taxonomy (§2) should trigger this check.

### K. False-negative risks
A claim can carry a dating signal that is itself stale (a "last updated" stamp that wasn't actually refreshed when the underlying content changed, or vice versa — a page edited for unrelated reasons that bumped a `dateModified` timestamp without the specific claim actually changing) — a dating signal's mere presence doesn't guarantee its accuracy, and this check cannot verify that without cross-referencing actual content changes over time, which is out of scope for a single-crawl audit.

### L. Counterexamples
A tightly-controlled, rapidly-changing pricing page might deliberately omit a visible date specifically because the operator wants the page to always appear current without needing manual date updates (relying on the page simply always reflecting live pricing) — this is a legitimate design choice, not a defect, provided the underlying value is in fact kept current; the check can only observe the *absence of a legibility signal*, not verify actual currency, and severity language should reflect that limitation.

### M. Does this generalize across site types?
Yes, universally — the mechanism (ambiguous currency actively misleads retrieval-based systems) and the claim-taxonomy-gated detection approach apply identically across site types; only the specific claims that count as "time-sensitive" for a given site type vary (a Topic V hook).

### N. Candidate skill(s)
Folds into **`cross-source-fact-consistency-check`** as the site-side "currency legibility" pre-check, feeding into and contextualizing §4's cross-source comparison.

### O. Relationship to other potential skills
Directly reinforces Topic F's F41-F46 self-disambiguation mechanism (same underlying principle — explicit, unambiguous website content mitigates a documented AI retrieval failure mode — applied here to temporal rather than entity ambiguity) and Pulkit's Topic A A15 (freshness/reranking, age ≠ staleness principle, applied consistently here).

---

## §2 — Claim materiality and the taxonomy of what's worth checking

### A. What we need to understand
The brief's own named forbidden pattern is "one outdated statement = globally stale website." What, specifically, distinguishes a claim discrepancy worth flagging from one that is normal, harmless variance — and can this be operationalized as a concrete, reusable taxonomy rather than a vague "use judgment" instruction?

### B. Why it matters
This is the single most important false-positive guardrail for the entire topic. Every prior document in this series (F, H) has flagged the need for exactly this kind of materiality filtering when discussing their own cross-source-comparison sub-checks, but deferred the actual taxonomy design to this document — this section is where that deferred design work happens, once, for shared use.

### C. Current evidence
- **INFERENCE, built from this document series' own accumulated findings rather than a single external source (an explicit, honest departure from the pattern in F/H, where a strong primary/peer-reviewed source anchored each unit):** no external source found in this research pass proposes a ready-made "materiality taxonomy" for brand-fact consistency checking specifically — this is genuinely our own synthesis work, built by combining (a) the general principle from the knowledge-conflicts literature (Topic H §4) that distinguishes genuine "inter-context conflict" from mere absence or trivial variation, (b) the temporal-staleness mechanism from §1 above (time-sensitive claims carry different risk than evergreen ones), and (c) direct reasoning about what a decision-relevant claim actually is for a brand-audit use case. This section is explicitly labeled HYPOTHESIS-tier throughout — a defensible, reasoned design, not an externally-validated one.
- **HYPOTHESIS (ours):** a workable materiality taxonomy sorts claims along two independent axes: **(1) objective verifiability** — can the claim be checked against an independent source at all (a specific price, a named executive, a physical address, a founding year) versus subjective/marketing language (superlatives like "industry-leading," "world-class") that cannot be fact-checked and should never be diffed; and **(2) decision-relevance** — would a reasonable person's understanding of or interaction with the brand meaningfully change if this claim were wrong (pricing, product availability, leadership, physical location, certifications/legal status: high; exact founding-year precision, minor phrasing of a mission statement: low). Only claims that are **both objectively verifiable and decision-relevant** should generate a flagged finding when a discrepancy is found; claims that are unverifiable (marketing language) should never be diffed at all, and claims that are verifiable but low-decision-relevance should be reported at low/informational severity even when a genuine discrepancy exists.
- **HYPOTHESIS (ours), directly targeting the brief's named forbidden pattern:** "one outdated statement" becomes "globally stale website" specifically when a single low-materiality discrepancy (a minor phrasing difference, a trivial date rounding) is treated with the same severity as a high-materiality one (wrong current pricing, a departed executive still listed as current) — the taxonomy's practical purpose is to make this distinction structurally impossible to collapse, by requiring every flagged discrepancy to carry both an objective-verifiability tag and a decision-relevance tag before any severity is assigned, rather than defaulting to a flat severity for "any detected difference."
- **INFERENCE, connecting to §1:** the two axes interact with §1's temporal-staleness mechanism — a claim that is both objectively verifiable, decision-relevant, *and* time-sensitive (current pricing, current leadership) is exactly the category where §1's evidenced mechanism (stale context actively misleads) applies most directly, making this the highest-priority intersection for detection effort within the 5-minute runtime budget, rather than spreading detection evenly across all claim types.

### D. Important mechanisms
The materiality taxonomy is the mechanism that prevents Topic P (and, by extension, the shared infrastructure it feeds into F37-F40 and H's §4) from becoming exactly the "big SEO checklist" / undifferentiated diff-tool the brief explicitly warns against building. Without it, any cross-source comparison check will produce a flood of low-value findings (trivial phrasing differences, formatting, snapshot-date artifacts) that drown out the small number of genuinely decision-relevant discrepancies.

### E. Concrete website signals
This unit doesn't generate a standalone website signal — it is the **classification schema** applied to whatever claims §1, §3, Topic F's F37-F40, and Topic H's §4 each independently extract, ensuring they are filtered consistently before being scored.

### F. How the signal could be detected automatically
Deterministic-first classification: claims extracted via pattern-matching (currency symbols + numbers → pricing; named-entity + title keywords like "CEO"/"founder" → leadership; address-pattern matching → location; date patterns near "founded"/"established" → founding date) are deterministically tagged as objectively-verifiable by category. Decision-relevance tagging uses a small, fixed, defensible lookup (pricing/leadership/location/legal-status/certifications = high; founding-year precision/mission-statement phrasing = low), escalating only genuinely ambiguous claim types to a single LLM judgment call — consistent with this document series' standing hybrid-approach discipline.

### G. What evidence the skill should report
For every flagged cross-source discrepancy (wherever it originates — §1, §3, F37-F40, or H's §4), the report should carry both taxonomy tags (verifiability, decision-relevance) alongside the discrepancy itself, so severity is always traceable to an explicit classification rather than an implicit "this looked different" judgment.

### H. Possible severity logic
Directly derived from the two-axis taxonomy: **high severity** requires both axes to be high (objectively verifiable AND decision-relevant) AND (per §1) ideally also time-sensitive; **low/informational severity** for anything failing either axis; **no finding at all** for subjective/marketing language, which should be filtered out before comparison even runs, not merely down-weighted after the fact.

### I. Correct remediation
N/A directly — this unit governs *whether and how severely* to report findings generated elsewhere, not a remediation of its own.

### J. False-positive cases
This entire unit exists specifically to prevent false positives — its own failure mode would be an incorrectly-calibrated taxonomy that still lets trivial discrepancies through as high-severity, or conversely, one so conservative it suppresses genuinely material findings. Given this is HYPOTHESIS-tier, unvalidated design work (per §C), this risk should be explicitly flagged rather than assumed solved.

### K. False-negative risks
A claim type not anticipated by the fixed lookup table (an unusual but genuinely decision-relevant claim specific to a niche industry) could be misclassified as low-relevance by the deterministic pass — the LLM-escalation fallback partially mitigates this but won't catch every case within the runtime budget.

### L. Counterexamples
A claim that seems low-materiality in the abstract (e.g., exact employee count) could be genuinely high-stakes for a specific site type (a claim of "Series A funded, 50 employees" is decision-relevant for a B2B SaaS buyer evaluating vendor stability in a way it wouldn't be for a local bakery) — materiality is not perfectly universal and should be treated as a default, overridable-by-context starting point rather than an immutable rule, a direct hook to Topic V (site-type differentiation).

### M. Does this generalize across site types?
The two-axis *framework* generalizes; the specific decision-relevance weights per claim type should be site-type-conditioned per the counterexample above — this is explicitly flagged as an area needing Topic V's input during the Combine phase, not a solved, final weighting scheme.

### N. Candidate skill(s)
Not a standalone skill — the shared classification schema used by **`cross-source-fact-consistency-check`** and, per the cross-references established in Topics F and H, by `entity-identity-audit`'s F37-F40 sub-check and `cross-source-corroboration-check`'s §4 sub-check as well.

### O. Relationship to other potential skills
This is the piece of shared infrastructure that makes the "build once, not three times" recommendation from Topics F and H actually coherent — without a common materiality taxonomy, three independently-built comparison checks would each invent their own ad hoc materiality judgment, defeating the purpose of sharing the underlying comparison logic in the first place.

---

## §3 — Platform-specific update mechanics and directionality

### A. What we need to understand
For the specific platforms named in the master list (P1–P10: LinkedIn, Wikipedia, Wikidata, Crunchbase, directories, Google Business Profile, press, review platforms, social profiles, partner websites), what do we actually, verifiably know about how each one gets updated, how that relates to a brand's own site, and therefore which side is more plausibly authoritative when they disagree — as opposed to assuming the brand's own site is always right, or that any of these platforms updates at a predictable pace?

### B. Why it matters
Blind directionality assumptions ("the external source is more objective/independent, therefore trust it over the brand's self-description") and the opposite ("it's the brand's own official site, trust it over third parties") are both potentially wrong depending on the platform and the specific update mechanics involved — this unit's job is to replace assumption with whatever can actually be verified per platform, and be explicit about the platforms where we simply don't have good evidence.

### C. Current evidence
- **FACT (Wikipedia/Wikidata specifically, direct, primary-source, already established in §1 but centrally relevant here):** the `Template:Infobox company` fallback-override mechanic (local Wikipedia values override linked Wikidata values) means Wikipedia and Wikidata are not two fully independent sources for company infoboxes — they are a single template system with defined precedence rules. A genuine Wikipedia-vs-Wikidata mismatch for a company fact is evidence of an **unsynchronized edit** (one was updated, the other wasn't), not necessarily evidence that either is more "authoritative" in the abstract — the practically useful signal is which one has a *more recent* edit/revision timestamp, which is independently checkable via each platform's own revision history, not a property either platform's content alone reveals.
- **FACT (peer-reviewed, Wikipedia infobox staleness specifically):** the Barth (2023) paper (§1 above) confirms infobox staleness is a real, non-trivial, actively-studied problem within Wikipedia's own data-quality research — meaning **absence of contradiction is not strong evidence of correctness** for Wikipedia infobox data specifically; the paper's whole premise is that likely-stale fields often go unflagged and unnoticed by editors.
- **OBSERVATION, moderate confidence, procedurally verifiable (as flagged in §1):** Wikipedia's own conflict-of-interest editing policy (independently verifiable via Wikipedia's own policy pages, not just the PR-firm secondary sources) establishes that a company should not directly edit its own Wikipedia article for factual updates but should use the Talk-page/`{{edit COI}}` request mechanism — meaning a detected Wikipedia/site discrepancy cannot be "fixed" by the brand editing Wikipedia directly the way it could correct its own site; remediation for this specific platform is procedurally distinct (a request process, not a direct edit), a genuinely useful, non-obvious operational detail for the skill's remediation guidance.
- **No verified, primary-source-grounded evidence found in this research pass on update mechanics or authoritativeness for LinkedIn, Crunchbase, Google Business Profile, or general web directories specifically** — despite active searching, this research pass did not surface primary documentation (from LinkedIn, Crunchbase, or Google) describing how quickly or reliably these platforms reflect company-initiated updates, or offering any basis for a general directionality rule for them. This is an **honest, explicitly flagged evidence gap**, not filled with inference dressed as fact: for these platforms, the only defensible design is (a) treat a detected discrepancy as "unresolved directionality — flag both values and let the brand determine which is current," rather than asserting either side is more likely correct, and (b) note that for company-controlled profiles specifically (LinkedIn company pages, Google Business Profile, Crunchbase profiles the company has claimed), the brand plausibly has **direct edit access**, which changes the remediation story entirely from Wikipedia's request-based process — the brand can simply update these directly, which is a categorically different and simpler remediation than the Wikipedia case, even though we lack primary evidence on update propagation speed.
- **INFERENCE (from Topic H §1's corroboration-type findings, applied here):** press/news coverage and review-platform content are, per Topic H's established evidence (institutional/news sources carry genuine if reversible credibility weight; volume/repetition biases exist), more useful as **corroboration-strength evidence** (Topic H's territory) than as **update-mechanics/directionality evidence** (this unit's territory) — a news article is a point-in-time snapshot, not a living record that gets "updated" the way a Wikidata statement or a company's own LinkedIn page can be, meaning "press coverage says something different from the current website" is usually better interpreted as "the press coverage is an accurate snapshot of an earlier state, and the world changed since," which is a specific, benign sub-case of §1's temporal-staleness mechanism, not an unresolved contradiction requiring directionality judgment at all.

### D. Important mechanisms
This unit's central, somewhat uncomfortable finding is that **directionality confidence varies enormously and unevenly by platform**, and the honest position — consistent with this document series' standing epistemic discipline — is to say so plainly rather than manufacture false confidence for platforms where no real evidence exists. Wikipedia/Wikidata is the one pairing in the entire P1-P10 list where this document can offer genuine, primary-source-grounded mechanical insight (the template fallback rule, the COI editing process); for the rest, the honest output is a *lower-confidence, evidence-flagged* comparison rather than a confidently-directional one.

### E. Concrete website signals
For Wikipedia/Wikidata specifically: whether the brand's own `sameAs` links (per Topic F's F13-F16/F37-F40 scaffolding) point to both, enabling the revision-timestamp comparison described in §C. For company-controlled profiles (LinkedIn, Google Business Profile, Crunchbase where claimed): whether the brand's `sameAs` links exist at all, since their absence is itself informative (the brand may not have claimed/verified these profiles, a distinct and separately-actionable finding from "the claimed profile has stale data").

### F. How the signal could be detected automatically
For Wikipedia/Wikidata: where feasible within the runtime budget, a single bounded fetch of each platform's revision-history metadata (both expose this) to compare last-edit recency for the specific field in question, rather than assuming either source's mere existence implies correctness. For other platforms: presence/absence of a `sameAs` link only, with any content-level comparison reported at explicitly lower confidence given the evidence gap in §C, and remediation language distinguishing "claim/verify this profile" (if absent) from "update this profile" (if present but stale, only for company-controlled platforms).

### G. What evidence the skill should report
For each platform checked: whether linked, whether a discrepancy was found, and — critically, per §D — an explicit **confidence label on the directionality judgment itself** ("high confidence: Wikipedia/Wikidata revision timestamps indicate X is more recent" vs. "low confidence: discrepancy detected, but this tool has no reliable basis for determining which value is current for this platform").

### H. Possible severity logic
Modulated by both §2's materiality taxonomy and this unit's directionality confidence — a high-materiality discrepancy with high-confidence directionality (e.g., Wikipedia clearly shows a more recent, different value than the site) warrants a specific, actionable finding; the same materiality level with low-confidence directionality (e.g., an unexplained LinkedIn discrepancy with no way to determine which is current) should still be reported, but framed as "worth the brand's own verification" rather than asserting which side is wrong.

### I. Correct remediation
Platform-specific, per §C's findings: for Wikipedia, the COI request process (not direct editing); for company-controlled profiles, direct claiming/updating; for press/review snapshots, generally no remediation is needed at all (per §D, these are usually benign point-in-time artifacts, not genuine unresolved contradictions).

### J. False-positive cases
Treating a news article's point-in-time description as an "inconsistency" with a since-updated website is the clearest false-positive risk this unit identifies and explicitly guards against (§D) — this is arguably a more specific and non-obvious guardrail than a generic "don't over-flag" instruction, since it gives a concrete reason (snapshot vs. living record) rather than just caution.

### K. False-negative risks
The evidence gap for LinkedIn/Crunchbase/GBP/directories (§C) means this unit cannot currently offer strong assurance about catching genuine staleness on those platforms — a "no discrepancy found" result for these platforms should be reported as low-confidence/limited-scope, not as an assurance of consistency, consistent with this document series' standing practice of not overclaiming absence-of-evidence as evidence-of-absence.

### L. Counterexamples
A company-controlled LinkedIn profile could in principle be *more* current than the company's own website if the marketing team updates LinkedIn faster than the site (a real, plausible scenario given no evidence either way) — this is a direct counterexample to any assumption that a brand's own website is always the more current or authoritative source, reinforcing why this unit refuses to assert a general directionality rule beyond the Wikipedia/Wikidata case where actual mechanical evidence exists.

### M. Does this generalize across site types?
The Wikipedia/Wikidata mechanical findings generalize universally (the template system works the same way regardless of the brand). The confidence gaps for other platforms are also universal (this document found no site-type-specific primary evidence for any of them either) — meaning this unit's honest-uncertainty framing, not just its specific findings, is what should generalize into the skill's design.

### N. Candidate skill(s)
Folds into **`cross-source-fact-consistency-check`**, sharing the Wikipedia/Wikidata revision-comparison logic directly with Topic F's F37-F40 sub-check (both need the same mechanical fact about template fallback and revision timestamps).

### O. Relationship to other potential skills
Directly and specifically fulfills the "implement once, share across F37-F40, H's §4, and this topic" recommendation both prior documents made — the Wikipedia/Wikidata template-fallback mechanic (§C) is a piece of primary-source-grounded technical knowledge neither prior document had, and materially improves the shared infrastructure's correctness beyond what either F or H could have built alone without this research.

---

## §4 — Consolidated shared-infrastructure design (not a new research unit — a synthesis)

This section is not a seventh A–O investigation; it is the concrete design synthesis Topics F (§F37-F40), H (§4), and this document's own §1-§3 all converged on requesting. Presented here, once, as the shared component all three should call.

**Function:** `compare_claim_against_source(claim, brand_value, external_source, external_value)` →
1. Classify `claim` via §2's two-axis materiality taxonomy (objective-verifiability × decision-relevance); if either axis is low/unverifiable, return no-finding or informational-only.
2. If `external_source` is Wikipedia or Wikidata: apply §3's template-fallback-aware comparison (check revision timestamps, not just content) before asserting directionality.
3. If `external_source` is a company-controlled profile (LinkedIn/GBP/Crunchbase, where claimed): apply §3's lower-confidence, evidence-flagged comparison, with remediation framed as "update directly" if the brand's `sameAs` confirms ownership.
4. If `external_source` is press/review content: apply §3's point-in-time-snapshot reasoning by default (§D) — do not treat as an unresolved contradiction unless the material discrepancy is large and the press date is recent relative to the site's own dating (§1).
5. Apply §1's temporal-staleness-priority weighting: claims that are simultaneously high-materiality (§2) and time-sensitive (§1) receive detection priority within the runtime budget over static/evergreen claims.
6. Output always carries: the claim, both values, materiality tags, directionality confidence label, and platform-specific remediation guidance — never a bare "inconsistency found."

This function is the direct implementation target for `cross-source-fact-consistency-check` (this topic's primary candidate skill), and should be called by `entity-identity-audit` (Topic F, F37-F40) and `cross-source-corroboration-check` (Topic H, §4) rather than each reimplementing comparison logic independently.

---

## 2. Findings register (structured, per the required format)

---
**FINDING ID:** P-01
**Researcher:** Harsh
**Research Area:** P — Cross-Web Consistency
**Research Question:** §1 — does stale third-party content merely fail to help an AI system, or does it actively mislead it, and is distinguishing stale from current a genuinely hard retrieval problem?
**Observation:** A controlled 2026 study found that providing an outdated passage to an LLM alongside a time-sensitive query produced measurably *worse* answers than providing no passage at all (a Temporal Accuracy Gap swinging from +2.67% to -12.22% for one tested model) — stale context actively anchors the model toward wrong answers rather than merely failing to help. A second independent, rigorously-controlled study found that naive similarity-based retrieval cannot reliably distinguish current from superseded facts when they are textually identical except for the changed value, with realistic ("marker-free") baselines leaking stale information 25-60% of the time.
**Evidence:** "When Benchmarks Age: Temporal Misalignment through Large Language Model Factuality Evaluation," arXiv 2510.07238; "Temporal Validity in Retrieval Memory: Eliminating Stale-Fact Errors for AI Agents over Evolving Knowledge," arXiv 2606.26511.
**Sources:** See §1 §C.
**Pattern:** Ambiguous currency (a claim with no dating signal, indistinguishable from a superseded version of itself) is a demonstrated, quantified risk factor — not merely a best-practice nicety — because retrieval-based systems are shown, in controlled conditions, to struggle at exactly this discrimination task.
**Counterexamples:** A separate, independently-evidenced mechanism (arXiv 2606.20959) shows models can also surface outdated *parametric* (trained-in) knowledge even when correct current information is available in context — meaning website-side dating fixes address only the context-level risk, not this separate, out-of-scope mechanism; this must be stated as an honest limitation.
**Hypothesis:** Explicit, visible, co-located dating signals (as-of language, `dateModified`) on time-sensitive claims measurably reduce the ambiguous-currency risk demonstrated in the cited studies, though this specific website-side intervention has not itself been directly tested by either paper.
**Signal:** Presence/absence of a legible currency signal co-located with each time-sensitive claim (per §2's taxonomy).
**How to Detect:** Deterministic claim-category extraction + co-located date-pattern/schema check.
**Evidence Output:** Which time-sensitive claim categories were found, and whether each carries a legible currency signal.
**False Positives:** Evergreen, non-time-sensitive content must never be flagged for lacking a date.
**False Negatives:** A present dating signal doesn't guarantee it was actually refreshed when the underlying claim changed; this check cannot verify that from a single crawl.
**Severity:** Low-Medium standalone; escalates only when combined with an actual cross-source discrepancy found via §4's shared comparison logic.
**Recommended Fix:** Add explicit, visible currency dating to time-sensitive claim sections.
**Generalization:** High — mechanism and detection approach are site-type agnostic; specific claim taxonomy is site-type-conditioned.
**Candidate Skill:** `cross-source-fact-consistency-check`
**Related Skills:** Topic F (F41-F46, same self-disambiguation principle applied to temporal rather than entity ambiguity), Pulkit's Topic A (A15, age ≠ staleness).
**Confidence:** HIGH (the underlying mechanisms, both independently peer-reviewed and controlled) / MEDIUM (that our specific website-side dating intervention produces the same effect size these papers measured for a different intervention point in the pipeline).

---
**FINDING ID:** P-02
**Researcher:** Harsh
**Research Area:** P — Cross-Web Consistency
**Research Question:** §3 — for Wikipedia and Wikidata specifically, what do we actually know about update mechanics that bears on directionality when they disagree with a brand's own site?
**Observation:** Wikipedia's own `Template:Infobox company` documentation establishes that locally-edited Wikipedia infobox values always override the linked Wikidata value for the same field — meaning Wikipedia and Wikidata are not two independent sources for company facts but a single template system with defined precedence, and a mismatch between them reflects an unsynchronized edit, not two competing authorities. Separately, a peer-reviewed paper confirms Wikipedia infobox staleness is a real, actively-studied problem, meaning the mere presence of a Wikipedia/Wikidata value should not be assumed correct by default.
**Evidence:** Wikipedia `Template:Infobox company` documentation (en.wikipedia.org); Barth, "Detecting Stale Data in Wikipedia Infoboxes," EDBT 2023 (openproceedings.org).
**Sources:** See §3 §C.
**Pattern:** Directionality confidence for cross-source comparison is not uniform across platforms — it is high and mechanically groundable for Wikipedia/Wikidata specifically (via revision-timestamp comparison), and explicitly unverified for LinkedIn, Crunchbase, Google Business Profile, and general directories, for which no primary evidence on update mechanics was found in this research pass.
**Counterexamples:** A company-controlled profile (LinkedIn, GBP) could in principle be updated faster than the company's own website — a direct counterexample to any assumption that a brand's own site is always the more current or authoritative source.
**Hypothesis:** A shared cross-source comparison function should apply platform-specific confidence labeling (high-confidence, revision-timestamp-grounded for Wikipedia/Wikidata; lower-confidence, evidence-flagged for other platforms) rather than a uniform directionality rule.
**Signal:** Revision/edit timestamp comparison between a brand's site and its linked Wikipedia/Wikidata entries, where fetchable within the runtime budget.
**How to Detect:** Bounded fetch of Wikipedia/Wikidata revision-history metadata for the specific field in question, compared against the site's own dating signal (per §1).
**Evidence Output:** Discrepancy (if any), directionality confidence label, and — for Wikipedia specifically — correct remediation framing (COI request process, not direct editing).
**False Positives:** A Wikipedia/Wikidata field mismatch alone, without a revision-timestamp check, should not be asserted as "Wikidata is wrong" or "the site is wrong" — direction must be evidence-based, not assumed.
**False Negatives:** No primary evidence exists for update-propagation speed on LinkedIn/Crunchbase/GBP/directories — absence of a detected discrepancy on these platforms should be reported as limited-confidence, not as assurance of consistency.
**Severity:** Modulated by §2's materiality taxonomy combined with this unit's directionality confidence label.
**Recommended Fix:** Platform-specific — COI request process for Wikipedia; direct update for company-controlled profiles where claimed; generally no action needed for press/review snapshot discrepancies (per §3 §D).
**Generalization:** The Wikipedia/Wikidata mechanical facts generalize universally (template system is uniform); the evidence gap for other platforms is also universal, meaning the honest-uncertainty framing itself should generalize into the skill's design, not just the specific findings.
**Candidate Skill:** `cross-source-fact-consistency-check`, directly shared with Topic F's F37-F40 sub-check.
**Related Skills:** Topic F (F37-F40 — same Wikipedia/Wikidata mechanism, now improved with this document's template-fallback finding), Topic H (§4 — same shared comparison infrastructure).
**Confidence:** HIGH (the Wikipedia/Wikidata template mechanics, directly documented) / LOW (directionality for all other named platforms, an explicitly flagged evidence gap, not filled with unsupported inference).

---
**FINDING ID:** P-03
**Researcher:** Harsh
**Research Area:** P — Cross-Web Consistency
**Research Question:** §2 — can "one outdated statement = globally stale website" (the brief's own named forbidden pattern) be structurally prevented, rather than merely avoided by good intentions, through an explicit materiality taxonomy?
**Observation:** No external source provides a ready-made materiality taxonomy for this exact use case; this finding documents original synthesis work combining this document series' own established principles (Topic H's conflict-vs-absence distinction, this document's own temporal-staleness findings, and direct reasoning about decision-relevance) into a concrete, two-axis (objective-verifiability × decision-relevance) classification scheme applied to every claim before any discrepancy is scored.
**Evidence:** Synthesized from Topic H's Finding H-03 (inter-context conflict taxonomy) and this document's own §1 findings; no single external primary source for the taxonomy itself — explicitly labeled as HYPOTHESIS-tier design work, not externally validated.
**Sources:** See §2 §C.
**Pattern:** Undifferentiated diff-based consistency checking is structurally prone to exactly the false-positive pattern the brief explicitly forbids; a mandatory two-axis classification step, applied before severity assignment, is proposed as the structural fix.
**Counterexamples:** Materiality is not perfectly universal — a claim type that is low-relevance by default (e.g., exact employee count) can be genuinely high-stakes for specific site types (B2B SaaS vendor evaluation) — the taxonomy is a default, context-overridable starting point, not an immutable rule.
**Hypothesis:** Requiring both axes (verifiability and decision-relevance) to be high before a discrepancy can receive more than informational severity will measurably reduce false-positive noise without suppressing genuinely material findings — untested against real websites in this research pass.
**Signal:** N/A directly — this is a classification schema applied to signals generated elsewhere (§1, §3, F37-F40, H's §4).
**How to Detect:** Deterministic pattern-based claim-category extraction and lookup-table tagging, with LLM escalation for ambiguous claim types.
**Evidence Output:** Every flagged discrepancy carries explicit verifiability and decision-relevance tags alongside the underlying finding.
**False Positives:** This unit's own miscalibration risk (an incorrectly weighted taxonomy) is explicitly named as a risk given its HYPOTHESIS-tier status.
**False Negatives:** An unanticipated claim type not covered by the fixed lookup table could be under-classified; LLM escalation partially, not fully, mitigates this.
**Severity:** N/A directly — this unit determines severity for findings generated elsewhere, rather than generating its own.
**Recommended Fix:** N/A directly.
**Generalization:** The two-axis framework generalizes; specific per-claim-type weights require site-type conditioning (Topic V hook).
**Candidate Skill:** Shared classification schema used by `cross-source-fact-consistency-check`, `entity-identity-audit` (F37-F40), and `cross-source-corroboration-check` (H's §4).
**Related Skills:** All three comparison-based sub-checks across Topics F, H, and P — this is the mechanism that makes their "build once" recommendation coherent.
**Confidence:** MEDIUM — the underlying principle (materiality must gate severity) is well-supported by this document series' accumulated evidence; the specific taxonomy design is original synthesis, not independently validated, and should be flagged as a priority for lightweight testing against real sites before the Combine phase finalizes thresholds.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
Stale or ambiguously-dated third-party content is not a passive, neutral gap in an AI system's knowledge — it is a demonstrated, quantified, active risk factor that measurably worsens answer accuracy (the Temporal Accuracy Gap finding, arXiv 2510.07238), compounded by a second, independently-evidenced finding that distinguishing current from stale information is a genuinely hard problem for retrieval systems under realistic conditions (arXiv 2606.26511's marker-free benchmark result). Together, these give Topic P's core recommendation — make currency legible on time-sensitive claims — a real, controlled evidentiary basis rather than resting on the intuitive-but-unproven "freshness is good practice" framing most teams will likely default to.

**Strongest unvalidated hypothesis:**
The two-axis materiality taxonomy (§2) — the mechanism specifically designed to structurally prevent the brief's own named forbidden false-positive pattern. It is original synthesis work, not independently validated by an external source, and should be an explicit priority for lightweight testing (against a handful of real sites with known, verifiable claim discrepancies of varying materiality) before the Combine phase locks in its severity thresholds.

**Strongest candidate skill:**
`cross-source-fact-consistency-check`, built around the consolidated §4 shared-infrastructure design — directly fulfilling and materially improving on the "build once, share across three topics" recommendation both Topic F and Topic H independently converged on, now grounded in this document's own primary-source findings on Wikipedia/Wikidata template mechanics that neither prior document had access to.

**Weakest assumption we should investigate next:**
The near-total absence of primary evidence on update mechanics and directionality for LinkedIn, Crunchbase, Google Business Profile, and general web directories (§3) is this document's most significant, honestly-flagged gap. Rather than filling it with plausible-sounding inference (the exact failure mode this entire document series has repeatedly identified and rejected in commercial content), it is reported as an explicit low-confidence zone. Before finalizing severity/confidence thresholds for discrepancies found on these specific platforms, the team should treat any finding there as provisional and clearly labeled as such in the report output, rather than presenting it with the same confidence as the Wikipedia/Wikidata findings.

---

## 4. Cross-references for the Combine & Code phase (flags for Pulkit/Soham)

- **§4 (consolidated shared-infrastructure design) ↔ Topic F (F37-F40) and Topic H (§4):** This document directly fulfills the "implement once, not three times" recommendation both prior documents made, and supplies the concrete function signature and platform-specific logic (§4) that should now be treated as settled for the Combine phase — Topic F's `entity-identity-audit` and Topic H's `cross-source-corroboration-check` should call this shared component rather than reimplementing comparison logic.
- **P-02 (Wikipedia/Wikidata template-fallback mechanic) ↔ Topic F's F37-F40 finding:** This is new primary-source-grounded information neither Topic F nor Topic H had — recommend Topic F's F37-F40 section be updated to reference this template-mechanics finding, since it directly refines that section's own consistency-check design.
- **§2 (materiality taxonomy) ↔ Topic S (Soham, Scoring & Severity):** The two-axis classification scheme is a concrete, reusable design Topic S's severity/confidence schema work should incorporate directly, rather than each topic inventing its own ad hoc materiality judgment — this is the most actionable, implementation-ready deliverable in this document for Soham's Combine-phase work specifically.
- **§1 (temporal accuracy gap finding) ↔ Pulkit's Topic A (A15, freshness/reranking) and Topic I (freshness, staleness — also Pulkit's):** The controlled, quantified evidence in this document (arXiv 2510.07238, arXiv 2606.26511) is directly relevant to and should strengthen Pulkit's Topic I deep-dive on freshness, which was deferred from his Topic A document specifically to avoid duplicating a full freshness investigation — recommend this document's §1 findings be cross-cited there rather than re-derived.
