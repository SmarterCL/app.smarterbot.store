# SmarterOS - Entrega MCP unificada (FastAPI + Odoo cliente + n8n)

## Frase definitiva
“Odoo actúa como cliente limpio que solo envía/recibe. FastAPI es la capa inteligente: autentica, enruta, decide y coordina. n8n es un agente secundario que consume la misma API. Los MCP contienen la lógica funcional desacoplada, versionada y modular. Todo es multi-tenant por RUT, conectado vía Clerk y Supabase. Arquitectura estable, escalable y reiniciable desde Docker.”

## Assets creados
- `fastapi-mcp-router/` – FastAPI (auth + dispatcher MCP + tests)
- `odoo-mcp-client/` – Add-on liviano para Odoo 16
- `mcp-modules/` – Skeleton de módulos de negocio desacoplados
- `docker-compose.mcp.yml` – Stack local (API, Postgres, Redis, n8n, Odoo)
- `n8n-client/` – Workflow universal HTTP hacia `/mcp/route`

## Flujo lógico
1) Cliente (Odoo/n8n/Shopify) → `POST /mcp/route` (FastAPI)
2) FastAPI valida token Clerk/Supabase + plan/tenant.
3) Dispatcher envía a módulo MCP (leads/invoices/payments/inventory).
4) Opcional: notifica n8n/webhooks.
5) Respuesta estándar `{ ok, result, meta }` de vuelta al cliente.

## Cómo levantar local
```bash
# API + n8n + Odoo
CLERK_JWKS_URL=... SUPABASE_URL=... SUPABASE_ANON_KEY=... docker compose -f docker-compose.mcp.yml up --build

# Solo API
cd fastapi-mcp-router
uvicorn router.main:app --reload
```

## Configuración Odoo
- `smarteros_api_base` = `https://api.smarterbot.cl`
- `smarteros_mcp_token` = token emitido por FastAPI/Clerk

## DNS Clerk (verificado)
- `clerk.smarterbot.store` → `frontend-api.clerk.services`
- `accounts.smarterbot.store` → `accounts.clerk.services`
- `clkmail.smarterbot.store` → `mail.jv126dtc2nl8.clerk.services`
- `clk._domainkey` → `dkim1.jv126dtc2nl8.clerk.services`
- `clk2._domainkey` → `dkim2.jv126dtc2nl8.clerk.services`

## Próximos pasos sugeridos
- Conectar Supabase real en `auth.py` y RLS por tenant.
- Exponer MCP modules como paquete instalable y colas para ejecución async.
- Añadir rate limiting y logging estructurado en FastAPI (Redis/PG).
- Publicar token issuance en FastAPI (Clerk → JWT service token).
