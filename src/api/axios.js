import axios from 'axios';
import { BASE_URL } from '@/utils/config';

// BASE_URL usually ends with /api/
const API_BASE_URL = BASE_URL.replace('/api/', '');

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Token refresh coordination
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  failedQueue = [];
};

// ---------------------------
// REQUEST INTERCEPTOR
// ---------------------------
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------------------------
// RESPONSE INTERCEPTOR
// ---------------------------
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle expired access token → refresh it
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Prevent refresh loop
      if (originalRequest.url?.includes('/api/auth/token/refresh/')) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        // No refresh token — logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        return Promise.reject(error);
      }

      // If a refresh is already in progress → wait for it
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Perform refresh request
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccess = refreshResponse.data.access;

        localStorage.setItem('access_token', newAccess);

        // Update header for new requests
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        processQueue(null, newAccess);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh failed — force logout
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
