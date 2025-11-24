# SmarterOS - Project Specifications

## 📚 Documentation Index

### Core Specifications
- [Dashboard de Automatizaciones N8N](./dashboard-automatizaciones.md) - N8N Workflows management dashboard

### Architecture Documents
- [API Routes](./api-routes.md) - Internal API endpoints
- [Authentication Flow](./auth-flow.md) - Clerk integration
- [Database Schema](./database-schema.md) - Supabase structure

### Feature Specifications
- [MCP Integration](./mcp-integration.md) - Model Context Protocol
- [Tenant Management](./tenant-management.md) - Multi-tenancy system
- [N8N Workflows](./n8n-workflows.md) - Workflow automation

## 🎯 Active Features

### Dashboard de Automatizaciones N8N
**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**Date**: 2024-11-24

Sistema completo para gestionar workflows de N8N desde la interfaz web.

**Features**:
- 10 workflows configurados
- Lectura dinámica desde GitHub
- Paginación funcional
- Control ON/OFF por workflow
- Ejecución manual
- Estadísticas en tiempo real
- UI en español

**Routes**:
- Dashboard: `/dashboard/automatizaciones`
- API: `/api/workflows`

**Documentation**:
- Technical Spec: [dashboard-automatizaciones.md](./dashboard-automatizaciones.md)
- User Guide: [../AUTOMATIZACIONES-README.md](../AUTOMATIZACIONES-README.md)
- Implementation: [../IMPLEMENTACION-COMPLETA.md](../IMPLEMENTACION-COMPLETA.md)

## 🚧 Planned Features

### Real-time Workflow Monitoring
**Status**: Planned  
**Priority**: High

WebSocket integration for live workflow execution updates.

### Workflow Editor
**Status**: Planned  
**Priority**: Medium

Visual workflow builder integrated in the dashboard.

### Analytics Dashboard
**Status**: Planned  
**Priority**: Medium

Charts and metrics for workflow performance.

## 📝 Specification Template

When creating new specs, use this structure:

```markdown
# Feature Name

## Overview
Brief description

## Objectives
What we want to achieve

## Architecture
Technical design

## Data Models
Interfaces and types

## UI Components
Component structure

## API Endpoints
Route specifications

## Testing
Test scenarios

## Deployment
How to deploy

## References
Related docs
```

## 🔄 Update Process

1. Create/update spec in `specs/`
2. Update this index
3. Commit with descriptive message
4. Reference in PR description

## 📞 Contact

For questions about specifications:
- Technical Lead: Check CODEOWNERS
- Documentation: Update README.md
- Issues: Open GitHub issue

---

**Last Updated**: 2024-11-24  
**Maintainer**: SmarterOS Team
