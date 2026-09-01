"use client";

import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { markNotificationAsRead } from "@/app/services/notification.service";

export type Notification = {
  _id: string;
  title: string;
  message: string;
  actor?: {
    _id: string;
    name: string;
    email: string;
  };
  groupName?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
};

type Props = {
  notification: Notification;
  onClick?: () => void;
};

export function NotificationCard({ notification, onClick }: Props) {
  const router = useRouter();

  const handleClick = async () => {
    try {
      if (!notification.isRead) {
        await markNotificationAsRead(notification._id);
      }

      onClick?.();

      if (notification.link) {
        router.push(notification.link);
      }
    } catch {
      onClick?.();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="
        group
        w-[360px]
        max-w-[calc(100vw-24px)]
        cursor-pointer
        rounded-2xl
        border border-gray-200
        bg-white
        p-4
        shadow-[0_8px_30px_rgba(0,0,0,0.08)]
        transition-all duration-200
        hover:border-gray-300
        hover:shadow-[0_12px_35px_rgba(0,0,0,0.12)]
      "
    >
      <div className="flex items-start gap-3">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-600">
          <Bell size={17} strokeWidth={1.8} />
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-semibold text-gray-900">
              {notification.title}
            </p>

            {!notification.isRead && (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
            )}
          </div>

          <p className="mt-1 text-sm leading-5 text-gray-600">
            {notification.actor?.name && (
              <span className="font-medium text-gray-900">
                {notification.actor.name}
              </span>
            )}{" "}
            {notification.message}
          </p>

          {notification.groupName && (
            <div className="mt-2">
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-[11px] font-medium text-gray-500 ring-1 ring-inset ring-gray-200">
                {notification.groupName}
              </span>
            </div>
          )}

          <p className="mt-2.5 text-[11px] font-medium text-gray-400">
            Just now
          </p>

        </div>
      </div>
    </div>
  );
}