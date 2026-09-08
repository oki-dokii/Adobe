'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Finding, RootCause, SkillId } from '@/lib/audit/types'
import { SEVERITY_STYLE } from '@/lib/audit/status'

export function RootCauseChain({
  causes,
  findings,
  activeId,
  onSelect,
}: {
  causes: RootCause[]
  findings: Finding[]
  activeId: string | null
  onSelect: (cause: RootCause | null, skillIds: SkillId[]) => void
}) {
  const ordered = orderCauses(causes)

  return (
    <section aria-labelledby="rootcause-heading">
      <p className="font-mono text-[11px] tracking-wider text-muted-foreground">Causal chain</p>
      <h3 id="rootcause-heading" className="mt-1.5 text-lg font-semibold tracking-tight text-foreground">
        How it cascades
      </h3>

      <ol className="relative mt-5 ml-3 border-l border-border">
        {ordered.map((cause, i) => {
          const color = SEVERITY_STYLE[cause.severity].color
          const active = activeId === cause.id
          const relatedSkills = uniqueSkills(findings, cause.findingIds)
          return (
            <li key={cause.id} className="relative pl-5 pb-5 last:pb-0">
              <span
                aria-hidden
                className="absolute -left-[5px] top-1.5 size-2.5 rounded-full border border-background"
                style={{ background: color }}
              />
              <motion.button
                type="button"
                onClick={() => onSelect(active ? null : cause, relatedSkills)}
                className={cn(
                  'block w-full text-left transition-opacity',
                  active ? 'opacity-100' : 'opacity-80 hover:opacity-100',
                )}
              >
                  <span className="text-[15px] font-medium leading-snug text-foreground">{cause.label}</span>
                {active && (
                  <span className="mt-1.5 block text-[12px] leading-relaxed text-muted-foreground">{cause.detail}</span>
                )}
              </motion.button>
              {i < ordered.length - 1 && (
                <span aria-hidden className="mt-2 block text-center text-muted-foreground/40">
                  ↓
                </span>
              )}
              {i === 0 && (
                <span className="mt-1 block font-mono text-[10px] text-muted-foreground/60">origin</span>
              )}
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function orderCauses(causes: RootCause[]): RootCause[] {
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

function uniqueSkills(findings: Finding[], ids: string[]): SkillId[] {
  const set = new Set<SkillId>()
  for (const id of ids) {
    const f = findings.find((x) => x.id === id)
    if (f) set.add(f.skillId)
  }
  return [...set]
}
