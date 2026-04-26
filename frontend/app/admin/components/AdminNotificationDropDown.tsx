"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAdminNotifications } from "@/app/context/AdminNotificationContext";
import { Bell, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";

type NotificationItem = {
  _id: string;
  title?: string;
  message?: string;
  createdAt?: string;
  isRead?: boolean;
};

export default function AdminNotificationsDropdown() {
  const router = useRouter();
  const { notifications } = useAdminNotifications();

  const latestNotifications = useMemo(
    () => (Array.isArray(notifications) ? notifications.slice(0, 5) : []),
    [notifications]
  );

  const formatDate = (value?: string) => {
    if (!value) return "Just now";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Just now";
    return date.toLocaleString();
  };

  return (
    <div className="w-[min(92vw,24rem)] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-950 text-white">
            <Bell className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-950">Notifications</p>
            <p className="text-xs text-slate-500">
              {latestNotifications.length} recent
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push("/admin/notifications")}
          className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {latestNotifications.length === 0 ? (
          <div className="px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <AlertCircle className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900">
              No notifications
            </p>
            <p className="mt-1 text-xs text-slate-500">
              You’re all caught up for now.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {latestNotifications.map((n: NotificationItem) => {
              const title = n.title?.trim() || "Untitled notification";
              const message = n.message?.trim() || "No details available.";
              const createdAt = formatDate(n.createdAt);

              return (
                <button
                  key={n._id}
                  onClick={() => router.push("/admin/notifications")}
                  className={`w-full px-4 py-4 text-left transition hover:bg-slate-50 ${
                    n.isRead ? "bg-white" : "bg-blue-50/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                        n.isRead
                          ? "bg-slate-100 text-slate-500"
                          : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {n.isRead ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="truncate text-sm font-semibold text-slate-950">
                          {title}
                        </p>
                        {!n.isRead && (
                          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600" />
                        )}
                      </div>

                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {message}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">{createdAt}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}