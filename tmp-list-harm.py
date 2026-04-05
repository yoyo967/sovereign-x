import vertexai
from vertexai.generative_models import GenerativeModel, SafetySetting, HarmCategory

try:
    print(f"Categories: {dir(HarmCategory)}")
    # Usually it's HARM_CATEGORY_HATE_SPEECH in recent versions or HATE_SPEECH in older.
    # The current one in the project seems to be different.
except Exception as e:
    print(f"FAILED: {e}")
