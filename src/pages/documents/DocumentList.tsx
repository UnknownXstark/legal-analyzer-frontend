import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, FileText, Eye, Trash2, Search } from "lucide-react";
import { useDocuments } from "@/hooks/useDocuments";
import AppLayout from "@/layouts/AppLayout";

const DocumentList = () => {
  const navigate = useNavigate();
  const { documents, isLoading } = useDocuments();
  const [filteredDocs, setFilteredDocs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          doc.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredDocs(filtered);
    } else {
      setFilteredDocs(documents);
    }
  }, [searchTerm, documents]);

  const handleDelete = () => {
    // Delete functionality can be added here if needed
    setDeleteId(null);
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
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

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documents</h1>
            <p className="text-muted-foreground mt-1">
              Manage and analyze your legal documents
            </p>
          </div>
          <Button
            onClick={() => navigate("/documents/upload")}
            className="gap-2 hover:shadow-md transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </Button>
        </div>

        <Card className="shadow-card hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Documents ({filteredDocs.length})</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading documents...
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No documents found"
                    : "No documents uploaded yet"}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => navigate("/documents/upload")}
                    className="mt-4 gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Your First Document
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredDocs.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 hover:border-primary/30 transition-all gap-4 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {doc.title}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {doc.fileName} • {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
                      <Badge className={getRiskColor(doc.risk)}>
                        {doc.risk} risk
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/documents/${doc.id}`)}
                          className="gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(doc.id)}
                          className="gap-2 hover:bg-destructive hover:text-destructive-foreground transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default DocumentList;
