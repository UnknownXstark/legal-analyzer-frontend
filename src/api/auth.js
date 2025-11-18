import apiClient from './axios';
import { USE_MOCK_API } from '@/utils/config';

/**
 * Mock data for development
 */
const mockUsers = {
  'test@example.com': {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    role: 'individual',
    password: 'password123'
  },
  'lawyer@example.com': {
    id: 2,
    username: 'lawyeruser',
    email: 'lawyer@example.com',
    role: 'lawyer',
    password: 'password123'
  }
};

/**
 * Authentication API helpers for Django backend
 */

export const authAPI = {
  /**
   * Register a new user
   * @param {Object} userData - { username, email, password, role }
   * @returns {Promise} - { access, refresh, user }
   */
  register: async (userData) => {
    if (USE_MOCK_API) {
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (mockUsers[userData.email]) {
        return { data: null, error: 'User with this email already exists' };
      }

      const newUser = {
        id: Object.keys(mockUsers).length + 1,
        username: userData.username,
        email: userData.email,
        role: userData.role || 'individual'
      };

      mockUsers[userData.email] = { ...newUser, password: userData.password };

      return {
        data: {
          access: 'mock-access-token-' + Date.now(),
          refresh: 'mock-refresh-token-' + Date.now(),
          user: newUser
        },
        error: null
      };
    }

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

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { access, refresh, user }
   */
  login: async (credentials) => {
    if (USE_MOCK_API) {
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers[credentials.email];
      
      if (!user || user.password !== credentials.password) {
        return { data: null, error: 'Invalid email or password' };
      }

      const { password, ...userWithoutPassword } = user;

      return {
        data: {
          access: 'mock-access-token-' + Date.now(),
          refresh: 'mock-refresh-token-' + Date.now(),
          user: userWithoutPassword
        },
        error: null
      };
    }

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

  /**
   * Get current user profile
   * @returns {Promise} - User object
   */
  getProfile: async () => {
    if (USE_MOCK_API) {
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        return { data: null, error: 'Not authenticated' };
      }

      return { data: JSON.parse(userStr), error: null };
    }

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

  /**
   * Refresh access token
   * @param {string} refreshToken 
   * @returns {Promise} - { access }
   */
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

  /**
   * Logout user (client-side cleanup)
   */
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};
