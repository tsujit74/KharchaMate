"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/app/services/notification.service";
import EmptyState from "../components/EmptyState";
import { useAuth } from "@/app/context/authContext";
import clsx from "clsx";

type Notification = {
  _id: string;
  title: string;
  message: string;
  groupName?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);

  // Swipe state
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  const router = useRouter();
  const { setUnreadNotifications } = useAuth();

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* ---------------- FETCH ---------------- */
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data);

      setUnreadNotifications(
        data.filter((n: Notification) => !n.isRead).length
      );
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CLICK ---------------- */
  const handleClick = async (n: Notification) => {
    if (!n.isRead) {
      await markNotificationAsRead(n._id);

      setNotifications((prev) =>
        prev.map((x) =>
          x._id === n._id ? { ...x, isRead: true } : x
        )
      );

      setUnreadNotifications((c: number) => Math.max(0, c - 1));
    }

    if (n.link) router.push(n.link);
  };

  /* ---------------- BULK ---------------- */
  const toggleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const markSelectedRead = async () => {
    await Promise.all(
      selected.map((id) => markNotificationAsRead(id))
    );

    setNotifications((prev) =>
      prev.map((n) =>
        selected.includes(n._id)
          ? { ...n, isRead: true }
          : n
      )
    );

    setUnreadNotifications((c: number) =>
      Math.max(0, c - selected.length)
    );

    setSelected([]);
    setBulkMode(false);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();

    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );

    setUnreadNotifications(0);
  };

  /* ---------------- SWIPE (MOBILE) ---------------- */
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = async (n: Notification) => {
    if (
      touchStartX === null ||
      touchEndX === null ||
      n.isRead ||
      bulkMode
    )
      return;

    const swipeDistance = touchEndX - touchStartX;

    // Swipe right → mark read
    if (swipeDistance > 60) {
      await markNotificationAsRead(n._id);

      setNotifications((prev) =>
        prev.map((x) =>
          x._id === n._id ? { ...x, isRead: true } : x
        )
      );

      setUnreadNotifications((c: number) =>
        Math.max(0, c - 1)
      );
    }
  };

  /* ---------------- SORT + GROUP ---------------- */
  const grouped = notifications
    .sort((a, b) => {
      if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    })
    .reduce((acc: Record<string, Notification[]>, n) => {
      const date = new Date(n.createdAt).toDateString();
      acc[date] = acc[date] || [];
      acc[date].push(n);
      return acc;
    }, {});

  /* ---------------- STATES ---------------- */
  if (loading)
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-sm text-gray-500">
        Loading notifications…
      </div>
    );

  if (error)
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 text-sm text-red-600">
        {error}
      </div>
    );

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Notifications
          </h1>
          <p className="text-sm text-gray-500">
            Updates from your groups & expenses
          </p>
        </div>

        {bulkMode ? (
          <button
            onClick={markSelectedRead}
            className="text-sm text-blue-600"
          >
            Mark read
          </button>
        ) : notifications.some((n) => !n.isRead) ? (
          <button
            onClick={() => setBulkMode(true)}
            className="text-sm text-gray-500"
          >
            Select
          </button>
        ) : null}
      </div>

      {notifications.length === 0 ? (
        <EmptyState />
      ) : (
        Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="mb-4">
            {/* Date barrier */}
            <div className="flex items-center gap-2 my-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400">
                {date}
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-2">
              {items.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !bulkMode && handleClick(n)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={() => handleTouchEnd(n)}
                  className={clsx(
                    "border rounded-lg p-3 sm:p-4 cursor-pointer transition",
                    !n.isRead &&
                      "bg-blue-50 border-blue-200",
                    n.isRead && "bg-white"
                  )}
                >
                  <div className="flex gap-3 items-start">
                    {bulkMode && (
                      <input
                        type="checkbox"
                        checked={selected.includes(n._id)}
                        onChange={() => toggleSelect(n._id)}
                        className="mt-1"
                      />
                    )}

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm sm:text-base">
                          {n.title}
                        </p>
                        {!n.isRead && (
                          <span className="h-2 w-2 rounded-full bg-blue-600 mt-1" />
                        )}
                      </div>

                      <p className="text-sm text-gray-600">
                        {n.message}
                      </p>

                      {n.groupName && (
                        <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {n.groupName}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {!bulkMode &&
        notifications.some((n) => !n.isRead) && (
          <div className="mt-6 text-center">
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          </div>
        )}
    </div>
  );
}
