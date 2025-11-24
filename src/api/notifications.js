import apiClient from "./axios";

export const notificationsApi = {
  // Get all notifications
  getAll: async () => {
    const res = await apiClient.get("/api/notifications/");
    return res.data;
  },

  // Mark one notification as read
  markRead: async (id) => {
    const res = await apiClient.patch(`/api/notifications/${id}/read/`);
    return res.data;
  },

  // Mark all notifications as read
  markAllRead: async () => {
    const res = await apiClient.patch("/api/notifications/mark-all/");
    return res.data;
  },

  // Delete one notification
  delete: async (id) => {
    const res = await apiClient.delete(`/api/notifications/${id}/delete/`);
    return res.data;
  },
};
