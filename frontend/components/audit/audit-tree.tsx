'use client'

import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import type { AppPhase, Site, SkillId, SkillStatus } from '@/lib/audit/types'
import { DIMENSIONS, RUN_ORDER, SKILL_MAP } from '@/lib/audit/skills'
import { buildInitialSkills } from '@/lib/audit/mock-data'
import { computeTreeLayout, ROOT_Y } from '@/lib/audit/layout'
import { STATUS_STYLE, isActive, isResolved } from '@/lib/audit/status'
import { TreeBranch } from './tree-branch'
import { TreeNode } from './tree-node'
import { SkillTooltip } from './skill-tooltip'
import { SkillMark } from './skill-mark'

export type TreeViewMode = 'diagnose' | 'chain' | 'findings'

export function AuditTree({
  width,
  height,
  site,
  rootLabel,
  radiusScale = 1,
  interactive = true,
  selectedSkillId = null,
  highlightedSkillIds = [],
  onSelectSkill,
  onSelectRoot,
  reduced = false,
  phase = 'landing',
  rootArrived = false,
  showLabels = true,
  sites = [],
  focusedId = null,
  onFocusSite,
  guideFocus = null,
  viewMode = 'diagnose',
  inspectorOpen = false,
}: {
  width: number
  height: number
  site: Site | null
  rootLabel: string
  radiusScale?: number
  interactive?: boolean
  selectedSkillId?: SkillId | null
  highlightedSkillIds?: SkillId[]
  onSelectSkill?: (id: SkillId) => void
  onSelectRoot?: () => void
  reduced?: boolean
  phase?: AppPhase
  rootArrived?: boolean
  showLabels?: boolean
  sites?: Site[]
  focusedId?: string | null
  onFocusSite?: (id: string) => void
  guideFocus?: 'root' | 'dimensions' | 'skills' | 'findings' | 'causes' | 'actions' | null
  viewMode?: TreeViewMode
  inspectorOpen?: boolean
}) {
  const [hovered, setHovered] = useState<SkillId | 'root' | null>(null)

  const skills = site?.skills ?? buildInitialSkills()
  const sitePhase = site?.phase ?? 'dormant'
  const compact = width < 720
  const cx = width / 2
  const cy = height * ROOT_Y
  const radius = Math.max(96, Math.min(width, height) * (compact ? 0.44 : 0.54) * radiusScale)

  const layout = useMemo(() => computeTreeLayout(RUN_ORDER, { cx, cy, radius }), [cx, cy, radius])

  if (width === 0 || height === 0) return null

  const statusOf = (id: SkillId): SkillStatus => skills.find((s) => s.id === id)?.status ?? 'dormant'
  const progressOf = (id: SkillId): number => skills.find((s) => s.id === id)?.progress ?? 0
  const findingOf = (id: SkillId): boolean => !!skills.find((s) => s.id === id)?.findingEmitted

  const rootStatus: SkillStatus =
    sitePhase === 'completed' || sitePhase === 'partial'
      ? resultRootStatus(site)
      : sitePhase === 'running' || sitePhase === 'validating' || sitePhase === 'consolidating'
        ? 'running'
        : sitePhase === 'ingesting' && rootArrived
          ? 'initializing'
          : 'dormant'

  const awakened = sitePhase !== 'dormant' && sitePhase !== 'ingesting'
  const showRoot = phase !== 'landing' && (rootArrived || awakened)
  const labelOf = showRoot ? rootLabel : ''

  const findingSkills = new Set(
    (site?.result?.findings ?? []).filter((f) => !f.isLimitation).map((f) => f.skillId),
  )
  const causeSkills = new Set(
    (site?.result?.rootCauses ?? []).flatMap((c) =>
      c.findingIds
        .map((id) => site?.result?.findings.find((f) => f.id === id)?.skillId)
        .filter((id): id is SkillId => Boolean(id)),
    ),
  )

  const highlightSet = new Set(highlightedSkillIds)
  if (highlightSet.size === 0 && phase === 'results') {
    if (viewMode === 'findings') findingSkills.forEach((id) => highlightSet.add(id))
    if (viewMode === 'chain') causeSkills.forEach((id) => highlightSet.add(id))
  }
  if (guideFocus === 'findings' || guideFocus === 'actions' || guideFocus === 'causes') {
    for (const s of skills) {
      if (s.status === 'warning' || s.status === 'critical' || s.status === 'partial') highlightSet.add(s.id)
    }
  }
  const hasHighlight =
    highlightSet.size > 0 ||
    selectedSkillId != null ||
    guideFocus === 'root' ||
    guideFocus === 'dimensions' ||
    (phase === 'results' && viewMode !== 'diagnose')

  const hoveredNode = hovered && hovered !== 'root' ? layout.nodes.find((n) => n.id === hovered) : null
  const hoveredSkill = hovered && hovered !== 'root' ? skills.find((s) => s.id === hovered) ?? null : null

  const rootProgress =
    skills.length === 0
      ? 0
      : skills.reduce((n, s) => n + (isResolved(s.status) ? 1 : isActive(s.status) ? s.progress : 0), 0) /
        skills.length

  const limbStatus = (dimension: string): SkillStatus => {
    const ids = layout.nodes.filter((n) => n.limb === dimension).map((n) => n.id)
    const sts = ids.map(statusOf)
    if (sts.some((s) => s === 'critical')) return 'critical'
    if (sts.some((s) => s === 'running' || s === 'initializing')) return 'running'
    if (sts.some((s) => s === 'warning' || s === 'partial')) return 'warning'
    if (sts.every((s) => isResolved(s))) return 'completed'
    if (sts.some((s) => s === 'queued')) return 'queued'
    return 'dormant'
  }

  const cameraTargetId =
    selectedSkillId && selectedSkillId !== 'audit-orchestrator'
      ? selectedSkillId
      : highlightSet.size === 1
        ? [...highlightSet][0]
        : null
  const cameraNode = cameraTargetId ? layout.nodes.find((n) => n.id === cameraTargetId) : null

  let camScale = 0.84
  let camX = 0
  let camY = 0
  if (phase === 'ingesting') camScale = 0.96
  else if (phase === 'auditing') camScale = 1.08
  else if (phase === 'results') {
    camScale = viewMode === 'diagnose' ? 0.94 : viewMode === 'chain' ? 1.04 : 1.0
  }
  if (cameraNode) {
    camScale = Math.min(1.22, Math.max(camScale, 1.12))
    camX = (cx - cameraNode.x) * 0.28
    camY = (cy - cameraNode.y) * 0.28
  } else if (selectedSkillId === 'audit-orchestrator') {
    camScale = 1.14
  }
  if (reduced) {
    camScale = 1
    camX = 0
    camY = 0
  }

  const horizonR = radius * (0.22 + rootProgress * 0.78)
  const selectedNode = selectedSkillId
    ? selectedSkillId === 'audit-orchestrator'
      ? { x: cx, y: cy }
      : layout.nodes.find((n) => n.id === selectedSkillId)
    : null

  const others = sites.filter((s) => s.id !== focusedId)
  const rootStatusLabel =
    phase === 'landing'
      ? 'waiting'
      : sitePhase === 'ingesting'
        ? 'receiving'
        : isActive(rootStatus)
          ? 'inspecting'
          : sitePhase === 'completed' || sitePhase === 'partial'
            ? 'diagnosed'
            : 'origin'

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ scale: camScale, x: camX, y: camY }}
        transition={{ duration: reduced ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="absolute inset-0" aria-hidden>
          {(awakened || phase === 'auditing' || phase === 'results') && (
            <motion.ellipse
              cx={cx}
              cy={cy}
              rx={horizonR * 1.18}
              ry={horizonR * 0.88}
              fill="none"
              stroke="var(--line)"
              strokeWidth={0.7}
              strokeDasharray="3 11"
              initial={false}
              animate={{ rx: horizonR * 1.18, ry: horizonR * 0.88, opacity: 0.28 }}
              transition={{ duration: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          )}

          {layout.limbs.map((limb, i) => {
            const st = limbStatus(limb.dimension)
            const related = layout.nodes.filter((n) => n.limb === limb.dimension).map((n) => n.id)
            const dimmed =
              hasHighlight &&
              !related.some((id) => id === selectedSkillId || highlightSet.has(id)) &&
              selectedSkillId !== 'audit-orchestrator'
            return (
              <TreeBranch
                key={limb.dimension}
                path={limb.path}
                status={st}
                grown
                reduced={reduced}
                index={i}
                dimmed={dimmed}
                emphasized={
                  related.some((id) => id === selectedSkillId || highlightSet.has(id)) ||
                  guideFocus === 'dimensions'
                }
                weight="trunk"
              />
            )
          })}

          {layout.branches.map((branch, i) => {
            const st = statusOf(branch.id)
            const dimmed = hasHighlight && selectedSkillId !== branch.id && !highlightSet.has(branch.id)
            const grown = phase === 'landing' || (awakened && st !== 'dormant')
            return (
              <TreeBranch
                key={branch.id}
                path={branch.path}
                status={st}
                grown={grown}
                reduced={reduced}
                index={i + 4}
                dimmed={dimmed}
                emphasized={selectedSkillId === branch.id || highlightSet.has(branch.id)}
                evidenceFlow={findingOf(branch.id) && st === 'running'}
                weight="twig"
                flowPath={branch.flowPath}
              />
            )
          })}

          {phase !== 'landing' &&
            layout.nodes.map((node) => {
            const st = statusOf(node.id)
            const visible = awakened || st !== 'dormant'
            if (!visible) return null
            const color = STATUS_STYLE[st].color
            const dimmed = hasHighlight && selectedSkillId !== node.id && !highlightSet.has(node.id)
            return (
              <SkillMark
                key={`mark-${node.id}`}
                id={node.id}
                x={node.x}
                y={node.y}
                color={st === 'dormant' ? 'var(--muted-foreground)' : color}
                opacity={dimmed ? 0.12 : isActive(st) || selectedSkillId === node.id ? 0.7 : 0.32}
              />
            )
          })}

          {selectedNode && inspectorOpen && phase === 'results' && (
            <path
              d={`M ${selectedNode.x} ${selectedNode.y} L ${width - 8} ${selectedNode.y}`}
              fill="none"
              stroke="var(--signal)"
              strokeWidth={0.7}
              opacity={0.35}
              strokeDasharray="2 6"
            />
          )}

          <motion.circle
            cx={cx}
            cy={cy}
            r={phase === 'landing' ? 34 : 48}
            fill="transparent"
            stroke="var(--signal)"
            strokeWidth={phase === 'landing' ? 1.05 : 1.2}
            opacity={phase === 'landing' ? 0.34 : showRoot ? 0.3 : 0}
            animate={
              reduced
                ? { opacity: phase === 'landing' ? 0.34 : 0.28 }
                : isActive(rootStatus)
                  ? { opacity: [0.22, 0.42, 0.22], r: phase === 'landing' ? 34 : [46, 50, 46] }
                  : { opacity: phase === 'landing' ? 0.34 : showRoot ? 0.3 : 0 }
            }
            transition={{ duration: 4.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          />
          {phase === 'landing' && (
            <>
              <circle cx={cx} cy={cy} r={14} fill="none" stroke="var(--foreground)" strokeWidth={0.6} opacity={0.18} />
              <circle cx={cx} cy={cy} r={5.5} fill="var(--signal)" opacity={0.55} />
            </>
          )}
        </svg>

        <div className="absolute inset-0">
          {showRoot && (
            <>
              <TreeNode
                x={cx}
                y={cy}
                status={rootStatus}
                label={labelOf || 'Origin'}
                size={compact ? 32 : 42}
                visible
                reduced={reduced}
                interactive={Boolean(onSelectRoot)}
                progress={rootProgress}
                selected={selectedSkillId === 'audit-orchestrator'}
                variant="root"
                onClick={onSelectRoot}
                onHover={() => setHovered('root')}
                onLeave={() => setHovered((h) => (h === 'root' ? null : h))}
                onFocus={() => setHovered('root')}
              />
              {labelOf && (
                <div
                  className="pointer-events-none absolute -translate-x-1/2 text-center"
                  style={{ left: cx, top: cy + 32 }}
                >
                  <motion.p className="text-[13px] tracking-tight text-foreground">{labelOf}</motion.p>
                  <p className="mt-0.5 font-mono text-[10px] tracking-wide text-muted-foreground">
                    {awakened && sitePhase !== 'completed' && sitePhase !== 'partial'
                      ? `${Math.round(rootProgress * 100)}% · ${rootStatusLabel}`
                      : rootStatusLabel}
                  </p>
                </div>
              )}
            </>
          )}

          {layout.limbs.map((limb) => {
            const st = limbStatus(limb.dimension)
            const emphasize = guideFocus === 'dimensions' || guideFocus === 'root'
            return (
              <div
                key={`limb-${limb.dimension}`}
                className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 text-[11px] tracking-wide text-muted-foreground"
                style={{
                  left: limb.joint.x,
                  top: limb.joint.y,
                  opacity: emphasize ? 1 : phase === 'landing' ? 0.45 : 0.85,
                  color: st !== 'dormant' && st !== 'queued' ? STATUS_STYLE[st].color : undefined,
                }}
              >
                {DIMENSIONS[limb.dimension].verb}
              </div>
            )
          })}

          {layout.nodes.map((node) => {
            const st = statusOf(node.id)
            const visible = phase === 'landing' || awakened || st !== 'dormant'
            const dimmed = hasHighlight && selectedSkillId !== node.id && !highlightSet.has(node.id)
            const outward = rad(node.angle)
            const lx = node.x + Math.cos(outward) * (compact ? 16 : 22)
            const ly = node.y + Math.sin(outward) * (compact ? 16 : 22)
            const align: 'left' | 'right' | 'center' =
              Math.cos(outward) > 0.35 ? 'left' : Math.cos(outward) < -0.35 ? 'right' : 'center'
            const showSkillLabel =
              showLabels &&
              visible &&
              phase !== 'landing' &&
              (hovered === node.id ||
                selectedSkillId === node.id ||
                highlightSet.has(node.id) ||
                isActive(st) ||
                guideFocus === 'skills')

            return (
              <div key={node.id}>
                <TreeNode
                  x={node.x}
                  y={node.y}
                  status={st}
                  label={SKILL_MAP[node.id].label}
                  size={compact ? 9 : node.depth === 'near' ? 12 : 10}
                  visible={visible}
                  dimmed={dimmed}
                  selected={selectedSkillId === node.id}
                  reduced={reduced}
                  progress={progressOf(node.id)}
                  interactive={interactive && awakened}
                  onHover={() => setHovered(node.id)}
                  onFocus={() => setHovered(node.id)}
                  onLeave={() => setHovered((h) => (h === node.id ? null : h))}
                  onClick={() => onSelectSkill?.(node.id)}
                />
                {showSkillLabel && (
                  <div
                    className="pointer-events-none absolute text-[10px] leading-tight text-muted-foreground"
                    style={{
                      left: lx,
                      top: ly,
                      transform:
                        align === 'left'
                          ? 'translate(0, -50%)'
                          : align === 'right'
                            ? 'translate(-100%, -50%)'
                            : 'translate(-50%, 0)',
                      opacity: dimmed ? 0.3 : 0.85,
                    }}
                  >
                    {SKILL_MAP[node.id].label}
                  </div>
                )}
              </div>
            )
          })}

          {interactive && hoveredNode && hoveredSkill && (
            <SkillTooltip skill={hoveredSkill} x={hoveredNode.x} y={hoveredNode.y} containerWidth={width} />
          )}
          {hovered === 'root' && showRoot && (
            <SkillTooltip
              skill={{
                id: 'audit-orchestrator',
                status: rootStatus,
                progress: rootProgress,
                pagesInspected: skills.reduce((n, s) => n + s.pagesInspected, 0),
                checks: SKILL_MAP['audit-orchestrator'].checks.map((label) => ({
                  label,
                  state: 'pending' as const,
                })),
              }}
              x={cx}
              y={cy}
              containerWidth={width}
            />
          )}

          {others.map((s, i) => {
            const side = i % 2 === 0 ? -1 : 1
            const ox = cx + side * Math.min(width * 0.38, 280)
            const oy = cy + (i > 1 ? 70 : -20)
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onFocusSite?.(s.id)}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-center outline-none focus-visible:ring-2 focus-visible:ring-signal"
                style={{ left: ox, top: oy, opacity: 0.42 }}
              >
                <span
                  className="mx-auto block rounded-full"
                  style={{
                    width: 14,
                    height: 14,
                    border: '1px solid var(--line)',
                    background: 'var(--surface-2)',
                  }}
                />
                <span className="mt-1.5 block font-mono text-[10px] text-muted-foreground">
                  {s.host.replace(/^www\./, '').split('.')[0]}
                </span>
              </button>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}

function rad(deg: number) {
  return (deg * Math.PI) / 180
}

function resultRootStatus(site: Site | null): SkillStatus {
  if (!site?.result) return 'completed'
  const { counts } = site.result
  if (counts.critical > 0) return 'critical'
  if (counts.high > 0 || counts.medium > 0) return 'warning'
  return 'completed'
}
