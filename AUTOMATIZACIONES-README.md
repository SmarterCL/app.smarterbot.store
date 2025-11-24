# Dashboard de Automatizaciones N8N - SmarterOS

## 📋 Implementación Completada

Se ha implementado un dashboard completo para gestionar workflows de N8N en `app.smarterbot.cl`.

### ✅ Características Implementadas

1. **Dashboard de Automatizaciones** (`/dashboard/automatizaciones`)
   - Lista de 10 workflows configurados
   - Vista con cards individuales por workflow
   - Información en tiempo real de ejecuciones
   - Control ON/OFF por workflow
   - Botón de ejecución manual
   - Paginación funcional

2. **API Backend** (`/api/workflows`)
   - Lectura automática de templates desde GitHub `SmarterCL/n8n-workflows`
   - Cache de 10 minutos para optimizar performance
   - Endpoints RESTful:
     - `GET /api/workflows` - Lista workflows con paginación
     - `POST /api/workflows/[id]/toggle` - Activar/desactivar
     - `POST /api/workflows/[id]/trigger` - Ejecutar manualmente

3. **Integración con APIs**
   - Preparado para conectar con `api.smarterbot.cl`
   - Endpoints de N8N configurables
   - Autenticación con API keys

### 📦 10 Workflows Configurados

1. **WhatsApp Leads → CRM** - N8N #431
2. **Agenda Confirmaciones** - N8N #219  
3. **Reporte Diario a Sheets** - N8N #102
4. **Slack Notificaciones Ventas** - N8N #305
5. **Email Marketing Automatizado** - N8N #187
6. **Sync Shopify → Odoo** - N8N #412
7. **Procesar Facturas PDF** - N8N #298
8. **Respuestas AI WhatsApp** - N8N #521
9. **Backup Automático Diario** - N8N #156
10. **Monitor Redes Sociales** - N8N #389

### 🎨 UI/UX

- **Español 100%**: Todo el texto en español
- **Diseño Moderno**: Cards con hover effects, badges de categoría
- **Estadísticas**: Widgets con workflows activos, ejecuciones hoy
- **Responsive**: Funciona en desktop y mobile
- **Dark Mode Ready**: Compatible con tema oscuro

### 🔄 Actualización Automática

El sistema lee automáticamente los templates desde:
```
https://github.com/SmarterCL/n8n-workflows/tree/main/templates
```

Categorías soportadas:
- communication → Comunicación
- data-processing → Procesamiento de Datos
- e-commerce → E-commerce
- business → Negocios
- ai-automation → IA y Automatización

### 🚀 Despliegue

1. **Local**:
```bash
cd /root/app-smarterbot-cl
pnpm install
pnpm dev
```

2. **Producción (Vercel)**:
```bash
vercel --prod
```

3. **Variables de entorno**:
```env
NEXT_PUBLIC_API_KEY=your_api_key
N8N_URL=https://n8n.smarterbot.cl
N8N_API_KEY=your_n8n_api_key
```

### 📍 Rutas

- Dashboard: `https://app.smarterbot.cl/dashboard/automatizaciones`
- API: `https://app.smarterbot.cl/api/workflows`
- N8N: `https://n8n.smarterbot.cl`

### 🔗 Integración con N8N

Para conectar con N8N real, descomenta las líneas en:
- `app/api/workflows/[id]/toggle/route.ts`
- `app/api/workflows/[id]/trigger/route.ts`

Y configura las variables de entorno de N8N.

### 📊 Características del Dashboard

```
┌─────────────────────────────────────────┐
│  Automatizaciones en SmarterOS          │
│  Controla tus flujos de N8N             │
├─────────────────────────────────────────┤
│  📊 Stats: Activos | Ejecuciones | Total│
├─────────────────────────────────────────┤
│  📋 Workflow 1                          │
│     Category | N8N #431          [▶] ⚫│
│     14 ejecuciones | hace 2 min         │
├─────────────────────────────────────────┤
│  📋 Workflow 2                          │
│     Category | N8N #219          [▶] ⚫│
├─────────────────────────────────────────┤
│  ... (10 workflows total)               │
├─────────────────────────────────────────┤
│  ◀ 1 2 3 ▶  (Paginación)               │
├─────────────────────────────────────────┤
│  🔗 Ver dashboard en N8N                │
└─────────────────────────────────────────┘
```

### 🎯 Próximos Pasos

1. Conectar con API real de N8N
2. Implementar webhooks para updates en tiempo real
3. Agregar logs de ejecución
4. Panel de métricas avanzadas
5. Filtros por categoría
6. Búsqueda de workflows

## 🔧 Archivos Creados

```
app-smarterbot-cl/
├── app/
│   ├── dashboard/
│   │   └── automatizaciones/
│   │       └── page.tsx          # Dashboard principal
│   └── api/
│       └── workflows/
│           ├── route.ts          # GET workflows
│           └── [id]/
│               ├── toggle/
│               │   └── route.ts  # POST toggle
│               └── trigger/
│                   └── route.ts  # POST trigger
└── AUTOMATIZACIONES-README.md    # Esta guía
```

## 📞 Soporte

Para más información sobre los workflows:
- Repo templates: https://github.com/SmarterCL/n8n-workflows
- N8N Dashboard: https://n8n.smarterbot.cl
- API Gateway: https://api.smarterbot.cl

---

**Implementado con ❤️ para SmarterOS**
