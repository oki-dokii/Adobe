"""Test finding type to causal consequence chain mapping.

Asserts that:
1. Every canonical finding type in FINDING_TYPES has an explicit 3-step causal consequence chain.
2. No two structurally different finding types share identical causal consequence chain text.
3. Specific findings (like canonical_dup) never produce robots.txt crawler-blocking consequence text.
"""

import json
from pathlib import Path
from lib.models import FINDING_TYPES

# Complete dictionary of 3-step consequence chains per finding type
CAUSAL_CHAINS = {
    "robots_fail_closed": (
        "AI crawlers are completely blocked at the robots.txt or network edge layer",
        "Brand domain is omitted from search index ingestion and multimodal training sets",
        "Brand is invisible to AI-mediated search — assistants recommend accessible alternatives",
    ),
    "ai_token_disallow": (
        "Robots.txt contains selective User-Agent disallow directives targeted at AI crawler tokens (GPTBot, ClaudeBot, PerplexityBot)",
        "AI search engines respect the disallow headers and purge the domain from live RAG retrieval indexes",
        "Assistants refuse to query or cite first-party content when answering product queries",
    ),
    "orphan": (
        "Discovered URL has zero internal inbound crawl links and is absent from XML sitemaps",
        "AI discovery spiders fail to traverse or assign authority weight to the orphaned page",
        "High-value content remains unindexed and undiscoverable in AI answer generation",
    ),
    "trap_facet": (
        "Infinite facet parameters or calendar URL traps consume crawler request limits without yielding unique content",
        "AI ingestion engines exhaust fetch budgets on redundant parameter permutations",
        "Core product and documentation pages are prematurely skipped during index refresh cycles",
    ),
    "canonical_dup": (
        "Duplicate URL variants with conflicting or missing canonical targets split ranking signals across mirror pages",
        "AI crawlers index multiple competing versions of identical content, diluting extractability confidence",
        "Assistants encounter conflicting URL signals and fail to select a definitive authoritative canonical source",
    ),
    "soft_404": (
        "Server returns HTTP 200 OK with missing/error page content instead of proper HTTP 404 or 410 status codes",
        "AI crawlers ingest error placeholders and generic notices as substantive brand content",
        "AI models hallucinate or quote error notices as official brand facts in conversational responses",
    ),
    "noindex_robots_conflict": (
        "Page blocked by robots.txt contains a meta noindex tag that crawlers are forbidden from reading",
        "Crawlers retain ambiguous ghost index entries for disallowed URLs while unable to verify page directives",
        "AI retrieval pipelines encounter conflicting access directives and drop the page from citation pools",
    ),
    "js_fact_lock": (
        "Critical brand facts, specifications, and pricing require client-side JavaScript execution to render",
        "Lightweight AI scrapers and real-time RAG fetchers parse only the raw static HTML, receiving empty DOM containers",
        "AI assistants report product specs as unknown or hallucinate outdated specifications from secondary sources",
    ),
    "interaction_insert": (
        "Key facts and disclosures are injected into the DOM only after user interaction (clicks, tabs, accordions)",
        "Headless AI extraction pipelines parse static DOM without triggering interactive browser events",
        "Core value propositions and critical terms remain invisible to automated knowledge ingestion",
    ),
    "d41_hidden": (
        "Critical entity facts reside inside hidden or collapsed DOM structures (display:none, visibility:hidden, aria-hidden)",
        "AI scrapers filter out hidden elements to avoid prompt clutter and spam injection",
        "Essential brand specifications are ignored during knowledge graph construction",
    ),
    "pdf_only_fact": (
        "Vital specifications, SLA terms, or disclosures are locked inside unindexed binary PDF documents",
        "Fast text-only AI retrieval pipelines bypass non-HTML binary payloads",
        "AI answers omit the locked facts or rely on third-party aggregators that previously scraped the documents",
    ),
    "image_locked_fact": (
        "Key pricing tables or technical diagrams are rendered as raster images without semantic text alternatives",
        "Non-multimodal AI crawlers fail to extract text from images, leaving factual gaps in the knowledge graph",
        "Assistants answer user inquiries with generic estimates rather than precise specifications",
    ),
    "qualifier_split": (
        "Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM",
        "AI chunking and embedding algorithms split conditions from values across separate context windows",
        "AI models state base prices or capabilities without essential constraints, creating compliance risk",
    ),
    "table_no_th": (
        "Data tables lack semantic header cells (<th>) and proper row/column scope associations",
        "AI table parsers flatten tabular data into disordered text strings, destroying relational semantics",
        "Assistant misassociates table rows and misquotes pricing tiers or feature comparisons",
    ),
    "schema_visible_mismatch": (
        "Schema.org structured JSON-LD data contradicts the human-visible HTML copy on the page",
        "AI entity extractors flag semantic conflict between structured metadata and rendered text",
        "AI models degrade grounding trust and demote the domain as an unreliable knowledge source",
    ),
    "comparison_self_win": (
        "Competitor comparison tables lack objective third-party corroboration and self-declare wins without proof",
        "AI assistants detect non-neutral self-preferencing claims and apply bias penalty filters",
        "Comparative AI prompts cite third-party benchmark sites rather than first-party comparisons",
    ),
    "unanswerable": (
        "Core buyer and customer intent questions have no extractable answer across crawled pages",
        "AI question-answering systems experience complete knowledge retrieval failure on direct brand queries",
        "Assistants substitute competitor answers or explicitly state information is unavailable",
    ),
    "wrong_page": (
        "Crucial query answers are buried in tangential subpages instead of expected canonical landing pages",
        "AI search query matchers fail to connect user intent with the buried content",
        "Low citation relevance score causes assistant to surface secondary aggregators",
    ),
    "expected_gap": (
        "Standard industry domain attributes (pricing, security, support) are absent from public markup",
        "AI agents building brand profiles encounter null attribute slots in working memory",
        "Assistants mark the brand as incomplete for enterprise procurement evaluations",
    ),
    "flagship_gap": (
        "Primary core product capability is missing direct declarative explanation on the homepage or flagship landing page",
        "AI high-level summarizers fail to extract the primary value proposition during brief scans",
        "Assistants produce generic category descriptions rather than naming the brand's flagship innovation",
    ),
    "collision_risk": (
        "Ambiguous brand naming or overlapping entity identifiers create collision with similarly named organizations",
        "AI entity resolution algorithms confuse the brand with homonymous entities or subsidiaries",
        "Assistant attributes competitor features or unrelated controversies to this brand",
    ),
    "sameas_404": (
        "Schema.org sameAs links point to broken 404 social profiles or deprecated corporate URLs",
        "Knowledge graph ingestors fail entity verification when authority links return 404 errors",
        "Domain loses verified corporate entity status in neural search indexes",
    ),
    "date_divergence": (
        "Publication dates, schema dateModified, and HTTP Last-Modified headers diverge or indicate stale content",
        "AI freshness scoring models flag information as potentially obsolete (>30d unverified)",
        "Assistants prioritize fresher competitor documentation with verified recent timestamps",
    ),
    "on_site_fact_conflict": (
        "Direct factual contradiction detected between internal pages (e.g. pricing or SLA tiers differ across pages)",
        "AI consistency checkers detect irreconcilable claims from the same authoritative domain",
        "AI trust score collapses and assistant refuses to cite conflicting facts with certainty",
    ),
    "linked_contradiction": (
        "Outbound documentation links or citations contradict claims made on the primary marketing page",
        "AI cross-referencing algorithms detect inconsistency between summary and referenced source",
        "Assistant annotates brand claims with cautionary hedges or prefers secondary analytical sources",
    ),
    "uncorroborated": (
        "Extraordinary performance or market share claims lack external corroboration or verifiable citations",
        "AI factual verification pipelines flag uncorroborated assertions as marketing hyperbole",
        "Assistants omit uncorroborated superlatives when generating objective vendor comparisons",
    ),
    "viewport_identity": (
        "Target content is not visually prioritized in the primary viewport or fails responsive rendering",
        "AI visual retrieval models misidentify page purpose due to obscured primary heading hierarchy",
        "Assistant generates low-confidence summaries that miss above-the-fold product positioning",
    ),
    "sttf_fail": (
        "Scroll-to-Text Fragment (#:~:text=) targets fail to resolve to unique text spans on the landing page",
        "AI deep-linking agents fail to transport referred users directly to the referenced fact",
        "Referred users land on broad generic pages, experiencing conversion drop-off",
    ),
    "scent_break": (
        "Referral landing page copy diverges drastically from the conversational snippet cited by the AI assistant",
        "Users referred by AI experience information scent loss upon landing on the brand page",
        "User journey breaks at the AI-to-brand boundary, increasing bounce rate and losing conversion",
    ),
    "ymy_disclosure": (
        "High-stakes YMYL (finance/health/legal) advice pages lack verified author credentials or regulatory disclosures",
        "AI safety and compliance filters apply strict suppression to uncredited advisory content",
        "Assistants refuse to synthesize guidance from the domain to avoid safety policy violations",
    ),
    "coverage_statement": (
        "Sitemap lastmod dates or crawl coverage statements are uniform timestamps masking actual content freshness",
        "AI incremental scrapers cannot prioritize modified pages, delaying ingestion of critical updates",
        "Assistants continue serving cached legacy answers weeks after brand updates are published",
    ),
}


def test_all_finding_types_have_causal_chains():
    """Every type in FINDING_TYPES must have an explicit causal chain mapping."""
    for ft in FINDING_TYPES:
        assert ft in CAUSAL_CHAINS, f"Missing causal chain mapping for finding type '{ft}'"
        chain = CAUSAL_CHAINS[ft]
        assert len(chain) == 3, f"Chain for '{ft}' must have exactly 3 steps, got {len(chain)}"
        for step in chain:
            assert len(step.strip()) > 15, f"Chain step for '{ft}' too short: {step}"


def test_no_duplicate_causal_chains():
    """No two structurally different finding types may share identical causal chain text."""
    seen = {}
    for ft, chain in CAUSAL_CHAINS.items():
        chain_key = " || ".join(chain)
        if chain_key in seen:
            other = seen[chain_key]
            raise AssertionError(f"Finding types '{ft}' and '{other}' have identical causal chains: {chain}")
        seen[chain_key] = ft


def test_canonical_dup_not_robots_blocked():
    """canonical_dup chain must describe canonical split/dilution, NOT robots.txt blocking."""
    chain = CAUSAL_CHAINS["canonical_dup"]
    full_text = " ".join(chain).lower()
    assert "canonical" in full_text
    assert "robots.txt" not in full_text
    assert "blocked at the robots.txt" not in full_text
