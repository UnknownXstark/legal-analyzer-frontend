import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, CheckCircle, AlertCircle, Info, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import AppLayout from "@/layouts/AppLayout";
import { useNavigate } from "react-router-dom";

import { notificationsApi } from "@/api/notifications";
import { formatTimeAgo } from "@/utils/dateFormat";

const Notifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await notificationsApi.getNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to update notification");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to update notifications");
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with your document activity
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate("/notifications/logs")}>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkAllRead}
                className="gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
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
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start justify-between p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                      !notification.is_read
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-background"
                    }`}
                    onClick={() =>
                      !notification.is_read && handleMarkRead(notification.id)
                    }
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {!notification.is_read && (
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse" />
                      )}

                      <div className="w-10 h-10 rounded-lg bg-background border border-border flex items-center justify-center flex-shrink-0">
                        {getIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm ${
                            !notification.is_read
                              ? "font-semibold"
                              : "font-medium"
                          } text-foreground`}
                        >
                          {notification.message}
                        </p>

                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimeAgo(notification.created_at)}
                        </p>
                      </div>
                    </div>

                    {!notification.is_read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkRead(notification.id);
                        }}
                        className="text-xs"
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
