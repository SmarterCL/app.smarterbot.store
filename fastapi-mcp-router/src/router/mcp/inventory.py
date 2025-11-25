from ..models import AuthContext, MCPRequest, MCPResponse


async def sync_stock(req: MCPRequest, ctx: AuthContext) -> MCPResponse:
    data = req.data
    sku = data.get("sku", "unknown")
    qty = data.get("quantity", 0)
    return MCPResponse(
        ok=True,
        result={"sku": sku, "synced_quantity": qty},
        meta={"handled_by": "mcp.inventory.sync_stock", "tenant": ctx.tenant.rut},
    )
