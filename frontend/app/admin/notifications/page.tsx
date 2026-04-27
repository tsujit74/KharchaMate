"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DashboardHeader from "../components/DashobardHeader";
import { useAdminNotifications } from "@/app/context/AdminNotificationContext";
import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
} from "@/app/services/admin.service";
import { Bell, CheckCheck, Loader2 } from "lucide-react";

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
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      const data = await getAdminNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      toast.error(err?.message?.replaceAll("_", " ") || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const formatDate = (value: string) =>
    new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const handleMarkRead = async (id: string) => {
    try {
      setActionLoading(id);
      await markAdminNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err: any) {
      toast.error(err?.message?.replaceAll("_", " ") || "Failed to update notification");
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAll = async () => {
    try {
      setMarkingAll(true);
      await markAllAdminNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err?.message?.replaceAll("_", " ") || "Failed to update notifications");
    } finally {
      setMarkingAll(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm">
          Loading notifications...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-3 py-3 md:px-4 md:py-4">
      <div className="mx-auto max-w-[1400px] space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <DashboardHeader
            title="Notifications"
            subtitle="Track system updates and admin alerts"
          />

          <button
            onClick={handleMarkAll}
            disabled={markingAll || unreadCount === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {markingAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCheck className="h-4 w-4" />
            )}
            Mark all as read
            {unreadCount > 0 && (
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Bell className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">
              No notifications found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              New alerts and updates will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <div
                  key={n._id}
                  className={`flex flex-col gap-3 p-4 md:flex-row md:items-start md:justify-between ${
                    n.isRead ? "bg-white" : "bg-sky-50/60"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-950">{n.title}</p>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          n.isRead
                            ? "bg-slate-100 text-slate-600"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        {n.type}
                      </span>
                    </div>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {n.message}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {formatDate(n.createdAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkRead(n._id)}
                        disabled={actionLoading === n._id}
                        className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {actionLoading === n._id ? "Marking..." : "Mark read"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}