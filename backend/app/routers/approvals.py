"""
SOVEREIGN 2030 — Approvals Router
Human-in-the-Loop workflow for autonomous agent actions.

Security: Every approve/reject action is written to the AuditEventEmitter.
HIGH-risk approvals require biometric confirmation (enforced client-side;
server records the biometric_verified flag passed in the request body).
"""
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from google.cloud.firestore import Client
from typing import Optional

from ..middleware.auth import get_current_user
from ..middleware.tenant import resolve_tenant
from ..dependencies import get_db, get_audit_emitter
from ..models.approval import ApprovalResponse, ApprovalAction
from ..services.firestore_service import FirestoreService
from ..services.audit import AuditEventEmitter, AuditAction

router = APIRouter(prefix="/v2/approvals", tags=["Approvals"])


def _get_client_ip(request: Request) -> Optional[str]:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


@router.get("/", summary="Alle Approvals abrufen")
async def get_approvals(
    status: Optional[str] = Query(None, description="Filter: PENDING, APPROVED, REJECTED, EXPIRED"),
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    """Alle Approvals des Users, optional gefiltert nach Status."""
    fs = FirestoreService(db)
    approvals = fs.get_approvals(user["uid"], status=status)
    return {
        "approvals": approvals,
        "count": len(approvals),
        "pending_count": len([a for a in approvals if a.get("status") == "PENDING"]),
    }


@router.get("/pending", summary="Offene Approvals")
async def get_pending_approvals(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    """Nur offene (PENDING) Approvals — für Dashboard-Badge."""
    fs = FirestoreService(db)
    approvals = fs.get_approvals(user["uid"], status="PENDING")
    return {
        "approvals": approvals,
        "count": len(approvals),
    }


@router.get("/{approval_id}", summary="Einzelnes Approval abrufen")
async def get_approval(
    approval_id: str,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
):
    """Einzelnes Approval per ID abrufen."""
    fs = FirestoreService(db)
    approval = fs.get_approval(user["uid"], approval_id)
    if not approval:
        raise HTTPException(status_code=404, detail="Approval nicht gefunden")
    return approval


@router.post("/{approval_id}/approve", summary="Aktion genehmigen")
async def approve_action(
    approval_id: str,
    request: Request,
    action: Optional[ApprovalAction] = None,
    user: dict = Depends(get_current_user),
    tenant: dict = Depends(resolve_tenant),
    db: Client = Depends(get_db),
    audit: AuditEventEmitter = Depends(get_audit_emitter),
):
    """
    Agent-Aktion genehmigen.
    Nur PENDING Approvals können genehmigt werden.
    Schreibt Audit-Event mit Biometrie-Flag und Risk-Level.
    """
    fs = FirestoreService(db)

    # Load approval to capture risk level before updating
    approval_doc = fs.get_approval(user["uid"], approval_id)
    risk_level = approval_doc.get("riskLevel", "UNKNOWN") if approval_doc else "UNKNOWN"

    success = fs.update_approval_status(user["uid"], approval_id, "APPROVED")
    if not success:
        # Audit the failed attempt
        audit.emit(
            actor_uid=user["uid"],
            action=AuditAction.APPROVAL_APPROVED,
            resource_type="approval",
            resource_id=approval_id,
            tenant_id=tenant["tenant_id"],
            outcome="FAILURE",
            ip=_get_client_ip(request),
            metadata={"risk_level": risk_level, "error": "not_found_or_not_pending"},
        )
        raise HTTPException(
            status_code=400,
            detail="Approval nicht gefunden oder nicht im Status PENDING"
        )

    biometric_verified = action.biometric_verified if action else False

    await audit.emit_async(
        actor_uid=user["uid"],
        action=AuditAction.APPROVAL_APPROVED,
        resource_type="approval",
        resource_id=approval_id,
        tenant_id=tenant["tenant_id"],
        outcome="SUCCESS",
        ip=_get_client_ip(request),
        metadata={
            "risk_level": risk_level,
            "biometric_verified": biometric_verified,
            "agent_name": approval_doc.get("agentName") if approval_doc else None,
        },
    )

    return {"id": approval_id, "status": "APPROVED", "message": "Aktion genehmigt"}


@router.post("/{approval_id}/reject", summary="Aktion ablehnen")
async def reject_action(
    approval_id: str,
    request: Request,
    action: Optional[ApprovalAction] = None,
    user: dict = Depends(get_current_user),
    tenant: dict = Depends(resolve_tenant),
    db: Client = Depends(get_db),
    audit: AuditEventEmitter = Depends(get_audit_emitter),
):
    """
    Agent-Aktion ablehnen.
    Nur PENDING Approvals können abgelehnt werden.
    Schreibt Audit-Event mit Begründung.
    """
    fs = FirestoreService(db)

    approval_doc = fs.get_approval(user["uid"], approval_id)
    risk_level = approval_doc.get("riskLevel", "UNKNOWN") if approval_doc else "UNKNOWN"

    success = fs.update_approval_status(user["uid"], approval_id, "REJECTED")
    if not success:
        audit.emit(
            actor_uid=user["uid"],
            action=AuditAction.APPROVAL_REJECTED,
            resource_type="approval",
            resource_id=approval_id,
            tenant_id=tenant["tenant_id"],
            outcome="FAILURE",
            ip=_get_client_ip(request),
            metadata={"risk_level": risk_level, "error": "not_found_or_not_pending"},
        )
        raise HTTPException(
            status_code=400,
            detail="Approval nicht gefunden oder nicht im Status PENDING"
        )

    await audit.emit_async(
        actor_uid=user["uid"],
        action=AuditAction.APPROVAL_REJECTED,
        resource_type="approval",
        resource_id=approval_id,
        tenant_id=tenant["tenant_id"],
        outcome="SUCCESS",
        ip=_get_client_ip(request),
        metadata={
            "risk_level": risk_level,
            "agent_name": approval_doc.get("agentName") if approval_doc else None,
        },
    )

    return {"id": approval_id, "status": "REJECTED", "message": "Aktion abgelehnt"}
