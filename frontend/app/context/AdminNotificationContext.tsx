"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { getAdminNotifications } from "@/app/services/admin.service";

type Notification = {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type ContextType = {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

const AdminNotificationContext = createContext<ContextType | null>(null);

export const useAdminNotifications = () => {
  const context = useContext(AdminNotificationContext);

  if (!context) {
    throw new Error("useAdminNotifications must be used inside provider");
  }

  return context;
};

export function AdminNotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getAdminNotifications();
        if (Array.isArray(data)) {
          setNotifications(data);
        }
      } catch {}
    };

    loadNotifications();
  }, []);

  return (
    <AdminNotificationContext.Provider
      value={{ notifications, setNotifications }}
    >
      {children}
    </AdminNotificationContext.Provider>
  );
}