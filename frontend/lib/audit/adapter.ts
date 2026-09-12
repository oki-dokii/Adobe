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
  AuditResult,
  Confidence,
  Dimension,
  Finding,
  Recommendation,
  RootCause,
  Severity,
  SkillId,
} from './types'
import { DIMENSIONS, RUN_ORDER, SKILL_MAP } from './skills'

const SKILL_IDS = new Set<string>(Object.keys(SKILL_MAP))

export interface BackendSuggestedAction {
  summary?: string
  priority?: string
  what?: string
  where?: string
  how?: string
  why?: string
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
  evidence_items?: Array<{
    id?: string
    label?: string
    detail?: string
    url?: string
    signal?: string
    confidence?: string
  }>
  is_limitation?: boolean
  limitation_reason?: string
  admission?: { emitted?: string; rule?: string }
}

export interface BackendAuditPayload {
  site?: string
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
  coverage?: { pages_fetched?: number; pages_rendered?: number }
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
  return {
    id: `r-${f.id}`,
    title,
    detail,
    priority,
    effort: priority === 'critical' || priority === 'high' ? 'medium' : 'low',
  }
}

function evidenceOf(f: BackendFinding): Finding['evidence'] {
  if (f.evidence_items && f.evidence_items.length > 0) {
    return f.evidence_items.map((e, i) => ({
      id: e.id ?? `${f.id}-e-${i}`,
      label: e.label ?? 'Observation',
      detail: e.detail ?? '',
      url: e.url ?? f.affected_urls?.[0],
      signal: e.signal,
      confidence: e.confidence ? asConfidence(e.confidence) : undefined,
    }))
  }
  const urls = f.affected_urls ?? []
  const items: Finding['evidence'] = []
  if (f.evidence) {
    items.push({
      id: `${f.id}-e-0`,
      label: 'Extracted evidence',
      detail: String(f.evidence).slice(0, 280),
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
    const why =
      f.whyItMatters ||
      f.why_it_matters ||
      (typeof f.suggested_action === 'object' ? f.suggested_action.why : '') ||
      f.root_cause ||
      'This observation affects how automated systems can use the brand as a source.'
    return {
      id: f.id,
      skillId,
      dimension: dimensionOf(skillId),
      title: f.title,
      severity: asSeverity(f.severity),
      confidence: asConfidence(f.confidence),
      description: f.description && f.description !== f.title ? f.description : f.evidence || f.title,
      whyItMatters: why,
      evidence: evidenceOf(f),
      affectedPages: f.affected_pages_count ?? f.affected_urls?.length ?? 0,
      sampledPages: f.sampled_pages ?? Math.max(f.affected_pages_count ?? 0, payload.coverage?.pages_fetched ?? 1),
      recommendation: actionOf(f),
      rootCauseId: f.parent_id || undefined,
      isLimitation: limitation,
      limitationReason: limitation ? f.limitation_reason || f.evidence : undefined,
    }
  })

  for (const [i, line] of (payload.limitations ?? []).entries()) {
    if (!line.trim()) continue
    findings.push({
      id: `lim-${i}`,
      skillId: 'audit-orchestrator',
      dimension: 'discoverability',
      title: 'Audit limitation',
      severity: 'low',
      confidence: 'medium',
      description: line,
      whyItMatters: 'The audit continued with reduced coverage rather than inventing missing evidence.',
      evidence: [{ id: `lim-${i}-e`, label: 'Limitation', detail: line }],
      affectedPages: 0,
      sampledPages: payload.coverage?.pages_fetched ?? 0,
      recommendation: {
        id: `lim-${i}-r`,
        title: 'Re-run if coverage was insufficient',
        detail: line,
        priority: 'low',
        effort: 'low',
      },
      isLimitation: true,
      limitationReason: line,
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
  const overallSummary =
    payload.summary?.overall_summary ||
    (counts.total === 0
      ? 'The audit completed with 0 structural defects detected across all evaluated skills.'
      : `${counts.total} issue${counts.total === 1 ? '' : 's'} identified (${counts.critical} critical, ${counts.high} high, ${counts.medium} medium). Technical optimizations recommended to improve AI discoverability.`)

  return {
    dimensionScores,
    overallLabel,
    overallSummary,
    counts,
    rootCauses,
    findings,
  }
}
