'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { Site } from '@/lib/audit/types'
import { eventLabel, STATUS_STYLE } from '@/lib/audit/status'
import { SKILL_MAP } from '@/lib/audit/skills'

export function EventConsole({ site }: { site: Site }) {
  const lines = site.events.filter((e) => e.type !== 'SKILL_PROGRESS' && e.type !== 'CRAWL_PROGRESS')

  return (
    <div className="h-full overflow-y-auto px-4 py-3 font-mono text-xs [scrollbar-width:none]">
      <AnimatePresence initial={false}>
        {lines.map((event, i) => {
          const skill = event.skillId ? SKILL_MAP[event.skillId] : null
          const color =
            event.type.includes('FINDING') || event.type.includes('PARTIAL')
              ? 'var(--warning)'
              : event.type.includes('COMPLETED') || event.type === 'SITE_VALIDATED'
                ? STATUS_STYLE.completed.color
                : 'var(--signal)'
          const text = skill
            ? `${skill.short} — ${eventLabel(event.type)}`
            : eventLabel(event.type)
          return (
            <motion.div
              key={`${event.at}-${event.type}-${i}`}
              layout
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-baseline gap-2.5 py-[3px]"
            >
              <span
                className="shrink-0 font-mono text-[9px] uppercase tracking-wider"
                style={{ color }}
              >
                {event.type.replace(/_/g, ' ').split(' ')[0]}
              </span>
              <span className="text-muted-foreground">{text}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
