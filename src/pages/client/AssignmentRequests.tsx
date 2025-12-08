import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserCheck, UserX, Scale, Mail } from "lucide-react";
import { toast } from "sonner";
import { lawyerClientAPI, AssignmentRequest } from "@/api/lawyerClient";
import AppLayout from "@/layouts/AppLayout";

const AssignmentRequests = () => {
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingId, setRespondingId] = useState<number | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    const { data, error } = await lawyerClientAPI.getPendingRequests();
    if (error) {
      toast.error(error);
    } else {
      setRequests(data || []);
    }
    setIsLoading(false);
  };

  const handleRespond = async (
    requestId: number,
    action: "accept" | "reject"
  ) => {
    setRespondingId(requestId);
    const { error } = await lawyerClientAPI.respondToAssignment(
      requestId,
      action
    );

    if (error) {
      toast.error(error);
    } else {
      toast.success(
        action === "accept" ? "Lawyer linked successfully!" : "Request rejected"
      );
      setRequests(requests.filter((r) => r.id !== requestId));
    }
    setRespondingId(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Assignment Requests
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and respond to lawyer assignment requests
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Scale className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Pending Requests
                </h3>
                <p>You don't have any pending lawyer assignment requests</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id} className="hover-scale">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Scale className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {request.lawyer.username}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Mail className="w-4 h-4" />
                          {request.lawyer.email}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Wants to link with you as their client
                        </p>
                        <Badge variant="outline" className="mt-2">
                          Sent{" "}
                          {new Date(request.created_at).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRespond(request.id, "reject")}
                        disabled={respondingId === request.id}
                        className="gap-2 text-destructive hover:text-destructive"
                      >
                        {respondingId === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserX className="w-4 h-4" />
                        )}
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRespond(request.id, "accept")}
                        disabled={respondingId === request.id}
                        className="gap-2"
                      >
                        {respondingId === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <UserCheck className="w-4 h-4" />
                        )}
                        Accept
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default AssignmentRequests;
