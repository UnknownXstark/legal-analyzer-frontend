import apiClient from "./axios";

export const reportsApi = {
  getReports: async () => {
    const res = await apiClient.get("/api/documents/");
    return res.data;
  },

  getReportById: async (id) => {
    const res = await apiClient.get(`/api/documents/${id}/`);
    return res.data;
  },

  analyzeDocument: async (id) => {
    const res = await apiClient.post(`/api/documents/${id}/analyze/`);
    return res.data;
  },

  generateReport: async (id) => {
    const res = await apiClient.post("/api/documents/${id}/report/");
    return res.data;
  },
};
