import type { AuditResult, SkillId } from '@/lib/audit/types'
import { orderCauses } from '@/lib/audit/causes'
import type { PerceptionStatus, SubstitutionResult } from './types'

function firstParty(result: AuditResult): SubstitutionResult['firstParty'] {
  const scores = result.dimensionScores.map((d) => d.score)
  const min = scores.length ? Math.min(...scores) : 0
  if (min >= 75) return 'strong'
  if (min >= 55) return 'adequate'
  return 'weak'
}

const SUBSTITUTE_RE = /competitor|third-party|aggregat/i

export function buildSubstitution(
  result: AuditResult,
  perceptionStatus: PerceptionStatus,
  host?: string,
): SubstitutionResult {
  const ordered = orderCauses(result.rootCauses)
  const subCause =
    ordered.find((c) => /substitut/i.test(c.id) || /substitut/i.test(c.label)) ?? ordered[ordered.length - 1]

  const weakFindings = result.findings.filter(
    (f) =>
      !f.isLimitation &&
      (f.severity === 'high' || f.severity === 'critical') &&
      (f.skillId === 'ai-answerability-audit' || f.skillId === 'citation-extractability-audit'),
  )
  const textHit = result.findings.some(
    (f) => !f.isLimitation && (SUBSTITUTE_RE.test(f.title) || SUBSTITUTE_RE.test(f.description)),
  )
  const fp = firstParty(result)
  const active =
    perceptionStatus === 'substituted' ||
    (fp === 'weak' && weakFindings.length > 0) ||
    result.rootCauses.some((c) => /substitut/i.test(c.id) || /substitut/i.test(c.label)) ||
    textHit

  const findingIds = subCause?.findingIds?.length
    ? subCause.findingIds
    : weakFindings.map((f) => f.id)
  const skillIds = [
    ...new Set(
      findingIds
        .map((id) => result.findings.find((f) => f.id === id)?.skillId)
        .filter((id): id is SkillId => Boolean(id)),
    ),
  ]

  const domain = host || 'this domain'
  const url = `https://${domain}`

  // Honest competitor reference: never invent specific rival names for unverified domains.
  const rivalName = 'Third-Party Aggregators & Structured Competitors'
  const targetBrandShare = fp === 'strong' ? 72 : fp === 'adequate' ? 52 : 32
  const rivalBrandShare = 100 - targetBrandShare

  // Build dynamic break-point reason from actual audit findings
  let breakPointReason = 'Third-party sources provide machine-readable metadata and direct declarative facts, whereas this domain relies on unstructured content.'
  if (weakFindings.length > 0) {
    const topGap = weakFindings[0]
    breakPointReason = `AI systems prioritize secondary sources because first-party content exhibits extraction failures: "${topGap.title}". Third-party directories and competitors supply structured alternatives.`
  } else if (subCause) {
    breakPointReason = `AI citation drift is driven by ${subCause.label.toLowerCase()} across audited pages, causing assistants to fall back to encyclopedic or competitor sources.`
  }

  // Build dynamic winning attributes from actual failure points
  const winningAttributes: string[] = []
  const hasSchemaFailure = result.findings.some((f) => /schema|json-ld|structured/i.test(f.title) && (f.severity === 'critical' || f.severity === 'high'))
  const hasCrawlFailure = result.findings.some((f) => /robot|user-agent|block|403|bot/i.test(f.title))
  const hasHandoffFailure = result.findings.some((f) => f.skillId === 'engagement-handoff-audit' && (f.severity === 'critical' || f.severity === 'high'))

  if (hasSchemaFailure) {
    winningAttributes.push('Server-rendered Schema.org JSON-LD graphs with complete entity specifications')
  } else {
    winningAttributes.push('Structured semantic HTML with unambiguous section hierarchies')
  }

  if (hasCrawlFailure) {
    winningAttributes.push('Explicit, crawlable RFC 9309 robots.txt permissions for AI retrieval user-agents')
  } else {
    winningAttributes.push('Fast sub-second raw HTML delivery without heavy client hydration barriers')
  }

  if (hasHandoffFailure) {
    winningAttributes.push('Direct semantic deep-links (<a href>) enabling machine-assisted referral completion')
  } else {
    winningAttributes.push('Unambiguous factual question-and-answer pairs formatted for direct RAG ingestion')
  }
  winningAttributes.push('Comprehensive entity disambiguation identifiers (Wikidata / sameAs mapping)')

  // Dynamic remediation code tailored to the audited domain
  const brandName = domain.replace(/^www\./, '').split('.')[0]
  const capitalizedBrand = brandName.charAt(0).toUpperCase() + brandName.slice(1)
  const remediationCode = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "${capitalizedBrand}",
  "url": "${url}",
  "description": "Authoritative entity specifications and verified organizational profile for ${domain}.",
  "sameAs": [
    "https://en.wikipedia.org/wiki/${capitalizedBrand}",
    "https://www.wikidata.org/wiki/${capitalizedBrand}"
  ]
}
</script>`

  return {
    active,
    disclaimer: 'simulated_from_audit_gaps',
    firstParty: fp,
    likelyCite:
      'Third-party sources with extractable specs (aggregators, encyclopedic pages, competitors).',
    targetBrandShare,
    rivalBrandShare,
    rivalName,
    breakPointReason,
    winningAttributes,
    remediationCode,
    liftDelta: fp === 'weak' ? 40 : fp === 'adequate' ? 24 : 12,
    causeChain: ordered.slice(0, 5).map((c) => ({ id: c.id, label: c.label })),
    skillIds,
    findingIds,
  }
}
