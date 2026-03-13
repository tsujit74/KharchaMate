"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from "@/app/services/admin.service";
import DashboardHeader from "../components/DashobardHeader";
import { useAdminNotifications } from "@/app/context/AdminNotificationContext";

type Notification = {
  _id: string;
  title: string;
  message: string;
  type: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
};

export default function AdminNotificationsPage() {
 const { notifications, setNotifications } = useAdminNotifications();
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await getAdminNotifications();

      if (Array.isArray(data)) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    } catch (err: any) {
      toast.error(err.message.replaceAll("_", " "));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await markAdminNotificationRead(id);

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err: any) {
      toast.error(err.message.replaceAll("_", " "));
    }
  };

  const handleMarkAll = async () => {
    try {
      setMarkingAll(true);

      await markAllAdminNotificationsRead();

      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );

      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err.message.replaceAll("_", " "));
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-sm text-gray-500">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <DashboardHeader title="Notifiactions"/>

        <button
          onClick={handleMarkAll}
          disabled={markingAll}
          className="text-sm bg-black text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="text-sm text-gray-500">
          No notifications found
        </div>
      )}

      {/* Notification List */}
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n._id}
            className={`p-4 rounded-lg border text-sm flex justify-between gap-4 ${
              n.isRead
                ? "bg-white border-gray-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div>
              <p className="font-medium text-gray-900">
                {n.title}
              </p>

              <p className="text-gray-600">
                {n.message}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>

            {!n.isRead && (
              <button
                onClick={() => handleMarkRead(n._id)}
                className="text-xs text-blue-600 hover:underline"
              >
                Mark read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}