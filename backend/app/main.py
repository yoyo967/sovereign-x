"""
SOVEREIGN 2030 — FastAPI Main Application
Unified Backend for Mobile App, Web App & Landing Page.

Standard: Google C-Level Architecture | EU AI Act Compliant
Version: 2.0.0 | 9 Router-Gruppen | 35+ Endpoints
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import firebase_admin
from google.cloud import firestore
from .config import config
from .middleware.i18n_middleware import I18nMiddleware
from .middleware.rate_limit import RateLimitMiddleware
from .routers import ai, contracts, approvals, claims, finance, user, billing, family, public
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(name)s | %(levelname)s | %(message)s",
)
logger = logging.getLogger("sovereign")


# ═══════════════════════════════════════════
# LIFESPAN — Startup / Shutdown
# ═══════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle management — Firebase + Firestore init."""
    # ── STARTUP ──
    try:
        if not firebase_admin._apps:
            firebase_admin.initialize_app()
            logger.info("✅ Firebase Admin SDK initialized")
    except Exception as e:
        logger.warning(f"⚠️ Firebase Admin init warning: {e}")

    try:
        db = firestore.Client(project=config.GCP_PROJECT_ID)
        logger.info(f"✅ Firestore client ready (project: {config.GCP_PROJECT_ID})")
    except Exception as e:
        logger.warning(f"⚠️ Firestore client init: {e}")

    logger.info(f"🔱 SOVEREIGN Backend v{config.VERSION} started")
    logger.info(f"   Environment: {config.ENVIRONMENT}")
    logger.info(f"   Project: {config.GCP_PROJECT_ID}")
    logger.info(f"   Region: {config.REGION}")
    logger.info(f"   Routers: 9 active (ai, contracts, approvals, claims, finance, user, billing, family, public)")

    yield

    # ── SHUTDOWN ──
    logger.info("🔱 SOVEREIGN Backend shutting down")


# ═══════════════════════════════════════════
# APP INITIALIZATION
# ═══════════════════════════════════════════

app = FastAPI(
    title=config.PROJECT_NAME,
    version=config.VERSION,
    description="Sovereign AI C-Level Backend API — The Engine. 9 Routers, 35+ Endpoints.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# ═══════════════════════════════════════════
# MIDDLEWARE (order matters: last added = first executed)
# ═══════════════════════════════════════════

# CORS — Production-hardened
ALLOWED_ORIGINS = config.ALLOWED_ORIGINS_PRODUCTION.copy()
if config.ENVIRONMENT == "local":
    ALLOWED_ORIGINS.extend(config.ALLOWED_ORIGINS_LOCAL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Rate Limiting (AI endpoints)
app.add_middleware(RateLimitMiddleware)

# Internationalization
app.add_middleware(I18nMiddleware)


# ═══════════════════════════════════════════
# ROUTERS — 9 Groups, 35+ Endpoints
# ═══════════════════════════════════════════

# 🤖 AI & Brainstormer (Authenticated + Optional Auth)
app.include_router(ai.router)

# 📋 Core Business Logic (Authenticated)
app.include_router(contracts.router)
app.include_router(approvals.router)
app.include_router(claims.router)

# 💰 Finance & Banking (Authenticated, Tier-Gated)
app.include_router(finance.router)

# 👤 User Management (Authenticated)
app.include_router(user.router)

# 💳 Billing & Subscriptions (Authenticated + Webhook)
app.include_router(billing.router)

# 👨‍👩‍👧‍👦 Family Vault (SHIELD-only)
app.include_router(family.router)

# 🌍 Public (No Auth — Landing Page, Pricing)
app.include_router(public.router)


# ═══════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════

@app.get("/health", tags=["System"])
async def health_check():
    """System Health Check — für Monitoring und Load Balancer."""
    return {
        "status": "ok",
        "environment": config.ENVIRONMENT,
        "version": config.VERSION,
        "platform": "SOVEREIGN 2030",
        "routers": [
            "ai", "contracts", "approvals", "claims",
            "finance", "user", "billing", "family", "public"
        ],
    }
