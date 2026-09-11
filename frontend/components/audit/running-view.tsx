'use client'

import { motion } from 'motion/react'
import { isResolved, STATUS_STYLE } from '@/lib/audit/status'
import type { Site, SkillId } from '@/lib/audit/types'
import { SKILL_MAP, RUN_ORDER, DIMENSIONS } from '@/lib/audit/skills'
import { cn } from '@/lib/utils'

const SKILL_OUTPUT_SUMMARY: Record<SkillId, string> = {
  'audit-orchestrator': 'Reconciling findings & causal tree',
  'site-type-classifier': 'SaaS / Marketing taxonomy classification',
  'crawl-access-audit': '4 AI bot crawler directives checked',
  'render-extract-audit': 'Dual-fetch server/DOM ratio evaluated',
  'entity-identity-audit': 'JSON-LD schema identity graph parsed',
  'citation-extractability-audit': 'Information self-containment verified',
  'ai-answerability-audit': 'Query relevance & passage clarity mapped',
  'freshness-audit': 'Temporal recency & freshness checked',
  'corroboration-consistency-audit': 'Cross-claim consistency verified',
  'engagement-handoff-audit': 'Machine-legible handoff verified',
}

export function RunningView({
  focusedSite,
  skippedSkillIds = [],
}: {
  sites: Site[]
  focusedSite: Site
  focusedId: string
  onFocus: (id: string) => void
  skippedSkillIds?: SkillId[]
}) {
  const active = focusedSite.skills.find((s) => s.status === 'running')
  const doneCount = focusedSite.skills.filter((s) => isResolved(s.status)).length
  const totalCount = RUN_ORDER.length

  const phaseLabel =
    focusedSite.phase === 'validating'
      ? 'Validating origin security & DNS'
      : focusedSite.phase === 'consolidating'
        ? 'Synthesizing causal hierarchy & score'
        : active
          ? `Executing ${SKILL_MAP[active.id]?.label}`
          : 'Initializing diagnostic pipeline'

  const progressPercent = Math.round((doneCount / totalCount) * 100)

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6">
      {/* Top Bar Status Pill */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 rounded-full border border-indigo-500/20 bg-[#0e1424]/90 px-4 py-1.5 backdrop-blur-md shadow-md">
          <span className="size-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="font-mono text-[11px] font-semibold tracking-wider text-foreground uppercase">
            {phaseLabel}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/60">•</span>
          <span className="font-mono text-[11px] font-medium text-indigo-300">
            {doneCount}/{totalCount} SKILLS
          </span>
        </div>
      </div>

      {/* Right Sidebar: Multi-Agent Execution Timeline */}
      <div className="pointer-events-auto absolute right-6 top-16 bottom-16 hidden lg:flex w-84 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0c1120]/92 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.65)]">
        <div className="border-b border-white/6 bg-black/40 px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-indigo-400 uppercase">
              AGENT EXECUTION TELEMETRY
            </span>
            <span className="font-mono text-[10px] font-semibold text-indigo-300">
              {progressPercent}% COMPLETE
            </span>
          </div>
          <p className="mt-1 text-xs font-semibold text-foreground truncate">{focusedSite.host}</p>

          {/* Overall Progress Bar */}
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[11px]">
          {RUN_ORDER.map((skillId) => {
            const skillDef = SKILL_MAP[skillId]
            const run = focusedSite.skills.find((s) => s.id === skillId)
            const isSkipped = skippedSkillIds.includes(skillId)
            const status = isSkipped ? ('skipped' as const) : (run?.status ?? 'dormant')
            const isRunning = status === 'running'
            const isDone = isResolved(status) && !isSkipped

            return (
              <div
                key={skillId}
                className={cn(
                  'rounded-xl border p-2.5 transition-all duration-200',
                  isSkipped
                    ? 'border-white/4 bg-transparent opacity-35'
                    : isRunning
                      ? 'border-indigo-500/40 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                      : isDone
                        ? 'border-white/6 bg-white/[0.02]'
                        : 'border-white/4 bg-transparent opacity-40',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={cn(
                        'size-1.5 rounded-full shrink-0',
                        isSkipped
                          ? 'bg-zinc-600'
                          : isRunning
                            ? 'bg-indigo-400 animate-ping'
                            : isDone
                              ? 'bg-emerald-400'
                              : 'bg-zinc-600',
                      )}
                    />
                    <span className="text-xs font-semibold text-foreground truncate">
                      {skillDef.short}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-[9px] uppercase px-1.5 py-0.5 rounded font-bold',
                      isSkipped
                        ? 'text-muted-foreground/60'
                        : isRunning
                          ? 'text-indigo-300 bg-indigo-500/20'
                          : isDone
                            ? 'text-emerald-400 bg-emerald-500/10'
                            : 'text-muted-foreground/60',
                    )}
                  >
                    {status}
                  </span>
                </div>

                <p className="mt-1 text-[10px] text-muted-foreground/75 truncate">
                  {SKILL_OUTPUT_SUMMARY[skillId]}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
