import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, Send, Trash2, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { collaborationAPI, Comment } from "@/api/comments";

interface CommentSidebarProps {
  documentId: string | number;
  isOpen: boolean;
  onClose: () => void;
}

const CommentSidebar = ({
  documentId,
  isOpen,
  onClose,
}: CommentSidebarProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, documentId]);

  const fetchComments = async () => {
    setIsLoading(true);
    const { data, error } = await collaborationAPI.getComments(documentId);
    if (error) {
      toast.error(error);
    } else {
      setComments(data || []);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    const { data, error } = await collaborationAPI.addComment(
      documentId,
      newComment.trim()
    );

    if (error) {
      toast.error(error);
    } else if (data) {
      setComments([...comments, data]);
      setNewComment("");
      toast.success("Comment added");
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (commentId: number) => {
    setDeletingId(commentId);
    const { error } = await collaborationAPI.deleteComment(commentId);

    if (error) {
      toast.error(error);
    } else {
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success("Comment deleted");
    }
    setDeletingId(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Comments</h3>
          <span className="text-xs text-muted-foreground">
            ({comments.length})
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      {/* Comments List */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet</p>
            <p className="text-xs">Be the first to comment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="group">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm text-foreground">
                        {comment.user.username}
                      </span>
                      {(comment.user.id === currentUser.id ||
                        currentUser.role === "admin") && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          disabled={deletingId === comment.id}
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        >
                          {deletingId === comment.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3 text-destructive" />
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-foreground mt-1">
                      {comment.text}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                </div>
                <Separator className="mt-4" />
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="resize-none min-h-[60px]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !newComment.trim()}
          className="w-full mt-2 gap-2"
          size="sm"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          Post Comment
        </Button>
      </div>
    </div>
  );
};

export default CommentSidebar;
