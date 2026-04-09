from fastapi import APIRouter, Depends, Request, Header
from ..dependencies import verify_firebase_token, get_db, get_audit_emitter
from ..services.brainstormer_core import brainstormer
from ..services.ai_output import ai_output_hardener
from ..services.audit import AuditEventEmitter, AuditAction
from ..config import config
from pydantic import BaseModel
from typing import Optional
import json

router = APIRouter(prefix="/v2/ai", tags=["Brainstormer & AI"])


class BrainstormInput(BaseModel):
    conversation_chunk: str


class SenateReviewInput(BaseModel):
    agent_name: str
    proposal: dict


async def optional_auth(request: Request, authorization: str = Header(None)) -> dict:
    """Optional auth: returns user dict if token present, else anonymous."""
    if authorization and authorization.startswith("Bearer "):
        return await verify_firebase_token(request, authorization)
    return {"uid": "anonymous-web", "email": "anonymous@sovereign.web"}


@router.post("/brainstorm")
async def brainstorm_session(
    payload: BrainstormInput,
    request: Request,
    user: dict = Depends(optional_auth),
    audit: AuditEventEmitter = Depends(get_audit_emitter),
):
    """
    Ingests natural language from the user, updates the AgentMemory.
    Language is detected via I18nMiddleware in request.state.language.
    All AI outputs pass through AIOutputHardener before returning.
    """
    lang = getattr(request.state, "language", "en")
    db = get_db()
    uid = user.get("uid", "anonymous-web")

    result = await brainstormer.assimilate_context(uid, payload.conversation_chunk, db)

    # Harden the AI output
    raw_text = json.dumps(result.get("memories", []))
    hardened = ai_output_hardener.harden(
        text=raw_text,
        confidence=result.get("confidence", 0.75),
        action_type="brainstorm",
        locale=lang,
        raw_input=payload.conversation_chunk,
    )

    # Audit the AI session (async, non-blocking)
    tenant_id = getattr(request.state, "tenant_id", f"solo_{uid}")
    await audit.emit_async(
        actor_uid=uid,
        action=AuditAction.AI_BRAINSTORM_SESSION,
        resource_type="ai_session",
        resource_id=hardened.input_hash,
        tenant_id=tenant_id,
        outcome="SUCCESS",
        metadata={
            "confidence": hardened.confidence,
            "risk_class": hardened.risk_class,
            "pii_detected": hardened.pii_detected,
            "eu_ai_act_compliant": hardened.eu_ai_act_compliant,
            "memories_created": result.get("count", 0),
        },
    )

    return {
        "status": "assimilated",
        "lang_detected": lang,
        "memories_created": result.get("memories", []),
        "count": result.get("count", 0),
        # AI Act compliance fields
        "ai_disclaimer": hardened.disclaimer,
        "confidence": hardened.confidence,
        "uncertainty_label": hardened.uncertainty_label,
        "human_approval_required": hardened.human_approval_required,
        "eu_ai_act_compliant": hardened.eu_ai_act_compliant,
    }


@router.post("/senate/review")
async def request_senate_review(
    payload: SenateReviewInput,
    request: Request,
    user: dict = Depends(verify_firebase_token),
    audit: AuditEventEmitter = Depends(get_audit_emitter),
):
    """
    Used by internal subsystems or client app to double-check an action.
    Requires authentication. Output is hardened before return.
    """
    lang = getattr(request.state, "language", "en")
    review = await brainstormer.review_proposal(payload.agent_name, payload.proposal, lang)

    # Determine action type from proposal for risk classification
    action_type = payload.proposal.get("type", "brainstorm")
    review_text = json.dumps(review) if isinstance(review, dict) else str(review)

    hardened = ai_output_hardener.harden(
        text=review_text,
        confidence=review.get("confidence", 0.8) if isinstance(review, dict) else 0.8,
        action_type=action_type,
        locale=lang,
        raw_input=json.dumps(payload.proposal),
    )

    tenant_id = getattr(request.state, "tenant_id", f"solo_{user['uid']}")
    await audit.emit_async(
        actor_uid=user["uid"],
        action=AuditAction.AI_BRAINSTORM_SESSION,
        resource_type="senate_review",
        resource_id=hardened.input_hash,
        tenant_id=tenant_id,
        metadata={
            "agent_name": payload.agent_name,
            "risk_class": hardened.risk_class,
            "confidence": hardened.confidence,
            "pii_detected": hardened.pii_detected,
            "human_approval_required": hardened.human_approval_required,
        },
    )

    if isinstance(review, dict):
        review["ai_disclaimer"] = hardened.disclaimer
        review["human_approval_required"] = hardened.human_approval_required
        review["risk_class"] = hardened.risk_class
        review["eu_ai_act_compliant"] = hardened.eu_ai_act_compliant

    return review
