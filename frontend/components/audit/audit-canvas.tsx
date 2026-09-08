'use client'

import { useMeasure, usePrefersReducedMotion } from '@/hooks/use-measure'
import type { AppPhase, Site, SkillId } from '@/lib/audit/types'
import { AuditTree, type TreeViewMode } from './audit-tree'

export function AuditCanvas({
  site,
  rootLabel,
  radiusScale,
  interactive = true,
  selectedSkillId = null,
  highlightedSkillIds = [],
  onSelectSkill,
  onSelectRoot,
  className,
  phase = 'landing',
  rootArrived = false,
  sites = [],
  focusedId = null,
  onFocusSite,
  guideFocus = null,
  viewMode = 'diagnose',
  inspectorOpen = false,
}: {
  site: Site | null
  rootLabel: string
  radiusScale?: number
  interactive?: boolean
  selectedSkillId?: SkillId | null
  highlightedSkillIds?: SkillId[]
  onSelectSkill?: (id: SkillId) => void
  onSelectRoot?: () => void
  className?: string
  phase?: AppPhase
  rootArrived?: boolean
  sites?: Site[]
  focusedId?: string | null
  onFocusSite?: (id: string) => void
  guideFocus?: 'root' | 'dimensions' | 'skills' | 'findings' | 'causes' | 'actions' | null
  viewMode?: TreeViewMode
  inspectorOpen?: boolean
}) {
  const [ref, { width, height }] = useMeasure<HTMLDivElement>()
  const reduced = usePrefersReducedMotion()

  return (
    <div ref={ref} className={className ?? 'relative h-full w-full'}>
      <AuditTree
        width={width}
        height={height}
        site={site}
        rootLabel={rootLabel}
        radiusScale={radiusScale}
        interactive={interactive}
        selectedSkillId={selectedSkillId}
        highlightedSkillIds={highlightedSkillIds}
        onSelectSkill={onSelectSkill}
        onSelectRoot={onSelectRoot}
        reduced={reduced}
        phase={phase}
        rootArrived={rootArrived}
        showLabels={width >= 640}
        sites={sites}
        focusedId={focusedId}
        onFocusSite={onFocusSite}
        guideFocus={guideFocus}
        viewMode={viewMode}
        inspectorOpen={inspectorOpen}
      />
    </div>
  )
}
