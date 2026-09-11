'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { RootCause, Site, SkillId } from '@/lib/audit/types'
import { SKILL_MAP } from '@/lib/audit/skills'
import { STATUS_STYLE } from '@/lib/audit/status'
import { downloadMarkdownReport } from '@/lib/audit/export'
import { ScoreOverview } from './score-overview'
import { RootCauseChain } from './root-cause-chain'
import { FindingsList } from './findings-list'
import { SkillInspector } from './skill-inspector'
import { cn } from '@/lib/utils'

type Tab = 'diagnose' | 'chain' | 'findings'
type PanelTab = Tab | 'perceive'

export function ResultsView({
  focusedSite,
  selectedSkill,
  activeCause,
  onSelectCause,
  onSelectFinding,
  onCloseSkill,
  treeMode,
  onTreeMode,
  focusedSkillIds = [],
  highlightedFindingIds,
  perceptionPanel,
  onExport,
}: {
  sites: Site[]
  focusedSite: Site
  focusedId: string
  onFocus: (id: string) => void
  selectedSkill: SkillId | null
  activeCause: RootCause | null
  onSelectCause: (cause: RootCause | null, skillIds: SkillId[]) => void
  onSelectFinding: (skillId: SkillId) => void
  onCloseSkill: () => void
  treeMode: Tab
  onTreeMode: (mode: Tab) => void
  focusedSkillIds?: SkillId[]
  highlightedFindingIds?: string[]
  perceptionPanel?: ReactNode
  onExport?: () => void
}) {
  const [researchOpen, setResearchOpen] = useState(false)
  const [panelTab, setPanelTab] = useState<PanelTab>(treeMode)

  useEffect(() => {
    setPanelTab(treeMode)
  }, [treeMode])
  const result = focusedSite.result
  if (!result) return null

  const highlightedIds =
    highlightedFindingIds?.length
      ? highlightedFindingIds
      : (activeCause?.findingIds ??
        result.findings.filter((f) => focusedSkillIds.includes(f.skillId)).map((f) => f.id))
  const actions = result.findings.filter((f) => !f.isLimitation).map((f) => f.recommendation)
  const skill = selectedSkill ? SKILL_MAP[selectedSkill] : null
  const accent = selectedSkill
    ? STATUS_STYLE[focusedSite.skills.find((s) => s.id === selectedSkill)?.status ?? 'completed'].color
    : activeCause
      ? 'var(--signal)'
      : 'var(--border)'

  return (
    <aside
      className={cn(
        'pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex max-h-[58vh] flex-col overflow-hidden border-t border-white/10 bg-surface/95 backdrop-blur-xl',
        'lg:inset-y-16 lg:right-6 lg:left-auto lg:bottom-6 lg:max-h-none lg:w-[25.5rem] lg:rounded-2xl lg:border lg:border-white/10 lg:bg-[#0a0f1a]/90 lg:shadow-[0_20px_50px_rgba(0,0,0,0.6)]',
      )}
      style={{
        borderLeftColor: accent,
        borderLeftWidth: skill || activeCause ? 3 : 1,
      }}
    >
      {/* Top Header / Switcher Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/6 bg-black/40 px-4 py-3">
        {skill ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 truncate">
              <span className="size-2 rounded-full" style={{ background: accent }} />
              <p className="truncate font-mono text-xs font-semibold text-foreground uppercase tracking-wide">
                {skill.label}
              </p>
            </div>
            <button
              type="button"
              onClick={onCloseSkill}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:text-foreground hover:bg-white/10 cursor-pointer"
            >
              CLOSE ✕
            </button>
          </div>
        ) : (
          <nav className="flex w-full items-center justify-between gap-0.5 rounded-lg border border-white/6 bg-surface-2/60 p-1" aria-label="Diagnostic views">
            {(['diagnose', 'chain', 'findings'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onCloseSkill()
                  setPanelTab(id)
                  onTreeMode(id)
                }}
                className={cn(
                  'flex-1 rounded-md py-1.5 text-center font-mono text-[10px] font-semibold tracking-wider transition-all duration-150 cursor-pointer uppercase',
                  panelTab === id
                    ? 'border border-signal/40 bg-signal/15 text-signal shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {id === 'chain' ? 'CAUSES' : id === 'diagnose' ? 'DIAGNOSE' : 'FINDINGS'}
              </button>
            ))}
            {perceptionPanel && (
              <button
                type="button"
                onClick={() => {
                  onCloseSkill()
                  setPanelTab('perceive')
                }}
                className={cn(
                  'flex-1 rounded-md py-1.5 text-center font-mono text-[10px] font-semibold tracking-wider transition-all duration-150 cursor-pointer uppercase lg:hidden',
                  panelTab === 'perceive'
                    ? 'border border-signal/40 bg-signal/15 text-signal shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                PERCEIVE
              </button>
            )}
          </nav>
        )}
      </div>

      {/* Main Panel Content Area */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4.5 py-5">
        <AnimatePresence mode="wait">
          {selectedSkill ? (
            <SkillInspector
              key={`skill-${selectedSkill}`}
              skillId={selectedSkill}
              run={focusedSite.skills.find((s) => s.id === selectedSkill)}
              result={result}
              onClose={onCloseSkill}
            />
          ) : (
            <motion.div
              key={panelTab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {panelTab === 'perceive' && <div className="lg:hidden">{perceptionPanel}</div>}

              {(panelTab === 'diagnose' || panelTab === 'perceive') && (
                <div className={panelTab === 'perceive' ? 'hidden lg:block space-y-6' : undefined}>
                  <ScoreOverview result={result} host={focusedSite.host} />

                  {/* Priority Remediation Actions */}
                  <section className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-white/6 pb-1">
                      <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        PRIORITY ACTIONS
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        {actions.length} RECOMMENDATIONS
                      </span>
                    </div>
                    <ol className="space-y-2">
                      {actions.slice(0, 4).map((r, i) => (
                        <li key={r.id} className="flex items-start gap-3 rounded-lg border border-white/6 bg-surface/40 p-2.5">
                          <span className="font-mono text-[11px] font-bold text-signal/80 pt-0.5">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <p className="text-xs font-medium leading-snug text-foreground">{r.title}</p>
                            <p className="text-[11px] leading-relaxed text-muted-foreground mt-0.5">{r.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>

                  {/* Methodological Scope & Boundaries Banner */}
                  <section className="rounded-xl border border-white/8 bg-surface-2/40 p-3.5 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                        METHODOLOGICAL SCOPE
                      </span>
                      <span className="rounded bg-white/5 border border-white/8 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground uppercase">
                        DETERMINISTIC V1
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      Measures structural extractability, machine legibility, and citation preconditions via read-only GET/HEAD crawling. Evaluates technical readiness, not stochastic query volume.
                    </p>
                  </section>
                </div>
              )}

              {panelTab === 'chain' && (
                <RootCauseChain
                  causes={result.rootCauses}
                  findings={result.findings}
                  activeId={activeCause?.id ?? null}
                  onSelect={(cause, skillIds) => {
                    onSelectCause(cause, skillIds)
                  }}
                  onSelectFinding={onSelectFinding}
                />
              )}

              {panelTab === 'findings' && (
                <FindingsList
                  findings={result.findings}
                  causes={result.rootCauses}
                  highlightedIds={highlightedIds}
                  onInspectSkill={onSelectFinding}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action & Telemetry Toolbar */}
      <div className="border-t border-white/6 bg-black/40 p-3 space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExport ?? (() => downloadMarkdownReport(focusedSite))}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg border border-signal/40 bg-signal/15 px-3 py-2 font-mono text-[10px] font-bold tracking-wider text-signal uppercase transition-colors hover:bg-signal/25 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            EXPORT REPORT (.MD)
          </button>
          <button
            type="button"
            onClick={() => setResearchOpen(true)}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase transition-colors hover:text-foreground hover:bg-white/10 cursor-pointer"
            title="View research basis and methodology"
          >
            RESEARCH ↗
          </button>
        </div>
        <p className="font-mono text-[9px] leading-relaxed text-muted-foreground/50 text-center">
          AUDIT ID: {focusedSite.id} · READ-ONLY RECONCILIATION
        </p>
      </div>

      {/* Research Basis Modal Overlay */}
      <AnimatePresence>
        {researchOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-50 flex flex-col bg-[#080d1a]/98 backdrop-blur-2xl p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="font-mono text-[9px] font-semibold text-signal uppercase tracking-wider">
                  METHODOLOGY & RIGOR
                </span>
                <h3 className="text-sm font-semibold text-foreground">Research Basis</h3>
              </div>
              <button
                type="button"
                onClick={() => setResearchOpen(false)}
                className="rounded border border-white/10 bg-white/5 px-2 py-1 font-mono text-[10px] text-muted-foreground hover:text-foreground hover:bg-white/10 cursor-pointer"
              >
                CLOSE ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="rounded-lg border border-white/8 bg-surface-2/40 p-3 space-y-2">
                <span className="font-mono text-[10px] font-semibold text-foreground uppercase">
                  EMPIRICAL EVALUATION CORPUS
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-center">
                  <div className="rounded border border-white/6 bg-black/40 p-2">
                    <div className="text-base font-bold text-signal">38</div>
                    <div className="text-[9px] text-muted-foreground uppercase">DOMAINS AUDITED</div>
                  </div>
                  <div className="rounded border border-white/6 bg-black/40 p-2">
                    <div className="text-base font-bold text-foreground">220+</div>
                    <div className="text-[9px] text-muted-foreground uppercase">FINDINGS CATALOGED</div>
                  </div>
                  <div className="rounded border border-white/6 bg-black/40 p-2">
                    <div className="text-base font-bold text-emerald-400">60</div>
                    <div className="text-[9px] text-muted-foreground uppercase">CANDIDATE SIGNALS</div>
                  </div>
                  <div className="rounded border border-white/6 bg-black/40 p-2">
                    <div className="text-base font-bold text-amber-400">9</div>
                    <div className="text-[9px] text-muted-foreground uppercase">PRODUCTION SKILLS</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-mono text-[10px] font-semibold text-foreground uppercase tracking-wide">
                  CORE TECHNICAL PROTOCOLS
                </h4>
                <ul className="space-y-1.5 text-muted-foreground text-[11px] leading-relaxed">
                  <li>
                    <strong className="text-foreground">RFC 9309 Compliance:</strong> Evaluates robots.txt rules specifically for `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended`.
                  </li>
                  <li>
                    <strong className="text-foreground">Dual-Fetch Render Analysis:</strong> Computes the text extractability ratio between raw server-rendered HTML and hydrated client DOM.
                  </li>
                  <li>
                    <strong className="text-foreground">Non-Invasive Safety:</strong> Strictly read-only GET/HEAD requests with time-bounded skip ladder and SSRF protection.
                  </li>
                  <li>
                    <strong className="text-foreground">Deterministic v1:</strong> Zero stochastic LLM hallucination in audit scoring (llm_calls = 0).
                  </li>
                </ul>
              </div>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-1">
                <span className="font-mono text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                  HONEST METHODOLOGICAL DISCLOSURE
                </span>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  This system measures structural extractability and machine legibility—the required technical preconditions for AI representation. It deliberately avoids claiming non-deterministic live search query frequency.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}

