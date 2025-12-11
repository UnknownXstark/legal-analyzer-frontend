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
import { FileText, AlertCircle, CheckCircle, Clock } from "lucide-react";
import SharedDocumentsSection from "@/components/SharedDocumentsSection";

interface IndividualDashboardProps {
  data: any;
  userName: string;
}

const IndividualDashboard = ({ data, userName }: IndividualDashboardProps) => {
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

  const stats = [
    {
      title: "Total Documents",
      value: data.stats.totalDocuments,
      icon: FileText,
      color: "text-primary",
    },
    {
      title: "Pending Analysis",
      value: data.stats.pendingAnalysis,
      icon: Clock,
      color: "text-warning",
    },
    {
      title: "Risk Reports",
      value: data.stats.riskReports,
      icon: CheckCircle,
      color: "text-success",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {userName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's your document analysis overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
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

      {/* Recent Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentDocuments.map((doc: any) => (
                <TableRow key={doc.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {doc.date}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRiskColor(doc.risk)}>
                      {doc.risk}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        doc.status === "analyzed" ? "default" : "secondary"
                      }
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Shared Documents Section */}
      <SharedDocumentsSection variant="client" />
    </div>
  );
};

export default IndividualDashboard;
