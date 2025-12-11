import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, AlertCircle, Clock } from "lucide-react";
import { lawyerDashboardApi } from "@/api/lawyerDashboard";
import { toast } from "sonner";
import SharedDocumentsSection from "@/components/SharedDocumentsSection";

interface LawyerData {
  stats: {
    totalClients: number;
    documentsReviewed: number;
    pendingReviews: number;
    highRiskCases: number;
  };
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  clients: {
    id: number;
    name: string;
    docs: number;
    avgRisk: string;
    lastActive: string;
  }[];
}

const LawyerDashboard = () => {
  const [data, setData] = useState<LawyerData | null>(null);
  const [userName, setUserName] = useState("Lawyer");
  const [loading, setLoading] = useState(true);

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "low":
        return "bg-success/10 text-success border-success/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await lawyerDashboardApi.getAnalytics();
        setData(res);
        setUserName(localStorage.getItem("userName") || "Lawyer");
      } catch (err) {
        toast.error("Failed to load lawyer dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-6 text-muted-foreground">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="p-6 text-destructive">Unable to load dashboard data.</div>;
  }

  const stats = [
    {
      title: "Total Clients",
      value: data.stats.totalClients,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Documents Reviewed",
      value: data.stats.documentsReviewed,
      icon: FileText,
      color: "text-success",
    },
    {
      title: "Pending Reviews",
      value: data.stats.pendingReviews,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "High Risk Cases",
      value: data.stats.highRiskCases,
      icon: AlertCircle,
      color: "text-destructive",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {userName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your clients and their documents
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Distribution */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {data.riskDistribution.low}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Medium Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {data.riskDistribution.medium}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Documents</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Risk
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {data.riskDistribution.high}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Documents</p>
          </CardContent>
        </Card>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle>Client Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client Name</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Avg. Risk</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.docs}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getRiskColor(client.avgRisk)}
                    >
                      {client.avgRisk}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {client.lastActive}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Shared Documents Section */}
      <SharedDocumentsSection variant="lawyer" />
    </div>
  );
};

export default LawyerDashboard;
