import apiClient from './axios';
import { USE_MOCK_API } from '@/utils/config';

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
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const file = formData.get('file');
      const title = formData.get('title') || file?.name || 'Untitled Document';
      
      const newDoc = {
        id: mockDocumentId++,
        title,
        fileName: file?.name || 'document.pdf',
        fileSize: file?.size || 0,
        uploadedAt: new Date().toISOString(),
        status: 'pending',
        risk: 'Not Analyzed',
        extractedText: 'Sample extracted text content...',
      };

      mockDocuments.push(newDoc);
      
      return { data: newDoc, error: null };
    }

    try {
      const response = await apiClient.post('/api/documents/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Upload failed' 
      };
    }
  },

  /**
   * Get all documents for authenticated user
   * @returns {Promise}
   */
  getAll: async () => {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockDocuments, error: null };
  }

  try {
    const response = await apiClient.get('/api/documents/');

    // 🔥 Normalize backend fields for frontend compatibility
    const mapped = response.data.map((doc) => ({
      id: doc.id,
      title: doc.title,
      fileName: doc.file,                             // backend gives full path
      uploadedAt: doc.uploaded_at,
      risk: doc.risk_score || "unknown",              // fallback for new docs
      status: doc.status || "pending",
      analyzedAt: doc.analyzed_at || null,
      extractedText: doc.extracted_text || "",        // in case you add later
    }));

    return { data: mapped, error: null };
  } catch (error) {
    return { 
      data: null, 
      error: error.response?.data?.message || error.message || 'Failed to fetch documents' 
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

    // 🔥 Normalize backend fields for the detail page
    const mapped = {
      id: doc.id,
      title: doc.title,
      fileName: doc.file,
      uploadedAt: doc.uploaded_at,
      risk: doc.risk_score || "unknown",
      status: doc.status || "pending",
      analyzedAt: doc.analyzed_at || null,
      extractedText: doc.extracted_text || "",
      clauses: doc.clauses_found || {},
      summary: doc.summary || ""
    };

    return { data: mapped, error: null };

  } catch (error) {
    return {
      data: null,
      error: error.response?.data?.message || error.message
    };
  }
},


  /**
   * Run AI analysis on document
   * @param {number} id - Document ID
   * @returns {Promise}
   */
 analyze: async (id) => {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const docIndex = mockDocuments.findIndex(d => d.id === parseInt(id));
    if (docIndex === -1) {
      return { data: null, error: 'Document not found' };
    }

    const risks = ['Low', 'Medium', 'High'];
    const risk = risks[Math.floor(Math.random() * risks.length)];

    mockDocuments[docIndex] = {
      ...mockDocuments[docIndex],
      status: 'analyzed',
      risk,
      analyzedAt: new Date().toISOString(),
    };

    return { data: mockDocuments[docIndex], error: null };
  }

  try {
    const res = await apiClient.post(`/api/documents/${id}/analyze/`);
    const doc = res.data;

    // 🔥 Normalize backend → frontend names
    const mapped = {
      id: doc.id,
      title: doc.title,
      fileName: doc.file,
      uploadedAt: doc.uploaded_at,
      risk: doc.risk_score || "unknown",
      status: "analyzed",
      analyzedAt: new Date().toISOString(),
      extractedText: doc.extracted_text || "",
      clauses: doc.clauses_found || {},
      summary: doc.summary || ""
    };

    return { data: mapped, error: null };

  } catch (error) {
    return {
      data: null,
      error: error.response?.data || 'Error analyzing document',
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const doc = mockDocuments.find(d => d.id === parseInt(id));
      if (!doc) {
        return { data: null, error: 'Document not found' };
      }

      return {
        data: {
          id: doc.id,
          document_title: doc.title,
          summary: 'Comprehensive analysis report generated.',
          report_url: '#',
        },
        error: null
      };
    }

    try {
      const response = await apiClient.get(`/api/documents/${id}/report/`);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to generate report' 
      };
    }
  },
};
