'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { computeAmbientRoots } from '@/lib/audit/layout'
import { usePrefersReducedMotion } from '@/hooks/use-measure'
import type { AppPhase } from '@/lib/audit/types'

export function AmbientBackground({
  phase,
  portalActive = false,
  ingesting = false,
}: {
  phase: AppPhase
  portalActive?: boolean
  ingesting?: boolean
}) {
  const reduced = usePrefersReducedMotion()
  const distant = useMemo(() => computeAmbientRoots(500, 500, 920, 9, 3), [])
  const mid = useMemo(() => computeAmbientRoots(500, 500, 560, 7, 21), [])
  const near = useMemo(() => computeAmbientRoots(500, 480, 280, 5, 44), [])
  const nodes = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        x: 180 + ((i * 97) % 640),
        y: 140 + ((i * 61) % 720),
        r: 1.2 + (i % 3) * 0.5,
      })),
    [],
  )

  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  useEffect(() => {
    if (reduced) return
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  const live = phase === 'auditing' || ingesting || phase === 'results'
  const activate = portalActive || ingesting
  const dx = reduced ? 0 : mouse.x - 0.5
  const dy = reduced ? 0 : mouse.y - 0.5

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 42%, oklch(0.16 0.012 250) 0%, var(--background) 58%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 30% 20%, color-mix(in oklch, var(--signal) 6%, transparent), transparent 42%), radial-gradient(ellipse at 70% 80%, color-mix(in oklch, var(--foreground) 4%, transparent), transparent 45%)',
        }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{ x: dx * 6, y: dy * 4 }}
        transition={{ type: 'spring', stiffness: 28, damping: 28, mass: 1.6 }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <g opacity={live ? 0.2 : 0.14}>
            {distant.map((d, i) => (
              <path key={`d${i}`} d={d} fill="none" stroke="var(--line)" strokeWidth={0.6} strokeLinecap="round" />
            ))}
          </g>
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ x: dx * 12, y: dy * 8 }}
        transition={{ type: 'spring', stiffness: 32, damping: 26, mass: 1.3 }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <g opacity={activate ? 0.28 : live ? 0.2 : 0.12}>
            {mid.map((d, i) => (
              <path
                key={`m${i}`}
                d={d}
                fill="none"
                stroke="color-mix(in oklch, var(--signal) 12%, var(--line))"
                strokeWidth={0.75}
                strokeLinecap="round"
              />
            ))}
            {nodes.map((n, i) => (
              <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="var(--line)" />
            ))}
          </g>
        </svg>
      </motion.div>

      <motion.div
        className="absolute inset-0"
        animate={{ x: dx * 18, y: dy * 12 }}
        transition={{ type: 'spring', stiffness: 38, damping: 24, mass: 1.1 }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <g opacity={0.16}>
            {near.map((d, i) => (
              <path key={`n${i}`} d={d} fill="none" stroke="var(--line)" strokeWidth={0.9} strokeLinecap="round" />
            ))}
          </g>
        </svg>
      </motion.div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 48%, transparent 8%, color-mix(in oklch, var(--background) 35%, transparent) 52%, var(--background) 92%)',
        }}
      />
    </div>
  )
}
