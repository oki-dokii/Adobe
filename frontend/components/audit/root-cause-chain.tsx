'use client'

import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Finding, RootCause, SkillId } from '@/lib/audit/types'
import { SEVERITY_STYLE } from '@/lib/audit/status'
import { SKILL_MAP } from '@/lib/audit/skills'
import { orderCauses, uniqueSkills } from '@/lib/audit/causes'

export function RootCauseChain({
  causes,
  findings,
  activeId,
  onSelect,
  onSelectFinding,
}: {
  causes: RootCause[]
  findings: Finding[]
  activeId: string | null
  onSelect: (cause: RootCause | null, skillIds: SkillId[]) => void
  onSelectFinding?: (skillId: SkillId) => void
}) {
  const ordered = orderCauses(causes)

  return (
    <section aria-labelledby="rootcause-heading" className="space-y-4">
      <div>
        <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
          CAUSAL HIERARCHY
        </p>
        <h3 id="rootcause-heading" className="mt-1 text-base font-semibold tracking-tight text-foreground">
          Systemic Failure Cascade
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
          Select a causal node to isolate its originating branches and affected evidence on the tree.
        </p>
      </div>

      <ol className="relative mt-5 ml-2.5 border-l border-white/10 space-y-4">
        {ordered.map((cause, i) => {
          const color = SEVERITY_STYLE[cause.severity].color
          const active = activeId === cause.id
          const relatedSkills = uniqueSkills(findings, cause.findingIds)
          const affectedFindings = findings.filter((f) => cause.findingIds.includes(f.id))

          return (
            <li key={cause.id} className="relative pl-5.5 group">
              {/* Spine Node Pin */}
              <span
                aria-hidden
                className={cn(
                  'absolute -left-[5px] top-1.5 size-2.5 rounded-full border border-background transition-all duration-200',
                  active ? 'scale-125 ring-2 ring-signal/40' : 'group-hover:scale-110',
                )}
                style={{ background: color }}
              />

              <button
                type="button"
                onClick={() => onSelect(active ? null : cause, relatedSkills)}
                className={cn(
                  'block w-full text-left rounded-lg p-2.5 -ml-2 transition-all duration-150 cursor-pointer',
                  active
                    ? 'bg-surface border border-white/12 shadow-[0_4px_20px_rgba(0,0,0,0.3)]'
                    : 'hover:bg-white/4',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold leading-snug text-foreground">
                    {cause.label}
                  </span>
                  <span
                    className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-white/8 shrink-0 font-medium"
                    style={{ color, backgroundColor: `${color}10` }}
                  >
                    {cause.severity}
                  </span>
                </div>

                {/* Subordinate Origin label */}
                {i === 0 && (
                  <span className="mt-1 inline-block font-mono text-[9px] text-signal/80 tracking-wider uppercase">
                    ORIGIN ROOT CAUSE
                  </span>
                )}

                {/* Inline Causal Reveal */}
                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2.5 mt-2 border-t border-white/6 space-y-3">
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          {cause.detail}
                        </p>

                        {/* Downstream AI Behavior Impact */}
                        <div className="rounded-md border border-critical/20 bg-critical/5 p-2.5 space-y-1">
                          <div className="flex items-center gap-1.5 font-mono text-[9px] font-semibold text-critical tracking-wider uppercase">
                            <span className="size-1.5 rounded-full bg-critical animate-pulse" />
                            DOWNSTREAM AI PERCEPTION IMPACT
                          </div>
                          <p className="text-[11px] leading-relaxed text-critical/90">
                            {cause.detail.toLowerCase().includes('crawl') || cause.detail.toLowerCase().includes('access')
                              ? 'LLM indexing spiders fail to ingest core assets, causing conversational assistants to omit the brand or report it as defunct.'
                              : cause.detail.toLowerCase().includes('entity') || cause.detail.toLowerCase().includes('identity')
                              ? 'AI models conflate the brand with ambiguous competitor entities, misattributing canonical features in search summaries.'
                              : cause.detail.toLowerCase().includes('render') || cause.detail.toLowerCase().includes('script')
                              ? 'Dual-fetch disparity leaves headless LLMs with empty content, forcing retrieval pipelines to rely on unverified third-party scrapers.'
                              : 'AI answer engines drop citation confidence below threshold, paraphrasing claims inaccurately or substituting direct competitor URLs.'}
                          </p>
                        </div>

                        {/* Affected Findings Register */}
                        {affectedFindings.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="font-mono text-[9px] font-medium tracking-wider text-muted-foreground/70 uppercase">
                              PROPAGATED DEFECTS ({affectedFindings.length})
                            </span>
                            <div className="space-y-1">
                              {affectedFindings.map((f) => (
                                <div
                                  key={f.id}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onSelectFinding?.(f.skillId)
                                  }}
                                  className="flex items-start justify-between gap-2 rounded border border-white/6 bg-black/30 p-2 hover:border-white/15 transition-colors"
                                >
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs font-medium text-foreground/90 truncate">
                                      {f.title}
                                    </p>
                                    <p className="font-mono text-[10px] text-muted-foreground/60 mt-0.5">
                                      {SKILL_MAP[f.skillId]?.label}
                                    </p>
                                  </div>
                                  <span className="font-mono text-[9px] text-signal shrink-0 pt-0.5">
                                    LOCATE →
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
