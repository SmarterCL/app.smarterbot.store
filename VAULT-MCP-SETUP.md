# 🔐 Vault + MCP Setup para fulldaygo.smarterbot.cl

Guía paso a paso para configurar Vault y el servidor MCP en tu proyecto **fulldaygo.smarterbot.cl**.

---

## 📋 Prerrequisitos

1. **Acceso a Vault** en `https://vault.smarterbot.cl` con token de admin
2. **CLI de Vault** instalado localmente ([docs](https://developer.hashicorp.com/vault/install))
3. **Token de Clerk** y **Supabase** ya configurados (ver `.env.example`)

---

## 🚀 Flujo de Setup

### 1️⃣ Configurar Entorno Local de Vault

```bash
# Exportar endpoint de Vault
export VAULT_ADDR=https://vault.smarterbot.cl

# Autenticarte con tu token de admin (obtener de Vault UI o admin)
export VAULT_TOKEN=hvs.CAESIxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Verificar conexión
vault status
```

### 2️⃣ Crear Token de API para SmarterMCP

El servidor MCP (`mcp.smarterbot.cl`) necesita un token de API. Créalo así:

```bash
# Generar token desde el endpoint de autenticación del MCP
curl -X POST https://mcp.smarterbot.cl/auth/token \
  -H "Authorization: Bearer $VAULT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "fulldaygo-app",
    "scopes": [
      "read:services",
      "read:workflows",
      "read:infra",
      "read:analytics"
    ]
  }' | jq -r '.token'

# Guardá el resultado, algo como: smcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Scopes explicados** (ver `mcp/smartermcp.yml:80-130`):
- `read:services` → Acceso a servicios (Clerk, Supabase, etc.)
- `read:workflows` → Ver workflows de n8n/automatizaciones
- `read:infra` → Estado de infraestructura (containers, deployments)
- `read:analytics` → Métricas y dashboards

### 3️⃣ Guardar Credenciales en Vault

Una vez generado el token del MCP, guardalo en Vault:

```bash
# Crear el secret en Vault bajo smarteros/mcp/smartermcp
vault kv put smarteros/mcp/smartermcp \
  api_token="smcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  tenant_id="fulldaygo" \
  endpoint="https://mcp.smarterbot.cl"

# Verificar que se guardó
vault kv get smarteros/mcp/smartermcp
```

**Path explicado**:
- `smarteros/` → Namespace raíz (ver `vault/policies/README.md:15`)
- `mcp/` → Subcarpeta de credenciales de MCP providers
- `smartermcp` → Provider específico (nuestro servidor central)

### 4️⃣ Aplicar Política de Acceso

Para que tu app pueda **leer** (no escribir) ese secret, aplicá la policy:

```bash
# Aplicar policy desde el repo de specs
cd ~/dev/2025/smarteros-specs

vault policy write mcp-smartermcp-read \
  vault/policies/mcp-smartermcp-read.hcl

# Verificar que se creó
vault policy read mcp-smartermcp-read
```

**Qué hace esta policy** (`vault/policies/mcp-smartermcp-read.hcl`):
```hcl
path "smarteros/data/mcp/smartermcp" {
  capabilities = ["read"]
}
path "smarteros/metadata/mcp/smartermcp" {
  capabilities = ["read", "list"]
}
```

Permite **solo lectura** del secret, sin permisos de escritura/borrado.

### 5️⃣ Crear Token de Vault para tu App

Ahora generá un token con esa policy para usarlo en tu app:

```bash
# Crear token con política mcp-smartermcp-read
vault token create \
  -policy=mcp-smartermcp-read \
  -display-name="fulldaygo-app-token" \
  -renewable=true \
  -ttl=720h

# Salida:
# Key                  Value
# ---                  -----
# token                hvs.CAESIxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
# token_duration       720h
# ...
```

**Guardá ese token** (`hvs.CAESIxxx...`) — lo vas a usar en Vercel.

### 6️⃣ Configurar Variables de Entorno en Vercel

En [Vercel Dashboard](https://vercel.com) → tu proyecto → **Settings** → **Environment Variables**, agregá:

| Variable | Value | Environments |
|----------|-------|--------------|
| `VAULT_ADDR` | `https://vault.smarterbot.cl` | Production, Preview |
| `VAULT_TOKEN` | `hvs.CAESIxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Production, Preview |
| `VAULT_NAMESPACE` | `smarteros` | Production, Preview |
| `SMARTERMCP_ENDPOINT` | `https://mcp.smarterbot.cl` | Production, Preview |
| `SMARTERMCP_API_TOKEN` | `smcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Production, Preview |
| `SMARTERMCP_TENANT_ID` | `fulldaygo` | Production, Preview |

> **Nota**: Para `SMARTERMCP_API_TOKEN`, también podés dejarlo vacío y leerlo desde Vault en runtime usando el `VAULT_TOKEN`. Depende de tu arquitectura.

### 7️⃣ Redeploy

```bash
# En tu proyecto local
git add .env.example VAULT-MCP-SETUP.md
git commit -m "docs: add vault + mcp setup guide"
git push origin main

# Vercel redeploya automáticamente
```

---

## 🧪 Validar la Configuración

### Leer desde Vault (localmente)

```bash
export VAULT_ADDR=https://vault.smarterbot.cl
export VAULT_TOKEN=hvs.CAESIxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Leer el secret de SmarterMCP
vault kv get -format=json smarteros/mcp/smartermcp | jq '.data.data'

# Salida esperada:
# {
#   "api_token": "smcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
#   "endpoint": "https://mcp.smarterbot.cl",
#   "tenant_id": "fulldaygo"
# }
```

### Probar el MCP Server

```bash
# Listar herramientas disponibles (sin autenticación)
curl https://mcp.smarterbot.cl/tools

# Autenticar y listar servicios (con tu token)
curl https://mcp.smarterbot.cl/api/services \
  -H "Authorization: Bearer smcp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" \
  -H "X-Tenant-ID: fulldaygo"
```

---

## 🔄 Actualizar el Código de la App (opcional)

Si querés que tu app **lea desde Vault en runtime**, creá un helper:

```typescript
// app/lib/vault-client.ts

import { createClient } from '@hashicorp/vault-client'

const vaultClient = createClient({
  endpoint: process.env.VAULT_ADDR || 'https://vault.smarterbot.cl',
  token: process.env.VAULT_TOKEN,
  namespace: process.env.VAULT_NAMESPACE || 'smarteros',
})

export async function getSmartermcpCredentials() {
  const { data } = await vaultClient.kv2.read('mcp/smartermcp')
  return {
    apiToken: data.api_token,
    endpoint: data.endpoint,
    tenantId: data.tenant_id,
  }
}
```

Luego en `app/api/azure/verify/route.ts:331` (donde ya tenés `saveToVault`), podés reemplazar el `fetch` manual por este helper.

---

## 📚 Referencias

| Documento | Path | Líneas clave |
|-----------|------|--------------|
| **Spec MCP Central** | `smarteros-specs/mcp/smartermcp.yml` | 1-150 (setup, scopes) |
| **Policies Vault** | `smarteros-specs/vault/policies/README.md` | 1-160 (roles, acceso) |
| **Policy SmarterMCP** | `smarteros-specs/vault/policies/mcp-smartermcp-read.hcl` | 1-10 (permisos lectura) |
| **Tenant Setup** | `smarteros-specs/TENANT-SETUP.md` | (si existe, provisioning completo) |
| **Deployment Guide** | `smarteros-specs/DEPLOYMENT-GUIDE.md` | (si existe, deploy end-to-end) |

---

## 🎯 Próximos Pasos

1. ✅ **Aplicar las env vars en Vercel** (paso 6)
2. ✅ **Redeploy** y verificar que Clerk funciona
3. 🔄 **Integrar Vault client** en `/api/azure/verify/route.ts` (opcional)
4. 🚀 **Configurar otros MCPs** (GitHub, Supabase, etc.) siguiendo el mismo patrón:
   - Ver `vault/policies/mcp-github-read.hcl`, `mcp-supabase-read.hcl`, etc.
   - Aplicar policies con `scripts/apply-vault-policies.sh`

---

## 🆘 Troubleshooting

### "VAULT_TOKEN no configurado"

```bash
# Verificá que la variable esté en Vercel
echo $VAULT_TOKEN  # (localmente)

# En Vercel: Settings → Env Vars → debe aparecer VAULT_TOKEN
```

### "Permission denied" al leer secret

```bash
# Verificá que tu token tenga la policy correcta
vault token lookup

# Debe mostrar:
# policies    [default mcp-smartermcp-read]
```

### "MCP server not responding"

```bash
# Verificá que el servidor esté up
curl https://mcp.smarterbot.cl/health

# Si responde 200, está ok
# Si timeout, revisar compose/mcp.smarterbot.cl.yml o DNS
```

---

**¿Dudas?** Revisá `smarteros-specs/vault/policies/README.md:1-160` o contactá al equipo en Slack (#infra-vault). 🚀
