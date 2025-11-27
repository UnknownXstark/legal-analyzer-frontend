import apiClient from './axios';

/**
 * Authentication API helpers for Django backend
 */
export const authAPI = {
  register: async (userData) => {
    try {
      const response = await apiClient.post('/api/auth/register/', userData);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Registration failed' 
      };
    }
  },

  login: async (credentials) => {
    try {
      const response = await apiClient.post('/api/auth/login/', credentials);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  },

  getProfile: async () => {
    try {
      const response = await apiClient.get('/api/auth/profile/');
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to fetch profile' 
      };
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await apiClient.post('/api/auth/token/refresh/', {
        refresh: refreshToken
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Token refresh failed' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};
