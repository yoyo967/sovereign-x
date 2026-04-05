"""
SOVEREIGN 2030 — Finance Router
Transactions, insights, bank connections, and financial summaries.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from google.cloud.firestore import Client
from typing import Optional, List

from ..middleware.auth import get_current_user
from ..middleware.tier_check import require_pro, require_shield
from ..dependencies import get_db
from ..models.finance import (
    TransactionCreate, TransactionResponse, InsightResponse,
    BankConnectionRequest, FinanceSummary
)
from ..services.firestore_service import FirestoreService
from ..services.finapi_service import finapi_service

router = APIRouter(prefix="/v2/finance", tags=["Finance"])


@router.get("/transactions", summary="Transaktionen abrufen")
async def get_transactions(
    limit: int = Query(100, ge=1, le=500),
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Alle Transaktionen des Users (sortiert nach Buchungsdatum)."""
    fs = FirestoreService(db)
    transactions = fs.get_transactions(user["uid"], limit=limit)
    return {
        "transactions": transactions,
        "count": len(transactions),
    }


@router.post("/transactions", status_code=201, summary="Transaktion manuell hinzufügen")
async def create_transaction(
    tx: TransactionCreate,
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Manuelle Transaktion hinzufügen."""
    fs = FirestoreService(db)
    data = tx.model_dump()
    tx_id = fs.create_transaction(user["uid"], data)
    return {"id": tx_id, "status": "created"}


@router.post("/transactions/import-csv", status_code=201, summary="CSV-Transaktionen importieren")
async def import_csv_transactions(
    transactions: List[TransactionCreate],
    user: dict = Depends(require_pro),
    db: Client = Depends(get_db)
):
    """
    Bulk-Import von Transaktionen (z.B. aus Bank-CSV).
    Erfordert PRO oder SHIELD.
    """
    fs = FirestoreService(db)
    data_list = [tx.model_dump() for tx in transactions]
    count = fs.bulk_create_transactions(user["uid"], data_list)
    return {
        "imported": count,
        "status": "imported",
    }


@router.get("/insights", summary="Finance Guardian Insights")
async def get_insights(
    actionable_only: bool = Query(False, description="Nur handlungsrelevante Insights"),
    user: dict = Depends(require_pro),
    db: Client = Depends(get_db)
):
    """
    KI-generierte Finanz-Insights (Preiserhöhungen, neue Abos, etc.)
    Erfordert PRO oder SHIELD.
    """
    fs = FirestoreService(db)
    insights = fs.get_insights(user["uid"], actionable_only=actionable_only)
    return {
        "insights": insights,
        "count": len(insights),
    }


@router.get("/summary", summary="Finanzübersicht")
async def get_finance_summary(
    user: dict = Depends(get_current_user),
    db: Client = Depends(get_db)
):
    """Aggregierte Finanzübersicht des Users."""
    fs = FirestoreService(db)
    transactions = fs.get_transactions(user["uid"], limit=500)

    total_income = sum(t.get("amount", 0) for t in transactions if t.get("amount", 0) > 0)
    total_expenses = sum(t.get("amount", 0) for t in transactions if t.get("amount", 0) < 0)

    # Top merchants by spending
    merchant_spending = {}
    for t in transactions:
        if t.get("amount", 0) < 0:
            name = t.get("counterpartName", "Unbekannt")
            merchant_spending[name] = merchant_spending.get(name, 0) + abs(t.get("amount", 0))

    top_merchants = sorted(
        [{"name": k, "totalEur": round(v, 2)} for k, v in merchant_spending.items()],
        key=lambda x: x["totalEur"],
        reverse=True
    )[:10]

    return {
        "totalIncomeEur": round(total_income, 2),
        "totalExpensesEur": round(abs(total_expenses), 2),
        "netBalanceEur": round(total_income + total_expenses, 2),
        "transactionCount": len(transactions),
        "topMerchants": top_merchants,
    }


@router.post("/connect-bank", summary="Bank verbinden (PSD2)")
async def connect_bank(
    request: BankConnectionRequest,
    user: dict = Depends(require_shield),
    db: Client = Depends(get_db)
):
    """
    PSD2 Bankverbindung initiieren via finAPI Web Form.
    Erfordert SHIELD-Tier.
    
    ⚠️ Aktuell SIMULIERT (memory.md Rule #20):
    Exakte PSD2-Datenstrukturen, aber kein Live-API-Call bis Launch.
    """
    result = await finapi_service.create_web_form(
        user_id=user["uid"],
        redirect_url=request.redirectUrl
    )
    return result


@router.get("/bank-connections", summary="Verbundene Bankkonten")
async def get_bank_connections(
    user: dict = Depends(require_shield),
    db: Client = Depends(get_db)
):
    """Liste der verbundenen Bankkonten des Users."""
    connections = await finapi_service.get_bank_connections(user["uid"])
    return {
        "connections": connections,
        "count": len(connections),
    }


@router.post("/sync-transactions", summary="Bank-Transaktionen synchronisieren")
async def sync_bank_transactions(
    bank_connection_id: str = Query(..., description="Bank Connection ID"),
    user: dict = Depends(require_shield),
    db: Client = Depends(get_db)
):
    """
    Transaktionen von verbundenem Bankkonto synchronisieren.
    Erfordert SHIELD-Tier.
    """
    transactions = await finapi_service.get_transactions(bank_connection_id)
    
    # In Firestore speichern
    fs = FirestoreService(db)
    saved = []
    for tx in transactions:
        data = {
            "amount": tx.get("amount", 0),
            "currency": tx.get("currency", "EUR"),
            "counterpartName": tx.get("counterpartName", "Unbekannt"),
            "purpose": tx.get("purpose", ""),
            "bookingDate": tx.get("bookingDate", ""),
            "source": "FINAPI",
        }
        tx_id = fs.create_transaction(user["uid"], data)
        saved.append(tx_id)

    return {
        "synced": len(saved),
        "source": "FINAPI",
        "_simulated": True,
    }
