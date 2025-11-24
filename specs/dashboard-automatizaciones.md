# Dashboard de Automatizaciones N8N - Especificaciones Técnicas

## 📋 Overview

Dashboard interactivo para gestionar workflows de N8N desde la interfaz web de SmarterOS.

## 🎯 Objetivos

1. Visualizar workflows de N8N en interfaz amigable
2. Controlar activación/desactivación de workflows
3. Ejecutar workflows manualmente
4. Monitorear estadísticas en tiempo real
5. Lectura dinámica de templates desde GitHub

## 🏗️ Arquitectura

### Frontend (`/dashboard/automatizaciones`)

```
┌─────────────────────────────────────────────┐
│         Dashboard Component (React)         │
├─────────────────────────────────────────────┤
│  • Estado: workflows, loading, pagination   │
│  • Effects: loadWorkflows() on mount        │
│  • Handlers: toggle, trigger, paginate      │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│          Internal API Routes                │
├─────────────────────────────────────────────┤
│  GET  /api/workflows?page=1&limit=10        │
│  POST /api/workflows/:id/toggle             │
│  POST /api/workflows/:id/trigger            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│         GitHub Templates Repository         │
│     SmarterCL/n8n-workflows/templates       │
└─────────────────────────────────────────────┘
```

### Backend API

#### Endpoints

**1. GET /api/workflows**
```typescript
Query Parameters:
  - page: number (default: 1)
  - limit: number (default: 10)

Response:
{
  workflows: Workflow[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
```

**2. POST /api/workflows/:id/toggle**
```typescript
Body:
{
  status: 'active' | 'inactive'
}

Response:
{
  success: boolean,
  id: string,
  status: string
}
```

**3. POST /api/workflows/:id/trigger**
```typescript
Response:
{
  success: boolean,
  id: string,
  message: string
}
```

## 📊 Data Models

### Workflow Interface
```typescript
interface Workflow {
  id: string;                    // Unique identifier
  name: string;                  // Display name
  description: string;           // Short description
  category: string;              // Category (Spanish)
  executions_today: number;      // Today's execution count
  last_execution: string;        // Human-readable time
  status: 'active' | 'inactive'; // Current status
  n8n_id?: number;              // N8N workflow ID
  file_path?: string;           // GitHub path
}
```

### WorkflowTemplate Interface
```typescript
interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  file_path: string;
}
```

## 🎨 UI Components

### Stats Cards
```tsx
<Card>
  <CardContent>
    <div>Workflows Activos: {count}</div>
    <Activity icon />
  </CardContent>
</Card>
```

### Workflow Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>{name}</CardTitle>
    <Badge>{category}</Badge>
    <Badge>N8N #{id}</Badge>
    
    <CardDescription>{description}</CardDescription>
    
    <div>
      <Activity /> {executions_today} ejecuciones
      <Clock /> Último: {last_execution}
    </div>
    
    <Button icon={Play} onClick={trigger} />
    <Switch checked={active} onChange={toggle} />
  </CardHeader>
</Card>
```

### Pagination
```tsx
<div>
  <Button icon={ChevronLeft} disabled={page === 1} />
  {pages.map(p => <Button active={p === current}>{p}</Button>)}
  <Button icon={ChevronRight} disabled={page === total} />
</div>
```

## 🔄 Data Flow

### Initial Load
```
1. Component mounts
2. useEffect() triggers loadWorkflows()
3. Fetch /api/workflows?page=1&limit=10
4. API fetches from GitHub (with cache)
5. Parse templates to workflows
6. Add mock execution data
7. Return paginated results
8. Update component state
9. Render UI
```

### Toggle Workflow
```
1. User clicks switch
2. Call toggleWorkflow(id, currentStatus)
3. POST /api/workflows/:id/toggle
4. Update local state optimistically
5. (Optional) Call N8N API
6. Return success
```

### Trigger Workflow
```
1. User clicks play button
2. Call triggerWorkflow(id)
3. POST /api/workflows/:id/trigger
4. (Optional) Call N8N API
5. Reload workflows
6. Show updated stats
```

## 💾 Cache Strategy

### Template Cache
```typescript
{
  data: WorkflowTemplate[] | null,
  timestamp: number
}

CACHE_DURATION = 10 * 60 * 1000 // 10 minutes
```

### Validation
```typescript
if (cache.data && Date.now() - cache.timestamp < CACHE_DURATION) {
  return cache.data;
}
```

## 🌐 GitHub Integration

### Repository Structure
```
SmarterCL/n8n-workflows/
└── templates/
    ├── communication/
    │   ├── whatsapp-leads.json
    │   └── email-marketing.json
    ├── data-processing/
    │   └── daily-reports.json
    └── e-commerce/
        └── shopify-sync.json
```

### Fetch Process
```typescript
1. GET github.com/repos/SmarterCL/n8n-workflows/contents/templates
2. Parse directories (categories)
3. For each directory:
   - GET directory contents
   - Filter .json files
   - Fetch file content (optional)
   - Extract metadata
4. Map to WorkflowTemplate[]
5. Cache results
```

### Category Mapping
```typescript
const categoryMap = {
  'communication': 'Comunicación',
  'data-processing': 'Procesamiento de Datos',
  'e-commerce': 'E-commerce',
  'business': 'Negocios',
  'ai-automation': 'IA y Automatización'
}
```

## 🎨 Styling

### Color Scheme
```typescript
const categoryColors = {
  'Comunicación': 'bg-blue-500/10 text-blue-500',
  'Calendario': 'bg-green-500/10 text-green-500',
  'Reportes': 'bg-purple-500/10 text-purple-500',
  'E-commerce': 'bg-orange-500/10 text-orange-500',
  'Marketing': 'bg-pink-500/10 text-pink-500',
  'Automatización': 'bg-cyan-500/10 text-cyan-500',
  'IA': 'bg-violet-500/10 text-violet-500',
  'Mantenimiento': 'bg-gray-500/10 text-gray-500',
}
```

## 🔐 Security

### API Authentication
```typescript
// Internal API (Next.js API Routes)
// No authentication needed (server-side only)

// N8N API (future)
headers: {
  'X-N8N-API-KEY': process.env.N8N_API_KEY
}
```

### GitHub API
```typescript
// Public repository (read-only)
// Optional token for rate limit increase
headers: {
  'Authorization': `token ${process.env.GITHUB_TOKEN}` // Optional
}
```

## 📈 Performance

### Metrics
- Initial load: < 2s
- Cache hit: < 100ms
- Page navigation: < 500ms
- API response: < 1s

### Optimizations
1. Template cache (10 min)
2. Pagination (10 items/page)
3. Lazy loading images
4. Memoized components
5. Optimistic updates

## 🧪 Testing

### Manual Tests
```bash
# Test API
curl http://localhost:3000/api/workflows?page=1&limit=10

# Test Toggle
curl -X POST http://localhost:3000/api/workflows/1/toggle \
  -H "Content-Type: application/json" \
  -d '{"status":"inactive"}'

# Test Trigger
curl -X POST http://localhost:3000/api/workflows/1/trigger
```

## 🚀 Deployment

### Environment Variables
```env
# Optional
N8N_URL=https://n8n.smarterbot.cl
N8N_API_KEY=n8n_api_xxx
GITHUB_TOKEN=ghp_xxx
```

### Build
```bash
pnpm install
pnpm build
```

### Deploy
```bash
vercel --prod
```

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet portrait */
lg: 1024px  /* Tablet landscape / Desktop */
xl: 1280px  /* Desktop large */
```

### Grid Layout
```tsx
// Stats
<div className="grid gap-4 md:grid-cols-3">

// Workflows
<div className="space-y-4">
  <Card /> /* Full width */
</div>
```

## 🔮 Future Enhancements

1. **Real-time Updates**: WebSocket for live execution data
2. **Execution Logs**: View workflow execution history
3. **Metrics Dashboard**: Charts and analytics
4. **Filtering**: By category, status, search
5. **Bulk Actions**: Enable/disable multiple workflows
6. **Scheduling**: Set execution schedules
7. **Notifications**: Alerts on failures
8. **Workflow Editor**: Visual workflow builder

## 📚 References

- [N8N API Docs](https://docs.n8n.io/api/)
- [GitHub API](https://docs.github.com/en/rest)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)

## 📝 Changelog

### v1.0.0 (2024-11-24)
- ✅ Initial implementation
- ✅ Dashboard with 10 workflows
- ✅ API backend with GitHub integration
- ✅ Pagination functionality
- ✅ Toggle and trigger actions
- ✅ Spanish localization
- ✅ Responsive design
- ✅ Cache implementation

---

**Version**: 1.0.0  
**Last Updated**: 2024-11-24  
**Status**: ✅ Production Ready
