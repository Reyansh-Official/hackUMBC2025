import asyncio
import json
from gemini_api.client import gemini_client

async def test_quiz_generation():
    """Test the quiz generation with sample lesson content"""
    
    # Sample lesson content (simplified for testing)
    sample_lesson = """
    <h3>Key Terms and Definitions</h3>
    <p><strong>Budget:</strong> A financial plan that outlines expected income and expenses over a specific period.</p>
    <p><strong>Income:</strong> Money received from various sources such as salary, investments, or business.</p>
    <p><strong>Expenses:</strong> Money spent on goods, services, or financial obligations.</p>
    <p><strong>Savings:</strong> Money set aside for future use or emergencies.</p>
    
    <h3>Core Concepts</h3>
    <p>The fundamental budgeting equation is: Income - Expenses = Savings</p>
    <p>This can be expressed mathematically as: \( S = I - E \) where S is savings, I is income, and E is expenses.</p>
    <p>The 50/30/20 rule suggests allocating:</p>
    <ul>
        <li>50% of income to needs (essential expenses)</li>
        <li>30% to wants (non-essential expenses)</li>
        <li>20% to savings and debt repayment</li>
    </ul>
    
    <h3>Financial Examples</h3>
    <p>For someone earning $3,000 per month, a basic budget might look like:</p>
    <ul>
        <li>Needs ($1,500): Rent, utilities, groceries, insurance</li>
        <li>Wants ($900): Dining out, entertainment, shopping</li>
        <li>Savings ($600): Emergency fund, retirement accounts</li>
    </ul>
    """
    
    # Create prompt for quiz generation
    prompt = f"""
    Based on the following lesson content, generate exactly 5 multiple-choice questions 
    designed to test understanding. Each question must have exactly 4 options, 
    only one of which is correct. The correct answer must be unambiguous.
    
    LESSON CONTENT:
    {sample_lesson}
    
    Your response must be a valid JSON array of question objects with the following structure:
    [
        {{
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correct_answer": "Option that is correct",
            "explanation": "Brief explanation of why the answer is correct"
        }},
        // ... more questions
    ]
    
    IMPORTANT REQUIREMENTS:
    1. Generate EXACTLY 5 questions
    2. Each question MUST have EXACTLY 4 options
    3. Only ONE option should be correct
    4. The correct_answer field must match EXACTLY one of the options
    5. Questions should test different aspects of the lesson
    6. The output must be valid, parseable JSON
    """
    
    # Generate quiz with JSON formatting
    response = await gemini_client.generate_content(
        prompt=prompt,
        output_format="json",
        system_instruction="""
        You are a quiz generation expert creating multiple-choice questions based on lesson content.
        Your response must be a valid JSON array of question objects.
        Each question must have exactly 4 options, with only one correct answer.
        The correct_answer field must match exactly one of the options.
        Generate exactly 5 questions that test different aspects of the lesson content.
        """
    )
    
    # Print the response
    print("Quiz Generation Response:")
    print(json.dumps(response, indent=2))
    
    # Validate the response
    if response["success"]:
        try:
            # If content is already a list, use it directly
            quiz_data = response["content"] if isinstance(response["content"], list) else json.loads(response["content"])
            
            # Check if we have exactly 5 questions
            if len(quiz_data) == 5:
                print("\n✅ Successfully generated 5 quiz questions")
                
                # Print the first question as an example
                print("\nSample Question:")
                print(f"Q: {quiz_data[0]['question']}")
                print("Options:")
                for i, option in enumerate(quiz_data[0]['options']):
                    print(f"  {chr(65+i)}. {option}")
                print(f"Correct Answer: {quiz_data[0]['correct_answer']}")
                if 'explanation' in quiz_data[0]:
                    print(f"Explanation: {quiz_data[0]['explanation']}")
            else:
                print(f"\n❌ Expected 5 questions, but got {len(quiz_data)}")
        except Exception as e:
            print(f"\n❌ Error validating quiz data: {str(e)}")
    else:
        print(f"\n❌ Failed to generate quiz: {response.get('error', 'Unknown error')}")

if __name__ == "__main__":
    asyncio.run(test_quiz_generation())