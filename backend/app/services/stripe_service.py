"""
SOVEREIGN 2030 — Stripe Service
Subscription management, checkout sessions, and webhook handling.
"""
from ..config import config
from typing import Optional
import logging

logger = logging.getLogger("sovereign.stripe")

def _get_price_ids() -> dict:
    """Load Price IDs from config (set via Cloud Run env vars)."""
    return {
        "PRO_MONTHLY": config.STRIPE_PRICE_PRO_MONTHLY,
        "PRO_YEARLY": config.STRIPE_PRICE_PRO_YEARLY,
        "SHIELD_MONTHLY": config.STRIPE_PRICE_SHIELD_MONTHLY,
        "SHIELD_YEARLY": config.STRIPE_PRICE_SHIELD_YEARLY,
    }


class StripeService:
    """Stripe subscription management layer."""

    def __init__(self):
        self.stripe = None
        try:
            import stripe
            if config.STRIPE_SECRET_KEY:
                stripe.api_key = config.STRIPE_SECRET_KEY
                self.stripe = stripe
                logger.info("✅ Stripe initialized")
            else:
                logger.warning("⚠️ Stripe key not configured — running in mock mode")
        except ImportError:
            logger.warning("⚠️ Stripe package not available")

    def _is_available(self) -> bool:
        return self.stripe is not None and config.STRIPE_SECRET_KEY is not None

    def create_customer(self, email: str, uid: str) -> Optional[str]:
        """Create a Stripe customer and return the customer ID."""
        if not self._is_available():
            logger.info(f"[MOCK] Would create Stripe customer for {email}")
            return f"cus_mock_{uid[:8]}"

        customer = self.stripe.Customer.create(
            email=email,
            metadata={"firebase_uid": uid}
        )
        return customer.id

    def create_checkout_session(
        self,
        customer_id: str,
        plan: str,
        uid: str,
        success_url: str = None,
        cancel_url: str = None,
    ) -> dict:
        """Create a Stripe Checkout Session for subscription."""
        price_ids = _get_price_ids()
        if plan not in price_ids:
            raise ValueError(f"Invalid plan: {plan}")

        if not success_url:
            success_url = f"{config.APP_BASE_URL}/dashboard/billing?success=1&session_id={{CHECKOUT_SESSION_ID}}"
        if not cancel_url:
            cancel_url = f"{config.APP_BASE_URL}/dashboard/billing?cancelled=1"

        if not self._is_available():
            logger.info(f"[MOCK] Would create checkout for plan={plan}, customer={customer_id}")
            return {
                "checkout_url": f"https://checkout.stripe.com/mock/{plan}",
                "session_id": f"cs_mock_{uid[:8]}_{plan}",
            }

        session = self.stripe.checkout.Session.create(
            customer=customer_id,
            payment_method_types=["card", "sepa_debit"],
            line_items=[{"price": price_ids[plan], "quantity": 1}],
            mode="subscription",
            success_url=success_url,
            cancel_url=cancel_url,
            metadata={"firebase_uid": uid},
        )
        return {"checkout_url": session.url, "session_id": session.id}

    def create_portal_session(self, customer_id: str) -> Optional[str]:
        """Create a Stripe Customer Portal session for self-service management."""
        if not self._is_available():
            logger.info(f"[MOCK] Would create portal session for customer={customer_id}")
            return "https://billing.stripe.com/mock/portal"

        session = self.stripe.billing_portal.Session.create(
            customer=customer_id,
            return_url=f"{config.APP_BASE_URL}/dashboard/settings",
        )
        return session.url

    def get_subscription(self, subscription_id: str) -> Optional[dict]:
        """Retrieve subscription status."""
        if not self._is_available():
            return {
                "status": "active",
                "current_period_end": None,
                "cancel_at_period_end": False,
            }

        try:
            sub = self.stripe.Subscription.retrieve(subscription_id)
            return {
                "status": sub.status,
                "current_period_end": sub.current_period_end,
                "cancel_at_period_end": sub.cancel_at_period_end,
            }
        except Exception as e:
            logger.error(f"Failed to retrieve subscription {subscription_id}: {e}")
            return None

    def handle_webhook_event(self, payload: bytes, sig_header: str) -> dict:
        """
        Process a Stripe webhook event.
        Returns dict with: event_type, uid, tier, subscription_id
        """
        if not self._is_available():
            return {"event_type": "mock", "uid": None, "tier": None}

        try:
            event = self.stripe.Webhook.construct_event(
                payload, sig_header, config.STRIPE_WEBHOOK_SECRET
            )
        except (ValueError, self.stripe.error.SignatureVerificationError):
            raise ValueError("Invalid webhook signature")

        result = {"event_type": event["type"], "uid": None, "tier": None, "subscription_id": None}

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            uid = session.get("metadata", {}).get("firebase_uid")
            subscription = self.stripe.Subscription.retrieve(session["subscription"])
            price_id = subscription["items"]["data"][0]["price"]["id"]
            price_ids = _get_price_ids()

            tier = "FREE"
            if price_id in (price_ids["PRO_MONTHLY"], price_ids["PRO_YEARLY"]):
                tier = "PRO"
            elif price_id in (price_ids["SHIELD_MONTHLY"], price_ids["SHIELD_YEARLY"]):
                tier = "SHIELD"

            result.update({"uid": uid, "tier": tier, "subscription_id": subscription.id})

        elif event["type"] == "customer.subscription.deleted":
            subscription = event["data"]["object"]
            customer = self.stripe.Customer.retrieve(subscription["customer"])
            uid = customer.get("metadata", {}).get("firebase_uid")
            result.update({"uid": uid, "tier": "FREE", "subscription_id": subscription.id})

        return result

    def determine_tier_from_plan(self, plan: str) -> str:
        """Map plan name to tier."""
        if "SHIELD" in plan.upper():
            return "SHIELD"
        elif "PRO" in plan.upper():
            return "PRO"
        return "FREE"


stripe_service = StripeService()
