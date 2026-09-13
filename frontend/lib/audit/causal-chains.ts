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
  robots_fail_closed: [
    'AI crawlers are completely blocked at the robots.txt or network edge layer',
    'Brand domain is omitted from search index ingestion and multimodal training sets',
    'Brand is invisible to AI-mediated search — assistants recommend accessible alternatives',
  ],
  ai_token_disallow: [
    'Robots.txt contains selective User-Agent disallow directives targeted at AI crawler tokens (GPTBot, ClaudeBot, PerplexityBot)',
    'AI search engines respect the disallow headers and purge the domain from live RAG retrieval indexes',
    'Assistants refuse to query or cite first-party content when answering product queries',
  ],
  orphan: [
    'Discovered URL has zero internal inbound crawl links and is absent from XML sitemaps',
    'AI discovery spiders fail to traverse or assign authority weight to the orphaned page',
    'High-value content remains unindexed and undiscoverable in AI answer generation',
  ],
  trap_facet: [
    'Infinite facet parameters or calendar URL traps consume crawler request limits without yielding unique content',
    'AI ingestion engines exhaust fetch budgets on redundant parameter permutations',
    'Core product and documentation pages are prematurely skipped during index refresh cycles',
  ],
  canonical_dup: [
    'Duplicate URL variants with conflicting or missing canonical targets split ranking signals across mirror pages',
    'AI crawlers index multiple competing versions of identical content, diluting extractability confidence',
    'Assistants encounter conflicting URL signals and fail to select a definitive authoritative canonical source',
  ],
  soft_404: [
    'Server returns HTTP 200 OK with missing/error page content instead of proper HTTP 404 or 410 status codes',
    'AI crawlers ingest error placeholders and generic notices as substantive brand content',
    'AI models hallucinate or quote error notices as official brand facts in conversational responses',
  ],
  noindex_robots_conflict: [
    'Page blocked by robots.txt contains a meta noindex tag that crawlers are forbidden from reading',
    'Crawlers retain ambiguous ghost index entries for disallowed URLs while unable to verify page directives',
    'AI retrieval pipelines encounter conflicting access directives and drop the page from citation pools',
  ],

  // ── Render & Static Extractability ─────────────────────────────────────────
  js_fact_lock: [
    'Critical brand facts, specifications, and pricing require client-side JavaScript execution to render',
    'Lightweight AI scrapers and real-time RAG fetchers parse only the raw static HTML, receiving empty DOM containers',
    'AI assistants report product specs as unknown or hallucinate outdated specifications from secondary sources',
  ],
  interaction_insert: [
    'Key facts and disclosures are injected into the DOM only after user interaction (clicks, tabs, accordions)',
    'Headless AI extraction pipelines parse static DOM without triggering interactive browser events',
    'Core value propositions and critical terms remain invisible to automated knowledge ingestion',
  ],
  d41_hidden: [
    'Critical entity facts reside inside hidden or collapsed DOM structures (display:none, visibility:hidden, aria-hidden)',
    'AI scrapers filter out hidden elements to avoid prompt clutter and spam injection',
    'Essential brand specifications are ignored during knowledge graph construction',
  ],
  pdf_only_fact: [
    'Vital specifications, SLA terms, or disclosures are locked inside unindexed binary PDF documents',
    'Fast text-only AI retrieval pipelines bypass non-HTML binary payloads',
    'AI answers omit the locked facts or rely on third-party aggregators that previously scraped the documents',
  ],
  image_locked_fact: [
    'Key pricing tables or technical diagrams are rendered as raster images without semantic text alternatives',
    'Non-multimodal AI crawlers fail to extract text from images, leaving factual gaps in the knowledge graph',
    'Assistants answer user inquiries with generic estimates rather than precise specifications',
  ],
  qualifier_split: [
    'Crucial condition terms, asterisks, or disclaimers are physically separated from their associated numbers in the DOM',
    'AI chunking and embedding algorithms split conditions from values across separate context windows',
    'AI models state base prices or capabilities without essential constraints, creating compliance risk',
  ],
  table_no_th: [
    'Data tables lack semantic header cells (<th>) and proper row/column scope associations',
    'AI table parsers flatten tabular data into disordered text strings, destroying relational semantics',
    'Assistant misassociates table rows and misquotes pricing tiers or feature comparisons',
  ],
  schema_visible_mismatch: [
    'Schema.org structured JSON-LD data contradicts the human-visible HTML copy on the page',
    'AI entity extractors flag semantic conflict between structured metadata and rendered text',
    'AI models degrade grounding trust and demote the domain as an unreliable knowledge source',
  ],

  // ── AI Answerability & Entity Identity ─────────────────────────────────────
  comparison_self_win: [
    'Competitor comparison tables lack objective third-party corroboration and self-declare wins without proof',
    'AI assistants detect non-neutral self-preferencing claims and apply bias penalty filters',
    'Comparative AI prompts cite third-party benchmark sites rather than first-party comparisons',
  ],
  unanswerable: [
    'Core buyer and customer intent questions have no extractable answer across crawled pages',
    'AI question-answering systems experience complete knowledge retrieval failure on direct brand queries',
    'Assistants substitute competitor answers or explicitly state information is unavailable',
  ],
  wrong_page: [
    'Crucial query answers are buried in tangential subpages instead of expected canonical landing pages',
    'AI search query matchers fail to connect user intent with the buried content',
    'Low citation relevance score causes assistant to surface secondary aggregators',
  ],
  expected_gap: [
    'Standard industry domain attributes (pricing, security, support) are absent from public markup',
    'AI agents building brand profiles encounter null attribute slots in working memory',
    'Assistants mark the brand as incomplete for enterprise procurement evaluations',
  ],
  flagship_gap: [
    'Primary core product capability is missing direct declarative explanation on the homepage or flagship landing page',
    'AI high-level summarizers fail to extract the primary value proposition during brief scans',
    'Assistants produce generic category descriptions rather than naming the brand\'s flagship innovation',
  ],
  collision_risk: [
    'Ambiguous brand naming or overlapping entity identifiers create collision with similarly named organizations',
    'AI entity resolution algorithms confuse the brand with homonymous entities or subsidiaries',
    'Assistant attributes competitor features or unrelated controversies to this brand',
  ],
  sameas_404: [
    'Schema.org sameAs links point to broken 404 social profiles or deprecated corporate URLs',
    'Knowledge graph ingestors fail entity verification when authority links return 404 errors',
    'Domain loses verified corporate entity status in neural search indexes',
  ],

  // ── Freshness & Corroboration ──────────────────────────────────────────────
  date_divergence: [
    'Publication dates, schema dateModified, and HTTP Last-Modified headers diverge or indicate stale content',
    'AI freshness scoring models flag information as potentially obsolete (>30d unverified)',
    'Assistants prioritize fresher competitor documentation with verified recent timestamps',
  ],
  on_site_fact_conflict: [
    'Direct factual contradiction detected between internal pages (e.g. pricing or SLA tiers differ across pages)',
    'AI consistency checkers detect irreconcilable claims from the same authoritative domain',
    'AI trust score collapses and assistant refuses to cite conflicting facts with certainty',
  ],
  linked_contradiction: [
    'Outbound documentation links or citations contradict claims made on the primary marketing page',
    'AI cross-referencing algorithms detect inconsistency between summary and referenced source',
    'Assistant annotates brand claims with cautionary hedges or prefers secondary analytical sources',
  ],
  uncorroborated: [
    'Extraordinary performance or market share claims lack external corroboration or verifiable citations',
    'AI factual verification pipelines flag uncorroborated assertions as marketing hyperbole',
    'Assistants omit uncorroborated superlatives when generating objective vendor comparisons',
  ],

  // ── Engagement Handoff & Presentation ──────────────────────────────────────
  viewport_identity: [
    'Target content is not visually prioritized in the primary viewport or fails responsive rendering',
    'AI visual retrieval models misidentify page purpose due to obscured primary heading hierarchy',
    'Assistant generates low-confidence summaries that miss above-the-fold product positioning',
  ],
  sttf_fail: [
    'Scroll-to-Text Fragment (#:~:text=) targets fail to resolve to unique text spans on the landing page',
    'AI deep-linking agents fail to transport referred users directly to the referenced fact',
    'Referred users land on broad generic pages, experiencing conversion drop-off',
  ],
  scent_break: [
    'Site lacks persistent wayfinding signals (breadcrumbs, nav landmark, or visible links to commercial/contact pages) on hierarchical page templates',
    'AI-referred users who land on any page other than the exact cited page cannot self-navigate to the relevant content — recovery paths are absent from the DOM',
    'Bounce rate rises as referred users abandon rather than drill down; AI citation converts to zero engagement because the destination architecture does not close the referral loop',
  ],
  ymy_disclosure: [
    'High-stakes YMYL (finance/health/legal) advice pages lack verified author credentials or regulatory disclosures',
    'AI safety and compliance filters apply strict suppression to uncredited advisory content',
    'Assistants refuse to synthesize guidance from the domain to avoid safety policy violations',
  ],
  coverage_statement: [
    'Sitemap lastmod dates or crawl coverage statements are uniform timestamps masking actual content freshness',
    'AI incremental scrapers cannot prioritize modified pages, delaying ingestion of critical updates',
    'Assistants continue serving cached legacy answers weeks after brand updates are published',
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
    'AI ingestion algorithms degrade confidence score when extracting first-party brand specifications',
    'Assistant falls back to generalized category descriptions or third-party secondary sources',
  ]
}
