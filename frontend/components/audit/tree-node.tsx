'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { SkillStatus } from '@/lib/audit/types'
import { STATUS_STYLE, isActive } from '@/lib/audit/status'

/**
 * Interactive node overlaid on the SVG branch layer so it can be focused,
 * hovered and clicked with real semantics.
 */
export function TreeNode({
  x,
  y,
  status,
  label,
  size = 16,
  selected,
  dimmed,
  visible,
  reduced,
  progress = 0,
  layoutId,
  onHover,
  onLeave,
  onClick,
  onFocus,
  interactive = true,
  variant = 'skill',
}: {
  x: number
  y: number
  status: SkillStatus
  label: string
  size?: number
  selected?: boolean
  dimmed?: boolean
  visible: boolean
  reduced: boolean
  progress?: number
  layoutId?: string
  onHover?: () => void
  onLeave?: () => void
  onClick?: () => void
  onFocus?: () => void
  interactive?: boolean
  variant?: 'skill' | 'root'
}) {
  const style = STATUS_STYLE[status]
  const active = isActive(status)
  const resolved = status !== 'dormant' && status !== 'queued' && !active
  const color = style.color

  return (
    <motion.button
      type="button"
      layoutId={layoutId}
      aria-label={`${label} — ${style.label}`}
      aria-pressed={selected}
      tabIndex={interactive ? 0 : -1}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={onFocus}
      onBlur={onLeave}
      onClick={onClick}
      className={cn(
        'group absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none',
        interactive ? 'cursor-pointer' : 'pointer-events-none',
        'focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
      style={{
        left: x,
        top: y,
        width: variant === 'root' ? size + 48 : size + 24,
        height: variant === 'root' ? size + 48 : size + 24,
      }}
      initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.2 }}
      animate={{
        opacity: visible ? (dimmed ? 0.28 : 1) : 0,
        scale: visible ? 1 : 0.2,
      }}
      transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {variant === 'root' && (
        <>
          <motion.span
            aria-hidden
            className="absolute rounded-full border border-signal/25"
            style={{ width: size + 28, height: size + 28 }}
            animate={reduced ? undefined : { opacity: [0.18, 0.38, 0.18], scale: [1, 1.04, 1] }}
            transition={{ duration: 5.4, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />
          <motion.span
            aria-hidden
            className="absolute rounded-full border border-foreground/12"
            style={{ width: size + 16, height: size + 16 }}
            animate={reduced ? undefined : { opacity: [0.35, 0.55, 0.35] }}
            transition={{ duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />
        </>
      )}

      {active && !reduced && (
        <motion.span
          aria-hidden
          className="absolute rounded-full"
          style={{ width: size, height: size, border: `1px solid ${color}` }}
          initial={{ opacity: 0.45, scale: 1 }}
          animate={{ opacity: 0, scale: variant === 'root' ? 1.85 : 2.05 }}
          transition={{ duration: variant === 'root' ? 2.6 : 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
        />
      )}

      <span
        aria-hidden
        className={cn(
          'absolute rounded-full transition-all duration-300',
          selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-70',
        )}
        style={{
          width: size + 14,
          height: size + 14,
          border: `1px solid ${color}`,
          boxShadow: selected ? `0 0 10px ${color}` : 'none',
        }}
      />

      <span
        aria-hidden
        className="relative rounded-full transition-all duration-300"
        style={{
          width: size,
          height: size,
          background: resolved
            ? color
            : active
              ? `radial-gradient(circle, ${color} 0%, color-mix(in oklch, ${color} 28%, transparent) 72%)`
              : 'var(--surface-2)',
          border: `1px solid ${resolved ? 'transparent' : color}`,
          boxShadow: active ? `0 0 8px ${color}` : 'none',
        }}
      >
        {active && (
          <span
            aria-hidden
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${color} ${Math.round(progress * 360)}deg, transparent 0)`,
              opacity: 0.4,
            }}
          />
        )}
      </span>
    </motion.button>
  )
}
