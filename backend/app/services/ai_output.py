"""
SOVEREIGN 2030 — AIOutputHardener Service
All AI responses pass through this pipeline before reaching the client.

Pipeline steps:
  1. Confidence check — low confidence triggers uncertainty label, blocks auto-actions
  2. PII scan — regex + keyword detection, redacts before render
  3. EU AI Act risk classification — maps action type to risk class
  4. Disclaimer injection — locale-aware disclaimers from ai.json namespace
  5. Input hash — for audit trail (never store raw input)

Design: this is a pure transformation layer. It never makes LLM calls itself.
"""
import hashlib
import re
import logging
from typing import Optional, Any
from dataclasses import dataclass, field

logger = logging.getLogger("sovereign.ai_output")

# ── EU AI Act Risk Classes (Annex III) ────────────────────────────────────────
AI_ACT_RISK_CLASS = {
    # HIGH risk — biometric, critical infrastructure, education, employment, law
    "contract_termination": "HIGH",
    "legal_claim": "HIGH",
    "financial_transfer": "HIGH",
    "dsgvo_deletion": "HIGH",
    "biometric_verification": "HIGH",

    # LIMITED risk — chatbots must be disclosed
    "brainstorm": "LIMITED",
    "contract_analysis": "LIMITED",
    "finance_analysis": "LIMITED",
    "savings_suggestion": "LIMITED",
    "price_comparison": "LIMITED",

    # MINIMAL risk — spam filters, recommenders
    "insight_generation": "MINIMAL",
    "onboarding_suggestion": "MINIMAL",
}

CONFIDENCE_THRESHOLD = 0.5  # below this → uncertainty_label mandatory

# ── PII Patterns (GDPR-relevant, Europe-focused) ──────────────────────────────
_PII_PATTERNS: list[tuple[str, re.Pattern]] = [
    ("IBAN", re.compile(r"\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7}([A-Z0-9]?){0,16}\b")),
    ("CREDIT_CARD", re.compile(r"\b(?:\d[ -]?){13,19}\b")),
    ("EMAIL", re.compile(r"\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z|a-z]{2,}\b")),
    ("GERMAN_PHONE", re.compile(r"\b(?:\+49|0)\s?(?:\d[\s\-]?){9,14}\b")),
    ("GERMAN_POSTCODE", re.compile(r"\b\d{5}\b")),
    ("TAX_ID", re.compile(r"\b\d{2}\s?\d{3}\s?\d{5}\b")),  # Steuer-ID format
    ("HEALTH_CARD", re.compile(r"\b[A-Z]\d{9}\b")),  # Krankenkassen-Nr
]

_PII_KEYWORDS = {
    "passwort", "password", "geheimzahl", "pin", "cvv", "secret",
    "sozialversicherung", "sv-nummer", "rentenversicherung",
}


@dataclass
class HardenedOutput:
    """Result from AIOutputHardener.harden()"""
    text: str
    confidence: float
    risk_class: str
    pii_detected: bool
    pii_types: list[str]
    uncertainty_label: Optional[str]
    disclaimer: str
    human_approval_required: bool
    input_hash: str
    eu_ai_act_compliant: bool
    metadata: dict[str, Any] = field(default_factory=dict)


class AIOutputHardener:
    """
    Stateless transformation pipeline for AI outputs.

    Usage:
        hardener = AIOutputHardener()
        result = hardener.harden(
            text=llm_response,
            confidence=0.87,
            action_type="contract_analysis",
            locale="de",
            raw_input=user_prompt,
        )

    Never instantiate per-request — use module singleton `ai_output_hardener`.
    """

    def harden(
        self,
        *,
        text: str,
        confidence: float,
        action_type: str,
        locale: str = "de",
        raw_input: Optional[str] = None,
        extra_metadata: Optional[dict] = None,
    ) -> HardenedOutput:
        """
        Run the full hardening pipeline. Returns HardenedOutput.
        Never raises — logs warnings and returns best-effort result.
        """
        # Step 1: PII scan
        cleaned_text, pii_detected, pii_types = self._scan_and_redact_pii(text)

        # Step 2: Confidence check
        uncertainty_label = None
        if confidence < CONFIDENCE_THRESHOLD:
            uncertainty_label = self._get_uncertainty_label(locale)
            logger.warning(
                f"Low AI confidence ({confidence:.2f}) for action_type={action_type} — "
                f"uncertainty_label added, human approval forced"
            )

        # Step 3: Risk classification
        risk_class = AI_ACT_RISK_CLASS.get(action_type, "LIMITED")

        # Step 4: Human approval required?
        human_approval_required = (
            risk_class == "HIGH" or confidence < CONFIDENCE_THRESHOLD
        )

        # Step 5: Disclaimer
        disclaimer = self._get_disclaimer(locale, risk_class)

        # Step 6: Input hash (for audit log — never store raw input)
        input_hash = self._hash_input(raw_input or text)

        # Step 7: EU AI Act compliance check
        # Compliant if: disclaimer shown + human approval gate active for HIGH
        eu_ai_act_compliant = bool(disclaimer) and (
            risk_class != "HIGH" or human_approval_required
        )

        if pii_detected:
            logger.info(f"PII detected in AI output ({pii_types}) — redacted before render")

        return HardenedOutput(
            text=cleaned_text,
            confidence=confidence,
            risk_class=risk_class,
            pii_detected=pii_detected,
            pii_types=pii_types,
            uncertainty_label=uncertainty_label,
            disclaimer=disclaimer,
            human_approval_required=human_approval_required,
            input_hash=input_hash,
            eu_ai_act_compliant=eu_ai_act_compliant,
            metadata=extra_metadata or {},
        )

    def _scan_and_redact_pii(self, text: str) -> tuple[str, bool, list[str]]:
        """Scan text for PII patterns and redact. Returns (cleaned_text, detected, types)."""
        detected_types: list[str] = []
        cleaned = text

        for label, pattern in _PII_PATTERNS:
            if pattern.search(cleaned):
                detected_types.append(label)
                cleaned = pattern.sub(f"[{label} REDACTED]", cleaned)

        # Keyword scan (case-insensitive)
        lower = cleaned.lower()
        for kw in _PII_KEYWORDS:
            if kw in lower:
                detected_types.append(f"KEYWORD:{kw}")
                break  # one hit is enough to flag; don't redact keywords (no safe pattern)

        return cleaned, bool(detected_types), detected_types

    @staticmethod
    def _hash_input(text: str) -> str:
        """SHA-256 hash of AI input for audit trail. Truncated to 32 chars."""
        return hashlib.sha256(text.encode("utf-8")).hexdigest()[:32]

    @staticmethod
    def _get_uncertainty_label(locale: str) -> str:
        labels = {
            "de": "⚠️ Hinweis: Diese Analyse basiert auf eingeschränkter Datenlage. Bitte prüfe das Ergebnis sorgfältig.",
            "en": "⚠️ Note: This analysis is based on limited data. Please review the result carefully.",
            "fr": "⚠️ Remarque: Cette analyse repose sur des données limitées. Veuillez vérifier attentivement.",
        }
        return labels.get(locale, labels["en"])

    @staticmethod
    def _get_disclaimer(locale: str, risk_class: str) -> str:
        if risk_class == "HIGH":
            disclaimers = {
                "de": (
                    "KI-Disclaimer (EU AI Act, Hochrisiko): Diese KI-gestützte Empfehlung wurde vom "
                    "SOVEREIGN Algorithmic Senate vorbereitet. Die finale Entscheidung liegt ausschließlich "
                    "bei dir. SOVEREIGN übernimmt keine rechtliche Verantwortung für automatisierte Aktionen "
                    "ohne deine explizite Bestätigung."
                ),
                "en": (
                    "AI Disclaimer (EU AI Act, High-Risk): This AI-assisted recommendation was prepared by "
                    "the SOVEREIGN Algorithmic Senate. The final decision rests solely with you. SOVEREIGN "
                    "assumes no legal responsibility for automated actions without your explicit confirmation."
                ),
            }
        else:
            disclaimers = {
                "de": (
                    "KI-Hinweis: Diese Analyse wurde von SOVEREIGN AI (Gemini) erstellt. "
                    "Ergebnisse können Fehler enthalten. Keine Rechtsberatung."
                ),
                "en": (
                    "AI Notice: This analysis was created by SOVEREIGN AI (Gemini). "
                    "Results may contain errors. Not legal advice."
                ),
            }
        return disclaimers.get(locale, disclaimers.get("en", ""))


# Module-level singleton — stateless, safe to share across requests
ai_output_hardener = AIOutputHardener()
