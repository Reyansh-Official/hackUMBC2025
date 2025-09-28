import asyncio
import json
from gemini_api.client import gemini_client

async def test_financial_lesson_generation():
    """Test the financial lesson generation with different topics and difficulty levels"""
    
    # Test prompt for basic budgeting
    prompt = """
    Generate detailed educational content about budgeting in personal finance at a basic level 
    (beginner-friendly with simple explanations and examples). 
    
    Structure the content with the following sections:
    1. Key Terms and Definitions
    2. Core Concepts (including relevant formulas in LaTeX format)
    3. Financial Examples
    
    Use proper HTML formatting with <h3> tags for section headings, <p> tags for paragraphs, 
    <ul> and <li> for lists, and <strong> for emphasis.
    
    For any mathematical formulas, use LaTeX format enclosed in \\( \\) for inline formulas 
    or \\[ \\] for block formulas.
    """
    
    system_instruction = """
    You are a specialized financial curriculum expert generating educational content.
    Your response must be well-structured HTML without <!DOCTYPE>, <html>, <head>, or <body> tags.
    
    Follow these formatting requirements:
    - Use <h3> tags for section headings
    - Use <p> tags for paragraphs
    - Use <ul> and <li> for lists
    - Use <strong> for emphasis
    - Format mathematical formulas with LaTeX using \\( \\) for inline and \\[ \\] for block formulas
    
    Your content must include:
    1. Definitions of key financial terms
    2. Core concepts with relevant formulas
    3. Practical financial examples
    
    Keep explanations simple and accessible for beginners. Use everyday examples and minimal jargon.
    """
    
    # Generate content with HTML formatting
    response = await gemini_client.generate_content(
        prompt=prompt,
        output_format="html",
        system_instruction=system_instruction
    )
    
    # Print the response
    print(json.dumps(response, indent=2))
    
    # Check if the response contains HTML tags
    if response["success"] and "<h3>" in response["content"]:
        print("\n✅ Test passed: Response contains properly formatted HTML content")
    else:
        print("\n❌ Test failed: Response does not contain properly formatted HTML content")

if __name__ == "__main__":
    asyncio.run(test_financial_lesson_generation())