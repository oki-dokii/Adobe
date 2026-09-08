'use client'

import { AnimatePresence, motion } from 'motion/react'
import type { SkillRun } from '@/lib/audit/types'
import { SKILL_MAP } from '@/lib/audit/skills'
import { STATUS_STYLE, isActive } from '@/lib/audit/status'

/**
 * Compact tooltip on hover/focus. Name, purpose, status, small evidence cue.
 */
export function SkillTooltip({
  skill,
  x,
  y,
  containerWidth,
}: {
  skill: SkillRun | null
  x: number
  y: number
  containerWidth: number
}) {
  const def = skill ? SKILL_MAP[skill.id] : null
  return (
    <AnimatePresence>
      {skill && def && (
        <motion.div
          key={skill.id}
          role="tooltip"
          className="pointer-events-none absolute z-30 w-56"
          style={{
            left: Math.min(Math.max(x, 120), Math.max(containerWidth - 120, 120)),
            top: y,
            transform: 'translate(-50%, calc(-100% - 18px))',
          }}
          initial={{ opacity: 0, y: 6, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.97 }}
          transition={{ duration: 0.16 }}
        >
          <div className="rounded-lg border border-border bg-popover/95 p-3 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between gap-2">
              <p className="font-mono text-[10px] tracking-tight text-foreground">{def.label}</p>
              <span
                className="size-1.5 rounded-full"
                style={{
                  background: STATUS_STYLE[skill.status].color,
                  boxShadow: `0 0 6px ${STATUS_STYLE[skill.status].color}`,
                }}
              />
            </div>
            <p className="mt-1.5 text-pretty text-[12px] leading-snug text-muted-foreground">{def.summary}</p>
            <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2 text-[11px] text-muted-foreground">
              <span style={{ color: STATUS_STYLE[skill.status].color }}>{STATUS_STYLE[skill.status].label}</span>
              <span className="font-mono">
                {isActive(skill.status)
                  ? `${Math.round(skill.progress * 100)}%`
                  : skill.pagesInspected > 0
                    ? `${skill.pagesInspected} pages`
                    : '—'}
              </span>
            </div>
            {isActive(skill.status) && (
              <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full bg-signal"
                  style={{ width: `${Math.round(skill.progress * 100)}%` }}
                />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
