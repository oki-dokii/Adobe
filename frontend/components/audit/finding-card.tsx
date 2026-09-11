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

  const consequenceChain = SKILL_MAP[finding.skillId]?.consequenceChain

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
        'overflow-hidden rounded-xl border transition-all duration-200',
        open
          ? 'bg-[#0f1526]/95 border-white/14 shadow-[0_8px_30px_rgba(0,0,0,0.5)]'
          : 'bg-white/[0.02] border-white/6 hover:border-white/14 hover:bg-white/[0.04]',
        highlighted && 'ring-2 ring-indigo-500 border-indigo-500/60 bg-[#0f1526]',
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
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 font-semibold uppercase tracking-wider text-[9px]"
              style={{
                background: `${sev.color}15`,
                color: sev.color,
                border: `1px solid ${sev.color}35`,
              }}
            >
              <span className="size-1.5 rounded-full" style={{ background: sev.color }} />
              {sev.label}
            </span>
            <span className="rounded-md border border-white/8 bg-white/5 px-2 py-0.5 text-muted-foreground uppercase text-[9px]">
              {DIMENSIONS[finding.dimension].verb}
            </span>
            <span className="rounded-md border border-white/8 bg-white/5 px-2 py-0.5 text-muted-foreground/80 uppercase text-[9px]">
              {finding.confidence} CONF
            </span>
          </span>

          {/* Dominant Title */}
          <span className="mt-2 block text-xs font-semibold leading-snug text-foreground">
            {finding.title}
          </span>
          <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground/75">
            {SKILL_MAP[finding.skillId].label}
          </span>
        </span>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 text-muted-foreground"
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
              <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3 space-y-1.5">
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

              {/* AI BEHAVIOR CONSEQUENCE CHAIN */}
              {consequenceChain && consequenceChain.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                    AI BEHAVIOR CONSEQUENCE
                  </span>
                  <div className="rounded-xl border border-white/8 bg-black/40 overflow-hidden">
                    {consequenceChain.map((step, i) => (
                      <div key={i} className="relative">
                        <div
                          className={cn(
                            'flex items-start gap-3 px-3 py-2.5',
                            i < consequenceChain.length - 1 && 'border-b border-white/6',
                          )}
                        >
                          <span
                            className={cn(
                              'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold',
                              i === 0 && 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
                              i === 1 && 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
                              i === 2 && 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
                            )}
                          >
                            {i + 1}
                          </span>
                          <span
                            className={cn(
                              'text-[11px] leading-relaxed',
                              i === 0 && 'text-foreground/80',
                              i === 1 && 'text-foreground/70',
                              i === 2 && 'text-rose-300 font-medium',
                            )}
                          >
                            {step}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EVIDENCE: Rendered as artifacts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                    SIGNAL EVIDENCE
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                    {finding.affectedPages} / {finding.sampledPages} sampled
                  </span>
                </div>
                <div className="space-y-1.5">
                  {finding.evidence.map((e) => (
                    <div
                      key={e.id}
                      className="rounded-lg border border-white/6 bg-black/40 overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-white/6">
                        <span className="font-mono text-[11px] font-medium text-foreground">{e.label}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {e.confidence && (
                            <span
                              className={cn(
                                'rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider',
                                e.confidence === 'high' && 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
                                e.confidence === 'medium' && 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
                                e.confidence === 'low' && 'bg-white/8 text-muted-foreground border border-white/10',
                              )}
                            >
                              {e.confidence}
                            </span>
                          )}
                          {e.signal && (
                            <code className="rounded bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 font-mono text-[9px] text-indigo-300 tracking-wide">
                              {e.signal}
                            </code>
                          )}
                        </div>
                      </div>
                      <div className="px-3 py-2 space-y-1.5">
                        {e.reference ? (
                          <pre className="overflow-x-auto rounded-md bg-black/50 border border-white/6 px-2.5 py-2 font-mono text-[10px] text-foreground/80 whitespace-pre-wrap break-all">
                            {e.detail}
                            {'\n'}
                            <span className="text-muted-foreground/50 text-[9px]">{e.reference}</span>
                          </pre>
                        ) : (
                          <p className="font-mono text-[11px] text-muted-foreground">{e.detail}</p>
                        )}
                        {e.url && (
                          <a
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(ev) => ev.stopPropagation()}
                            className="inline-flex items-center gap-1.5 rounded border border-indigo-500/25 bg-indigo-500/10 px-2.5 py-1 font-mono text-[9px] text-indigo-300 hover:text-white transition-colors max-w-full"
                          >
                            <svg viewBox="0 0 12 12" className="size-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
                              <path d="M7 1h4v4M11 1L5 7M3 3H1v8h8V9" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="truncate">{e.url.replace(/^https?:\/\//, '')}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ROOT CAUSE: System link */}
              {rootCause && (
                <div className="rounded-xl border border-white/6 bg-white/[0.02] p-3 space-y-1">
                  <span className="font-mono text-[9px] tracking-wider text-muted-foreground/70 uppercase">
                    CAUSAL ROOT ORIGIN
                  </span>
                  <p className="text-xs font-semibold text-foreground">{rootCause.label}</p>
                  <p className="text-[11px] text-muted-foreground">{rootCause.detail}</p>
                </div>
              )}

              {/* ACTION: Remediation */}
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/[0.04] p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-300 uppercase">
                    RECOMMENDED ACTION
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPatch}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] text-muted-foreground transition-colors hover:text-foreground hover:bg-white/10 cursor-pointer"
                  >
                    {copied ? 'COPIED ✓' : 'COPY ACTION'}
                  </button>
                </div>
                <p className="font-bold text-foreground text-xs">{finding.recommendation.title}</p>
                <p className="leading-relaxed text-muted-foreground text-[11px]">{finding.recommendation.detail}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-white/6 mt-1">
                  <span
                    className={cn(
                      'rounded px-2 py-0.5 font-mono text-[9px] uppercase font-bold',
                      finding.recommendation.priority === 'critical' && 'bg-rose-500/15 text-rose-300',
                      finding.recommendation.priority === 'high' && 'bg-amber-500/15 text-amber-300',
                      finding.recommendation.priority === 'medium' && 'bg-indigo-500/15 text-indigo-300',
                      finding.recommendation.priority === 'low' && 'bg-white/8 text-muted-foreground',
                    )}
                  >
                    {finding.recommendation.priority} priority
                  </span>
                  <span className="rounded bg-white/5 border border-white/8 px-2 py-0.5 font-mono text-[9px] text-muted-foreground uppercase">
                    {finding.recommendation.effort} effort
                  </span>
                </div>
              </div>

              {/* FOCUS ON TREE */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onFocusTree}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-indigo-300 uppercase transition-colors hover:bg-indigo-500/20 cursor-pointer"
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
