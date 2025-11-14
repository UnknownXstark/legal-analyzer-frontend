import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { documentsApi } from "@/services/api";
import AppLayout from "@/layouts/AppLayout";

const Documents = () => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const response = await documentsApi.getAll();
      setDocuments(response.data);
    } catch (error) {
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
    // Mock upload
    try {
      await documentsApi.upload(new FormData());
      toast.success("Document uploaded successfully!");
      loadDocuments();
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "analyzed":
        return "bg-success text-success-foreground";
      case "pending":
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Manage and analyze your legal documents
            </p>
          </div>
          <Button onClick={handleUpload} className="gap-2">
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading documents...
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {doc.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getRiskColor(doc.risk)}>
                        {doc.risk} risk
                      </Badge>
                      <Badge className={getStatusColor(doc.status)}>
                        {doc.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        View
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

export default Documents;
