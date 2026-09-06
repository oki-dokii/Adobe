# Topic N — Accessibility as AI / Human Readability
**Researcher:** Harsh | **Research Area:** N — Accessibility as AI / Human Readability (alt text, semantic HTML, heading hierarchy, non-text-content overlap with machine extractability)
**Priority:** Medium

---

## 0. Framing — what Topic N is actually for

Topic N is not "add alt text for WCAG compliance" as trivia. It exists to answer one design question for the marketplace:

> **Where accessibility markup (alt text, semantic HTML, heading structure) and AI-machine-readability genuinely overlap in mechanism — not merely in spirit — can a single check serve both purposes at once, and where does the overlap actually break down, requiring the two concerns to be treated as separate axes rather than one?**

This is explicitly a **narrow-scope, boundary-clarifying topic**, not a comprehensive WCAG audit. The master research map's own N1–N20 list (semantic HTML, ARIA, heading hierarchy, landmarks, alt text, accessible names, keyboard navigation, focus order, form labels, error messages, captions, transcripts, color-independent meaning, text alternatives, screen-reader structure, content hidden from assistive technology, content inaccessible due to interaction, mobile accessibility, WCAG principles, accessibility-vs-machine-readability overlap) spans a much broader remit — most of it (keyboard navigation, focus order, ARIA correctness, color contrast, form-error handling) is genuine, important, human-accessibility territory with **no established mechanism connecting it to AI-assistant machine-readability specifically**, and building detection for it would duplicate the extensive, mature landscape of existing accessibility-auditing tools (axe-core, WAVE, Lighthouse) without adding anything distinctive to this hackathon's actual brief. This document, consistent with the disciplined scoping this series applied to Topic L, investigates only the subset where a genuine, mechanism-level AI-relevance question exists:

1. **§1 — The image-locked-fact mechanism: does alt text genuinely serve both audiences through the same underlying mechanism, or only coincidentally?** This is the master research map's own explicitly named overlap question (N20), and it is the one this document treats as the load-bearing investigation.
2. **§2 — What does the largest, longest-running empirical study of web accessibility actually tell this hackathon about prevalence, detectability, and false-positive risk?** The WebAIM Million — a real, seven-year, million-page, methodologically transparent annual study — turned out to be directly useful evidence this document had not anticipated finding at this scale.

**Explicit boundary, consistent with this series' standing practice of avoiding duplicate skill proposals:** the genuinely AI-relevant slice of accessibility work this document identifies (§1) is designed to fold into infrastructure this series has already built (Topic F's F17 image-locked-relationship detection, Pulkit's own crawl/DOM-extraction infrastructure), not to justify a new standalone "accessibility skill" that would functionally duplicate axe-core/WAVE with no added value for this hackathon's specific brief.

---

## 1. FACT vs OBSERVATION vs HYPOTHESIS vs INFERENCE vs SPECULATION — global legend

Same legend as every prior topic in this series:
- **FACT** — documented by the vendor/standards body, or established in peer-reviewed/archival literature.
- **OBSERVATION** — reported by independent researchers/practitioners running real, methodologically transparent trials (not vendor-confirmed).
- **HYPOTHESIS** — our proposed testable claim, not yet validated by us.
- **INFERENCE** — reasonable derivation from FACT/OBSERVATION, one logical step removed.
- **SPECULATION** — plausible but unconfirmed; flagged, not built on.

**A note on source quality, and a genuinely positive departure from this series' recurring warning.** This topic's core evidence base — the W3C's own WCAG specification, and WebAIM's own "Million" project (an independent, non-commercial, seven-years-running academic-adjacent research effort with fully transparent, published methodology) — is considerably more rigorous than the source material this series has typically encountered. Accessibility, unlike "GEO"/"Entity SEO," is a mature field with real regulatory grounding (ADA, Section 508, AODA litigation, as documented across multiple independent sources) and a genuine, large-scale, repeated empirical measurement tradition. The one caution this document applies is narrower than in prior topics: several secondary commercial accessibility-vendor blog posts repeat WebAIM's own published statistics accurately (a positive sign, consistent with what this series found in Topic P's PR-firm-content case) but sometimes округляют imprecisely or conflate figures across different report years — this document cites WebAIM's own primary report pages directly for every statistic used, rather than a secondary restatement.

---

## §1 — The image-locked-fact mechanism: genuine overlap or coincidental alignment?

### A. What we need to understand
Alt text is, definitionally, a text alternative for non-text content. Is there a genuine, mechanism-level reason this same text alternative also solves an AI-machine-readability problem — or is the master research map's own suggestion that "good semantic structure can simultaneously help people, assistive technology and automated systems" a hopeful generalization that doesn't actually hold up for this specific case?

### B. Why it matters for the hackathon
If the overlap is genuine and mechanism-level (not merely coincidental), this is a rare, high-value case: a single, cheap, well-precedented check that serves two of the hackathon's stated evaluation dimensions (accessibility and AI-discoverability) simultaneously, directly matching the brief's own preference for connected, non-duplicative findings. If the overlap is only partial or coincidental, this document needs to say so honestly and scope the check accordingly, rather than overclaiming a two-for-one benefit the mechanism doesn't actually support.

### C. Current evidence
- **FACT (W3C, first-party, direct, the formal requirement):** WCAG's Success Criterion 1.1.1 ("Non-text Content") states plainly: **"All non-text content that is presented to the user has a text alternative that serves the equivalent purpose"** — meaning the text alternative's job, by the standard's own definition, is to convey the same *information or function* the non-text content conveys, not merely to describe its visual appearance. This formal "equivalent purpose" framing is directly, mechanically relevant: it means a correctly-written alt text is, by definition, a **textual restatement of whatever fact or function the image encodes** — precisely the kind of machine-extractable textual fact this document series has repeatedly established (Pulkit's A16/A17, this document series' own Topic J §1) as the actual unit AI-assistant retrieval/extraction operates on.
- **FACT (W3C, first-party, direct, on the specific failure mode this creates when absent):** WCAG 1.4.5 ("Avoid images of text") and the surrounding W3C guidance explicitly document a directly, mechanistically relevant consequence beyond human accessibility: **"Text embedded in images is not directly accessible to search engine crawlers, even with alt text"** — this is a first-party, W3C-adjacent confirmation that the accessibility community itself has already, independently identified and documented the machine-extractability consequence of text-in-images, for reasons of search-engine crawlability specifically, not only screen-reader accessibility. This is a genuinely important, directly-on-point primary source: the overlap this unit investigates is not this document's own novel speculation — it is already a named, documented concern in the accessibility standards literature itself.
- **FACT, directly confirming the mechanism (not merely the outcome) is shared:** the W3C's own alt-text guidance states that when no alt attribute is present, "the screen reader will read the file name for the image instead" — and, independently and convergently, this document series has already established (Pulkit's Topic A A11, the raw-HTML-vs-rendered-DOM finding) that a machine-text-extraction pass over a page's raw content will encounter exactly the same object (an `<img>` tag) and extract exactly the same fallback text (the filename, or nothing) in the absence of a proper alt attribute — **the screen reader and the naive machine text-extractor are, mechanically, doing the identical operation** (reading the DOM's textual representation of the image) and failing in the identical way when alt text is missing. This is the load-bearing mechanistic confirmation this unit needed: the overlap is not coincidental, it is the **same underlying data structure (the DOM's text-accessible-name tree) serving both consumers identically**, because both a screen reader's accessibility-tree traversal and a text-based retrieval crawler's content-extraction pass draw from substantially the same source.
- **INFERENCE, directly and usefully connecting this unit to a specific, previously-established finding in Topic F rather than requiring new detection logic:** this document series has already, independently identified this exact mechanism once before, from a different angle — Topic F's F17 unit explicitly names "a relationship stated only in an image (a logo lockup showing '[Product] by [Company]') is invisible to this text/markup-based check" as a **false-negative risk**, directly citing "the general image-locked-fact risk the hackathon's own worked JS-pricing example illustrates for a different mechanism." This document's contribution is to confirm that Topic F's own passing observation is, in fact, a fully general, W3C-documented, mechanism-sound principle — not an isolated aside — and that the correct fix for Topic F's own named false-negative risk is precisely this unit's alt-text-completeness check, closing a loop Topic F's own document left open.
- **OBSERVATION, worth stating as an important limit on how far this overlap extends:** the same WCAG guidance that documents the image-locked-text problem also explicitly notes a distinct limitation directly relevant to this document's scope discipline: "While images can have alt text, it's a fallback and not as robust or flexible as genuine text content" (from the W3C-adjacent 1.4.5 guidance, discussing why text-as-text is always preferable to text-in-images-plus-alt-text) — meaning this unit's check is correctly scoped as detecting a **workaround for a suboptimal pattern** (image-embedded text), not as validating that alt text is an equally good substitute for genuine, native text content in the first place. A page passing this unit's alt-text check is not thereby confirmed to be optimally machine-readable — it has simply avoided the worst version of the image-locked-fact failure.
- **Genuine limit of the overlap, stated honestly rather than glossed over:** not every accessibility concern in the master list's N1-N20 shares this same mechanism-level overlap. Keyboard navigation, focus order, and color-contrast (WCAG's largest single failure category per §2 below) have **no documented connection to machine-text-extraction** at all — a keyboard-navigation failure affects a screen-reader or motor-impaired user's ability to *operate* a page, which has no analog in how a text-extraction-based AI retrieval system "reads" a page at all (it doesn't "navigate" via focus order in the human-interaction sense). This document explicitly declines to claim a machine-readability angle for these items, consistent with its own framing (§0) and this series' standing anti-padding discipline.

### D. Important mechanisms
The genuine, mechanism-level overlap this unit confirms is narrower and more specific than "accessibility generally helps AI too" — it is precisely: **wherever a fact is encoded only in a non-text visual form (an image, a chart, a graphic containing text), both a screen reader's accessibility tree and a text-based content-extraction crawler draw on the same underlying DOM text-alternative data, and fail identically (silently, via filename fallback or complete omission) when that data is absent.** This is the same "image-locked-fact" mechanism Topic F's F17 already named in passing, now confirmed as a general, W3C-documented principle rather than an isolated observation.

### E. Concrete website signals
Presence, non-emptiness, and non-genericness of alt attributes specifically on images that plausibly carry unique factual content (per this unit's own scope discipline: not decorative images, which correctly and per WCAG's own guidance should have empty `alt=""` attributes rather than being flagged at all) — with particular attention to images that are the *sole* carrier of a fact otherwise absent from surrounding text (e.g., a pricing table rendered as an image with no equivalent text elsewhere on the page, a logo lockup stating a company/product relationship per Topic F's F17, an infographic containing statistics).

### F. How the signal could be detected automatically
Deterministic-first, directly reusing infrastructure this series has already built: (1) extract all `<img>` elements and their alt attributes from the rendered DOM (reusing Pulkit's A11 raw-HTML/rendered-DOM extraction infrastructure); (2) classify images as decorative versus plausibly-content-bearing using simple heuristics (image dimensions, surrounding context, whether the image sits within a content region versus a template/chrome region, per Pulkit's A22 template-clustering); (3) for content-bearing images, check alt-text presence, non-emptiness, and — reusing Topic J §1's VAGO-based specificity-scoring methodology directly — flag alt text that is present but generic/non-specific (WebAIM's own documented "questionable or repetitive alternative text" category, per §2 below, is a directly precedented real-world version of exactly this check); (4) cross-reference against Topic F's F17 unit specifically for images that appear to encode a brand/product/company relationship, closing that unit's own previously-flagged false-negative gap.

### G. What evidence the skill should report
For flagged content-bearing images: presence/absence/genericness of alt text, using the same specificity-scoring output format already established in Topic J §1 (so this is reported as an application of an existing scoring function, not a new independent metric); for images cross-referenced against Topic F's F17 relationship-detection logic, whether the image appears to encode a fact not otherwise present in surrounding text.

### H. Possible severity logic
- **Medium-High:** a content-bearing image is the *sole* carrier of a fact type this document series has already established as high-materiality (per Topic P §2's taxonomy — pricing, contact information, a stated brand/product relationship per Topic F's F17) with missing or non-specific alt text — directly combining this unit's own mechanism with Topic P's already-established materiality-gating discipline rather than inventing a new severity scale.
- **Low:** alt text present but generic/repetitive on a lower-materiality image (a decorative-adjacent photo with placeholder-style alt text).
- **No finding:** correctly-empty `alt=""` on genuinely decorative images — this must never be flagged, directly following WCAG's own explicit guidance that decorative images should have empty (not missing, not descriptive) alt attributes.

### I. Correct remediation
Add specific, non-generic alt text conveying the actual fact/function the image encodes (reusing Topic J §1's specificity standard directly — an alt text failing the same vagueness check that would flag "we help businesses grow" should be treated identically here); for the highest-materiality case (a fact available *only* in image form), the correct remediation is not only better alt text but making the underlying fact **available as genuine text content elsewhere on the page** — directly reinforcing the W3C's own stated preference (§C) that alt text is a fallback, not an equal substitute for native text.

### J. False-positive cases
Decorative images with correctly-empty `alt=""` must never be flagged — this is the single most important false-positive guardrail for this entire unit, and is explicitly, formally sanctioned by WCAG itself (an empty alt on a decorative image is the *correct*, compliant pattern, not an error). Logos and other WCAG-1.4.5-exempted logotype images should not be flagged as "text-in-image" violations, per the standard's own explicit exception. Short, simple images where the filename or a brief caption already adequately conveys the same information available via alt text (e.g., a `<figure>` with a `<figcaption>` already providing the needed textual equivalent, per WebAIM's own guidance on avoiding redundant alt-text/figcaption duplication) should not be double-flagged for "missing" alt text when the equivalent information is already present via a different, valid textual channel.

### K. False-negative risks
This check, like the underlying alt-text mechanism itself, cannot verify that alt text is *accurate*, only that it is present, non-empty, and not obviously generic per Topic J §1's lexical methodology — an alt text that is specific-sounding but factually wrong (describing a different image, or a stale price) would pass this check while still misinforming both a screen-reader user and a machine reader; this is a distinct problem from this unit's own scope (closer to Topic G's content-mismatch mechanism, applied to a different field) and is explicitly not claimed to be solved here.

### L. Counterexamples
An image that is genuinely purely decorative or emotionally/aesthetically evocative (a hero background photo with no factual content to convey) correctly warrants no alt-text-completeness concern at all — this is not an edge case to work around but the expected, correct, majority case for many images on a typical page, and this unit's detection design must default to "no finding" for these rather than manufacturing a low-severity finding merely to have output, consistent with this series' standing discipline (most explicitly established in Topic F's F41-F46 "no finding is the common, non-noteworthy case" principle).

### M. Does this generalize across site types?
Yes, fully — the image-locked-fact mechanism and the decorative-vs-content-bearing distinction are general, W3C-documented, site-type-agnostic principles. The *frequency* of content-bearing images (a heavily infographic-driven marketing site vs. a text-only documentation site) naturally varies by site type, a now-familiar Topic V hook consistent with every prior topic in this series.

### N. Candidate skill(s)
Not a standalone skill — folds directly into **Topic J's `content-substance-check`** (reusing its specificity-scoring function on alt-text fields, exactly as Topic L §2 already established for title tags/meta descriptions) and cross-references **Topic F's `entity-identity-audit`** (specifically its F17 unit, closing that document's own previously-flagged image-locked-relationship false-negative gap).

### O. Relationship to other potential skills
This unit is, by design, almost entirely composed of applying already-built infrastructure (Topic J §1's specificity scoring, Pulkit's A11/A22 crawl infrastructure) to a new field (alt text) and closing a previously-identified gap (Topic F's F17) — directly consistent with, and now a further instance of, the anti-padding, reuse-over-duplication discipline this series established explicitly in Topic L §2 for title tags and meta descriptions. This is the second clear instance of that exact pattern (a plausible-sounding "new checklist item" turning out to be fully served by existing infrastructure applied to a new field).

---

## §2 — What the WebAIM Million tells this hackathon about prevalence, detectability, and false-positive risk

### A. What we need to understand
Beyond the specific alt-text mechanism (§1), does a real, large-scale, long-running empirical study of web accessibility exist that can inform this hackathon's own detection-design choices — specifically around prevalence (how common are these issues really, which matters for calibrating expected finding rates) and detectability (what fraction of real accessibility problems can automated tooling actually catch, which matters for this document's own honesty about its check's limitations)?

### B. Why it matters
This document series has repeatedly flagged the importance of calibrating detection thresholds and confidence claims against real-world evidence rather than assumption (Topic P's materiality taxonomy, Topic T's classification calibration, Topic S's per-category confidence tracking) — the WebAIM Million is a rare case in this entire research effort where genuine, large-scale, directly-relevant empirical prevalence and detectability data actually exists and can be used directly, rather than this document needing to flag an "explicit evidence gap" as several prior topics have had to do.

### C. Current evidence
- **FACT (WebAIM, direct, primary-source, a genuine large-scale empirical study — not a hypothetical or a marketing claim):** the WebAIM Million is a **seven-years-running** (since 2019), **1-million-home-page** annual study using the WAVE accessibility engine to test WCAG 2.x conformance, with a fully published, transparent methodology (site list derived from the Tranco ranking; rendered-DOM analysis after scripting/styles applied; explicit exclusion criteria for pages under 10 HTML elements or with excessive same-domain links). This is a genuinely rare, high-rigor empirical source for this kind of prevalence question — directly comparable in evidentiary quality to this series' strongest peer-reviewed findings (Topic F's WhoQA benchmark, Topic M's Lindgaard/Robins-Holmes studies) despite being an industry study rather than an academic paper, because of its scale, transparency, and multi-year replication.
- **FACT (WebAIM, direct, on detectability — a critical, directly-relevant, self-reported limitation this document must inherit honestly):** WebAIM's own report states explicitly and repeatedly, across multiple years of the study: **"All automated tools, including WAVE, have limitations—only 25% to 35% of possible conformance failures can be automatically detected. Absence of detectable errors does not indicate that a site is accessible or compliant."** This is a directly load-bearing methodological finding for this document's own honesty: even the most mature, most widely-used automated accessibility tool in the industry, applied to a million pages over seven years, catches at most roughly a third of actual conformance failures — meaning this document's own, much narrower alt-text-specificity check (§1) should carry a correspondingly humble confidence claim about its own detection completeness, and this document explicitly states so rather than implying its check is comprehensive.
- **FACT (WebAIM, direct, on prevalence — directly relevant to calibrating this unit's expected finding rate, not a hypothetical or a manufactured statistic):** the 2026 report found **53.1% of pages had missing alt text** as one of six error categories comprising 96% of all detected errors (the same six categories — low contrast, missing alt text, missing form labels, empty links, empty buttons, missing document language — have persisted, per WebAIM's own explicit statement, "for the last 7 years"). The 2025 report separately found, among images that *did* have alt text, **13.4% had "questionable or repetitive alternative text"** — a directly, specifically relevant, real-world-measured precedent for exactly this document's own §1 genericness-detection concern, confirming that generic/repetitive alt text (not just missing alt text) is itself a measured, real, non-hypothetical phenomenon at meaningful scale, not a theoretical edge case this document invented.
- **FACT (WebAIM, direct, a genuinely useful methodological caution about a specific, commonly-cited-incorrectly metric):** WebAIM's own report explicitly warns against using "error density" (errors divided by page-element count) as an accessibility metric, noting that pages with many generic `<div>`/`<span>` elements can show artificially *lower* error density "when in fact many new accessibility errors may have also been introduced" — a direct, primary-source-documented warning against a specific, intuitive-seeming but methodologically flawed normalization approach, directly relevant to how this document's own severity/prevalence reporting should be designed (report absolute counts/rates of genuine findings, not an error-density ratio that can be gamed by markup verbosity).
- **INFERENCE, connecting §2's prevalence data back to this document's own §1 severity design:** given that missing alt text is present on a majority (53.1%) of the general web's home pages, this document's own severity logic (§1 H) — which gates high severity specifically on the *combination* of missing/generic alt text AND high independently-established materiality (per Topic P §2) — is not merely a nice-to-have refinement but a **necessary** design choice to avoid this check firing at near-majority prevalence with undifferentiated severity, which would directly reproduce the "alert fatigue" failure mode this series already identified via the static-analysis literature in Topic S §2 (ZeroFalse, the soundness-vs-precision tension).

### D. Important mechanisms
The WebAIM Million confirms two things this document needed independently verified rather than assumed: **(1) the specific phenomena §1 investigates (missing alt text, generic/repetitive alt text) are real, common, large-scale-measured problems, not theoretical constructs**, and **(2) even mature, industry-standard automated tooling has a hard, self-acknowledged ceiling on detection completeness (25-35%)** — meaning this document's own, narrower check should be understood and reported as a small, honestly-scoped contribution to a much larger, only-partially-automatable problem space, not a comprehensive accessibility audit.

### E-G. (Signals / Detection / Evidence)
This unit does not introduce a new detection mechanism beyond §1 — its contribution is **calibration and honesty**, not a new signal. The "evidence" this unit contributes is prevalence/detectability context that should accompany §1's findings in the report (e.g., "missing alt text is found on a majority of web pages generally; this check, like all automated accessibility tools, cannot detect all conformance failures").

### H. Possible severity logic
Directly reinforces §1's materiality-gated severity design (§1 H) — this unit's contribution is confirming that gate is necessary given real-world prevalence data, not proposing an independent severity scale.

### I. Correct remediation
N/A directly — this unit's contribution is evidentiary/calibration context, not its own remediation.

### J. False-positive cases
This unit's central contribution to false-positive discipline: given that missing alt text is near-majority-prevalent across the general web, a check that flags it without the materiality-gating established in §1 would generate an enormous volume of low-value findings on almost every audited site — directly the "big checklist" failure mode the brief explicitly warns against, now with real prevalence data confirming the risk is not hypothetical.

### K. False-negative risks
The self-reported 25-35% automated-detection ceiling applies to WAVE specifically for full WCAG conformance testing — this document's own, much narrower check (alt-text specificity on content-bearing images specifically) is not directly comparable in scope, but the general principle (automated tools miss most real accessibility problems) should be inherited as an honest limitation statement regardless.

### L. Counterexamples
None beyond those already established in §1 — this unit is evidentiary/contextual, not an independent claim requiring its own counterexample search.

### M. Does this generalize?
Yes — the WebAIM Million's methodology and its core findings (persistent error categories, detection-ceiling limitation) are drawn from a genuinely representative, million-page, cross-site-type sample, making this among the more broadly generalizable evidence sources in this entire document series.

### N. Candidate skill(s)
No standalone skill — this unit provides calibration/honesty context for §1's check, to be reflected in that check's reported confidence language.

### O. Relationship to other potential skills
Directly reinforces Topic S's own per-category confidence-tracking design (Finding S-02) — this document's own alt-text check should report its confidence with explicit reference to the WebAIM-documented ~25-35% automated-detection ceiling for accessibility issues generally, a concrete, real-world-sourced instance of exactly the honest, non-overclaiming confidence reporting Topic S's schema is designed to require.

---

## 2. Findings register (structured, per the required format)

---
**FINDING ID:** N-01
**Researcher:** Harsh
**Research Area:** N — Accessibility as AI / Human Readability
**Research Question:** §1 — is the overlap between alt-text accessibility and AI-machine-readability genuine and mechanism-level, or merely a hopeful generalization?
**Observation:** WCAG's own formal "equivalent purpose" definition for text alternatives (SC 1.1.1), combined with the W3C's own explicit, independently-documented statement that "text embedded in images is not directly accessible to search engine crawlers, even with alt text," confirms a genuine, mechanism-level overlap: a screen reader's accessibility-tree traversal and a text-based content-extraction crawler draw on substantially the same underlying DOM text-alternative data and fail identically (silent omission, filename fallback) when it is absent.
**Evidence:** W3C WCAG 2.2 SC 1.1.1 (via multiple independently-confirming secondary summaries of the primary standard); WCAG 1.4.5 guidance (wcag.dock.codes, directly citing the standard's text-alternative-accessibility-for-crawlers rationale); WebAIM's own alt-text technique documentation (webaim.org/techniques/alttext).
**Sources:** See §1 §C.
**Pattern:** This confirms, with primary-source backing, a mechanism this document series had already independently flagged in passing (Topic F's F17 "image-locked-fact" false-negative note) as a fully general, W3C-documented principle, not an isolated aside — closing a previously-open gap in Topic F's own document.
**Counterexamples:** The overlap does not extend to most of the broader accessibility remit (keyboard navigation, focus order, color contrast) — these have no documented machine-text-extraction analog and are explicitly, honestly excluded from this document's claimed overlap.
**Hypothesis:** Applying Topic J §1's existing specificity-scoring function to alt-text content on independently-classified content-bearing images (excluding correctly-decorative images) will surface genuine, actionable image-locked-fact findings without requiring new detection logic.
**Signal:** Alt-text presence/emptiness/genericness on content-bearing (non-decorative) images, cross-referenced against Topic F's F17 relationship-detection logic and Topic P's materiality taxonomy.
**How to Detect:** Deterministic DOM extraction (reusing Pulkit's A11 infrastructure) + decorative/content-bearing classification heuristics + Topic J §1's specificity-scoring function applied to alt-text fields.
**Evidence Output:** Presence/genericness verdict per flagged image, materiality classification of the underlying fact, cross-reference to Topic F's F17 where applicable.
**False Positives:** Correctly-empty `alt=""` on decorative images, and WCAG-1.4.5-exempted logotypes, must never be flagged; images with equivalent information already available via a valid alternate channel (e.g., adjacent `<figcaption>`) should not be double-flagged.
**False Negatives:** This check cannot verify alt-text *accuracy*, only presence/specificity — a specific-sounding but factually wrong alt text would pass.
**Severity:** Medium-High (missing/generic alt text on a high-materiality, image-only fact) to No-finding (correctly-decorative images, the common case).
**Recommended Fix:** Add specific, non-generic alt text; for the highest-materiality case, make the underlying fact available as genuine text content, not only as an alt-text fallback.
**Generalization:** High — mechanism is W3C-documented and site-type-agnostic; frequency of content-bearing images varies by site type (Topic V hook).
**Candidate Skill:** Folds into `content-substance-check` (Topic J) and cross-references `entity-identity-audit` (Topic F, F17) — no standalone skill.
**Related Skills:** Topic F (F17, gap directly closed by this finding), Topic J §1 (specificity-scoring function directly reused), Topic L §2 (same reuse-over-duplication pattern already established for title tags/meta descriptions).
**Confidence:** HIGH — based on directly-cited W3C/WCAG primary-source documentation, not inference.

---
**FINDING ID:** N-02
**Researcher:** Harsh
**Research Area:** N — Accessibility as AI / Human Readability
**Research Question:** §2 — what does the largest available empirical study of web accessibility (the WebAIM Million) tell this hackathon about prevalence, detectability limits, and false-positive risk?
**Observation:** A seven-year-running, million-page, methodologically transparent annual study finds missing alt text on 53.1% of home pages (2026) and "questionable or repetitive" alt text on 13.4% of images that do have it (2025) — confirming this document's §1 concerns are real, large-scale, measured phenomena, not theoretical constructs. The same study's own methodology section states plainly that even its industry-standard automated tool (WAVE) can only automatically detect 25-35% of possible WCAG conformance failures.
**Evidence:** webaim.org/projects/million/ (2026 report), webaim.org/projects/million/2025, and the 2025-specific "questionable or repetitive alternative text" statistic (via Vance Bell's direct analysis of the WebAIM 2025 report), all directly citing WebAIM's own primary, published methodology.
**Sources:** See §2 §C.
**Pattern:** Near-majority real-world prevalence of the exact issue this document's §1 investigates makes materiality-gated, non-blanket severity design (§1 H) a necessary, evidence-justified requirement, not merely a stylistic preference — directly avoiding the "alert fatigue"/big-checklist failure mode this series already identified via the static-analysis literature (Topic S, Finding S-02).
**Counterexamples:** None specific to this finding — it is a direct, evidentiary confirmation of prevalence and detectability limits, not a claim requiring its own counter-evidence search.
**Hypothesis:** This document's own alt-text-specificity check should report its confidence with explicit reference to the general ~25-35% automated-detection ceiling documented for accessibility issues, rather than implying comprehensive detection.
**Signal:** N/A directly — this is prevalence/calibration evidence supporting §1's design, not an independent website signal.
**How to Detect:** N/A directly.
**Evidence Output:** Calibration/confidence-language context to accompany §1's findings in the final report.
**False Positives:** Without materiality gating, this check would fire on a majority of audited sites with undifferentiated severity — directly evidenced, not hypothetical, given the 53.1% prevalence figure.
**False Negatives:** The 25-35% ceiling applies to comprehensive WCAG testing broadly; this document's much narrower check is not directly comparable in scope, but inherits the same honest-limitation principle.
**Severity:** N/A (evidentiary/calibration finding).
**Recommended Fix:** N/A directly.
**Generalization:** High — WebAIM's million-page, cross-site-type sample is among the more broadly representative evidence sources in this entire document series.
**Candidate Skill:** Informs confidence-reporting language for the alt-text check folded into `content-substance-check`; no standalone skill.
**Related Skills:** Topic S (Finding S-02, per-category confidence tracking — this finding is a concrete, real-world-sourced instance of exactly that design principle).
**Confidence:** HIGH — based on a large-scale, transparent, multi-year, directly-cited primary source, one of the strongest evidentiary bases in this entire document series.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
The alt-text/machine-readability overlap (§1) is genuinely mechanism-level, not merely a hopeful cross-domain analogy — both a screen reader and a text-extraction crawler operate on the same underlying DOM text-alternative data and fail identically when it's absent, a fact independently documented by the W3C itself (the crawler-accessibility rationale behind WCAG 1.4.5) rather than something this document needed to argue from first principles. This also closes a loop this series left open: Topic F's F17 unit had already, independently flagged "image-locked facts" as a false-negative risk without full elaboration — this document confirms that observation is a fully general, primary-source-backed principle.

**Strongest unvalidated hypothesis:**
That the decorative-vs-content-bearing image classification heuristic (§1 F) — using dimensions, DOM position, and template-region detection — will correctly and reliably distinguish the majority-common "correctly decorative, no finding needed" case from the minority "content-bearing, genuinely worth checking" case without excessive false positives; this heuristic is this document's own design, not independently validated, and should be tested against real sites before finalizing thresholds, consistent with this series' standing practice for original-synthesis design work.

**Strongest candidate skill:**
No standalone skill proposed — consistent with Topic L's own conclusion for title tags/meta descriptions, this document's genuinely defensible contribution (alt-text specificity checking on content-bearing images) folds entirely into Topic J's `content-substance-check` (reusing its specificity-scoring function) and cross-references Topic F's `entity-identity-audit`, rather than justifying a new skill.

**Weakest assumption we should investigate next:**
This document's decision to scope Topic N to only the alt-text/machine-readability overlap, explicitly excluding the majority of the master research map's N1-N20 list (keyboard navigation, ARIA, color contrast, form labels) as lacking a documented AI-mechanism link, should be revisited if any future research (this series' own remaining topics, or a live Combine-phase discovery) surfaces a machine-readability angle for one of those excluded items that this document's initial investigation did not find.

---

## 4. Cross-references for the Combine & Code phase (flags for Pulkit/Soham)

- **§1 ↔ Topic F's F17 (brand vs. product, image-locked relationship risk):** This document directly closes the false-negative gap Topic F's F17 unit explicitly flagged but did not resolve — recommend Topic F's document be cross-updated to reference this finding as the resolution.
- **§1 ↔ Topic J §1 (specificity scoring) and Topic L §2 (reuse-over-duplication precedent):** This is now the third instance in this series (after title tags/meta descriptions in Topic L) of a plausible "new checklist item" being fully served by reusing Topic J's existing specificity-scoring function on a new field, rather than requiring new detection logic — recommend the team recognize this as a recurring, reliable pattern for evaluating any future candidate "new check": first ask whether Topic J §1's function, applied to the relevant field, already solves it.
- **§2 ↔ Topic S (Finding S-02, per-category confidence tracking):** The WebAIM Million's self-reported 25-35% automated-detection ceiling is offered as a concrete, real-world-sourced template for exactly the kind of honest, non-overclaiming, per-category confidence statement Topic S's schema requires — recommend this be used as a worked example when the team implements Topic S's confidence-reporting design.
- **General ↔ scope boundary with any future/existing accessibility-specific work:** This document explicitly and deliberately does not attempt a comprehensive WCAG audit (keyboard nav, ARIA, contrast, forms) — if the team's final marketplace includes or considers including a general accessibility-compliance skill (using axe-core or a comparable library) for its own sake, that would be a separate, additional skill from this document's narrow AI-overlap contribution, not a duplicate or a replacement of it.
