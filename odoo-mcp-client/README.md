# SmarterOS MCP Client (Odoo addon)

Add-on liviano: empaqueta eventos y los envía a la API unificada (`fastapi-mcp-router`). No procesa negocio, no sincroniza directo.

## Configuración
En Ajustes > Parámetros del sistema:
- `smarteros_api_base` = `https://api.smarterbot.cl`
- `smarteros_mcp_token` = token emitido por FastAPI/Clerk

## Uso
```python
client = env['smarteros.mcp.client']
client.emit_lead(email='demo@acme.com', name='Demo', tenant_rut='76.123.456-7')
```

## Nota
La lógica se mantiene en FastAPI/MCP; Odoo solo envía/recibe.
