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
import { Users, FileText, UserCheck, Activity } from "lucide-react";

interface AdminDashboardProps {
  data: any;
  userName: string;
}

const AdminDashboard = ({ data, userName }: AdminDashboardProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return "👤";
      case "document":
        return "📄";
      case "system":
        return "⚙️";
      default:
        return "📌";
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: data.stats.totalUsers,
      icon: Users,
      color: "text-primary",
    },
    {
      title: "Documents Analyzed",
      value: data.stats.documentsAnalyzed,
      icon: FileText,
      color: "text-success",
    },
    {
      title: "Active Lawyers",
      value: data.stats.activeLawyers,
      icon: UserCheck,
      color: "text-warning",
    },
    {
      title: "System Uptime",
      value: data.stats.systemUptime,
      icon: Activity,
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          System overview and user management
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

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>System Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.activityLog.map((activity: any) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <span className="text-2xl">
                  {getActivityIcon(activity.type)}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.user}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentUsers.map((user: any) => (
                <TableRow key={user.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.joined}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
