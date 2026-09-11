'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { buildPerceptionContext } from '@/lib/perception/build-context'
import { assembleBundle } from '@/lib/perception/ground'
import type { PerceptionBundle, PerceptionQuestionId, PerceptionSpan } from '@/lib/perception/types'
import type { Site, SkillId } from '@/lib/audit/types'

function skippedSig(ids: SkillId[]) {
  return [...ids].sort().join(',')
}

export function usePerception(site: Site | null, skippedSkillIds: SkillId[]) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<PerceptionQuestionId>('org')
  const [bundle, setBundle] = useState<PerceptionBundle | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usedClientFallback, setUsedClientFallback] = useState(false)
  const [activeSpanId, setActiveSpanId] = useState<string | null>(null)
  const autoKey = useRef<string | null>(null)
  const inflight = useRef(0)

  const ask = useCallback(
    async (questionId: PerceptionQuestionId = selectedQuestionId) => {
      if (!site?.result) return
      const seq = ++inflight.current
      setLoading(true)
      setError(null)
      setUsedClientFallback(false)
      setActiveSpanId(null)

      const body = {
        host: site.host,
        url: site.url,
        questionId,
        skippedSkillIds,
        result: site.result,
        skills: site.skills,
        partial: site.phase === 'partial',
      }

      const fallback = () => {
        const ctx = buildPerceptionContext(
          site.host,
          site.url,
          questionId,
          site.result!,
          site.skills,
          skippedSkillIds,
          site.phase === 'partial',
        )
        return assembleBundle(ctx, site.result!, site.skills)
      }

      try {
        const res = await fetch('/api/perception', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(8000),
        })
        if (!res.ok) throw new Error('bad status')
        const json = (await res.json()) as PerceptionBundle
        if (seq !== inflight.current) return
        setBundle(json)
      } catch {
        if (seq !== inflight.current) return
        setBundle(fallback())
        setUsedClientFallback(true)
        setError('Could not simulate perception. Evidence is still on the tree.')
      } finally {
        if (seq === inflight.current) setLoading(false)
      }
    },
    [selectedQuestionId, site, skippedSkillIds],
  )

  useEffect(() => {
    if (!site?.result) {
      setBundle(null)
      autoKey.current = null
      setSelectedQuestionId('org')
      setActiveSpanId(null)
      setError(null)
      return
    }
    const key = `${site.id}:org`
    if (autoKey.current === key) return
    autoKey.current = key
    setSelectedQuestionId('org')
    void ask('org')
    // First results only — subsequent questions require ASK.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id, Boolean(site?.result)])

  const stale = useMemo(() => {
    if (!bundle) return false
    return skippedSig(skippedSkillIds) !== skippedSig(bundle.perception.skippedSkillIds)
  }, [bundle, skippedSkillIds])

  const answerDimmed = Boolean(bundle && bundle.perception.questionId !== selectedQuestionId)

  const activeSpan: PerceptionSpan | null = useMemo(() => {
    if (!bundle || !activeSpanId) return null
    return bundle.perception.spans.find((s) => s.id === activeSpanId) ?? null
  }, [bundle, activeSpanId])

  const selectSpan = useCallback((span: PerceptionSpan | null) => {
    setActiveSpanId(span?.id ?? null)
  }, [])

  const clearActiveSpan = useCallback(() => setActiveSpanId(null), [])

  return {
    selectedQuestionId,
    setSelectedQuestionId,
    bundle: bundle
      ? {
          ...bundle,
          perception: { ...bundle.perception, stale },
        }
      : null,
    loading,
    error,
    usedClientFallback,
    stale,
    answerDimmed,
    activeSpan,
    selectSpan,
    clearActiveSpan,
    ask,
  }
}
