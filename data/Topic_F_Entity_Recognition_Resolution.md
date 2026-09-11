# Topic F — Entity Recognition & Entity Resolution
**Researcher:** Harsh | **Research Area:** F — Entity Recognition & Entity Resolution (named entities, disambiguation, brand identity, aliases, entity collisions, KG representation)
**Priority:** Very High

---

## 0. Framing — what Topic F is actually for

Topic F is not "add schema markup" as trivia. It exists to answer one design question for the marketplace:

> **Given a brand's name and self-description, can a retrieval/generation system resolve "this brand" to a single, correct real-world entity — distinct from any other person, place, product, or organization that shares its name, correctly connected to any alias/former-name form of itself, and correctly placed within any larger organizational structure it belongs to — and if not, what on-page evidence would let a read-only crawler detect that failure in under 5 minutes?**

Every sub-topic below is evaluated against that question, not against "is this interesting entity-SEO trivia."

The master research map lists F1–F10 and F13–F50 under Topic F (47 numbered items). Following the same approach Pulkit used for Topic A (where A1–A10 were condensed into short evidence-anchored paragraphs and full A–O depth was reserved for A11–A22, the units he judged to be genuinely distinct investigation questions), I am doing the same here: **F1–F16 and F32–F36 are condensed into anchor paragraphs** (§§1–3 below) because they either belong to Topic H (mine, Trust/Authority/Corroboration) rather than Topic F, or because they are shared scaffolding referenced by the deeper investigation units rather than distinct questions in their own right. **F17–F22, F23–F30, F31, F37–F40, F41–F46, and F47–F50 receive full A–O treatment** (§§4–9) as the six genuinely distinct investigation units in this topic.

**Constraint from the handout, re-read carefully:** Appendix D states plainly: "when several different things share a name, a system can mix them up unless there's something that clearly distinguishes one from the others." This is the handout's own framing of Topic F's core problem, and — unlike much of the surrounding commercial content in this space — it is corroborated by a genuine peer-reviewed benchmark (§7 below), not just plausible-sounding SEO commentary.

---

## 1. FACT vs OBSERVATION vs HYPOTHESIS vs INFERENCE vs SPECULATION — global legend

Same legend as Pulkit's Topic A document, used identically here for cross-document consistency:
- **FACT** — documented by the vendor/standards body, or established in peer-reviewed/archival literature.
- **OBSERVATION** — reported by independent researchers/practitioners running real, methodologically transparent trials (not vendor-confirmed).
- **HYPOTHESIS** — our proposed testable claim, not yet validated by us.
- **INFERENCE** — reasonable derivation from FACT/OBSERVATION, one logical step removed.
- **SPECULATION** — plausible but unconfirmed; flagged, not built on.

**A note on source quality control that shaped this entire document.** Every search pass in this topic surfaced a large, mutually-reinforcing cluster of 2025–2026 "GEO"/"Entity SEO" content-marketing sites (OrganiKPI, Verlua, Schemaengineai, 5W, Squin, Stackmatix, andresseo.expert, Parse, Kalicube, lseo.com, Maria Dykstra, and similar) making precise, confident, unfootnoted claims — exact percentages, named "studies" with no retrievable data, invented-sounding internal mechanism names ("Knowledge Vault," "MREID," specific Wikidata property numbers cited with confident precision, "entity resolution runs before retrieval"). None of these link to a retrievable primary dataset, several show templated/near-identical phrasing across nominally different "companies," and none survive comparison against Google's own developer documentation (which states no required Organization properties and does not make the causal citation-rate claims this content repeats). **I am treating this entire content cluster as unverifiable marketing material, not evidence**, per the research standard's explicit instruction not to launder plausible-sounding claims into fact. This is itself a finding, not just a caveat — see Finding F-00 in §10. Independently, a July 2026 peer-review-adjacent critical survey of the actual GEO academic literature (arXiv 2607.14035) reaches the same conclusion about this content ecosystem from a completely different angle — it explicitly documents and rejects the single most commonly circulated claim in this space (the "40% visibility lift" figure) as a misreading of a narrow, conditional lab result — which independently raises my confidence that this is a real, systemic problem with the source material surrounding this entire hackathon topic area, not just my own suspicion.

---

## F1–F10: Fact corroboration, source consistency, reviews, mentions, directories, authority, E-E-A-T, social proof, cross-domain consistency (handoff, not duplicated)

These ten items — as they appear in the master research map — are corroboration/trust concerns, not entity-*resolution* concerns: they ask "does independent evidence exist and agree," not "can a system tell which entity this is." I own both Topic F and Topic H per the distribution sheet, so there is no cross-person handoff needed here (unlike Pulkit's A20, which genuinely had to hand off to me) — but I am **not** duplicating F1–F10's content in this document. They are treated fully under my own Topic H write-up (Trust, Authority & Corroboration), where "independent agreement" and "source diversity" are the actual subject matter. I flag this explicitly here so a reviewer doesn't conclude F1–F10 were skipped — they were deliberately relocated to the topic that actually owns their mechanism, exactly mirroring how Pulkit relocated A20's conflicting-fact-resolution mechanics to this document rather than building it twice.

---

## F13–F16: Entity attributes, descriptions, identifiers, sameAs (condensed — shared scaffolding)

**What this is:** the raw vocabulary of machine-readable entity representation — the properties (`name`, `description`, `identifier`, `sameAs`) that any of the deeper F-investigation units below would use to *state* a disambiguation or aliasing fact, once we know what fact needs stating.

**FACT (Google, first-party, direct):** Google's Organization structured-data documentation states there are **no required properties** and recommends adding "as many properties that are relevant to your organization," with the explicit caveat that it is "more important to supply fewer but complete and accurate recommended properties rather than trying to provide every possible recommended property with less complete, badly-formed, or inaccurate data." Google's structured-data policies explicitly prohibit using markup to "impersonate any person or organization, or misrepresent your ownership, affiliation, or primary purpose" — confirming Google performs *some* identity-consistency policing on structured data, even though the specific detection mechanism is undocumented.

**FACT (semantic web standard, pre-dates and is broader than any single search engine):** `sameAs` (as `owl:sameAs`) is a W3C-era Semantic Web/Linked Data primitive for declaring that two resources denote the same real-world entity, later adopted into schema.org/JSON-LD — a general Linked Data mechanism, not an SEO invention.

**FACT (Google Knowledge Graph API, direct, mechanism-confirming):** the documented `kgsearch.googleapis.com/v1/entities:search` endpoint returns entities as JSON-LD conforming to schema.org, each with a machine ID (`kg:/m/...`) and a `resultScore` — direct, first-party confirmation that Google's entity-resolution infrastructure is schema.org-native and performs candidate ranking, architecturally consistent with (though not proof of identical operation to) the general entity-linking literature's candidate-generation-then-ranking pattern discussed in §7 below.

**INFERENCE, carried into every deeper unit below:** because at least one major system's entity-resolution infrastructure is schema.org-native, and because (per §7) the academic entity-linking literature relies primarily on *textual context* rather than markup for the actual disambiguation decision, the defensible position — carried through this entire document — is that **structured data functions as a reinforcing, machine-parseable restatement of facts that should also exist in plain prose, not a substitute for prose, and not independently proven to drive AI-assistant citation behavior on its own.** No standalone signal, severity, or skill is assigned to F13–F16 in isolation; they are the implementation layer used by F17–F50 below, and the "schema completeness score divorced from an actual underlying fact" anti-pattern is explicitly rejected throughout this document (see Finding F-02).

**Relationship to other topics:** Topic G (Structured Data & Semantic Web, also mine) should own general schema *validity and correctness* across all schema.org types (Product, Review, Article, FAQPage). Topic F's `entity-identity-audit` owns only the narrow slice of schema specifically relevant to entity identity (`Organization`/`Person`/`LocalBusiness` `sameAs`/`@id`/`alternateName`/`parentOrganization`). This boundary is maintained explicitly to avoid Topic F and Topic G building overlapping schema-validation logic.

---

## F32–F36: Organization, Person, Product, Place, Brand schema types (condensed — shared scaffolding)

**What this is:** the specific schema.org *types* available to express entity identity and relationships, as opposed to the *properties* covered in F13–F16.

**FACT (schema.org, direct):** schema.org provides purpose-built types and properties for exactly the relationship questions raised in F17–F22 and F47–F50 below: `Organization`, `Person`, `Product`, `Place`, `Brand` as top-level types, and `parentOrganization`, `subOrganization`, `manufacturer` (Product→Organization), and `brand` (Product→Brand) as the connecting properties between them. This vocabulary's *existence* is FACT; its *causal effect on AI-assistant citation behavior specifically* is not independently evidenced by any source found in this research pass (see F-02 in the findings register) and should not be conflated with the well-established but distinct question of Google Knowledge Panel eligibility.

**Treatment:** no standalone signal — this is the type-vocabulary used by the F17–F22 (organizational topology) and F47–F50 (multi-entity/M&A) investigation units below, not a separate question. Detection logic for whether these types are used *correctly, where a genuine relationship exists* is covered in those two units' own §F sections, not duplicated here.

---

## F17 — Brand vs. product

### A. What we need to understand
When a company's product has its own distinct, marketed name (different from the company name), can a system correctly attribute facts — reviews, pricing, complaints, praise — to the right node (the product or the company), or does the product/company boundary create a distinct misattribution risk from plain name collision?

### B. Why it matters for the hackathon
This is a genuinely common, under-checked case: most companies with a flagship product either use the company name as the product name (no issue) or have a distinctly-branded product (an issue only if the relationship is never stated). Teams building an entity-resolution skill are far more likely to check "is the company name unique" than "does this product page ever say what company makes it" — making this a non-obvious, high-leverage check.

### C. Current evidence
- **FACT (real production engineering acknowledgment):** A granted patent (US 12,182,083 / the closely related 12,380,080, "System and method for entity disambiguation for customer relationship management") explicitly models `brand` as a distinct subclass associated with "a given company or organization," and separately models a `connection_type` field distinguishing parent/subsidiary relationships from plain brand association. This confirms that real, deployed entity-resolution engineering treats brand-to-company attribution as a first-class, separately-modeled relationship, not something inferred automatically from name similarity or co-occurrence alone.
- **FACT (schema.org, direct):** the `Product.manufacturer` and `Product.brand` properties exist specifically to state this relationship in machine-readable form (see F32–F36 above).
- **INFERENCE:** because entity-linking systems generally resolve mentions using textual context (§7 below) rather than assumed real-world knowledge, a product page that never mentions its manufacturer in prose or markup is relying entirely on the *external* web (third-party reviews, retailer listings, Wikipedia) to supply a fact the page itself could state for free — the same "context-insufficiency" mechanism that recurs across every F-unit in this document.
- **No peer-reviewed study found** measuring AI-assistant misattribution specifically along the brand/product boundary (as distinct from the person-name-collision case directly measured by WhoQA in §7). This is a genuine, flagged evidence gap — this section rests on INFERENCE from adjacent, better-evidenced mechanisms, not on a direct measurement, and should be scored accordingly.

### D. Important mechanisms
Brand/product ambiguity is mechanistically different from plain name collision (§7): it is not "two entities happen to share a string," it is "one real-world thing has two names operating at two organizational levels, and a system needs to know they're connected, not confused." Getting this wrong produces a specific, plausible failure: a system correctly finds and cites facts about "the company" while a user asked about "the product" (or vice versa), producing an answer that is technically sourced but practically unhelpful or subtly wrong (e.g., attributing a company-wide policy to a single product line, or vice versa).

### E. Concrete website signals
Does a product's own page (or dedicated product section) ever state, in crawlable prose, which company makes/sells it? Does the company's own site ever list its products by name? Is this relationship also stated in schema (`manufacturer`/`brand`)?

### F. How the signal could be detected automatically
Deterministic: detect whether a page's primary subject (via repeated proper-noun extraction) differs from the site's overall brand name (from domain/title/Organization schema); if so, check for co-located relationship language ("made by," "a product of," "by [Company]") in prose and `manufacturer`/`brand` schema properties. Escalate to a single LLM check only when the deterministic pass is ambiguous (e.g., the "product name" detected might just be a marketing tagline, not a genuinely distinct brand).

### G. What evidence the skill should report
Whether a distinctly-named product/company relationship was detected; whether it is stated in prose, markup, both, or neither; location of any relationship statement found.

### H. Possible severity logic
- **Medium:** a genuinely distinct product brand exists with zero relationship-stating content anywhere crawlable.
- **Low:** relationship stated in one channel (prose or markup) but not both.
- **No finding:** product name and company name are the same, or the relationship is clearly and redundantly stated.

### I. Correct remediation
Add a brief, explicit relationship statement ("[Product] is made by [Company]") to the product page's crawlable text, plus `manufacturer`/`brand` schema properties as machine-readable reinforcement.

### J. False-positive cases
A memorable *feature name* or marketing tagline is not the same as a genuinely distinct product brand — the check must first confirm the detected "product name" is actually used as a standalone identity elsewhere (e.g., in third-party coverage, its own logo/page) before treating the relationship as something that needs stating. Many small businesses have no distinctly-branded products at all and should generate no finding.

### K. False-negative risks
A relationship stated only in an image (a logo lockup showing "[Product] by [Company]") is invisible to this text/markup-based check — consistent with the general image-locked-fact risk the hackathon's own worked JS-pricing example illustrates for a different mechanism.

### L. Counterexamples
Some companies deliberately obscure or de-emphasize the manufacturer relationship for legitimate market-segmentation reasons (a company selling similar products under different brands to different market tiers, where cross-association could dilute a premium positioning) — this is a valid business strategy, and the finding should be framed as a proactive recommendation with low severity, not a hard defect, when no evidence suggests the obscuring is accidental rather than deliberate.

### M. Does this generalize across site types?
Yes for any site with a distinctly-named product line (consumer goods, SaaS platforms with named sub-products, franchises); does not apply (correctly generates no finding) for single-product or same-name businesses, which is the majority case for small/local businesses.

### N. Candidate skill(s)
Folds into **`entity-identity-audit`** as a sub-check under the "organizational topology" component (shared with F47–F50 below, since both concern relationship-graph statement rather than plain disambiguation).

### O. Relationship to other potential skills
Composes with F47–F50 (which covers the reverse and more complex direction — one company, multiple sub-brands) and with Topic H (a strong, well-corroborated company reputation may or may not "transfer" trust to an under-connected product — an open question, not asserted either way).

---

## F18–F19 — Brand vs. parent company; brand vs. subsidiary

### A. What we need to understand
When a brand is owned by a parent company, or is itself a holding structure over subsidiary brands, does the absence of a stated parent/subsidiary relationship create a distinct, detectable resolution gap — and does this matter differently than the brand/product case above?

### B. Why it matters
Parent/subsidiary structure is common in exactly the kinds of situations most likely to confuse both users and AI systems: recent acquisitions, holding companies operating several consumer-facing brands, and franchise structures. Getting this right or wrong has reputational stakes beyond simple discoverability — a factual claim, controversy, or financial fact about a parent company may or may not be relevant/attributable to a specific subsidiary brand, and stating the relationship (or its absence) correctly matters for accurate representation, not just findability.

### C. Current evidence
- **FACT (real production engineering acknowledgment, same source as F17):** the same patent family (US 12,182,083, 12,380,080) explicitly and separately models `connection_type` as a field distinguishing "if the given company is a parent company or subsidiary of the connected company" — direct evidence that production entity-resolution systems treat this as a distinct, explicitly-modeled relationship type, not inferred from co-occurrence or name similarity.
- **FACT (schema.org, direct):** `parentOrganization` and `subOrganization` are purpose-built schema.org properties for exactly this relationship (see F32–F36).
- **INFERENCE:** the same context-insufficiency mechanism recurring throughout this document applies here — a subsidiary's site that never mentions its parent (or vice versa) is relying entirely on external sources to supply a connection it could state for free.
- **Evidence gap, explicitly flagged:** as with F17, no peer-reviewed study was found directly measuring AI-assistant misattribution specifically along parent/subsidiary lines. This entire unit rests on the same tier of evidence as F17 (real-world engineering acknowledgment + schema vocabulary existence + inference from the general disambiguation mechanism in §7), not a direct measurement, and its severity ceiling should reflect that.

### D. Important mechanisms
Distinct from F17 in one important way: parent/subsidiary relationships often carry **reputational transfer risk in both directions** — a subsidiary's negative event could be incorrectly generalized to the parent (or vice versa) by a system that either over-connects or under-connects the entities, and *both* directions are plausible failure modes, unlike the brand/product case where the risk is primarily "the connection is never made."

### E. Concrete website signals
Does a subsidiary's site state its parent (and does the parent's site list its subsidiaries)? Is this stated in prose, `parentOrganization`/`subOrganization` schema, or both?

### F. How the signal could be detected automatically
Deterministic: check for relationship-declaring schema properties on `Organization`-typed pages; deterministic keyword check for relationship language ("a subsidiary of," "part of the [X] group," "owned by") in About/footer/legal text; escalate to LLM judgment only when the site's structure suggests a multi-entity organization (e.g., multiple distinct trademark/brand names appearing across the same domain or in the footer's legal-entity line) but no relationship language is found anywhere.

### G. What evidence the skill should report
Whether an apparent multi-entity structure was detected; whether the relationship is stated, and where; direction of any asymmetry found (parent mentions subsidiary but not vice versa, or vice versa).

### H. Possible severity logic
Low-Medium — matching F17's conservative severity ceiling given the same evidence-gap caveat.

### I. Correct remediation
Add `parentOrganization`/`subOrganization` schema and corresponding plain-language statements where a genuine, currently-unstated relationship exists.

### J. False positives
Many legitimate brands deliberately do not emphasize parent-company relationships for market-segmentation reasons (a newly acquired brand maintaining independent identity during a transition, or a portfolio company operating unrelated consumer brands without cross-promotion) — this is a valid strategy, not a defect, and must not be penalized as a hard finding.

### K. False negatives
True ownership structure cannot be fully verified from a public crawl alone; this check can only flag *apparent* unstated structure (inferred from detectable signals like shared legal-entity names in footers/ToS across otherwise distinct-looking sites), not confirm ownership facts independently.

### L. Counterexamples
A holding company's decision to keep its subsidiary brands entirely unconnected in public messaging is sometimes a deliberate crisis-containment or market-positioning strategy, not an oversight — severity should stay low/informational absent other evidence this is accidental.

### M. Generalizes?
Applies wherever a genuine multi-entity ownership structure exists; correctly generates no finding for single-entity businesses (the majority case).

### N. Candidate skill(s)
Folds into **`entity-identity-audit`**, same organizational-topology component as F17.

### O. Relationship to other potential skills
Directly connects to F47–F50 below (the fuller M&A/sub-brand version of this same mechanism) — F18–F19 and F47–F50 will likely share a single detection routine in the Combine phase rather than being built as separate checks.

---

## F20–F22 — Brand vs. founder; brand vs. location; brand vs. similarly named organization

### A. What we need to understand
Three related but distinct collision surfaces: (F20) a company named after or closely associated with a founder's personal name, (F21) a company whose name is also a place name (a city, region, or landmark), and (F22) the general case of two genuinely unrelated organizations sharing a name. Do these three collision *types* require different detection or severity treatment, or do they collapse into one mechanism?

### B. Why it matters
The raw master-list treats these as three separate items, but per the research standard's instruction to test whether items are genuinely distinct before building separate checks, this needs an explicit answer rather than three redundant sub-sections.

### C. Current evidence
- **FACT, directly on point (the strongest possible evidence for exactly this sub-case):** the WhoQA benchmark (Pham, Ngo, Luu & Nguyen, arXiv 2410.15737 — detailed fully in §7 below) is *built specifically around person-name collisions* — its worked example is three different people all named "George Washington," which is structurally identical to the F20 case (a company named after/closely tied to a person who may share that name with other notable people). This means F20 is not merely inferred from the general mechanism — it is the **literal case the strongest peer-reviewed evidence in this entire document was built to measure.**
- **INFERENCE:** the entity-linking literature's general mechanism (disambiguation via textual context — industry, category, geography, function) applies identically regardless of whether the collision is with a person, a place, or an unrelated organization; the *type* of colliding entity does not change the underlying resolution mechanism, only the specific disambiguating facts that are relevant (a founder-name collision is disambiguated by professional/industry context; a place-name collision is disambiguated by category — "the company," not "the city"; a same-name-organization collision is disambiguated by industry/function).
- **FACT (real-world frequency consideration, INFERENCE from common naming patterns):** F21 (brand-vs-location) is a systematically higher-baseline-frequency collision type than the others, because many companies are deliberately named after real places (regions, landmarks, cities) as a branding choice — meaning this specific sub-case will fire more often across a random sample of websites than F20 or F22, purely due to naming convention prevalence, not because it represents a more severe underlying problem.

### D. Important mechanisms
F20, F21, and F22 are **the same disambiguation mechanism with three different collision-partner types**, not three distinct mechanisms — this directly parallels the general disambiguation unit in F41–F46 below. Rather than building three redundant checks, this confirms F41–F46's general collision-risk detector should simply classify *what type* of entity is colliding (person/place/organization) as a reporting detail, not build three separate detection pipelines.

### E–G. Signals / Detection / Evidence
No new standalone signal beyond what F41–F46 already specifies — see that unit for the full detection design. The only addition specific to this grouping: the collision-risk classifier's search-based check (F41–F46 §F) should tag the competing entity's type (person / place / organization) so severity and remediation language can be tailored (e.g., a place-name collision's disambiguating fix is "state that this is a company, not the city," which differs slightly in phrasing from a founder-name-collision fix).

### H–L.
Not applicable as standalone — see F41–F46. Severity, false-positive/negative reasoning, and counterexamples are identical to F41–F46's general treatment; only the entity-type tag differs.

### M. Generalizes?
Yes — this grouping's finding (that F20/F21/F22 collapse into one mechanism) is itself a generalization that simplifies the marketplace's design, avoiding three redundant checks.

### N. Candidate skill(s)
No standalone skill — confirmed as part of **`entity-identity-audit`**'s general collision-detection logic (F41–F46), with entity-type classification as a reporting refinement.

### O. Relationship to other potential skills
Directly folds into F41–F46; explicitly prevents three duplicate checks from being built in the Combine phase.

---

## F23–F30 — Aliases, old names, abbreviations, acronyms, domain/company-name mismatch, legal vs. public name, product names vs. company names

### A. What we need to understand
When a brand legitimately has multiple valid name-forms — a former name from a rebrand, a commonly-used abbreviation/acronym, a legal entity name distinct from its public-facing brand, or a domain name that doesn't match the brand name — does inconsistent or unconnected self-reference create a detectable, largely site-controlled resolution failure, distinct from the collision problem (F17–F22, F41–F46)?

### B. Why it matters
This is the mirror-image problem to disambiguation: disambiguation is "one name, multiple entities" (a **homograph** problem in the linguistics sense); aliasing is "one entity, multiple names" (a **synonym/coreference** problem). This distinction is directly attested in the entity-linking literature — Muther & Smith (arXiv 2209.00133) explicitly frame these as inverses of each other, describing prior work on "the problem of a single surface form having multiple meanings (homographs)... rather than the inverse problem of multiple surface forms sharing the same meaning." This is also the highest-leverage, cheapest-to-fix unit in the entire Topic F area, because — unlike collision risk, which depends on the wider world — internal name-consistency is **100% within the site owner's control**.

### C. Current evidence
- **FACT (formal task, distinct from disambiguation):** Company-name matching/disambiguation — determining whether two *different-looking* strings refer to the *same* company — is a distinct, named NLP research task in its own right. Buonocore, Gastaldi & Marani, "Disambiguation of Company Names via Deep Recurrent Networks" (arXiv 2303.05391), gives the canonical example: "Intesa Sanpaolo S.p.A." and "Intesa San Paolo bank" represent the same corporation despite different surface strings.
- **FACT (dynamic-entity problem, directly on point for rebrands):** the same granted patent discussed in F17–F19 (US 12,169,508) explicitly frames the general version of this problem: "most entities (like people or companies) change dynamically over time... For a trained human it might be obvious to know from previous knowledge that 'Google' and 'Alphabet' could lead in fact to the same company... But our system cannot depend on previous knowledge or 'common sense.'" This is a directly on-point, documented technical acknowledgment (from a granted patent, not peer-reviewed literature, but a real engineering description) that **name-identity-over-time is a recognized hard case systems cannot resolve via inference alone.**
- **FACT (peer-reviewed, directly on point for F24 "old brand names"/rebrands specifically):** Exiner & Rizzi (or the credited authors), "Insights into Entity Name Evolution on Wikipedia" (arXiv 1702.01172), directly studies this exact phenomenon: the paper explicitly states that among the ways facts about entities change over time, **"most severe in terms of information retrieval are name changes"** — and builds a system to automatically detect and extract name-evolution events from Wikipedia text specifically because retrieval systems need explicit awareness of these events to find older content correctly. This is a genuine, primary, peer-reviewed source directly confirming that name changes are recognized in the information-retrieval literature as a first-order, severe retrieval-disruption event — not a minor cosmetic concern.
- **OBSERVATION, explicitly downgraded (source-quality note applies in full):** A large cluster of 2025–2026 commercial content (Parse, Kalicube, lseo.com, Maria Dykstra, andresseo.expert) makes detailed, confident, specific-sounding claims about exactly how AI systems handle rebrands — "the answer layer splits authority between two entities for months," specific mechanism names like "Knowledge Vault" and "MREID," claims about which specific Wikidata property IDs to update. None of these are traceable to a retrievable primary source or vendor documentation. **I am not building any detection or remediation logic on these specific claims.** The one piece of genuinely useful, converging signal from this cluster — stated across enough independent sources with enough directional consistency to be worth noting as OBSERVATION rather than SPECULATION — is the general, low-specificity claim that **rebrand-related name confusion in AI-generated answers is a commonly reported, recurring practitioner complaint**, which is consistent with (though far less rigorously evidenced than) the peer-reviewed name-change/retrieval-disruption finding above. I am treating only that general directional claim as OBSERVATION-tier, and explicitly rejecting the specific mechanism claims layered on top of it.
- **OBSERVATION (structured-data ecosystem convention, weak-to-moderate confidence):** the standard implementation pattern — a canonical `@id` combined with `sameAs`/`alternateName` — is the schema.org-documented mechanism for stating "these are the same entity," including across a name change. This is OBSERVATION-tier on the *specific implementation pattern's effectiveness* (drawn from documentation/convention rather than a controlled study of its effect) but rests on the FACT-tier `sameAs`/`@id` semantics underneath it.

### D. Important mechanisms
Internal name-inconsistency is a *self-inflicted* version of the alias-resolution problem: the site itself supplies multiple, disconnected surface forms for the same entity, none marked as equivalent to one another — the literature's "inverse problem" to disambiguation. This differs mechanistically from F17–F22/F41–F46 (context-insufficiency for telling *different* entities apart): here the risk is *failing to state that two strings are the same entity*.

### E. Concrete website signals
Extract every self-referential entity-name string appearing in: page `<title>` tags, Organization schema `name`, footer/copyright text, About page, Terms/Privacy legal-entity references, and any visible "formerly known as"/rebrand-notice content — then check for unexplained variance beyond expected, harmless patterns (e.g., "Acme Inc." vs. "Acme" vs. "Acme, Inc." is trivial punctuation/suffix noise and should **not** be flagged; "Acme" vs. "Zenith Corp" with no stated connection is a genuine finding).

### F. How the signal could be detected automatically
Fully deterministic: string-extract candidate self-referential entity names from the fixed set of locations above; normalize for trivial punctuation/legal-suffix variance (a small, defensible normalization ruleset — "Inc.," "LLC," "Ltd.," trailing commas/periods); flag any *distinct* (post-normalization) name string that appears without any co-located "formerly," "a [Brand] company," "dba," or schema `sameAs`/`alternateName` connecting it to the primary brand name.

### G. What evidence the skill should report
The distinct name-strings found, their locations, and whether any explicit linking language/markup connects them.

### H. Possible severity logic
- **Medium-High:** two or more genuinely distinct, unconnected name forms appear in high-visibility locations (title tag, nav, schema `name`) — directly undermines the entity's own machine-readable identity, and is corroborated by the peer-reviewed finding that name changes are a severe retrieval-disruption event.
- **Low:** inconsistency confined to low-visibility legal boilerplate (e.g., ToS referencing the registered legal entity name) with no connecting language — common, often legally mandated, lower real-world impact.
- **No finding:** fully consistent naming, or inconsistency fully explained by visible connecting language/markup (`alternateName`, "formerly," "a subsidiary of").

### I. Correct remediation
Add `alternateName` (a legitimate, documented schema.org mechanism for exactly this case) for any legal/former/abbreviated name form; add brief visible connecting language ("[Legal Entity Name], operating as [Brand Name]" or "formerly [Old Name]") near the relevant reference; ensure primary brand name is used consistently in title tags, nav, and Organization schema `name`.

### J. False-positive cases
Legally mandated distinctions (a registered legal entity name in a ToS/Privacy Policy differing from a consumer-facing brand name) are **normal and expected**, not a defect — the check must only flag *unexplained* variance. Multi-brand holding companies operating several genuinely distinct public brands should not be flagged for "inconsistency" between a parent and a subsidiary's own site — this is legitimate organizational topology (F18–F19, F47–F50), not a naming defect, and the two must not be conflated.

### K. False-negative risks
A site could use consistent naming throughout while that consistent name is itself an alias unrecognized by any external KB (e.g., a very recent rebrand where the new name hasn't propagated anywhere else on the web yet) — internal consistency alone doesn't guarantee external resolvability; this composes with Topic P (Cross-Web Consistency), not a substitute for it.

### L. Counterexamples
A deliberately dual-branded product strategy (two distinct consumer-facing names for different markets/audiences, with no intent for them to be perceived as identical) would be miscategorized as a "naming inconsistency defect" by a naive version of this check — detection logic must distinguish "two names for what the company presents as one thing" from "two names for what the company presents as two things," which may require escalating ambiguous cases to a light LLM read of the site's own framing.

### M. Generalizes?
Yes, fully — pure text/markup extraction and normalization, applicable identically across site types.

### N. Candidate skill
Folds into **`entity-identity-audit`** as a dedicated sub-check (the "aliasing" component, distinct from the "collision" component in F41–F46, but sharing the same skill folder since both concern the site's own identity-stating machinery).

### O. Relationship to other skills
Directly composes with Topic P (Cross-Web Consistency — internal consistency is a precondition for external consistency to even be checkable/comparable) and with F18–F19/F47–F50 (must not conflate legitimate multi-brand structure with naming defects).

---

## F31 — Entity type ambiguity

### A. What we need to understand
Beyond *which* specific entity a name refers to (F17–F22, F41–F46) and *whether* multiple name-forms are connected (F23–F30), is there a distinct, more basic failure mode where a system cannot even determine the correct entity *type* — is this a person, an organization, a product, a place — before any name-specific disambiguation can even begin?

### B. Why it matters
Type ambiguity is logically prior to name disambiguation: entity-linking systems typically use type constraints to narrow candidates before final disambiguation (a system that knows it's looking for an `Organization` doesn't waste consideration on `Person`-typed candidates with the same name). If a brand's own type is unclear or unstated, it removes a filtering step the system could otherwise use for free.

### C. Current evidence
- **FACT (entity-linking literature, general mechanism):** the LINDEN framework and related entity-linking systems use candidate-class/type information as a filtering signal ahead of finer-grained disambiguation — using extracted type taxonomy to eliminate invalid candidates before scoring remaining ones on textual similarity. This confirms type information is used as an efficient, logically-prior filtering step in real entity-linking system design, not merely a nice-to-have.
- **FACT (schema.org, direct):** every schema.org entity requires (or strongly implies through its type hierarchy) an explicit `@type` — `Organization`, `Person`, `Product`, `LocalBusiness`, etc. — which is precisely the machine-readable expression of this type information.
- **INFERENCE:** a site with no `@type`-bearing schema at all, and prose that doesn't make its own entity type obvious in the first few sentences (e.g., an ambiguous "About" page that could plausibly describe a person, a product, or a company without careful reading), is failing to supply a genuinely useful, cheap, logically-prior filtering signal — independent of whether a name-collision risk exists at all. This is a real but narrower and more basic check than F41–F46's full collision-risk assessment.

### D. Important mechanisms
Type ambiguity is a distinct, more basic layer beneath name disambiguation: even a perfectly unique name gains a small amount of machine-readability benefit from unambiguous type declaration, because it removes an entire class of candidate entities from consideration before any name-matching happens at all.

### E. Concrete website signals
Presence of an unambiguous `@type` in Organization/Person/Product/LocalBusiness schema; whether the site's own prose makes its entity type obvious without requiring inference (e.g., "Acme is a company that..." vs. an ambiguous "About Acme" page that never states what kind of thing Acme is).

### F. How the signal could be detected automatically
Deterministic: check for `@type` presence and specificity (a bare `Thing` type, if used, is far less useful than a specific `Organization`/`LocalBusiness`/`SoftwareApplication`); deterministic keyword pass for type-indicating language in the first paragraph of the About/homepage text ("company," "founded," "we build," "I am a," etc.).

### G. What evidence the skill should report
Schema `@type` found (or absence/genericness); whether prose independently makes entity type clear.

### H. Possible severity logic
Low — this is a basic, cheap-to-fix hygiene check, not typically a severe finding on its own; it should be scored as contributing context to F41–F46's collision-risk assessment rather than as an independent high-severity issue.

### I. Correct remediation
Use the most specific applicable schema `@type`; ensure the first few sentences of self-descriptive prose make entity type unambiguous.

### J. False-positive cases
Many entities are legitimately multi-typed or type-ambiguous by nature in a way that isn't a defect (e.g., a sole proprietor whose personal brand and business are genuinely the same entity, or a product that is also the company name) — should not be flagged as "ambiguous" when the site consistently and correctly presents itself as one type throughout.

### K. False-negative risks
Correct `@type` markup doesn't guarantee actual disambiguation if the collision-risk mechanism in F41–F46 is separately present — this is a necessary but not sufficient signal.

### L. Counterexamples
None significant beyond the false-positive case above — this is among the lowest-controversy, most mechanically straightforward checks in the whole topic.

### M. Generalizes?
Yes, universally and cheaply — every site has an entity type, and stating it is close to zero-cost.

### N. Candidate skill
Folds into **`entity-identity-audit`** as a low-severity contributing signal to the overall disambiguation-readiness score, not a standalone finding.

### O. Relationship to other potential skills
Directly feeds F41–F46 (type clarity is one input into overall collision-risk/disambiguation-readiness scoring).

---

## F37–F40 — Wikipedia, Wikidata, Knowledge Graph, and third-party entity-profile representation

### A. What we need to understand
Given that Wikipedia/Wikidata/Google Knowledge Graph are widely assumed (in both the handout's own framing and the surrounding commercial literature) to be important reference points for entity resolution, what does the actual state of these systems' *coverage and completeness* tell us about how much weight a brand-audit skill should place on presence/absence in them — and critically, is "no Wikipedia/Wikidata page" a defect, per the brief's own explicit warning against that exact assumption?

### B. Why it matters
This is the unit most directly at risk of reproducing the brief's named forbidden assumption verbatim ("no Wikipedia page = failure"). Getting the evidentiary nuance right here — understanding *why* absence is not automatically a defect, grounded in real data about who is and isn't covered — is essential to avoid building a biased, unfair check that systematically penalizes smaller, newer, or non-English-market businesses for reasons entirely outside their control.

### C. Current evidence
- **FACT (Wikidata scale and structure, directly documented in technical/survey literature):** Wikidata is a large, transparent, collaboratively-curated open knowledge graph — over 82 million entities and roughly 1 billion factual statements per one technical report; a separate, more recent academic source states over 120 million entities as of its writing, reflecting genuine, documented growth over time. Roughly half of entities have 10 or more factual statements, meaning the *other* half have fewer — completeness is uneven even within Wikidata's own entity population, a directly documented fact, not a marketing claim.
- **FACT (peer-reviewed, directly on point — completeness is a formally studied, uneven property of Wikidata, not a binary presence/absence question):** A dedicated academic literature exists specifically on measuring and modeling Wikidata completeness, including named systems and formal metrics: COOL-WD (a tool for completeness lifecycle tracking), Recoin (a relative-completeness tool using class structure to recommend missing properties), and a formal knowledge-graph-quality framework decomposing "completeness" into four distinct, separately-measurable sub-types: **schema completeness** (are the relevant classes/properties represented at all), **property completeness** (what fraction of values for a given property are missing), **population completeness** (what fraction of all real-world entities of a type are represented at all), and **linkability completeness** (how well interlinked the instances are). This four-way decomposition is directly useful: it means "does a completeness gap exist" is not one question but at least four separable ones, and a brand's absence from Wikidata could reflect *population* incompleteness (the entity was simply never added, unrelated to the brand's own actions) rather than any defect on the brand's part.
- **FACT (peer-reviewed, directly on point — completeness is systematically uneven by language/prominence, a real, measured bias, not a hypothesis):** a dedicated study on multilingual Wikidata coverage found that even among the top 10% most-viewed (most prominent) Wikipedia-linked entities, non-English name/description coverage is significantly lower than English coverage, and the gap widens sharply for less-prominent ("torso" and "tail") entities — for example, coverage of some non-English-language names/descriptions for lower-prominence entities dropping below 15%. This is a directly documented, measured, systematic bias in knowledge-graph completeness by entity prominence and language — meaning a smaller or non-English-market brand's absence or thinness in Wikidata reflects this well-documented systemic pattern, not necessarily anything the brand did or didn't do on its own site.
- **FACT (peer-reviewed, on data quality generally):** because Wikidata is collaboratively and openly edited, its "open curation process leads to a KG evolving dynamically and at various speeds" and "does not guarantee the total (or even partial) completeness of the data" — stated directly by the researchers building completeness-measurement tools for exactly this reason.
- **OBSERVATION, explicitly downgraded (source-quality note applies in full):** the surrounding commercial "Entity SEO" content makes specific, confident claims that directly contradict the brief's own stated caution — e.g., recommending "at least 15 populated properties" as a target with entities meeting that bar supposedly appearing in Knowledge Panels "approximately three times more often... according to research by Search Engine Journal" (an unlinked, unverifiable citation-of-a-citation), and general claims like "AI engines rely on knowledge graphs...making presence in these reference systems crucial." **I am not building detection thresholds or severity logic on these specific numeric claims.** They are exactly the pattern flagged in Finding F-00.

### D. Important mechanisms
The peer-reviewed completeness literature directly supports a specific, important refinement to how this check should work: **absence or thinness of a brand's Wikidata/Wikipedia representation should be classified by *likely cause* before being treated as any kind of finding at all** — is it plausibly *population* incompleteness (a smaller/newer/non-English-market entity that was never added, a well-documented, systemic, brand-independent pattern) versus a case where the brand is clearly notable/prominent by other measures (heavy independent press coverage, clear public company status) yet still has no or a very thin entry (a more genuinely informative signal, though still not something the brand's *own website* can single-handedly fix). This directly operationalizes the brief's "no Wikipedia page ≠ failure" instruction with real evidentiary backing for *why*, rather than simply repeating the rule.

### E. Concrete website signals
This unit is different from most others in Topic F: the primary evidence lives *off-site* (in Wikidata/Wikipedia/Google KG themselves), not on the brand's own website. The on-site signal we can actually check is narrower: does the brand's own site provide a `sameAs` link (or equivalent) to any of these profiles where they exist, and where such a profile exists, is its core identity information (name, category, description) consistent with the site's own self-description (a check that connects directly to Topic P, Cross-Web Consistency).

### F. How the signal could be detected automatically
Deterministic-first, bounded by the 5-minute runtime: (1) check the site's own `sameAs` schema for Wikidata/Wikipedia links; (2) if present, fetch the linked profile (a single bounded request) and do a lightweight consistency check (name, category/type, and — if extractable — one or two key facts) against the site's own self-description; (3) if absent, do **not** treat this as a finding by default — instead, check for independent notability signals already available from other checks in this document (F41–F46's collision-risk search, or Topic H's corroboration evidence) to decide whether absence is worth surfacing as a low-priority, evidence-qualified observation ("no Wikidata presence found; independent notability signals are [weak/moderate/strong], so this [is/is not] likely to reflect a gap worth addressing") rather than a flat pass/fail check.

### G. What evidence the skill should report
Whether a Wikidata/Wikipedia `sameAs` link exists; if so, whether its core facts are consistent with the site's self-description (with specific discrepancies quoted); if absent, the independent-notability context used to decide whether this is worth surfacing at all, explicitly stated so the report doesn't imply more confidence than the evidence supports.

### H. Possible severity logic
- **Medium:** a linked Wikidata/Wikipedia profile exists but contains a **materially inconsistent** core fact (wrong category, outdated description) relative to the site's own self-description — this is a genuine, actionable cross-web consistency issue.
- **Low/Informational only, and only when independent notability signals are already moderate-to-strong:** no linked profile exists despite apparent notability — framed as a proactive suggestion ("consider pursuing Wikidata/Wikipedia representation"), never as a defect, and never generated for small/niche/non-English-market brands where absence is the well-documented, systemic norm.
- **No finding:** no linked profile and no independent notability signal suggesting one would be expected — the large majority case, and the report should say so plainly rather than manufacturing a low-severity finding to have output.

### I. Correct remediation
Where a profile exists with inconsistencies: correct the site's own self-description or pursue updating the external profile (noting the site owner may not control the external profile directly, unlike the Wikipedia/Wikidata-editing recommendations common in the commercial content — this document deliberately avoids prescribing specific external-platform editing tactics given the source-quality concerns noted in §1). Where no profile exists and notability signals are genuinely strong: a measured, low-priority suggestion only.

### J. False-positive cases
This is the unit where the false-positive risk is highest and most explicitly named by the brief itself ("no Wikipedia page = failure" is the brief's own worked example of a forbidden assumption). The peer-reviewed completeness literature directly supports why: population and language-coverage incompleteness in Wikidata/Wikipedia is a documented, systemic, brand-independent pattern, especially for smaller, newer, or non-English-market entities — absence must never be flagged without first checking for independent notability evidence, and even then only as a low-severity proactive suggestion.

### K. False-negative risks
A brand could have a Wikidata/Wikipedia entry that is technically present but so minimal (low property completeness, per the four-way completeness framework in §C) that it provides little real disambiguation value — a simple presence/absence check would miss this; the consistency-check step (comparing whatever facts *are* present against the site) partially mitigates this but cannot fully substitute for a genuine completeness assessment, which is out of scope for a 5-minute site-only audit. Search-engine-specific Knowledge Panel data was assumed available via the documented Google Knowledge Graph Search API (F13–F16), but that API has usage/quota constraints not evaluated in this research pass — the actual feasibility of live-querying it within the runtime budget is a Combine-phase implementation question, not resolved here.

### L. Counterexamples
A genuinely prominent, well-established brand can legitimately have no Wikidata/Wikipedia entry by deliberate choice or simple lack of volunteer editor attention in its specific niche (a well-known but narrowly B2B/industrial company, for instance) — prominence does not guarantee coverage, since Wikidata/Wikipedia coverage depends on volunteer editor interest and notability-guideline judgment calls, not just objective size or importance.

### M. Does this generalize across site types?
The *mechanism and evidentiary caution* generalize universally. The *practical relevance* does not — this check should have a much lower expected finding rate (and lower default severity ceiling) for small/local/niche/non-English-market businesses, per the documented completeness bias, and a correspondingly higher-relevance profile for large, prominent, English-market organizations. This site-type-conditioning should be treated as a first-class part of the check's design, not an afterthought (a direct hook to Soham's Topic V).

### N. Candidate skill(s)
Folds into **`entity-identity-audit`** as the "external knowledge-graph representation" sub-check, with the consistency-check component also directly shared with Topic P (Cross-Web Consistency).

### O. Relationship to other potential skills
Most tightly coupled to Topic P of all the F-units (the consistency-check logic is nearly identical in mechanism to Topic P's general cross-web fact-consistency work, and should likely be implemented once and shared rather than duplicated). Also connects to Topic H (notability/corroboration signals feed the decision of whether absence is worth surfacing at all).

---

## F41–F46 — Cross-domain entity consistency, completeness, disambiguation signals, confidence, collision score (the core disambiguation mechanism)

### A. What we need to understand
This is the central investigation unit of the entire Topic F area: given a brand's name and self-description, can a system distinguish it from any other entity sharing that name — and, if the underlying mechanism fails, what specifically happens? Does it merely fail to find the right answer, or does it produce a confident, specific, *wrong* answer by silently misattributing another entity's facts?

### B. Why it matters for the hackathon
This is the literal mechanism the handout names as a target failure mode (Appendix D: "when several different things share a name, a system can mix them up unless there's something that clearly distinguishes one from the others"). It is also the unit most at risk of manufactured, context-free findings — "add sameAs" is repeated everywhere in the surrounding commercial content regardless of whether the specific brand in question actually has a collision problem, which is structurally identical to the brief's own named forbidden pattern ("no Wikipedia page = failure").

### C. Current evidence
- **FACT (formal task definition, NLP literature, decades-old, not a hackathon-invented concept):** Entity Linking / Named Entity Disambiguation (NED) is a well-defined NLP task — mapping an ambiguous text mention (a "surface form") to a unique entry in a target knowledge base (Wikipedia, Wikidata, or a custom KB). It has dedicated shared tasks and benchmarks going back to at least 2010–2011 (the TAC KBP 2010 track; Hoffart et al.'s 2011 EMNLP paper "Robust Disambiguation of Named Entities in Text," which established the widely-used CoNLL-AIDA/YAGO benchmark still referenced in current entity-linking survey literature).
- **FACT (mechanism, established across the entity-linking literature, consistent across academic sources and independently confirmed by patent-literature implementation details):** Disambiguation systems resolve ambiguous mentions primarily using **surrounding textual context** — co-occurring terms, document topic, and (in cross-document settings) evidence gathered from other pages discussing the same or related entities. This candidate-generation-then-context-based-ranking architecture is described consistently across independent academic sources (the LINDEN framework's "contextual similarity" scoring; general entity-linking glossary/survey descriptions of the pipeline) and is corroborated by real patent-literature system descriptions using "co-occurrence features between the target text and entity description information" as an explicit, claimed mechanism — meaning this is not a single-paper claim but a convergent architectural pattern across multiple independent academic and applied sources.
- **FACT (peer-reviewed, directly on point, the single strongest piece of evidence in this entire document):** Pham, Ngo, Luu & Nguyen, "Who's Who: Large Language Models Meet Knowledge Conflicts in Practice" (VinAI Research / NTU, arXiv 2410.15737). This paper constructs **WhoQA**, a public benchmark of 5,152 gold-standard, human-verified questions (drawn from a larger pool of 76,487 auto-generated candidates) built specifically around **entities that share the same name**, sourced from Wikipedia/Wikidata (145,710 distinct entities across the full auto-generated pool, spanning 13 Wikidata property types). The paper tests 10 LLMs (GPT-3.5-turbo, Llama 3 8B/70B, Mistral 7B, Mixtral 8x7B, Qwen1.5-Chat at multiple sizes, Gemma 1.1 7B, Command R 35B) in a RAG-style setup where the model receives documents from multiple same-named entities and must answer a question about a shared property. Directly quantified findings:
  - **No-conflict baseline:** when only one entity's context is given, all 10 models answer correctly 91.8–98.2% of the time — confirming the underlying single-hop retrieval/reading task is not itself hard; the failure that follows is specifically attributable to name collision, not general task difficulty.
  - **Conflict, undisclosed:** when multiple same-named entities' conflicting contexts are given **without being told a conflict exists**, accuracy collapses unevenly by model, from the 91.8–98.2% baseline down to a range of **9.9% (Qwen1.5-Chat 14B) to 83.8% (Llama 3 70B)** — a large, directly measured, paper-reported collapse, not a modeled estimate.
  - **Worked example, directly illustrating the exact real-world failure mode this unit needs to catch:** given documents about three different people all named "George Washington" (the US President, a Belgian-American inventor, and an American jazz trombonist), a model asked "What is George Washington's occupation?" answered only with the President's occupation, silently ignoring the other two entities' correct, present, retrieved evidence — the paper's own Figure 1 example.
  - **Behavioral bifurcation on failure, explicitly documented per-model:** some models refuse to answer at very high rates when they can't resolve the conflict (Gemma 1.1 7B refuses/hedges 92% of its hard-question set; GPT-3.5-turbo does so 99% of the time, typically by stating there are multiple people with the same name and asking for clarification), while others (e.g., Qwen1.5-Chat 72B, reviewed qualitatively by the authors) **silently pick one answer and present it as if there were no conflict at all** — explicitly flagged by the authors as "more concerning" than refusal, "since it can cause misinformation and bias the users."
  - **Explicit-conflict-notification intervention:** telling the model in the prompt that a conflict may exist substantially improves most models' accuracy (per the paper's third experimental condition), though two of the ten tested models showed minimal additional benefit because they were already attempting to surface all answers regardless of whether told.
  - **A genuinely counterintuitive finding directly relevant to severity-scoring design:** models are, per the paper's own Table 2, generally **less** sensitive to conflicts involving a *larger* number of distinct competing answers than to conflicts with fewer competing answers — meaning a naive "more colliding entities found = higher severity" scoring rule would run directly counter to this measured result.
- **INFERENCE (one logical step removed):** a live production AI-assistant's RAG pipeline is architecturally the same shape as this paper's experimental setup (retrieve documents → LLM reasons over them), per the four-vendor retrieve→rank→generate→cite pipeline independently documented in Topic A. Because WhoQA's conflict-injection setup is a faithful simplification of that same architecture — the authors explicitly designed it to reflect "natural... practical" conflicts, not adversarial constructions, and validated supporting contexts against real Wikipedia text — it is reasonable to infer that **a brand whose name collides with another entity is at elevated, measurably-precedented risk of the same silent-misattribution failure mode** demonstrated in this benchmark. This remains INFERENCE, not a directly observed fact about any specific commercial assistant's full production behavior, since the paper tests open/API-accessible base and instruction-tuned models, not consumer product surfaces with their full undisclosed retrieval-ranking-safety stack (which — per the explicit-notification finding above — could plausibly include conflict-detection mitigations we cannot observe or assume are present).
- **FACT (Google Knowledge Graph API, mechanism-confirming, previously established in F13–F16):** Google's own documented entity-resolution infrastructure is schema.org-native and performs candidate ranking (`resultScore`), architecturally consistent with the general entity-linking pipeline described above.

### D. Important mechanisms
Two compounding mechanisms form one connected diagnosis, not two scattered findings, per the brief's explicit root-cause preference:
1. **Context-insufficiency mechanism:** every documented/academic disambiguation system relies on *context* — co-occurring terms, topic, description — not the mention string alone. If a brand's own page fails to supply strong disambiguating context near its self-identification (industry, location, founding facts, category), it is relying entirely on the *external* web's context to do disambiguation work it could have done itself.
2. **Silent-failure mechanism (the WhoQA finding, the load-bearing evidence for this entire document):** collision risk doesn't just cause "no answer" — it causes a specific, measured, model-dependent risk of **confidently wrong attribution**, strictly worse for a brand than simple invisibility, because the assistant states something false about "the brand" with no visible sign of uncertainty. This reframes disambiguation from a discoverability concern into a **misrepresentation-risk concern**, directly matching one of the hackathon's four named final-objective outcomes ("why it is not understood/cited correctly").

### E. Concrete website signals
- **Collision-risk signal:** does the brand's exact name, searched as a bare string, surface multiple genuinely distinct real-world entities (not just other pages about the same brand) in top web results — and, per F20–F22, what *type* is the competing entity (person/place/organization)?
- **Self-disambiguation signal:** within the brand's own homepage/about-page crawlable text, is there an explicit, early (first ~150 words) statement of industry + primary function + (where relevant) geography — the same category of "context" the entity-linking literature identifies as the actual disambiguating signal?
- **Structural disambiguation signal:** presence of Organization/LocalBusiness/Person schema with `@id` and `sameAs` pointing to profiles that plausibly represent the *same* entity (name and description consistent with the site's own self-description; a `sameAs` link to a mismatched profile is worse than none, per Google's own documented prohibition on markup that misrepresents affiliation).

### F. How the signal could be detected automatically
Hybrid, deterministic-first:
1. Deterministic: extract the brand's self-declared name (title tag, Organization schema `name`, and/or the most repeated capitalized proper noun in the first 200 words of the homepage).
2. Deterministic: issue one bounded web-search query for the exact name string; classify the top-N results' apparent subject (same brand's own domain/subdomains vs. a genuinely different entity, tagged by type per F20–F22) using domain-diversity and simple heuristics. Produces a coarse collision-risk score (none/low/high) — explicitly coarse and time-boxed given the 5-minute budget, not exhaustive disambiguation.
3. Deterministic: parse homepage/about-page text for industry-category + function + geography terms within the first ~150 words (a legitimate deterministic check per the brief's preference for deterministic code on objective checks).
4. Deterministic: check for Organization/Person/LocalBusiness schema and `sameAs`; where feasible within budget, lightweight-fetch one or two `sameAs` targets to sanity-check name/description consistency — otherwise flag as "unable to verify, informational only."
5. Escalate only genuinely ambiguous cases (collision risk is "maybe," or disambiguating text is present but vague) to a single LLM semantic-judgment call — hybrid approach per the brief's explicit guidance.
6. **Severity weighting must explicitly avoid the naive "more colliding entities = worse" rule**, given WhoQA's own counterintuitive finding (§C) that models are *less* sensitive to conflicts with more distinct competing answers — collision-risk severity should be gated primarily on *whether any collision exists at a materially prominent level*, not scaled linearly with count.

### G. What evidence the skill should report
The exact name string tested and the collision-risk classification with the specific competing entity type(s) found; whether/where a disambiguating self-description exists in crawlable text, quoted with location; schema presence/absence and `sameAs` targets found, with a consistency-check result if performed.

### H. Possible severity logic
- **High:** measurable collision risk (a genuinely different, actively-referenced entity shares the name, at any count ≥1 per the counterintuitive-sensitivity finding above) **and** no disambiguating text or markup exists anywhere in crawlable content.
- **Medium:** measurable collision risk with partial disambiguation (markup exists but prose doesn't, or vice versa).
- **Low/Informational:** low collision risk regardless of markup presence — matching the brief's explicit instruction not to treat missing schema as an automatic defect.
- **No finding:** low collision risk and adequate disambiguation — the expected, common, non-noteworthy case for the majority of uniquely-named businesses; the skill should say so rather than manufacturing a low-severity finding.

### I. Correct remediation
Add an explicit, early, plain-language disambiguating statement (industry + function + geography) to the homepage/about page — cheap, fully within site control, and directly targets the literature's actual disambiguation mechanism (context, not markup, is primary; markup is secondary reinforcement). Add or correct Organization/Person schema with accurate `sameAs` links **only** to verified same-entity profiles — a fabricated or mismatched `sameAs` is a documented Google policy violation and actively harmful, not neutral.

### J. False-positive cases
A uniquely-named brand (no plausible collision) should not be flagged for lacking `sameAs`/schema — must gate on measured collision risk first, never flag markup absence alone (per Google's "no required properties" guidance and the brief's "no Wikipedia page ≠ failure" principle). A brand sharing a name with a *much less prominent* entity may have negligible practical collision risk even though a bare search technically returns >1 entity — collision-risk scoring should weight by the competing entity's apparent prominence, not just its bare existence.

### K. False-negative risks
A one-shot, time-boxed collision check is a snapshot; a new same-named competitor could emerge later, or the collision could be locale/language-specific (missed by a single-locale search). WhoQA's own finding that models are *less* sensitive to conflicts with *more* distinct answers (§C) means a low apparent collision count is not necessarily safer than a higher one — this genuinely counterintuitive result should temper any severity model that scales with "number of colliding entities."

### L. Counterexamples
The WhoQA paper's own explicit-conflict-notification intervention shows systems engineered with conflict-detection could plausibly mitigate this risk in ways the base/chat models tested here do not reflect — we cannot assume any specific commercial assistant's production behavior matches the unmitigated tested condition. A well-known brand with strong independent corroboration (heavy third-party coverage, a substantial Wikidata/Wikipedia entry — see F37–F40) may be adequately disambiguated by the wider web even with zero on-page disambiguation effort, a genuine interaction with Topic H/P that should reduce severity, not be treated as an unrelated finding.

### M. Does this generalize across site types?
Yes, strongly — collision risk and self-disambiguation text are computable identically for SaaS, e-commerce, local business, nonprofit, or personal-brand sites. Severity weighting (how much collision risk "matters") should scale with how much the brand's business model depends on being found/cited by name (hook to Topic V), but the underlying check is universal.

### N. Candidate skill(s)
**`entity-identity-audit`** — the primary detection skill for this entire topic, with this unit (F41–F46) as its core, highest-confidence component.

### O. Relationship to other potential skills
Feeds directly into Topic H (corroboration — strong independent corroboration is a mitigating factor for collision risk) and Topic P (cross-web consistency — a mismatched `sameAs` target is itself a cross-web inconsistency). Also directly informs Topic T (Root-Cause Analysis): a downstream "AI misattributed a fact to my brand" symptom should trace back to this check as a candidate root cause before being treated as an isolated content-quality issue.

---

## F47–F50 — Multiple domains representing the same organization; sub-brand relationships; acquisition/merger identity changes; historical entity information

### A. What we need to understand
The most structurally complex unit in Topic F: cases where "the entity" is not one clean node but a small, possibly-changing graph — a company operating multiple distinct domains, a portfolio of sub-brands under one parent, an acquisition or merger that changed which entity owns what, or simply an organization's history containing name/structure changes over time that current visitors and AI systems alike need to correctly place in context.

### B. Why it matters
This is a compounding case built from every mechanism established elsewhere in this document: F41–F46's collision mechanism, F23–F30's aliasing mechanism, and F18–F19's parent/subsidiary mechanism can all be simultaneously in play during and after an acquisition or merger, making this the highest-complexity, and correspondingly most severity-conservative, unit in the topic.

### C. Current evidence
- **FACT (peer-reviewed, directly relevant, previously cited in F23–F30 but centrally important here):** "Insights into Entity Name Evolution on Wikipedia" (arXiv 1702.01172) directly studies how entities' names and represented facts change over time within a major reference source, explicitly identifying name changes as the most severe category of entity evolution for information retrieval — this applies with full force to the merger/acquisition case, which frequently *is* a name-change event (or produces one).
- **FACT (real production engineering acknowledgment, same patent family as F17–F19):** the `connection_type` field explicitly modeled in US 12,182,083/12,380,080 (parent/subsidiary distinction) and the general "entities change dynamically over time" acknowledgment in US 12,169,508 both apply directly to this unit — real entity-resolution engineering explicitly treats organizational-structure change as a distinct, hard, separately-modeled problem, not something resolved by common-sense inference.
- **FACT (peer-reviewed, general knowledge-graph quality literature, previously cited in F37–F40):** the four-way completeness decomposition (schema/property/population/linkability completeness) applies here too — specifically, **linkability completeness** ("the degree to which instances in the dataset are interlinked") is the most directly relevant sub-metric: a post-merger entity graph where the pre-merger and post-merger entities are not linked to each other is a linkability-completeness failure, a formally recognized data-quality problem, not merely an SEO inconvenience.
- **Evidence gap, explicitly flagged, consistent with F17–F22:** no peer-reviewed study was found directly measuring AI-assistant misattribution specifically in live M&A/multi-domain scenarios. This unit's severity ceiling should be scored conservatively, reflecting that its evidence is a well-supported extrapolation from adjacent, better-evidenced mechanisms (name-change severity, parent/subsidiary modeling, linkability completeness) rather than a direct measurement of the compound case itself.

### D. Important mechanisms
This is where all of Topic F's mechanisms compound: a genuine acquisition can simultaneously trigger (a) an aliasing event (F23–F30 — old company name still in use somewhere), (b) a topology change (F18–F19 — the acquired entity becomes a subsidiary), and (c) elevated collision risk if the transaction created ambiguity about which entity "owns" which facts or history (F41–F46). Detecting and connecting all three compounding effects — rather than only checking one — is the direct, practical expression of the brief's "prefer one connected diagnosis over several unrelated findings" instruction, applied within Topic F itself rather than only across topics.

### E. Concrete website signals
Does the site's own content (About/history page, footer, legal text) explicitly and consistently narrate any known structural change (acquisition, merger, multi-domain consolidation) with dates and old/new entity names connected? Are multiple domains that represent the same organization (if detectable, e.g., via matching legal-entity footer text or explicit redirects) cross-linked or explained, rather than presented as unrelated?

### F. How the signal could be detected automatically
Deterministic: check About/history pages and footer/legal text for temporal/structural-change language ("acquired by," "merged with," "formerly," "now part of") co-located with specific old/new entity names and dates; where multiple domains are detected pointing to the same apparent brand (via shared legal-entity name in footers, or explicit cross-links), check whether the relationship between them is ever stated. Escalate to LLM judgment only for genuinely ambiguous cases (e.g., historical language is present but it's unclear whether it fully accounts for a detected name/domain discrepancy).

### G. What evidence the skill should report
Any detected structural-change language and whether it's dated/connects old and new identities explicitly; any detected multi-domain situation and whether the relationship between domains is stated anywhere.

### H. Possible severity logic
- **Medium:** a detectable structural change (via aliasing or multi-domain signals) with no explanatory content anywhere on the current site — compounds the underlying F23–F30/F18–F19 findings rather than being scored as a wholly separate issue.
- **Low:** partial/incomplete explanation (mentioned once, not consistently reinforced).
- **No finding:** either no structural complexity detected, or it is clearly, consistently explained.

### I. Correct remediation
Add a brief, dated, explicit historical statement connecting old and new entity identities/domains ("[Old Name] became [New Name] in [Year]" or "[Domain A] and [Domain B] are both operated by [Company]"); ensure this statement is reinforced with `sameAs`/`alternateName` schema, directly combining the F23–F30 and F13–F16 mechanisms.

### J. False-positive cases
Not every business with multiple domains has an entity-resolution problem — many multi-domain setups are entirely legitimate and well-understood (e.g., country-specific TLDs for the same company, which typically don't need special explanatory content beyond standard hreflang/language handling, a Topic L concern). This check should only fire when a genuine, otherwise-unexplained *identity* discrepancy is detected (different legal names, no cross-linking, no historical narrative), not merely when multiple domains exist for ordinary localization reasons.

### K. False-negative risks
A genuinely significant but quietly-handled acquisition (deliberately minimal public narrative, common in some corporate contexts for legitimate reasons) would not be flagged by this content-presence-based check, since we cannot independently verify corporate history from a public crawl alone.

### L. Counterexamples
Some organizations deliberately do not publicize acquisition/merger history for legitimate reasons (brand consolidation strategy, avoiding customer confusion by minimizing rather than narrating a change) — this is a valid strategic choice, and severity should stay conservative/informational rather than being treated as a hard defect absent other evidence the omission is causing active confusion.

### M. Generalizes?
The underlying mechanism (structural change requires explicit, connected explanation to remain machine-resolvable) generalizes universally, but the *applicability* is gated on a genuine structural-complexity signal being detected first — the large majority of small, single-entity, never-acquired businesses should generate no finding here at all, which is the expected and correct outcome, not an under-detection failure.

### N. Candidate skill(s)
Folds into **`entity-identity-audit`** as the most complex, most-conservatively-scored sub-check, sharing detection infrastructure with F23–F30 (aliasing) and F18–F19 (topology) rather than being built as an independent fourth mechanism.

### O. Relationship to other potential skills
The natural convergence point of nearly every other F-unit — directly composes with F23–F30, F18–F19, and F41–F46 simultaneously, and is the clearest within-topic illustration of the brief's "one connected diagnosis, not several unrelated findings" principle. Also connects to Topic T (Root-Cause Analysis): a misattribution symptom traced to a post-merger identity gap should be labeled distinctly from one traced to plain name collision, since the remediation differs (narrate the history vs. add disambiguating context).

---

## 2. Findings register (structured, per the required format)

---
**FINDING ID:** F-00
**Researcher:** Harsh
**Research Area:** F — Entity Recognition & Entity Resolution
**Research Question:** Meta-finding — is the readily-available "Entity SEO"/"GEO" commercial content ecosystem a reliable evidence source for this research area?
**Observation:** A large, mutually-reinforcing cluster of 2025–2026 SEO/GEO content-marketing sites (spanning general entity-SEO content, and a further specific sub-cluster focused on post-rebrand AI visibility) makes precise, confident, unfootnoted claims about AI-assistant entity-resolution and citation behavior — specific percentages, named "studies" with no retrievable data, invented-sounding internal mechanism names — that do not survive comparison against Google's own developer documentation or the peer-reviewed/preprint academic literature.
**Evidence:** Direct comparison of roughly 15 SEO-content sources across two research passes against Google Search Central's Organization/structured-data documentation (which states no required properties and makes no comparable causal claims); independent confirmation from arXiv 2607.14035 (Martinez, July 2026), a critical survey of the GEO literature, which explicitly documents and rejects the most commonly circulated commercial claim in this space ("GEO increases visibility by 40%") as a misreading of a narrower, conditional lab result.
**Sources:** developers.google.com/search (Organization, structured-data guidelines, sd-policies); arXiv 2607.14035.
**Pattern:** Commercial content in the AI-visibility/"GEO"/"Entity SEO" space systematically overstates the certainty, generality, and mechanism-specificity of claims relative to what the primary/peer-reviewed literature supports — independently confirmed by a dedicated academic critical review of the same literature, arrived at from a completely different angle than this document's own source-by-source skepticism.
**Counterexamples:** Not every source in this ecosystem is unreliable — several accurately represent primary sources (e.g., correctly summarizing the real foundational GEO paper or real vendor documentation); the failure mode is specifically the sites making precise statistical/mechanism claims with no retrievable methodology.
**Hypothesis:** Any skill or research document in this marketplace project that leans on "GEO"/"Entity SEO" best-practices content should independently verify claims against primary sources before encoding them as detection rules, using an explicit evidence-tier framework (e.g., the Evidence Hierarchy in arXiv 2607.14035 Appendix A) rather than trusting confident phrasing as a proxy for reliability.
**Signal:** N/A — meta-methodological finding, not a website signal.
**How to Detect:** N/A.
**Evidence Output:** N/A.
**False Positives:** N/A.
**False Negatives:** Risk that a genuinely reliable claim from this content ecosystem gets under-trusted/discarded due to source-type alone; where possible, claims should be checked against primary sources individually rather than blanket-rejected.
**Severity:** N/A (research-process finding, not a website finding).
**Recommended Fix:** N/A.
**Generalization:** Applies to the whole marketplace's research process, not just Topic F.
**Candidate Skill:** None — process guidance for the team.
**Related Skills:** All — recommend surfacing this note to Pulkit and Soham for their own GEO-literature-adjacent topics.
**Confidence:** HIGH (on the pattern of unreliability); this finding is about source quality, not a substantive website-behavior claim.

---
**FINDING ID:** F-01
**Researcher:** Harsh
**Research Area:** F — Entity Recognition & Entity Resolution
**Research Question:** F41–F46 — does name-collision risk create a measurable, specific misattribution failure mode in LLM/RAG systems, beyond generic "the AI might get confused"?
**Observation:** A peer-reviewed benchmark (WhoQA) built specifically around same-named entities shows large, model-dependent accuracy collapses when conflicting same-name contexts are retrieved together, and — critically — some models fail *silently*, presenting one entity's facts as if there were no conflict, rather than failing visibly.
**Evidence:** Pham, Ngo, Luu & Nguyen, "Who's Who: Large Language Models Meet Knowledge Conflicts in Practice," arXiv 2410.15737 (VinAI Research / NTU). 5,152 gold-standard questions, 10 LLMs tested, accuracy drops from a 91.8–98.2% no-conflict baseline to a 9.9–83.8% range under undisclosed conflict, with explicit per-model rejection-rate data.
**Sources:** See F41–F46 §C.
**Pattern:** Entity name collision is not merely a "the AI might not find you" discoverability risk — it is a documented, measured misattribution-risk mechanism, and the specific behavioral response (silent wrong-answer vs. visible refusal/clarification) varies substantially by model, meaning severity cannot be uniformly assumed across "the AI" as a monolith.
**Counterexamples:** Explicitly telling a model that a conflict exists substantially improves most models' performance in the paper's own third experimental condition — production systems engineered with conflict-detection could plausibly mitigate this risk in ways the base/chat models tested here do not reflect.
**Hypothesis:** A brand's collision-risk score (name distinctiveness × competing-entity prominence), combined with presence/absence of on-page disambiguating context, predicts elevated risk of this specific misattribution failure mode.
**Signal:** Collision-risk classification (bounded search-query analysis of the exact brand name) combined with presence/absence/quality of early, explicit disambiguating prose and structural (`sameAs`/`@id`) markup.
**How to Detect:** Deterministic name-collision search-based classification + deterministic prose/markup extraction, escalating only ambiguous cases to a single LLM semantic check.
**Evidence Output:** Collision-risk classification with competing-entity type; disambiguating-text presence/location; schema presence and `sameAs` consistency-check result.
**False Positives:** Low-prominence same-named entities should not trigger high severity; must gate on measured collision risk, never flag schema/`sameAs` absence alone.
**False Negatives:** One-shot, single-locale collision check may miss geography/language-specific collisions; WhoQA's own finding that models are *less* sensitive to subtler conflicts (fewer competing answers) than to more obvious ones means a low apparent collision count is not guaranteed-safe.
**Severity:** High (measurable collision + no disambiguation) to No-finding (low collision risk, any markup state).
**Recommended Fix:** Add early, explicit, plain-language disambiguating prose (industry + function + geography) plus accurate, verified Organization/Person schema with `sameAs`.
**Generalization:** High — collision-risk computation and disambiguation-text detection are site-type agnostic (though currently English-language-search-tooling dependent in our detection approach, a stated implementation limitation, not a conceptual one).
**Candidate Skill:** `entity-identity-audit`
**Related Skills:** Topic H (corroboration can mitigate collision risk), Topic P (mismatched `sameAs` is a cross-web inconsistency), Topic T (root-cause chain for misattribution symptoms).
**Confidence:** HIGH (the underlying mechanism and its measured effect on tested LLMs) / MEDIUM (whether and how strongly this generalizes to any specific commercial assistant's full production pipeline, which includes undisclosed mitigations we cannot observe).

---
**FINDING ID:** F-02
**Researcher:** Harsh
**Research Area:** F — Entity Recognition & Entity Resolution
**Research Question:** F13–F16/F37–F40 — does structured-data/knowledge-graph completeness have direct, established evidence of driving AI-assistant citation behavior, as widely claimed in commercial "Entity SEO" content?
**Observation:** No primary source (vendor documentation or peer-reviewed/preprint literature) found in this research pass directly establishes a causal or even correlational link between Organization-schema/Wikidata completeness and citation by a conversational AI assistant specifically. Google's own documentation frames structured data as optional, helpful "clues." A rigorous critical survey of the GEO literature explicitly rejects the most widely circulated related commercial claim as a general proposition. Separately, a dedicated peer-reviewed literature on Wikidata completeness shows completeness is uneven and systematically biased by entity prominence and language — directly undercutting the presence/absence framing common in commercial content.
**Evidence:** developers.google.com/search Organization/structured-data documentation; arXiv 2607.14035 Table 5; arXiv 2103.01986, 1908.11153, 1909.01109, 2311.15781, 2003.02320 (Wikidata completeness literature).
**Sources:** See F13–F16, F37–F40 §C.
**Pattern:** Confident, specific commercial claims in this space consistently outrun the certainty the primary evidence supports — independently confirmed both by academic critical review of the GEO literature and by the separate, dedicated academic literature on knowledge-graph completeness.
**Counterexamples:** Google's Knowledge Graph Search API is schema.org-native and does perform entity ranking/scoring, so structured data/KG presence is not *irrelevant* to entity-resolution infrastructure in general — the finding is narrower: a *causal link to conversational-AI-assistant citation specifically* is unevidenced, and *absence* of KG presence is frequently explainable by well-documented, brand-independent completeness bias rather than any site defect.
**Hypothesis:** Structured data and external KG presence should be recommended/checked as redundant, machine-parseable reinforcement of prose-stated disambiguation/aliasing facts, and absence should be evaluated through a "likely cause" lens (population/language bias vs. genuine notability-yet-absent) before being surfaced as any kind of finding — never scored as an independently citation-boosting checklist item in its own right.
**Signal:** N/A as an independent signal — see F41–F46 and F37–F40.
**How to Detect:** N/A independently.
**Evidence Output:** The skill's remediation language should avoid overclaiming schema/KG-presence effects and should frame both as reinforcement/context, consistent with this finding.
**False Positives:** A "schema/KG completeness score" untethered from actual disambiguation/aliasing content or from notability context would itself be a false-positive-generating anti-pattern — explicitly avoided in this design.
**False Negatives:** If structured data or KG presence does turn out to matter more directly for some specific, currently-undisclosed AI-assistant mechanism, a purely prose-based check could miss real markup-specific defects — but that concern belongs to Topic G (schema validity), not Topic F's entity-identity-specific scope.
**Severity:** N/A (evidentiary/methodological finding).
**Recommended Fix:** N/A directly — informs remediation language elsewhere.
**Generalization:** The evidentiary-caution pattern generalizes to how the whole marketplace should treat GEO-adjacent commercial content throughout.
**Candidate Skill:** Informs `entity-identity-audit`'s confidence/remediation language; no standalone skill.
**Related Skills:** Topic G (schema validity, general), Topic S (confidence/evidence-strength fields in report schema).
**Confidence:** HIGH (on the absence of direct evidence for the specific causal claim, and on the documented completeness bias); this is a claim about the state of the evidence, not a claim that structured data or KG presence has zero value.

---

## 3. Required end-of-topic synthesis

**Strongest validated insight:**
Entity-name collision is not a vague "might confuse the AI" worry — it is a specifically measured, peer-reviewed, quantified failure mode (WhoQA, arXiv 2410.15737) with a documented **silent-misattribution** behavior in several tested LLMs that is strictly worse for a brand than simple invisibility, because the assistant states something false about the brand with no visible uncertainty. This is load-bearing evidence for `entity-identity-audit`'s highest-severity finding class (F41–F46), and is a genuinely non-obvious reframing: most teams will think about entity ambiguity as a "will I be found" problem; the real, evidenced risk is closer to a "will I be correctly attributed" problem.

**Strongest unvalidated hypothesis:**
That entity-identity clarity across F17–F50 meaningfully increases the *probability of being cited at all* (as opposed to reducing misattribution risk *given* that the brand and a colliding/related entity are both retrieved). The GEO citation-mechanics literature (Pulkit's Topic A/B territory) has not directly tested entity-identity interventions as a citation-competitiveness lever the way it has tested content-level interventions. This should be flagged clearly in the skill's own documentation as "necessary infrastructure, not a proven citation-boosting lever."

**Strongest candidate skill:**
`entity-identity-audit` — combining collision-risk-gated disambiguation (F41–F46, highest confidence, direct peer-reviewed backing), internal name-consistency/aliasing (F23–F30, fully deterministic, 100% site-controlled, cheap remediation, backed by a second peer-reviewed source on name-change severity), organizational-topology checks (F17–F22, F47–F50, real-world-engineering-backed but with an explicitly flagged direct-evidence gap), external knowledge-graph representation (F37–F40, grounded in a genuinely rigorous completeness literature that actively *prevents* the brief's named forbidden assumption rather than merely disclaiming it), and a basic type-clarity hygiene check (F31) — with severity and remediation logic explicitly designed around the false-positive guardrails established throughout (never flag missing `sameAs`/schema/KG-presence without measured collision risk or genuine notability context; never treat legal-entity-name variance as a defect; never conflate legitimate multi-brand structure with naming inconsistency).

**Weakest assumption we should investigate next:**
Our proposed one-shot, search-query-based "collision risk" classifier (F41–F46) is the least evidence-backed *implementation detail* in this whole document (as opposed to the underlying *mechanism*, which is well-evidenced). WhoQA's own counterintuitive finding — that models are *less* sensitive to conflicts involving *fewer* distinct competing answers — actively cuts against a naive "count the colliding entities, more is worse" scoring approach, and we have no direct evidence on how well a bounded, single-locale, English-language web-search-based collision check approximates the kind of retrieval conflict WhoQA actually measured (which was constructed from a curated Wikipedia/Wikidata entity pool, not open web search). Before finalizing `entity-identity-audit`'s collision-detection thresholds, this should be tested against a small number of known-collision and known-unique real brand names to sanity-check the detector's basic precision.

---

## 4. Cross-references for the Combine & Code phase (flags for Pulkit/Soham)

- **F41–F46 ↔ Topic A20 (Pulkit, Multi-source answer construction):** Pulkit's A20 write-up explicitly identifies "conflicting-fact resolution mechanics" as an evidence gap and hands ownership to Topic H/P. The WhoQA finding in F41–F46 is the direct, evidence-backed answer to *part* of that handoff — specifically the entity-collision-driven version of conflicting sources, as distinct from the freshness-driven or general-multi-source-disagreement version, which remains broader Topic H/P territory. Recommend Pulkit's A20 section reference this finding directly.
- **F-00 (source-quality meta-finding) ↔ Topics A, B, Q, AH (Pulkit/Soham, GEO-literature-heavy topics):** The commercial "GEO"/"Entity SEO" content ecosystem's reliability problem affects any topic drawing on this literature. Recommend adopting the Evidence Hierarchy framework from arXiv 2607.14035 (Appendix A, Levels A–E) as a shared team convention for grading claims across all research documents.
- **F13–F16/F32–F36 ↔ Topic G (mine, Structured Data & Semantic Web):** Explicit boundary drawn — Topic F's `entity-identity-audit` owns entity-identity-specific schema (`Organization`/`Person`/`LocalBusiness` `sameAs`/`@id`/`alternateName`/`parentOrganization`); Topic G owns general schema validity/correctness across all schema.org types independent of entity-identity concerns.
- **F37–F40 ↔ Topic P (mine, Cross-Web Consistency):** The consistency-check logic in F37–F40 (comparing a linked external KG profile's facts against the site's own self-description) is nearly identical in mechanism to Topic P's general cross-web fact-consistency work — recommend implementing once and sharing rather than duplicating in the Combine phase.
- **F18–F19/F47–F50 ↔ Topic S/T (mine, Scoring & Root-Cause):** Organizational-topology and multi-entity/M&A findings are explicitly lower-confidence/lower-severity-ceiling than the core F41–F46 disambiguation findings, per the evidence gaps noted throughout — the severity/confidence schema design in Topic S should represent this evidentiary gradient as a first-class field, not just a single severity number.
