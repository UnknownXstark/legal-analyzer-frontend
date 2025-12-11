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
        file: file?.name || 'document.pdf',
        file_type: 'pdf',
        uploaded_at: new Date().toISOString(),
        status: 'pending',
        risk_score: null,
        extracted_text: 'Sample extracted text content...',
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
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: mockDocuments, error: null };
    }

    try {
      const response = await apiClient.get('/api/documents/');
      return { data: response.data, error: null };
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
    if (USE_MOCK_API) {
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 300));
      const doc = mockDocuments.find(d => d.id === parseInt(id));
      
      if (!doc) {
        return { data: null, error: 'Document not found' };
      }
      
      return { data: doc, error: null };
    }

    try {
      const response = await apiClient.get(`/api/documents/${id}/`);
      return { data: response.data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to fetch document' 
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
      // Mock mode
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const docIndex = mockDocuments.findIndex(d => d.id === parseInt(id));
      if (docIndex === -1) {
        return { data: null, error: 'Document not found', upgradeRequired: false };
      }

      const risks = ['Low', 'Medium', 'High'];
      const risk = risks[Math.floor(Math.random() * risks.length)];

      mockDocuments[docIndex] = {
        ...mockDocuments[docIndex],
        status: 'analyzed',
        risk_score: risk,
        analyzed_at: new Date().toISOString(),
        clauses_found: {
          confidentiality: true,
          termination: Math.random() > 0.5,
          non_compete: Math.random() > 0.5,
          liability: Math.random() > 0.5,
          indemnification: Math.random() > 0.5,
        },
        summary: 'AI analysis completed successfully. This document contains standard legal clauses.',
      };

      return { data: mockDocuments[docIndex], error: null, upgradeRequired: false };
    }

    try {
      const response = await apiClient.post(`/api/documents/${id}/analyze/`);
      return { data: response.data, error: null, upgradeRequired: false };
    } catch (error) {
      // Handle 402 Payment Required - Free plan limit exceeded
      if (error.response?.status === 402) {
        return { 
          data: null, 
          error: 'Free plan limit exceeded',
          upgradeRequired: true 
        };
      }
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Analysis failed',
        upgradeRequired: false
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
