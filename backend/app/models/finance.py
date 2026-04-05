"""
SOVEREIGN 2030 — Finance Models
Pydantic schemas for transactions, insights, and bank connections.
"""
from pydantic import BaseModel, Field
from typing import Optional, Any, List
from enum import Enum


class TransactionSource(str, Enum):
    CSV_IMPORT = "CSV_IMPORT"
    FINAPI = "FINAPI"
    MANUAL = "MANUAL"


class InsightType(str, Enum):
    PRICE_INCREASE = "PRICE_INCREASE"
    NEW_SUBSCRIPTION = "NEW_SUBSCRIPTION"
    UNUSUAL_ACTIVITY = "UNUSUAL_ACTIVITY"
    DUPLICATE_PAYMENT = "DUPLICATE_PAYMENT"
    SAVINGS_OPPORTUNITY = "SAVINGS_OPPORTUNITY"
    CONTRACT_DETECTED = "CONTRACT_DETECTED"


class TransactionCreate(BaseModel):
    amount: float = Field(..., description="Betrag (negativ = Ausgabe)")
    currency: str = Field(default="EUR", max_length=3)
    counterpartName: str = Field(..., min_length=1, max_length=200)
    purpose: str = Field(default="", max_length=500)
    bookingDate: str = Field(..., description="Buchungsdatum (ISO 8601)")
    source: TransactionSource = TransactionSource.MANUAL


class TransactionResponse(BaseModel):
    id: str
    amount: float
    currency: str = "EUR"
    counterpartName: str
    purpose: str = ""
    bookingDate: Optional[Any] = None
    source: str = "MANUAL"

    class Config:
        from_attributes = True


class InsightResponse(BaseModel):
    id: str
    type: str
    merchantName: str
    amount: float
    previousAmount: Optional[float] = None
    description: str
    isActionable: bool = False
    timestamp: Optional[Any] = None

    class Config:
        from_attributes = True


class BankConnectionRequest(BaseModel):
    redirectUrl: str = Field(
        default="https://app.sovereign.de/bank/callback",
        description="Redirect URL nach PSD2-Authentifizierung"
    )


class FinanceSummary(BaseModel):
    totalIncomeEur: float = 0.0
    totalExpensesEur: float = 0.0
    netBalanceEur: float = 0.0
    transactionCount: int = 0
    topMerchants: List[dict] = []
    monthlyTrend: List[dict] = []


class CSVUploadResponse(BaseModel):
    imported: int = 0
    skipped: int = 0
    errors: List[str] = []
