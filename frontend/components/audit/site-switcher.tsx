'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import type { Site } from '@/lib/audit/types'

function siteColor(site: Site): string {
  if ((site.phase === 'completed' || site.phase === 'partial') && site.result) {
    if (site.result.counts.critical > 0) return 'var(--critical)'
    if (site.result.counts.high > 0 || site.result.counts.medium > 0) return 'var(--warning)'
    return 'var(--success)'
  }
  if (site.phase === 'running' || site.phase === 'validating' || site.phase === 'consolidating' || site.phase === 'ingesting') {
    return 'var(--signal)'
  }
  return 'var(--muted-foreground)'
}

/**
 * Multi-site switcher as independent roots, not text chips.
 */
export function SiteSwitcher({
  sites,
  focusedId,
  onFocus,
}: {
  sites: Site[]
  focusedId: string
  onFocus: (id: string) => void
}) {
  return (
    <div className="flex items-end gap-5" role="tablist" aria-label="Audited sites">
      {sites.map((site) => {
        const active = site.id === focusedId
        const color = siteColor(site)
        return (
          <button
            key={site.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onFocus(site.id)}
            className={cn(
              'flex flex-col items-center gap-1.5 rounded-md px-1 py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-signal',
              active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="font-mono text-[10px] tracking-wide">
              {site.host.replace(/^www\./, '').split('.')[0].toUpperCase()}
            </span>
            <span className="relative grid h-5 w-5 place-items-center">
              {active && (
                <motion.span
                  layoutId="site-root-ring"
                  className="absolute inset-0 rounded-full border"
                  style={{ borderColor: color }}
                />
              )}
              <span className="size-2 rounded-full" style={{ background: color }} />
            </span>
          </button>
        )
      })}
    </div>
  )
}
