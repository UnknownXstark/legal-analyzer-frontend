import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowLeft,
  FileText,
  Calendar,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { mockDocuments } from "@/utils/mockDocuments";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface Clause {
  name: string;
  status: string;
}

interface Analysis {
  clauses: Clause[];
  overallRisk: string;
  summary: string;
  extractedText: string;
  analyzedAt: string;
}

interface Document {
  id: number;
  title: string;
  uploadedAt: string;
  risk: string;
}

const DocumentAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<Document | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const doc = await mockDocuments.getDocumentById(id!);
        const analysisData = await mockDocuments.getAnalysis(id!);

        setDocument(doc);
        setAnalysis(analysisData);
      } catch (error) {
        console.error("Error fetching analysis:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-success text-success-foreground";
      case "Medium":
        return "bg-warning text-warning-foreground";
      case "High":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Compliant":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "Risky":
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "Needs Review":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "bg-success/10 text-success border-success/20";
      case "Risky":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "Needs Review":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  // Prepare chart data
  const chartData = analysis
    ? [
        {
          name: "Compliant",
          count: analysis.clauses.filter((c) => c.status === "Compliant")
            .length,
          fill: "hsl(var(--success))",
        },
        {
          name: "Needs Review",
          count: analysis.clauses.filter((c) => c.status === "Needs Review")
            .length,
          fill: "hsl(var(--warning))",
        },
        {
          name: "Risky",
          count: analysis.clauses.filter((c) => c.status === "Risky").length,
          fill: "hsl(var(--destructive))",
        },
      ].filter((item) => item.count > 0)
    : [];

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-6 animate-fade-in">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-96" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-64" />
              <Skeleton className="h-48" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!document || !analysis) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Analysis Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The document analysis could not be loaded.
          </p>
          <Button onClick={() => navigate("/documents")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Documents
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/documents")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Document Analysis</h1>
              <p className="text-muted-foreground">
                AI-powered legal document review
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Document Info & Text */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document Info Card */}
            <Card className="animate-scale-in">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary" />
                      {document.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {document.uploadedAt}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className={getRiskColor(analysis.overallRisk)}>
                    {analysis.overallRisk} Risk
                  </Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Extracted Text */}
            <Card>
              <CardHeader>
                <CardTitle>Extracted Text</CardTitle>
                <CardDescription>
                  Document content extracted for analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {analysis.extractedText}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Insights */}
          <div className="space-y-6">
            {/* Risk Summary */}
            <Card
              className="animate-scale-in"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader>
                <CardTitle>Risk Summary</CardTitle>
                <CardDescription>Overall assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{analysis.summary}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  Analyzed: {analysis.analyzedAt}
                </p>
              </CardContent>
            </Card>

            {/* Clause Breakdown */}
            <Card
              className="animate-scale-in"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader>
                <CardTitle>Clause Analysis</CardTitle>
                <CardDescription>
                  {analysis.clauses.length} clauses reviewed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.clauses.map((clause, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${getStatusColor(
                        clause.status
                      )}`}
                    >
                      <div className="flex items-center gap-2">
                        {getStatusIcon(clause.status)}
                        <span className="font-medium text-sm">
                          {clause.name}
                        </span>
                      </div>
                      <span className="text-xs">{clause.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Visualization */}
            {chartData.length > 0 && (
              <Card
                className="animate-scale-in"
                style={{ animationDelay: "0.3s" }}
              >
                <CardHeader>
                  <CardTitle>Risk Distribution</CardTitle>
                  <CardDescription>Clause status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fill: "hsl(var(--foreground))" }}
                        tickLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <YAxis
                        tick={{ fill: "hsl(var(--foreground))" }}
                        tickLine={{ stroke: "hsl(var(--border))" }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem",
                        }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DocumentAnalysis;
