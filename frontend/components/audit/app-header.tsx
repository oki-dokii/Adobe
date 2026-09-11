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
    <header className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-3 md:px-8 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-xs">
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Brand Mark — Clean Indigo Tile */}
        <span className="grid size-7 place-items-center rounded-lg bg-indigo-600 text-white shadow-xs">
          <svg viewBox="0 0 16 16" fill="none" className="size-4" aria-hidden>
            <circle cx="8" cy="8" r="3" fill="currentColor" />
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" strokeDasharray="3 3" />
          </svg>
        </span>

        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            Brand AI Readiness
          </span>
          <span className="hidden sm:inline-block h-3.5 w-px bg-slate-200" />
          <span className="hidden sm:inline-block text-xs font-medium text-slate-500">
            Extractability & Citation Audit
          </span>
        </div>
      </div>

      <nav className="pointer-events-auto flex items-center gap-1.5" aria-label="Primary navigation">
        <button
          type="button"
          onClick={onGuide}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
        >
          Guide
        </button>
        <button
          type="button"
          onClick={onHelp}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
        >
          Help
        </button>

        {showExport && (
          <button
            type="button"
            onClick={onExport}
            disabled={!exportEnabled}
            aria-label="Export diagnostic report as Markdown"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Export Report
          </button>
        )}

        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            className="ml-1 rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 cursor-pointer"
          >
            New Audit
          </button>
        )}
      </nav>
    </header>
  )
}
