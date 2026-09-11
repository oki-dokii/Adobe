'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useAuditSession } from '@/hooks/use-audit-session'
import { usePerception } from '@/hooks/use-perception'
import { usePrefersReducedMotion } from '@/hooks/use-measure'
import type { RootCause, SkillId } from '@/lib/audit/types'
import type { PerceptionSpan } from '@/lib/perception/types'
import type { TreeViewMode } from './audit-tree'
import { hostOf } from '@/lib/audit/mock-data'
import { downloadDiagnosticReport } from '@/lib/audit/export'
import { AmbientBackground } from './ambient-background'
import { AppHeader } from './app-header'
import { LandingView } from './landing-view'
import { IngestFlight } from './ingest-flight'
import { RunningView } from './running-view'
import { ResultsView } from './results-view'
import { AuditCanvas } from './audit-canvas'
import { GuideOverlay } from './guide-overlay'
import { HelpOverlay } from './help-overlay'
import { PerceptionConsole } from './perception-console'
import { SkillMarketplace } from './skill-marketplace'
import { cn } from '@/lib/utils'

export function AuditExperience() {
  const session = useAuditSession()
  const {
    phase,
    sites,
    focusedSite,
    focusedId,
    setFocusedId,
    ingestOrigin,
    rootArrived,
    skippedSkillIds,
    setSkippedSkillId,
    begin,
    markArrived,
    commitIngest,
    reset,
  } = session
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
  const [perceptionOpen, setPerceptionOpen] = useState(true)
  const perception = usePerception(phase === 'results' ? focusedSite : null, skippedSkillIds)

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
      perception.clearActiveSpan()
      setGuideOpen(false)
      setHelpOpen(false)
      setGuideFocus(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [perception.clearActiveSpan])

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
    perception.clearActiveSpan()
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

  const handleSelectSpan = useCallback(
    (span: PerceptionSpan | null) => {
      perception.selectSpan(span)
      setSelectedSkill(null)
      setActiveCause(null)
    },
    [perception.selectSpan],
  )

  const highlighted = useMemo(
    () => (perception.activeSpan?.skillIds?.length ? perception.activeSpan.skillIds : highlightedSkills),
    [perception.activeSpan, highlightedSkills],
  )

  const highlightSource = useMemo<'span' | 'cause' | 'finding' | 'guide' | 'skill' | null>(() => {
    if (perception.activeSpan) return 'span'
    if (activeCause) return 'cause'
    if (selectedSkill) return 'skill'
    if (guideFocus) return 'guide'
    if (highlightedSkills.length > 0) return 'finding'
    return null
  }, [perception.activeSpan, activeCause, selectedSkill, guideFocus, highlightedSkills])

  const displaySite = useMemo(() => {
    if (!focusedSite) return null
    return {
      ...focusedSite,
      skills: focusedSite.skills.map((s) =>
        skippedSkillIds.includes(s.id) ? { ...s, status: 'skipped' as const } : s,
      ),
    }
  }, [focusedSite, skippedSkillIds])

  const [downloadNotice, setDownloadNotice] = useState<string | null>(null)

  const handleExport = useCallback(() => {
    if (!focusedSite?.result) return
    downloadDiagnosticReport(focusedSite, perception.bundle, skippedSkillIds)
    setDownloadNotice('Report downloaded')
    setTimeout(() => setDownloadNotice(null), 3500)
  }, [focusedSite, perception.bundle, skippedSkillIds])

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <AmbientBackground phase={phase} portalActive={portalActive} ingesting={phase === 'ingesting'} />

      <div
        className={cn(
          'absolute inset-0 z-[2] transition-[left,right,bottom] duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
          phase === 'results' && 'lg:right-[23.5rem]',
          phase === 'results' && perceptionOpen && 'lg:left-[23rem]',
        )}
      >
        <AuditCanvas
          site={displaySite}
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
          highlightPulseToken={perception.activeSpan?.id ?? ''}
          highlightSource={highlightSource}
          className="absolute inset-0"
        />
      </div>

      <AppHeader
        onGuide={() => setGuideOpen(true)}
        onHelp={() => setHelpOpen(true)}
        onReset={reset}
        showReset={phase !== 'landing'}
        showExport={phase === 'results'}
        exportEnabled={Boolean(focusedSite?.result)}
        onExport={handleExport}
      />
      <span className="sr-only" aria-live="polite">{downloadNotice}</span>

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
            <LandingView
              onStart={onStart}
              onPortalFocus={setPortalActive}
              onGuide={() => setGuideOpen(true)}
              skippedSkillIds={skippedSkillIds}
              onToggleSkill={setSkippedSkillId}
            />
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
            <RunningView
              sites={sites}
              focusedSite={focusedSite}
              focusedId={focusedId}
              onFocus={setFocusedId}
              skippedSkillIds={skippedSkillIds}
            />
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
              focusedSkillIds={highlighted}
              highlightedFindingIds={perception.activeSpan?.findingIds}
              onExport={handleExport}
              perceptionPanel={
                <PerceptionConsole
                  layout="embedded"
                  selectedQuestionId={perception.selectedQuestionId}
                  onSelectQuestion={perception.setSelectedQuestionId}
                  onAsk={() => void perception.ask()}
                  loading={perception.loading}
                  error={perception.error}
                  usedClientFallback={perception.usedClientFallback}
                  bundle={perception.bundle}
                  answerDimmed={perception.answerDimmed}
                  activeSpanId={perception.activeSpan?.id ?? null}
                  onSelectSpan={handleSelectSpan}
                />
              }
            />
            {focusedSite.result && (
              <PerceptionConsole
                layout="dock"
                open={perceptionOpen}
                onToggleOpen={() => setPerceptionOpen((v) => !v)}
                selectedQuestionId={perception.selectedQuestionId}
                onSelectQuestion={perception.setSelectedQuestionId}
                onAsk={() => void perception.ask()}
                loading={perception.loading}
                error={perception.error}
                usedClientFallback={perception.usedClientFallback}
                bundle={perception.bundle}
                answerDimmed={perception.answerDimmed}
                activeSpanId={perception.activeSpan?.id ?? null}
                onSelectSpan={handleSelectSpan}
              />
            )}
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
