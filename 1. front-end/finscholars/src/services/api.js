// API service functions for FinScholars
import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_TIMEOUT = 30000; // 30 seconds

// Global loading state tracking
let loadingCallbacks = [];
let activeRequests = 0;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Register loading state callbacks
export const registerLoadingCallback = (callback) => {
  loadingCallbacks.push(callback);
  return () => {
    loadingCallbacks = loadingCallbacks.filter(cb => cb !== callback);
  };
};

// Update loading state
const updateLoadingState = (isLoading) => {
  loadingCallbacks.forEach(callback => callback(isLoading));
};

// Request interceptor for handling common request tasks
apiClient.interceptors.request.use(
  (config) => {
    // Increment active requests counter
    activeRequests++;
    updateLoadingState(true);
    
    // Add auth token to request if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Decrement on request error
    activeRequests--;
    if (activeRequests === 0) {
      updateLoadingState(false);
    }
    return Promise.reject(error);
  }
);

// Response interceptor for handling common response tasks
apiClient.interceptors.response.use(
  (response) => {
    // Decrement active requests counter
    activeRequests--;
    if (activeRequests === 0) {
      updateLoadingState(false);
    }
    return response;
  },
  (error) => {
    // Decrement active requests counter
    activeRequests--;
    if (activeRequests === 0) {
      updateLoadingState(false);
    }
    
    // Handle common errors (401, 403, 500, etc.)
    if (error.response) {
      // Server responded with an error status
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('API No Response:', error.request);
    } else {
      // Something else happened while setting up the request
      console.error('API Request Error:', error.message);
    }
    
    // Create standardized error object
    const enhancedError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      originalError: error
    };
    
    return Promise.reject(enhancedError);
  }
);

// Generic API methods
export const api = {
  // GET request
  get: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // POST request
  post: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // PUT request
  put: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // File upload with FormData
  upload: async (endpoint, formData) => {
    try {
      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Specific API functions
/**
 * Fetch user progress data from the API
 * @returns {Promise} Promise that resolves to user progress data
 */
export const fetchUserProgress = async () => {
  try {
    return await api.get('/api/user/me');
  } catch (error) {
    console.error('Error fetching user progress:', error);
    // Return mock data for development/fallback
    return {
      modules: [
        {
          id: 1,
          title: 'Introduction to Finance',
          description: 'Learn the fundamentals of finance and basic concepts to build your knowledge foundation.',
          progress: 100,
          completed: true
        },
        {
          id: 2,
          title: 'Budgeting Basics',
          description: 'Master the art of creating and maintaining a personal budget to achieve financial goals.',
          progress: 65,
          completed: false
        },
        {
          id: 3,
          title: 'Investment Strategies',
          description: 'Explore different investment vehicles and strategies to grow your wealth over time.',
          progress: 30,
          completed: false
        },
        {
          id: 4,
          title: 'Retirement Planning',
          description: 'Plan for your future by understanding retirement accounts and long-term financial planning.',
          progress: 10,
          completed: false
        },
        {
          id: 5,
          title: 'Tax Optimization',
          description: 'Learn legal strategies to minimize your tax burden and maximize your after-tax income.',
          progress: 0,
          completed: false
        },
        {
          id: 6,
          title: 'Real Estate Investing',
          description: 'Understand the fundamentals of real estate as an investment vehicle and wealth builder.',
          progress: 0,
          completed: false
        }
      ]
    };
  }
};