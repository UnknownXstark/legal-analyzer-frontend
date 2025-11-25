import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import IndividualDashboard from './dashboard/IndividualDashboard';
import LawyerDashboard from './dashboard/LawyerDashboard';
import AdminDashboard from './dashboard/AdminDashboard';
import { useDocuments } from '@/hooks/useDocuments';
import { mockService } from '@/utils/mockService';

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { documents, isLoading: docsLoading } = useDocuments();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        navigate('/login');
        return;
      }

      const userData = JSON.parse(storedUser);
      setUser(userData);
      const role = userData.role || 'individual';

      // Build dashboard data from real documents
      const stats = {
        totalDocuments: documents.length,
        pendingAnalysis: documents.filter(d => d.status === 'pending').length,
        riskReports: documents.filter(d => d.status === 'analyzed').length,
        totalClients: 15, // Mock data for lawyer
        documentsReviewed: documents.filter(d => d.status === 'analyzed').length,
        pendingReviews: documents.filter(d => d.status === 'pending').length,
        highRiskCases: documents.filter(d => d.risk?.toLowerCase() === 'high').length,
        totalUsers: 142, // Mock data for admin
        documentsAnalyzed: documents.filter(d => d.status === 'analyzed').length,
        activeLawyers: 12, // Mock data for admin
        systemUptime: '99.9%', // Mock data for admin
      };

      const recentDocuments = documents.slice(0, 5).map(doc => ({
        id: doc.id,
        title: doc.title || doc.fileName,
        date: doc.uploadedAt,
        risk: doc.risk || 'Not Analyzed',
        status: doc.status || 'pending',
      }));

      const data = {
        stats,
        recentDocuments,
        riskDistribution: {
          low: documents.filter(d => d.risk?.toLowerCase() === 'low').length,
          medium: documents.filter(d => d.risk?.toLowerCase() === 'medium').length,
          high: documents.filter(d => d.risk?.toLowerCase() === 'high').length,
        },
        clients: [], // Mock for lawyer dashboard
        activityLog: [], // Mock for admin dashboard
        recentUsers: [], // Mock for admin dashboard
      };

      setDashboardData(data);
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

  if (!user || !dashboardData) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-muted-foreground">No user data found</div>
        </div>
      </AppLayout>
    );
  }

  const userName = user.username || user.name || 'User';
  const role = user.role || 'individual';

  return (
    <AppLayout>
      {role === 'individual' && (
        <IndividualDashboard data={dashboardData} userName={userName} />
      )}
      {role === 'lawyer' && (
        <LawyerDashboard />
      )}
      {role === 'admin' && (
        <AdminDashboard data={dashboardData} userName={userName} />
      )}
    </AppLayout>
  );
};

export default Dashboard;
