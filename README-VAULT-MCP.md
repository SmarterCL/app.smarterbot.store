# 🚀 Guía Completa: Vault + MCP + fulldaygo.smarterbot.cl

Esta guía consolida todos los pasos para configurar HashiCorp Vault y el servidor SmarterMCP en **fulldaygo.smarterbot.cl**.

---

## 📦 Arquitectura de Credenciales

```
┌─────────────────────────────────────────────────────────────┐
│                    fulldaygo.smarterbot.cl                  │
│  (Next.js 15 + Clerk + Supabase + React 19 + Tailwind)    │
└───────────────────────┬─────────────────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
    ┌────▼────┐                  ┌─────▼─────┐
    │  Vault  │◄─────policy──────┤    MCP    │
    │ (Secrets│                  │  Server   │
    │ Storage)│                  │(Tools API)│
    └─────────┘                  └───────────┘
         │                             │
         │ smarteros/mcp/smartermcp   │ https://mcp.smarterbot.cl
         │                             │
         └─── api_token, tenant_id ───┘
```

### Flujo de Datos

1. **Desarrollo local**: Lee `.env.local` (Clerk + Supabase + Vault token)
2. **Runtime de app**: Consulta Vault con `VAULT_TOKEN` → obtiene `SMARTERMCP_API_TOKEN`
3. **MCP Server**: Autentica con ese token → expone tools (GitHub, Supabase, n8n, etc.)
4. **Agentes (Codex/Gemini/Copilot)**: Llaman al MCP con scopes específicos

---

## 🔐 Paso 1: Setup Inicial de Vault

### 1.1 Instalar CLI de Vault

```bash
# macOS
brew install hashicorp/tap/vault

# Linux
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install vault

# Verificar instalación
vault version
```

### 1.2 Configurar Variables de Entorno

```bash
# En tu ~/.bashrc o ~/.zshrc
export VAULT_ADDR=https://vault.smarterbot.cl
export VAULT_NAMESPACE=smarteros

# Aplicar cambios
source ~/.bashrc  # o ~/.zshrc
```

### 1.3 Autenticarte en Vault

```bash
# Solicita tu token de admin al equipo de infra
# Luego autenticate:
vault login

# Ingresar token: hvs.CAESIxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Verificar acceso
vault status
```

---

## 🤖 Paso 2: Provisionar SmarterMCP

### 2.1 Generar Token de API del MCP

El servidor MCP requiere autenticación. Generá un token con los scopes necesarios:

```bash
# Token con scopes básicos para fulldaygo
curl -X POST https://mcp.smarterbot.cl/auth/token \
  -H "Authorization: Bearer $VAULT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "fulldaygo-app",
    "description": "Token para app fulldaygo.smarterbot.cl",
    "scopes": [
      "read:services",
      "read:workflows",
      "read:infra",
      "read:analytics"
    ],
    "tenant_id": "fulldaygo"
  }' | jq -r '.token'
```

**Salida esperada**:
```
smcp_1a2b3c4d5e6f7g8h9i0jklmnopqrstuv
```

💾 **Guardá este token** — lo necesitás en el siguiente paso.

### 2.2 Guardar Credenciales en Vault

```bash
# Guardar en Vault bajo smarteros/mcp/smartermcp
vault kv put smarteros/mcp/smartermcp \
  api_token="smcp_1a2b3c4d5e6f7g8h9i0jklmnopqrstuv" \
  tenant_id="fulldaygo" \
  endpoint="https://mcp.smarterbot.cl" \
  created_at="$(date -Iseconds)" \
  created_by="$USER"

# Verificar
vault kv get smarteros/mcp/smartermcp
```

**Salida esperada**:
```
====== Metadata ======
Key              Value
---              -----
created_time     2025-01-17T10:30:00Z
version          1

====== Data ======
Key         Value
---         -----
api_token   smcp_1a2b3c4d5e6f7g8h9i0jklmnopqrstuv
endpoint    https://mcp.smarterbot.cl
tenant_id   fulldaygo
```

### 2.3 Aplicar Política de Acceso

```bash
# Navegar al repo de specs
cd ~/dev/2025/smarteros-specs

# Aplicar policy de lectura para SmarterMCP
vault policy write mcp-smartermcp-read \
  vault/policies/mcp-smartermcp-read.hcl

# Verificar
vault policy read mcp-smartermcp-read
```

**Contenido de la policy** (`vault/policies/mcp-smartermcp-read.hcl`):
```hcl
# Lectura del secret principal
path "smarteros/data/mcp/smartermcp" {
  capabilities = ["read"]
}

# Metadata (para listar versiones)
path "smarteros/metadata/mcp/smartermcp" {
  capabilities = ["read", "list"]
}
```

### 2.4 Crear Token de Vault para la App

Generá un token con la policy `mcp-smartermcp-read` para usar en Vercel:

```bash
vault token create \
  -policy=mcp-smartermcp-read \
  -display-name="fulldaygo-vercel-token" \
  -renewable=true \
  -ttl=720h \
  -format=json | jq -r '.auth.client_token'
```

**Salida esperada**:
```
hvs.CAESIyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```

💾 **Guardá este token** — lo configurás en Vercel en el Paso 3.

---

## ☁️ Paso 3: Configurar Variables de Entorno en Vercel

### 3.1 Ir al Dashboard de Vercel

1. Abrí https://vercel.com/smartercl/fulldaygo-smarterbot-cl (ajustá el link)
2. Andá a **Settings** → **Environment Variables**

### 3.2 Agregar Variables Críticas

| Variable | Value | Environments | Notas |
|----------|-------|--------------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_xxx...` | All | Obtener de [Clerk Dashboard](https://dashboard.clerk.com) |
| `CLERK_SECRET_KEY` | `sk_test_xxx...` | Production, Preview | ⚠️ Secret, no exponer |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxx.supabase.co` | All | Tu proyecto en [Supabase](https://app.supabase.com) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | All | API Key "anon" de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Production, Preview | ⚠️ Secret, solo server-side |
| `VAULT_ADDR` | `https://vault.smarterbot.cl` | All | Endpoint de Vault |
| `VAULT_TOKEN` | `hvs.CAESIyyyyyy...` | Production, Preview | Token generado en 2.4 |
| `VAULT_NAMESPACE` | `smarteros` | All | Namespace de Vault |
| `SMARTERMCP_ENDPOINT` | `https://mcp.smarterbot.cl` | All | Endpoint del MCP server |
| `SMARTERMCP_API_TOKEN` | `smcp_1a2b3c4d...` | Production, Preview | Token generado en 2.1 |
| `SMARTERMCP_TENANT_ID` | `fulldaygo` | All | Tu tenant ID |

### 3.3 Variables Opcionales (Comunicación/Analytics)

| Variable | Propósito | Obtener desde |
|----------|-----------|---------------|
| `NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN` | Live chat widget | [Chatwoot](https://app.chatwoot.com) |
| `SLACK_BOT_TOKEN` | Notificaciones internas | [Slack API](https://api.slack.com) |
| `MAILGUN_API_KEY` | Envío de emails | [Mailgun](https://app.mailgun.com) |
| `NEXT_PUBLIC_POSTHOG_KEY` | Product analytics | [PostHog](https://app.posthog.com) |
| `SENTRY_DSN` | Error tracking | [Sentry](https://sentry.io) |

---

## 🧪 Paso 4: Validar la Configuración

### 4.1 Probar Acceso a Vault (Local)

```bash
# Configurar entorno local
export VAULT_ADDR=https://vault.smarterbot.cl
export VAULT_TOKEN=hvs.CAESIyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy

# Leer el secret de SmarterMCP
vault kv get -format=json smarteros/mcp/smartermcp | jq '.data.data'
```

**Salida esperada**:
```json
{
  "api_token": "smcp_1a2b3c4d5e6f7g8h9i0jklmnopqrstuv",
  "endpoint": "https://mcp.smarterbot.cl",
  "tenant_id": "fulldaygo",
  "created_at": "2025-01-17T10:30:00Z"
}
```

### 4.2 Probar el MCP Server

```bash
# Health check (sin autenticación)
curl https://mcp.smarterbot.cl/health

# Listar herramientas disponibles (sin autenticación)
curl https://mcp.smarterbot.cl/tools | jq '.tools[].name'

# Listar servicios (CON autenticación)
curl https://mcp.smarterbot.cl/api/services \
  -H "Authorization: Bearer smcp_1a2b3c4d5e6f7g8h9i0jklmnopqrstuv" \
  -H "X-Tenant-ID: fulldaygo" | jq
```

**Salida esperada** (servicios):
```json
{
  "services": [
    { "id": "clerk", "status": "active", "tier": 1 },
    { "id": "supabase", "status": "active", "tier": 1 },
    { "id": "n8n", "status": "active", "tier": 2 },
    { "id": "github", "status": "active", "tier": 1 }
  ]
}
```

### 4.3 Redeploy en Vercel

```bash
# Desde tu proyecto local
cd ~/dev/2025/app.smarterbot.cl

# Commit los cambios de docs (si los hiciste)
git add .env.example README-VAULT-MCP.md
git commit -m "docs: add vault + mcp setup guide"
git push origin main

# Vercel redeploya automáticamente
```

Abrí https://fulldaygo.smarterbot.cl y verificá:
- ✅ Botón "Conectar con SmarterOS" visible
- ✅ Login con Clerk funciona
- ✅ Dashboard carga datos de Supabase

---

## 🔄 Paso 5: Integrar Vault en tu Código (Opcional)

Si querés que tu app lea secretos **en runtime** desde Vault (en vez de hardcodear env vars), seguí estos pasos:

### 5.1 Instalar SDK de Vault

```bash
cd ~/dev/2025/app.smarterbot.cl
pnpm add @hashicorp/vault-client
```

### 5.2 Crear Helper de Vault

```typescript
// lib/vault-client.ts

import { createClient } from '@hashicorp/vault-client'

const vaultClient = createClient({
  endpoint: process.env.VAULT_ADDR || 'https://vault.smarterbot.cl',
  token: process.env.VAULT_TOKEN,
  namespace: process.env.VAULT_NAMESPACE || 'smarteros',
})

export async function getSmartermcpCredentials() {
  const { data } = await vaultClient.kv2.read('mcp/smartermcp')
  return {
    apiToken: data.api_token as string,
    endpoint: data.endpoint as string,
    tenantId: data.tenant_id as string,
  }
}

export async function getServiceCredentials(service: string) {
  const { data } = await vaultClient.kv2.read(`services/${service}`)
  return data
}
```

### 5.3 Usar en API Routes

```typescript
// app/api/mcp/tools/route.ts

import { getSmartermcpCredentials } from '@/lib/vault-client'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { apiToken, endpoint, tenantId } = await getSmartermcpCredentials()
    
    const response = await fetch(`${endpoint}/tools`, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'X-Tenant-ID': tenantId,
      },
    })
    
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('[MCP] Failed to fetch tools:', error)
    return NextResponse.json({ error: 'Failed to fetch tools' }, { status: 500 })
  }
}
```

### 5.4 Actualizar `app/api/azure/verify/route.ts`

Reemplazá la función `saveToVault` existente (línea 331) con:

```typescript
import { vaultClient } from '@/lib/vault-client'

async function saveToVault(userId: string, data: Record<string, unknown>): Promise<void> {
  const tenantId = userId.replace('user_', '').toLowerCase()
  const vaultPath = `tenant/${tenantId}/azure`
  
  await vaultClient.kv2.write(vaultPath, data)
  console.log(`[Vault] Saved to smarteros/${vaultPath}`)
}
```

---

## 📚 Paso 6: Configurar Otros MCPs (Opcional)

Para habilitar otros providers (GitHub, Shopify, Slack, etc.), seguí el mismo patrón:

### 6.1 Aplicar Todas las Policies de MCP

```bash
cd ~/dev/2025/smarteros-specs

# Aplicar todas las policies de MCP en batch
bash scripts/apply-vault-policies.sh --mcp-only

# O aplicar una específica
vault policy write mcp-github-read vault/policies/mcp-github-read.hcl
vault policy write mcp-supabase-read vault/policies/mcp-supabase-read.hcl
```

### 6.2 Guardar Credenciales de Cada Provider

```bash
# GitHub
vault kv put smarteros/mcp/github \
  token="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  org="SmarterCL"

# Shopify (solo para Gemini, ver policy)
vault kv put smarteros/mcp/shopify \
  api_key="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  store="smarteros.myshopify.com" \
  tier="2"

# Supabase
vault kv put smarteros/mcp/supabase \
  url="https://xxxxxxxxxxxxxxxxxxxxx.supabase.co" \
  anon_key="eyJhbGci..." \
  service_role_key="eyJhbGci..."
```

### 6.3 Crear Tokens por Agente (Gemini, Codex, Copilot)

```bash
# Token para Gemini (acceso a 15 MCPs)
vault token create \
  -policy=agent-gemini-mcp-access \
  -display-name="gemini-director-token" \
  -ttl=720h

# Token para Codex (acceso a 9 MCPs)
vault token create \
  -policy=agent-codex-mcp-access \
  -display-name="codex-executor-token" \
  -ttl=720h

# Token para Copilot (acceso a 4 MCPs)
vault token create \
  -policy=agent-copilot-mcp-access \
  -display-name="copilot-writer-token" \
  -ttl=720h
```

Ver `vault/policies/README.md:25-70` para la matriz completa de acceso por agente.

---

## 🆘 Troubleshooting

### Problema: "VAULT_TOKEN no configurado"

**Síntoma**: Error 401 al acceder a Vault desde la app.

**Solución**:
```bash
# Verificar localmente
echo $VAULT_TOKEN

# En Vercel: Settings → Env Vars → debe aparecer VAULT_TOKEN
# Si falta, agregalo según Paso 3.2
```

### Problema: "Permission denied" al leer secret

**Síntoma**: `Error: permission denied` en `vault kv get`.

**Solución**:
```bash
# Verificar policies del token
vault token lookup

# Debe incluir la policy necesaria:
# policies    [default mcp-smartermcp-read]

# Si no aparece, regenerá el token (Paso 2.4)
```

### Problema: "MCP server not responding"

**Síntoma**: Timeout al llamar `https://mcp.smarterbot.cl`.

**Solución**:
```bash
# Verificar health del servidor
curl https://mcp.smarterbot.cl/health

# Si no responde, revisar:
# 1. DNS: dig mcp.smarterbot.cl
# 2. Docker Compose: cd ~/dev/2025/dkcompose && docker compose -f mcp.smarterbot.cl.yml logs
# 3. Firewall/Cloudflare: verificar que el puerto 443 esté expuesto
```

### Problema: "Invalid token format" en MCP

**Síntoma**: Error 401 con mensaje `Invalid token format`.

**Solución**:
```bash
# Verificar que el token empiece con "smcp_"
echo $SMARTERMCP_API_TOKEN

# Si no, regeneralo (Paso 2.1)
```

### Problema: Clerk login no funciona

**Síntoma**: Botón "Conectar con SmarterOS" deshabilitado.

**Solución**:
```bash
# Verificar que las claves de Clerk estén en Vercel
# Settings → Env Vars → buscar:
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# - CLERK_SECRET_KEY

# Si faltan, obtenerlas de https://dashboard.clerk.com
```

---

## 🎯 Checklist de Deploy

Antes de hacer tu primer deploy a producción, verificá:

- [ ] **Vault**
  - [ ] CLI instalado y configurado (`vault version`)
  - [ ] Token de admin configurado (`vault login`)
  - [ ] Secret `smarteros/mcp/smartermcp` creado
  - [ ] Policy `mcp-smartermcp-read` aplicada
  - [ ] Token de app generado (`vault token create`)

- [ ] **MCP Server**
  - [ ] Token de API generado (`smcp_xxx...`)
  - [ ] Endpoint responde (`curl https://mcp.smarterbot.cl/health`)
  - [ ] Tools disponibles (`curl https://mcp.smarterbot.cl/tools`)

- [ ] **Vercel**
  - [ ] Variables de Clerk configuradas
  - [ ] Variables de Supabase configuradas
  - [ ] Variables de Vault configuradas
  - [ ] Variables de MCP configuradas
  - [ ] Deploy exitoso (sin errores de build)

- [ ] **Testing**
  - [ ] Login con Clerk funciona
  - [ ] Dashboard carga datos de Supabase
  - [ ] No hay errores en consola del navegador
  - [ ] Logs de Vercel sin errores críticos

---

## 📚 Referencias

| Documento | Path | Descripción |
|-----------|------|-------------|
| **Spec MCP Central** | `smarteros-specs/mcp/smartermcp.yml` | Configuración completa del servidor MCP (endpoints, scopes, setup) |
| **Vault Policies** | `smarteros-specs/vault/policies/README.md` | Documentación de todas las políticas de acceso |
| **Policy SmarterMCP** | `smarteros-specs/vault/policies/mcp-smartermcp-read.hcl` | Política específica para leer credenciales del MCP |
| **Agent Access Matrix** | `vault/policies/README.md:25-70` | Matriz de qué agente accede a qué MCP |
| **Apply Policies Script** | `smarteros-specs/scripts/apply-vault-policies.sh` | Script para aplicar todas las policies en batch |
| **Tenant Setup** | `smarteros-specs/TENANT-SETUP.md` | Guía de provisioning completo de tenant |
| **Deployment Guide** | `smarteros-specs/DEPLOYMENT-GUIDE.md` | Deployment end-to-end de SmarterOS |

---

## 🚀 Próximos Pasos

1. **Habilitar más MCPs** (GitHub, Shopify, n8n) → Seguir Paso 6
2. **Configurar agentes** (Gemini, Codex, Copilot) → Ver `vault/policies/README.md:25-70`
3. **Integrar Vault SDK** en código → Seguir Paso 5
4. **Monitoreo de Vault** → Configurar audit logs y alertas
5. **Rotación de tokens** → Implementar renovación automática cada 30 días

---

**¿Necesitás ayuda?** Contactá al equipo de infra en Slack (#infra-vault) o revisá la documentación completa en `smarteros-specs/`. 🔐✨
