'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'

export function HelpOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal aria-labelledby="help-title">
      <button type="button" className="absolute inset-0 bg-background/70" aria-label="Close help" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-2xl"
      >
        <p className="font-mono text-[11px] tracking-wider text-signal">Help</p>
        <h2 id="help-title" className="mt-2 text-xl font-semibold tracking-tight">
          How to read a diagnosis
        </h2>
        <div className="mt-5 space-y-4 text-[13px] leading-relaxed text-muted-foreground">
          <p>
            <span className="text-foreground">What was observed</span> — a skill reports a concrete condition on sampled pages, with evidence attached.
          </p>
          <p>
            <span className="text-foreground">Why it matters</span> — use Why? on scores and findings. Explanations stay evidence-grounded; they do not expose internal reasoning traces.
          </p>
          <p>
            <span className="text-foreground">Limitations</span> are visually distinct from findings. A 403, challenge page, or insufficient evidence is a bound of the audit, not a defect of the site.
          </p>
          <p>
            Click a tree node to inspect that skill. Click a cause in the chain to highlight the branches and findings that converge on it.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-full border border-border px-4 py-1.5 text-xs text-foreground hover:border-signal/40"
        >
          Close
        </button>
      </motion.div>
    </div>
  )
}
