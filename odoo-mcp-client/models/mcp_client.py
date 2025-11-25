import json
import logging

import requests
from odoo import api, models

_logger = logging.getLogger(__name__)


class MCPClient(models.AbstractModel):
    _name = "smarteros.mcp.client"
    _description = "SmarterOS MCP lightweight client"

    @api.model
    def _get_mcp_token(self):
        return self.env["ir.config_parameter"].sudo().get_param("smarteros_mcp_token")

    @api.model
    def _get_api_base(self):
        return self.env["ir.config_parameter"].sudo().get_param("smarteros_api_base", "https://api.smarterbot.cl")

    @api.model
    def send_to_api(self, event: str, payload: dict):
        """
        Cliente liviano: empaqueta y envía datos; no procesa negocio.
        """
        url = f\"{self._get_api_base().rstrip('/')}/{event}\"
        token = self._get_mcp_token()
        if not token:
            raise ValueError(\"Config param smarteros_mcp_token is missing\")

        headers = {
            \"Authorization\": f\"Bearer {token}\",
            \"Content-Type\": \"application/json\",
        }

        _logger.info(\"[MCP] Sending %s -> %s\", event, url)
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        try:
            body = resp.json()
        except Exception:  # noqa: BLE001
            body = {\"raw\": resp.text}

        if resp.status_code >= 400:
            _logger.error(\"[MCP] Error %s: %s\", resp.status_code, body)
            raise ValueError(f\"mcp_error:{resp.status_code}\")

        return body

    @api.model
    def emit_lead(self, email: str, name: str = \"\", tenant_rut: str = \"\"):
        payload = {
            \"type\": \"lead.create\",
            \"data\": {\"email\": email, \"name\": name},
            \"meta\": {\"source\": \"odoo\", \"tenant_rut\": tenant_rut},
        }
        return self.send_to_api(\"mcp/route\", payload)
