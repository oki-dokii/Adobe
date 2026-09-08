'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'

const CONCEPTS = [
  {
    id: 'root' as const,
    title: 'Root',
    body: 'The submitted website becomes the origin. Everything else grows from it.',
  },
  {
    id: 'dimensions' as const,
    title: 'Dimensions',
    body: 'Four limbs: Find, Understand, Trust, Engage.',
  },
  {
    id: 'skills' as const,
    title: 'Skills',
    body: 'Specialized twigs on each limb. Data moves only while a skill is working.',
  },
  {
    id: 'findings' as const,
    title: 'Findings',
    body: 'Click a twig or a finding. The tree shows where the observation came from.',
  },
  {
    id: 'causes' as const,
    title: 'Root causes',
    body: 'Findings converge into a causal chain. Select a cause to light the related limbs.',
  },
  {
    id: 'actions' as const,
    title: 'Actions',
    body: 'Prioritized fixes, attached to evidence — not a separate report.',
  },
]

export function GuideOverlay({
  open,
  onClose,
  onFocusConcept,
}: {
  open: boolean
  onClose: () => void
  onFocusConcept?: (id: (typeof CONCEPTS)[number]['id'] | null) => void
}) {
  useEffect(() => {
    if (!open) return
    onFocusConcept?.('root')
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, onFocusConcept])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal aria-labelledby="guide-title">
      <button type="button" className="absolute inset-0 bg-background/55" aria-label="Close guide" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md rounded-xl border border-border bg-background p-5"
      >
        <p className="text-[11px] tracking-wide text-muted-foreground">How it works</p>
        <h2 id="guide-title" className="mt-1 text-lg font-semibold tracking-tight">
          Website → root → diagnosis
        </h2>
        <ol className="mt-5 space-y-1">
          {CONCEPTS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseEnter={() => onFocusConcept?.(s.id)}
                onFocus={() => onFocusConcept?.(s.id)}
                className="w-full rounded-md px-2 py-2 text-left hover:bg-surface/80"
              >
                <p className="text-sm text-foreground">{s.title}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">{s.body}</p>
              </button>
            </li>
          ))}
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-xs text-muted-foreground hover:text-foreground"
        >
          Close
        </button>
      </motion.div>
    </div>
  )
}
