from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class MCPRequest(BaseModel):
    type: str = Field(..., description="Event type, e.g., lead.create, invoice.issued")
    data: Dict[str, Any] = Field(default_factory=dict, description="Payload from the client (Odoo, n8n, Shopify, etc.)")
    meta: Dict[str, Any] = Field(default_factory=dict, description="Metadata such as source system, tenant_rut, correlation ids")


class MCPResponse(BaseModel):
    ok: bool
    result: Dict[str, Any]
    meta: Dict[str, Any] = Field(default_factory=dict)


class Tenant(BaseModel):
    id: str
    rut: str
    plan: str = "standard"
    features: Dict[str, Any] = Field(default_factory=dict)
    limits: Dict[str, Any] = Field(default_factory=dict)


class AuthContext(BaseModel):
    user_id: str
    tenant: Tenant
    token: str
