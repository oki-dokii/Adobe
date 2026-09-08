'use client'

import { useEffect, useState } from 'react'
import type { Finding, RootCause } from '@/lib/audit/types'
import { FindingCard } from './finding-card'

export function FindingsList({
  findings,
  causes = [],
  highlightedIds = [],
  onInspectSkill,
}: {
  findings: Finding[]
  causes?: RootCause[]
  highlightedIds?: string[]
  onInspectSkill?: (skillId: Finding['skillId']) => void
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (highlightedIds.length === 0) return
    setOpen((prev) => {
      const next = { ...prev }
      for (const id of highlightedIds) next[id] = true
      return next
    })
  }, [highlightedIds])

  const defects = findings.filter((f) => !f.isLimitation)
  const limitations = findings.filter((f) => f.isLimitation)

  return (
    <div className="space-y-8">
      <section aria-labelledby="findings-heading" className="space-y-3">
        <div>
          <p className="font-mono text-[11px] tracking-wider text-muted-foreground">Findings</p>
          <h3 id="findings-heading" className="mt-1.5 text-lg font-semibold tracking-tight text-foreground">
            {defects.length} issues, most severe first
          </h3>
        </div>
        <div className="space-y-2">
          {defects.map((f) => (
            <FindingCard
              key={f.id}
              finding={f}
              rootCause={causes.find((c) => c.id === f.rootCauseId)}
              open={!!open[f.id]}
              highlighted={highlightedIds.includes(f.id)}
              onFocusTree={() => onInspectSkill?.(f.skillId)}
              onToggle={() => {
                setOpen((prev) => {
                  const nextOpen = !prev[f.id]
                  if (nextOpen) onInspectSkill?.(f.skillId)
                  return { ...prev, [f.id]: nextOpen }
                })
              }}
            />
          ))}
        </div>
      </section>

      {limitations.length > 0 && (
        <section aria-labelledby="limits-heading" className="space-y-3">
          <div>
            <p className="font-mono text-[11px] tracking-wider text-muted-foreground">Audit limitations</p>
            <h3 id="limits-heading" className="mt-1.5 text-sm font-medium text-muted-foreground">
              Boundaries of the inspection — not site defects
            </h3>
          </div>
          <div className="space-y-2">
            {limitations.map((f) => (
              <div key={f.id} className="border-t border-dashed border-border py-4">
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground">AUDIT LIMITATION</p>
                <p className="mt-1.5 text-sm font-medium text-foreground">{f.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                  {f.limitationReason ?? f.description}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {f.evidence.map((e) => (
                    <li key={e.id} className="flex items-baseline justify-between gap-3 font-mono text-[11px]">
                      <span className="text-muted-foreground">{e.label}</span>
                      <span className="text-foreground/70">{e.detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
