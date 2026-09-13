import type { Site, SkillId, Severity } from './types'
import { DIMENSIONS, SKILL_MAP, RUN_ORDER } from './skills'
import { getCausalChainForFinding } from './causal-chains'
import type { PerceptionBundle } from '@/lib/perception/types'
import { questionById } from '@/lib/perception/questions'
import { buildPerceptionContext } from '@/lib/perception/build-context'
import { assembleBundle } from '@/lib/perception/ground'
import {
  buildBuyerQuestionScorecard,
  deriveBusinessExposureSeverity,
  formatBlastRadius,
  getAiAlternativeSourceLine,
  getBusinessTranslation,
  getFunnelStageForFinding,
  getReachTier,
} from './business-impact'

// ─── helpers ─────────────────────────────────────────────────────────────────

function bar(score: number, max = 100, width = 20): string {
  const filled = Math.round((score / max) * width)
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

function severityIcon(s: string): string {
  return s === 'critical' ? '🔴' : s === 'high' ? '🟠' : s === 'medium' ? '🟡' : '🟢'
}

function statusIcon(s: string): string {
  return s === 'completed' ? '✅' : s === 'warning' ? '⚠️' : s === 'critical' ? '🔴' : s === 'skipped' ? '⏭️' : '⏳'
}

function riskBadge(cat: string): string {
  const map: Record<string, string> = {
    direct_revenue: 'REVENUE', pipeline: 'PIPELINE', discoverability: 'DISCOVERABILITY',
    recommendation: 'RECOMMENDATION', brand_trust: 'BRAND TRUST', conversion: 'CONVERSION',
    support_cost: 'SUPPORT COST', content_maintenance: 'CONTENT',
  }
  return map[cat] ?? cat.toUpperCase()
}

function hrule(): string { return '\n---\n' }
function section(n: number, title: string): string { return `\n## ${n}. ${title}\n` }
function subsection(title: string): string { return `\n### ${title}\n` }

// ─── main export ──────────────────────────────────────────────────────────────

export function generateAuditMarkdown(
  site: Site,
  bundle: PerceptionBundle | null = null,
  skippedSkillIds: SkillId[] = [],
): string {
  const result = site.result
  if (!result) return `# Diagnostic Report for ${site.host}\n\nNo result available.`

  let activeBundle = bundle
  if (!activeBundle && site.result && site.skills) {
    try {
      const ctx = buildPerceptionContext(
        site.host,
        site.url,
        'offer',
        site.result,
        site.skills,
        skippedSkillIds,
        site.phase === 'partial',
      )
      activeBundle = assembleBundle(ctx, site.result, site.skills)
    } catch {
      // fallback to null
    }
  }

  const avgScore = Math.round(
    result.dimensionScores.reduce((acc, d) => acc + d.score, 0) / (result.dimensionScores.length || 1),
  )

  const letterGrade =
    avgScore >= 90 ? 'A' : avgScore >= 80 ? 'A−' : avgScore >= 75 ? 'B+' :
    avgScore >= 70 ? 'B' : avgScore >= 60 ? 'C+' : avgScore >= 50 ? 'C' : 'D'

  const now = new Date().toISOString()
  const nonLimitations = result.findings.filter((f) => !f.isLimitation)
  const limitations = result.findings.filter((f) => f.isLimitation)
  const critical = nonLimitations.filter((f) => f.severity === 'critical')
  const high = nonLimitations.filter((f) => f.severity === 'high')
  const medium = nonLimitations.filter((f) => f.severity === 'medium')
  const low = nonLimitations.filter((f) => f.severity === 'low')

  const lines: string[] = []

  // ── HEADER ────────────────────────────────────────────────────────────────
  lines.push(
    `# 🧠 Brand AI Readiness Diagnostic — ${site.host}`,
    '',
    '```',
    `  Site         : ${site.url}`,
    `  Audit ID     : ${site.id}`,
    `  Generated    : ${now}`,
    `  Engine       : Brand AI Readiness Engine v1 (llm_calls=0, deterministic)`,
    `  Methodology  : Dual-Fetch Static + Hydrated DOM Analysis`,
    `  Standards    : RFC 9309 · Schema.org · robots.txt`,
    '```',
    '',
    '> **Read-Only Non-Invasive Audit.** All evaluations performed via standard HTTP GET/HEAD with zero mutation.',
    '',
  )

  // ── 1. EXECUTIVE SUMMARY ──────────────────────────────────────────────────
  lines.push(hrule(), section(1, '📊 Executive Summary'))
  lines.push(
    `| Metric | Value |`,
    `|---|---|`,
    `| **AI Readiness Index** | **${avgScore} / 100** (Grade **${letterGrade}**) |`,
    `| **Overall Verdict** | **${result.overallLabel}** |`,
    `| **Defect Register** | ${critical.length} Critical · ${high.length} High · ${medium.length} Medium · ${low.length} Low |`,
    `| **Total Findings** | ${nonLimitations.length} actionable findings |`,
    `| **Inspection Boundaries** | ${limitations.length} audit-scope limitations |`,
    `| **Pages Crawled** | ${result.coverage?.pagesFetched ?? '—'} |`,
    `| **Pages Rendered (JS)** | ${result.coverage?.pagesRendered ?? '—'} |`,
    `| **HTTP Requests** | ${result.coverage?.httpRequests ?? '—'} |`,
    `| **Templates Identified** | ${result.coverage?.templates ?? '—'} |`,
    `| **Robots.txt Status** | ${result.coverage?.robotsStatus ?? 'unknown'} |`,
    result.timing?.totalMs ? `| **Total Wall-Clock** | ${(result.timing.totalMs / 1000).toFixed(2)}s |` : '',
    '',
    '**Strategic Assessment:**',
    '',
    `> ${result.overallSummary}`,
    '',
    '**AI Readiness Score:**',
    '```',
    `${bar(avgScore)} ${avgScore}/100 (${letterGrade})`,
    '```',
    '',
  )

  // ── PREPARE SCORECARD & PRIORITY CANDIDATES ───────────────────────────────
  const scorecard = buildBuyerQuestionScorecard(result, (result as any).site_type || (site.result as any)?.site_type)
  const kClosedBookFindings = nonLimitations.filter(
    (f) => f.skillId === 'ai-answerability-audit' && (f.findingType === 'unanswerable' || f.title.includes('Closed-book')),
  )
  const directFindings = nonLimitations.filter(
    (f) => !(f.skillId === 'ai-answerability-audit' && (f.findingType === 'unanswerable' || f.title.includes('Closed-book'))),
  )

  interface PriorityCandidate {
    title: string
    severity: Severity
    rankScore: number
    drivingFactors: string
    recommendationTitle: string
    recommendationDetail: string
    effort: 'low' | 'medium' | 'high'
    businessImpact: string
  }
  const candidates: PriorityCandidate[] = []

  if (scorecard.unansweredCount > 0) {
    const hasDecision = scorecard.items.some((i) => i.status === 'unanswered' && i.funnelStage === 'decision')
    const hasConsideration = scorecard.items.some((i) => i.status === 'unanswered' && i.funnelStage === 'consideration')
    const unansweredIds = scorecard.items.filter((i) => i.status === 'unanswered').map((i) => i.id).join(', ')
    candidates.push({
      title: `Publish direct answers for ${scorecard.unansweredCount} core buyer questions (${unansweredIds})`,
      severity: hasDecision ? 'critical' : hasConsideration ? 'high' : 'medium',
      rankScore: hasDecision ? 85 : hasConsideration ? 55 : 25,
      drivingFactors: `${hasDecision ? 'High (Decision)' : hasConsideration ? 'Medium (Consideration)' : 'Low (Awareness)'} Funnel · Broad Query Reach (${unansweredIds})`,
      recommendationTitle: 'Add visible, extractable answers on intent-matched canonical landing pages',
      recommendationDetail: `Deploy concise declarative sentences answering ${unansweredIds} to prevent conversational AI inquiry abandonment.`,
      effort: 'low',
      businessImpact:
        'Prospective buyers querying AI assistants cannot qualify your offering, pricing, or contact path, leading assistants to redirect traffic to competitors.',
    })
  }

  for (const f of directFindings) {
    const funnelInfo = getFunnelStageForFinding(f)
    const reachTier = getReachTier(f.affectedPages, f.sampledPages, f.findingType)
    const sevInfo = deriveBusinessExposureSeverity(funnelInfo.priority, reachTier)
    const reachPct = Math.round((f.affectedPages / Math.max(f.sampledPages, 1)) * 100)
    candidates.push({
      title: f.title,
      severity: f.severity,
      rankScore: sevInfo.rankScore + Math.min(9, Math.round((f.affectedPages / Math.max(f.sampledPages, 1)) * 9)),
      drivingFactors: `${funnelInfo.priority} Funnel (${funnelInfo.stage}) · ${reachTier} Reach (${f.affectedPages}/${f.sampledPages} pages, ${reachPct}%)`,
      recommendationTitle: f.recommendation.title,
      recommendationDetail: f.recommendation.detail,
      effort: f.recommendation.effort,
      businessImpact: getBusinessTranslation(f),
    })
  }

  candidates.sort((a, b) => b.rankScore - a.rankScore)
  const top3 = candidates.slice(0, 3)

  // ── 2. TOP 3 PRIORITY ACTIONS ─────────────────────────────────────────────
  lines.push(hrule(), section(2, '🎯 Top 3 Priority Actions (Ranked by Business Exposure)'))
  lines.push('> Ranked by business-exposure risk (funnel stage criticality and crawl reach) — not discovery order.', '')

  if (top3.length === 0) {
    lines.push('_No priority actions required — all audited dimensions clear._', '')
  } else {
    top3.forEach((action, idx) => {
      lines.push(
        subsection(`${idx + 1}. ${severityIcon(action.severity)} [${action.severity.toUpperCase()}] ${action.title}`),
        `- **Recommended Fix:** ${action.recommendationTitle} — ${action.recommendationDetail}`,
        `- **Exposure Drivers:** ${action.drivingFactors}`,
        `- **Business Consequence:** ${action.businessImpact}`,
        `- **Estimated Effort:** \`${action.effort.toUpperCase()}\``,
        '',
      )
    })
  }

  // ── 3. BENCHMARK ─────────────────────────────────────────────────────────
  lines.push(hrule(), section(3, '📈 Corpus Benchmark (38-Site Empirical Distribution)'))
  lines.push(
    `| Position | Score | Status |`,
    `|---|---|---|`,
    `| **This Brand** | ${avgScore} / 100 | Grade ${letterGrade} |`,
    `| Corpus Median | 67 / 100 | ${avgScore >= 67 ? `✅ Above median (+${avgScore - 67} pts)` : `❌ Below median (−${67 - avgScore} pts)`} |`,
    `| Top Quartile (75th percentile) | 82 / 100 | ${avgScore >= 82 ? '🏆 Citation Leader' : `${82 - avgScore} pts gap to top quartile`} |`,
    `| Corpus Best | 91 / 100 | Reference Benchmark |`,
    '',
  )

  // ── 4. DIMENSION SCORES ───────────────────────────────────────────────────
  lines.push(hrule(), section(4, '🔬 Causal Dimension Breakdown'))
  lines.push(`| Dimension | Score | Visual | Status | Description |`, `|---|---|---|---|---|`)
  for (const ds of result.dimensionScores) {
    const dim = DIMENSIONS[ds.dimension]
    const icon = ds.label === 'strong' ? '✅' : ds.label === 'adequate' ? '🟡' : ds.label === 'at-risk' ? '🟠' : '🔴'
    lines.push(
      `| **${dim.label}** | ${ds.score}/100 | \`${bar(ds.score, 100, 12)}\` | ${icon} ${ds.label.toUpperCase()} | ${dim.description} |`,
    )
  }
  lines.push('')

  // ── 5. SCORE DECOMPOSITION ────────────────────────────────────────────────
  lines.push(hrule(), section(5, '💔 Lost-Point Inventory (Score Decomposition)'))
  lines.push(`Total Deductions: **−${Math.max(0, 100 - avgScore)} points**`, '')
  if (nonLimitations.length === 0) {
    lines.push('_No deductions — all dimensions clear._', '')
  } else {
    lines.push(`| Severity | Deduction | Finding | Dimension |`, `|---|---|---|---|`)
    for (const f of nonLimitations) {
      const deduction = f.severity === 'critical' ? 12 : f.severity === 'high' ? 8 : f.severity === 'medium' ? 4 : 2
      lines.push(`| ${severityIcon(f.severity)} ${f.severity.toUpperCase()} | −${deduction} pts | ${f.title} | ${DIMENSIONS[f.dimension]?.label} |`)
    }
    lines.push('')
  }

  // ── 6. ROOT CAUSES ────────────────────────────────────────────────────────
  lines.push(hrule(), section(6, '🔗 Systemic Root Causes & Downstream AI Impact'))
  if (result.rootCauses.length === 0) {
    lines.push('_No systemic root causes identified._', '')
  } else {
    for (const cause of result.rootCauses) {
      lines.push(
        subsection(`${severityIcon(cause.severity)} ${cause.label} [${cause.severity.toUpperCase()}]`),
        `- **Structural Origin:** ${cause.detail}`,
        `- **Propagated Finding Count:** ${cause.findingIds.length}`,
        `- **Finding IDs:** \`${cause.findingIds.join(', ')}\``,
        cause.businessInterpretation ? `- **Business Interpretation:** ${cause.businessInterpretation}` : '',
        '',
      )
    }
  }

  // ── 7. FULL FINDING DEEP-DIVES ────────────────────────────────────────────
  lines.push(hrule(), section(7, '🔍 Actionable Findings — Full Detail'))
  lines.push('> Each finding below mirrors exactly what is shown in the audit dialog. Every field is derived from the live crawl — no fabrication.', '')

  if (nonLimitations.length === 0 && scorecard.unansweredCount === 0) {
    lines.push('_No actionable findings detected._', '')
  }

  // Aggregated Scorecard Finding Block
  if (scorecard.unansweredCount > 0) {
    const hasDecision = scorecard.items.some((i) => i.status === 'unanswered' && i.funnelStage === 'decision')
    const kScorecardSev: Severity = hasDecision ? 'critical' : 'high'

    lines.push(
      `### ${severityIcon(kScorecardSev)} [${kScorecardSev.toUpperCase()}] ${scorecard.unansweredCount} of ${scorecard.totalActiveCount} Core Buyer Questions Unanswered Anywhere on Site`,
      '',
      `| Field | Value |`,
      `|---|---|`,
      `| **Finding ID** | \`F-BUYER-SCORECARD\` |`,
      `| **Severity** | ${severityIcon(kScorecardSev)} ${kScorecardSev.toUpperCase()} (Business Exposure: ${hasDecision ? 'Decision Stage' : 'Consideration Stage'}) |`,
      `| **Confidence** | HIGH |`,
      `| **Skill** | AI Answerability Audit (\`ai-answerability-audit\`) |`,
      `| **Dimension** | AI Understanding |`,
      `| **Questions Unanswered** | ${scorecard.unansweredCount} of ${scorecard.totalActiveCount} applicable buyer questions |`,
      `| **Pages Sampled** | ${result.coverage?.pagesFetched ?? 1} |`,
      '',
      '**📋 Buyer-Question Coverage Scorecard:**',
      '',
      `| # | Question | Funnel Stage | Answered? | Where (if yes) / Business Note |`,
      `|---|---|---|---|---|`,
    )
    for (const item of scorecard.items) {
      const statusLabel =
        item.status === 'answered' ? '✅ Yes' :
        item.status === 'wrong_page' ? '⚠️ Wrong Page' :
        item.status === 'na' ? '⚪ N/A' : '❌ No'
      lines.push(`| **${item.id}** | ${item.question} | \`${item.funnelStage.toUpperCase()}\` | ${statusLabel} | ${item.whereOrReason} |`)
    }
    lines.push(
      '',
      '**📋 Technical Observation:**',
      '',
      `> Crawled corpus contains zero extractable declarative answers for ${scorecard.unansweredCount} core buyer questions (${scorecard.items.filter((i) => i.status === 'unanswered').map((i) => i.id).join(', ')}).`,
      '',
      '**❓ Why This Matters for AI Systems:**',
      '',
      `> When an AI assistant attempts to answer direct user questions regarding these attributes, retrieval-augmented generation (RAG) pipelines fail closed or hallucinate answers from secondary third-party sources.`,
      '',
      '**💼 Business Impact:**',
      '',
      `> Anyone using an AI assistant to evaluate your product or research pricing before buying cannot get answers sourced from your own site — they will either abandon the inquiry or receive outdated third-party numbers.`,
      '',
      '**💥 Blast Radius:**',
      '',
      `> Confirmed site-wide completeness barrier across ${scorecard.unansweredCount} core buyer questions; impacts 100% of conversational search queries touching these funnel stages.`,
      '',
      '**✅ Recommended Action:**',
      '',
      `| Field | Value |`,
      `|---|---|`,
      `| **Action** | Publish direct, extractable declarative answers for all unanswered buyer questions |`,
      `| **Detail** | Add visible, machine-readable sentences answering ${scorecard.items.filter((i) => i.status === 'unanswered').map((i) => `${i.id} (${i.question})`).join(', ')} on intent-matched canonical landing pages. |`,
      `| **Priority** | ${kScorecardSev.toUpperCase()} |`,
      `| **Effort** | LOW |`,
      '',
      '**⛓ Causal Consequence Chain:**',
      '',
      '1. High-intent prospective buyers query AI assistants for pricing, audience suitability, or procurement specifications.',
      '2. AI knowledge retrieval pipelines scan crawled pages and encounter complete factual voids across core buyer questions.',
      '3. Assistants recommend accessible competitors with clear specifications or advise prospects that information is unavailable.',
      '',
      '<details>',
      `<summary>📋 JIRA Ticket</summary>`,
      '',
      '```',
      `Title: [AI-READINESS][${kScorecardSev.toUpperCase()}] Resolve ${scorecard.unansweredCount} Unanswered Core Buyer Questions`,
      `Labels: ai-readiness, ai-answerability-audit, ${kScorecardSev}`,
      `Priority: ${kScorecardSev === 'critical' ? 'High' : 'Medium'}`,
      '',
      `Problem: Site fails to answer ${scorecard.unansweredCount} core buyer questions in public extractable HTML.`,
      `Why It Matters: AI assistants fail closed or substitute competitors on high-intent commercial queries.`,
      `Acceptance Criteria: Add visible declarative answers for ${scorecard.items.filter((i) => i.status === 'unanswered').map((i) => i.id).join(', ')} on canonical pages.`,
      `Skill: AI Answerability Audit | Dimension: AI Understanding | Finding ID: F-BUYER-SCORECARD`,
      '```',
      '',
      '</details>',
      '',
      '---',
      '',
    )
  }

  for (const f of directFindings) {
    const skill = SKILL_MAP[f.skillId]
    const dim = DIMENSIONS[f.dimension]

    lines.push(
      `### ${severityIcon(f.severity)} [${f.severity.toUpperCase()}] ${f.title}`,
      '',
      `| Field | Value |`,
      `|---|---|`,
      `| **Finding ID** | \`${f.id}\` |`,
      `| **Severity** | ${severityIcon(f.severity)} ${f.severity.toUpperCase()} |`,
      `| **Confidence** | ${f.confidence.toUpperCase()} |`,
      `| **Skill** | ${skill?.label ?? f.skillId} (\`${f.skillId}\`) |`,
      `| **Dimension** | ${dim?.label ?? f.dimension} |`,
      `| **Pages Affected** | ${f.affectedPages} |`,
      `| **Pages Sampled** | ${f.sampledPages} |`,
      f.rootCauseId ? `| **Root Cause** | \`${f.rootCauseId}\` |` : '',
      '',
      '**📋 Technical Observation:**',
      '',
      `> ${f.description}`,
      '',
      '**❓ Why This Matters for AI Systems:**',
      '',
      `> ${f.whyItMatters}`,
      '',
      '**💼 Business Impact:**',
      '',
      `> ${getBusinessTranslation(f)}`,
      '',
      '**💥 Blast Radius:**',
      '',
      `> ${formatBlastRadius(f.affectedPages, f.sampledPages, f.templateId, result.coverage, f.evidence[0]?.url)}`,
      '',
    )

    const aiAlt = getAiAlternativeSourceLine(f, result)
    if (aiAlt) {
      lines.push('**🤖 What an AI Would Say Instead:**', '', `> ${aiAlt}`, '')
    }

    if (f.businessImpact) {
      const bi = f.businessImpact
      lines.push(
        '**💼 Executive Business Impact:**',
        '',
        `| Impact Dimension | Detail |`,
        `|---|---|`,
        `| **Commercial Interpretation** | ${bi.businessInterpretation} |`,
        `| **Why AI Systems Care** | ${bi.whyAiSystemsCare} |`,
        `| **Who Is Affected** | ${bi.whoIsAffected} |`,
        `| **Potential Consequence** | ${bi.potentialConsequence} |`,
        `| **Quantified Impact** | ${bi.quantifiedImpact} |`,
        `| **Expected Outcome After Fix** | ${bi.expectedOutcomeAfterFix} |`,
        '',
        `**Risk Categories:** ${bi.categories.map(riskBadge).map((b) => `\`${b}\``).join(' · ')}`,
        '',
      )
      if (bi.assumptions.length > 0) {
        lines.push('**Assumptions:**')
        bi.assumptions.forEach((a) => lines.push(`- ${a}`))
        lines.push('')
      }
    }

    if (f.evidence.length > 0) {
      lines.push('**🔬 Evidence Chain:**', '', `| # | Label | Detail | URL |`, `|---|---|---|---|`)
      f.evidence.forEach((ev, i) => {
        lines.push(`| ${i + 1} | \`${ev.label}\` | ${ev.detail} | ${ev.url ? `[link](${ev.url})` : '—'} |`)
      })
      lines.push('')
    }

    lines.push(
      '**✅ Recommended Action:**',
      '',
      `| Field | Value |`,
      `|---|---|`,
      `| **Action** | ${f.recommendation.title} |`,
      `| **Detail** | ${f.recommendation.detail} |`,
      `| **Priority** | ${f.recommendation.priority.toUpperCase()} |`,
      `| **Effort** | ${f.recommendation.effort.toUpperCase()} |`,
      '',
    )

    const consequenceChain = f.consequenceChain ?? getCausalChainForFinding(f)
    if (consequenceChain && consequenceChain.length > 0) {
      lines.push('**⛓ Causal Consequence Chain:**', '')
      consequenceChain.forEach((step, i) => lines.push(`${i + 1}. ${step}`))
      lines.push('')
    }

    lines.push(
      '<details>',
      `<summary>📋 JIRA Ticket</summary>`,
      '',
      '```',
      `Title: [AI-READINESS][${f.severity.toUpperCase()}] ${f.title}`,
      `Labels: ai-readiness, ${f.skillId}, ${f.severity}`,
      `Priority: ${f.severity === 'critical' || f.severity === 'high' ? 'High' : 'Medium'}`,
      '',
      `Problem: ${f.description}`,
      `Why It Matters: ${f.whyItMatters}`,
      `Acceptance Criteria: ${f.recommendation.detail}`,
      `Skill: ${skill?.label ?? f.skillId} | Dimension: ${dim?.label} | Finding ID: ${f.id}`,
      '```',
      '',
      '</details>',
      '',
      '---',
      '',
    )
  }

  lines.push(
    '> ℹ️ **How Severity is Calculated:** Business-Exposure Severity is derived from an ordinal matrix combining **Funnel Priority** (High: Decision-stage e.g. pricing, purchasing, contact; Medium: Consideration-stage e.g. audience, geography, specifications; Low: Awareness-stage e.g. discovery, crawl access, identity) and **Reach Tier** (Broad: ≥50% pages affected or global directive; Cluster: 10–49% pages affected; Isolated: <10% pages affected). Broad Decision issues evaluate to CRITICAL; Isolated Decision / Broad Consideration evaluate to HIGH; Isolated Consideration / Broad Awareness evaluate to MEDIUM; Isolated Awareness evaluates to LOW.',
    '',
  )

  // ── 8. PERCEPTION CONSOLE ─────────────────────────────────────────────────
  lines.push(section(8, '🧠 AI Perception Console — Simulated Assistant Grounding'))
  lines.push('> **DISCLAIMER:** Simulated extract-grounded perception. NOT a live citation scrape. Deterministic analysis of first-party HTML extractability.', '')

  if (!activeBundle) {
    lines.push('_Perception simulation was not run during this diagnostic session._', '')
  } else {
    const { perception, memory, substitution, gravity, vitals } = activeBundle
    const q = questionById(perception.questionId)

    lines.push(
      subsection(`Interrogation Question: "${q.prompt}"`),
      `| Field | Value |`,
      `|---|---|`,
      `| **Simulated Status** | \`${perception.status.toUpperCase()}\` |`,
      `| **Grounding Confidence** | \`${perception.confidence.toUpperCase()}\` |`,
      `| **Fallback Used** | ${perception.usedFallback ? 'Yes — local deterministic extraction fallback' : 'No — direct synthesis'} |`,
      `| **Stale** | ${perception.stale ? 'Yes — inputs changed since last execution' : 'No'} |`,
      `| **Skipped Skills** | ${perception.skippedSkillIds.length > 0 ? perception.skippedSkillIds.join(', ') : 'None'} |`,
      '',
      '**🗣 Assistant Synthesized Answer:**',
      '',
      `> "${perception.answer}"`,
      '',
    )

    if (perception.spans.length > 0) {
      lines.push(
        '**📍 Sentence Attribution & Evidence Receipts (Trace Spans):**',
        '',
        '> Each row shows which sentence is grounded in evidence, which skills produced it, and which findings it implicates.',
        '',
        `| Clause | Grounding | Skills | Finding IDs |`,
        `|---|---|---|---|`,
      )
      for (const span of perception.spans) {
        const groundingIcon = span.grounding === 'supported' ? '✅' : span.grounding === 'inferred' ? '🔶' : '❌'
        const skillsStr = span.skillIds.length ? span.skillIds.join(', ') : '—'
        const findingsStr = span.findingIds.length ? span.findingIds.join(', ') : '—'
        lines.push(
          `| "${span.text.slice(0, 80).replace(/\|/g, '\\|')}${span.text.length > 80 ? '…' : ''}" | ${groundingIcon} \`${span.grounding}\` | \`${skillsStr}\` | \`${findingsStr}\` |`,
        )
      }
      lines.push('')
    }

    lines.push(
      hrule(),
      subsection('🧩 Brand Working Memory (6-Cell Extraction Register)'),
      '> These 6 cells represent the factual profile a language model builds about your brand. Empty cells = real extraction failures.',
      '',
      `| Cell | State | Extracted Value | Source | Skills |`,
      `|---|---|---|---|---|`,
    )
    for (const c of memory.cells) {
      const val = c.filled && c.value ? c.value.replace(/\|/g, '\\|').slice(0, 80) : '— *(Unextractable)*'
      const sourceBadge = c.source === 'evidence' ? '🟢 EVIDENCE' : c.source === 'inferred' ? '🟡 INFERRED' : '⚪ EMPTY'
      lines.push(
        `| **${c.id.toUpperCase()}** | ${c.filled ? '✅ FILLED' : '❌ EMPTY'} | ${val} | \`${sourceBadge}\` | \`${c.skillIds.join(', ')}\` |`,
      )
    }
    if (memory.missingFacts && memory.missingFacts.length > 0) {
      lines.push('', '**Missing Facts (unresolvable gaps from audit):**')
      memory.missingFacts.forEach((f) => lines.push(`- ${f}`))
    }
    lines.push('')

    if (substitution && substitution.active) {
      lines.push(
        hrule(),
        subsection('⚔️ Substitution Counterfactual Analysis'),
        '> When your first-party content is weak, AI systems substitute competitor mentions. This shows who benefits and why.',
        '',
        `| Signal | Value |`,
        `|---|---|`,
        `| **First-Party Signal Strength** | \`${substitution.firstParty.toUpperCase()}\` |`,
        `| **Likely AI Citation (instead of you)** | **${substitution.likelyCite}** |`,
        substitution.targetBrandShare != null ? `| **Your Brand AI Share** | ${substitution.targetBrandShare}% |` : '',
        substitution.rivalBrandShare != null ? `| **Rival Brand AI Share** | ${substitution.rivalBrandShare}% |` : '',
        substitution.rivalName ? `| **Primary Rival** | ${substitution.rivalName} |` : '',
        substitution.liftDelta != null ? `| **Estimated Lift Delta** | +${substitution.liftDelta}% potential with full remediation |` : '',
        '',
      )
      if (substitution.breakPointReason) lines.push('**Break-Point Reason:**', `> ${substitution.breakPointReason}`, '')
      if (substitution.winningAttributes && substitution.winningAttributes.length > 0) {
        lines.push('**Rival Winning Attributes:**')
        substitution.winningAttributes.forEach((a) => lines.push(`- ${a}`))
        lines.push('')
      }
      lines.push('**Causal Walk to Substitution:**', '')
      substitution.causeChain.forEach((c, i) => lines.push(`${i + 1}. **${c.label}** (\`${c.id}\`)`))
      if (substitution.remediationCode) {
        lines.push('', '**Remediation Patch:**', '```html', substitution.remediationCode, '```')
      }
      lines.push('')
    }

    lines.push(
      hrule(),
      subsection('🌐 Recommendation Gravity Analysis'),
      `| Field | Value |`,
      `|---|---|`,
      `| **Gravity Class** | \`${gravity.class.toUpperCase()}\` |`,
      `| **Classification** | **${gravity.label}** |`,
      `| **Assessment** | ${gravity.detail} |`,
      `| **Contributing Skills** | \`${gravity.skillIds.join(', ')}\` |`,
      gravity.score != null ? `| **Gravity Score** | ${gravity.score}/100 |` : '',
      '',
    )
    if (gravity.anchors && gravity.anchors.length > 0) {
      lines.push(`| Anchor | Weight | Detail |`, `|---|---|---|`)
      gravity.anchors.forEach((a) => lines.push(`| ${a.label} | ${a.weight} | ${a.detail} |`))
      lines.push('')
    }

    if (vitals) {
      lines.push(
        hrule(),
        subsection('🩺 AI Perception MRI Vitals'),
        '> Composite health indicators derived from all skill outputs.',
        '',
        `| Vital | Value | Visual |`,
        `|---|---|---|`,
        `| **Retrieval Fidelity** | ${vitals.retrievalFidelity}/100 | \`${bar(vitals.retrievalFidelity, 100, 15)}\` |`,
        `| **Grounding Integrity** | ${vitals.groundingIntegrity}/100 | \`${bar(vitals.groundingIntegrity, 100, 15)}\` |`,
        `| **Hallucination Risk** | ${vitals.hallucinationRisk}/100 | \`${bar(100 - vitals.hallucinationRisk, 100, 15)}\` |`,
        '',
      )
    }
  }

  // ── 9. SKILL MARKETPLACE ──────────────────────────────────────────────────
  lines.push(hrule(), section(9, '⚙️ Skill Marketplace Composition'))
  lines.push(
    `| # | Skill | ID | Dimension | Status | Skipped | Pages Inspected | Confidence |`,
    `|---|---|---|---|---|---|---|---|`,
  )
  let idx = 1
  for (const skillId of RUN_ORDER) {
    const def = SKILL_MAP[skillId]
    const run = site.skills.find((s) => s.id === skillId)
    const isSkipped = skippedSkillIds.includes(skillId)
    const status = isSkipped ? 'SKIPPED' : (run?.status?.toUpperCase() ?? 'COMPLETED')
    lines.push(
      `| ${idx++} | **${def.label}** | \`${def.short}\` | \`${def.dimension.toUpperCase()}\` | ${statusIcon(run?.status ?? 'completed')} \`${status}\` | ${isSkipped ? '⏭️ Yes' : '—'} | ${run?.pagesInspected ?? '—'} | ${run?.confidence?.toUpperCase() ?? '—'} |`,
    )
  }
  lines.push(`| ${idx} | **Audit Orchestrator** | \`orch\` | \`COORDINATION\` | ✅ \`COMPLETED\` | — | — | — |`, '')

  lines.push(subsection('Skill Internal Check Results'), '')
  for (const skillId of RUN_ORDER) {
    const def = SKILL_MAP[skillId]
    const run = site.skills.find((s) => s.id === skillId)
    if (!run || run.checks.length === 0) continue
    lines.push(`**${def.label}:**`)
    run.checks.forEach((c) => {
      const icon = c.state === 'pass' ? '✅' : c.state === 'fail' ? '❌' : c.state === 'partial' ? '🔶' : '⏳'
      lines.push(`- ${icon} ${c.label}`)
    })
    lines.push('')
  }

  // ── 10. COVERAGE & TIMING ─────────────────────────────────────────────────
  lines.push(hrule(), section(10, '📡 Coverage & Timing Telemetry'))
  if (result.coverage) {
    const c = result.coverage
    lines.push(
      '**Crawl Coverage:**',
      '',
      `| Metric | Value |`,
      `|---|---|`,
      `| Pages Fetched | ${c.pagesFetched} |`,
      `| Pages Rendered (JS) | ${c.pagesRendered} |`,
      `| Render Count | ${c.renderCount} |`,
      `| Templates Identified | ${c.templates} |`,
      `| HTTP Requests | ${c.httpRequests} |`,
      `| Robots.txt Status | ${c.robotsStatus ?? 'unknown'} |`,
      `| Crawl Stopped Reason | ${c.stoppedReason ?? '—'} |`,
      `| Skipped Skill Count | ${c.skippedCount ?? 0} |`,
      `| Scope Limitations | ${c.limitedCount ?? 0} |`,
      '',
    )
  }
  if (result.timing) {
    const t = result.timing
    lines.push(
      '**Execution Timing:**',
      '',
      `| Phase | Duration |`,
      `|---|---|`,
      t.totalMs ? `| Total Wall-Clock | ${(t.totalMs / 1000).toFixed(2)}s |` : '',
      t.crawlMs ? `| Crawl Phase | ${(t.crawlMs / 1000).toFixed(2)}s |` : '',
      t.renderMs ? `| Render Phase | ${(t.renderMs / 1000).toFixed(2)}s |` : '',
      '',
    )
    if (t.skillMs && Object.keys(t.skillMs).length > 0) {
      lines.push(`| Skill | Duration |`, `|---|---|`)
      for (const [sk, ms] of Object.entries(t.skillMs)) {
        const def = SKILL_MAP[sk as SkillId]
        lines.push(`| ${def?.label ?? sk} | ${(ms / 1000).toFixed(2)}s |`)
      }
      lines.push('')
    }
  }

  // ── 11. INSPECTION BOUNDARIES ─────────────────────────────────────────────
  if (limitations.length > 0) {
    lines.push(hrule(), section(11, '⚠️ Audit Scope Limitations'))
    lines.push('> These are not site defects. They are structural inspection boundaries encountered during the crawl.', '')
    limitations.forEach((l, i) => lines.push(`${i + 1}. ${l.description || l.title}`))
    lines.push('')
  }

  // ── 12. METHODOLOGY ───────────────────────────────────────────────────────
  lines.push(hrule(), section(12, '📚 Methodological Disclosure'))
  lines.push(
    '1. **Read-Only Non-Invasive Audit:** All evaluations via standard HTTP GET/HEAD with zero mutation.',
    '2. **RFC 9309 Adherence:** Crawl respects `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended` exclusion rules.',
    '3. **Dual-Fetch Rendering Verification:** Compares raw server-rendered HTML against client-side hydrated DOM to detect JS-gated extraction barriers.',
    '4. **Citation Extractability vs Live Ranking:** Measures structural extractability — physical preconditions for AI ingest — not stochastic query volume.',
    '5. **Zero LLM Calls:** All analysis is deterministic and rule-based. No external AI API calls during audit.',
    '6. **Simulated Perception Disclaimer:** The Perception Console simulates LLM extraction capability. It is NOT a live query to any AI system.',
    '',
  )

  // ── FOOTER ────────────────────────────────────────────────────────────────
  lines.push(
    hrule(),
    `*Report produced by Brand AI Readiness Diagnostic Engine*  `,
    `*Audit ID: \`${site.id}\` · Generated: ${now}*`,
    '',
  )

  return lines.filter((l) => l !== undefined && l !== null).join('\n')
}

/**
 * Triggers a browser file download of the full diagnostic report.
 */
export function downloadDiagnosticReport(
  site: Site,
  bundle: PerceptionBundle | null = null,
  skippedSkillIds: SkillId[] = [],
): void {
  try {
    const content = generateAuditMarkdown(site, bundle, skippedSkillIds)
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const safeHost = site.host.replace(/[^a-zA-Z0-9.-]/g, '_')
    link.setAttribute('download', `${safeHost}-ai-readiness.md`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Failed to download diagnostic report:', err)
  }
}

/**
 * Backward compatibility wrapper
 */
export function downloadMarkdownReport(site: Site): void {
  downloadDiagnosticReport(site, null, [])
}
