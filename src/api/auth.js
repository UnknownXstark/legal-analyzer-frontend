import apiClient from "./axios";

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
    try {
      const response = await apiClient.post("/api/auth/register/", userData);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Registration failed",
      };
    }
  },

  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} - { access, refresh, user }
   */
  login: async (credentials) => {
    try {
      const response = await apiClient.post("/api/auth/login/", credentials);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error.response?.data?.message || error.message || "Login failed",
      };
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} - User object
   */
  getProfile: async () => {
    try {
      const response = await apiClient.get("/api/auth/profile/");
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch profile",
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
      const response = await apiClient.post("/api/auth/token/refresh/", {
        refresh: refreshToken,
      });
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Token refresh failed",
      };
    }
  },

  /**
   * Logout user (client-side cleanup)
   */
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
  },
};
