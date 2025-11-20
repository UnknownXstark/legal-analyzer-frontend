import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileText,
  Download,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  BarChart3,
} from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { reportsApi } from "@/api/reports";

const ReportDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [clauses, setClauses] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [id]);

  const loadReport = async () => {
    try {
      const data = await reportsApi.getReportById(id!);

      if (!data) {
        toast.error("Report not found");
        navigate("/reports");
        return;
      }

      setReport(data);

      // Convert backend clauses dictionary into array format
      const clauseArray = Object.entries(data.clauses_found || {}).map(
        ([name, value]) => ({
          name,
          status: value ? "Compliant" : "Needs Review",
        })
      );

      setClauses(clauseArray);

      // Compute statistics
      const compliant = clauseArray.filter((c) => c.status === "Compliant").length;
      const needsReview = clauseArray.filter((c) => c.status === "Needs Review").length;

      setStats({
        totalClauses: clauseArray.length,
        compliant,
        needsReview,
        risky: 0, // no risky category unless you implement it backend-side
      });

    } catch (error) {
      toast.error("Failed to load report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!report) return;

    const content = `
DOCUMENT REPORT
======================
Title: ${report.title}
Generated: ${report.analyzed_at}
Risk Level: ${report.risk_score}

SUMMARY:
${report.summary}

CLAUSES:
${JSON.stringify(report.clauses_found, null, 2)}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `${report.title.replace(/\s+/g, "_")}_Analysis_Report.txt`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success("Report downloaded successfully");
  };

  const getRiskColor = (risk: string) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Compliant":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "Needs Review":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "Risky":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "Needs Review":
        return "bg-orange-500/10 text-orange-700 border-orange-200";
      case "Risky":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (!report) return null;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/reports")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Analysis Report</h1>
              <p className="text-muted-foreground mt-1">
                Detailed analysis for {report.title}
              </p>
            </div>
          </div>
          <Button onClick={handleDownload} className="gap-2">
            <Download className="w-4 h-4" />
            Download Report
          </Button>
        </div>

        {/* Document Info */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold text-foreground">{report.title}</h2>
                  <p className="text-sm text-muted-foreground mt-1">File: {report.file}</p>
                  <p className="text-sm text-muted-foreground">Generated: {report.analyzed_at}</p>
                </div>
              </div>

              <Badge className={`${getRiskColor(report.risk_score)} text-sm px-3 py-1`}>
                {report.risk_score} Risk
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" /> Analysis Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <div className="p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-foreground">{stats.totalClauses}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Clauses</p>
              </div>

              <div className="p-4 rounded-lg bg-green-500/10">
                <p className="text-2xl font-bold text-green-700">{stats.compliant}</p>
                <p className="text-sm text-green-600 mt-1">Compliant</p>
              </div>

              <div className="p-4 rounded-lg bg-orange-500/10">
                <p className="text-2xl font-bold text-orange-700">{stats.needsReview}</p>
                <p className="text-sm text-orange-600 mt-1">Needs Review</p>
              </div>

              <div className="p-4 rounded-lg bg-red-500/10">
                <p className="text-2xl font-bold text-red-700">{stats.risky}</p>
                <p className="text-sm text-red-600 mt-1">Risky</p>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Executive Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{report.summary}</p>
          </CardContent>
        </Card>

        {/* Clause Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Clause Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clauses.map((clause: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(clause.status)}
                    <span className="font-medium text-foreground">{clause.name}</span>
                  </div>
                  <Badge className={getStatusColor(clause.status)}>{clause.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">
              *You can later add AI-generated recommendations here based on clauses.*
            </p>
          </CardContent>
        </Card>

      </div>
    </AppLayout>
  );
};

export default ReportDetail;
