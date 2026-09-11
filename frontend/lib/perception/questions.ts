import type { SkillId } from '@/lib/audit/types'
import type { PerceptionQuestionId } from './types'

export const PERCEPTION_QUESTIONS = [
  {
    id: 'org' as const,
    prompt: 'What is this organization?',
    skillHint: ['entity-identity-audit', 'site-type-classifier'] as const satisfies readonly SkillId[],
  },
  {
    id: 'offer' as const,
    prompt: 'What do they offer?',
    skillHint: ['citation-extractability-audit', 'ai-answerability-audit', 'render-extract-audit'] as const,
  },
  {
    id: 'next' as const,
    prompt: 'What should I do next?',
    skillHint: ['engagement-handoff-audit'] as const,
  },
] as const

export function questionById(id: PerceptionQuestionId) {
  return PERCEPTION_QUESTIONS.find((q) => q.id === id) ?? PERCEPTION_QUESTIONS[0]
}
