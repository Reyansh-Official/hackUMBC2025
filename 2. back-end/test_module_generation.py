import requests
import json

# Test the module generation endpoint
def test_generate_module():
    url = "http://localhost:5001/api/generate-module"
    
    # Test data
    data = {
        "user_id": "test-user-123",
        "topic": "personal finance",
        "level": "Basic"
    }
    
    # Send POST request
    response = requests.post(url, json=data)
    
    # Print response
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
    
    return response.json()

if __name__ == "__main__":
    test_generate_module()