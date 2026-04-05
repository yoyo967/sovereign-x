"""
SOVEREIGN 2030 — Billing Router
Stripe subscription management, checkout, webhooks, and customer portal.
"""
from fastapi import APIRouter, Depends, HTTPException, Request, Query
from google.cloud.firestore import Client

from ..middleware.auth import get_current_user
from ..dependencies import get_db
from ..services.stripe_service import stripe_service
from ..services.firestore_service import FirestoreService

router = APIRouter(prefix="/v2/billing", tags=["Billing"])

VALID_PLANS = ["PRO_MONTHLY", "PRO_YEARLY", "SHIELD_MONTHLY", "SHIELD_YEARLY"]


@router.post("/create-checkout", summary="Stripe Checkout Session erstellen")
async def create_checkout_session(
    plan: str = Query(..., description="Plan: PRO_MONTHLY, PRO_YEARLY, SHIELD_MONTHLY, SHIELD_YEARLY"),
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Erstellt eine Stripe Checkout Session für den gewählten Plan.
    Leitet den User zum Stripe-Zahlungsformular weiter.
    """
    if plan not in VALID_PLANS:
        raise HTTPException(
            status_code=400,
            detail=f"Ungültiger Plan: {plan}. Erlaubt: {', '.join(VALID_PLANS)}"
        )

    uid = user["uid"]
    fs = FirestoreService(db)
    profile = fs.get_user_profile(uid)

    # Stripe Customer erstellen oder vorhandenen verwenden
    customer_id = None
    if profile:
        customer_id = profile.get("stripeCustomerId")

    if not customer_id:
        customer_id = stripe_service.create_customer(
            email=user.get("email", ""),
            uid=uid
        )
        fs.update_user_profile(uid, {"stripeCustomerId": customer_id})

    result = stripe_service.create_checkout_session(
        customer_id=customer_id,
        plan=plan,
        uid=uid,
    )

    return result


@router.post("/webhook", summary="Stripe Webhook Handler")
async def stripe_webhook(request: Request, db: Client = Depends(get_db)):
    """
    Stripe Webhook — aktualisiert User-Tier bei Subscription-Änderungen.
    Wird von Stripe automatisch aufgerufen (kein Auth nötig).
    """
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")

    try:
        result = stripe_service.handle_webhook_event(payload, sig_header)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    # User-Tier in Firestore aktualisieren
    if result.get("uid") and result.get("tier"):
        fs = FirestoreService(db)
        fs.update_user_profile(result["uid"], {
            "tier": result["tier"],
            "stripeSubscriptionId": result.get("subscription_id"),
        })

    return {"status": "ok", "event_type": result.get("event_type")}


@router.get("/subscription", summary="Aktuellen Subscription-Status abrufen")
async def get_subscription(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Aktuellen Subscription-Status mit Tier und Ablaufdatum."""
    fs = FirestoreService(db)
    profile = fs.get_user_profile(user["uid"])

    if not profile:
        return {"tier": "FREE", "subscription": None}

    tier = profile.get("tier", "FREE")
    sub_id = profile.get("stripeSubscriptionId")

    subscription = None
    if sub_id:
        subscription = stripe_service.get_subscription(sub_id)

    return {"tier": tier, "subscription": subscription}


@router.post("/portal", summary="Stripe Kundenportal öffnen")
async def create_portal_session(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Erstellt eine Stripe Customer Portal Session.
    Dort kann der User seine Zahlungsmethode ändern oder kündigen.
    """
    fs = FirestoreService(db)
    profile = fs.get_user_profile(user["uid"])

    if not profile or not profile.get("stripeCustomerId"):
        raise HTTPException(
            status_code=404,
            detail="Kein Stripe-Konto gefunden. Bitte erst einen Plan abonnieren."
        )

    portal_url = stripe_service.create_portal_session(profile["stripeCustomerId"])
    return {"portal_url": portal_url}
