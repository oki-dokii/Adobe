'use client'

import { useState } from 'react'
import type { AuditResult, Finding, BusinessRiskCategory } from '@/lib/audit/types'
import { DIMENSIONS } from '@/lib/audit/skills'
import { cn } from '@/lib/utils'

export type AudienceRole = 'executive' | 'cmo' | 'seoGeo' | 'engineering' | 'revenue'

const RISK_LABELS: Record<BusinessRiskCategory, string> = {
  direct_revenue: 'Direct Revenue Risk',
  pipeline: 'Pipeline Risk',
  discoverability: 'Discoverability Risk',
  recommendation: 'Recommendation Risk',
  brand_trust: 'Brand Trust Risk',
  conversion: 'Conversion Risk',
  support_cost: 'Support Cost Risk',
  content_maintenance: 'Content Maintenance Risk',
}

export function AudienceBriefings({
  result,
  host,
  avgScore,
  letterGrade,
  percentile,
}: {
  result: AuditResult
  host: string
  avgScore: number
  letterGrade: string
  percentile: number
}) {
  const [activeTab, setActiveTab] = useState<AudienceRole>('executive')

  const tabs: { id: AudienceRole; label: string; tag: string }[] = [
    { id: 'executive', label: 'Executive', tag: 'CEO / Board' },
    { id: 'cmo', label: 'CMO', tag: 'Brand & Share' },
    { id: 'seoGeo', label: 'SEO / GEO', tag: 'Crawlers & Data' },
    { id: 'engineering', label: 'Engineering', tag: 'Sprint Tickets' },
    { id: 'revenue', label: 'Revenue Risk', tag: 'Risk Exposure' },
  ]

  // Findings breakdown
  const criticalFindings = result.findings.filter((f) => f.severity === 'critical' && !f.isLimitation)
  const highFindings = result.findings.filter((f) => f.severity === 'high' && !f.isLimitation)
  const mediumFindings = result.findings.filter((f) => f.severity === 'medium' && !f.isLimitation)
  const actionableFindings = [...criticalFindings, ...highFindings, ...mediumFindings]

  // Weakest and strongest dimensions
  const sortedDims = [...result.dimensionScores].sort((a, b) => a.score - b.score)
  const weakestDim = sortedDims[0]
  const strongestDim = sortedDims[sortedDims.length - 1]

  // Sprint Effort Estimation from real recommendation metadata
  const highEffortCount = actionableFindings.filter((f) => f.recommendation?.effort === 'high').length
  const medEffortCount = actionableFindings.filter((f) => f.recommendation?.effort === 'medium').length
  const lowEffortCount = actionableFindings.filter((f) => f.recommendation?.effort === 'low').length
  const estimatedSprints = Math.max(1, Math.ceil((highEffortCount * 1.5 + medEffortCount * 0.75 + lowEffortCount * 0.25) / 2))

  // Brand signals derived from actual skill findings
  const brandDefects = result.findings.filter((f) => f.skillId === 'entity-identity-audit' && !f.isLimitation)
  const answerDefects = result.findings.filter((f) => f.skillId === 'ai-answerability-audit' && !f.isLimitation)
  const handoffDefects = result.findings.filter((f) => f.skillId === 'engagement-handoff-audit' && !f.isLimitation)
  const citationDefects = result.findings.filter((f) => f.skillId === 'citation-extractability-audit' && !f.isLimitation)

  // Top technical findings for engineering tickets
  const topSprintFindings = actionableFindings.slice(0, 4)

  // Risk Categories distribution
  const riskCategories: Record<BusinessRiskCategory, Finding[]> = {
    direct_revenue: [],
    pipeline: [],
    discoverability: [],
    recommendation: [],
    brand_trust: [],
    conversion: [],
    support_cost: [],
    content_maintenance: [],
  }

  for (const f of actionableFindings) {
    const cats = f.businessImpact?.categories || ['discoverability']
    for (const cat of cats) {
      if (riskCategories[cat]) {
        riskCategories[cat].push(f)
      }
    }
  }

  const activeRiskCategories = (Object.entries(riskCategories) as [BusinessRiskCategory, Finding[]][]).filter(
    ([, findings]) => findings.length > 0,
  )

  // Top primary exposure description
  const primaryFinding = actionableFindings[0]
  const primaryExposure = primaryFinding?.businessImpact?.potentialConsequence ||
    primaryFinding?.businessImpact?.businessInterpretation ||
    (criticalFindings.length > 0
      ? `${criticalFindings.length} critical architectural barrier(s) prevent AI search crawlers from indexing core entity data.`
      : 'Brand information is partially extractable, but lacks complete machine-readable entity schemas.')

  return (
    <div className="rounded-xl border border-white/8 bg-surface/70 backdrop-blur-xl p-4 space-y-4 shadow-lg">
      {/* Role Navigation Bar */}
      <div className="flex flex-col gap-2 border-b border-white/6 pb-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
            AUDIENCE-TAILORED BRIEFINGS
          </span>
          <span className="font-mono text-[9px] text-muted-foreground/70">
            Select stakeholder view
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5" role="tablist" aria-label="Audience briefings">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center rounded-lg border py-2 px-1.5 transition-all text-center cursor-pointer',
                  isActive
                    ? 'border-signal/50 bg-signal/15 text-signal shadow-sm'
                    : 'border-white/6 bg-white/[0.02] text-muted-foreground hover:border-white/12 hover:text-foreground',
                )}
              >
                <span className="text-[11px] font-semibold leading-tight">{tab.label}</span>
                <span className="font-mono text-[8px] opacity-75 mt-0.5">{tab.tag}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 1. EXECUTIVE BRIEFING */}
      {activeTab === 'executive' && (
        <div className="space-y-3.5 animate-fade-in text-xs leading-relaxed">
          <div className="flex items-center justify-between border-b border-white/6 pb-2">
            <div>
              <span className="font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
                EXECUTIVE BOARDROOM BRIEFING
              </span>
              <h3 className="text-sm font-semibold text-foreground mt-0.5">
                Strategic AI Readiness & Commercial Exposure
              </h3>
            </div>
            <div className="flex items-baseline gap-1.5 font-mono">
              <span className="text-xs font-bold text-foreground">Grade {letterGrade}</span>
              <span className="text-[10px] text-muted-foreground">({percentile}th percentile)</span>
            </div>
          </div>

          <div className="rounded-lg border border-white/6 bg-white/[0.02] p-3 space-y-1.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
              EXECUTIVE SITUATION SUMMARY
            </span>
            <p className="text-[11px] text-foreground/90">
              {host} achieves an overall AI Readiness score of <strong>{avgScore}/100</strong> ({letterGrade}).
              {criticalFindings.length > 0
                ? ` The audit revealed ${criticalFindings.length} critical and ${highFindings.length} high-severity defect(s) that impede AI answer engines from reliably extracting, citing, and recommending brand capabilities.`
                : ` The site maintains baseline crawlability (${strongestDim ? DIMENSIONS[strongestDim.dimension]?.label : 'core crawl'}), but ${actionableFindings.length} defect(s) across lower-scoring dimensions create attribution and referral vulnerabilities.`}
              {result.rootCauses.length > 0 && ` Primary systemic cause: "${result.rootCauses[0].label}".`}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="rounded-lg border border-warning/25 bg-warning/[0.03] p-2.5 space-y-1">
              <span className="font-mono text-[9px] font-bold text-warning uppercase">
                PRIMARY COMMERCIAL EXPOSURE
              </span>
              <p className="text-[10px] text-foreground/85 leading-snug">
                {primaryExposure}
              </p>
            </div>
            <div className="rounded-lg border border-signal/25 bg-signal/[0.03] p-2.5 space-y-1">
              <span className="font-mono text-[9px] font-bold text-signal uppercase">
                ESTIMATED ENGINEERING EFFORT
              </span>
              <p className="text-[10px] text-foreground/85 leading-snug">
                ~{estimatedSprints} Sprint{estimatedSprints > 1 ? 's' : ''} ({actionableFindings.length} total tickets: {highEffortCount} High, {medEffortCount} Med, {lowEffortCount} Low effort) to resolve all detected extraction bottlenecks.
              </p>
            </div>
          </div>

          <div className="rounded border border-white/6 bg-black/40 p-2.5 text-[10px] font-mono text-muted-foreground flex items-center justify-between">
            <span>Direct Resource Directive:</span>
            <span className="text-foreground font-medium">
              {weakestDim ? `Remediate ${DIMENSIONS[weakestDim.dimension]?.label} (${weakestDim.score}/100)` : 'Maintain Full Protocol Compliance'}
            </span>
          </div>
        </div>
      )}

      {/* 2. CMO BRIEFING */}
      {activeTab === 'cmo' && (
        <div className="space-y-3.5 animate-fade-in text-xs leading-relaxed">
          <div className="flex items-center justify-between border-b border-white/6 pb-2">
            <div>
              <span className="font-mono text-[9px] font-bold text-purple-400 uppercase tracking-wider">
                CMO BRIEFING
              </span>
              <h3 className="text-sm font-semibold text-foreground mt-0.5">
                Synthetic Share of Voice & Narrative Protection
              </h3>
            </div>
            <span className="rounded border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 font-mono text-[9px] text-purple-300 font-semibold uppercase">
              Brand Positioning
            </span>
          </div>

          <div className="space-y-2">
            <div className="rounded-lg border border-white/6 bg-white/[0.02] p-3 space-y-1.5">
              <span className="font-mono text-[9px] font-semibold text-muted-foreground uppercase">
                HOW AI MODELS INTERPRET {host.toUpperCase()}
              </span>
              <ul className="space-y-1.5 text-[11px] text-foreground/90">
                <li className="flex items-start gap-1.5">
                  <span className={cn('shrink-0 font-mono font-bold', brandDefects.length === 0 ? 'text-emerald-400' : 'text-warning')}>
                    {brandDefects.length === 0 ? '✓' : '!'}
                  </span>
                  <span>
                    <strong>Brand Entity Anchors:</strong> {brandDefects.length === 0
                      ? `Authoritative brand identity anchors detected across sampled pages.`
                      : `${brandDefects.length} brand anchor defect(s) detected: ${brandDefects[0].title}.`}
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className={cn('shrink-0 font-mono font-bold', answerDefects.length === 0 ? 'text-emerald-400' : 'text-warning')}>
                    {answerDefects.length === 0 ? '✓' : '!'}
                  </span>
                  <span>
                    <strong>Capability Answerability:</strong> {answerDefects.length === 0
                      ? 'Core capability questions can be directly answered from crawlable content.'
                      : `${answerDefects.length} question coverage gap(s); models may substitute third-party summaries.`}
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className={cn('shrink-0 font-mono font-bold', citationDefects.length === 0 ? 'text-emerald-400' : 'text-amber-400')}>
                    {citationDefects.length === 0 ? '✓' : '!'}
                  </span>
                  <span>
                    <strong>Citation Extractability:</strong> {citationDefects.length === 0
                      ? 'Key technical specs and claims are structured for direct citation extraction.'
                      : `${citationDefects.length} extraction gap(s) may prevent models from citing primary claims.`}
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className={cn('shrink-0 font-mono font-bold', handoffDefects.length === 0 ? 'text-emerald-400' : 'text-critical')}>
                    {handoffDefects.length === 0 ? '✓' : '✗'}
                  </span>
                  <span>
                    <strong>Referral & Action Path:</strong> {handoffDefects.length === 0
                      ? 'Machine-legible next action paths found for assistant handoffs.'
                      : 'Handoff paths lack semantic deep-links; AI assistants cannot complete direct referrals.'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-white/6 bg-black/40 p-3 space-y-1.5">
              <span className="font-mono text-[9px] font-semibold text-muted-foreground uppercase">
                CMO ACTION PRIORITIES
              </span>
              <div className="space-y-1.5 font-mono text-[10px] text-muted-foreground">
                {actionableFindings.slice(0, 3).map((f) => (
                  <div key={f.id} className="flex items-start gap-2">
                    <span className="text-signal shrink-0 mt-0.5">▶</span>
                    <div>
                      <span className="text-foreground font-semibold">{f.recommendation?.title || f.title}: </span>
                      <span>{f.recommendation?.detail || f.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SEO / GEO TECHNICAL DOSSIER */}
      {activeTab === 'seoGeo' && (
        <div className="space-y-3.5 animate-fade-in text-xs leading-relaxed">
          <div className="flex items-center justify-between border-b border-white/6 pb-2">
            <div>
              <span className="font-mono text-[9px] font-bold text-signal uppercase tracking-wider">
                SEO & GEO TECHNICAL DOSSIER
              </span>
              <h3 className="text-sm font-semibold text-foreground mt-0.5">
                Crawler Ingestion & Machine Readability
              </h3>
            </div>
            <span className="rounded border border-signal/30 bg-signal/10 px-2 py-0.5 font-mono text-[9px] text-signal font-semibold uppercase">
              RFC 9309 & Schema.org
            </span>
          </div>

          <div className="rounded-lg border border-white/6 bg-black/40 overflow-hidden">
            <div className="px-3 py-2 border-b border-white/6 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
              OBSERVED EXTRACTION COMPATIBILITY
            </div>
            <div className="divide-y divide-white/4 font-mono text-[10px]">
              {result.dimensionScores.map((ds) => {
                const dim = DIMENSIONS[ds.dimension]
                const isAdequate = ds.score >= 70
                const isWarning = ds.score >= 50 && ds.score < 70
                return (
                  <div key={ds.dimension} className="flex items-center justify-between px-3 py-2">
                    <span className="text-foreground">{dim?.label ?? ds.dimension}</span>
                    <span className={cn(
                      'font-semibold',
                      isAdequate ? 'text-emerald-400' : isWarning ? 'text-amber-400' : 'text-critical'
                    )}>
                      {ds.score}/100 — {ds.label.toUpperCase()}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-lg border border-white/6 bg-white/[0.02] p-2.5 space-y-1 font-mono text-[10px] text-muted-foreground">
            <div className="text-foreground font-semibold">Core Protocol Directives:</div>
            <div>• Verify RFC 9309 robots.txt allows AI retrieval agents (GPTBot, ClaudeBot, PerplexityBot)</div>
            <div>• Ensure primary entity metadata is rendered server-side in raw HTML</div>
            <div>• Provide Schema.org structured data (Organization, WebSite, Service/Product) in head</div>
            <div>• Expose semantic markdown or llms.txt endpoints for agentic discovery</div>
          </div>
        </div>
      )}

      {/* 4. ENGINEERING SPRINT MANIFEST */}
      {activeTab === 'engineering' && (
        <div className="space-y-3.5 animate-fade-in text-xs leading-relaxed">
          <div className="flex items-center justify-between border-b border-white/6 pb-2">
            <div>
              <span className="font-mono text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                ENGINEERING SPRINT MANIFEST
              </span>
              <h3 className="text-sm font-semibold text-foreground mt-0.5">
                Prioritized Action Items & Technical Recommendations
              </h3>
            </div>
            <span className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] text-emerald-300 font-semibold uppercase">
              {topSprintFindings.length} PRIORITY TICKETS
            </span>
          </div>

          <div className="space-y-2.5">
            {topSprintFindings.map((f) => {
              const pTag = f.severity === 'critical' ? 'P0' : f.severity === 'high' ? 'P1' : 'P2'
              const colorClass = f.severity === 'critical' ? 'text-critical border-critical/30 bg-critical/[0.04]' : f.severity === 'high' ? 'text-warning border-warning/30 bg-warning/[0.04]' : 'text-signal border-signal/30 bg-signal/[0.04]'
              return (
                <div key={f.id} className={cn('rounded-lg border p-3 space-y-1.5', colorClass)}>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold">
                      [{pTag}] [{f.dimension.toUpperCase()}] {f.title}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground uppercase">
                      Effort: {f.recommendation?.effort || 'medium'}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground/90">
                    {f.description}
                  </p>
                  <div className="rounded bg-black/60 p-2 font-mono text-[9px] text-emerald-300/90 overflow-x-auto">
                    <span>Recommendation: {f.recommendation?.detail || f.recommendation?.title || f.whyItMatters}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 5. REVENUE IMPACT MODEL */}
      {activeTab === 'revenue' && (
        <div className="space-y-3.5 animate-fade-in text-xs leading-relaxed">
          <div className="flex items-center justify-between border-b border-white/6 pb-2">
            <div>
              <span className="font-mono text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                COMMERCIAL RISK EXPOSURE MATRIX
              </span>
              <h3 className="text-sm font-semibold text-foreground mt-0.5">
                Systemic Exposure Across 8 Business Risk Dimensions
              </h3>
            </div>
            <span className="rounded border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[9px] text-amber-300 font-semibold uppercase">
              Directional Analysis
            </span>
          </div>

          <div className="space-y-2">
            <div className="rounded-lg border border-white/6 bg-black/40 overflow-hidden">
              <div className="px-3 py-2 border-b border-white/6 font-mono text-[9px] uppercase tracking-wider text-muted-foreground flex justify-between">
                <span>Risk Category</span>
                <span>Active Findings</span>
              </div>
              <div className="divide-y divide-white/4 font-mono text-[10px]">
                {activeRiskCategories.map(([category, findings]) => {
                  const hasCrit = findings.some((f) => f.severity === 'critical')
                  const hasHigh = findings.some((f) => f.severity === 'high')
                  const label = RISK_LABELS[category] || category
                  return (
                    <div key={category} className="px-3 py-2.5 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">{label}</span>
                        <span className={cn(
                          'px-1.5 py-0.5 rounded text-[9px]',
                          hasCrit ? 'bg-critical/20 text-critical font-bold' : hasHigh ? 'bg-warning/20 text-warning' : 'bg-white/6 text-muted-foreground'
                        )}>
                          {findings.length} defect{findings.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-sans leading-normal">
                        {findings[0].businessImpact?.potentialConsequence || findings[0].businessImpact?.businessInterpretation || findings[0].description}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-lg border border-white/6 bg-white/[0.02] p-3 space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">
                SENSITIVITY FACTORS & METHODOLOGY
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[10px]">
                <div className="p-2 rounded border border-white/6 bg-black/20 space-y-0.5">
                  <span className="text-muted-foreground block text-[8px] uppercase">Substitution Vulnerability</span>
                  <span className="text-warning font-bold">{Math.max(10, 100 - avgScore)}% Potential Citation Drag</span>
                </div>
                <div className="p-2 rounded border border-white/6 bg-black/20 space-y-0.5">
                  <span className="text-muted-foreground block text-[8px] uppercase">Confidence Rating</span>
                  <span className="text-signal font-bold">Empirical First-Party Crawl</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground leading-normal">
                Risk severity is determined deterministically from crawl-layer defects. Unlike speculative marketing models, we do not invent arbitrary dollar figures or traffic counts. Exposure translates to lost synthetic share of voice when prospective buyers query LLM answer engines.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
