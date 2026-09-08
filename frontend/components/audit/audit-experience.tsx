'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAuditSession } from '@/hooks/use-audit-session'
import { usePrefersReducedMotion } from '@/hooks/use-measure'
import type { RootCause, SkillId } from '@/lib/audit/types'
import type { TreeViewMode } from './audit-tree'
import { hostOf } from '@/lib/audit/mock-data'
import { AmbientBackground } from './ambient-background'
import { AppHeader } from './app-header'
import { LandingView } from './landing-view'
import { IngestFlight } from './ingest-flight'
import { RunningView } from './running-view'
import { ResultsView } from './results-view'
import { AuditCanvas } from './audit-canvas'
import { GuideOverlay } from './guide-overlay'
import { HelpOverlay } from './help-overlay'
import { cn } from '@/lib/utils'

export function AuditExperience() {
  const session = useAuditSession()
  const { phase, sites, focusedSite, focusedId, setFocusedId, ingestOrigin, rootArrived, begin, markArrived, commitIngest, reset } =
    session
  const reduced = usePrefersReducedMotion()
  const [portalActive, setPortalActive] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [guideFocus, setGuideFocus] = useState<
    'root' | 'dimensions' | 'skills' | 'findings' | 'causes' | 'actions' | null
  >(null)
  const [selectedSkill, setSelectedSkill] = useState<SkillId | null>(null)
  const [activeCause, setActiveCause] = useState<RootCause | null>(null)
  const [highlightedSkills, setHighlightedSkills] = useState<SkillId[]>([])
  const [treeMode, setTreeMode] = useState<TreeViewMode>('diagnose')

  const onStart = useCallback(
    (urls: string[], origin: { x: number; y: number } | null) => {
      setSelectedSkill(null)
      setActiveCause(null)
      setHighlightedSkills([])
      setTreeMode('diagnose')
      begin(urls, origin)
    },
    [begin],
  )

  const onIngestDone = useCallback(() => {
    commitIngest(1)
  }, [commitIngest])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setSelectedSkill(null)
      setActiveCause(null)
      setHighlightedSkills([])
      setGuideOpen(false)
      setHelpOpen(false)
      setGuideFocus(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (phase === 'results') {
      setTreeMode('diagnose')
      setSelectedSkill(null)
    }
  }, [phase])

  const handleSelectSkill = (id: SkillId) => {
    setSelectedSkill((cur) => (cur === id ? null : id))
    setActiveCause(null)
    setHighlightedSkills([])
  }

  const handleSelectRoot = () => {
    setSelectedSkill((cur) => (cur === 'audit-orchestrator' ? null : 'audit-orchestrator'))
    setActiveCause(null)
    setHighlightedSkills([])
  }

  const handleSelectFinding = (skillId: SkillId) => {
    setHighlightedSkills([skillId])
    setSelectedSkill(null)
    setActiveCause(null)
    setTreeMode('findings')
  }

  const handleTreeMode = (mode: TreeViewMode) => {
    setTreeMode(mode)
    setSelectedSkill(null)
    if (mode === 'diagnose') {
      setActiveCause(null)
      setHighlightedSkills([])
    }
  }

  const handleSelectCause = (cause: RootCause | null, skillIds: SkillId[]) => {
    setActiveCause(cause)
    setHighlightedSkills(skillIds)
    setSelectedSkill(null)
  }

  const ingestHost = focusedSite?.host ?? (sites[0] ? hostOf(sites[0].url) : '')

  const treeInteractive = phase !== 'ingesting'

  const highlighted = useMemo(() => highlightedSkills, [highlightedSkills])

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <AmbientBackground phase={phase} portalActive={portalActive} ingesting={phase === 'ingesting'} />

      <div
        className={cn(
          'absolute inset-0 z-[2] transition-[right,bottom] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
          phase === 'results' && 'lg:right-[23.5rem]',
        )}
      >
        <AuditCanvas
          site={focusedSite}
          rootLabel={rootArrived || phase === 'auditing' || phase === 'results' ? focusedSite?.host ?? '' : ''}
          interactive={treeInteractive}
          selectedSkillId={selectedSkill}
          highlightedSkillIds={highlighted}
          onSelectSkill={phase === 'results' || phase === 'auditing' ? handleSelectSkill : undefined}
          onSelectRoot={phase === 'results' ? handleSelectRoot : undefined}
          phase={phase}
          rootArrived={rootArrived}
          sites={sites}
          focusedId={focusedId}
          onFocusSite={setFocusedId}
          guideFocus={guideOpen ? guideFocus : null}
          viewMode={treeMode}
          className="absolute inset-0"
        />
      </div>

      <AppHeader
        onGuide={() => setGuideOpen(true)}
        onHelp={() => setHelpOpen(true)}
        onReset={reset}
        showReset={phase !== 'landing'}
      />

      <AnimatePresence>
        {phase === 'landing' && (
          <motion.div
            key="landing"
            className="relative z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45 }}
          >
            <LandingView onStart={onStart} onPortalFocus={setPortalActive} />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'ingesting' && ingestHost && (
        <IngestFlight
          host={ingestHost}
          origin={ingestOrigin}
          reduced={reduced}
          onArrive={markArrived}
          onComplete={onIngestDone}
        />
      )}

      <AnimatePresence>
        {phase === 'auditing' && focusedSite && focusedId && (
          <motion.div
            key="running"
            className="pointer-events-none absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RunningView sites={sites} focusedSite={focusedSite} focusedId={focusedId} onFocus={setFocusedId} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'results' && focusedSite && focusedId && (
          <motion.div
            key="results"
            className="pointer-events-none absolute inset-0 z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <ResultsView
              sites={sites}
              focusedSite={focusedSite}
              focusedId={focusedId}
              onFocus={setFocusedId}
              selectedSkill={selectedSkill}
              activeCause={activeCause}
              onSelectCause={handleSelectCause}
              onSelectFinding={handleSelectFinding}
              onCloseSkill={() => setSelectedSkill(null)}
              treeMode={treeMode}
              onTreeMode={handleTreeMode}
              focusedSkillIds={highlightedSkills}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <GuideOverlay
        open={guideOpen}
        onClose={() => {
          setGuideOpen(false)
          setGuideFocus(null)
        }}
        onFocusConcept={setGuideFocus}
      />
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  )
}
