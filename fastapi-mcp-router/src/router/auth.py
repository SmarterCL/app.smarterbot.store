import os
from typing import Optional

import httpx
from fastapi import Depends, HTTPException, Request, status

from .models import AuthContext, Tenant


async def verify_clerk_token(token: str) -> Optional[str]:
    """
    Placeholder: validate Clerk JWT using JWKS.
    Returns Clerk user_id if valid, otherwise None.
    """
    # In production, cache JWKS and validate signature+audience+exp.
    if token and token.startswith("sk_test_"):
        return "user_demo"
    return None


async def fetch_tenant(clerk_user_id: str, rut: Optional[str]) -> Tenant:
    """
    Placeholder Supabase lookup by Clerk user id or RUT.
    In production, replace with supabase client and RLS policies.
    """
    if not clerk_user_id and not rut:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="missing_identity")

    # Mock tenant for now
    tenant_rut = rut or "76.123.456-7"
    return Tenant(
        id="tenant-demo",
        rut=tenant_rut,
        plan="pro",
        features={"mcp": True, "n8n": True},
        limits={"events_per_minute": 120},
    )


async def auth_user(request: Request) -> AuthContext:
    auth_header = request.headers.get("Authorization", "")
    token = auth_header.replace("Bearer ", "")
    user_id = await verify_clerk_token(token)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_token")

    body = await request.json()
    rut = body.get("meta", {}).get("tenant_rut")
    tenant = await fetch_tenant(user_id, rut)

    return AuthContext(user_id=user_id, tenant=tenant, token=token)
