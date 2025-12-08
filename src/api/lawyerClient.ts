import apiClient from './axios';
import { USE_MOCK_API } from '@/utils/config';

/**
 * Mock data for development
 */
let mockAssignments: any[] = [];
let mockAssignmentId = 1;

export interface AssignmentRequest {
  id: number;
  lawyer: {
    id: number;
    username: string;
    email: string;
  };
  client: {
    id: number;
    username: string;
    email: string;
  };
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  documents_count?: number;
}

export interface Client {
  id: number;
  username: string;
  email: string;
  assigned_date: string;
  documents_count: number;
}

export interface Lawyer {
  id: number;
  username: string;
  email: string;
  specialization?: string;
}

/**
 * Lawyer-Client API helpers
 */
export const lawyerClientAPI = {
  /**
   * Lawyer assigns a client by email
   */
  assignClient: async (clientEmail: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userStr = localStorage.getItem('user');
      const lawyer = userStr ? JSON.parse(userStr) : { id: 1, username: 'lawyer', email: 'lawyer@test.com' };
      
      const newAssignment: AssignmentRequest = {
        id: mockAssignmentId++,
        lawyer: { id: lawyer.id, username: lawyer.username, email: lawyer.email },
        client: { id: 100, username: 'client_user', email: clientEmail },
        status: 'pending',
        created_at: new Date().toISOString(),
      };
      
      mockAssignments.push(newAssignment);
      return { data: newAssignment, error: null };
    }

    try {
      const response = await apiClient.post('/api/users/lawyers/assign-client/', { 
        client_email: clientEmail 
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to assign client' 
      };
    }
  },

  /**
   * Client responds to assignment request
   */
  respondToAssignment: async (assignmentId: number, action: 'accept' | 'reject') => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const assignment = mockAssignments.find(a => a.id === assignmentId);
      if (assignment) {
        assignment.status = action === 'accept' ? 'accepted' : 'rejected';
      }
      
      return { data: { message: `Assignment ${action}ed` }, error: null };
    }

    try {
      const response = await apiClient.post('/api/users/clients/assignment/respond/', { 
        assignment_id: assignmentId,
        action 
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to respond to assignment' 
      };
    }
  },

  /**
   * Lawyer gets list of their clients
   */
  getLawyerClients: async () => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const acceptedClients: Client[] = mockAssignments
        .filter(a => a.status === 'accepted')
        .map(a => ({
          id: a.client.id,
          username: a.client.username,
          email: a.client.email,
          assigned_date: a.created_at,
          documents_count: Math.floor(Math.random() * 10),
        }));
      
      return { data: acceptedClients, error: null };
    }

    try {
      const response = await apiClient.get('/api/users/lawyers/clients/');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to fetch clients' 
      };
    }
  },

  /**
   * Client gets their assigned lawyer
   */
  getClientLawyer: async () => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const assignment = mockAssignments.find(
        a => a.client.email === user?.email && a.status === 'accepted'
      );
      
      if (!assignment) {
        return { data: null, error: null };
      }
      
      return { 
        data: {
          id: assignment.lawyer.id,
          username: assignment.lawyer.username,
          email: assignment.lawyer.email,
          specialization: 'Corporate Law',
        }, 
        error: null 
      };
    }

    try {
      const response = await apiClient.get('/api/users/clients/lawyer/');
      return { data: response.data, error: null };
    } catch (error: any) {
      if (error.response?.status === 404) {
        return { data: null, error: null };
      }
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to fetch lawyer' 
      };
    }
  },

  /**
   * Get pending assignment requests (for client)
   */
  getPendingRequests: async () => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const pending = mockAssignments.filter(
        a => a.client.email === user?.email && a.status === 'pending'
      );
      
      return { data: pending, error: null };
    }

    try {
      const response = await apiClient.get('/api/users/clients/assignment-requests/');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to fetch requests' 
      };
    }
  },

  /**
   * Get assignment requests sent by lawyer
   */
  getLawyerRequests: async () => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      const requests = mockAssignments.filter(a => a.lawyer.email === user?.email);
      
      return { data: requests, error: null };
    }

    try {
      const response = await apiClient.get('/api/users/lawyers/assignment-requests/');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Failed to fetch requests' 
      };
    }
  },

  /**
   * Search for clients by email/username
   */
  searchClients: async (query: string) => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Mock search results
      return { 
        data: [
          { id: 101, username: 'john_doe', email: 'john@example.com' },
          { id: 102, username: 'jane_smith', email: 'jane@example.com' },
        ].filter(u => 
          u.email.toLowerCase().includes(query.toLowerCase()) ||
          u.username.toLowerCase().includes(query.toLowerCase())
        ), 
        error: null 
      };
    }

    try {
      const response = await apiClient.get(`/api/users/search/?q=${encodeURIComponent(query)}`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { 
        data: null, 
        error: error.response?.data?.message || error.message || 'Search failed' 
      };
    }
  },
};
