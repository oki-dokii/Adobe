'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { UrlPortal } from './url-portal'
import type { Point, SkillId } from '@/lib/audit/types'
import { RUN_ORDER, SKILL_MAP } from '@/lib/audit/skills'
import { cn } from '@/lib/utils'

export function LandingView({
  onStart,
  onPortalFocus,
  onGuide,
  skippedSkillIds = [],
  onToggleSkill,
}: {
  onStart: (urls: string[], origin: Point | null) => void
  onPortalFocus: (focused: boolean) => void
  onGuide?: () => void
  skippedSkillIds?: SkillId[]
  onToggleSkill?: (id: SkillId, skipped: boolean) => void
}) {
  const [warningMsg, setWarningMsg] = useState<string | null>(null)

  const armedCount = RUN_ORDER.length - skippedSkillIds.length

  const handleToggle = (id: SkillId) => {
    if (!onToggleSkill) return
    const currentlySkipped = skippedSkillIds.includes(id)
    if (!currentlySkipped) {
      const remainingCount = RUN_ORDER.length - skippedSkillIds.length
      if (remainingCount <= 1) {
        setWarningMsg('At least one diagnostic skill must remain armed')
        setTimeout(() => setWarningMsg(null), 3000)
        return
      }
      onToggleSkill(id, true)
    } else {
      onToggleSkill(id, false)
    }
  }

  return (
    <div className="pointer-events-none relative min-h-dvh flex flex-col justify-center items-center px-4 sm:px-6 pt-24 pb-16">
      <main className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center my-auto space-y-8">
        {/* Hero Header Section */}
        <div className="flex flex-col items-center space-y-4 max-w-2xl">
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/[0.06] px-3.5 py-1 backdrop-blur-md shadow-sm"
          >
            <span className="size-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="font-mono text-[11px] font-medium tracking-wider text-indigo-300 uppercase">
              Brand AI Readiness & Extractability Diagnostic
            </span>
          </motion.div>

          {/* Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-3xl font-extrabold tracking-[-0.035em] sm:text-5xl md:text-6xl sm:leading-[1.12]"
          >
            <span className="bg-gradient-to-b from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              What does AI see when it sees your{' '}
            </span>
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent underline decoration-indigo-500/30 underline-offset-8">
              brand?
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-balance text-sm sm:text-base leading-relaxed text-muted-foreground font-normal"
          >
            Audit how LLMs, autonomous agents, and search crawlers parse, extract, and synthesize your domain. Read-only, deterministic, evidence-backed inspection.
          </motion.p>
        </div>

        {/* Diagnostic Input Portal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.22, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-xl text-center z-10"
        >
          <UrlPortal onStart={onStart} onFocusChange={onPortalFocus} />

          {/* Skill Marketplace / Configuration Drawer */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-xl border border-white/6 bg-white/[0.02] p-3.5 backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-indigo-400" />
                <span className="font-mono text-[11px] font-medium text-foreground/80 tracking-wide">
                  {armedCount} of {RUN_ORDER.length} diagnostic skills armed
                </span>
              </div>
              {onGuide && (
                <button
                  type="button"
                  onClick={onGuide}
                  className="font-mono text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer flex items-center gap-1"
                >
                  architecture guide ↗
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5">
              {RUN_ORDER.map((id) => {
                const isSkipped = skippedSkillIds.includes(id)
                const isArmed = !isSkipped

                return (
                  <button
                    key={id}
                    type="button"
                    title={`${isArmed ? 'Click to skip' : 'Click to arm'}: ${SKILL_MAP[id].label}`}
                    onClick={() => handleToggle(id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[10px] font-medium transition-all duration-150 cursor-pointer',
                      isArmed
                        ? 'border border-indigo-500/25 bg-indigo-500/10 text-indigo-200 hover:border-indigo-400/40 hover:bg-indigo-500/15'
                        : 'border border-white/6 bg-transparent text-muted-foreground/40 line-through opacity-50 hover:opacity-80 hover:border-white/12',
                    )}
                  >
                    <span>{SKILL_MAP[id].short}</span>
                    <span
                      className={cn(
                        'size-1.5 rounded-full transition-colors',
                        isArmed ? 'bg-indigo-400' : 'bg-zinc-600',
                      )}
                      aria-hidden
                    />
                  </button>
                )
              })}
            </div>

            {/* Warning Message */}
            {warningMsg && (
              <p className="mt-2.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-[10px] text-rose-300 inline-block">
                {warningMsg}
              </p>
            )}
          </motion.div>

          {/* Value Proof Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-muted-foreground/70 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <svg className="size-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Dual-Fetch Crawler
            </span>
            <span className="text-white/10">•</span>
            <span className="flex items-center gap-1.5">
              <svg className="size-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              RFC 9309 Protocol
            </span>
            <span className="text-white/10">•</span>
            <span className="flex items-center gap-1.5">
              <svg className="size-3.5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Zero-Hallucination Scoring
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
