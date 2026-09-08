'use client'

import { isResolved } from '@/lib/audit/status'
import type { Site } from '@/lib/audit/types'
import { SKILL_MAP } from '@/lib/audit/skills'

export function RunningView({
  focusedSite,
}: {
  sites: Site[]
  focusedSite: Site
  focusedId: string
  onFocus: (id: string) => void
}) {
  const active = focusedSite.skills.find((s) => s.status === 'running')
  const doneCount = focusedSite.skills.filter((s) => isResolved(s.status)).length
  const phaseLabel =
    focusedSite.phase === 'validating'
      ? 'Validating origin'
      : focusedSite.phase === 'consolidating'
        ? 'Composing diagnosis'
        : active
          ? SKILL_MAP[active.id].label
          : 'Reading the site'

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute inset-x-0 bottom-8 text-center">
        <p className="text-[13px] text-muted-foreground">{phaseLabel}</p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground/70">
          {doneCount} / {focusedSite.skills.length}
        </p>
      </div>
    </div>
  )
}
