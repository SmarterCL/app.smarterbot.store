from typing import Any, Awaitable, Callable, Dict

from fastapi import HTTPException, status

from .models import AuthContext, MCPRequest, MCPResponse
from .mcp import inventory, invoices, leads, payments

Action = Callable[[MCPRequest, AuthContext], Awaitable[MCPResponse]]


class Router:
    """
    Dispatcher centralizado. Cada acción delega en un módulo MCP.
    """

    def __init__(self) -> None:
        self.actions: Dict[str, Action] = {
            "lead.create": leads.create,
            "invoice.issued": invoices.issue,
            "payment.status": payments.check_status,
            "inventory.sync": inventory.sync_stock,
        }

    def register(self, event_type: str, handler: Action) -> None:
        self.actions[event_type] = handler

    async def dispatch(self, req: MCPRequest, ctx: AuthContext) -> MCPResponse:
        handler = self.actions.get(req.type)
        if not handler:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"mcp_handler_not_found:{req.type}"
            )
        return await handler(req, ctx)


router = Router()
