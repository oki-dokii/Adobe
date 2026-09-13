'use client'

import { useState } from 'react'
import type { PerceptionSpan, SubstitutionResult } from '@/lib/perception/types'
import { cn } from '@/lib/utils'

export function SubstitutionPanel({
  substitution,
  onShowOnTree,
}: {
  substitution: SubstitutionResult | null
  onShowOnTree?: (span: PerceptionSpan) => void
}) {
  const [copied, setCopied] = useState(false)

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

  const patch = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Enterprise Platform Services",
  "offers": {
    "@type": "Offer",
    "price": "Contact for Tier Volume",
    "priceCurrency": "USD"
  }
}
</script>`

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(patch)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section
      role="region"
      aria-label="Substitution Counterfactual"
      className="space-y-3 rounded-xl border border-amber-500/25 bg-amber-500/[0.03] p-3.5 shadow-sm transition-all"
    >
      <div className="flex items-center justify-between border-b border-amber-500/15 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] font-bold tracking-wider text-amber-300 uppercase">
            SUBSTITUTION COUNTERFACTUAL
          </span>
        </div>
        <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] font-semibold text-amber-200 uppercase">
          1st-Party [{substitution.firstParty}]
        </span>
      </div>

      <div className="space-y-1">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
          Observed AI Behavioral Vulnerability
        </p>
        <p className="text-[11px] leading-relaxed text-foreground/90">
          When requested for pricing, SLAs, or technical specs, AI assistants cannot find extractable facts in first-party HTML and are forced to substitute third-party aggregators or direct competitors.
        </p>
      </div>

      {substitution.causeChain.length > 0 && (
        <div className="space-y-1.5">
          <p className="font-mono text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Causal Progression to Substitution
          </p>
          <div className="flex flex-wrap items-center gap-1 font-mono text-[10px]">
            {substitution.causeChain.map((c, idx) => (
              <span key={c.id} className="inline-flex items-center gap-1">
                {idx > 0 && <span className="text-amber-500/60">→</span>}
                <span
                  className={cn(
                    'rounded px-1.5 py-0.5 border',
                    idx === substitution.causeChain.length - 1
                      ? 'border-amber-500/30 bg-amber-500/20 text-amber-200 font-semibold'
                      : 'border-white/6 bg-white/5 text-muted-foreground',
                  )}
                >
                  {c.label}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Grounded Code Fix */}
      <div className="space-y-1.5 rounded-lg border border-white/8 bg-black/50 p-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
            PREVENT SUBSTITUTION: SERVER-RENDERED SCHEMA
          </span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="rounded border border-signal/40 bg-signal/15 px-2 py-0.5 font-mono text-[9px] font-bold text-signal uppercase hover:bg-signal/25 transition-colors cursor-pointer"
          >
            {copied ? 'COPIED ✓' : 'COPY PATCH'}
          </button>
        </div>
        <pre className="overflow-x-auto rounded bg-black/80 p-2 font-mono text-[9px] text-emerald-300/90 whitespace-pre-wrap leading-tight">
          {patch}
        </pre>
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-amber-500/10 text-[8px] font-mono text-muted-foreground">
        <span>Derived from: Omission gaps in initial server HTML</span>
        <button
          type="button"
          onClick={handleShowOnTree}
          className="cursor-pointer text-amber-300 hover:underline font-semibold"
        >
          Trace Cause on Tree →
        </button>
      </div>
    </section>
  )
}
