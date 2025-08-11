// src/api/axios.js
import axios from 'axios';
import { setAccess, clearAuth } from '../features/auth/authSlice';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});


// Function to fetch CSRF token
let csrfTokenCache = null;
let csrfTokenPromise = null;

// Function to fetch CSRF token (now with caching logic)
export const fetchCsrfToken = async () => {  
  // 1. Check if token is already in cache
  if (csrfTokenCache) {
    return csrfTokenCache;
  }
  
// 2. Check if a request is already in-flight
if (csrfTokenPromise) {
  return csrfTokenPromise;
}

// 3. No token and no in-flight request, so create a new promise
csrfTokenPromise = new Promise(async (resolve, reject) => {
  try {
    const response = await axios.get(`${baseURL}/get-csrf-token`, {
      withCredentials: true,
    });
    
    const contentType = response.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Error: Expected JSON response, but received non-JSON:', contentType);
      // Clean up the promise on failure
      csrfTokenPromise = null;
      resolve(null);
      return;
    }

    if (response.data && typeof response.data === 'object' && typeof response.data.csrfToken === 'string') {
      // 4. Cache the token and resolve the promise
      csrfTokenCache = response.data.csrfToken;
      // Clean up the promise on success
      csrfTokenPromise = null;
      resolve(csrfTokenCache);
    } else {
      console.error('Error: CSRF token not found or invalid format in response data.', response.data);
      // Clean up the promise on failure
      csrfTokenPromise = null;
      resolve(null);
    }
  
  } catch (error) {
      console.error('Error fetching CSRF token (network or request issue):', error.message || error);
      // Clean up the promise on failure
      csrfTokenPromise = null;
      resolve(null);
    }
  });

  return csrfTokenPromise;
};

// Export a function that takes the store as an argument
export const setupInterceptors = (store) => {
  // Request interceptor: attach access token AND CSRF token if available
  api.interceptors.request.use(
    (config) => {
      const csrfToken = fetchCsrfToken(baseURL)
      const state = store.getState();
      const accessToken = state.auth.accessToken;

      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }

      // Attach CSRF token if it exists
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor: refresh token on 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if it's a 401 error and not a retry
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Mark as retried

        try {
          // Attempt to refresh the token using the dedicated endpoint
          // This request should typically rely on the httpOnly refresh token cookie
          const res = await axios.get(`${baseURL}/auth/jwt/`, {
            withCredentials: true,
          });

          if (res.data.status !== true || res.error) {
            console.error('Token refresh failed:', res.data.message || 'Unknown error');
            store.dispatch(clearAuth()); // Clear authentication state
            return Promise.reject(new Error('Token refresh failed'));
          }

          const newAccess = res.data.data.access;

          // Update Redux store with the new access token
          store.dispatch(setAccess(newAccess));

          // Update the Authorization header for the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;

          // Retry the original failed request with the new access token
          return api(originalRequest);
        } catch (refreshError) {
          // If refresh fails (e.g., refresh token expired or invalid)
          console.error('Token refresh failed:', refreshError);
          store.dispatch(clearAuth()); // Clear authentication state
          // Redirect to login page or handle appropriately in your UI
          // Example: history.push('/login'); (if using react-router-dom v5)
          // For v6: navigate('/login');
          return Promise.reject(refreshError); // Propagate the error
        }
      }

      // For any other error, or if it's already a retry
      return Promise.reject(error);
    }
  );
};

export default api;