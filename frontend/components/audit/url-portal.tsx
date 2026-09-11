'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { hostOf, isValidUrl, normalizeUrl, SAMPLE_URLS } from '@/lib/audit/mock-data'
import type { Point } from '@/lib/audit/types'

/**
 * The diagnostic aperture — entering a domain positions the target into the diagnostic instrument.
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
      setError('Please enter a valid website address (e.g. acme.com).')
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
        setError('Please enter a valid website address (e.g. acme.com).')
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
      {/* Subtle Spatial Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/10 blur-3xl"
      />

      <div className="relative">
        <form
          ref={originRef}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className={cn(
            'relative flex w-full items-center gap-3 rounded-2xl border px-5 py-3.5 transition-all duration-200 bg-[#0f1422]/90 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.5)]',
            error
              ? 'border-rose-500/60 ring-2 ring-rose-500/20'
              : focused
                ? 'border-indigo-500/60 ring-4 ring-indigo-500/15 shadow-[0_20px_50px_rgba(99,102,241,0.12)]'
                : 'border-white/10 hover:border-white/20',
          )}
        >
          {/* Status Indicator */}
          <div className="flex items-center justify-center shrink-0">
            <span
              aria-hidden
              className={cn(
                'size-2.5 rounded-full transition-colors duration-200',
                error ? 'bg-rose-500' : live ? 'bg-indigo-400 animate-pulse' : 'bg-zinc-600',
              )}
            />
          </div>

          {/* Protocol Prefix */}
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/15 px-2.5 py-1 font-mono text-xs text-indigo-200"
              >
                {hostOf(u)}
                <button
                  type="button"
                  aria-label={`Remove ${hostOf(u)}`}
                  onClick={() => setUrls((prev) => prev.filter((x) => x !== u))}
                  className="text-indigo-300/70 hover:text-white transition-colors ml-0.5"
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
            placeholder={urls.length ? 'queue another domain...' : 'example.com'}
            aria-label="Website domain to inspect"
            aria-invalid={!!error}
            className="min-w-[14ch] flex-1 bg-transparent py-1 font-mono text-sm font-medium tracking-tight text-foreground outline-none placeholder:text-muted-foreground/40 placeholder:font-sans"
          />

          {previewHost && <span className="sr-only">{previewHost}</span>}

          <button
            type="submit"
            aria-label="Inspect website"
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-xs transition-all duration-150 cursor-pointer shrink-0 shadow-sm',
              validDraft || urls.length > 0
                ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-indigo-500/25 active:scale-[0.98]'
                : 'border border-white/8 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10',
            )}
          >
            <span>Run Audit</span>
            <kbd className="rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-mono opacity-80">↵</kbd>
          </button>
        </form>
      </div>

      {/* Helper text & Sample Domain Benchmarks */}
      <div className="mt-4 text-center">
        {error ? (
          <p className="font-mono text-xs text-rose-400 font-medium">{error}</p>
        ) : validDraft ? (
          <p className="font-mono text-xs text-indigo-300 font-medium tracking-wide">
            Ready to inspect origin
          </p>
        ) : (
          <p className="font-mono text-[11px] text-muted-foreground/70 tracking-normal">
            Press Enter to begin · Comma separates multi-domain comparison
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="font-mono text-[10px] tracking-wider text-muted-foreground/60 uppercase mr-1">
            Benchmarks:
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
              className="group inline-flex items-center gap-1.5 rounded-lg border border-white/6 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-muted-foreground transition-all duration-150 hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-foreground"
            >
              <span className="size-1.5 rounded-full bg-zinc-600 group-hover:bg-indigo-400 transition-colors" />
              {hostOf(u)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
