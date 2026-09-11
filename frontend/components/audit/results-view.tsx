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
      ? '#4f46e5'
      : '#e2e8f0'

  return (
    <aside
      className={cn(
        'pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex max-h-[60vh] flex-col overflow-hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl',
        'lg:inset-y-16 lg:right-6 lg:left-auto lg:bottom-6 lg:max-h-none lg:w-[27rem] lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white/95 lg:shadow-[0_20px_50px_rgba(0,0,0,0.08)]',
      )}
      style={{
        borderLeftColor: accent,
        borderLeftWidth: skill || activeCause ? 3 : 1,
      }}
    >
      {/* Top Header / Switcher Bar */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-4 py-3">
        {skill ? (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 truncate">
              <span className="size-2 rounded-full" style={{ background: accent }} />
              <p className="truncate text-xs font-bold text-slate-900 uppercase tracking-wide">
                {skill.label}
              </p>
            </div>
            <button
              type="button"
              onClick={onCloseSkill}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
            >
              Close ✕
            </button>
          </div>
        ) : (
          <nav className="flex w-full items-center justify-between gap-1 rounded-xl bg-slate-200/60 p-1" aria-label="Diagnostic views">
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
                  'flex-1 rounded-lg py-1.5 text-center text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer uppercase',
                  panelTab === id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                {id === 'chain' ? 'Causes' : id === 'diagnose' ? 'Diagnose' : 'Findings'}
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
                  'flex-1 rounded-lg py-1.5 text-center text-xs font-semibold tracking-wide transition-all duration-150 cursor-pointer uppercase lg:hidden',
                  panelTab === 'perceive'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                Perceive
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
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1">
                      <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
                        Priority Actions
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        {actions.length} Recommendations
                      </span>
                    </div>
                    <ol className="space-y-2">
                      {actions.slice(0, 4).map((r, i) => (
                        <li key={r.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3 shadow-2xs">
                          <span className="font-mono text-xs font-bold text-indigo-600 pt-0.5">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div>
                            <p className="text-xs font-bold leading-snug text-slate-900">{r.title}</p>
                            <p className="text-xs leading-relaxed text-slate-600 mt-0.5">{r.detail}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </section>

                  {/* Methodological Scope & Boundaries Banner */}
                  <section className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold tracking-wider text-slate-600 uppercase">
                        Methodological Scope
                      </span>
                      <span className="rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-semibold text-indigo-700 uppercase">
                        Deterministic
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-600">
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
      <div className="border-t border-slate-100 bg-slate-50/70 p-3.5 space-y-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExport ?? (() => downloadMarkdownReport(focusedSite))}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all cursor-pointer active:scale-[0.98]"
          >
            <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Export Report (.md)</span>
          </button>
          <button
            type="button"
            onClick={() => setResearchOpen(true)}
            className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            title="View research basis and methodology"
          >
            Methodology ↗
          </button>
        </div>
        <p className="font-mono text-[10px] leading-relaxed text-slate-400 text-center">
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
            className="absolute inset-0 z-50 flex flex-col bg-white p-5 overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                  Methodology & Rigor
                </span>
                <h3 className="text-base font-bold text-slate-900">Research Basis</h3>
              </div>
              <button
                type="button"
                onClick={() => setResearchOpen(false)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-4 py-4 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-2.5">
                <span className="text-xs font-bold text-slate-900 uppercase">
                  Empirical Evaluation Corpus
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono text-center">
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                    <div className="text-lg font-extrabold text-indigo-600">38</div>
                    <div className="text-[10px] text-slate-500 uppercase font-sans mt-0.5">DOMAINS AUDITED</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                    <div className="text-lg font-extrabold text-slate-900">220+</div>
                    <div className="text-[10px] text-slate-500 uppercase font-sans mt-0.5">FINDINGS CATALOGED</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                    <div className="text-lg font-extrabold text-emerald-600">60</div>
                    <div className="text-[10px] text-slate-500 uppercase font-sans mt-0.5">CANDIDATE SIGNALS</div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
                    <div className="text-lg font-extrabold text-amber-600">9</div>
                    <div className="text-[10px] text-slate-500 uppercase font-sans mt-0.5">PRODUCTION SKILLS</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Core Technical Protocols
                </h4>
                <ul className="space-y-1.5 text-slate-600 text-xs leading-relaxed">
                  <li>
                    <strong className="text-slate-900">RFC 9309 Compliance:</strong> Evaluates robots.txt rules specifically for `GPTBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended`.
                  </li>
                  <li>
                    <strong className="text-slate-900">Dual-Fetch Render Analysis:</strong> Computes text extractability ratio between server HTML and hydrated client DOM.
                  </li>
                  <li>
                    <strong className="text-slate-900">Non-Invasive Safety:</strong> Strictly read-only GET/HEAD requests with time-bounded skip ladder and SSRF protection.
                  </li>
                  <li>
                    <strong className="text-slate-900">Deterministic v1:</strong> Zero stochastic LLM hallucination in audit scoring (llm_calls = 0).
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3.5 space-y-1">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Honest Methodological Disclosure
                </span>
                <p className="text-xs text-amber-900/80 leading-relaxed">
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
