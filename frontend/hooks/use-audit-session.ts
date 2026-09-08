'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AppPhase, AuditResult, Point, Site } from '@/lib/audit/types'
import { applyEvent, createSite, runSiteAudit } from '@/lib/audit/engine'

/**
 * Owns the whole audit session: the set of sites, the global phase, which site
 * is focused, ingest origin for the URL→root flight, and the lifecycle of the
 * (mock) event streams. Swapping the mock engine for a live backend only
 * touches `runSiteAudit`.
 */
export function useAuditSession() {
  const [phase, setPhase] = useState<AppPhase>('landing')
  const [sites, setSites] = useState<Site[]>([])
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [ingestOrigin, setIngestOrigin] = useState<Point | null>(null)
  const [rootArrived, setRootArrived] = useState(false)
  const cancelers = useRef<(() => void)[]>([])
  const ingestLock = useRef(false)

  const stopAll = useCallback(() => {
    cancelers.current.forEach((c) => c())
    cancelers.current = []
  }, [])

  const begin = useCallback(
    (urls: string[], origin: Point | null = null) => {
      stopAll()
      const created = urls.map((u) => ({ ...createSite(u), phase: 'ingesting' as const }))
      setSites(created)
      setFocusedId(created[0]?.id ?? null)
      setIngestOrigin(origin)
      setRootArrived(false)
      ingestLock.current = false
      setPhase('ingesting')
    },
    [stopAll],
  )

  const markArrived = useCallback(() => {
    setRootArrived(true)
  }, [])

  const commitIngest = useCallback(
    (speed = 1) => {
      if (ingestLock.current) return
      ingestLock.current = true
      setRootArrived(true)
      setPhase('auditing')
      setSites((prev) => {
        cancelers.current.forEach((c) => c())
        cancelers.current = prev.map((site) =>
          runSiteAudit(
            site,
            {
              onEvent: (event) => setSites((cur) => cur.map((s) => applyEvent(s, event))),
              onResult: (result: AuditResult) =>
                setSites((cur) => cur.map((s) => (s.id === site.id ? { ...s, result } : s))),
            },
            speed,
          ),
        )
        return prev
      })
    },
    [],
  )

  const reset = useCallback(() => {
    stopAll()
    setSites([])
    setFocusedId(null)
    setIngestOrigin(null)
    setRootArrived(false)
    ingestLock.current = false
    setPhase('landing')
  }, [stopAll])

  useEffect(() => {
    if (phase !== 'auditing') return
    if (
      sites.length > 0 &&
      sites.every((s) => (s.phase === 'completed' || s.phase === 'partial') && s.result)
    ) {
      const t = setTimeout(() => setPhase('results'), 900)
      return () => clearTimeout(t)
    }
  }, [sites, phase])

  useEffect(() => () => stopAll(), [stopAll])

  const focusedSite = useMemo(
    () => sites.find((s) => s.id === focusedId) ?? sites[0] ?? null,
    [sites, focusedId],
  )

  return {
    phase,
    sites,
    focusedSite,
    focusedId: focusedSite?.id ?? null,
    setFocusedId,
    ingestOrigin,
    rootArrived,
    begin,
    markArrived,
    commitIngest,
    reset,
  }
}
