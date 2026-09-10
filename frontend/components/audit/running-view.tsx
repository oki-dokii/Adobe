'use client'

import { motion } from 'motion/react'
import { isResolved, STATUS_STYLE } from '@/lib/audit/status'
import type { Site, SkillId } from '@/lib/audit/types'
import { SKILL_MAP, RUN_ORDER, DIMENSIONS } from '@/lib/audit/skills'
import { cn } from '@/lib/utils'

const SKILL_OUTPUT_SUMMARY: Record<SkillId, string> = {
  'audit-orchestrator': 'Reconciling findings',
  'site-type-classifier': 'SaaS / Marketing taxonomy',
  'crawl-access-audit': '4 AI bot directives checked',
  'render-extract-audit': 'Dual-fetch ratio evaluated',
  'entity-identity-audit': 'Identity graph parsed',
  'citation-extractability-audit': 'Self-containment verified',
  'ai-answerability-audit': 'Query clarity mapped',
  'freshness-audit': 'Temporal recency checked',
  'corroboration-consistency-audit': 'Cross-claim consistency verified',
  'engagement-handoff-audit': 'Machine-legible handoff verified',
}

export function RunningView({
  focusedSite,
}: {
  sites: Site[]
  focusedSite: Site
  focusedId: string
  onFocus: (id: string) => void
}) {
  const active = focusedSite.skills.find((s) => s.status === 'running')
  const doneCount = focusedSite.skills.filter((s) => isResolved(s.status)).length
  const totalCount = RUN_ORDER.length

  const phaseLabel =
    focusedSite.phase === 'validating'
      ? 'Validating origin security & DNS'
      : focusedSite.phase === 'consolidating'
        ? 'Orchestrating causal hierarchy'
        : active
          ? `Executing ${SKILL_MAP[active.id]?.label}`
          : 'Initializing diagnostic pipeline'

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6">
      {/* Top Bar Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1 backdrop-blur-md">
          <span className="size-2 rounded-full bg-signal animate-pulse" />
          <span className="font-mono text-[10px] font-semibold tracking-wider text-foreground uppercase">
            DIAGNOSTIC PIPELINE ACTIVE
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/60">•</span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {doneCount}/{totalCount} SKILLS
          </span>
        </div>
      </div>

      {/* Right Sidebar: Multi-Agent Execution Timeline */}
      <div className="pointer-events-auto absolute right-6 top-16 bottom-16 hidden lg:flex w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1a]/85 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="border-b border-white/6 bg-black/40 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-signal uppercase">
              AGENT TELEMETRY
            </span>
            <span className="font-mono text-[9px] text-muted-foreground">
              {Math.round((doneCount / totalCount) * 100)}% COMPLETE
            </span>
          </div>
          <p className="mt-0.5 text-xs font-semibold text-foreground truncate">{focusedSite.host}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 font-mono text-[11px]">
          {RUN_ORDER.map((skillId, index) => {
            const skillDef = SKILL_MAP[skillId]
            const run = focusedSite.skills.find((s) => s.id === skillId)
            const status = run?.status ?? 'dormant'
            const isRunning = status === 'running'
            const isDone = isResolved(status)
            const style = STATUS_STYLE[status]

            return (
              <div
                key={skillId}
                className={cn(
                  'rounded-lg border p-2.5 transition-all duration-200',
                  isRunning
                    ? 'border-signal/40 bg-signal/10 shadow-[0_0_15px_rgba(56,189,248,0.15)]'
                    : isDone
                      ? 'border-white/6 bg-white/[0.02]'
                      : 'border-white/4 bg-transparent opacity-40',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="size-1.5 rounded-full shrink-0"
                      style={{ background: style.color }}
                    />
                    <span
                      className={cn(
                        'truncate text-xs font-medium',
                        isRunning ? 'text-signal font-semibold' : isDone ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {skillDef.short}
                    </span>
                  </div>
                  <span
                    className="text-[9px] uppercase tracking-wider px-1 py-0.2 rounded font-semibold"
                    style={{
                      color: style.color,
                      backgroundColor: `${style.color}15`,
                    }}
                  >
                    {status === 'running' ? 'RUNNING' : status === 'completed' ? 'DONE' : status}
                  </span>
                </div>

                {/* Progress or Outcome Summary */}
                {isRunning && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full bg-signal"
                        style={{ width: `${Math.max(15, Math.round((run?.progress ?? 0.3) * 100))}%` }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      />
                    </div>
                    <span className="text-[9px] text-signal/80 truncate block">
                      {SKILL_OUTPUT_SUMMARY[skillId]}
                    </span>
                  </div>
                )}

                {isDone && (
                  <div className="mt-1 flex items-center justify-between text-[9px] text-muted-foreground/70">
                    <span className="truncate">{SKILL_OUTPUT_SUMMARY[skillId]}</span>
                    <span className="text-emerald-400 font-semibold shrink-0">✓</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footnote */}
        <div className="border-t border-white/6 bg-black/40 px-3 py-2 text-center">
          <p className="font-mono text-[9px] text-muted-foreground/50">
            DETERMINISTIC V1 · DUAL-FETCH INSPECTION
          </p>
        </div>
      </div>

      {/* Bottom Center Status Pill */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-black/80 px-4 py-2 backdrop-blur-md shadow-xl">
          <div className="size-2 rounded-full bg-signal animate-ping" />
          <p className="text-xs font-medium text-foreground">{phaseLabel}</p>
        </div>
      </div>
    </div>
  )
}

