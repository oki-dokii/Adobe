import type { AuditResult, Finding, SkillId, SkillRun } from '@/lib/audit/types'
import type { PerceptionContext, PerceptionQuestionId } from './types'

const MAX_FINDINGS = 12
const MAX_CHARS = 8000

export function buildPerceptionContext(
  host: string,
  url: string,
  questionId: PerceptionQuestionId,
  result: AuditResult,
  skills: SkillRun[],
  skippedSkillIds: SkillId[],
  partial = false,
): PerceptionContext {
  const skipped = new Set(skippedSkillIds)
  const limitations = result.findings.filter((f) => f.isLimitation)
  let findings = result.findings.filter((f) => !f.isLimitation && !skipped.has(f.skillId))

  findings = findings.slice(0, MAX_FINDINGS)
  let total = findings.reduce((n, f) => n + f.description.length, 0)
  if (total > MAX_CHARS) {
    findings = findings.map((f) => ({ ...f }))
    const sorted = [...findings].sort((a, b) => b.description.length - a.description.length)
    for (const f of sorted) {
      if (total <= MAX_CHARS) break
      const overflow = total - MAX_CHARS
      const cut = Math.max(80, f.description.length - overflow)
      total -= f.description.length - cut
      const target = findings.find((x) => x.id === f.id)
      if (target) target.description = `${f.description.slice(0, cut)}…`
    }
  }

  return {
    host,
    url,
    questionId,
    skippedSkillIds,
    findings,
    causes: result.rootCauses,
    limitations,
    dimensionScores: result.dimensionScores,
    skills: skills.map((s) => ({ id: s.id, status: s.status, findingEmitted: s.findingEmitted })),
    partial,
  }
}

export function findingsForSkill(findings: Finding[], id: SkillId) {
  return findings.filter((f) => f.skillId === id)
}

export function hasHighOrCritical(findings: Finding[], skillId: SkillId) {
  return findings.some((f) => f.skillId === skillId && (f.severity === 'high' || f.severity === 'critical'))
}
