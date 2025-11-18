import apiClient from "./axios";

/**
 * Documents API helpers for Django backend
 */

export const documentsAPI = {
  /**
   * Upload a document
   * @param {FormData} formData - File to upload
   * @returns {Promise}
   */
  upload: async (formData) => {
    try {
      const response = await apiClient.post(
        "/api/documents/upload/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error:
          error.response?.data?.message || error.message || "Upload failed",
      };
    }
  },

  /**
   * Get all documents for authenticated user
   * @returns {Promise}
   */
  getAll: async () => {
    try {
      const response = await apiClient.get("/api/documents/");
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch documents",
      };
    }
  },

  /**
   * Get document details
   * @param {number} id - Document ID
   * @returns {Promise}
   */
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/api/documents/${id}/`);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch document",
      };
    }
  },

  /**
   * Run AI analysis on document
   * @param {number} id - Document ID
   * @returns {Promise}
   */
  analyze: async (id) => {
    try {
      const response = await apiClient.post(`/api/documents/${id}/analyze/`);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error:
          error.response?.data?.message || error.message || "Analysis failed",
      };
    }
  },

  /**
   * Generate report for document
   * @param {number} id - Document ID
   * @returns {Promise}
   */
  getReport: async (id) => {
    try {
      const response = await apiClient.get(`/api/documents/${id}/report/`);
      return { data: response.data, error: null };
    } catch (error) {
      return {
        data: null,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to generate report",
      };
    }
  },
};
