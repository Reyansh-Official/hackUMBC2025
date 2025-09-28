import asyncio
import json
from gemini_api.client import gemini_client

async def test_syllabus_parsing():
    """Test the syllabus parsing functionality"""
    
    # Sample syllabus content for testing
    sample_syllabus = """
    ECON 101: Introduction to Microeconomics
    
    Course Description:
    This course introduces students to the principles of microeconomics, focusing on the behavior of individuals and firms in making decisions regarding the allocation of limited resources. The course covers supply and demand, market structures, consumer theory, and factor markets.
    
    Learning Objectives:
    - Understand basic economic principles and concepts
    - Apply economic reasoning to everyday situations
    - Analyze market outcomes under different structures
    - Evaluate the effects of government policies on markets
    
    Course Topics:
    
    Week 1-2: Introduction to Economics
    - Scarcity and choice
    - Opportunity cost
    - Production possibilities frontier
    - Comparative advantage and trade
    
    Week 3-4: Supply and Demand
    - Market equilibrium
    - Price elasticity
    - Consumer and producer surplus
    - Market efficiency
    
    Week 5-6: Consumer Theory
    - Utility maximization
    - Budget constraints
    - Income and substitution effects
    - Consumer choice
    
    Week 7-8: Production and Costs
    - Production functions
    - Short-run vs. long-run costs
    - Economies of scale
    - Cost minimization
    
    Week 9-10: Market Structures
    - Perfect competition
    - Monopoly
    - Monopolistic competition
    - Oligopoly and game theory
    
    Week 11-12: Factor Markets
    - Labor markets
    - Capital markets
    - Income distribution
    - Market failures
    
    Week 13-14: Government Intervention
    - Taxes and subsidies
    - Price controls
    - Externalities
    - Public goods
    
    Assessment:
    - Midterm Exam: 30%
    - Final Exam: 40%
    - Problem Sets: 20%
    - Participation: 10%
    """
    
    # Create prompt for syllabus parsing
    prompt = f"""
    Analyze the following raw text from a syllabus document:
    
    {sample_syllabus}
    
    Segment this content into logical learning units (maximum 8 units total).
    Ignore any structural markers like page numbers or headers.
    
    For each unit, provide:
    1. A concise unit_title derived from the content
    2. A key_summary that captures the essence of the unit
    3. 3-5 key_topics that are covered in the unit
    
    Your response must be a valid JSON object with the following structure:
    {{
        "units": [
            {{
                "unit_title": "Title of the unit",
                "key_summary": "Concise summary of the unit",
                "key_topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
            }},
            // More units as needed (maximum 8)
        ]
    }}
    """
    
    # System instruction for syllabus parsing
    system_instruction = """
    You are a curriculum parser and unit designer analyzing educational content.
    
    Your response must be a valid JSON object with the following structure:
    {
        "units": [
            {
                "unit_title": "Title of the unit",
                "key_summary": "Concise summary of the unit",
                "key_topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5"]
            },
            // More units as needed (maximum 8)
        ]
    }
    
    Follow these guidelines:
    1. Create no more than 8 logical learning units from the content
    2. Ignore structural markers like page numbers or headers
    3. Each unit_title must be concise and descriptive
    4. Each key_summary must capture the essence of the unit content
    5. Each unit must have 3-5 key_topics derived directly from the content
    6. Ensure all JSON is properly formatted with no syntax errors
    """
    
    # Generate parsed syllabus with JSON formatting
    response = await gemini_client.generate_content(
        prompt=prompt,
        output_format="json",
        system_instruction=system_instruction
    )
    
    print("Response status:", "Success" if response.get('success') else "Failed")
    
    if response.get('success'):
        content = response.get('content', {})
        units = content.get('units', [])
        
        print(f"\nParsed {len(units)} units from syllabus:")
        
        # Validate and display units
        for i, unit in enumerate(units):
            print(f"\nUnit {i+1}: {unit.get('unit_title', 'No title')}")
            print(f"Summary: {unit.get('key_summary', 'No summary')}")
            print("Key Topics:")
            for topic in unit.get('key_topics', []):
                print(f"  - {topic}")
            
            # Basic validation
            if not unit.get('unit_title'):
                print("ERROR: Missing unit_title")
            if not unit.get('key_summary'):
                print("ERROR: Missing key_summary")
            if not unit.get('key_topics') or len(unit.get('key_topics', [])) < 3 or len(unit.get('key_topics', [])) > 5:
                print(f"ERROR: Invalid key_topics count: {len(unit.get('key_topics', []))}, expected 3-5")
        
        print("\nTest passed successfully!")
        return True
    else:
        print("\nERROR:", response.get('error', 'Unknown error'))
        return False

if __name__ == "__main__":
    asyncio.run(test_syllabus_parsing())