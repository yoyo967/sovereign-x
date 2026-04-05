"""
SOVEREIGN 2030 — Configuration
Centralized settings with environment-aware defaults.
"""
from pydantic_settings import BaseSettings
from typing import Optional, List
import os


class Settings(BaseSettings):
    # ═══════════════════════════════════════
    # PROJECT
    # ═══════════════════════════════════════
    PROJECT_NAME: str = "SOVEREIGN Platform API"
    VERSION: str = "2.0.0"
    GCP_PROJECT_ID: str = "opus-magnum-ai"
    REGION: str = "us-central1"
    ENVIRONMENT: str = os.environ.get("K_SERVICE", "") and "production" or "local"

    # ═══════════════════════════════════════
    # CORS
    # ═══════════════════════════════════════
    ALLOWED_ORIGINS_PRODUCTION: List[str] = [
        "https://opus-magnum-ai.web.app",
        "https://opus-magnum-ai.firebaseapp.com",
        "https://sovereign.de",
        "https://app.sovereign.de",
    ]
    ALLOWED_ORIGINS_LOCAL: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
    ]

    # ═══════════════════════════════════════
    # SECRETS & API KEYS
    # ═══════════════════════════════════════
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None
    FINAPI_CLIENT_ID: Optional[str] = None
    FINAPI_CLIENT_SECRET: Optional[str] = None
    FINAPI_BASE_URL: str = "https://sandbox.finapi.io"
    GEMINI_API_KEY: Optional[str] = None

    # ═══════════════════════════════════════
    # STRIPE PRICE IDs (set via Cloud Run env vars)
    # ═══════════════════════════════════════
    STRIPE_PRICE_PRO_MONTHLY: str = "price_PRO_MONTHLY_PLACEHOLDER"
    STRIPE_PRICE_PRO_YEARLY: str = "price_PRO_YEARLY_PLACEHOLDER"
    STRIPE_PRICE_SHIELD_MONTHLY: str = "price_SHIELD_MONTHLY_PLACEHOLDER"
    STRIPE_PRICE_SHIELD_YEARLY: str = "price_SHIELD_YEARLY_PLACEHOLDER"

    # ═══════════════════════════════════════
    # APP URLS (update when domain is live)
    # ═══════════════════════════════════════
    APP_BASE_URL: str = "https://opus-magnum-ai.web.app"

    # ═══════════════════════════════════════
    # GEMINI / AI
    # ═══════════════════════════════════════
    GEMINI_MODEL: str = "gemini-2.5-flash"
    GEMINI_MODEL_PRO: str = "gemini-2.5-pro"

    # ═══════════════════════════════════════
    # INTERNATIONALIZATION
    # ═══════════════════════════════════════
    DEFAULT_LANGUAGE: str = "en"
    SUPPORTED_LANGUAGES: List[str] = ["en", "de", "tr", "ru", "ar"]

    # ═══════════════════════════════════════
    # RATE LIMITING
    # ═══════════════════════════════════════
    RATE_LIMIT_AI_PER_MINUTE: int = 50
    RATE_LIMIT_GENERAL_PER_MINUTE: int = 120

    class Config:
        env_file = ".env"


config = Settings()
