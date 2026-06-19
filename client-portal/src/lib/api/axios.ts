import axios from 'axios';

const api = axios.create({
  // Use relative path so it hits the Next.js rewrite proxy
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  timeout: 30000, // Increased timeout to 30 seconds to prevent premature timeout errors
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add the JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('client_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Debug logging for request payload
    if (config.method !== 'get') {
      console.log(`[Axios] Sending ${config.method?.toUpperCase()} to ${config.url}`, JSON.stringify(config.data, null, 2));
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle global errors (e.g., 401 Unauthorized)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Check if the error is due to a network issue or missing response
    if (!error.response) {
      console.error('Network Error or no response from server:', error);
      return Promise.reject(error);
    }

    // Log detailed validation errors if it's a 400 Bad Request
    if (error.response.status === 400) {
      console.error('Validation Error Details:', error.response.data);
      // Let the component handle showing the specific message, but we log the full Zod error here
    }
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Prevent infinite redirect loops if we are already on the login page
        if (window.location.pathname !== '/login') {
          localStorage.removeItem('client_token');
          localStorage.removeItem('client_info');
          // Don't forcefully redirect here if they are just checking auth status,
          // let the AuthGuard handle the redirect so it can save the return URL.
          // window.location.href = '/login';
        }
      }
    }
    // Return a standardized error object structure
    const errorData = error.response?.data?.error || {};
    const message = errorData.message || error.response?.data?.message || error.message || 'An unexpected error occurred';
    return Promise.reject({ ...error, message, code: errorData.code });
  }
);

export default api;
