# SmarterOS - Plataforma de Gestión Empresarial

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)

## 🌟 Descripción

SmarterOS es la plataforma integral para gestionar tu negocio completo. Este repositorio contiene el **Hub de Login/Onboarding** y **Dashboard Central** que da acceso a todos los módulos del ecosistema SmarterOS.

### Módulos Integrados

- 🗨️ **CRM** - Gestión de clientes y WhatsApp Business
- 📊 **ERP Odoo** - Sistema de gestión empresarial multi-tenant
- ⚡ **Automatizaciones n8n** - Workflows sin código
- 🤖 **AI Playground** - Prueba modelos GPT-4o y Claude
- 📈 **KPI Metabase** - Dashboards y análisis de datos
- 👥 **Multi-tenant** - Aislamiento por empresa/RUT

---

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **React:** 19 con Server Components
- **TypeScript:** 5 con strict mode
- **Styling:** Tailwind CSS 3.4 + Shadcn/UI
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

### Autenticación
- **Clerk:** Autenticación con Google OAuth
- **Middleware:** Protección de rutas con `clerkMiddleware`
- **Localización:** Español (esES)

### IA & APIs
- **AI SDK:** Vercel AI SDK para streaming
- **OpenAI:** GPT-4o, GPT-4o Mini
- **Anthropic:** Claude 3.5 Sonnet
- **Gateway:** AI Gateway (OIDC, sin claves expuestas)

### Infraestructura
- **Hosting:** Vercel (Edge Functions)
- **Analytics:** Vercel Analytics
- **Database:** Supabase (PostgreSQL)
- **Protocol:** Model Context Protocol (MCP)

---

## 📁 Estructura del Proyecto

```
app/
├── page.tsx                     # Landing page (pública)
├── layout.tsx                   # Root layout con ClerkProvider
├── globals.css                  # Estilos globales + Tailwind
├── sign-in/[[...sign-in]]/      # Página de login (Clerk)
├── sign-up/[[...sign-up]]/      # Página de registro (Clerk)
├── dashboard/                   # Dashboard principal (protegido)
│   ├── page.tsx                 # Vista principal con módulos
│   ├── automatizaciones/        # Dashboard de workflows n8n
│   ├── mcp/                     # Dashboard MCP
│   └── tenant/                  # Gestión de tenants
├── crm/                         # Página informativa CRM
├── erp/                         # Página informativa ERP Odoo
├── n8n/                         # Página informativa n8n
├── playground/                  # AI Playground (streaming)
└── api/
    ├── chat/                    # Endpoint de IA (streaming)
    ├── health/                  # Health check
    ├── mcp/                     # Model Context Protocol
    ├── tenants/                 # API de tenants
    └── ...                      # Otros endpoints

middleware.ts                    # Clerk auth middleware
components/                      # Componentes reutilizables
├── ui/                          # Shadcn/UI components
├── dashboard-content.tsx        # Contenido del dashboard
├── tenant-selector.tsx          # Selector de tenant
└── ...
```

---

## 🛠️ Instalación y Desarrollo

### Requisitos Previos

- Node.js 18+
- pnpm 8+
- Cuenta de Vercel (para deploy)
- Cuenta de Clerk (para autenticación)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/SmarterCL/app.smarterbot.store.git
cd app.smarterbot.store
```

### 2. Instalar Dependencias

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Supabase (opcional para desarrollo)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# AI Gateway (configurado en Vercel Dashboard)
# No se necesitan claves de OpenAI/Anthropic en código
# AI_GATEWAY_URL=https://gateway.ai.cloudflare.com/v1

# Demo Mode (opcional)
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_ENABLE_AUTH_DEBUG=false
```

### 4. Ejecutar en Desarrollo

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🎯 Páginas y Rutas

### Rutas Públicas (sin autenticación)

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page con hero y features |
| `/sign-in` | Página de login (Clerk) |
| `/sign-up` | Página de registro (Clerk) |

### Rutas Protegidas (requieren autenticación)

| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Dashboard principal con módulos |
| `/dashboard/automatizaciones` | Dashboard de workflows n8n |
| `/dashboard/mcp` | Dashboard de MCP |
| `/crm` | Información del módulo CRM |
| `/erp` | Información del módulo ERP Odoo |
| `/n8n` | Información de automatizaciones |
| `/playground` | AI Playground (GPT-4o, Claude) |
| `/settings` | Configuración de usuario |

### API Endpoints

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/chat` | POST | Streaming de IA (GPT-4o, Claude) |
| `/api/health` | GET | Health check |
| `/api/tenants` | GET | Lista de tenants |
| `/api/mcp/*` | * | Model Context Protocol |

---

## 🤖 AI Playground

El AI Playground permite probar diferentes modelos de IA con streaming en tiempo real.

### Características

- ✅ Streaming de respuestas en tiempo real
- ✅ Soporte para GPT-4o, GPT-4o Mini, Claude 3.5
- ✅ Sin claves expuestas (AI Gateway con OIDC)
- ✅ UI conversacional con historial
- ✅ Selector de modelos dinámico

### Uso

1. Navega a `/playground`
2. Selecciona un modelo (GPT-4o Mini, GPT-4o, Claude)
3. Escribe tu prompt
4. Presiona "Enviar" y ve la respuesta en streaming

### Implementación Técnica

```typescript
// app/playground/page.tsx (cliente)
import { useChat } from 'ai/react'

const { messages, input, handleSubmit, isLoading } = useChat({
  api: '/api/chat',
  body: { model: 'gpt-4o-mini' }
})
```

```typescript
// app/api/chat/route.ts (servidor)
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const result = streamText({
  model: openai('gpt-4o-mini'),
  messages,
})

return result.toDataStreamResponse()
```

---

## 🔒 Autenticación con Clerk

### Configuración del Middleware

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, request) => {
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})
```

### Rutas Protegidas

Todas las rutas excepto `/`, `/sign-in` y `/sign-up` requieren autenticación.

---

## 🎨 Theming y Estilos

### Tailwind CSS

El proyecto usa Tailwind CSS con una configuración personalizada:

- **Colores:** Paleta SmarterOS (primary, secondary, accent)
- **Tipografía:** Onest (Google Fonts)
- **Componentes:** Shadcn/UI
- **Animaciones:** Framer Motion

### Tema Personalizado

```typescript
// app/layout.tsx
const themeInitScript = `
  var STORAGE_KEY = 'smarteros-theme';
  var THEMES = ['theme-light', 'theme-bw'];
  // ... lógica de theme switching
`
```

---

## 📦 Deploy en Vercel

### 1. Desarrollo Local con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desarrollo local con entorno de Vercel
vercel dev

# Deploy a preview
vercel

# Deploy a producción
vercel --prod
```

### 2. Deploy desde Git

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Configura las variables de entorno en el dashboard
3. Deploy automático en cada push a `main`

### 3. Variables de Entorno en Vercel

Configura estas variables en el dashboard de Vercel:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Nota:** El AI Gateway se configura desde el dashboard de Vercel, **no** se necesitan claves de OpenAI/Anthropic en el código.

---

## 🏗️ Multi-Tenant (Futuro)

El proyecto está preparado para multi-tenancy:

### Estructura Futura

```typescript
// Cada tenant tendrá:
- Slug único: empresa-ejemplo
- RUT chileno: 12345678-9
- Subdominios:
  - crm.empresa-ejemplo.cl
  - erp.empresa-ejemplo.cl
  - n8n.empresa-ejemplo.cl
```

### Helpers Preparados

```typescript
// lib/tenant.ts (futuro)
export function getTenantSlug(): string
export function getTenantRut(): string
export function getTenantSubdomain(service: string): string
```

---

## 🧪 Testing

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint

# Build production
pnpm build
```

---

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Desarrollo local (localhost:3000) |
| `pnpm build` | Build de producción |
| `pnpm start` | Ejecutar build de producción |
| `pnpm lint` | Linting con ESLint |
| `pnpm typecheck` | Type checking con TypeScript |
| `pnpm clean` | Limpiar archivos de build |

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

---

## 📄 Licencia

Propiedad de SmarterCL. Todos los derechos reservados.

---

## 🔗 Links Importantes

- **Website:** [app.smarterbot.cl](https://app.smarterbot.cl)
- **Documentación:** [docs.smarterbot.cl](https://docs.smarterbot.cl)
- **Soporte:** [wa.me/56979540471](https://wa.me/56979540471)
- **GitHub:** [github.com/SmarterCL](https://github.com/SmarterCL)

---

## 📞 Soporte

¿Necesitas ayuda? Contáctanos:

- 📱 WhatsApp: [+56 9 7954 0471](https://wa.me/56979540471)
- 📧 Email: soporte@smarterbot.cl
- 🌐 Web: [smarterbot.cl](https://smarterbot.cl)

---

**Hecho con ❤️ por el equipo de SmarterCL**
