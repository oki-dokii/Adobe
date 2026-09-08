import type { Dimension, SkillId } from './types'
import { LIMBS, RUN_ORDER } from './skills'

/** Vertical placement of the origin, as a fraction of canvas height. */
export const ROOT_Y = 0.46

export interface LeafPoint {
  x: number
  y: number
}

export interface TreeNodeLayout {
  id: SkillId
  x: number
  y: number
  angle: number
  radius: number
  depth: 'near' | 'far'
  limb: Dimension
  leaves: LeafPoint[]
}

export interface BranchLayout {
  id: SkillId
  path: string
  /** Root → dimension joint → skill, for computation packets. */
  flowPath: string
  mid: LeafPoint
  fromJoint: boolean
}

export interface LimbLayout {
  dimension: Dimension
  angle: number
  joint: LeafPoint
  path: string
}

export interface TreeLayout {
  root: LeafPoint
  limbs: LimbLayout[]
  nodes: TreeNodeLayout[]
  branches: BranchLayout[]
}

export interface LayoutOptions {
  cx: number
  cy: number
  radius: number
}

function rad(deg: number) {
  return (deg * Math.PI) / 180
}

function quad(x1: number, y1: number, x2: number, y2: number, bend: number) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2
  return `M ${x1} ${y1} Q ${mx + Math.cos(a) * bend} ${my + Math.sin(a) * bend} ${x2} ${y2}`
}

/**
 * Hierarchical layout: four dimension trunks from the origin, skills as
 * secondary twigs. Deterministic, organic curvature, variable length.
 */
export function computeTreeLayout(
  skillIds: SkillId[] = RUN_ORDER,
  opts: LayoutOptions,
): TreeLayout {
  const { cx, cy, radius } = opts
  const root: LeafPoint = { x: cx, y: cy }
  const allowed = new Set(skillIds)
  const limbs: LimbLayout[] = []
  const nodes: TreeNodeLayout[] = []
  const branches: BranchLayout[] = []

  LIMBS.forEach((limb, li) => {
    const a = rad(limb.angle)
    const jointR = radius * 0.32
    const jx = cx + Math.cos(a) * jointR
    const jy = cy + Math.sin(a) * jointR
    const joint = { x: jx, y: jy }
    const trunkBend = (((li * 19) % 7) / 7 - 0.5) * radius * 0.18
    limbs.push({
      dimension: limb.dimension,
      angle: limb.angle,
      joint,
      path: quad(cx, cy, jx, jy, trunkBend),
    })

    const ids = limb.skillIds.filter((id) => allowed.has(id))
    ids.forEach((id, i) => {
      const n = ids.length
      const along = n === 1 ? 1.02 : 0.58 + (i / Math.max(n - 1, 1)) * 0.58
      const perp = n === 1 ? 0 : (i - (n - 1) / 2) * 0.2
      const sa = a + perp
      const depth: 'near' | 'far' = along < 0.78 ? 'near' : 'far'
      const rr = radius * along * (1 + ((((i + li) * 17) % 9) / 9) * 0.08)
      const x = cx + Math.cos(sa) * rr
      const y = cy + Math.sin(sa) * rr
      const twigBend = (((i * 23 + li * 11) % 9) / 9 - 0.5) * radius * 0.2

      const leaves: LeafPoint[] = n > 0 ? [-1, 1].map((dir) => {
        const la = sa + dir * 0.22
        return { x: x + Math.cos(la) * rr * 0.14, y: y + Math.sin(la) * rr * 0.14 }
      }) : []

      nodes.push({
        id,
        x,
        y,
        angle: (sa * 180) / Math.PI,
        radius: rr,
        depth,
        limb: limb.dimension,
        leaves,
      })
      const twig = quad(jx, jy, x, y, twigBend)
      branches.push({
        id,
        path: twig,
        flowPath: `${quad(cx, cy, jx, jy, trunkBend)} ${twig.replace(/^M [-\d.]+ [-\d.]+/, '')}`,
        mid: { x: (jx + x) / 2, y: (jy + y) / 2 },
        fromJoint: true,
      })
    })
  })

  return { root, limbs, nodes, branches }
}

export function computeAmbientRoots(
  cx: number,
  cy: number,
  reach: number,
  count = 7,
  seed = 7,
): string[] {
  const paths: string[] = []
  let h = seed
  const rand = () => {
    h = (h * 1103515245 + 12345) & 0x7fffffff
    return h / 0x7fffffff
  }
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + rand() * 0.28
    const len = reach * (0.55 + rand() * 0.55)
    const ex = cx + Math.cos(angle) * len
    const ey = cy + Math.sin(angle) * len
    const perp = angle + Math.PI / 2
    const bend = (rand() - 0.5) * reach * 0.35
    const mx = cx + Math.cos(angle) * len * 0.45 + Math.cos(perp) * bend
    const my = cy + Math.sin(angle) * len * 0.45 + Math.sin(perp) * bend
    paths.push(`M ${cx} ${cy} Q ${mx} ${my} ${ex} ${ey}`)
    if (rand() > 0.45) {
      const fork = 0.58 + rand() * 0.18
      const fx = cx + (ex - cx) * fork
      const fy = cy + (ey - cy) * fork
      const fex = fx + Math.cos(angle + (rand() - 0.5) * 0.8) * len * 0.22
      const fey = fy + Math.sin(angle + (rand() - 0.5) * 0.8) * len * 0.22
      paths.push(`M ${fx} ${fy} Q ${(fx + fex) / 2} ${(fy + fey) / 2} ${fex} ${fey}`)
    }
  }
  return paths
}
