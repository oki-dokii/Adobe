# Topic V — Site-Type Differentiation (V1–V20)
**Researcher:** Soham | **Research Area:** V — Site-Type Differentiation
**Priority:** High

---

## 0. Framing — Topic V's actual position in this research project, and an honest disclosure about its structure

Unlike some of the fine-grained sub-topic lists elsewhere in this project, V1–V20 is not a decomposition of ground already covered by another topic — this is genuinely my own primary territory. But I want to be equally honest about a different risk: **twenty named site types is not twenty independent audit problems.** When I actually work through the mechanisms (Section 2 onward) and then stress-test them against real, live sites (Section 3's empirical findings — this is the one part of this document backed by direct experiment, not just literature and reasoning), the twenty categories collapse into **six underlying differentiation mechanisms**, each shared by several named types, plus **one item (V20, multilingual) that turns out not to be a peer category at all** — it's an orthogonal axis that combines with any of the other nineteen, not a nineteen-plus-one list.

This mirrors a pattern already surfaced elsewhere in this project (a small number of genuine mechanisms, a longer list of *where they apply*), and I'd rather disclose that plainly than manufacture twenty separately-argued A–O sections that mostly restate the same point with a different vertical's name attached.

What *is* new and load-bearing in this document:
- The six-cluster mechanism map (Section 2), which is the actual reusable classification logic.
- Two **empirical findings** from live sites (Section 3, V-01 and V-02) that directly falsified part of my own original hypothesis about how site-type hybridity shows up in practice — I'm keeping the correction visible rather than quietly fixing it, since the correction itself is the more useful research output.
- The universal/conditional/never-fire check catalog (Section 4), which is the artifact the rest of the marketplace actually needs to consume.

---

## 1. Legend
**FACT** / **OBSERVATION** / **HYPOTHESIS** / **INFERENCE** / **SPECULATION**

---

## 2. Cluster map — V1–V20 collapsed to six mechanisms (+ one orthogonal axis)

| Site type | Cluster | Why it groups here |
|---|---|---|
| V16 Financial services, V17 Health, V18 Legal, V19 Highly regulated | **A — YMYL-strict** | Liability/regulatory exposure drives mandatory disclosure content and legitimizes hedged answers |
| V10 Local business, V11 Marketplaces, V12 Directories, V8 Nonprofits | **B — Multi-entity / thin-content-is-correct** | Corroboration channel is domain-specific (not press/backlinks); brevity is often the correct format, not a defect |
| V7 Universities, V9 Government | **C — Institutional / decentralized entities** | Organizational (not personal) voice is correct; commercial/affiliated activity is frequently held off-domain by design |
| V5 Documentation, V6 Developer portals | **D — Reference / task-oriented technical** | Freshness = version-currency, not calendar date; success = task completion, not conversion; frequently off the parent marketing domain entirely |
| V3 News, V4 Blogs, V13 Media, V14 Portfolio, V15 Personal | **E — Authorship/cadence spectrum** | Author-formality and corroboration expectations scale continuously with topic sensitivity and publishing cadence, not as five discrete boxes |
| V1 SaaS, V2 Ecommerce | **F — Commercial/transactional** | Both need extractable price/offer data; differ mainly on whether gating price behind sales is a legitimate norm (SaaS) or a red flag (ecommerce) |
| V20 Multilingual | **G — orthogonal axis, not a peer category** | Combines with any of A–F; a site is never *only* "multilingual" the way it can be *only* "a directory" |

---

## Cluster A — YMYL-strict verticals
**Covers:** V16 (financial services), V17 (health), V18 (legal), V19 (highly regulated industries)

### A. What we need to understand
Whether these four named verticals actually require four separate check sets, or one shared "regulatory/liability-driven trust" mechanism with vertical-specific disclosure content as the only real variable.

### B. Why it matters
This is the cluster where getting the false-positive/false-negative balance wrong is most consequential — under-checking here means missing genuinely high-harm-potential content gaps (no medical reviewer on health claims); over-checking with the wrong generic rubric actively penalizes the one behavior that's *correct* in this cluster (hedged, jurisdiction-dependent answers).

### C. Current evidence

**FACT** — Google's Search Quality Rater Guidelines formally name YMYL ("Your Money or Your Life": health, finance, legal, safety) as a distinct category requiring a stricter trust bar than general content; industry summaries of the guidelines describe the strict version of quality standards as reserved for YMYL topics, where weak information could cause real harm, while non-YMYL content is held to a more moderate bar.

**FACT** — The same framework treats authoritativeness as reputation *beyond the page itself*: raters are trained to weigh the site's and author's broader web presence, not just on-page content, and this is explicitly a site-wide, not merely page-level, assessment.

**INFERENCE** — Because the trust bar is explicitly elevated for this cluster and explicitly not elevated elsewhere, a flat rubric applied everywhere either under-serves YMYL content (misses genuinely required checks) or over-serves everything else (imposes YMYL-grade credential/disclosure expectations on a hobby blog). This is the single clearest, most externally-grounded argument for why Topic V needs to exist as a gating layer rather than being folded into a generic content-quality skill.

**INFERENCE** — The four named verticals differ mainly in *which* disclosure is mandatory (medical-reviewer/clinical-source citation for health; advisor licensing/rate disclosure for finance; jurisdiction and bar-license visibility for legal; industry-specific compliance language for the broader "highly regulated" bucket) but share one structural pattern: **a required disclosure element is a compliance/trust signal, not a stylistic nicety**, and its absence should be treated categorically differently from, say, a missing meta description.

### D. Important mechanisms
The unifying insight: in this cluster, **hedging is the correct answer, not a defect.** A legal or medical page that says "this depends on your jurisdiction" or "consult a licensed provider" is behaving exactly as it should; a generic "is this answer clear and decisive" check would score that page down for the same property that makes it trustworthy. This is the cluster's single highest-value never-fire rule.

### E. Concrete website signals
Topic/keyword classification into health/finance/legal/regulated-industry categories; presence/absence of a named, credentialed author or reviewer on topic-matched pages; presence/absence of jurisdiction or licensing disclosure language; presence of an "as of [date]" anchor near rate/regulatory figures (rates and regulatory terms are a high-severity staleness category here — a stale interest rate or drug-interaction warning is actively harmful, unlike a stale blog post).

### F. How the signal could be detected automatically
Deterministic keyword/topic classification for cluster membership (cheap, high-confidence for clearly-YMYL content); LLM escalation only for the genuinely judgment-requiring question of whether a given hedge is *appropriately* scoped versus evasive filler — this should reuse whatever hedge/qualification-detection infrastructure exists elsewhere in the marketplace rather than building a parallel one.

### G. What evidence the skill should report
The specific missing disclosure element (named, not "trust signals missing"), the specific stale rate/regulatory figure with its age, and — critically — an explicit note when a hedge was evaluated and found *appropriate* so the report doesn't silently look incomplete about why nothing fired there.

### H. Possible severity logic
High severity for missing mandatory disclosures or stale regulatory/rate figures on YMYL-classified pages; this severity tier should not be reachable at all on non-YMYL-classified content — i.e., cluster membership should gate the severity ceiling, not just adjust a score.

### I. Correct remediation
Add the specific missing disclosure type; add explicit "as of [date]" anchoring to rate/regulatory claims; add named, credentialed reviewer attribution where topic sensitivity warrants it.

### J. False-positive cases
Flagging a hedged, "it depends"/"consult a professional" answer as unclear or unhelpful — this is the canonical false positive for this entire cluster. Flagging casual tone as untrustworthy on a personal-finance blog that isn't actually giving individualized advice.

### K. False-negative risks
A generic checklist run without cluster classification would simply never look for medical-reviewer attribution, jurisdiction disclosure, or advisor licensing at all — these aren't checks a size-fits-all rubric would think to include, so the failure mode is silent omission, not a wrong verdict.

### L. Counterexamples
A finance *news* article (V3 territory) reporting on a rate change doesn't need the same advisor-licensing disclosure as a finance-services page recommending a specific product — cluster membership should be assessed per-page/per-template, not per-domain, since a single site can carry both.

### M. Generalizes?
Yes — the mechanism (regulatory exposure → mandatory disclosure + legitimate hedging) is domain-agnostic; only the specific disclosure vocabulary changes per vertical.

### N. Candidate skill(s)
Not a new skill on its own — this cluster is the strongest argument for the `site-type-classifier` utility skill (Section 4) having a **YMYL flag** as a first-class output field, consumed by whatever skill handles content-quality/trust checks, gating both what fires and how severely.

### O. Relationship to other skills
Directly gates severity for content-quality/trust-and-authority checks (Harsh's H) and for freshness checks (Pulkit's I, where YMYL content needs a much shorter staleness tolerance than a lifestyle blog); feeds `false-positive-suppression` (my own topic U) the specific "hedging is correct here" rule.

---

## Cluster B — Multi-entity / thin-content-is-correct types
**Covers:** V10 (local business), V11 (marketplaces), V12 (directories), V8 (nonprofits)

### A. What we need to understand
Whether "few backlinks," "thin content," and "many distinct sub-entities under one domain" are defects or the correct, expected shape of these site types — and if the latter, what the *actual* corroboration/trust channel is for each, since it clearly isn't the press-and-backlinks model that a generic checklist assumes.

### B. Why it matters
This cluster contains the single most-cited canonical false positive in the whole project brief ("no backlink = failure," "short content = bad") — and it's not a hypothetical; each of these four types has a *specific, different, legitimate* trust channel that a backlink-centric check would simply never look for.

### C. Current evidence

**INFERENCE** — For local businesses, the practical discovery/trust channel is NAP (name/address/phone) consistency across map/directory platforms, not editorial press coverage — a small business can be entirely legitimate and well-trusted with zero press mentions and a handful of consistent directory listings. This makes NAP consistency the local-business analogue of what backlinks are elsewhere.

**FACT (confirmed via multiple independent local-SEO practitioner sources)** — NAP consistency is treated as a first-class, well-established ranking/trust signal across the local-search industry, checked specifically across a business's own website, Google Business Profile, and directories like Yelp/Healthgrades; sources converge on a specific, useful, granular detail — even minor formatting differences ("St." vs. "Street") are treated as inconsistencies worth fixing, not just outright wrong data. This is directly useful for detection design: exact-string matching would produce false positives on cosmetically different but substantively identical addresses, so the check needs address normalization, not literal string equality.

**FACT (confirmed via multiple independent sources, with concrete technical specifics)** — For nonprofits, the third-party validator channel (GuideStar/Candid, Charity Navigator) is not just a conceptual "look for a mention" check — these organizations provide literal embeddable trust-seal widgets served from a fixed, recognizable URL pattern (e.g., `widgets.guidestar.org/prod/v1/pdp/transparency-seal/[org-id]`), and named real nonprofits (Maya's Hope, Panthera, The Hunger Project) were independently confirmed displaying these seals in their site footers. This means the check is **deterministic and cheap** — a DOM scan for an `<img>`/`<iframe>` referencing a known widget-host domain pattern — not a fuzzy "does this page mention trustworthy-sounding organizations" judgment call.

**FACT (confirmed via Yelp's own documented listing structure)** — Directory/marketplace listing brevity is not an accident of lazy content — Yelp's own business-description field is explicitly capped at 1,500 characters and is deliberately positioned below the reviews section, not above it, reflecting a considered design choice that reviews (not the business's own copy) are the primary trust signal on a directory-type page. This directly and concretely confirms that penalizing short per-entry copy on this site type is checking against the platform's own intentional design, not a defect.

**INFERENCE** — For nonprofits, the analogous channel is third-party charity validators (e.g., GuideStar/Charity Navorator-style listings), not commercial backlinks — a small, legitimate nonprofit's backlink profile is often thin by nature of its size and doesn't indicate illegitimacy.

**INFERENCE** — For directories and marketplaces, brevity is the *product*, not a shortfall — a directory's value proposition is link density and categorization, not long-form content, and penalizing this is checking the wrong thing entirely (this is explicitly named in the project brief's own false-positive list, and it's the cleanest, least ambiguous case in this whole document).

**INFERENCE** — Marketplaces and directories both introduce a distinct kind of entity-resolution problem that's the *inverse* of the usual one: instead of one entity being ambiguous across the web, one domain here legitimately hosts *many* distinct entities (sellers, listings, member businesses), and the platform itself is not "the expert" the way a single-brand site would be — E-E-A-T-style, single-author-credential checks are close to meaningless applied to the platform level here; they'd need to apply per-listing instead, which is a different and much more expensive check.

### D. Important mechanisms
The unifying insight: each of these four types has swapped the *default* corroboration channel (press/backlinks) for a *domain-specific* one, and a check that only knows about the default channel will read every one of them as under-corroborated — a systematic false-positive pattern, not a random one.

### E. Concrete website signals
`LocalBusiness` schema + address/phone presence, checked with **normalized** (not literal-string) matching against known directory-listing formats (V10); presence of a Candid/GuideStar or Charity Navigator embeddable seal widget, detectable via a known widget-host URL pattern in an `<img>`/`<iframe>` src, rather than a generic "mentions a charity validator" text search (V8); high outbound-link density with short per-entry copy as a *positive* pattern rather than negative, consistent with Yelp's own capped-length, reviews-first listing design (V12); count of distinct seller/vendor entities per domain as a marketplace-classification signal (V11).

### F. How the signal could be detected automatically
Mostly deterministic, and more concretely so after pressure-testing than the original draft assumed: NAP matching needs address/phone **normalization** (stripping punctuation, expanding abbreviations like "St."→"Street") before comparison, not exact-string equality, to avoid false positives on cosmetically different but identical addresses; third-party validator detection is a simple, cheap DOM/URL-pattern scan for known widget-host domains (`widgets.guidestar.org`, `charitynavigator.org` badge embeds), not an LLM-judgment call; outbound-link-density and per-entry length are directly measurable ratios. The one genuinely judgment-requiring step remains distinguishing "thin because that's the product" (directory) from "thin because the content is actually missing" (a would-be detail page with no detail) — this needs the site-type classification to run *first* so the thin-content check knows which interpretation applies before it even runs.

### G. What evidence the skill should report
For local business: which directories/platforms show consistent vs. inconsistent NAP data. For nonprofits: presence/absence of third-party validator linkage. For directories/marketplaces: explicitly state when thin content was evaluated and found *appropriate*, for the same "silently looks incomplete" reason as Cluster A.

### H. Possible severity logic
NAP inconsistency for local business should carry meaningfully higher severity than the generic "few backlinks" finding would elsewhere, since it's this cluster's primary trust signal, not a secondary one. "Backlink/press" checks should be suppressed entirely (not just down-weighted) for all four types in this cluster.

### I. Correct remediation
Local business: reconcile NAP data across the platforms it's actually listed on. Nonprofit: pursue/verify third-party charity-validator listing. Directory/marketplace: no remediation needed for brevity itself; remediation should target outbound-link accuracy/freshness instead, which is the metric that actually reflects this type's value proposition.

### J. False-positive cases
This entire cluster *is* the false-positive case list — "thin content = bad," "no backlinks = invisible," "few press mentions = untrustworthy" should never fire as-is on any of these four types.

### K. False-negative risks
A generic checklist would also miss the things that *should* fire here: NAP inconsistency, absent charity-validator linkage, dead outbound links on a directory — these are real defects specific to this cluster that a backlink/press-centric rubric wouldn't think to check at all.

### L. Counterexamples
A large national nonprofit (e.g., a major hospital-system-affiliated charity) *should* have substantial press coverage, and its absence there would be a legitimate signal — the "backlinks don't matter" rule should scale down, not disappear entirely, with organization size/scope; this needs to be a soft prior informed by scale signals (donation volume mentioned, staff count, multi-location presence), not an absolute rule.

### M. Generalizes?
Yes, well — every real economy has small local businesses, small nonprofits, and directories/marketplaces of wildly varying scale; the mechanism (swap the corroboration channel, don't assume its absence means invisibility) applies regardless of geography or vertical.

### N. Candidate skill(s)
No new skill — this cluster's output is a **corroboration-channel lookup table** (which channel matters per type) that should be handed to whatever skill in the marketplace evaluates cross-web trust/corroboration (Harsh's H/P topics), the same way Topic E handed its qualifying-context taxonomy to A16/F2 as configuration data rather than building a new mechanism.

### O. Relationship to other skills
Directly reconfigures Harsh's H (Trust/Authority/Corroboration) and P (Cross-Web Consistency) checks per cluster; feeds `false-positive-suppression` (U) the specific suppression rules above.

---

## Cluster C — Institutional / decentralized entities
**Covers:** V7 (universities), V9 (government)

### A. What we need to understand
Whether commercial or semi-commercial activity associated with an institution (a university bookstore, a government-adjacent service) shows up as a same-domain hybrid-classification problem, or somewhere else entirely — this is the cluster where I ran an actual live test rather than reasoning from first principles, and the result changed my original hypothesis (see Section 3, V-02).

### B. Why it matters
Institutional sites are large, decentralized, and often have commercial-looking activity somewhere in their orbit — if the classifier's model of "where hybridity shows up" is wrong, every downstream conditional check built on top of it inherits that error silently.

### C. Current evidence

**OBSERVATION (from live-site testing, see V-02 below)** — Harvard's bookstore operation is not hosted on `harvard.edu` at all; it is run by a legally separate entity (the Harvard Cooperative Society, operationally managed by a publicly traded company, Barnes & Noble Education) on an entirely different domain, and it serves both Harvard and MIT jointly. A follow-up pass tested seven more institutions spanning community colleges to mid-size private universities and found the **same pattern at every one of them**, each outsourced to one of a small number of recurring named vendors (Follett Higher Education, Barnes & Noble College, eCampus.com, University Gear Shop). This directly falsifies the naive version of my original hypothesis that university e-commerce hybridity would show up as a same-domain subpath, and does so with enough breadth to treat it as a general U.S.-higher-ed pattern, not an elite-institution quirk.

**FACT** — Outsourcing campus retail/textbook operations to one of a small set of named third-party operators is a recognized, standard commercial arrangement in U.S. higher education, not an inference on our part at this point — the same handful of vendor names recur by name across independent institutions of very different size and prestige.

**INFERENCE** — Institutions deliberately keep commercial/liability-bearing activity off their primary institutional domain, likely for governance, branding-control, and vendor-outsourcing reasons — this means "does the `.edu`/`.gov` domain also sell things" is a **false-negative trap** across the size range tested, which could be mistaken for "this check found nothing" rather than "this check is looking in the wrong place." The real risk this cluster should check is **entity-affiliation resolution**: is an off-domain commercial/service entity that claims institutional affiliation *actually* correctly and consistently linked back to by the institution's own site, distinguishing a legitimate affiliate from an unaffiliated or impersonating operator?

**INFERENCE** — Decentralization is also the source of this cluster's other named risk: many independently-run sub-unit pages (departments, faculty, agencies) under one domain create genuine internal entity-ambiguity (which "Center for X" page is authoritative, is a listed faculty member still there) without this being a design flaw — a naive "template consistency" check would misread organizationally-real decentralization as a bug.

### D. Important mechanisms
The unifying insight: in this cluster, **organizational (not personal, not commercial) voice is the correct default**, and the interesting risk isn't hybridity-on-domain, it's **affiliation resolution across a domain boundary** the institution has deliberately drawn.

### E. Concrete website signals
`.edu`/`.gov` TLD plus multiple distinct sub-organization sections; presence/absence of consistent cross-linking between the institutional domain and any off-domain entities it names as affiliated (e.g., does harvard.edu's own pages consistently and correctly link to `thecoop.com` as the official bookstore, versus an unrelated page just mentioning "the Coop" with no verifiable link); staleness of faculty/staff listings (a well-documented, common failure mode independent of the affiliation question).

### F. How the signal could be detected automatically
Deterministic: TLD + subdomain/section enumeration, outbound-link harvesting to check for consistent affiliation-linking. LLM escalation only where an off-domain entity's affiliation claim needs semantic verification (does the language on the affiliated site actually and clearly state the relationship, versus implying it ambiguously).

### G. What evidence the skill should report
The specific off-domain entity, whether the institutional site links to it consistently, and whether the affiliation is stated clearly on both sides — not a generic "hybrid site type detected" note, which would understate what's actually being checked.

### H. Possible severity logic
Low severity (informational) for internal sub-unit template inconsistency, since this is often organizationally legitimate; higher severity for an *unclear or missing* affiliation link where an off-domain entity is plausibly capitalizing on the institution's name without a clear, mutual, verifiable connection.

### I. Correct remediation
Not "consolidate the sub-units" (often not the institution's to fix, and not actually a defect) — instead, ensure any named affiliated off-domain entity is clearly and mutually linked, and ensure faculty/staff directory pages carry visible last-verified dates.

### J. False-positive cases
Flagging decentralized, inconsistent department-page design as a "template bug" is a false positive — the correct interpretation is usually organizational reality, not neglect. Flagging the *absence* of e-commerce on the institutional domain as suspicious or as a missed monetization opportunity is also wrong — it's frequently the deliberately correct architecture.

### K. False-negative risks
A check that never looks past the institution's own domain will never find the off-domain affiliate-entity risk at all — this is exactly the failure mode my original V7 hypothesis would have caused if left uncorrected.

### L. Counterexamples
None found across the eight U.S. higher-ed institutions tested (spanning elite-private to community-college scale) — a genuinely tested finding rather than a residual hedge. The untested edges are different in kind, not degree: non-U.S. institutions (where the third-party campus-retail vendor market this pattern depends on may not exist) and V9 (government), which was not re-tested this pass.

### M. Generalizes?
Yes, within U.S. higher education — now evidenced across eight independent institutions spanning the full size/prestige range, not one elite outlier, which is a meaningfully stronger generalization claim than the prior pass. The broader mechanism (institutions may draw entity boundaries via separate domains, not separate site sections) plausibly extends to other large, multi-entity organizations (a university health system, a large nonprofit's foundation arm) and to V9, but that extension remains untested.

### N. Candidate skill(s)
No new skill — this is a correction to the `site-type-classifier`'s design (Section 4) plus a specific input to Harsh's entity-resolution skill (F), which is genuinely a better home for "verify off-domain affiliate claims" than a Topic-V-owned check would be.

### O. Relationship to other skills
Directly informs Harsh's F (Entity Recognition & Entity Resolution) — this finding is arguably more an F-topic item than a V-topic item, and should be explicitly flagged to Harsh at merge time rather than silently built twice.

---

## Cluster D — Reference / task-oriented technical content
**Covers:** V5 (documentation), V6 (developer portals)

### A. What we need to understand
Whether documentation content genuinely needs a different check set than marketing/blog content on the same brand, and — parallel to Cluster C — whether that difference shows up as a same-domain subpath or somewhere else (again tested live, see V-01).

### B. Why it matters
Docs/dev-portal content is exactly the kind of content most likely to be directly quoted/cited by an AI assistant answering a "how do I..." question, and it fails differently than marketing content does (version drift, not stale marketing copy).

### C. Current evidence

**OBSERVATION (from live-site testing, see V-01 below)** — Stripe's documentation lives on `docs.stripe.com`, a fully separate subdomain from `stripe.com`, and Stripe's broader footprint spans several more separately-hosted properties beyond that (a developer blog on a different top-level domain, a publishing imprint on another subdomain, an independent-feeling online magazine on a third-party-looking domain that is nonetheless Stripe-owned). A follow-up test on Linear, a smaller and more product-focused SaaS company, found the opposite: its docs live at the plain same-domain path `linear.app/docs`, with no evidence of subdomain or cross-TLD sprawl. **The finding is now that this pattern is not fixed** — it appears to scale with company age/size rather than being a universal SaaS convention, and the classifier needs to check for both, not assume either as a default.

**INFERENCE** — Because of this, a classifier that only crawls the seed domain will completely miss that the audited brand includes several other properties requiring independent, per-property classification — the practical fix is a domain-family discovery step (harvesting footer/nav links to first-party-affiliated properties) that runs *before* any V-type label is assigned, not an assumption that one domain equals one site type.

**INFERENCE** — Freshness on this cluster means something categorically different from Cluster A/E's calendar-date freshness: a docs page can be "fresh" by publish date but wrong if it doesn't match the current product version — version-currency, not elapsed time, is the correct staleness metric here, and this should be handed to Pulkit's freshness topic (I) as a cluster-specific override rather than reusing the calendar-based default.

### D. Important mechanisms
The unifying insight: this cluster's "engagement success" metric is task completion (did the visitor find the right endpoint/parameter), not conversion — and its content-density norm inverts the usual "longer is more complete" heuristic, since a correct, minimal code sample is better than a padded one.

### E. Concrete website signals
`/docs/` path or dedicated docs subdomain; versioned URL segments (`/v2/`, `/latest/`); presence of an OpenAPI/Swagger spec or `llms.txt`; code-block density; changelog/deprecation-notice presence.

### F. How the signal could be detected automatically
Deterministic: subdomain/path pattern matching, version-string extraction from URLs and page content, sitemap cross-referencing to confirm a discovered subdomain belongs to the same organization (via shared branding/schema `sameAs` links, not just naming similarity, to avoid falsely absorbing an unrelated third-party site).

### G. What evidence the skill should report
Which version a given doc page claims to describe versus the current product version (where determinable), and which discovered domains/subdomains were included in the audit's scope and on what basis (so the report is auditable about what it did and didn't cover).

### H. Possible severity logic
Version-mismatch findings should scale with how central the outdated instruction is (a deprecated top-level method still shown as current is higher severity than a stale screenshot).

### I. Correct remediation
Update version-tagging and deprecation notices; ensure code samples are tested against the current API version, not just visually "recent."

### J. False-positive cases
Flagging docs pages for having no author byline, no schema.org `Article` markup, or no publish date — none of these are meaningful defects by the conventions of this content type.

### K. False-negative risks
If domain-family discovery isn't run, the entire docs/dev-portal surface could be missed altogether when auditing a company whose docs live off the seed domain — not a wrong verdict, but no verdict at all, which is arguably worse for a rubric that rewards detection coverage.

### L. Counterexamples
Confirmed, not hypothetical: Linear keeps its docs under `linear.app/docs` on the main marketing domain rather than a separate subdomain — the classifier must check both patterns, not assume the subdomain pattern always applies (directly parallel to Cluster C's L, and now similarly evidenced rather than merely predicted).

### M. Generalizes?
The *mechanism* (docs location varies and must be discovered, not assumed) generalizes well and is now demonstrated in both directions on two real companies. The *specific* subdomain-sprawl pattern is not universal — it appears more common at larger, longer-established companies (Stripe) than at smaller, more product-focused ones (Linear), though two data points is a starting signal, not a validated size threshold.

### N. Candidate skill(s)
The domain-family discovery step belongs in the `site-type-classifier` utility skill itself (Section 4) as a mandatory first pass, not a separate skill; the version-currency freshness override is configuration data handed to Pulkit's freshness skill (I).

### O. Relationship to other skills
Feeds Pulkit's I (Freshness) a cluster-specific staleness definition; feeds the entrypoint orchestrator (Z) the requirement that crawl scope be determined by domain-family discovery, not a single seed URL.

---

## Cluster E — Authorship / cadence spectrum
**Covers:** V3 (news), V4 (blogs), V13 (media), V14 (portfolio), V15 (personal)

### A. What we need to understand
Whether these five named types are genuinely discrete categories or points on one continuous spectrum (formality of authorship × publishing cadence × stakes of the topic), and what that means for building five separate rule sets versus one scaled rule.

### B. Why it matters
Treating these as five hard-boundaried categories risks brittle misclassification at the boundaries (is a well-known independent journalist's Substack a "blog" or "news"?); treating them as a spectrum with topic-sensitivity as the scaling variable is more robust and reuses Cluster A's logic instead of duplicating it.

### C. Current evidence

**INFERENCE** — Author-credential rigor should scale with topic sensitivity (as established in Cluster A) more than with which of these five labels applies — a personal blog writing about a YMYL-adjacent topic (a personal finance blogger giving specific investment guidance) should be held closer to Cluster A's bar than a personal blog about hobbies, regardless of "blog" vs. "news" labeling.

**INFERENCE** — Corroboration-across-outlets is *expected by design* for news (syndication and quotation are normal, not duplicate-content red flags) but not expected at all for personal sites or portfolios, where the absence of external corroboration is simply normal for an individual's own site.

**INFERENCE** — V13 (media/video-audio-heavy sites) introduces a genuinely distinct axis within this cluster, not just a cadence/formality point: the core facts may be **locked in non-text form** — this is the appendix's background concept C (machines read explicit text more reliably than implied or non-textual content) applied concretely, and the check that matters here is transcript/caption presence, which is unrelated to the authorship-formality question the rest of this cluster is organized around.

**INFERENCE** — V14/V15 (portfolio/personal) share the property that heavy, image-first design is common and legitimate, and elaborate trust infrastructure (multi-author editorial policy, credential pages) is simply inapplicable at this scale — not a gap to fill in, a mismatch of expectations.

### D. Important mechanisms
The unifying insight: this cluster is better modeled as **two independent scaling variables** (topic sensitivity, and text-vs-non-text fact carriage) than as five discrete boxes — a site could be simultaneously "personal" in formality and "YMYL-adjacent" in topic sensitivity, and the check logic should combine both variables rather than picking one label.

### E. Concrete website signals
Author byline presence/consistency (formality axis); `NewsArticle`/`BlogPosting`/`Article` schema and publish cadence (type signal, not a hard boundary); transcript/caption presence on video/audio-heavy pages (V13's distinct axis); topic classification reused directly from Cluster A's keyword/topic model (sensitivity axis).

### F. How the signal could be detected automatically
Deterministic for cadence/schema/transcript-presence signals; the topic-sensitivity classification reuses Cluster A's infrastructure rather than being rebuilt here.

### G. What evidence the skill should report
Where a sensitivity-scaled check fired, state explicitly which sensitivity level triggered which bar (so a personal blog isn't shown a raw "missing credentials" finding without the topic-sensitivity context that justifies it).

### H. Possible severity logic
Severity scales continuously with the topic-sensitivity variable, not with a discrete site-type label — this is a direct extension of Cluster A's severity gating, applied here as a dial rather than a switch.

### I. Correct remediation
Add transcript/captions where facts are carried only in video/audio (V13); add credential context only where topic sensitivity actually warrants it, not uniformly.

### J. False-positive cases
Flagging duplicate/syndicated content on a news site as a red flag; flagging a portfolio site for lacking organizational trust infrastructure it was never going to need; flagging a low-stakes personal blog for the same credential bar as a personal-finance-advice blog.

### K. False-negative risks
Treating "blog" as a single low-scrutiny bucket would miss the case where a nominally personal blog is actually giving specific, consequential advice and should be scaled up via the sensitivity axis.

### L. Counterexamples
A well-established independent journalist's newsletter can legitimately look like a "blog" by hosting/cadence signals while functioning at a "news" standard of sourcing — this is exactly why type-label boundaries are less reliable here than the two-variable model above.

### M. Generalizes?
Yes — the two-variable model (sensitivity × text/non-text fact carriage) is more portable across unseen sites than five hard-coded category boundaries would be, which is itself a generalization argument for preferring it.

### N. Candidate skill(s)
No new skill — reuses Cluster A's sensitivity classifier as a shared input; V13's transcript/caption check is a small, deterministic addition that could live in whatever skill already handles machine-readability of non-text content (Harsh's D-adjacent territory, per the appendix's background concept C).

### O. Relationship to other skills
Shares infrastructure with Cluster A (sensitivity scaling) and connects to Harsh's D (Machine Readability/Rendering) for the transcript/caption check specifically.

---

## Cluster F — Commercial/transactional
**Covers:** V1 (SaaS), V2 (ecommerce)

### A. What we need to understand
Whether SaaS and ecommerce need genuinely different price/offer checks, or the same check with a different norm for what "acceptable" looks like.

### B. Why it matters
This is the cluster most directly connected to the handout's own worked example (JS-only pricing → AI lacks pricing evidence → third-party source fills the gap → user expectation mismatch), and it's also where "pricing not shown" is most likely to be wrongly flagged as an automatic negative.

### C. Current evidence

**INFERENCE** — Both types need extractable price/offer data in plain text (the shared mechanism), but the *norm* for what counts as a gap differs: ecommerce hiding a product's price behind JS or requiring login is a clear defect; enterprise/mid-market SaaS gating pricing behind a "contact sales" flow is a legitimate, common business model, not a defect, and should not be flagged the same way.

**INFERENCE** — Price/offer *freshness* is high-severity for ecommerce specifically (a stale price is actively misleading a purchase decision) in a way that doesn't apply the same way to SaaS's often-simpler, less-frequently-changing tiered pricing.

### D. Important mechanisms
The unifying insight: "is pricing extractable" is one check; "is the absence of a number a defect" is a separate judgment that depends on the gating norm for the specific commercial model, and conflating them produces the exact false positive the handout explicitly warns against.

### E. Concrete website signals
`Product`+`Offer` schema and price/currency tokens (ecommerce); pricing-page presence with either explicit tiers or an explicit "contact sales" pattern (SaaS); price-page last-modified signals cross-referenced against known product-catalog change frequency where available.

### F. How the signal could be detected automatically
Deterministic: schema/DOM pattern matching for price tokens; a simple binary check for "does a pricing page exist and does it show either numbers or an explicit contact-sales CTA" is enough to distinguish the legitimate-gating case from a genuine gap (no pricing page, or a broken/JS-only one with nothing extractable at all).

### G. What evidence the skill should report
For ecommerce: specific stale or unextractable price. For SaaS: whether pricing is numerically shown or explicitly and clearly gated — and explicitly note when gating was evaluated and found to be a legitimate pattern, not silently skipped.

### H. Possible severity logic
Ecommerce price-unavailability or staleness: high. SaaS price-gating alone: not a finding at all unless the gating itself is unclear (e.g., a pricing page that implies numbers exist but shows nothing, with no CTA either) — that pattern, not gating itself, is the actual defect.

### I. Correct remediation
Ecommerce: ensure price/availability are in plain extractable text and kept current. SaaS: ensure the gating pattern is explicit and navigable (a clear "talk to sales" path), not ambiguous.

### J. False-positive cases
Flagging enterprise SaaS for not showing a number — the canonical false positive this cluster exists to prevent.

### K. False-negative risks
A check that only looks for the presence of *any* pricing page, without checking whether it actually resolves to a number or a clear CTA, would miss a pricing page that's present but functionally empty.

### L. Counterexamples
Some SaaS products (self-serve, PLG-motion companies) do and should show full self-serve pricing; the "gating is fine" norm applies to enterprise-motion SaaS specifically, not the whole category — this needs a lighter-weight sub-signal (self-serve signup CTA presence) to distinguish the two SaaS sub-patterns rather than a blanket suppression.

### M. Generalizes?
Yes — the mechanism (extractability matters everywhere; the *norm* for absence differs by business model) is portable; the specific PLG-vs-enterprise-motion sub-signal needs more real-world calibration than this document alone provides.

### N. Candidate skill(s)
No new skill — this is a configuration difference within whatever skill handles pricing/offer extraction generally (likely shared with Pulkit's crawlability/extraction work), gated by this cluster's classification output.

### O. Relationship to other skills
Directly the mechanism behind the handout's own worked root-cause example; connects to Pulkit's content-extraction topics for the actual extraction logic, and to `false-positive-suppression` (U) for the SaaS-gating suppression rule.

---

## Cluster G — Multilingual: an orthogonal axis, not a peer category
**Covers:** V20

### A–C. What we need to understand / why it matters / current evidence
**INFERENCE** — V20 was placed in the original topic list as a parallel item to V1–V19, but on inspection it doesn't behave like one: a site is never *only* "multilingual" the way it can be *only* "a directory" — multilingual-ness is a property that co-occurs with any of Clusters A–F (a multilingual ecommerce site, a multilingual government site, a multilingual news outlet), each combination inheriting that cluster's rules plus a fixed, independent set of translation/locale checks. Treating V20 as a twentieth peer category would either force it into an arbitrary single-cluster home or require duplicating its checks across every other cluster — modeling it as an orthogonal axis avoids both problems.

### D. Important mechanisms
`hreflang` correctness/completeness is a well-documented, distinct technical mechanism (missing or malformed `hreflang` risks serving the wrong-language version to a crawler or user); content-parity between locales (is the translated version actually current/equivalent, or a stale/partial translation) is a separate, non-technical mechanism worth checking regardless of which other cluster the site belongs to.

### E–I. Signals / detection / evidence / severity / remediation
Deterministic: `hreflang` tag presence/validity, language-selector UI detection, locale-subdirectory/subdomain enumeration. Content-parity requires comparing translated-page publish/modified timestamps against the primary-language version, or an LLM-assisted spot-check of substantive completeness where timestamps aren't available. Evidence: specific missing/malformed `hreflang` pairs; specific locale found stale relative to the primary language. Severity: scales with how central the affected page is (a stale translated pricing page is worse than a stale translated blog post — again reusing whichever cluster the page actually belongs to for that judgment). Remediation: fix `hreflang` pairing; update or clearly flag partial/older translations.

### J. False-positive cases
Comparing content depth across locales as if it must be numerically equal — a smaller-market locale legitimately gets less investment, and this should not be flagged as a parity failure on its own; only substantive staleness or missing safety/legal-critical content (which reactivates Cluster A's logic if the locale content is YMYL-adjacent) should fire.

### K–M. False negatives / counterexamples / generalization
A generic audit that never checks `hreflang` at all would miss a real, common technical defect; a genuinely small, single-market business correctly has no multilingual surface at all, and this axis should simply not apply rather than being treated as a gap. Generalizes cleanly since the mechanism is a fixed W3C/search-engine convention (`hreflang`), independent of vertical.

### N–O. Candidate skill(s) / relationships
No new skill — a small, independent check module consumed alongside whichever cluster (A–F) a given multilingual site's content otherwise belongs to; connects to Pulkit's crawlability/technical-SEO topics where `hreflang` naturally lives, and to Harsh's P (Cross-Web Consistency) for the locale-parity angle.

---

## 3. Findings register
*(Selecting the genuinely new, load-bearing findings — the six-cluster mapping itself is represented by Section 2's table, not restated here.)*

---
**FINDING ID:** V-01
**Researcher:** Soham
**Research Area:** V — Site-Type Differentiation
**Research Question:** Does SaaS/docs hybridity show up as a same-domain subpath, or somewhere else — and is the answer constant across companies?
**Observation:** Live inspection of stripe.com's footer shows Stripe's documentation on a fully separate subdomain (`docs.stripe.com`), plus additional first-party-owned properties on entirely different domains and TLDs: a developer blog (`stripe.dev`), a publishing imprint (`press.stripe.com`), an independent-feeling online magazine (`worksinprogress.co`), a community forum (`stripecommunity.com`), and an integration-partner directory (`marketplace.stripe.com`). A follow-up test on a smaller, more modern self-serve SaaS company (Linear) found the **opposite** pattern: its documentation lives at `linear.app/docs`, a plain same-domain subpath, with no evidence of a separate docs subdomain or cross-TLD brand family.
**Evidence:** Direct `web_fetch` of `https://stripe.com/` footer content (2026-09-01); `web_search` results confirming Linear's docs URL structure at `linear.app/docs` (2026-09-01).
**Sources:** stripe.com (primary, live fetch); linear.app/docs (confirmed via indexed search results).
**Pattern:** The "hybrid site" risk in the commercial/technical cluster (D) is **not a fixed rule** — it's better modeled as **cross-domain brand-family sprawl that scales with company size/maturity**, not a universal SaaS-company behavior. Larger, longer-established companies (Stripe) accumulate separately-hosted properties over time; smaller or more product-focused companies (Linear) keep the same content on-domain. A classifier that assumes either pattern as default will be wrong roughly half the time on this evidence alone.
**Counterexamples:** Linear itself is now the counterexample, empirically confirmed rather than merely predicted — the classifier must check for both patterns rather than picking one as a default.
**Hypothesis:** Company scale/age (employee count, funding stage, years since founding) may be a usable proxy for which pattern to expect, informing how aggressively the domain-family discovery step should search — untested as a proxy, and two data points is not enough to fit a threshold.
**Signal:** Outbound links from a seed domain's global footer/nav pointing to differently-branded-but-same-organization domains, run regardless of company size (the discovery step should always run; only the *expected yield* should vary).
**How to Detect:** Deterministic link harvesting + a lightweight ownership-confirmation heuristic (shared branding assets, explicit "part of [Company]" language, or `sameAs`-style cross-linking) to avoid falsely absorbing unrelated third-party sites into the audit scope.
**Evidence Output:** List of discovered first-party-affiliated domains/subdomains and the basis for including each; explicitly report "none found" as a valid, non-error outcome (per the Linear case) rather than treating an empty result as a detection failure.
**False Positives:** Absorbing an unrelated third-party site that merely links to the seed domain (link harvesting must be outbound-from, not inbound-to, and ownership-confirmed).
**False Negatives:** A brand family with no consistent footer/nav cross-linking between properties (undiscoverable by this method) would be missed entirely.
**Severity:** N/A — this is a scoping/coverage finding, not itself a graded audit finding.
**Recommended Fix:** N/A directly — informs the `site-type-classifier` skill's design (Section 4): always run the discovery step, never skip it based on an assumption about company size, since the two-case evidence here shows the assumption would be wrong in either direction.
**Generalization:** Now observed in both directions on two companies (Stripe: sprawl; Linear: no sprawl) — meaningfully stronger than the original single-case finding, since it demonstrates the risk of hard-coding *either* pattern as a default, but still only two data points; a broader sample (5-10 companies spanning company age/size) would be needed before trusting any size-based proxy.
**Candidate Skill:** Mandatory first-pass capability within `site-type-classifier`, not a separate skill — must run unconditionally, not gated by a size heuristic.
**Related Skills:** Feeds the entrypoint orchestrator's (Z) crawl-scope determination.
**Confidence:** HIGH for both specific observations (directly fetched/verified); HIGH for the conclusion that neither pattern should be assumed as a default (this is now demonstrated, not inferred); LOW for any specific size-based predictor of which pattern applies (not tested).

---
**FINDING ID:** V-02
**Researcher:** Soham
**Research Area:** V — Site-Type Differentiation
**Research Question:** Does university/institutional commercial-activity hybridity show up as a same-domain subpath, as originally hypothesized — and is this a large-elite-institution quirk or a broad pattern?
**Observation:** Harvard's bookstore (the Coop) is not hosted on `harvard.edu` — it's run by a legally separate entity (Harvard Cooperative Society, operationally managed by Barnes & Noble Education) on its own domain, serving both Harvard and MIT jointly. **Follow-up testing across seven additional, materially smaller and less-prestigious institutions found the identical pattern**: a community college (San Diego City College — bookstore at `bookstore.sdccd.edu`, a distinct subdomain, run by an outsourced operator), a small state college (MCLA — outsourced to eCampus.com plus a separately-branded on-site vendor "UGS/Murdock's Merch"), a community college (De Anza — outsourced to Follett Higher Education, storefront at the separate domain `deanzastore.com`), a public university (CCNY/CUNY — outsourced to a separate domain `CCNYBooks.com`), a private university (St. John's — separate domain `stjcampusstore.com`), a small private college (Wilmington College — outsourced to eCampus), and another (St. John Fisher — outsourced to eCampus plus "University Gear Shop" for physical merchandise). **This is no longer a single-case finding** — it's a consistently observed pattern across eight institutions spanning elite-private to public-community-college scale.
**Evidence:** Web search results directly confirming each institution's bookstore vendor/domain arrangement (2026-09-01), plus the original three-source Harvard/MIT corroboration from the prior pass.
**Sources:** en.wikipedia.org/wiki/Harvard/MIT_Cooperative_Society; businesswire.com (2021 Coop release); ask.library.harvard.edu; library.mcla.edu; bookstore.sdccd.edu; deanza.edu/bookstore; ccny.cuny.edu/bookstore; stjohns.edu; wilmington.edu; sjf.edu.
**Pattern:** Outsourcing campus retail/textbook commerce to a small number of named, recurring third-party operators (**Follett Higher Education Group**, **Barnes & Noble College**, **eCampus.com**, **University Gear Shop**) onto a separately-branded domain or subdomain is a **standard, industry-wide operating model in U.S. higher education**, not a large-institution governance quirk. This substantially strengthens the original inference: "does the `.edu` domain also sell things" is a false-negative trap almost everywhere in this cluster, not just at the Harvard/MIT scale, and the real risk (entity-affiliation resolution between the institution and its named commercial vendor) generalizes accordingly.
**Counterexamples:** None found in this pass, though the sample (8 institutions, all U.S., all higher-ed) is not exhaustive — non-U.S. institutions or those without an outsourced-vendor market (this pattern depends on a mature third-party campus-retail industry existing at all) may behave differently, and V9 (government) was not independently re-tested this pass, only V7 (universities).
**Hypothesis:** The same named-third-party-vendor pattern likely extends to other outsourced institutional services beyond bookstores (dining, housing, campus IT support) with the same entity-affiliation-resolution risk — untested, flagged as a natural next check rather than assumed.
**Signal:** Absence of on-domain commercial paths on a `.edu`/`.gov` site combined with named, off-domain "affiliated" entities in institutional content; presence of one of the recurring named vendor brands (Follett, Barnes & Noble College, eCampus, UGS) as a positive classification signal for "this is very likely a legitimate, standard outsourcing arrangement, not an anomaly."
**How to Detect:** Outbound-link harvesting from the institutional domain to named affiliated entities, checked for mutual, explicit affiliation language on both sides; a small reference list of known recurring campus-retail vendor names can raise confidence quickly and cheaply without needing deep verification for the well-known cases.
**Evidence Output:** The specific off-domain entity, whether it matches a known recurring vendor pattern, and whether the affiliation link is clear and mutual or one-sided/absent.
**False Positives:** Flagging the absence of on-domain commerce as a defect or missed opportunity — now confirmed wrong across eight independent institutions of varying scale, not just one.
**False Negatives:** A check that never looks past the institution's own domain would never find this risk category at all, at any institution size.
**Severity:** Low for internal sub-unit inconsistency (usually organizationally legitimate); higher for unclear/absent affiliation-linking to a named off-domain commercial entity that does *not* match a known recurring vendor pattern (a genuine unknown affiliate warrants more scrutiny than a recognized industry vendor).
**Recommended Fix:** Ensure institutional pages that name an affiliated off-domain entity link to it clearly and that the affiliation is stated on both sides.
**Generalization:** Meaningfully upgraded from the prior pass — now evidenced across eight institutions spanning the full range of U.S. higher-ed prestige/size, not one elite outlier. Still limited to U.S. higher education specifically; V9 (government) and non-U.S. institutions remain untested.
**Candidate Skill:** This is arguably better owned by Harsh's F (Entity Recognition & Entity Resolution) than built as a V-specific check — flagged explicitly for merge-time discussion rather than built twice.
**Related Skills:** Harsh's F (Entity Resolution); corrects the `site-type-classifier`'s original V7 hybrid-detection assumption.
**Confidence:** HIGH for the pattern within U.S. higher education (now corroborated across eight independent institutions rather than one); LOW for whether it extends to V9 (government) or non-U.S. institutions, which were not tested.

---
**FINDING ID:** V-03
**Researcher:** Soham
**Research Area:** V — Site-Type Differentiation
**Research Question:** Is hedged, "it depends" language on YMYL content a defect or a correct pattern?
**Observation:** Google's own quality-rater guidelines explicitly hold YMYL content (health, finance, legal, safety) to a stricter trust standard than general content, precisely because weak or overconfident information in these domains carries real potential for harm — the guidelines' emphasis is on trustworthiness and appropriate caution, not decisiveness for its own sake.
**Evidence:** Summaries and direct discussion of Google's Search Quality Rater Guidelines' YMYL/E-E-A-T framework (multiple 2026 secondary sources consistently describing the same underlying, publicly documented framework).
**Sources:** Coverage of Google's Search Quality Rater Guidelines (YMYL/E-E-A-T sections), 2026.
**Pattern:** A generic "is this answer clear and decisive" check will systematically misjudge legal and medical content specifically, where jurisdiction- or condition-dependent hedging ("this depends on your state," "consult a licensed provider") is the textbook-correct answer, not evasiveness.
**Counterexamples:** Hedging used to avoid stating any concrete information at all (a page that hedges everything, including facts that have a single clear answer) is a legitimate low-quality signal — the distinction is between *appropriate, scoped* hedging and *content-free* hedging, and only the latter should be flagged.
**Hypothesis:** N/A — directly grounded in a documented, named framework.
**Signal:** Conditional/hedging language co-occurring with jurisdiction- or condition-dependent topic classification (reusing Cluster A's topic classifier).
**How to Detect:** Deterministic hedge-phrase detection; LLM escalation to distinguish appropriately-scoped hedging from content-free hedging.
**Evidence Output:** The specific hedge, and an explicit note on whether it was judged appropriate or evasive.
**False Positives:** Flagging any hedge on YMYL content as unclear — this is the finding's own central warning.
**False Negatives:** Content-free hedging that avoids ever stating a checkable fact could be missed if the detector only checks for hedge-phrase presence without assessing whether *any* concrete claim exists nearby.
**Severity:** N/A directly (this is a suppression rule, not a graded finding) — feeds severity gating in Cluster A.
**Recommended Fix:** N/A — this is a never-fire rule, not a remediation target.
**Generalization:** Directly tied to the publicly documented YMYL framework; applies wherever Cluster A's topic classification fires, regardless of site type otherwise.
**Candidate Skill:** Feeds `false-positive-suppression` (Topic U) as a named suppression rule.
**Related Skills:** Cluster A (this document); Topic U.
**Confidence:** HIGH for the underlying framework (well-documented, publicly available, consistently described across independent sources); MEDIUM for the specific appropriate-vs-content-free hedging distinction, which is our own reasonable operationalization rather than something the guidelines state in exactly this form.

---
**FINDING ID:** V-04
**Researcher:** Soham
**Research Area:** V — Site-Type Differentiation
**Research Question:** Are Cluster B's three corroboration-channel claims (NAP for local business, third-party validator seals for nonprofits, capped-length-by-design for directories) real, detectable mechanisms, or plausible-sounding but unverified inferences?
**Observation:** All three checked out with more technical specificity than originally assumed. (1) NAP consistency is a well-established, named local-SEO mechanism across independent practitioner sources, with a concrete, useful granular detail: even minor formatting differences ("St." vs. "Street") count as inconsistencies, meaning the detector needs address normalization, not exact-string matching. (2) Nonprofit third-party validation is not just a conceptual "look for a mention" — GuideStar/Candid and Charity Navigator provide literal embeddable badge widgets served from a fixed, identifiable URL pattern, and named real nonprofits (Maya's Hope, Panthera, The Hunger Project) were confirmed displaying them. (3) Yelp's own listing design explicitly caps business descriptions at 1,500 characters and places them below the reviews section — directory/marketplace brevity is a considered platform design choice, not a content gap.
**Evidence:** Multiple independent local-SEO/dental-marketing practitioner sources on NAP consistency (2026); Candid/GuideStar developer documentation showing the seal-widget embed URL pattern; donorbox.org and nptechforgood.com coverage naming specific nonprofits using validator badges; Yelp's own business-page structure as described by Yext and ReviewTrackers guides.
**Sources:** See Cluster B section C above for the widget URL pattern and named examples; multiple local-SEO guides (theedigital.com, diib.com, dentalroi.com, citationstack.com) for the NAP-normalization detail.
**Pattern:** Cluster B's three corroboration-channel claims move from "reasonable inference" to "documented, and in two of three cases concretely, cheaply, deterministically detectable" after this pass — the third-party-validator check in particular is now a simple URL-pattern DOM scan rather than a fuzzy judgment call, which is a meaningfully better (cheaper, more reliable) design than the original draft assumed.
**Counterexamples:** None found for the three specific claims tested; not tested: whether smaller or newer nonprofits without an established validator profile should be treated differently from one that simply hasn't pursued a rating (a legitimate reason for absence vs. a red flag), which remains an open false-positive risk (see below).
**Hypothesis:** N/A — directly grounded in named, documented mechanisms and platform-level design choices.
**Signal:** See revised Cluster B section E.
**How to Detect:** See revised Cluster B section F — largely deterministic, cheaper than originally scoped.
**Evidence Output:** Specific NAP mismatch (normalized) between site and a named directory; specific validator-widget presence/absence with the widget host identified; directory-entry length compared against the platform-typical norm rather than a generic word-count threshold.
**False Positives:** A newer or smaller nonprofit that simply hasn't pursued a GuideStar/Charity Navigator listing yet (a resourcing/timing issue, not illegitimacy) should not be scored the same as one that pursued and failed a rating, or one with no charitable registration at all — this distinction is not fully resolved by this pass and needs a softer severity tier for "absent" versus "failed."
**False Negatives:** A locally well-regarded business with genuinely inconsistent NAP data due to a real, recent address/phone change would be correctly flagged by this check — not a false negative, but worth noting the fix (updating listings) is squarely within the business's own control, unlike some of this document's other findings.
**Severity:** NAP inconsistency: medium-high, scales with number of inconsistent listings found. Validator-seal absence: low by default (many small, legitimate nonprofits haven't pursued one), escalating only if other trust signals are also absent. Directory brevity: not a finding at all under this revised understanding.
**Recommended Fix:** Reconcile NAP data at the source of inconsistency; for nonprofits, pursuing a GuideStar/Charity Navigator profile is a legitimate suggested action (not a "fix a defect" framing, since its absence isn't itself a defect).
**Generalization:** The NAP mechanism and the Yelp-structure observation generalize well within their categories (local search, directory platforms broadly follow similar conventions). The specific widget-URL-pattern detection is validated for GuideStar/Candid and Charity Navigator specifically and would need to be extended (not assumed to transfer) to other validator services if the marketplace wants broader nonprofit coverage.
**Candidate Skill:** No new skill — this is configuration/detection-method refinement for whatever skill in the marketplace handles cross-web trust/corroboration checks (Harsh's H/P), consuming Cluster B's classification output.
**Related Skills:** Harsh's H (Trust/Authority), Harsh's P (Cross-Web Consistency).
**Confidence:** HIGH for all three mechanisms as documented, real, and detectable; MEDIUM for the open absent-vs-failed nonprofit-validator distinction, which is a genuine remaining gap, not a resolved one.

---

## 4. The artifact this topic actually needs to produce: universal / conditional / never-fire catalog

This is the output every other skill in the marketplace should consume — not the twenty-item list, the six-cluster mechanism map applied as a three-way gate.

**Universal (run regardless of cluster):**
- Crawlability of core content; JS-render gap on primary informational content
- Basic entity-identity clarity (unambiguous which real-world entity the site is)
- Some freshness signal appropriate to the applicable cluster (dated, versioned, or clearly evergreen)
- If structured data is present, it must be valid — never "must be present"

**Conditional (fires only when cluster membership matches):**
- Mandatory disclosure + credential checks, severity ceiling raised → Cluster A (YMYL)
- NAP consistency → local business (Cluster B); third-party validator linkage → nonprofits (Cluster B)
- Outbound-link accuracy as the primary value-prop metric → directories/marketplaces (Cluster B)
- Off-domain affiliation-link clarity → institutional (Cluster C)
- Version-currency freshness override; domain-family discovery before scoping → technical/reference (Cluster D)
- Sensitivity-scaled author-credential bar; transcript/caption presence for non-text-heavy pages → authorship spectrum (Cluster E)
- Price/offer extractability with cluster-specific gating norm → commercial (Cluster F)
- `hreflang` validity + locale content-parity → multilingual axis (Cluster G), combined with whichever of A–F otherwise applies

**Never-fire (must be actively suppressed):**
- "Thin content" on directories, portfolios, marketplace listing pages
- "No named individual author" on government/institutional pages
- "No pricing shown" as an automatic negative on enterprise/regulated B2B SaaS
- "Few backlinks/press mentions" on local businesses, small nonprofits, personal sites
- "Unclear/hedged answer" on jurisdiction- or condition-dependent legal/medical content (V-03)
- "Hybrid site type" flagged from on-domain signals alone, without checking off-domain affiliated properties first (V-01, V-02)
- Cross-locale content-depth parity treated as strict numeric equality (Cluster G)

---

## 5. Required end-of-topic synthesis

**Strongest validated insight:**
Trust rigor and corroboration channels both vary systematically and *predictably* by cluster, not randomly by named site type — this is grounded directly in Google's own documented YMYL/E-E-A-T framework (Cluster A) and in the observed, distinct corroboration channels for local business/nonprofit/directory site types (Cluster B). A flat scoring rubric applied everywhere is provably wrong, not just theoretically risky, and the six-cluster model is a more compact, more defensible unit of differentiation than the original twenty-item list.

**Strongest unvalidated hypothesis (revised after pressure-testing):**
The original version of this item — "does V-01/V-02 generalize beyond a single studied company?" — is now substantially resolved rather than open: V-02 held up across eight independent U.S. higher-ed institutions spanning the full size/prestige range, and V-01 was shown to genuinely go *both ways* (Stripe sprawls, Linear doesn't) rather than being a single unconfirmed prediction. The hypothesis that remains genuinely unvalidated is narrower and more specific: **that company age/size predicts which domain-sprawl pattern a SaaS company will show**, and **that the off-domain-commerce pattern extends to V9 (government) and to non-U.S. institutions** — both are natural next tests, neither is assumed true by the document as it stands.

**Strongest candidate skill:**
The `site-type-classifier` utility skill's design is now more specific than it was before this pass: it must (1) run domain-family discovery *unconditionally* for every site, not gated by a size assumption (V-01, revised — the assumption itself was shown to fail in both directions), (2) check for off-domain affiliated entities rather than assuming hybrid activity shows up on-domain, with a short reference list of known recurring vendor names (Follett, Barnes & Noble College, eCampus, University Gear Shop) as a cheap confidence booster for the higher-ed case specifically (V-02, now well-evidenced), and (3) output cluster membership (one of A–F) plus the multilingual flag (G) rather than a single V1–V20 label, since several real sites will legitimately belong to more than one cluster across different subdomains/templates.

**Weakest assumption we should investigate next (narrowed further after testing Cluster B):**
Clusters B, C, and D have now all been pressure-tested against real, named examples and held up — in Cluster B's case, with a genuinely useful upgrade (the third-party-validator check turned out to be cheaply deterministic via a widget-URL pattern, not a fuzzy judgment call as originally scoped). What's left genuinely untested, and now the actual weak point: (1) whether the off-domain-commerce pattern (V-02) holds for **V9 (government)** and for **non-U.S. institutions**, neither of which was checked; (2) Cluster A (YMYL) and Cluster E (authorship spectrum) have not been pressure-tested against a live site at all — only grounded in the Google guidelines and the GEO paper's domain-variance finding, which are strong sources but haven't been checked against how a specific real health/finance/legal site actually behaves; and (3) the one open gap inside Cluster B itself — distinguishing a nonprofit that legitimately hasn't pursued third-party validation yet from one that's avoiding it — remains unresolved and would need either a size/age proxy or an explicit "insufficient information" output rather than a guess.

---

## 6. Cross-references for the Combine & Code phase

- **Cluster A (YMYL) ↔ Harsh's H (Trust/Authority) and Pulkit's I (Freshness):** YMYL classification should gate both the severity ceiling for trust checks and the staleness tolerance for rate/regulatory content — hand off as a shared `is_ymyl` flag from the classifier, not duplicated logic.
- **Cluster B (multi-entity) ↔ Harsh's H and P (Trust, Cross-Web Consistency):** The corroboration-channel lookup table (press vs. NAP vs. third-party validator vs. outbound-link-accuracy) should reconfigure Harsh's existing corroboration checks per cluster, not spawn a parallel set.
- **Cluster C (institutional) ↔ Harsh's F (Entity Resolution):** V-02's off-domain-affiliation-checking logic is arguably more naturally an F-topic skill than a V-topic one — explicit flag for discussion before folders are finalized, to avoid building it twice.
- **Cluster D (technical/reference) ↔ Pulkit's I (Freshness) and Z (Agent Skill Design, mine):** Version-currency as a freshness override, and domain-family discovery as a mandatory pre-crawl step for the entrypoint orchestrator's scoping logic.
- **Cluster E (authorship spectrum) ↔ Harsh's D (Machine Readability):** V13's transcript/caption check for non-text-heavy media pages is a Cluster-D-adjacent (Harsh's D, not mine) mechanism, not a new one.
- **Cluster F (commercial) ↔ Pulkit's content-extraction topics:** The price/offer extraction mechanism itself is Pulkit's territory; this cluster only supplies the per-vertical norm for interpreting absence.
- **Cluster G (multilingual) ↔ Harsh's L (Technical Search Signals) and P (Cross-Web Consistency):** `hreflang` validity is a standard technical-SEO check that likely already lives in Harsh's L; this cluster only adds the locale-parity angle as a new input to P.
- **All clusters ↔ Topic U (mine, False Positives/Negatives):** Every never-fire rule catalogued in Section 4 should be registered directly in the `false-positive-suppression` skill's rule set, with this document as the cited justification for each rule rather than the rule being asserted without a traceable source.
- **The classifier itself ↔ Topic Z (mine, Agent Skill Design):** Needs to be built and validated as a standalone utility skill early, since Clusters A, B, D, and F above all depend on its output rather than being independently runnable — sequencing risk worth flagging to the team now, before implementation starts.
