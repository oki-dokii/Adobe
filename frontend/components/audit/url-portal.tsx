'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { hostOf, isValidUrl, normalizeUrl, SAMPLE_URLS } from '@/lib/audit/mock-data'
import type { Point } from '@/lib/audit/types'

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
      <div className="relative">
        <form
          ref={originRef}
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
          className={cn(
            'relative flex w-full items-center gap-3 rounded-2xl border px-5 py-3.5 transition-all duration-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)]',
            error
              ? 'border-rose-300 ring-4 ring-rose-50'
              : focused
                ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-[0_8px_30px_rgba(79,70,229,0.1)]'
                : 'border-slate-200 hover:border-slate-300',
          )}
        >
          {/* Clean Globe / Search Icon */}
          <div className="flex items-center justify-center shrink-0 text-slate-400">
            <svg viewBox="0 0 20 20" fill="none" className="size-5" stroke="currentColor" strokeWidth={1.5}>
              <circle cx="10" cy="10" r="7.5" />
              <path d="M2.5 10h15M10 2.5a13 13 0 0 1 3.5 7.5 13 13 0 0 1-3.5 7.5 13 13 0 0 1-3.5-7.5A13 13 0 0 1 10 2.5z" />
            </svg>
          </div>

          {/* Protocol Prefix */}
          <span className="font-mono text-xs font-medium text-slate-400 select-none">
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
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-700"
              >
                {hostOf(u)}
                <button
                  type="button"
                  aria-label={`Remove ${hostOf(u)}`}
                  onClick={() => setUrls((prev) => prev.filter((x) => x !== u))}
                  className="text-indigo-400 hover:text-indigo-900 transition-colors ml-0.5 font-bold"
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
            placeholder={urls.length ? 'queue another domain...' : 'acme.com'}
            aria-label="Website domain to inspect"
            aria-invalid={!!error}
            className="min-w-[14ch] flex-1 bg-transparent py-1 font-mono text-sm font-medium tracking-tight text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-sans"
          />

          {previewHost && <span className="sr-only">{previewHost}</span>}

          <button
            type="submit"
            aria-label="Run Audit"
            className={cn(
              'inline-flex items-center gap-2 rounded-xl px-4.5 py-2.5 font-semibold text-xs transition-all duration-150 cursor-pointer shrink-0 shadow-xs',
              validDraft || urls.length > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-[0.98]'
                : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-[0.98]',
            )}
          >
            <span>Run Audit</span>
            <kbd className="rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-mono">↵</kbd>
          </button>
        </form>
      </div>

      {/* Helper text & Sample Domain Benchmarks */}
      <div className="mt-4 text-center">
        {error ? (
          <p className="text-xs text-rose-600 font-medium">{error}</p>
        ) : validDraft ? (
          <p className="text-xs text-indigo-600 font-semibold tracking-wide">
            Ready to inspect origin
          </p>
        ) : (
          <p className="text-xs text-slate-500 font-normal">
            Press Enter to begin · Comma separates multi-domain comparison
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">
            Sample benchmarks:
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
              className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs text-slate-600 shadow-xs transition-all duration-150 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-900"
            >
              <span className="size-1.5 rounded-full bg-slate-300 group-hover:bg-indigo-600 transition-colors" />
              {hostOf(u)}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
