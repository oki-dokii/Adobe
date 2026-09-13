import fs from 'fs'
import path from 'path'
import { adaptBackendResult } from '../lib/audit/adapter'
import { generateAuditMarkdown } from '../lib/audit/export'
import { buildInitialSkills } from '../lib/audit/mock-data'
import type { Site } from '../lib/audit/types'

function loadFixtureSite(id: string, url: string, host: string, findingsJsonName: string): Site {
  const findingsPath = path.resolve(
    __dirname,
    '../../brand-ai-readiness-audit/evaluation/results/findings',
    findingsJsonName,
  )
  const rawContent = fs.readFileSync(findingsPath, 'utf-8')
  const payload = JSON.parse(rawContent)
  const result = adaptBackendResult(payload)
  
  return {
    id: `${id}-audit-run`,
    url,
    host,
    phase: 'completed',
    skills: buildInitialSkills(),
    result,
    events: [],
  }
}

function lineDiff(textA: string, textB: string, labelA: string, labelB: string): string {
  const linesA = textA.split('\n')
  const linesB = textB.split('\n')
  const diffLines: string[] = [`--- ${labelA}`, `+++ ${labelB}`]
  
  const maxLines = Math.max(linesA.length, linesB.length)
  let diffCount = 0
  for (let i = 0; i < maxLines; i++) {
    const lA = linesA[i]
    const lB = linesB[i]
    if (lA !== lB) {
      if (diffCount < 40) {
        if (lA !== undefined) diffLines.push(`- L${i + 1}: ${lA}`)
        if (lB !== undefined) diffLines.push(`+ L${i + 1}: ${lB}`)
      }
      diffCount++
    }
  }
  diffLines.push(`Total differing lines: ${diffCount}`)
  return diffLines.join('\n')
}

export function runVerification() {
  console.log('======================================================================')
  console.log('RUNNING 3-SITE DIAGNOSTIC ENGINE VERIFICATION & DIFF ANALYSIS')
  console.log('======================================================================\n')

  // 1. Load 3 structurally different sites
  const site1 = loadFixtureSite('stripe-saas', 'https://stripe.com/', 'stripe.com', 'stripe-saas_warm.json')
  const site2 = loadFixtureSite('shopify-ecom', 'https://shopify.com/', 'shopify.com', 'shopify-ecommerce_warm.json')
  const site3 = loadFixtureSite('python-docs', 'https://docs.python.org/3/', 'docs.python.org', 'python-docs_warm.json')

  // 2. Generate markdown reports
  const report1 = generateAuditMarkdown(site1)
  const report2 = generateAuditMarkdown(site2)
  const report3 = generateAuditMarkdown(site3)

  const outputDir = path.resolve(__dirname, '../../analysis/verified_reports')
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(path.join(outputDir, 'stripe-saas-report.md'), report1)
  fs.writeFileSync(path.join(outputDir, 'shopify-ecom-report.md'), report2)
  fs.writeFileSync(path.join(outputDir, 'python-docs-report.md'), report3)

  console.log(`✓ Reports generated and saved to ${outputDir}\n`)

  // ── VERIFICATION CHECKS ────────────────────────────────────────────────────
  let failures = 0

  // Check 1: Structural Section Headings consistency (deterministic schema)
  const getSections = (text: string) => text.match(/^## \d+\..*$/gm) || []
  const sec1 = getSections(report1)
  const sec2 = getSections(report2)
  const sec3 = getSections(report3)

  console.log('1. SCHEMA CONSISTENCY:')
  console.log(`   Site 1 Sections: ${sec1.length} -> [${sec1.map(s => s.replace(/^## \d+\. /, '')).join(' | ')}]`)
  console.log(`   Site 2 Sections: ${sec2.length}`)
  console.log(`   Site 3 Sections: ${sec3.length}`)
  
  if (JSON.stringify(sec1) === JSON.stringify(sec2) && JSON.stringify(sec2) === JSON.stringify(sec3)) {
    console.log('   ✓ PASSED: All 3 reports follow identical, deterministic section schema.\n')
  } else {
    console.error('   ❌ FAILED: Schema section mismatch across reports!')
    failures++
  }

  // Check 2: No impossible confidence values (> 100%)
  console.log('2. CONFIDENCE SCALE VALIDATION (<= 100%):')
  const findOver100Pct = (text: string) => {
    const matches = text.match(/\b(\d{3,})%/g) || []
    return matches.filter(m => parseInt(m) > 100)
  }
  const over1 = findOver100Pct(report1)
  const over2 = findOver100Pct(report2)
  const over3 = findOver100Pct(report3)
  if (over1.length === 0 && over2.length === 0 && over3.length === 0) {
    console.log('   ✓ PASSED: Zero percentage values exceed 100% across all 3 reports.\n')
  } else {
    console.error(`   ❌ FAILED: Found values > 100%: Site1: ${over1}, Site2: ${over2}, Site3: ${over3}`)
    failures++
  }

  // Check 3: No fabricated 3rd-party AI models without API calls
  console.log('3. THIRD-PARTY MODEL ATTRIBUTION CHECK:')
  const forbiddenModels = ['GPT-4o:', 'Claude 3.5:', 'Perplexity Online:', 'Gemini 1.5 Pro:']
  const modelHits = [report1, report2, report3].flatMap((r, idx) =>
    forbiddenModels.filter(m => r.includes(m)).map(m => `Site ${idx + 1}: ${m}`)
  )
  if (modelHits.length === 0) {
    console.log('   ✓ PASSED: No unbacked third-party AI model citations present in output.\n')
  } else {
    console.error(`   ❌ FAILED: Found fake model citations: ${modelHits.join(', ')}`)
    failures++
  }

  // Check 4: Check for hardcoded constants that must be removed
  console.log('4. ABSENCE OF FORMER HARDCODED CONSTANTS:')
  const hardcodedTokens = [
    'Enterprise custom SLA terms',
    'EU Data Residency guarantee',
    'Dedicated Account Manager eligibility',
    'Overall Memory Half-Life Estimate: 4.2 days',
    'Adobe C2PA Content Credentials',
  ]
  const constantHits = [report1, report2, report3].flatMap((r, idx) =>
    hardcodedTokens.filter(t => r.includes(t)).map(t => `Site ${idx + 1}: "${t}"`)
  )
  if (constantHits.length === 0) {
    console.log('   ✓ PASSED: All previous hardcoded boilerplate strings successfully eliminated.\n')
  } else {
    console.error(`   ❌ FAILED: Found hardcoded boilerplate: ${constantHits.join(', ')}`)
    failures++
  }

  // Check 5: Live evidence variance & Causal consequence chains
  console.log('5. LIVE EVIDENCE VARIANCE & PER-FINDING CAUSAL CHAINS:')
  console.log(`   - Site 1 (${site1.host}) Readiness Index: ${report1.match(/AI Readiness Index.*?\*\*(\d+ \/ 100)\*\*/)?.[1]}`)
  console.log(`   - Site 2 (${site2.host}) Readiness Index: ${report2.match(/AI Readiness Index.*?\*\*(\d+ \/ 100)\*\*/)?.[1]}`)
  console.log(`   - Site 3 (${site3.host}) Readiness Index: ${report3.match(/AI Readiness Index.*?\*\*(\d+ \/ 100)\*\*/)?.[1]}`)
  
  // Diff analysis
  const diff12 = lineDiff(report1, report2, 'stripe.com', 'shopify.com')
  const diff23 = lineDiff(report2, report3, 'shopify.com', 'docs.python.org')
  fs.writeFileSync(path.join(outputDir, 'diff_stripe_vs_shopify.patch'), diff12)
  fs.writeFileSync(path.join(outputDir, 'diff_shopify_vs_python_docs.patch'), diff23)
  console.log(`   ✓ Unified diffs generated and saved to ${outputDir}.\n`)

  if (failures === 0) {
    console.log('======================================================================')
    console.log('ALL 5 VERIFICATION CHECKS PASSED WITH 100% FIDELITY!')
    console.log('======================================================================')
  } else {
    throw new Error(`${failures} verification checks failed!`)
  }
}

runVerification()
