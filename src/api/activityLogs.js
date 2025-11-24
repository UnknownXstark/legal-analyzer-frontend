import apiClient from "@/api/axios";

const mapLog = (log) => ({
  id: log.id,
  action: log.action,
  timestamp: log.timestamp,
  details: log.details || {},
});

export const activityLogsApi = {
  getAll: async () => {
    const res = await apiClient.get("/api/notifications/logs/");
    return res.data.map(mapLog);
  },

  filter: async (type) => {
    const res = await apiClient.get(`/api/notifications/logs/?type=${type}`);
    return res.data.map(mapLog);
  },
};
