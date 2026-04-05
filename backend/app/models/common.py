from enum import Enum
from pydantic import BaseModel, Field
from typing import Optional, List

# --- Enums ---

class TargetLanguage(str, Enum):
    DE = "de"
    EN = "en"
    TR = "tr"
    RU = "ru"
    AR = "ar"

class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ActionStatus(str, Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    EXECUTED = "EXECUTED"

# --- Models ---

class ErrorResponse(BaseModel):
    detail: str
    code: str

class AuditTrail(BaseModel):
    timestamp: str
    action: str
    agent_id: str
    user_uid: str
    risk_level: RiskLevel
