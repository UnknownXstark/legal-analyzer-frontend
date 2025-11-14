import axios from "axios";
import { USE_MOCK_API, API_BASE_URL } from "../utils/config";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data
const mockData = {
  users: [
    {
      id: 1,
      username: "admin",
      email: "admin@example.com",
      role: "admin",
      password: "admin123",
    },
    {
      id: 2,
      username: "lawyer",
      email: "lawyer@example.com",
      role: "lawyer",
      password: "lawyer123",
    },
  ],
  documents: [
    {
      id: 1,
      name: "Contract Agreement.pdf",
      uploadDate: "2024-01-15",
      status: "analyzed",
      risk: "low",
    },
    {
      id: 2,
      name: "Legal Notice.docx",
      uploadDate: "2024-01-14",
      status: "pending",
      risk: "medium",
    },
    {
      id: 3,
      name: "Terms of Service.pdf",
      uploadDate: "2024-01-13",
      status: "analyzed",
      risk: "high",
    },
  ],
  reports: [
    {
      id: 1,
      documentId: 1,
      title: "Contract Analysis Report",
      date: "2024-01-15",
      summary: "Low risk contract with standard clauses",
    },
    {
      id: 2,
      documentId: 3,
      title: "Terms Analysis Report",
      date: "2024-01-13",
      summary: "High risk areas identified in liability clauses",
    },
  ],
  notifications: [
    {
      id: 1,
      type: "success",
      message: "Document analysis completed",
      date: "2024-01-15 10:30 AM",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      message: "High risk clauses detected",
      date: "2024-01-14 03:45 PM",
      read: false,
    },
    {
      id: 3,
      type: "info",
      message: "New document uploaded",
      date: "2024-01-13 11:20 AM",
      read: true,
    },
  ],
};

// Mock API functions
const mockApi = {
  // Authentication
  login: (credentials) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = mockData.users.find(
          (u) =>
            u.email === credentials.email && u.password === credentials.password
        );
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve({
            data: {
              user: userWithoutPassword,
              token: "mock-jwt-token-" + user.id,
            },
          });
        } else {
          reject({ response: { data: { message: "Invalid credentials" } } });
        }
      }, 500);
    });
  },

  signup: (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: mockData.users.length + 1,
          ...userData,
        };
        mockData.users.push(newUser);
        const { password, ...userWithoutPassword } = newUser;
        resolve({
          data: {
            user: userWithoutPassword,
            token: "mock-jwt-token-" + newUser.id,
          },
        });
      }, 500);
    });
  },

  // Documents
  getDocuments: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockData.documents });
      }, 300);
    });
  },

  uploadDocument: (formData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDoc = {
          id: mockData.documents.length + 1,
          name: "New Document.pdf",
          uploadDate: new Date().toISOString().split("T")[0],
          status: "pending",
          risk: "unknown",
        };
        mockData.documents.unshift(newDoc);
        resolve({ data: newDoc });
      }, 1000);
    });
  },

  // Reports
  getReports: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockData.reports });
      }, 300);
    });
  },

  // Notifications
  getNotifications: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockData.notifications });
      }, 300);
    });
  },

  markNotificationRead: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = mockData.notifications.find((n) => n.id === id);
        if (notification) {
          notification.read = true;
        }
        resolve({ data: { success: true } });
      }, 200);
    });
  },
};

// API wrapper that switches between mock and real API
export const authApi = {
  login: (credentials) => {
    if (USE_MOCK_API) {
      return mockApi.login(credentials);
    }
    return api.post("/auth/login/", credentials);
  },
  signup: (userData) => {
    if (USE_MOCK_API) {
      return mockApi.signup(userData);
    }
    return api.post("/auth/signup/", userData);
  },
};

export const documentsApi = {
  getAll: () => {
    if (USE_MOCK_API) {
      return mockApi.getDocuments();
    }
    return api.get("/documents/");
  },
  upload: (formData) => {
    if (USE_MOCK_API) {
      return mockApi.uploadDocument(formData);
    }
    return api.post("/documents/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export const reportsApi = {
  getAll: () => {
    if (USE_MOCK_API) {
      return mockApi.getReports();
    }
    return api.get("/reports/");
  },
};

export const notificationsApi = {
  getAll: () => {
    if (USE_MOCK_API) {
      return mockApi.getNotifications();
    }
    return api.get("/notifications/");
  },
  markRead: (id) => {
    if (USE_MOCK_API) {
      return mockApi.markNotificationRead(id);
    }
    return api.patch(`/notifications/${id}/read/`);
  },
};

export default api;
