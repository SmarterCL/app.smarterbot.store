import { z } from 'zod'
import { auth } from '@clerk/nextjs/server'
import { listTenantsForUser, getTenantById as fetchTenantById, createTenant as createTenantLib, updateTenantServices as updateTenantServicesLib, type Tenant } from '../../lib/supabase'

// Schemas
export const TenantIdSchema = z.object({ id: z.string().uuid() })

// Public shape returned by list tool (redact heavy integration fields)
export type TenantSummary = Pick<Tenant, 'id' | 'rut' | 'business_name' | 'active' | 'created_at'>

function requireUser() {
  const { userId } = auth()
  if (!userId) throw new Error('UNAUTHORIZED')
  return userId
}

export async function listTenants(): Promise<TenantSummary[]> {
  const clerkUserId = requireUser()
  const tenants = await listTenantsForUser(clerkUserId)
  return tenants.map(t => ({
    id: t.id,
    rut: t.rut,
    business_name: t.business_name,
    active: t.active,
    created_at: t.created_at,
  }))
}

export async function getTenantById(args: { id: string }) {
  TenantIdSchema.parse(args)
  requireUser() // RLS should enforce ownership; presence of auth mandatory
  const tenant = await fetchTenantById(args.id)
  return tenant
}

const CreateTenantSchema = z.object({
  rut: z.string().min(3),
  businessName: z.string().min(2),
})

export async function createTenant(args: { rut: string; businessName: string }) {
  const userId = requireUser()
  const { rut, businessName } = CreateTenantSchema.parse(args)
  const created = await createTenantLib({
    rut,
    business_name: businessName,
    contact_email: '',
    clerk_user_id: userId,
  })
  return created
}

const UpdateServicesSchema = z.object({
  id: z.string().uuid(),
  services: z.record(z.boolean()),
})

export async function updateTenantServices(args: { id: string; services: Record<string, boolean> }) {
  requireUser()
  const { id, services } = UpdateServicesSchema.parse(args)
  const updated = await updateTenantServicesLib(id, services)
  return updated
}

export const tenantTools = {
  'tenants.list': listTenants,
  'tenants.get': getTenantById,
  'tenants.create': createTenant,
  'tenants.updateServices': updateTenantServices,
} as const

export type TenantToolNames = keyof typeof tenantTools
