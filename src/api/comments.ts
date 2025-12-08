import apiClient from './axios';
import { USE_MOCK_API } from '@/utils/config';

/**
 * Mock data
 */
let mockComments: any[] = [];
let mockCommentId = 1;

export interface Comment {
  id: number;
  document_id: number;
  user: {
    id: number;
    username: string;
  };
  text: string;
  created_at: string;
}

export interface Version {
  id: number;
  document_id: number;
  version_number: number;
  created_at: string;
  content?: string;
  changes_summary?: string;
}

/**
 * Comments & Versions API
 */
export const collaborationAPI = {
  /**
   * Get comments for a document
   */
  getComments: async (documentId: string | number) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const comments = mockComments.filter(c => c.document_id === Number(documentId));
      return { data: comments, error: null };
    }

    try {
      const response = await apiClient.get(`/api/documents/${documentId}/comments/`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to fetch comments' 
      };
    }
  },

  /**
   * Add a comment to a document
   */
  addComment: async (documentId: string | number, text: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : { id: 1, username: 'user' };
      
      const newComment: Comment = {
        id: mockCommentId++,
        document_id: Number(documentId),
        user: { id: user.id, username: user.username },
        text,
        created_at: new Date().toISOString(),
      };
      
      mockComments.push(newComment);
      return { data: newComment, error: null };
    }

    try {
      const response = await apiClient.post(`/api/documents/${documentId}/comments/`, { text });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to add comment' 
      };
    }
  },

  /**
   * Delete a comment
   */
  deleteComment: async (commentId: number) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      mockComments = mockComments.filter(c => c.id !== commentId);
      return { data: { message: 'Comment deleted' }, error: null };
    }

    try {
      const response = await apiClient.delete(`/api/documents/comments/${commentId}/`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to delete comment' 
      };
    }
  },

  /**
   * Get document versions
   */
  getVersions: async (documentId: string | number) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock versions
      const versions: Version[] = [
        {
          id: 1,
          document_id: Number(documentId),
          version_number: 1,
          created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
          changes_summary: 'Initial upload',
        },
        {
          id: 2,
          document_id: Number(documentId),
          version_number: 2,
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          changes_summary: 'Updated terms section',
        },
        {
          id: 3,
          document_id: Number(documentId),
          version_number: 3,
          created_at: new Date().toISOString(),
          changes_summary: 'Added confidentiality clause',
        },
      ];
      
      return { data: versions, error: null };
    }

    try {
      const response = await apiClient.get(`/api/documents/${documentId}/versions/`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to fetch versions' 
      };
    }
  },

  /**
   * Get specific version details
   */
  getVersionDetail: async (versionId: number) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const version: Version = {
        id: versionId,
        document_id: 1,
        version_number: versionId,
        created_at: new Date().toISOString(),
        content: `This is the content of version ${versionId}.\n\nThis Non-Disclosure Agreement ("Agreement") is entered into as of [Date]...`,
        changes_summary: 'Version changes summary',
      };
      
      return { data: version, error: null };
    }

    try {
      const response = await apiClient.get(`/api/documents/versions/${versionId}/`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to fetch version' 
      };
    }
  },
};
