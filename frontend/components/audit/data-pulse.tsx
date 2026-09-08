'use client'

import { motion } from 'motion/react'

/**
 * A discrete computation packet traveling ROOT → DIMENSION → SKILL.
 * Motion exists only to show that something is moving along a live path.
 */
export function DataPulse({
  path,
  color,
  duration = 2.4,
  reduced = false,
  delay = 0,
}: {
  path: string
  color: string
  duration?: number
  reduced?: boolean
  delay?: number
}) {
  if (reduced) {
    return <path d={path} fill="none" stroke={color} strokeWidth={1.2} strokeLinecap="round" opacity={0.35} />
  }

  return (
    <g>
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeDasharray="5 640"
        initial={{ strokeDashoffset: 645 }}
        animate={{ strokeDashoffset: [645, 0] }}
        transition={{
          duration,
          delay,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 2.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        opacity={0.55}
      />
      <circle r={2.6} fill={color} opacity={0.9}>
        <animateMotion dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} rotate="auto" />
      </circle>
    </g>
  )
}
