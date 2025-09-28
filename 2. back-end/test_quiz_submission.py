import requests
import json

# Test the quiz submission endpoint
def test_submit_answer():
    url = "http://localhost:5001/api/submit-answer"
    
    # Test data for MCQ answer
    mcq_data = {
        "user_id": "test-user-123",
        "module_id": "test-module-456",
        "question_id": "question-1",
        "user_answer": 0,  # Selected first option
        "question_type": "mcq",
        "is_final_question": False
    }
    
    # Send POST request for MCQ
    print("\nTesting MCQ answer submission...")
    mcq_response = requests.post(url, json=mcq_data)
    print("Status Code:", mcq_response.status_code)
    print("Response:", json.dumps(mcq_response.json(), indent=2))
    
    # Test data for free-text answer
    free_text_data = {
        "user_id": "test-user-123",
        "module_id": "test-module-456",
        "question_id": "question-2",
        "user_answer": "The time value of money is a financial concept that states money available now is worth more than the same amount in the future due to its potential earning capacity.",
        "question_type": "free_text",
        "is_final_question": False
    }
    
    # Send POST request for free-text
    print("\nTesting free-text answer submission...")
    free_text_response = requests.post(url, json=free_text_data)
    print("Status Code:", free_text_response.status_code)
    print("Response:", json.dumps(free_text_response.json(), indent=2))
    
    # Test data for final question (to trigger quiz completion)
    final_question_data = {
        "user_id": "test-user-123",
        "module_id": "test-module-456",
        "question_id": "question-5",
        "user_answer": 2,  # Selected third option
        "question_type": "mcq",
        "is_final_question": True
    }
    
    # Send POST request for final question
    print("\nTesting final question submission...")
    final_response = requests.post(url, json=final_question_data)
    print("Status Code:", final_response.status_code)
    print("Response:", json.dumps(final_response.json(), indent=2))
    
    return {
        "mcq_response": mcq_response.json(),
        "free_text_response": free_text_response.json(),
        "final_response": final_response.json()
    }

if __name__ == "__main__":
    test_submit_answer()