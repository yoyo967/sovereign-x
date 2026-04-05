import vertexai
from vertexai.generative_models import GenerativeModel, SafetySetting, HarmCategory, HarmBlockThreshold

try:
    print(f"Categories: {dir(HarmCategory)}")
    print(f"Thresholds: {dir(HarmBlockThreshold)}")
except Exception as e:
    print(f"FAILED: {e}")
