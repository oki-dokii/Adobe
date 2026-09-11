'use client'

import { motion } from 'motion/react'
import { isResolved, STATUS_STYLE } from '@/lib/audit/status'
import type { Site, SkillId } from '@/lib/audit/types'
import { SKILL_MAP, RUN_ORDER } from '@/lib/audit/skills'
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
        <div className="flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/95 px-4 py-2 backdrop-blur-md shadow-sm">
          <span className="size-2 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-xs font-bold tracking-wide text-slate-900">
            {phaseLabel}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-xs font-semibold text-indigo-600">
            {doneCount}/{totalCount} Skills Complete
          </span>
        </div>
      </div>

      {/* Right Sidebar: Execution Timeline */}
      <div className="pointer-events-auto absolute right-6 top-16 bottom-16 hidden lg:flex w-84 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl">
        <div className="border-b border-slate-100 bg-slate-50/80 px-4 py-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Execution Telemetry
            </span>
            <span className="font-mono text-xs font-bold text-indigo-600">
              {progressPercent}% Complete
            </span>
          </div>
          <p className="mt-1 text-xs font-bold text-slate-900 truncate">{focusedSite.host}</p>

          {/* Overall Progress Bar */}
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs">
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
                    ? 'border-slate-100 bg-transparent opacity-40'
                    : isRunning
                      ? 'border-indigo-200 bg-indigo-50/60 shadow-xs'
                      : isDone
                        ? 'border-slate-200 bg-white shadow-2xs'
                        : 'border-slate-100 bg-transparent opacity-50',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={cn(
                        'size-2 rounded-full shrink-0',
                        isSkipped
                          ? 'bg-slate-300'
                          : isRunning
                            ? 'bg-indigo-600 animate-ping'
                            : isDone
                              ? 'bg-emerald-500'
                              : 'bg-slate-300',
                      )}
                    />
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {skillDef.short}
                    </span>
                  </div>
                  <span
                    className={cn(
                      'text-[10px] uppercase px-1.5 py-0.5 rounded font-bold',
                      isSkipped
                        ? 'text-slate-400'
                        : isRunning
                          ? 'text-indigo-700 bg-indigo-100'
                          : isDone
                            ? 'text-emerald-700 bg-emerald-100'
                            : 'text-slate-400',
                    )}
                  >
                    {status}
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-slate-500 truncate">
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
