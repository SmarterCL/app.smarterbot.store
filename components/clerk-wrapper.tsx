"use client"
import { ClerkProvider } from "@clerk/nextjs"
import React from "react"

export function ClerkWrapper({ children, localization, appearance }: any) {
  return (
    // @ts-expect-error ClerkProvider typing mismatch in React 19 (temporary suppression)
    <ClerkProvider localization={localization as any} appearance={appearance as any}>
      {children}
    </ClerkProvider>
  )
}