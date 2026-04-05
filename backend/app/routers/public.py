"""
SOVEREIGN 2030 — Public Router
Unauthenticated endpoints for Landing Page, pricing, and health checks.
"""
from fastapi import APIRouter, Depends
from google.cloud.firestore import Client

from ..dependencies import get_db

router = APIRouter(prefix="/v2/public", tags=["Public"])


@router.get("/stats", summary="Plattform-Statistiken")
async def get_platform_stats(db: Client = Depends(get_db)):
    """
    Öffentliche Plattform-Statistiken für die Landing Page.
    Keine Authentifizierung nötig.
    """
    try:
        doc = db.collection("platform").document("stats").get()
        if doc.exists:
            stats = doc.to_dict()
            return {
                "totalUsers": stats.get("totalUsers", 0),
                "totalContractsAnalyzed": stats.get("totalContractsAnalyzed", 0),
                "totalSavingsEur": stats.get("totalSavingsEur", 0),
                "lastUpdated": stats.get("lastUpdated"),
            }
    except Exception:
        pass

    return {
        "totalUsers": 0,
        "totalContractsAnalyzed": 0,
        "totalSavingsEur": 0,
    }


@router.get("/pricing", summary="Pricing-Daten")
async def get_pricing():
    """
    Vollständige Pricing-Daten für die Landing Page und In-App-Anzeige.
    Keine Authentifizierung nötig.
    """
    return {
        "tiers": [
            {
                "name": "FREE",
                "displayName": "Sovereign Free",
                "priceMonthlyEur": 0,
                "priceYearlyEur": 0,
                "features": [
                    "3 Verträge",
                    "Basis-Scan",
                    "1 Life-Case",
                    "Dashboard",
                    "5 AI-Chats/Tag",
                ],
                "limits": {
                    "contracts": 3,
                    "lifeCases": 1,
                    "aiChatsPerDay": 5,
                }
            },
            {
                "name": "PRO",
                "displayName": "Sovereign Pro",
                "priceMonthlyEur": 6.99,
                "priceYearlyEur": 69.90,
                "yearlyDiscountPercent": 17,
                "features": [
                    "Unbegrenzte Verträge",
                    "Deep Clause Engine",
                    "5 Life-Cases",
                    "Finance Guardian",
                    "50 AI-Chats/Tag",
                    "E-Mail-Analyse",
                    "Vertrags-Radar",
                    "Widget",
                ],
                "limits": {
                    "contracts": 999,
                    "lifeCases": 5,
                    "aiChatsPerDay": 50,
                }
            },
            {
                "name": "SHIELD",
                "displayName": "Sovereign Shield",
                "priceMonthlyEur": 14.99,
                "priceYearlyEur": 149.90,
                "yearlyDiscountPercent": 17,
                "features": [
                    "Alles aus PRO",
                    "Unbegrenzte AI-Chats",
                    "Execution Engine (Gmail)",
                    "Bank-Anbindung (PSD2)",
                    "Professional Shield (B2B)",
                    "Multi-User / Familie (5)",
                    "Gemini Live (Voice+Cam)",
                    "Priority Support",
                ],
                "limits": {
                    "contracts": 999,
                    "lifeCases": 999,
                    "aiChatsPerDay": 999,
                    "vaultMembers": 5,
                }
            }
        ],
        "addOns": [
            {
                "name": "Premium-Kündigung (Einschreiben)",
                "priceEur": 4.99,
                "description": "Rechtssichere Kündigung per Einschreiben"
            },
            {
                "name": "Rechtssichere Vorlage",
                "priceEur": 2.99,
                "description": "Anwaltlich geprüfte Dokumentenvorlage"
            },
        ],
        "claimsFeePercent": 25,
        "currency": "EUR",
    }


@router.get("/health", summary="Public Health Check")
async def public_health():
    """Öffentlicher Health-Check — für Monitoring und Uptime-Tests."""
    return {
        "status": "ok",
        "platform": "SOVEREIGN 2030",
    }
