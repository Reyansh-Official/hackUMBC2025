"""
Session Manager Module

This module provides functionality for managing user sessions in the application.
It works with the UserManager to provide efficient caching and persistence of user data.
"""

import os
import sys
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import threading
import time

# Add the parent directory to sys.path to import the Supabase client
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from database.supabase_client.client import create_client

# Import the user manager
from user_manager import get_user_manager, User

class SessionManager:
    """
    Singleton class for managing user sessions.
    
    This class provides methods for creating, retrieving, and managing user sessions.
    It works with the UserManager to ensure efficient caching and persistence of user data.
    """
    
    _instance = None
    _sessions = {}  # Map of session_id to user_id
    _session_data = {}  # Additional session-specific data
    _session_expiry = {}  # Track when sessions should expire
    _cleanup_interval = 15 * 60  # 15 minutes in seconds
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(SessionManager, cls).__new__(cls)
            cls._instance._sessions = {}
            cls._instance._session_data = {}
            cls._instance._session_expiry = {}
            cls._instance.supabase = create_client()
            cls._instance.user_manager = get_user_manager()
            
            # Start cleanup thread
            cls._instance._start_cleanup_thread()
            
        return cls._instance
    
    def _start_cleanup_thread(self):
        """Start a background thread to clean up expired sessions."""
        def cleanup_task():
            while True:
                time.sleep(self._cleanup_interval)
                self.clear_expired_sessions()
                self.user_manager.clear_expired_sessions()
        
        cleanup_thread = threading.Thread(target=cleanup_task, daemon=True)
        cleanup_thread.start()
    
    def create_session(self, user_id: str) -> str:
        """
        Create a new session for a user.
        
        Args:
            user_id: The ID of the user
            
        Returns:
            str: The session ID
        """
        # Generate a unique session ID
        session_id = f"{user_id}_{datetime.now().timestamp()}"
        
        # Store the session
        self._sessions[session_id] = user_id
        self._session_data[session_id] = {
            'created_at': datetime.now().isoformat(),
            'last_activity': datetime.now().isoformat(),
            'ip_address': None,
            'user_agent': None
        }
        
        # Set session expiry (2 hours from now)
        self._refresh_session_expiry(session_id)
        
        return session_id
    
    def get_user_from_session(self, session_id: str) -> Optional[User]:
        """
        Get the User instance associated with a session.
        
        Args:
            session_id: The session ID
            
        Returns:
            Optional[User]: The User instance or None if session not found
        """
        if session_id in self._sessions:
            user_id = self._sessions[session_id]
            # Refresh session expiry
            self._refresh_session_expiry(session_id)
            # Update last activity
            self._session_data[session_id]['last_activity'] = datetime.now().isoformat()
            # Get user from UserManager (which uses caching)
            return self.user_manager.get_user(user_id)
        return None
    
    def _refresh_session_expiry(self, session_id: str, hours: int = 2):
        """
        Refresh the session expiry time.
        
        Args:
            session_id: The session ID
            hours: Hours until session expires (default: 2)
        """
        self._session_expiry[session_id] = datetime.now() + timedelta(hours=hours)
    
    def end_session(self, session_id: str) -> bool:
        """
        End a user session.
        
        Args:
            session_id: The session ID
            
        Returns:
            bool: True if session was ended, False otherwise
        """
        if session_id in self._sessions:
            user_id = self._sessions[session_id]
            
            # Remove session
            del self._sessions[session_id]
            
            if session_id in self._session_data:
                del self._session_data[session_id]
            
            if session_id in self._session_expiry:
                del self._session_expiry[session_id]
            
            # Don't remove user from UserManager as they might be used in other sessions
            return True
        return False
    
    def clear_expired_sessions(self):
        """Clear expired sessions."""
        now = datetime.now()
        expired_sessions = [
            session_id for session_id, expiry in self._session_expiry.items() 
            if expiry < now
        ]
        
        for session_id in expired_sessions:
            self.end_session(session_id)
    
    def update_session_metadata(self, session_id: str, metadata: Dict[str, Any]) -> bool:
        """
        Update session metadata.
        
        Args:
            session_id: The session ID
            metadata: Dictionary of metadata to update
            
        Returns:
            bool: True if update was successful, False otherwise
        """
        if session_id in self._session_data:
            self._session_data[session_id].update(metadata)
            return True
        return False
    
    def get_active_sessions_count(self) -> int:
        """
        Get the count of active sessions.
        
        Returns:
            int: Number of active sessions
        """
        return len(self._sessions)
    
    def get_user_sessions(self, user_id: str) -> Dict[str, Any]:
        """
        Get all active sessions for a user.
        
        Args:
            user_id: The user ID
            
        Returns:
            Dict[str, Any]: Dictionary of session IDs to session data
        """
        user_sessions = {}
        for session_id, session_user_id in self._sessions.items():
            if session_user_id == user_id:
                user_sessions[session_id] = self._session_data.get(session_id, {})
        return user_sessions


# Create a singleton instance
session_manager = SessionManager()

def get_session_manager() -> SessionManager:
    """
    Get the SessionManager singleton instance.
    
    Returns:
        SessionManager: The SessionManager singleton instance
    """
    return session_manager