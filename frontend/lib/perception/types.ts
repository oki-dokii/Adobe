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

export interface EngineCitation {
  name: 'GPT-4o' | 'Claude 3.5 Sonnet' | 'Perplexity Online' | 'Gemini 1.5 Pro'
  grounded: boolean
  confidence: number
  citations: string[]
  failureMode?: string
  answerSnippet?: string
}

export interface PerceptionResult {
  questionId: PerceptionQuestionId
  status: PerceptionStatus
  confidence: Confidence
  confidenceScore?: number
  answer: string
  spans: PerceptionSpan[]
  engines?: EngineCitation[]
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
  tier?: 'permanent' | 'stable' | 'volatile' | 'critical'
  halfLifeDays?: number
}

export interface BrandMemory {
  cells: MemoryCell[]
  halfLifeDays?: number
  missingFacts?: string[]
}

export interface SubstitutionResult {
  active: boolean
  disclaimer: 'simulated_from_audit_gaps'
  firstParty: 'strong' | 'adequate' | 'weak'
  likelyCite: string
  targetBrandShare?: number
  rivalBrandShare?: number
  rivalName?: string
  breakPointReason?: string
  winningAttributes?: string[]
  remediationCode?: string
  liftDelta?: number
  causeChain: { id: string; label: string }[]
  skillIds: SkillId[]
  findingIds: string[]
}

export type GravityClass = 'named' | 'generic' | 'displaced'

export interface GravityAnchor {
  label: string
  weight: number
  detail: string
}

export interface GravityRival {
  name: string
  score: number
  zone: 'high' | 'disputed' | 'attrition'
}

export interface GravityResult {
  class: GravityClass
  label: string
  score?: number
  detail: string
  skillIds: SkillId[]
  anchors?: GravityAnchor[]
  rivals?: GravityRival[]
}

export interface MriVitals {
  retrievalFidelity: number
  groundingIntegrity: number
  memoryHalfLifeDays: number
  hallucinationRisk: number
  revenueDragMonthly: number
}

export interface PerceptionBundle {
  perception: PerceptionResult
  memory: BrandMemory
  substitution: SubstitutionResult | null
  gravity: GravityResult
  vitals?: MriVitals
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
