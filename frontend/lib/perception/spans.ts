import type { PerceptionQuestionId, PerceptionSpan } from './types'
import { questionById } from './questions'

export function normalizeSpans(answer: string, spans: PerceptionSpan[], questionId: PerceptionQuestionId): PerceptionSpan[] {
  const len = answer.length
  const hint = [...questionById(questionId).skillHint]
  const cleaned = spans
    .map((s, i) => {
      const start = Math.max(0, Math.min(s.start, len))
      const end = Math.max(start, Math.min(s.end, len))
      return { ...s, start, end, text: answer.slice(start, end), id: s.id || `s${i}` }
    })
    .filter((s) => s.end > s.start)
    .sort((a, b) => a.start - b.start)

  const out: PerceptionSpan[] = []
  let cursor = 0
  let gap = 0
  for (const s of cleaned) {
    if (s.start > cursor) {
      out.push({
        id: `s-gap-${gap++}`,
        text: answer.slice(cursor, s.start),
        start: cursor,
        end: s.start,
        findingIds: [],
        skillIds: hint,
        evidenceIds: [],
        causeIds: [],
        grounding: 'inferred',
      })
    }
    const start = Math.max(s.start, cursor)
    out.push({ ...s, start, text: answer.slice(start, s.end), skillIds: uniq(s.skillIds).slice(0, 3) })
    cursor = Math.max(cursor, s.end)
  }
  if (cursor < len) {
    out.push({
      id: `s-gap-${gap}`,
      text: answer.slice(cursor),
      start: cursor,
      end: len,
      findingIds: [],
      skillIds: hint,
      evidenceIds: [],
      causeIds: [],
      grounding: 'inferred',
    })
  }
  if (out.length === 0 && answer.length > 0) {
    out.push({
      id: 's-all',
      text: answer,
      start: 0,
      end: len,
      findingIds: [],
      skillIds: hint,
      evidenceIds: [],
      causeIds: [],
      grounding: 'inferred',
    })
  }
  return out
}

function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)]
}
