'use client'

import { useState } from 'react'
import type { AppPhase, SkillId } from '@/lib/audit/types'
import { RUN_ORDER, SKILL_MAP } from '@/lib/audit/skills'
import { cn } from '@/lib/utils'

export function SkillMarketplace({
  phase,
  skippedSkillIds,
  onToggleSkill,
}: {
  phase: AppPhase
  skippedSkillIds: SkillId[]
  onToggleSkill: (id: SkillId, skipped: boolean) => void
}) {
  const [warningMsg, setWarningMsg] = useState<string | null>(null)

  // Show on landing (configure) and results (review). Hide during auditing (locked).
  if (phase === 'auditing') return null
  if (phase !== 'landing' && phase !== 'results') return null

  const isLocked = phase === 'results'
  const isCrawlSkipped = skippedSkillIds.includes('crawl-access-audit')
  const isRenderSkipped = skippedSkillIds.includes('render-extract-audit')
  const showDiscoverabilityWarning = isCrawlSkipped && isRenderSkipped

  const handleToggle = (id: SkillId) => {
    if (isLocked) return

    const currentlySkipped = skippedSkillIds.includes(id)
    if (!currentlySkipped) {
      // Trying to skip this skill: check if it's the last remaining on
      const remainingCount = RUN_ORDER.length - skippedSkillIds.length
      if (remainingCount <= 1) {
        setWarningMsg('At least one skill must remain armed')
        setTimeout(() => setWarningMsg(null), 3000)
        return
      }
      onToggleSkill(id, true)
    } else {
      onToggleSkill(id, false)
    }
  }

  return (
    <nav
      role="group"
      aria-label="Marketplace skills"
      className="pointer-events-auto absolute left-1/2 top-14 z-[3] -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity duration-200"
    >
      <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#0a0f1a]/90 px-3 py-1.5 shadow-2xl backdrop-blur-xl">
        {/* Marketplace Label */}
        <div className="flex items-center gap-1.5 pr-2.5 border-r border-white/10">
          <span className="size-1.5 rounded-full bg-signal" />
          <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-foreground uppercase">
            MARKETPLACE
          </span>
        </div>

        {/* 9 Canonical Skills */}
        <div className="flex items-center gap-1 pl-1">
          {RUN_ORDER.map((id) => {
            const isSkipped = skippedSkillIds.includes(id)
            const isArmed = !isSkipped

            return (
              <button
                key={id}
                type="button"
                disabled={isLocked}
                aria-disabled={isLocked}
                aria-pressed={isArmed}
                title={isLocked ? 'Skills locked after audit' : `${isArmed ? 'Click to skip' : 'Click to arm'}: ${SKILL_MAP[id].label}`}
                onClick={() => handleToggle(id)}
                className={cn(
                  'group relative flex items-center gap-1 rounded-md px-2 py-1 font-mono text-[10px] font-medium transition-all duration-120 cursor-pointer',
                  isLocked && 'cursor-not-allowed opacity-75',
                  isArmed
                    ? 'border border-white/10 bg-surface/70 text-foreground hover:border-white/20'
                    : 'border border-white/5 bg-transparent text-muted-foreground/60 opacity-40 hover:opacity-60 hover:border-white/10',
                )}
              >
                <span>{SKILL_MAP[id].short}</span>
                <span
                  className={cn(
                    'size-1.5 rounded-full transition-colors',
                    isArmed ? 'bg-signal shadow-[0_0_6px_rgba(56,189,248,0.5)]' : 'bg-zinc-600',
                  )}
                  aria-hidden
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Warnings & Alerts */}
      {warningMsg && (
        <p className="rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 font-mono text-[9px] text-rose-300 shadow-lg animate-fade-in">
          {warningMsg}
        </p>
      )}

      {showDiscoverabilityWarning && !warningMsg && (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 font-mono text-[9px] text-amber-200/90 shadow-lg">
          Discoverability will be empty (Crawl & Render skipped)
        </p>
      )}
    </nav>
  )
}
