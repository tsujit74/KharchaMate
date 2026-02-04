export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
      <p className="text-lg font-semibold">No notifications</p>
      <p className="mt-1 text-sm text-center max-w-xs">
        You will see updates about groups, expenses, and payments here.
      </p>
    </div>
  );
}
