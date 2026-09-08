'use client'

export function AppHeader({
  onGuide,
  onHelp,
  onReset,
  showReset,
}: {
  onGuide: () => void
  onHelp: () => void
  onReset?: () => void
  showReset?: boolean
}) {
  return (
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 md:px-8">
      <div className="pointer-events-auto flex items-center gap-2.5">
        <span className="grid size-6 place-items-center rounded-md border border-signal/35 bg-signal/10">
          <span className="size-2 rounded-full bg-signal" />
        </span>
        <span className="text-sm tracking-tight text-foreground">
          Brand AI Readiness
        </span>
      </div>
      <nav className="pointer-events-auto flex items-center gap-1" aria-label="Primary">
        <button
          type="button"
          onClick={onGuide}
          className="rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Guide
        </button>
        <button
          type="button"
          onClick={onHelp}
          className="rounded-full px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Help
        </button>
        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="ml-1 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-foreground backdrop-blur transition-colors hover:border-signal/40"
          >
            New audit
          </button>
        )}
      </nav>
    </header>
  )
}
