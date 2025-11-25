# MCP Modules (SmarterOS)

Lógica funcional desacoplada, versionable y reiniciable. Cada dominio es un micro-módulo con entrada/salida contractuales. Consumidos por `fastapi-mcp-router`.

## Convenciones
- Input: `{ "type": string, "data": object, "meta": object }`
- Output: `{ "ok": bool, "result": object, "meta": object }`
- Sin efectos laterales directos: delegar IO a gateways (DB, Odoo, n8n, WhatsApp) vía puertos.
- Versionado independiente por carpeta.

## Estructura
```
leads/
  src/handler.py      # create/update
invoices/
  src/handler.py      # issue, cancel
inventory/
  src/handler.py      # sync stock
payments/
  src/handler.py      # check status
shared/
  __init__.py         # tipos comunes, helpers de logging
```

## Ejemplo (leads)
```python
from dataclasses import dataclass
from typing import Dict, Any

@dataclass
class LeadRequest:
    email: str
    name: str

async def create(data: Dict[str, Any], meta: Dict[str, Any]):
    if not data.get("email"):
        return {"ok": False, "error": "missing_email"}
    # Lógica pura: validar, enriquecer, decidir rutas posteriores
    return {"ok": True, "result": {"id": "lead-123", "status": "created"}, "meta": meta}
```

## Cómo usar desde FastAPI
```python
from mcp_modules.leads.src import handler as leads
result = await leads.create(req.data, req.meta)
```

## Objetivo
Separar la lógica de negocio para poder reiniciar/desplegar sin afectar Odoo/n8n y mantener control de versiones por dominio.
