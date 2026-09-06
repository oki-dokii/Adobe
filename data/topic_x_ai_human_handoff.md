# Topic X — AI-to-Human Handoff (X1–X10)
**Researcher:** Soham | **Research Area:** X — AI-to-Human Handoff
**Priority:** Very High

---

## 0. Framing — why this topic is the genuine bridge between the two halves of the challenge, and what's new vs. cross-referenced

Topic X sits at the exact seam the project brief names as its unifying concern: an AI has already done the work of finding, understanding, and citing a page — X begins at the moment a real human, carrying a specific expectation the AI just set, actually lands on it. That framing matters for scoping: **X4 (is the page aligned with the user's original question) is not new territory** — it is Topic W's Cluster A (intent-type alignment) applied at the landing moment rather than the citation-selection moment, and I'm treating it as an explicit cross-reference rather than re-deriving it, consistent with how overlaps have been handled throughout this project.

What genuinely is new here, and where this document concentrates its research: the other nine sub-topics collapse into a coherent, well-grounded mechanism this document didn't have before — **information scent** (Pirolli & Card, 1999), a mature, decades-old HCI theory explaining exactly why a user abandons a page and restarts their search when the promised information isn't quickly, visibly delivered. This gives X1, X3, X9, X10 a real theoretical anchor rather than intuition alone. It also surfaced one genuinely novel, concrete, deterministically-checkable technical mechanism I did not expect going in — a real, standardized browser feature (Scroll-To-Text-Fragment) built for exactly this handoff scenario, whose applicability to current AI citation UIs I'm careful to flag as unconfirmed rather than assumed.

The ten sub-topics collapse into four clusters, with X4 cross-referenced rather than treated as a fifth.

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. Cluster map — X1–X10 collapsed to four mechanisms (+ one cross-reference)

| Sub-topic | Cluster | Why it groups here |
|---|---|---|
| X1 (understand why cited), X3 (cited claim visible), X9 (page preserves context) | **A — Citation visibility & scent continuity** | All three ask whether the specific "scent" that justified the click is still detectable and confirmed immediately on landing |
| X2 (can find cited info), X5 (enough context), X10 (forces restart) | **B — Findability without restart** | Extends Cluster A from "is it visible on arrival" to "can the user get the complete picture without leaving and starting over" |
| X6 (can continue researching), X7 (related actions obvious) | **C — Forward-path continuity** | Once the immediate need is met, does the page make the *next* step obvious, rather than being a dead end |
| X8 (establishes trust quickly) | **D — Rapid trust establishment** | A distinct, well-studied mechanism (first-impression credibility) rather than an extension of scent theory |
| X4 (aligned with original question) | **— cross-reference, not a new cluster** | Directly Topic W's Cluster A (intent-type alignment), applied at landing time |

---

## Cluster A — Citation visibility & scent continuity
**Covers:** X1 (does the user immediately understand why the page was cited), X3 (is the cited claim visible), X9 (does the page preserve context)

### A. What we need to understand
Whether the specific claim or fact that justified an AI's citation is actually, immediately, visibly confirmable by a human landing on the page — and what happens, mechanistically, when it isn't.

### B. Why it matters
This is the single moment where an AI's implicit promise ("this page supports what I just told you") either holds or breaks, in the first few seconds of a visit — and there's a well-established theory predicting exactly what happens when it breaks.

### C. Current evidence

**FACT** — Information Foraging Theory (Pirolli & Card, 1999), developed at Xerox PARC, models web users as "informavores" who navigate by following **information scent** — cues (words, images, structure) that predict whether continuing down a path will yield more useful information. The theory is well-established and continues to be actively used and extended across HCI, information-access, and recommender-systems research decades later.

**FACT** — The theory's central, directly relevant prediction: users continuously evaluate the strength of the scent and **abandon a page/patch and move on once the scent weakens or the required effort increases**, rather than persist through ambiguity. A recent survey applying the theory to findability explicitly states this in nearly the form this project cares about: "users abandon paths when cues weaken or effort increases. If expected tools... are absent or buried, users may disengage."

**INFERENCE (the direct, load-bearing application to this cluster)** — An AI citation functions exactly as a strong, pre-established information scent: the user arrives already expecting a specific fact to be immediately findable. If that fact isn't visibly, quickly confirmable on landing (X3), the scent that brought them there evaporates at the worst possible moment — not during exploratory browsing, but at the exact point they expected confirmation — which, per the theory's own prediction, is precisely when abandonment/restart (X10, Cluster B) is most likely.

**FACT (a concrete, standardized, and genuinely novel technical mechanism for this exact scenario)** — Scroll-To-Text-Fragment (STTF), a W3C/WICG web standard using the `#:~:text=` URL syntax, allows a link to deep-link directly to specific text on a page — automatically scrolling to and highlighting it — **without requiring the page author to add any ID or anchor**. It was explicitly designed, per its own originating proposal, for "linking to a specific portion of a page... using a text snippet provided in the URL," including the exact use case of "sharing a specific passage" that the linking party doesn't control. It is broadly supported: Chrome 80+, Edge 83+, Opera 67+, Samsung Internet 13+, Firefox 131+, and Safari 16.1+ on macOS/iOS.

**INFERENCE (careful, appropriately hedged, and now refined by follow-up research)** — This is precisely the mechanism a citation-generating system would need to solve X1/X3/X9 automatically (deep-link straight to the exact cited sentence rather than the top of the page). Follow-up research found that **Google's classic search product has actually deployed exactly this — auto-scrolling to and highlighting the cited passage on arbitrary HTML pages, no markup required — since at least 2018–2019** (confirmed directly by Google's own public Search Liaison, Danny Sullivan), with active expansion continuing into 2025 test rollouts of "Jump to" snippet links using the same mechanism. This is a materially different state of knowledge than "purely theoretical": the underlying deep-link-to-citation approach is proven, multi-year-deployed technology at Google's own core search product. What remains genuinely unconfirmed is whether **Google's generative AI Overview product** (a plausible, well-motivated inference given shared ownership, but not directly confirmed by any source found) or **any of ChatGPT, Claude, or Perplexity's citation links** (fully open — no evidence found either way) actually use this same mechanism. This precise, three-tier state of knowledge (proven for classic Google Search; plausible-but-unconfirmed for AI Overview; fully open for the other three vendors) is what the skill's confidence language should reflect, not a flattened "unknown" or an assumed "yes."

**INFERENCE (the genuinely useful, actionable reframe, independent of whether any AI vendor uses STTF today)** — Regardless of current AI citation-link practice, **a website's own control point is whether it would work correctly if such a link were constructed** — by a browser extension, a future AI product update, or a human manually copying a quoted claim into a search. This is fully testable by the audit skill itself: construct a `#:~:text=` fragment for the page's most likely-cited claim and check whether that exact phrase exists as flat, parseable text in the page's static/rendered DOM, not hidden behind an accordion, tab, "read more" truncation, or JS-only render — since STTF matching (like most page-load-time text matching) cannot find text that isn't present and visible at the point the browser processes the fragment.

### D. Important mechanisms
The unifying insight: X1/X3/X9 are not three separate UX nice-to-haves — they are the exact conditions Information Foraging Theory predicts must hold for a strong information scent to survive the click-through. And there is now a concrete, standardized, checkable technical proxy for one of them (X3) that doesn't require guessing at any AI vendor's internal behavior: whether the cited claim is present as genuinely deep-linkable flat text at all.

### E. Concrete website signals
Presence of the specific claim as exact, matchable text within the page's static HTML/rendered DOM (not requiring a click/expand to reveal); whether that text sits behind an accordion, tab, modal, or "read more" truncation that would prevent both STTF matching and a human's quick visual scan; presence of surrounding context (a heading, a preceding sentence) that would let a user recognize *why* this passage was the one cited, even without reading the AI's original phrasing.

### F. How the signal could be detected automatically
Deterministic and genuinely cheap: given the specific claim/passage the audit identifies as the likely citation source (reusing Topic W's evidence-extraction work), construct the corresponding `#:~:text=` fragment syntax and check whether the exact phrase (or a close paraphrase window) exists in the page's rendered DOM without requiring any interaction to reveal it. No LLM judgment is required for this specific check — it's a text-matching and DOM-visibility problem.

### G. What evidence the skill should report
The specific claim tested, whether it exists as directly matchable, unobstructed text, and — if not — the specific obstruction found (behind an accordion, requires a click, only present via JS after a delay, etc.).

### H. Possible severity logic
High severity where the primary, central claim of a page (the thing most likely to be cited) is obstructed this way; lower severity for secondary/supporting claims.

### I. Correct remediation
Ensure the specific claim exists as plain, immediately-visible text (not gated behind an interaction), and ensure a proximate heading or lead-in sentence gives a human enough context to recognize why this is the relevant passage even without having read the AI's original summary.

### J. False-positive cases
Not every claim on a page needs to be independently deep-linkable — this check should focus specifically on the page's most likely central, citable claim(s) (reusing Topic W's evidence-extraction targeting), not every sentence on the page; flagging every accordion-hidden FAQ answer as a defect would over-fire on a page type (FAQ) where that pattern is often legitimate and expected.

### K. False-negative risks
A claim could be present as visible text but phrased so differently from how an AI would plausibly summarize it that a naive exact-match check would miss the connection — this requires the claim-identification step (from Topic W) to be reasonably accurate first; this check inherits that upstream risk rather than introducing a new one.

### L. Counterexamples
A page that legitimately requires some minimal orientation (a product page where "the price" only makes sense once you've selected a plan/tier) isn't defective for not exposing every fact as a zero-context, isolated fragment — context requirements should be judged against what's reasonable for the content type, not treated as an absolute "everything must be a standalone fragment" rule.

### M. Generalizes?
Yes — Information Foraging Theory is domain-agnostic and has been applied across two decades of subsequent HCI research; the STTF mechanism is a generic, content-agnostic web standard, not tied to any particular vertical or site type.

### N. Candidate skill(s)
Core module of the proposed **AI Referral Landing Experience Auditor**.

### O. Relationship to other skills
Directly consumes Topic W's evidence/claim-extraction output as its input (what is the specific claim to check for); connects to Pulkit's A16 (chunk/passage quality) for the underlying claim-identification mechanism.

---

## Cluster B — Findability without restart
**Covers:** X2 (can the user find the cited information), X5 (does the page provide enough context), X10 (does the page force the user to restart their search)

### A. What we need to understand
Once a user has confirmed the cited claim exists somewhere on the page (Cluster A), can they actually *locate and fully understand* it without excessive effort — and if not, what does the theory predict happens next, and is that prediction itself checkable.

### B. Why it matters
X10 is arguably the single worst outcome in this entire topic: a user who came from an AI's answer, expecting confirmation, being forced back to square one is a strictly worse experience than if the AI had never cited the page at all — it wastes the trust the citation itself built.

### C. Current evidence

**FACT (direct extension of Cluster A's grounding)** — Information Foraging Theory's marginal value theorem framing predicts that the amount of effort a user will tolerate before abandoning a "patch" (page) is directly weighed against the expected value of switching to a different patch — and as the *cost* of switching has fallen (fast search, easy re-querying an AI assistant), the *tolerance* for effort on any single page has fallen with it. This is a documented, well-established finding (sometimes called "information snacking"), not a new claim.

**INFERENCE (the direct application)** — Because switching cost is now especially low for an AI-referred visitor (they can simply return to the chat and ask a follow-up, or re-search), the effort threshold before X10 (restart) is triggered is plausibly *lower* for this specific traffic source than for a visitor who arrived via a traditional search click — meaning this cluster's checks should be held to a stricter standard for AI-referred landing pages than a generic usability audit might otherwise apply, though this specific relative-strictness claim is our own reasonable inference from the theory, not independently measured for AI-referral traffic specifically.

**INFERENCE** — X5 (enough context) and X2 (findability) are two sides of the same underlying requirement: X2 asks whether the *specific* fact is locatable; X5 asks whether, once located, the user has what they need to actually understand/use it (a number without units, a claim without its qualifying scope) — this connects directly to Pulkit's already-established fact/qualifier self-containment work (A16/F2) rather than introducing a new mechanism, and should be implemented as a direct reuse of that check applied specifically to the landing-page moment.

### D. Important mechanisms
The unifying insight: this cluster is where Cluster A's "is it visible" check, if it fails, cashes out into a theoretically predicted, specific bad outcome (restart) — and the practical takeaway is that the bar for "good enough" is stricter for AI-referred traffic specifically, because the cost of giving up and asking the AI again is lower than it's ever been for any other kind of referred traffic.

### E. Concrete website signals
Number of clicks/scrolls required to reach the specific claim from the landing point; presence of the claim's necessary qualifying context (reusing A16/F2 directly) within the same viewport or a short scroll; absence of dead ends (a page that states a fact but offers no way to verify, expand, or act on it).

### F. How the signal could be detected automatically
Mostly deterministic: DOM-distance/scroll-distance measurement from the top of the page (or from an anchor if one exists) to the target claim; reuse of A16/F2's self-containment check for X5 specifically. No new extraction mechanism is needed beyond what Clusters A and Pulkit's A16 already provide.

### G. What evidence the skill should report
The measured distance/effort to the claim, and — where X5 fails — the specific missing qualifying context, directly citing A16/F2's evidence-output convention rather than inventing a parallel one.

### H. Possible severity logic
Severity scales with both distance-to-claim and topic sensitivity (reusing Topic V's YMYL gating) — a buried, hard-to-verify claim on a health or financial topic is more severe than the same pattern on a low-stakes topic.

### I. Correct remediation
Reduce the distance between landing and the key claim (this may mean restructuring page layout, not rewriting content); ensure qualifying context travels with the fact.

### J. False-positive cases
A page that requires some minimal, reasonable navigation for content the AI explicitly framed as "read the full guide" isn't defective — this check should distinguish "the AI cited this page for a specific fact" (Cluster A's territory) from "the AI cited this page as a broader resource to explore" (where more navigation is expected and appropriate), which itself depends on Topic W's intent classification for that specific citation.

### K. False-negative risks
A page could measure as "close" by DOM-distance but still be effectively unfindable due to poor visual hierarchy or distracting surrounding content — a purely structural distance metric doesn't fully capture visual prominence, which would require an LLM-assisted visual/layout judgment to catch fully.

### L. Counterexamples
Long-form investigative or research content where the citable fact is legitimately embedded in extensive supporting argument isn't automatically defective for requiring more reading — this cluster's checks should weight expected content depth against the inferred citation intent (a specific factual citation vs. a "read this whole analysis" citation) rather than applying a flat distance threshold everywhere.

### M. Generalizes?
Yes — the underlying theory and the "AI-referred traffic has lower abandonment tolerance" inference are domain-agnostic; the specific distance thresholds that count as "too far" would need per-site-type calibration (Topic V), which this document doesn't attempt to fix as a universal number.

### N. Candidate skill(s)
Core module of the **AI Referral Landing Experience Auditor**, directly reusing Pulkit's A16/F2 infrastructure for the X5 sub-check rather than duplicating it.

### O. Relationship to other skills
Directly reuses Pulkit's A16/F2; gated by Topic V's severity-scaling for topic sensitivity; consumes Topic W's per-citation intent classification to calibrate expected navigation depth.

---

## Cluster C — Forward-path continuity
**Covers:** X6 (can the user continue researching), X7 (are related actions obvious)

### A. What we need to understand
Once the immediate cited fact is confirmed and understood (Clusters A/B), does the page make it obvious what to do or look at next — rather than being a dead end that forces the user back to the AI for even the most predictable follow-up.

### B. Why it matters
An AI-referred visitor's journey rarely ends at a single fact — they arrived investigating something, and a page that satisfies the immediate citation but offers no forward path wastes an opportunity to keep them engaged with the site rather than bouncing back to a competitor's page the AI might cite next.

### C. Current evidence

**INFERENCE (a natural, disclosed extension of Cluster A/B's grounding rather than new external literature)** — Information Foraging Theory's "diet" model describes foragers selecting which "prey" (pieces of information) to pursue next based on expected value relative to cost — a page that makes the *next* most valuable piece of information (a related article, a deeper spec, a clear next action) obvious and low-cost to reach is directly extending the same favorable scent that got the user this far, rather than requiring them to re-forage from scratch (a return trip to the AI or search engine).

**INFERENCE** — X6 (continue researching) and X7 (related actions obvious) are distinguishable by intent type in a way that connects directly to Cluster A/B's Topic W dependency: an informational-intent citation should make continued *reading* paths obvious (related articles, deeper documentation), while a transactional/commercial-investigation-intent citation should make continued *action* paths obvious (compare plans, start a trial, contact sales) — applying the wrong forward-path type (offering "buy now" to someone who came for background research, or offering only "read more" to someone ready to act) is itself a mismatch, not merely an absence.

### D. Important mechanisms
The unifying insight: this cluster isn't about generic site navigation quality — it's specifically about whether the *next* step visible on the page matches the *kind* of continuation implied by why the AI cited this page in the first place, which makes it directly dependent on Topic W's intent classification rather than a standalone check.

### E. Concrete website signals
Presence of related-content links/sections near the confirmed claim (not just in a generic global footer); presence of a clear, intent-appropriate call-to-action; absence of the page being a genuine dead end (no internal links at all beyond global navigation).

### F. How the signal could be detected automatically
Mostly deterministic: presence/absence and proximity of related-content links and CTAs. The intent-appropriateness judgment (does the *type* of next step match the *type* of citation) is a lighter-weight reuse of Topic W's Cluster A classification, not a new judgment mechanism.

### G. What evidence the skill should report
Whether a forward path exists at all, and whether its type matches the inferred citation intent.

### H. Possible severity logic
Lower severity than Clusters A/B overall (a missing next-step is a missed opportunity, not a broken promise), but should scale up if the page is a genuine dead end with literally no path forward beyond global navigation.

### I. Correct remediation
Add a proximate, intent-appropriate next step near the confirmed claim, not just in a generic footer or sidebar.

### J. False-positive cases
A narrow, single-purpose reference page (a specific API endpoint's documentation) legitimately may not need a "related articles" section if its own site's global navigation already makes further exploration obvious — this should be judged against Topic V's site-type norms (a docs page has different forward-path conventions than a blog post).

### K. False-negative risks
A forward path could exist but be visually indistinguishable from decorative or unrelated content, meaning a presence check alone (does a link exist) could pass while the actual discoverability of that link remains poor — a deeper visual-prominence check would require LLM/visual judgment beyond this cluster's cheap deterministic core.

### L. Counterexamples
Some genuinely complete, self-contained answer pages (a single, well-scoped FAQ answer) may correctly have no obvious "next step" because the user's need is fully resolved — this cluster's check should not penalize genuine completeness as if it were a dead end.

### M. Generalizes?
Yes — domain-agnostic; specific forward-path conventions vary by site type (Topic V).

### N. Candidate skill(s)
Lightweight module of the **AI Referral Landing Experience Auditor**, reusing Topic W's intent classification.

### O. Relationship to other skills
Directly dependent on Topic W's Cluster A output; gated by Topic V's site-type conventions for what a reasonable forward path looks like per content type.

---

## Cluster D — Rapid trust establishment
**Covers:** X8 (does the page establish trust quickly)

### A. What we need to understand
Whether there's an established, evidence-backed understanding of what makes a page feel trustworthy *quickly* — since an AI-referred visitor typically has seconds, not minutes, to decide whether to stay and read further.

### B. Why it matters
An AI citation lends the page borrowed credibility from the AI itself; if the page's own first-impression signals contradict that borrowed trust, the visitor's confidence in *both* the page and, to some extent, the AI's judgment takes a hit — this is a distinct mechanism from Clusters A–C, closer to classic web-credibility research than to information-foraging theory.

### C. Current evidence

**FACT (large-scale, well-established, frequently-cited academic study)** — The Stanford Web Credibility Project's large-scale study (Fogg, Soohoo, Danielson, Marable, Stanford & Tauber, 2003), involving over 2,600 participants rating website credibility, found that **"design look" was the single most frequently mentioned factor in credibility judgments, appearing in 46.1% of participant comments** — more than any other category, including actual information content or structure.

**FACT** — This finding is formalized in Prominence-Interpretation Theory (a direct outgrowth of the same Stanford research program): credibility judgments depend on which elements of a page are *prominent* enough to be noticed at all, and how a visitor *interprets* what they notice — meaning a page can have genuinely trustworthy underlying content that still fails this check if its trust-relevant signals (about the organization, the author, the currency of the information) aren't visually prominent enough to be noticed in the first few seconds.

**INFERENCE (the direct application to AI-referred visitors specifically)** — Because an AI-referred visitor arrives with less accumulated context about the site than someone who navigated there through a multi-page session, the first-impression weighting this research documents plausibly matters *more*, not less, for this traffic — this is a reasonable extension given the theory's own framing (trust judgments form fast, from limited cues), but is our own inference about AI-referral traffic specifically, not something the 2003-era study measured directly, since AI referral didn't exist as a traffic source at the time.

### D. Important mechanisms
The unifying insight: trust-quick-establishment is a distinct, decades-documented mechanism from information scent — it's not about whether the *content* is findable, it's about whether the page's *design and prominent elements* signal legitimacy fast enough to keep a skeptical, fast-judging visitor from bouncing before they even get to Clusters A/B's checks.

### E. Concrete website signals
Presence and visual prominence (not just existence) of organizational identity (logo, clear "about" signal), authorship/attribution where relevant, and currency indicators (a visible date or "last updated" signal) near the top of the page — reusing the "prominence," not just "presence," framing from the source research.

### F. How the signal could be detected automatically
Hybrid: presence/absence of these elements is deterministic (DOM inspection); *prominence* (visual weight, placement, size) is closer to a layout-judgment question that benefits from LLM-assisted or heuristic visual-salience scoring rather than pure DOM presence-checking, since the source research's entire point is that visual prominence, not mere presence, drives the effect.

### G. What evidence the skill should report
Which trust-relevant elements are present, and specifically whether they are visually prominent (above the fold, not buried in a footer) versus merely technically present somewhere on the page.

### H. Possible severity logic
Higher severity where trust-relevant elements are entirely absent versus merely under-prominent; severity should scale with topic sensitivity (Topic V's YMYL gating), since a weak first-trust-impression matters more on a health/finance/legal page than a low-stakes hobby blog.

### I. Correct remediation
Increase visual prominence of existing trust signals rather than necessarily adding new content — per the source research's own finding, the issue is frequently noticeability, not absence.

### J. False-positive cases
A minimalist, deliberately clean design isn't automatically low-trust — this check should look for the *specific* documented trust-relevant categories (organizational identity, currency, structure) rather than penalizing minimalism generically, which the source research doesn't support as a credibility factor on its own.

### K. False-negative risks
A page could have prominent trust signals that are nonetheless misleading or fabricated (a fake "as seen on" badge row) — this check, being about prominence rather than veracity, would need to be paired with Harsh's trust/authority verification work to catch that distinct risk; prominence alone isn't a substitute for genuine authority.

### L. Counterexamples
Highly technical developer/reference audiences (Topic V's Cluster D) may weight trust signals differently than a general consumer audience — a barebones, unstyled documentation page can be highly trusted by its specific audience precisely because it looks like an authentic technical reference rather than a polished marketing page; this cluster's checks should be calibrated by site-type/audience (Topic V), not applied with one universal "polish" standard.

### M. Generalizes?
Yes — the underlying research is decades-old, large-sample, and has been replicated and extended across subsequent credibility research; the specific weighting (46.1%) is from one large study and shouldn't be treated as a universal constant, but the qualitative finding (design/prominence drives fast trust judgments) is robust.

### N. Candidate skill(s)
Module of the **AI Referral Landing Experience Auditor**, gated by Topic V's audience/site-type calibration.

### O. Relationship to other skills
Distinct from, and a genuine complement to, Harsh's trust/authority verification work — this cluster checks *perceived, fast* trust signals; Harsh's work presumably checks *actual, verifiable* authority — the two should be clearly labeled as different layers in the final report, not merged into one "trust score."

---

## 3. Cross-reference note: X4 (Cluster E, not independently treated)

X4 (is the page aligned with the user's original question) is **not given a new A–O treatment here** — it is Topic W's Cluster A (intent-type alignment), specifically applied at the moment of landing rather than the moment of citation. The only genuinely new wrinkle X4 adds is temporal: Topic W checks whether a page *would be* a good citation target for a query; X4 checks whether, given that the AI *already did* cite it, the page still holds up once a real human with a real specific question actually arrives — which is really Clusters A and B of this document (does the specific promised content show up) rather than a separate alignment mechanism. Restating W's full treatment here would be exactly the kind of padding this project's research standard warns against.

---

## 4. Findings register

---
**FINDING ID:** X-01
**Researcher:** Soham
**Research Area:** X — AI-to-Human Handoff
**Research Question:** Is there an established theoretical mechanism explaining why users abandon a page and restart their search when a citation's promise isn't quickly confirmed?
**Observation:** Information Foraging Theory (Pirolli & Card, 1999) provides a decades-old, well-established, still-actively-used framework predicting exactly this: users follow "information scent" cues and abandon a page once the scent weakens or required effort increases, with tolerance for effort falling further as the cost of switching to another source (increasingly, another AI query) has fallen over time.
**Evidence:** Pirolli & Card (1999), foundational Information Foraging Theory papers; multiple independent, current (2024-2026) applications of the theory to findability and information-access research, explicitly stating the abandonment-on-weak-scent mechanism.
**Sources:** en.wikipedia.org/wiki/Information_foraging; sciencedirect.com/topics/computer-science/information-foraging; apa.org/monitor/2012/03/information (APA Monitor coverage); researchgate.net (Information Foraging in Information Access Environments, applying the theory directly to findability/abandonment).
**Pattern:** This gives the entire AI-to-human handoff concern a genuine theoretical foundation rather than resting on intuition about "good UX" — the specific, sharp prediction (abandonment triggered by weakening scent or rising effort) maps directly onto X1/X3/X9/X10 as a connected mechanism, not four separate concerns.
**Counterexamples:** The theory describes general tendencies, not deterministic individual behavior — some users will persist through poor scent out of necessity or unusual motivation; the check should be understood as identifying elevated *risk* of abandonment, not predicting certain abandonment for any specific visitor.
**Hypothesis:** N/A — directly grounded in an established, widely-applied theory.
**Signal:** See Cluster A/B sections E.
**How to Detect:** See Cluster A/B sections F.
**Evidence Output:** Distance/effort-to-confirmation measurements, framed explicitly in terms of scent continuity.
**False Positives:** Content genuinely requiring more exploration (Cluster B's L).
**False Negatives:** Visual-prominence factors not captured by structural distance alone (Cluster B's K).
**Severity:** Scales with topic sensitivity and distance/effort.
**Recommended Fix:** Reduce distance/effort to the confirming fact; preserve qualifying context.
**Generalization:** High — domain-agnostic, decades-validated theory.
**Candidate Skill:** Core theoretical foundation for the AI Referral Landing Experience Auditor.
**Related Skills:** Topic W (intent classification input); Pulkit's A16/F2 (self-containment reuse).
**Confidence:** HIGH — well-established, widely-cited, still actively applied academic theory.

---
**FINDING ID:** X-02
**Researcher:** Soham
**Research Area:** X — AI-to-Human Handoff
**Research Question:** Is there a concrete, checkable technical mechanism for whether a specific cited claim would be immediately visible/deep-linkable on a page — and do current AI assistants actually use it?
**Observation:** Scroll-To-Text-Fragment (`#:~:text=`), a standardized WICG/browser feature, allows deep-linking directly to specific text on a page without requiring the page author to add any anchor, and is broadly supported across current Chrome, Edge, Opera, Samsung Internet, Firefox, and Safari. **Follow-up research resolved part of the original open question, with an important precision**: Google's classic search product (organic snippets and featured snippets — not the generative AI Overview product) has been auto-scrolling and highlighting the exact cited passage on arbitrary HTML destination pages, with no markup required, since at least 2018–2019 — confirmed directly by Danny Sullivan, Google's own public Search Liaison, quoted stating the feature moved from AMP-only to regular HTML pages "regularly... since last week" (referring to a 2018 rollout). Google has continued actively expanding this — live A/B tests as recently as October 2025 show "Jump to" links appearing in regular organic snippets, explicitly using scroll-to-text mechanics. The WICG standard's own founding design document names this exact scenario by name: "Citations / Reference links... finding the exact passage that supports the claim can be very time consuming" is listed as a primary motivating use case for the entire standard. **What remains genuinely unconfirmed**: whether Google's generative AI Overview product, or any of ChatGPT, Claude, or Perplexity's chat-interface citation links, specifically use this mechanism — no source found addresses this directly for any of the four generative products this project cares about.
**Evidence:** MDN Web Docs (Text fragments); WICG ScrollToTextFragment proposal/GitHub readme (explicitly naming the citation-link use case); Danny Sullivan (Google Search Liaison), quoted via PhoneArena/SearchEngineLand coverage of the 2018–2019 featured-snippet highlight rollout; Search Engine Roundtable's live coverage of Google's October 2025 "Jump to" snippet-link testing.
**Sources:** developer.mozilla.org/en-US/docs/Web/URI/Reference/Fragment/Text_fragments; github.com/WICG/scroll-to-text-fragment; phonearena.com (Google featured snippets highlight rollout, Danny Sullivan quote); seroundtable.com/google-search-result-snippets-see-more-other-links-39809.html.
**Pattern:** This narrows the open question meaningfully rather than resolving it fully: the underlying deep-link-to-citation mechanism is not speculative future technology — it is a real, actively-expanding, multi-year-deployed feature of Google's core search product, built by the same company that also ships an AI Overview product and a browser (Chrome) that originated the public standard. That makes it a *plausible* inference that Google's generative products inherit or could easily adopt the same infrastructure — but this is explicitly flagged as inference, not confirmed, since Google's own public statements found in this research describe the classic snippet feature, not the AI Overview feature, and I found nothing addressing ChatGPT, Claude, or Perplexity's citation-link construction either way.
**Counterexamples:** Content that is legitimately, appropriately interactive (a genuinely optional FAQ accordion where the answer isn't the page's central claim) shouldn't be flagged the same way a central, likely-cited claim hidden behind an interaction would be.
**Hypothesis:** That Google AI Overview specifically reuses the same scroll-to-text infrastructure as Google's classic snippets (a strong, well-motivated inference given shared ownership and clear technical precedent) — not directly confirmed by any source found in this research pass, and should be verified directly (e.g., by inspecting an actual AI Overview citation link's URL structure) rather than assumed. Whether ChatGPT, Claude, or Perplexity do anything similar remains a fully open question with no supporting or contradicting evidence found either way.
**Signal:** Exact-phrase presence in static/rendered DOM without requiring interaction.
**How to Detect:** Deterministic text-matching and DOM-visibility check, no LLM judgment required for the core mechanism.
**Evidence Output:** Whether the claim is unobstructed, and the specific obstruction type if not.
**False Positives:** Flagging every interactive-content pattern (FAQ accordions generally) rather than specifically the page's central, likely-cited claim.
**False Negatives:** Paraphrase gaps between how an AI might summarize a claim and its exact on-page wording could cause an exact-match check to miss a genuinely present but differently-phrased claim.
**Severity:** High for central/likely-cited claims; low for secondary content.
**Recommended Fix:** Expose the specific claim as plain, unobstructed text.
**Generalization:** High for the technical mechanism itself (a mature, multi-year-deployed, actively-expanding feature of the web's largest search product) and for the *design intent* of the standard (explicitly built with citation/reference-linking as a named use case). The generative-AI-specific adoption question is now narrowed (plausible for Google's own AI Overview given shared infrastructure; fully open for the other three vendors) rather than uniformly unknown, and this distinction should be preserved rather than flattened into either "confirmed" or "unknown" in the skill's output language.
**Candidate Skill:** Core, novel module of the AI Referral Landing Experience Auditor.
**Related Skills:** Topic W (claim identification); Pulkit's A16 (chunk/passage quality).
**Confidence:** HIGH for the technical standard's existence, design intent, current browser support, and Google classic-search deployment history (all directly, primary-source verified). MEDIUM for the inference that Google AI Overview specifically reuses this infrastructure (plausible, well-motivated, but not directly confirmed). Genuinely UNKNOWN — stated as such, not guessed at — for ChatGPT, Claude, and Perplexity's citation-link construction specifically.

---
**FINDING ID:** X-03
**Researcher:** Soham
**Research Area:** X — AI-to-Human Handoff
**Research Question:** Is there established research on what makes a page establish trust quickly, distinct from whether its content is findable or correct?
**Observation:** The Stanford Web Credibility Project's large-scale study (Fogg et al., 2003; over 2,600 participants) found that "design look" was the single most frequently mentioned factor in web credibility judgments, present in 46.1% of participant comments — more than content, structure, or any other category — later formalized as Prominence-Interpretation Theory (credibility depends on what's prominent enough to be noticed, and how it's interpreted).
**Evidence:** Fogg, Soohoo, Danielson, Marable, Stanford, Tauber, "How Do People Evaluate a Web Site's Credibility?" (Stanford Persuasive Technology Lab / Consumer WebWatch, 2003); NN/g's coverage and formalization as Prominence-Interpretation Theory.
**Sources:** credibility.stanford.edu (primary study PDF); nngroup.com/articles/prominence-interpretation-theory; en.wikipedia.org/wiki/Stanford_Web_Credibility_Project.
**Pattern:** Fast trust judgments are a distinct, well-documented mechanism from information scent/findability (Clusters A–C) — a page can pass every findability check and still fail this one if its trust-relevant signals aren't visually prominent, which argues for treating this as its own report category rather than folding it into a single generic "engagement score."
**Counterexamples:** Technical/developer audiences may weight visual polish differently than general consumer audiences (Cluster D's L) — the finding's qualitative pattern (prominence drives fast judgments) likely still holds, but what counts as a positive trust signal is audience-dependent.
**Hypothesis:** The first-impression effect plausibly matters more, not less, for AI-referred visitors specifically (who arrive with less accumulated site context than a multi-page browsing session) — this is our own reasonable extension of a study conducted before AI referral existed as a traffic source, not independently measured for this traffic type.
**Signal:** See Cluster D section E.
**How to Detect:** See Cluster D section F — hybrid, presence deterministic, prominence closer to a layout-judgment call.
**Evidence Output:** Which trust-relevant elements are present vs. prominent.
**False Positives:** Penalizing deliberate minimalism where it isn't actually a credibility factor per the source research.
**False Negatives:** Prominent but fabricated/misleading trust signals require pairing with genuine authority-verification work (Harsh's territory), not just a prominence check.
**Severity:** Scales with topic sensitivity (YMYL gating).
**Recommended Fix:** Increase prominence of existing trust signals rather than assuming new content is needed.
**Generalization:** High for the qualitative finding; the specific 46.1% figure is from one (large, but single) study and shouldn't be treated as a universal constant.
**Candidate Skill:** Module of the AI Referral Landing Experience Auditor.
**Related Skills:** Harsh's trust/authority verification (a genuinely distinct, complementary layer, not a duplicate).
**Confidence:** HIGH for the qualitative pattern (large sample, widely cited, formalized into a named theory used since); MEDIUM for the specific extension to AI-referred traffic, which is inference rather than directly measured.

---

## 5. Required end-of-topic synthesis

**Strongest validated insight:**
X1/X3/X9/X10 are not four separate UX intuitions but a single, well-grounded mechanism — Information Foraging Theory's decades-old, still-actively-applied prediction that users abandon a page once its information scent weakens or required effort rises, with tolerance for that effort falling as switching costs (increasingly, just asking the AI again) have fallen. This gives the most emotionally resonant part of this topic (the "wasted click" feeling) an actual, citable, predictive mechanism rather than resting on design-intuition alone.

**Strongest unvalidated hypothesis:**
That current AI assistants' citation-abandonment dynamics are *more* sensitive to landing-page friction than pre-AI search-referred traffic, because the cost of "just asking again" is lower than any prior alternative. This is a reasonable, theory-consistent extension, but it has not been independently measured — the foundational research on both information scent and web credibility predates generative AI as a traffic source entirely, and this project has not tested the claim directly either.

**Strongest candidate skill:**
The **AI Referral Landing Experience Auditor**, composed of Cluster A's citation-visibility/scent-continuity check (including the genuinely novel STTF-based deep-linkability test), Cluster B's findability-without-restart check (directly reusing Pulkit's A16/F2 self-containment infrastructure), Cluster C's forward-path-continuity check (reusing Topic W's intent classification), and Cluster D's rapid-trust-establishment check (grounded in Fogg et al.'s prominence research, explicitly kept distinct from Harsh's genuine-authority verification) — with X4 correctly cross-referenced to Topic W rather than re-derived. This is a strong, coherent bridge skill precisely because every one of its checks either rests on an established external theory or directly reuses infrastructure already built for another topic, rather than inventing new, untested mechanisms from scratch.

**Weakest assumption we should investigate next:**
Two specific gaps, both explicitly flagged rather than glossed over: (1) whether Google's generative AI Overview product specifically reuses the scroll-to-text infrastructure its classic search product has run since 2018 — a plausible, well-motivated inference given shared ownership, narrowed from "fully unknown" to "unconfirmed but likely" during pressure-testing, and directly verifiable by inspecting a real AI Overview citation link's URL structure rather than continued inference; and (2) whether ChatGPT, Claude, or Perplexity do anything comparable at all — this remains a fully open question with literally no evidence found either way, distinct from and weaker than the Google Overview case, and shouldn't be conflated with it in the skill's confidence language. Separately, the "AI-referred traffic has lower abandonment tolerance" hypothesis (Cluster B) also remains untested and rests entirely on theoretical extension rather than direct measurement.

---

## 6. Cross-references for the Combine & Code phase

- **Cluster A ↔ Topic W (Query-to-Page Alignment):** Directly consumes W's claim/evidence-extraction output as input to the STTF-deep-linkability check; the two skills should share this extraction step rather than each re-deriving it, per the runtime-budget efficiency concern already flagged in Topic W's cross-references.
- **Cluster B ↔ Pulkit's A16/F2:** X5's context-sufficiency check is a direct reuse of A16/F2's self-containment infrastructure applied at the landing-page moment — not a new mechanism.
- **Cluster C ↔ Topic W (intent classification) and Topic V (site-type conventions):** Forward-path type-matching depends on W's per-citation intent output; what counts as a reasonable forward path at all depends on V's site-type norms (a docs page vs. a blog vs. an ecommerce product page).
- **Cluster D ↔ Harsh's trust/authority verification:** Explicitly a distinct, complementary layer (perceived/fast trust vs. verified/actual authority) — the final report should label these separately rather than merging into a single trust score, to avoid one masking the other.
- **X4 (cross-reference) ↔ Topic W's Cluster A:** No independent treatment; flagged explicitly to avoid duplication at merge time.
- **The whole AI Referral Landing Experience Auditor ↔ Topic U (False Positives, mine):** The never-fire/gating rules named across this document's clusters (narrow reference pages without related-content sections, technical audiences with deliberately minimal design, appropriately interactive FAQ content) should be registered in the `false-positive-suppression` skill's rule set, with this document cited as justification.
- **↔ Topic Z (Agent Skill Design, mine):** Given this auditor's heavy dependence on Topic W's outputs, the entrypoint orchestrator should sequence Topic W's checks before this auditor runs, not in parallel, since several of this document's checks are meaningless without W's classification already available — a direct dependency-ordering requirement for the runtime pipeline design.
