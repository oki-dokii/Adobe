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
      {/* 1. Deep Cool Obsidian Base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 85% 70% at 50% 46%, #0b111e 0%, #070b13 54%, #04060a 100%)',
        }}
      />

      {/* 2. Extremely Subtle Optical Field (10-15% visual weight) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle 460px at 50% 46%, rgba(56, 189, 248, 0.04) 0%, rgba(14, 165, 233, 0.015) 50%, transparent 75%)',
        }}
      />

      {/* 3. Restrained Fine Cad Grid */}
      <div
        className="absolute inset-0 bg-cad-grid opacity-40"
        style={{
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 46%, black 28%, rgba(0,0,0,0.45) 70%, transparent 92%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 46%, black 28%, rgba(0,0,0,0.45) 70%, transparent 92%)',
        }}
      />

      {/* 4. Fine Calibration Rings */}
      <svg className="absolute inset-0 h-full w-full opacity-12" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50%" cy="46%" r="140" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="0.6" strokeDasharray="2 6" />
        <circle cx="50%" cy="46%" r="300" fill="none" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="0.6" strokeDasharray="3 10" />
      </svg>

      {/* 5. Distant Root Micro-Structures with Subdued Parallax */}
      <motion.div
        className="absolute inset-0"
        animate={{ x: dx * 4, y: dy * 3 }}
        transition={{ type: 'spring', stiffness: 24, damping: 30, mass: 1.8 }}
      >
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
          <g opacity={0.10}>
            {distant.map((d, i) => (
              <path key={`d${i}`} d={d} fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth={0.5} strokeLinecap="round" />
            ))}
          </g>
        </svg>
      </motion.div>

      {/* 6. Perimeter Spatial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 46%, transparent 50%, rgba(4, 6, 10, 0.8) 85%, #04060a 100%)',
        }}
      />
    </div>
  )
}
