import pytest
from fastapi.testclient import TestClient

from router.main import app


client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["service"] == "fastapi-mcp-router"


def test_mcp_route_lead_create():
    payload = {
        "type": "lead.create",
        "data": {"email": "demo@example.com"},
        "meta": {"tenant_rut": "76.123.456-7"},
    }
    res = client.post("/mcp/route", json=payload, headers={"Authorization": "Bearer sk_test_demo"})
    assert res.status_code == 200
    body = res.json()
    assert body["ok"] is True
    assert body["result"]["status"] == "created"
    assert body["meta"]["handled_by"] == "mcp.leads.create"


def test_mcp_route_missing_handler():
    payload = {
        "type": "unknown.event",
        "data": {},
        "meta": {},
    }
    res = client.post("/mcp/route", json=payload, headers={"Authorization": "Bearer sk_test_demo"})
    assert res.status_code == 404
