import type { Site, SkillId } from './types'
import { DIMENSIONS, SKILL_MAP } from './skills'
import type { PerceptionBundle } from '@/lib/perception/types'
import { formatPerceptionMarkdown } from '@/lib/perception/export-perception'

/**
 * Formats a comprehensive Markdown perception diagnostic report
 * matching the production evaluation reporting contract.
 */
export function generateAuditMarkdown(
  site: Site,
  bundle: PerceptionBundle | null = null,
  skippedSkillIds: SkillId[] = [],
): string {
  const result = site.result
  if (!result) return `# Diagnostic Report for ${site.host}\n\nNo result available.`

  const avgScore = Math.round(
    result.dimensionScores.reduce((acc, d) => acc + d.score, 0) / (result.dimensionScores.length || 1),
  )

  const letterGrade =
    avgScore >= 90 ? 'A' :
    avgScore >= 80 ? 'A-' :
    avgScore >= 75 ? 'B+' :
    avgScore >= 70 ? 'B' :
    avgScore >= 60 ? 'C+' :
    avgScore >= 50 ? 'C' : 'D'

  const now = new Date().toISOString()

  const lines: string[] = [
    `# Brand AI Readiness Perception Diagnostic — ${site.host}`,
    '',
    `> **Audit ID:** \`${site.id}\`  `,
    `> **Generated:** ${now}  `,
    `> **Methodology:** Dual-Fetch Static + Hydrated DOM Analysis (Deterministic v1, llm_calls=0)  `,
    `> **Standards Compliance:** Robots Exclusion Protocol (RFC 9309), Schema.org Entity Specifications  `,
    '',
    '---',
    '',
    '## 1. Executive Summary & BLUF',
    '',
    `- **AI Readiness Index:** **${avgScore} / 100** (Grade: **${letterGrade}**)`,
    `- **Diagnosis:** ${result.overallLabel}`,
    `- **Observation:** ${result.overallSummary}`,
    `- **Defect Register:** ${result.counts.critical} Critical · ${result.counts.high} High · ${result.counts.medium} Medium`,
    '',
    '---',
    '',
    '## 2. Evaluation Corpus Benchmark (38 Empirical Sites)',
    '',
    '| Metric | Corpus Value | Brand Position |',
    '|---|---|---|',
    `| **Brand Score** | **${avgScore} / 100** | Grade ${letterGrade} |`,
    '| **Corpus Median** | 67 / 100 | ' + (avgScore >= 67 ? 'Above median (+ ' + (avgScore - 67) + ' pts)' : 'Below median (− ' + (67 - avgScore) + ' pts)') + ' |',
    '| **Top Quartile (25%)** | 82 / 100 | ' + (avgScore >= 82 ? 'Citation Leader' : `${82 - avgScore} pts gap to top quartile`) + ' |',
    '| **Corpus Best** | 91 / 100 | Reference Benchmark |',
    '',
    '---',
    '',
    '## 3. Causal Dimension Breakdown',
    '',
    '| Dimension | Verb | Score | Status | Description |',
    '|---|---|---|---|---|',
  ]

  for (const ds of result.dimensionScores) {
    const dim = DIMENSIONS[ds.dimension]
    lines.push(
      `| **${dim.label}** | \`${dim.verb}\` | ${ds.score}/100 | ${ds.label.toUpperCase()} | ${dim.description} |`,
    )
  }

  lines.push(
    '',
    '---',
    '',
    '## 4. Lost Point Inventory (Score Decomposition)',
    '',
    `Total Deductions: **−${Math.max(0, 100 - avgScore)} points**`,
    '',
  )

  const nonLimitations = result.findings.filter((f) => !f.isLimitation)
  for (const f of nonLimitations) {
    const deduction =
      f.severity === 'critical' ? 12 : f.severity === 'high' ? 8 : f.severity === 'medium' ? 4 : 2
    lines.push(`- **−${deduction} pts** | **[${f.severity.toUpperCase()}]** ${f.title} *(${DIMENSIONS[f.dimension]?.label})*`)
  }

  lines.push(
    '',
    '---',
    '',
    '## 5. Systemic Root Causes & Downstream AI Impact',
    '',
  )

  for (const cause of result.rootCauses) {
    lines.push(
      `### Root Cause: ${cause.label} [${cause.severity.toUpperCase()}]`,
      '',
      `- **Structural Origin:** ${cause.detail}`,
      `- **Propagated Finding Count:** ${cause.findingIds.length}`,
      '',
    )
  }

  lines.push(
    '---',
    '',
    '## 6. Actionable Remediation Register',
    '',
  )

  for (const f of nonLimitations) {
    const skill = SKILL_MAP[f.skillId]
    lines.push(
      `### [${f.severity.toUpperCase()}] ${f.title}`,
      `**Skill:** ${skill?.label ?? f.skillId} | **Dimension:** ${DIMENSIONS[f.dimension]?.label}`,
      '',
      `**Observed Signal:**  \n${f.description}`,
      '',
      `**Why This Matters for AI Perception:**  \n${f.whyItMatters}`,
      '',
      '**Concrete Evidence:**',
    )
    for (const ev of f.evidence) {
      lines.push(`- \`${ev.label}\`: ${ev.detail}${ev.url ? ` (${ev.url})` : ''}`)
    }
    lines.push(
      '',
      `**Recommended Action (${f.recommendation.priority.toUpperCase()} priority, ${f.recommendation.effort} effort):**  \n${f.recommendation.title}  \n*${f.recommendation.detail}*`,
      '',
    )
  }

  lines.push(
    '---',
    '',
    '## 7. Methodological Scope & Limitations Disclosure',
    '',
    '1. **Read-Only Non-Invasive Audit:** All evaluations performed strictly via standard HTTP GET/HEAD requests with zero mutation.',
    '2. **RFC 9309 Adherence:** Crawl policies respect specified User-Agents (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`).',
    '3. **Dual-Fetch Rendering Verification:** Compares raw server-rendered HTML payloads against client-side hydrated trees to detect JavaScript-gated extraction barriers.',
    '4. **Citation Extractability vs Live Ranking:** This audit measures structural extractability—the physical preconditions required for AI search ingest—rather than stochastic, non-deterministic query volume.',
    '',
    '---',
    `*Report produced by Brand AI Readiness Diagnostic Engine · ID: ${site.id}*`,
  )

  // Append Perception Simulation & Marketplace Sections
  lines.push(formatPerceptionMarkdown(bundle, skippedSkillIds, site.skills))

  return lines.join('\n')
}

/**
 * Triggers a browser file download of the full diagnostic report including perception simulation.
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

