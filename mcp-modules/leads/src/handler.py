from typing import Any, Dict


def validate(data: Dict[str, Any]):
    if not data.get("email"):
        return {"ok": False, "error": "missing_email"}
    return {"ok": True}


def create(data: Dict[str, Any], meta: Dict[str, Any]):
    check = validate(data)
    if not check.get("ok"):
        return check
    lead_id = data.get("id") or f"lead-{data.get('email', 'unknown')}"
    return {
        "ok": True,
        "result": {"id": lead_id, "status": "created"},
        "meta": {**meta, "handled_by": "mcp.leads.create"},
    }
