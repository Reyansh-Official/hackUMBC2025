import asyncio
import json
from gemini_api.client import gemini_client

async def test_answer_evaluation():
    """Test the answer evaluation functionality"""
    
    # Sample data for testing
    question = "Explain the concept of compound interest and how it differs from simple interest."
    user_answer = "Compound interest is when you earn interest on your interest. It's better than simple interest because your money grows faster over time."
    correct_answer = "Compound interest is calculated on the initial principal and also on the accumulated interest from previous periods. It differs from simple interest where interest is calculated only on the principal amount. The formula for compound interest is A = P(1 + r/n)^(nt), where A is the final amount, P is principal, r is rate, n is compounding frequency, and t is time."
    
    # Create prompt for answer evaluation
    prompt = f"""
    As a financial tutor, evaluate this student's answer:
    
    QUESTION:
    {question}
    
    STUDENT'S ANSWER:
    {user_answer}
    
    CORRECT ANSWER/RATIONALE:
    {correct_answer}
    
    Evaluate the student's answer on a scale from 0 to 100 based on accuracy, completeness, and understanding.
    Provide constructive, personalized feedback that acknowledges strengths and identifies areas for improvement.
    If the answer is incorrect or partially correct, guide the student toward the right logic without giving the immediate answer.
    
    Your response must be a valid JSON object with the following structure:
    {{
        "score": number between 0-100,
        "feedback": "Markdown formatted feedback with constructive comments"
    }}
    """
    
    # System instruction for evaluation
    system_instruction = """
    You are an encouraging but rigorous financial tutor evaluating student answers.
    
    Your response must be a valid JSON object with the following structure:
    {
        "score": number between 0-100,
        "feedback": "Markdown formatted feedback with constructive comments"
    }
    
    Follow these guidelines:
    1. Score accurately based on correctness, completeness, and understanding
    2. Provide personalized, constructive feedback in Markdown format
    3. Acknowledge strengths and identify areas for improvement
    4. For incorrect answers, guide toward the right logic without giving the immediate solution
    5. Use an encouraging tone that motivates further learning
    """
    
    # Generate evaluation with JSON formatting
    response = await gemini_client.generate_content(
        prompt=prompt,
        output_format="json",
        system_instruction=system_instruction
    )
    
    print("Response status:", "Success" if response.get('success') else "Failed")
    
    if response.get('success'):
        content = response.get('content', {})
        print("\nEvaluation Result:")
        print(f"Score: {content.get('score')}")
        print(f"\nFeedback:\n{content.get('feedback')}")
        
        # Validate response structure
        if not isinstance(content, dict) or 'score' not in content or 'feedback' not in content:
            print("\nERROR: Invalid response format")
            return False
            
        # Validate score is within range
        score = content.get('score')
        if not isinstance(score, (int, float)) or score < 0 or score > 100:
            print("\nERROR: Invalid score value")
            return False
            
        print("\nTest passed successfully!")
        return True
    else:
        print("\nERROR:", response.get('error', 'Unknown error'))
        return False

if __name__ == "__main__":
    asyncio.run(test_answer_evaluation())