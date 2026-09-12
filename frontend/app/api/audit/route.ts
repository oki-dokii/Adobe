import { NextResponse } from 'next/server'
import { execFile } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'
import os from 'os'

const execFileAsync = promisify(execFile)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, skippedSkills } = body

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Valid URL parameter is required' }, { status: 400 })
    }

    // Resolve run_audit.py path from current working directory
    const cwd = process.cwd()
    let scriptPath = path.resolve(cwd, 'brand-ai-readiness-audit/skills/audit-orchestrator/scripts/run_audit.py')
    if (!fs.existsSync(scriptPath)) {
      scriptPath = path.resolve(cwd, '../brand-ai-readiness-audit/skills/audit-orchestrator/scripts/run_audit.py')
    }

    if (!fs.existsSync(scriptPath)) {
      return NextResponse.json({ error: `run_audit.py not found at ${scriptPath}` }, { status: 500 })
    }

    const tmpFilename = `bair_audit_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.json`
    const tmpPath = path.join(os.tmpdir(), tmpFilename)

    // Execute Python script
    const pythonCmd = process.env.PYTHON_PATH || 'python3'
    const args = [scriptPath, '--url', url, '--render-max', '40', '--page-cap', '50', '--json-out', tmpPath]

    try {
      await execFileAsync(pythonCmd, args, {
        cwd: path.dirname(scriptPath),
        timeout: 120000, // 2 minutes max
      })
    } catch (execErr: any) {
      console.error('Python execution error:', execErr)
      // Check if file was created despite error/warning
      if (!fs.existsSync(tmpPath)) {
        return NextResponse.json(
          { error: 'Failed to run python audit script', details: execErr.message || String(execErr) },
          { status: 500 }
        )
      }
    }

    if (!fs.existsSync(tmpPath)) {
      return NextResponse.json({ error: 'Audit output file not generated' }, { status: 500 })
    }

    const fileContent = fs.readFileSync(tmpPath, 'utf-8')
    // Clean up temp file
    try {
      fs.unlinkSync(tmpPath)
    } catch {}

    const payload = JSON.parse(fileContent)
    return NextResponse.json(payload)
  } catch (err: any) {
    console.error('API /api/audit error:', err)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}
