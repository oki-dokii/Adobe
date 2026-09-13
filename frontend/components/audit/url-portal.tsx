'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { hostOf, isValidUrl, normalizeUrl, SAMPLE_URLS } from '@/lib/audit/mock-data'
import type { Point } from '@/lib/audit/types'

/**
 * The diagnostic aperture — not a generic search box.
 * Entering a domain positions the target into the diagnostic instrument.
 */
export function UrlPortal({
  onStart,
  onFocusChange,
}: {
  onStart: (urls: string[], origin: Point | null) => void
  onFocusChange?: (focused: boolean) => void
}) {
  const [value, setValue] = useState('')
  const [urls, setUrls] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)
  const originRef = useRef<HTMLFormElement>(null)

  const validDraft = value.trim().length > 0 && isValidUrl(value)
  const live = focused || urls.length > 0 || validDraft
  const previewHost = urls[0] ? hostOf(urls[0]) : value.trim() ? hostOf(normalizeUrl(value)) : ''

  const addUrl = (raw: string): boolean => {
    const trimmed = raw.trim().replace(/,$/, '')
    if (!trimmed) return false
    if (!isValidUrl(trimmed)) {
      setError('Please enter a valid website address.')
      return false
    }
    const normalized = normalizeUrl(trimmed)
    if (urls.some((u) => hostOf(u) === hostOf(normalized))) {
      setError('Domain already queued for audit.')
      return false
    }
    setUrls((prev) => [...prev, normalized])
    setError(null)
    return true
  }

  const handleSubmit = () => {
    let queue = urls
    if (value.trim()) {
      if (!isValidUrl(value)) {
        setError('Please enter a valid website address.')
        return
      }
      const normalized = normalizeUrl(value)
      if (!urls.some((u) => hostOf(u) === hostOf(normalized))) queue = [...urls, normalized]
    }
    if (queue.length === 0) {
      setError('Enter a website domain to begin.')
      return
    }
    const rect = originRef.current?.getBoundingClientRect()
    const origin = rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : null
    setValue('')
    onStart(queue, origin)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter') {
      e.preventDefault()
      if (value.trim() && urls.length && addUrl(value)) setValue('')
      else handleSubmit()
    }
    if (e.key === ',') {
      e.preventDefault()
      if (addUrl(value)) setValue('')
    }
    if (e.key === 'Backspace' && !value && urls.length) {
      setUrls((prev) => prev.slice(0, -1))
    }
  }

  const setFocus = (next: boolean) => {
    setFocused(next)
    onFocusChange?.(next)
  }

  return (
    <div className="relative w-full">
      {/* Subtle Spatial Reticle Lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/4"
      />

      <div className="relative">
        <form
          ref={originRef}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className={cn(
            'relative flex w-full items-center gap-3 rounded-xl border px-4.5 py-3 transition-all duration-200 bg-surface/90 backdrop-blur-xl shadow-[0_12px_32px_rgba(0,0,0,0.5)]',
            error
              ? 'border-critical/60 bg-surface/95'
              : focused
                ? 'border-signal/50 ring-1 ring-signal/20'
                : 'border-white/10 hover:border-white/18',
          )}
        >
          {/* Subtle Status Indicator */}
          <div className="flex items-center justify-center shrink-0">
            <span
              aria-hidden
              className={cn(
                'size-2 rounded-full transition-colors duration-200',
                error ? 'bg-critical' : live ? 'bg-signal' : 'bg-muted-foreground/50',
              )}
            />
          </div>

          {/* Quiet Protocol Prefix */}
          <span className="font-mono text-xs font-medium text-muted-foreground/60 select-none">
            https://
          </span>

          <AnimatePresence initial={false}>
            {urls.map((u) => (
              <motion.span
                key={u}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="inline-flex items-center gap-1.5 rounded-md border border-signal/30 bg-signal/10 px-2 py-0.5 font-mono text-xs text-signal"
              >
                {hostOf(u)}
                <button
                  type="button"
                  aria-label={`Remove ${hostOf(u)}`}
                  onClick={() => setUrls((prev) => prev.filter((x) => x !== u))}
                  className="text-signal/70 hover:text-white transition-colors ml-0.5"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </AnimatePresence>

          <input
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={onKeyDown}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            inputMode="url"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            placeholder={urls.length ? 'queue another domain...' : 'your-domain.test'}
            aria-label="Website domain to inspect"
            aria-invalid={!!error}
            className="min-w-[14ch] flex-1 bg-transparent py-0.5 font-mono text-sm font-medium tracking-tight text-foreground outline-none placeholder:text-muted-foreground/45 placeholder:font-sans"
          />

          {previewHost && <span className="sr-only">{previewHost}</span>}

          <button
            type="submit"
            aria-label="Inspect website"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-mono text-xs font-semibold transition-all duration-150 cursor-pointer shrink-0',
              validDraft || urls.length > 0
                ? 'bg-signal text-slate-950 hover:bg-signal/90 active:scale-[0.98]'
                : 'border border-white/8 bg-white/4 text-muted-foreground hover:text-foreground hover:bg-white/8',
            )}
          >
            <span>Inspect</span>
            <kbd className="rounded bg-black/20 px-1 py-0.5 text-[9px] font-mono opacity-70">⏎</kbd>
          </button>
        </form>
      </div>

      {/* Helper text & Sample Domain Benchmarks */}
      <div className="mt-3.5 text-center">
        {error ? (
          <p className="font-mono text-xs text-critical font-medium">{error}</p>
        ) : validDraft ? (
          <p className="font-mono text-xs text-signal font-medium tracking-wide">
            Ready to inspect
          </p>
        ) : (
          <p className="font-mono text-[11px] text-muted-foreground/60 tracking-normal">
            Press Enter to begin · Comma queues secondary site
          </p>
        )}

        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-1.5">
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase mr-1">
            Sample domains:
          </span>
          {SAMPLE_URLS.slice(0, 4).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => {
                const el = originRef.current
                const r = el?.getBoundingClientRect()
                onStart([u], r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null)
              }}
              className="group inline-flex items-center gap-1.5 rounded-md border border-white/6 bg-surface/60 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-all duration-150 hover:border-white/18 hover:bg-surface hover:text-foreground"
            >
              <span className="size-1 rounded-full bg-muted-foreground/40 group-hover:bg-signal transition-colors" />
              {hostOf(u)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
