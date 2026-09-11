import type { AuditResult, Finding, SkillId, SkillRun, SkillStatus } from '@/lib/audit/types'
import type { BrandMemory, MemoryCell, MemoryCellId } from './types'

function statusOf(skills: SkillRun[], id: SkillId): SkillStatus | undefined {
  return skills.find((s) => s.id === id)?.status
}

function skipped(id: SkillId, skippedSkillIds: SkillId[]) {
  return skippedSkillIds.includes(id)
}

function findingsFor(result: AuditResult, id: SkillId) {
  return result.findings.filter((f) => !f.isLimitation && f.skillId === id)
}

function bad(findings: Finding[]) {
  return findings.some((f) => f.severity === 'high' || f.severity === 'critical')
}

function cell(
  id: MemoryCellId,
  filled: boolean,
  value: string | null,
  skillIds: SkillId[],
  findingIds: string[],
  source: MemoryCell['source'],
): MemoryCell {
  return { id, filled, value, skillIds, findingIds, source }
}

export function buildBrandMemory(
  host: string,
  result: AuditResult,
  skills: SkillRun[],
  skippedSkillIds: SkillId[],
): BrandMemory {
  const entityF = findingsFor(result, 'entity-identity-audit')
  const renderF = findingsFor(result, 'render-extract-audit')
  const citF = findingsFor(result, 'citation-extractability-audit')
  const corF = findingsFor(result, 'corroboration-consistency-audit')
  const engF = findingsFor(result, 'engagement-handoff-audit')
  const freshF = findingsFor(result, 'freshness-audit')

  const identitySkipped = skipped('entity-identity-audit', skippedSkillIds)
  const identityBad = statusOf(skills, 'entity-identity-audit') === 'critical' || bad(entityF)
  const identity: MemoryCell = identitySkipped
    ? cell('identity', false, null, ['entity-identity-audit'], entityF.map((f) => f.id), 'empty')
    : cell(
        'identity',
        true,
        host,
        ['entity-identity-audit'],
        entityF.slice(0, 1).map((f) => f.id),
        identityBad ? 'inferred' : 'inferred',
      )

  const classifySkipped = skipped('site-type-classifier', skippedSkillIds)
  const classifyCritical = statusOf(skills, 'site-type-classifier') === 'critical'
  const category: MemoryCell = classifySkipped || classifyCritical
    ? cell('category', false, classifySkipped ? null : 'Unclassified', ['site-type-classifier'], [], 'empty')
    : cell('category', true, 'Classified site type available to downstream skills', ['site-type-classifier'], [], 'inferred')

  const offerSkills: SkillId[] = ['citation-extractability-audit', 'render-extract-audit']
  const offerEmpty =
    skipped('render-extract-audit', skippedSkillIds) ||
    skipped('citation-extractability-audit', skippedSkillIds) ||
    bad(renderF) ||
    bad(citF)
  const offer: MemoryCell = offerEmpty
    ? cell('offer', false, null, offerSkills, [...renderF, ...citF].slice(0, 2).map((f) => f.id), 'empty')
    : cell('offer', true, 'Extractable first-party offer statements present', offerSkills, [], 'evidence')

  const proofEmpty = skipped('corroboration-consistency-audit', skippedSkillIds) || bad(corF)
  const proof: MemoryCell = proofEmpty
    ? cell('proof', false, null, ['corroboration-consistency-audit'], corF.map((f) => f.id), 'empty')
    : cell('proof', true, 'On-site claims are internally consistent', ['corroboration-consistency-audit'], [], 'evidence')

  const actionEmpty = skipped('engagement-handoff-audit', skippedSkillIds) || bad(engF)
  const action: MemoryCell = actionEmpty
    ? cell('action', false, null, ['engagement-handoff-audit'], engF.map((f) => f.id), 'empty')
    : cell('action', true, 'Machine-legible handoff present', ['engagement-handoff-audit'], [], 'evidence')

  const recencyEmpty = skipped('freshness-audit', skippedSkillIds) || bad(freshF)
  const recency: MemoryCell = recencyEmpty
    ? cell('recency', false, null, ['freshness-audit'], freshF.map((f) => f.id), 'empty')
    : cell('recency', true, 'Recency signals present', ['freshness-audit'], [], 'evidence')

  return { cells: [identity, category, offer, proof, action, recency] }
}
