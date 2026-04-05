"""
SOVEREIGN 2030 — Contracts Router
Full CRUD + filtering + tier-based limits for contract management.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, Query
from google.cloud.firestore import Client
from typing import Optional
from datetime import datetime, timezone

from ..middleware.auth import get_current_user
from ..middleware.tier_check import get_user_with_tier
from ..dependencies import get_db
from ..models.contract import (
    ContractCreate, ContractUpdate, ContractResponse,
    ContractAnalysisRequest, MarketComparisonRequest
)
from ..services.firestore_service import FirestoreService

router = APIRouter(prefix="/v2/contracts", tags=["Contracts"])

# Tier-basierte Limits
CONTRACT_LIMITS = {"FREE": 3, "PRO": 999, "SHIELD": 999}


@router.get("/", summary="Alle Verträge abrufen")
async def get_contracts(
    request: Request,
    status: Optional[str] = Query(None, description="Filter: ACTIVE, CANCELLED, etc."),
    category: Optional[str] = Query(None, description="Filter: TELECOM, INSURANCE, etc."),
    user: dict = Depends(get_user_with_tier),
    db: Client = Depends(get_db)
):
    """Alle Verträge des authentifizierten Users mit optionalen Filtern."""
    uid = user["uid"]
    fs = FirestoreService(db)
    contracts = fs.get_contracts(uid, status=status, category=category)
    return {
        "contracts": contracts,
        "count": len(contracts),
        "tier": user.get("tier", "FREE"),
        "lang": getattr(request.state, 'language', 'en'),
    }


@router.get("/{contract_id}", summary="Einzelnen Vertrag abrufen")
async def get_contract(
    contract_id: str,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Einzelnen Vertrag per ID abrufen."""
    fs = FirestoreService(db)
    contract = fs.get_contract(user["uid"], contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Vertrag nicht gefunden")
    return contract


@router.post("/", status_code=201, summary="Neuen Vertrag anlegen")
async def create_contract(
    contract: ContractCreate,
    user: dict = Depends(get_user_with_tier),
    db: Client = Depends(get_db)
):
    """
    Neuen Vertrag anlegen.
    FREE-Tier: Max 3 Verträge.
    PRO/SHIELD: Unbegrenzt.
    """
    uid = user["uid"]
    tier = user.get("tier", "FREE")
    fs = FirestoreService(db)

    # Tier-basiertes Limit prüfen
    count = fs.count_contracts(uid)
    limit = CONTRACT_LIMITS.get(tier, 3)
    if count >= limit:
        raise HTTPException(
            status_code=403,
            detail=f"Limit erreicht ({limit} Verträge für {tier}). Upgrade auf PRO für unbegrenzte Verträge."
        )

    data = contract.model_dump()
    contract_id = fs.create_contract(uid, data)
    return {"id": contract_id, "status": "created"}


@router.put("/{contract_id}", summary="Vertrag aktualisieren")
async def update_contract(
    contract_id: str,
    update: ContractUpdate,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Vertrag aktualisieren (nur gesetzte Felder)."""
    fs = FirestoreService(db)
    data = update.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="Keine Änderungen angegeben")

    success = fs.update_contract(user["uid"], contract_id, data)
    if not success:
        raise HTTPException(status_code=404, detail="Vertrag nicht gefunden")
    return {"id": contract_id, "status": "updated"}


@router.delete("/{contract_id}", summary="Vertrag löschen")
async def delete_contract(
    contract_id: str,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Vertrag löschen."""
    fs = FirestoreService(db)
    success = fs.delete_contract(user["uid"], contract_id)
    if not success:
        raise HTTPException(status_code=404, detail="Vertrag nicht gefunden")
    return {"status": "deleted"}


@router.get("/summary/stats", summary="Vertrags-Statistiken")
async def get_contract_stats(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Aggregierte Statistiken über alle Verträge des Users."""
    fs = FirestoreService(db)
    contracts = fs.get_contracts(user["uid"])

    active = [c for c in contracts if c.get("status") == "ACTIVE"]
    total_monthly = sum(c.get("monthlyPriceEur", 0) for c in active)

    categories = {}
    for c in active:
        cat = c.get("category", "OTHER")
        categories[cat] = categories.get(cat, 0) + c.get("monthlyPriceEur", 0)

    return {
        "totalContracts": len(contracts),
        "activeContracts": len(active),
        "totalMonthlyCostEur": round(total_monthly, 2),
        "totalAnnualCostEur": round(total_monthly * 12, 2),
        "costByCategory": categories,
    }
