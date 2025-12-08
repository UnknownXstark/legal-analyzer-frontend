import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  UserPlus,
  Loader2,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { lawyerClientAPI, AssignmentRequest } from "@/api/lawyerClient";
import AppLayout from "@/layouts/AppLayout";

const AssignClient = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [requests, setRequests] = useState<AssignmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    const { data, error } = await lawyerClientAPI.getLawyerRequests();
    if (error) {
      toast.error(error);
    } else {
      setRequests(data || []);
    }
    setIsLoading(false);
  };

  const handleAssign = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a client email");
      return;
    }

    setIsAssigning(true);
    const { data, error } = await lawyerClientAPI.assignClient(
      searchQuery.trim()
    );

    if (error) {
      toast.error(error);
    } else {
      toast.success("Assignment request sent successfully");
      setSearchQuery("");
      fetchRequests();
    }
    setIsAssigning(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-warning/10 text-warning border-warning/20"
          >
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "accepted":
        return (
          <Badge
            variant="outline"
            className="bg-success/10 text-success border-success/20"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-destructive/10 text-destructive border-destructive/20"
          >
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Assign Client</h1>
          <p className="text-muted-foreground mt-1">
            Search and send assignment requests to clients
          </p>
        </div>

        {/* Search & Assign */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Send Assignment Request</CardTitle>
            <CardDescription>
              Enter the client's email address to send a linking request
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Enter client email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === "Enter" && handleAssign()}
                />
              </div>
              <Button
                onClick={handleAssign}
                disabled={isAssigning}
                className="gap-2"
              >
                {isAssigning ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                Send Request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Requests List */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Requests</CardTitle>
            <CardDescription>
              Track the status of your client assignment requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <UserPlus className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No assignment requests yet</p>
                <p className="text-sm">
                  Send your first request to a client above
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.client.username}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {request.client.email}
                      </TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(request.created_at).toLocaleDateString()}
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

export default AssignClient;
