"""
SOVEREIGN 2030 — Approval Models
Pydantic schemas for approval workflow (Human-in-the-Loop).
"""
from pydantic import BaseModel, Field
from typing import Optional, Any
from enum import Enum


class ApprovalStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"
    AUTO_APPROVED = "AUTO_APPROVED"


class AgentType(str, Enum):
    NEGOTIATION = "NEGOTIATION"
    SWITCHING = "SWITCHING"
    CLAIM = "CLAIM"
    ANALYSIS = "ANALYSIS"
    CANCELLATION = "CANCELLATION"


class ApprovalResponse(BaseModel):
    id: str
    agentType: str
    status: str
    actionSummary: str
    actionDetail: str
    affectedProvider: str
    affectedContractId: Optional[str] = None
    estimatedSavingEur: float = 0.0
    riskLevel: str = "LOW"
    createdAt: Optional[Any] = None
    expiresAt: Optional[Any] = None

    class Config:
        from_attributes = True


class ApprovalAction(BaseModel):
    """User action on an approval — approve or reject."""
    reason: Optional[str] = Field(None, max_length=500, description="Optionaler Grund bei Ablehnung")


class ApprovalCreate(BaseModel):
    """Internal model for creating approvals (backend-only)."""
    agentType: AgentType
    actionSummary: str = Field(..., min_length=5, max_length=500)
    actionDetail: str = Field(..., min_length=5, max_length=5000)
    affectedProvider: str
    affectedContractId: Optional[str] = None
    estimatedSavingEur: float = Field(default=0.0, ge=0)
    riskLevel: str = "LOW"
