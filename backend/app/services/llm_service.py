import vertexai
from vertexai.generative_models import GenerativeModel
from ..config import config
import logging

logger = logging.getLogger("sovereign.llm")

class LLMService:
    def __init__(self):
        self.model = None
        try:
            vertexai.init(project=config.GCP_PROJECT_ID, location=config.REGION)
            self.model = GenerativeModel(config.GEMINI_MODEL)
            logger.info(f"✅ Vertex AI initialized successfully ({config.GEMINI_MODEL})")
        except Exception as e:
            import traceback
            logger.warning(f"⚠️ Vertex AI init failed (will use mock): {traceback.format_exc()}")
            self.model = None


    async def generate_json(self, prompt: str, schema_instruction: str) -> str:
        """
        Forces Gemini to return JSON. Graceful fallback if Vertex AI is not available.
        """
        if not self.model:
            logger.warning("Vertex AI not available — returning mock response")
            return '{"extracted_preferences": [{"key": "Status", "value": "Mock (Vertex AI nicht konfiguriert)"}]}'

        try:
            full_prompt = f"{prompt}\n\nMUST RETURN VALID JSON following this schema:\n{schema_instruction}"
            response = self.model.generate_content(
                full_prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini generate_content failed: {e}")
            return f'{{"extracted_preferences": [{{"key": "Error", "value": "{str(e)[:100]}"}}]}}'

llm_service = LLMService()

