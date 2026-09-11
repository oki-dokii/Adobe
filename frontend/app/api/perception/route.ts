import { NextResponse } from 'next/server'
import { buildPerceptionContext } from '@/lib/perception/build-context'
import { assembleBundle, groundExtractOnly } from '@/lib/perception/ground'
import { getCachedBundle, perceptionCacheKey, setCachedBundle } from '@/lib/perception/cache'
import { PERCEPTION_QUESTIONS } from '@/lib/perception/questions'
import type { PerceptionBundle, PerceptionQuestionId, PerceptionRequestBody, PerceptionResult } from '@/lib/perception/types'

export const runtime = 'nodejs'

const QUESTION_IDS = new Set(PERCEPTION_QUESTIONS.map((q) => q.id))

function isQuestionId(v: unknown): v is PerceptionQuestionId {
  return typeof v === 'string' && QUESTION_IDS.has(v as PerceptionQuestionId)
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms)
    promise.then(
      (v) => {
        clearTimeout(t)
        resolve(v)
      },
      (err) => {
        clearTimeout(t)
        reject(err)
      },
    )
  })
}

function isPerceptionResult(v: unknown): v is PerceptionResult {
  if (!v || typeof v !== 'object') return false
  const o = v as Record<string, unknown>
  return (
    isQuestionId(o.questionId) &&
    (o.status === 'grounded' || o.status === 'refused' || o.status === 'substituted') &&
    typeof o.answer === 'string' &&
    Array.isArray(o.spans)
  )
}

async function tryLlm(packJson: string, questionId: PerceptionQuestionId): Promise<PerceptionResult | null> {
  const customUrl = process.env.PERCEPTION_LLM_URL
  const apiKey = process.env.OPENAI_API_KEY
  if (!customUrl && !apiKey) return null

  const system =
    'Answer only from the evidence pack. If a fact is missing, refuse. Never claim a live AI product cited this brand. Never invent prices, names, or CTAs. Return JSON matching PerceptionResult only, no markdown.'

  const user = `questionId=${questionId}\npack=${packJson}`

  try {
    if (customUrl) {
      const res = await fetch(customUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, user, temperature: 0 }),
      })
      if (!res.ok) return null
      const json: unknown = await res.json()
      return isPerceptionResult(json) ? json : null
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.PERCEPTION_LLM_MODEL || 'gpt-4o-mini',
        temperature: 0,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
      }),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] }
    const content = data.choices?.[0]?.message?.content
    if (!content) return null
    const parsed: unknown = JSON.parse(content)
    return isPerceptionResult(parsed) ? parsed : null
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  let body: PerceptionRequestBody
  try {
    body = (await req.json()) as PerceptionRequestBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body?.result || !Array.isArray(body.skills) || !isQuestionId(body.questionId) || !body.host || !body.url) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const skipped = body.skippedSkillIds ?? []
  const ctx = buildPerceptionContext(
    body.host,
    body.url,
    body.questionId,
    body.result,
    body.skills,
    skipped,
    Boolean(body.partial),
  )

  const key = perceptionCacheKey(
    body.host,
    body.questionId,
    skipped,
    ctx.findings.map((f) => f.id),
  )
  const cached = getCachedBundle(key)
  if (cached) return NextResponse.json(cached)

  const fallback = (): PerceptionBundle => assembleBundle(ctx, body.result, body.skills)

  try {
    const llm = await withTimeout(tryLlm(JSON.stringify(ctx), body.questionId), 8000)
    if (llm) {
      const packHasPrice = /\$\d/.test(JSON.stringify(ctx.findings))
      if (/\$\d/.test(llm.answer) && !packHasPrice) {
        const bundle = fallback()
        setCachedBundle(key, bundle)
        return NextResponse.json(bundle)
      }
      const assembled = assembleBundle(ctx, body.result, body.skills)
      const bundle: PerceptionBundle = {
        ...assembled,
        perception: {
          ...llm,
          disclaimer: 'simulated_extract_grounded',
          stale: false,
          usedFallback: false,
          skippedSkillIds: skipped,
          questionId: body.questionId,
          spans: llm.spans?.length ? llm.spans : groundExtractOnly(ctx).spans,
        },
      }
      setCachedBundle(key, bundle)
      return NextResponse.json(bundle)
    }
  } catch {
    /* extract-only */
  }

  const bundle = fallback()
  setCachedBundle(key, bundle)
  return NextResponse.json(bundle)
}
