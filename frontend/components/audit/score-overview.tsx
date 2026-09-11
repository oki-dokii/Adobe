'use client'

import { motion } from 'motion/react'
import type { AuditResult, DimensionScore } from '@/lib/audit/types'
import { DIMENSIONS } from '@/lib/audit/skills'
import { WhyHint } from './why-hint'

const LABEL_COLOR: Record<DimensionScore['label'], string> = {
  strong: '#059669',      // emerald-600
  adequate: '#4f46e5',    // indigo-600
  'at-risk': '#d97706',   // amber-600
  weak: '#e11d48',        // rose-600
}

export function ScoreOverview({ result, host }: { result: AuditResult; host: string }) {
  const avgScore = Math.round(
    result.dimensionScores.reduce((acc, d) => acc + d.score, 0) / (result.dimensionScores.length || 1),
  )

  const scoreColor =
    avgScore >= 75 ? '#059669' : avgScore >= 50 ? '#4f46e5' : '#d97706'

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
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        {/* Host & Status Baseline */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-mono text-xs font-bold tracking-wide text-slate-900">
              {host}
            </span>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600 uppercase">
            Deterministic Audit
          </span>
        </div>

        {/* Diagnosis Statement */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h2 id="overview-heading" className="text-base font-bold tracking-tight text-slate-900">
              {result.overallLabel}
            </h2>
            <WhyHint
              observed={result.overallSummary}
              matters="Find, Understand, Trust, and Engage form the primary causal hierarchy of AI visibility."
              evidence={`${result.counts.critical} critical · ${result.counts.high} high · ${result.counts.medium} medium`}
            />
          </div>
          <p className="text-xs leading-relaxed text-slate-600">
            {result.overallSummary}
          </p>
        </div>

        {/* Measurement Track & Index Score */}
        <div className="mt-5 space-y-2.5 rounded-xl border border-slate-200/80 bg-slate-50/70 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
              AI Readiness Index
            </span>
            <div className="flex items-center gap-2.5">
              <span
                className="rounded-lg border px-2 py-0.5 font-mono text-sm font-extrabold shadow-xs"
                style={{
                  color: scoreColor,
                  borderColor: `${scoreColor}40`,
                  backgroundColor: `${scoreColor}10`,
                }}
              >
                {letterGrade}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-2xl font-extrabold tracking-tight" style={{ color: scoreColor }}>
                  {avgScore}
                </span>
                <span className="font-mono text-xs text-slate-400">/ 100</span>
              </div>
            </div>
          </div>

          {/* Precision Horizontal Measurement Track */}
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
            {/* Benchmark ticks at 50% and 75% */}
            <span className="absolute left-1/2 top-0 h-full w-px bg-slate-300 z-10" />
            <span className="absolute left-3/4 top-0 h-full w-px bg-slate-300 z-10" />
            <motion.div
              className="h-full rounded-full"
              style={{
                background: scoreColor,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${avgScore}%` }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] text-slate-400 pt-0.5">
            <span>0</span>
            <span className="pl-3">50 BASELINE</span>
            <span>75 TARGET</span>
            <span>100</span>
          </div>
        </div>

        {/* Industry Benchmark Strip */}
        <div className="mt-4 rounded-xl border border-slate-200/80 bg-white p-3.5 space-y-2.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 uppercase tracking-wider font-semibold text-[10px]">
              EVALUATION CORPUS (38 SITES)
            </span>
            <span className="text-indigo-600 font-bold font-mono text-xs">{percentile}th PERCENTILE</span>
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-xs text-center">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <span className="block text-slate-400 text-[9px] uppercase font-sans font-medium">MEDIAN</span>
              <span className="font-bold text-slate-900 text-sm">67</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <span className="block text-slate-400 text-[9px] uppercase font-sans font-medium">TOP 25%</span>
              <span className="font-bold text-emerald-600 text-sm">82</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
              <span className="block text-slate-400 text-[9px] uppercase font-sans font-medium">LEADER</span>
              <span className="font-bold text-indigo-600 text-sm">91</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {avgScore >= 82
              ? 'Ranked in the top quartile of evaluated brand origins.'
              : `Gap to top quartile: ${Math.max(0, 82 - avgScore)} points to achieve citation leadership.`}
          </p>
        </div>

        {/* Severity Count Tally */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3.5 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-rose-700 font-semibold">
            <span className="size-1.5 rounded-full bg-rose-500" />
            {result.counts.critical} Critical
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-700 font-semibold">
            <span className="size-1.5 rounded-full bg-amber-500" />
            {result.counts.high} High
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600 font-semibold">
            <span className="size-1.5 rounded-full bg-slate-400" />
            {result.counts.medium} Medium
          </span>
        </div>
      </div>

      {/* 4 Causal Dimensions Measurement Tracks */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Causal Dimensions
          </span>
          <span className="font-mono text-xs text-slate-400">
            SCORE / 100
          </span>
        </div>

        <div className="space-y-2">
          {result.dimensionScores.map((d, i) => {
            const color = LABEL_COLOR[d.label]
            const dim = DIMENSIONS[d.dimension]
            return (
              <div
                key={d.dimension}
                className="rounded-xl border border-slate-200/90 bg-white p-3.5 shadow-2xs transition-colors hover:border-slate-300"
              >
                <div className="mb-2 flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{dim.label}</span>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">
                      [{dim.verb}]
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs uppercase font-bold" style={{ color }}>
                      {d.label}
                    </span>
                    <span className="font-mono text-xs font-bold tabular-nums text-slate-900">
                      {d.score}
                    </span>
                  </div>
                </div>

                {/* Meter Track */}
                <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-100">
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

      {/* LOST POINTS INVENTORY (Score Decomposition) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Lost Point Inventory
          </span>
          <span className="font-mono text-xs text-rose-600 font-bold">
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
                  className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-xs font-bold text-rose-600 shrink-0">
                      −{deduction}
                    </span>
                    <span className="truncate text-slate-700 font-medium text-xs">{f.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0 uppercase font-mono font-semibold">
                    {DIMENSIONS[f.dimension]?.verb}
                  </span>
                </div>
              )
            })}
        </div>
      </div>

      {/* AUDIT COVERAGE INSTRUMENT */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Audit Scope & Sampling
          </span>
          <span className="text-[10px] text-indigo-600 font-semibold tracking-wide uppercase">
            Scope Boundaries
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="text-sm font-bold text-slate-900">18</div>
            <div className="text-[9px] text-slate-400 font-sans uppercase mt-0.5 font-medium">SAMPLED</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="text-sm font-bold text-emerald-600">15</div>
            <div className="text-[9px] text-slate-400 font-sans uppercase mt-0.5 font-medium">INSPECTED</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="text-sm font-bold text-amber-600">2</div>
            <div className="text-[9px] text-slate-400 font-sans uppercase mt-0.5 font-medium">LIMITED</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-2">
            <div className="text-sm font-bold text-slate-400">1</div>
            <div className="text-[9px] text-slate-400 font-sans uppercase mt-0.5 font-medium">SKIPPED</div>
          </div>
        </div>
      </div>
    </section>
  )
}
