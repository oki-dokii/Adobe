'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Finding, RootCause } from '@/lib/audit/types'
import { SKILL_MAP, DIMENSIONS } from '@/lib/audit/skills'
import { SEVERITY_STYLE } from '@/lib/audit/status'
import { WhyHint } from './why-hint'

export function FindingCard({
  finding,
  rootCause,
  open,
  highlighted,
  onToggle,
  onFocusTree,
}: {
  finding: Finding
  rootCause?: RootCause
  open: boolean
  highlighted?: boolean
  onToggle: () => void
  onFocusTree?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const sev = SEVERITY_STYLE[finding.severity]
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [highlighted])

  const handleCopyPatch = (e: React.MouseEvent) => {
    e.stopPropagation()
    const patchText = `// Remediation for: ${finding.title}\n// Dimension: ${DIMENSIONS[finding.dimension].label} | Severity: ${sev.label}\n\n${finding.recommendation.title}\n${finding.recommendation.detail}`
    navigator.clipboard?.writeText(patchText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-lg border transition-all duration-200',
        open
          ? 'bg-surface/90 border-white/14 shadow-[0_6px_24px_rgba(0,0,0,0.4)]'
          : 'bg-surface/40 border-white/6 hover:border-white/12',
        highlighted && 'ring-1 ring-signal border-signal/50 bg-surface/90',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-3.5 text-left transition-colors cursor-pointer"
      >
        <span className="min-w-0 flex-1">
          {/* Metadata Badges */}
          <span className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
            <span
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
              style={{
                background: `${sev.color}15`,
                color: sev.color,
                border: `1px solid ${sev.color}35`,
              }}
            >
              <span className="size-1 rounded-full" style={{ background: sev.color }} />
              {sev.label}
            </span>
            <span className="rounded border border-white/8 bg-surface-2/60 px-1.5 py-0.5 text-muted-foreground uppercase">
              {DIMENSIONS[finding.dimension].verb}
            </span>
            <span className="rounded border border-white/8 bg-surface-2/60 px-1.5 py-0.5 text-muted-foreground/80 uppercase">
              {finding.confidence} CONF
            </span>
          </span>

          {/* Dominant Title */}
          <span className="mt-2 block text-[13px] font-semibold leading-snug text-foreground">
            {finding.title}
          </span>
          <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground/70">
            {SKILL_MAP[finding.skillId].label}
          </span>
        </span>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 flex size-5 shrink-0 items-center justify-center rounded border border-white/8 bg-surface-2 text-muted-foreground"
        >
          <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-white/6 px-4 pb-4 pt-3 text-xs">
              {/* WHAT: Observation */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                  WHAT WAS OBSERVED
                </span>
                <p className="leading-relaxed text-foreground/90">{finding.description}</p>
              </div>

              {/* WHY: Impact */}
              <div className="rounded-lg border border-white/6 bg-surface-2/50 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
                    WHY THIS MATTERS
                  </span>
                  <WhyHint
                    observed={finding.description}
                    matters={finding.whyItMatters}
                    evidence={finding.evidence[0]?.detail}
                  />
                </div>
                <p className="leading-relaxed text-muted-foreground">{finding.whyItMatters}</p>
              </div>

              {/* EVIDENCE: Concrete Register */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                    DOM & SIGNAL EVIDENCE
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    {finding.affectedPages} of {finding.sampledPages} sampled pages
                  </span>
                </div>
                <div className="space-y-1.5">
                  {finding.evidence.map((e) => (
                    <div
                      key={e.id}
                      className="rounded border border-white/6 bg-black/40 p-2.5 font-mono text-[11px]"
                    >
                      <div className="flex items-center justify-between text-foreground">
                        <span className="font-medium">{e.label}</span>
                        {e.signal && <span className="text-signal text-[10px]">{e.signal}</span>}
                      </div>
                      <p className="mt-1 text-muted-foreground break-all">{e.detail}</p>
                      {e.url && (
                        <p className="mt-0.5 text-[10px] text-muted-foreground/50 break-all">
                          URL: {e.url}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* ROOT CAUSE: System link */}
              {rootCause && (
                <div className="rounded border border-white/6 bg-surface-2/30 p-2.5 space-y-1">
                  <span className="font-mono text-[9px] tracking-wider text-muted-foreground/70 uppercase">
                    CAUSAL ROOT ORIGIN
                  </span>
                  <p className="text-xs font-medium text-foreground">{rootCause.label}</p>
                  <p className="text-[11px] text-muted-foreground">{rootCause.detail}</p>
                </div>
              )}

              {/* ACTION: Remediation */}
              <div className="rounded-lg border border-white/10 bg-surface-2/60 p-3 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-semibold tracking-wider text-signal uppercase">
                    RECOMMENDED ACTION
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPatch}
                    className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] text-muted-foreground transition-colors hover:text-foreground hover:bg-white/10"
                  >
                    {copied ? 'COPIED ✓' : 'COPY ACTION'}
                  </button>
                </div>
                <p className="font-semibold text-foreground text-xs">{finding.recommendation.title}</p>
                <p className="leading-relaxed text-muted-foreground text-[11px]">{finding.recommendation.detail}</p>
              </div>

              {/* FOCUS ON TREE Navigation Button */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onFocusTree}
                  className="inline-flex items-center gap-1.5 rounded border border-signal/30 bg-signal/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-signal uppercase transition-colors hover:bg-signal/20"
                >
                  <span>FOCUS ON TREE</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
