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
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden bg-background">
      {/* 1. Warm editorial dark base — subtle violet warmth, not cold blue */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 50% 20%, #16112a 0%, #0e0c18 35%, #09090f 70%, #060608 100%)',
        }}
      />

      {/* 2. Top light source — like a warm lamp overhead */}
      <div
        className="absolute inset-x-0 top-0 h-[55vh]"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(120, 80, 200, 0.08) 0%, transparent 70%)',
        }}
      />

      {/* 3. Subtle center glow for the audit origin */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle 380px at 50% 46%, rgba(100, 70, 180, 0.05) 0%, transparent 70%)',
          opacity: phase === 'landing' ? 1 : 0.4,
          transition: 'opacity 0.8s ease',
        }}
      />

      {/* 4. Very fine dot grid — only near center, very subtle */}
      <div
        className="absolute inset-0 bg-grid"
        style={{
          opacity: 0.25,
          maskImage:
            'radial-gradient(ellipse 65% 55% at 50% 46%, black 20%, rgba(0,0,0,0.3) 60%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 65% 55% at 50% 46%, black 20%, rgba(0,0,0,0.3) 60%, transparent 85%)',
        }}
      />

      {/* 5. Distant ambient micro-structures with warm-purple tint */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: dx * 3, y: dy * 2 }}
        transition={{ type: 'spring', stiffness: 20, damping: 32, mass: 2 }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <g opacity={0.07}>
            {distant.map((d, i) => (
              <path key={`d${i}`} d={d} fill="none" stroke="rgba(160, 120, 240, 0.4)" strokeWidth={0.5} strokeLinecap="round" />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* 6. Soft edge vignette — very gentle */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(6, 6, 8, 0.6) 88%, #060608 100%)',
        }}
      />

      {/* 7. Ingestion pulse — subtle ring when processing */}
      {ingesting && !reduced && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ top: '46%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <motion.div
            className="rounded-full border border-signal/20"
            animate={{ width: [80, 280], height: [80, 280], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
          />
        </motion.div>
      )}
    </div>
  )
}
