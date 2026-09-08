'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { hostOf, isValidUrl, normalizeUrl, SAMPLE_URLS } from '@/lib/audit/mock-data'
import type { Point } from '@/lib/audit/types'

/**
 * The origin itself — not a form card. Typing here is placing a website
 * into the root of the audit tree.
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
      setError('That does not look like a valid URL.')
      return false
    }
    const normalized = normalizeUrl(trimmed)
    if (urls.some((u) => hostOf(u) === hostOf(normalized))) {
      setError('That site is already queued.')
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
        setError('That does not look like a valid URL.')
        return
      }
      const normalized = normalizeUrl(value)
      if (!urls.some((u) => hostOf(u) === hostOf(normalized))) queue = [...urls, normalized]
    }
    if (queue.length === 0) {
      setError('Enter a URL to begin.')
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
    <div className="relative w-full max-w-md">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[7.5rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-signal/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 size-[5.25rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-foreground/10"
      />
      <form
        ref={originRef}
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className={cn(
          'relative flex w-full items-center gap-2 rounded-full border px-4 py-2.5 transition-[border-color,box-shadow] duration-300',
          error ? 'border-critical/50' : live ? 'border-signal/40' : 'border-foreground/12',
        )}
        style={{
          background: 'color-mix(in oklch, var(--background) 78%, transparent)',
          boxShadow: live
            ? '0 0 0 1px color-mix(in oklch, var(--signal) 16%, transparent), 0 0 48px -20px color-mix(in oklch, var(--signal) 40%, transparent)'
            : 'none',
        }}
      >
        <span
          aria-hidden
          className="size-2 shrink-0 rounded-full"
          style={{
            background: live ? 'var(--signal)' : 'var(--muted-foreground)',
            boxShadow: live ? '0 0 8px var(--signal)' : 'none',
          }}
        />

        <AnimatePresence initial={false}>
          {urls.map((u) => (
            <motion.span
              key={u}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 font-mono text-xs text-foreground"
            >
              {hostOf(u)}
              <button
                type="button"
                aria-label={`Remove ${hostOf(u)}`}
                onClick={() => setUrls((prev) => prev.filter((x) => x !== u))}
                className="text-muted-foreground hover:text-foreground"
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
          placeholder={urls.length ? 'another site' : 'yourbrand.com'}
          aria-label="Website URL"
          aria-invalid={!!error}
          className="min-w-[8ch] flex-1 bg-transparent py-1 text-[15px] tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50"
        />

        {previewHost && (
          <span className="sr-only">{previewHost}</span>
        )}

        <button
          type="submit"
          aria-label="Begin audit"
          className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.75}>
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      <div className="absolute inset-x-0 top-full mt-3 text-center">
        {error ? (
          <p className="text-xs text-critical">{error}</p>
        ) : validDraft ? (
          <p className="font-mono text-[10px] text-muted-foreground">ready</p>
        ) : (
          <p className="text-[11px] text-muted-foreground/70">Return to enter. Comma queues another origin.</p>
        )}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {SAMPLE_URLS.slice(0, 4).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => {
                const el = originRef.current
                const r = el?.getBoundingClientRect()
                onStart([u], r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null)
              }}
              className="font-mono text-[11px] text-muted-foreground/80 transition-colors hover:text-foreground"
            >
              {hostOf(u)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
