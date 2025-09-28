import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure the Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY must be set in environment variables")

genai.configure(api_key=GEMINI_API_KEY)

# List available models
for model in genai.list_models():
    print(f"Model name: {model.name}")
    print(f"Display name: {model.display_name}")
    print(f"Supported generation methods: {model.supported_generation_methods}")
    print("-" * 50)