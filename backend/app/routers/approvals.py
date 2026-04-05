"""
SOVEREIGN 2030 — Approvals Router
Human-in-the-Loop workflow for autonomous agent actions.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from google.cloud.firestore import Client
from typing import Optional

from ..middleware.auth import get_current_user
from ..dependencies import get_db
from ..models.approval import ApprovalResponse, ApprovalAction
from ..services.firestore_service import FirestoreService

router = APIRouter(prefix="/v2/approvals", tags=["Approvals"])


@router.get("/", summary="Alle Approvals abrufen")
async def get_approvals(
    status: Optional[str] = Query(None, description="Filter: PENDING, APPROVED, REJECTED, EXPIRED"),
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
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
    db: Client = Depends(get_db)
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
    db: Client = Depends(get_db)
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
    action: Optional[ApprovalAction] = None,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Agent-Aktion genehmigen.
    Nur PENDING Approvals können genehmigt werden.
    """
    fs = FirestoreService(db)
    success = fs.update_approval_status(user["uid"], approval_id, "APPROVED")
    if not success:
        raise HTTPException(
            status_code=400,
            detail="Approval nicht gefunden oder nicht im Status PENDING"
        )
    return {"id": approval_id, "status": "APPROVED", "message": "Aktion genehmigt"}


@router.post("/{approval_id}/reject", summary="Aktion ablehnen")
async def reject_action(
    approval_id: str,
    action: Optional[ApprovalAction] = None,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Agent-Aktion ablehnen.
    Nur PENDING Approvals können abgelehnt werden.
    """
    fs = FirestoreService(db)
    success = fs.update_approval_status(user["uid"], approval_id, "REJECTED")
    if not success:
        raise HTTPException(
            status_code=400,
            detail="Approval nicht gefunden oder nicht im Status PENDING"
        )
    return {"id": approval_id, "status": "REJECTED", "message": "Aktion abgelehnt"}
