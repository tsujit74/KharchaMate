"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import AdminNotificationsDropdown from "@/app/admin/components/AdminNotificationDropDown";
import { useAdminNotifications } from "@/app/context/AdminNotificationContext";

export default function AdminNotificationBell() {
  const [open, setOpen] = useState(false);

  const { notifications } = useAdminNotifications();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded hover:bg-gray-100 transition"
      >
        <Bell className="w-5 h-5 text-gray-700" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 z-50 w-80">
          <AdminNotificationsDropdown />
        </div>
      )}
    </div>
  );
}
