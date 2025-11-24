# SmarterOS MCP 0.2 - Architecture & Roadmap

## Executive Summary

SmarterOS MCP (Model Context Protocol) 0.2 introduces a structured tool ecosystem enabling automated tenant provisioning, service integration, and operational observability. The system exposes authenticated tools via Next.js API routes and provides a web console for testing and demonstration.

---

## Architecture Overview

### Components

1. **MCP Server** (`mcp/server/index.ts`)
   - Protocol-compliant server using `@modelcontextprotocol/sdk`
   - Stdio transport for future standalone deployments
   - Tool registry with JSON Schema validation
   - Controlled by `MCP_ENABLED` env flag

2. **Tool Executors**
   - **Tenant Tools** (`mcp/tools/supabase-tenants.ts`)
     - `tenants.list` - List active tenants for authenticated user
     - `tenants.get` - Retrieve full tenant record by UUID
     - `tenants.create` - Create new tenant with RUT validation
     - `tenants.updateServices` - Toggle service flags (CRM, BOT, ERP, Workflows, KPI)
   
   - **FastAPI Proxy** (`mcp/tools/fastapi-proxy.ts`)
     - `fastapi.get` - Generic GET wrapper with path whitelist
     - `fastapi.post` - Generic POST wrapper with body validation
     - `services.provision` - Batch provision services for tenant
     - `services.status` - Retrieve service integration status

3. **API Routes**
   - `/api/mcp/ping` - Health check with disabled mode response
   - `/api/mcp/tool` - Tool executor with auth, rate limiting (30 req/min), timing, logging
   - `/api/health` - Composed health check (frontend + MCP + Supabase + backend validator)

4. **UI Console** (`/dashboard/mcp`)
   - Interactive tool tester with quick actions
   - JSON args editor and pretty-printed result viewer
   - Copy-to-clipboard functionality
   - Real-time execution status

5. **Observability**
   - Console logging (`[MCP_INVOCATION]`, `[MCP_INVOCATION_ERROR]`)
   - Optional Supabase persistence (`mcp_invocations` table) via `MCP_LOG_DB=true`
   - External health tracking (`external_health` table)
   - Monitor script (`scripts/monitor-backend.ts`) for periodic checks

---

## Data Model

### Tenants Table
\`\`\`sql
tenants (
  id UUID PRIMARY KEY,
  rut TEXT NOT NULL,
  business_name TEXT NOT NULL,
  clerk_user_id TEXT NOT NULL,
  services_enabled JSONB DEFAULT '{"crm":false,"bot":false,"erp":false,"workflows":false,"kpi":false}',
  chatwoot_inbox_id INT,
  botpress_workspace_id TEXT,
  odoo_company_id INT,
  n8n_project_id TEXT,
  metabase_dashboard_id TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
\`\`\`

### MCP Invocations (Audit Log)
\`\`\`sql
mcp_invocations (
  id UUID PRIMARY KEY,
  user_id TEXT NOT NULL,
  tool TEXT NOT NULL,
  args TEXT,
  result TEXT,
  duration_ms INT NOT NULL,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
\`\`\`

### External Health Checks
\`\`\`sql
external_health (
  id UUID PRIMARY KEY,
  service TEXT NOT NULL,
  status TEXT NOT NULL,
  latency_ms INT,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
\`\`\`

---

## Security Model

### Authentication
- Clerk-based user authentication (JWT sessions)
- `/api/mcp/tool` requires valid `userId` from `auth()`
- Tools inherit user context; RLS policies apply in Supabase

### Authorization
- Tenant tools filter by `clerk_user_id` (users see only their own tenants)
- FastAPI proxy enforces path whitelist (prevents arbitrary endpoint access)
- `X-User-ID` header passed to backend for audit trails

### Rate Limiting
- In-memory per-user buckets: 30 requests/minute
- Graceful 429 responses with `retryAfterMs`

### Environment Flags
- `MCP_ENABLED` - Master switch; disables all tools if `!== 'true'`
- `MCP_LOG_DB` - Enable Supabase persistence of invocations
- `FASTAPI_URL` - Backend base URL (default: `https://api.smarterbot.cl`)

---

## Deployment

### Vercel Configuration
Required environment variables:
\`\`\`
MCP_ENABLED=true
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
FASTAPI_URL=https://api.smarterbot.cl
MCP_LOG_DB=true (optional)
\`\`\`

### Supabase Setup
1. Apply schema: `scripts/supabase-tables-mcp.sql`
2. (Optional) Enable RLS policies if multi-tenant isolation required
3. Create service role key for monitor script

### Monitor Script (Cron)
\`\`\`bash
# Run every 5 minutes
*/5 * * * * cd /path/to/app && pnpm tsx scripts/monitor-backend.ts
\`\`\`

---

## Usage Examples

### UI Console
Navigate to `/dashboard/mcp` after authentication. Select a quick action or manually enter tool name + args.

### cURL (Production)
\`\`\`bash
# List tenants
curl -X POST https://app.smarterbot.cl/api/mcp/tool \\
  -H 'Content-Type: application/json' \\
  -H 'Cookie: __session=CLERK_SESSION' \\
  -d '{"name":"tenants.list"}'

# Create tenant
curl -X POST https://app.smarterbot.cl/api/mcp/tool \\
  -H 'Content-Type: application/json' \\
  -H 'Cookie: __session=CLERK_SESSION' \\
  -d '{"name":"tenants.create","args":{"rut":"12.345.678-9","businessName":"Demo Corp"}}'

# Call FastAPI health
curl -X POST https://app.smarterbot.cl/api/mcp/tool \\
  -H 'Content-Type: application/json' \\
  -H 'Cookie: __session=CLERK_SESSION' \\
  -d '{"name":"fastapi.get","args":{"path":"/health"}}'
\`\`\`

---

## Roadmap

### v0.3 - Service Automation (Next Sprint)
- [ ] Implement `services.provision` backend endpoints (Chatwoot, Botpress, Odoo, n8n)
- [ ] Add `tenants.delete` (soft delete via `active=false`)
- [ ] Webhook tool for n8n workflow triggers
- [ ] Retry logic for failed provisioning steps

### v0.4 - Analytics & Dashboards
- [ ] MCP invocation dashboard (`/dashboard/analytics`)
- [ ] Latency percentiles (p50, p95, p99)
- [ ] Error rate tracking and alerting
- [ ] Service health timeline visualization

### v0.5 - Multi-Agent Orchestration
- [ ] Agent registry for specialized bots
- [ ] Task queuing and prioritization
- [ ] Event-driven workflows (tenant created → auto-provision services)
- [ ] LLM-assisted provisioning validation

### v1.0 - Production Hardening
- [ ] Upstash rate limiting (replace in-memory)
- [ ] Distributed tracing (OpenTelemetry)
- [ ] RBAC for admin vs user tools
- [ ] Audit log retention policies

---

## Contributing

1. Create feature branch from `main`
2. Add tool functions in `mcp/tools/`
3. Register in `mcp/server/index.ts` (schema) and `app/api/mcp/tool/route.ts` (executor)
4. Update README and this doc
5. Run `pnpm lint` before PR

---

## Support

Slack: `#smarteros-dev`  
Email: `soporte@smarterbot.cl`  
Docs: `https://docs.smarterbot.cl`

---

**Version:** 0.2.0  
**Last Updated:** 22 Nov 2025  
**Authors:** SmarterBot Engineering
