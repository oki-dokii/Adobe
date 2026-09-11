'use client'

import { useRef, useState } from 'react'
import type { PerceptionSpan } from '@/lib/perception/types'
import { cn } from '@/lib/utils'

export function PerceptionAnswer({
  answer,
  spans,
  activeSpanId,
  onSelect,
  reduced = false,
}: {
  answer: string
  spans: PerceptionSpan[]
  activeSpanId: string | null
  onSelect: (span: PerceptionSpan | null) => void
  reduced?: boolean
}) {
  const [hoveredSpanId, setHoveredSpanId] = useState<string | null>(null)
  const chipsRef = useRef<(HTMLButtonElement | null)[]>([])

  const displaySpans = spans.length > 0 ? spans : [
    {
      id: 's-all',
      text: answer,
      start: 0,
      end: answer.length,
      findingIds: [],
      skillIds: [],
      evidenceIds: [],
      causeIds: [],
      grounding: 'inferred' as const,
    },
  ]

  const handleSpanClick = (span: PerceptionSpan) => {
    if (activeSpanId === span.id) {
      onSelect(null)
    } else {
      onSelect(span)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (index + 1) % displaySpans.length
      chipsRef.current[next]?.focus()
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (index - 1 + displaySpans.length) % displaySpans.length
      chipsRef.current[prev]?.focus()
    }
  }

  return (
    <section aria-live="polite" aria-atomic="true" className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
          Answer Receipts & Traces
        </p>
        <span className="font-mono text-[9px] text-muted-foreground/80">
          click sentence to X-ray tree
        </span>
      </div>

      <div
        className="group/answers flex flex-wrap gap-1.5"
        role="group"
        aria-label="Answer sentence traces"
      >
        {displaySpans.map((span, idx) => {
          const isSelected = activeSpanId === span.id
          const isHovered = hoveredSpanId === span.id
          const hasSiblingHover = Boolean(hoveredSpanId && !isHovered)

          const tooltip =
            span.grounding === 'supported'
              ? `[SUPPORT] ${span.skillIds.join(', ') || 'verified'} · ${span.findingIds.length || span.evidenceIds.length || 1} evidence`
              : span.grounding === 'unsupported'
                ? `[UNSUPPORTED] no first-party extractable span`
                : `[INFERRED] ${span.skillIds.join(', ') || 'synthesized'}`

          return (
            <div key={span.id} className="relative inline-block">
              <button
                ref={(el) => {
                  chipsRef.current[idx] = el
                }}
                type="button"
                onClick={() => handleSpanClick(span)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                onMouseEnter={() => setHoveredSpanId(span.id)}
                onMouseLeave={() => setHoveredSpanId(null)}
                aria-pressed={isSelected}
                aria-label={`${span.grounding}: ${span.text}`}
                title={tooltip}
                className={cn(
                  'cursor-pointer rounded-lg border bg-surface/90 px-3 py-2 text-left text-[12.5px] leading-relaxed text-foreground transition-all duration-120',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal',
                  reduced && 'transition-none',
                  span.grounding === 'supported' && 'border-l-[3px] border-l-emerald-400',
                  span.grounding === 'inferred' && 'border-l-[3px] border-l-sky-400',
                  span.grounding === 'unsupported' && 'border-l-[3px] border-l-amber-400',
                  isSelected
                    ? 'border-signal bg-signal/10 ring-1 ring-signal/60 shadow-sm'
                    : 'border-white/10 hover:border-white/25',
                  hasSiblingHover && !isSelected && 'opacity-70',
                )}
              >
                <span>{span.text}</span>
                {span.skillIds.length > 0 && (
                  <span className="ml-1.5 inline-block font-mono text-[9px] text-muted-foreground/70 uppercase">
                    [{span.skillIds[0].replace(/-audit$/, '')}]
                  </span>
                )}
              </button>
            </div>
          )
        })}
      </div>
    </section>
  )
}
