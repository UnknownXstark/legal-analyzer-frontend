import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Bell,
  FileUp,
  Settings,
  FileBarChart,
  Download,
  Lock,
  Info,
  CheckCheck,
} from "lucide-react";

import { toast } from "sonner";
import { notificationsApi } from "@/api/notifications";
import { formatTimeAgo } from "@/utils/dateFormat";
import AppLayout from "@/layouts/AppLayout";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getAll();
      setNotifications(data);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      toast.error("Error marking notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllRead();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
    } catch (error) {
      toast.error("Error marking notifications");
    }
  };

  /**
   * 🔥 Auto-detect icon based on notification message
   * Backend messages:
   * - "Document uploaded successfully"
   * - "Document analysis completed"
   * - "Report generated"
   * - "User logged in"
   * - "User logged out"
   */
  const getIcon = (message: string) => {
    const msg = message.toLowerCase();

    if (msg.includes("upload"))
      return <FileUp className="text-blue-500 w-5 h-5" />;
    if (msg.includes("analy"))
      return <Settings className="text-purple-500 w-5 h-5" />;
    if (msg.includes("report"))
      return <FileBarChart className="text-green-500 w-5 h-5" />;
    if (msg.includes("download"))
      return <Download className="text-orange-500 w-5 h-5" />;
    if (msg.includes("login") || msg.includes("logout"))
      return <Lock className="text-red-500 w-5 h-5" />;

    return <Info className="text-primary w-5 h-5" />;
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your document activity
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/notifications/logs")}
          >
            View Activity Logs
          </Button>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              All Notifications
              {unreadCount > 0 && (
                <Badge variant="default" className="ml-3">
                  {unreadCount} unread
                </Badge>
              )}
            </CardTitle>

            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
                <CheckCheck className="w-4 h-4" /> Mark all as read
              </Button>
            )}
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start justify-between p-4 rounded-lg border 
                      ${
                        !n.is_read
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-background"
                      }
                      hover:shadow-md transition-all cursor-pointer`}
                    onClick={() => !n.is_read && handleMarkRead(n.id)}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Unread pulse */}
                      {!n.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse" />
                      )}

                      {/* Icon */}
                      <div className="w-10 h-10 border rounded-lg flex items-center justify-center">
                        {getIcon(n.message)}
                      </div>

                      {/* Message */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            !n.is_read ? "font-semibold" : "font-medium"
                          }`}
                        >
                          {n.message}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(n.created_at)}
                        </p>
                      </div>
                    </div>

                    {!n.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(n.id);
                        }}
                      >
                        Mark as read
                      </Button>
                    )}
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

export default Notifications;
