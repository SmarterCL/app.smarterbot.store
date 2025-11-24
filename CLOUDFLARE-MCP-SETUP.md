# 🌐 Cloudflare DNS MCP — Setup Guide

Guía para configurar el servidor MCP de Cloudflare DNS Analytics en **fulldaygo.smarterbot.cl** y el ecosistema SmarterOS.

---

## 📋 Overview

**Cloudflare DNS Analytics MCP** es el servidor oficial de Cloudflare para gestión de DNS mediante Model Context Protocol.

### Capacidades

- ✅ Listar zonas DNS
- ✅ Crear/actualizar/eliminar registros DNS (A, AAAA, CNAME, MX, TXT, etc.)
- ✅ Obtener analytics de tráfico DNS
- ✅ Optimizar configuraciones DNS
- ✅ Sugerencias de mejora basadas en métricas

### Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                    fulldaygo.smarterbot.cl                  │
│              (Next.js app con agent executor)               │
└───────────────────────┬─────────────────────────────────────┘
                        │
         ┌──────────────┴──────────────┐
         │                             │
    ┌────▼────┐                  ┌─────▼─────┐
    │  Vault  │                  │ Cloudflare│
    │         │                  │  DNS MCP  │
    └─────────┘                  └───────────┘
         │                             │
         │ smarteros/mcp/cloudflare   │ https://dns-analytics.mcp.cloudflare.com/mcp
         │                             │
         │ - api_token                │
         │ - email                     │ → Cloudflare API
         │ - zone_id (smarterbot.cl)  │
         └─────────────────────────────┘
```

---

## 🔐 Paso 1: Obtener API Token de Cloudflare

### 1.1 Ir al Dashboard de Cloudflare

1. Abrí https://dash.cloudflare.com
2. Andá a **My Profile** (esquina superior derecha)
3. Click en **API Tokens**

### 1.2 Crear Token con Permisos DNS

Click en **Create Token** → **Custom token**:

| Setting | Value |
|---------|-------|
| **Token name** | `smarteros-dns-mcp` |
| **Permissions** | |
| → Zone | Zone | Read |
| → Zone | DNS | Edit |
| **Zone Resources** | |
| → Include | Specific zone | `smarterbot.cl` |
| **IP Address Filtering** | (opcional) Tu IP/VPN |
| **TTL** | (opcional) Expiry date |

Click **Continue to summary** → **Create Token**

### 1.3 Guardar el Token

Copiá el token generado (solo se muestra una vez):

```
<API_TOKEN_VALUE>
```

💾 **Guardá este token** — no lo vas a poder ver de nuevo.

---

## 🗄️ Paso 2: Obtener Zone ID de smarterbot.cl

### Opción A: Desde Cloudflare Dashboard

1. Abrí https://dash.cloudflare.com
2. Seleccioná el dominio **smarterbot.cl**
3. Scroll down en la sidebar derecha → **Zone ID**
4. Copiá el valor (formato: `abc123...`)

### Opción B: Via API

```bash
# Obtener Zone ID usando el API token
curl -X GET "https://api.cloudflare.com/client/v4/zones?name=smarterbot.cl" \
  -H "Authorization: Bearer <API_TOKEN_VALUE>" \
  -H "Content-Type: application/json" | jq -r '.result[0].id'
```

💾 **Guardá el Zone ID** para el siguiente paso.

---

## 🔐 Paso 3: Guardar Credenciales en Vault

### 3.1 Configurar Entorno de Vault

```bash
export VAULT_ADDR=https://vault.smarterbot.cl
export VAULT_NAMESPACE=smarteros
vault login  # ingresar token de admin
```

### 3.2 Guardar Credenciales de Cloudflare

```bash
vault kv put smarteros/mcp/cloudflare \
  api_token="<API_TOKEN_VALUE>" \
  email="tu-email@cloudflare.com" \
  zone_id="<ZONE_ID_SMARTERBOT_CL>" \
  zone_name="smarterbot.cl" \
  created_at="$(date -Iseconds)" \
  created_by="$USER"
```

**Ejemplo**:
```bash
vault kv put smarteros/mcp/cloudflare \
  api_token="abc123xyzABCDEFGHIJKLMNOPQRSTUVWXYZ" \
  email="admin@smartercl.com" \
  zone_id="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
  zone_name="smarterbot.cl"
```

### 3.3 Verificar

```bash
vault kv get smarteros/mcp/cloudflare
```

**Salida esperada**:
```
====== Metadata ======
Key              Value
---              -----
created_time     2025-01-17T15:30:00Z
version          1

====== Data ======
Key         Value
---         -----
api_token   abc123xyz...
email       admin@smartercl.com
zone_id     a1b2c3d4e5f6...
zone_name   smarterbot.cl
```

---

## 🛡️ Paso 4: Aplicar Vault Policy

### 4.1 Aplicar Policy de Cloudflare DNS

```bash
cd ~/dev/2025/smarteros-specs

vault policy write mcp-cloudflare-dns-read \
  vault/policies/mcp-cloudflare-dns-read.hcl
```

**Contenido de la policy** (`vault/policies/mcp-cloudflare-dns-read.hcl`):
```hcl
# Cloudflare DNS Analytics MCP credentials
path "smarteros/mcp/cloudflare" {
  capabilities = ["read", "list"]
}

# Allow listing MCP providers
path "smarteros/mcp/" {
  capabilities = ["list"]
}

# Read-only access to zone configurations
path "smarteros/infra/cloudflare/zones/*" {
  capabilities = ["read"]
}
```

### 4.2 Verificar Policy

```bash
vault policy read mcp-cloudflare-dns-read
```

---

## 🤖 Paso 5: Configurar Agentes (Codex / Gemini)

### 5.1 Actualizar Policy del Agente Codex

El agente **executor-codex** es el principal usuario de Cloudflare DNS MCP:

```bash
# La policy agent-codex-mcp-access ya incluye mcp-cloudflare-dns-read
# Verificar:
vault policy read agent-codex-mcp-access | grep cloudflare
```

Si no aparece, agregarlo manualmente o aplicar la policy actualizada:

```bash
cd ~/dev/2025/smarteros-specs
bash scripts/apply-vault-policies.sh --agents
```

### 5.2 Crear/Actualizar Token de Codex

```bash
vault token create \
  -policy=agent-codex-mcp-access \
  -display-name="codex-executor-token" \
  -renewable=true \
  -ttl=720h \
  -format=json | jq -r '.auth.client_token'
```

💾 **Guardá este token** para configurar en el agente Codex.

---

## 🧪 Paso 6: Probar el MCP Server

### 6.1 Probar con MCP Inspector (Local)

```bash
# Instalar MCP Inspector (si no lo tenés)
npm install -g @modelcontextprotocol/inspector

# Conectar al servidor remoto de Cloudflare
npx @modelcontextprotocol/inspector https://dns-analytics.mcp.cloudflare.com/mcp
```

Esto abre una interfaz web donde podés probar los tools manualmente.

### 6.2 Probar Desde Terminal (con mcp-remote)

```bash
# Instalar mcp-remote (si no lo tenés)
npm install -g mcp-remote

# Listar zonas
npx mcp-remote call \
  https://dns-analytics.mcp.cloudflare.com/mcp \
  zones_list \
  --token "<API_TOKEN_VALUE>"

# Listar registros DNS de smarterbot.cl
npx mcp-remote call \
  https://dns-analytics.mcp.cloudflare.com/mcp \
  dns_records_list \
  --token "<API_TOKEN_VALUE>" \
  --params '{"zone_id": "<ZONE_ID>"}'
```

### 6.3 Probar desde Código (Next.js)

Creá un helper en tu app:

```typescript
// lib/cloudflare-mcp.ts

import { createClient } from '@hashicorp/vault-client'

const vaultClient = createClient({
  endpoint: process.env.VAULT_ADDR || 'https://vault.smarterbot.cl',
  token: process.env.VAULT_TOKEN,
  namespace: process.env.VAULT_NAMESPACE || 'smarteros',
})

export async function getCloudflareCredentials() {
  const { data } = await vaultClient.kv2.read('mcp/cloudflare')
  return {
    apiToken: data.api_token as string,
    email: data.email as string,
    zoneId: data.zone_id as string,
    zoneName: data.zone_name as string,
  }
}

export async function listDnsRecords(zoneId?: string) {
  const { apiToken, zoneId: defaultZoneId } = await getCloudflareCredentials()
  const targetZoneId = zoneId || defaultZoneId
  
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${targetZoneId}/dns_records`,
    {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    }
  )
  
  return response.json()
}

export async function createDnsRecord(params: {
  name: string
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'TXT'
  content: string
  ttl?: number
  proxied?: boolean
  zoneId?: string
}) {
  const { apiToken, zoneId: defaultZoneId } = await getCloudflareCredentials()
  const targetZoneId = params.zoneId || defaultZoneId
  
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${targetZoneId}/dns_records`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: params.type,
        name: params.name,
        content: params.content,
        ttl: params.ttl || 1, // auto
        proxied: params.proxied ?? true,
      }),
    }
  )
  
  return response.json()
}
```

Luego usalo en una API route:

```typescript
// app/api/dns/records/route.ts

import { getCloudflareCredentials, listDnsRecords } from '@/lib/cloudflare-mcp'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const records = await listDnsRecords()
    return NextResponse.json(records)
  } catch (error) {
    console.error('[DNS] Failed to fetch records:', error)
    return NextResponse.json({ error: 'Failed to fetch DNS records' }, { status: 500 })
  }
}
```

---

## 🚀 Casos de Uso

### 1. Crear Subdominio para Nuevo Servicio

**Escenario**: Levantar `mkt.smarterbot.cl` apuntando al servidor de marketing.

```typescript
await createDnsRecord({
  name: 'mkt',
  type: 'A',
  content: '216.198.79.1', // IP del servidor
  proxied: true,
})
```

**Via MCP Inspector**:
```json
{
  "tool": "dns_records_create",
  "params": {
    "zone_id": "a1b2c3d4e5f6...",
    "type": "A",
    "name": "mkt",
    "content": "216.198.79.1",
    "ttl": 1,
    "proxied": true
  }
}
```

### 2. Actualizar DNS Durante Migración

**Escenario**: Cambiar la IP de `fulldaygo.smarterbot.cl` después de migrar a nuevo servidor.

```bash
# 1. Listar registros para encontrar el record_id
npx mcp-remote call \
  https://dns-analytics.mcp.cloudflare.com/mcp \
  dns_records_list \
  --params '{"zone_id": "a1b2c3d4..."}'

# 2. Actualizar el registro con el nuevo IP
npx mcp-remote call \
  https://dns-analytics.mcp.cloudflare.com/mcp \
  dns_records_update \
  --params '{
    "zone_id": "a1b2c3d4...",
    "record_id": "xyz789...",
    "type": "A",
    "name": "fulldaygo",
    "content": "203.0.113.50",
    "ttl": 1,
    "proxied": true
  }'
```

### 3. Análisis de Tráfico DNS

**Escenario**: Ver el tráfico DNS de `smarterbot.cl` en los últimos 7 días.

```bash
npx mcp-remote call \
  https://dns-analytics.mcp.cloudflare.com/mcp \
  dns_analytics_report \
  --params '{
    "zone_id": "a1b2c3d4...",
    "since": "2025-01-10T00:00:00Z",
    "until": "2025-01-17T23:59:59Z"
  }'
```

---

## 📊 Integración con fulldaygo.smarterbot.cl

### Variables de Entorno en Vercel

Agregá estas variables en **Vercel** → **Settings** → **Environment Variables**:

| Variable | Value | Environments |
|----------|-------|--------------|
| `CLOUDFLARE_MCP_ENDPOINT` | `https://dns-analytics.mcp.cloudflare.com/mcp` | All |
| `CLOUDFLARE_API_TOKEN` | (leer desde Vault en runtime) | - |
| `CLOUDFLARE_ZONE_ID` | (leer desde Vault en runtime) | - |

**O directamente** (si no usás Vault en runtime):

| Variable | Value | Environments |
|----------|-------|--------------|
| `CLOUDFLARE_API_TOKEN` | `abc123xyz...` | Production, Preview |
| `CLOUDFLARE_ZONE_ID` | `a1b2c3d4e5f6...` | Production, Preview |

### Actualizar .env.example

Ya incluido en `.env.example`:

```bash
# ──────────────────────────────────────────────────────────────────────
# 🌐 Cloudflare DNS (MCP)
# ──────────────────────────────────────────────────────────────────────

CLOUDFLARE_MCP_ENDPOINT=https://dns-analytics.mcp.cloudflare.com/mcp
CLOUDFLARE_API_TOKEN=abc123xyzABCDEFGHIJKLMNOPQRSTUVWXYZ
CLOUDFLARE_ZONE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
CLOUDFLARE_EMAIL=admin@smartercl.com
```

---

## 🆘 Troubleshooting

### Error: "Invalid API Token"

**Síntoma**: Error 403 al llamar a la API de Cloudflare.

**Solución**:
```bash
# Verificar que el token tenga los permisos correctos
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
  -H "Authorization: Bearer <API_TOKEN_VALUE>"

# Debe responder con "status": "active"
# Si no, regenerá el token en Cloudflare Dashboard
```

### Error: "Zone not found"

**Síntoma**: Error 404 al intentar listar/modificar registros DNS.

**Solución**:
```bash
# Verificar que el Zone ID sea correcto
curl -X GET "https://api.cloudflare.com/client/v4/zones?name=smarterbot.cl" \
  -H "Authorization: Bearer <API_TOKEN_VALUE>" | jq -r '.result[0].id'

# Actualizar en Vault si es diferente
vault kv patch smarteros/mcp/cloudflare zone_id="nuevo_zone_id"
```

### Error: "Permission denied" en Vault

**Síntoma**: No podés leer `smarteros/mcp/cloudflare`.

**Solución**:
```bash
# Verificar que tu token tenga la policy correcta
vault token lookup

# Debe incluir: mcp-cloudflare-dns-read o agent-codex-mcp-access
# Si no, regenerá el token con la policy correcta
```

### MCP Inspector no conecta

**Síntoma**: Timeout al conectar con `https://dns-analytics.mcp.cloudflare.com/mcp`.

**Solución**:
```bash
# Verificar que el endpoint esté up
curl -I https://dns-analytics.mcp.cloudflare.com/mcp

# Debe responder 200 o 405 (Method Not Allowed está ok, significa que está up)
# Si no responde, el servidor puede estar caído (reportar a Cloudflare)
```

---

## 📚 Referencias

| Documento | Path | Descripción |
|-----------|------|-------------|
| **Spec Cloudflare MCP** | `smarteros-specs/mcp/cloudflare-dns.yml` | Configuración completa del MCP de Cloudflare DNS |
| **Vault Policy** | `smarteros-specs/vault/policies/mcp-cloudflare-dns-read.hcl` | Política de acceso para leer credenciales |
| **Agent Access Matrix** | `smarteros-specs/vault/policies/README.md:25-70` | Qué agente accede a qué MCP |
| **Cloudflare API Docs** | https://developers.cloudflare.com/api/ | Documentación oficial de la API de Cloudflare |
| **MCP Server Repo** | https://github.com/cloudflare/mcp-server-cloudflare | Código fuente del servidor MCP |

---

## 🎯 Próximos Pasos

1. ✅ **Obtener API Token de Cloudflare** (Paso 1)
2. ✅ **Obtener Zone ID de smarterbot.cl** (Paso 2)
3. ✅ **Guardar en Vault** (Paso 3)
4. ✅ **Aplicar Vault Policy** (Paso 4)
5. ✅ **Configurar Token de Codex** (Paso 5)
6. 🔄 **Probar MCP Server** (Paso 6)
7. 🔄 **Integrar en fulldaygo.smarterbot.cl** con el helper de lib/cloudflare-mcp.ts
8. 🚀 **Deploy** y verificar que podés crear/listar/actualizar DNS records

---

**¿Necesitás crear otros subdominios?** Usá los ejemplos del paso 🚀 Casos de Uso o pedile al agente Codex que lo haga automáticamente. 🌐✨
