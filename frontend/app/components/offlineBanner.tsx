"use client";

import { useOnlineStatus } from "../hooks/useOnlineStatus";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-yellow-100 text-yellow-800 text-center py-2 text-sm fixed top-0 left-0 right-0 z-50">
      You are offline. Read-only mode enabled.
    </div>
  );
}
