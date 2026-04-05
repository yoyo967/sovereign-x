"""
SOVEREIGN 2030 — Contract Models
Pydantic schemas for contract CRUD operations.
"""
from pydantic import BaseModel, Field
from typing import Optional, Any
from enum import Enum
from datetime import datetime


class ContractCategory(str, Enum):
    TELECOM = "TELECOM"
    INSURANCE = "INSURANCE"
    ENERGY = "ENERGY"
    HOUSING = "HOUSING"
    STREAMING = "STREAMING"
    FITNESS = "FITNESS"
    MOBILITY = "MOBILITY"
    OTHER = "OTHER"


class ContractStatus(str, Enum):
    ACTIVE = "ACTIVE"
    PENDING_CANCELLATION = "PENDING_CANCELLATION"
    CANCELLED = "CANCELLED"
    EXPIRED = "EXPIRED"
    DRAFT = "DRAFT"


class ContractCreate(BaseModel):
    provider: str = Field(..., min_length=1, max_length=200, description="Anbieter/Provider Name")
    productName: str = Field(..., min_length=1, max_length=200, description="Produktname/Tarifname")
    category: ContractCategory
    status: ContractStatus = ContractStatus.ACTIVE
    monthlyPriceEur: float = Field(..., ge=0, description="Monatlicher Preis in EUR")
    startDate: Optional[str] = Field(None, description="Vertragsbeginn (ISO 8601)")
    endDate: Optional[str] = Field(None, description="Vertragsende (ISO 8601)")
    cancellationNoticeDays: int = Field(default=30, ge=0, description="Kündigungsfrist in Tagen")
    autoRenewal: bool = Field(default=False, description="Automatische Verlängerung")
    autoRenewalMonths: int = Field(default=0, ge=0, description="Verlängerungszeitraum in Monaten")
    notes: Optional[str] = Field(None, max_length=2000, description="Notizen")


class ContractUpdate(BaseModel):
    provider: Optional[str] = Field(None, min_length=1, max_length=200)
    productName: Optional[str] = Field(None, min_length=1, max_length=200)
    category: Optional[ContractCategory] = None
    status: Optional[ContractStatus] = None
    monthlyPriceEur: Optional[float] = Field(None, ge=0)
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    cancellationNoticeDays: Optional[int] = Field(None, ge=0)
    autoRenewal: Optional[bool] = None
    autoRenewalMonths: Optional[int] = Field(None, ge=0)
    notes: Optional[str] = Field(None, max_length=2000)


class ContractResponse(BaseModel):
    id: str
    provider: str
    productName: str
    category: str
    status: str
    monthlyPriceEur: float
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    cancellationNoticeDays: int = 30
    autoRenewal: bool = False
    autoRenewalMonths: int = 0
    notes: Optional[str] = None
    riskLevel: Optional[str] = None
    analysisResult: Optional[dict] = None
    sharedWithVault: Optional[str] = None
    createdAt: Optional[Any] = None
    updatedAt: Optional[Any] = None

    class Config:
        from_attributes = True


class ContractAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=10, description="Vertragstext zur Analyse")


class MarketComparisonRequest(BaseModel):
    provider: str
    category: ContractCategory
    currentPriceEur: float = Field(..., ge=0)
    postalCode: str = Field(..., min_length=4, max_length=10)
