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
import { SKILL_MAP } from './skills'

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
  if (f.is_limitation) return true
  const type = (f.finding_type ?? '').toLowerCase()
  if (type.includes('limit') || type.includes('blocked') || type.includes('insufficient')) return true
  const blob = `${f.title} ${f.evidence ?? ''} ${f.limitation_reason ?? ''}`.toLowerCase()
  return /\b(403|blocked|challenge|insufficient[- ]evidence|could not be inspected)\b/.test(blob)
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
export function adaptBackendResult(payload: BackendAuditPayload): AuditResult {
  const raw = (payload.findings_internal?.length ? payload.findings_internal : payload.findings) ?? []
  const findings: Finding[] = raw.map((f) => {
    const skillId = asSkillId(f.skill_id)
    const limitation = isLimitation(f)
    return {
      id: f.id,
      skillId,
      dimension: dimensionOf(skillId),
      title: f.title,
      severity: asSeverity(f.severity),
      confidence: asConfidence(f.confidence),
      description: f.description || f.title,
      whyItMatters:
        f.whyItMatters ||
        f.why_it_matters ||
        (typeof f.suggested_action === 'object' ? f.suggested_action.why : '') ||
        'This observation affects how automated systems can use the brand as a source.',
      evidence: evidenceOf(f),
      affectedPages: f.affected_pages_count ?? f.affected_urls?.length ?? 0,
      sampledPages: f.sampled_pages ?? Math.max(f.affected_pages_count ?? 0, 1),
      recommendation: actionOf(f),
      rootCauseId: f.parent_id || undefined,
      isLimitation: limitation,
      limitationReason: limitation ? f.limitation_reason || f.evidence : undefined,
    }
  })

  const rootCauses: RootCause[] = (payload.root_causes ?? []).map((rc) => ({
    id: rc.id,
    label: rc.label ?? rc.id,
    detail: rc.detail ?? '',
    parentId: rc.parent_id ?? null,
    severity: asSeverity(rc.severity),
    findingIds: rc.finding_ids ?? findings.filter((f) => f.rootCauseId === rc.id).map((f) => f.id),
  }))

  const defects = findings.filter((f) => !f.isLimitation)
  const counts = {
    critical: defects.filter((f) => f.severity === 'critical').length,
    high: defects.filter((f) => f.severity === 'high').length,
    medium: defects.filter((f) => f.severity === 'medium').length,
    total: defects.length,
  }

  const dimensionScores =
    payload.dimension_scores?.map((d) => ({
      dimension: d.dimension,
      score: d.score,
      label: d.label ?? labelForScore(d.score)!,
    })) ?? []

  return {
    dimensionScores,
    overallLabel: payload.summary?.overall_label ?? (counts.critical ? 'At risk' : 'Mostly ready'),
    overallSummary: payload.summary?.overall_summary ?? '',
    counts,
    rootCauses,
    findings,
  }
}
