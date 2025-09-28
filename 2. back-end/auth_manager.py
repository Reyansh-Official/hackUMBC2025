"""
Authentication Manager Module

This module provides functionality for user authentication using Supabase.
It integrates with the UserManager and SessionManager to create a complete
authentication flow.
"""

import os
import sys
from typing import Dict, Any, Optional, Tuple
from datetime import datetime

# Add the parent directory to sys.path to import the Supabase client
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.supabase_client.client import create_client

# Import the user and session managers
from user_manager import get_user_manager, User
from session_manager import get_session_manager

class AuthManager:
    """
    Singleton class for managing user authentication.
    
    This class provides methods for user authentication, registration,
    and session management using Supabase.
    """
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(AuthManager, cls).__new__(cls)
            cls._instance.supabase = create_client()
            cls._instance.user_manager = get_user_manager()
            cls._instance.session_manager = get_session_manager()
        return cls._instance
    
    def login(self, email: str, password: str) -> Tuple[bool, str, Optional[Dict[str, Any]], Optional[str]]:
        """
        Authenticate a user with email and password.
        
        Args:
            email: User's email
            password: User's password
            
        Returns:
            Tuple containing:
            - bool: Success status
            - str: Session ID or error message
            - Optional[Dict[str, Any]]: User data if successful, None otherwise
            - Optional[str]: JWT token if successful, None otherwise
        """
        try:
            # Authenticate with Supabase
            auth_response = self.supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            
            # Extract user data and token
            user_data = auth_response.user
            token = auth_response.session.access_token if auth_response.session else None
            
            if not user_data:
                return False, "Authentication failed", None, None
            
            # Get or create user in our system
            user_id = user_data.id
            user = self.user_manager.get_user(user_id)
            
            # Update last login
            self.supabase.table('users').update({
                'last_login': datetime.now().isoformat()
            }).eq('id', user_id).execute()
            
            # Create a session
            session_id = self.session_manager.create_session(user_id)
            
            return True, session_id, user.to_dict(), token
            
        except Exception as e:
            return False, f"Login error: {str(e)}", None, None
    
    def register(self, email: str, password: str, user_data: Dict[str, Any]) -> Tuple[bool, str, Optional[Dict[str, Any]], Optional[str]]:
        """
        Register a new user with email and password.
        
        Args:
            email: The user's email
            password: The user's password
            user_data: Additional user data
            
        Returns:
            Tuple containing:
            - bool: Success status
            - str: Session ID or error message
            - Optional[Dict[str, Any]]: User data if successful, None otherwise
            - Optional[str]: JWT token if successful, None otherwise
        """
        try:
            # Register with Supabase
            auth_response = self.supabase.auth.sign_up({
                "email": email,
                "password": password
            })
            
            # Extract user data and token
            supabase_user = auth_response.user
            token = auth_response.session.access_token if auth_response.session else None
            
            if not supabase_user:
                return False, "Registration failed", None, None
            
            # Create new user account with default empty values
            user_id = supabase_user.id
            user = User.create_new_account(user_id, email)
            
            # Add any additional user data if provided
            if user_data:
                for key, value in user_data.items():
                    setattr(user, key, value)
                user.save_data_to_supabase()
            
            # Create a session
            session_id = self.session_manager.create_session(user_id)
            
            return True, session_id, user.to_dict(), token
            
        except Exception as e:
            return False, f"Registration error: {str(e)}", None, None
    
    def logout(self, session_id: str) -> bool:
        """
        Log out a user by ending their session.
        
        Args:
            session_id: The session ID to end
            
        Returns:
            bool: True if logout was successful, False otherwise
        """
        try:
            # End the session
            success = self.session_manager.end_session(session_id)
            
            # Also sign out from Supabase
            self.supabase.auth.sign_out()
            
            return success
        except Exception as e:
            print(f"Logout error: {e}")
            return False
            
    def verify_token(self, token: str) -> Tuple[bool, Optional[str], Optional[Dict[str, Any]]]:
        """
        Verify a JWT token from Supabase and return the user information.
        
        Args:
            token: The JWT token to verify
            
        Returns:
            Tuple containing:
            - bool: Success status
            - Optional[str]: User ID if successful, error message otherwise
            - Optional[Dict[str, Any]]: User data if successful, None otherwise
        """
        try:
            # Verify token with Supabase
            response = self.supabase.auth.get_user(token)
            
            if not response or not response.user:
                return False, "Invalid token", None
                
            # Get user data
            user_id = response.user.id
            user = self.user_manager.get_user(user_id)
            
            if not user:
                return False, "User not found", None
                
            return True, user_id, user.to_dict()
            
        except Exception as e:
            print(f"Token verification error: {str(e)}")
            return False, f"Token verification error: {str(e)}", None
    
    def get_user_from_session(self, session_id: str) -> Optional[User]:
        """
        Get the User instance associated with a session.
        
        Args:
            session_id: The session ID
            
        Returns:
            Optional[User]: The User instance or None if session not found
        """
        return self.session_manager.get_user_from_session(session_id)
    
    def refresh_session(self, session_id: str) -> bool:
        """
        Refresh a session to prevent expiry.
        
        Args:
            session_id: The session ID to refresh
            
        Returns:
            bool: True if refresh was successful, False otherwise
        """
        user = self.session_manager.get_user_from_session(session_id)
        return user is not None
    
    def reset_password(self, email: str) -> bool:
        """
        Send a password reset email.
        
        Args:
            email: The email address to send the reset link to
            
        Returns:
            bool: True if email was sent successfully, False otherwise
        """
        try:
            self.supabase.auth.reset_password_for_email(email)
            return True
        except Exception as e:
            print(f"Password reset error: {e}")
            return False
    
    def update_password(self, session_id: str, new_password: str) -> bool:
        """
        Update a user's password.
        
        Args:
            session_id: The session ID
            new_password: The new password
            
        Returns:
            bool: True if update was successful, False otherwise
        """
        try:
            user = self.session_manager.get_user_from_session(session_id)
            if not user:
                return False
            
            # Update password in Supabase
            self.supabase.auth.update_user({"password": new_password})
            return True
        except Exception as e:
            print(f"Password update error: {e}")
            return False


# Create a singleton instance
auth_manager = AuthManager()

def get_auth_manager() -> AuthManager:
    """
    Get the AuthManager singleton instance.
    
    Returns:
        AuthManager: The AuthManager singleton instance
    """
    return auth_manager