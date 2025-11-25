import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import IndividualDashboard from "./dashboard/IndividualDashboard";
import LawyerDashboard from "./dashboard/LawyerDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import { useDocuments } from "@/hooks/useDocuments";
import { adminDashboardApi } from "@/api/adminDashboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { documents, isLoading: docsLoading } = useDocuments();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);
      const role = userData.role || "individual";

      // --- ADMIN DASHBOARD (real backend) ---
      if (role === "admin") {
        try {
          const adminData = await adminDashboardApi.getAnalytics();
          setDashboardData(adminData);
        } catch (err) {
          console.error("Failed to load admin dashboard:", err);
        } finally {
          setLoading(false);
        }
        return;
      }

      // --- INDIVIDUAL DASHBOARD (local document data) ---
      if (role === "individual") {
        const stats = {
          totalDocuments: documents.length,
          pendingAnalysis: documents.filter((d) => d.status === "pending").length,
          riskReports: documents.filter((d) => d.status === "analyzed").length,
        };

        const recentDocuments = documents.slice(0, 5).map((doc) => ({
          id: doc.id,
          title: doc.title || doc.fileName,
          date: doc.uploadedAt,
          risk: doc.risk || "Not Analyzed",
          status: doc.status || "pending",
        }));

        const data = {
          stats,
          recentDocuments,
          riskDistribution: {
            low: documents.filter((d) => d.risk?.toLowerCase() === "low").length,
            medium: documents.filter((d) => d.risk?.toLowerCase() === "medium").length,
            high: documents.filter((d) => d.risk?.toLowerCase() === "high").length,
          },
        };

        setDashboardData(data);
        setLoading(false);
        return;
      }

      // --- LAWYER DASHBOARD ---
      // LawyerDashboard fetches its own data, so nothing needed here
      setLoading(false);
    };

    if (!docsLoading) {
      loadDashboard();
    }
  }, [documents, docsLoading, navigate]);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </AppLayout>
    );
  }

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">No user data found</div>
        </div>
      </AppLayout>
    );
  }

  const userName = user.username || user.name || "User";
  const role = user.role || "individual";

  return (
    <AppLayout>
      {role === "individual" && (
        <IndividualDashboard data={dashboardData} userName={userName} />
      )}

      {role === "lawyer" && <LawyerDashboard />}

      {role === "admin" && (
        <AdminDashboard data={dashboardData} userName={userName} />
      )}
    </AppLayout>
  );
};

export default Dashboard;
