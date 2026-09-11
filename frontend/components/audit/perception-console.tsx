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
          className="flex h-full w-10 cursor-pointer items-center justify-center rounded-2xl border border-slate-200 bg-white/95 font-mono text-[10px] font-bold tracking-[0.2em] text-slate-600 [writing-mode:vertical-rl] hover:text-slate-900 hover:border-slate-300 transition-colors shadow-lg backdrop-blur-xl"
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
        'pointer-events-auto flex flex-col overflow-hidden bg-white/95 backdrop-blur-xl',
        layout === 'dock' &&
          'absolute inset-y-20 left-5 z-20 hidden w-[23rem] border border-slate-200 lg:flex lg:rounded-2xl lg:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-[left,width] duration-300 ease-[cubic-bezier(0.2,0,0,1)] motion-reduce:transition-none',
        layout === 'embedded' && 'h-full border-0 bg-transparent',
      )}
    >
      {/* Header */}
      <header className="flex items-start justify-between gap-2 border-b border-slate-100 bg-slate-50/80 px-4.5 py-3.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-indigo-600" />
            <h2 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
              Perception Engine
            </h2>
            {layout === 'dock' && (
              <button
                type="button"
                aria-expanded={open}
                onClick={onToggleOpen}
                className="cursor-pointer rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                Collapse
              </button>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-600">
            Ask what an AI assistant would synthesize from extractable evidence.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-right font-mono text-[9px] font-bold text-amber-800">
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
                  'flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2.5 transition-all shadow-2xs',
                  isSelected
                    ? 'border-indigo-300 bg-indigo-50/70 text-indigo-950 font-semibold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                )}
              >
                <input
                  type="radio"
                  name="perception-question"
                  value={q.id}
                  checked={isSelected}
                  onChange={() => onSelectQuestion(q.id)}
                  className="size-3.5 accent-indigo-600 cursor-pointer"
                />
                <span className="text-xs">{q.prompt}</span>
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
            'w-full cursor-pointer rounded-xl bg-indigo-600 px-3.5 py-2.5 text-xs font-bold tracking-wide text-white uppercase transition-all shadow-xs',
            'hover:bg-indigo-700 active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-600/30',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {loading ? 'Synthesizing…' : 'Query Evidence'}
        </button>

        {/* Stale Evidence Warning */}
        {bundle?.perception.stale && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 flex items-center justify-between font-medium">
            <span>Evidence set changed — re-query</span>
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
          </div>
        )}

        {/* Errors & Fallback */}
        {error && (
          <div className="space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <p className="text-xs text-rose-700 font-medium">{error}</p>
            {usedClientFallback && (
              <p className="font-mono text-[10px] text-slate-500">Used extract-only fallback</p>
            )}
            <button
              type="button"
              onClick={onAsk}
              className="cursor-pointer font-mono text-xs text-indigo-600 font-bold underline hover:text-indigo-800"
            >
              Retry
            </button>
          </div>
        )}

        {/* Skeleton Loading */}
        {loading && !perception && (
          <div className="space-y-2.5 pt-1" aria-hidden="true">
            <div className="h-3.5 rounded bg-slate-200 animate-pulse" />
            <div className="h-3.5 w-4/5 rounded bg-slate-200 animate-pulse" />
            <div className="h-3.5 w-3/5 rounded bg-slate-200 animate-pulse" />
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
            <div className="flex items-center justify-between border-b border-slate-100 pb-2 text-xs uppercase tracking-wider text-slate-500 font-medium">
              <span>status: <strong className="text-slate-900">{perception.status}</strong></span>
              <span>confidence: <strong className="text-indigo-600">{perception.confidence}</strong></span>
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
