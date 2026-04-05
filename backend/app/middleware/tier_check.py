"""
SOVEREIGN 2030 — Tier-Check Middleware
Gates features behind PRO and SHIELD subscription tiers.
"""
from fastapi import Depends, HTTPException
from ..middleware.auth import get_current_user
from ..dependencies import get_db
from google.cloud.firestore import Client
import logging

logger = logging.getLogger("sovereign.tier")


async def _get_user_tier(user: dict, db: Client) -> str:
    """Reads the user tier from Firestore. Returns 'FREE' if not found."""
    try:
        profile = db.collection("users").document(user["uid"]).collection("profile").document("main").get()
        if profile.exists:
            return profile.to_dict().get("tier", "FREE")
        # Fallback: check if tier is in the token (set by local mock)
        return user.get("tier", "FREE")
    except Exception as e:
        logger.warning(f"Could not read user tier: {e}")
        return user.get("tier", "FREE")


async def require_pro(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
) -> dict:
    """
    Erfordert mindestens PRO-Tier.
    Erlaubt: PRO, SHIELD.
    Blockt: FREE.
    """
    tier = await _get_user_tier(user, db)
    
    if tier not in ("PRO", "SHIELD"):
        raise HTTPException(
            status_code=403,
            detail="Diese Funktion erfordert SOVEREIGN PRO oder SHIELD. Upgrade unter /billing."
        )
    user["tier"] = tier
    return user


async def require_shield(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
) -> dict:
    """
    Erfordert SHIELD-Tier.
    Erlaubt: SHIELD.
    Blockt: FREE, PRO.
    """
    tier = await _get_user_tier(user, db)
    
    if tier != "SHIELD":
        raise HTTPException(
            status_code=403,
            detail="Diese Funktion erfordert SOVEREIGN SHIELD. Upgrade unter /billing."
        )
    user["tier"] = tier
    return user


async def get_user_with_tier(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
) -> dict:
    """
    Fügt das aktuelle Tier zum User-Dict hinzu, ohne zu blocken.
    Nützlich für Endpoints wo verhalten sich nach Tier unterscheidet.
    """
    tier = await _get_user_tier(user, db)
    user["tier"] = tier
    return user
