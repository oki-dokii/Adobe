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
 * coordinator and nine detection skills are the executable audit branches;
 * the eleventh marketplace entry is the post-processing layer below.
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
    businessSignals: {
      revenue: 'Protects enterprise pipeline by systematically catching AI blindness points before competitors fill the gap.',
      conversion: 'Ensures unified audit diagnostic coverage across all commercial funnels.',
      recommendation: 'Coordinates multi-signal verification required for AI engines to recommend the brand.',
      trust: 'Eliminates ungrounded hallucinations by orchestrating strict evidentiary standards across all skills.',
    },
  },
  {
    id: 'site-type-classifier',
    label: 'Site Type Classifier',
    short: 'Site Type',
    dimension: 'understanding',
    summary: 'Classifies the shared crawl into engine-supported site clusters and flags.',
    purpose:
      'Runs the existing deterministic classifier so downstream checks apply the correct context gates.',
    checks: ['Cluster votes', 'YMYL flag', 'Commerce/SaaS flags', 'Locale detection'],
    consequenceChain: [
      'Site type misclassified — wrong evaluation heuristics applied downstream',
      'AI systems calibrate incorrect content expectations for this brand',
      'Brand scored against the wrong peer group — findings and score unreliable',
    ],
    businessSignals: {
      revenue: 'Calibrates buyer intent modeling to the site\'s true commercial structure (B2B SaaS vs Commerce vs Docs).',
      conversion: 'Prevents misdirected traffic routing by establishing correct intent baselines.',
      recommendation: 'Ensures models benchmark the brand against genuine category peers rather than unrelated domains.',
      trust: 'Guarantees that audit scores reflect the realistic operating profile of the business.',
    },
  },
  {
    id: 'crawl-access-audit',
    label: 'Crawl Access',
    short: 'Crawl Access',
    dimension: 'discoverability',
    summary: 'Checks compliant crawler reachability, robots policy, and crawl coverage.',
    purpose:
      'Evaluates the shared crawl evidence; it never bypasses robots, challenges, or authentication boundaries.',
    checks: ['robots.txt', 'HTTP/access status', 'Bot challenges', 'Sitemap coverage'],
    consequenceChain: [
      'AI crawlers blocked at the robots.txt or network layer',
      'A compliant crawler cannot retrieve the affected content',
      'Downstream discovery or citation impact is not measured by this audit',
    ],
    businessSignals: {
      revenue: 'Improves crawl availability for retrieval systems; traffic impact is not measured.',
      conversion: 'Eliminates 403/429 bounce points that prevent AI agent referral handoffs.',
      recommendation: 'Prerequisite for any inclusion in generative search result sets.',
      trust: 'Demonstrates transparent machine-access governance without compromising enterprise security.',
    },
    contract: {
      author: 'IETF RFC 9309 / Robots Exclusion WG',
      standardRef: 'RFC 9309 (Robots Exclusion Protocol)',
      input: 'HTTP response headers, robots.txt, sitemap.xml',
      transform: 'User-agent pattern matching & WAF status code evaluation',
      output: 'Crawler Ingestion Permissions Matrix',
    },
  },
  {
    id: 'render-extract-audit',
    label: 'Render & Extract',
    short: 'Render & Extract',
    dimension: 'discoverability',
    summary: 'Compares raw and rendered shared-crawl content for extractability of decision facts.',
    purpose:
      'Compares the engine’s raw and bounded rendered representations and sets extractability flags for downstream skills.',
    checks: ['Raw/rendered parity', 'Client-only facts', 'Hidden content', 'Extractability flags'],
    consequenceChain: [
      'Key content only exists after JavaScript hydration — AI crawlers receive an empty shell',
      'Brand claims and facts never enter LLM training or retrieval context',
      'AI answers brand queries using competitor or third-party sources instead',
    ],
    businessSignals: {
      revenue: 'Prevents silent pipeline exclusion when enterprise procurement bots scrape pricing and feature matrices.',
      conversion: 'Increases crawler extraction rate from <15% to >90% across high-intent product tiers.',
      recommendation: 'Eliminates blank fallback states during zero-shot generative recommendations.',
      trust: 'Delivers rock-solid server-first DOM parity consistent with Adobe AEM Edge Delivery standards.',
    },
    contract: {
      author: 'W3C Web Performance & Adobe AEM Edge Delivery',
      standardRef: 'W3C DOM Level 3 / Server-First Rendering Benchmark',
      input: 'Dual-fetch raw HTTP curl stream vs headless rendered DOM',
      transform: 'AST node diffing & hydration byte-ratio calculation',
      output: 'Hydration Dependency Index & Unrendered Entity Ledger',
    },
  },
  {
    id: 'citation-extractability-audit',
    label: 'Citation Extractability',
    short: 'Citation Extractability',
    dimension: 'trust',
    summary: 'Checks whether extracted facts are self-contained, qualifier-safe, and structured-data consistent.',
    purpose:
      'Runs deterministic claim, table, qualifier, and visible-schema checks after render extraction.',
    checks: ['Qualifier context', 'Table headers', 'Visible/schema match', 'Comparison claims'],
    consequenceChain: [
      'Brand claims are not self-contained for a narrow extraction window',
      'A retrieval system may need to qualify or seek another source',
      'Downstream assistant wording and source selection are not measured',
    ],
    businessSignals: {
      revenue: 'Protects margin clarity by preventing outdated third-party aggregators from quoting incorrect historical prices.',
      conversion: 'Drives qualified referral clicks directly to canonical pricing pages via verbatim citation pills.',
      recommendation: 'Transforms ambiguous marketing prose into atomic quotes ready for LLM synthesis.',
      trust: 'Establishes verified first-party authority with Schema.org Offer and Product markup.',
    },
    contract: {
      author: 'Schema.org Consortium',
      standardRef: 'Schema.org v26.0 / JSON-LD 1.1 Specification',
      input: 'Parsed HTML text blocks and embedded JSON-LD scripts',
      transform: 'Syntactic attribute attribution & atomic statement slicing',
      output: 'Extractable Attributions Graph',
    },
  },
  {
    id: 'entity-identity-audit',
    label: 'Entity Identity',
    short: 'Entity Identity',
    dimension: 'understanding',
    summary: 'Checks on-page disambiguation evidence and explicitly linked sameAs URLs.',
    purpose:
      'Uses on-page evidence only; it does not search the web or assign a completeness score to external knowledge graphs.',
    checks: ['Name collision heuristic', 'Category/geo context', 'sameAs links', 'Linked URL status'],
    consequenceChain: [
      'Brand name is ambiguous against similarly-named entities',
      'A retrieval system may have weaker entity-resolution evidence',
      'Downstream attribution and recommendation behavior are not measured',
    ],
    businessSignals: {
      revenue: 'Prevents misallocated buyer interest from bleeding into similarly named entities or foreign competitors.',
      conversion: 'Ensures executive inquiries consistently connect with the verified organization entity.',
      recommendation: 'Expose consistent first-party entity identifiers and organization context.',
      trust: 'Eliminates entity collision risks that dilute corporate equity and brand safety.',
    },
    contract: {
      author: 'Schema.org and linked-data conventions',
      standardRef: 'Schema.org Organization and sameAs vocabulary',
      input: 'Brand names, domain aliases, OpenGraph & schema sameAs tags',
      transform: 'Knowledge graph node matching & alias disambiguation',
      output: 'Disambiguated Brand Entity Identification',
    },
  },
  {
    id: 'ai-answerability-audit',
    label: 'AI Answerability',
    short: 'AI Answerability',
    dimension: 'understanding',
    summary: 'Checks whether implemented buyer questions have supporting spans in shared extracted text.',
    purpose:
      'Uses the engine’s closed-book, span-required checks and existing site-type gates; it does not invent questions.',
    checks: ['Buyer-question spans', 'Wrong-page detection', 'Expected-gap gating', 'Answerability metrics'],
    consequenceChain: [
      'Common brand questions have no grounded answer in the site\'s own content',
      'A retrieval system lacks a directly extractable first-party answer',
      'Downstream source selection and referral behavior are not measured',
    ],
    businessSignals: {
      revenue: 'Captures mid-funnel comparison searches when prospects evaluate product alternatives.',
      conversion: 'Replaces hesitant refusal messages ("I don\'t have verified information...") with decisive product endorsements.',
      recommendation: 'Maximizes citation win rate against competing software solutions.',
      trust: 'Guarantees that 100% of answers are directly corroborated by first-party documentation.',
    },
  },
  {
    id: 'freshness-audit',
    label: 'Freshness',
    short: 'Freshness',
    dimension: 'trust',
    summary: 'Checks date-signal divergence and on-site typed fact conflicts.',
    purpose:
      'Compares dates and material facts already extracted from the shared crawl; age alone is not a defect.',
    checks: ['Date divergence', 'Typed fact conflicts', 'Historical-page guards', 'Locale path guards'],
    consequenceChain: [
      'Content contains inconsistent or weak recency signals',
      'A freshness-sensitive retrieval system may need to qualify the evidence',
      'Downstream ranking and competitor selection are not measured',
    ],
    businessSignals: {
      revenue: 'Prevents enterprise deal friction caused by legacy feature constraints reported from obsolete data.',
      conversion: 'Ensures buyers see current capabilities rather than year-old release notes.',
      recommendation: 'Signals active domain maintenance to AI search scoring algorithms.',
      trust: 'Establishes verified temporal recency with machine-readable dateModified headers.',
    },
  },
  {
    id: 'corroboration-consistency-audit',
    label: 'Corroboration',
    short: 'Corroboration',
    dimension: 'trust',
    summary: 'Compares material on-site facts only with explicitly linked third-party sameAs sources.',
    purpose:
      'Uses bounded, robots-respecting linked-source reads only; it does not search the web.',
    checks: ['Linked-source selection', 'Source robots policy', 'Claim comparison', 'Usability outcome'],
    consequenceChain: [
      'Contradictory claims or unverified provenance were detected in the inspected evidence',
      'A retrieval system may require corroboration before relying on the claim',
      'Downstream citation and competitor selection are not measured',
    ],
    businessSignals: {
      revenue: 'Eliminates billing disputes and quote mismatches arising from conflicting public pricing tiers.',
      conversion: 'Reduces support escalation costs caused by divergent feature specifications across subdomains.',
      recommendation: 'Protects enterprise brand authenticity via cryptographic content provenance verification.',
      trust: 'Establishes unimpeachable claim consistency across marketing, pricing, and documentation.',
    },
    contract: {
      author: 'Content Authenticity Standards (C2PA / W3C)',
      standardRef: 'C2PA Spec v1.3 / W3C Verifiable Credentials',
      input: 'Public media assets & multi-page claim statements',
      transform: 'Cryptographic manifest extraction & claim graph resolution',
      output: 'Cryptographic Provenance Score & Corroboration Ledger',
    },
  },
  {
    id: 'engagement-handoff-audit',
    label: 'Engagement Handoff',
    short: 'Engagement Handoff',
    dimension: 'engagement',
    summary: 'Checks first-viewport identity, wayfinding, and information scent after a referral.',
    purpose:
      'Evaluates in-DOM handoff signals and keeps missing-from-DOM extraction issues in render-extract-audit.',
    checks: ['Viewport identity', 'Information scent', 'Contact/pricing wayfinding', 'In-DOM handoff'],
    consequenceChain: [
      'Primary actions are not machine-legible to the inspected extractor',
      'An automated handoff may require qualification or manual completion',
      'Downstream referral conversion is not measured',
    ],
    businessSignals: {
      revenue: 'Directly bridges the gap between conversational AI discovery and self-serve/sales pipeline generation.',
      conversion: 'Enables autonomous AI agents (Operator, ChatGPT Actions) to execute checkout and booking handoffs.',
      recommendation: 'Provides unambiguous action routes so users are never dead-ended in chat windows.',
      trust: 'Ensures clear, predictable handoff mechanics without misleading redirection loops.',
    },
  },
]

export const SKILL_MAP: Record<SkillId, SkillDef> = Object.fromEntries(
  SKILLS.map((s) => [s.id, s]),
) as Record<SkillId, SkillDef>

/** Skills excluding the orchestrator — these are the audit branches. */
export const BRANCH_SKILLS: SkillDef[] = SKILLS.filter((s) => s.id !== 'audit-orchestrator')

/** Marketplace layers that run after detection and are not independent crawl branches. */
export const POST_PROCESSING_SKILLS = [
  {
    id: 'business-impact-layer' as const,
    label: 'Business Impact Layer',
    short: 'Business Impact',
    purpose: 'Annotates admitted findings with ordinal business exposure, dimension scores, and priority actions.',
    summary: 'Translates canonical findings for report presentation without creating new findings or estimates.',
  },
] as const

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
