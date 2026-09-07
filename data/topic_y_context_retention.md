# Topic Y — Context Retention (Y1–Y15)
**Researcher:** Soham | **Research Area:** Y — Context Retention
**Priority:** High

---

## 0. Framing — the honest scoping problem this topic has that the others didn't

Topic Y has a structural issue none of my other topics ran into, and I'd rather name it up front than let it surface as a surprise at implementation time: **several of the fifteen sub-topics describe state that a stateless, read-only, single-visit, anonymous crawl fundamentally cannot observe.** Y2 (referrer context), Y15 (returning-user context), and the personalization angle of Y12/Y13 (location/audience context) all describe how a page *would* behave for a specific visitor in a specific state — but the audit tool has no real referrer, no session history, no login, and (per the handout's own constraints) no authenticated-area access. Pretending to "check" these directly would mean fabricating a signal that doesn't actually measure what it claims to. The honest, disciplined move — and this document's most important structural contribution — is to say precisely which sub-topics are directly testable, which need a redefined, *feasible* proxy check, and which should be explicitly reported as "not assessable by this audit method" rather than silently skipped or falsely claimed.

Two more disclosed overlaps, consistent with how this project has handled repetition elsewhere: **Y10/Y14 (related content, task continuity) are substantially Topic X's Cluster C (forward-path continuity)**, applied more broadly than just the AI-citation moment — treated here as an extension, not a re-derivation. **Y3 (landing-page context) is the general case of Topic X's Cluster A/B**, which already covers the AI-citation-specific version of "does the page confirm why you're here."

What's genuinely new here: a solid, decades-old information-architecture and wayfinding literature (Morville & Rosenfeld; Nielsen) that grounds the structural-orientation sub-topics (breadcrumbs, navigation, labeling) far more rigorously than intuition alone — and the scoping discipline above, which is itself a finding worth surfacing to the team before anyone builds a check that can't do what its name implies.

The fifteen sub-topics collapse into five clusters.

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. Cluster map — Y1–Y15 collapsed to five mechanisms, with feasibility flagged

| Sub-topic | Cluster | Directly testable by a stateless crawl? |
|---|---|---|
| Y1 (query context), Y2 (referrer context), Y4 (deep-link context) | **A — Upstream context awareness** | Y1/Y4 partially (query can be simulated; deep-link URLs can be tested directly); **Y2 not directly** — no real referrer available |
| Y3 (landing-page context), Y6 (page titles), Y7 (section labels) | **B — Self-orientation signals** | Yes — fully testable from static/rendered content |
| Y5 (breadcrumbs), Y8 (persistent navigation), Y9 (back-navigation) | **C — Structural navigation & wayfinding** | Yes — fully testable from static/rendered content |
| Y10 (related content), Y11 (comparison context), Y14 (task continuity) | **D — Task & goal continuity** | Yes, largely — extends Topic X's Cluster C |
| Y12 (location context), Y13 (audience context), Y15 (returning-user context) | **E — Personalization-adjacent context** | **Not directly** — requires session/identity state the audit tool doesn't have; redefined proxy checks only |

---

## Cluster A — Upstream context awareness
**Covers:** Y1 (query context), Y2 (referrer context), Y4 (deep-link context)

### A. What we need to understand
Whether a page, once landed on, reflects or at least remains coherent with whatever specific query, click-through, or deep link brought the visitor there — and which parts of this are actually testable given the audit's stateless nature.

### B. Why it matters
This is the most upstream point where context can be lost — before a visitor even forms an impression of the page's content (Cluster B) or its structure (Cluster C), the very fact of "does this page acknowledge or align with the specific thing I just clicked" is already being evaluated.

### C. Current evidence

**INFERENCE** — Y1 (query context) is directly testable using the same machinery Topic W already builds: generate a representative query, identify the most-likely-landing page, and check whether that page's content reflects the query's specific framing (not just its general topic) — this is not a new mechanism, it's Topic W's alignment check applied at the landing moment rather than the citation-selection moment.

**INFERENCE** — Y4 (deep-link context) is fully, directly testable: crawl the page via its actual deep-link URL (an anchor, a query parameter, a specific sub-path) exactly as an AI citation or search result would present it, and check whether landing there (rather than at the domain root) produces a coherent, oriented experience — no simulation is required since this is simply testing the real URL.

**FACT (an honest, structural limitation, not a workaround)** — Y2 (referrer context) describes content or behavior that would depend on an HTTP referrer header or a personalization system reading it — a stateless, anonymous crawl performed by an audit tool has no real referrer to present, and the handout's own constraints (read-only, no authenticated-area manipulation) don't extend to spoofing arbitrary request headers to probe hidden personalization branches. **This sub-topic cannot be directly tested by this audit method.** The honest, feasible proxy is a *worst-case* check instead: does the page provide adequate self-orientation (Cluster B) *without* relying on any referrer-based context at all — i.e., does it degrade gracefully for the "no referrer information available" case, which is also the exact case the audit tool itself is in.

### D. Important mechanisms
The unifying insight: two of these three sub-topics are fully testable using infrastructure this project already has (Topic W for Y1, direct URL-fetching for Y4); the third (Y2) needs to be explicitly reframed as a feasibility-appropriate proxy rather than either skipped silently or falsely claimed as tested.

### E. Concrete website signals
Query-framing match on the landing page (reusing Topic W); presence of coherent self-orientation when a deep-link URL is fetched directly (no dependence on having visited the domain root first); presence/absence of adequate no-referrer-case self-orientation (the honest Y2 proxy).

### F. How the signal could be detected automatically
Y1: reuses Topic W's hybrid deterministic/LLM approach entirely. Y4: purely deterministic — fetch the deep-link URL directly and check the resulting page's self-orientation signals (Cluster B) exist without depending on referrer or prior navigation state. Y2: same self-orientation check as Y4, explicitly labeled as a proxy, not a direct test.

### G. What evidence the skill should report
For Y2 specifically, the report should state plainly that this is a proxy assessment (adequate no-referrer-case orientation) and not a direct test of referrer-based personalization, so the limitation is visible to whoever reads the finding rather than implied to be more than it is.

### H. Possible severity logic
Standard severity scaling for Y1/Y4 findings; Y2's proxy finding should carry a visible confidence caveat rather than being scored identically to a directly-tested finding.

### I. Correct remediation
Y4: ensure deep-linked pages are self-orienting on arrival, not dependent on a prior visit to the homepage. Y2: ensure baseline self-orientation is strong enough to not require referrer-based context to make sense.

### J. False-positive cases
Flagging a page for "not personalizing based on referrer" as if that were inherently a defect — many legitimate sites have no referrer-based personalization at all, and its absence is not itself a finding; only the *proxy* (does the page orient well with zero assumed context) is a legitimate, feasible check.

### K. False-negative risks
A site could have referrer-based personalization that meaningfully degrades the experience for AI-referred traffic specifically (e.g., showing content tailored to an assumed search-engine referrer that doesn't match how AI-referred traffic actually arrives) — this audit method cannot detect that at all, and this should be named as a known blind spot rather than implied to be covered.

### L. Counterexamples
A page correctly and appropriately shows the same content regardless of referrer for content types where personalization would be inappropriate (e.g., legal/regulatory disclosure text) — undifferentiated-by-referrer is often the *correct* behavior, not evidence of a gap.

### M. Generalizes?
Yes for Y1/Y4; the Y2 feasibility limitation is a property of the audit method itself, so it generalizes as a *constraint*, not a site-specific finding.

### N. Candidate skill(s)
Not a standalone skill — Y1/Y4 checks fold into Topic W's existing query-alignment infrastructure and a lightweight deep-link-fetch step in the entrypoint orchestrator; Y2 folds into Cluster B's self-orientation check as a specifically-labeled proxy.

### O. Relationship to other skills
Directly dependent on Topic W (Y1) and the entrypoint orchestrator's crawl strategy (Y4, Z).

---

## Cluster B — Self-orientation signals
**Covers:** Y3 (landing-page context), Y6 (page titles), Y7 (section labels)

### A. What we need to understand
Whether a page, considered entirely on its own with zero assumed prior context, clearly communicates what it is, where within the site it sits, and what specific content it holds — the baseline every other cluster in this topic (and Cluster A's Y2 proxy) depends on.

### B. Why it matters
This is the foundational layer: if a page can't orient a visitor who has zero context, no amount of breadcrumbs (Cluster C) or related-content links (Cluster D) will fully compensate, since those all assume the visitor already understands *where they are* well enough to know where to go next.

### C. Current evidence

**FACT** — Morville & Rosenfeld's foundational information-architecture framework (*Information Architecture for the World Wide Web*, 1998, revised through multiple editions, described in subsequent literature reviews as "the bible" of the field) formally decomposes site orientation into four systems: **organization** (how content is grouped), **navigation** (how users move through it), **labeling** (how content and navigation are named), and **search**. Page titles and section labels are not incidental UI details in this framework — they are the concrete implementation of the labeling system, one of the four foundational pillars.

**INFERENCE** — A page title that's generic, templated, or duplicated across many pages (e.g., every product page titled just "Shop") fails the labeling-system function even if the page's actual content is perfectly clear once read — title and section labels are specifically the *fast, low-effort* orientation mechanism, meant to work before a visitor reads any body content at all, which is exactly the moment an AI-referred visitor (Topic X) or a landed searcher (Y1) needs it most.

**INFERENCE** — Y3 (landing-page context) is the general case of a check this project already has in narrower form: Topic X's Cluster A/B established this exact mechanism specifically for AI-citation handoff. Here it applies more broadly — to any landing scenario, not just an AI referral — and should reuse that infrastructure rather than being re-derived.

### D. Important mechanisms
The unifying insight: page titles and section labels aren't cosmetic — they're the literal implementation of one of information architecture's four foundational systems (labeling), and their failure mode (genericness, duplication, mismatch with actual content) is a well-defined, decades-documented category, not a vague "make it clearer" instruction.

### E. Concrete website signals
Page `<title>` uniqueness and specificity relative to the page's actual content; heading/section-label correspondence to the content that actually follows them (directly reusable from Pulkit's existing heading-to-content alignment work); presence of a clear, early "what is this page" statement in visible text.

### F. How the signal could be detected automatically
Mostly deterministic: title uniqueness checking across the crawled sample (are many pages using near-identical titles), title-to-content semantic similarity (cheap embedding check). The "is this page's purpose clear" judgment for Y3 more broadly reuses Topic X's existing hybrid approach.

### G. What evidence the skill should report
The specific generic/duplicated title found, and (for Y3) the specific missing self-orientation element, directly citing Topic X's Cluster A/B evidence-output convention.

### H. Possible severity logic
Higher severity for duplicated/generic titles on pages that are plausible AI-citation or search-landing targets (reusing Topic W's likely-landing-page classification) than on low-traffic utility pages.

### I. Correct remediation
Write specific, unique, content-reflective titles and section labels; ensure an early, clear "what/who this page is" statement in visible text.

### J. False-positive cases
Some page types (a single-purpose contact form, a simple thank-you page) legitimately don't need elaborate self-orientation content beyond a clear title — this shouldn't be penalized as if every page needed a paragraph of context-setting.

### K. False-negative risks
A title could be technically unique and specific but still misleading relative to the actual content (keyword-stuffed titles that don't reflect genuine page purpose) — uniqueness alone isn't sufficient; the title-to-content alignment check is the more important half of this signal.

### L. Counterexamples
Highly technical reference pages (an individual API endpoint's documentation) may have a title that looks "generic" to a lay reader but is precisely correct and expected labeling convention for its actual audience (Topic V's Cluster D norms) — this should be gated by site-type/audience expectations, not judged by general-audience clarity standards.

### M. Generalizes?
Yes — the labeling-system concept and its failure modes are domain-agnostic and grounded in a decades-old, still-standard IA framework.

### N. Candidate skill(s)
No new skill — extends Pulkit's heading/title infrastructure and Topic X's Cluster A/B self-orientation check to the general (non-AI-specific) landing case.

### O. Relationship to other skills
Directly reuses Topic X's Cluster A/B mechanism; connects to Pulkit's heading-to-content alignment work; gated by Topic V's audience-appropriateness norms.

---

## Cluster C — Structural navigation & wayfinding
**Covers:** Y5 (breadcrumbs), Y8 (persistent navigation), Y9 (back-navigation)

### A. What we need to understand
Whether a visitor, once oriented to what the current page is (Cluster B), can also understand where it sits within the site's larger structure and move predictably — the "you are here, and here's how to get elsewhere" layer.

### B. Why it matters
This is the layer with the deepest, most directly-applicable academic grounding of anything in this topic, and it's also the cluster where the source research itself makes an unusually strong, low-hedge claim: this pattern has essentially no downside.

### C. Current evidence

**FACT** — Wayfinding theory (originating in Kevin Lynch's physical-urban-design work, adapted to information environments by subsequent IA practitioners) treats breadcrumb-style "positional cues" as the information-space equivalent of a "you are here" map marker — explicitly framed in the literature as giving users "a sense of security" and averting "feelings of being lost," directly connecting Y5 to a much older, well-established spatial-cognition tradition rather than being a web-specific UI convention invented in isolation.

**FACT (a strong, direct, low-hedge claim from the field's own founding practitioner)** — Jakob Nielsen (co-founder, Nielsen Norman Group) states directly: "Breadcrumbs never cause problems in user testing: people might overlook this small design element, but they never misinterpret breadcrumb trails or have trouble operating them." NN/g's own official position is that breadcrumbs provide "zero-interaction-cost orientation" and that their popularity has grown steadily since the mid-1990s, with no identified downside across decades of usability testing.

**INFERENCE (an honest, disciplined confidence separation)** — Several *specific numeric statistics* about breadcrumb usage circulating in secondary/marketing sources (e.g., a claimed "77% more efficient task completion," a claimed "6% usage rate," a claimed "82% of breadcrumb clicks happen when placed near the title") come from single, older, or unnamed studies cited by content-marketing blogs, not from NN/g's own primary research directly — NN/g's own official article explicitly states they "don't have an exact number for the current percentage of breadcrumb users" because the topic hasn't warranted a dedicated study. **The qualitative finding (zero downside, real orientation value) is well-supported; the specific percentages circulating online should be treated as lower-confidence, secondary-source claims, not cited as if they were NN/g's own measured figures.**

### D. Important mechanisms
The unifying insight: this cluster's checks (breadcrumbs, persistent nav, predictable back-navigation) are about as close to a "free win" as any finding in this entire research project gets — the source literature's own claim is that there's no legitimate downside to implementing them well, which simplifies the severity/remediation logic considerably relative to almost everything else documented across this project.

### E. Concrete website signals
Presence and hierarchical correctness of breadcrumb trails (does the trail accurately reflect the page's actual position in the site structure, not just present *some* breadcrumb); persistent navigation element presence across page templates (not just the homepage); predictable back-navigation behavior (does the browser back button return to a sensible prior state, rather than a broken or unexpected one — a technical, checkable property, particularly relevant for JS-heavy single-page-application sites where history-state mismanagement is a known, common bug class).

### F. How the signal could be detected automatically
Fully deterministic: DOM/schema inspection for breadcrumb markup (schema.org `BreadcrumbList` where present, or structural pattern detection where not) cross-checked against the actual URL/site hierarchy for accuracy; template-sampling to confirm persistent navigation exists across multiple page types, not just the homepage; browser history-state testing (does navigating back after a client-side route change return to a coherent prior page) for Y9, which is the one sub-topic in this cluster requiring lightweight interaction rather than static inspection.

### G. What evidence the skill should report
Whether breadcrumbs are present and hierarchically accurate; whether persistent navigation is consistent across the sampled templates; the specific back-navigation failure if found (e.g., "back button returns to a blank or unrelated state after a client-side route change").

### H. Possible severity logic
Low-to-medium severity for missing breadcrumbs (a real but low-stakes gap per the source research's own "no downside, modest upside" framing); higher severity for broken back-navigation, since that's an active malfunction rather than an absent enhancement.

### I. Correct remediation
Add hierarchically accurate breadcrumbs (with correct schema markup where feasible); ensure navigation persists across templates; fix history-state handling for client-side-routed pages.

### J. False-positive cases
A genuinely flat, single-level site (a simple landing page with no hierarchy) doesn't need breadcrumbs at all — their absence there isn't a defect, since there's no hierarchy for them to represent.

### K. False-negative risks
A breadcrumb trail could be present but *inaccurate* (showing a stale or incorrect hierarchy after a site restructuring) — presence-only checking would miss this; the hierarchy-accuracy cross-check is the more important half of this signal, not mere presence.

### L. Counterexamples
Some well-designed single-page applications intentionally handle "back" differently (e.g., closing a modal rather than leaving the page) in ways that are correct for that specific interaction pattern — this check should distinguish intentional, well-handled state management from genuine breakage, which may require a lightweight behavioral test rather than a static assumption.

### M. Generalizes?
Yes — wayfinding theory and breadcrumb research are domain-agnostic; the specific relevance scales with site depth/complexity (Topic V) — a flat single-purpose site has less need for this cluster's checks than a deep e-commerce or documentation hierarchy.

### N. Candidate skill(s)
A lightweight, largely deterministic module within the broader context-retention checks — could reasonably live alongside Cluster B's checks in the same skill rather than as a separate one, given how cheap and structurally similar the detection methods are.

### O. Relationship to other skills
Connects to Topic V's site-type/depth calibration (a flat site needs this cluster less than a deep one); Y9's back-navigation check is the one item in this entire topic requiring behavioral (not just static) testing, worth flagging to whoever designs the crawl/interaction budget.

---

## Cluster D — Task & goal continuity
**Covers:** Y10 (related content), Y11 (comparison context), Y14 (task continuity)

### A. What we need to understand
Once a visitor's immediate landing need is met (Clusters A–C), does the page support the *next* step of whatever broader task or research goal brought them there in the first place, rather than treating each page as a fully isolated destination.

### B. Why it matters
Real visits are rarely single-page — an AI-referred or search-referred visitor typically arrived investigating something larger than one fact, and this cluster is about whether the site respects that broader arc rather than forcing a fresh restart for every follow-up need.

### C. Current evidence

**INFERENCE (explicit cross-reference, not new territory)** — Y10 (related content) and Y14 (task continuity) substantially overlap with Topic X's Cluster C (forward-path continuity, X6/X7), which already established the core mechanism: does the page make an intent-appropriate next step obvious, reusing Topic W's citation-intent classification. **This document doesn't re-derive that mechanism** — Cluster D's genuine addition is broadening it beyond the AI-citation-specific case (any landing scenario, not just one triggered by an AI referral) and adding Y11 as a distinct, not-yet-covered angle.

**INFERENCE (the genuinely new piece: Y11, comparison context)** — When a visitor's underlying task is comparison-shopping (directly connecting to Topic W's Cluster E, comparison-intent queries), task continuity has a specific, distinct requirement beyond generic "related content": the page should make it easy to see how the current option relates to the alternatives the visitor is plausibly also considering, without forcing a fresh search — this is the landing-page-side mirror of Topic W's comparison-intent findings (W-03/W-04), which examined the *citation* side of comparison queries; this cluster examines whether the *landed* page itself supports continued comparison once you're there.

### D. Important mechanisms
The unifying insight: this cluster is not a standalone mechanism — it's the general form of Topic X's Cluster C, plus one genuinely distinct addition (Y11) that mirrors Topic W's comparison-intent findings from the landing-page side rather than the citation-selection side.

### E. Concrete website signals
Presence and proximity of related-content links (reusing Topic X's Cluster C signals); for pages plausibly serving comparison-intent visitors, presence of comparison-supporting content (a comparison table, explicit differentiation language, or at minimum a clear link to a dedicated comparison page) rather than requiring the visitor to leave and re-search for competitor information.

### F. How the signal could be detected automatically
Y10/Y14: directly reuses Topic X's Cluster C detection method. Y11: reuses Topic W's Cluster A intent classification to identify comparison-intent-plausible pages, then checks for the presence of comparison-supporting elements — mostly deterministic once the intent classification is available.

### G. What evidence the skill should report
For Y11 specifically: whether the page provides any comparison-supporting content for a plausible comparison-intent visitor, and if it does, a light cross-reference to Topic W's Cluster E findings on whether such content shows the vendor-bias pattern already documented there (W-03) — since the same self-comparison-bias risk applies whether the comparison content is encountered via an AI citation or via direct browsing.

### H. Possible severity logic
Reuses Topic X's Cluster C severity logic for Y10/Y14; Y11 severity scales with how central comparison-shopping is to the page's likely visitor intent (a competitive B2B SaaS product page has higher stakes here than a commodity utility page).

### I. Correct remediation
Add proximate, intent-appropriate related content and comparison support; for Y11, this may simply mean linking clearly to an existing comparison page rather than requiring new content.

### J. False-positive cases
A narrow, single-purpose page genuinely may not need comparison content if its visitors are extremely unlikely to be in a comparison-shopping mindset (Topic V's Cluster D technical-reference norms) — this should be gated by both site-type and the specific page's inferred intent, not applied uniformly.

### K. False-negative risks
Comparison-supporting content could exist but be buried deep enough that it fails Cluster C's (this document's own) findability standard — Y11's check is genuinely dependent on Cluster C passing first, not independent of it.

### L. Counterexamples
A page correctly and deliberately avoiding direct competitor comparison for legal/regulatory reasons (Topic V's Cluster A, YMYL-adjacent industries where comparative claims carry liability risk) isn't defective for lacking this content — this is a direct, disclosed connection to Topic V's regulated-industry findings.

### M. Generalizes?
Yes for Y10/Y14 (already established as domain-agnostic in Topic X); Y11's relevance scales with how comparison-shopping-prone the site's category is (Topic V, Topic W's Cluster E).

### N. Candidate skill(s)
No new skill — Y10/Y14 extend Topic X's Cluster C module; Y11 extends Topic W's Cluster E module. Both should be implemented as shared, reused components, not separate parallel checks.

### O. Relationship to other skills
Directly, extensively dependent on Topic X's Cluster C and Topic W's Clusters A/E — this cluster's primary contribution is connective tissue and one genuinely new angle (Y11), not new independent mechanism.

---

## Cluster E — Personalization-adjacent context (the feasibility-limited cluster)
**Covers:** Y12 (location context), Y13 (audience context), Y15 (returning-user context)

### A. What we need to understand
Whether a page appropriately reflects a visitor's likely location, audience segment, or returning-visitor status — and, more importantly for this project, what can actually be checked about this given the audit's stateless, anonymous, single-crawl constraints.

### B. Why it matters
This is the cluster where the temptation to fabricate a plausible-sounding-but-hollow check is highest, and where naming the limitation explicitly is the single most valuable thing this document can contribute — a false claim of coverage here would actively mislead whoever relies on the audit's output.

### C. Current evidence

**FACT (a direct consequence of the handout's own constraints, not a new external finding)** — The Round 3 handout specifies read-only auditing, no authenticated-area manipulation, and respect for robots.txt/rate limits, within a single-run, under-5-minute crawl. None of these constraints permit simulating a specific geographic location, a specific returning-visitor cookie/session state, or a specific audience-segment identity. **Y12, Y13, and Y15, in their literal, personalization-testing form, are not assessable by the system this project is building.** This isn't a research gap to fill — it's a structural boundary of the tool itself, and should be stated as such in the marketplace's own documentation rather than glossed over.

**INFERENCE (the honest, feasible reframe for each)** — What *is* testable, for each: **Y12 (location)** — whether location-relevant content that should be universally present regardless of visitor location (e.g., "does this service operate in my country/region at all," "what is the actual physical address, if the business has one") is stated clearly in visible text, independent of any IP-based personalization; this is really a Cluster B self-orientation check applied to location-specific facts, not a personalization test. **Y13 (audience)** — whether the page clearly signals, in its own static content, which audience/segment it's written for (Topic V's audience-appropriateness norms, already established there) — again a labeling/self-orientation question, not a live personalization test. **Y15 (returning-user)** — genuinely the least testable of the three: a stateless crawl cannot distinguish a first-time from a returning visitor at all, and no meaningful proxy exists; this should be reported plainly as **out of scope** for this audit method, rather than forced into a weaker proxy that wouldn't actually measure the thing it claims to.

### D. Important mechanisms
The unifying insight: two of the three sub-topics (Y12, Y13) can be honestly reframed as static self-orientation checks (folding into Cluster B) once the personalization framing is set aside; the third (Y15) has no honest feasible proxy and should be explicitly scoped out rather than faked.

### E. Concrete website signals
Y12: presence of clear, static service-area/location information in visible text. Y13: presence of clear, static audience-signaling language (Topic V's existing infrastructure). Y15: none — explicitly out of scope.

### F. How the signal could be detected automatically
Y12/Y13: deterministic text-presence checks, reusing Cluster B and Topic V infrastructure entirely — no new mechanism. Y15: N/A by design.

### G. What evidence the skill should report
For Y12/Y13: the specific static-content finding, explicitly framed as a self-orientation check rather than a personalization test. For Y15: an explicit statement in the marketplace's own output/documentation that this sub-topic is out of scope for a stateless, read-only audit, so a report reader isn't left assuming (incorrectly) that returning-user experience was evaluated.

### H. Possible severity logic
Standard severity for the Y12/Y13 proxies, reusing Cluster B's logic; N/A for Y15.

### I. Correct remediation
Y12/Y13: add clear, static location/audience-signaling text where missing. Y15: N/A — not a finding this audit produces.

### J. False-positive cases
Assuming a lack of visible location/audience content means a site "fails" personalization when it may simply not need location- or audience-specific messaging at all (a genuinely universal, single-audience product) — this should be judged against whether the content type plausibly needs this signaling in the first place, not applied as a blanket requirement.

### K. False-negative risks
By design, Y15 (and the deeper, live-personalization forms of Y12/Y13) produce no findings at all under this audit method — this is a known, disclosed blind spot, not a silent gap the report should imply is covered.

### L. Counterexamples
None specific to this cluster beyond the structural point already made — the counterexample *is* the finding: assuming these are testable at all is the error this document corrects.

### M. Generalizes?
The feasibility limitation generalizes as a property of the tool, applicable to every site audited, not a site-specific finding; the Y12/Y13 proxies generalize as static self-orientation checks the same way Cluster B does.

### N. Candidate skill(s)
No new skill — Y12/Y13 fold entirely into Cluster B's self-orientation checks; Y15 produces no skill output at all, only a documented scope statement.

### O. Relationship to other skills
Directly informs the marketplace's overall documentation/scope statement (a Topic Z / entrypoint-level concern) about what the tool can and cannot assess — this is arguably this cluster's single most important deliverable, more than any individual check.

---

## 3. Findings register

---
**FINDING ID:** Y-01
**Researcher:** Soham
**Research Area:** Y — Context Retention
**Research Question:** Which of the fifteen assigned sub-topics can a stateless, read-only, single-visit audit actually test, and which would require fabricating a check that doesn't measure what it claims to?
**Observation:** Three sub-topics (Y2, and the personalization-testing form of Y12/Y13) require request-level state (a real referrer, a real assumed location/segment) the audit tool never has; one sub-topic (Y15) requires session/identity state (returning-visitor status) that a stateless crawl cannot represent at all, with no honest proxy available. The remaining eleven are fully or largely testable using infrastructure this project already has (Topic W for query/intent context, Topic X for citation-specific context, Pulkit's heading/labeling work, and established IA/wayfinding checks for structural navigation).
**Evidence:** Direct analysis of the Round 3 handout's own stated constraints (read-only, no authenticated-area manipulation, single-run <5-minute budget) against what each sub-topic's literal definition requires to test.
**Sources:** Round 3 handout (project's own constraint document).
**Pattern:** This is a scoping finding, not an external-literature finding — but it's the single most actionable output of this entire document, since it prevents the marketplace from either silently having no coverage for several named sub-topics or, worse, presenting a fabricated-looking check as if it tested something it structurally cannot.
**Counterexamples:** None — this is a direct logical consequence of the tool's own stated design constraints, not an empirical claim that could have counterexamples.
**Hypothesis:** N/A.
**Signal:** N/A — this finding is about scope, not a detectable website signal.
**How to Detect:** N/A.
**Evidence Output:** An explicit, visible statement in the marketplace's output/documentation naming which context-retention sub-topics were assessed via proxy versus not assessed at all.
**False Positives:** N/A.
**False Negatives:** The risk this finding exists specifically to prevent — silently omitting or falsely implying coverage.
**Severity:** N/A.
**Recommended Fix:** N/A — this is a documentation/scope-transparency requirement, not a website remediation.
**Generalization:** Applies identically to every site audited, since it's a property of the tool, not the site.
**Candidate Skill:** Not a skill — a required scope statement in the marketplace's own output contract (Topic AB, report design) and entrypoint documentation (Topic Z).
**Related Skills:** AB (report design); Z (agent skill/orchestrator design).
**Confidence:** HIGH — this is a direct logical consequence of the project's own stated constraints, not an empirical claim requiring external validation.

---
**FINDING ID:** Y-02
**Researcher:** Soham
**Research Area:** Y — Context Retention
**Research Question:** Is there established, authoritative grounding for why breadcrumbs/persistent navigation/structural orientation matter, and how confident can we be in specific claimed benefits?
**Observation:** Wayfinding theory (rooted in Kevin Lynch's physical-space research, adapted to information architecture by Morville & Rosenfeld's foundational IA framework) directly grounds breadcrumbs as "positional cues" analogous to a "you are here" map marker. Jakob Nielsen (NN/g co-founder) makes an unusually strong, low-hedge claim directly: breadcrumbs "never cause problems in user testing" and offer "zero-interaction-cost orientation." However, several specific numeric statistics about breadcrumb usage circulating in secondary marketing sources (77% task-completion improvement, 6% usage rate, 82%-of-clicks-near-title) trace to older, unnamed, or single studies cited by content blogs, not NN/g's own primary research — NN/g's own official article explicitly states they lack an exact current usage percentage.
**Evidence:** Morville & Rosenfeld, *Information Architecture for the World Wide Web* (1998–2015 editions); UXmatters' wayfinding series applying Lynch's framework to information environments; NN/g's own "Breadcrumb Navigation Increasingly Useful" article (direct Nielsen quote); multiple secondary/marketing sources carrying the specific disputed percentages.
**Sources:** en.wikipedia.org/wiki/Peter_Morville; uxmatters.com (Information Wayfinding series); nngroup.com/articles/breadcrumb-navigation-useful; contrasted against blog.hubspot.com and appmaster.io (sources of the lower-confidence percentage claims).
**Pattern:** This cluster's qualitative foundation (breadcrumbs/wayfinding cues genuinely help, with essentially no documented downside) is exceptionally well-grounded — among the best-supported findings in this entire research project. The specific popularized statistics are not, and should not be cited in the skill's output or documentation as if they were NN/g's own measured figures.
**Counterexamples:** A genuinely flat, single-level site has no hierarchy for breadcrumbs to represent, and their absence there isn't a defect (Cluster C's J).
**Hypothesis:** N/A for the qualitative claim; the specific popularized percentages should be treated as unverified pending a primary source, not cited as fact.
**Signal:** See Cluster C section E.
**How to Detect:** See Cluster C section F — fully deterministic.
**Evidence Output:** Presence/hierarchical-accuracy of breadcrumbs and persistent navigation; back-navigation correctness.
**False Positives:** Flat sites with no hierarchy to represent.
**False Negatives:** Present-but-inaccurate breadcrumb trails, which presence-only checking would miss.
**Severity:** Low-medium for missing breadcrumbs; higher for broken back-navigation.
**Recommended Fix:** Add hierarchically accurate breadcrumbs and correct back-navigation behavior.
**Generalization:** High for the qualitative mechanism; the specific disputed statistics should not be generalized or cited without a verified primary source.
**Candidate Skill:** Lightweight module within the broader context-retention checks.
**Related Skills:** Topic V (depth/complexity calibration).
**Confidence:** HIGH for the qualitative, well-sourced claim (breadcrumbs/wayfinding cues help, no documented downside); LOW/UNVERIFIED for the specific popularized percentage statistics, which this document explicitly declines to adopt as fact.

---

## 4. Required end-of-topic synthesis

**Strongest validated insight:**
The scoping finding (Y-01) — precisely which of the fifteen sub-topics a stateless, read-only, single-visit audit can and cannot actually test — is the strongest, most load-bearing output of this entire document, even though it's a logical/structural finding rather than an external-literature one. It's directly, unambiguously derived from the project's own stated constraints, and prevents a specific, concrete failure mode (fabricated-looking coverage of untestable sub-topics) that would otherwise have been easy to accidentally build.

**Strongest unvalidated hypothesis:**
That AI-referred visitors specifically have a lower tolerance for weak self-orientation (Cluster B) than traditionally-referred visitors, mirroring the same untested hypothesis already flagged in Topic X — this document doesn't independently test it either, and it remains the single most consequential unmeasured assumption connecting Topics X and Y.

**Strongest candidate skill:**
No single new skill emerges as this topic's headline output — the strongest, most disciplined result of this research pass is that most of Topic Y's sub-topics correctly fold into infrastructure this project already has (Topic W for Y1/Y11, Topic X's Cluster C for Y10/Y14, Pulkit's heading work for Y3/Y6/Y7, Topic V for audience/YMYL gating throughout), with only Cluster C (structural navigation/wayfinding) contributing a genuinely independent, cheap, well-grounded module, and Cluster E contributing a documentation/scope requirement rather than a check at all. This is a case, similar to Pulkit's Topic E, where the correct outcome is "extend existing skills and document a scope boundary," not "build several new skills."

**Weakest assumption we should investigate next:**
Whether the Y12/Y13 proxy reframing (static self-orientation instead of live personalization testing) actually captures enough of what those sub-topics were originally meant to assess, or whether it quietly discards real value the original sub-topic names implied — this is a judgment call this document makes explicitly and defensibly, but it's worth a second opinion from whoever originally scoped the Y1–Y15 list, since "here's the closest honest proxy" is a reasonable position but not the only possible one.

---

## 5. Cross-references for the Combine & Code phase

- **Cluster A ↔ Topic W (Cluster A) and the entrypoint orchestrator (Z):** Y1 reuses Topic W's intent/query machinery directly; Y4 requires the crawler to test actual deep-link URLs, not just the domain root — a crawl-strategy requirement for Z.
- **Cluster B ↔ Topic X (Clusters A/B) and Pulkit's heading/labeling work:** Y3 is the general case of Topic X's citation-specific self-orientation check; Y6/Y7 extend Pulkit's existing heading-to-content alignment infrastructure — no new mechanism needed.
- **Cluster C ↔ Topic V (site depth/complexity calibration):** Breadcrumb/navigation relevance scales with site hierarchy depth — flat sites should not be penalized for lacking what they don't need.
- **Cluster D ↔ Topic X (Cluster C) and Topic W (Clusters A/E):** Y10/Y14 directly extend Topic X's forward-path-continuity module; Y11 directly extends Topic W's comparison-intent findings (W-03/W-04) to the landing-page side.
- **Cluster E ↔ Topic AB (Report Design) and Topic Z (Agent Skill Design):** The scope-transparency requirement (Y-01) belongs in the marketplace's output contract and documentation, not in any individual finding — this should be raised explicitly with whoever owns those topics rather than assumed to be handled implicitly.
- **All clusters ↔ Topic U (False Positives, mine):** The never-fire rules named throughout (flat sites not needing breadcrumbs, single-audience products not needing audience-signaling content, narrow reference pages not needing comparison support) should be registered in the `false-positive-suppression` rule set with this document cited.
