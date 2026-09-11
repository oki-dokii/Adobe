'use client'

import type { SkillId } from '@/lib/audit/types'
import type { PerceptionSpan, SubstitutionResult } from '@/lib/perception/types'
import { cn } from '@/lib/utils'

export function SubstitutionPanel({
  substitution,
  onShowOnTree,
}: {
  substitution: SubstitutionResult | null
  onShowOnTree?: (span: PerceptionSpan) => void
}) {
  if (!substitution || !substitution.active) return null

  const handleShowOnTree = () => {
    if (!onShowOnTree) return
    const span: PerceptionSpan = {
      id: 'sub-cause-chain',
      text: substitution.likelyCite,
      start: 0,
      end: 0,
      findingIds: substitution.findingIds,
      skillIds: substitution.skillIds,
      evidenceIds: [],
      causeIds: substitution.causeChain.map((c) => c.id),
      grounding: 'unsupported',
    }
    onShowOnTree(span)
  }

  return (
    <section
      role="note"
      aria-label="Substitution Counterfactual"
      className="space-y-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.04] p-3 transition-opacity duration-[240ms] ease-linear motion-reduce:duration-0"
    >
      <div className="flex items-center justify-between gap-2 border-b border-amber-500/15 pb-2">
        <p className="font-mono text-[9px] font-bold tracking-wider text-amber-300 uppercase">
          SUBSTITUTION COUNTERFACTUAL
        </p>
        <span className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[8px] font-medium text-amber-200/90 uppercase">
          First-party [{substitution.firstParty}]
        </span>
      </div>

      <div className="space-y-1">
        <p className="font-mono text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
          Likely Citation
        </p>
        <p className="text-[11px] leading-relaxed text-foreground">
          {substitution.likelyCite}
        </p>
      </div>

      {substitution.causeChain.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-mono text-[9px] font-semibold tracking-wider text-muted-foreground uppercase">
            Causal Progression
          </p>
          <div className="flex flex-wrap items-center gap-1 font-mono text-[10px] text-muted-foreground">
            {substitution.causeChain.map((c, idx) => (
              <span key={c.id} className="inline-flex items-center gap-1">
                {idx > 0 && <span className="text-amber-500/60">→</span>}
                <span className={cn('rounded px-1.5 py-0.5', idx === substitution.causeChain.length - 1 ? 'bg-amber-500/20 text-amber-200 font-semibold' : 'bg-white/5 text-muted-foreground')}>
                  {c.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="font-mono text-[8px] text-muted-foreground/80 tracking-wide uppercase">
          SIMULATED FROM AUDIT GAPS · NOT A LIVE CITATION SCRAPE
        </span>
        <button
          type="button"
          onClick={handleShowOnTree}
          className="cursor-pointer rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-amber-300 uppercase transition-colors hover:bg-amber-500/20"
        >
          Show on tree
        </button>
      </div>
    </section>
  )
}
