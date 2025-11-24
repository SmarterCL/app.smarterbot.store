# SmarterOS Frontend

SmarterOS is the operations hub for SmarterBot customers. This repo hosts the authenticated dashboard application (`/dashboard`) used at the `app.smarterbot.store` subdomain. The root path (`/`) redirects to the dashboard. The UI has been restyled to match the SmarterOS brand: a dark grid background, monochrome accents, and a consistent typography system.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/smarterbotcl/app-smarterbot-store)

## ✨ Latest Features

### Dashboard de Automatizaciones N8N (Nov 2024) ✅
- 🔄 **10 workflows reales** desde automation-manifest.json en GitHub
- 📊 **Paginación funcional** (10 items por página)
- 🎯 **Integración completa**: GitHub → API → Dashboard
- 🎛️ **Control ON/OFF** por workflow (próximamente funcional)
- ▶️ **Ejecución manual** con botón Play
- 📈 **Estadísticas globales**: workflows activos, ejecuciones, totales
- 🏷️ **7 categorías**: Odoo, Shopify, Marketing, WhatsApp, CRM, PDF, Backup
- 🇪🇸 **100% en español**
- 🎨 **UI moderna** con Shadcn/UI + badges con colores por categoría
- 🔗 **API REST**: `api.smarterbot.cl/n8n/templates`

Ver: `/dashboard/automatizaciones` | Docs: `specs/N8N-AUTOMATION-INTEGRATION.md`

## Tech Stack

- **Framework:** Next.js 15 (App Router, React 19)
- **Auth:** Clerk (Google OAuth, email)
- **Styling:** Tailwind CSS + custom design tokens (SmarterOS theme)
- **Forms & Validation:** React Hook Form, Zod
- **Charts & UI:** Shadcn UI components, Lucide icons, Recharts
- **Automation:** N8N Integration (workflows dashboard)
- **Protocol / Extensibility:** (Planned) Model Context Protocol server (`/mcp/server/index.ts`)

## Getting Started

```bash
pnpm install
pnpm dev
```

The app runs on `http://localhost:3000`.

### Quick Start (Demo Mode)

The app now works out-of-the-box! If no Clerk configuration is detected, it automatically runs in **demo mode**, allowing you to explore the dashboard without any setup.

To explicitly enable demo mode, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

The default configuration has `NEXT_PUBLIC_DEMO_MODE=true`, which:
- Bypasses Clerk authentication
- Redirects `/dashboard` to `/demo-dashboard`  
- Uses mock data for testing

### Required Environment Variables (Production)

For production use with real authentication, create `.env.local` with:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_ENABLE_AUTH_DEBUG=false
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Set `NEXT_PUBLIC_ENABLE_AUTH_DEBUG=true` only while debugging user sessions; production deployments keep it `false`.

### Production Environment Variables

Set ONLY the following in Vercel for a stable deployment:

Required:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `FASTAPI_URL`
 - `MCP_ENABLED` (set to `true` to activate MCP tools; omit or `false` keeps server dormant)

Optional (use only if referenced):
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (`/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` (`/sign-up`)
- `NEXT_PUBLIC_DEMO_MODE`
- `RESEND_API_KEY`
 - `MCP_LOG_LEVEL` (`debug` | `info` | `warn` | `error`, default `info`)

Remove / do not set (not used by the Next.js app, can cause confusion):
`anonpublic`, `service_rolesecret`, `SUPABASE_URL`, `SUPABASE_JWT_SECRET`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`, `POSTGRES_USER`, `POSTGRES_PASSWORD`.

Verification scripts:

```bash
pnpm ts-node scripts/env-audit.ts
./scripts/env-verify.sh
```

Production check endpoint: `/api/env/diagnostic`.

### MCP Integration (Phase 1)

The initial MCP scaffold adds:

- `mcp/server/index.ts` – Minimal server using `@modelcontextprotocol/sdk` with an empty tool registry.
- `app/api/mcp/ping/route.ts` – Health endpoint returning `{ ok: true, service: 'mcp', version }`.

Activation:

1. Set `MCP_ENABLED=true` in Vercel (or `.env.local`).
2. (Future phases) Tools will respect Clerk auth and rate limits.

If `MCP_ENABLED` is not true:
 - `/api/mcp/ping` returns `{ ok: false, disabled: true }`.
 - `/api/mcp/tool` returns 403 with `{ error: 'mcp_disabled' }`.

### MCP Tenants Tools (Phase 2)

Added tools (require authenticated Clerk user):

- `tenants.list` – Lists active tenants for the current user (fields: `id, rut, business_name, active, created_at`).
- `tenants.get` – Returns full tenant record by `id` (UUID) subject to RLS ownership.
 - `tenants.create` – Creates a new tenant (`rut`, `businessName`) bound to the authenticated user.
 - `tenants.updateServices` – Updates `services_enabled` flags for a tenant.

Invocation (when enabled):

```bash
curl -X POST http://localhost:3000/api/mcp/tool \
	-H 'Content-Type: application/json' \
	-H 'Cookie: __session=YOUR_CLERK_SESSION_COOKIE' \
	-d '{"name":"tenants.list"}'

curl -X POST http://localhost:3000/api/mcp/tool \
	-H 'Content-Type: application/json' \
	-H 'Cookie: __session=YOUR_CLERK_SESSION_COOKIE' \
	-d '{"name":"tenants.get","args":{"id":"<tenant-uuid>"}}'

curl -X POST http://localhost:3000/api/mcp/tool \
	-H 'Content-Type: application/json' \
	-H 'Cookie: __session=YOUR_CLERK_SESSION_COOKIE' \
	-d '{"name":"tenants.create","args":{"rut":"12.345.678-9","businessName":"Empresa Demo"}}'

curl -X POST http://localhost:3000/api/mcp/tool \
	-H 'Content-Type: application/json' \
	-H 'Cookie: __session=YOUR_CLERK_SESSION_COOKIE' \
	-d '{"name":"tenants.updateServices","args":{"id":"<tenant-uuid>","services":{"crm":true,"bot":false}}}'
```

Error cases:
- Missing auth: `{ ok: false, error: 'unauthorized' }`
- Disabled: `{ ok: false, error: 'mcp_disabled' }`
- Tool not found: `{ ok: false, error: 'tool_not_found' }`
- Validation (bad UUID): `{ ok: false, error: 'tool_error', message: 'Invalid uuid' }`
 - Missing required args: `{ ok: false, error: 'tool_error', message: 'rut' }` (or similar validation message)

### MCP Invocation Logging (Phase 2.5)

Each tool invocation logs a structured console entry:

```
console.info('[MCP_INVOCATION]', { userId, tool, durationMs })
```

Errors log:

```
console.warn('[MCP_INVOCATION_ERROR]', { userId, tool, durationMs, error })
```

Optional DB persistence (set `MCP_LOG_DB=true`): inserts into `mcp_invocations`:

Columns:
- `user_id` (Clerk user)
- `tool`
- `args` (JSON truncated)
- `result` (JSON truncated)
- `duration_ms`
- `created_at` (server default now())

Add table example (SQL):

```sql
create table if not exists mcp_invocations (
	id uuid primary key default gen_random_uuid(),
	user_id text not null,
	tool text not null,
	args text,
	result text,
	duration_ms integer not null,
	created_at timestamptz not null default now()
);
create index on mcp_invocations (user_id);
create index on mcp_invocations (tool);
```

Environment flags:
- `MCP_ENABLED` – master switch.
- `MCP_LOG_DB` – enable Supabase persistence.

### Demo Mode

Setting `NEXT_PUBLIC_DEMO_MODE=true` switches the landing page and `/dashboard` to demo flows that skip Clerk authentication and redirect to the in-memory demo dashboard (`/demo-dashboard`).

## Project Structure Highlights

- `app/page.tsx` – Public marketing/landing page with SmarterOS branding.
- `app/dashboard/page.tsx` – Authenticated dashboard shell; uses Clerk server-side `auth()`.
- `components/background-pattern.tsx` – Shared grid background rendered on both landing and dashboard pages.
- `components/demo-dashboard-content.tsx` – In-memory CRUD simulator used in demo mode.
- `middleware.ts` – Protects `/dashboard` routes while still allowing demo mode or unconfigured environments to fail gracefully.

## Linting & Formatting

```bash
pnpm lint
```

The repo uses the flat ESLint config (`eslint.config.mjs`) with `eslint-config-next`. Prettier is not configured; code follows the conventions enforced by Next.js and the component library.

## Deployment

The main branch is deployed on Vercel to `app.smarterbot.store`. Pushing to `main` triggers an automatic deployment. Use preview deployments for QA before merging large UI updates.

## Contributing

1. Create a feature branch.
2. Run `pnpm lint` before opening a PR.
3. Provide screenshots or Loom videos when altering UI layouts.

For support or design requests, reach the SmarterBot team on Slack or at `soporte@smarterbot.cl`.

## 📂 Project Structure

```
app-smarterbot-store/
├── app/
│   ├── dashboard/
│   │   ├── automatizaciones/    # ✨ N8N Workflows Dashboard
│   │   ├── mcp/                 # MCP Tools
│   │   └── tenant/              # Tenant Management
│   ├── api/
│   │   └── workflows/           # ✨ Workflows API
│   └── page.tsx                 # Redirects to dashboard
├── components/
│   └── ui/                      # Shadcn UI components
├── lib/                         # Utilities
├── mcp/                         # MCP Server
├── specs/                       # ✨ Technical specifications
└── styles/                      # Global styles
```

## 🚀 New Features

### Dashboard de Automatizaciones
Control workflows de N8N desde la interfaz web:
- **URL**: `/dashboard/automatizaciones`
- **API**: `/api/workflows`
- **Specs**: `specs/dashboard-automatizaciones.md`

#### 10 Workflows Implementados:
1. WhatsApp Leads → CRM
2. Agenda Confirmaciones
3. Reporte Diario a Sheets
4. Slack Notificaciones Ventas
5. Email Marketing Automatizado
6. Sync Shopify → Odoo
7. Procesar Facturas PDF
8. Bot AI WhatsApp
9. Backup Automático Diario
10. Monitor Redes Sociales

