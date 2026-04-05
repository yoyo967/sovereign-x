"""
SOVEREIGN 2030 — Firestore Service
Centralized Firestore CRUD operations with type safety.
"""
from google.cloud.firestore import Client
from google.cloud import firestore
from datetime import datetime, timezone
from typing import Optional, List, Dict, Any
import logging

logger = logging.getLogger("sovereign.firestore")


class FirestoreService:
    """Centralized Firestore data layer — all DB operations go through here."""

    def __init__(self, db: Client):
        self.db = db

    # ═══════════════════════════════════════
    # USER PROFILE
    # ═══════════════════════════════════════

    def get_user_profile(self, uid: str) -> Optional[dict]:
        doc = self.db.collection("users").document(uid).collection("profile").document("main").get()
        return doc.to_dict() if doc.exists else None

    def create_user_profile(self, uid: str, data: dict) -> None:
        data["createdAt"] = datetime.now(timezone.utc)
        self.db.collection("users").document(uid).collection("profile").document("main").set(data)

    def update_user_profile(self, uid: str, data: dict) -> None:
        self.db.collection("users").document(uid).collection("profile").document("main").set(data, merge=True)

    # ═══════════════════════════════════════
    # USER SETTINGS
    # ═══════════════════════════════════════

    def get_user_settings(self, uid: str) -> Optional[dict]:
        doc = self.db.collection("users").document(uid).collection("settings").document("main").get()
        return doc.to_dict() if doc.exists else None

    def update_user_settings(self, uid: str, data: dict) -> None:
        self.db.collection("users").document(uid).collection("settings").document("main").set(data, merge=True)

    # ═══════════════════════════════════════
    # CONTRACTS
    # ═══════════════════════════════════════

    def get_contracts(self, uid: str, status: Optional[str] = None, category: Optional[str] = None) -> List[dict]:
        ref = self.db.collection("users").document(uid).collection("contracts")
        if status:
            ref = ref.where("status", "==", status)
        if category:
            ref = ref.where("category", "==", category)
        ref = ref.order_by("updatedAt", direction=firestore.Query.DESCENDING)
        return [{"id": doc.id, **doc.to_dict()} for doc in ref.stream()]

    def get_contract(self, uid: str, contract_id: str) -> Optional[dict]:
        doc = self.db.collection("users").document(uid).collection("contracts").document(contract_id).get()
        return {"id": doc.id, **doc.to_dict()} if doc.exists else None

    def create_contract(self, uid: str, data: dict) -> str:
        now = datetime.now(timezone.utc)
        data["createdAt"] = now
        data["updatedAt"] = now
        _, ref = self.db.collection("users").document(uid).collection("contracts").add(data)
        return ref.id

    def update_contract(self, uid: str, contract_id: str, data: dict) -> bool:
        ref = self.db.collection("users").document(uid).collection("contracts").document(contract_id)
        if not ref.get().exists:
            return False
        data["updatedAt"] = datetime.now(timezone.utc)
        ref.set(data, merge=True)
        return True

    def delete_contract(self, uid: str, contract_id: str) -> bool:
        ref = self.db.collection("users").document(uid).collection("contracts").document(contract_id)
        if not ref.get().exists:
            return False
        ref.delete()
        return True

    def count_contracts(self, uid: str) -> int:
        try:
            result = self.db.collection("users").document(uid).collection("contracts").count().get()
            return result[0][0].value
        except Exception:
            docs = list(self.db.collection("users").document(uid).collection("contracts").stream())
            return len(docs)

    # ═══════════════════════════════════════
    # APPROVALS
    # ═══════════════════════════════════════

    def get_approvals(self, uid: str, status: Optional[str] = None) -> List[dict]:
        ref = self.db.collection("users").document(uid).collection("approvals")
        if status:
            ref = ref.where("status", "==", status)
        ref = ref.order_by("createdAt", direction=firestore.Query.DESCENDING)
        return [{"id": doc.id, **doc.to_dict()} for doc in ref.stream()]

    def get_approval(self, uid: str, approval_id: str) -> Optional[dict]:
        doc = self.db.collection("users").document(uid).collection("approvals").document(approval_id).get()
        return {"id": doc.id, **doc.to_dict()} if doc.exists else None

    def create_approval(self, uid: str, data: dict) -> str:
        now = datetime.now(timezone.utc)
        data["status"] = "PENDING"
        data["createdAt"] = now
        # Approvals expire in 48 hours
        from datetime import timedelta
        data["expiresAt"] = now + timedelta(hours=48)
        _, ref = self.db.collection("users").document(uid).collection("approvals").add(data)
        return ref.id

    def update_approval_status(self, uid: str, approval_id: str, status: str) -> bool:
        ref = self.db.collection("users").document(uid).collection("approvals").document(approval_id)
        doc = ref.get()
        if not doc.exists:
            return False
        if doc.to_dict().get("status") != "PENDING":
            return False  # Can only update pending approvals
        ref.update({"status": status, "resolvedAt": datetime.now(timezone.utc)})
        return True

    # ═══════════════════════════════════════
    # CLAIMS
    # ═══════════════════════════════════════

    def get_claims(self, uid: str) -> List[dict]:
        ref = self.db.collection("users").document(uid).collection("claims")
        ref = ref.order_by("filedAt", direction=firestore.Query.DESCENDING)
        return [{"id": doc.id, **doc.to_dict()} for doc in ref.stream()]

    def get_claim(self, uid: str, claim_id: str) -> Optional[dict]:
        doc = self.db.collection("users").document(uid).collection("claims").document(claim_id).get()
        return {"id": doc.id, **doc.to_dict()} if doc.exists else None

    def create_claim(self, uid: str, data: dict) -> str:
        data["status"] = "DETECTED"
        data["filedAt"] = datetime.now(timezone.utc)
        data["resolvedAt"] = None
        data["userPayoutEur"] = 0.0
        data["sovereignFeeEur"] = 0.0
        _, ref = self.db.collection("users").document(uid).collection("claims").add(data)
        return ref.id

    # ═══════════════════════════════════════
    # TRANSACTIONS
    # ═══════════════════════════════════════

    def get_transactions(self, uid: str, limit: int = 100) -> List[dict]:
        ref = self.db.collection("users").document(uid).collection("transactions")
        ref = ref.order_by("bookingDate", direction=firestore.Query.DESCENDING).limit(limit)
        return [{"id": doc.id, **doc.to_dict()} for doc in ref.stream()]

    def create_transaction(self, uid: str, data: dict) -> str:
        _, ref = self.db.collection("users").document(uid).collection("transactions").add(data)
        return ref.id

    def bulk_create_transactions(self, uid: str, transactions: List[dict]) -> int:
        batch = self.db.batch()
        col_ref = self.db.collection("users").document(uid).collection("transactions")
        count = 0
        for tx in transactions:
            doc_ref = col_ref.document()
            batch.set(doc_ref, tx)
            count += 1
            if count % 500 == 0:
                batch.commit()
                batch = self.db.batch()
        if count % 500 != 0:
            batch.commit()
        return count

    # ═══════════════════════════════════════
    # INSIGHTS
    # ═══════════════════════════════════════

    def get_insights(self, uid: str, actionable_only: bool = False) -> List[dict]:
        ref = self.db.collection("users").document(uid).collection("insights")
        if actionable_only:
            ref = ref.where("isActionable", "==", True)
        ref = ref.order_by("timestamp", direction=firestore.Query.DESCENDING)
        return [{"id": doc.id, **doc.to_dict()} for doc in ref.stream()]

    # ═══════════════════════════════════════
    # SAVINGS
    # ═══════════════════════════════════════

    def get_savings(self, uid: str) -> List[dict]:
        ref = self.db.collection("users").document(uid).collection("savings")
        ref = ref.order_by("achievedAt", direction=firestore.Query.DESCENDING)
        return [{"id": doc.id, **doc.to_dict()} for doc in ref.stream()]

    def get_total_savings(self, uid: str) -> float:
        savings = self.get_savings(uid)
        return sum(s.get("savingAmountEur", 0) for s in savings)

    def record_saving(self, uid: str, data: dict) -> str:
        data["achievedAt"] = datetime.now(timezone.utc)
        _, ref = self.db.collection("users").document(uid).collection("savings").add(data)
        return ref.id

    # ═══════════════════════════════════════
    # FAMILY VAULT
    # ═══════════════════════════════════════

    def create_vault(self, owner_uid: str, name: str) -> str:
        now = datetime.now(timezone.utc)
        _, ref = self.db.collection("vaults").add({
            "name": name,
            "ownerId": owner_uid,
            "createdAt": now,
        })
        # Add owner as ADMIN member
        self.db.collection("vaults").document(ref.id).collection("members").document(owner_uid).set({
            "userId": owner_uid,
            "role": "ADMIN",
            "joinedAt": now,
        })
        return ref.id

    def get_vault(self, vault_id: str) -> Optional[dict]:
        doc = self.db.collection("vaults").document(vault_id).get()
        if not doc.exists:
            return None
        vault = {"id": doc.id, **doc.to_dict()}
        # Fetch members
        members = self.db.collection("vaults").document(vault_id).collection("members").stream()
        vault["members"] = [{"id": m.id, **m.to_dict()} for m in members]
        return vault

    def is_vault_member(self, vault_id: str, uid: str) -> bool:
        doc = self.db.collection("vaults").document(vault_id).collection("members").document(uid).get()
        return doc.exists

    def is_vault_admin(self, vault_id: str, uid: str) -> bool:
        doc = self.db.collection("vaults").document(vault_id).collection("members").document(uid).get()
        if not doc.exists:
            return False
        return doc.to_dict().get("role") == "ADMIN"

    def add_vault_member(self, vault_id: str, uid: str, role: str = "MEMBER") -> None:
        self.db.collection("vaults").document(vault_id).collection("members").document(uid).set({
            "userId": uid,
            "role": role,
            "joinedAt": datetime.now(timezone.utc),
        })

    def get_user_vaults(self, uid: str) -> List[dict]:
        """Get all vaults where user is a member."""
        vaults = []
        all_vaults = self.db.collection("vaults").stream()
        for v in all_vaults:
            member_doc = self.db.collection("vaults").document(v.id).collection("members").document(uid).get()
            if member_doc.exists:
                vaults.append({"id": v.id, **v.to_dict()})
        return vaults

    # ═══════════════════════════════════════
    # INVITES
    # ═══════════════════════════════════════

    def create_invite(self, vault_id: str, invited_by: str, email: str, role: str = "MEMBER") -> str:
        import secrets
        now = datetime.now(timezone.utc)
        from datetime import timedelta
        data = {
            "vaultId": vault_id,
            "invitedBy": invited_by,
            "email": email,
            "role": role,
            "token": secrets.token_urlsafe(32),
            "createdAt": now,
            "expiresAt": now + timedelta(days=7),
        }
        _, ref = self.db.collection("invites").add(data)
        return ref.id

    def get_invites_for_email(self, email: str) -> List[dict]:
        ref = self.db.collection("invites").where("email", "==", email)
        return [{"id": doc.id, **doc.to_dict()} for doc in ref.stream()]

    # ═══════════════════════════════════════
    # PLATFORM STATS
    # ═══════════════════════════════════════

    def get_platform_stats(self) -> dict:
        doc = self.db.collection("platform").document("stats").get()
        if doc.exists:
            return doc.to_dict()
        return {
            "totalUsers": 0,
            "totalContractsAnalyzed": 0,
            "totalSavingsEur": 0,
        }
