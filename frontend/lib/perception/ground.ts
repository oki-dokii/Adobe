import type { AuditResult, Finding, SkillId, SkillRun, SkillStatus } from '@/lib/audit/types'
import { hasHighOrCritical } from './build-context'
import { buildGravity } from './gravity'
import { buildBrandMemory } from './memory'
import { questionById } from './questions'
import { normalizeSpans } from './spans'
import { buildSubstitution } from './substitution'
import type {
  PerceptionBundle,
  PerceptionContext,
  PerceptionResult,
  PerceptionSpan,
  PerceptionStatus,
} from './types'

function skillStatus(ctx: PerceptionContext, id: SkillId): SkillStatus | undefined {
  return ctx.skills.find((s) => s.id === id)?.status
}

function shouldSubstitute(ctx: PerceptionContext): boolean {
  if (ctx.causes.some((c) => /substitut/i.test(c.id) || /substitut/i.test(c.label))) return true
  return ctx.findings.some((f) => /competitor|third-party|aggregat/i.test(`${f.title} ${f.description}`))
}

function attachFindings(
  ctx: PerceptionContext,
  skillIds: SkillId[],
  grounding: PerceptionSpan['grounding'],
  text: string,
  start: number,
): PerceptionSpan {
  const fs = ctx.findings.filter((f) => skillIds.includes(f.skillId)).slice(0, 4)
  return {
    id: `s-${start}`,
    text,
    start,
    end: start + text.length,
    findingIds: fs.map((f) => f.id),
    skillIds,
    evidenceIds: fs.flatMap((f) => f.evidence.map((e) => e.id)).slice(0, 4),
    causeIds: [...new Set(fs.map((f) => f.rootCauseId).filter((id): id is string => Boolean(id)))],
    grounding,
  }
}

function spanify(
  ctx: PerceptionContext,
  answer: string,
  status: PerceptionStatus,
  skillIds: SkillId[],
  grounding: PerceptionSpan['grounding'],
): PerceptionSpan[] {
  let cursor = 0
  const spans: PerceptionSpan[] = []
  const parts = answer.split(/(?<=\.)\s+/).filter(Boolean)
  for (const sent of parts) {
    const idx = answer.indexOf(sent, cursor)
    const start = idx >= 0 ? idx : cursor
    const tokens = sent
      .toLowerCase()
      .split(/\W+/)
      .filter((t) => t.length > 3)
    const matched: Finding[] = []
    for (const f of ctx.findings) {
      const blob = `${f.title} ${f.description} ${f.evidence.map((e) => e.detail).join(' ')}`.toLowerCase()
      if (tokens.filter((t) => blob.includes(t)).length >= 2) matched.push(f)
    }
    const refuse = /cannot|empty shell|hydration|not machine-legible/i.test(sent)
    const skills = (matched.length ? matched.map((f) => f.skillId) : skillIds).filter(
      (id, i, a) => a.indexOf(id) === i,
    ).slice(0, 3)
    const g: PerceptionSpan['grounding'] = matched.length > 0 ? 'supported' : status === 'grounded' ? grounding : 'unsupported'
    spans.push(attachFindings(ctx, refuse ? skillIds : skills, g, sent, start))
    cursor = start + sent.length
  }
  return normalizeSpans(answer, spans, ctx.questionId)
}

export function groundExtractOnly(ctx: PerceptionContext): PerceptionResult {
  const skipped = new Set(ctx.skippedSkillIds)
  const hint = [...questionById(ctx.questionId).skillHint]
  const entityBad =
    skillStatus(ctx, 'entity-identity-audit') === 'critical' ||
    skillStatus(ctx, 'entity-identity-audit') === 'warning' ||
    ctx.findings.some((f) => f.skillId === 'entity-identity-audit')

  let status: PerceptionStatus = 'grounded'
  let confidence: PerceptionResult['confidence'] = 'medium'
  let answer = ''
  let grounding: PerceptionSpan['grounding'] = 'inferred'
  let skills = hint

  if (ctx.questionId === 'org') {
    if (entityBad) {
      answer = `${ctx.host} is a distinct site, but organization identity is under-specified in extractable markup, so an assistant may conflate it with similarly named entities.`
      grounding = 'supported'
      confidence = 'low'
    } else {
      answer = `${ctx.host} is a software organization. Extractable identity signals are sufficient to name the brand without a third-party source.`
    }
  } else if (ctx.questionId === 'offer') {
    const renderHit =
      !skipped.has('render-extract-audit') &&
      (hasHighOrCritical(ctx.findings, 'render-extract-audit') ||
        skillStatus(ctx, 'render-extract-audit') === 'warning' ||
        skillStatus(ctx, 'render-extract-audit') === 'critical')
    const citeHit =
      !skipped.has('citation-extractability-audit') &&
      (hasHighOrCritical(ctx.findings, 'citation-extractability-audit') ||
        skillStatus(ctx, 'citation-extractability-audit') === 'warning' ||
        skillStatus(ctx, 'citation-extractability-audit') === 'critical')
    if (renderHit || citeHit) {
      status = shouldSubstitute(ctx) ? 'substituted' : 'refused'
      confidence = 'low'
      answer =
        status === 'substituted'
          ? `I cannot state a concrete, extractable offer from first-party HTML. Key facts appear only after client render, so an assistant would likely rely on third-party descriptions instead of ${ctx.host}.`
          : 'I cannot state pricing or a concrete offer from extractable first-party HTML. Key facts appear only after client render.'
      grounding = 'unsupported'
      skills = ['render-extract-audit', 'citation-extractability-audit', 'ai-answerability-audit']
    } else {
      answer = `Extractable first-party statements are sufficient to describe what ${ctx.host} offers, without quoting a price that is missing from the initial HTML.`
    }
  } else {
    const engHit =
      !skipped.has('engagement-handoff-audit') &&
      (hasHighOrCritical(ctx.findings, 'engagement-handoff-audit') ||
        skillStatus(ctx, 'engagement-handoff-audit') === 'warning' ||
        skillStatus(ctx, 'engagement-handoff-audit') === 'critical')
    if (engHit || skipped.has('engagement-handoff-audit')) {
      status = 'refused'
      confidence = 'low'
      answer =
        'I cannot identify a machine-legible next action from extractable markup, so I would not complete a handoff to this brand.'
      grounding = 'unsupported'
    } else {
      answer = `A machine-legible next action is present on ${ctx.host}. An assistant can hand a user to that path without guessing.`
    }
  }

  if (ctx.partial) answer = `Partial audit. ${answer}`

  return {
    questionId: ctx.questionId,
    status,
    confidence,
    answer,
    spans: spanify(ctx, answer, status, skills, grounding),
    disclaimer: 'simulated_extract_grounded',
    stale: false,
    usedFallback: true,
    skippedSkillIds: ctx.skippedSkillIds,
  }
}

export function assembleBundle(ctx: PerceptionContext, result: AuditResult, skills: SkillRun[]): PerceptionBundle {
  const perception = groundExtractOnly(ctx)
  const memory = buildBrandMemory(ctx.host, result, skills, ctx.skippedSkillIds)
  const substitution = buildSubstitution(result, perception.status)
  const gravity = buildGravity(skills, ctx.skippedSkillIds, memory.cells.find((c) => c.id === 'offer'))
  return {
    perception,
    memory,
    substitution: substitution.active || perception.status === 'substituted' ? substitution : null,
    gravity,
  }
}
