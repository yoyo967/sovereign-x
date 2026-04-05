"""
SOVEREIGN 2030 — Family Router
Multi-User Vault system for families and groups.
SHIELD-only feature.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from google.cloud.firestore import Client

from ..middleware.auth import get_current_user
from ..middleware.tier_check import require_shield
from ..dependencies import get_db
from ..services.firestore_service import FirestoreService

router = APIRouter(prefix="/v2/family", tags=["Family"])

MAX_VAULT_MEMBERS = 5


@router.post("/vault", status_code=201, summary="Family Vault erstellen")
async def create_vault(
    name: str = Query(..., min_length=1, max_length=100, description="Vault-Name"),
    user: dict = Depends(require_shield),
    db: Client = Depends(get_db)
):
    """
    Neuen Family Vault erstellen. Erfordert SHIELD.
    Der Ersteller wird automatisch ADMIN.
    Max. 5 Mitglieder pro Vault.
    """
    fs = FirestoreService(db)

    # Check ob User bereits einen Vault besitzt
    existing = fs.get_user_vaults(user["uid"])
    owned = [v for v in existing if v.get("ownerId") == user["uid"]]
    if len(owned) >= 1:
        raise HTTPException(
            status_code=400,
            detail="Du hast bereits einen Family Vault. Max. 1 Vault pro SHIELD-Account."
        )

    vault_id = fs.create_vault(owner_uid=user["uid"], name=name)
    return {"id": vault_id, "status": "created", "name": name}


@router.get("/vault", summary="Eigene Vaults abrufen")
async def get_my_vaults(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Alle Vaults in denen der User Mitglied ist."""
    fs = FirestoreService(db)
    vaults = fs.get_user_vaults(user["uid"])
    return {"vaults": vaults, "count": len(vaults)}


@router.get("/vault/{vault_id}", summary="Vault-Details abrufen")
async def get_vault(
    vault_id: str,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Vault-Details inkl. Mitglieder abrufen."""
    fs = FirestoreService(db)

    # Check membership
    if not fs.is_vault_member(vault_id, user["uid"]):
        raise HTTPException(status_code=403, detail="Kein Zugriff auf diesen Vault")

    vault = fs.get_vault(vault_id)
    if not vault:
        raise HTTPException(status_code=404, detail="Vault nicht gefunden")

    return vault


@router.post("/vault/{vault_id}/invite", summary="Mitglied einladen")
async def invite_member(
    vault_id: str,
    email: str = Query(..., description="E-Mail des einzuladenden Mitglieds"),
    role: str = Query("MEMBER", description="Rolle: MEMBER oder VIEWER"),
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """
    Mitglied per E-Mail zum Vault einladen.
    Nur ADMINs können einladen. Max. 5 Mitglieder.
    Einladung ist 7 Tage gültig.
    """
    fs = FirestoreService(db)

    if not fs.is_vault_admin(vault_id, user["uid"]):
        raise HTTPException(status_code=403, detail="Nur ADMIN kann Mitglieder einladen")

    # Check member limit
    vault = fs.get_vault(vault_id)
    if vault and len(vault.get("members", [])) >= MAX_VAULT_MEMBERS:
        raise HTTPException(
            status_code=400,
            detail=f"Maximale Mitgliederzahl erreicht ({MAX_VAULT_MEMBERS})"
        )

    if role not in ("MEMBER", "VIEWER"):
        raise HTTPException(status_code=400, detail="Rolle muss MEMBER oder VIEWER sein")

    invite_id = fs.create_invite(
        vault_id=vault_id,
        invited_by=user["uid"],
        email=email,
        role=role,
    )

    return {
        "id": invite_id,
        "status": "invited",
        "email": email,
        "role": role,
        "expiresInDays": 7,
    }


@router.get("/invites", summary="Einladungen abrufen")
async def get_my_invites(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Alle offenen Einladungen für die E-Mail des Users."""
    email = user.get("email")
    if not email:
        return {"invites": [], "count": 0}

    fs = FirestoreService(db)
    invites = fs.get_invites_for_email(email)
    return {"invites": invites, "count": len(invites)}


@router.post("/invites/{invite_id}/accept", summary="Einladung annehmen")
async def accept_invite(
    invite_id: str,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Vault-Einladung annehmen und Mitglied werden."""
    fs = FirestoreService(db)

    # Get invite
    email = user.get("email")
    invites = fs.get_invites_for_email(email) if email else []
    invite = next((i for i in invites if i.get("id") == invite_id), None)

    if not invite:
        raise HTTPException(status_code=404, detail="Einladung nicht gefunden oder abgelaufen")

    # Add as member
    fs.add_vault_member(
        vault_id=invite["vaultId"],
        uid=user["uid"],
        role=invite.get("role", "MEMBER"),
    )

    return {
        "status": "accepted",
        "vaultId": invite["vaultId"],
        "role": invite.get("role", "MEMBER"),
    }


@router.post("/vault/{vault_id}/share-contract", summary="Vertrag mit Vault teilen")
async def share_contract(
    vault_id: str,
    contract_id: str = Query(..., description="ID des zu teilenden Vertrags"),
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Eigenen Vertrag mit dem Family Vault teilen."""
    fs = FirestoreService(db)

    if not fs.is_vault_member(vault_id, user["uid"]):
        raise HTTPException(status_code=403, detail="Kein Zugriff auf diesen Vault")

    # Verify contract exists
    contract = fs.get_contract(user["uid"], contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail="Vertrag nicht gefunden")

    # Share in vault
    db.collection("vaults").document(vault_id).collection("sharedContracts").document(contract_id).set({
        **contract,
        "sharedBy": user["uid"],
        "sharedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc),
    })

    # Mark contract as shared
    fs.update_contract(user["uid"], contract_id, {"sharedWithVault": vault_id})

    return {"status": "shared", "contractId": contract_id, "vaultId": vault_id}
