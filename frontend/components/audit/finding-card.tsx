'use client'

import { useEffect, useRef } from 'react'
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

  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [highlighted])

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden border-l-2 bg-transparent transition-colors',
        highlighted ? 'border-l-signal' : 'border-l-border',
      )}
      style={highlighted ? undefined : { borderLeftColor: sev.color }}
    >
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-start gap-3 p-4 text-left">
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span
              className="font-mono text-[10px] font-semibold uppercase tracking-wide"
              style={{ color: sev.color }}
            >
              {sev.label}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {DIMENSIONS[finding.dimension].label}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground/70">{finding.confidence} conf.</span>
          </span>
          <span className="mt-1.5 block text-[15px] font-medium leading-snug text-foreground">{finding.title}</span>
            <span className="mt-0.5 block text-[12px] text-muted-foreground">{SKILL_MAP[finding.skillId].label}</span>
        </span>
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          viewBox="0 0 24 24"
          className="mt-1 size-4 shrink-0 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-5 border-t border-line px-4 pb-4 pt-4">
              <Block kicker="What" body={finding.description} />
              <div className="flex items-start justify-between gap-3">
                <Block kicker="Why" body={finding.whyItMatters} />
                <WhyHint
                  observed={finding.description}
                  matters={finding.whyItMatters}
                  evidence={finding.evidence[0]?.detail}
                />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground">EVIDENCE</p>
                <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                  {finding.affectedPages}/{finding.sampledPages} pages
                </p>
                <ul className="mt-2 space-y-2">
                  {finding.evidence.map((e) => (
                    <li key={e.id} className="text-[12px]">
                      <span className="text-foreground/90">{e.label}</span>
                      <span className="ml-2 font-mono text-muted-foreground">{e.detail}</span>
                      {(e.url || e.signal) && (
                        <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground/75">
                          {[e.signal, e.url].filter(Boolean).join(' · ')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {rootCause && <Block kicker="Root cause" body={`${rootCause.label} — ${rootCause.detail}`} />}
              <Block
                kicker="Impact"
                body={`${sev.label} · ${finding.affectedPages} of ${finding.sampledPages} sampled pages`}
              />
              <div>
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground">ACTION</p>
                <p className="mt-1.5 text-[13px] font-medium text-foreground">{finding.recommendation.title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{finding.recommendation.detail}</p>
              </div>
              <button
                type="button"
                onClick={onFocusTree}
                className="font-mono text-[10px] tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                Focus on tree
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Block({ kicker, body }: { kicker: string; body: string }) {
  return (
    <div className="min-w-0 flex-1">
      <p className="text-[10px] tracking-[0.12em] text-muted-foreground">{kicker.toUpperCase()}</p>
      <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{body}</p>
    </div>
  )
}
