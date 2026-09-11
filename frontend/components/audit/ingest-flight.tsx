'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'
import { ROOT_Y } from '@/lib/audit/layout'
import type { Point } from '@/lib/audit/types'

/**
 * URL aperture collapses into the origin: one continuous field, not a scene cut.
 */
export function IngestFlight({
  host,
  origin,
  reduced,
  onArrive,
  onComplete,
}: {
  host: string
  origin: Point | null
  reduced: boolean
  onArrive?: () => void
  onComplete: () => void
}) {
  useEffect(() => {
    if (reduced) {
      onArrive?.()
      onComplete()
      return
    }
    const arrive = setTimeout(() => onArrive?.(), 1100)
    const done = setTimeout(onComplete, 2400)
    return () => {
      clearTimeout(arrive)
      clearTimeout(done)
    }
  }, [reduced, onArrive, onComplete])

  if (reduced) return null

  const toX = window.innerWidth / 2
  const toY = window.innerHeight * ROOT_Y
  const from = origin ?? { x: toX, y: toY }

  return (
    <div className="pointer-events-none fixed inset-0 z-40" aria-hidden>
      <motion.span
        className="absolute rounded-full border border-signal/30"
        initial={{ x: from.x, y: from.y, width: 360, height: 52, opacity: 0.2 }}
        animate={{ x: toX, y: toY, width: 96, height: 96, opacity: [0.2, 0.45, 0] }}
        transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        style={{ translateX: '-50%', translateY: '-50%' }}
      />
      <motion.span
        className="absolute border border-signal/50"
        initial={{ x: from.x, y: from.y, width: 320, height: 48, borderRadius: 999, opacity: 0.7 }}
        animate={{
          x: toX,
          y: toY,
          width: [320, 72, 42],
          height: [48, 72, 42],
          borderRadius: 999,
          opacity: [0.7, 0.85, 0.12],
        }}
        transition={{ duration: 1.05, times: [0, 0.55, 1], ease: [0.22, 1, 0.36, 1] }}
        style={{ translateX: '-50%', translateY: '-50%' }}
      />
      <motion.div
        className="absolute whitespace-nowrap text-sm tracking-tight text-foreground"
        initial={{ x: from.x, y: from.y, scale: 1, opacity: 1 }}
        animate={{
          x: toX,
          y: [from.y, toY + 36, toY + 36],
          scale: [1, 1.02, 1],
          opacity: [1, 1, 1, 0],
        }}
        transition={{ duration: 2.15, times: [0, 0.4, 0.72, 1], ease: [0.22, 1, 0.36, 1] }}
        style={{ translateX: '-50%', translateY: '-50%' }}
      >
        {host}
      </motion.div>
    </div>
  )
}
