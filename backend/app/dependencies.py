from fastapi import Depends, HTTPException, Header, Request
from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials, auth
from .config import config
import logging

logger = logging.getLogger("sovereign.auth")

# Firebase Initialization — graceful, never crashes the container
try:
    if not firebase_admin._apps:
        firebase_admin.initialize_app()
        logger.info("✅ Firebase Admin SDK initialized")
except Exception as e:
    logger.warning(f"⚠️ Firebase Admin init warning: {e}")

# Firestore Client
try:
    db = firestore.Client(project=config.GCP_PROJECT_ID)
    logger.info(f"✅ Firestore client ready (project: {config.GCP_PROJECT_ID})")
except Exception as e:
    logger.error(f"❌ Firestore client failed: {e}")
    db = None

async def verify_firebase_token(request: Request, authorization: str = Header(None)) -> dict:
    """
    Kompabilitätsschicht für Altsysteme. 
    Nutzt intern die neue auth-middleware.
    """
    from .middleware.auth import get_current_user
    return await get_current_user(request, authorization)

def get_db():
    if db is None:
        raise HTTPException(status_code=503, detail="Database unavailable")
    return db

