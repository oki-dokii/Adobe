/**
 * Explicit Finding Type -> Causal Consequence Chain mapping.
 *
 * Each finding type has a dedicated 3-step cascade describing its exact physical mechanism:
 * [1] Structural/Crawl Layer Barrier -> [2] AI Ingest & Retrieval Degradation -> [3] Downstream Assistant / Business Consequence.
 *
 * Every finding type in FINDING_TYPES MUST resolve to a distinct, unique consequence chain.
 */

export const FINDING_TYPE_CAUSAL_CHAINS: Record<string, [string, string, string]> = {
  // ── Crawl Access & Discovery ──────────────────────────────────────────────
  transport_unreachable: [
    'The seed connection failed before a target page could be fetched',
    'No site content was available for the downstream extraction checks',
    'The audit remains incomplete until the connection is restored and rerun',
  ],
  robots_disallow: [
    'robots.txt disallows the audit crawler on the requested path',
    'The compliant crawler cannot retrieve the disallowed page for inspection',
    'The report identifies the access policy without inferring content defects',
  ],
  access_blocked: [
    'The origin returned challenge, forbidden, or error responses for the sampled pages',
    'No usable page content was available for downstream extraction checks in this run',
    'The audit remains incomplete; content and business conclusions require a crawlable response',
  ],
  robots_fail_closed: [
    'AI crawlers are completely blocked at the robots.txt or network edge layer',
    'This prevents compliant AI crawlers from retrieving the domain for their indexes or retrieval systems',
    'The resulting access gap may lower the likelihood that AI-generated answers can cite first-party content',
  ],
  ai_token_disallow: [
    'Robots.txt contains selective User-Agent disallow directives targeted at AI crawler tokens (GPTBot, ClaudeBot, PerplexityBot)',
    'A crawler that honors the directive cannot retrieve the disallowed content for its index or retrieval corpus',
    'Assistants relying on that corpus may have less first-party material available to cite for product queries',
  ],
  orphan: [
    'Discovered URL has zero internal inbound crawl links and is absent from XML sitemaps',
    'A discovery crawler may not reach or associate the orphaned page with the rest of the site',
    'The page may therefore be absent from retrieval contexts used to ground AI answers',
  ],
  trap_facet: [
    'Infinite facet parameters or calendar URL traps consume crawler request limits without yielding unique content',
    'A bounded crawler can spend its fetch budget on redundant parameter permutations',
    'Core product and documentation pages may then be skipped during a crawl or refresh',
  ],
  canonical_dup: [
    'Duplicate URL variants with conflicting or missing canonical targets split ranking signals across mirror pages',
    'A crawler may retain multiple competing versions of identical content, weakening canonical-source evidence',
    'Retrieval systems may then have less reliable URL evidence for selecting an authoritative source',
  ],
  soft_404: [
    'Server returns HTTP 200 OK with missing/error page content instead of proper HTTP 404 or 410 status codes',
    'A crawler may treat the returned error placeholder as page content if the response is otherwise parseable',
    'A system grounding on that placeholder could produce incomplete or incorrect source-backed answers',
  ],
  noindex_robots_conflict: [
    'Page blocked by robots.txt contains a meta noindex tag that crawlers are forbidden from reading',
    'Crawlers cannot reliably reconcile the inaccessible robots rule with the page-level noindex directive',
    'Retrieval systems may treat the conflicting directives as insufficient evidence for citing the page',
  ],

  // ── Render & Static Extractability ─────────────────────────────────────────
  js_fact_lock: [
    'Critical brand facts, specifications, and pricing require client-side JavaScript execution to render',
    'A lightweight extractor that reads only raw HTML receives empty containers instead of the rendered facts',
    'An assistant relying on that representation would lack first-party grounding for the affected specifications',
  ],
  interaction_insert: [
    'Key facts and disclosures are injected into the DOM only after user interaction (clicks, tabs, accordions)',
    'A static extractor that does not trigger the interaction receives no copy for the inserted facts',
    'The affected value propositions and terms may therefore be absent from automated extraction results',
  ],
  d41_hidden: [
    'Critical entity facts reside inside hidden or collapsed DOM structures (display:none, visibility:hidden, aria-hidden)',
    'Extractors may omit hidden elements when constructing a visible-content representation',
    'Essential specifications may therefore be absent from downstream entity or retrieval representations',
  ],
  pdf_only_fact: [
    'Vital specifications, SLA terms, or disclosures are locked inside unindexed binary PDF documents',
    'A fast text-only retrieval pipeline may bypass the non-HTML binary payload',
    'Answers grounded only in that pipeline may omit the locked facts or require another accessible source',
  ],
  image_locked_fact: [
    'Key pricing tables or technical diagrams are rendered as raster images without semantic text alternatives',
    'A text-only crawler may not extract the text embedded in the image, leaving a factual gap in its corpus',
    'An assistant without that extracted evidence may be unable to provide the precise specification',
  ],
  qualifier_split: [
    'Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM',
    'A chunker may separate the condition from the value across context windows',
    'A system retrieving only the value could present an incomplete price or capability statement',
  ],
  table_no_th: [
    'Data tables lack semantic header cells (<th>) and proper row/column scope associations',
    'A table parser may flatten the rows and columns into text without reliable relational semantics',
    'A system using that representation may be unable to associate a value with the correct row or tier',
  ],
  schema_visible_mismatch: [
    'Schema.org structured JSON-LD data contradicts the human-visible HTML copy on the page',
    'An entity extractor may observe conflicting values between structured metadata and visible text',
    'A retrieval system may consequently assign lower confidence to the conflicting first-party evidence',
  ],

  // ── AI Answerability & Entity Identity ─────────────────────────────────────
  comparison_self_win: [
    'Competitor comparison tables lack objective third-party corroboration and self-declare wins without proof',
    'A reviewer or retrieval system may treat unsupported self-preferencing as weaker comparative evidence',
    'A response generator may therefore prefer independently supported comparison sources when available',
  ],
  unanswerable: [
    'Core buyer and customer intent questions have no extractable answer across crawled pages',
    'An assistant relying on this site as a source would have no extractable answer to ground a response',
    'The assistant may need to abstain or use another source rather than cite this site for the question',
  ],
  wrong_page: [
    'Crucial query answers are buried in tangential subpages instead of expected canonical landing pages',
    'A query matcher may have weaker evidence connecting the user intent to the buried content',
    'A response system may consequently prefer a more directly aligned source when one is available',
  ],
  expected_gap: [
    'Standard industry domain attributes (pricing, security, support) are absent from public markup',
    'An automated brand-profile extractor may leave the corresponding attribute unpopulated',
    'A procurement-oriented answer may therefore require qualification or another source for that attribute',
  ],
  flagship_gap: [
    'Primary core product capability is missing direct declarative explanation on the homepage or flagship landing page',
    'A brief extractor may not capture the primary value proposition from the sampled landing page',
    'A summary grounded in that sample may describe the category without the flagship differentiator',
  ],
  collision_risk: [
    'Ambiguous brand naming or overlapping entity identifiers create collision with similarly named organizations',
    'An entity-resolution system may have insufficient evidence to distinguish the name from homonymous entities',
    'A response grounded on the wrong entity could attribute unrelated features or claims to this brand',
  ],
  sameas_404: [
    'Schema.org sameAs links point to broken 404 social profiles or deprecated corporate URLs',
    'A knowledge-graph importer cannot verify the authority link while it returns a 404 response',
    'Downstream entity representations may consequently retain weaker verification evidence for the domain',
  ],

  // ── Freshness & Corroboration ──────────────────────────────────────────────
  date_divergence: [
    'Publication dates, schema dateModified, and HTTP Last-Modified headers diverge or indicate stale content',
    'A freshness-aware retriever may treat the unverified timestamp as weaker recency evidence',
    'A response system may prefer a more recently verified source when competing evidence is available',
  ],
  on_site_fact_conflict: [
    'Direct factual contradiction detected between internal pages (e.g. pricing or SLA tiers differ across pages)',
    'A consistency checker may detect irreconcilable claims from the same domain',
    'A response system may reduce confidence or qualify its answer rather than cite either claim without context',
  ],
  linked_contradiction: [
    'Outbound documentation links or citations contradict claims made on the primary marketing page',
    'A cross-reference process may detect inconsistency between the summary and its linked source',
    'A response system may qualify the claim or seek another source instead of treating the summary as settled evidence',
  ],
  uncorroborated: [
    'Extraordinary performance or market share claims lack external corroboration or verifiable citations',
    'A factual-verification process may treat an uncorroborated assertion as weaker evidence',
    'A response system may omit or qualify the superlative when generating an objective comparison',
  ],

  // ── Engagement Handoff & Presentation ──────────────────────────────────────
  viewport_identity: [
    'Target content is not visually prioritized in the primary viewport or fails responsive rendering',
    'A visual extractor may have weaker evidence for page purpose when the primary heading hierarchy is obscured',
    'A summary grounded on that viewport may miss the above-the-fold product positioning',
  ],
  sttf_fail: [
    'Scroll-to-Text Fragment (#:~:text=) targets fail to resolve to unique text spans on the landing page',
    'An AI-referred user may not be transported directly to the referenced fact',
    'Referred users land on broad generic pages, experiencing conversion drop-off',
  ],
  scent_break: [
    'Site lacks persistent wayfinding signals (breadcrumbs, nav landmark, or visible links to commercial/contact pages) on hierarchical page templates',
    'An AI-referred visitor who lands away from the exact cited page may lack a DOM-based path to the relevant content',
    'The referral may therefore lose information scent and require extra navigation before the visitor can act',
  ],
  ymy_disclosure: [
    'High-stakes YMYL (finance/health/legal) advice pages lack verified author credentials or regulatory disclosures',
    'A safety-aware system may have insufficient author and disclosure evidence for the advisory content',
    'A response system may qualify, limit, or decline to synthesize guidance from that content',
  ],
  coverage_statement: [
    'Sitemap lastmod dates or crawl coverage statements are uniform timestamps masking actual content freshness',
    'An incremental scraper may have weaker evidence for prioritizing the modified pages',
    'A downstream retrieval system may continue using older material until the update is discovered and ingested',
  ],
}

/**
 * Returns a tailored 3-step causal consequence chain for a given finding.
 * Priority:
 * 1. Finding's explicit finding_type
 * 2. Title / keyword pattern heuristics
 * 3. Default fallback based on finding category / skill
 */
export function getCausalChainForFinding(finding: {
  finding_type?: string
  title?: string
  skillId?: string
  description?: string
}): string[] {
  const typeKey = (finding.finding_type ?? '').trim().toLowerCase()
  if (typeKey && FINDING_TYPE_CAUSAL_CHAINS[typeKey]) {
    return [...FINDING_TYPE_CAUSAL_CHAINS[typeKey]]
  }

  const title = (finding.title ?? '').toLowerCase()

  if (title.includes('canonical') || title.includes('duplicate')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.canonical_dup]
  }
  if (title.includes('robots') && (title.includes('token') || title.includes('disallow') || title.includes('block'))) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.ai_token_disallow]
  }
  if (title.includes('robots') || title.includes('closed') || title.includes('crawl')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.robots_fail_closed]
  }
  if (title.includes('soft 404') || title.includes('soft-404') || title.includes('200 ok')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.soft_404]
  }
  if (title.includes('javascript') || title.includes('hydration') || title.includes('client-rendered') || title.includes('empty shell')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.js_fact_lock]
  }
  if (title.includes('hidden') || title.includes('display:none') || title.includes('aria-hidden')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.d41_hidden]
  }
  if (title.includes('pdf') || title.includes('document')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.pdf_only_fact]
  }
  if (title.includes('image') || title.includes('raster') || title.includes('diagram')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.image_locked_fact]
  }
  if (title.includes('qualifier') || title.includes('condition') || title.includes('split')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.qualifier_split]
  }
  if (title.includes('table') || title.includes('<th>')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.table_no_th]
  }
  if (title.includes('schema') || title.includes('json-ld') || title.includes('mismatch')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.schema_visible_mismatch]
  }
  if (title.includes('contradiction') || title.includes('conflict') || title.includes('inconsistent')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.on_site_fact_conflict]
  }
  if (title.includes('stale') || title.includes('date') || title.includes('freshness') || title.includes('lastmod')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.date_divergence]
  }
  if (title.includes('unanswerable') || title.includes('missing answer') || title.includes('gap')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.unanswerable]
  }
  if (title.includes('handoff') || title.includes('action') || title.includes('conversion') || title.includes('referral')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.scent_break]
  }
  if (title.includes('collision') || title.includes('identity') || title.includes('sameas')) {
    return [...FINDING_TYPE_CAUSAL_CHAINS.collision_risk]
  }

  // Generic fallback if no specific rule matched
  return [
    `Structural extraction barrier identified: "${finding.title || 'Data accessibility defect'}"`,
    'A retrieval process may have weaker evidence when extracting first-party brand specifications',
    'A response system may require qualification or another source instead of relying on the affected content',
  ]
}
