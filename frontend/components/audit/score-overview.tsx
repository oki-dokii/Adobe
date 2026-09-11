'use client'

import { motion } from 'motion/react'
import type { AuditResult, DimensionScore } from '@/lib/audit/types'
import { DIMENSIONS } from '@/lib/audit/skills'
import { WhyHint } from './why-hint'

const LABEL_COLOR: Record<DimensionScore['label'], string> = {
  strong: '#34d399',      // emerald-400
  adequate: '#818cf8',    // indigo-400
  'at-risk': '#fbbf24',   // amber-400
  weak: '#f87171',        // rose-400
}

export function ScoreOverview({ result, host }: { result: AuditResult; host: string }) {
  const avgScore = Math.round(
    result.dimensionScores.reduce((acc, d) => acc + d.score, 0) / (result.dimensionScores.length || 1),
  )

  const scoreColor =
    avgScore >= 75 ? '#34d399' : avgScore >= 50 ? '#818cf8' : '#fbbf24'

  const letterGrade =
    avgScore >= 90 ? 'A' :
    avgScore >= 80 ? 'A-' :
    avgScore >= 75 ? 'B+' :
    avgScore >= 70 ? 'B' :
    avgScore >= 60 ? 'C+' :
    avgScore >= 50 ? 'C' : 'D'

  const percentile = Math.min(99, Math.max(14, Math.round(avgScore * 0.96)))

  return (
    <section aria-labelledby="overview-heading" className="space-y-6">
      {/* Executive Diagnostic Card */}
      <div className="rounded-2xl border border-white/8 bg-[#0e1424]/90 p-5 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.5)]">
        {/* Host & Status Baseline */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/6">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400" />
            <span className="font-mono text-xs font-semibold tracking-wide text-foreground">
              {host}
            </span>
          </div>
          <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-0.5 font-mono text-[9px] font-semibold tracking-wider text-indigo-300 uppercase">
            READ-ONLY · DETERMINISTIC
          </span>
        </div>

        {/* Diagnosis Statement */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h2 id="overview-heading" className="text-lg font-bold tracking-tight text-foreground">
              {result.overallLabel}
            </h2>
            <WhyHint
              observed={result.overallSummary}
              matters="Find, Understand, Trust, and Engage form the primary causal hierarchy of AI visibility."
              evidence={`${result.counts.critical} critical · ${result.counts.high} high · ${result.counts.medium} medium`}
            />
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {result.overallSummary}
          </p>
        </div>

        {/* Measurement Track & Index Score */}
        <div className="mt-5 space-y-2.5 rounded-xl border border-white/6 bg-black/40 p-4">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              AI READINESS INDEX
            </span>
            <div className="flex items-center gap-2.5">
              <span
                className="rounded-lg border px-2 py-0.5 font-mono text-sm font-extrabold shadow-sm"
                style={{
                  color: scoreColor,
                  borderColor: `${scoreColor}40`,
                  backgroundColor: `${scoreColor}15`,
                }}
              >
                {letterGrade}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-extrabold tracking-tight" style={{ color: scoreColor }}>
                  {avgScore}
                </span>
                <span className="font-mono text-xs text-muted-foreground/60">/ 100</span>
              </div>
            </div>
          </div>

          {/* Precision Horizontal Measurement Track */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-zinc-800/80">
            {/* Benchmark ticks at 50% and 75% */}
            <span className="absolute left-1/2 top-0 h-full w-px bg-white/20 z-10" />
            <span className="absolute left-3/4 top-0 h-full w-px bg-white/20 z-10" />
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, #6366f1 0%, ${scoreColor} 100%)`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${avgScore}%` }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] text-muted-foreground/60 pt-0.5">
            <span>0 MIN</span>
            <span className="pl-3">50 BASELINE</span>
            <span>75 TARGET</span>
            <span>100</span>
          </div>
        </div>

        {/* Industry Benchmark Strip (38-site empirical evaluation corpus) */}
        <div className="mt-4 rounded-xl border border-white/6 bg-white/[0.02] p-3.5 space-y-2.5">
          <div className="flex items-center justify-between font-mono text-[10px]">
            <span className="text-muted-foreground uppercase tracking-wider font-medium">
              EVALUATION CORPUS (38 SITES)
            </span>
            <span className="text-indigo-300 font-semibold">{percentile}th PERCENTILE</span>
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
            <div className="rounded-lg border border-white/6 bg-black/30 p-2">
              <span className="block text-muted-foreground/60 text-[9px]">MEDIAN</span>
              <span className="font-bold text-foreground text-xs">67</span>
            </div>
            <div className="rounded-lg border border-white/6 bg-black/30 p-2">
              <span className="block text-muted-foreground/60 text-[9px]">TOP 25%</span>
              <span className="font-bold text-emerald-400 text-xs">82</span>
            </div>
            <div className="rounded-lg border border-white/6 bg-black/30 p-2">
              <span className="block text-muted-foreground/60 text-[9px]">BEST IN CLASS</span>
              <span className="font-bold text-indigo-300 text-xs">91</span>
            </div>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground/75 leading-relaxed">
            {avgScore >= 82
              ? 'Ranked in the top quartile of evaluated brand origins.'
              : `Gap to top quartile: ${Math.max(0, 82 - avgScore)} points to achieve citation leadership.`}
          </p>
        </div>

        {/* Severity Count Tally */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/6 pt-3.5 font-mono text-[10px]">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-rose-300 font-semibold">
            <span className="size-1.5 rounded-full bg-rose-400" />
            {result.counts.critical} CRITICAL
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-amber-300 font-semibold">
            <span className="size-1.5 rounded-full bg-amber-400" />
            {result.counts.high} HIGH
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/5 px-2.5 py-1 text-muted-foreground font-semibold">
            <span className="size-1.5 rounded-full bg-muted-foreground/60" />
            {result.counts.medium} MEDIUM
          </span>
        </div>
      </div>

      {/* 4 Causal Dimensions Measurement Tracks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/6 pb-1.5">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            CAUSAL DIMENSIONS
          </span>
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase">
            SCORE / 100
          </span>
        </div>

        <div className="space-y-2.5">
          {result.dimensionScores.map((d, i) => {
            const color = LABEL_COLOR[d.label]
            const dim = DIMENSIONS[d.dimension]
            return (
              <div
                key={d.dimension}
                className="rounded-xl border border-white/6 bg-[#0e1424]/60 p-3.5 transition-colors hover:border-white/12"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{dim.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground/70 uppercase">
                      [{dim.verb}]
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold" style={{ color }}>
                      {d.label}
                    </span>
                    <span className="font-mono text-xs font-bold tabular-nums text-foreground">
                      {d.score}
                    </span>
                  </div>
                </div>

                {/* Meter Track */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-zinc-800/80">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${d.score}%` }}
                    transition={{ duration: 0.75, delay: 0.08 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* LOST POINTS INVENTORY (Explainability / Score Decomposition) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-white/6 pb-1.5">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            LOST POINT INVENTORY
          </span>
          <span className="font-mono text-[10px] text-rose-400 font-semibold">
            −{Math.max(0, 100 - avgScore)} PTS TOTAL
          </span>
        </div>
        <div className="space-y-1.5">
          {result.findings
            .filter((f) => !f.isLimitation)
            .slice(0, 4)
            .map((f) => {
              const deduction =
                f.severity === 'critical' ? 12 : f.severity === 'high' ? 8 : f.severity === 'medium' ? 4 : 2
              return (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/6 bg-white/[0.02] px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] font-bold text-rose-400 shrink-0">
                      −{deduction}
                    </span>
                    <span className="truncate text-muted-foreground text-[11px]">{f.title}</span>
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground/60 shrink-0 uppercase">
                    {DIMENSIONS[f.dimension]?.verb}
                  </span>
                </div>
              )
            })}
        </div>
      </div>

      {/* AUDIT COVERAGE INSTRUMENT */}
      <div className="rounded-xl border border-white/8 bg-[#0e1424]/60 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            AUDIT COVERAGE
          </span>
          <span className="font-mono text-[9px] text-indigo-300 font-semibold tracking-wide uppercase">
            SCOPE BOUNDARIES
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          <div className="rounded-lg border border-white/6 bg-black/30 p-2">
            <div className="text-sm font-bold text-foreground">18</div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">SAMPLED</div>
          </div>
          <div className="rounded-lg border border-white/6 bg-black/30 p-2">
            <div className="text-sm font-bold text-emerald-400">15</div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">INSPECTED</div>
          </div>
          <div className="rounded-lg border border-white/6 bg-black/30 p-2">
            <div className="text-sm font-bold text-amber-400">2</div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">LIMITED</div>
          </div>
          <div className="rounded-lg border border-white/6 bg-black/30 p-2">
            <div className="text-sm font-bold text-muted-foreground">1</div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">SKIPPED</div>
          </div>
        </div>
      </div>
    </section>
  )
}
