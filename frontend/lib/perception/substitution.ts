import type { AuditResult, SkillId } from '@/lib/audit/types'
import { orderCauses } from '@/lib/audit/causes'
import type { PerceptionStatus, SubstitutionResult } from './types'

function firstParty(result: AuditResult): SubstitutionResult['firstParty'] {
  const scores = result.dimensionScores.map((d) => d.score)
  const min = scores.length ? Math.min(...scores) : 0
  if (min >= 75) return 'strong'
  if (min >= 55) return 'adequate'
  return 'weak'
}

const SUBSTITUTE_RE = /competitor|third-party|aggregat/i

export function buildSubstitution(
  result: AuditResult,
  perceptionStatus: PerceptionStatus,
): SubstitutionResult {
  const ordered = orderCauses(result.rootCauses)
  const subCause =
    ordered.find((c) => /substitut/i.test(c.id) || /substitut/i.test(c.label)) ?? ordered[ordered.length - 1]

  const weakFindings = result.findings.filter(
    (f) =>
      !f.isLimitation &&
      (f.severity === 'high' || f.severity === 'critical') &&
      (f.skillId === 'ai-answerability-audit' || f.skillId === 'citation-extractability-audit'),
  )
  const textHit = result.findings.some(
    (f) => !f.isLimitation && (SUBSTITUTE_RE.test(f.title) || SUBSTITUTE_RE.test(f.description)),
  )
  const fp = firstParty(result)
  const active =
    perceptionStatus === 'substituted' ||
    (fp === 'weak' && weakFindings.length > 0) ||
    result.rootCauses.some((c) => /substitut/i.test(c.id) || /substitut/i.test(c.label)) ||
    textHit

  const findingIds = subCause?.findingIds?.length
    ? subCause.findingIds
    : weakFindings.map((f) => f.id)
  const skillIds = [
    ...new Set(
      findingIds
        .map((id) => result.findings.find((f) => f.id === id)?.skillId)
        .filter((id): id is SkillId => Boolean(id)),
    ),
  ]

  return {
    active,
    disclaimer: 'simulated_from_audit_gaps',
    firstParty: fp,
    likelyCite:
      'Third-party sources with extractable specs (aggregators, encyclopedic pages, competitors).',
    causeChain: ordered.slice(0, 5).map((c) => ({ id: c.id, label: c.label })),
    skillIds,
    findingIds,
  }
}
