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

function inferCategoryFromHostAndFindings(host: string, result: AuditResult): string {
  const text = `${host} ${result.findings.map((f) => `${f.title} ${f.description}`).join(' ')}`.toLowerCase()
  if (text.includes('shop') || text.includes('e-commerce') || text.includes('ecommerce') || text.includes('cart') || text.includes('checkout') || text.includes('store')) {
    return 'E-Commerce & Digital Commerce Platform'
  }
  if (text.includes('chat') || text.includes('assistant') || text.includes('openai') || text.includes('anthropic') || text.includes('conversational')) {
    return 'Conversational AI & Model Interface'
  }
  if (text.includes('docs') || text.includes('documentation') || text.includes('api reference') || text.includes('developer')) {
    return 'Developer Infrastructure & Documentation'
  }
  if (text.includes('news') || text.includes('blog') || text.includes('journalism') || text.includes('media') || text.includes('publication')) {
    return 'Publishing & Digital Media'
  }
  return 'Enterprise Software & Digital Platform'
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
        identityBad ? 'inferred' : 'evidence',
      )

  const classifySkipped = skipped('site-type-classifier', skippedSkillIds)
  const classifyCritical = statusOf(skills, 'site-type-classifier') === 'critical'
  const inferredCategory = inferCategoryFromHostAndFindings(host, result)
  const category: MemoryCell = classifySkipped || classifyCritical
    ? cell('category', false, classifySkipped ? null : 'Unclassified', ['site-type-classifier'], [], 'empty')
    : cell('category', true, inferredCategory, ['site-type-classifier'], [], 'inferred')

  const offerSkills: SkillId[] = ['citation-extractability-audit', 'render-extract-audit']
  const offerEmpty =
    skipped('render-extract-audit', skippedSkillIds) ||
    skipped('citation-extractability-audit', skippedSkillIds) ||
    bad(renderF) ||
    bad(citF)
  const offer: MemoryCell = offerEmpty
    ? cell(
        'offer',
        false,
        renderF[0]?.title || citF[0]?.title || 'Offer and specifications not extractable from raw HTML',
        offerSkills,
        [...renderF, ...citF].slice(0, 2).map((f) => f.id),
        'empty',
      )
    : cell('offer', true, 'Extractable first-party statements verified in DOM', offerSkills, [], 'evidence')

  const proofEmpty = skipped('corroboration-consistency-audit', skippedSkillIds) || bad(corF)
  const proof: MemoryCell = proofEmpty
    ? cell(
        'proof',
        false,
        corF[0]?.title || 'On-site claim consistency unverified',
        ['corroboration-consistency-audit'],
        corF.map((f) => f.id),
        'empty',
      )
    : cell('proof', true, 'On-site claims are internally consistent', ['corroboration-consistency-audit'], [], 'evidence')

  const actionEmpty = skipped('engagement-handoff-audit', skippedSkillIds) || bad(engF)
  const action: MemoryCell = actionEmpty
    ? cell(
        'action',
        false,
        engF[0]?.title || 'Unspecified machine handoff path',
        ['engagement-handoff-audit'],
        engF.map((f) => f.id),
        'empty',
      )
    : cell('action', true, 'Machine-legible handoff action present', ['engagement-handoff-audit'], [], 'evidence')

  const recencyEmpty = skipped('freshness-audit', skippedSkillIds) || bad(freshF)
  const recency: MemoryCell = recencyEmpty
    ? cell(
        'recency',
        false,
        freshF[0]?.title || 'Temporal freshness signals missing',
        ['freshness-audit'],
        freshF.map((f) => f.id),
        'empty',
      )
    : cell('recency', true, 'Temporal recency signals verified', ['freshness-audit'], [], 'evidence')

  // Derive unresolvable missing facts purely from actual audit gaps in answerability and extractability
  const unresolvableFindings = result.findings.filter(
    (f) =>
      !f.isLimitation &&
      (f.skillId === 'ai-answerability-audit' ||
        f.skillId === 'citation-extractability-audit' ||
        f.skillId === 'render-extract-audit') &&
      (f.severity === 'high' || f.severity === 'critical'),
  )
  const titleCounts = new Map<string, number>()
  for (const f of unresolvableFindings) {
    titleCounts.set(f.title, (titleCounts.get(f.title) ?? 0) + 1)
  }
  const missingFacts = [...titleCounts.entries()].map(([title, count]) =>
    count > 1 ? `${title} (×${count} pages affected)` : title,
  )

  return {
    cells: [identity, category, offer, proof, action, recency],
    missingFacts,
  }
}
