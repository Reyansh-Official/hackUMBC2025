import os
from dotenv import load_dotenv
import httpx

# Load environment variables
load_dotenv()

def test_supabase_connection():
    """Test the connection to Supabase using a simple HTTP request"""
    # Get Supabase credentials from environment variables
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    
    if not supabase_url or not supabase_key:
        print("Error: Supabase URL and key must be set in environment variables")
        return False
    
    print(f"Using Supabase URL: {supabase_url}")
    print(f"Using Supabase Key: {supabase_key[:10]}...{supabase_key[-10:]}")
    
    try:
        # Make a simple HTTP request to the Supabase health endpoint
        headers = {
            "apikey": supabase_key,
            "Authorization": f"Bearer {supabase_key}"
        }
        
        # Try to access the REST API health endpoint
        response = httpx.get(f"{supabase_url}/rest/v1/", headers=headers)
        
        if response.status_code == 200:
            print("✅ Successfully connected to Supabase!")
            print("Connection established!")
            return True
        else:
            print(f"❌ Failed to connect to Supabase. Status code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Failed to connect to Supabase: {str(e)}")
        print("\nTroubleshooting tips:")
        print("1. Check if your Supabase URL and API key are correct")
        print("2. Make sure your IP is allowed in Supabase's API settings")
        print("3. Check if your Supabase project is active")
        return False

if __name__ == "__main__":
    print("Testing Supabase connection...")
    test_supabase_connection()