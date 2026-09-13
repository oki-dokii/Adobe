import type { SkillId, SkillRun, SkillStatus } from '@/lib/audit/types'
import type { GravityResult, MemoryCell } from './types'

function statusOf(skills: SkillRun[], id: SkillId): SkillStatus | undefined {
  return skills.find((s) => s.id === id)?.status
}

export function buildGravity(
  skills: SkillRun[],
  skippedSkillIds: SkillId[],
  offerCell: MemoryCell | undefined,
): GravityResult {
  const skillIds: SkillId[] = [
    'engagement-handoff-audit',
    'ai-answerability-audit',
    'citation-extractability-audit',
  ]
  const engSkipped = skippedSkillIds.includes('engagement-handoff-audit')
  const ansSkipped = skippedSkillIds.includes('ai-answerability-audit')
  const eng = engSkipped ? 'critical' : statusOf(skills, 'engagement-handoff-audit')
  const ans = ansSkipped ? 'warning' : statusOf(skills, 'ai-answerability-audit')
  const offerFilled = offerCell?.filled === true

  const engBad = eng === 'critical' || eng === 'skipped' || engSkipped
  const ansWeak = ans === 'warning' || ans === 'critical' || ans === 'skipped' || ansSkipped

  // Anchors describe structural signal gaps — not fabricated competitor names.
  // These are derived from actual skill outcomes, not hardcoded assumptions.
  const anchors = [
    engBad
      ? { label: 'Handoff Gap', weight: -18, detail: 'No machine-legible next action found. An assistant cannot complete a referral to this site without guessing.' }
      : { label: 'Handoff Signal Present', weight: 0, detail: 'At least one extractable next-action path was found.' },
    ansWeak
      ? { label: 'Answerability Gap', weight: -12, detail: 'One or more key factual questions (K-category) have no extractable answer in the crawled corpus.' }
      : { label: 'Answerability Adequate', weight: 0, detail: 'Core K-category questions can be answered from crawled content.' },
    !offerFilled
      ? { label: 'Offer Not Extractable', weight: -8, detail: 'The offer/product description could not be resolved from first-party markup.' }
      : { label: 'Offer Extractable', weight: 0, detail: 'Offer cell is filled from first-party evidence.' },
  ].filter((a) => a.weight !== 0 || engBad || ansWeak || !offerFilled)

  if (engBad || (!offerFilled && ansWeak)) {
    return {
      class: 'displaced',
      label: 'DISPLACED',
      score: 48,
      detail: 'No extractable offer and weak handoff — an assistant is more likely to name a clearer competitor from the same category.',
      skillIds,
      anchors,
      // No hardcoded rivals: competitor identity depends entirely on the domain being audited.
    }
  }
  if (eng === 'warning' || eng === 'partial' || ans === 'warning' || ans === 'partial' || !offerFilled) {
    return {
      class: 'generic',
      label: 'GENERIC',
      score: 62,
      detail: 'The assistant can speak in category terms about this brand but may not name a specific offer or call-to-action.',
      skillIds,
      anchors,
    }
  }
  return {
    class: 'named',
    label: 'NAMED',
    score: 82,
    detail: 'A machine-legible offer and next action exist. An AI assistant can reference this brand specifically.',
    skillIds,
    anchors,
  }
}

