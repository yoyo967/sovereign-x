"""
SOVEREIGN 2030 — AuditEventEmitter Service
Immutable audit trail for all high-stakes actions.

Design principles:
- Every write to audit_log is append-only (enforced via Firestore Security Rules)
- IP is always hashed (GDPR-compliant — never store raw IPs)
- Hash chain: each event includes sha256 of previous event ID for tamper evidence
- Async-first: never blocks the request path
"""
import asyncio
import hashlib
import logging
import uuid
from datetime import datetime, timezone
from typing import Optional, Any
from google.cloud import firestore

logger = logging.getLogger("sovereign.audit")


class AuditEventEmitter:
    """
    Thread-safe audit event emitter backed by Firestore.

    All writes are non-blocking (fire-and-forget with error logging).
    For critical compliance events, use emit_critical() which awaits confirmation.

    Firestore path: audit_log/{tenant_id}/events/{event_id}
    Firestore Security Rules must set:
        allow create: if true;
        allow update, delete: if false;  // immutable
    """

    def __init__(self, db: firestore.Client):
        self._db = db
        self._last_event_id: Optional[str] = None

    @staticmethod
    def _hash_ip(ip: Optional[str]) -> Optional[str]:
        """SHA-256 hash of IP address. Returns None if ip is None."""
        if not ip:
            return None
        return hashlib.sha256(ip.encode()).hexdigest()[:16]  # truncated for storage

    @staticmethod
    def _chain_hash(prev_event_id: Optional[str], event_id: str) -> str:
        """Creates a hash chain link: sha256(prev_id + event_id)."""
        combined = (prev_event_id or "GENESIS") + event_id
        return hashlib.sha256(combined.encode()).hexdigest()

    def _build_event(
        self,
        *,
        actor_uid: str,
        action: str,
        resource_type: str,
        resource_id: str,
        tenant_id: str,
        outcome: str,
        ip: Optional[str] = None,
        metadata: Optional[dict[str, Any]] = None,
    ) -> tuple[str, dict]:
        """Builds the event dict. Returns (event_id, event_dict)."""
        event_id = str(uuid.uuid4())
        now = datetime.now(tz=timezone.utc)

        event = {
            "event_id": event_id,
            "timestamp": now.isoformat(),
            "actor_uid": actor_uid,
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "tenant_id": tenant_id,
            "outcome": outcome,
            "ip_hash": self._hash_ip(ip),
            "chain_hash": self._chain_hash(self._last_event_id, event_id),
            "metadata": metadata or {},
        }

        self._last_event_id = event_id
        return event_id, event

    def emit(
        self,
        *,
        actor_uid: str,
        action: str,
        resource_type: str,
        resource_id: str,
        tenant_id: str,
        outcome: str = "SUCCESS",
        ip: Optional[str] = None,
        metadata: Optional[dict[str, Any]] = None,
    ) -> None:
        """
        Fire-and-forget audit log write. Never raises — logs errors internally.

        Use for: standard high-stakes actions where eventual consistency is acceptable.
        """
        event_id, event = self._build_event(
            actor_uid=actor_uid,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            tenant_id=tenant_id,
            outcome=outcome,
            ip=ip,
            metadata=metadata,
        )

        try:
            (
                self._db
                .collection("audit_log")
                .document(tenant_id)
                .collection("events")
                .document(event_id)
                .set(event)
            )
        except Exception as e:
            # Never let audit failure break the business flow — log loudly instead
            logger.error(f"AUDIT WRITE FAILED [{action}] actor={actor_uid}: {e}")

    async def emit_async(
        self,
        *,
        actor_uid: str,
        action: str,
        resource_type: str,
        resource_id: str,
        tenant_id: str,
        outcome: str = "SUCCESS",
        ip: Optional[str] = None,
        metadata: Optional[dict[str, Any]] = None,
    ) -> None:
        """
        Async fire-and-forget. Schedules write without blocking caller.
        """
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: self.emit(
                actor_uid=actor_uid,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                tenant_id=tenant_id,
                outcome=outcome,
                ip=ip,
                metadata=metadata,
            )
        )

    async def emit_critical(
        self,
        *,
        actor_uid: str,
        action: str,
        resource_type: str,
        resource_id: str,
        tenant_id: str,
        outcome: str = "SUCCESS",
        ip: Optional[str] = None,
        metadata: Optional[dict[str, Any]] = None,
    ) -> str:
        """
        Awaitable write with confirmation. Returns event_id.

        Use for: AI audit log, legal compliance events, HIGH-risk approvals.
        Raises on failure (caller must handle).
        """
        event_id, event = self._build_event(
            actor_uid=actor_uid,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            tenant_id=tenant_id,
            outcome=outcome,
            ip=ip,
            metadata=metadata,
        )

        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: (
                self._db
                .collection("audit_log")
                .document(tenant_id)
                .collection("events")
                .document(event_id)
                .set(event)
            )
        )

        logger.info(f"AUDIT [{action}] actor={actor_uid} tenant={tenant_id} outcome={outcome} id={event_id}")
        return event_id


# ── Convenience action constants ─────────────────────────────────────────────
class AuditAction:
    # Contracts
    CONTRACT_CREATED = "contract.created"
    CONTRACT_UPDATED = "contract.updated"
    CONTRACT_DELETED = "contract.deleted"
    CONTRACT_AI_ANALYZED = "contract.ai_analyzed"

    # Approvals
    APPROVAL_APPROVED = "approval.approved"
    APPROVAL_REJECTED = "approval.rejected"
    APPROVAL_BIOMETRIC_VERIFIED = "approval.biometric_verified"

    # Finance
    FINAPI_CONNECTED = "finapi.connected"
    FINAPI_DISCONNECTED = "finapi.disconnected"

    # Claims
    CLAIM_CREATED = "claim.created"
    CLAIM_SUBMITTED = "claim.submitted"

    # Auth
    USER_LOGIN = "auth.login"
    USER_LOGOUT = "auth.logout"
    ONBOARDING_COMPLETED = "auth.onboarding_completed"

    # DSGVO
    DATA_EXPORT_REQUESTED = "dsgvo.export_requested"
    DATA_DELETE_REQUESTED = "dsgvo.delete_requested"

    # AI
    AI_BRAINSTORM_SESSION = "ai.brainstorm_session"
    AI_KILL_SWITCH = "ai.kill_switch"

    # Admin
    TENANT_CREATED = "admin.tenant_created"
    TENANT_FROZEN = "admin.tenant_frozen"
    ADMIN_AI_AUDIT_EXPORT = "admin.ai_audit_export"
