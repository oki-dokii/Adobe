import type { PerceptionBundle } from './types'

const TTL_MS = 10 * 60 * 1000
const store = new Map<string, { at: number; bundle: PerceptionBundle }>()

export function perceptionCacheKey(
  host: string,
  questionId: string,
  skippedSkillIds: string[],
  findingIds: string[],
) {
  return `${host}|${questionId}|${[...skippedSkillIds].sort().join(',')}|${findingIds.join(',')}`
}

export function getCachedBundle(key: string): PerceptionBundle | null {
  const hit = store.get(key)
  if (!hit) return null
  if (Date.now() - hit.at > TTL_MS) {
    store.delete(key)
    return null
  }
  return hit.bundle
}

export function setCachedBundle(key: string, bundle: PerceptionBundle) {
  store.set(key, { at: Date.now(), bundle })
}
