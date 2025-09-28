import os
import json
import asyncio
from typing import Dict, Any, Optional, List, Union
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables from .env file
load_dotenv()

# Get API key from environment variable
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

# Configure the Gemini API client
genai.configure(api_key=api_key)

class GeminiClient:
    def __init__(self, model_name: str = "gemini-pro"):
        """Initialize the Gemini client with the specified model.
        
        Args:
            model_name: The name of the Gemini model to use.
        """
        self.model_name = model_name
        self.model = genai.GenerativeModel(model_name)
    
    async def generate_content_async(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        output_format: Optional[str] = None,
        generation_config: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Generate content asynchronously using the Gemini API.
        
        Args:
            prompt: The prompt to send to the model.
            system_instruction: Optional system instruction to guide the model.
            output_format: Optional output format (e.g., "json").
            generation_config: Optional generation configuration parameters.
            
        Returns:
            The response from the model as a dictionary.
        """
        # Prepare the prompt with system instruction if provided
        contents = []
        
        if system_instruction:
            # Add system instruction as a system message
            contents.append(system_instruction)
        
        # Add the main prompt
        contents.append(prompt)
        
        # Add output format instruction if specified
        if output_format == "json":
            contents.append("You must respond with valid JSON only, no other text.")
        
        # Set up generation config
        config = {}
        if generation_config:
            config.update(generation_config)
        
        # Run in an executor to avoid blocking the event loop
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None, 
            lambda: self.model.generate_content(contents, generation_config=config)
        )
        
        # Process the response
        if output_format == "json":
            try:
                # Extract JSON from the response
                json_str = response.text
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                return {"error": f"Failed to parse JSON response: {str(e)}", "raw_response": response.text}
        else:
            # Return text response
            return {"response": response.text}

# Create a singleton instance
gemini_client = GeminiClient()