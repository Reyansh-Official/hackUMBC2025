// Simple connector script to link frontend with backend API
const API_BASE_URL = 'http://localhost:8080/api';

// Authentication functions
async function login(email, password) {
  try {
    // Use real API integration
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Failed to connect to server' };
  }
}

async function signup(email, password, name) {
  try {
    // Use real API integration
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return await response.json();
  } catch (error) {
    console.error('Signup error:', error);
    return { error: 'Failed to connect to server' };
  }
}

// User profile functions
async function getUserProfile(token) {
  try {
    // Use real API integration
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    console.error('Profile error:', error);
    return { error: 'Failed to fetch profile' };
  }
}

// Learning modules functions
async function getModules(token) {
  try {
    // Use real API integration
    const response = await fetch(`${API_BASE_URL}/modules`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    console.error('Modules error:', error);
    return { error: 'Failed to fetch modules' };
  }
}

// Badge functions
async function getBadges(token) {
  try {
    // Use real API integration
    const response = await fetch(`${API_BASE_URL}/badges`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await response.json();
  } catch (error) {
    console.error('Badges error:', error);
    return { error: 'Failed to fetch badges' };
  }
}

// Session management
function saveToken(token) {
  localStorage.setItem('finscholars_token', token);
}

function getToken() {
  return localStorage.getItem('finscholars_token');
}

function clearToken() {
  localStorage.removeItem('finscholars_token');
}

function isLoggedIn() {
  return !!getToken();
}

// Redirect if not authenticated
function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
  }
}

// Redirect if already authenticated
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = '/dashboard.html';
  }
}