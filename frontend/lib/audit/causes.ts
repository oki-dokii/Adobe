import type { Finding, RootCause, SkillId } from './types'

export function orderCauses(causes: RootCause[]): RootCause[] {
  if (causes.length === 0) return []
  const byId = new Map(causes.map((c) => [c.id, c]))
  const childOf = new Map<string | null, RootCause[]>()
  for (const c of causes) {
    const list = childOf.get(c.parentId) ?? []
    list.push(c)
    childOf.set(c.parentId, list)
  }
  const roots = childOf.get(null) ?? causes.filter((c) => !c.parentId || !byId.has(c.parentId))
  const out: RootCause[] = []
  const walk = (node: RootCause) => {
    out.push(node)
    for (const child of childOf.get(node.id) ?? []) walk(child)
  }
  for (const r of roots) walk(r)
  return out.length ? out : causes
}

export function uniqueSkills(findings: Finding[], ids: string[]): SkillId[] {
  const set = new Set<SkillId>()
  for (const id of ids) {
    const f = findings.find((x) => x.id === id)
    if (f) set.add(f.skillId)
  }
  return [...set]
}
