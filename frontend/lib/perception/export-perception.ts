import type { SkillId, SkillRun } from '@/lib/audit/types'
import { RUN_ORDER, SKILL_MAP } from '@/lib/audit/skills'
import type { PerceptionBundle } from './types'
import { questionById } from './questions'

/**
 * Generates the Perception Simulation and Skill Marketplace appendix
 * for the downloadable audit report.
 */
export function formatPerceptionMarkdown(
  bundle: PerceptionBundle | null,
  skippedSkillIds: SkillId[] = [],
  skills: SkillRun[] = [],
): string {
  const lines: string[] = [
    '',
    '---',
    '',
    '## Perception Simulation (Assistant Grounding Analysis)',
    '',
    '> **DISCLAIMER:** Simulated extract-grounded perception; NOT a live citation scrape or real-time query of ChatGPT, Perplexity, Gemini, or Google AI Overviews. Output represents what a language model assistant could extract from verifiable first-party HTML.',
    '',
  ]

  if (!bundle) {
    lines.push(
      '*Perception not asked during this diagnostic session.*',
      '',
    )
  } else {
    const { perception, memory, substitution, gravity } = bundle
    const q = questionById(perception.questionId)

    lines.push(
      `### Interrogation Question: "${q.prompt}"`,
      '',
      `- **Simulated Status:** \`${perception.status.toUpperCase()}\``,
      `- **Model Confidence:** \`${perception.confidence.toUpperCase()}\``,
      `- **Fallback Used:** ${perception.usedFallback ? 'Yes (Local deterministic extraction fallback)' : 'No (Direct synthesis)'}`,
      `- **Stale Flag:** ${perception.stale ? 'Yes (Inputs changed since execution)' : 'No'}`,
      '',
      '#### Assistant Synthesized Answer:',
      `> "${perception.answer}"`,
      '',
      '#### Sentence Attribution & Evidence Receipts (Spans):',
      '',
      '| Clause / Sentence | Grounding | Attributed Skills | Finding IDs |',
      '|---|---|---|---|',
    )

    for (const span of perception.spans) {
      const skillsStr = span.skillIds.length ? span.skillIds.join(', ') : '—'
      const findingsStr = span.findingIds.length ? span.findingIds.join(', ') : '—'
      lines.push(
        `| "${span.text.replace(/\|/g, '\\|')}" | \`${span.grounding}\` | \`${skillsStr}\` | \`${findingsStr}\` |`,
      )
    }

    lines.push(
      '',
      '### Brand Working Memory (6-Cell Extraction Register):',
      '',
      '| Memory Cell | State | Verified Value | Source Type | Associated Skills |',
      '|---|---|---|---|---|',
    )

    for (const c of memory.cells) {
      const val = c.filled && c.value ? c.value.replace(/\|/g, '\\|') : '— (Unextractable)'
      lines.push(
        `| **${c.id.toUpperCase()}** | ${c.filled ? 'FILLED' : 'EMPTY'} | ${val} | \`${c.source}\` | \`${c.skillIds.join(', ')}\` |`,
      )
    }

    if (substitution && substitution.active) {
      lines.push(
        '',
        '### Substitution Counterfactual (Simulated from Audit Gaps):',
        '',
        `> **First-Party Strength:** \`${substitution.firstParty.toUpperCase()}\`  `,
        `> **Likely Assistant Citation:** ${substitution.likelyCite}  `,
        '',
        '**Causal Walk to Substitution:**',
        ...substitution.causeChain.map((c, i) => `${i + 1}. **${c.label}** (\`${c.id}\`)`),
      )
    }

    lines.push(
      '',
      '### Recommendation Gravity:',
      '',
      `- **Classification:** \`${gravity.label}\``,
      `- **Assessment:** ${gravity.detail}`,
      `- **Contributing Skills:** \`${gravity.skillIds.join(', ')}\``,
      '',
    )
  }

  // Section: Skill Marketplace
  lines.push(
    '---',
    '',
    '## Skill Marketplace Composition',
    '',
    '| Marketplace Skill | Dimension | Status | Armed / Skipped |',
    '|---|---|---|---|',
  )

  for (const skillId of RUN_ORDER) {
    const def = SKILL_MAP[skillId]
    const run = skills.find((s) => s.id === skillId)
    const isSkipped = skippedSkillIds.includes(skillId)
    const status = isSkipped ? 'SKIPPED' : (run?.status?.toUpperCase() ?? 'COMPLETED')
    lines.push(
      `| **${def.label}** (\`${def.short}\`) | \`${def.dimension.toUpperCase()}\` | \`${status}\` | ${isSkipped ? '**Skipped**' : 'Armed (Active)'} |`,
    )
  }

  lines.push(
    '| **Audit Orchestrator** | `COORDINATION` | `COMPLETED` | Armed (Core Root) |',
    '',
  )

  return lines.join('\n')
}
