// Base API configuration
const API_BASE_URL = 'http://localhost:3333';

// Get auth token from localStorage
const getAuthToken = () => {
  try {
    return localStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Generic API request function with proper error handling
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getAuthToken();
  
  // Check if token is expired before making request
  if (token && isTokenExpired(token)) {
    console.warn('Token expired, clearing stored auth data');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    throw new Error('Token expired. Please log in again.');
  }
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    // Handle 401 responses (token expired/invalid)
    if (response.status === 401) {
      console.warn('Received 401 Unauthorized, clearing auth data');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      
      // Dispatch logout event for auth context to pick up
      window.dispatchEvent(new CustomEvent('auth-logout'));
      
      throw new Error('Unauthorized. Please log in again.');
    }
    
    // Handle non-200 responses
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API methods
export const api = {
  // GET request
  get: (endpoint, options = {}) => 
    apiRequest(endpoint, { method: 'GET', ...options }),

  // POST request
  post: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options,
    }),

  // PUT request
  put: (endpoint, data, options = {}) =>
    apiRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...options,
    }),

  // DELETE request
  delete: (endpoint, options = {}) =>
    apiRequest(endpoint, { method: 'DELETE', ...options }),
};

// Auth-specific API methods
export const authApi = {
  signIn: (credentials) => 
    api.post('/auth/signin', credentials),
    
  signUp: (userData) => 
    api.post('/auth/signup', userData),
    
  getCurrentUser: () => 
    api.get('/users/me'),
};
