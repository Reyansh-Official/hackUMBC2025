import asyncio
from gemini_api.client import gemini_client

async def test_gemini_client():
    """Test that the Gemini client is properly configured with environment variables"""
    try:
        # Simple test prompt
        response = await gemini_client.generate_content(
            prompt="Respond with a simple JSON containing a success message"
        )
        
        print("API Response:", response)
        
        if response["success"]:
            print("✅ Gemini API client is working correctly with environment variables")
        else:
            print("❌ Gemini API client test failed:", response["error"])
            
    except Exception as e:
        print(f"❌ Error testing Gemini client: {str(e)}")

if __name__ == "__main__":
    asyncio.run(test_gemini_client())