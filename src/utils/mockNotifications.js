// Mock notifications data and helper functions
const NOTIFICATIONS_KEY = 'notifications';

const defaultNotifications = [
  {
    id: 1,
    message: "Document 'NDA Agreement' uploaded successfully.",
    type: 'success',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    isRead: false,
    relatedId: 1,
    relatedType: 'document'
  },
  {
    id: 2,
    message: "Report generated for 'Employment Contract'.",
    type: 'info',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    isRead: true,
    relatedId: 2,
    relatedType: 'report'
  },
  {
    id: 3,
    message: "Analysis completed for 'Service Agreement'.",
    type: 'success',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    isRead: false,
    relatedId: 3,
    relatedType: 'analysis'
  },
  {
    id: 4,
    message: "High risk detected in 'Partnership Agreement'. Review recommended.",
    type: 'warning',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    isRead: true,
    relatedId: 4,
    relatedType: 'document'
  },
  {
    id: 5,
    message: "Document 'Lease Agreement' ready for analysis.",
    type: 'info',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    isRead: false,
    relatedId: 5,
    relatedType: 'document'
  }
];

// Initialize notifications in localStorage if not present
export const initializeNotifications = () => {
  if (!localStorage.getItem(NOTIFICATIONS_KEY)) {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(defaultNotifications));
  }
};

// Get all notifications
export const getNotifications = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      initializeNotifications();
      const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      resolve(notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }, 800);
  });
};

// Mark a single notification as read
export const markAsRead = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      const updated = notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      );
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      resolve(updated.find(n => n.id === id));
    }, 300);
  });
};

// Mark all notifications as read
export const markAllAsRead = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      const updated = notifications.map(n => ({ ...n, isRead: true }));
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      resolve(updated);
    }, 500);
  });
};

// Add a new notification (for future use when actions happen)
export const addNotification = (notification) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const notifications = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY) || '[]');
      const newNotification = {
        ...notification,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        isRead: false
      };
      notifications.unshift(newNotification);
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      resolve(newNotification);
    }, 300);
  });
};

// Format timestamp to relative time
export const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return past.toLocaleDateString();
};
