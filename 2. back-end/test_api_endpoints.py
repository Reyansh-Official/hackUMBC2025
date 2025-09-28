import requests
import json
import time
import uuid

# Base URL for API endpoints
BASE_URL = "http://localhost:5000"

def test_module_generation():
    """Test the module generation endpoint"""
    print("\n=== Testing Module Generation ===")
    
    # Test data
    test_data = {
        "user_id": str(uuid.uuid4()),  # Generate a random user ID for testing
        "topic": "personal finance",
        "level": "Basic"
    }
    
    # Send request to generate module
    print(f"Generating module for topic: {test_data['topic']}, level: {test_data['level']}")
    response = requests.post(f"{BASE_URL}/api/generate-module", json=test_data)
    
    # Print response
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result.get('success')}")
        print(f"Module ID: {result.get('module_id')}")
        print(f"Message: {result.get('message')}")
        
        # Return module ID for use in quiz submission test
        return result.get('module_id')
    else:
        print(f"Error: {response.text}")
        return None

def test_quiz_submission(module_id):
    """Test the quiz submission endpoint"""
    print("\n=== Testing Quiz Submission ===")
    
    if not module_id:
        print("No module ID provided, cannot test quiz submission")
        return
    
    # Wait for quiz generation to complete (in a real test, you might poll until it's ready)
    print("Waiting for quiz generation to complete...")
    time.sleep(10)
    
    # Generate a random user ID for testing
    user_id = str(uuid.uuid4())
    
    # Test MCQ submission
    print("\n--- Testing MCQ Submission ---")
    mcq_data = {
        "user_id": user_id,
        "module_id": module_id,
        "question_id": "q1",  # This would be a real question ID in production
        "question_type": "mcq",
        "user_answer": 0,  # Selecting the first option
        "is_final_question": False
    }
    
    response = requests.post(f"{BASE_URL}/api/submit-answer", json=mcq_data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result.get('success')}")
        print(f"Score: {result.get('score')}")
        print(f"Feedback: {result.get('feedback')}")
    else:
        print(f"Error: {response.text}")
    
    # Test free-text submission
    print("\n--- Testing Free-Text Submission ---")
    free_text_data = {
        "user_id": user_id,
        "module_id": module_id,
        "question_id": "q6",  # This would be a real question ID in production
        "question_type": "free_text",
        "user_answer": "Budgeting is important because it helps track income and expenses, allowing for better financial planning and saving for future goals.",
        "is_final_question": False
    }
    
    response = requests.post(f"{BASE_URL}/api/submit-answer", json=free_text_data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result.get('success')}")
        print(f"Score: {result.get('score')}")
        print(f"Feedback: {result.get('feedback')}")
    else:
        print(f"Error: {response.text}")
    
    # Test final question submission (to trigger quiz completion)
    print("\n--- Testing Final Question Submission ---")
    final_question_data = {
        "user_id": user_id,
        "module_id": module_id,
        "question_id": "q7",  # This would be a real question ID in production
        "question_type": "free_text",
        "user_answer": "Compound interest is interest calculated on the initial principal and also on the accumulated interest over previous periods. It makes your money grow faster over time.",
        "is_final_question": True
    }
    
    response = requests.post(f"{BASE_URL}/api/submit-answer", json=final_question_data)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result.get('success')}")
        print(f"Score: {result.get('score')}")
        print(f"Feedback: {result.get('feedback')}")
        
        # Check final result
        final_result = result.get('final_result')
        if final_result:
            print(f"\nFinal Percentage: {final_result.get('percentage')}")
            print(f"Passed: {final_result.get('passed')}")
            print(f"Passing Threshold: {final_result.get('passing_threshold')}")
            
            next_module = final_result.get('next_module')
            if next_module:
                print(f"Next Module ID: {next_module.get('id')}")
                print(f"Next Module Level: {next_module.get('level')}")
                print(f"Next Module Topic: {next_module.get('topic')}")
            else:
                print("No next module available")
    else:
        print(f"Error: {response.text}")

if __name__ == "__main__":
    # Run tests
    module_id = test_module_generation()
    if module_id:
        test_quiz_submission(module_id)
    else:
        print("Module generation failed, skipping quiz submission test")