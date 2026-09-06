# Topic U — False Positives & False Negatives (U1–U18)
**Researcher:** Soham | **Research Area:** U — False Positives & False Negatives
**Priority:** Very High (explicitly: directly rubric-weighted)

---

## 0. Framing — this document is where every prior "never-fire" rule finally gets assembled into one usable artifact

Every single prior document in this project — V, W, X, Y, Z, AA, AB, AC, AD, AF — has, at some point, said a version of "this should be registered in the `false-positive-suppression` skill's rule set" or "feeds Topic U." Topic AA's Cluster E went further and named this explicitly as arguably the highest-leverage cluster in the whole project, because it's the runtime enforcement point for every false-positive pattern this research has painstakingly documented — and then noted the catalog those checks consult didn't actually exist as one artifact yet. **This document is that artifact.**

Most of U1–U12's individual questions already have a real, evidenced answer scattered across prior work — this document's job is threefold, matching the rubric's own explicit emphasis on this exact topic: (1) **consolidate** every scattered suppression rule into one table (Section 2) — the thing Topic Z's Cluster F and Topic AA's Cluster E both assumed would exist; (2) give genuine new treatment to the three questions (U9, U10, U11) nothing in this project has directly answered yet; and (3) turn U13–U18 into an actual, usable **decision procedure** — not five separate concepts, but one coherent flow a skill runs through before finalizing any finding.

This is the document that makes the difference between the failure mode the topic's own prompt names outright — "the skill finds 100 problems, therefore it must be good" — and a marketplace that reports 12 real problems and says so with confidence.

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. The consolidated suppression rule table (U1–U8, U12)

This is the artifact every prior document's "feeds Topic U" cross-reference was pointing to. Each row: the naive pattern that looks like a defect, the condition under which it's actually fine, and the distinguishing signal a skill should check before firing.

| # | Naive "defect" | When it's actually fine | Distinguishing signal | Source |
|---|---|---|---|---|
| U1 | Missing JSON-LD / structured data | Facts are present as plain, extractable visible text — at least some current AI systems don't reliably parse schema markup live anyway | Same fact present in visible prose, independent of markup | Pulkit F3, Topic AH (AH4) |
| U2 | Page is JS-rendered | The *specific facts* a check cares about are present in the static/pre-render HTML even if other page chrome is JS-dependent | Raw-HTML vs. rendered-DOM diff shows the target fact in both | Pulkit's rendering work |
| U3 | Content is short | Page type is a directory/listing/product-detail/API-reference entry where brevity is the correct, expected format | Site-type/template classification (Topic V/AF) says this template is a "thin-by-design" type | Topic V Cluster B, Topic AF Cluster B |
| U4 | Content is long | Content is information-dense (specific claims, numbers, sourced statements) rather than padded — long ≠ bad by itself, any more than short ≠ bad | Quotability/specificity score (Pulkit F1) is high despite length | Pulkit F1 |
| U5 | Duplicate content across the web | Site type is news (syndication/quotation is expected) or the "duplicate" is a legitimate, clearly-labeled summary linking to its authoritative source | Site-type classification = news/media, or explicit attribution/link to the source present | Topic W (W-02), Topic AC Cluster D (AC12's "labeled summary" counterexample) |
| U6 | Missing "last updated" date | Content type is evergreen-and-labeled-as-such, or version-tagged (docs) rather than calendar-dated by convention | Site-type classification = docs/reference (Cluster D) or explicit evergreen labeling | Topic V Cluster D, Topic AC Cluster C |
| U7 | Content appears old | Substance is still accurate; staleness only matters when the *specific fact* has actually changed, and severity itself should scale by topic sensitivity, not by age alone | Fact-verification against current reality (where checkable) + YMYL severity gating | Pulkit's freshness work, Topic V Cluster A |
| U8 | robots.txt disallow on some paths | The site owner deliberately excluded private, duplicate, or thin internal content — a disallow is a *choice*, not a defect, unless it blocks content that should plausibly be public and citable | Does the disallowed path contain otherwise-unique, valuable content, or is it plausibly internal/duplicate/thin (search results pages, admin paths, tag-archive duplicates)? | Topic Z Cluster H, Topic AD Cluster D |
| U12 | Low or zero citation frequency in testing | A single query attempt (or a small handful) is not statistically meaningful evidence of invisibility — this is the project's own standing research-standard warning, now operationalized as a rule | Fewer than a minimum test-query count (Section 4, U14) attempted before concluding non-citation | Project-wide research standard; formalized in Section 4 below |

---

## 3. Genuinely new treatment — U9, U10, U11

### U9 — When is a PDF appropriate?

**A. What we need to understand:** Whether PDF-hosted content should be treated as inherently less citable (a defect) or as a legitimate format choice, and where the actual line sits.

**C. Current evidence — FACT (a directly relevant, authoritative real-world precedent, not this project's own inference):** The SEC's own EDGAR filing system draws exactly this distinction, and it maps cleanly onto this project's needs. PDF is explicitly accepted only as an **"unofficial"** copy — every PDF filing must be accompanied by an official HTML (or XBRL/structured) counterpart, and the SEC has stated it "expects to require HTML for most filings... to gain experience with this format" specifically because HTML aids machine analysis and retrieval. A more recent (2025) SEC rule goes further, reserving unstructured PDF specifically for **exhibits that are themselves copies of existing, fixed documents** (an execution page, a physical certificate), while requiring the substantive, decision-relevant content to be filed in machine-readable XML/XBRL.

**INFERENCE (the direct, portable principle)** — This maps cleanly onto a general rule: **PDF is appropriate for content that is inherently a fixed, often-signed, official artifact meant to be printed or archived exactly as-is** (a downloadable report, a signed contract, a printable spec sheet, a legal filing copy) — and **inappropriate as the sole format for core, frequently-needed, decision-relevant content** (pricing, key product facts, disclosures) that would benefit from being live, updatable, machine-readable HTML. Critically, even where PDF is the right format, it must be **tagged** (real heading structure, tagged tables, embedded text rather than a scanned image) to be extractable at all — an untagged or scanned PDF is functionally opaque to both screen readers and AI text extraction alike, a point the SEC's own accessibility guidance makes explicitly.

**N. Candidate skill:** No new skill — a specific check within Pulkit's extraction work: classify PDF content by whether it's a fixed-artifact type (exhibit/report/signed-document) or core decision-relevant content; for the latter, flag if no HTML/text equivalent exists; for either, separately check whether the PDF itself is tagged/text-extractable versus scanned/image-only.

---

### U10 — When is image-based content appropriate?

**A. What we need to understand:** Whether image-heavy pages (portfolios, product photography, infographics) should be penalized for low text density, or whether this is often the correct format.

**C. Current evidence — INFERENCE (direct synthesis of Topic V's Cluster E findings, not new external research)** — Topic V's Cluster E already established the two relevant cases: **appropriate** — portfolio/photography sites where the image *is* the product being shown, and Topic V's V13 media case, where video/audio genuinely carries the content and a supporting transcript (not full text replacement) is the correct remediation; **inappropriate** — when a *specific, checkable fact* (a price, a spec, a policy) exists only as text baked into an image (a common pattern in older-style web design, or a promotional graphic), since that fact is then invisible to both text extraction and, often, to a screen reader — the same underlying "is the fact machine-parseable at all" concern from the appendix's background concept C, applied specifically to the image-vs-text choice.

**N. Candidate skill:** No new skill — a specific check already implied by Topic V's Cluster E and the appendix's own background concepts: detect text-in-image patterns specifically for fact-bearing content (not decorative or product-photography images), and check for transcript/alt-text/caption presence when video/audio carries the core content.

---

### U11 — When is an external link preferable to on-page content?

**A. What we need to understand:** Whether a page should always be penalized for not containing content itself, or whether linking out is sometimes the more correct, more trustworthy choice.

**C. Current evidence — INFERENCE (a genuinely new synthesis connecting Topic V's Cluster B and general information-quality principles, not previously stated in this project)** — Two legitimate cases: **(1) directories/marketplaces (Topic V's Cluster B)**, where linking out *is* the product, not a shortfall — already established there. **(2) A case not yet named anywhere in this project**: a page correctly linking to an **authoritative external source** rather than restating regulated or fast-changing information itself — e.g., a company's page linking to the actual government regulation or official current tax rate rather than reproducing a number that could drift out of sync with the authoritative source and become exactly the kind of stale, confidently-stated claim Topic W's W-02 and Pulkit's freshness work both warn about. In this second case, **linking out is the more trustworthy choice, not a content gap** — restating the number on-page duplicates Pulkit's freshness-maintenance burden for a fact the linked authority already maintains correctly, and directly reduces the risk of the page's own copy silently drifting stale.

**N. Candidate skill:** No new skill — a suppression rule: don't flag "missing content" when a page links directly to the authoritative external source for a regulated/fast-changing fact rather than restating it; in fact, consider this a *positive* pattern worth not just suppressing a false defect on, but potentially surfacing as a good practice (Topic AC's proactive-recommendation territory, in reverse — recognizing an already-good pattern rather than only recommending new ones).

---

## 4. The decision procedure (U13–U18) — one flow, not six separate concepts

This is the mechanism Topic Z's Cluster F and Topic AA's Cluster E both assumed existed. It runs once, for every candidate finding, before it's finalized.

```
CANDIDATE FINDING
      │
      ▼
[1] MINIMUM EVIDENCE CHECK (U14)
    Does this finding have at least one piece of directly-traceable evidence
    (per Topic Z's claim-to-evidence schema validation, Topic AA Cluster B)?
    NO  → do not report. Not "low confidence" — not reportable at all.
    YES → continue
      │
      ▼
[2] SITE-TYPE / INDUSTRY GATE (U17, U18)
    Does Topic V's site-type classification (or Topic V Cluster A's YMYL flag)
    directly license an exception for this finding type?
    (Consult the consolidated table, Section 2, plus Topic V's own
    cluster-specific never-fire lists.)
    YES, exception applies → SUPPRESS (log as suppressed + reason, per
                              Topic Z's `suppressed: true` field — never
                              silently drop)
    NO exception applies   → continue
      │
      ▼
[3] SAMPLING-UNCERTAINTY CHECK (U16)
    Is this a "found on N pages" claim? If so, per Topic AF's Cluster D:
    is the affected element confirmed template-shared (high-confidence,
    mechanism-based extrapolation) or merely repeated across a small,
    coincidental sample (lower-confidence, "found on N/M sampled pages"
    phrasing only — never "site-wide")?
    → tag confidence tier accordingly, continue
      │
      ▼
[4] MINIMUM TEST-COUNT CHECK, specifically for non-citation/absence claims (U12)
    If the finding is "AI did not cite/answer this," has this been tested
    against at least [a small, fixed minimum — e.g., 3] varied query
    phrasings, not one? 
    NO  → do not report as "not cited" — report as "not tested sufficiently"
          or fold into a lower-confidence, explicitly-hedged finding
    YES → continue
      │
      ▼
[5] CONTRADICTION CHECK (Topic AA Cluster E — cross-reference, not
    re-derived here)
    Does any other already-computed upstream signal directly contradict
    this finding? → apply Topic Z Cluster F's precedence rule if so
      │
      ▼
[6] CONFIDENCE COMPUTATION (U15 — direct reuse of Topic AA's AA-01)
    Compute confidence from objective proxies established there
    (deterministic-tag, corroborating-skill count, verification-loop
    outcome, now also this procedure's own steps 1-5 as inputs) —
    never from a raw verbalized self-report.
      │
      ▼
FINALIZED FINDING, with confidence tier and (if applicable)
suppression/sampling caveats attached
```

**INFERENCE (the point of assembling this as one flow rather than six separate write-ups)** — U13 ("when should a finding be suppressed") isn't a separate question with its own answer — it's the **name for what happens when step [2] resolves "yes, an exception applies."** Writing U13 as its own independent treatment, separate from the mechanics that actually produce a suppression decision, would have been exactly the kind of restated-padding this project has repeatedly disciplined itself against (Pulkit's Topic E meta-finding, this document's own Topic AH synthesis). The six sub-questions are six steps in one procedure, not six independent research findings.

---

## 5. Findings register

---
**FINDING ID:** U-01
**Researcher:** Soham
**Research Area:** U — False Positives & False Negatives
**Research Question:** Does this project's own scattered "never-fire" documentation across ten prior topics actually cohere into one usable rule set, or does assembling it reveal gaps?
**Observation:** Assembling Section 2's table found that eight of the twelve U1-U8/U12 questions already had a directly-traceable, evidenced answer in prior work, with no contradictions found between sources — but three (U9, U10, U11) had no prior treatment at all and required new research, and U13-U18 were never previously unified into a single decision procedure despite being referenced as if one existed in at least four prior documents (Topic Z Cluster F, Topic AA Cluster E, Topic AF Cluster D, Topic AC Cluster F).
**Evidence:** Direct cross-referencing against V, W, X, Y, Z, AA, AC, AD, AF's own prior documents.
**Sources:** Internal — this project's own prior research documents.
**Pattern:** This is the clearest, most concrete instance across this entire project of a documented gap between "we've referenced this mechanism as if it exists" and "this mechanism has actually been specified" — assembling it here closes that gap for the false-positive-suppression system specifically, which the rubric weights most heavily.
**Counterexamples:** None found contradicting the consolidated table's individual rows; the gap was one of assembly, not of conflicting prior answers.
**Hypothesis:** N/A — direct synthesis and gap-identification.
**Confidence:** HIGH — this is a direct, auditable cross-referencing exercise against this project's own existing, citable documents, not a new empirical claim.

---
**FINDING ID:** U-02
**Researcher:** Soham
**Research Area:** U — False Positives & False Negatives
**Research Question:** U9 — is there an authoritative, real-world precedent for when PDF is and isn't an appropriate format for decision-relevant content?
**Observation:** The SEC's own EDGAR system draws exactly this line: PDF is accepted only as an "unofficial" copy requiring an HTML/XBRL official counterpart, with explicit regulatory movement toward requiring machine-readable formats for substantive content, reserving unstructured PDF specifically for exhibits that are themselves copies of fixed, existing documents.
**Evidence:** SEC EDGAR filing FAQ documentation; SEC PDF-accessibility guidance; a 2025 Federal Register rule on electronic submission formats reserving unstructured PDF for specific exhibit types while requiring XML/XBRL for substantive content.
**Sources:** newsfilecorp.com/filing/edgar/faqs.php; skynettechnologies.com (SEC PDF accessibility); federalregister.gov (2025 electronic submission rule).
**Pattern:** A genuine, authoritative, real-world regulatory precedent for a distinction this project needed but hadn't previously grounded in anything beyond intuition — PDF-as-exhibit vs. PDF-as-primary-content is not this project's own invented heuristic, it's how a major financial regulator already draws the same line.
**Counterexamples:** None — the SEC's own rules are internally consistent on this point across multiple cited sources.
**Hypothesis:** N/A — direct regulatory precedent.
**Confidence:** HIGH — multiple, independent, authoritative (regulatory) sources converging on the same distinction.

---

## 6. Required end-of-topic synthesis

**Strongest validated insight:**
U-01 — the act of assembling this document closed a real, concrete gap that existed across at least four prior documents, each of which referenced a consolidated suppression rule set as if it already existed. This is the clearest single piece of evidence in this whole project that the "combine and code" phase genuinely needed this specific document before implementation, not just as a formality.

**Strongest unvalidated hypothesis:**
Whether the minimum test-query count in step [4] of Section 4's decision procedure (illustratively set at 3) is actually the right number — this project's own research standard has consistently warned against single-query non-citation conclusions, but no specific minimum has been empirically validated anywhere in this project; 3 is a reasonable, defensible starting point, not a tested threshold.

**Strongest candidate skill:**
Not a new skill — the Section 4 decision procedure itself, implemented as the literal function every skill's candidate findings pass through before finalization, directly fulfilling what Topic AA's Cluster E called the highest-leverage, cheapest-to-implement mechanism in the entire project.

**Weakest assumption we should investigate next:**
Whether the consolidated table (Section 2) is actually complete — it was assembled from this project's own ten prior documents, which is a real, traceable source, but a genuinely new site encountered during implementation could surface a false-positive pattern none of the prior research anticipated. The table should be treated as a living document, extended as new suppression rules are discovered during actual testing, not as a closed, final list.

---

## 7. Cross-references for the Combine & Code phase

- **Section 2 (consolidated table) ↔ Topic Z (Cluster F), Topic AA (Cluster E):** This is the literal configuration data those two clusters' mechanisms were designed to consume — hand this table directly to whoever implements them.
- **U9 ↔ Pulkit's extraction work:** The PDF fixed-artifact-vs-decision-relevant-content classification is a specific, addable check within that existing infrastructure.
- **U10 ↔ Topic V (Cluster E, V13):** Directly extends the transcript/caption check already specified there.
- **U11 ↔ Topic V (Cluster B) and Pulkit's freshness work:** The "linking to authority is sometimes better than restating" principle should be added to Topic AC's proactive-recommendation content as a positive pattern to recognize, not just a defect to avoid flagging.
- **Section 4 (decision procedure) ↔ Topic Z (Clusters D, F, G), Topic AA (Clusters D, E), Topic AF (Cluster D):** This procedure is the literal integration point between all of these — it should be built once, as shared infrastructure every skill's finalization step calls, not reimplemented per skill.
- **The whole document ↔ every prior topic in this project:** This is explicitly the topic the rubric weights most heavily on detection accuracy and false positives — every other topic's "feeds Topic U" cross-reference now has a concrete destination, and this document should be the first one reviewed, alongside Topic Z's contracts, before any skill implementation begins.
