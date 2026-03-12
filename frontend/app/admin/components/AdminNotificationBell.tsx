"use client";

import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAdminUnreadCount,
} from "@/app/services/admin.service";
import AdminNotificationsDropdown from "@/app/admin/components/AdminNotificationDropDown";

export default function AdminNotificationBell() {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchUnread = async () => {
      const c = await getAdminUnreadCount();
      setCount(c);
    };

    fetchUnread();
  }, []);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded hover:bg-gray-100"
      >
        <Bell className="w-5 h-5 text-gray-700" />

        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <AdminNotificationsDropdown />
        </div>
      )}
    </div>
  );
}