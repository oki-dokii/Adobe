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
        'pointer-events-auto absolute inset-x-0 bottom-0 z-20 flex max-h-[52vh] flex-col overflow-hidden border-t border-border bg-background',
        'lg:inset-y-20 lg:right-5 lg:left-auto lg:bottom-5 lg:max-h-none lg:w-[22.5rem] lg:rounded-none lg:border',
      )}
      style={{ borderLeftColor: accent, borderLeftWidth: skill || activeCause ? 2 : 1 }}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        {skill ? (
          <p className="truncate text-[13px] text-foreground">{skill.label}</p>
        ) : (
          <nav className="flex gap-3" aria-label="Inspector">
            {(['diagnose', 'chain', 'findings'] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onCloseSkill()
                  onTreeMode(id)
                }}
                className={cn(
                  'text-[12px] transition-colors',
                  tab === id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {id === 'chain' ? 'Causes' : id === 'diagnose' ? 'Diagnose' : 'Findings'}
              </button>
            ))}
          </nav>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
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
              transition={{ duration: 0.22 }}
              className="space-y-8"
            >
              {tab === 'diagnose' && (
                <>
                  <ScoreOverview result={result} host={focusedSite.host} />
                  <section>
                    <p className="text-[11px] tracking-wide text-muted-foreground">Actions</p>
                    <ol className="mt-3 space-y-3">
                      {actions.slice(0, 4).map((r, i) => (
                        <li key={r.id} className="flex gap-3">
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <p className="text-[13px] leading-snug text-foreground">{r.title}</p>
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
              <p className="text-[11px] leading-relaxed text-muted-foreground/60">
                Demonstration data — not a live audit of {focusedSite.host}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  )
}
