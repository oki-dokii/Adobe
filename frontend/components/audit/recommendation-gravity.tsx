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
    <button
      type="button"
      role="status"
      onClick={handleClick}
      aria-label={`Recommendation Gravity ${gravity.label}: ${gravity.detail}`}
      className={cn(
        'group flex w-full flex-col gap-1.5 rounded-xl border p-3 text-left transition-all cursor-pointer',
        'hover:border-white/20 focus:outline-none focus:ring-1 focus:ring-signal/50',
        isNamed && 'border-emerald-500/25 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.08]',
        isGeneric && 'border-sky-500/25 bg-sky-500/[0.04] hover:bg-sky-500/[0.08]',
        isDisplaced && 'border-amber-500/25 bg-amber-500/[0.04] hover:bg-amber-500/[0.08]',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Recommendation Gravity
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

      <p className="text-[11px] leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
        {gravity.detail}
      </p>

      <div className="flex items-center justify-between pt-0.5">
        <span className="font-mono text-[8px] text-muted-foreground/60 uppercase">
          Click to inspect engagement & answerability
        </span>
        <span className="font-mono text-[8px] text-signal/80 opacity-0 group-hover:opacity-100 transition-opacity">
          Trace on tree →
        </span>
      </div>
    </button>
  )
}
