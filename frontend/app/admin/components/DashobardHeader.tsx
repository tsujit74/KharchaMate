"use client";

import AdminNotificationBell from "./AdminNotificationBell";

type Props = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};

export default function DashboardHeader({
  title,
  subtitle,
  action,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-4">
      
      {/* Title Section */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}

        
      </div>

      <AdminNotificationBell />

      {/* Optional Action Button */}
      {action && <div>{action}</div>}
      
    </div>
  );
}