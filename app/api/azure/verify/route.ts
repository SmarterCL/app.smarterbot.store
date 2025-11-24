import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'

/**
 * POST /api/azure/verify
 * Valida Azure Subscription ID + Resource Group
 * Verifica crédito, providers, y permisos
 */

interface VerifyRequest {
  subscription_id: string
  resource_group: string
  tenant_id?: string
  location: 'westeurope' | 'southcentralus'
}

interface VerifyResponse {
  status: 'verified' | 'error'
  subscription_id?: string
  resource_group?: string
  location?: string
  tenant_id?: string
  credit_remaining?: number
  providers_registered?: string[]
  n8n_url?: string
  errors?: Array<{
    code: string
    message: string
    resolution: string
  }>
}

export async function POST(request: Request) {
  try {
    // Autenticación
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { status: 'error', errors: [{ code: 'UNAUTHORIZED', message: 'Usuario no autenticado', resolution: 'Inicia sesión nuevamente' }] },
        { status: 401 }
      )
    }

    // Parse request body
    const body: VerifyRequest = await request.json()
    const { subscription_id, resource_group, tenant_id, location } = body

    // Validaciones básicas
    const errors: Array<{ code: string; message: string; resolution: string }> = []

    if (!subscription_id || !isValidUUID(subscription_id)) {
      errors.push({
        code: 'INVALID_SUBSCRIPTION_ID',
        message: 'Subscription ID inválido (formato UUID requerido)',
        resolution: 'Verifica el ID en Azure Portal → Subscriptions',
      })
    }

    if (!resource_group || !isValidResourceGroupName(resource_group)) {
      errors.push({
        code: 'INVALID_RESOURCE_GROUP',
        message: 'Resource Group inválido (formato kebab-case requerido)',
        resolution: 'Usa formato: smarteros-<tenant-id>-prod',
      })
    }

    if (tenant_id && !isValidUUID(tenant_id)) {
      errors.push({
        code: 'INVALID_TENANT_ID',
        message: 'Tenant ID inválido (formato UUID requerido)',
        resolution: 'Verifica el ID en Azure Portal → Azure Active Directory',
      })
    }

    if (errors.length > 0) {
      return NextResponse.json({ status: 'error', errors } as VerifyResponse, { status: 400 })
    }

    // Validación 1: Verificar que la suscripción existe y está activa
    const subscriptionCheck = await verifySubscription(subscription_id)
    if (!subscriptionCheck.success) {
      errors.push({
        code: 'SUBSCRIPTION_NOT_FOUND',
        message: subscriptionCheck.error || 'La suscripción no existe o no tienes acceso',
        resolution: 'Verifica el Subscription ID en Azure Portal → Subscriptions',
      })
    }

    // Validación 2: Verificar crédito disponible
    const creditCheck = await verifyCredit(subscription_id)
    if (!creditCheck.success && creditCheck.credit !== undefined && creditCheck.credit < 50) {
      errors.push({
        code: 'INSUFFICIENT_CREDIT',
        message: `Crédito insuficiente: $${creditCheck.credit.toFixed(2)} (mínimo $50)`,
        resolution: 'Agrega más crédito o actualiza a plan de pago en Azure Portal → Cost Management',
      })
    }

    // Validación 3: Verificar providers registrados
    const providersCheck = await verifyProviders(subscription_id)
    if (!providersCheck.success) {
      errors.push({
        code: 'PROVIDERS_NOT_REGISTERED',
        message: `Faltan providers: ${providersCheck.missing?.join(', ')}`,
        resolution: 'Ejecuta: az provider register --namespace Microsoft.App && az provider register --namespace Microsoft.Storage',
      })
    }

    // Validación 4: Verificar o crear Resource Group
    const resourceGroupCheck = await verifyResourceGroup(subscription_id, resource_group, location)
    if (!resourceGroupCheck.success) {
      errors.push({
        code: 'RESOURCE_GROUP_ERROR',
        message: resourceGroupCheck.error || 'No se pudo verificar/crear el Resource Group',
        resolution: 'Crea el Resource Group manualmente en Azure Portal',
      })
    }

    // Si hay errores, retornar
    if (errors.length > 0) {
      return NextResponse.json({ status: 'error', errors } as VerifyResponse, { status: 400 })
    }

    // Generar n8n URL basada en tenant
    const tenantId = userId.replace('user_', '').toLowerCase()
    const n8n_url = `https://smarteros-${tenantId}.${location}.azurecontainerapps.io`

    // Guardar en Vault
    await saveToVault(userId, {
      subscription_id,
      resource_group,
      tenant_id,
      location,
      n8n_url,
      status: 'verified',
      verified_at: new Date().toISOString(),
      credit_remaining: creditCheck.credit || 0,
    })

    // Retornar éxito
    return NextResponse.json({
      status: 'verified',
      subscription_id,
      resource_group,
      location,
      tenant_id,
      credit_remaining: creditCheck.credit || 0,
      providers_registered: providersCheck.registered || [],
      n8n_url,
    } as VerifyResponse)
  } catch (error) {
    console.error('Error in /api/azure/verify:', error)
    return NextResponse.json(
      {
        status: 'error',
        errors: [
          {
            code: 'INTERNAL_ERROR',
            message: error instanceof Error ? error.message : 'Error interno del servidor',
            resolution: 'Contacta soporte técnico',
          },
        ],
      } as VerifyResponse,
      { status: 500 }
    )
  }
}

// ============================================
// VALIDATION HELPERS
// ============================================

function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

function isValidResourceGroupName(name: string): boolean {
  // Azure Resource Group: 1-90 chars, alphanumeric, hyphens, underscores, periods, parentheses
  // Recomendamos formato: smarteros-<tenant-id>-prod
  const rgRegex = /^[a-zA-Z0-9_.-]{1,90}$/
  return rgRegex.test(name)
}

// ============================================
// AZURE API CALLS (via Azure SDK or CLI)
// ============================================

async function verifySubscription(subscription_id: string): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Implementar con Azure SDK (@azure/arm-subscriptions)
    // Por ahora, simulamos llamada exitosa
    // En producción:
    // const client = new SubscriptionClient(credential);
    // const subscription = await client.subscriptions.get(subscription_id);
    // if (subscription.state !== 'Enabled') throw new Error('Subscription not active');

    // Simulación: comando CLI
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    const command = `az account show --subscription ${subscription_id} --query "state" -o tsv`
    const { stdout, stderr } = await execAsync(command)

    if (stderr) {
      return { success: false, error: 'Subscription not found or unauthorized' }
    }

    const state = stdout.trim()
    if (state !== 'Enabled') {
      return { success: false, error: `Subscription state: ${state} (expected: Enabled)` }
    }

    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function verifyCredit(subscription_id: string): Promise<{ success: boolean; credit?: number; error?: string }> {
  try {
    // TODO: Implementar con Azure Cost Management API
    // Por ahora, retornamos crédito simulado
    // En producción:
    // const client = new ConsumptionManagementClient(credential, subscription_id);
    // const budgets = await client.budgets.list();
    // return { success: true, credit: budgets[0].amount };

    // Simulación: si tiene Free Trial, asumimos $195 disponible
    // Si no, verificar billing actual < límite
    return { success: true, credit: 195.5 }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function verifyProviders(
  subscription_id: string
): Promise<{ success: boolean; registered?: string[]; missing?: string[] }> {
  try {
    // TODO: Implementar con Azure SDK (@azure/arm-resources)
    // Por ahora, asumimos que todos están registrados
    // En producción:
    // const client = new ResourceManagementClient(credential, subscription_id);
    // const providers = await client.providers.list();
    // const appProvider = providers.find(p => p.namespace === 'Microsoft.App');
    // if (appProvider?.registrationState !== 'Registered') {
    //   await client.providers.register('Microsoft.App');
    // }

    const requiredProviders = ['Microsoft.App', 'Microsoft.Storage', 'Microsoft.ContainerRegistry']

    // Simulación: verificar con CLI
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    const missingProviders: string[] = []

    for (const provider of requiredProviders) {
      try {
        const command = `az provider show --namespace ${provider} --subscription ${subscription_id} --query "registrationState" -o tsv`
        const { stdout } = await execAsync(command)
        const state = stdout.trim()

        if (state !== 'Registered') {
          missingProviders.push(provider)
          // Auto-registrar
          await execAsync(`az provider register --namespace ${provider} --subscription ${subscription_id}`)
        }
      } catch (error) {
        missingProviders.push(provider)
      }
    }

    if (missingProviders.length > 0) {
      return { success: false, missing: missingProviders }
    }

    return { success: true, registered: requiredProviders }
  } catch (error) {
    return { success: false, missing: ['Microsoft.App', 'Microsoft.Storage', 'Microsoft.ContainerRegistry'] }
  }
}

async function verifyResourceGroup(
  subscription_id: string,
  resource_group: string,
  location: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Implementar con Azure SDK (@azure/arm-resources)
    // Por ahora, simulamos verificación
    // En producción:
    // const client = new ResourceManagementClient(credential, subscription_id);
    // try {
    //   await client.resourceGroups.get(resource_group);
    // } catch {
    //   await client.resourceGroups.createOrUpdate(resource_group, { location });
    // }

    // Simulación: verificar con CLI
    const { exec } = await import('child_process')
    const { promisify } = await import('util')
    const execAsync = promisify(exec)

    try {
      const command = `az group show --name ${resource_group} --subscription ${subscription_id}`
      await execAsync(command)
      return { success: true }
    } catch {
      // No existe, intentar crear
      try {
        const createCommand = `az group create --name ${resource_group} --location ${location} --subscription ${subscription_id}`
        await execAsync(createCommand)
        return { success: true }
      } catch (createError) {
        return { success: false, error: 'Failed to create resource group' }
      }
    }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// ============================================
// VAULT INTEGRATION
// ============================================

async function saveToVault(userId: string, data: Record<string, unknown>): Promise<void> {
  try {
    const tenantId = userId.replace('user_', '').toLowerCase()
    const vaultPath = `secret/tenant/${tenantId}/azure`

    // TODO: Implementar con Vault API
    // Por ahora, simulamos guardado exitoso
    // En producción:
    // const vault = new VaultClient({ endpoint: process.env.VAULT_ADDR });
    // await vault.kv.put(vaultPath, data);

    console.log(`[Vault] Saved to ${vaultPath}:`, data)

    // Simulación: llamada HTTP a Vault
    const vaultAddr = process.env.VAULT_ADDR || 'https://vault.smarterbot.cl'
    const vaultToken = process.env.VAULT_TOKEN || ''

    if (!vaultToken) {
      console.warn('[Vault] VAULT_TOKEN not set, skipping save')
      return
    }

    const response = await fetch(`${vaultAddr}/v1/${vaultPath}`, {
      method: 'POST',
      headers: {
        'X-Vault-Token': vaultToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      throw new Error(`Vault error: ${response.statusText}`)
    }

    console.log('[Vault] Successfully saved Azure config')
  } catch (error) {
    console.error('[Vault] Error saving to Vault:', error)
    throw error
  }
}
