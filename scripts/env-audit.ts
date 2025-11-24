const required = [
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'FASTAPI_URL',
]

const optional = [
  'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
  'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
  'NEXT_PUBLIC_DEMO_MODE',
  'RESEND_API_KEY',
]

function mask(v?: string) {
  if (!v) return 'MISSING'
  if (v.length < 8) return 'SHORT'
  if (v.startsWith('pk_') || v.startsWith('sk_')) return v.slice(0, 10) + '…'
  if (v.startsWith('https://')) return v
  return v.slice(0, 12) + '…'
}

const snapshot: Record<string, string> = {}
for (const k of [...required, ...optional]) {
  snapshot[k] = mask(process.env[k])
}

const missing = required.filter(k => !process.env[k])

console.log(JSON.stringify({ ok: missing.length === 0, missing, snapshot }, null, 2))
