"""
SOVEREIGN 2030 — Notification Service
FCM Push Notifications for approval requests, contract alerts, and savings.
"""
from typing import Optional, List, Dict
from ..config import config
import logging

logger = logging.getLogger("sovereign.notifications")


class NotificationService:
    """
    Firebase Cloud Messaging (FCM) notification service.
    Graceful fallback when FCM is not configured.
    """

    def __init__(self):
        self.fcm_available = False
        try:
            from firebase_admin import messaging
            self.messaging = messaging
            self.fcm_available = True
            logger.info("✅ FCM Notification Service initialized")
        except Exception as e:
            logger.warning(f"⚠️ FCM not available: {e}")

    async def send_approval_required(self, uid: str, token: str, approval_summary: str, saving_eur: float = 0.0) -> bool:
        """Sende Push-Notification wenn eine Agent-Aktion Genehmigung braucht."""
        return await self._send(
            token=token,
            title="🔱 Genehmigung erforderlich",
            body=f"{approval_summary} — Sparpotenzial: {saving_eur:.2f}€",
            data={
                "type": "APPROVAL_REQUIRED",
                "uid": uid,
                "route": "/approvals",
            }
        )

    async def send_contract_expiring(self, uid: str, token: str, provider: str, days_left: int) -> bool:
        """Sende Push-Notification wenn ein Vertrag bald ausläuft."""
        return await self._send(
            token=token,
            title="⏰ Vertrag läuft aus",
            body=f"Dein Vertrag bei {provider} endet in {days_left} Tagen. Jetzt handeln?",
            data={
                "type": "CONTRACT_EXPIRING",
                "uid": uid,
                "route": "/contracts",
            }
        )

    async def send_saving_achieved(self, uid: str, token: str, amount_eur: float, provider: str) -> bool:
        """Sende Push-Notification wenn eine Ersparnis erzielt wurde."""
        return await self._send(
            token=token,
            title="💰 Ersparnis erzielt!",
            body=f"{amount_eur:.2f}€ gespart bei {provider}. SOVEREIGN arbeitet für dich.",
            data={
                "type": "SAVING_ACHIEVED",
                "uid": uid,
                "amount": str(amount_eur),
                "route": "/dashboard",
            }
        )

    async def send_claim_update(self, uid: str, token: str, claim_status: str, provider: str) -> bool:
        """Sende Push-Notification bei Claim-Status-Update."""
        return await self._send(
            token=token,
            title="📋 Claim-Update",
            body=f"Dein Claim bei {provider}: Status → {claim_status}",
            data={
                "type": "CLAIM_UPDATE",
                "uid": uid,
                "route": "/claims",
            }
        )

    async def send_insight(self, uid: str, token: str, insight_title: str, insight_body: str) -> bool:
        """Sende Push-Notification für Finance Guardian Insights."""
        return await self._send(
            token=token,
            title=f"🔍 {insight_title}",
            body=insight_body,
            data={
                "type": "INSIGHT",
                "uid": uid,
                "route": "/finance",
            }
        )

    async def _send(self, token: str, title: str, body: str, data: Optional[Dict] = None) -> bool:
        """Internal: Send an FCM message."""
        if not self.fcm_available:
            logger.info(f"[MOCK FCM] → {title}: {body}")
            return True

        try:
            message = self.messaging.Message(
                notification=self.messaging.Notification(
                    title=title,
                    body=body,
                ),
                data=data or {},
                token=token,
                android=self.messaging.AndroidConfig(
                    priority="high",
                    notification=self.messaging.AndroidNotification(
                        channel_id="sovereign_default",
                        icon="ic_notification",
                        color="#10E6E6",
                    ),
                ),
            )
            response = self.messaging.send(message)
            logger.info(f"FCM sent successfully: {response}")
            return True
        except Exception as e:
            logger.error(f"FCM send failed: {e}")
            return False

    async def send_to_topic(self, topic: str, title: str, body: str) -> bool:
        """Send notification to a topic (e.g., all PRO users)."""
        if not self.fcm_available:
            logger.info(f"[MOCK FCM TOPIC] {topic} → {title}: {body}")
            return True

        try:
            message = self.messaging.Message(
                notification=self.messaging.Notification(title=title, body=body),
                topic=topic,
            )
            self.messaging.send(message)
            return True
        except Exception as e:
            logger.error(f"FCM topic send failed: {e}")
            return False


notification_service = NotificationService()
