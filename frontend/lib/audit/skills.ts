import type { Dimension, SkillDef, SkillId } from './types'

export const DIMENSIONS: Record<
  Dimension,
  { label: string; verb: string; description: string }
> = {
  discoverability: {
    label: 'Discoverability',
    verb: 'Find',
    description: 'Can automated systems reach and read the site at all?',
  },
  understanding: {
    label: 'Understanding',
    verb: 'Understand',
    description: 'Can machines parse what the brand is and what it offers?',
  },
  trust: {
    label: 'Trust',
    verb: 'Trust',
    description: 'Is the information consistent, corroborated and current?',
  },
  engagement: {
    label: 'Engagement',
    verb: 'Engage',
    description: 'Can an AI hand a user off to the right next action?',
  },
}

/**
 * The production audit architecture. The orchestrator is the entrypoint / root
 * coordinator; the remaining nine skills are composed branches of one system.
 */
export const SKILLS: SkillDef[] = [
  {
    id: 'audit-orchestrator',
    label: 'Audit Orchestrator',
    short: 'Orchestrator',
    dimension: 'discoverability',
    summary: 'Coordinates every skill and composes their evidence into one diagnosis.',
    purpose:
      'The entrypoint of the audit. It plans the run, sequences the specialized skills, routes evidence between them and reconciles findings into root causes.',
    checks: ['Run planning', 'Skill sequencing', 'Evidence routing', 'Finding reconciliation'],
  },
  {
    id: 'site-type-classifier',
    label: 'Site Type Classifier',
    short: 'Site Type',
    dimension: 'understanding',
    summary: 'Determines what kind of site this is so later skills calibrate correctly.',
    purpose:
      'Classifies the site (marketing, docs, commerce, app) so downstream skills apply the right expectations and sampling strategy.',
    checks: ['Template detection', 'Content taxonomy', 'Commerce signals', 'Locale detection'],
  },
  {
    id: 'crawl-access-audit',
    label: 'Crawl Access',
    short: 'Crawl Access',
    dimension: 'discoverability',
    summary: 'Checks whether crawlers can reach pages without being blocked.',
    purpose:
      'Verifies robots directives, status codes, challenge responses and sitemap health so machines can actually reach the content.',
    checks: ['robots.txt', 'Status codes', 'Challenge responses', 'Sitemap coverage'],
  },
  {
    id: 'render-extract-audit',
    label: 'Render & Extract',
    short: 'Render & Extract',
    dimension: 'discoverability',
    summary: 'Tests whether meaningful content survives without a browser runtime.',
    purpose:
      'Renders pages the way non-JS agents see them and measures how much substantive content is available before client-side hydration.',
    checks: ['Server-rendered content', 'Client-only content', 'DOM stability', 'Main content ratio'],
  },
  {
    id: 'citation-extractability-audit',
    label: 'Citation Extractability',
    short: 'Citation Extractability',
    dimension: 'trust',
    summary: 'Checks whether facts are quotable in a self-contained, extractable form.',
    purpose:
      'Assesses whether pricing, claims and specs are expressed as self-contained, attributable statements an AI can cite verbatim.',
    checks: ['Self-contained facts', 'Structured data', 'Attributable claims', 'Stable anchors'],
  },
  {
    id: 'entity-identity-audit',
    label: 'Entity Identity',
    short: 'Entity Identity',
    dimension: 'understanding',
    summary: 'Checks whether machines can distinguish the brand from similar entities.',
    purpose:
      'Determines whether the brand can be confidently identified by automated systems and disambiguated from similarly named entities.',
    checks: ['Organization identity', 'Brand aliases', 'Entity ambiguity', 'Cross-source consistency'],
  },
  {
    id: 'ai-answerability-audit',
    label: 'AI Answerability',
    short: 'AI Answerability',
    dimension: 'understanding',
    summary: 'Simulates the questions AI is asked about the brand and grades the answers.',
    purpose:
      'Runs representative brand questions through an extraction model and measures whether the site can supply grounded, confident answers.',
    checks: ['Question coverage', 'Answer grounding', 'Confidence margin', 'Source substitution risk'],
  },
  {
    id: 'freshness-audit',
    label: 'Freshness',
    short: 'Freshness',
    dimension: 'trust',
    summary: 'Checks whether content signals recency and is kept up to date.',
    purpose:
      'Evaluates published/modified signals, stale claims and changelog cadence so machines can judge how current the information is.',
    checks: ['Published dates', 'Modified signals', 'Stale claims', 'Update cadence'],
  },
  {
    id: 'corroboration-consistency-audit',
    label: 'Corroboration',
    short: 'Corroboration',
    dimension: 'trust',
    summary: 'Checks whether on-site claims agree with each other and third parties.',
    purpose:
      'Cross-references claims across pages and external sources to detect contradictions that erode machine trust.',
    checks: ['Internal consistency', 'Third-party agreement', 'Claim contradictions', 'Canonical source'],
  },
  {
    id: 'engagement-handoff-audit',
    label: 'Engagement Handoff',
    short: 'Engagement Handoff',
    dimension: 'engagement',
    summary: 'Checks whether an AI can route a user to the right next action.',
    purpose:
      'Assesses whether clear, machine-legible actions (buy, book, contact, docs) exist so an assistant can hand a user off correctly.',
    checks: ['Primary actions', 'Action legibility', 'Contact paths', 'Conversion clarity'],
  },
]

export const SKILL_MAP: Record<SkillId, SkillDef> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
) as Record<SkillId, SkillDef>

/** Skills excluding the orchestrator — these are the audit branches. */
export const BRANCH_SKILLS: SkillDef[] = SKILLS.filter((s) => s.id !== 'audit-orchestrator')

/** The order the orchestrator activates branches during a run. */
export const RUN_ORDER: SkillId[] = [
  'site-type-classifier',
  'crawl-access-audit',
  'render-extract-audit',
  'entity-identity-audit',
  'citation-extractability-audit',
  'ai-answerability-audit',
  'freshness-audit',
  'corroboration-consistency-audit',
  'engagement-handoff-audit',
]

/**
 * Four primary limbs. Skills hang off these — this is the visual hierarchy
 * (root → dimension → skill), not a flat radial starburst.
 */
export const LIMBS: { dimension: Dimension; skillIds: SkillId[]; angle: number }[] = [
  { dimension: 'discoverability', skillIds: ['crawl-access-audit', 'render-extract-audit'], angle: -142 },
  {
    dimension: 'understanding',
    skillIds: ['site-type-classifier', 'entity-identity-audit', 'ai-answerability-audit'],
    angle: -48,
  },
  {
    dimension: 'trust',
    skillIds: ['citation-extractability-audit', 'freshness-audit', 'corroboration-consistency-audit'],
    angle: 38,
  },
  { dimension: 'engagement', skillIds: ['engagement-handoff-audit'], angle: 138 },
]
