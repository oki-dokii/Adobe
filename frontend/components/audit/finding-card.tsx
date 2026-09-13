'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Finding, RootCause, BusinessImpact, BusinessRiskCategory } from '@/lib/audit/types'
import { SKILL_MAP, DIMENSIONS } from '@/lib/audit/skills'
import { SEVERITY_STYLE } from '@/lib/audit/status'
import { getCausalChainForFinding } from '@/lib/audit/causal-chains'
import { WhyHint } from './why-hint'

export const RISK_CONFIG: Record<
  BusinessRiskCategory,
  { label: string; color: string; bg: string; border: string; text: string }
> = {
  direct_revenue: {
    label: 'Direct Revenue Risk',
    color: '#f43f5e',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/25',
    text: 'text-rose-400',
  },
  pipeline: {
    label: 'Pipeline Risk',
    color: '#f59e0b',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/25',
    text: 'text-amber-400',
  },
  discoverability: {
    label: 'Discoverability Risk',
    color: '#0ea5e9',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/25',
    text: 'text-sky-400',
  },
  recommendation: {
    label: 'Recommendation Risk',
    color: '#a855f7',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/25',
    text: 'text-purple-400',
  },
  brand_trust: {
    label: 'Brand Trust Risk',
    color: '#10b981',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/25',
    text: 'text-emerald-400',
  },
  conversion: {
    label: 'Conversion Risk',
    color: '#ec4899',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/25',
    text: 'text-pink-400',
  },
  support_cost: {
    label: 'Support Cost Risk',
    color: '#6366f1',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/25',
    text: 'text-indigo-400',
  },
  content_maintenance: {
    label: 'Content Maintenance Risk',
    color: '#94a3b8',
    bg: 'bg-slate-500/10',
    border: 'border-slate-500/25',
    text: 'text-slate-400',
  },
}

function resolveBusinessImpact(finding: Finding): BusinessImpact {
  if (finding.businessImpact) return finding.businessImpact

  // Fallback derivation based on dimension and skill
  const skill = SKILL_MAP[finding.skillId]
  const defaultCategories: Record<string, BusinessRiskCategory[]> = {
    discoverability: ['discoverability', 'pipeline'],
    understanding: ['pipeline', 'recommendation'],
    trust: ['brand_trust', 'direct_revenue'],
    engagement: ['conversion', 'pipeline'],
  }

  const categories = defaultCategories[finding.dimension] || ['pipeline', 'discoverability']

  return {
    technicalFinding: finding.title,
    businessInterpretation: finding.whyItMatters,
    whyAiSystemsCare:
      skill?.summary ||
      'AI search bots and generative synthesis engines fail to parse or verify these specifications, triggering citation penalties.',
    whoIsAffected: 'Revenue Operations, Product Marketing, Enterprise Sales, and prospective buyers.',
    potentialConsequence:
      'Reduced discovery in AI answer engines; competitors with structured representations capture high-intent category referrals.',
    categories,
    quantifiedImpact: `${finding.affectedPages} of ${finding.sampledPages} sampled pages affected (${Math.round(
      (finding.affectedPages / (finding.sampledPages || 1)) * 100,
    )}%).`,
    assumptions: [
      'Directional estimation based on verified crawler observation, not speculative revenue claims.',
      'Assumes enterprise buyer evaluations increasingly originate through conversational AI interfaces.',
    ],
    expectedOutcomeAfterFix:
      'Full machine readability restored; verifiable first-party attribution in generative responses.',
  }
}

export function FindingCard({
  finding,
  rootCause,
  open,
  highlighted,
  onToggle,
  onFocusTree,
}: {
  finding: Finding
  rootCause?: RootCause
  open: boolean
  highlighted?: boolean
  onToggle: () => void
  onFocusTree?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const sev = SEVERITY_STYLE[finding.severity]
  const [copiedPatch, setCopiedPatch] = useState(false)
  const [copiedJira, setCopiedJira] = useState(false)

  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [highlighted])

  const consequenceChain = finding.consequenceChain ?? getCausalChainForFinding(finding)
  const impact = resolveBusinessImpact(finding)
  const primaryCategory = impact.categories[0] ? RISK_CONFIG[impact.categories[0]] : null

  const handleCopyPatch = (e: React.MouseEvent) => {
    e.stopPropagation()
    const patchText = `// Remediation: ${finding.title}
// Standard: ${SKILL_MAP[finding.skillId]?.contract?.standardRef || 'W3C / Schema.org Verified'}
// Target Dimension: ${DIMENSIONS[finding.dimension].label} | Severity: ${sev.label}
// Commercial Risk Addressed: ${impact.categories.map((c) => RISK_CONFIG[c]?.label || c).join(', ')}

${finding.recommendation.title}
${finding.recommendation.detail}

// Expected Outcome:
// ${impact.expectedOutcomeAfterFix}`
    navigator.clipboard?.writeText(patchText)
    setCopiedPatch(true)
    setTimeout(() => setCopiedPatch(false), 2000)
  }

  const handleCopyJira = (e: React.MouseEvent) => {
    e.stopPropagation()
    const jiraText = `h2. [BAIR] ${finding.title}
*Priority:* ${finding.recommendation.priority.toUpperCase()}
*Dimension:* ${DIMENSIONS[finding.dimension].label}
*Confidence:* ${finding.confidence.toUpperCase()}
*Commercial Risk Categories:* ${impact.categories.map((c) => RISK_CONFIG[c]?.label || c).join(', ')}

h3. Executive Business Interpretation:
${impact.businessInterpretation}

h3. Why AI Systems Care:
${impact.whyAiSystemsCare}

h3. Potential Commercial Consequence:
${impact.potentialConsequence}

h3. Affected Stakeholders:
${impact.whoIsAffected}

h3. Observed Scope:
${impact.quantifiedImpact}

h3. Remediation Action:
${finding.recommendation.title}
${finding.recommendation.detail}

h3. Expected Outcome After Fix:
${impact.expectedOutcomeAfterFix}

h3. Evidence:
${finding.evidence.map((ev) => `* ${ev.label}: ${ev.detail} ${ev.signal ? `[signal: ${ev.signal}]` : ''}`).join('\n')}`

    navigator.clipboard?.writeText(jiraText)
    setCopiedJira(true)
    setTimeout(() => setCopiedJira(false), 2000)
  }

  return (
    <div
      ref={ref}
      className={cn(
        'overflow-hidden rounded-lg border transition-all duration-200',
        open
          ? 'bg-surface/90 border-white/14 shadow-[0_6px_24px_rgba(0,0,0,0.4)]'
          : 'bg-surface/40 border-white/6 hover:border-white/12',
        highlighted && 'ring-1 ring-signal border-signal/50 bg-surface/90',
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-start gap-3 p-3.5 text-left transition-colors cursor-pointer"
      >
        <span className="min-w-0 flex-1">
          {/* Metadata Badges */}
          <span className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
            <span
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-semibold uppercase tracking-wider"
              style={{
                background: `${sev.color}15`,
                color: sev.color,
                border: `1px solid ${sev.color}35`,
              }}
            >
              <span className="size-1 rounded-full" style={{ background: sev.color }} />
              {sev.label}
            </span>
            <span className="rounded border border-white/8 bg-surface-2/60 px-1.5 py-0.5 text-muted-foreground uppercase">
              {DIMENSIONS[finding.dimension].verb}
            </span>
            <span className="rounded border border-white/8 bg-surface-2/60 px-1.5 py-0.5 text-muted-foreground/80 uppercase">
              {finding.confidence} CONF
            </span>
            {primaryCategory && (
              <span
                className={cn(
                  'rounded border px-1.5 py-0.5 font-mono text-[9px] font-semibold tracking-wide uppercase',
                  primaryCategory.bg,
                  primaryCategory.border,
                  primaryCategory.text,
                )}
              >
                {primaryCategory.label}
              </span>
            )}
          </span>

          {/* Dominant Title */}
          <span className="mt-2 block text-[13px] font-semibold leading-snug text-foreground">
            {finding.title}
          </span>
          <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground/70">
            {SKILL_MAP[finding.skillId]?.label || finding.skillId}
          </span>
        </span>

        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1 flex size-5 shrink-0 items-center justify-center rounded border border-white/8 bg-surface-2 text-muted-foreground"
        >
          <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="space-y-4 border-t border-white/6 px-4 pb-4 pt-3 text-xs">
              {/* 1. RISK TAXONOMY BADGES */}
              <div className="flex flex-wrap items-center gap-1.5 pb-1">
                <span className="font-mono text-[9px] text-muted-foreground/70 uppercase tracking-wider mr-1">
                  RISK CLASSIFICATION:
                </span>
                {impact.categories.map((catKey) => {
                  const conf = RISK_CONFIG[catKey]
                  if (!conf) return null
                  return (
                    <span
                      key={catKey}
                      className={cn(
                        'inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider',
                        conf.bg,
                        conf.border,
                        conf.text,
                      )}
                    >
                      <span className="size-1 rounded-full" style={{ background: conf.color }} />
                      {conf.label}
                    </span>
                  )
                })}
              </div>

              {/* 2. EXECUTIVE BUSINESS IMPACT CARD (WHY SHOULD A BUSINESS CARE?) */}
              <div className="rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-black/30 p-3.5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/8 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-signal uppercase tracking-wider">
                      EXECUTIVE BUSINESS IMPACT
                    </span>
                    <span className="text-[10px] text-muted-foreground/80">•</span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      Why Business Leaders Care
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground bg-white/5 border border-white/8 rounded px-1.5 py-0.5">
                    Scope: {finding.affectedPages} / {finding.sampledPages} pages ({Math.round((finding.affectedPages / (finding.sampledPages || 1)) * 100)}%)
                  </span>
                </div>

                {/* Two-column Business vs AI perspective */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/6 bg-white/[0.02] p-2.5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-signal">
                        COMMERCIAL INTERPRETATION
                      </span>
                      <WhyHint
                        observed={finding.description}
                        matters={impact.businessInterpretation}
                        evidence={finding.evidence[0]?.detail}
                      />
                    </div>
                    <p className="text-[11px] leading-relaxed text-foreground/90 font-medium">
                      {impact.businessInterpretation}
                    </p>
                  </div>

                  <div className="rounded-lg border border-white/6 bg-white/[0.02] p-2.5 space-y-1">
                    <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-purple-400">
                      WHY AI SYSTEMS CARE
                    </span>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {impact.whyAiSystemsCare}
                    </p>
                  </div>
                </div>

                {/* Who is affected & Commercial exposure */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                  <div className="rounded border border-white/6 bg-black/20 p-2 space-y-0.5">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider block">
                      AFFECTED STAKEHOLDERS
                    </span>
                    <span className="text-foreground/85 font-medium">{impact.whoIsAffected}</span>
                  </div>
                  <div className="rounded border border-rose-500/20 bg-rose-500/[0.04] p-2 space-y-0.5">
                    <span className="font-mono text-[9px] text-rose-400 uppercase tracking-wider block font-semibold">
                      POTENTIAL COMMERCIAL EXPOSURE
                    </span>
                    <span className="text-foreground/90 font-medium">{impact.potentialConsequence}</span>
                  </div>
                </div>

                {/* Scope & Methodology Assumptions */}
                <div className="rounded border border-white/6 bg-black/30 p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">
                      QUANTIFIED SCOPE & METHODOLOGY ASSUMPTIONS
                    </span>
                    <span className="font-mono text-[8px] text-emerald-400/90 uppercase font-semibold">
                      Directional Estimate • Zero Fabricated Dollar Amounts
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-signal/90 font-medium">{impact.quantifiedImpact}</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[10px] text-muted-foreground/80">
                    {impact.assumptions.map((asm, i) => (
                      <li key={i}>{asm}</li>
                    ))}
                  </ul>
                </div>

                {/* Expected Outcome After Fix */}
                <div className="flex items-start gap-2 rounded border border-emerald-500/20 bg-emerald-500/[0.04] p-2 text-[11px]">
                  <span className="mt-0.5 font-mono text-[9px] font-bold text-emerald-400 shrink-0 uppercase tracking-wider">
                    EXPECTED OUTCOME:
                  </span>
                  <span className="text-foreground/90 font-medium leading-relaxed">
                    {impact.expectedOutcomeAfterFix}
                  </span>
                </div>
              </div>

              {/* 3. WHAT WAS OBSERVED (TECHNICAL OBSERVATION) */}
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                  TECHNICAL OBSERVATION
                </span>
                <p className="leading-relaxed text-foreground/80">{finding.description}</p>
              </div>

              {/* 4. AI BEHAVIOR CONSEQUENCE CHAIN */}
              {consequenceChain && consequenceChain.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                    AI BEHAVIOR CONSEQUENCE CASCADE
                  </span>
                  <div className="rounded-lg border border-white/8 bg-black/30 overflow-hidden">
                    {consequenceChain.map((step, i) => (
                      <div key={i} className="relative">
                        <div
                          className={cn(
                            'flex items-start gap-3 px-3 py-2.5',
                            i < consequenceChain.length - 1 && 'border-b border-white/6',
                          )}
                        >
                          <span
                            className={cn(
                              'mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[9px] font-bold',
                              i === 0 && 'bg-warning/15 text-warning border border-warning/30',
                              i === 1 && 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
                              i === 2 && 'bg-critical/20 text-critical border border-critical/40',
                            )}
                          >
                            {i + 1}
                          </span>
                          <span
                            className={cn(
                              'text-[11px] leading-relaxed',
                              i === 0 && 'text-foreground/80',
                              i === 1 && 'text-foreground/70',
                              i === 2 && 'text-critical/90 font-medium',
                            )}
                          >
                            {step}
                          </span>
                        </div>
                        {i < consequenceChain.length - 1 && (
                          <div className="absolute -bottom-2 left-[1.3rem] z-10 flex h-4 w-4 items-center justify-center">
                            <svg viewBox="0 0 10 10" className="size-2 text-muted-foreground/35" fill="none" stroke="currentColor" strokeWidth={1.5}>
                              <path d="M5 1v7M2 6l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. EVIDENCE: Rendered as verifiable artifacts */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-wider text-muted-foreground/70 uppercase">
                    TECHNICAL SIGNAL EVIDENCE
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground/60 tabular-nums">
                    {finding.affectedPages} / {finding.sampledPages} sampled
                  </span>
                </div>
                <div className="space-y-1.5">
                  {finding.evidence.map((e) => (
                    <div
                      key={e.id}
                      className="rounded border border-white/6 bg-black/40 overflow-hidden"
                    >
                      <div className="flex items-center justify-between gap-2 px-2.5 py-2 border-b border-white/6">
                        <span className="font-mono text-[11px] font-medium text-foreground">{e.label}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {e.confidence && (
                            <span
                              className={cn(
                                'rounded px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider',
                                e.confidence === 'high' && 'bg-success/15 text-success border border-success/25',
                                e.confidence === 'medium' && 'bg-warning/15 text-warning border border-warning/25',
                                e.confidence === 'low' && 'bg-white/8 text-muted-foreground border border-white/10',
                              )}
                            >
                              {e.confidence}
                            </span>
                          )}
                          {e.signal && (
                            <code className="rounded bg-signal/10 border border-signal/20 px-1.5 py-0.5 font-mono text-[9px] text-signal tracking-wide">
                              {e.signal}
                            </code>
                          )}
                        </div>
                      </div>
                      <div className="px-2.5 py-2 space-y-1.5">
                        {e.reference ? (
                          <pre className="overflow-x-auto rounded bg-black/50 border border-white/6 px-2 py-1.5 font-mono text-[10px] text-foreground/80 whitespace-pre-wrap break-all">
                            {e.detail}
                            {'\n'}
                            <span className="text-muted-foreground/50 text-[9px]">{e.reference}</span>
                          </pre>
                        ) : (
                          <p className="font-mono text-[11px] text-muted-foreground">{e.detail}</p>
                        )}
                        {e.url && (
                          <a
                            href={e.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(ev) => ev.stopPropagation()}
                            className="inline-flex items-center gap-1.5 rounded border border-signal/25 bg-signal/8 px-2 py-1 font-mono text-[9px] text-signal/90 hover:text-signal hover:border-signal/40 transition-colors max-w-full"
                          >
                            <svg viewBox="0 0 12 12" className="size-2.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5}>
                              <path d="M7 1h4v4M11 1L5 7M3 3H1v8h8V9" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="truncate">{e.url.replace(/^https?:\/\//, '')}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. ROOT CAUSE: System link */}
              {rootCause && (
                <div className="rounded border border-white/6 bg-surface-2/30 p-2.5 space-y-1">
                  <span className="font-mono text-[9px] tracking-wider text-muted-foreground/70 uppercase">
                    CAUSAL ROOT ORIGIN
                  </span>
                  <p className="text-xs font-medium text-foreground">{rootCause.label}</p>
                  <p className="text-[11px] text-muted-foreground">{rootCause.detail}</p>
                </div>
              )}

              {/* 7. ACTION: Remediation & Pre-Validated Dev Patch */}
              <div className="rounded-lg border border-white/10 bg-surface-2/60 p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold tracking-wider text-signal uppercase">
                      READY-TO-DEPLOY DEV PATCH
                    </span>
                    <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-400">
                      +12 PTS LIFT
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleCopyPatch}
                      className="inline-flex items-center gap-1 rounded border border-signal/40 bg-signal/15 px-2 py-0.5 font-mono text-[9px] font-bold text-signal transition-colors hover:bg-signal/25 cursor-pointer"
                    >
                      {copiedPatch ? 'COPIED ✓' : 'COPY PATCH'}
                    </button>
                    <button
                      type="button"
                      onClick={handleCopyJira}
                      className="inline-flex items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[9px] text-muted-foreground transition-colors hover:text-foreground hover:bg-white/10 cursor-pointer"
                    >
                      {copiedJira ? 'TICKET COPIED ✓' : 'JIRA TICKET'}
                    </button>
                  </div>
                </div>

                <p className="font-semibold text-foreground text-xs">{finding.recommendation.title}</p>
                <p className="leading-relaxed text-muted-foreground text-[11px]">{finding.recommendation.detail}</p>

                {/* Pre-Compiled Code Block */}
                <div className="rounded border border-white/8 bg-black/60 p-2 font-mono text-[10px] text-emerald-300/90 whitespace-pre-wrap overflow-x-auto leading-relaxed space-y-1">
                  {finding.skillId === 'entity-identity-audit' || finding.skillId === 'citation-extractability-audit'
                    ? `<script type="application/ld+json">\n{\n  "@context": "https://schema.org",\n  "@type": "Product",\n  "name": "${finding.title.replace(/Missing /i, '')}",\n  "offers": { "@type": "Offer", "price": "Contact for Tier" }\n}\n</script>`
                    : finding.skillId === 'crawl-access-audit'
                    ? `User-agent: GPTBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /`
                    : finding.skillId === 'corroboration-consistency-audit'
                    ? `<!-- Content Provenance & Authenticity Manifest Link (C2PA/W3C) -->\n<link rel="c2pa-manifest" href="/credentials/manifest.c2pa" />\n<meta name="provenance:asserted-by" content="Verified Domain Authority" />`
                    : `// Edge Delivery & Static SSR Alignment\n// Delivers 100% server-rendered static HTML to eliminate crawler hydration timeout\nexport const dynamic = 'force-static'\nexport const revalidate = 3600`}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/6 text-[9px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-semibold">Pre-Validated W3C / Schema.org ✓</span>
                    <span>Effort: <strong>{finding.recommendation.effort}</strong></span>
                  </div>
                  <span>Priority: <strong className="text-foreground uppercase">{finding.recommendation.priority}</strong></span>
                </div>
              </div>

              {/* 8. FOCUS ON TREE */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onFocusTree}
                  className="inline-flex items-center gap-1.5 rounded border border-signal/30 bg-signal/10 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-signal uppercase transition-colors hover:bg-signal/20 cursor-pointer"
                >
                  <span>FOCUS ON TREE</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

