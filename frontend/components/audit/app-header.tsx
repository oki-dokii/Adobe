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
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-3 md:px-8 border-b border-white/6 bg-background/70 backdrop-blur-md">
      <div className="pointer-events-auto flex items-center gap-3">
        <span className="grid size-5.5 place-items-center rounded-md border border-signal/30 bg-signal/10">
          <span className="size-1.5 rounded-full bg-signal" />
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Brand AI Readiness
          </span>
          <span className="hidden sm:inline-block rounded border border-white/8 bg-surface-2/60 px-1.5 py-0.5 font-mono text-[9px] font-medium text-muted-foreground uppercase">
            9 SKILLS · EVIDENCE-BACKED
          </span>
        </div>
      </div>

      <nav className="pointer-events-auto flex items-center gap-1.5" aria-label="Primary navigation">
        <button
          type="button"
          onClick={onGuide}
          className="rounded-md px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-white/4 cursor-pointer"
        >
          Guide
        </button>
        <button
          type="button"
          onClick={onHelp}
          className="rounded-md px-2.5 py-1 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-white/4 cursor-pointer"
        >
          Help
        </button>

        {showExport && (
          <button
            type="button"
            onClick={onExport}
            disabled={!exportEnabled}
            aria-label="Export diagnostic report as Markdown"
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-muted-foreground transition-all hover:text-foreground hover:bg-white/10 hover:border-white/20 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Export
          </button>
        )}

        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="ml-1 rounded-md border border-signal/30 bg-signal/10 px-3 py-1 font-mono text-xs font-semibold text-signal transition-all hover:bg-signal/20 cursor-pointer"
          >
            New Audit
          </button>
        )}
      </nav>
    </header>
  )
}
