import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

class SupabaseClient:
    """Singleton class for Supabase client"""
    _instance = None
    _client = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SupabaseClient, cls).__new__(cls)
            # Initialize the Supabase client
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_KEY")
            
            if not supabase_url or not supabase_key:
                raise ValueError("Supabase URL and key must be set in environment variables")
            
            # Create client with proper options format
            cls._client = create_client(supabase_url, supabase_key)
        return cls._instance

    @property
    def client(self) -> Client:
        """Get the Supabase client instance"""
        return self._client

# Create a global instance
supabase = SupabaseClient().client