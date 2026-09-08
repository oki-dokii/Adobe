/**
 * MOCK EVENT ENGINE
 *
 * Generates a coherent, ordered event timeline for a site audit and replays it
 * over time. The UI never hard-codes animation — it reacts to these events, so
 * the same reducer (`applyEvent`) can be driven by a real backend event stream.
 *
 * TODO(backend): replace `runSiteAudit` with a subscription to the backend
 * event log (SSE / WebSocket) that emits `AuditEvent`s. `applyEvent` and the UI
 * remain unchanged. Map the payload with `adaptBackendResult`.
 */

import type { AuditEvent, AuditResult, Site, SkillId, SkillRun, SkillStatus } from './types'
import { RUN_ORDER } from './skills'
import { buildDemoResult, buildInitialSkills, hostOf, skillOutcomesFor } from './mock-data'

export function createSite(url: string): Site {
  return {
    id: `${hostOf(url)}-${Math.random().toString(36).slice(2, 8)}`,
    url,
    host: hostOf(url),
    phase: 'dormant',
    skills: buildInitialSkills(),
    events: [],
  }
}

interface TimedEvent {
  delay: number
  event: AuditEvent
}

function skillEvents(
  siteId: string,
  id: SkillId,
  start: number,
  duration: number,
  finalStatus: SkillStatus,
  emitFinding: boolean,
): TimedEvent[] {
  const events: TimedEvent[] = []
  const at = (d: number) => Math.round(d)
  events.push({
    delay: start,
    event: { type: 'SKILL_STARTED', siteId, skillId: id, at: at(start), status: 'running' },
  })
  for (let p = 1; p <= 3; p++) {
    const t = start + (duration * p) / 4
    events.push({
      delay: t,
      event: { type: 'SKILL_PROGRESS', siteId, skillId: id, progress: p / 4, at: at(t) },
    })
  }
  if (emitFinding) {
    events.push({
      delay: start + duration * 0.68,
      event: { type: 'SKILL_FINDING', siteId, skillId: id, at: at(start + duration * 0.68) },
    })
  }
  events.push({
    delay: start + duration,
    event: { type: 'SKILL_COMPLETED', siteId, skillId: id, status: finalStatus, at: at(start + duration) },
  })
  return events
}

/** Build the full timeline of events that leads a site to its demo result. */
function buildTimeline(site: Site, result: AuditResult): TimedEvent[] {
  const outcomes = skillOutcomesFor(result)
  const events: TimedEvent[] = []
  const at = (delay: number) => Math.round(delay)
  const hasFinding = (id: SkillId) => result.findings.some((f) => f.skillId === id && !f.isLimitation)

  events.push({ delay: 0, event: { type: 'AUDIT_STARTED', siteId: site.id, at: at(0) } })
  events.push({ delay: 380, event: { type: 'SITE_VALIDATED', siteId: site.id, at: at(380) } })

  // 0–10%: classify
  events.push(...skillEvents(site.id, 'site-type-classifier', 520, 720, outcomes['site-type-classifier'].status, hasFinding('site-type-classifier')))

  // 10–30%: crawl
  events.push({
    delay: 1180,
    event: { type: 'CRAWL_STARTED', siteId: site.id, skillId: 'crawl-access-audit', at: at(1180) },
  })
  events.push(...skillEvents(site.id, 'crawl-access-audit', 1180, 1100, outcomes['crawl-access-audit'].status, hasFinding('crawl-access-audit')))
  events.push({
    delay: 1600,
    event: { type: 'CRAWL_PROGRESS', siteId: site.id, skillId: 'crawl-access-audit', progress: 0.55, at: at(1600) },
  })
  events.push({
    delay: 2280,
    event: { type: 'CRAWL_COMPLETED', siteId: site.id, skillId: 'crawl-access-audit', at: at(2280) },
  })

  // 30–45%: render / extract
  events.push({
    delay: 2360,
    event: { type: 'RENDER_STARTED', siteId: site.id, skillId: 'render-extract-audit', at: at(2360) },
  })
  events.push(...skillEvents(site.id, 'render-extract-audit', 2360, 1200, outcomes['render-extract-audit'].status, hasFinding('render-extract-audit')))
  events.push({
    delay: 3560,
    event: { type: 'RENDER_COMPLETED', siteId: site.id, skillId: 'render-extract-audit', at: at(3560) },
  })

  // 45–80%: citation, entity, answerability, freshness, corroboration, engagement
  const rest: SkillId[] = [
    'entity-identity-audit',
    'citation-extractability-audit',
    'ai-answerability-audit',
    'freshness-audit',
    'corroboration-consistency-audit',
    'engagement-handoff-audit',
  ]
  const restStart = 3640
  const stagger = 380
  const duration = 1320
  let lastEnd = restStart
  rest.forEach((id, i) => {
    const start = restStart + i * stagger
    lastEnd = Math.max(lastEnd, start + duration)
    events.push(...skillEvents(site.id, id, start, duration, outcomes[id].status, hasFinding(id)))
  })

  events.push({
    delay: lastEnd + 180,
    event: { type: 'ROOT_CAUSE_FOUND', siteId: site.id, at: at(lastEnd + 180) },
  })
  events.push({
    delay: lastEnd + 420,
    event: { type: 'AUDIT_CONSOLIDATING', siteId: site.id, at: at(lastEnd + 420) },
  })
  const limited = result.findings.some((f) => f.isLimitation)
  events.push({
    delay: lastEnd + 780,
    event: {
      type: limited ? 'AUDIT_PARTIAL' : 'AUDIT_COMPLETED',
      siteId: site.id,
      at: at(lastEnd + 780),
    },
  })

  events.sort((a, b) => a.delay - b.delay)
  return events
}

export function estimatedDuration(): number {
  return 3640 + 5 * 380 + 1320 + 780
}

/**
 * Replays a site's audit. Returns a cancel function.
 * `speed` > 1 runs faster (used by demo mode).
 */
export function runSiteAudit(
  site: Site,
  handlers: {
    onEvent: (event: AuditEvent) => void
    onResult: (result: AuditResult) => void
  },
  speed = 1,
): () => void {
  const result = buildDemoResult(site.url)
  const events = buildTimeline(site, result)
  const timers: ReturnType<typeof setTimeout>[] = []

  for (const { delay, event } of events) {
    timers.push(
      setTimeout(() => {
        handlers.onEvent(event)
        if (event.type === 'AUDIT_COMPLETED' || event.type === 'AUDIT_PARTIAL') {
          handlers.onResult(result)
        }
      }, delay / speed),
    )
  }

  return () => timers.forEach(clearTimeout)
}

function appendEvent(site: Site, event: AuditEvent): AuditEvent[] {
  return [...site.events, event].slice(-80)
}

function updateSkill(site: Site, skillId: string, patch: Partial<SkillRun>): SkillRun[] {
  return site.skills.map((s) => (s.id === skillId ? { ...s, ...patch } : s))
}

function queueAll(site: Site): SkillRun[] {
  return site.skills.map((s) =>
    s.status === 'dormant' || s.status === 'initializing' ? { ...s, status: 'queued' as const } : s,
  )
}

/** Pure reducer: apply one event to a site. Shared by mock + real streams. */
export function applyEvent(site: Site, event: AuditEvent): Site {
  if (event.siteId !== site.id) return site
  const events = appendEvent(site, event)

  switch (event.type) {
    case 'AUDIT_STARTED':
      return {
        ...site,
        events,
        phase: 'validating',
        skills: site.skills.map((s) => ({ ...s, status: 'initializing' as const, progress: 0 })),
      }
    case 'SITE_VALIDATED':
      return { ...site, events, phase: 'running', skills: queueAll({ ...site, events }) }
    case 'CRAWL_STARTED':
      return {
        ...site,
        events,
        phase: 'running',
        skills: updateSkill({ ...site, skills: queueAll(site) }, 'crawl-access-audit', {
          status: 'running',
          progress: 0.05,
        }),
      }
    case 'CRAWL_PROGRESS':
      return {
        ...site,
        events,
        skills: updateSkill(site, 'crawl-access-audit', { progress: event.progress ?? 0.5, status: 'running' }),
      }
    case 'CRAWL_COMPLETED':
      return { ...site, events }
    case 'RENDER_STARTED':
      return {
        ...site,
        events,
        skills: updateSkill(site, 'render-extract-audit', { status: 'running', progress: 0.05 }),
      }
    case 'RENDER_COMPLETED':
      return { ...site, events }
    case 'SKILL_STARTED':
      return {
        ...site,
        events,
        skills: updateSkill(site, event.skillId!, { status: 'running', progress: 0.02 }),
      }
    case 'SKILL_PROGRESS':
      return {
        ...site,
        events,
        skills: updateSkill(site, event.skillId!, { progress: event.progress ?? 0, status: 'running' }),
      }
    case 'SKILL_FINDING':
      return {
        ...site,
        events,
        skills: site.skills.map((s) =>
          s.id === event.skillId
            ? {
                ...s,
                findingEmitted: true,
                pagesInspected: s.pagesInspected + 6 + Math.floor(Math.random() * 6),
              }
            : s,
        ),
      }
    case 'SKILL_COMPLETED': {
      const result = buildDemoResult(site.url)
      const outcomes = skillOutcomesFor(result)
      const outcome = outcomes[event.skillId as keyof typeof outcomes]
      const checks = site.skills.find((s) => s.id === event.skillId)?.checks ?? []
      const resolvedChecks = checks.map((c, i) => {
        if (outcome.status === 'critical' && i === checks.length - 1) return { ...c, state: 'fail' as const }
        if (outcome.status === 'warning' && i === checks.length - 1) return { ...c, state: 'partial' as const }
        if (outcome.status === 'partial' && i >= checks.length - 2) return { ...c, state: 'pending' as const }
        return { ...c, state: 'pass' as const }
      })
      return {
        ...site,
        events,
        skills: updateSkill(site, event.skillId!, {
          status: event.status ?? 'completed',
          progress: 1,
          confidence: outcome?.confidence,
          checks: resolvedChecks,
          pagesInspected: site.skills.find((s) => s.id === event.skillId)?.pagesInspected || 12,
        }),
      }
    }
    case 'ROOT_CAUSE_FOUND':
      return { ...site, events }
    case 'AUDIT_CONSOLIDATING':
      return { ...site, events, phase: 'consolidating' }
    case 'AUDIT_PARTIAL':
      return { ...site, events, phase: 'partial' }
    case 'AUDIT_COMPLETED':
      return { ...site, events, phase: 'completed' }
    default:
      return { ...site, events }
  }
}

export { RUN_ORDER }
