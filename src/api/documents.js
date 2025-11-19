import apiClient from "./axios";
import { USE_MOCK_API } from "@/utils/config";

/**
 * Mock documents storage
 */
let mockDocuments = [];
let mockDocumentId = 1;

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
    if (USE_MOCK_API) {
      // Mock mode
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const file = formData.get("file");
      const title = formData.get("title") || file?.name || "Untitled Document";

      const newDoc = {
        id: mockDocumentId++,
        title,
        fileName: file?.name || "document.pdf",
        fileSize: file?.size || 0,
        uploadedAt: new Date().toISOString(),
        status: "pending",
        risk: "Not Analyzed",
        extractedText: "Sample extracted text content...",
      };

      mockDocuments.push(newDoc);

      return { data: newDoc, error: null };
    }

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
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { data: mockDocuments, error: null };
    }

    try {
      const response = await apiClient.get("/api/documents/");

      // 🔥 Normalize backend fields for frontend compatibility
      const mapped = response.data.map((doc) => ({
        id: doc.id,
        title: doc.title,
        fileName: doc.file,
        uploadedAt: doc.uploaded_at,
        risk: doc.risk_score || "unknown",
        status: doc.risk_score ? "analyzed" : "pending", // 🔥 compute status here
        analyzedAt: doc.analyzed_at || null,
        extractedText: doc.extracted_text || "",
      }));

      return { data: mapped, error: null };
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
      const doc = response.data;

      return {
        data: {
          id: doc.id,
          title: doc.title,
          fileName: doc.file,
          uploadedAt: doc.uploaded_at,
          risk: doc.risk_score || "unknown",
          status: doc.risk_score ? "analyzed" : "pending",
          analyzedAt: doc.risk_score ? new Date().toISOString() : null,
          extractedText: doc.extracted_text || "",
          clauses: Object.entries(doc.clauses_found || {}).map(
            ([name, found]) => ({
              name,
              status: found ? "Compliant" : "Needs Review",
            })
          ),
          summary: doc.summary || "",
        },
        error: null,
      };
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
      const res = await apiClient.post(`/api/documents/${id}/analyze/`);
      const doc = res.data;

      const clauses = Object.entries(doc.clauses_found || {}).map(
        ([name, found]) => ({
          name,
          status: found ? "Compliant" : "Needs Review",
        })
      );

      return {
        data: {
          id: doc.id,
          title: doc.title,
          fileName: doc.file,
          uploadedAt: doc.uploaded_at,
          risk: doc.risk_score,
          status: "analyzed",
          analyzedAt: new Date().toISOString(),
          extractedText: doc.extracted_text || "",
          summary: doc.summary || "",
          clauses,
        },
        error: null,
      };
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
    if (USE_MOCK_API) {
      // Mock mode
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const doc = mockDocuments.find((d) => d.id === parseInt(id));
      if (!doc) {
        return { data: null, error: "Document not found" };
      }

      return {
        data: {
          id: doc.id,
          document_title: doc.title,
          summary: "Comprehensive analysis report generated.",
          report_url: "#",
        },
        error: null,
      };
    }

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
