"""
SOVEREIGN 2030 — Claim Models
Pydantic schemas for claims management (Forderungen).
"""
from pydantic import BaseModel, Field
from typing import Optional, Any
from enum import Enum


class ClaimStatus(str, Enum):
    DETECTED = "DETECTED"
    APPROVED = "APPROVED"
    SUBMITTED = "SUBMITTED"
    ACCEPTED = "ACCEPTED"
    REJECTED_BY_PROVIDER = "REJECTED_BY_PROVIDER"
    ESCALATED = "ESCALATED"
    RESOLVED = "RESOLVED"
    CLOSED = "CLOSED"


class ClaimType(str, Enum):
    FLIGHT_COMPENSATION = "FLIGHT_COMPENSATION"
    PRICE_INCREASE = "PRICE_INCREASE"
    SERVICE_FAILURE = "SERVICE_FAILURE"
    CONTRACT_VIOLATION = "CONTRACT_VIOLATION"
    INSURANCE_CLAIM = "INSURANCE_CLAIM"
    REFUND = "REFUND"
    OTHER = "OTHER"


class ClaimCreate(BaseModel):
    type: ClaimType
    provider: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=10, max_length=5000)
    compensationEur: float = Field(default=0.0, ge=0, description="Geforderte Kompensation in EUR")
    relatedContractId: Optional[str] = None


class ClaimResponse(BaseModel):
    id: str
    type: str
    status: str
    provider: str
    description: str
    compensationEur: float = 0.0
    userPayoutEur: float = 0.0
    sovereignFeeEur: float = 0.0
    relatedContractId: Optional[str] = None
    filedAt: Optional[Any] = None
    resolvedAt: Optional[Any] = None

    class Config:
        from_attributes = True
