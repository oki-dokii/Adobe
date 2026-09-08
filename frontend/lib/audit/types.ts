/**
 * Domain model for the Brand AI Readiness audit engine.
 *
 * Mirrors backend concepts (skills, findings, evidence, parent_id root causes,
 * recommendations, streamed events) so the mock layer can be swapped for a live
 * source with minimal UI change. See `adapter.ts` for the backend mapping.
 */

export type SkillId =
  | 'audit-orchestrator'
  | 'site-type-classifier'
  | 'crawl-access-audit'
  | 'render-extract-audit'
  | 'citation-extractability-audit'
  | 'entity-identity-audit'
  | 'ai-answerability-audit'
  | 'freshness-audit'
  | 'corroboration-consistency-audit'
  | 'engagement-handoff-audit'

/** The four high-level readiness dimensions a brand is measured against. */
export type Dimension = 'discoverability' | 'understanding' | 'trust' | 'engagement'

/** Lifecycle of a single skill within an audit run. */
export type SkillStatus =
  | 'dormant'
  | 'initializing'
  | 'queued'
  | 'running'
  | 'completed'
  | 'warning'
  | 'critical'
  | 'skipped'
  | 'partial'

/** Lifecycle of a whole site audit. */
export type SitePhase =
  | 'dormant'
  | 'ingesting'
  | 'validating'
  | 'running'
  | 'consolidating'
  | 'completed'
  | 'partial'
  | 'error'

export type Severity = 'critical' | 'high' | 'medium' | 'low'
export type Confidence = 'high' | 'medium' | 'low'

/** Static definition of a skill (independent of any run). */
export interface SkillDef {
  id: SkillId
  label: string
  short: string
  dimension: Dimension
  /** One-line description surfaced in tooltips. */
  summary: string
  /** Longer purpose surfaced in the inspector. */
  purpose: string
  /** The individual checks this skill performs. */
  checks: string[]
}

/** A single check inside a skill for a specific run. */
export interface SkillCheck {
  label: string
  state: 'pass' | 'fail' | 'partial' | 'pending'
}

/** Runtime state of a skill for a specific site audit. */
export interface SkillRun {
  id: SkillId
  status: SkillStatus
  /** 0..1 progress while running. */
  progress: number
  pagesInspected: number
  confidence?: Confidence
  checks: SkillCheck[]
  /** True after this skill has emitted at least one finding this run. */
  findingEmitted?: boolean
}

export interface Evidence {
  id: string
  label: string
  /** e.g. "12 / 18 sampled pages" */
  detail: string
  /** Optional example URL / selector / snippet reference. */
  reference?: string
  /** Affected page URL when the backend provides one. */
  url?: string
  /** Named signal (robots, render ratio, structured data…). */
  signal?: string
  confidence?: Confidence
}

export interface Recommendation {
  id: string
  title: string
  detail: string
  priority: Severity
  effort: 'low' | 'medium' | 'high'
}

export interface Finding {
  id: string
  skillId: SkillId
  dimension: Dimension
  title: string
  severity: Severity
  confidence: Confidence
  /** WHAT was observed. */
  description: string
  /** WHY it matters. */
  whyItMatters: string
  evidence: Evidence[]
  affectedPages: number
  sampledPages: number
  recommendation: Recommendation
  /** Root cause this finding rolls up into, if any. */
  rootCauseId?: string
  /** True when this represents an audit limitation, not a site defect. */
  isLimitation?: boolean
  limitationReason?: string
}

/** A node in the root-cause chain. parentId mirrors backend `parent_id`. */
export interface RootCause {
  id: string
  label: string
  detail: string
  parentId: string | null
  severity: Severity
  /** Findings that converge on this cause. */
  findingIds: string[]
}

export interface DimensionScore {
  dimension: Dimension
  /** 0..100 */
  score: number
  label: 'strong' | 'adequate' | 'at-risk' | 'weak'
}

export interface AuditResult {
  dimensionScores: DimensionScore[]
  overallLabel: string
  overallSummary: string
  counts: { critical: number; high: number; medium: number; total: number }
  rootCauses: RootCause[]
  findings: Finding[]
}

export interface Site {
  id: string
  url: string
  host: string
  phase: SitePhase
  skills: SkillRun[]
  events: AuditEvent[]
  result?: AuditResult
  error?: string
}

/* ---- Event stream ----
 * The tree never owns a hardcoded timeline. It reacts to these events.
 * Mock mode and a future backend both emit this shape.
 */

export type AuditEventType =
  | 'AUDIT_STARTED'
  | 'SITE_VALIDATED'
  | 'CRAWL_STARTED'
  | 'CRAWL_PROGRESS'
  | 'CRAWL_COMPLETED'
  | 'RENDER_STARTED'
  | 'RENDER_COMPLETED'
  | 'SKILL_STARTED'
  | 'SKILL_PROGRESS'
  | 'SKILL_FINDING'
  | 'SKILL_COMPLETED'
  | 'ROOT_CAUSE_FOUND'
  | 'AUDIT_CONSOLIDATING'
  | 'AUDIT_COMPLETED'
  | 'AUDIT_PARTIAL'

export interface AuditEvent {
  type: AuditEventType
  siteId: string
  at: number
  skillId?: SkillId
  progress?: number
  status?: SkillStatus
  message?: string
}

export type AppPhase = 'landing' | 'ingesting' | 'auditing' | 'results'

export interface Point {
  x: number
  y: number
}
