import requests
import json
import os

def test_module_content():
    """Test the module content retrieval endpoint"""
    url = "http://localhost:5001/api/module-content/test-module-123"
    
    # Send GET request
    print("\nTesting module content retrieval...")
    response = requests.get(url)
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
    
    return response.json()

def test_tts_download():
    """Test the TTS download endpoint"""
    url = "http://localhost:5001/api/tts/test-module-123"
    
    # Send GET request
    print("\nTesting TTS download...")
    response = requests.get(url)
    print("Status Code:", response.status_code)
    print("Content Type:", response.headers.get('Content-Type'))
    print("Content Length:", len(response.content), "bytes")
    
    # Save the audio file for testing
    if response.status_code == 200:
        with open("test_audio.mp3", "wb") as f:
            f.write(response.content)
        print("Audio file saved as test_audio.mp3")
    
    return response

def test_tts_stream():
    """Test the TTS streaming endpoint"""
    url = "http://localhost:5001/api/tts-stream/test-module-123"
    
    # Send GET request
    print("\nTesting TTS streaming...")
    response = requests.get(url, stream=True)
    print("Status Code:", response.status_code)
    print("Content Type:", response.headers.get('Content-Type'))
    
    # Save the streamed audio for testing
    if response.status_code == 200:
        with open("test_stream.mp3", "wb") as f:
            for chunk in response.iter_content(chunk_size=1024):
                if chunk:
                    f.write(chunk)
        print("Streamed audio saved as test_stream.mp3")
    
    return response

if __name__ == "__main__":
    # Test all endpoints
    test_module_content()
    test_tts_download()
    test_tts_stream()
    
    print("\nAll tests completed!")