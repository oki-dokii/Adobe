import type { Finding, Severity, Dimension } from './types'

/** Canonical score contract shared by the adapter, export, and score UI. */
export const SEVERITY_DEDUCTIONS: Record<Severity, number> = {
  critical: 14,
  high: 9,
  medium: 5,
  low: 2,
}

export function deductionForSeverity(severity: Severity): number {
  return SEVERITY_DEDUCTIONS[severity]
}

export function scoreDimension(findings: Finding[], dimension: Dimension): number {
  const raw = findings.reduce((score, finding) => {
    if (finding.isLimitation || finding.dimension !== dimension) return score
    return score - deductionForSeverity(finding.severity)
  }, 90)
  return Math.max(15, Math.min(96, raw))
}

export function overallIndex(scores: Array<{ score: number }>): number {
  return Math.round(scores.reduce((sum, item) => sum + item.score, 0) / (scores.length || 1))
}

/** Deterministic interpolation between the displayed corpus anchors. */
export function benchmarkPercentile(avgScore: number): number {
  if (avgScore >= 91) return 95
  if (avgScore >= 82) return Math.round(75 + ((avgScore - 82) / 9) * 20)
  if (avgScore >= 67) return Math.round(50 + ((avgScore - 67) / 15) * 25)
  if (avgScore >= 50) return Math.round(25 + ((avgScore - 50) / 17) * 25)
  return Math.max(10, Math.round((avgScore / 50) * 25))
}
