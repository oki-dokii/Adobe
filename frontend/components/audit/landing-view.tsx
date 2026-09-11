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
        setWarningMsg('At least one diagnostic skill must remain active')
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
      <main className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto text-center my-auto space-y-7">
        {/* Hero Header Section */}
        <div className="flex flex-col items-center space-y-4 max-w-2xl">
          {/* Refined Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/90 bg-white px-3.5 py-1 text-xs font-medium text-slate-700 shadow-xs"
          >
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Extractability & Search Readiness Audit</span>
          </motion.div>

          {/* Clean, Human Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="text-balance text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 sm:leading-[1.12]"
          >
            What does AI see when it indexes your brand?
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl text-balance text-base sm:text-lg leading-relaxed text-slate-600 font-normal"
          >
            A deterministic, read-only technical audit measuring how LLMs, autonomous agents, and search engines crawl, understand, and cite your website.
          </motion.p>
        </div>

        {/* Diagnostic Input Portal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto w-full max-w-xl text-center z-10"
        >
          <UrlPortal onStart={onStart} onFocusChange={onPortalFocus} />

          {/* Diagnostic Skills Strip */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs"
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-indigo-600" />
                <span className="text-xs font-semibold text-slate-800">
                  {armedCount} of {RUN_ORDER.length} diagnostic skills active
                </span>
              </div>
              {onGuide && (
                <button
                  type="button"
                  onClick={onGuide}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer flex items-center gap-1"
                >
                  Architecture guide →
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
                    title={`${isArmed ? 'Click to disable' : 'Click to enable'}: ${SKILL_MAP[id].label}`}
                    onClick={() => handleToggle(id)}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-150 cursor-pointer',
                      isArmed
                        ? 'border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
                        : 'border border-slate-100 bg-transparent text-slate-400 line-through opacity-60 hover:opacity-100',
                    )}
                  >
                    <span>{SKILL_MAP[id].short}</span>
                    <span
                      className={cn(
                        'size-1.5 rounded-full transition-colors',
                        isArmed ? 'bg-indigo-600' : 'bg-slate-300',
                      )}
                      aria-hidden
                    />
                  </button>
                )
              })}
            </div>

            {/* Warning Message */}
            {warningMsg && (
              <p className="mt-2.5 rounded-md border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 inline-block">
                {warningMsg}
              </p>
            )}
          </motion.div>

          {/* Value Proof Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-5 text-slate-500 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <svg className="size-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Dual-Fetch DOM Analysis
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <svg className="size-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
              RFC 9309 Protocol Verification
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <svg className="size-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
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
