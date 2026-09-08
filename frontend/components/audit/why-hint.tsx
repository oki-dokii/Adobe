'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function WhyHint({
  observed,
  matters,
  evidence,
}: {
  observed: string
  matters: string
  evidence?: string
}) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'rounded-full border px-2 py-0.5 font-mono text-[10px] tracking-wide transition-colors',
          open
            ? 'border-signal/50 text-signal'
            : 'border-border text-muted-foreground hover:text-foreground',
        )}
      >
        Why?
      </button>
      {open && (
        <div
          role="note"
          className="absolute right-0 z-20 mt-2 w-64 rounded-lg border border-border bg-popover p-3 text-left shadow-xl"
        >
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Observed</p>
          <p className="mt-1 text-[12px] leading-relaxed text-foreground/90">{observed}</p>
          <p className="mt-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Why it matters</p>
          <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">{matters}</p>
          {evidence && (
            <>
              <p className="mt-2.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Evidence</p>
              <p className="mt-1 font-mono text-[11px] text-foreground/80">{evidence}</p>
            </>
          )}
        </div>
      )}
    </span>
  )
}
