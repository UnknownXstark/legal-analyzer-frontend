import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, FileText, Share2, Eye, ArrowRight } from "lucide-react";
import { documentSharingAPI, SharedDocument } from "@/api/documentSharing";

interface SharedDocumentsSectionProps {
  variant: "lawyer" | "client";
}

const SharedDocumentsSection = ({ variant }: SharedDocumentsSectionProps) => {
  const navigate = useNavigate();
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSharedDocuments();
  }, []);

  const loadSharedDocuments = async () => {
    setIsLoading(true);
    const { data } =
      variant === "lawyer"
        ? await documentSharingAPI.getSharedByMe()
        : await documentSharingAPI.getSharedWithMe();

    if (data) {
      setSharedDocuments(data.slice(0, 5)); // Show only first 5
    }
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "declined":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const title =
    variant === "lawyer" ? "Shared With Clients" : "Documents Shared With You";
  const routePath =
    variant === "lawyer"
      ? "/lawyer/shared-documents"
      : "/client/shared-documents";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          {title}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(routePath)}
          className="gap-1"
        >
          View All
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : sharedDocuments.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground text-sm">
              {variant === "lawyer"
                ? "No documents shared yet."
                : "No documents have been shared with you."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>
                  {variant === "lawyer" ? "Client" : "Lawyer"}
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sharedDocuments.map((doc) => (
                <TableRow key={doc.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="truncate max-w-[150px]">
                        {doc.document_title}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {variant === "lawyer" ? doc.client_name : doc.lawyer_name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(doc.status)}
                    >
                      {doc.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {doc.status === "accepted" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate(`/documents/${doc.document_id}`)
                        }
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default SharedDocumentsSection;
