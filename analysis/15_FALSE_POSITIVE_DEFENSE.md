# Phase 16 — False Positive Defense

For each KEEP skill: 8 cases, then logic changes.

## SK-V site-type-classifier
1. **TP:** Clinic site, medical claims, no reviewer named.
2. **TN:** Hobby blog, no YMYL disclosure expected.
3. **Subtle TP:** University hospital on .edu — still YMYL.
4. **Subtle TN:** SaaS “HIPAA compliant” marketing without being a clinic — not medical-advice YMYL for reviewer rule.
5. **FP:** Flagging bookstore.princeton.edu as pure SaaS.
6. **FN:** Embedded finance widget on a media site missed.
7. **Ambiguous:** Marketplace of health products.
8. **Unusual legit:** Government .gov with legal hedging everywhere.
**Logic:** Always run (V-01); multi-label hybrid; never size heuristic; V beats generic.

## SK-C crawl-access
1. **TP:** robots 5xx → fail-closed.
2. **TN:** HTTP→HTTPS single redirect.
3. **Subtle TP:** Incomplete TLS chain.
4. **Subtle TN:** Disallow `/search` and `/cart`.
5. **FP:** “No sitemap” as Critical.
6. **FN:** Geo-split TLS (stated limitation).
7. **Ambiguous:** Staging subdomain linked from prod.
8. **Unusual:** Huge docs site deep trees (depth cap tradeoff).
**Logic:** U8; don’t flag standard redirects; sitemap optional.

## SK-D render-extract
1. **TP:** Price only after JS fetch.
2. **TN:** Chat widget JS-only.
3. **Subtle TP:** FAQ accordion hiding the cited claim (X overlap).
4. **Subtle TN:** Product photography site.
5. **FP:** Any SPA flagged even when facts in raw HTML (U2).
6. **FN:** Canvas-drawn prices without OCR.
7. **Ambiguous:** Configurator prices that aren’t meant to be indexed.
8. **Unusual:** PDF-only 10-K with HTML summary (U9 OK).
**Logic:** Only fact-bearing deltas; U9/U10; no OCR-all.

## SK-CIT citation-extractability
1. **TP:** “$49” vs “$49 first 3 months then $99” split.
2. **TN:** Founding year one sentence.
3. **Subtle TP:** Table cells without th.
4. **Subtle TN:** Mission-page “world-class” (B-F1 FP).
5. **FP:** Missing JSON-LD while prose complete (U1).
6. **FN:** Div-based tables (E-03).
7. **Ambiguous:** Clear vs evasive hedge (V-A).
8. **Unusual:** Fashion brand emotive copy (V-E).
**Logic:** Scope to factual templates; schema never Critical; YMYL hedges OK.

## SK-ENT entity-identity
1. **TP:** Common name + no “we are a {category} in {geo}”.
2. **TN:** Distinctive coined brand.
3. **Subtle TP:** Silent mix-up risk (WhoQA).
4. **Subtle TN:** Low-prominence homonym in another country.
5. **FP:** “No Wikidata page” as defect (F-02).
6. **FN:** Non-English collision.
7. **Ambiguous:** Acronym brand.
8. **Unusual:** Artist name = product name on purpose.
**Logic:** Gate on collision_risk; never schema-absence-only.

## SK-K answerability
1. **TP:** No statement of what the company does.
2. **TN:** Unanswerable K10 competitors.
3. **Subtle TP:** Offering only in a slogan image.
4. **Subtle TN:** “Contact us for pricing” B2B (V-F).
5. **FP:** LLM hallucinated answer (K-halluc).
6. **FN:** Logos implying audience without explicit K4.
7. **Ambiguous:** Open-source no price.
8. **Unusual:** Directory site whose “offering” is listings.
**Logic:** Closed-book + citations; abstention first-class; site-type filter questions.

## SK-I freshness
1. **TP:** schema dateModified ≠ visible + no content change pattern.
2. **TN:** Evergreen docs with version 3.2.
3. **Subtle TP:** 2019 press release vs current pricing page.
4. **Subtle TN:** History page dated 2019.
5. **FP:** Old accurate timestamp.
6. **FN:** No prior snapshot for fake-update.
7. **Ambiguous:** Blog vs product freshness.
8. **Unusual:** Newspaper homepage always “today”.
**Logic:** U6/U7; QDF weighting; never age-only.

## SK-H corroboration
1. **TP:** Homepage “1000 employees” vs linked About “12”.
2. **TN:** Unique product claim with no wiki (notability).
3. **Subtle TP:** sameAs 404.
4. **Subtle TN:** LinkedIn slogan ≠ legal name (immaterial P-03).
5. **FP:** Punishing lack of press mentions for a bakery.
6. **FN:** Budget skip of third-party.
7. **Ambiguous:** Wikidata incomplete (bias).
8. **Unusual:** Nonprofit using Candid widget (V-B).
**Logic:** Materiality gate; H-02 language; bounded fetches.

## SK-X engagement
1. **TP:** Cited sentence only in closed accordion.
2. **TN:** Long tutorial needing scroll by nature.
3. **Subtle TP:** Identity below fold on mobile viewport heuristic.
4. **Subtle TN:** Flat one-page site no breadcrumbs (Y-02).
5. **FP:** Minimalist design as “untrustworthy” (X-03 FP).
6. **FN:** Paraphrase vs exact STTF (X-02).
7. **Ambiguous:** Legitimate FAQ accordion for secondary Q.
8. **Unusual:** Docs site with left nav instead of crumbs.
**Logic:** Central claims only for STTF; Y-01 disclosed untestable; don’t require referrer tests.

## SK-ORCH
1. **TP:** Merge 40 template clones to 1 finding.
2. **TN:** Two real issues on one URL kept separate.
3. **Subtle TP:** V vs generic pricing conflict resolved.
4. **Subtle TN:** Partial crawl still reports coverage.
5. **FP:** 100 Low schema nits.
6. **FN:** Dropping Critical on merge.
7. **Ambiguous:** timeout mid-K.
8. **Unusual:** Tiny static site exhaustive crawl.
**Logic:** Alert-fatigue cap; never drop Critical; status partial visible.
