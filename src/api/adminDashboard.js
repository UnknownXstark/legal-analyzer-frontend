import apiClient from "./axios";

export const adminDashboardApi = {
  getAnalytics: async () => {
    const res = await apiClient.get("/api/documents/admin/analytics/");
    return res.data;
  },
};
