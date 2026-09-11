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

  if (engBad || (!offerFilled && ansWeak)) {
    return {
      class: 'displaced',
      label: 'DISPLACED',
      detail: 'No extractable offer and weak handoff — an assistant is more likely to name a clearer competitor.',
      skillIds,
    }
  }
  if (eng === 'warning' || eng === 'partial' || ans === 'warning' || ans === 'partial' || !offerFilled) {
    return {
      class: 'generic',
      label: 'GENERIC',
      detail: 'The assistant can speak in category terms but may not name a specific offer.',
      skillIds,
    }
  }
  return {
    class: 'named',
    label: 'NAMED',
    detail: 'A machine-legible next action exists; the brand can be the handoff target.',
    skillIds,
  }
}
