'use client'

import { motion } from 'motion/react'
import type { AuditResult, DimensionScore } from '@/lib/audit/types'
import { DIMENSIONS } from '@/lib/audit/skills'
import { WhyHint } from './why-hint'

const LABEL_COLOR: Record<DimensionScore['label'], string> = {
  strong: 'var(--success)',
  adequate: 'var(--signal)',
  'at-risk': 'var(--warning)',
  weak: 'var(--critical)',
}

export function ScoreOverview({ result, host }: { result: AuditResult; host: string }) {
  return (
    <section aria-labelledby="overview-heading" className="space-y-6">
      <div>
        <p className="text-[12px] text-muted-foreground">{host}</p>
        <div className="mt-1.5 flex items-start justify-between gap-3">
          <h2 id="overview-heading" className="text-2xl font-semibold tracking-tight text-foreground">
            {result.overallLabel}
          </h2>
          <WhyHint
            observed={result.overallSummary}
            matters="Find, Understand, Trust and Engage are the four limbs of the audit tree."
            evidence={`${result.counts.critical} critical · ${result.counts.high} high · ${result.counts.medium} medium`}
          />
        </div>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{result.overallSummary}</p>
        <p className="mt-3 font-mono text-[11px] text-muted-foreground">
          {result.counts.critical} critical · {result.counts.high} high · {result.counts.medium} medium
        </p>
      </div>

      <div className="space-y-3">
        {result.dimensionScores.map((d, i) => {
          const color = LABEL_COLOR[d.label]
          return (
            <div key={d.dimension}>
              <div className="mb-1 flex items-baseline justify-between">
                <span className="text-sm text-foreground">{DIMENSIONS[d.dimension].verb}</span>
                <span className="font-mono text-[12px] tabular-nums text-muted-foreground">{d.score}</span>
              </div>
              <div className="h-px w-full bg-border">
                <motion.div
                  className="h-px"
                  style={{ background: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${d.score}%` }}
                  transition={{ duration: 0.7, delay: 0.06 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
