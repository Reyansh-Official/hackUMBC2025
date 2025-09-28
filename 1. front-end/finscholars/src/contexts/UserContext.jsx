import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

// Create context
const UserContext = createContext();

// Custom hook for using the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize user on mount
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (session?.user) {
          // User is logged in, fetch their data
          await fetchUserData(session.user.id);
        } else {
          // No active session
          setUser(null);
        }
      } catch (err) {
        console.error('Error checking session:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await fetchUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );
    
    // Cleanup subscription
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  // Fetch user data from Supabase
  const fetchUserData = async (userId) => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (userError) {
        // If user doesn't exist in our database yet, create a new record
        if (userError.code === 'PGRST116') {
          const { data: authUser } = await supabase.auth.getUser();
          
          // Create new user record
          const newUser = {
            id: userId,
            email: authUser.user.email,
            created_at: new Date().toISOString(),
            last_login: new Date().toISOString(),
            settings: {}
          };
          
          await supabase.from('users').insert(newUser);
          
          // Set default interests (empty for now)
          await fetchUserInterests(userId, []);
          
          setUser({
            ...newUser,
            interests: [],
            modules: [],
            badges: [],
            progress_percentage: 0,
            focus_mode_active: false,
            focus_sessions: []
          });
        } else {
          throw userError;
        }
      } else {
        // User exists, fetch related data
        const interests = await fetchUserInterests(userId);
        const modules = await fetchUserModules(userId);
        const badges = await fetchUserBadges(userId);
        const focusSessions = await fetchFocusSessions(userId);
        
        // Calculate progress
        const completedModules = modules.filter(module => module.completed).length;
        const progressPercentage = modules.length > 0 
          ? (completedModules / modules.length) * 100 
          : 0;
        
        // Check if there's an active focus session
        const activeFocusSession = focusSessions.find(session => !session.end_time);
        
        // Combine all user data
        setUser({
          ...userData,
          interests,
          modules,
          badges,
          progress_percentage: progressPercentage,
          focus_mode_active: !!activeFocusSession,
          focus_sessions: focusSessions
        });
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user interests
  const fetchUserInterests = async (userId, defaultInterests = null) => {
    try {
      const { data, error } = await supabase
        .from('user_interests')
        .select('interest')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // If we have interests, return them
      if (data && data.length > 0) {
        return data.map(item => item.interest);
      }
      
      // If we're setting default interests
      if (defaultInterests !== null) {
        // Insert default interests if provided
        if (defaultInterests.length > 0) {
          const interestRecords = defaultInterests.map(interest => ({
            user_id: userId,
            interest
          }));
          
          await supabase.from('user_interests').insert(interestRecords);
        }
        return defaultInterests;
      }
      
      // No interests found
      return [];
    } catch (err) {
      console.error('Error fetching interests:', err);
      return [];
    }
  };
  
  // Fetch user modules
  const fetchUserModules = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_modules')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching modules:', err);
      return [];
    }
  };
  
  // Fetch user badges
  const fetchUserBadges = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching badges:', err);
      return [];
    }
  };
  
  // Fetch focus sessions
  const fetchFocusSessions = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching focus sessions:', err);
      return [];
    }
  };
  
  // Update user interests
  const updateInterests = async (interests) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Delete existing interests
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id);
      
      // Insert new interests
      if (interests.length > 0) {
        const interestRecords = interests.map(interest => ({
          user_id: user.id,
          interest
        }));
        
        const { error } = await supabase
          .from('user_interests')
          .insert(interestRecords);
        
        if (error) throw error;
      }
      
      // Update local state
      setUser(prev => ({
        ...prev,
        interests
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating interests:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Update module progress
  const updateModuleProgress = async (moduleId, progressData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Check if module exists for user
      const { data, error: fetchError } = await supabase
        .from('user_modules')
        .select('id')
        .eq('user_id', user.id)
        .eq('module_id', moduleId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }
      
      let result;
      
      if (data) {
        // Update existing module
        result = await supabase
          .from('user_modules')
          .update(progressData)
          .eq('user_id', user.id)
          .eq('module_id', moduleId);
      } else {
        // Insert new module progress
        result = await supabase
          .from('user_modules')
          .insert({
            user_id: user.id,
            module_id: moduleId,
            ...progressData,
            created_at: new Date().toISOString()
          });
      }
      
      if (result.error) throw result.error;
      
      // Refresh user data
      await fetchUserData(user.id);
      
      return { success: true };
    } catch (err) {
      console.error('Error updating module progress:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Add a badge
  const addBadge = async (badgeId, badgeData) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Check if badge already exists
      const { data, error: fetchError } = await supabase
        .from('user_badges')
        .select('id')
        .eq('user_id', user.id)
        .eq('badge_id', badgeId)
        .single();
      
      // If badge already exists, just return success
      if (data) {
        return { success: true, alreadyExists: true };
      }
      
      // Add new badge
      const { error } = await supabase
        .from('user_badges')
        .insert({
          user_id: user.id,
          badge_id: badgeId,
          earned_at: new Date().toISOString(),
          ...badgeData
        });
      
      if (error) throw error;
      
      // Refresh user data
      await fetchUserData(user.id);
      
      return { success: true, alreadyExists: false };
    } catch (err) {
      console.error('Error adding badge:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Start focus session
  const startFocusSession = async () => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Check if there's already an active session
      if (user.focus_mode_active) {
        return { success: false, error: 'Focus session already active' };
      }
      
      // Create new focus session
      const sessionData = {
        user_id: user.id,
        start_time: new Date().toISOString(),
        end_time: null,
        duration_minutes: 0
      };
      
      const { data, error } = await supabase
        .from('focus_sessions')
        .insert(sessionData)
        .select()
        .single();
      
      if (error) throw error;
      
      // Update local state
      setUser(prev => ({
        ...prev,
        focus_mode_active: true,
        focus_sessions: [data, ...prev.focus_sessions]
      }));
      
      return { success: true, session: data };
    } catch (err) {
      console.error('Error starting focus session:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // End focus session
  const endFocusSession = async (sessionId = null) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // If no sessionId provided, find the most recent active session
      if (!sessionId && user.focus_sessions.length > 0) {
        const activeSession = user.focus_sessions.find(s => !s.end_time);
        if (activeSession) {
          sessionId = activeSession.id;
        }
      }
      
      if (!sessionId) {
        return { success: false, error: 'No active focus session found' };
      }
      
      // Calculate duration
      const now = new Date();
      
      // Get the session to update
      const { data: sessionData, error: fetchError } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
      
      if (fetchError) throw fetchError;
      
      const startTime = new Date(sessionData.start_time);
      const durationMinutes = (now - startTime) / (1000 * 60);
      
      // Update the session
      const { error } = await supabase
        .from('focus_sessions')
        .update({
          end_time: now.toISOString(),
          duration_minutes: Math.round(durationMinutes * 100) / 100
        })
        .eq('id', sessionId);
      
      if (error) throw error;
      
      // Refresh user data
      await fetchUserData(user.id);
      
      return { success: true };
    } catch (err) {
      console.error('Error ending focus session:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };
  
  // Update user settings
  const updateSettings = async (settings) => {
    if (!user) return { success: false, error: 'User not authenticated' };
    
    try {
      setLoading(true);
      
      // Merge with existing settings
      const updatedSettings = { ...user.settings, ...settings };
      
      // Update in database
      const { error } = await supabase
        .from('users')
        .update({ settings: updatedSettings })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update local state
      setUser(prev => ({
        ...prev,
        settings: updatedSettings
      }));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating settings:', err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Value object with user data and methods
  const value = {
    user,
    loading,
    error,
    updateInterests,
    updateModuleProgress,
    addBadge,
    startFocusSession,
    endFocusSession,
    updateSettings,
    refreshUser: () => user && fetchUserData(user.id)
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;