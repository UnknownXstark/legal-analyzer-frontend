import apiClient from "./axios";

export const reportsApi = {
  getReports: async () => {
    const res = await apiClient.get("/documents/");
    return res.data;
  },

  getReportById: async (id) => {
    const res = await apiClient.get(`/documents/${id}/`);
    return res.data;
  },

  analyzeDocument: async (id) => {
    const res = await apiClient.post(`/documents/${id}/analyze/`);
    return res.data;
  }
};
