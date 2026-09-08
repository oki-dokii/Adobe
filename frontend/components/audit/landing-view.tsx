'use client'

import { motion } from 'motion/react'
import { UrlPortal } from './url-portal'
import { ROOT_Y } from '@/lib/audit/layout'
import type { Point } from '@/lib/audit/types'

export function LandingView({
  onStart,
  onPortalFocus,
}: {
  onStart: (urls: string[], origin: Point | null) => void
  onPortalFocus: (focused: boolean) => void
}) {
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
              READ-ONLY · 9 SKILLS · EVIDENCE-BACKED
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
            Diagnostic instrument evaluating brand visibility, machine understanding, citation trust, and engagement readiness.
          </motion.p>
        </div>

        {/* Portal Aperture */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto absolute left-1/2 z-10 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-5"
          style={{ top: `${ROOT_Y * 100}%` }}
        >
          <UrlPortal onStart={onStart} onFocusChange={onPortalFocus} />
        </motion.div>
      </main>
    </div>
  )
}
