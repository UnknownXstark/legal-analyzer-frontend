import { useState, useEffect } from "react";
import AppLayout from "@/layouts/AppLayout";
import IndividualDashboard from "./dashboard/IndividualDashboard";
import LawyerDashboard from "./dashboard/LawyerDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import { mockService } from "@/utils/mockService";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const userData = mockService.getUserInfo();
      if (userData) {
        setUser(userData);
        const role = userData.role || "individual";
        const data = await mockService.getDashboardData(role);
        setDashboardData(data);
      }
      setLoading(false);
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </AppLayout>
    );
  }

  if (!user || !dashboardData) {
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
      {role === "lawyer" && (
        <LawyerDashboard data={dashboardData} userName={userName} />
      )}
      {role === "admin" && (
        <AdminDashboard data={dashboardData} userName={userName} />
      )}
    </AppLayout>
  );
};

export default Dashboard;
