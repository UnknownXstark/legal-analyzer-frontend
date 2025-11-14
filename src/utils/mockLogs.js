// Mock activity logs data and helper functions
const LOGS_KEY = "activityLogs";

const defaultLogs = [
  {
    id: 1,
    action: "Uploaded document",
    type: "upload",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    details: { title: "NDA Agreement", size: "245 KB" },
    userId: "user123",
  },
  {
    id: 2,
    action: "Analyzed document",
    type: "analysis",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    details: { title: "NDA Agreement", risk: "Medium" },
    userId: "user123",
  },
  {
    id: 3,
    action: "Generated report",
    type: "report",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    details: { title: "NDA Agreement", docId: 1 },
    userId: "user123",
  },
  {
    id: 4,
    action: "Uploaded document",
    type: "upload",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    details: { title: "Employment Contract", size: "512 KB" },
    userId: "user123",
  },
  {
    id: 5,
    action: "Analyzed document",
    type: "analysis",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    details: { title: "Employment Contract", risk: "High" },
    userId: "user123",
  },
  {
    id: 6,
    action: "Downloaded report",
    type: "download",
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    details: { title: "NDA Agreement Report" },
    userId: "user123",
  },
  {
    id: 7,
    action: "Uploaded document",
    type: "upload",
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    details: { title: "Service Agreement", size: "189 KB" },
    userId: "user123",
  },
  {
    id: 8,
    action: "Generated report",
    type: "report",
    timestamp: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000
    ).toISOString(),
    details: { title: "Employment Contract", docId: 2 },
    userId: "user123",
  },
  {
    id: 9,
    action: "Logged in",
    type: "auth",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    details: { location: "New York, US" },
    userId: "user123",
  },
  {
    id: 10,
    action: "Updated settings",
    type: "settings",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    details: { setting: "Email notifications enabled" },
    userId: "user123",
  },
];

// Initialize logs in localStorage if not present
export const initializeLogs = () => {
  if (!localStorage.getItem(LOGS_KEY)) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(defaultLogs));
  }
};

// Get all activity logs
export const getLogs = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      initializeLogs();
      const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || "[]");
      resolve(
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      );
    }, 800);
  });
};

// Filter logs by type
export const filterLogs = (type = "all") => {
  return new Promise((resolve) => {
    setTimeout(() => {
      initializeLogs();
      const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || "[]");
      const filtered =
        type === "all" ? logs : logs.filter((log) => log.type === type);
      resolve(
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      );
    }, 600);
  });
};

// Add a new log entry (for future use when actions happen)
export const addLog = (log) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || "[]");
      const newLog = {
        ...log,
        id: Date.now(),
        timestamp: new Date().toISOString(),
        userId:
          JSON.parse(localStorage.getItem("user") || "{}").username || "user",
      };
      logs.unshift(newLog);
      localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
      resolve(newLog);
    }, 300);
  });
};

// Format timestamp to readable date/time
export const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get icon for log type
export const getLogIcon = (type) => {
  const icons = {
    upload: "📄",
    analysis: "⚙️",
    report: "📊",
    download: "⬇️",
    auth: "🔐",
    settings: "⚙️",
  };
  return icons[type] || "📌";
};
