'use client'

import type { SkillId } from '@/lib/audit/types'

/** Abstract technical marks — not icons. Drawn in the skill's local space. */
export function SkillMark({
  id,
  x,
  y,
  color,
  opacity = 0.55,
}: {
  id: SkillId
  x: number
  y: number
  color: string
  opacity?: number
}) {
  return (
    <g transform={`translate(${x + 14} ${y - 10})`} opacity={opacity} stroke={color} fill="none" strokeWidth={0.8}>
      {id === 'crawl-access-audit' && (
        <>
          <rect x={0} y={0} width={4} height={5} />
          <rect x={6} y={1} width={4} height={5} />
          <rect x={12} y={0} width={4} height={5} />
        </>
      )}
      {id === 'render-extract-audit' && (
        <>
          <rect x={0} y={0} width={10} height={8} />
          <rect x={4} y={3} width={10} height={8} opacity={0.7} />
        </>
      )}
      {id === 'citation-extractability-audit' && (
        <>
          <path d="M2 1 V9 M2 1 H6" />
          <path d="M10 2 H14 V10" />
        </>
      )}
      {id === 'entity-identity-audit' && (
        <>
          <circle cx={2} cy={4} r={2} />
          <circle cx={12} cy={4} r={2} />
          <path d="M4.2 4 H9.8" />
        </>
      )}
      {id === 'ai-answerability-audit' && (
        <>
          <circle cx={3} cy={4} r={2.4} />
          <path d="M6.2 4 H12 M12 4 l-2 -2 M12 4 l-2 2" />
        </>
      )}
      {id === 'freshness-audit' && (
        <>
          <path d="M0 7 H16" />
          <path d="M3 7 V3 M8 7 V1 M13 7 V4" />
        </>
      )}
      {id === 'corroboration-consistency-audit' && (
        <>
          <circle cx={2} cy={1.5} r={1.4} />
          <circle cx={12} cy={1.5} r={1.4} />
          <circle cx={7} cy={8} r={1.6} />
          <path d="M2.6 2.6 L6.2 6.6 M11.4 2.6 L7.8 6.6" />
        </>
      )}
      {id === 'engagement-handoff-audit' && (
        <path d="M0 4 H10 l-2.5 -2.5 M10 4 l-2.5 2.5" />
      )}
      {id === 'site-type-classifier' && <path d="M7 0 L12 4 L7 8 L2 4 Z" />}
      {id === 'audit-orchestrator' && <circle cx={6} cy={4} r={2} />}
    </g>
  )
}
