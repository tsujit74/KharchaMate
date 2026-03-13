"use client";

import { useRouter } from "next/navigation";
import { useAdminNotifications } from "@/app/context/AdminNotificationContext";

export default function AdminNotificationsDropdown() {
  const router = useRouter();
  const { notifications } = useAdminNotifications();

  const latestNotifications = notifications.slice(0, 5);

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg border border-gray-200 p-3">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-sm font-semibold text-gray-900">
          Notifications
        </p>

        <button
          onClick={() => router.push("/admin/notifications")}
          className="text-xs text-blue-600 hover:underline"
        >
          View All
        </button>
      </div>

      {latestNotifications.length === 0 && (
        <p className="text-sm text-gray-500">
          No notifications
        </p>
      )}

      <div className="max-h-80 overflow-y-auto">
        {latestNotifications.map((n) => (
          <div
            key={n._id}
            className={`border-b py-2 text-sm ${
              n.isRead ? "" : "bg-blue-50"
            }`}
          >
            <p className="font-medium text-gray-900">{n.title}</p>

            <p className="text-gray-600">{n.message}</p>

            <p className="text-xs text-gray-400 mt-1">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}