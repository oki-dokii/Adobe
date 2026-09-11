'use client'

export function AppHeader({
  onGuide,
  onHelp,
  onReset,
  showReset,
  onExport,
  exportEnabled = true,
  showExport = false,
}: {
  onGuide: () => void
  onHelp: () => void
  onReset?: () => void
  showReset?: boolean
  onExport?: () => void
  exportEnabled?: boolean
  showExport?: boolean
}) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-3.5 md:px-8 border-b border-white/5 bg-background/75 backdrop-blur-xl">
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Brand mark — warm gradient square */}
        <span className="grid size-6 place-items-center rounded-md bg-gradient-to-br from-indigo-500/80 to-violet-600/80 shadow-[0_0_12px_rgba(99,68,198,0.4)]">
          <svg viewBox="0 0 12 12" fill="none" className="size-3.5" aria-hidden>
            <circle cx="6" cy="6" r="2.5" fill="white" fillOpacity="0.9" />
            <circle cx="6" cy="6" r="4.5" stroke="white" strokeOpacity="0.3" strokeWidth="0.8" />
          </svg>
        </span>

        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Brand AI Readiness
          </span>
          <span className="hidden sm:inline-block h-4 w-px bg-white/10" />
          <span className="hidden sm:inline-block text-xs text-muted-foreground/50 font-sans">
            9 skills · evidence-backed
          </span>
        </div>
      </div>

      <nav className="pointer-events-auto flex items-center gap-1" aria-label="Primary navigation">
        <button
          type="button"
          onClick={onGuide}
          className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground/70 transition-colors hover:text-foreground hover:bg-white/5 cursor-pointer font-sans"
        >
          Guide
        </button>
        <button
          type="button"
          onClick={onHelp}
          className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground/70 transition-colors hover:text-foreground hover:bg-white/5 cursor-pointer font-sans"
        >
          Help
        </button>

        {showExport && (
          <button
            type="button"
            onClick={onExport}
            disabled={!exportEnabled}
            aria-label="Export diagnostic report as Markdown"
            className="rounded-lg border border-white/10 bg-white/4 px-3 py-1.5 text-sm text-muted-foreground transition-all hover:text-foreground hover:bg-white/8 hover:border-white/18 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer font-sans"
          >
            Export
          </button>
        )}

        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="ml-1 rounded-lg border border-signal/25 bg-signal/8 px-3.5 py-1.5 text-sm font-medium text-signal transition-all hover:bg-signal/15 hover:border-signal/40 cursor-pointer font-sans"
          >
            New Audit
          </button>
        )}
      </nav>
    </header>
  )
}
