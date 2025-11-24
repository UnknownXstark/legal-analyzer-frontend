import apiClient from "@/api/axios";

const detectType = (action) => {
  const a = action.toLowerCase();

  if (a.includes("upload")) return "upload";
  if (a.includes("analy")) return "analysis";
  if (a.includes("report")) return "report";
  if (a.includes("download")) return "download";
  if (a.includes("login") || a.includes("logout")) return "auth";
  if (a.includes("setting")) return "settings";

  return "other";
};

const mapLog = (log) => ({
  id: log.id,
  action: log.action,
  timestamp: log.timestamp,
  details: log.details || {},
  type: detectType(log.action),   // 👈 ADDED HERE
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


// import apiClient from "@/api/axios";

// const mapLog = (log) => ({
//   id: log.id,
//   action: log.action,
//   timestamp: log.timestamp,
//   details: log.details || {},
// });

// export const activityLogsApi = {
//   getAll: async () => {
//     const res = await apiClient.get("/api/notifications/logs/");
//     return res.data.map(mapLog);
//   },

//   filter: async (type) => {
//     const res = await apiClient.get(`/api/notifications/logs/?type=${type}`);
//     return res.data.map(mapLog);
//   },
// };
