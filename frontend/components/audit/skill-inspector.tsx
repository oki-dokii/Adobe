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
  pending: { color: 'var(--muted-foreground)', label: 'n/a' },
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
    <motion.div key={skillId} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onClose}
          className="mb-4 inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          diagnosis
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] tracking-wider text-signal">{DIMENSIONS[def.dimension].label}</p>
            <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">{def.label}</h2>
          </div>
          <span
            className="mt-1 flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px]"
            style={{ borderColor: `color-mix(in oklch, ${style.color} 40%, transparent)`, color: style.color }}
          >
            {style.label}
          </span>
        </div>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">{def.purpose}</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Evidence" value={String(evidenceCount)} />
        <Stat label="Pages" value={run?.pagesInspected ? String(run.pagesInspected) : '—'} />
        <Stat label="Confidence" value={run?.confidence ?? '—'} />
      </div>

      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Checks</p>
        <ul className="space-y-1.5">
          {(run?.checks ?? def.checks.map((label) => ({ label, state: 'pass' as const }))).map((c) => {
            const icon = CHECK_ICON[c.state]
            return (
              <li key={c.label} className="flex items-center justify-between border-b border-line py-2">
                <span className="text-[13px] text-foreground/85">{c.label}</span>
                <span className="font-mono text-[10px] uppercase" style={{ color: icon.color }}>
                  {icon.label}
                </span>
              </li>
            )
          })}
        </ul>
      </div>

      {relatedCause && (
        <div className="rounded-lg border border-border px-3 py-2.5">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Related root cause</p>
          <p className="mt-1 text-sm text-foreground">{relatedCause.label}</p>
        </div>
      )}

      {findings.length > 0 ? (
        <FindingsList findings={findings} />
      ) : skillId === 'audit-orchestrator' ? (
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          The orchestrator sequenced every skill and reconciled their evidence into the causal chain on the diagnosis.
        </p>
      ) : (
        <p className="text-[13px] text-muted-foreground">This skill found no issues — the branch is clear.</p>
      )}
    </motion.div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-mono text-base capitalize text-foreground">{value}</p>
    </div>
  )
}
