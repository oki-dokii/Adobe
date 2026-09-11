import type { Severity, SkillStatus } from './types'

/** Maps a skill status to a CSS color variable and human label. */
export const STATUS_STYLE: Record<
  SkillStatus,
  { color: string; label: string; tone: 'neutral' | 'signal' | 'success' | 'warning' | 'critical' | 'muted' }
> = {
  dormant: { color: 'var(--muted-foreground)', label: 'Dormant', tone: 'muted' },
  initializing: { color: 'var(--signal)', label: 'Initializing', tone: 'signal' },
  queued: { color: 'var(--muted-foreground)', label: 'Queued', tone: 'neutral' },
  running: { color: 'var(--signal)', label: 'Running', tone: 'signal' },
  completed: { color: 'var(--success)', label: 'Clear', tone: 'success' },
  warning: { color: 'var(--warning)', label: 'Warning', tone: 'warning' },
  critical: { color: 'var(--critical)', label: 'Critical', tone: 'critical' },
  skipped: { color: 'var(--muted-foreground)', label: 'Skipped', tone: 'muted' },
  partial: { color: 'var(--warning)', label: 'Partial', tone: 'warning' },
}

export const SEVERITY_STYLE: Record<
  Severity,
  { color: string; label: string; className: string }
> = {
  critical: { color: 'var(--critical)', label: 'Critical', className: 'text-critical' },
  high: { color: 'var(--warning)', label: 'High', className: 'text-warning' },
  medium: { color: 'var(--signal)', label: 'Medium', className: 'text-signal' },
  low: { color: 'var(--muted-foreground)', label: 'Low', className: 'text-muted-foreground' },
}

export function isActive(status: SkillStatus): boolean {
  return status === 'running' || status === 'initializing'
}

export function isResolved(status: SkillStatus): boolean {
  return (
    status === 'completed' ||
    status === 'warning' ||
    status === 'critical' ||
    status === 'partial' ||
    status === 'skipped'
  )
}

export function eventLabel(type: string): string {
  switch (type) {
    case 'AUDIT_STARTED':
      return 'audit started'
    case 'SITE_VALIDATED':
      return 'origin validated'
    case 'CRAWL_STARTED':
      return 'crawl started'
    case 'CRAWL_PROGRESS':
      return 'crawl progress'
    case 'CRAWL_COMPLETED':
      return 'crawl complete'
    case 'RENDER_STARTED':
      return 'render started'
    case 'RENDER_COMPLETED':
      return 'render complete'
    case 'SKILL_STARTED':
      return 'skill engaged'
    case 'SKILL_PROGRESS':
      return 'skill progress'
    case 'SKILL_FINDING':
      return 'finding emitted'
    case 'SKILL_COMPLETED':
      return 'skill complete'
    case 'ROOT_CAUSE_FOUND':
      return 'root cause composed'
    case 'AUDIT_CONSOLIDATING':
      return 'consolidating'
    case 'AUDIT_COMPLETED':
      return 'audit complete'
    case 'AUDIT_PARTIAL':
      return 'audit partial'
    default:
      return type.toLowerCase().replace(/_/g, ' ')
  }
}
