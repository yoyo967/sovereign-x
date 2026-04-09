"""
SOVEREIGN 2030 — TenantContextResolver Middleware
Resolves tenant context from X-Tenant-ID header and writes it to request.state.

Design principles:
- Tenant ID is validated against Firestore tenants collection
- request.state.tenant_id is set for all authenticated requests
- For FREE-tier solo users without a tenant, personal namespace is used (uid-based)
- Never trust client-supplied tenant IDs without validation
"""
from fastapi import Depends, HTTPException, Header, Request
from google.cloud.firestore import Client
from typing import Optional
from ..dependencies import get_db
from ..middleware.auth import get_current_user
import logging

logger = logging.getLogger("sovereign.tenant")

# Sentinel used when the user has no tenant (solo / FREE tier)
SOLO_TENANT_PREFIX = "solo"


def get_solo_tenant_id(uid: str) -> str:
    """Personal-namespace tenant ID for non-tenanted users (FREE tier)."""
    return f"{SOLO_TENANT_PREFIX}_{uid}"


async def resolve_tenant(
    request: Request,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db),
    x_tenant_id: Optional[str] = Header(None, alias="X-Tenant-ID"),
) -> dict:
    """
    FastAPI dependency: resolves and validates tenant context.

    Sets on request.state:
        tenant_id (str)     — validated Firestore tenant ID or solo_{uid}
        role_scopes (list)  — scopes from tenants/{id}/members/{uid}
        is_solo (bool)      — True when operating in personal namespace

    Returns the validated tenant context dict for use in route handlers.

    Usage:
        @router.get("/resource")
        async def handler(tenant: dict = Depends(resolve_tenant)):
            tid = tenant["tenant_id"]
    """
    uid = user["uid"]

    # ── Case 1: No tenant header → solo namespace ──────────────────
    if not x_tenant_id:
        solo_id = get_solo_tenant_id(uid)
        ctx = {
            "tenant_id": solo_id,
            "role_scopes": ["user:read", "user:write"],
            "is_solo": True,
        }
        _write_to_request_state(request, ctx)
        return ctx

    # ── Case 2: Tenant header present → validate membership ────────
    try:
        member_doc = (
            db.collection("tenants")
            .document(x_tenant_id)
            .collection("members")
            .document(uid)
            .get()
        )
    except Exception as e:
        logger.error(f"Firestore error reading tenant membership: {e}")
        raise HTTPException(status_code=503, detail="Tenant validation temporarily unavailable")

    if not member_doc.exists:
        logger.warning(f"User {uid} attempted access to tenant {x_tenant_id} without membership")
        raise HTTPException(
            status_code=403,
            detail="Access denied — not a member of this tenant"
        )

    member_data = member_doc.to_dict() or {}
    role = member_data.get("role", "viewer")
    scopes = member_data.get("scopes", _default_scopes_for_role(role))

    # Check tenant is not frozen
    try:
        tenant_doc = db.collection("tenants").document(x_tenant_id).get()
        if tenant_doc.exists:
            tenant_data = tenant_doc.to_dict() or {}
            if tenant_data.get("status") == "frozen":
                raise HTTPException(
                    status_code=403,
                    detail="Tenant is currently suspended. Contact your administrator."
                )
    except HTTPException:
        raise
    except Exception as e:
        logger.warning(f"Could not check tenant status: {e}")

    ctx = {
        "tenant_id": x_tenant_id,
        "role": role,
        "role_scopes": scopes,
        "is_solo": False,
    }
    _write_to_request_state(request, ctx)
    return ctx


def _write_to_request_state(request: Request, ctx: dict) -> None:
    """Write resolved tenant context to request.state for downstream access."""
    request.state.tenant_id = ctx["tenant_id"]
    request.state.role_scopes = ctx["role_scopes"]
    request.state.is_solo = ctx.get("is_solo", False)


def _default_scopes_for_role(role: str) -> list[str]:
    """Default scope set per tenant role. Server-authoritative."""
    role_map = {
        "admin": ["tenant:admin", "user:read", "user:write", "user:export", "user:ai", "user:biometric"],
        "marketing": ["tenant:marketing", "user:read", "user:export"],
        "viewer": ["tenant:viewer", "user:read"],
        "member": ["user:read", "user:write", "user:ai"],
    }
    return role_map.get(role, ["user:read"])


def require_tenant_scope(scope: str):
    """
    Returns a FastAPI dependency that checks for a required scope in tenant context.

    Usage:
        @router.delete("/resource")
        async def handler(
            tenant: dict = Depends(resolve_tenant),
            _: None = Depends(require_tenant_scope("tenant:admin"))
        ):
    """
    async def _check(
        request: Request,
        tenant: dict = Depends(resolve_tenant),
    ):
        scopes = tenant.get("role_scopes", [])
        # platform:admin always has all scopes
        if "platform:admin" in scopes:
            return
        # tenant:admin has all non-platform scopes
        if "tenant:admin" in scopes and not scope.startswith("platform:"):
            return
        if scope not in scopes:
            raise HTTPException(
                status_code=403,
                detail=f"Insufficient permissions — required scope: {scope}"
            )

    return _check
