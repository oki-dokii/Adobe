'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { SkillStatus } from '@/lib/audit/types'
import { STATUS_STYLE, isActive, isResolved } from '@/lib/audit/status'

export type RootHeartbeatState = 'dormant' | 'receiving' | 'processing' | 'diagnosed'

const STATUS_HEX: Record<SkillStatus, string> = {
  dormant: '#94a3b8',
  initializing: '#4f46e5',
  queued: '#cbd5e1',
  running: '#4f46e5',
  completed: '#059669',
  warning: '#d97706',
  critical: '#e11d48',
  skipped: '#94a3b8',
  partial: '#d97706',
}

/**
 * Diagnostic instrument node with 4-tier visual hierarchy:
 * 1. ROOT (~38px): Origin controller with 8 radial ticks, multi-ring aperture, and live energy core
 * 2. DIMENSION (~28px): Structural trunk anchor with 4 cardinal crosshair ticks, heavy chassis, and anchor diamond
 * 3. SKILL (~18px): Diagnostic instrument with lateral sensor notches, concentric iris, glowing pupil, and finding indicator
 * 4. MICRO (~8px): Geometric data artifacts (diamond for check, capsule for signal, faceted gem for evidence, square for fact, reticle for anchor, tab for page)
 */
export function TreeNode({
  x,
  y,
  status,
  label,
  size = 18,
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
  rootState = 'dormant',
  kind,
  hasFinding,
  highlighted = false,
}: {
  x: number
  y: number
  status: SkillStatus
  label: string
  size?: number
  selected?: boolean
  highlighted?: boolean
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
  variant?: 'skill' | 'dimension' | 'root' | 'micro'
  rootState?: RootHeartbeatState
  kind?: string
  hasFinding?: boolean
}) {
  const style = STATUS_STYLE[status]
  const active = isActive(status)
  const resolved = isResolved(status)
  const color = style.color
  const hex = STATUS_HEX[status] ?? '#64748b'

  // Completion bloom (400ms satisfying expansion)
  const [justCompleted, setJustCompleted] = useState(false)
  const prevStatusRef = useRef(status)

  useEffect(() => {
    const prev = prevStatusRef.current
    prevStatusRef.current = status
    if (reduced || variant !== 'skill') return

    if ((prev === 'running' || prev === 'initializing' || prev === 'queued') && resolved) {
      setJustCompleted(true)
      const timer = setTimeout(() => setJustCompleted(false), 420)
      return () => clearTimeout(timer)
    }
  }, [status, resolved, reduced, variant])

  const hitSize =
    variant === 'root'
      ? size + 36
      : variant === 'dimension'
        ? size + 24
        : variant === 'micro'
          ? 22
          : size + 20

  const isMicro = variant === 'micro'

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
      aria-current={selected || highlighted ? 'true' : undefined}
      className={cn(
        'group absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full outline-none',
        interactive ? 'cursor-pointer' : 'pointer-events-none',
        !isMicro &&
          'focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
      style={{ left: x, top: y, width: hitSize, height: hitSize }}
      initial={reduced ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.3 }}
      animate={{
        opacity: visible ? (dimmed ? (isMicro ? 0.2 : 0.35) : 1) : 0,
        scale: visible ? (justCompleted ? 1.35 : selected ? (isMicro ? 1.4 : 1.15) : highlighted ? 1.08 : 1) : 0.3,
      }}
      transition={{
        duration: justCompleted ? 0.38 : reduced ? 0 : 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* ================= 1. ROOT ORIGIN NODE ================= */}
      {variant === 'root' && (
        <div className="relative grid place-items-center" style={{ width: size + 16, height: size + 16 }}>
          {/* Subtle Ambient Halo */}
          <span
            className="absolute inset-2 rounded-full pointer-events-none transition-opacity duration-300"
            style={{
              boxShadow: `0 0 24px ${hex}35, inset 0 0 12px ${hex}20`,
            }}
          />

          {/* Rotating Technical Reticle Collar (Processing State) */}
          {rootState === 'processing' && !reduced && (
            <motion.svg
              width={size + 16}
              height={size + 16}
              viewBox={`0 0 ${size + 16} ${size + 16}`}
              className="absolute pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            >
              <circle
                cx={(size + 16) / 2}
                cy={(size + 16) / 2}
                r={(size + 10) / 2}
                fill="none"
                stroke={color}
                strokeWidth="0.8"
                strokeDasharray="2 6"
                opacity={0.6}
              />
            </motion.svg>
          )}

          {/* Expanding Energy Wave (Receiving / Processing) */}
          {(rootState === 'receiving' || rootState === 'processing') && !reduced && (
            <motion.span
              aria-hidden
              className="absolute rounded-full pointer-events-none"
              style={{ border: `1.2px solid ${color}` }}
              animate={{ width: [size, size + 42], height: [size, size + 42], opacity: [0.65, 0] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
            />
          )}

          {/* Root Origin Master SVG */}
          <svg
            width={size + 16}
            height={size + 16}
            viewBox={`0 0 ${size + 16} ${size + 16}`}
            className="overflow-visible"
            aria-hidden
          >
            {/* 8 Radial Optical Reticle Ticks at 45° increments */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
              const rad = (angle * Math.PI) / 180
              const c = (size + 16) / 2
              const r1 = size / 2 + 3.5
              const r2 = size / 2 + 6.5
              return (
                <line
                  key={angle}
                  x1={c + Math.cos(rad) * r1}
                  y1={c + Math.sin(rad) * r1}
                  x2={c + Math.cos(rad) * r2}
                  y2={c + Math.sin(rad) * r2}
                  stroke={color}
                  strokeWidth="1.0"
                  strokeLinecap="round"
                  opacity={0.55}
                />
              )
            })}

            {/* Main Outer Chassis */}
            <circle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r={size / 2}
              fill="rgba(8, 12, 20, 0.96)"
              stroke={color}
              strokeWidth={selected ? 2.4 : 1.8}
            />

            {/* Middle Precision Ring */}
            <circle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r={size * 0.36}
              fill="none"
              stroke={color}
              strokeWidth="1.0"
              strokeDasharray="4 3"
              opacity={0.5}
            />

            {/* Inner Aperture Collar */}
            <circle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r={size * 0.22}
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              opacity={0.8}
            />

            {/* Central Origin Pupil */}
            <circle
              cx={(size + 16) / 2}
              cy={(size + 16) / 2}
              r="3.2"
              fill={color}
              style={{ filter: `drop-shadow(0 0 6px ${hex})` }}
            />
          </svg>
        </div>
      )}

      {/* ================= 2. DIMENSION TRUNK ANCHOR NODE ================= */}
      {variant === 'dimension' && (
        <div className="relative grid place-items-center" style={{ width: size + 8, height: size + 8 }}>
          {/* Outer anchor glow on select/hover */}
          <span
            className={cn(
              'absolute inset-0 rounded-full transition-opacity duration-300 pointer-events-none',
              selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
            )}
            style={{
              boxShadow: `0 0 16px ${hex}45, inset 0 0 8px ${hex}20`,
            }}
          />

          {/* Active Radial Wave on active limb */}
          {active && !reduced && (
            <motion.span
              aria-hidden
              className="absolute rounded-full pointer-events-none"
              style={{ width: size, height: size, border: `1.2px solid ${color}` }}
              animate={{ opacity: [0.75, 0], scale: [1, 1.8] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
            />
          )}

          {/* Trunk Anchor SVG with Cardinal Crosshair Ticks */}
          <svg
            width={size + 8}
            height={size + 8}
            viewBox={`0 0 ${size + 8} ${size + 8}`}
            className="overflow-visible"
            aria-hidden
          >
            {/* 4 Cardinal Crosshair Ticks */}
            <line
              x1={(size + 8) / 2}
              y1="0"
              x2={(size + 8) / 2}
              y2="3"
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1={(size + 8) / 2}
              y1={size + 5}
              x2={(size + 8) / 2}
              y2={size + 8}
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="0"
              y1={(size + 8) / 2}
              x2="3"
              y2={(size + 8) / 2}
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1={size + 5}
              y1={(size + 8) / 2}
              x2={size + 8}
              y2={(size + 8) / 2}
              stroke={color}
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Main Anchor Chassis Circle */}
            <circle
              cx={(size + 8) / 2}
              cy={(size + 8) / 2}
              r={size / 2}
              fill="rgba(9, 13, 22, 0.95)"
              stroke={color}
              strokeWidth={selected ? 2.2 : 1.8}
            />

            {/* Concentric Inner Track */}
            <circle
              cx={(size + 8) / 2}
              cy={(size + 8) / 2}
              r={size * 0.34}
              fill="none"
              stroke={color}
              strokeWidth="1.0"
              strokeDasharray="3 3"
              opacity={selected ? 0.85 : 0.5}
            />

            {/* Center Anchor Diamond Hub */}
            <rect
              x={(size + 8) / 2 - 3.5}
              y={(size + 8) / 2 - 3.5}
              width="7"
              height="7"
              rx="1"
              transform={`rotate(45 ${(size + 8) / 2} ${(size + 8) / 2})`}
              fill={color}
              style={{ filter: `drop-shadow(0 0 4px ${hex})` }}
            />
          </svg>
        </div>
      )}

      {/* ================= 3. SKILL DIAGNOSTIC INSTRUMENT NODE ================= */}
      {variant === 'skill' && (
        <div className="relative grid place-items-center" style={{ width: size + 6, height: size + 6 }}>
          {/* Outer subtle halo on hover / selected */}
          <span
            className={cn(
              'absolute -inset-1 rounded-full transition-opacity duration-300 pointer-events-none',
              selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-75',
            )}
            style={{
              boxShadow: `0 0 12px ${hex}40, 0 0 22px ${hex}20`,
            }}
          />

          {/* Rotating active collar when running */}
          {active && !reduced && (
            <motion.svg
              width={size + 10}
              height={size + 10}
              viewBox={`0 0 ${size + 10} ${size + 10}`}
              className="absolute pointer-events-none"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            >
              <circle
                cx={(size + 10) / 2}
                cy={(size + 10) / 2}
                r={(size + 6) / 2}
                fill="none"
                stroke={color}
                strokeWidth="0.85"
                strokeDasharray="4 6"
                opacity={0.65}
              />
            </motion.svg>
          )}

          {/* Active Heartbeat Pulse Ring */}
          {active && !reduced && (
            <motion.span
              aria-hidden
              className="absolute rounded-full pointer-events-none"
              style={{ width: size, height: size, border: `1.2px solid ${color}` }}
              initial={{ opacity: 0.7, scale: 1 }}
              animate={{ opacity: 0, scale: 2.0 }}
              transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
            />
          )}

          {/* Skill Completion Burst */}
          {justCompleted && !reduced && (
            <motion.span
              aria-hidden
              className="absolute rounded-full pointer-events-none"
              style={{ width: size, height: size, border: `1.8px solid ${color}` }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 2.5 }}
              transition={{ duration: 0.42, ease: 'easeOut' }}
            />
          )}

          {/* Chassis Ring with Lateral Notches */}
          <svg
            width={size + 6}
            height={size + 6}
            viewBox={`0 0 ${size + 6} ${size + 6}`}
            className="overflow-visible"
            aria-hidden
          >
            {/* Lateral diagnostic notches (ears at 0° and 180°) */}
            <line
              x1="0"
              y1={(size + 6) / 2}
              x2="2.5"
              y2={(size + 6) / 2}
              stroke={color}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity={active || selected ? 1 : 0.6}
            />
            <line
              x1={size + 3.5}
              y1={(size + 6) / 2}
              x2={size + 6}
              y2={(size + 6) / 2}
              stroke={color}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity={active || selected ? 1 : 0.6}
            />

            {/* Main Chassis Circle */}
            <circle
              cx={(size + 6) / 2}
              cy={(size + 6) / 2}
              r={size / 2}
              fill="rgba(9, 13, 22, 0.95)"
              stroke={color}
              strokeWidth={selected ? 1.8 : 1.3}
            />

            {/* Concentric Inner Iris Ring */}
            <circle
              cx={(size + 6) / 2}
              cy={(size + 6) / 2}
              r={size * 0.32}
              fill="none"
              stroke={color}
              strokeWidth="0.75"
              strokeDasharray={active ? '2 3' : undefined}
              opacity={selected || active ? 0.8 : 0.45}
            />

            {/* Center Optic Pupil */}
            <circle
              cx={(size + 6) / 2}
              cy={(size + 6) / 2}
              r={active ? 2.8 : 2.3}
              fill={color}
              style={{
                filter: active || selected ? `drop-shadow(0 0 3px ${hex})` : undefined,
              }}
            />
          </svg>

          {/* Progress arc for active nodes */}
          {active && (
            <span
              aria-hidden
              className="absolute rounded-full pointer-events-none"
              style={{
                width: size,
                height: size,
                background: `conic-gradient(${color} ${Math.round(progress * 360)}deg, transparent 0)`,
                opacity: 0.45,
                maskImage: 'radial-gradient(transparent 55%, black 60%)',
                WebkitMaskImage: 'radial-gradient(transparent 55%, black 60%)',
              }}
            />
          )}

          {/* Terminal Finding Pip Indicator (Requirement 10) */}
          {(hasFinding || status === 'critical' || status === 'warning') && (
            <span
              aria-hidden
              className="absolute -top-1 -right-1 size-2 rounded-xs rotate-45 border border-black/80 transition-transform duration-200"
              style={{
                backgroundColor: status === 'critical' ? 'var(--critical)' : 'var(--warning)',
                boxShadow: `0 0 6px ${status === 'critical' ? '#f43f5e' : '#f59e0b'}`,
              }}
            />
          )}
        </div>
      )}

      {/* ================= 4. MICRO / EVIDENCE DATA ARTIFACTS ================= */}
      {isMicro && (
        <div className="relative grid place-items-center transition-transform duration-150 group-hover:scale-125">
          {/* Outer glow on hover or selection */}
          <span
            className={cn(
              'absolute -inset-1 rounded-full transition-opacity duration-200 pointer-events-none',
              selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-75',
            )}
            style={{
              boxShadow: `0 0 8px ${hex}50`,
            }}
          />

          <MicroShape
            kind={kind}
            color={color}
            hex={hex}
            selected={selected}
            active={active}
          />
        </div>
      )}
    </motion.button>
  )
}

/**
 * Tailored geometric shapes representing distinct diagnostic artifacts:
 * - 'evidence': Faceted radiant gem (diamond with glowing alert core)
 * - 'check': Precision verification diamond with hollow frame and center dot
 * - 'signal': Telemetry pill with center optic slit
 * - 'fact': Technical knowledge square with center pip
 * - 'anchor': Reticle ring with crosshair ticks
 * - 'page': Document tab with notched corner and text hairline
 */
function MicroShape({
  kind,
  color,
  hex,
  selected,
  active,
}: {
  kind?: string
  color: string
  hex: string
  selected?: boolean
  active?: boolean
}) {
  switch (kind) {
    case 'evidence':
      return (
        <svg width="12" height="12" viewBox="0 0 12 12" className="overflow-visible" aria-hidden>
          <polygon
            points="6,1 11,6 6,11 1,6"
            fill={selected || active ? hex : 'rgba(9, 13, 22, 0.95)'}
            stroke={color}
            strokeWidth="1.2"
          />
          <circle cx="6" cy="6" r="1.8" fill={selected || active ? '#ffffff' : color} />
        </svg>
      )

    case 'check':
      return (
        <svg width="10" height="10" viewBox="0 0 10 10" className="overflow-visible" aria-hidden>
          <polygon
            points="5,1 9,5 5,9 1,5"
            fill="rgba(9, 13, 22, 0.95)"
            stroke={color}
            strokeWidth="1.1"
          />
          <circle cx="5" cy="5" r="1.2" fill={color} />
        </svg>
      )

    case 'signal':
      return (
        <svg width="12" height="7" viewBox="0 0 12 7" className="overflow-visible" aria-hidden>
          <rect
            x="1"
            y="1"
            width="10"
            height="5"
            rx="2.5"
            fill="rgba(9, 13, 22, 0.95)"
            stroke={color}
            strokeWidth="1.1"
          />
          <line x1="4" y1="3.5" x2="8" y2="3.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )

    case 'fact':
      return (
        <svg width="9" height="9" viewBox="0 0 9 9" className="overflow-visible" aria-hidden>
          <rect
            x="1"
            y="1"
            width="7"
            height="7"
            rx="1"
            fill="rgba(9, 13, 22, 0.95)"
            stroke={color}
            strokeWidth="1.1"
          />
          <circle cx="4.5" cy="4.5" r="1.4" fill={color} />
        </svg>
      )

    case 'anchor':
      return (
        <svg width="11" height="11" viewBox="0 0 11 11" className="overflow-visible" aria-hidden>
          <circle cx="5.5" cy="5.5" r="3.5" fill="rgba(9, 13, 22, 0.95)" stroke={color} strokeWidth="1.1" />
          <line x1="5.5" y1="0.5" x2="5.5" y2="2" stroke={color} strokeWidth="1" strokeLinecap="round" />
          <line x1="5.5" y1="9" x2="5.5" y2="10.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
          <line x1="0.5" y1="5.5" x2="2" y2="5.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
          <line x1="9" y1="5.5" x2="10.5" y2="5.5" stroke={color} strokeWidth="1" strokeLinecap="round" />
        </svg>
      )

    case 'page':
      return (
        <svg width="9" height="11" viewBox="0 0 9 11" className="overflow-visible" aria-hidden>
          <polygon
            points="1,1 6,1 8,3 8,10 1,10"
            fill="rgba(9, 13, 22, 0.95)"
            stroke={color}
            strokeWidth="1.1"
          />
          <line x1="2.5" y1="4.5" x2="6" y2="4.5" stroke={color} strokeWidth="0.8" />
          <line x1="2.5" y1="6.5" x2="6" y2="6.5" stroke={color} strokeWidth="0.8" />
          <line x1="2.5" y1="8.5" x2="4.5" y2="8.5" stroke={color} strokeWidth="0.8" />
        </svg>
      )

    default:
      return (
        <svg width="8" height="8" viewBox="0 0 8 8" className="overflow-visible" aria-hidden>
          <circle cx="4" cy="4" r="3" fill="rgba(9, 13, 22, 0.95)" stroke={color} strokeWidth="1.1" />
          <circle cx="4" cy="4" r="1.2" fill={color} />
        </svg>
      )
  }
}
