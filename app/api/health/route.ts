import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const ts = Date.now()
  const mcpEnabled = process.env.MCP_ENABLED === 'true'
  const supabaseOk = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const fastapiPresent = Boolean(process.env.FASTAPI_URL)

  const validatorBase = 'https://api.smarterbot.cl'
  const healthUrl = `${validatorBase}/health`
  const validateUrl = `${validatorBase}/validate`

  async function timed<T>(fn: () => Promise<T>) {
    const start = performance.now()
    try {
      const data = await fn()
      return { ok: true, latency: Math.round(performance.now() - start), data }
    } catch (error: any) {
      return { ok: false, latency: Math.round(performance.now() - start), error: error?.message || 'fetch_failed' }
    }
  }

  const [validatorHealth, validatorValidate] = await Promise.all([
    timed(async () => {
      const r = await fetch(healthUrl, { method: 'GET', cache: 'no-store' })
      if (!r.ok) throw new Error(`status_${r.status}`)
      return r.json().catch(() => ({}))
    }),
    timed(async () => {
      const r = await fetch(validateUrl, { method: 'POST', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ping: true }) })
      if (!r.ok) throw new Error(`status_${r.status}`)
      return r.json().catch(() => ({}))
    }),
  ])

  const backendOk = validatorHealth.ok && validatorValidate.ok
  const overallOk = supabaseOk && backendOk

  return NextResponse.json({
    ok: overallOk,
    timestamp: ts,
    frontend: { ok: true },
    mcp: { enabled: mcpEnabled },
    supabase: { ok: supabaseOk },
    backend: {
      validator: {
        health: validatorHealth,
        validate: validatorValidate,
      },
      ok: backendOk,
    },
  })
}