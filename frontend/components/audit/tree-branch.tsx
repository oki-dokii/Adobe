'use client'

import { motion } from 'motion/react'
import type { SkillStatus } from '@/lib/audit/types'
import { STATUS_STYLE, isActive } from '@/lib/audit/status'
import { DataPulse } from './data-pulse'

/**
 * Audit tree branch with 3-tier hierarchical weights:
 * - 'trunk': Strong dimension trunks (2.2 - 2.8px)
 * - 'twig': Skill paths (1.1 - 1.8px)
 * - 'tendril': Micro-data paths (0.8 - 1.1px)
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
  dashArray,
}: {
  path: string
  status: SkillStatus
  grown: boolean
  reduced: boolean
  index: number
  dimmed?: boolean
  emphasized?: boolean
  evidenceFlow?: boolean
  weight?: 'trunk' | 'twig' | 'tendril'
  flowPath?: string
  dashArray?: string
}) {
  const style = STATUS_STYLE[status]
  const active = isActive(status)
  const resolved = status !== 'dormant' && status !== 'queued'
  const isTrunk = weight === 'trunk'
  const isTendril = weight === 'tendril'

  const strokeColor = isTrunk
    ? dimmed
      ? 'var(--line)'
      : resolved || active
        ? style.color
        : 'var(--signal)'
    : isTendril
      ? dimmed
        ? 'var(--line)'
        : resolved || active
          ? style.color
          : 'var(--line)'
      : dimmed
        ? 'var(--line)'
        : resolved || active
          ? style.color
          : 'var(--line)'

  const baseOpacity = dimmed
    ? isTrunk
      ? 0.25
      : isTendril
        ? 0.18
        : 0.20
    : status === 'dormant'
      ? isTrunk
        ? 0.5
        : isTendril
          ? 0.35
          : 0.4
      : status === 'queued'
        ? 0.45
        : emphasized
          ? 1
          : isTrunk
            ? 0.85
            : isTendril
              ? 0.75
              : 0.8

  const strokeWidth = isTrunk
    ? emphasized
      ? 3.2
      : 2.6
    : isTendril
      ? emphasized
        ? 1.5
        : 1.15
      : emphasized
        ? 2.0
        : active
          ? 1.5
          : 1.25

  return (
    <g>
      {/* Restrained optical halo for active or emphasized branches */}
      {(isTrunk || active || emphasized) && !dimmed && !isTendril && (
        <motion.path
          d={path}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth * 1.8}
          strokeLinecap="round"
          style={{ opacity: isTrunk ? 0.12 : 0.18, filter: 'blur(2px)' }}
          initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: grown ? 1 : isTrunk ? 1 : 0 }}
          transition={{ duration: reduced ? 0 : isTrunk ? 1.0 : 0.8, delay: reduced ? 0 : index * 0.03, ease: [0.22, 1, 0.36, 1] }}
        />
      )}

      {/* Primary Optic Fiber Core Line */}
      <motion.path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={dashArray}
        initial={reduced ? { pathLength: 1, opacity: baseOpacity } : { pathLength: isTendril ? 1 : 0, opacity: 0 }}
        animate={{
          pathLength: isTendril ? 1 : grown ? 1 : isTrunk ? 1 : 0,
          opacity: grown || isTrunk ? baseOpacity : 0,
        }}
        transition={{ duration: reduced ? 0 : isTrunk ? 1.0 : isTendril ? 0.5 : 0.8, delay: reduced ? 0 : Math.min(index * 0.025, 0.4), ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Discrete live data pulse traveling through multiple levels */}
      {active && grown && !isTrunk && (
        <DataPulse path={flowPath ?? path} color={style.color} reduced={reduced} delay={isTendril ? 0.45 : 0.15} />
      )}
      {evidenceFlow && grown && !reduced && (
        <DataPulse path={flowPath ?? path} color="var(--warning)" duration={2.6} delay={isTendril ? 1.25 : 0.9} />
      )}
    </g>
  )
}
