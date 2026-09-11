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
  const distant = useMemo(() => computeAmbientRoots(500, 500, 900, 9, 3), [])

  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })
  useEffect(() => {
    if (reduced) return
    const onMove = (e: MouseEvent) => {
      setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  const dx = reduced ? 0 : mouse.x - 0.5
  const dy = reduced ? 0 : mouse.y - 0.5

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden bg-[#f8fafc]">
      {/* 1. Subtle warm ambient light at top */}
      <div
        className="absolute inset-x-0 top-0 h-[65vh]"
        style={{
          background:
            'radial-gradient(ellipse 90% 65% at 50% -10%, rgba(224, 231, 255, 0.65) 0%, rgba(241, 245, 249, 0.4) 45%, transparent 80%)',
        }}
      />

      {/* 2. Soft center illumination for the diagnostic tree */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle 480px at 50% 48%, rgba(238, 242, 255, 0.6) 0%, transparent 70%)',
          opacity: phase === 'landing' ? 1 : 0.6,
          transition: 'opacity 0.8s ease',
        }}
      />

      {/* 3. Refined architectural dot grid */}
      <div
        className="absolute inset-0 bg-grid"
        style={{
          opacity: 0.5,
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 48%, black 25%, rgba(0,0,0,0.4) 65%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 48%, black 25%, rgba(0,0,0,0.4) 65%, transparent 90%)',
        }}
      />

      {/* 4. Architectural network lines (clean slate lines) */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: dx * 4, y: dy * 3 }}
        transition={{ type: 'spring', stiffness: 20, damping: 32, mass: 2 }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <g opacity={0.35}>
            {distant.map((d, i) => (
              <path key={`d${i}`} d={d} fill="none" stroke="#cbd5e1" strokeWidth={0.8} strokeLinecap="round" />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* 5. Ingestion pulse when active */}
      {ingesting && !reduced && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ top: '48%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <motion.div
            className="rounded-full border border-indigo-500/30 bg-indigo-500/5"
            animate={{ width: [90, 320], height: [90, 320], opacity: [0.6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </div>
  )
}
