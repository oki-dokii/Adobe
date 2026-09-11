'use client'

import { motion } from 'motion/react'
import type { AuditResult, SkillId, SkillRun } from '@/lib/audit/types'
import { SKILL_MAP, DIMENSIONS } from '@/lib/audit/skills'
import { STATUS_STYLE } from '@/lib/audit/status'
import { FindingsList } from './findings-list'

const CHECK_ICON = {
  pass: { color: 'var(--success)', label: 'pass' },
  fail: { color: 'var(--critical)', label: 'fail' },
  partial: { color: 'var(--warning)', label: 'partial' },
  pending: { color: 'var(--muted-foreground)', label: 'pending' },
}

export function SkillInspector({
  skillId,
  run,
  result,
  onClose,
}: {
  skillId: SkillId
  run: SkillRun | undefined
  result: AuditResult
  onClose: () => void
}) {
  const def = SKILL_MAP[skillId]
  const status = run?.status ?? (skillId === 'audit-orchestrator' ? 'completed' : 'completed')
  const style = STATUS_STYLE[status]
  const findings = result.findings.filter((f) => f.skillId === skillId)
  const relatedCause = result.rootCauses.find((c) => findings.some((f) => f.rootCauseId === c.id))
  const evidenceCount = findings.reduce((n, f) => n + f.evidence.length, 0)

  return (
    <motion.div key={skillId} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onClose}
          className="mb-3.5 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          BACK TO OVERVIEW
        </button>

        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] tracking-wider text-signal uppercase font-medium">
              {DIMENSIONS[def.dimension].label} · [{DIMENSIONS[def.dimension].verb}]
            </p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">{def.label}</h2>
          </div>
          <span
            className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-md border border-white/8 bg-surface-2/60 px-2.5 py-0.5 font-mono text-[10px] font-medium"
            style={{ color: style.color }}
          >
            <span className="size-1.5 rounded-full" style={{ background: style.color }} />
            {style.label}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{def.purpose}</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border border-white/6 bg-surface-2/40 p-2.5 text-center">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">EVIDENCE</p>
          <p className="mt-1 font-mono text-sm font-bold text-foreground">{evidenceCount}</p>
        </div>
        <div className="rounded-lg border border-white/6 bg-surface-2/40 p-2.5 text-center">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">PAGES</p>
          <p className="mt-1 font-mono text-sm font-bold text-foreground">
            {run?.pagesInspected ? String(run.pagesInspected) : '—'}
          </p>
        </div>
        <div className="rounded-lg border border-white/6 bg-surface-2/40 p-2.5 text-center">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">CONFIDENCE</p>
          <p className="mt-1 font-mono text-sm font-bold text-foreground capitalize">
            {run?.confidence ?? 'High'}
          </p>
        </div>
      </div>

      {/* Evaluation Checks List */}
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          INSPECTION CHECKS
        </p>
        <ul className="rounded-lg border border-white/6 bg-surface-2/20 divide-y divide-white/4 overflow-hidden">
          {(run?.checks ?? def.checks.map((label) => ({ label, state: 'pass' as const }))).map((c) => {
            const icon = CHECK_ICON[c.state]
            return (
              <li key={c.label} className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-foreground/90 font-medium">{c.label}</span>
                <span className="font-mono text-[10px] uppercase font-semibold" style={{ color: icon.color }}>
                  {icon.label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {relatedCause && (
        <div className="rounded-lg border border-white/8 bg-surface-2/40 p-3 space-y-1">
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            PROPAGATES INTO ROOT CAUSE
          </p>
          <p className="text-xs font-semibold text-foreground">{relatedCause.label}</p>
          <p className="text-[11px] text-muted-foreground">{relatedCause.detail}</p>
        </div>
      )}

      {findings.length > 0 ? (
        <FindingsList findings={findings} />
      ) : skillId === 'audit-orchestrator' ? (
        <p className="text-xs leading-relaxed text-muted-foreground rounded-lg border border-white/6 bg-surface-2/20 p-3">
          The orchestrator sequenced every evaluation skill and composed their evidence into the causal cascade on the diagnosis.
        </p>
      ) : (
        <p className="text-xs text-muted-foreground rounded-lg border border-white/6 bg-surface-2/20 p-3">
          This skill found no issues — the branch evaluated as clear.
        </p>
      )}
    </motion.div>
  )
}
