import apiClient from './axios';

export interface SharedDocument {
  id: number;
  document_id: number;
  lawyer_id: number;
  client_id: number;
  status: 'pending' | 'accepted' | 'declined';
  lawyer_name: string;
  client_name: string;
  document_title: string;
}

// Mock data for development
const USE_MOCK = false;

const mockSharedByMe: SharedDocument[] = [
  {
    id: 1,
    document_id: 1,
    lawyer_id: 1,
    client_id: 2,
    status: 'pending',
    lawyer_name: 'John Lawyer',
    client_name: 'Alice Client',
    document_title: 'Employment Contract.pdf',
  },
  {
    id: 2,
    document_id: 2,
    lawyer_id: 1,
    client_id: 3,
    status: 'accepted',
    lawyer_name: 'John Lawyer',
    client_name: 'Bob Client',
    document_title: 'NDA Agreement.pdf',
  },
];

const mockSharedWithMe: SharedDocument[] = [
  {
    id: 3,
    document_id: 3,
    lawyer_id: 2,
    client_id: 1,
    status: 'pending',
    lawyer_name: 'Jane Attorney',
    client_name: 'Current User',
    document_title: 'Service Agreement.pdf',
  },
];

export const documentSharingAPI = {
  // Share a document with a client
  shareDocument: async (documentId: number, clientId: number): Promise<{ data: SharedDocument | null; error: string | null }> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newShare: SharedDocument = {
        id: Date.now(),
        document_id: documentId,
        lawyer_id: 1,
        client_id: clientId,
        status: 'pending',
        lawyer_name: 'Current Lawyer',
        client_name: 'Selected Client',
        document_title: 'Document',
      };
      return { data: newShare, error: null };
    }

    try {
      const response = await apiClient.post('/api/documents/share/', {
        document_id: documentId,
        client_id: clientId,
      });
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to share document' };
    }
  },

  // Accept a shared document
  acceptShare: async (shareId: number): Promise<{ data: SharedDocument | null; error: string | null }> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: { ...mockSharedWithMe[0], id: shareId, status: 'accepted' }, error: null };
    }

    try {
      const response = await apiClient.post(`/api/documents/share/${shareId}/accept/`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to accept share' };
    }
  },

  // Decline a shared document
  declineShare: async (shareId: number): Promise<{ data: SharedDocument | null; error: string | null }> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: { ...mockSharedWithMe[0], id: shareId, status: 'declined' }, error: null };
    }

    try {
      const response = await apiClient.post(`/api/documents/share/${shareId}/decline/`);
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to decline share' };
    }
  },

  // Get documents shared by me (lawyer)
  getSharedByMe: async (): Promise<{ data: SharedDocument[] | null; error: string | null }> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: mockSharedByMe, error: null };
    }

    try {
      const response = await apiClient.get('/api/documents/shared/by-me/');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to fetch shared documents' };
    }
  },

  // Get documents shared with me (client)
  getSharedWithMe: async (): Promise<{ data: SharedDocument[] | null; error: string | null }> => {
    if (USE_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { data: mockSharedWithMe, error: null };
    }

    try {
      const response = await apiClient.get('/api/documents/shared/with-me/');
      return { data: response.data, error: null };
    } catch (error: any) {
      return { data: null, error: error.response?.data?.message || 'Failed to fetch shared documents' };
    }
  },
};
