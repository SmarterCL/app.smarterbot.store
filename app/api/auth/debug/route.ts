import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()
  try {
    const a = await auth()
    return NextResponse.json({
      ok: true,
      userId: a.userId || null,
      sessionId: a.sessionId || null,
      orgId: (a as any).orgId || null,
      duration_ms: Date.now() - start,
      debug: {
        hasAuth: !!a.userId,
        env: {
          CLERK_PUBLISHABLE: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
          CLERK_SECRET: !!process.env.CLERK_SECRET_KEY,
        }
      }
    })
  } catch (error: any) {
    return NextResponse.json({
      ok: false,
      error: 'auth_error',
      message: error?.message,
      stack: error?.stack,
      duration_ms: Date.now() - start,
    }, { status: 500 })
  }
}
