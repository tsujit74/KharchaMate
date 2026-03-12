"use client";

import { useEffect, useState } from "react";
import { getAdminNotifications } from "@/app/services/admin.service";

export default function AdminNotificationsDropdown() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getAdminNotifications();

      setNotifications(Array.isArray(data) ? data : []);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg p-3">
      {notifications.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications</p>
      ) : (
        notifications.map((n) => (
          <div key={n._id} className="border-b py-2 text-sm">
            <p className="font-medium">{n.title}</p>
            <p className="text-gray-500">{n.message}</p>
            <p className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}