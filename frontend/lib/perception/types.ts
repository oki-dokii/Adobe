import type { AuditResult, Confidence, Finding, SkillId, SkillRun, SkillStatus } from '@/lib/audit/types'

export type PerceptionStatus = 'grounded' | 'refused' | 'substituted'
export type PerceptionQuestionId = 'org' | 'offer' | 'next'

export interface PerceptionSpan {
  id: string
  text: string
  start: number
  end: number
  findingIds: string[]
  skillIds: SkillId[]
  evidenceIds: string[]
  causeIds: string[]
  grounding: 'supported' | 'unsupported' | 'inferred'
}

export interface PerceptionResult {
  questionId: PerceptionQuestionId
  status: PerceptionStatus
  confidence: Confidence
  answer: string
  spans: PerceptionSpan[]
  disclaimer: 'simulated_extract_grounded'
  stale: boolean
  usedFallback: boolean
  skippedSkillIds: SkillId[]
}

export type MemoryCellId = 'identity' | 'category' | 'offer' | 'proof' | 'action' | 'recency'

export interface MemoryCell {
  id: MemoryCellId
  filled: boolean
  value: string | null
  skillIds: SkillId[]
  findingIds: string[]
  source: 'evidence' | 'inferred' | 'empty'
}

export interface BrandMemory {
  cells: MemoryCell[]
}

export interface SubstitutionResult {
  active: boolean
  disclaimer: 'simulated_from_audit_gaps'
  firstParty: 'strong' | 'adequate' | 'weak'
  likelyCite: string
  causeChain: { id: string; label: string }[]
  skillIds: SkillId[]
  findingIds: string[]
}

export type GravityClass = 'named' | 'generic' | 'displaced'

export interface GravityResult {
  class: GravityClass
  label: string
  detail: string
  skillIds: SkillId[]
}

export interface PerceptionBundle {
  perception: PerceptionResult
  memory: BrandMemory
  substitution: SubstitutionResult | null
  gravity: GravityResult
}

export interface PerceptionContext {
  host: string
  url: string
  questionId: PerceptionQuestionId
  skippedSkillIds: SkillId[]
  findings: Finding[]
  causes: AuditResult['rootCauses']
  limitations: Finding[]
  dimensionScores: AuditResult['dimensionScores']
  skills: Array<{ id: SkillId; status: SkillStatus; findingEmitted?: boolean }>
  partial: boolean
}

export type PerceptionRequestBody = {
  host: string
  url: string
  questionId: PerceptionQuestionId
  skippedSkillIds?: SkillId[]
  result: AuditResult
  skills: SkillRun[]
  partial?: boolean
}
