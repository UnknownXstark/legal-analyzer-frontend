import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, FileUp, Settings, FileBarChart, Download, Lock } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import { activityLogsApi } from "@/api/activityLogs";
import { formatTimestamp } from "@/utils/dateFormat";

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
      const data = await activityLogsApi.getAll();
      setLogs(data);
    } catch (error) {
      toast.error("Failed to load activity logs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async (type: string) => {
    try {
      setActiveFilter(type);
      setIsLoading(true);

      const data = await activityLogsApi.filter(type);
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
            <h1 className="text-3xl font-bold text-foreground">Activity Logs</h1>
            <p className="text-muted-foreground mt-1">
              Track all system activities
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate("/notifications")}>
            Back to Notifications
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Filter Activities</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <Button
                  key={f.value}
                  variant={activeFilter === f.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilter(f.value)}
                >
                  {f.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
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
              <div className="text-center py-12 text-muted-foreground">
                No activity logs found
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-md transition-all"
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-lg border flex items-center justify-center">
                      {getActionIcon(log.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{log.action}</p>

                      <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                        {Object.entries(log.details || {}).map(([key, value]) => (
                          <div key={key}>
                            <span className="capitalize">{key}:</span>{" "}
                            <span className="font-medium">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timestamp */}
                    <div className="text-sm text-muted-foreground flex-shrink-0">
                      {formatTimestamp(log.timestamp)}
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

export default ActivityLogs;
