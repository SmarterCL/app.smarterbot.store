"use client"

import { useState } from "react"
import { Cloud, Database, Box, CheckCircle2, XCircle, Loader2, ExternalLink, AlertCircle } from "lucide-react"

interface AzureConfig {
  subscription_id: string
  resource_group: string
  tenant_id?: string
  location: "westeurope" | "southcentralus"
}

type AzureStatus = "not_configured" | "verifying" | "verified" | "error"

interface ValidationError {
  code: string
  message: string
  resolution: string
}

export default function AzureSettingsPage() {
  const [config, setConfig] = useState<AzureConfig>({
    subscription_id: "",
    resource_group: "smarteros-n8n-prod",
    tenant_id: "",
    location: "westeurope",
  })
  const [status, setStatus] = useState<AzureStatus>("not_configured")
  const [verificationData, setVerificationData] = useState<{
    credit_remaining?: number
    providers_registered?: string[]
    n8n_url?: string
  } | null>(null)
  const [errors, setErrors] = useState<ValidationError[]>([])

  const handleVerify = async () => {
    setStatus("verifying")
    setErrors([])

    try {
      const response = await fetch("/api/azure/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      const data = await response.json()

      if (data.status === "verified") {
        setStatus("verified")
        setVerificationData({
          credit_remaining: data.credit_remaining,
          providers_registered: data.providers_registered,
          n8n_url: data.n8n_url,
        })
      } else {
        setStatus("error")
        setErrors(data.errors || [])
      }
    } catch (error) {
      setStatus("error")
      setErrors([
        {
          code: "NETWORK_ERROR",
          message: "Error de conexión al servidor",
          resolution: "Verifica tu conexión a internet e intenta nuevamente",
        },
      ])
    }
  }

  const StatusIcon = ({ status }: { status: boolean | null }) => {
    if (status === null) return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
    if (status) return <CheckCircle2 className="h-5 w-5 text-green-600" />
    return <XCircle className="h-5 w-5 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuración Azure</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Conecta tu suscripción de Azure para desplegar n8n, Postgres y servicios de automatización.
          </p>
        </div>

        {/* Free Trial Banner */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start gap-4">
            <Cloud className="h-8 w-8 text-blue-600" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">¿No tienes suscripción de Azure?</h3>
              <p className="mt-1 text-sm text-blue-700">
                Obtén <strong>$200 USD en créditos gratis</strong> por 30 días con Azure Free Trial.
              </p>
              <a
                href="https://azure.microsoft.com/free"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Crear cuenta gratuita <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Azure Subscription Form */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-foreground">
            <Database className="h-5 w-5" />
            Suscripción de Azure
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Subscription ID *</label>
              <input
                type="text"
                value={config.subscription_id}
                onChange={(e) => setConfig({ ...config, subscription_id: e.target.value })}
                placeholder="00000000-0000-0000-0000-000000000000"
                className="mt-1 w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={status === "verifying" || status === "verified"}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Encuéntralo en{" "}
                <a
                  href="https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  Azure Portal → Subscriptions
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Resource Group *</label>
              <input
                type="text"
                value={config.resource_group}
                onChange={(e) => setConfig({ ...config, resource_group: e.target.value })}
                placeholder="smarteros-n8n-prod"
                className="mt-1 w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={status === "verifying" || status === "verified"}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Nombre del resource group donde se deployará n8n (se creará si no existe)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Tenant ID (opcional)</label>
              <input
                type="text"
                value={config.tenant_id}
                onChange={(e) => setConfig({ ...config, tenant_id: e.target.value })}
                placeholder="87654321-4321-4321-4321-cba987654321"
                className="mt-1 w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={status === "verifying" || status === "verified"}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Solo necesario para integración SSO futura (Azure Active Directory)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground">Region *</label>
              <select
                value={config.location}
                onChange={(e) => setConfig({ ...config, location: e.target.value as "westeurope" | "southcentralus" })}
                className="mt-1 w-full rounded border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
                disabled={status === "verifying" || status === "verified"}
              >
                <option value="westeurope">West Europe (Ámsterdam) - Recomendado</option>
                <option value="southcentralus">South Central US (Texas)</option>
              </select>
              <p className="mt-1 text-xs text-muted-foreground">
                Región donde se deployarán los recursos (menor latencia = mejor rendimiento)
              </p>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={!config.subscription_id || !config.resource_group || status === "verifying" || status === "verified"}
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === "verifying" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando suscripción...
                </>
              ) : status === "verified" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Verificado
                </>
              ) : (
                "Verificar suscripción"
              )}
            </button>
          </div>
        </div>

        {/* Status Badge */}
        {status !== "not_configured" && (
          <div className={`rounded-lg border p-4 ${
            status === "verified" 
              ? "border-green-200 bg-green-50" 
              : status === "verifying"
              ? "border-yellow-200 bg-yellow-50"
              : "border-red-200 bg-red-50"
          }`}>
            <div className="flex items-start gap-3">
              {status === "verified" && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {status === "verifying" && <Loader2 className="h-5 w-5 animate-spin text-yellow-600" />}
              {status === "error" && <AlertCircle className="h-5 w-5 text-red-600" />}
              
              <div className="flex-1">
                {status === "verified" && (
                  <>
                    <h3 className="font-semibold text-green-900">✅ Integración completa</h3>
                    <p className="mt-1 text-sm text-green-700">
                      Suscripción verificada. Crédito disponible: <strong>${verificationData?.credit_remaining?.toFixed(2)}</strong>
                    </p>
                    {verificationData?.n8n_url && (
                      <p className="mt-2 text-sm text-green-700">
                        n8n URL: <code className="rounded bg-green-100 px-2 py-1">{verificationData.n8n_url}</code>
                      </p>
                    )}
                    {verificationData?.providers_registered && verificationData.providers_registered.length > 0 && (
                      <p className="mt-2 text-xs text-green-600">
                        Providers registrados: {verificationData.providers_registered.join(", ")}
                      </p>
                    )}
                  </>
                )}
                
                {status === "verifying" && (
                  <>
                    <h3 className="font-semibold text-yellow-900">⏳ Verificando suscripción...</h3>
                    <p className="mt-1 text-sm text-yellow-700">
                      Validando Subscription ID, crédito disponible y providers de Azure
                    </p>
                  </>
                )}
                
                {status === "error" && (
                  <>
                    <h3 className="font-semibold text-red-900">❌ Error de verificación</h3>
                    <div className="mt-2 space-y-2">
                      {errors.map((error, index) => (
                        <div key={index} className="rounded bg-red-100 p-3">
                          <p className="text-sm font-medium text-red-800">{error.message}</p>
                          <p className="mt-1 text-xs text-red-600">
                            <strong>Solución:</strong> {error.resolution}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Deployment Instructions */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h3 className="font-semibold text-yellow-900">Instrucciones de Deploy</h3>
          <ol className="mt-3 space-y-2 text-sm text-yellow-800">
            <li>
              1. <strong>Instala Azure Developer CLI:</strong>{" "}
              <code className="rounded bg-yellow-100 px-2 py-1 text-xs">brew tap azure/azd && brew install azd</code>
            </li>
            <li>
              2. <strong>Login a Azure:</strong>{" "}
              <code className="rounded bg-yellow-100 px-2 py-1 text-xs">azd auth login</code>
            </li>
            <li>
              3. <strong>Deploy n8n:</strong>{" "}
              <code className="rounded bg-yellow-100 px-2 py-1 text-xs">
                cd n8n-smarteros && azd env new smarteros-n8n-prod && azd up
              </code>
            </li>
            <li>
              4. <strong>Configura DNS:</strong> CNAME <code>n8n.smarterbot.cl</code> → Output de{" "}
              <code>azd up</code>
            </li>
            <li>
              5. <strong>Vuelve aquí</strong> y completa los campos con los valores del deployment
            </li>
          </ol>
          <a
            href="https://github.com/SmarterCL/n8n-smarteros"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-yellow-900 hover:underline"
          >
            Ver repositorio n8n-smarteros <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Costos estimados */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-foreground">Costos Estimados (Tier Production)</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Azure Container Apps</span>
              <span className="font-medium text-foreground">~$150/mes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Postgres Flexible Server (Standard_B2s)</span>
              <span className="font-medium text-foreground">~$50/mes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Azure Files Premium (100GB)</span>
              <span className="font-medium text-foreground">~$30/mes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VNet + Private Endpoints</span>
              <span className="font-medium text-foreground">~$20/mes</span>
            </div>
            <div className="mt-3 flex justify-between border-t border-border pt-3">
              <span className="font-semibold text-foreground">Total estimado</span>
              <span className="text-lg font-bold text-accent">~$250/mes</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            * Free Trial incluye $200 USD de créditos. El primer mes es prácticamente gratis.
          </p>
        </div>
      </div>
    </div>
  )
}
