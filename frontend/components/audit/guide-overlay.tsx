'use client'

import { useEffect } from 'react'
import { motion } from 'motion/react'

const CONCEPTS = [
  {
    id: 'root' as const,
    title: 'Root Origin',
    body: 'The target website becomes the structural origin. All diagnostic branches grow outwards from this anchor.',
    tag: 'Origin',
  },
  {
    id: 'dimensions' as const,
    title: 'Causal Dimensions',
    body: 'Four foundational pillars of AI visibility: Find, Understand, Trust, and Engage.',
    tag: 'Dimensions',
  },
  {
    id: 'skills' as const,
    title: 'Diagnostic Skills',
    body: 'Nine specialized inspection agents analyzing robots directives, schema graphs, rendering ratios, and temporal freshness.',
    tag: 'Skills',
  },
  {
    id: 'findings' as const,
    title: 'Evidence-Backed Findings',
    body: 'Direct observations extracted from live headers, DOM nodes, and robots directives. Traceable to exact source nodes.',
    tag: 'Evidence',
  },
  {
    id: 'causes' as const,
    title: 'Root Cause Chains',
    body: 'Interconnected findings converge into systemic blockers explaining why AI agents fail to index or synthesize the brand.',
    tag: 'Diagnosis',
  },
  {
    id: 'actions' as const,
    title: 'Actionable Remediation',
    body: 'Prioritized, code-ready interventions to resolve extractability hurdles and maximize AI citation presence.',
    tag: 'Action',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal aria-labelledby="guide-title">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
        aria-label="Close guide"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0e1424]/95 p-6 backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center justify-between border-b border-white/8 pb-4">
          <div>
            <span className="font-mono text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
              Diagnostic Instrument Guide
            </span>
            <h2 id="guide-title" className="text-lg font-bold tracking-tight text-foreground">
              Architecture & Execution Flow
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <ol className="mt-4 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {CONCEPTS.map((s, idx) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseEnter={() => onFocusConcept?.(s.id)}
                onFocus={() => onFocusConcept?.(s.id)}
                className="group w-full rounded-xl border border-white/6 bg-white/[0.02] p-3 text-left transition-all hover:border-indigo-500/30 hover:bg-indigo-500/[0.06] cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-indigo-400/80">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-foreground group-hover:text-indigo-200 transition-colors">
                      {s.title}
                    </span>
                  </div>
                  <span className="rounded-md border border-white/6 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground uppercase">
                    {s.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                  {s.body}
                </p>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-3 text-xs">
          <span className="font-mono text-[10px] text-muted-foreground/60">
            Press ESC to dismiss
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-indigo-500 px-3 py-1.5 font-medium text-xs text-white hover:bg-indigo-400 transition-colors cursor-pointer"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  )
}
