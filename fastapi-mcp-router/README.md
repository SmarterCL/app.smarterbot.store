# fastapi-mcp-router

Capa de orquestación para SmarterOS. FastAPI valida tenant (Clerk/Supabase), enruta eventos a módulos MCP y orquesta agentes externos (n8n, Odoo, Shopify, WhatsApp, Botpress) sin que los clientes manejen lógica de negocio.

## Principios
- **API madre**: toda integración pasa por `/mcp/route`.
- **Multi-tenant por RUT**: resolución de tenant y plan antes de procesar.
- **MCP modules**: lógica desacoplada, versionable, reiniciable.
- **Clientes livianos**: Odoo/n8n/Shopify solo publican eventos; no deciden.

## Estructura
```
src/router/
  main.py            # App FastAPI, health, MCP route
  auth.py            # Clerk token validation + tenant lookup (Supabase)
  deps.py            # Dependencias comunes (tenant, plan)
  models.py          # Pydantic schemas
  router.py          # Dispatcher a MCP modules
  mcp/
    __init__.py
    leads.py         # Ejemplo de módulo de negocio
    invoices.py      # Ejemplo
    payments.py      # Ejemplo
    inventory.py     # Ejemplo
```

## Variables de entorno
- `CLERK_JWKS_URL` – JWKS de Clerk
- `SUPABASE_URL`, `SUPABASE_ANON_KEY` – lookup de tenant/plan
- `MCP_BACKEND_URL` – base para invocar MCP modules (si corren fuera del proceso)
- `N8N_WEBHOOK_URL` (opcional) – notificación a n8n cuando corresponda

## Uso rápido
```
uvicorn router.main:app --reload
```

### Endpoint principal
`POST /mcp/route`
```json
{
  "type": "lead.create",
  "data": {"email": "demo@acme.com"},
  "meta": {"source": "odoo", "tenant_rut": "76.123.456-7"}
}
```

Respuesta estándar:
```json
{
  "ok": true,
  "result": {"id": "lead_123", "status": "created"},
  "meta": {"handled_by": "mcp.leads.create", "tenant": "76.123.456-7"}
}
```

## Tests
```
pytest
```

## Notas
- El dispatcher es extensible via `Router.actions`.
- El acceso a Supabase está mockeado para desarrollo rápido; reemplaza con cliente real en producción.
- Incluye ejemplo de integración n8n (HTTP POST) opcional.
