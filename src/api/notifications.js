import apiClient from "@/api/axios";

// Convert backend → frontend format
const mapNotification = (n) => ({
  id: n.id,
  message: n.message,
  createdAt: n.created_at,
  isRead: n.is_read,
});

export const notificationsApi = {
  getAll: async () => {
    const res = await apiClient.get("/api/notifications/");
    return res.data.map(mapNotification);
  },

  markRead: async (id) => {
    await apiClient.post(`/api/notifications/${id}/read/`);
    return true;
  },

  markAllRead: async () => {
    await apiClient.post(`/api/notifications/mark-all/`);
    return true;
  },

  delete: async (id) => {
    await apiClient.delete(`/api/notifications/${id}/delete/`);
    return true;
  },
};
