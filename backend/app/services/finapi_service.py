"""
SOVEREIGN 2030 — finAPI Service (PSD2 Bank Integration)

⚠️ SIMULATED MODE (memory.md Rule #20):
Die finAPI-Integration wird lokal mit exakten PSD2-Datenstrukturen simuliert.
Der kostenlose 30-Tage-Sandbox-Trial wird erst aktiviert, wenn die Plattform
im finalen Pre-Flight-Launch-Stadium ist, um unnötige 60 EUR/Monat zu vermeiden.

Die Datenstrukturen sind 1:1 identisch mit der echten finAPI — beim Launch
muss nur `SIMULATED = False` gesetzt und die Credentials konfiguriert werden.
"""
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone, timedelta
from ..config import config
import logging
import random

logger = logging.getLogger("sovereign.finapi")

# ════════════════════════════════════════════════════
# SIMULATION FLAG — Auf False setzen bei Live-Launch
# ════════════════════════════════════════════════════
SIMULATED = True


class FinAPIService:
    """
    PSD2-compliant bank integration service.
    Simulated until live launch — structure matches real finAPI v2 exactly.
    """

    def __init__(self):
        self.base_url = getattr(config, 'FINAPI_BASE_URL', 'https://sandbox.finapi.io')
        self.client_id = config.FINAPI_CLIENT_ID
        self.client_secret = config.FINAPI_CLIENT_SECRET
        self._token: Optional[str] = None

        if SIMULATED:
            logger.info("🏦 finAPI running in SIMULATED mode (memory.md Rule #20)")
        else:
            logger.info(f"🏦 finAPI connecting to {self.base_url}")

    async def create_web_form(self, user_id: str, redirect_url: str) -> dict:
        """
        PSD2 Web Form erstellen — User authentifiziert sich bei seiner Bank.
        Returns: { webFormUrl, webFormId, status }
        """
        if SIMULATED:
            return {
                "webFormId": f"wf_sim_{user_id[:8]}_{int(datetime.now().timestamp())}",
                "webFormUrl": f"https://sandbox.finapi.io/webform/simulated?userId={user_id}",
                "status": "COMPLETED",
                "bankConnectionId": f"bc_sim_{user_id[:8]}",
                "_simulated": True,
                "_note": "finAPI simuliert bis Launch (30-Tage-Trial-Schutz)"
            }

        # Real implementation — aktiviert bei Launch
        import httpx
        token = await self._get_token()
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v2/webForms/bankConnectionImport",
                headers={"Authorization": f"Bearer {token}"},
                json={
                    "callbacks": {
                        "finalised": f"{redirect_url}?userId={user_id}&status=success",
                        "cancelled": f"{redirect_url}?userId={user_id}&status=cancelled",
                    }
                }
            )
            response.raise_for_status()
            return response.json()

    async def get_transactions(self, bank_connection_id: str, days: int = 90) -> List[dict]:
        """
        Transaktionen abrufen nach erfolgreicher Bankverbindung.
        Returns: Liste von PSD2-konformen Transaktions-Objekten.
        """
        if SIMULATED:
            return self._generate_mock_transactions(days)

        import httpx
        token = await self._get_token()
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v2/transactions",
                headers={"Authorization": f"Bearer {token}"},
                params={
                    "bankConnectionId": bank_connection_id,
                    "order": "date,desc",
                    "perPage": 500,
                }
            )
            response.raise_for_status()
            return response.json().get("transactions", [])

    async def get_bank_connections(self, user_id: str) -> List[dict]:
        """Liste der verbundenen Bankkonten."""
        if SIMULATED:
            return [{
                "id": f"bc_sim_{user_id[:8]}",
                "bankName": "Deutsche Bank (Simuliert)",
                "bankId": 277672,
                "status": "UPDATED",
                "accountIds": [f"acc_sim_{user_id[:8]}_1"],
                "lastSuccessfulUpdate": datetime.now(timezone.utc).isoformat(),
                "_simulated": True,
            }]

        import httpx
        token = await self._get_token()
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/api/v2/bankConnections",
                headers={"Authorization": f"Bearer {token}"},
            )
            response.raise_for_status()
            return response.json().get("connections", [])

    async def _get_token(self) -> str:
        """OAuth2 Client Credentials Token holen."""
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/api/v2/oauth/token",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                }
            )
            response.raise_for_status()
            self._token = response.json()["access_token"]
            return self._token

    def _generate_mock_transactions(self, days: int = 90) -> List[dict]:
        """
        Generiert realistische Mock-Transaktionen im exakten finAPI-Format.
        Vollständig PSD2-konform — beim Umschalten auf Live ändert sich nur die Quelle.
        """
        merchants = [
            {"name": "Telekom Deutschland GmbH", "amount": -49.99, "purpose": "Mobilfunk Flatrate"},
            {"name": "Allianz Versicherungs-AG", "amount": -89.50, "purpose": "KFZ-Versicherung"},
            {"name": "Netflix International B.V.", "amount": -17.99, "purpose": "Premium Abo"},
            {"name": "Stadtwerke München", "amount": -95.00, "purpose": "Strom + Gas Abschlag"},
            {"name": "Spotify AB", "amount": -9.99, "purpose": "Spotify Premium Family"},
            {"name": "McFit GmbH", "amount": -24.99, "purpose": "Mitgliedsbeitrag"},
            {"name": "REWE Markt GmbH", "amount": -67.83, "purpose": "Lebensmittel"},
            {"name": "Amazon EU S.a.r.l.", "amount": -34.97, "purpose": "Bestellung #302-4453921"},
            {"name": "ADAC e.V.", "amount": -54.00, "purpose": "Jahresbeitrag"},
            {"name": "Arbeitgeber GmbH", "amount": 3200.00, "purpose": "Gehalt April 2026"},
        ]

        transactions = []
        base_date = datetime.now(timezone.utc)

        for i in range(min(days, 45)):
            day_offset = random.randint(0, days)
            merchant = random.choice(merchants)
            tx_date = base_date - timedelta(days=day_offset)

            transactions.append({
                "id": f"tx_sim_{i:04d}",
                "amount": merchant["amount"],
                "currency": "EUR",
                "counterpartName": merchant["name"],
                "purpose": merchant["purpose"],
                "bookingDate": tx_date.strftime("%Y-%m-%d"),
                "valueDate": tx_date.strftime("%Y-%m-%d"),
                "bankBookingId": f"BOOKING_{i:06d}",
                "isNew": i < 5,
                "isPotentialDuplicate": False,
                "category": {"id": 1, "name": "Sonstiges"},
                "_simulated": True,
            })

        transactions.sort(key=lambda x: x["bookingDate"], reverse=True)
        return transactions


finapi_service = FinAPIService()
