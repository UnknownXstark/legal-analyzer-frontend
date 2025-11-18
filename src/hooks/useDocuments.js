import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { documentsAPI } from '@/api/documents';
import { toast } from 'sonner';

export const useDocuments = () => {
  const queryClient = useQueryClient();

  // Fetch all documents
  const { data: documents = [], isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const { data, error } = await documentsAPI.getAll();
      if (error) {
        toast.error(error);
        return [];
      }
      return data;
    },
  });

  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData) => {
      const { data, error } = await documentsAPI.upload(formData);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
      toast.success('Document uploaded successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Upload failed. Please try again.');
    },
  });

  // Analyze document mutation
  const analyzeMutation = useMutation({
    mutationFn: async (id) => {
      const { data, error } = await documentsAPI.analyze(id);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['documents']);
      queryClient.invalidateQueries(['document', data.id]);
      toast.success(`Analysis complete! Risk level: ${data.risk}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Analysis failed. Please try again.');
    },
  });

  // Generate report mutation
  const reportMutation = useMutation({
    mutationFn: async (id) => {
      const { data, error } = await documentsAPI.getReport(id);
      if (error) throw new Error(error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['documents']);
      toast.success('Report generated successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to generate report.');
    },
  });

  return {
    documents,
    isLoading,
    error,
    uploadDocument: uploadMutation.mutate,
    isUploading: uploadMutation.isPending,
    analyzeDocument: analyzeMutation.mutate,
    isAnalyzing: analyzeMutation.isPending,
    generateReport: reportMutation.mutate,
    isGeneratingReport: reportMutation.isPending,
  };
};

// Hook for single document
export const useDocument = (id) => {
  const { data: document, isLoading, error } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await documentsAPI.getById(id);
      if (error) {
        toast.error(error);
        return null;
      }
      return data;
    },
    enabled: !!id,
  });

  return { document, isLoading, error };
};
