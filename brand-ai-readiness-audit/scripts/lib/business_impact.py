"""Business-impact presentation layer, ported from frontend/lib/audit/business-impact.ts.

It only annotates findings already produced by the detection engine; it never
creates findings or estimates commercial loss.
"""
from __future__ import annotations

from lib.models import Finding

_DIMENSION = {
    "crawl-access-audit": "discoverability", "render-extract-audit": "discoverability",
    "site-type-classifier": "understanding", "citation-extractability-audit": "understanding",
    "ai-answerability-audit": "understanding", "entity-identity-audit": "trust",
    "freshness-audit": "trust", "corroboration-consistency-audit": "trust",
    "engagement-handoff-audit": "engagement",
}
_DECISION = {"qualifier_split", "on_site_fact_conflict", "interaction_insert", "scent_break", "sttf_fail", "table_no_th"}
_CONSIDERATION = {"js_fact_lock", "d41_hidden", "pdf_only_fact", "image_locked_fact", "date_divergence", "linked_contradiction", "comparison_self_win", "flagship_gap", "expected_gap", "uncorroborated"}

_QUESTIONS = {
    "K3": ("What does this organization offer or do?", "awareness", "Low"),
    "K4": ("Who is the intended audience?", "consideration", "Medium"),
    "K5": ("Where is this organization based or serving?", "consideration", "Medium"),
    "K6": ("What does it cost / how is it priced?", "decision", "High"),
    "K13": ("How can a human contact the organization?", "decision", "High"),
}


def _scorecard(per_question: dict | None) -> dict:
    per_question = per_question or {}
    items = []
    for qid, (question, stage, priority) in _QUESTIONS.items():
        status = per_question.get(qid, "not_run")
        items.append({
            "id": qid,
            "question": question,
            "funnelStage": stage,
            "funnelPriority": priority,
            "status": status,
        })
    return {
        "items": items,
        "total": len(items),
        "answered": sum(1 for x in items if x["status"] == "answered"),
        "unanswered": sum(1 for x in items if x["status"] in {"unanswerable", "insufficient"}),
        "not_run": sum(1 for x in items if x["status"] == "not_run"),
    }


_FINDING_INTERPRETATIONS: dict[str, str] = {
    "transport_unreachable": "Seed host connection failed at DNS, TLS, or transport negotiation, preventing automated retrieval from initiating.",
    "robots_disallow": "robots.txt explicitly disallows crawlers on the requested path, barring compliant retrieval engines from inspecting content.",
    "access_blocked": "Origin returned interactive challenges (WAF/CAPTCHA) or 403 blocks on sampled URLs, blocking automated crawlers from brand content.",
    "robots_fail_closed": "robots.txt returned HTTP 5xx server error, forcing compliant crawlers to treat the entire domain as disallowed (fail-closed per RFC 9309).",
    "ai_token_disallow": "robots.txt contains targeted disallow directives for AI crawler tokens (GPTBot, ClaudeBot, PerplexityBot) while allowing general search bots.",
    "orphan": "High-value content URL has zero inbound internal links and is missing from XML sitemaps, making automated discovery unreliable.",
    "trap_facet": "Faceted navigation or infinite calendar query parameters generate combinatorial duplicate URLs that burn crawler budget.",
    "canonical_dup": "Near-duplicate pages lack a single shared canonical tag, diluting citation authority across competing URL versions.",
    "soft_404": "Server returns HTTP 200 OK with missing or error page copy instead of proper 404 or 410 status codes, polluting extracted evidence.",
    "noindex_robots_conflict": "Page contains a meta noindex tag but is also disallowed in robots.txt, preventing crawlers from reliably reading the noindex directive.",
    "js_fact_lock": "Primary specifications, pricing, or product claims exist only in client-rendered JavaScript bundles and are missing from initial HTML.",
    "interaction_insert": "Key facts, FAQs, or disclosures are inserted into the DOM only after user clicks, tabs, or accordion expansions.",
    "d41_hidden": "Critical entity facts reside inside collapsed or hidden DOM elements (display:none, visibility:hidden, aria-hidden).",
    "pdf_only_fact": "Essential specifications, SLA terms, or disclosures are locked inside unindexed binary PDF documents rather than HTML text.",
    "image_locked_fact": "Pricing tables or architecture diagrams are rendered as raster images without semantic text alternatives, blocking text-first indexing.",
    "qualifier_split": "Pricing conditions, asterisks, or disclaimers are physically separated from headline values across DOM nodes, risking unconditioned extraction.",
    "table_no_th": "Data tables lack semantic header cells (<th>) and row/column scope associations, preventing reliable tabular question-answering.",
    "schema_visible_mismatch": "Schema.org structured JSON-LD data contradicts human-visible HTML copy on the page, creating verification distrust.",
    "comparison_self_win": "Competitor comparison table asserts self-promotional product superiority without citing objective third-party proof or benchmarks.",
    "unanswerable": "The site corpus lacks an explicit, extractable factual span answering this essential closed-book buyer question.",
    "wrong_page": "The answer exists on the site but is buried on a deep sub-page rather than the expected intent landing page.",
    "expected_gap": "Site omits a standard informational surface or disclosure expected for its specific business archetype.",
    "flagship_gap": "Dedicated product URLs have significantly weaker factual extractability and lower text density than the general brand homepage.",
    "collision_risk": "Brand entity name is linguistically ambiguous and lacks schema.org sameAs disambiguation to authoritative knowledge bases.",
    "sameas_404": "Organization JSON-LD contains a sameAs identity profile link that resolves to HTTP 404 Not Found.",
    "date_divergence": "Visible content dates diverge significantly from schema dateModified or sitemap lastmod values, creating temporal distrust.",
    "on_site_fact_conflict": "Different pages on the same domain state contradictory values for the same material specification or price tier.",
    "linked_contradiction": "First-party website claims diverge materially from verified external profiles linked via sameAs.",
    "uncorroborated": "High-stakes commercial claims lack external corroborating sources or third-party validation references.",
    "viewport_identity": "Landing page fails to present clear brand identity and value proposition in the initial viewport, risking 50ms credibility loss.",
    "sttf_fail": "Scroll-to-Text Fragment (#:~:text=) deep links generated by AI citations fail to highlight the target sentence on the page.",
    "scent_break": "Navigation and persistent wayfinding landmarks (breadcrumbs or nav) are absent, breaking information scent for referred visitors.",
    "ymy_disclosure": "Domain operates in a sensitive commercial or professional sector but lacks standard transparent disclaimers and organizational disclosures.",
    "coverage_statement": "Audit observed non-defect structural characteristics documenting crawl and sampling boundaries.",
}

_FINDING_WHY_AI_CARES: dict[str, str] = {
    "transport_unreachable": "Retrieval pipelines cannot evaluate or index a domain that fails socket-level or TLS handshakes.",
    "robots_disallow": "Compliant search engines and AI assistants strictly observe RFC 9309 Disallow rules before issuing HTTP requests.",
    "access_blocked": "Automated retrieval bots lack interactive JavaScript solvers or CAPTCHA solving capabilities.",
    "robots_fail_closed": "RFC 9309 mandates that a 5xx on robots.txt must halt all crawling across the origin to avoid overwhelming unstable servers.",
    "ai_token_disallow": "AI assistant vendors respect dedicated crawler tokens to avoid crawling unauthorized intellectual property.",
    "orphan": "Web crawlers prioritize crawl budgets using link centrality (PageRank/HITS) and sitemap inclusion; orphans are easily missed.",
    "trap_facet": "Bounded crawl budgets get exhausted fetching parameter combinations rather than substantive product pages.",
    "canonical_dup": "Dense retrieval and search engines require clear canonical signals to collapse duplicate documents into one authority.",
    "soft_404": "Crawlers ingest HTTP 200 response bodies as valid content, polluting vector embeddings with error text.",
    "noindex_robots_conflict": "If a crawler cannot fetch the page, it cannot process the noindex directive, leaving an ambiguous snippet in search indexes.",
    "js_fact_lock": "Retrieval crawlers frequently bypass full headless rendering to preserve throughput, indexing only static HTML payloads.",
    "interaction_insert": "Automated text extractors do not simulate user interaction, capturing only initially expanded DOM elements.",
    "d41_hidden": "Search parsers and LLM chunkers filter hidden DOM nodes to avoid indexing hidden SEO text or off-screen chrome.",
    "pdf_only_fact": "Fast retrieval engines prioritize HTML and often omit binary PDF parsing due to layout extraction complexity.",
    "image_locked_fact": "Text-based crawlers cannot read raster images without OCR, which is not universally executed in web search ingestion.",
    "qualifier_split": "Dense retrieval chunkers split text across fixed character/token windows, detaching qualifiers from values.",
    "table_no_th": "WikiTableQuestions research shows table QA accuracy drops drastically when cell-to-header relationships cannot be inferred.",
    "schema_visible_mismatch": "Google Structured Data Guidelines and LLM verification models penalize contradictory structured markup as untrustworthy.",
    "comparison_self_win": "Citation benchmarks show evaluators downrank unsubstantiated self-declarations as marketing bias.",
    "unanswerable": "Retrieval-augmented generation (RAG) requires sentence-level supporting fact spans (HotpotQA) to synthesize citations.",
    "wrong_page": "Query-page matching models (Broder intent classification) expect navigational and awareness answers on primary landing surfaces.",
    "expected_gap": "Archetype classification sets prior expectations for necessary content structures across commercial categories.",
    "flagship_gap": "Product-specific intent queries route to product URLs; weak product pages cause extraction failures at the point of decision.",
    "collision_risk": "Knowledge graph resolution models require unambiguous entity references (sameAs links to Wikidata, Wikipedia, Crunchbase).",
    "sameas_404": "Broken identity links signal abandoned profiles and degrade confidence during entity verification.",
    "date_divergence": "Temporal consistency checks penalize sites that claim recent updates while showing outdated substantive content.",
    "on_site_fact_conflict": "LLM verification steps check multi-document consistency; internal conflicts reduce passage trust scores.",
    "linked_contradiction": "Cross-web corroboration pipelines penalize claims that are directly refuted by authoritative canonical profiles.",
    "uncorroborated": "Assistants rely on cross-web agreement across independent sources to verify non-obvious facts.",
    "viewport_identity": "On-site engagement research shows visual credibility judgments form within 50ms; weak above-fold orientation causes bounces.",
    "sttf_fail": "Conversational assistants generate text-fragment URLs to land users directly on the quoted fact; broken anchors lose context.",
    "scent_break": "Information Foraging Theory demonstrates that visitors navigate based on continuous proximal cues (scent); missing nav drops scent.",
    "ymy_disclosure": "Search quality standards enforce strict transparency requirements for sensitive health and financial topics.",
    "coverage_statement": "Understanding crawl and sampling boundaries prevents misinterpreting coverage limits as site failures.",
}

_FINDING_POTENTIAL_CONSEQUENCES: dict[str, str] = {
    "transport_unreachable": "The domain is entirely inaccessible to automated crawlers and cannot be cited from first-party content.",
    "robots_disallow": "Compliant assistant crawlers skip these paths entirely, omitting their facts from real-time grounding.",
    "access_blocked": "Automated assistants receive block pages rather than brand content, omitting the site from search citation.",
    "robots_fail_closed": "Entire site becomes temporarily invisible to compliant search and AI retrieval agents.",
    "ai_token_disallow": "Assisted question-answering engines cannot fetch first-party content and may rely on third-party aggregators instead.",
    "orphan": "The unlinked page may not be indexed or refreshed, leaving its specifications absent from AI answers.",
    "trap_facet": "Core documentation and commercial landing pages get skipped during periodic indexing sweeps.",
    "canonical_dup": "Citation engines may link to outdated URL variants or split attribution weight across mirrors.",
    "soft_404": "AI assistants may quote error copy ('Page Not Found') as if it were a valid product or service specification.",
    "noindex_robots_conflict": "URLs remain indexed with generic snippet text without first-party descriptive content.",
    "js_fact_lock": "Unrendered facts are invisible to static scrapers, causing assistants to omit key product capabilities.",
    "interaction_insert": "Collapsed or dynamic disclosures are omitted from extracted brand text representations.",
    "d41_hidden": "Critical specifications placed in hidden tabs are excluded from the retrieval corpus.",
    "pdf_only_fact": "Information locked in PDFs is rarely cited in conversational answers compared to HTML-native facts.",
    "image_locked_fact": "Visual specifications cannot be matched against natural language buyer questions in conversational search.",
    "qualifier_split": "Assistants may quote unqualified price figures out of context, creating misleading buyer expectations.",
    "table_no_th": "Assistants misattribute features or limits to the wrong plan tier during comparative evaluation.",
    "schema_visible_mismatch": "Search systems disregard the structured data entirely, removing rich snippets and direct fact citations.",
    "comparison_self_win": "AI assistants discount the comparison claims, preferring third-party review sites or analyst reports instead.",
    "unanswerable": "When asked this core buyer question, conversational assistants hallucinate, refuse to answer, or cite competitors.",
    "wrong_page": "Assistants may fail to surface the answer for broad queries or link users to deep, confusing context.",
    "expected_gap": "Buyers evaluating the category find incomplete information compared to competing offerings in the same segment.",
    "flagship_gap": "Specific product queries fail to retrieve first-party evidence, even though the company brand is well-described.",
    "collision_risk": "AI assistants confuse the brand with the homonym entity, producing inaccurate or hallucinatory answers.",
    "sameas_404": "Entity resolution pipelines drop the broken reference, reducing the authority score of the brand.",
    "date_divergence": "Retrieval engines discount freshness signals, treating the content as potentially obsolete.",
    "on_site_fact_conflict": "Assistants cannot determine the authoritative truth, leading to hedging or misquoting of terms.",
    "linked_contradiction": "Trust scores drop, and the conflicting claims are flagged as uncorroborated or inaccurate.",
    "uncorroborated": "Uncorroborated claims may be framed with uncertainty or omitted in favor of verified claims.",
    "viewport_identity": "Visitors referred by AI citations land without immediate orientation, resulting in high bounce rates.",
    "sttf_fail": "Referred visitors land at the top of an irrelevant page section, losing the specific context that led them there.",
    "scent_break": "Visitors referred from external AI answers cannot explore deeper or transition into the commercial conversion funnel.",
    "ymy_disclosure": "Automated systems apply severe trust penalties, excluding the site from safety-sensitive answers.",
    "coverage_statement": "Informs the reader of audit boundaries without asserting false positive defects.",
}

_FINDING_CONSEQUENCE_CHAINS: dict[str, list[str]] = {
    "transport_unreachable": [
        "The seed connection failed before a target page could be fetched.",
        "No site content was available for the downstream extraction checks.",
        "The audit remains incomplete until the connection is restored and rerun.",
    ],
    "robots_disallow": [
        "robots.txt disallows the audit crawler on the requested path.",
        "The compliant crawler cannot retrieve the disallowed page for inspection.",
        "The report identifies the access policy without inferring content defects.",
    ],
    "access_blocked": [
        "The origin returned challenge, forbidden, or error responses for the sampled pages.",
        "No usable page content was available for downstream extraction checks in this run.",
        "The audit remains incomplete; content and business conclusions require a crawlable response.",
    ],
    "robots_fail_closed": [
        "robots.txt endpoint returned HTTP 5xx server failure during crawler pre-flight.",
        "RFC 9309 compliance requires automated crawlers to fail-closed and abort fetching all origin URLs.",
        "The entire domain is excluded from retrieval indexing until the robots.txt endpoint recovers.",
    ],
    "ai_token_disallow": [
        "Robots.txt contains selective User-Agent disallow directives targeted at AI crawler tokens.",
        "A crawler that honors the directive cannot retrieve the disallowed content for its index or retrieval corpus.",
        "Assistants relying on that corpus may have less first-party material available to cite for product queries.",
    ],
    "orphan": [
        "Discovered URL has zero internal inbound crawl links and is absent from XML sitemaps.",
        "A discovery crawler may not reach or associate the orphaned page with the rest of the site.",
        "The page may therefore be absent from retrieval contexts used to ground AI answers.",
    ],
    "trap_facet": [
        "Infinite facet parameters or calendar URL traps consume crawler request limits without unique content.",
        "A bounded crawler can spend its fetch budget on redundant parameter permutations.",
        "Core product and documentation pages may then be skipped during a crawl or refresh.",
    ],
    "canonical_dup": [
        "Duplicate URL variants with conflicting or missing canonical targets split ranking signals.",
        "A crawler may retain multiple competing versions of identical content, weakening canonical-source evidence.",
        "Retrieval systems may then have less reliable URL evidence for selecting an authoritative source.",
    ],
    "soft_404": [
        "Server returns HTTP 200 OK with missing/error page content instead of proper HTTP 404 or 410 status codes.",
        "A crawler may treat the returned error placeholder as page content if the response is otherwise parseable.",
        "A system grounding on that placeholder could produce incomplete or incorrect source-backed answers.",
    ],
    "noindex_robots_conflict": [
        "Page blocked by robots.txt contains a meta noindex tag that crawlers are forbidden from reading.",
        "Crawlers cannot reliably reconcile the inaccessible robots rule with the page-level noindex directive.",
        "Retrieval systems may treat the conflicting directives as insufficient evidence for citing the page.",
    ],
    "js_fact_lock": [
        "Critical brand facts, specifications, and pricing require client-side JavaScript execution to render.",
        "A lightweight extractor that reads only raw HTML receives empty containers instead of the rendered facts.",
        "An assistant relying on that representation would lack first-party grounding for the affected specifications.",
    ],
    "interaction_insert": [
        "Key facts and disclosures are injected into the DOM only after user interaction (clicks, tabs, accordions).",
        "A static extractor that does not trigger the interaction receives no copy for the inserted facts.",
        "The affected value propositions and terms may therefore be absent from automated extraction results.",
    ],
    "d41_hidden": [
        "Critical entity facts reside inside hidden or collapsed DOM structures (display:none, visibility:hidden, aria-hidden).",
        "Extractors may omit hidden elements when constructing a visible-content representation.",
        "Essential specifications may therefore be absent from downstream entity or retrieval representations.",
    ],
    "pdf_only_fact": [
        "Vital specifications, SLA terms, or disclosures are locked inside unindexed binary PDF documents.",
        "A fast text-only retrieval pipeline may bypass the non-HTML binary payload.",
        "Answers grounded only in that pipeline may omit the locked facts or require another accessible source.",
    ],
    "image_locked_fact": [
        "Key pricing tables or technical diagrams are rendered as raster images without semantic text alternatives.",
        "A text-only crawler may not extract the text embedded in the image, leaving a factual gap in its corpus.",
        "An assistant without that extracted evidence may be unable to provide the precise specification.",
    ],
    "qualifier_split": [
        "Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM.",
        "A chunker may separate the condition from the value across context windows.",
        "A system retrieving only the value could present an incomplete price or capability statement.",
    ],
    "table_no_th": [
        "Data tables lack semantic header cells (<th>) and proper row/column scope associations.",
        "A table parser may flatten the rows and columns into text without reliable relational semantics.",
        "A system using that representation may be unable to associate a value with the correct row or tier.",
    ],
    "schema_visible_mismatch": [
        "Schema.org structured JSON-LD data contradicts the human-visible HTML copy on the page.",
        "A verification pipeline identifies the internal discrepancy between structured and unstructured claims.",
        "The conflicting markup is penalized or excluded from authoritative answer grounding.",
    ],
    "comparison_self_win": [
        "Competitor comparison tables lack objective third-party corroboration and self-declare wins without proof.",
        "A retrieval evaluation model discounts the self-promotional claim in favor of neutral reviews.",
        "The brand's competitive advantages are omitted or presented with skepticism in generated comparisons.",
    ],
    "unanswerable": [
        "Crawl snapshot corpus lacks a clear supporting text span answering this foundational buyer question.",
        "Dense retrieval returns low similarity scores across all candidate passages for the intent query.",
        "The assistant either declines to answer or quotes an external third-party source for the basic fact.",
    ],
    "wrong_page": [
        "The answer exists in the site corpus but is located on a secondary URL rather than the primary landing page.",
        "The primary landing page fails passage relevance scoring for the corresponding buyer query.",
        "Assistants cite the deep technical URL or present a generic answer rather than routing to the commercial home.",
    ],
    "expected_gap": [
        "Site archetype classification identifies an expected informational surface that is absent in the crawl snapshot.",
        "Evaluators comparing the site against category norms flag missing foundational content.",
        "The brand appears less mature or transparent in automated comparative evaluations.",
    ],
    "flagship_gap": [
        "Dedicated product URLs contain lower text density and fewer structured facts than the brand homepage.",
        "Retrieval systems matching product-specific queries land on thin, uninformative product pages.",
        "Specific product capabilities are omitted from generative summaries despite strong brand-level presence.",
    ],
    "collision_risk": [
        "Brand entity name is linguistically ambiguous and lacks structured schema.org sameAs disambiguation.",
        "Entity resolution algorithms fail to map the domain to a distinct, authoritative knowledge graph node.",
        "Generative models mix entity attributes, conflating the brand with unrelated organizations or terms.",
    ],
    "sameas_404": [
        "Organization JSON-LD contains a sameAs profile link that resolves to HTTP 404 Not Found.",
        "Entity verification checks detect a broken external identity anchor.",
        "The site's structured authority claims are discounted due to unverified canonical anchors.",
    ],
    "date_divergence": [
        "Visible content dates diverge significantly from schema dateModified or sitemap lastmod values.",
        "Temporal consistency heuristics flag contradictory freshness timestamps on the same page.",
        "Retrieval algorithms downweight the page for recency-sensitive queries.",
    ],
    "on_site_fact_conflict": [
        "Internal crawl pages state conflicting values for the same material specification or price tier.",
        "Multi-document ingestion encounters contradictory facts originating from the same first-party domain.",
        "Generative assistants hedge their answers or cite outdated terms due to internal factual ambiguity.",
    ],
    "linked_contradiction": [
        "First-party website claims diverge materially from verified external profiles linked via sameAs.",
        "Corroboration checks detect contradictory factual claims between the site and its external profiles.",
        "Authoritative citations are withheld because the claims fail cross-web corroboration.",
    ],
    "uncorroborated": [
        "Material factual claims exist in isolation without corroboration from external sources.",
        "Retrieval verification systems identify the claim as an unverified single-source assertion.",
        "Assistants qualify or omit the claim when summarizing competitive capabilities.",
    ],
    "viewport_identity": [
        "Landing page fails to present clear brand identity and value proposition in the initial viewport.",
        "Visitors arriving from an AI citation lack immediate visual orientation and context confirmation.",
        "High bounce rates and low engagement follow because the page fails the 50ms credibility threshold.",
    ],
    "sttf_fail": [
        "AI assistant generates an STTF deep link targeting a specific quoted fact on the landing page.",
        "The page structure or dynamic DOM modification breaks the browser's native text fragment anchor.",
        "The visitor lands at the page top without highlighted context, causing immediate drop-off.",
    ],
    "scent_break": [
        "Referred landing page lacks persistent navigation landmarks, breadcrumbs, or clear next-step cues.",
        "Information scent is broken because the visitor cannot determine where they are in the site hierarchy.",
        "The visitor abandons the session rather than transitioning to conversion or inquiry surfaces.",
    ],
    "ymy_disclosure": [
        "Site content touches sensitive commercial or professional topics without expected transparency disclosures.",
        "Safety and quality evaluation heuristics detect missing compliance and organizational disclaimers.",
        "Retrieval systems avoid citing the domain for high-stakes user inquiries.",
    ],
    "coverage_statement": [
        "Audit crawler reached designated sampling boundaries or encountered uniform metadata signals.",
        "The engine documents the crawl parameters to prevent false positive interpretations.",
        "The finding serves as an audit limitation record rather than an actionable defect.",
    ],
}


def _business_impact(f: Finding, exposure: str, reach: str, sampled: int) -> dict:
    confirmed = max(0, int(f.affected_pages_count or 0))
    ft = f.finding_type
    interp = _FINDING_INTERPRETATIONS.get(ft, (
        f"Observed structural condition '{f.title}' can reduce how reliably automated systems "
        "discover, parse, or hand off from this site."
    ))
    why_care = _FINDING_WHY_AI_CARES.get(ft, (
        "Automated retrieval and extraction pipelines require unambiguous, reachable first-party text "
        "to ground factual summaries."
    ))
    conseq = _FINDING_POTENTIAL_CONSEQUENCES.get(ft, (
        "The affected information may be omitted, misattributed, or harder to verify during automated retrieval."
    ))
    category = _DIMENSION.get(f.skill_id, "discoverability")
    return {
        "technicalFinding": f.title,
        "businessInterpretation": interp,
        "whyAiSystemsCare": why_care,
        "whoIsAffected": "Prospective buyers and evaluators seeking verified information about the brand via automated retrieval or AI assistants.",
        "potentialConsequence": conseq,
        "categories": [category],
        "quantifiedImpact": f"Confirmed on {confirmed} sampled page(s); sampled-page count={sampled}. No revenue estimate is made.",
        "assumptions": ["Mechanism-level assessment based on observed DOM and crawl structure; no live assistant query was performed."],
        "expectedOutcomeAfterFix": "First-party evidence becomes directly extractable and verifiable by compliant crawlers and retrieval pipelines.",
        "reachTier": reach,
        "businessExposureSeverity": exposure,
    }


def _consequence_chain(f: Finding) -> list[str]:
    chain = _FINDING_CONSEQUENCE_CHAINS.get(f.finding_type)
    if chain:
        return list(chain)
    return [
        f"Observed structural condition: {f.title}.",
        "This condition may reduce the completeness or reliability of the evidence available to a retrieval system.",
        "A downstream answer may therefore need qualification, another source, or a different handoff path.",
    ]

def _exposure(f: Finding, sampled: int) -> str:
    # qualifier_split is heuristic extractability evidence. Even when it
    # affects a shared template, it cannot establish Critical business
    # exposure without independent corroboration of a real offer defect.
    if f.finding_type == "qualifier_split":
        return "high"
    # Table header markup flaws are structural extraction defects;
    # they cannot establish Critical business exposure without complete access block.
    if f.finding_type == "table_no_th":
        return "high" if f.affected_pages_count > 1 else "medium"
    question = str(f.metrics.get("question_id", "")).upper()
    if question in {"K6", "K13"} or f.finding_type in _DECISION or f.finding_type == "ymyl_no_disclaimer":
        priority = "high"
    elif question in {"K4", "K5"} or f.finding_type in _CONSIDERATION:
        priority = "medium"
    else:
        priority = "low"
    broad = f.finding_type in {"robots_fail_closed", "ai_token_disallow"} or f.affected_pages_count / max(sampled, 1) >= .5
    cluster = not broad and (f.affected_pages_count > 1 or f.affected_pages_count / max(sampled, 1) >= .1)
    if priority == "high": return "critical" if broad or cluster else "high"
    if priority == "medium": return "high" if broad or cluster else "medium"
    return "medium" if broad else "low"

def annotate(findings: list[Finding], sampled_pages: int, per_question: dict | None = None) -> dict:
    """Return report extras using only canonical findings and existing severity data."""
    dimensions = ("discoverability", "understanding", "trust", "engagement")
    scored = {d: 90 for d in dimensions}
    deductions = {"critical": 14, "high": 9, "medium": 5, "low": 2}
    enriched = []
    for f in findings:
        dimension = _DIMENSION.get(f.skill_id, "understanding")
        exposure = _exposure(f, sampled_pages)
        ratio = f.affected_pages_count / max(sampled_pages, 1)
        reach = "Broad" if f.finding_type in {"robots_fail_closed", "ai_token_disallow"} or ratio >= .5 else ("Cluster" if ratio >= .1 or f.affected_pages_count > 1 else "Isolated")
        f.metrics["businessExposureSeverity"] = exposure
        f.metrics["dimension"] = dimension
        scored[dimension] -= deductions.get(f.severity, 5)
        enriched.append({
            "id": f.id,
            "finding_type": f.finding_type,
            "finding_key": f.finding_key,
            "title": f.title,
            "severity": f.severity,
            "businessExposureSeverity": exposure,
            "evidence": f.evidence,
            "suggested_action": f.suggested_action.to_public(),
            "confidence": f.confidence,
            "confidence_basis": f.confidence_basis or "deterministic",
            "evidence_tier": f.evidence_tier or "OBS",
            "contributing_skills": f.contributing_skills if f.contributing_skills else ([f.skill_id] if f.skill_id else []),
            "coverage_basis": f.metrics.get("coverage_basis", f"{sampled_pages} sampled page(s)"),
            "affected_pages": f.affected_pages_count,
            "sampled_pages": sampled_pages,
            "blast_radius": {
                "reach_tier": reach,
                "affected_pages": f.affected_pages_count,
                "sampled_pages": sampled_pages,
                "confirmed": True,
                "text": f"Confirmed on {f.affected_pages_count} of {sampled_pages} sampled page(s); no site-wide extrapolation asserted.",
            },
            "funnelStage": "decision" if str(f.metrics.get("question_id", "")).upper() in {"K6", "K13"} or f.finding_type in _DECISION else ("consideration" if f.finding_type in _CONSIDERATION else "awareness"),
            "consequenceChain": _consequence_chain(f),
            "businessImpact": _business_impact(f, exposure, reach, sampled_pages),
            "buyerQuestionScorecard": _scorecard(per_question),
        })
    dimension_scores = [{"dimension": d, "score": max(15, min(96, scored[d]))} for d in dimensions]
    overall_index = round(sum(x["score"] for x in dimension_scores) / len(dimension_scores))
    top = sorted(enriched, key=lambda x: ({"critical": 4, "high": 3, "medium": 2, "low": 1}[x["businessExposureSeverity"]], {"critical": 4, "high": 3, "medium": 2, "low": 1}[x["severity"]]), reverse=True)[:3]
    return {"findings": enriched, "dimension_scores": dimension_scores, "overall_index": overall_index,
            "top3PriorityActions": [{"finding_id": x["id"], "summary": x["suggested_action"]["summary"], "priority": x["suggested_action"]["priority"]} for x in top],
            "buyer_question_scorecard": _scorecard(per_question)}


def run(snapshot, user_findings: list[Finding] | None = None, sampled_pages: int | None = None) -> "SkillResult":
    """Callable skill entrypoint: annotates findings and returns dimension scores."""
    from lib.models import SkillResult
    findings_list = user_findings if user_findings is not None else []
    pages = sampled_pages if sampled_pages is not None else (len(snapshot.pages) if snapshot and hasattr(snapshot, "pages") else 0)
    result = annotate(findings_list, pages)
    return SkillResult(
        skill_id="business-impact-layer",
        run_id=getattr(snapshot, "run_id", "run-0"),
        findings=[],  # no new findings; annotation only
        metrics=result,
        timing_ms=0.0,
    )
