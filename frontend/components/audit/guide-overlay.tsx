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
    body: 'Interconnected findings converge into systemic blockers explaining why AI agents fail to index or cite the brand.',
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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
        aria-label="Close guide"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              Diagnostic Guide
            </span>
            <h2 id="guide-title" className="text-lg font-bold tracking-tight text-slate-900">
              Architecture & Diagnostic Flow
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
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
                className="group w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 text-left transition-all hover:border-indigo-200 hover:bg-indigo-50/50 cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600">
                      0{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                      {s.title}
                    </span>
                  </div>
                  <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 uppercase">
                    {s.tag}
                  </span>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {s.body}
                </p>
              </button>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
          <span className="text-xs text-slate-400">
            Press ESC to dismiss
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-4 py-2 font-semibold text-xs text-white hover:bg-indigo-700 transition-colors cursor-pointer shadow-xs"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  )
}
