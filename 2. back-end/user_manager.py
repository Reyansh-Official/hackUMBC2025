"""
User Manager Module

This module defines the User class which serves as the blueprint for every individual user account,
encapsulating all their unique data and providing methods for interacting with the Supabase database.
"""

import os
import sys
from datetime import datetime
from typing import Dict, List, Optional, Any

# Add the parent directory to sys.path to import the Supabase client
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append('/Users/awsmebacon311/Downloads/hackUMBC2025/3. database')
from supabase_client.client import create_client

class User:
    """
    User class that represents an individual user in the system.
    
    This class encapsulates all user-specific data and provides methods
    for fetching, updating, and persisting user information to Supabase.
    """
    
    def __init__(self, user_id: str, email: Optional[str] = None):
        """
        Initialize a User instance.
        
        Args:
            user_id: The unique identifier for the user
            email: The user's email address (optional)
        """
        # Core attributes
        self.id = user_id
        self.email = email
        self.created_at = datetime.now().isoformat()
        self.last_login = self.created_at
        
        # Personalization attributes
        self.interests = []
        self.modules = []
        self.badges = []
        self.progress_percentage = 0
        self.focus_mode_active = False
        self.focus_sessions = []
        
        # Additional attributes
        self.display_name = None
        self.profile_image_url = None
        self.settings = {}
        
        # Initialize Supabase client
        self.supabase = create_client()
        
        # Load user data if user_id is provided
        if user_id:
            self.load_data_from_supabase()
            
    def load_data_from_supabase(self) -> bool:
        """
        Load user data from Supabase database.
        
        Returns:
            bool: True if data was loaded successfully, False otherwise
        """
        try:
            # Query the users table for this user's data
            response = self.supabase.table('users').select('*').eq('id', self.id).execute()
            
            # Check if we got any data back
            if response.data and len(response.data) > 0:
                user_data = response.data[0]
                
                # Update user attributes with data from database
                self.email = user_data.get('email', self.email)
                self.created_at = user_data.get('created_at', self.created_at)
                self.last_login = user_data.get('last_login', self.last_login)
                self.interests = user_data.get('interests', [])
                self.modules = user_data.get('modules', [])
                self.badges = user_data.get('badges', [])
                self.progress_percentage = user_data.get('progress_percentage', 0)
                self.focus_mode_active = user_data.get('focus_mode_active', False)
                self.focus_sessions = user_data.get('focus_sessions', [])
                self.display_name = user_data.get('display_name')
                self.profile_image_url = user_data.get('profile_image_url')
                self.settings = user_data.get('settings', {})
                
                return True
            else:
                print(f"No data found for user {self.id}")
                return False
                
        except Exception as e:
            print(f"Error loading user data from Supabase: {str(e)}")
            return False
    
    def save_data_to_supabase(self) -> bool:
        """
        Save user data to Supabase database.
        
        Returns:
            bool: True if data was saved successfully, False otherwise
        """
        try:
            # Prepare user data for saving
            user_data = {
                'email': self.email,
                'last_login': datetime.now().isoformat(),  # Update last login time
                'interests': self.interests,
                'modules': self.modules,
                'badges': self.badges,
                'progress_percentage': self.progress_percentage,
                'focus_mode_active': self.focus_mode_active,
                'focus_sessions': self.focus_sessions,
                'display_name': self.display_name,
                'profile_image_url': self.profile_image_url,
                'settings': self.settings
            }
            
            # Update the user record in the database
            self.supabase.table('users').update(user_data).eq('id', self.id).execute()
            return True
            
        except Exception as e:
            print(f"Error saving user data to Supabase: {str(e)}")
            return False
    
    @classmethod
    def create_new_account(cls, user_id: str, email: str) -> 'User':
        """
        Create a new user account with default empty values.
        
        Args:
            user_id: The unique identifier for the user
            email: The user's email address
            
        Returns:
            User: A new User instance with default values
        """
        # Create a new user instance with default values
        user = cls(user_id, email)
        
        # Save the initial empty state to Supabase
        user_data = {
            'id': user_id,
            'email': email,
            'created_at': user.created_at,
            'last_login': user.last_login,
            'interests': [],
            'modules': [],
            'badges': [],
            'progress_percentage': 0,
            'focus_sessions': [],
            'settings': {}
        }
        
        # Insert the new user into the database
        user.supabase.table('users').insert(user_data).execute()
        
        return user
    
    @classmethod
    def create_new_account(cls, user_id: str, email: str, display_name: Optional[str] = None) -> 'User':
        """
        Create a new user account with default empty values.
        This method is specifically for the onboarding process of new users.
        
        Args:
            user_id: The unique identifier for the user
            email: The user's email address
            display_name: The user's display name (optional)
            
        Returns:
            User: A new User instance with default values
        """
        # Create a new user instance with default values
        user = cls(user_id, email)
        user.display_name = display_name or email.split('@')[0]
        
        # Save the new user to Supabase with default empty values
        try:
            # Create user record in the users table
            user.supabase.table('users').insert({
                'id': user_id,
                'email': email,
                'display_name': user.display_name,
                'profile_image_url': None,
                'progress_percentage': 0,
                'focus_mode_active': False,
                'settings': user.settings,
                'created_at': user.created_at,
                'last_login': user.last_login
            }).execute()
            
            return user
        except Exception as e:
            print(f"Error creating new user account: {e}")
            return None
        
        # Initialize Supabase client
        self.supabase = create_client()
        
        # Load user data if user_id is provided
        if user_id:
            self.load_user_data()
    
    def load_user_data(self) -> bool:
        """
        Load user data from Supabase.
        
        Returns:
            bool: True if data was loaded successfully, False otherwise
        """
        try:
            # Fetch user profile data
            user_data = self.supabase.table('users').select('*').eq('id', self.id).execute()
            
            if user_data.data and len(user_data.data) > 0:
                user = user_data.data[0]
                self.email = user.get('email', self.email)
                self.display_name = user.get('display_name')
                self.profile_image_url = user.get('profile_image_url')
                self.created_at = user.get('created_at')
                self.last_login = user.get('last_login')
                self.settings = user.get('settings', {})
                
                # Load interests
                self._load_interests()
                
                # Load modules progress
                self._load_modules()
                
                # Load badges
                self._load_badges()
                
                # Load focus sessions
                self._load_focus_sessions()
                
                # Calculate overall progress
                self._calculate_progress()
                
                return True
            return False
        except Exception as e:
            print(f"Error loading user data: {e}")
            return False
    
    def _load_interests(self):
        """Load user interests from Supabase."""
        try:
            interests_data = self.supabase.table('user_interests').select('*').eq('user_id', self.id).execute()
            if interests_data.data:
                self.interests = [item.get('interest') for item in interests_data.data]
        except Exception as e:
            print(f"Error loading interests: {e}")
    
    def _load_modules(self):
        """Load user modules and progress from Supabase."""
        try:
            modules_data = self.supabase.table('user_modules').select('*').eq('user_id', self.id).execute()
            if modules_data.data:
                self.modules = modules_data.data
        except Exception as e:
            print(f"Error loading modules: {e}")
    
    def _load_badges(self):
        """Load user badges from Supabase."""
        try:
            badges_data = self.supabase.table('user_badges').select('*').eq('user_id', self.id).execute()
            if badges_data.data:
                self.badges = badges_data.data
        except Exception as e:
            print(f"Error loading badges: {e}")
    
    def _load_focus_sessions(self):
        """Load user focus sessions from Supabase."""
        try:
            focus_data = self.supabase.table('focus_sessions').select('*').eq('user_id', self.id).order('created_at', desc=True).limit(10).execute()
            if focus_data.data:
                self.focus_sessions = focus_data.data
                # Check if there's an active focus session
                active_sessions = [s for s in focus_data.data if s.get('end_time') is None]
                self.focus_mode_active = len(active_sessions) > 0
        except Exception as e:
            print(f"Error loading focus sessions: {e}")
    
    def _calculate_progress(self):
        """Calculate overall progress percentage based on completed modules."""
        if not self.modules:
            self.progress_percentage = 0
            return
        
        completed_modules = sum(1 for module in self.modules if module.get('completed', False))
        self.progress_percentage = (completed_modules / len(self.modules)) * 100
    
    def update_interests(self, interests: List[str]) -> bool:
        """
        Update user interests in Supabase.
        
        Args:
            interests: List of interest strings
            
        Returns:
            bool: True if update was successful, False otherwise
        """
        try:
            # First delete existing interests
            self.supabase.table('user_interests').delete().eq('user_id', self.id).execute()
            
            # Then insert new interests
            interest_records = [{'user_id': self.id, 'interest': interest} for interest in interests]
            if interest_records:
                self.supabase.table('user_interests').insert(interest_records).execute()
            
            # Update local interests
            self.interests = interests
            return True
        except Exception as e:
            print(f"Error updating interests: {e}")
            return False
    
    def update_module_progress(self, module_id: str, progress: Dict[str, Any]) -> bool:
        """
        Update progress for a specific module.
        
        Args:
            module_id: The ID of the module to update
            progress: Dictionary containing progress data
            
        Returns:
            bool: True if update was successful, False otherwise
        """
        try:
            # Check if module exists for user
            module_data = self.supabase.table('user_modules').select('*').eq('user_id', self.id).eq('module_id', module_id).execute()
            
            if module_data.data and len(module_data.data) > 0:
                # Update existing module
                self.supabase.table('user_modules').update(progress).eq('user_id', self.id).eq('module_id', module_id).execute()
            else:
                # Insert new module progress
                progress['user_id'] = self.id
                progress['module_id'] = module_id
                progress['created_at'] = datetime.now().isoformat()
                self.supabase.table('user_modules').insert(progress).execute()
            
            # Reload modules and recalculate progress
            self._load_modules()
            self._calculate_progress()
            return True
        except Exception as e:
            print(f"Error updating module progress: {e}")
            return False
    
    def add_badge(self, badge_id: str, badge_data: Dict[str, Any]) -> bool:
        """
        Add a new badge for the user.
        
        Args:
            badge_id: The ID of the badge to add
            badge_data: Dictionary containing badge data
            
        Returns:
            bool: True if badge was added successfully, False otherwise
        """
        try:
            # Check if badge already exists
            badge_check = self.supabase.table('user_badges').select('*').eq('user_id', self.id).eq('badge_id', badge_id).execute()
            
            if badge_check.data and len(badge_check.data) > 0:
                # Badge already exists, no need to add
                return True
            
            # Add new badge
            badge_record = {
                'user_id': self.id,
                'badge_id': badge_id,
                'earned_at': datetime.now().isoformat(),
                **badge_data
            }
            self.supabase.table('user_badges').insert(badge_record).execute()
            
            # Reload badges
            self._load_badges()
            return True
        except Exception as e:
            print(f"Error adding badge: {e}")
            return False
    
    def start_focus_session(self) -> Dict[str, Any]:
        """
        Start a new focus session.
        
        Returns:
            Dict: The created focus session data or empty dict if failed
        """
        try:
            # Check if there's already an active session
            if self.focus_mode_active:
                return {}
            
            # Create new focus session
            session_data = {
                'user_id': self.id,
                'start_time': datetime.now().isoformat(),
                'end_time': None,
                'duration_minutes': 0
            }
            
            result = self.supabase.table('focus_sessions').insert(session_data).execute()
            
            if result.data and len(result.data) > 0:
                session = result.data[0]
                self.focus_mode_active = True
                self.focus_sessions.insert(0, session)
                return session
            return {}
        except Exception as e:
            print(f"Error starting focus session: {e}")
            return {}
    
    def end_focus_session(self, session_id: Optional[str] = None) -> bool:
        """
        End an active focus session.
        
        Args:
            session_id: Optional ID of the session to end. If None, ends the most recent active session.
            
        Returns:
            bool: True if session was ended successfully, False otherwise
        """
        try:
            # If no session_id provided, find the most recent active session
            if not session_id and self.focus_sessions:
                active_sessions = [s for s in self.focus_sessions if s.get('end_time') is None]
                if active_sessions:
                    session_id = active_sessions[0].get('id')
            
            if not session_id:
                return False
            
            # Calculate duration
            now = datetime.now()
            
            # Get the session to update
            session_data = self.supabase.table('focus_sessions').select('*').eq('id', session_id).execute()
            
            if session_data.data and len(session_data.data) > 0:
                session = session_data.data[0]
                start_time = datetime.fromisoformat(session.get('start_time').replace('Z', '+00:00'))
                duration_minutes = (now - start_time).total_seconds() / 60
                
                # Update the session
                update_data = {
                    'end_time': now.isoformat(),
                    'duration_minutes': round(duration_minutes, 2)
                }
                
                self.supabase.table('focus_sessions').update(update_data).eq('id', session_id).execute()
                
                # Update local state
                self.focus_mode_active = False
                self._load_focus_sessions()
                return True
            return False
        except Exception as e:
            print(f"Error ending focus session: {e}")
            return False
    
    def update_settings(self, settings: Dict[str, Any]) -> bool:
        """
        Update user settings.
        
        Args:
            settings: Dictionary of settings to update
            
        Returns:
            bool: True if settings were updated successfully, False otherwise
        """
        try:
            # Merge with existing settings
            updated_settings = {**self.settings, **settings}
            
            # Update in database
            self.supabase.table('users').update({'settings': updated_settings}).eq('id', self.id).execute()
            
            # Update local settings
            self.settings = updated_settings
            return True
        except Exception as e:
            print(f"Error updating settings: {e}")
            return False
    
    def save_data_to_supabase(self) -> bool:
        """
        Persist all user data to Supabase.
        This method should be called after any significant changes to user data.
        
        Returns:
            bool: True if data was saved successfully, False otherwise
        """
        try:
            # Update core user data
            self.supabase.table('users').update({
                'email': self.email,
                'display_name': self.display_name,
                'profile_image_url': self.profile_image_url,
                'settings': self.settings,
                'last_updated': datetime.now().isoformat()
            }).eq('id', self.id).execute()
            
            # Update interests (if they've changed)
            current_interests = set(self.interests)
            db_interests_data = self.supabase.table('user_interests').select('interest').eq('user_id', self.id).execute()
            db_interests = set(item.get('interest') for item in db_interests_data.data) if db_interests_data.data else set()
            
            if current_interests != db_interests:
                self.update_interests(list(current_interests))
            
            # For modules, badges, and focus sessions, we rely on their specific update methods
            # as they are typically updated individually rather than in bulk
            
            return True
        except Exception as e:
            print(f"Error saving user data: {e}")
            return False
    
    def to_dict(self) -> Dict[str, Any]:
        """
        Convert user object to dictionary for frontend use.
        
        Returns:
            Dict: User data as a dictionary
        """
        return {
            'id': self.id,
            'email': self.email,
            'display_name': self.display_name,
            'profile_image_url': self.profile_image_url,
            'interests': self.interests,
            'modules': self.modules,
            'badges': self.badges,
            'progress_percentage': self.progress_percentage,
            'focus_mode_active': self.focus_mode_active,
            'focus_sessions': self.focus_sessions[:5] if self.focus_sessions else [],
            'settings': self.settings,
            'created_at': self.created_at,
            'last_login': self.last_login
        }


# User Manager singleton for managing user instances
class UserManager:
    """
    Singleton class for managing User instances.
    
    This class provides methods for creating, retrieving, and managing User objects.
    It also handles session caching for improved performance during user sessions.
    """
    
    _instance = None
    _users = {}
    _session_cache = {}  # Cache for storing user session data
    _session_expiry = {}  # Track when sessions should expire
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(UserManager, cls).__new__(cls)
            cls._instance._users = {}
            cls._instance._session_cache = {}
            cls._instance._session_expiry = {}
            cls._instance.supabase = create_client()
        return cls._instance
    
    def get_user(self, user_id: str) -> User:
        """
        Get a User instance by ID. Creates a new instance if not found.
        Uses cached instance if available for improved performance.
        
        Args:
            user_id: The ID of the user to retrieve
            
        Returns:
            User: The User instance
        """
        if user_id not in self._users:
            # Check if we have cached data for this user
            if user_id in self._session_cache:
                # Create user from cached data
                user = User(user_id)
                self._apply_cached_data(user, self._session_cache[user_id])
                self._users[user_id] = user
            else:
                # Create new user and load from database
                self._users[user_id] = User(user_id)
                # Cache the user data after loading
                self._cache_user_data(user_id)
        
        # Refresh session expiry
        self._refresh_session_expiry(user_id)
        return self._users[user_id]
    
    def _apply_cached_data(self, user: User, cached_data: Dict[str, Any]):
        """
        Apply cached data to a user instance without database queries.
        
        Args:
            user: The User instance to update
            cached_data: The cached user data
        """
        # Apply all cached attributes to the user object
        for key, value in cached_data.items():
            if hasattr(user, key):
                setattr(user, key, value)
    
    def _cache_user_data(self, user_id: str):
        """
        Cache user data for faster access in subsequent requests.
        
        Args:
            user_id: The ID of the user to cache
        """
        if user_id in self._users:
            user = self._users[user_id]
            # Store all relevant user data in the cache
            self._session_cache[user_id] = user.to_dict()
            # Set session expiry (30 minutes from now)
            self._refresh_session_expiry(user_id)
    
    def _refresh_session_expiry(self, user_id: str, expiry_minutes: int = 30):
        """
        Refresh the session expiry time for a user.
        
        Args:
            user_id: The ID of the user
            expiry_minutes: Minutes until session expires (default: 30)
        """
        self._session_expiry[user_id] = datetime.now().timestamp() + (expiry_minutes * 60)
    
    def save_user_to_cache(self, user_id: str):
        """
        Save the current state of a user to the session cache.
        Call this after any operation that modifies user data.
        
        Args:
            user_id: The ID of the user to save
        """
        if user_id in self._users:
            self._cache_user_data(user_id)
    
    def clear_expired_sessions(self):
        """
        Clear expired user sessions from cache.
        This should be called periodically to free up memory.
        """
        now = datetime.now().timestamp()
        expired_sessions = [user_id for user_id, expiry in self._session_expiry.items() 
                           if expiry < now]
        
        for user_id in expired_sessions:
            if user_id in self._session_cache:
                del self._session_cache[user_id]
            if user_id in self._session_expiry:
                del self._session_expiry[user_id]
            # Don't remove from _users as they might still be in use
    
    def create_user(self, user_data: Dict[str, Any]) -> User:
        """
        Create a new user in the system.
        
        Args:
            user_data: Dictionary containing user data
            
        Returns:
            User: The created User instance
        """
        try:
            # Create user in Supabase
            user_id = user_data.get('id')
            email = user_data.get('email')
            
            if not user_id:
                raise ValueError("User ID is required")
            
            # Create user record if it doesn't exist
            user_check = self.supabase.table('users').select('id').eq('id', user_id).execute()
            
            if not user_check.data or len(user_check.data) == 0:
                # User doesn't exist, create it
                user_record = {
                    'id': user_id,
                    'email': email,
                    'created_at': datetime.now().isoformat(),
                    'last_login': datetime.now().isoformat()
                }
                self.supabase.table('users').insert(user_record).execute()
            else:
                # User exists, update last login
                self.supabase.table('users').update({
                    'last_login': datetime.now().isoformat()
                }).eq('id', user_id).execute()
            
            # Create and return User instance
            user = User(user_id, email)
            self._users[user_id] = user
            
            # Cache the new user
            self._cache_user_data(user_id)
            
            return user
        except Exception as e:
            print(f"Error creating user: {e}")
            # Return a new User instance anyway, but it won't be saved in the database
            user = User(user_data.get('id', ''), user_data.get('email'))
            return user
    
    def remove_user(self, user_id: str) -> bool:
        """
        Remove a User instance from the manager and clear from cache.
        
        Args:
            user_id: The ID of the user to remove
            
        Returns:
            bool: True if user was removed, False otherwise
        """
        removed = False
        
        if user_id in self._users:
            del self._users[user_id]
            removed = True
        
        if user_id in self._session_cache:
            del self._session_cache[user_id]
        
        if user_id in self._session_expiry:
            del self._session_expiry[user_id]
            
        return removed
        
    def get_active_sessions_count(self) -> int:
        """
        Get the count of active user sessions.
        
        Returns:
            int: Number of active sessions
        """
        return len(self._session_cache)


# Create a singleton instance
user_manager = UserManager()

def get_user_manager() -> UserManager:
    """
    Get the UserManager singleton instance.
    
    Returns:
        UserManager: The UserManager singleton instance
    """
    return user_manager