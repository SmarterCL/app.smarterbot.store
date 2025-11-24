import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/env/diagnostic",
  "/api/mcp/ping",
  "/api/health",
  "/api/contacts/test",
])

export default clerkMiddleware(async (auth, request) => {
  // Safe guard: if Clerk is not properly configured, allow access
  try {
    if (!isPublicRoute(request)) {
      await auth.protect()
    }
  } catch (error) {
    console.error("Clerk middleware error:", error)
    // In case of Clerk failure, allow request to proceed
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
