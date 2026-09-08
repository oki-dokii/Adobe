'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { RootCause, Site, SkillId } from '@/lib/audit/types'
import { SKILL_MAP } from '@/lib/audit/skills'
import { STATUS_STYLE } from '@/lib/audit/status'
import { ScoreOverview } from './score-overview'
import { RootCauseChain } from './root-cause-chain'
import { FindingsList } from './findings-list'
import { SkillInspector } from './skill-inspector'
import { cn } from '@/lib/utils'

type Tab = 'diagnose' | 'chain' | 'findings'

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
}) {
  const result = focusedSite.result
  if (!result) return null

  const tab = treeMode

  const highlightedIds =
    activeCause?.findingIds ??
    result.findings.filter((f) => focusedSkillIds.includes(f.skillId)).map((f) => f.id)
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
          <nav className="flex w-full items-center justify-between rounded-lg border border-white/6 bg-surface-2/60 p-1" aria-label="Diagnostic views">
            {(['diagnose', 'chain', 'findings'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onCloseSkill()
                  onTreeMode(id)
                }}
                className={cn(
                  'flex-1 rounded-md py-1.5 text-center font-mono text-[10px] font-semibold tracking-wider transition-all duration-150 cursor-pointer uppercase',
                  tab === id
                    ? 'border border-signal/40 bg-signal/15 text-signal shadow-sm'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {id === 'chain' ? 'CAUSES' : id === 'diagnose' ? 'DIAGNOSE' : 'FINDINGS'}
              </button>
            ))}
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
              key={tab}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-7"
            >
              {tab === 'diagnose' && (
                <>
                  <ScoreOverview result={result} host={focusedSite.host} />
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
                </>
              )}
              {tab === 'chain' && (
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
              {tab === 'findings' && (
                <FindingsList
                  findings={result.findings}
                  causes={result.rootCauses}
                  highlightedIds={highlightedIds}
                  onInspectSkill={onSelectFinding}
                />
              )}
              <div className="pt-2 border-t border-white/6">
                <p className="font-mono text-[10px] leading-relaxed text-muted-foreground/50 text-center">
                  AUDIT ID: {focusedSite.id} · READ-ONLY RECONCILIATION
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}
