"""
SOVEREIGN 2030 — Claims Router
Forderungsmanagement (Flugentschädigung, Preiserhöhungen, etc.)
PRO/SHIELD Feature.
"""
from fastapi import APIRouter, Depends, HTTPException
from google.cloud.firestore import Client

from ..middleware.auth import get_current_user
from ..middleware.tier_check import require_pro
from ..dependencies import get_db
from ..models.claim import ClaimCreate, ClaimResponse
from ..services.firestore_service import FirestoreService

router = APIRouter(prefix="/v2/claims", tags=["Claims"])

# Sovereign Fee: 25% auf erfolgreiche Claims
SOVEREIGN_CLAIMS_FEE_PERCENT = 25


@router.get("/", summary="Alle Claims abrufen")
async def get_claims(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Alle Claims des Users abrufen."""
    fs = FirestoreService(db)
    claims = fs.get_claims(user["uid"])

    # Statistiken berechnen
    resolved = [c for c in claims if c.get("status") == "RESOLVED"]
    total_payout = sum(c.get("userPayoutEur", 0) for c in resolved)

    return {
        "claims": claims,
        "count": len(claims),
        "resolvedCount": len(resolved),
        "totalPayoutEur": round(total_payout, 2),
    }


@router.get("/{claim_id}", summary="Einzelnen Claim abrufen")
async def get_claim(
    claim_id: str,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Einzelnen Claim per ID abrufen."""
    fs = FirestoreService(db)
    claim = fs.get_claim(user["uid"], claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim nicht gefunden")
    return claim


@router.post("/", status_code=201, summary="Neuen Claim erstellen")
async def create_claim(
    claim: ClaimCreate,
    user: dict = Depends(require_pro),
    db: Client = Depends(get_db)
):
    """
    Neuen Claim erstellen. Erfordert PRO oder SHIELD.
    SOVEREIGN erhebt 25% Fee auf erfolgreiche Claims.
    """
    fs = FirestoreService(db)
    data = claim.model_dump()

    # Fee berechnen
    if data.get("compensationEur", 0) > 0:
        fee = round(data["compensationEur"] * SOVEREIGN_CLAIMS_FEE_PERCENT / 100, 2)
        data["sovereignFeeEur"] = fee
        data["userPayoutEur"] = round(data["compensationEur"] - fee, 2)

    claim_id = fs.create_claim(user["uid"], data)
    return {
        "id": claim_id,
        "status": "created",
        "estimatedPayoutEur": data.get("userPayoutEur", 0),
        "sovereignFeePercent": SOVEREIGN_CLAIMS_FEE_PERCENT,
    }
