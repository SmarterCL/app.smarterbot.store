# n8n universal client (SmarterOS)

HTTP Request node que consume la misma API que Odoo/FastAPI expone: `/mcp/route`.

## Uso rápido
1. Importa `workflow-mcp-client.json` en n8n.
2. Define credencial HTTP Header con `Authorization: Bearer <token>`.
3. Envía eventos con `{ "type": "lead.create", "data": {...}, "meta": {"source": "n8n", "tenant_rut": "76.123.456-7"} }`.

## Ventajas
- n8n no contiene lógica; solo emite eventos.
- Versionable como cualquier workflow.
- Usa la misma API que Odoo/Shopify.
