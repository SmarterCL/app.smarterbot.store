import { redirect } from "next/navigation"

/**
 * Root page redirects to dashboard.
 * This domain (app.smarterbot.store) is the application dashboard.
 * The store/marketplace content is served at www.smarterbot.store.
 */
export default function Home() {
  redirect("/dashboard")
}
