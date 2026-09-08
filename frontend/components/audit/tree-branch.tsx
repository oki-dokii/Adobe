'use client'

import { motion } from 'motion/react'
import type { SkillStatus } from '@/lib/audit/types'
import { STATUS_STYLE, isActive } from '@/lib/audit/status'
import { DataPulse } from './data-pulse'

/**
 * A single audit branch: grows when the skill is alive, tints to resolved
 * status, and carries a data pulse only while the skill is working.
 */
export function TreeBranch({
  path,
  status,
  grown,
  reduced,
  index,
  dimmed,
  emphasized,
  evidenceFlow,
  weight = 'twig',
  flowPath,
}: {
  path: string
  status: SkillStatus
  grown: boolean
  reduced: boolean
  index: number
  dimmed?: boolean
  emphasized?: boolean
  evidenceFlow?: boolean
  weight?: 'trunk' | 'twig'
  flowPath?: string
}) {
  const style = STATUS_STYLE[status]
  const active = isActive(status)
  const resolved = status !== 'dormant' && status !== 'queued'
  const isTrunk = weight === 'trunk'

  const strokeColor = resolved || active ? style.color : 'var(--line)'
  const baseOpacity = dimmed
    ? 0.08
    : status === 'dormant'
      ? isTrunk
        ? 0.4
        : 0.16
      : status === 'queued'
        ? 0.38
        : emphasized
          ? 0.95
          : isTrunk
            ? 0.62
            : 0.7

  const width = isTrunk ? (emphasized ? 3.4 : 2.8) : emphasized ? 1.35 : active ? 1.15 : 0.75

  return (
    <g>
      <motion.path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={width}
        strokeLinecap="round"
        initial={reduced ? { pathLength: 1, opacity: baseOpacity } : { pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: grown ? 1 : isTrunk ? 1 : 0,
          opacity: grown || isTrunk ? baseOpacity : 0,
        }}
        transition={{ duration: reduced ? 0 : isTrunk ? 1.2 : 0.85, delay: reduced ? 0 : index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      />
      {active && grown && !isTrunk && (
        <DataPulse path={flowPath ?? path} color={style.color} reduced={reduced} delay={0.2} />
      )}
      {evidenceFlow && grown && !reduced && (
        <DataPulse path={flowPath ?? path} color="var(--warning)" duration={2.8} delay={1.1} />
      )}
    </g>
  )
}
