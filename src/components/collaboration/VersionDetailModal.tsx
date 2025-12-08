import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar } from "lucide-react";
import { Version } from "@/api/comments";

interface VersionDetailModalProps {
  version: Version | null;
  isOpen: boolean;
  onClose: () => void;
}

const VersionDetailModal = ({
  version,
  isOpen,
  onClose,
}: VersionDetailModalProps) => {
  if (!version) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Version {version.version_number}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" />
                {formatDate(version.created_at)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {version.changes_summary && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Changes</Badge>
            <span className="text-sm text-muted-foreground">
              {version.changes_summary}
            </span>
          </div>
        )}

        <ScrollArea className="h-[400px] rounded-lg border border-border">
          <div className="p-4">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
              {version.content || "No content available for this version."}
            </pre>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VersionDetailModal;
