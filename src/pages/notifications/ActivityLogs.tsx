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

import AppLayout from "@/layouts/AppLayout";
import { useNavigate } from "react-router-dom";
import { activityLogsApi } from "@/api/activityLogs";
// import { formatTimestamp } from "@/utils/dateFormat";

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
    } catch {
      toast.error("Failed to load activity logs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = async (type: string) => {
    try {
      setIsLoading(true);
      setActiveFilter(type);
      const data = await activityLogsApi.filter(type);
      setLogs(data);
    } catch {
      toast.error("Failed to filter logs");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AppLayout>
      {/* UI remains the same */}
      ...
    </AppLayout>
  );
};

export default ActivityLogs;
