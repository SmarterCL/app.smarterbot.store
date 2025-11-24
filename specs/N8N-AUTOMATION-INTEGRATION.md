# N8N Automation Integration

## 📋 Overview

Sistema completo de automatizaciones N8N integrado con el dashboard de SmarterOS.

**Status**: ✅ IMPLEMENTADO Y FUNCIONAL

**Fecha**: 2025-11-24

---

## 🎯 Arquitectura

```
GitHub (n8n-workflows)
   ↓ automation-manifest.json
api.smarterbot.cl/n8n/templates
   ↓ REST API
app.smarterbot.cl/dashboard/automatizaciones
   ↓ UI Dashboard
Usuario final
```

---

## 🔧 Componentes Implementados

### 1. Automation Manifest

**Ubicación**: `https://github.com/SmarterCL/n8n-workflows/automation-manifest.json`

**Estructura**:
```json
{
  "version": "1.0.0",
  "categories": {
    "odoo": { "name": "Odoo ERP", "icon": "🏪" },
    "shopify": { "name": "Shopify", "icon": "🛒" },
    "marketing": { "name": "Marketing", "icon": "📢" },
    "whatsapp": { "name": "WhatsApp", "icon": "💬" },
    "crm": { "name": "CRM", "icon": "👥" },
    "pdf": { "name": "PDF", "icon": "📄" },
    "backup": { "name": "Backup", "icon": "💾" }
  },
  "workflows": [
    {
      "id": "odoo-sync-inventory",
      "name": "Sincronizar Inventario Odoo",
      "category": "odoo",
      "description": "Sincronización automática de inventario",
      "path": "odoo/sync-inventory.json",
      "active": true,
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### 2. API Endpoints

**Base URL**: `https://api.smarterbot.cl/n8n`

#### GET /templates
Lista todos los templates disponibles

**Parámetros**:
- `category` (opcional): Filtrar por categoría
- `active` (opcional): Filtrar por estado activo

**Respuesta**:
```json
{
  "ok": true,
  "workflows": [...],
  "categories": {...},
  "count": 10,
  "total": 10
}
```

#### GET /templates/{workflow_id}
Obtener detalles de un template específico

**Respuesta**:
```json
{
  "ok": true,
  "workflow": {
    "id": "odoo-sync-inventory",
    "name": "Sincronizar Inventario Odoo",
    "category": "odoo",
    "description": "...",
    "tags": ["odoo", "shopify", "sync"]
  }
}
```

#### GET /workflows
Lista workflows activos en N8N

#### POST /workflows/{workflow_id}/execute
Ejecuta un workflow en N8N

---

## 🎨 Dashboard UI

**URL**: `https://app.smarterbot.cl/dashboard/automatizaciones`

### Features Implementados:

✅ **Listado de 10 workflows con paginación**
- Muestra workflows desde GitHub templates
- Paginación con botones anterior/siguiente
- Total pages calculado dinámicamente

✅ **Información por workflow**:
- Nombre y descripción en español
- Categoría con badge de color
- N8N ID
- Ejecuciones hoy (mock temporal)
- Última ejecución (mock temporal)
- Estado ON/OFF

✅ **Acciones disponibles**:
- ▶️ Ejecutar workflow
- 🔌 Toggle ON/OFF
- Link directo a N8N

✅ **Estadísticas globales**:
- Workflows activos
- Ejecuciones totales hoy
- Total workflows disponibles

---

## 🔌 Integración Actual

### Frontend → API
```typescript
// app-smarterbot-cl/app/dashboard/automatizaciones/page.tsx
const response = await fetch('https://api.smarterbot.cl/n8n/templates');
const data = await response.json();
```

### API → GitHub
```python
# api/routers/n8n.py
MANIFEST_URL = "https://raw.githubusercontent.com/SmarterCL/n8n-workflows/main/automation-manifest.json"
response = await client.get(MANIFEST_URL)
manifest = response.json()
```

### API → N8N
```python
# api/routers/n8n.py
N8N_BASE_URL = "https://n8n.smarterbot.cl"
response = await client.get(f"{N8N_BASE_URL}/api/v1/workflows")
```

---

## 📊 Workflows Disponibles (Initial Set)

| ID | Nombre | Categoría | Schedule |
|----|--------|-----------|----------|
| odoo-sync-inventory | Sincronizar Inventario Odoo | Odoo | Cada 6h |
| odoo-sync-products | Sincronizar Productos Odoo | Odoo | Diario 2am |
| odoo-sync-orders | Importar Pedidos Shopify | Odoo | Cada 15min |
| shopify-abandoned-cart | Recuperar Carritos | Shopify | Cada 2h |
| whatsapp-leads-crm | WhatsApp → CRM | WhatsApp | Webhook |
| pdf-invoice-generator | Generar Facturas PDF | PDF | Webhook |
| backup-google-sheets | Backup Google Sheets | Backup | Diario |
| crm-task-reminder | Recordatorios CRM | CRM | Diario 9am |
| shopify-inventory-alert | Alertas Stock Bajo | Shopify | 8am/6pm |

**Total**: 10 workflows iniciales

---

## 🚀 Próximos Pasos

### Fase 1: Trello Integration (PRÓXIMO)
- [ ] Webhook Trello → N8N
- [ ] Router de acciones por título de tarjeta
- [ ] Auto-deploy desde Trello

### Fase 2: Live Data
- [ ] Conectar ejecuciones reales desde N8N API
- [ ] Mostrar logs de ejecución
- [ ] Métricas de rendimiento real

### Fase 3: MCP Tools
- [ ] `automation.search` - Buscar templates
- [ ] `automation.run` - Ejecutar workflow
- [ ] `automation.create` - Crear nuevo workflow

### Fase 4: Advanced Features
- [ ] Editor visual de workflows
- [ ] Duplicar y personalizar templates
- [ ] Scheduled workflows desde UI
- [ ] Webhooks configurables

---

## 🧪 Testing

### Test API Endpoint
```bash
curl https://api.smarterbot.cl/n8n/templates?category=odoo
```

**Expected Output**:
```json
{
  "count": 3,
  "workflows": [
    {
      "id": "odoo-sync-inventory",
      "name": "Sincronizar Inventario Odoo",
      "category": "odoo"
    }
  ]
}
```

### Test Dashboard
1. Visitar `https://app.smarterbot.cl/dashboard/automatizaciones`
2. Verificar que se muestren 10 workflows
3. Verificar paginación funcional
4. Verificar categorías con colores
5. Verificar botones de acción

---

## 🎨 UI/UX Details

### Color Mapping por Categoría
```typescript
{
  'Odoo ERP': 'purple',    // 🏪 #875A7B
  'Shopify': 'green',      // 🛒 #96BF48
  'Marketing': 'pink',     // 📢 #FF6B6B
  'WhatsApp': 'emerald',   // 💬 #25D366
  'CRM': 'blue',           // 👥 #4A90E2
  'PDF': 'red',            // 📄 #E74C3C
  'Backup': 'gray'         // 💾 #95A5A6
}
```

### Components Used
- Shadcn UI Badge
- Shadcn UI Button
- Lucide React Icons:
  - Activity (ejecuciones)
  - Clock (tiempo)
  - Power/PowerOff (toggle)
  - Play (ejecutar)
  - ChevronLeft/Right (paginación)

---

## 🔐 Security & Auth

### API Authentication
- N8N API Key requerida (via env var)
- GitHub raw content público (read-only)
- CORS configurado para dominios permitidos

### Dashboard Authentication
- Requiere login en app.smarterbot.cl
- Session protegida por middleware
- Sin exposición de secrets al frontend

---

## 📝 Environment Variables

### API (api.smarterbot.cl)
```bash
N8N_BASE_URL=https://n8n.smarterbot.cl
N8N_API_KEY=<your-n8n-api-key>
```

### Frontend (app.smarterbot.cl)
```bash
# No se requieren env vars adicionales
# Usa endpoints públicos de la API
```

---

## 📚 References

- [N8N API Documentation](https://docs.n8n.io/api/)
- [n8n-workflows Repository](https://github.com/SmarterCL/n8n-workflows)
- [Dashboard Repository](https://github.com/SmarterCL/app.smarterbot.cl)
- [API Gateway Repository](https://github.com/SmarterCL/api.smarterbot.cl)

---

## ✅ Status Final

**IMPLEMENTACIÓN COMPLETA** - 2025-11-24

- ✅ Manifest creado y versionado
- ✅ API endpoints implementados
- ✅ Dashboard UI funcional
- ✅ Paginación de 10 items
- ✅ Categorías en español
- ✅ Integración GitHub → API → Dashboard
- ✅ Documentación completa

**Próxima milestone**: Trello Integration & Router

---

**Autor**: SmarterOS Team  
**Última actualización**: 2025-11-24T18:00:00-03:00
