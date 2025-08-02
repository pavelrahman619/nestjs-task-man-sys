// Base API configuration
const API_BASE_URL = 'http://localhost:3333'; // Adjust this to match your NestJS backend URL

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
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
