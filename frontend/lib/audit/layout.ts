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

export interface MicroNodeLayout {
  id: string
  skillId: SkillId
  label: string
  kind: 'check' | 'signal' | 'page' | 'fact' | 'anchor' | 'evidence'
  x: number
  y: number
  angle: number
  path: string
  flowPath: string
  level: 2 | 3
  parentCheckId?: string
}

export interface ClusterTendril {
  path: string
  style: 'solid' | 'dashed' | 'bridge'
}

export interface TreeClusterLayout {
  skillId: SkillId
  clusterType: string
  microNodes: MicroNodeLayout[]
  tendrils: ClusterTendril[]
}

export interface TreeLayout {
  root: LeafPoint
  limbs: LimbLayout[]
  nodes: TreeNodeLayout[]
  branches: BranchLayout[]
  clusters: TreeClusterLayout[]
  microNodes: MicroNodeLayout[]
}

export interface LayoutOptions {
  cx: number
  cy: number
  radius: number
}

function rad(deg: number) {
  return (deg * Math.PI) / 180
}

function n(v: number) {
  return Math.round(v * 1e4) / 1e4
}

function quad(x1: number, y1: number, x2: number, y2: number, bend: number) {
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  const a = Math.atan2(y2 - y1, x2 - x1) + Math.PI / 2
  return `M ${n(x1)} ${n(y1)} Q ${n(mx + Math.cos(a) * bend)} ${n(my + Math.sin(a) * bend)} ${n(x2)} ${n(y2)}`
}

function stripStart(d: string) {
  return d.replace(/^M\s+[-\d.eE+]+\s+[-\d.eE+]+/, '').trim()
}

/**
 * Organic, asymmetric dimensional trunks:
 * Distinct curvatures, lengths, and spatial spreads.
 */
const LIMB_CONFIG: Record<Dimension, { reachScale: number; bend: number }> = {
  discoverability: { reachScale: 0.42, bend: -0.10 },
  understanding: { reachScale: 0.50, bend: 0.08 },
  trust: { reachScale: 0.46, bend: -0.07 },
  engagement: { reachScale: 0.38, bend: 0.06 },
}

const SKILL_OFFSET: Record<SkillId, { alongScale: number; angleShift: number; bend: number }> = {
  'crawl-access-audit': { alongScale: 0.72, angleShift: -0.16, bend: -0.07 },
  'render-extract-audit': { alongScale: 0.94, angleShift: 0.17, bend: 0.09 },

  'site-type-classifier': { alongScale: 0.70, angleShift: -0.26, bend: 0.08 },
  'entity-identity-audit': { alongScale: 0.96, angleShift: -0.02, bend: -0.06 },
  'ai-answerability-audit': { alongScale: 0.86, angleShift: 0.24, bend: 0.10 },

  'citation-extractability-audit': { alongScale: 0.74, angleShift: -0.24, bend: -0.08 },
  'freshness-audit': { alongScale: 0.96, angleShift: 0.04, bend: 0.06 },
  'corroboration-consistency-audit': { alongScale: 0.84, angleShift: 0.26, bend: -0.07 },

  'engagement-handoff-audit': { alongScale: 0.86, angleShift: 0.0, bend: 0.06 },
  'audit-orchestrator': { alongScale: 0, angleShift: 0, bend: 0 },
}

/**
 * Detailed micro-node specifications producing skill-specific visual fingerprints:
 * Pages, facts, signals, sources, anchors, questions, and evidence leaves.
 */
interface MicroDef {
  id: string
  label: string
  kind: MicroNodeLayout['kind']
  dist: number
  angleShift: number
  level: 2 | 3
  parentCheckId?: string
}

const SKILL_MICRO_SPECS: Record<SkillId, MicroDef[]> = {
  'crawl-access-audit': [
    { id: 'robots-txt', label: 'robots.txt directives', kind: 'check', dist: 74, angleShift: -0.58, level: 2 },
    { id: 'status-codes', label: 'HTTP status codes', kind: 'check', dist: 92, angleShift: -0.22, level: 2 },
    { id: 'status-403', label: '403 challenge boundary', kind: 'evidence', dist: 52, angleShift: -0.34, level: 3, parentCheckId: 'status-codes' },
    { id: 'challenges', label: 'Bot challenge responses', kind: 'check', dist: 84, angleShift: 0.22, level: 2 },
    { id: 'sitemap-xml', label: 'Sitemap indexing', kind: 'check', dist: 98, angleShift: 0.58, level: 2 },
    { id: 'sampled-pages', label: 'Sampled pages', kind: 'page', dist: 50, angleShift: 0.40, level: 3, parentCheckId: 'sitemap-xml' },
  ],
  'render-extract-audit': [
    { id: 'server-html', label: 'Server HTML shell', kind: 'signal', dist: 78, angleShift: -0.54, level: 2 },
    { id: 'client-dom', label: 'Hydrated client DOM', kind: 'signal', dist: 90, angleShift: 0.48, level: 2 },
    { id: 'main-ratio', label: 'Extracted main-text evidence', kind: 'evidence', dist: 56, angleShift: 0.12, level: 3, parentCheckId: 'client-dom' },
    { id: 'dom-stability', label: 'Layout shift & stability', kind: 'check', dist: 106, angleShift: -0.04, level: 2 },
  ],
  'site-type-classifier': [
    { id: 'template-detect', label: 'Template structure', kind: 'check', dist: 76, angleShift: -0.54, level: 2 },
    { id: 'content-taxonomy', label: 'Content taxonomy', kind: 'check', dist: 94, angleShift: -0.10, level: 2 },
    { id: 'site-class', label: 'Engine site-cluster classification', kind: 'fact', dist: 52, angleShift: 0.08, level: 3, parentCheckId: 'content-taxonomy' },
    { id: 'commerce-signals', label: 'Commerce & auth signals', kind: 'check', dist: 80, angleShift: 0.50, level: 2 },
  ],
  'entity-identity-audit': [
    { id: 'org-schema', label: 'Organization schema markup', kind: 'check', dist: 80, angleShift: -0.54, level: 2 },
    { id: 'brand-aliases', label: 'Brand alias resolution', kind: 'check', dist: 98, angleShift: 0.04, level: 2 },
    { id: 'disambiguation', label: 'Category/geo disambiguation evidence', kind: 'evidence', dist: 54, angleShift: 0.24, level: 3, parentCheckId: 'brand-aliases' },
    { id: 'kg-entity', label: 'Knowledge Graph alignment', kind: 'fact', dist: 82, angleShift: 0.54, level: 2 },
  ],
  'ai-answerability-audit': [
    { id: 'question-prompt', label: 'Synthetic query prompt', kind: 'check', dist: 78, angleShift: -0.50, level: 2 },
    { id: 'fact-retrieval', label: 'Grounding fact retrieval', kind: 'fact', dist: 100, angleShift: 0.02, level: 2 },
    { id: 'confidence-margin', label: 'Extraction confidence gap', kind: 'evidence', dist: 74, angleShift: 0.52, level: 2 },
    { id: 'substitution-risk', label: 'Source substitution vector', kind: 'evidence', dist: 54, angleShift: 0.32, level: 3, parentCheckId: 'confidence-margin' },
  ],
  'citation-extractability-audit': [
    { id: 'attributable-claims', label: 'Attributable claims', kind: 'check', dist: 82, angleShift: -0.56, level: 2 },
    { id: 'stable-anchors', label: 'Stable URI anchors', kind: 'anchor', dist: 102, angleShift: -0.10, level: 2 },
    { id: 'pricing-quote', label: 'Self-contained pricing quote', kind: 'evidence', dist: 58, angleShift: -0.30, level: 3, parentCheckId: 'stable-anchors' },
    { id: 'structured-facts', label: 'Machine-quotable syntax', kind: 'check', dist: 84, angleShift: 0.48, level: 2 },
  ],
  'freshness-audit': [
    { id: 'published-date', label: 'Published timestamp', kind: 'signal', dist: 76, angleShift: -0.48, level: 2 },
    { id: 'modified-signal', label: 'Modified header delta', kind: 'signal', dist: 96, angleShift: 0.02, level: 2 },
    { id: 'temporal-decay', label: 'Date-signal divergence evidence', kind: 'evidence', dist: 54, angleShift: -0.22, level: 3, parentCheckId: 'modified-signal' },
    { id: 'update-cadence', label: 'On-site fact consistency', kind: 'check', dist: 114, angleShift: 0.48, level: 2 },
  ],
  'corroboration-consistency-audit': [
    { id: 'onsite-claims', label: 'On-site statements', kind: 'signal', dist: 80, angleShift: -0.56, level: 2 },
    { id: 'external-sources', label: 'Third-party agreement sources', kind: 'signal', dist: 82, angleShift: 0.54, level: 2 },
    { id: 'consensus-fact', label: 'Contradiction check', kind: 'fact', dist: 106, angleShift: -0.04, level: 2 },
    { id: 'contradiction-count', label: 'Linked claim comparison outcome', kind: 'evidence', dist: 56, angleShift: 0.24, level: 3, parentCheckId: 'consensus-fact' },
  ],
  'engagement-handoff-audit': [
    { id: 'action-legibility', label: 'Action legibility for assistants', kind: 'check', dist: 84, angleShift: -0.48, level: 2 },
    { id: 'deep-link-schema', label: 'Direct intent deep links', kind: 'anchor', dist: 78, angleShift: -0.64, level: 2 },
    { id: 'handoff-paths', label: 'Handoff routing path', kind: 'check', dist: 104, angleShift: 0.12, level: 2 },
    { id: 'conversion-target', label: 'Conversion target endpoint', kind: 'signal', dist: 60, angleShift: 0.50, level: 3, parentCheckId: 'handoff-paths' },
  ],
  'audit-orchestrator': [],
}

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
  const clusters: TreeClusterLayout[] = []
  const allMicroNodes: MicroNodeLayout[] = []

  LIMBS.forEach((limb) => {
    const a = rad(limb.angle)
    const config = LIMB_CONFIG[limb.dimension]
    const jointR = radius * config.reachScale
    const jx = cx + Math.cos(a) * jointR
    const jy = cy + Math.sin(a) * jointR
    const joint = { x: jx, y: jy }
    const trunkBend = config.bend * radius
    const trunk = quad(cx, cy, jx, jy, trunkBend)
    limbs.push({
      dimension: limb.dimension,
      angle: limb.angle,
      joint,
      path: trunk,
    })

    const ids = limb.skillIds.filter((id) => allowed.has(id))
    ids.forEach((id) => {
      const offset = SKILL_OFFSET[id] ?? { alongScale: 0.8, angleShift: 0, bend: 0 }
      const sa = a + offset.angleShift
      const along = offset.alongScale
      const depth: 'near' | 'far' = along < 0.78 ? 'near' : 'far'
      const rr = radius * along
      const x = cx + Math.cos(sa) * rr
      const y = cy + Math.sin(sa) * rr
      const twigBend = offset.bend * radius

      const leaves: LeafPoint[] = [-1, 1].map((dir) => {
        const la = sa + dir * 0.22
        return { x: x + Math.cos(la) * 10, y: y + Math.sin(la) * 10 }
      })

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
      const skillFlowPath = `${trunk} ${stripStart(twig)}`

      branches.push({
        id,
        path: twig,
        flowPath: skillFlowPath,
        mid: { x: (jx + x) / 2, y: (jy + y) / 2 },
        fromJoint: true,
      })

      // Generate Secondary & Tertiary Micro-Nodes and Clusters
      const specs = SKILL_MICRO_SPECS[id] ?? []
      const clusterNodes: MicroNodeLayout[] = []
      const clusterTendrils: ClusterTendril[] = []
      const secondaryNodeMap = new Map<string, LeafPoint>()

      // First pass: Secondary Nodes (level 2)
      specs
        .filter((s) => s.level === 2)
        .forEach((s) => {
          const ma = sa + s.angleShift
          const mx = x + Math.cos(ma) * s.dist
          const my = y + Math.sin(ma) * s.dist
          secondaryNodeMap.set(s.id, { x: mx, y: my })

          const tendrilBend = (s.angleShift > 0 ? 1 : -1) * 6
          const tendrilPath = quad(x, y, mx, my, tendrilBend)
          const microFlowPath = `${skillFlowPath} ${stripStart(tendrilPath)}`

          const mn: MicroNodeLayout = {
            id: s.id,
            skillId: id,
            label: s.label,
            kind: s.kind,
            x: mx,
            y: my,
            angle: (ma * 180) / Math.PI,
            path: tendrilPath,
            flowPath: microFlowPath,
            level: 2,
          }
          clusterNodes.push(mn)
          allMicroNodes.push(mn)
        })

      // Second pass: Tertiary Nodes (level 3) attached to secondary parents
      specs
        .filter((s) => s.level === 3)
        .forEach((s) => {
          const parentPt = s.parentCheckId ? secondaryNodeMap.get(s.parentCheckId) : null
          const originPt = parentPt ?? { x, y }
          const ma = sa + s.angleShift
          const tx = originPt.x + Math.cos(ma) * s.dist
          const ty = originPt.y + Math.sin(ma) * s.dist

          const tendrilPath = quad(originPt.x, originPt.y, tx, ty, 3)
          const mn: MicroNodeLayout = {
            id: s.id,
            skillId: id,
            label: s.label,
            kind: s.kind,
            x: tx,
            y: ty,
            angle: (ma * 180) / Math.PI,
            path: tendrilPath,
            flowPath: `${skillFlowPath} ${stripStart(tendrilPath)}`,
            level: 3,
            parentCheckId: s.parentCheckId,
          }
          clusterNodes.push(mn)
          allMicroNodes.push(mn)
        })

      // Skill-Specific Interconnecting Tendrils (Constellations, Bridges, Pipelines)
      if (id === 'render-extract-audit') {
        const sHtml = secondaryNodeMap.get('server-html')
        const cDom = secondaryNodeMap.get('client-dom')
        if (sHtml && cDom) {
          clusterTendrils.push({
            path: `M ${sHtml.x} ${sHtml.y} Q ${(sHtml.x + cDom.x) / 2} ${(sHtml.y + cDom.y) / 2 + 10} ${cDom.x} ${cDom.y}`,
            style: 'bridge',
          })
        }
      } else if (id === 'entity-identity-audit') {
        const oSchema = secondaryNodeMap.get('org-schema')
        const bAlias = secondaryNodeMap.get('brand-aliases')
        const kg = secondaryNodeMap.get('kg-entity')
        if (oSchema && bAlias) {
          clusterTendrils.push({
            path: `M ${oSchema.x} ${oSchema.y} L ${bAlias.x} ${bAlias.y}`,
            style: 'dashed',
          })
        }
        if (bAlias && kg) {
          clusterTendrils.push({
            path: `M ${bAlias.x} ${bAlias.y} L ${kg.x} ${kg.y}`,
            style: 'dashed',
          })
        }
      } else if (id === 'ai-answerability-audit') {
        const qPrompt = secondaryNodeMap.get('question-prompt')
        const fRetrieval = secondaryNodeMap.get('fact-retrieval')
        const cMargin = secondaryNodeMap.get('confidence-margin')
        if (qPrompt && fRetrieval && cMargin) {
          clusterTendrils.push({
            path: `M ${qPrompt.x} ${qPrompt.y} Q ${(qPrompt.x + fRetrieval.x) / 2} ${(qPrompt.y + fRetrieval.y) / 2} ${fRetrieval.x} ${fRetrieval.y} Q ${(fRetrieval.x + cMargin.x) / 2} ${(fRetrieval.y + cMargin.y) / 2} ${cMargin.x} ${cMargin.y}`,
            style: 'solid',
          })
        }
      } else if (id === 'corroboration-consistency-audit') {
        const s1 = secondaryNodeMap.get('onsite-claims')
        const s2 = secondaryNodeMap.get('external-sources')
        const cFact = secondaryNodeMap.get('consensus-fact')
        if (s1 && s2 && cFact) {
          clusterTendrils.push({
            path: `M ${s1.x} ${s1.y} L ${cFact.x} ${cFact.y} M ${s2.x} ${s2.y} L ${cFact.x} ${cFact.y}`,
            style: 'dashed',
          })
        }
      } else if (id === 'citation-extractability-audit') {
        const claim = secondaryNodeMap.get('attributable-claims')
        const anchor = secondaryNodeMap.get('stable-anchors')
        const syntax = secondaryNodeMap.get('structured-facts')
        if (claim && anchor && syntax) {
          clusterTendrils.push({
            path: `M ${claim.x} ${claim.y} Q ${(claim.x + anchor.x) / 2} ${(claim.y + anchor.y) / 2} ${anchor.x} ${anchor.y} L ${syntax.x} ${syntax.y}`,
            style: 'dashed',
          })
        }
      } else if (id === 'freshness-audit') {
        const pub = secondaryNodeMap.get('published-date')
        const mod = secondaryNodeMap.get('modified-signal')
        const cad = secondaryNodeMap.get('update-cadence')
        if (pub && mod && cad) {
          clusterTendrils.push({
            path: `M ${pub.x} ${pub.y} L ${mod.x} ${mod.y} L ${cad.x} ${cad.y}`,
            style: 'solid',
          })
        }
      } else if (id === 'crawl-access-audit') {
        const rob = secondaryNodeMap.get('robots-txt')
        const sts = secondaryNodeMap.get('status-codes')
        const smp = secondaryNodeMap.get('sitemap-xml')
        if (rob && sts && smp) {
          clusterTendrils.push({
            path: `M ${rob.x} ${rob.y} Q ${(sts.x + smp.x) / 2} ${(sts.y + smp.y) / 2} ${smp.x} ${smp.y}`,
            style: 'dashed',
          })
        }
      } else if (id === 'site-type-classifier') {
        const tmpl = secondaryNodeMap.get('template-detect')
        const comm = secondaryNodeMap.get('commerce-signals')
        if (tmpl && comm) {
          clusterTendrils.push({
            path: `M ${tmpl.x} ${tmpl.y} L ${comm.x} ${comm.y}`,
            style: 'dashed',
          })
        }
      }

      clusters.push({
        skillId: id,
        clusterType: id,
        microNodes: clusterNodes,
        tendrils: clusterTendrils,
      })
    })
  })

  return { root, limbs, nodes, branches, clusters, microNodes: allMicroNodes }
}

export function computeAmbientRoots(
  cx: number,
  cy: number,
  reach: number,
  count = 9,
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
    const len = reach * (0.65 + rand() * 0.55)
    const ex = cx + Math.cos(angle) * len
    const ey = cy + Math.sin(angle) * len
    const perp = angle + Math.PI / 2
    const bend = (rand() - 0.5) * reach * 0.35
    const mx = cx + Math.cos(angle) * len * 0.45 + Math.cos(perp) * bend
    const my = cy + Math.sin(angle) * len * 0.45 + Math.sin(perp) * bend
    paths.push(`M ${n(cx)} ${n(cy)} Q ${n(mx)} ${n(my)} ${n(ex)} ${n(ey)}`)
    if (rand() > 0.4) {
      const fork = 0.55 + rand() * 0.20
      const fx = cx + (ex - cx) * fork
      const fy = cy + (ey - cy) * fork
      const fex = fx + Math.cos(angle + (rand() - 0.5) * 0.8) * len * 0.26
      const fey = fy + Math.sin(angle + (rand() - 0.5) * 0.8) * len * 0.26
      paths.push(`M ${n(fx)} ${n(fy)} Q ${n((fx + fex) / 2)} ${n((fy + fey) / 2)} ${n(fex)} ${n(fey)}`)
    }
  }
  return paths
}
