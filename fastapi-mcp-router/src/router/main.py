import os
from typing import Dict

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .auth import auth_user
from .models import AuthContext, MCPRequest, MCPResponse
from .router import router as dispatcher

app = FastAPI(title="SmarterOS FastAPI MCP Router", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health() -> Dict[str, str]:
    return {"ok": "true", "service": "fastapi-mcp-router"}


@app.post("/mcp/route", response_model=MCPResponse)
async def mcp_route(req: MCPRequest, ctx: AuthContext = Depends(auth_user)) -> MCPResponse:
    return await dispatcher.dispatch(req, ctx)
