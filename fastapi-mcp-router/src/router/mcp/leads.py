from fastapi import HTTPException, status

from ..models import AuthContext, MCPRequest, MCPResponse


async def create(req: MCPRequest, ctx: AuthContext) -> MCPResponse:
    payload = req.data
    if not payload.get("email"):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="missing_email")

    # Simular envío al motor MCP real o cola
    lead_id = payload.get("id") or "lead_" + payload.get("email", "unknown")

    return MCPResponse(
        ok=True,
        result={"id": lead_id, "status": "created"},
        meta={"handled_by": "mcp.leads.create", "tenant": ctx.tenant.rut},
    )
