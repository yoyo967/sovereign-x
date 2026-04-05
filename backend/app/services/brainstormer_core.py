from .llm_service import llm_service
from .firestore_service import FirestoreService
from ..models.common import RiskLevel
from typing import Dict, Any, List
import json
import logging

logger = logging.getLogger("sovereign.brainstormer")

class BrainstormerSenate:
    """
    The Algorithmic Senate: Actively reviews sub-agent proposals, extracting
    user contexts and providing a "Second Opinion" to ensure legal and
    ethical boundaries are preserved (EU AI Act Compliance & Consumer Protection).
    """

    def __init__(self):
        pass

    async def review_proposal(self, sub_agent_name: str, proposal_data: Dict[str, Any], user_lang: str) -> Dict[str, Any]:
        """
        The Algorithmic Senate: Actively reviews sub-agent proposals for safety and compliance.
        Standard: EU AI Act & Consumer Protection Excellence.
        """
        prompt = f"""
        Role: SOVEREIGN Algorithmic Senate (Executive Auditor)
        Objective: Audit a proposal from the sub-agent "{sub_agent_name}".
        
        Proposal Context:
        {json.dumps(proposal_data, indent=2)}
        
        Audit Criteria:
        1. Consumer Protection: Does this harm the user's financial stability or legal standing?
        2. Existential Risk: Does this action cross user-defined boundary conditions?
        3. EU AI Act Compliance: Ensure transparency and high-risk mitigation.
        4. Ethics: Is this action in the absolute best interest of the human user (Sovereign 2030)?
        
        System Instruction:
        Review the proposal and provide a binding verdict. If non-compliant, provide a 'veto_reason'.
        Target Language: {user_lang}
        """

        schema = """
        {
          "approved_by_senate": boolean,
          "veto_reason": "detailed string in target language or null",
          "risk_level": "LOW|MEDIUM|HIGH|CRITICAL",
          "user_message_translation": "professional summary for the user in target language"
        }
        """
        
        result_json = await llm_service.generate_json(prompt, schema)
        return {"audit_result": result_json, "original_proposal": proposal_data}

    async def assimilate_context(self, uid: str, user_conversation: str, db: Any) -> dict:
        """
        Extracts persistent user configurations from natural language and persists them to AgentMemory.
        """
        fs = FirestoreService(db)
        
        prompt = f"""
        Role: Sovereign Memory Architect
        Task: Extract user preferences, provider facts, or financial patterns from the conversation.
        
        Input: "{user_conversation}"
        
        Extraction Goals:
        - Preferences (e.g., "I prefer green energy", "No phone calls after 6 PM")
        - Contract Facts (e.g., "My Vodafone contract ends in August")
        - Financial Boundaries (e.g., "Don't spend more than 50€ automatically")
        """
        
        schema = """
        {
          "extracted_preferences": [
            {
              "category": "USER_PREFERENCE|PROVIDER_FACT|FINANCIAL_PATTERN",
              "key": "string (slug_case)",
              "value": "string (refined value)",
              "importance": 0.0-1.0,
              "source": "CONVERSATION"
            }
          ]
        }
        """
        
        result_json = await llm_service.generate_json(prompt, schema)
        
        try:
            data = json.loads(result_json)
            preferences = data.get("extracted_preferences", [])
            
            # Persist to Firestore
            for pref in preferences:
                # We use a custom method or direct collection access
                db.collection("users").document(uid).collection("agentMemories").add({
                    **pref,
                    "createdAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc),
                    "lastAccessedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc)
                })
            
            return {"memories": preferences, "count": len(preferences)}
        except Exception as e:
            logger.error(f"Failed to persist memories: {e}")
            return {"memories": [], "error": str(e)}

brainstormer = BrainstormerSenate()
