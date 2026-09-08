/**
 * DEMO / MOCK DATA LAYER
 *
 * Everything in this file is fabricated for demonstration and is NOT the
 * output of a real audit. It exists so the visual system can be exercised
 * end-to-end before the backend is connected.
 *
 * TODO(backend): replace `buildDemoResult` and `buildInitialSkills` with data
 * derived from real skill outputs, and drive the event stream in `engine.ts`
 * from the backend's event log instead of the simulated timeline.
 */

import type {
  AuditResult,
  Confidence,
  Dimension,
  DimensionScore,
  Finding,
  RootCause,
  Severity,
  SkillId,
  SkillRun,
} from './types'
import { RUN_ORDER, SKILL_MAP } from './skills'

export const IS_DEMO = true

export const SAMPLE_URLS = [
  'https://stripe.com',
  'https://shopify.com',
  'https://etsy.com',
  'https://linear.app',
  'https://vercel.com',
]

/** Deterministic tiny PRNG so a given host always audits the same way. */
function seededRandom(seed: string) {
  let h = 2166136261
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h += 0x6d2b79f5
    let t = h
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
  }
}

export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

export function isValidUrl(raw: string): boolean {
  const url = normalizeUrl(raw)
  try {
    const u = new URL(url)
    return !!u.host && u.host.includes('.')
  } catch {
    return false
  }
}

/** Skills in their dormant pre-run state. */
export function buildInitialSkills(): SkillRun[] {
  return RUN_ORDER.map((id) => ({
    id,
    status: 'dormant' as const,
    progress: 0,
    pagesInspected: 0,
    checks: SKILL_MAP[id].checks.map((label) => ({ label, state: 'pending' as const })),
  }))
}

const SEV_ORDER: Record<Severity, number> = { critical: 0, high: 1, medium: 2, low: 3 }

function labelForScore(score: number): DimensionScore['label'] {
  if (score >= 78) return 'strong'
  if (score >= 62) return 'adequate'
  if (score >= 45) return 'at-risk'
  return 'weak'
}

/**
 * Produces a coherent, evidence-shaped diagnosis. The narrative is fixed so it
 * reads realistically; the seed only nudges numbers and a couple of statuses.
 */
export function buildDemoResult(url: string): AuditResult {
  const host = hostOf(url)
  const rnd = seededRandom(host)
  const jitter = (base: number, spread: number) =>
    Math.round(base + (rnd() - 0.5) * spread)

  const discoverability = clamp(jitter(74, 22))
  const understanding = clamp(jitter(58, 26))
  const trust = clamp(jitter(52, 28))
  const engagement = clamp(jitter(67, 24))

  const dimensionScores: DimensionScore[] = [
    { dimension: 'discoverability', score: discoverability, label: labelForScore(discoverability) },
    { dimension: 'understanding', score: understanding, label: labelForScore(understanding) },
    { dimension: 'trust', score: trust, label: labelForScore(trust) },
    { dimension: 'engagement', score: engagement, label: labelForScore(engagement) },
  ]

  const rootCauses: RootCause[] = [
    {
      id: 'rc-client-rendering',
      label: 'Client-rendered key content',
      detail:
        'Pricing and product facts are injected after hydration, so non-browser agents receive an empty shell.',
      parentId: null,
      severity: 'high',
      findingIds: ['f-render', 'f-citation'],
    },
    {
      id: 'rc-extraction-gap',
      label: 'Machine extraction gap',
      detail:
        'Because the facts never appear in the initial response, extraction models cannot lift them cleanly.',
      parentId: 'rc-client-rendering',
      severity: 'high',
      findingIds: ['f-citation'],
    },
    {
      id: 'rc-weak-evidence',
      label: 'Weak, non-attributable evidence',
      detail:
        'What can be extracted is not self-contained — claims lack stable anchors and structured markup.',
      parentId: 'rc-extraction-gap',
      severity: 'medium',
      findingIds: ['f-citation', 'f-corrob'],
    },
    {
      id: 'rc-answerability',
      label: 'AI answerability risk',
      detail:
        'With thin, unattributable evidence the model cannot answer brand questions with confidence.',
      parentId: 'rc-weak-evidence',
      severity: 'high',
      findingIds: ['f-answer'],
    },
    {
      id: 'rc-substitution',
      label: 'Potential source substitution',
      detail:
        'The assistant falls back to third-party sources, so a competitor or aggregator answers for the brand.',
      parentId: 'rc-answerability',
      severity: 'critical',
      findingIds: ['f-answer', 'f-entity'],
    },
  ]

  const findings: Finding[] = [
    {
      id: 'f-render',
      skillId: 'render-extract-audit',
      dimension: 'discoverability',
      title: 'Primary content requires client-side rendering',
      severity: rnd() > 0.5 ? 'high' : 'medium',
      confidence: 'high',
      description:
        'On sampled pages the main content area is populated by client-side scripts. Agents that do not execute JavaScript receive a largely empty document.',
      whyItMatters:
        'Many AI crawlers and answer engines do not fully render JavaScript. If the substance only exists after hydration, it is invisible to them.',
      evidence: [
        { id: 'e-render-1', label: 'Server-rendered main content', detail: '3 / 18 sampled pages', signal: 'main-ratio', confidence: 'high' },
        { id: 'e-render-2', label: 'Content injected post-hydration', detail: '15 / 18 sampled pages', signal: 'hydration', url: `${url.replace(/\/$/, '')}/pricing`, confidence: 'high' },
        { id: 'e-render-3', label: 'Median server HTML main-ratio', detail: '11%', reference: 'DOM main/body text ratio', signal: 'extract-ratio' },
      ],
      affectedPages: 15,
      sampledPages: 18,
      recommendation: {
        id: 'r-render',
        title: 'Server-render or pre-render primary content',
        detail:
          'Ensure pricing, product and claim content is present in the initial HTML response via SSR, SSG or edge rendering.',
        priority: 'high',
        effort: 'medium',
      },
      rootCauseId: 'rc-client-rendering',
    },
    {
      id: 'f-citation',
      skillId: 'citation-extractability-audit',
      dimension: 'trust',
      title: 'Pricing is not available in a self-contained extractable form',
      severity: 'high',
      confidence: 'high',
      description:
        'Pricing information is fragmented across interactive widgets and lacks structured data, so it cannot be quoted as a single attributable fact.',
      whyItMatters:
        'When a fact is not self-contained, an AI cannot cite it confidently and will either omit it or paraphrase a competitor.',
      evidence: [
        { id: 'e-cit-1', label: 'Pages with extractable pricing', detail: '6 / 18 sampled pages', signal: 'citation-window', confidence: 'high' },
        { id: 'e-cit-2', label: 'Structured data (Offer/Product)', detail: 'Not detected', signal: 'json-ld' },
        { id: 'e-cit-3', label: 'Stable anchors for claims', detail: '2 / 18 sampled pages', url: `${url.replace(/\/$/, '')}/pricing`, signal: 'anchor' },
      ],
      affectedPages: 12,
      sampledPages: 18,
      recommendation: {
        id: 'r-citation',
        title: 'Publish self-contained, structured pricing',
        detail:
          'Add Product/Offer structured data and express each price as a complete sentence with a stable anchor.',
        priority: 'high',
        effort: 'medium',
      },
      rootCauseId: 'rc-weak-evidence',
    },
    {
      id: 'f-entity',
      skillId: 'entity-identity-audit',
      dimension: 'understanding',
      title: 'Brand is ambiguous against similarly named entities',
      severity: rnd() > 0.6 ? 'medium' : 'high',
      confidence: 'medium',
      description:
        'The organization identity is under-specified and overlaps with other entities sharing the name, weakening disambiguation.',
      whyItMatters:
        'If machines cannot confidently resolve the brand as a distinct entity, answers get attributed to the wrong organization.',
      evidence: [
        { id: 'e-ent-1', label: 'Organization structured data', detail: 'Partial — missing sameAs links' },
        { id: 'e-ent-2', label: 'Named-entity collisions', detail: '4 competing entities' },
        { id: 'e-ent-3', label: 'Pages inspected', detail: '14 pages' },
      ],
      affectedPages: 14,
      sampledPages: 14,
      recommendation: {
        id: 'r-entity',
        title: 'Strengthen organization identity',
        detail:
          'Add complete Organization markup with sameAs links to authoritative profiles to disambiguate the brand.',
        priority: 'medium',
        effort: 'low',
      },
      rootCauseId: 'rc-substitution',
    },
    {
      id: 'f-answer',
      skillId: 'ai-answerability-audit',
      dimension: 'understanding',
      title: 'Brand questions cannot be answered from the site alone',
      severity: 'critical',
      confidence: 'high',
      description:
        'For a representative set of brand questions, the site could not supply a grounded answer and the model fell back to external sources.',
      whyItMatters:
        'When the brand cannot answer for itself, an aggregator or competitor becomes the cited source of truth.',
      evidence: [
        { id: 'e-ans-1', label: 'Questions answered from site', detail: '5 / 12 questions', signal: 'closed-book', confidence: 'high' },
        { id: 'e-ans-2', label: 'Answers grounded in a citation', detail: '4 / 12 questions', signal: 'grounding' },
        { id: 'e-ans-3', label: 'Fell back to third-party source', detail: '7 / 12 questions', signal: 'source-substitution', url: url },
      ],
      affectedPages: 12,
      sampledPages: 12,
      recommendation: {
        id: 'r-answer',
        title: 'Close the top answerability gaps first',
        detail:
          'Prioritize the seven unanswered questions by publishing self-contained, server-rendered answers for each.',
        priority: 'critical',
        effort: 'medium',
      },
      rootCauseId: 'rc-answerability',
    },
    {
      id: 'f-fresh',
      skillId: 'freshness-audit',
      dimension: 'trust',
      title: 'Content lacks recency signals',
      severity: 'medium',
      confidence: 'medium',
      description:
        'Most pages expose no published or modified date, so machines cannot judge how current the information is.',
      whyItMatters:
        'Without recency signals, current information may be treated as stale and de-prioritized.',
      evidence: [
        { id: 'e-fr-1', label: 'Pages with a modified date', detail: '3 / 18 sampled pages' },
        { id: 'e-fr-2', label: 'Detectable update cadence', detail: 'None' },
      ],
      affectedPages: 15,
      sampledPages: 18,
      recommendation: {
        id: 'r-fresh',
        title: 'Expose published & modified dates',
        detail: 'Add dateModified to key pages and maintain a visible changelog for factual content.',
        priority: 'medium',
        effort: 'low',
      },
    },
    {
      id: 'f-corrob',
      skillId: 'corroboration-consistency-audit',
      dimension: 'trust',
      title: 'Pricing claims disagree between pages',
      severity: 'medium',
      confidence: 'medium',
      description:
        'The pricing shown on the marketing page does not match the pricing page for two tiers, creating a contradiction.',
      whyItMatters:
        'Contradictory claims lower machine trust and make it unclear which figure is canonical.',
      evidence: [
        { id: 'e-co-1', label: 'Contradictory claim pairs', detail: '2 detected' },
        { id: 'e-co-2', label: 'Canonical source declared', detail: 'No' },
      ],
      affectedPages: 4,
      sampledPages: 18,
      recommendation: {
        id: 'r-corrob',
        title: 'Establish a single canonical pricing source',
        detail: 'Reference one source of truth for pricing and remove or sync duplicated figures.',
        priority: 'medium',
        effort: 'low',
      },
      rootCauseId: 'rc-weak-evidence',
    },
    {
      id: 'f-engage',
      skillId: 'engagement-handoff-audit',
      dimension: 'engagement',
      title: 'Primary action is present but not machine-legible',
      severity: 'low',
      confidence: 'high',
      description:
        'A clear primary action exists but is implemented as a generic control without descriptive, machine-readable labeling.',
      whyItMatters:
        'An assistant needs legible actions to hand a user off; ambiguous controls reduce successful routing.',
      evidence: [
        { id: 'e-eng-1', label: 'Primary action detected', detail: 'Yes' },
        { id: 'e-eng-2', label: 'Descriptive accessible name', detail: 'Partial' },
      ],
      affectedPages: 6,
      sampledPages: 18,
      recommendation: {
        id: 'r-engage',
        title: 'Make primary actions descriptive',
        detail: 'Give conversion controls explicit, descriptive accessible names and consistent intent labels.',
        priority: 'low',
        effort: 'low',
      },
    },
    {
      id: 'f-limit',
      skillId: 'crawl-access-audit',
      dimension: 'discoverability',
      title: 'A section could not be inspected',
      severity: 'low',
      confidence: 'low',
      description:
        'The account area returned a challenge response, so it was not audited.',
      whyItMatters:
        'This is a limitation of the audit, not necessarily a defect of the site. Results exclude this section.',
      evidence: [
        { id: 'e-lim-1', label: 'Origin response', detail: '403 challenge on /app/*', url: `${url.replace(/\/$/, '')}/app`, signal: 'access-kind' },
        { id: 'e-lim-2', label: 'Pages skipped', detail: '2 routes', signal: 'coverage' },
      ],
      affectedPages: 2,
      sampledPages: 20,
      recommendation: {
        id: 'r-limit',
        title: 'Allow audit access to public routes',
        detail: 'If these routes should be discoverable, allow-list the auditor or expose a public equivalent.',
        priority: 'low',
        effort: 'low',
      },
      isLimitation: true,
      limitationReason: 'The origin returned a challenge response (HTTP 403) for this section.',
    },
  ]

  findings.sort((a, b) => SEV_ORDER[a.severity] - SEV_ORDER[b.severity])

  const counts = {
    critical: findings.filter((f) => f.severity === 'critical' && !f.isLimitation).length,
    high: findings.filter((f) => f.severity === 'high' && !f.isLimitation).length,
    medium: findings.filter((f) => f.severity === 'medium' && !f.isLimitation).length,
    total: findings.filter((f) => !f.isLimitation).length,
  }

  return {
    dimensionScores,
    overallLabel: overallLabelFor(dimensionScores),
    overallSummary:
      'The site is broadly reachable, but its most important facts live behind client-side rendering. That single decision cascades into weak extractable evidence and a real risk that AI answers about the brand are sourced elsewhere.',
    counts,
    rootCauses,
    findings,
  }
}

function overallLabelFor(scores: DimensionScore[]): string {
  const avg = scores.reduce((a, s) => a + s.score, 0) / scores.length
  if (avg >= 75) return 'AI-ready'
  if (avg >= 60) return 'Mostly ready'
  if (avg >= 45) return 'At risk'
  return 'Not ready'
}

function clamp(n: number) {
  return Math.max(6, Math.min(97, n))
}

/**
 * Final per-skill outcome used to color the completed diagnostic tree.
 * Derived here from the demo findings so the tree and the findings agree.
 */
export function skillOutcomesFor(result: AuditResult): Record<
  SkillId,
  { status: 'completed' | 'warning' | 'critical' | 'partial' | 'skipped'; confidence: Confidence }
> {
  const worstBySkill = new Map<SkillId, Severity>()
  for (const f of result.findings) {
    if (f.isLimitation) continue
    const cur = worstBySkill.get(f.skillId)
    if (!cur || SEV_ORDER[f.severity] < SEV_ORDER[cur]) worstBySkill.set(f.skillId, f.severity)
  }
  const out = {} as ReturnType<typeof skillOutcomesFor>
  for (const id of RUN_ORDER) {
    const worst = worstBySkill.get(id)
    const limited = result.findings.some((f) => f.skillId === id && f.isLimitation)
    let status: 'completed' | 'warning' | 'critical' | 'partial' | 'skipped' = 'completed'
    if (worst === 'critical') status = 'critical'
    else if (worst === 'high' || worst === 'medium') status = 'warning'
    else if (limited) status = 'partial'
    const conf: Confidence = limited ? 'low' : worst === 'critical' ? 'high' : 'medium'
    out[id] = { status, confidence: conf }
  }
  return out
}

const DIM_META: Record<Dimension, string> = {
  discoverability: 'discoverability',
  understanding: 'understanding',
  trust: 'trust',
  engagement: 'engagement',
}
export { DIM_META }
