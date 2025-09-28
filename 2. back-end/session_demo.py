"""
Session Management Demo

This script demonstrates the user session and data flow functionality.
"""

import time
from user_manager import get_user_manager
from session_manager import get_session_manager
from auth_manager import get_auth_manager

def run_demo():
    """Run a demonstration of the session management system."""
    print("=== User Session and Data Flow Demo ===")
    
    # Get manager instances
    user_manager = get_user_manager()
    session_manager = get_session_manager()
    auth_manager = get_auth_manager()
    
    # Simulate user login
    print("\n1. User Authentication")
    print("-----------------------")
    # In a real app, this would use auth_manager.login()
    # For demo purposes, we'll create a test user directly
    test_user_id = "test_user_123"
    user = user_manager.get_user(test_user_id)
    session_id = session_manager.create_session(test_user_id)
    print(f"User authenticated: {test_user_id}")
    print(f"Session created: {session_id}")
    
    # Simulate user data loading
    print("\n2. User Data Loading")
    print("---------------------")
    print("User data loaded from database and cached in memory")
    print(f"User interests: {user.interests}")
    print(f"User progress: {user.progress_percentage}%")
    
    # Simulate user interaction
    print("\n3. User Interaction")
    print("--------------------")
    print("User completes a module...")
    # Update user data
    if not user.modules:
        user.modules = [{"module_id": "mod1", "completed": False}]
    user.modules[0]["completed"] = True
    user.progress_percentage = 100 if user.modules else 0
    print("Module marked as completed")
    
    # Simulate data persistence
    print("\n4. Data Persistence")
    print("-------------------")
    print("Changes applied to User instance in memory")
    print("Saving changes to database...")
    # In a real app, this would call user.save_data_to_supabase()
    print("Data persisted to Supabase")
    
    # Simulate session management
    print("\n5. Session Management")
    print("---------------------")
    print(f"Active sessions: {session_manager.get_active_sessions_count()}")
    print("User continues browsing...")
    
    # Simulate retrieving user from session
    retrieved_user = session_manager.get_user_from_session(session_id)
    print(f"User retrieved from session: {retrieved_user.id}")
    print(f"Progress is still tracked: {retrieved_user.progress_percentage}%")
    
    # Simulate user logout
    print("\n6. User Logout")
    print("---------------")
    session_manager.end_session(session_id)
    print("Session ended")
    print(f"Active sessions: {session_manager.get_active_sessions_count()}")
    
    # Simulate user login from another device
    print("\n7. User Login from Another Device")
    print("---------------------------------")
    new_session_id = session_manager.create_session(test_user_id)
    print(f"New session created: {new_session_id}")
    
    # Retrieve user data again
    new_user = session_manager.get_user_from_session(new_session_id)
    print(f"User data retrieved: {new_user.id}")
    print(f"Progress is persisted: {new_user.progress_percentage}%")
    
    # Cleanup
    session_manager.end_session(new_session_id)
    user_manager.remove_user(test_user_id)
    
    print("\n=== Demo Complete ===")

if __name__ == "__main__":
    run_demo()