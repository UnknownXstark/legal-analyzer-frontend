import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FileUp,
  Settings,
  FileBarChart,
  Download,
  Lock,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import {
  getLogs,
  filterLogs,
  formatTimestamp,
  getLogIcon,
} from "@/utils/mockLogs";
import AppLayout from "@/layouts/AppLayout";
import { useNavigate } from "react-router-dom";

const ActivityLogs = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setIsLoading(true);
      const data = await getLogs();
      setLogs(data);
    } catch (error) {
      toast.error("Failed to load activity logs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async (type: string) => {
    try {
      setIsLoading(true);
      setActiveFilter(type);
      const data = await filterLogs(type);
      setLogs(data);
    } catch (error) {
      toast.error("Failed to filter logs");
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "upload":
        return <FileUp className="w-5 h-5 text-blue-500" />;
      case "analysis":
        return <Settings className="w-5 h-5 text-purple-500" />;
      case "report":
        return <FileBarChart className="w-5 h-5 text-green-500" />;
      case "download":
        return <Download className="w-5 h-5 text-orange-500" />;
      case "auth":
        return <Lock className="w-5 h-5 text-red-500" />;
      default:
        return <Settings className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getActionBadge = (type: string) => {
    const badges: Record<string, { variant: any; label: string }> = {
      upload: { variant: "default", label: "Upload" },
      analysis: { variant: "secondary", label: "Analysis" },
      report: { variant: "outline", label: "Report" },
      download: { variant: "secondary", label: "Download" },
      auth: { variant: "outline", label: "Auth" },
      settings: { variant: "secondary", label: "Settings" },
    };
    return badges[type] || { variant: "outline", label: "Other" };
  };

  const filters = [
    { label: "All", value: "all" },
    { label: "Uploads", value: "upload" },
    { label: "Analysis", value: "analysis" },
    { label: "Reports", value: "report" },
    { label: "Downloads", value: "download" },
    { label: "Auth", value: "auth" },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Activity Logs
            </h1>
            <p className="text-muted-foreground mt-1">
              Track all system activities and user actions
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/notifications")}>
            Back to Notifications
          </Button>
        </div>

        {/* Filter Buttons */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Filter Activities</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter.value}
                  variant={
                    activeFilter === filter.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => handleFilter(filter.value)}
                  className="transition-all"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No activity logs found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => {
                  const badge = getActionBadge(log.type);
                  return (
                    <div
                      key={log.id}
                      className="flex items-center gap-4 p-4 border border-border rounded-lg hover:shadow-md hover:border-primary/30 transition-all animate-fade-in"
                    >
                      {/* Icon */}
                      <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0">
                        {getActionIcon(log.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">
                            {log.action}
                          </p>
                          <Badge variant={badge.variant} className="text-xs">
                            {badge.label}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5">
                          {Object.entries(log.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="capitalize">{key}:</span>{" "}
                              <span className="font-medium">
                                {String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Timestamp */}
                      <div className="text-sm text-muted-foreground flex-shrink-0">
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default ActivityLogs;
