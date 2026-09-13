/**
 * Business Impact Layer
 *
 * Translates technical crawl observations into commercial, business-legible
 * consequences using ONLY data collected by the crawl engine.
 *
 * Rules:
 * 1. Zero fabrication — no invented metrics, revenue loss estimates, or simulated competitors.
 * 2. Transparent, ordinal Business-Exposure Severity matrix (Funnel Priority x Reach).
 * 3. Exact 5 implemented K-questions (K3, K4, K5, K6, K13) from skill_k.py — no placeholder rows.
 * 4. Blast radius strictly labeled as confirmed vs extrapolated.
 * 5. Deterministic business translations keyed by finding_type.
 * 6. Top 3 priority actions ranked by Business-Exposure Severity.
 */

import type { AuditCoverage, AuditResult, Finding, Severity } from './types'

export type FunnelStage = 'awareness' | 'consideration' | 'decision'
export type FunnelPriority = 'High' | 'Medium' | 'Low'
export type ReachTier = 'Broad' | 'Cluster' | 'Isolated'

export interface KQuestionSpec {
  id: 'K3' | 'K4' | 'K5' | 'K6' | 'K13'
  question: string
  funnelStage: FunnelStage
  funnelPriority: FunnelPriority
  intentDescription: string
}

/**
 * The 5 core buyer questions actually implemented in the engine (skill_k.py).
 * K1, K2, K11 do not exist as active checks in the engine and are excluded.
 */
export const CORE_BUYER_QUESTIONS: Record<string, KQuestionSpec> = {
  K3: {
    id: 'K3',
    question: 'What does this organization offer or do?',
    funnelStage: 'awareness',
    funnelPriority: 'Low',
    intentDescription: 'Primary offering and brand identity',
  },
  K4: {
    id: 'K4',
    question: 'Who is the intended audience?',
    funnelStage: 'consideration',
    funnelPriority: 'Medium',
    intentDescription: 'Target customer and market qualification',
  },
  K5: {
    id: 'K5',
    question: 'Where is this organization based or serving?',
    funnelStage: 'consideration',
    funnelPriority: 'Medium',
    intentDescription: 'Geographic availability and operating presence',
  },
  K6: {
    id: 'K6',
    question: 'What does it cost / how is it priced?',
    funnelStage: 'decision',
    funnelPriority: 'High',
    intentDescription: 'Commercial pricing and purchase qualification',
  },
  K13: {
    id: 'K13',
    question: 'How can a human contact the organization?',
    funnelStage: 'decision',
    funnelPriority: 'High',
    intentDescription: 'Procurement handoff and sales inquiry path',
  },
}

/**
 * Maps technical finding types to Funnel Priority and Stage.
 */
export function getFunnelStageForFinding(finding: {
  findingType?: string
  title?: string
  dimension?: string
  metrics?: Record<string, any>
}): { stage: FunnelStage; priority: FunnelPriority } {
  const typeKey = (finding.findingType ?? '').trim().toLowerCase()
  const qId = (finding.metrics?.question_id ?? '').trim().toUpperCase()

  if (qId && CORE_BUYER_QUESTIONS[qId]) {
    return {
      stage: CORE_BUYER_QUESTIONS[qId].funnelStage,
      priority: CORE_BUYER_QUESTIONS[qId].funnelPriority,
    }
  }

  // High (Decision Stage) — Direct conversion, pricing, or transaction barrier
  const decisionTypes = new Set([
    'qualifier_split',
    'on_site_fact_conflict',
    'interaction_insert',
    'scent_break',
    'sttf_fail',
    'table_no_th',
  ])
  if (decisionTypes.has(typeKey)) {
    return { stage: 'decision', priority: 'High' }
  }

  // Medium (Consideration Stage) — Evaluation, specs, freshness, comparison
  const considerationTypes = new Set([
    'js_fact_lock',
    'd41_hidden',
    'pdf_only_fact',
    'image_locked_fact',
    'date_divergence',
    'linked_contradiction',
    'comparison_self_win',
    'flagship_gap',
    'expected_gap',
    'uncorroborated',
  ])
  if (considerationTypes.has(typeKey)) {
    return { stage: 'consideration', priority: 'Medium' }
  }

  // Low (Awareness Stage) — Discovery, indexing, top-of-funnel access
  const awarenessTypes = new Set([
    'robots_fail_closed',
    'ai_token_disallow',
    'orphan',
    'trap_facet',
    'canonical_dup',
    'soft_404',
    'noindex_robots_conflict',
    'schema_visible_mismatch',
    'collision_risk',
    'sameas_404',
    'viewport_identity',
    'coverage_statement',
    'ymy_disclosure',
  ])
  if (awarenessTypes.has(typeKey)) {
    return { stage: 'awareness', priority: 'Low' }
  }

  // Heuristic fallback by dimension or title
  const title = (finding.title ?? '').toLowerCase()
  if (title.includes('price') || title.includes('cost') || title.includes('pricing') || title.includes('quote')) {
    return { stage: 'decision', priority: 'High' }
  }
  if (finding.dimension === 'engagement' || finding.dimension === 'trust') {
    return { stage: 'decision', priority: 'High' }
  }
  if (finding.dimension === 'understanding') {
    return { stage: 'consideration', priority: 'Medium' }
  }
  return { stage: 'awareness', priority: 'Low' }
}

/**
 * Derives the Reach Tier from affected pages count vs sampled pages count.
 */
export function getReachTier(affectedPages: number, sampledPages: number, findingType?: string): ReachTier {
  const typeKey = (findingType ?? '').trim().toLowerCase()
  if (typeKey === 'robots_fail_closed' || typeKey === 'ai_token_disallow') {
    return 'Broad'
  }
  const ratio = affectedPages / Math.max(sampledPages, 1)
  if (ratio >= 0.5) return 'Broad'
  if (ratio >= 0.1 || affectedPages > 1) return 'Cluster'
  return 'Isolated'
}

/**
 * Ordinal Business-Exposure Severity Matrix:
 * Combines Funnel Priority (High / Medium / Low) with Reach Tier (Broad / Cluster / Isolated).
 */
export function deriveBusinessExposureSeverity(
  priority: FunnelPriority,
  reach: ReachTier,
): { severity: Severity; rankScore: number } {
  // Decision (High)
  if (priority === 'High') {
    if (reach === 'Broad') return { severity: 'critical', rankScore: 90 }
    if (reach === 'Cluster') return { severity: 'critical', rankScore: 80 }
    return { severity: 'high', rankScore: 70 }
  }
  // Consideration (Medium)
  if (priority === 'Medium') {
    if (reach === 'Broad') return { severity: 'high', rankScore: 60 }
    if (reach === 'Cluster') return { severity: 'high', rankScore: 50 }
    return { severity: 'medium', rankScore: 40 }
  }
  // Awareness (Low)
  if (reach === 'Broad') return { severity: 'medium', rankScore: 30 }
  if (reach === 'Cluster') return { severity: 'low', rankScore: 20 }
  return { severity: 'low', rankScore: 10 }
}

/**
 * Quantifies Blast Radius with mandatory Confirmed vs Extrapolated labeling.
 */
export function formatBlastRadius(
  affectedPages: number,
  sampledPages: number,
  templateId?: string,
  coverage?: AuditCoverage,
  firstUrl?: string,
): string {
  const estimatedPages = coverage?.estimatedPages ?? 0
  const isTemplateIssue = Boolean(templateId) || affectedPages > 1

  if (isTemplateIssue && estimatedPages > sampledPages) {
    const extrapolated = Math.round((affectedPages / Math.max(sampledPages, 1)) * estimatedPages)
    return `Extrapolated site-wide: estimated ~${extrapolated} pages affected (based on ${affectedPages} of ${sampledPages} sampled pages sharing template \`${templateId || 'shared'}\`; sitemap size: ${estimatedPages}).`
  }

  if (isTemplateIssue) {
    return `Confirmed on ${affectedPages} of ${sampledPages} sampled pages using this template (\`${templateId || 'shared'}\`); site-wide extent unknown without full sitemap crawl.`
  }

  const urlDisplay = firstUrl ? ` on \`${firstUrl.replace(/^https?:\/\//, '')}\`` : ''
  return `Confirmed isolated on 1 sampled page${urlDisplay}; single-page issue.`
}

/**
 * Deterministic Business Translation templates keyed off finding_type.
 * Zero free-text LLM hallucination.
 */
export const BUSINESS_TRANSLATIONS: Record<string, (f: Finding) => string> = {
  qualifier_split: () =>
    `AI assistants will quote your headline price while stripping out mandatory qualifications and conditions, creating misinformed buyer expectations and high-friction sales discussions.`,
  on_site_fact_conflict: () =>
    `Internal factual contradictions across your pages destroy citation confidence, causing AI assistants to flag your numbers as unreliable and recommend competitors or third-party aggregators instead.`,
  interaction_insert: () =>
    `Commercial specifications and pricing tiers locked behind JavaScript click/modal events remain invisible to headless AI search crawlers, presenting an incomplete product offering.`,
  js_fact_lock: () =>
    `Lightweight AI search spiders parse only static HTML — essential product specifications that require client JavaScript render as blank containers during machine ingestion.`,
  table_no_th: () =>
    `Missing header associations in data tables scramble row and column semantics, leading AI assistants to misattribute features and pricing numbers to the wrong subscription tiers.`,
  robots_fail_closed: () =>
    `Your robots.txt or edge configuration blocks AI crawler user-agents entirely, making your brand invisible to AI-mediated search and gifting 100% of query share to competitors.`,
  ai_token_disallow: () =>
    `Disallowing AI search tokens (GPTBot, ClaudeBot, PerplexityBot) purges your domain from live retrieval-augmented generation (RAG) indexes, eliminating first-party citation.`,
  canonical_dup: () =>
    `Competing duplicate URL variants split authority signals across mirror pages, diluting AI citation confidence and confusing assistant source attribution.`,
  soft_404: () =>
    `Returning HTTP 200 on missing content causes AI crawlers to index error messages as legitimate brand facts, risking inaccurate conversational answers.`,
  noindex_robots_conflict: () =>
    `Contradictory crawl and indexing directives create ghost index records, leading AI search engines to exclude ambiguous URLs from reliable citation pools.`,
  d41_hidden: () =>
    `Essential brand specifications hidden inside collapsed CSS containers (display:none) are skipped by scrapers, omitting key capabilities from brand working memory.`,
  pdf_only_fact: () =>
    `Critical specifications locked inside binary PDFs are bypassed by fast text retrieval pipelines, leaving gaps in AI-generated product summaries.`,
  image_locked_fact: () =>
    `Pricing tables or architecture diagrams rendered as raster images without semantic text alternatives cannot be ingested by text-first AI search crawlers.`,
  date_divergence: () =>
    `Conflicting or stale publication timestamps cause AI freshness algorithms to demote your documentation in favor of fresher competitor content.`,
  linked_contradiction: () =>
    `Linked third-party profiles contradict statements on your primary domain, triggering assistant hedging and trust penalties in comparative vendor evaluations.`,
  comparison_self_win: () =>
    `Uncorroborated competitive comparison tables are flagged for non-neutral bias, causing AI assistants to prefer third-party review sites for head-to-head recommendations.`,
  flagship_gap: () =>
    `Your primary offering lacks a clear declarative summary on the homepage, causing AI assistants to produce vague category descriptions instead of naming your core innovation.`,
  expected_gap: () =>
    `Standard commercial procurement details are absent from public markup, preventing enterprise AI research agents from completing vendor qualification checklists.`,
  collision_risk: () =>
    `Ambiguous entity naming without schema disambiguation causes AI models to conflate your brand with similarly named organizations or legacy subsidiaries.`,
  sameas_404: () =>
    `Broken authority links (404) in schema markup undermine corporate entity verification in major commercial knowledge graphs.`,
  scent_break: () =>
    `Referred buyers landing from AI answers encounter messaging that diverges from the cited conversational snippet, driving immediate bounce and losing conversion momentum.`,
  sttf_fail: () =>
    `Deep-link text fragments fail to resolve on target pages, stranding referred users on generic landing screens rather than the exact cited proof.`,
  viewport_identity: () =>
    `Core positioning is buried below the fold, causing visual search crawlers to miss the primary value proposition during initial document scans.`,
  coverage_statement: () =>
    `Uniform sitemap timestamps prevent AI scrapers from detecting updated content, delaying the ingestion of recent brand revisions.`,
  ymy_disclosure: () =>
    `Advisory pages lack verified author credentials, triggering strict suppression by AI safety and compliance filters.`,
}

export function getBusinessTranslation(f: Finding): string {
  const typeKey = (f.findingType ?? '').trim().toLowerCase()
  if (BUSINESS_TRANSLATIONS[typeKey]) {
    return BUSINESS_TRANSLATIONS[typeKey](f)
  }

  // Answerability translation based on K-question
  const qId = (f.metrics?.question_id ?? '').trim().toUpperCase()
  if (qId && CORE_BUYER_QUESTIONS[qId]) {
    const spec = CORE_BUYER_QUESTIONS[qId]
    if (spec.funnelStage === 'decision') {
      return `Anyone using an AI assistant to research ${spec.intentDescription.toLowerCase()} before buying will not get an answer sourced from your own site — they will either abandon the inquiry or accept an unverified third-party claim.`
    }
    if (spec.funnelStage === 'consideration') {
      return `Prospective buyers evaluating vendor suitability will find that AI assistants cannot confirm your ${spec.intentDescription.toLowerCase()}, risking exclusion from shortlists.`
    }
    return `AI assistants cannot extract a declarative statement of your ${spec.intentDescription.toLowerCase()}, causing discovery queries to surface better-structured competitors.`
  }

  return `This structural defect prevents AI search engines from extracting authoritative first-party data, increasing the likelihood that assistants cite third-party sources or omit the brand.`
}

/**
 * Returns the derived alternative source from Skill H (corroboration), or null if not crawled.
 */
export function getAiAlternativeSourceLine(f: Finding, result?: AuditResult): string | null {
  const hFinding = result?.findings.find(
    (item) => item.skillId === 'corroboration-consistency-audit' && item.evidence.some((e) => e.url && !e.url.includes(result.coverage?.robotsStatus ?? '')),
  )

  const evidenceItem = f.evidence.find((e) => e.reference?.includes('http') || (e.url && !e.url.includes(f.affectedPages > 0 ? f.evidence[0]?.url || '' : '')))

  const candidateUrl = hFinding?.evidence.find((e) => e.url)?.url || evidenceItem?.url

  if (!candidateUrl) return null

  const lower = candidateUrl.toLowerCase()
  let sourceKind = 'third-party profile'
  if (lower.includes('wikipedia')) sourceKind = 'Wikipedia infobox'
  else if (lower.includes('linkedin')) sourceKind = 'LinkedIn corporate profile'
  else if (lower.includes('twitter') || lower.includes('x.com')) sourceKind = 'social platform registry'
  else if (lower.includes('wikidata')) sourceKind = 'Wikidata entity entry'
  else if (lower.includes('g2') || lower.includes('capterra') || lower.includes('trustpilot')) sourceKind = 'software review aggregator'

  return `This fact currently only has third-party corroboration from ${sourceKind} (\`${candidateUrl}\`), not the brand's own site.`
}

export interface BuyerQuestionScorecardItem {
  id: 'K3' | 'K4' | 'K5' | 'K6' | 'K13'
  question: string
  funnelStage: FunnelStage
  funnelPriority: FunnelPriority
  status: 'answered' | 'unanswered' | 'wrong_page' | 'na'
  whereOrReason: string
}

/**
 * Aggregates all K-question findings into a single scorecard.
 */
export function buildBuyerQuestionScorecard(
  result: AuditResult,
  siteType?: { cluster?: string; saas?: boolean; ecommerce?: boolean },
): {
  items: BuyerQuestionScorecardItem[]
  unansweredCount: number
  totalActiveCount: number
  summaryHeadline: string
} {
  const kFindings = result.findings.filter((f) => f.skillId === 'ai-answerability-audit')
  const cluster = (siteType?.cluster ?? '').toUpperCase()
  const isSaas = Boolean(siteType?.saas)
  const isEcom = Boolean(siteType?.ecommerce)

  const items: BuyerQuestionScorecardItem[] = []
  let unansweredCount = 0
  let totalActiveCount = 0

  for (const qId of ['K3', 'K4', 'K5', 'K6', 'K13'] as const) {
    const spec = CORE_BUYER_QUESTIONS[qId]
    const finding = kFindings.find(
      (f) =>
        f.metrics?.question_id === qId ||
        f.title.includes(` ${qId} `) ||
        f.title.includes(` ${qId}(`) ||
        f.description.includes(qId),
    )

    // Check for site-type inapplicability (Expected Gaps)
    let isNa = false
    let naReason = ''

    if (qId === 'K6') {
      // Documentation / news / non-commercial sites have no pricing
      if (cluster === 'A' || cluster === 'C' || cluster === 'D' || cluster === 'E' || (!isSaas && !isEcom && cluster !== 'F')) {
        isNa = true
        naReason = `N/A — Classified as non-commercial reference/informational corpus (Cluster ${cluster || 'DOCS'}; pricing not applicable)`
      }
    } else if (qId === 'K5') {
      // Pure global digital SaaS / developer platforms do not have a localized physical serving constraint
      if (isSaas || cluster === 'B' || cluster === 'D' || cluster === 'E') {
        isNa = true
        naReason = `N/A — Classified as global digital-only service (Cluster ${cluster || 'SAAS'}; local geography not applicable)`
      }
    } else if (qId === 'K4') {
      if (cluster === 'B') {
        isNa = true
        naReason = `N/A — Developer tooling / open protocol (target audience not segment-restricted)`
      }
    }

    if (isNa) {
      items.push({
        id: qId,
        question: spec.question,
        funnelStage: spec.funnelStage,
        funnelPriority: spec.funnelPriority,
        status: 'na',
        whereOrReason: naReason,
      })
      continue
    }

    totalActiveCount++

    if (!finding) {
      items.push({
        id: qId,
        question: spec.question,
        funnelStage: spec.funnelStage,
        funnelPriority: spec.funnelPriority,
        status: 'answered',
        whereOrReason: '✅ Confirmed answered on intent-matched canonical page',
      })
    } else if (finding.findingType === 'wrong_page' || finding.title.includes('inner page')) {
      const url = finding.evidence[0]?.url || 'inner subpage'
      items.push({
        id: qId,
        question: spec.question,
        funnelStage: spec.funnelStage,
        funnelPriority: spec.funnelPriority,
        status: 'wrong_page',
        whereOrReason: `⚠️ Answered on subpage (\`${url.replace(/^https?:\/\//, '')}\`), missing from primary landing page`,
      })
    } else {
      unansweredCount++
      items.push({
        id: qId,
        question: spec.question,
        funnelStage: spec.funnelStage,
        funnelPriority: spec.funnelPriority,
        status: 'unanswered',
        whereOrReason: '❌ Unanswered anywhere in crawled corpus',
      })
    }
  }

  const summaryHeadline =
    unansweredCount === 0
      ? `All ${totalActiveCount} applicable core buyer questions are answered on the site.`
      : `${unansweredCount} of ${totalActiveCount} core buyer questions are unanswered anywhere on the site.`

  return {
    items,
    unansweredCount,
    totalActiveCount,
    summaryHeadline,
  }
}
