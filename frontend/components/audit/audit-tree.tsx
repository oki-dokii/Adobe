'use client'

import { useMemo, useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { AppPhase, Site, SkillId, SkillStatus } from '@/lib/audit/types'
import { DIMENSIONS, RUN_ORDER, SKILL_MAP } from '@/lib/audit/skills'
import { buildInitialSkills } from '@/lib/audit/mock-data'
import { computeTreeLayout, computeAmbientRoots, ROOT_Y, type MicroNodeLayout } from '@/lib/audit/layout'
import { isActive, isResolved, STATUS_STYLE } from '@/lib/audit/status'
import { cn } from '@/lib/utils'
import { TreeBranch } from './tree-branch'
import { TreeNode, type RootHeartbeatState } from './tree-node'
import { SkillTooltip } from './skill-tooltip'
import { DataPulse } from './data-pulse'

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
  highlightPulseToken,
  highlightSource = null,
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
  highlightPulseToken?: string
  highlightSource?: 'span' | 'cause' | 'finding' | 'guide' | 'skill' | null
}) {
  const [hovered, setHovered] = useState<SkillId | 'root' | null>(null)
  const [hoveredMicro, setHoveredMicro] = useState<MicroNodeLayout | null>(null)

  const skills = site?.skills ?? buildInitialSkills()
  const sitePhase = site?.phase ?? 'dormant'
  const compact = width < 720
  const cx = width / 2
  const cy = height * ROOT_Y

  // Sizable spatial footprint extending naturally toward viewport bounds
  const radius = Math.max(150, Math.min(width * (compact ? 0.39 : 0.43), height * (compact ? 0.41 : 0.45)) * radiusScale)

  const layout = useMemo(() => computeTreeLayout(RUN_ORDER, { cx, cy, radius }), [cx, cy, radius])
  const ambientRoots = useMemo(() => computeAmbientRoots(cx, cy, radius * 1.34, 12, 19), [cx, cy, radius])

  // Sparse, subtle environmental telemetry traces in canvas periphery
  const ambientTraces = useMemo(() => {
    const traces: { cx: number; cy: number; r: number; dur: number; delay: number }[] = []
    const angles = [0.42, 1.15, 2.15, 3.48, 4.25, 5.08, 5.85]
    const dists = [0.88, 1.14, 0.94, 1.22, 1.06, 0.86, 1.18]
    for (let i = 0; i < angles.length; i++) {
      const a = angles[i]
      const d = radius * dists[i]
      traces.push({
        cx: cx + Math.cos(a) * d,
        cy: cy + Math.sin(a) * d,
        r: i % 2 === 0 ? 1.5 : 1.0,
        dur: 15 + i * 2.2,
        delay: i * 1.6,
      })
    }
    return traces
  }, [cx, cy, radius])

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

  const rootHeartbeat: RootHeartbeatState =
    phase === 'landing' || sitePhase === 'dormant'
      ? 'dormant'
      : sitePhase === 'ingesting'
        ? 'receiving'
        : sitePhase === 'running' || sitePhase === 'validating' || sitePhase === 'consolidating'
          ? 'processing'
          : 'diagnosed'

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
    (hovered != null && hovered !== 'root') ||
    hoveredMicro != null ||
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

  // Causal Cascade Path (when root cause is selected or in chain mode)
  const causalPath = useMemo(() => {
    if (highlightSet.size === 0) return null
    const activeNodes = layout.nodes.filter((n) => highlightSet.has(n.id))
    if (activeNodes.length === 0) return null

    const orderMap: Record<SkillId, number> = {
      'crawl-access-audit': 0,
      'render-extract-audit': 1,
      'site-type-classifier': 2,
      'entity-identity-audit': 3,
      'ai-answerability-audit': 4,
      'citation-extractability-audit': 5,
      'freshness-audit': 6,
      'corroboration-consistency-audit': 7,
      'engagement-handoff-audit': 8,
      'audit-orchestrator': 9,
    }
    const sorted = [...activeNodes].sort((a, b) => (orderMap[a.id] ?? 0) - (orderMap[b.id] ?? 0))

    if (sorted.length === 1) {
      const node = sorted[0]
      const limb = layout.limbs.find((l) => l.dimension === node.limb)
      if (limb) {
        return `M ${cx} ${cy} Q ${(cx + limb.joint.x) / 2} ${(cy + limb.joint.y) / 2} ${limb.joint.x} ${limb.joint.y} Q ${(limb.joint.x + node.x) / 2} ${(limb.joint.y + node.y) / 2} ${node.x} ${node.y}`
      }
      return `M ${cx} ${cy} Q ${(cx + node.x) / 2} ${(cy + node.y) / 2} ${node.x} ${node.y}`
    }

    let d = `M ${sorted[0].x} ${sorted[0].y}`
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1]
      const cur = sorted[i]
      const mx = (prev.x + cur.x) / 2
      const my = (prev.y + cur.y) / 2
      const bx = mx + (cx - mx) * 0.22
      const by = my + (cy - my) * 0.22
      d += ` Q ${bx} ${by} ${cur.x} ${cur.y}`
    }
    return d
  }, [highlightedSkillIds, viewMode, phase, guideFocus, layout, cx, cy, site, skills])

  // Camera Spatial Framing
  const cameraTargetId =
    selectedSkillId && selectedSkillId !== 'audit-orchestrator'
      ? selectedSkillId
      : highlightSet.size === 1
        ? [...highlightSet][0]
        : null
  const cameraNode = cameraTargetId ? layout.nodes.find((n) => n.id === cameraTargetId) : null

  let camScale = 0.94
  let camX = 0
  let camY = 0
  if (phase === 'ingesting') camScale = 0.97
  else if (phase === 'auditing' || phase === 'results') camScale = 1.0
  if (cameraNode) {
    camScale = 1.06
    camX = (cx - cameraNode.x) * 0.16
    camY = (cy - cameraNode.y) * 0.16
  } else if (selectedSkillId === 'audit-orchestrator') {
    camScale = 1.04
  }
  if (reduced) {
    camScale = 1
    camX = 0
    camY = 0
  }

  // Interactive Pan & Zoom State (Graph / Canvas Navigation)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [spacePressed, setSpacePressed] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 })
  const hasDraggedRef = useRef(false)

  // Reset user pan when focusing on a specific skill or site
  useEffect(() => {
    setPan({ x: 0, y: 0 })
  }, [selectedSkillId, focusedId])

  // Spacebar and keyboard zoom shortcuts (+, -, 0)
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        (e.code === 'Space' || e.key === ' ') &&
        !spacePressed &&
        (e.target as HTMLElement)?.tagName !== 'INPUT' &&
        (e.target as HTMLElement)?.tagName !== 'TEXTAREA'
      ) {
        setSpacePressed(true)
      }
      if (e.key === '+' || e.key === '=') {
        setZoom((z) => Math.min(2.8, Number((z * 1.15).toFixed(2))))
      }
      if (e.key === '-' || e.key === '_') {
        setZoom((z) => Math.max(0.45, Number((z / 1.15).toFixed(2))))
      }
      if (e.key === '0') {
        setPan({ x: 0, y: 0 })
        setZoom(1)
      }
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        setSpacePressed(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [spacePressed])

  // Mouse wheel and trackpad smooth zoom with cursor focal point
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()

      const rect = el.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      const factor = e.ctrlKey
        ? Math.exp(-e.deltaY * 0.01)
        : Math.exp(-e.deltaY * 0.0018)

      setZoom((prevZoom) => {
        const nextZoom = Math.min(2.8, Math.max(0.45, prevZoom * factor))
        if (nextZoom === prevZoom) return prevZoom

        const scaleRatio = nextZoom / prevZoom
        setPan((prevPan) => ({
          x: prevPan.x - (mouseX - cx - prevPan.x) * (scaleRatio - 1),
          y: prevPan.y - (mouseY - cy - prevPan.y) * (scaleRatio - 1),
        }))

        return nextZoom
      })
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [cx, cy, width, height])

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.button !== 1) return
    isDraggingRef.current = true
    hasDraggedRef.current = false
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    }
    setIsPanning(true)
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // ignore
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    const dx = e.clientX - dragStartRef.current.x
    const dy = e.clientY - dragStartRef.current.y
    if (Math.hypot(dx, dy) > 4) {
      hasDraggedRef.current = true
    }
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    })
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    setIsPanning(false)
    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
    }
    setTimeout(() => {
      hasDraggedRef.current = false
    }, 60)
  }

  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation()
    setZoom((z) => Math.min(2.8, Number((z * 1.2).toFixed(2))))
  }

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation()
    setZoom((z) => Math.max(0.45, Number((z / 1.2).toFixed(2))))
  }

  const handleResetView = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPan({ x: 0, y: 0 })
    setZoom(1)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'svg' || (e.target as HTMLElement) === containerRef.current) {
      handleResetView(e)
    }
  }

  const totalScale = camScale * zoom
  const totalX = camX + pan.x
  const totalY = camY + pan.y

  const horizonR = radius * (0.28 + rootProgress * 0.62)
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

  if (width === 0 || height === 0) return null

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'absolute inset-0 overflow-hidden select-none',
        isPanning ? 'cursor-grabbing' : spacePressed ? 'cursor-grab' : 'cursor-grab',
      )}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ scale: totalScale, x: totalX, y: totalY }}
        transition={{
          duration: isPanning ? 0 : reduced ? 0 : 0.22,
          ease: isPanning ? 'linear' : [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      >
        {/* Living respiration wrapper (slow, calm organic breathing) */}
        <motion.div
          className="absolute inset-0"
          animate={
            reduced
              ? {}
              : {
                  rotate: [0, 0.15, 0, -0.15, 0],
                  scale: [1, 1.002, 1, 0.999, 1],
                }
          }
          transition={{
            duration: 18,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: `${cx}px ${cy}px` }}
        >
          <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="absolute inset-0"
            aria-hidden
          >
            {/* ================= DEPTH LAYER 1: AMBIENT BACKGROUND ROOTS ================= */}
            <g className="pointer-events-none" opacity={phase === 'landing' ? 0.05 : 0.09}>
              {ambientRoots.map((d, i) => (
                <path
                  key={`ambient-root-${i}`}
                  d={d}
                  fill="none"
                  stroke="var(--line)"
                  strokeWidth={0.8}
                  strokeDasharray={i % 2 === 0 ? '3 6' : undefined}
                />
              ))}
            </g>

            {/* Ambient sparse telemetry points in periphery */}
            <g className="pointer-events-none" opacity={phase === 'landing' ? 0.06 : 0.18}>
              {ambientTraces.map((t, i) => (
                <motion.circle
                  key={`ambient-trace-${i}`}
                  cx={t.cx}
                  cy={t.cy}
                  r={t.r}
                  fill="var(--signal)"
                  initial={{ opacity: 0.1 }}
                  animate={
                    reduced
                      ? { opacity: 0.2 }
                      : {
                          opacity: [0.08, 0.35, 0.08],
                          scale: [0.8, 1.3, 0.8],
                        }
                  }
                  transition={{
                    duration: t.dur,
                    delay: t.delay,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </g>

            {/* Diagnostic Horizon Ellipse */}
            {(awakened || phase === 'auditing' || phase === 'results') && (
              <motion.ellipse
                cx={cx}
                cy={cy}
                rx={horizonR * 1.18}
                ry={horizonR * 0.88}
                fill="none"
                stroke="var(--line)"
                strokeWidth={1}
                strokeDasharray="4 10"
                initial={false}
                animate={{ rx: horizonR * 1.12, ry: horizonR * 0.9, opacity: 0.38 }}
                transition={{ duration: reduced ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            )}

            {/* ================= DEPTH LAYER 2: ROOT ORIGIN ENERGY ================= */}
            <g className="pointer-events-none">
              {/* Inner optic ring */}
              <circle
                cx={cx}
                cy={cy}
                r={22}
                fill="none"
                stroke="var(--signal)"
                strokeWidth={0.8}
                opacity={phase === 'landing' ? 0.2 : 0.32}
              />

              {/* Intermediate telemetry ring */}
              <motion.circle
                cx={cx}
                cy={cy}
                r={compact ? 40 : 48}
                fill="none"
                stroke="var(--line)"
                strokeWidth={0.9}
                strokeDasharray="4 8"
                opacity={showRoot ? 0.35 : 0.15}
                animate={reduced ? {} : { rotate: 360 }}
                transition={{ duration: 48, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />

              {/* Outer boundary ring */}
              <circle
                cx={cx}
                cy={cy}
                r={compact ? 66 : 76}
                fill="none"
                stroke="var(--line)"
                strokeWidth={0.7}
                strokeDasharray="2 12"
                opacity={showRoot ? 0.2 : 0.08}
              />

              {/* Soft expanding energy wave on active or receiving states */}
              {!reduced && (isActive(rootStatus) || sitePhase === 'ingesting') && (
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r={26}
                  fill="none"
                  stroke="var(--signal)"
                  strokeWidth={1.2}
                  initial={{ r: 24, opacity: 0.38 }}
                  animate={{ r: [24, compact ? 75 : 92], opacity: [0.38, 0] }}
                  transition={{ duration: 2.8, repeat: Number.POSITIVE_INFINITY, ease: 'easeOut' }}
                />
              )}
            </g>

            {/* ================= DEPTH LAYER 3: DIMENSION TRUNKS (FIND, UNDERSTAND, TRUST, ENGAGE) ================= */}
            {phase !== 'landing' &&
              layout.limbs.map((limb, i) => {
                const st = limbStatus(limb.dimension)
                const related = layout.nodes.filter((n) => n.limb === limb.dimension).map((n) => n.id)
                const isHoveredLimb = hovered !== null && hovered !== 'root' && related.includes(hovered)
                const dimmed =
                  hasHighlight &&
                  !related.some((id) => id === selectedSkillId || highlightSet.has(id) || id === hovered) &&
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
                      isHoveredLimb ||
                      related.some((id) => id === selectedSkillId || highlightSet.has(id)) ||
                      guideFocus === 'dimensions'
                    }
                    weight="trunk"
                  />
                )
              })}

            {/* ================= DEPTH LAYER 4: SKILL BRANCHES ================= */}
            {phase !== 'landing' &&
              layout.branches.map((branch, i) => {
                const st = statusOf(branch.id)
                const isHoveredBranch = hovered === branch.id
                const isBranchHighlighted = highlightSet.has(branch.id)
                const isBranchSelected = selectedSkillId === branch.id
                const dimmed =
                  hasHighlight &&
                  !isBranchSelected &&
                  !isBranchHighlighted &&
                  !isHoveredBranch &&
                  hoveredMicro?.skillId !== branch.id
                const grown = awakened && st !== 'dormant'
                return (
                  <TreeBranch
                    key={branch.id}
                    path={branch.path}
                    status={st}
                    grown={grown}
                    reduced={reduced}
                    index={i + 4}
                    dimmed={dimmed}
                    emphasized={isHoveredBranch || isBranchSelected || isBranchHighlighted}
                    evidenceFlow={findingOf(branch.id) && st === 'running'}
                    weight="twig"
                    flowPath={branch.flowPath}
                    pulseToken={isBranchHighlighted ? highlightPulseToken : undefined}
                  />
                )
              })}

            {/* ================= DEPTH LAYER 5: SECONDARY & TERTIARY BRANCHING & CLUSTER TENDRILS ================= */}
            {phase !== 'landing' &&
              layout.clusters.map((cluster) => {
                const parentStatus = statusOf(cluster.skillId)
                const isParentSelected = selectedSkillId === cluster.skillId
                const isParentHighlighted = highlightSet.has(cluster.skillId)
                const isParentHovered = hovered === cluster.skillId
                const isClusterRelevant =
                  !hasHighlight ||
                  isParentSelected ||
                  isParentHighlighted ||
                  isParentHovered ||
                  hoveredMicro?.skillId === cluster.skillId ||
                  selectedSkillId === 'audit-orchestrator'
                const clusterDimmed = hasHighlight && !isClusterRelevant
                const grown = awakened && parentStatus !== 'dormant'

                return (
                  <g key={`cluster-${cluster.skillId}`}>
                    {/* Inter-cluster tendrils (Bridges, Constellations, Pipelines) */}
                    {cluster.tendrils.map((t, idx) => {
                      const stStyle = STATUS_STYLE[parentStatus]
                      const tendrilColor = parentStatus === 'dormant' ? 'rgba(255, 255, 255, 0.08)' : stStyle.color
                      return (
                        <motion.path
                          key={`${cluster.skillId}-tendril-${idx}`}
                          d={t.path}
                          fill="none"
                          stroke={tendrilColor}
                          strokeWidth={t.style === 'bridge' ? 1.4 : 0.9}
                          strokeDasharray={t.style === 'dashed' ? '2 4' : t.style === 'bridge' ? '4 3' : undefined}
                          strokeLinecap="round"
                          initial={reduced ? { opacity: 0.25 } : { pathLength: 0, opacity: 0 }}
                          animate={{
                            pathLength: grown ? 1 : 0,
                            opacity: grown ? (clusterDimmed ? 0.05 : t.style === 'bridge' ? 0.55 : 0.32) : 0,
                          }}
                          transition={{ duration: 0.8, delay: idx * 0.05 }}
                        />
                      )
                    })}

                    {/* Micro-node connecting tendrils */}
                    {cluster.microNodes.map((mn, idx) => {
                      const isEvidence = mn.kind === 'evidence'
                      const isThisHovered = hoveredMicro?.id === mn.id
                      const branchDimmed =
                        hasHighlight &&
                        !isParentSelected &&
                        !isParentHighlighted &&
                        !isParentHovered &&
                        !isThisHovered &&
                        selectedSkillId !== 'audit-orchestrator'
                      const branchEmphasized = isParentSelected || isThisHovered || (isEvidence && isParentHighlighted)

                      return (
                        <TreeBranch
                          key={`micro-branch-${mn.id}`}
                          path={mn.path}
                          status={parentStatus}
                          grown={grown}
                          reduced={reduced}
                          index={idx + 12}
                          dimmed={branchDimmed}
                          emphasized={branchEmphasized}
                          evidenceFlow={isEvidence && parentStatus === 'running'}
                          weight="tendril"
                          flowPath={mn.flowPath}
                        />
                      )
                    })}
                  </g>
                )
              })}

            {/* ================= DEPTH LAYER 6: ROOT-CAUSE CAUSAL ROUTE VISUALIZATION ================= */}
            {causalPath && (viewMode === 'chain' || highlightSource === 'span' || Boolean(highlightPulseToken)) && (
              <g className="pointer-events-none">
                {highlightSource === 'span' || Boolean(highlightPulseToken) ? (
                  <motion.path
                    d={causalPath}
                    fill="none"
                    stroke="var(--signal)"
                    strokeWidth={1.25}
                    strokeLinecap="round"
                    strokeDasharray={phase === 'auditing' ? '4 4' : undefined}
                    style={{ opacity: 0.55 }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  />
                ) : (
                  <>
                    {/* Outer optic halo */}
                    <motion.path
                      d={causalPath}
                      fill="none"
                      stroke="var(--warning)"
                      strokeWidth={4.5}
                      strokeLinecap="round"
                      style={{ opacity: 0.22, filter: 'blur(3px)' }}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {/* Core animated causal conduit */}
                    <motion.path
                      d={causalPath}
                      fill="none"
                      stroke="var(--warning)"
                      strokeWidth={2.0}
                      strokeLinecap="round"
                      strokeDasharray="5 5"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                    />
                    {/* Diagnostic telemetry pulse along causal vector */}
                    {!reduced && (
                      <DataPulse path={causalPath} color="var(--destructive)" duration={2.2} delay={0.2} />
                    )}
                  </>
                )}
              </g>
            )}

            {/* Center Origin Ring */}
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
          {/* ROOT: Heartbeat Center of the Diagnostic System */}
          {showRoot && (
            <>
              <TreeNode
                x={cx}
                y={cy}
                status={rootStatus}
                label={labelOf || 'Origin'}
                size={compact ? 32 : 38}
                visible
                reduced={reduced}
                interactive={Boolean(onSelectRoot)}
                progress={rootProgress}
                selected={selectedSkillId === 'audit-orchestrator'}
                variant="root"
                rootState={rootHeartbeat}
                onClick={() => {
                  if (hasDraggedRef.current) return
                  onSelectRoot?.()
                }}
                onHover={() => setHovered('root')}
                onLeave={() => setHovered((h) => (h === 'root' ? null : h))}
                onFocus={() => setHovered('root')}
              />
              {labelOf && (
                <div
                  className="pointer-events-none absolute -translate-x-1/2 text-center"
                  style={{ left: cx, top: cy + 32 }}
                >
                  <motion.p className="text-[13px] font-semibold tracking-tight text-foreground">{labelOf}</motion.p>
                  <p className="mt-0.5 font-mono text-[10px] tracking-wide text-muted-foreground">
                    {awakened && sitePhase !== 'completed' && sitePhase !== 'partial'
                      ? `${Math.round(rootProgress * 100)}% · ${rootStatusLabel}`
                      : rootStatusLabel}
                  </p>
                </div>
              )}
            </>
          )}

          {/* DIMENSION HUBS: Visually prominent intermediate hubs (Find, Understand, Trust, Engage) */}
          {phase !== 'landing' &&
            layout.limbs.map((limb) => {
              const st = limbStatus(limb.dimension)
              const related = layout.nodes.filter((n) => n.limb === limb.dimension).map((n) => n.id)
              const isHoveredLimb = hovered !== null && hovered !== 'root' && related.includes(hovered)
              const isSelectedLimb = related.some((id) => id === selectedSkillId)
              const isHighlightedLimb = related.some((id) => highlightSet.has(id))
              const dimmed =
                hasHighlight &&
                !isSelectedLimb &&
                !isHighlightedLimb &&
                !isHoveredLimb &&
                selectedSkillId !== 'audit-orchestrator'

              const a = rad(limb.angle)
              const side = a > 0.2 && a < Math.PI - 0.2 ? 1 : -1
              const lx = limb.joint.x + Math.cos(a + Math.PI / 2) * 24 * side
              const ly = limb.joint.y + Math.sin(a + Math.PI / 2) * 24 * side

              return (
                <div key={`dim-hub-${limb.dimension}`}>
                  <TreeNode
                    x={limb.joint.x}
                    y={limb.joint.y}
                    status={st}
                    label={DIMENSIONS[limb.dimension].label}
                    size={compact ? 24 : 28}
                    visible={true}
                    dimmed={dimmed}
                    selected={isSelectedLimb || isHighlightedLimb}
                    reduced={reduced}
                    interactive={interactive && awakened}
                    variant="dimension"
                    onClick={() => {
                      if (hasDraggedRef.current) return
                      const firstChild = related[0]
                      if (firstChild) onSelectSkill?.(firstChild)
                    }}
                  />
                  <div
                    className={cn(
                      'pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 font-mono text-[10px] font-bold tracking-[0.16em] uppercase transition-opacity duration-200',
                      dimmed ? 'opacity-30' : 'opacity-95',
                    )}
                    style={{
                      left: lx,
                      top: ly,
                      color: STATUS_STYLE[st].color,
                    }}
                  >
                    <span className="rounded border border-white/12 bg-black/90 px-2 py-0.5 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                      {DIMENSIONS[limb.dimension].verb}
                    </span>
                  </div>
                </div>
              )
            })}

          {/* SKILL SATELLITES: Compact, subordinate satellite nodes */}
          {phase !== 'landing' &&
            layout.nodes.map((node) => {
              const st = statusOf(node.id)
              const isSkillSelected = selectedSkillId === node.id
              const isSkillHovered = hovered === node.id
              const isSkillHighlighted = highlightSet.has(node.id)
              const visible = awakened || st !== 'dormant'
              const dimmed =
                hasHighlight && !isSkillSelected && !isSkillHighlighted && !isSkillHovered
              const outward = rad(node.angle)
              const tangent = outward + (node.y > cy ? -Math.PI / 2.3 : Math.PI / 2.3)
              const lx = node.x + Math.cos(tangent) * (compact ? 22 : 28)
              const ly = node.y + Math.sin(tangent) * (compact ? 20 : 24)
              const align: 'left' | 'right' | 'center' =
                Math.cos(tangent) > 0.25 ? 'left' : Math.cos(tangent) < -0.25 ? 'right' : 'center'
              const showSkillLabel =
                showLabels &&
                visible &&
                (phase === 'results' ||
                  phase === 'auditing' ||
                  isSkillHovered ||
                  isSkillSelected ||
                  isSkillHighlighted ||
                  isActive(st) ||
                  guideFocus === 'skills')

              return (
                <div key={node.id}>
                  <TreeNode
                    x={node.x}
                    y={node.y}
                    status={st}
                    label={SKILL_MAP[node.id].label}
                    size={compact ? 15 : 18}
                    visible={visible}
                    dimmed={dimmed}
                    selected={isSkillSelected}
                    highlighted={isSkillHighlighted}
                    reduced={reduced}
                    progress={progressOf(node.id)}
                    interactive={interactive && awakened}
                    variant="skill"
                    hasFinding={findingOf(node.id)}
                    onHover={() => setHovered(node.id)}
                    onFocus={() => setHovered(node.id)}
                    onLeave={() => setHovered((h) => (h === node.id ? null : h))}
                    onClick={() => {
                      if (hasDraggedRef.current) return
                      onSelectSkill?.(node.id)
                    }}
                  />
                  {showSkillLabel && (
                    <div
                      className="pointer-events-none absolute text-[10px] font-medium leading-tight tracking-tight transition-all duration-200"
                      style={{
                        left: lx,
                        top: ly,
                        transform:
                          align === 'left'
                            ? 'translate(0, -50%)'
                            : align === 'right'
                              ? 'translate(-100%, -50%)'
                              : 'translate(-50%, 0)',
                        opacity: dimmed ? 0.3 : isSkillSelected || isSkillHovered ? 1 : 0.85,
                      }}
                    >
                      <span
                        className={cn(
                          'rounded border px-2 py-0.5 font-mono text-[9px] font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.7)] transition-all duration-150',
                          isSkillHovered || isSkillSelected
                            ? 'border-signal/50 bg-black/95 text-signal'
                            : 'border-white/10 bg-black/85 text-foreground/90',
                        )}
                      >
                        {SKILL_MAP[node.id].short}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}

          {/* ================= MICRO-NODES: SECONDARY & TERTIARY EVIDENCE POINTS ================= */}
          {phase !== 'landing' &&
            layout.microNodes.map((mn) => {
              const parentStatus = statusOf(mn.skillId)
              const isParentSelected = selectedSkillId === mn.skillId
              const isParentHighlighted = highlightSet.has(mn.skillId)
              const isParentHovered = hovered === mn.skillId
              const isThisHovered = hoveredMicro?.id === mn.id

              const visible = awakened || parentStatus !== 'dormant'
              const dimmed =
                hasHighlight &&
                !isParentSelected &&
                !isParentHighlighted &&
                !isParentHovered &&
                !isThisHovered &&
                selectedSkillId !== 'audit-orchestrator'

              const showMicroLabel =
                (isThisHovered || (isParentSelected && mn.level === 3)) && !dimmed

              return (
                <div key={`micro-node-${mn.id}`}>
                  <TreeNode
                    x={mn.x}
                    y={mn.y}
                    status={parentStatus}
                    label={mn.label}
                    size={compact ? 7 : 8}
                    visible={visible}
                    dimmed={dimmed}
                    selected={isThisHovered || (isParentSelected && mn.level === 3)}
                    reduced={reduced}
                    interactive={interactive && awakened}
                    variant="micro"
                    kind={mn.kind}
                    onHover={() => setHoveredMicro(mn)}
                    onFocus={() => setHoveredMicro(mn)}
                    onLeave={() => setHoveredMicro((cur) => (cur?.id === mn.id ? null : cur))}
                    onClick={() => {
                      if (hasDraggedRef.current) return
                      onSelectSkill?.(mn.skillId)
                    }}
                  />
                  {showMicroLabel && (
                    <div
                      className="pointer-events-none absolute z-30 -translate-x-1/2 font-mono text-[9px] font-medium tracking-tight whitespace-nowrap"
                      style={{
                        left: mn.x,
                        top: mn.y - 14,
                      }}
                    >
                      <span className="rounded border border-white/12 bg-black/90 px-1.5 py-0.5 text-foreground shadow-md backdrop-blur-md">
                        <span className="text-[8px] uppercase tracking-wider text-muted-foreground mr-1">
                          {mn.kind}
                        </span>
                        {mn.label}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}

          {/* Micro-Node Diagnostic HUD Tooltip on Hover */}
          {interactive && hoveredMicro && (
            <div
              className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-full pb-2"
              style={{ left: hoveredMicro.x, top: hoveredMicro.y }}
            >
              <div className="flex items-center gap-1.5 rounded border border-white/12 bg-background/95 px-2 py-1 font-mono text-[10px] shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md">
                <span
                  className="rounded px-1 py-0.5 text-[8px] font-bold uppercase tracking-wider"
                  style={{
                    color: STATUS_STYLE[statusOf(hoveredMicro.skillId)].color,
                    backgroundColor: `${STATUS_STYLE[statusOf(hoveredMicro.skillId)].color}18`,
                  }}
                >
                  {hoveredMicro.kind}
                </span>
                <span className="font-sans text-xs font-medium text-foreground">{hoveredMicro.label}</span>
              </div>
            </div>
          )}

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
                onClick={() => {
                  if (hasDraggedRef.current) return
                  onFocusSite?.(s.id)
                }}
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
    </motion.div>

    {/* Floating Canvas Pan/Zoom Controls HUD */}
    {phase !== 'landing' && (
      <aside
        aria-label="Canvas zoom and pan controls"
        onPointerDown={(e) => e.stopPropagation()}
        className="pointer-events-auto absolute left-6 bottom-6 z-30 flex flex-col gap-1.5 select-none"
      >
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#070b14]/85 p-1.5 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
          <button
            type="button"
            onClick={handleZoomIn}
            className="flex size-7 items-center justify-center rounded-lg border border-white/8 bg-white/5 font-mono text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/15 hover:text-foreground active:scale-95 cursor-pointer"
            title="Zoom In (+)"
            aria-label="Zoom in"
          >
            +
          </button>

          <span
            className="min-w-[3.4rem] px-1 text-center font-mono text-[11px] font-semibold text-foreground tabular-nums cursor-default"
            title="Current zoom level"
          >
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomOut}
            className="flex size-7 items-center justify-center rounded-lg border border-white/8 bg-white/5 font-mono text-sm font-semibold text-muted-foreground transition-colors hover:bg-white/15 hover:text-foreground active:scale-95 cursor-pointer"
            title="Zoom Out (−)"
            aria-label="Zoom out"
          >
            −
          </button>

          <div className="h-4 w-px bg-white/10 mx-0.5" />

          <button
            type="button"
            onClick={handleResetView}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-[10px] font-medium tracking-wider uppercase transition-colors active:scale-95 cursor-pointer',
              pan.x !== 0 || pan.y !== 0 || zoom !== 1
                ? 'border-signal/40 bg-signal/15 text-signal hover:bg-signal/25'
                : 'border-white/8 bg-white/5 text-muted-foreground hover:bg-white/15 hover:text-foreground',
            )}
            title="Reset Pan & Zoom (0)"
            aria-label="Reset view"
          >
            <span>RESET</span>
            <span className="text-[11px]">⟲</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-1 font-mono text-[9px] text-muted-foreground/50 tracking-wider">
          <span>DRAG TO PAN</span>
          <span>•</span>
          <span>SCROLL TO ZOOM</span>
        </div>
      </aside>
    )}
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
