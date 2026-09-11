'use client'

import { PERCEPTION_QUESTIONS } from '@/lib/perception/questions'
import type { PerceptionBundle, PerceptionQuestionId, PerceptionSpan } from '@/lib/perception/types'
import { BrandMemoryGrid } from './brand-memory'
import { SubstitutionPanel } from './substitution-panel'
import { RecommendationGravityRow } from './recommendation-gravity'
import { PerceptionAnswer } from './perception-answer'
import { cn } from '@/lib/utils'

export function PerceptionConsole({
  layout,
  open = true,
  onToggleOpen,
  selectedQuestionId,
  onSelectQuestion,
  onAsk,
  loading,
  error,
  usedClientFallback,
  bundle,
  answerDimmed,
  activeSpanId,
  onSelectSpan,
}: {
  layout: 'dock' | 'embedded'
  open?: boolean
  onToggleOpen?: () => void
  selectedQuestionId: PerceptionQuestionId
  onSelectQuestion: (id: PerceptionQuestionId) => void
  onAsk: () => void
  loading: boolean
  error: string | null
  usedClientFallback: boolean
  bundle: PerceptionBundle | null
  answerDimmed: boolean
  activeSpanId: string | null
  onSelectSpan: (span: PerceptionSpan | null) => void
}) {
  if (layout === 'dock' && !open) {
    return (
      <aside className="pointer-events-auto absolute inset-y-20 left-5 z-20 hidden w-10 lg:flex transition-[left] duration-300 ease-[cubic-bezier(0.2,0,0,1)]">
        <button
          type="button"
          aria-expanded={false}
          onClick={onToggleOpen}
          aria-label="Expand Perception Console"
          className="flex h-full w-10 cursor-pointer items-center justify-center rounded-2xl border border-white/10 bg-[#0b101d]/95 font-mono text-[10px] font-semibold tracking-[0.2em] text-muted-foreground [writing-mode:vertical-rl] hover:text-foreground hover:border-indigo-500/30 transition-colors shadow-2xl backdrop-blur-2xl"
        >
          PERCEPTION
        </button>
      </aside>
    )
  }

  const perception = bundle?.perception

  return (
    <aside
      className={cn(
        'pointer-events-auto flex flex-col overflow-hidden bg-[#0b101d]/95 backdrop-blur-2xl',
        layout === 'dock' &&
          'absolute inset-y-20 left-5 z-20 hidden w-[22.5rem] border border-white/10 lg:flex lg:rounded-2xl lg:shadow-[0_24px_64px_rgba(0,0,0,0.7)] transition-[left,width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none',
        layout === 'embedded' && 'h-full border-0 bg-transparent',
      )}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-2 border-b border-white/8 bg-black/40 px-4.5 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-indigo-400" />
            <h2 className="font-mono text-[11px] font-bold tracking-wider text-foreground uppercase">
              PERCEPTION ENGINE
            </h2>
            {layout === 'dock' && (
              <button
                type="button"
                aria-expanded={open}
                onClick={onToggleOpen}
                className="cursor-pointer rounded-md border border-white/10 px-2 py-0.5 font-mono text-[9px] text-muted-foreground hover:border-white/20 hover:text-foreground transition-colors"
              >
                COLLAPSE
              </button>
            )}
          </div>
          <p className="mt-1 text-[11px] leading-snug text-muted-foreground">
            Ask what an AI assistant would synthesize from extractable evidence.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-right font-mono text-[8px] font-semibold leading-tight tracking-wide text-amber-300">
          SIMULATED
        </span>
      </header>

      {/* Main Body */}
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4.5 py-4 scrollbar-thin">
        {/* Questions Selector */}
        <fieldset className="space-y-1.5" role="radiogroup" aria-label="Perception question">
          <legend className="sr-only">Perception questions</legend>
          {PERCEPTION_QUESTIONS.map((q) => {
            const isSelected = selectedQuestionId === q.id
            return (
              <label
                key={q.id}
                className={cn(
                  'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all',
                  isSelected
                    ? 'border-indigo-500/40 bg-indigo-500/10 text-foreground shadow-sm'
                    : 'border-white/6 bg-white/[0.02] text-muted-foreground hover:border-white/12 hover:text-foreground hover:bg-white/[0.03]',
                )}
              >
                <input
                  type="radio"
                  name="perception-question"
                  value={q.id}
                  checked={isSelected}
                  onChange={() => onSelectQuestion(q.id)}
                  className="size-3.5 accent-indigo-500 cursor-pointer"
                />
                <span className="text-xs font-medium">{q.prompt}</span>
              </label>
            )
          })}
        </fieldset>

        {/* Action Button */}
        <button
          type="button"
          onClick={onAsk}
          disabled={loading}
          aria-busy={loading}
          className={cn(
            'w-full cursor-pointer rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-3.5 py-2.5 font-mono text-[11px] font-bold tracking-wider text-white uppercase transition-all shadow-md shadow-indigo-500/20',
            'hover:from-indigo-400 hover:to-violet-500 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {loading ? 'SYNTHESIZING…' : 'QUERY EVIDENCE'}
        </button>

        {/* Stale Evidence Warning */}
        {bundle?.perception.stale && (
          <div className="rounded-xl border border-amber-500/25 bg-amber-500/8 px-3 py-2 font-mono text-[10px] text-amber-200/90 flex items-center justify-between">
            <span>Evidence set changed — re-query</span>
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
        )}

        {/* Errors & Fallback */}
        {error && (
          <div className="space-y-2 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3">
            <p className="text-[11px] leading-relaxed text-rose-300">{error}</p>
            {usedClientFallback && (
              <p className="font-mono text-[10px] text-muted-foreground">Used extract-only fallback</p>
            )}
            <button
              type="button"
              onClick={onAsk}
              className="cursor-pointer font-mono text-[10px] text-indigo-400 underline hover:text-indigo-300"
            >
              Retry
            </button>
          </div>
        )}

        {/* Skeleton Loading */}
        {loading && !perception && (
          <div className="space-y-2.5 pt-1" aria-hidden="true">
            <div className="h-3.5 rounded bg-zinc-800/80 animate-pulse" />
            <div className="h-3.5 w-4/5 rounded bg-zinc-800/80 animate-pulse" />
            <div className="h-3.5 w-3/5 rounded bg-zinc-800/80 animate-pulse" />
          </div>
        )}

        {/* Answer Well & Subcomponents */}
        {perception && (
          <div
            className={cn(
              'space-y-4 transition-opacity duration-[240ms] ease-linear motion-reduce:duration-0',
              answerDimmed || perception.stale ? 'opacity-50' : 'opacity-100',
            )}
          >
            {/* Status & Confidence Meta */}
            <div className="flex items-center justify-between border-b border-white/6 pb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              <span>status: <strong className="text-foreground">{perception.status}</strong></span>
              <span>confidence: <strong className="text-indigo-300">{perception.confidence}</strong></span>
            </div>

            {/* Grounded Answer Chips with Sentence Tracing */}
            <PerceptionAnswer
              answer={perception.answer}
              spans={perception.spans}
              activeSpanId={activeSpanId}
              onSelect={onSelectSpan}
            />

            {/* Module 05: Brand Memory */}
            <BrandMemoryGrid
              memory={bundle.memory}
              activeSpanId={activeSpanId}
              onSelectSpan={onSelectSpan}
            />

            {/* Module 06: Substitution Counterfactual */}
            <SubstitutionPanel
              substitution={bundle.substitution}
              onShowOnTree={onSelectSpan}
            />

            {/* Module 07: Recommendation Gravity */}
            <RecommendationGravityRow
              gravity={bundle.gravity}
              onSelectGravity={onSelectSpan}
            />
          </div>
        )}
      </div>
    </aside>
  )
}
