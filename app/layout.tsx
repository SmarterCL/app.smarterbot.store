import type React from "react"
// ClerkProvider must run client-side; wrapped in ClerkWrapper
import { ClerkWrapper } from "@/components/clerk-wrapper"
import { esES } from "@clerk/localizations"
import Script from "next/script"
import { Analytics } from '@vercel/analytics/react'

import "./globals.css"

// Use system fonts for maximum compatibility and offline builds
// The CSS variable --font-sans is still available for styling
const fontVariable = "--font-sans"

const baseBodyClass = `font-sans antialiased`

const themeInitScript = `
;(function () {
  var STORAGE_KEY = 'smarteros-theme';
  var THEMES = ['theme-light', 'theme-bw'];
  try {
    var root = document.documentElement;
    var stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.indexOf(stored) !== -1) {
      THEMES.forEach(function (name) {
        root.classList.remove(name);
      });
      root.classList.add(stored);
      root.dataset.theme = stored;
      return;
    }
    if (!root.classList.contains('theme-light')) {
      root.classList.add('theme-light');
    }
    root.dataset.theme = 'theme-light';
  } catch (error) {
    if (root && !root.dataset.theme) {
      root.dataset.theme = 'theme-light';
    }
  }
})();
`

export const metadata = {
  title: "SmarterOS Hub",
  description: "Gestión de automatizaciones y datos para SmarterOS",
  generator: "v0.dev",
}

// Use base esES localization only to avoid oversized runtime object issues
const localization: any = esES

const clerkAppearance = {
  layout: {
    socialButtonsVariant: "blockButton" as const,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let isDemoMode = false
  let hasValidClerkConfig = false

  try {
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    const secretKey = process.env.CLERK_SECRET_KEY

    const hasPublishableKey = Boolean(publishableKey && publishableKey.startsWith("pk_") && publishableKey.length > 10)
    const hasSecretKey = Boolean(secretKey && secretKey.startsWith("sk_") && secretKey.length > 10)

    hasValidClerkConfig = hasPublishableKey && hasSecretKey
    
    // Enable demo mode if explicitly set OR if no valid Clerk config is provided
    // This allows the app to work out-of-the-box without configuration
    isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true" || !hasValidClerkConfig
  } catch (error) {
    console.warn("Environment variable check failed", error)
    isDemoMode = true
  }

  const htmlAttributes = {
    lang: "es",
    className: "theme-light",
    "data-theme": "theme-light",
    suppressHydrationWarning: true as const,
  }

  const errorScreen = (
    <html {...htmlAttributes}>
      <body className={baseBodyClass}>
        <Script id="smarteros-theme-init" strategy="beforeInteractive">
          {themeInitScript}
        </Script>
        <div className="flex min-h-screen items-center justify-center bg-secondary/40 p-6">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="space-y-6 text-center">
              <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-destructive/40 bg-destructive/10 text-destructive">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M7.938 4h8.124c1.54 0 2.502 1.667 1.732 2.5L13.732 16.5c-.77.833-1.964.833-2.732 0L6.206 6.5C5.436 5.667 6.398 4 7.938 4z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h1 className="text-lg font-semibold text-foreground">Configuración requerida</h1>
                <p className="text-sm text-muted-foreground">
                  Configura tus variables de entorno para continuar utilizando SmarterOS Hub.
                </p>
              </div>
              <div className="space-y-3 text-left text-sm text-muted-foreground">
                <div className="rounded-xl border border-border bg-secondary p-4">
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">Variables necesarias</h2>
                  <ul className="space-y-1">
                    <li>• NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>
                    <li>• CLERK_SECRET_KEY</li>
                    <li>• NEXT_PUBLIC_SUPABASE_URL</li>
                    <li>• NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-border bg-secondary p-4">
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground">Opciones rápidas</h2>
                  <ol className="space-y-1 list-decimal pl-4">
                    <li>Activa el modo demo con <code className="font-mono text-xs">NEXT_PUBLIC_DEMO_MODE=true</code>.</li>
                    <li>Configura tus claves reales de Clerk.</li>
                    <li>Reinicia el servidor de desarrollo.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )

  if (isDemoMode) {
    return (
      <html {...htmlAttributes}>
        <body className={baseBodyClass}>
          <Script id="smarteros-theme-init" strategy="beforeInteractive">
            {themeInitScript}
          </Script>
          {children}
          <Analytics />
        </body>
      </html>
    )
  }

  if (!hasValidClerkConfig) {
    return errorScreen
  }

  return (
    <ClerkWrapper localization={localization} appearance={clerkAppearance}>
      <html {...htmlAttributes}>
        <body className={baseBodyClass}>
          <Script id="smarteros-theme-init" strategy="beforeInteractive">
            {themeInitScript}
          </Script>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkWrapper>
  )
}
