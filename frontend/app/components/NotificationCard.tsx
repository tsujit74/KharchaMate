export function NotificationCard({
  notification,
  onClick,
}: {
  notification: any;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-4 transition ${
        notification.isRead
          ? "bg-white"
          : "bg-blue-50 border-blue-200"
      }`}
    >
      <div className="flex justify-between">
        <p className="font-medium">
          {notification.actor?.name ?? "Someone"}{" "}
          {notification.message}
        </p>
        {!notification.isRead && (
          <span className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
        )}
      </div>

      <p className="text-xs text-gray-500 mt-1">
        {new Date(notification.createdAt).toLocaleString()}
      </p>
    </div>
  );
}
