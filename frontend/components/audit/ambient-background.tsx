'use client'

import type { AppPhase } from '@/lib/audit/types'

export function AmbientBackground({
  phase,
}: {
  phase: AppPhase
  portalActive?: boolean
  ingesting?: boolean
}) {
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

      {/* 2. Refined architectural dot grid */}
      <div
        className="absolute inset-0 bg-grid"
        style={{
          opacity: 0.4,
          maskImage:
            'radial-gradient(ellipse 70% 60% at 50% 48%, black 25%, rgba(0,0,0,0.3) 65%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 60% at 50% 48%, black 25%, rgba(0,0,0,0.3) 65%, transparent 90%)',
        }}
      />
    </div>
  )
}
