import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getTenantById } from "@/lib/supabase"

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Auth check
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(id)) {
      return NextResponse.json({ error: "Invalid tenant ID format" }, { status: 400 })
    }

    // Fetch tenant (RLS ensures ownership check)
    const tenant = await getTenantById(id)

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        rut: tenant.rut,
        business_name: tenant.business_name,
        contact_email: tenant.contact_email,
        services_enabled: tenant.services_enabled,
        chatwoot_inbox_id: tenant.chatwoot_inbox_id,
        botpress_workspace_id: tenant.botpress_workspace_id,
        odoo_company_id: tenant.odoo_company_id,
        n8n_project_id: tenant.n8n_project_id,
        metabase_dashboard_id: tenant.metabase_dashboard_id,
        active: tenant.active,
        created_at: tenant.created_at,
        updated_at: tenant.updated_at,
      },
    })
  } catch (error: any) {
    console.error("Tenant get error:", error)

    // Check if tenant not found or access denied (RLS)
    if (error?.code === "PGRST116" || error?.message?.includes("no rows")) {
      return NextResponse.json(
        {
          error: "Tenant not found",
          message: "Tenant no encontrado o sin permisos de acceso",
        },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error?.message || "Error obteniendo tenant",
      },
      { status: 500 }
    )
  }
}
