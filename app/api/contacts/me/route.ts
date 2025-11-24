import { NextResponse } from "next/server"
import { auth, clerkClient } from "@clerk/nextjs/server"

import { getSupabaseClient } from "@/lib/supabase"

const ensureValue = (value?: string | null, fallback = "") => {
  if (!value) return fallback
  const trimmed = value.trim()
  return trimmed || fallback
}

export async function GET() {
 const authObj = await auth()
 const userId = authObj.userId

  if (!userId) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
     const clerk = await clerkClient()
     const user = await clerk.users.getUser(userId)

    const email =
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses[0]?.emailAddress ||
      undefined

    if (!email) {
      return NextResponse.json({ error: "El usuario no tiene un email asociado" }, { status: 400 })
    }

    const supabase = getSupabaseClient()
   if (!supabase) throw new Error('Supabase not initialized')

    const { data, error } = await supabase
      .from("contacts")
      .upsert(
        {
          email: ensureValue(email, "sin-correo@smarteros.cl"),
          name:
            ensureValue(user.fullName) ||
            ensureValue(user.username) ||
            ensureValue(email.split("@")[0]) ||
            "Contacto SmarterOS",
          source: "clerk",
          status: "active",
          was_notified: true,
        },
        { onConflict: "email" }
      )
      .select()
      .single()

    if (error) {
      console.error("[contacts:sync] Supabase error", error)
      return NextResponse.json({ error: "No se pudo sincronizar el contacto" }, { status: 502 })
    }

    return NextResponse.json({
      contact: data,
    })
  } catch (error) {
    console.error("[contacts:sync] Unexpected error", error)
    return NextResponse.json({ error: "Error al sincronizar el contacto" }, { status: 500 })
  }
}
