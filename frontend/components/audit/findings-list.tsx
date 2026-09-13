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
    <div className="space-y-7">
      {/* Primary Findings Section */}
      <section aria-labelledby="findings-heading" className="space-y-3">
        <div>
          <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            EVIDENCE REGISTER
          </p>
          <h3 id="findings-heading" className="mt-1 text-base font-semibold tracking-tight text-foreground">
            {defects.length} Issues Detected
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Ranked by perceptual risk and causal propagation.
          </p>
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
                const nextOpen = !open[f.id]
                setOpen((prev) => ({ ...prev, [f.id]: nextOpen }))
                if (nextOpen) onInspectSkill?.(f.skillId)
              }}
            />
          ))}
        </div>
      </section>

      {/* Audit Limitations Section — Clear Scope Boundary */}
      {limitations.length > 0 && (
        <section aria-labelledby="limits-heading" className="rounded-xl border border-white/8 bg-surface-2/20 p-4 space-y-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-muted-foreground/60" />
              <p className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                SCOPE BOUNDARIES & AUDIT LIMITATIONS
              </p>
            </div>
            <h3 id="limits-heading" className="mt-1 text-xs font-medium text-foreground/80">
              Inspection boundaries encountered — not site defects
            </h3>
          </div>

          <div className="space-y-3 pt-1">
            {limitations.map((f) => {
              const text = f.limitationReason ?? f.description
              const distinctEvidence = f.evidence.filter(
                (e) => e.detail && e.detail.trim() !== text.trim() && e.detail !== f.title
              )
              return (
                <div key={f.id} className="rounded-lg border border-white/6 bg-black/30 p-3 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-medium text-foreground/90">{f.title}</p>
                    <span className="rounded border border-white/8 bg-white/4 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground uppercase">
                      BOUNDARY
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {text}
                  </p>
                  {distinctEvidence.length > 0 && (
                    <ul className="space-y-1 pt-1 border-t border-white/6">
                      {distinctEvidence.map((e) => (
                        <li key={e.id} className="flex items-baseline justify-between gap-3 font-mono text-[10px]">
                          <span className="text-muted-foreground/80">{e.label}</span>
                          <span className="text-foreground/70">{e.detail}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
