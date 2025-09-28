import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps the app and makes auth object available to any child component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);
  
  // Check if user is logged in by calling the backend
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('auth_token');
        
        // If we have a token, the API interceptor will automatically add it to the request
        const response = await api.get('/api/user/me');
        if (response.success) {
          setCurrentUser(response.user);
        } else if (token) {
          // If we have a token but the request failed, the token might be invalid
          localStorage.removeItem('auth_token');
        }
      } catch (err) {
        console.log('Not authenticated or error fetching user');
        // Clear token if it exists but is invalid
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/user/login', { email, password });
      
      if (response.success) {
        // Store the authentication token
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        
        // Fetch user data
        const userResponse = await api.get('/api/user/me');
        if (userResponse.success) {
          setCurrentUser(userResponse.user);
          setIsNewUser(response.is_new_user);
          return { success: true, isNewUser: response.is_new_user };
        }
      } else {
        const errorMsg = response.message || 'Login failed';
        setError(errorMsg);
        // Use the global error handling system
        import('../components/ErrorBoundary').then(module => {
          module.showError(errorMsg);
        });
        return { success: false, message: errorMsg };
      }
      
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Login failed';
      setError(errorMsg);
      // Use the global error handling system
      import('../components/ErrorBoundary').then(module => {
        module.showError(errorMsg);
      });
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email, password, userData = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.post('/api/user/signup', { 
        email, 
        password,
        user_data: userData
      });
      
      if (response.success) {
        // Store the authentication token
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        
        // Fetch user data
        const userResponse = await api.get('/api/user/me');
        if (userResponse.success) {
          setCurrentUser(userResponse.user);
          setIsNewUser(true);
          return { success: true, isNewUser: true };
        }
      } else {
        const errorMsg = response.message || 'Signup failed';
        setError(errorMsg);
        // Use the global error handling system
        import('../components/ErrorBoundary').then(module => {
          module.showError(errorMsg);
        });
        return { success: false, message: errorMsg };
      }
      
      return { success: true, isNewUser: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Signup failed';
      setError(errorMsg);
      // Use the global error handling system
      import('../components/ErrorBoundary').then(module => {
        module.showError(errorMsg);
      });
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // Update user function
  const updateUser = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/api/user/interests', userData);
      
      if (response.success) {
        setCurrentUser(response.user);
        return { success: true };
      }
      
      return { success: false };
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
      return { success: false, error: err.response?.data?.error || 'Update failed' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await api.post('/api/user/logout');
      // Remove the authentication token
      localStorage.removeItem('auth_token');
      setCurrentUser(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Logout failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    updateUser,
    isNewUser,
    error,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;