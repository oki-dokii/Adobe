'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { UrlPortal } from './url-portal'
import { ROOT_Y } from '@/lib/audit/layout'
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
    <div className="pointer-events-none relative min-h-dvh">
      <main className="contents">
        <div className="absolute inset-x-0 top-[4.25rem] z-10 px-6 text-center">
          {/* Subtle System Status Pill */}
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/8 bg-surface/80 px-3.5 py-1 backdrop-blur-md shadow-sm"
          >
            <span className="size-1.5 rounded-full bg-signal" />
            <span className="font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              READ-ONLY · 10 AUDIT LAYERS · EVIDENCE-BACKED
            </span>
          </motion.div>

          {/* Editorial Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]"
          >
            What does AI see when it sees your brand?
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-3.5 max-w-lg text-balance text-sm leading-relaxed text-muted-foreground sm:text-base font-normal"
          >
            Read-only extractability audit. We do not claim ChatGPT cited you.
          </motion.p>
        </div>

        {/* Portal Aperture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto absolute left-1/2 z-10 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-5 text-center"
          style={{ top: `${ROOT_Y * 100}%` }}
        >
          <UrlPortal onStart={onStart} onFocusChange={onPortalFocus} />

          {/* Inline Skill Marketplace */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5"
          >
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="size-1 rounded-full bg-signal/80" />
              <span className="font-mono text-[10px] text-muted-foreground/70 tracking-wide">
                {armedCount} of {RUN_ORDER.length} skills armed
              </span>
              {onGuide && (
                <button
                  type="button"
                  onClick={onGuide}
                  className="font-mono text-[10px] text-muted-foreground/40 hover:text-signal transition-colors cursor-pointer"
                >
                  · view architecture →
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1">
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
                      'flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-[9px] font-medium transition-all duration-150 cursor-pointer',
                      isArmed
                        ? 'border border-white/10 bg-surface/60 text-foreground/80 hover:border-signal/30 hover:text-foreground'
                        : 'border border-white/5 bg-transparent text-muted-foreground/40 line-through opacity-50 hover:opacity-70 hover:border-white/10',
                    )}
                  >
                    <span>{SKILL_MAP[id].short}</span>
                    <span
                      className={cn(
                        'size-1 rounded-full transition-colors',
                        isArmed ? 'bg-signal' : 'bg-zinc-600',
                      )}
                      aria-hidden
                    />
                  </button>
                )
              })}
            </div>

            {/* Warning Messages */}
            {warningMsg && (
              <p className="mt-2 rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 font-mono text-[9px] text-rose-300 inline-block">
                {warningMsg}
              </p>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
