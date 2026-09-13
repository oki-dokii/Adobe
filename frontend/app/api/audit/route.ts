// Allow up to 5 minutes for a real audit crawl
export const maxDuration = 300

import { NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import os from 'os'

const execFileAsync = promisify(execFile)

/**
 * Resolves the brand-ai-readiness-audit repo root by walking up from
 * the Next.js process cwd (which is the /frontend dir).
 */
function resolveAuditRepoRoot(): string | null {
  const cwd = process.cwd()
  // Next.js cwd is /frontend, so the repo sits one level up
  const candidates = [
    path.resolve(cwd, '..', 'brand-ai-readiness-audit'),
    path.resolve(cwd, 'brand-ai-readiness-audit'),
  ]
  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, 'skills', 'audit-orchestrator', 'scripts', 'run_audit.py'))) {
      return candidate
    }
  }
  return null
}

/**
 * Returns the best available Python executable.
 * Prefers the venv inside the audit repo (which has all deps installed),
 * then falls back to the PYTHON_PATH env var, then 'python3'.
 */
function resolvePython(repoRoot: string): string {
  if (process.env.PYTHON_PATH) return process.env.PYTHON_PATH

  const venvCandidates = [
    path.join(repoRoot, '.venv', 'bin', 'python'),
    path.join(repoRoot, '.venv', 'bin', 'python3'),
  ]
  for (const p of venvCandidates) {
    if (fs.existsSync(p)) return p
  }

  return 'python3'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL parameter is required' }, { status: 400 })
    }

    const repoRoot = resolveAuditRepoRoot()
    if (!repoRoot) {
      return NextResponse.json(
        { error: 'brand-ai-readiness-audit repo not found adjacent to frontend' },
        { status: 500 },
      )
    }

    const scriptPath = path.join(
      repoRoot,
      'skills',
      'audit-orchestrator',
      'scripts',
      'run_audit.py',
    )

    const tmpFilename = `bair_audit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`
    const tmpPath = path.join(os.tmpdir(), tmpFilename)

    const pythonCmd = resolvePython(repoRoot)
    const args = [
      scriptPath,
      '--url', url,
      '--render-max', '40',
      '--page-cap', '50',
      '--json-out', tmpPath,
    ]

    console.log(`[audit] python: ${pythonCmd}`)
    console.log(`[audit] url: ${url}`)
    console.log(`[audit] cwd: ${repoRoot}`)

    try {
      const { stdout, stderr } = await execFileAsync(pythonCmd, args, {
        // Run from the repo root so relative imports and sys.path work correctly
        cwd: repoRoot,
        // 5 minutes — real audits crawl JS-rendered pages and can take 2-3 min
        timeout: 300_000,
        maxBuffer: 10 * 1024 * 1024, // 10 MB
      })
      if (stderr) console.warn('[audit] stderr:', stderr.slice(0, 2000))
      if (stdout) console.log('[audit] stdout:', stdout.slice(0, 500))
    } catch (execErr: any) {
      console.error('[audit] Python execution error:', execErr?.message ?? execErr)
      // The script may still have written the JSON before exiting with a warning code
      if (!fs.existsSync(tmpPath)) {
        return NextResponse.json(
          {
            error: 'Audit script failed to produce output',
            details: execErr?.message ?? String(execErr),
          },
          { status: 500 },
        )
      }
    }

    if (!fs.existsSync(tmpPath)) {
      return NextResponse.json({ error: 'Audit output file not generated' }, { status: 500 })
    }

    const fileContent = fs.readFileSync(tmpPath, 'utf-8')
    try { fs.unlinkSync(tmpPath) } catch { /* best-effort cleanup */ }

    const payload = JSON.parse(fileContent)
    return NextResponse.json(payload)
  } catch (err: any) {
    console.error('[audit] /api/audit unhandled error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
