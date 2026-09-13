'use client'

import type { GravityResult, PerceptionSpan } from '@/lib/perception/types'
import { cn } from '@/lib/utils'

export function RecommendationGravityRow({
  gravity,
  onSelectGravity,
}: {
  gravity: GravityResult | null
  onSelectGravity?: (span: PerceptionSpan) => void
}) {
  if (!gravity) return null

  const handleClick = () => {
    if (!onSelectGravity) return
    const span: PerceptionSpan = {
      id: 'gravity-row',
      text: `${gravity.label}: ${gravity.detail}`,
      start: 0,
      end: 0,
      findingIds: [],
      skillIds: gravity.skillIds,
      evidenceIds: [],
      causeIds: [],
      grounding: gravity.class === 'named' ? 'supported' : 'unsupported',
    }
    onSelectGravity(span)
  }

  const isNamed = gravity.class === 'named'
  const isGeneric = gravity.class === 'generic'
  const isDisplaced = gravity.class === 'displaced'

  return (
    <div
      role="region"
      aria-label="Recommendation Gravity"
      className={cn(
        'space-y-2.5 rounded-xl border p-3.5 transition-all',
        isNamed && 'border-emerald-500/25 bg-emerald-500/[0.03]',
        isGeneric && 'border-sky-500/25 bg-sky-500/[0.03]',
        isDisplaced && 'border-amber-500/25 bg-amber-500/[0.03]',
      )}
    >
      <div className="flex items-center justify-between border-b border-white/6 pb-2">
        <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
          RECOMMENDATION GRAVITY
        </span>
        <span
          className={cn(
            'rounded px-2 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase',
            isNamed && 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
            isGeneric && 'bg-sky-500/20 text-sky-300 border border-sky-500/30',
            isDisplaced && 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
          )}
        >
          {gravity.label}
        </span>
      </div>

      <p className="text-[11px] leading-relaxed text-foreground/90">
        {gravity.detail}
      </p>

      <div className="flex items-center justify-between pt-1 border-t border-white/6 text-[9px] font-mono text-muted-foreground">
        <span>Derived from: Handoff & Answerability Audits</span>
        <button
          type="button"
          onClick={handleClick}
          className="cursor-pointer text-signal hover:underline font-bold"
        >
          Inspect Skills on Tree →
        </button>
      </div>
    </div>
  )
}
