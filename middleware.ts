import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/env/diagnostic",
  "/api/mcp/ping",
  "/api/health",
  "/api/contacts/test",
  "/demo-dashboard(.*)",
])

// Check if Clerk is properly configured
function hasValidClerkConfig(): boolean {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const secretKey = process.env.CLERK_SECRET_KEY
  
  const hasPublishableKey = Boolean(publishableKey && publishableKey.startsWith("pk_") && publishableKey.length > 10)
  const hasSecretKey = Boolean(secretKey && secretKey.startsWith("sk_") && secretKey.length > 10)
  
  return hasPublishableKey && hasSecretKey
}

// Create a simple middleware for demo mode
function demoMiddleware(request: NextRequest) {
  return NextResponse.next()
}

// Use Clerk middleware only if properly configured
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !hasValidClerkConfig()

export default isDemoMode
  ? demoMiddleware
  : clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) {
        await auth.protect()
      }
    })

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
