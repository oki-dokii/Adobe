'use client'

import { motion } from 'motion/react'
import type { AuditResult, DimensionScore } from '@/lib/audit/types'
import { DIMENSIONS } from '@/lib/audit/skills'
import { WhyHint } from './why-hint'
import { AudienceBriefings } from './audience-briefings'
import { benchmarkPercentile, deductionForSeverity, overallIndex } from '@/lib/audit/scoring'

const LABEL_COLOR: Record<DimensionScore['label'], string> = {
  strong: 'var(--success)',
  adequate: 'var(--signal)',
  'at-risk': 'var(--warning)',
  weak: 'var(--critical)',
}

export function ScoreOverview({ result, host }: { result: AuditResult; host: string }) {
  const avgScore = result.overallIndex ?? overallIndex(result.dimensionScores)

  const scoreColor =
    avgScore >= 75 ? 'var(--success)' : avgScore >= 50 ? 'var(--signal)' : 'var(--warning)'

  const letterGrade =
    avgScore >= 90 ? 'A' :
    avgScore >= 80 ? 'A-' :
    avgScore >= 75 ? 'B+' :
    avgScore >= 70 ? 'B' :
    avgScore >= 60 ? 'C+' :
    avgScore >= 50 ? 'C' : 'D'

  const percentile = benchmarkPercentile(avgScore)

  return (
    <section aria-labelledby="overview-heading" className="space-y-6">
      {/* Executive Diagnostic Card */}
      <div className="rounded-xl border border-white/8 bg-surface/70 p-5 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Host & Status Baseline */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/6">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-signal" />
            <span className="font-mono text-xs font-semibold tracking-wide text-foreground/90">
              {host}
            </span>
          </div>
          <span className="rounded border border-white/8 bg-white/4 px-2 py-0.5 font-mono text-[9px] font-medium tracking-wider text-muted-foreground uppercase">
            READ-ONLY · EVIDENCE-BACKED
          </span>
        </div>

        {/* Diagnosis Statement */}
        <div className="mt-4 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <h2 id="overview-heading" className="text-lg font-semibold tracking-tight text-foreground">
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
        <div className="mt-5 space-y-2 rounded-lg border border-white/6 bg-black/40 p-3.5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase">
              AI READINESS INDEX
            </span>
            <div className="flex items-baseline gap-2">
              <span
                className="rounded border px-1.5 py-0.2 font-mono text-xs font-bold"
                style={{
                  color: scoreColor,
                  borderColor: `${scoreColor}40`,
                  backgroundColor: `${scoreColor}15`,
                }}
              >
                {letterGrade}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-mono text-xl font-bold tracking-tight" style={{ color: scoreColor }}>
                  {avgScore}
                </span>
                <span className="font-mono text-xs text-muted-foreground/60">/ 100</span>
              </div>
            </div>
          </div>

          {/* Precision Horizontal Measurement Track */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-2">
            {/* Benchmark ticks at 50% and 75% */}
            <span className="absolute left-1/2 top-0 h-full w-px bg-white/15 z-10" />
            <span className="absolute left-3/4 top-0 h-full w-px bg-white/15 z-10" />
            <motion.div
              className="h-full rounded-full"
              style={{ background: scoreColor }}
              initial={{ width: 0 }}
              animate={{ width: `${avgScore}%` }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <div className="flex justify-between font-mono text-[9px] text-muted-foreground/50 pt-0.5">
            <span>0</span>
            <span className="pl-3">50 BASELINE</span>
            <span>75 TARGET</span>
            <span>100</span>
          </div>
        </div>

        {/* Industry Benchmark Strip (38-site empirical evaluation corpus) */}
        <div className="mt-3.5 rounded-lg border border-white/6 bg-white/[0.02] p-3 space-y-2">
          <div className="flex items-center justify-between font-mono text-[9px]">
            <span className="text-muted-foreground/80 uppercase tracking-wider font-semibold">
              REFERENCE BENCHMARK (38-SITE CORPUS)
            </span>
            <span className="text-signal font-semibold">{percentile}th PERCENTILE</span>
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-center">
            <div className="rounded border border-white/6 bg-black/30 p-1.5">
              <span className="block text-muted-foreground/60 text-[9px]">MEDIAN</span>
              <span className="font-semibold text-foreground">67</span>
            </div>
            <div className="rounded border border-white/6 bg-black/30 p-1.5">
              <span className="block text-muted-foreground/60 text-[9px]">TOP 25%</span>
              <span className="font-semibold text-emerald-400">82</span>
            </div>
            <div className="rounded border border-white/6 bg-black/30 p-1.5">
              <span className="block text-muted-foreground/60 text-[9px]">BEST IN CLASS</span>
              <span className="font-semibold text-signal">91</span>
            </div>
          </div>
          <p className="text-[10px] font-mono text-muted-foreground/70 leading-relaxed">
            {avgScore >= 82
              ? 'Ranked in the top quartile of evaluated brand origins.'
              : `Gap to top quartile: ${Math.max(0, 82 - avgScore)} points to achieve citation leadership.`}
          </p>
          <p className="text-[9px] font-mono text-muted-foreground/50 leading-relaxed">
            Percentile is a deterministic interpolation from the displayed 67 median, 82 top-quartile, and 91 best-in-class anchors; it is not a live rank.
          </p>
        </div>

        {/* Severity Count Tally */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/6 pt-3 font-mono text-[10px]">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-critical/30 bg-critical/10 px-2.5 py-1 text-critical font-medium">
            <span className="size-1.5 rounded-full bg-critical" />
            {result.counts.critical} CRITICAL
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-warning/30 bg-warning/10 px-2.5 py-1 text-warning font-medium">
            <span className="size-1.5 rounded-full bg-warning" />
            {result.counts.high} HIGH
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/8 bg-white/4 px-2.5 py-1 text-muted-foreground font-medium">
            <span className="size-1.5 rounded-full bg-muted-foreground" />
            {result.counts.medium} MEDIUM
          </span>
        </div>
      </div>

      {/* Stakeholder Briefings (Executive, CMO, SEO/GEO, Engineering, Revenue Risk) */}
      <AudienceBriefings
        result={result}
        host={host}
        avgScore={avgScore}
        letterGrade={letterGrade}
        percentile={percentile}
      />

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
                className="rounded-lg border border-white/6 bg-surface/50 p-3 transition-colors hover:border-white/12"
              >
                <div className="mb-1.5 flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{dim.label}</span>
                    <span className="font-mono text-[10px] text-muted-foreground/70 uppercase">
                      [{dim.verb}]
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-medium" style={{ color }}>
                      {d.label}
                    </span>
                    <span className="font-mono text-xs font-semibold tabular-nums text-foreground">
                      {d.score}
                    </span>
                  </div>
                </div>

                {/* Meter Track */}
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
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
          <span className="font-mono text-[10px] text-critical/90 font-medium">
            −{Math.max(0, 100 - avgScore)} PTS TOTAL
          </span>
        </div>
        <div className="space-y-1.5">
          {result.findings
            .filter((f) => !f.isLimitation)
            .slice(0, 4)
            .map((f) => {
              const deduction = deductionForSeverity(f.severity)
              return (
                <div
                  key={f.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-white/6 bg-surface/40 px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[11px] font-bold text-critical/90 shrink-0">
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
      <div className="rounded-xl border border-white/8 bg-surface/50 p-3.5 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
            AUDIT COVERAGE & TELEMETRY
          </span>
          <span className="font-mono text-[9px] text-signal font-medium tracking-wide uppercase">
            {result.timing?.totalMs ? `${(result.timing.totalMs / 1000).toFixed(1)}s EXECUTION` : 'REAL RUN'}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center font-mono">
          <div className="rounded-lg border border-white/6 bg-surface-2/40 p-2">
            <div className="text-sm font-bold text-foreground">
              {result.coverage?.pagesFetched ?? Math.max(1, result.findings.filter(f => !f.isLimitation).length > 0 ? 1 : 0)}
            </div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">SAMPLED</div>
          </div>
          <div className="rounded-lg border border-white/6 bg-surface-2/40 p-2">
            <div className="text-sm font-bold text-emerald-400">
              {result.coverage?.pagesRendered ?? result.coverage?.pagesFetched ?? 1}
            </div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">RENDERED</div>
          </div>
          <div className="rounded-lg border border-white/6 bg-surface-2/40 p-2">
            <div className="text-sm font-bold text-amber-400">
              {result.coverage?.limitedCount ?? result.findings.filter((f) => f.isLimitation).length}
            </div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">LIMITED</div>
          </div>
          <div className="rounded-lg border border-white/6 bg-surface-2/40 p-2">
            <div className="text-sm font-bold text-muted-foreground">
              {result.coverage?.skippedCount ?? 0}
            </div>
            <div className="text-[9px] text-muted-foreground uppercase mt-0.5">SKIPPED</div>
          </div>
        </div>

        {(result.coverage?.httpRequests || result.coverage?.robotsStatus || result.coverage?.stoppedReason) && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/6 pt-2 font-mono text-[9px] text-muted-foreground/70">
            {result.coverage?.httpRequests ? (
              <span>HTTP REQUESTS: <strong className="text-foreground/80">{result.coverage.httpRequests}</strong></span>
            ) : null}
            {result.coverage?.robotsStatus ? (
              <span>ROBOTS.TXT: <strong className="text-foreground/80 uppercase">{result.coverage.robotsStatus}</strong></span>
            ) : null}
            {result.coverage?.stoppedReason ? (
              <span>STOP: <strong className="text-foreground/80 uppercase">{result.coverage.stoppedReason}</strong></span>
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}
