from fastapi import APIRouter, Depends, Request, Header
from ..dependencies import verify_firebase_token, get_db
from ..services.brainstormer_core import brainstormer
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
async def brainstorm_session(payload: BrainstormInput, request: Request, user: dict = Depends(optional_auth)):
    """
    Ingests natural language from the user, updates the AgentMemory.
    Language is detected via I18nMiddleware in request.state.language.
    """
    lang = getattr(request.state, 'language', 'en')
    db = get_db()
    
    # We need a proper user for persistence, but fallback to anonymous-uid for now if strictly needed
    uid = user.get("uid", "anonymous-web")
    
    result = await brainstormer.assimilate_context(uid, payload.conversation_chunk, db)
    
    return {
        "status": "assimilated",
        "lang_detected": lang,
        "memories_created": result.get("memories", []),
        "count": result.get("count", 0)
    }

@router.post("/senate/review")
async def request_senate_review(payload: SenateReviewInput, request: Request, user: dict = Depends(verify_firebase_token)):
    """
    Used by internal subsystems or client app to double-check an action.
    Requires authentication.
    """
    lang = getattr(request.state, 'language', 'en')
    review = await brainstormer.review_proposal(payload.agent_name, payload.proposal, lang)
    return review

