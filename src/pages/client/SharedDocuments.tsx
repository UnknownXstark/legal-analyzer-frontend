import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
import { Loader2, FileText, Share2, Eye, Check, X } from "lucide-react";
import AppLayout from "@/layouts/AppLayout";
import { documentSharingAPI, SharedDocument } from "@/api/documentSharing";
import { toast } from "sonner";

const SharedDocumentsClient = () => {
  const navigate = useNavigate();
  const [sharedDocuments, setSharedDocuments] = useState<SharedDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    loadSharedDocuments();
  }, []);

  const loadSharedDocuments = async () => {
    setIsLoading(true);
    const { data, error } = await documentSharingAPI.getSharedWithMe();
    if (error) {
      toast.error(error);
    } else if (data) {
      setSharedDocuments(data);
    }
    setIsLoading(false);
  };

  const handleAccept = async (shareId: number) => {
    setProcessingId(shareId);
    const { error } = await documentSharingAPI.acceptShare(shareId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Document access accepted");
      loadSharedDocuments();
    }
    setProcessingId(null);
  };

  const handleDecline = async (shareId: number) => {
    setProcessingId(shareId);
    const { error } = await documentSharingAPI.declineShare(shareId);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Document access declined");
      loadSharedDocuments();
    }
    setProcessingId(null);
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

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Share2 className="w-8 h-8" />
            Shared Documents
          </h1>
          <p className="text-muted-foreground mt-1">
            Documents shared with you by lawyers
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Documents Shared With You</CardTitle>
            <CardDescription>
              Accept or decline access to shared documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sharedDocuments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  No documents have been shared with you yet.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Shared By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sharedDocuments.map((doc) => (
                    <TableRow key={doc.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          {doc.document_title}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {doc.lawyer_name}
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
                        {doc.status === "pending" ? (
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAccept(doc.id)}
                              disabled={processingId === doc.id}
                              className="gap-1 text-success hover:text-success hover:bg-success/10"
                            >
                              {processingId === doc.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDecline(doc.id)}
                              disabled={processingId === doc.id}
                              className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="w-4 h-4" />
                              Decline
                            </Button>
                          </div>
                        ) : doc.status === "accepted" ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              navigate(`/documents/${doc.document_id}`)
                            }
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default SharedDocumentsClient;
