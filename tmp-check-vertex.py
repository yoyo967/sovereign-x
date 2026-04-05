import vertexai
from vertexai.generative_models import GenerativeModel, SafetySetting, HarmCategory

try:
    vertexai.init(project="opus-magnum-ai", location="us-central1")
    model = GenerativeModel("gemini-1.5-flash")
    print("SUCCESS: Model created")
    
    # Try with safety settings
    model_safe = GenerativeModel(
        "gemini-1.5-flash",
        safety_settings=[
            SafetySetting(
                category=HarmCategory.HATE_SPEECH,
                threshold=SafetySetting.HarmBlockThreshold.BLOCK_LOW_AND_ABOVE
            )
        ]
    )
    print("SUCCESS: Model with safety created")
except Exception as e:
    print(f"FAILED: {e}")
    import traceback
    traceback.print_exc()
