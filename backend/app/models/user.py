"""
SOVEREIGN 2030 — User Models
Pydantic schemas for user profiles, settings, and boundary conditions.
"""
from pydantic import BaseModel, Field
from typing import Optional, Any, List
from enum import Enum


class Tier(str, Enum):
    FREE = "FREE"
    PRO = "PRO"
    SHIELD = "SHIELD"


class NegotiationStrategy(str, Enum):
    CONSERVATIVE = "CONSERVATIVE"
    MODERATE = "MODERATE"
    AGGRESSIVE = "AGGRESSIVE"


class BoundaryConditions(BaseModel):
    """User-definierte Grenzen für autonome Agenten-Aktionen."""
    maxAutoAmountEur: float = Field(default=50.0, ge=0, description="Max. autonomer Betrag in EUR")
    allowAutonomousNegotiation: bool = Field(default=False, description="Autonome Verhandlung erlaubt")
    negotiationStrategy: NegotiationStrategy = NegotiationStrategy.CONSERVATIVE
    requireBiometricForAll: bool = Field(default=True, description="Biometrische Bestätigung für alle Aktionen")
    killSwitchActive: bool = Field(default=False, description="Notfall-Stopp aller autonomen Aktionen")
    allowEmailAnalysis: bool = Field(default=False, description="E-Mail-Analyse erlaubt")
    allowBankAnalysis: bool = Field(default=False, description="Bank-Transaktionsanalyse erlaubt")
    autoDetectContracts: bool = Field(default=True, description="Automatische Vertragserkennung")
    notifyBeforeAction: bool = Field(default=True, description="Benachrichtigung vor jeder Aktion")
    maxMonthlyActionsCount: int = Field(default=10, ge=0, description="Max. autonome Aktionen pro Monat")


class ConnectedAccounts(BaseModel):
    gmail: bool = False
    finapi: bool = False
    finapiConsentExpiry: Optional[str] = None


class UserProfileResponse(BaseModel):
    uid: str
    displayName: Optional[str] = None
    email: Optional[str] = None
    tier: str = "FREE"
    stripeCustomerId: Optional[str] = None
    stripeSubscriptionId: Optional[str] = None
    preferredLanguage: str = "de"
    createdAt: Optional[Any] = None

    class Config:
        from_attributes = True


class UserProfileUpdate(BaseModel):
    displayName: Optional[str] = Field(None, min_length=1, max_length=100)
    preferredLanguage: Optional[str] = Field(None, pattern="^(de|en|tr|ru|ar)$")


class UserSettingsResponse(BaseModel):
    boundaryConditions: BoundaryConditions = BoundaryConditions()
    connectedAccounts: ConnectedAccounts = ConnectedAccounts()

    class Config:
        from_attributes = True


class UserSettingsUpdate(BaseModel):
    boundaryConditions: Optional[BoundaryConditions] = None
    connectedAccounts: Optional[ConnectedAccounts] = None


class OnboardRequest(BaseModel):
    displayName: str = Field(..., min_length=1, max_length=100)
    preferredLanguage: str = Field(default="de", pattern="^(de|en|tr|ru|ar)$")


class DashboardResponse(BaseModel):
    tier: str = "FREE"
    totalContracts: int = 0
    activeContracts: int = 0
    totalMonthlyCostEur: float = 0.0
    totalSavingsEur: float = 0.0
    pendingApprovals: int = 0
    activeClaims: int = 0
    riskScore: float = 0.0
    recentInsights: List[dict] = []
