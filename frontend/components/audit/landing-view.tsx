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
        <div className="absolute inset-x-0 top-[4.5rem] z-10 px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-xl text-balance text-[1.55rem] font-medium leading-[1.18] tracking-tight text-foreground md:text-[2.05rem]"
          >
            What does AI see when it sees your brand?
          </motion.h1>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.12, duration: 0.5 }}
          className="pointer-events-auto absolute left-1/2 z-10 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-5"
          style={{ top: `${ROOT_Y * 100}%` }}
        >
          <UrlPortal onStart={onStart} onFocusChange={onPortalFocus} />
        </motion.div>
      </main>
    </div>
  )
}
