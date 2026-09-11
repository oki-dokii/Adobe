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
 *
 * Each skill includes a `consequenceChain` — a 3-step cascade from structural
 * observation to downstream AI behavior outcome. This is rendered in the finding
 * inspector to make the connection between web signals and AI citation explicit.
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
    consequenceChain: [
      'Skill sequencing failure propagates undetected across dimensions',
      'Evidence gaps compound — root causes cannot be reliably identified',
      'Systemic AI visibility issues go uncorrected — brand risk accumulates',
    ],
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
    consequenceChain: [
      'Site type misclassified — wrong evaluation heuristics applied downstream',
      'AI systems calibrate incorrect content expectations for this brand',
      'Brand scored against the wrong peer group — findings and score unreliable',
    ],
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
    consequenceChain: [
      'AI crawlers blocked at the robots.txt or network layer',
      'Brand content excluded from AI discovery index entirely',
      'Brand invisible to AI-mediated search — competitor content fills the vacuum',
    ],
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
    consequenceChain: [
      'Key content only exists after JavaScript hydration — AI crawlers receive an empty shell',
      'Brand claims and facts never enter LLM training or retrieval context',
      'AI answers brand queries using competitor or third-party sources instead',
    ],
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
    consequenceChain: [
      'Brand claims are not self-contained — AI cannot quote them verbatim or attribute them',
      'AI paraphrases inaccurately or substitutes third-party descriptions of the brand',
      'Brand misrepresented in AI-generated answers — competitor cited in brand\'s place',
    ],
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
    consequenceChain: [
      'Brand name is ambiguous — AI conflates the brand with similarly-named competitors or entities',
      'AI retrieval systems select the wrong entity when answering brand queries',
      'Wrong brand recommended to users — brand loses AI-referred traffic to an unrelated entity',
    ],
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
    consequenceChain: [
      'Common brand questions have no grounded answer in the site\'s own content',
      'AI cannot construct a confident, evidence-backed response from the brand\'s site',
      'AI substitutes competitor content — user is never referred to the brand via AI',
    ],
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
    consequenceChain: [
      'Content lacks recency signals — AI systems rank the brand as a stale, lower-priority source',
      'AI prefers fresher competitors when constructing answers about this product category',
      'Brand deprioritised in AI-generated results — competitor with updated content cited instead',
    ],
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
    consequenceChain: [
      'Contradictory claims detected — AI trust score for the brand is reduced',
      'Brand flagged as an unreliable source and excluded from the citation pool',
      'Competitor with consistent, corroborated claims is cited in brand\'s place',
    ],
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
    consequenceChain: [
      'Primary actions are not machine-legible — AI cannot identify the correct next step for the user',
      'AI assistant fails to complete the referral handoff to the brand\'s conversion flow',
      'User journey breaks at the AI→brand boundary — brand loses the AI-referred conversion',
    ],
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
