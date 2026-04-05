"""
SOVEREIGN 2030 — Firebase Authentication Middleware
Production-hardened token verification with graceful local fallback.
"""
from fastapi import Depends, HTTPException, Header, Request
from firebase_admin import auth as firebase_auth
from typing import Optional
from ..config import config
import logging

logger = logging.getLogger("sovereign.auth")


async def get_current_user(
    request: Request,
    authorization: str = Header(...)
) -> dict:
    """
    Verifiziert das Firebase ID-Token aus dem Authorization-Header.
    Gibt den dekodierten Token zurück (enthält uid, email, etc.)
    
    In local environment: Graceful fallback auf Mock-User wenn Token ungültig.
    In production: Strict enforcement — kein Token = 401.
    """
    if not authorization.startswith("Bearer "):
        if config.ENVIRONMENT == "local":
            logger.warning("No Bearer token in local mode — using mock user")
            return {"uid": "local-dev-mock-uid", "email": "dev@sovereign.local", "tier": "SHIELD"}
        raise HTTPException(
            status_code=401,
            detail="Authorization header must start with 'Bearer '"
        )

    token = authorization.split("Bearer ")[1]

    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(status_code=401, detail="Token expired — bitte erneut anmelden")
    except firebase_auth.RevokedIdTokenError:
        raise HTTPException(status_code=401, detail="Token revoked — Zugang widerrufen")
    except firebase_auth.InvalidIdTokenError:
        if config.ENVIRONMENT == "local":
            logger.warning("Invalid token in local mode — using mock user")
            return {"uid": "local-dev-mock-uid", "email": "dev@sovereign.local", "tier": "SHIELD"}
        raise HTTPException(status_code=401, detail="Invalid token")
    except Exception as e:
        if config.ENVIRONMENT == "local":
            logger.warning(f"Token verification failed locally, using mock: {e}")
            return {"uid": "local-dev-mock-uid", "email": "dev@sovereign.local", "tier": "SHIELD"}
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")


async def get_optional_user(
    request: Request,
    authorization: Optional[str] = Header(None)
) -> Optional[dict]:
    """
    Optionale Authentifizierung — für Public-Endpoints mit optionalem Login.
    Gibt None zurück wenn kein Token vorhanden.
    """
    if authorization is None or not authorization.startswith("Bearer "):
        return None

    try:
        return await get_current_user(request, authorization)
    except HTTPException:
        return None
