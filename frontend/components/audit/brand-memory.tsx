'use client'

import type { BrandMemory, MemoryCell, PerceptionSpan } from '@/lib/perception/types'
import { cn } from '@/lib/utils'

export function BrandMemoryGrid({
  memory,
  activeSpanId,
  onSelectSpan,
}: {
  memory: BrandMemory | null
  activeSpanId?: string | null
  onSelectSpan?: (span: PerceptionSpan) => void
}) {
  const cells = memory?.cells ?? [
    { id: 'identity', filled: false, value: null, skillIds: ['entity-identity-audit'], findingIds: [], source: 'empty' },
    { id: 'category', filled: false, value: null, skillIds: ['site-type-classifier'], findingIds: [], source: 'empty' },
    { id: 'offer', filled: false, value: null, skillIds: ['citation-extractability-audit', 'render-extract-audit'], findingIds: [], source: 'empty' },
    { id: 'proof', filled: false, value: null, skillIds: ['corroboration-consistency-audit'], findingIds: [], source: 'empty' },
    { id: 'action', filled: false, value: null, skillIds: ['engagement-handoff-audit'], findingIds: [], source: 'empty' },
    { id: 'recency', filled: false, value: null, skillIds: ['freshness-audit'], findingIds: [], source: 'empty' },
  ]

  const handleCellClick = (c: MemoryCell) => {
    if (!onSelectSpan) return
    const span: PerceptionSpan = {
      id: `mem-${c.id}`,
      text: c.value ?? `${c.id} (empty in extractable evidence)`,
      start: 0,
      end: 0,
      findingIds: c.findingIds,
      skillIds: c.skillIds,
      evidenceIds: [],
      causeIds: [],
      grounding: c.source === 'evidence' ? 'supported' : c.source === 'inferred' ? 'inferred' : 'unsupported',
    }
    onSelectSpan(span)
  }

  const loadedCount = cells.filter((c) => c.filled).length

  return (
    <section className="space-y-2 rounded-xl border border-white/8 bg-black/40 p-3" aria-label="Brand Working Memory">
      <div className="flex items-center justify-between border-b border-white/6 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-wider text-foreground uppercase">
            BRAND WORKING MEMORY
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">
            ({loadedCount}/6 loaded from evidence)
          </span>
        </div>
        <div className="flex items-center gap-1 text-[9px] font-mono text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-400" /> Evidence
          <span className="size-1.5 rounded-full bg-amber-400 ml-1.5" /> Inferred
          <span className="size-1.5 rounded-full bg-zinc-600 ml-1.5" /> Empty
        </div>
      </div>

      <p className="text-[11px] leading-snug text-muted-foreground">
        Atomic facts an assistant can extract into its context window. Empty cells force models to guess or refuse.
      </p>

      <div className="grid grid-cols-2 gap-2">
        {cells.map((c) => {
          const isSelected = activeSpanId === `mem-${c.id}`
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleCellClick(c)}
              aria-label={`${c.id}: ${c.filled ? (c.value ?? 'filled') : 'empty in extractable evidence'}`}
              className={cn(
                'group relative flex flex-col justify-between rounded-lg border p-2.5 text-left transition-all cursor-pointer',
                'focus:outline-none focus:ring-1 focus:ring-signal/50',
                c.filled
                  ? 'border-white/10 bg-surface/50 hover:border-white/20 hover:bg-surface/80'
                  : 'border-white/6 bg-white/[0.02] opacity-70 hover:opacity-100 hover:border-white/12',
                isSelected && 'border-signal ring-1 ring-signal/50 bg-signal/5',
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="font-mono text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                  {c.id}
                </span>
                <span
                  className={cn(
                    'size-1.5 rounded-sm shrink-0 transition-colors',
                    c.source === 'evidence'
                      ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.4)]'
                      : c.source === 'inferred'
                        ? 'bg-amber-400'
                        : 'bg-zinc-600',
                  )}
                  aria-hidden
                />
              </div>

              <p
                className={cn(
                  'mt-1.5 line-clamp-2 text-[11px] leading-snug',
                  c.filled ? 'text-foreground font-medium' : 'text-muted-foreground italic',
                )}
              >
                {c.filled && c.value ? c.value : '— (Empty in first-party HTML)'}
              </p>

              <div className="mt-2 flex items-center justify-between border-t border-white/6 pt-1 text-[8px] font-mono text-muted-foreground/70">
                <span className="capitalize">{c.source}</span>
                <span className="group-hover:text-signal transition-colors">Trace →</span>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}
