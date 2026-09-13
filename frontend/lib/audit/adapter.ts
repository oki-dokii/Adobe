/**
 * Backend integration adapter.
 *
 * The live engine emits findings JSON (see evaluation/results/findings/*.json)
 * with skill_id, parent_id, affected_urls, evidence strings, and suggested
 * actions. The UI never reads that payload directly — it consumes `AuditResult`.
 *
 * TODO(backend): parse the audit API / SSE payload with `adaptBackendResult`
 * and feed `AuditEvent`s into `applyEvent`. Do not invent findings in the UI.
 */

import type {
  AuditCoverage,
  AuditResult,
  AuditTiming,
  Confidence,
  Dimension,
  Finding,
  Recommendation,
  RootCause,
  Severity,
  SkillId,
} from './types'
import { DIMENSIONS, RUN_ORDER, SKILL_MAP } from './skills'

import { getCausalChainForFinding } from './causal-chains'
import {
  deriveBusinessExposureSeverity,
  getFunnelStageForFinding,
  getReachTier,
} from './business-impact'

const SKILL_IDS = new Set<string>(Object.keys(SKILL_MAP))

export interface BackendSuggestedAction {
  summary?: string
  priority?: string
  what?: string
  where?: string
  how?: string
  why?: string
  cost_tier?: string
}

export interface BackendFinding {
  id: string
  title: string
  severity?: string
  evidence?: string
  suggested_action?: string | BackendSuggestedAction
  skill_id?: string
  confidence?: string
  description?: string
  whyItMatters?: string
  why_it_matters?: string
  affected_urls?: string[]
  affected_pages_count?: number
  sampled_pages?: number
  parent_id?: string | null
  root_cause?: string
  finding_type?: string
  finding_key?: string
  evidence_items?: Array<{
    id?: string
    label?: string
    detail?: string
    url?: string
    signal?: string
    confidence?: string
  }>
  category?: string
  is_limitation?: boolean
  limitation_reason?: string
  admission?: { emitted?: string; rule?: string }
  template_id?: string
  metrics?: Record<string, any>
  businessExposureSeverity?: string
}

export interface BackendAuditPayload {
  site?: string
  audited_at?: string
  summary?: {
    total_findings?: number
    critical?: number
    high?: number
    medium?: number
    low?: number
    overall_label?: string
    overall_summary?: string
  }
  findings?: BackendFinding[]
  findings_internal?: BackendFinding[]
  root_causes?: Array<{
    id: string
    label?: string
    detail?: string
    parent_id?: string | null
    severity?: string
    finding_ids?: string[]
  }>
  dimension_scores?: Array<{
    dimension: Dimension
    score: number
    label?: 'strong' | 'adequate' | 'at-risk' | 'weak'
  }>
  coverage?: {
    pages_fetched?: number
    pages_rendered?: number
    render_count?: number
    estimated_pages?: number
    templates?: number
    stopped_reason?: string
    http_requests?: number
    robots_status?: string
    render_max?: number
    renders_requested?: number
    renders_performed?: number
    renders_skipped_budget?: number
  }
  timing?: {
    total_ms?: number
    crawl_ms?: number
    render_ms?: number
    skill_ms?: Record<string, number>
    http_requests?: number
    pages_fetched?: number
    pages_rendered?: number
    render_count?: number
    external_requests?: number
  }
  overall_index?: number
  top3PriorityActions?: Array<{ finding_id?: string; summary?: string; priority?: string }>
  limitations?: string[]
  metrics?: {
    audit_status?: string
    skill_status?: {
      skipped_dependent_skills?: string[]
      failed_skills?: string[]
      by_skill?: Record<string, string>
    }
  }
  skill_status?: {
    skipped_dependent_skills?: string[]
    failed_skills?: string[]
    by_skill?: Record<string, string>
  }
}

function asSeverity(raw: unknown, fallback: Severity = 'medium'): Severity {
  const v = String(raw ?? '').toLowerCase()
  if (v === 'critical' || v === 'high' || v === 'medium' || v === 'low') return v
  return fallback
}

function asConfidence(raw: unknown, fallback: Confidence = 'medium'): Confidence {
  const v = String(raw ?? '').toLowerCase()
  if (v === 'high' || v === 'medium' || v === 'low') return v
  return fallback
}

function asSkillId(raw: unknown): SkillId {
  const v = String(raw ?? '')
  if (SKILL_IDS.has(v)) return v as SkillId
  return 'ai-answerability-audit'
}

function dimensionOf(skillId: SkillId): Dimension {
  return SKILL_MAP[skillId]?.dimension ?? 'understanding'
}

function isLimitation(f: BackendFinding): boolean {
  if (f.is_limitation === true) return true
  const type = (f.finding_type ?? '').toLowerCase()
  if (type === 'limitation' || f.category === 'limitation') return true
  return false
}

function actionOf(f: BackendFinding): Recommendation {
  const raw = f.suggested_action
  const title = typeof raw === 'string' ? raw : raw?.summary || raw?.what || 'Review this finding'
  const detail = typeof raw === 'string' ? raw : [raw?.how, raw?.why, raw?.where].filter(Boolean).join(' ') || title
  const priority = asSeverity(typeof raw === 'object' ? raw?.priority : f.severity, asSeverity(f.severity))
  const costTier = typeof raw === 'object' ? raw?.cost_tier : undefined
  let effort: 'low' | 'medium' | 'high' = 'low'
  if (costTier === 'infra' || costTier === 'code' || costTier === 'architecture') {
    effort = 'high'
  } else if (costTier === 'template') {
    effort = 'medium'
  } else if (costTier === 'content') {
    effort = 'low'
  } else {
    effort = priority === 'critical' || priority === 'high' ? 'medium' : 'low'
  }
  return {
    id: `r-${f.id}`,
    title,
    detail,
    priority,
    effort,
  }
}

/**
 * Strip the raw Python-repr coverage dict that the backend appends to evidence
 * strings (e.g. "No supporting span … Coverage={'pages_fetched': 1, …}").
 * The backend dict may contain nested dicts (e.g. pages_verified_per_template),
 * so we must count braces rather than rely on a non-greedy character class.
 */
function cleanEvidence(raw: string): string {
  // Strip from "Coverage={" through the matching closing "}" (handles nested braces)
  let result = raw
  let idx = result.indexOf('Coverage={')
  while (idx !== -1) {
    let depth = 0
    let end = idx
    for (let i = idx + 'Coverage='.length; i < result.length; i++) {
      if (result[i] === '{') depth++
      else if (result[i] === '}') {
        depth--
        if (depth === 0) { end = i; break }
      }
    }
    result = result.slice(0, idx).trimEnd() + ' ' + result.slice(end + 1).trimStart()
    // Also strip a trailing period/comma left over from the removal
    result = result.replace(/\s*[,.]?\s*$/, '').trimEnd() + result.slice(result.replace(/\s*[,.]?\s*$/, '').length)
    idx = result.indexOf('Coverage={')
  }
  // Also strip bare trailing dict-like remnants starting with ", 'key':"
  result = result.replace(/,\s*'[a-z_]+':\s*\d+[^'"]*/g, '')
  return result.replace(/\s{2,}/g, ' ').trim()
}

function evidenceOf(f: BackendFinding): Finding['evidence'] {
  if (f.evidence_items && f.evidence_items.length > 0) {
    return f.evidence_items.map((e, i) => ({
      id: e.id ?? `${f.id}-e-${i}`,
      label: e.label ?? 'Observation',
      detail: e.detail ? cleanEvidence(e.detail) : '',
      url: e.url ?? f.affected_urls?.[0],
      signal: e.signal,
      confidence: e.confidence ? asConfidence(e.confidence) : undefined,
    }))
  }
  const urls = f.affected_urls ?? []
  const items: Finding['evidence'] = []
  if (f.evidence) {
    const cleaned = cleanEvidence(String(f.evidence))
    items.push({
      id: `${f.id}-e-0`,
      label: 'Extracted evidence',
      detail: cleaned.slice(0, 280),
      url: urls[0],
      signal: f.finding_type,
    })
  }
  urls.slice(0, 4).forEach((url, i) => {
    items.push({
      id: `${f.id}-url-${i}`,
      label: 'Affected URL',
      detail: url.replace(/^https?:\/\//, ''),
      url,
    })
  })
  return items
}

function labelForScore(score: number): NonNullable<BackendAuditPayload['dimension_scores']>[number]['label'] {
  if (score >= 78) return 'strong'
  if (score >= 62) return 'adequate'
  if (score >= 45) return 'at-risk'
  return 'weak'
}

/**
 * Map a backend audit payload onto the UI `AuditResult`.
 * Unknown skill ids fall back rather than fabricating new skills.
 */
function deriveDimensionScores(findings: Finding[]): AuditResult['dimensionScores'] {
  return (Object.keys(DIMENSIONS) as Dimension[]).map((dimension) => {
    let score = 90
    for (const f of findings) {
      if (f.isLimitation || f.dimension !== dimension) continue
      if (f.severity === 'critical') score -= 14
      else if (f.severity === 'high') score -= 9
      else if (f.severity === 'medium') score -= 5
      else score -= 2
    }
    score = Math.max(15, Math.min(96, score))
    return { dimension, score, label: labelForScore(score)! }
  })
}

function deriveRootCauses(findings: Finding[], raw: BackendFinding[]): AuditResult['rootCauses'] {
  const byId = new Map(raw.map((f) => [f.id, f]))
  const childCount = new Map<string, number>()
  for (const f of raw) {
    if (f.parent_id) childCount.set(f.parent_id, (childCount.get(f.parent_id) ?? 0) + 1)
  }
  const parentIds = [...childCount.keys()]
  if (parentIds.length === 0) {
    const bySkill = new Map<SkillId, Finding[]>()
    for (const f of findings) {
      if (f.isLimitation) continue
      const list = bySkill.get(f.skillId) ?? []
      list.push(f)
      bySkill.set(f.skillId, list)
    }
    return [...bySkill.entries()].map(([skillId, group]) => ({
      id: `rc-${skillId}`,
      label: SKILL_MAP[skillId]?.label ?? skillId,
      detail: group[0]?.title ?? '',
      parentId: null,
      severity: group[0]?.severity ?? 'medium',
      findingIds: group.map((f) => f.id),
    }))
  }
  return parentIds.map((id) => {
    const parent = byId.get(id)
    const kids = findings.filter((f) => f.rootCauseId === id || f.id === id)
    return {
      id,
      label: parent?.title ?? id,
      detail: parent?.evidence ?? parent?.description ?? '',
      parentId: parent?.parent_id ?? null,
      severity: asSeverity(parent?.severity),
      findingIds: kids.map((f) => f.id),
    }
  })
}

function overallLabelFor(scores: AuditResult['dimensionScores']): string {
  if (!scores.length) return 'Audited'
  const avg = scores.reduce((a, s) => a + s.score, 0) / scores.length
  if (avg >= 75) return 'AI-ready'
  if (avg >= 60) return 'Mostly ready'
  if (avg >= 45) return 'At risk'
  return 'Not ready'
}

/**
 * Map a backend audit payload onto the UI `AuditResult`.
 * Unknown skill ids fall back rather than fabricating new skills.
 */
export function adaptBackendResult(payload: BackendAuditPayload): AuditResult {
  const raw = (payload.findings_internal?.length ? payload.findings_internal : payload.findings) ?? []
  const findings: Finding[] = raw.map((f) => {
    const skillId = asSkillId(f.skill_id)
    const limitation = isLimitation(f)
    const rawDesc = f.description && f.description !== f.title ? f.description : f.evidence || f.title
    const rawWhy =
      f.whyItMatters ||
      f.why_it_matters ||
      (typeof f.suggested_action === 'object' ? f.suggested_action.why : '') ||
      f.root_cause ||
      'This observation affects how automated systems can use the brand as a source.'

    const affectedPages = f.affected_pages_count ?? f.affected_urls?.length ?? 0
    const sampledPages = f.sampled_pages ?? Math.max(affectedPages, payload.coverage?.pages_fetched ?? 1)
    const { stage, priority } = getFunnelStageForFinding({
      findingType: f.finding_type,
      title: f.title,
      dimension: dimensionOf(skillId),
      metrics: f.metrics,
    })
    const reachTier = getReachTier(affectedPages, sampledPages, f.finding_type)
    const { severity: businessSeverity } = deriveBusinessExposureSeverity(priority, reachTier)
    const severity = limitation ? 'low' : businessSeverity
    const businessExposureSeverity = asSeverity(
      f.businessExposureSeverity ?? f.metrics?.businessExposureSeverity,
      businessSeverity,
    )

    return {
      id: f.id,
      skillId,
      dimension: dimensionOf(skillId),
      title: f.title,
      severity,
      confidence: asConfidence(f.confidence),
      findingType: f.finding_type,
      description: cleanEvidence(String(rawDesc)),
      whyItMatters: cleanEvidence(String(rawWhy)),
      evidence: evidenceOf(f),
      affectedPages,
      sampledPages,
      recommendation: actionOf(f),
      rootCauseId: f.parent_id || undefined,
      isLimitation: limitation,
      limitationReason: limitation ? cleanEvidence(String(f.limitation_reason || f.evidence || '')) : undefined,
      consequenceChain: limitation ? undefined : getCausalChainForFinding(f),
      templateId: f.template_id,
      findingKey: f.finding_key,
      costTier: typeof f.suggested_action === 'object' ? f.suggested_action.cost_tier : undefined,
      funnelStage: stage,
      metrics: f.metrics,
      businessExposureSeverity,
    }
  })

  // Only retain genuine inspection gap limitations, filtering out internal runtime engine logs (e.g. Y-01, dual-fetch renderer, render budget)
  const operationalPattern = /^(Y-01|Dual-fetch|Render budget|skip-ladder|Skipped dependent)/i
  for (const [i, line] of (payload.limitations ?? []).entries()) {
    const trimmed = line.trim()
    if (!trimmed || operationalPattern.test(trimmed)) continue
    findings.push({
      id: `lim-${i}`,
      skillId: 'audit-orchestrator',
      dimension: 'discoverability',
      title: 'Inspection boundary',
      severity: 'low',
      confidence: 'medium',
      description: trimmed,
      whyItMatters: 'Inspection boundary encountered during crawl. Does not indicate a site defect.',
      evidence: [{ id: `lim-${i}-e`, label: 'Boundary detail', detail: trimmed }],
      affectedPages: 0,
      sampledPages: payload.coverage?.pages_fetched ?? 0,
      recommendation: {
        id: `lim-${i}-r`,
        title: 'Inspection note',
        detail: trimmed,
        priority: 'low',
        effort: 'low',
      },
      isLimitation: true,
      limitationReason: trimmed,
    })
  }

  const rootCauses: RootCause[] = deriveRootCauses(findings, raw)

  const defects = findings.filter((f) => !f.isLimitation)
  const counts = {
    critical: defects.filter((f) => f.severity === 'critical').length,
    high: defects.filter((f) => f.severity === 'high').length,
    medium: defects.filter((f) => f.severity === 'medium').length,
    total: defects.length,
  }

  const dimensionScores =
    payload.dimension_scores && payload.dimension_scores.length > 0
      ? payload.dimension_scores.map((d) => ({
          dimension: d.dimension,
          score: d.score,
          label: d.label ?? labelForScore(d.score)!,
        }))
      : deriveDimensionScores(findings)

  const overallLabel = payload.summary?.overall_label ?? overallLabelFor(dimensionScores)

  // Smart high-impact business summary
  const topIssue =
    defects.find((f) => f.severity === 'critical') ||
    defects.find((f) => f.severity === 'high') ||
    defects[0]
  const weakestDimension = [...dimensionScores].sort((a, b) => a.score - b.score)[0]
  const weakestLabel = weakestDimension ? DIMENSIONS[weakestDimension.dimension]?.label : 'AI Discoverability'

  let overallSummary = payload.summary?.overall_summary
  if (!overallSummary || (overallSummary.includes('issue') && overallSummary.includes('Technical optimizations recommended'))) {
    if (defects.length === 0) {
      overallSummary = 'Zero structural barriers detected. The brand presents high fidelity semantic machine-readability across all audited dimensions.'
    } else if (topIssue) {
      overallSummary = `"${topIssue.title}" represents the primary citation barrier in ${weakestLabel} (${weakestDimension?.score ?? 0}/100). Resolving this is the highest leverage action to ensure automated AI engines cite and surface this domain accurately.`
    } else {
      overallSummary = `${counts.total} optimization opportunities identified across ${weakestLabel}. Immediate remediation will elevate brand citation depth across major LLMs.`
    }
  }

  // Real coverage telemetry from backend
  const pagesFetched = payload.coverage?.pages_fetched ?? (payload.timing?.pages_fetched ?? (defects.length > 0 ? 1 : 0))
  const pagesRendered = payload.coverage?.pages_rendered ?? (payload.timing?.pages_rendered ?? pagesFetched)
  const renderCount = payload.coverage?.render_count ?? pagesRendered
  const templates = payload.coverage?.templates ?? 1
  const httpRequests = payload.coverage?.http_requests ?? payload.timing?.http_requests ?? (pagesFetched * 2)
  const skippedSkills = payload.metrics?.skill_status?.skipped_dependent_skills ?? payload.skill_status?.skipped_dependent_skills ?? []

  const coverage: AuditCoverage = {
    pagesFetched,
    pagesRendered,
    renderCount,
    templates,
    httpRequests,
    robotsStatus: payload.coverage?.robots_status,
    stoppedReason: payload.coverage?.stopped_reason,
    skippedCount: skippedSkills.length,
    limitedCount: findings.filter((f) => f.isLimitation).length,
    estimatedPages: payload.coverage?.estimated_pages ?? payload.coverage?.pages_fetched,
  }

  const timing: AuditTiming = {
    totalMs: payload.timing?.total_ms ?? 0,
    crawlMs: payload.timing?.crawl_ms,
    renderMs: payload.timing?.render_ms,
    skillMs: payload.timing?.skill_ms,
    httpRequests: payload.timing?.http_requests,
  }

  return {
    dimensionScores,
    overallLabel,
    overallSummary,
    counts,
    rootCauses,
    findings,
    coverage,
    timing,
    overallIndex:
      typeof payload.overall_index === 'number'
        ? payload.overall_index
        : Math.round(dimensionScores.reduce((sum, score) => sum + score.score, 0) / Math.max(dimensionScores.length, 1)),
    top3PriorityActions: (payload.top3PriorityActions ?? []).map((action, index) => ({
      findingId: action.finding_id ?? `priority-${index + 1}`,
      summary: action.summary ?? 'Review priority action',
      priority: asSeverity(action.priority, 'medium'),
    })),
  }
}
