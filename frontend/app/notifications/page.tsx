"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/app/services/notification.service";
import { NotificationCard } from "@/app/components/NotificationCard";
import EmptyState from "../components/EmptyState";
import { useAuth } from "@/app/context/authContext";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const { setUnreadNotifications } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);

      // Sync unread badge on load
      const unread = data.filter((n: any) => !n.isRead).length;
      setUnreadNotifications(unread);
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async (notification: any) => {
    if (!notification.isRead) {
      try {
        await markNotificationAsRead(notification._id);

        // Update local list
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );

        //  Update navbar badge immediately
        setUnreadNotifications((c: number) => Math.max(0, c - 1));
      } catch {
        // optional: toast / silent fail
      }
    }

    if (notification.link) {
      router.push(notification.link);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );

      // Clear navbar badge
      setUnreadNotifications(0);
    } catch {
      // optional error handling
    }
  };

  // Unread first, then latest
  const sortedNotifications = [...notifications].sort((a, b) => {
    if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
    return (
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
    );
  });

  if (loading) return <p className="p-6">Loading notifications...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Notifications</h1>

        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-blue-600 hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {sortedNotifications.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {sortedNotifications.map((n) => (
            <NotificationCard
              key={n._id}
              notification={n}
              onClick={() => handleClick(n)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
