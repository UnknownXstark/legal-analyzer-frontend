// Mock data for dashboards

export const mockDashboardData = {
  individual: {
    stats: {
      totalDocuments: 10,
      pendingAnalysis: 3,
      riskReports: 7,
    },
    recentDocuments: [
      {
        id: 1,
        title: "Test NDA",
        risk: "Medium",
        date: "2024-01-15",
        status: "analyzed",
      },
      {
        id: 2,
        title: "Employment Contract",
        risk: "High",
        date: "2024-01-14",
        status: "analyzed",
      },
      {
        id: 3,
        title: "Vendor Agreement",
        risk: "Low",
        date: "2024-01-13",
        status: "analyzed",
      },
      {
        id: 4,
        title: "Service Terms",
        risk: "Medium",
        date: "2024-01-12",
        status: "pending",
      },
      {
        id: 5,
        title: "Lease Agreement",
        risk: "Low",
        date: "2024-01-10",
        status: "analyzed",
      },
    ],
  },
  lawyer: {
    stats: {
      totalClients: 12,
      documentsReviewed: 45,
      pendingReviews: 8,
      highRiskCases: 5,
    },
    clients: [
      {
        id: 1,
        name: "Jane Doe",
        docs: 5,
        avgRisk: "Medium",
        lastActive: "2024-01-15",
      },
      {
        id: 2,
        name: "John Smith",
        docs: 3,
        avgRisk: "High",
        lastActive: "2024-01-14",
      },
      {
        id: 3,
        name: "Alice Johnson",
        docs: 8,
        avgRisk: "Low",
        lastActive: "2024-01-13",
      },
      {
        id: 4,
        name: "Bob Williams",
        docs: 4,
        avgRisk: "Medium",
        lastActive: "2024-01-12",
      },
      {
        id: 5,
        name: "Carol Brown",
        docs: 6,
        avgRisk: "High",
        lastActive: "2024-01-11",
      },
    ],
    riskDistribution: {
      low: 15,
      medium: 20,
      high: 10,
    },
  },
  admin: {
    stats: {
      totalUsers: 25,
      documentsAnalyzed: 100,
      activeLawyers: 8,
      systemUptime: "99.9%",
    },
    activityLog: [
      {
        id: 1,
        type: "user",
        action: "New user registered",
        user: "jane@example.com",
        time: "2 hours ago",
      },
      {
        id: 2,
        type: "document",
        action: "Document analyzed",
        user: "john@example.com",
        time: "3 hours ago",
      },
      {
        id: 3,
        type: "system",
        action: "System backup completed",
        user: "system",
        time: "5 hours ago",
      },
      {
        id: 4,
        type: "user",
        action: "Lawyer account upgraded",
        user: "lawyer@example.com",
        time: "1 day ago",
      },
      {
        id: 5,
        type: "document",
        action: "High-risk document flagged",
        user: "alice@example.com",
        time: "1 day ago",
      },
    ],
    recentUsers: [
      {
        id: 1,
        name: "Jane Doe",
        email: "jane@example.com",
        role: "individual",
        joined: "2024-01-15",
      },
      {
        id: 2,
        name: "John Smith",
        email: "john@example.com",
        role: "lawyer",
        joined: "2024-01-14",
      },
      {
        id: 3,
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "individual",
        joined: "2024-01-13",
      },
    ],
  },
};
