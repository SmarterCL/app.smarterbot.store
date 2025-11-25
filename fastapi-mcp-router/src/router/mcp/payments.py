from ..models import AuthContext, MCPRequest, MCPResponse


async def check_status(req: MCPRequest, ctx: AuthContext) -> MCPResponse:
    payment = req.data
    status_value = payment.get("status", "pending")
    return MCPResponse(
        ok=True,
        result={"status": status_value, "reference": payment.get("reference")},
        meta={"handled_by": "mcp.payments.check_status", "tenant": ctx.tenant.rut},
    )
