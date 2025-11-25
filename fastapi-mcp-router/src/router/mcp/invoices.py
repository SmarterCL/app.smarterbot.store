from ..models import AuthContext, MCPRequest, MCPResponse


async def issue(req: MCPRequest, ctx: AuthContext) -> MCPResponse:
    invoice = req.data
    invoice_number = invoice.get("number", "INV-000")
    return MCPResponse(
        ok=True,
        result={"number": invoice_number, "status": "issued"},
        meta={"handled_by": "mcp.invoices.issue", "tenant": ctx.tenant.rut},
    )
