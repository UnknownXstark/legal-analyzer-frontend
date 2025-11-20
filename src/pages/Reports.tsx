import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { reportsApi } from "@/api/reports";

const Reports = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const data = await reportsApi.getReports();
      setReports(
        data.filter((doc: any) => doc.status === "analyzed") // only show analyzed docs
      );
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string | null) => {
    switch (risk) {
      case "Low":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "Medium":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      case "High":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Analysis Reports
            </h1>
            <p className="text-muted-foreground mt-1">
              View detailed analysis reports for your analyzed documents
            </p>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">
              {reports.length} Reports
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Generated Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
                <p className="text-muted-foreground mt-4">Loading reports...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">No reports available</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Analyze your documents to generate reports
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {report.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Generated:{" "}
                          {report.analyzed_at
                            ? new Date(report.analyzed_at).toLocaleString()
                            : "Not analyzed"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(report.risk_score)}>
                        {report.risk_score || "N/A"} Risk
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => navigate(`/reports/${report.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                        View Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;
