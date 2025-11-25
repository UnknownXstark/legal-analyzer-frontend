import apiClient from "./axios";

export const lawyerDashboardApi = {
  getAnalytics: async () => {
    const res = await apiClient.get("/api/documents/lawyer/analytics/");
    return res.data;
  },
};
