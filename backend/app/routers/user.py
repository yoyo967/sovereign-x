"""
SOVEREIGN 2030 — User Router
Profile, settings, boundary conditions, onboarding, and dashboard.
"""
from fastapi import APIRouter, Depends, HTTPException
from google.cloud.firestore import Client
from datetime import datetime, timezone

from ..middleware.auth import get_current_user
from ..middleware.tier_check import get_user_with_tier
from ..dependencies import get_db
from ..models.user import (
    UserProfileResponse, UserProfileUpdate,
    UserSettingsResponse, UserSettingsUpdate,
    OnboardRequest, DashboardResponse, BoundaryConditions
)
from ..services.firestore_service import FirestoreService

router = APIRouter(prefix="/v2/user", tags=["User"])


@router.get("/profile", summary="Profil abrufen")
async def get_profile(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """User-Profil abrufen."""
    fs = FirestoreService(db)
    profile = fs.get_user_profile(user["uid"])

    if not profile:
        # Auto-create basic profile from auth token
        return {
            "uid": user["uid"],
            "email": user.get("email"),
            "displayName": user.get("name", user.get("email", "").split("@")[0]),
            "tier": "FREE",
            "preferredLanguage": "de",
            "createdAt": None,
            "_needsOnboarding": True,
        }

    profile["uid"] = user["uid"]
    return profile


@router.put("/profile", summary="Profil aktualisieren")
async def update_profile(
    update: UserProfileUpdate,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """User-Profil aktualisieren (nur gesetzte Felder)."""
    fs = FirestoreService(db)
    data = update.model_dump(exclude_unset=True)
    if not data:
        raise HTTPException(status_code=400, detail="Keine Änderungen angegeben")

    fs.update_user_profile(user["uid"], data)
    return {"status": "updated", "fields": list(data.keys())}


@router.post("/onboard", status_code=201, summary="Initiales Profil erstellen")
async def onboard_user(
    request: OnboardRequest,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Initiales User-Profil erstellen beim Onboarding.
    Erstellt Profil + Default-Settings + Boundary Conditions.
    """
    fs = FirestoreService(db)

    # Profil erstellen
    fs.create_user_profile(user["uid"], {
        "displayName": request.displayName,
        "email": user.get("email", ""),
        "tier": "FREE",
        "preferredLanguage": request.preferredLanguage,
        "stripeCustomerId": None,
        "stripeSubscriptionId": None,
    })

    # Default-Settings erstellen
    default_boundary = BoundaryConditions()
    fs.update_user_settings(user["uid"], {
        "boundaryConditions": default_boundary.model_dump(),
        "connectedAccounts": {
            "gmail": False,
            "finapi": False,
            "finapiConsentExpiry": None,
        }
    })

    return {
        "status": "onboarded",
        "uid": user["uid"],
        "tier": "FREE",
    }


@router.get("/settings", summary="Einstellungen abrufen")
async def get_settings(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """User-Einstellungen inkl. Boundary Conditions abrufen."""
    fs = FirestoreService(db)
    settings = fs.get_user_settings(user["uid"])

    if not settings:
        # Return defaults
        default_boundary = BoundaryConditions()
        return {
            "boundaryConditions": default_boundary.model_dump(),
            "connectedAccounts": {
                "gmail": False,
                "finapi": False,
                "finapiConsentExpiry": None,
            }
        }

    return settings


@router.put("/settings", summary="Einstellungen aktualisieren")
async def update_settings(
    update: UserSettingsUpdate,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    User-Einstellungen aktualisieren.
    Enthält Boundary Conditions für autonome Agenten.
    """
    fs = FirestoreService(db)
    data = {}

    if update.boundaryConditions:
        data["boundaryConditions"] = update.boundaryConditions.model_dump()
    if update.connectedAccounts:
        data["connectedAccounts"] = update.connectedAccounts.model_dump()

    if not data:
        raise HTTPException(status_code=400, detail="Keine Änderungen angegeben")

    fs.update_user_settings(user["uid"], data)
    return {"status": "updated", "sections": list(data.keys())}


@router.get("/dashboard", summary="Dashboard-Aggregation")
async def get_dashboard(
    user: dict = Depends(get_user_with_tier),
    db: Client = Depends(get_db)
):
    """
    Aggregierte Dashboard-Daten: Verträge, Kosten, Savings, Approvals, Claims.
    Optimiert für einen einzigen API-Call vom Frontend.
    """
    uid = user["uid"]
    tier = user.get("tier", "FREE")
    fs = FirestoreService(db)

    # Contracts
    contracts = fs.get_contracts(uid)
    active_contracts = [c for c in contracts if c.get("status") == "ACTIVE"]
    total_monthly = sum(c.get("monthlyPriceEur", 0) for c in active_contracts)

    # Approvals
    pending_approvals = fs.get_approvals(uid, status="PENDING")

    # Savings
    total_savings = fs.get_total_savings(uid)

    # Claims
    claims = fs.get_claims(uid)
    active_claims = [c for c in claims if c.get("status") not in ("RESOLVED", "CLOSED")]

    # Insights (recent)
    recent_insights = []
    try:
        insights = fs.get_insights(uid)
        recent_insights = insights[:5]
    except Exception:
        pass

    return {
        "tier": tier,
        "totalContracts": len(contracts),
        "activeContracts": len(active_contracts),
        "totalMonthlyCostEur": round(total_monthly, 2),
        "totalAnnualCostEur": round(total_monthly * 12, 2),
        "totalSavingsEur": round(total_savings, 2),
        "pendingApprovals": len(pending_approvals),
        "activeClaims": len(active_claims),
        "recentInsights": recent_insights,
    }
