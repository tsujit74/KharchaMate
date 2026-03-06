"use client";

type Announcement = {
  _id: string;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string;
};

type Props = {
  announcements: Announcement[];
  actionLoading: string | null;
  handleToggle: (id: string) => void;
  handleDelete: (id: string) => void;
};

export default function AnnouncementTable({
  announcements,
  actionLoading,
  handleToggle,
  handleDelete,
}: Props) {
  return (
    <div className="bg-white border overflow-hidden">

      <div className="overflow-x-auto">

        <table className="min-w-full text-sm">

          <thead className="bg-gray-100/70">
            <tr className="text-gray-600">
              <th className="p-4 text-left font-semibold">Title</th>
              <th className="p-4 text-left font-semibold">Message</th>
              <th className="p-4 text-left font-semibold">Created</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {announcements.map((a) => (
              <tr
                key={a._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-semibold">
                  {a.title}
                </td>

                <td className="p-4 text-gray-600 max-w-sm truncate">
                  {a.message}
                </td>

                <td className="p-4 text-gray-500">
                  {new Date(a.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  {a.isActive ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                      ● Active
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600 border">
                      ● Disabled
                    </span>
                  )}
                </td>

                <td className="p-4 flex gap-2">

                  <button
                    disabled={actionLoading === a._id}
                    onClick={() => handleToggle(a._id)}
                    className="px-3 py-1 text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {a.isActive ? "Disable" : "Enable"}
                  </button>

                  <button
                    disabled={actionLoading === a._id}
                    onClick={() => handleDelete(a._id)}
                    className="px-3 py-1 text-xs font-semibold bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {announcements.length === 0 && (
        <div className="p-10 text-center text-gray-500">
          No announcements
        </div>
      )}

    </div>
  );
}