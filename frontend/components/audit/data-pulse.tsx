'use client'

import { motion } from 'motion/react'

/**
 * A discrete, high-precision telemetry pulse traveling ROOT → DIMENSION → SKILL.
 * Subtle, restrained packet movement that belongs naturally to the tree optics.
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
    return <path d={path} fill="none" stroke={color} strokeWidth={1} strokeLinecap="round" opacity={0.3} />
  }

  return (
    <g>
      {/* Subtle pulse trail trace */}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeLinecap="round"
        strokeDasharray="20 620"
        initial={{ strokeDashoffset: 640 }}
        animate={{ strokeDashoffset: [640, 0] }}
        transition={{
          duration,
          delay,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1.6,
          ease: [0.2, 0.8, 0.2, 1],
        }}
        opacity={0.5}
      />

      {/* Discrete particle core */}
      <circle r={2.0} fill={color} opacity={0.9}>
        <animateMotion dur={`${duration}s`} begin={`${delay}s`} repeatCount="indefinite" path={path} rotate="auto" />
      </circle>

      {/* Micro trailing follower */}
      <circle r={1.2} fill={color} opacity={0.4}>
        <animateMotion
          dur={`${duration}s`}
          begin={`${delay + 0.07}s`}
          repeatCount="indefinite"
          path={path}
          rotate="auto"
        />
      </circle>
    </g>
  )
}
