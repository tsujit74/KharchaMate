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
  const formatDate = (value: string) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {announcements.length > 0 ? (
              announcements.map((a) => (
                <tr key={a._id} className="transition hover:bg-slate-50/80">
                  <td className="px-4 py-4">
                    <p className="font-semibold text-slate-950">{a.title}</p>
                  </td>

                  <td className="max-w-[420px] px-4 py-4 text-slate-600">
                    <p className="line-clamp-2">{a.message}</p>
                  </td>

                  <td className="px-4 py-4 text-slate-500">
                    {formatDate(a.createdAt)}
                  </td>

                  <td className="px-4 py-4">
                    {a.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
                        Disabled
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        disabled={actionLoading === a._id}
                        onClick={() => handleToggle(a._id)}
                        className="inline-flex items-center rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {a.isActive ? "Disable" : "Enable"}
                      </button>

                      <button
                        disabled={actionLoading === a._id}
                        onClick={() => handleDelete(a._id)}
                        className="inline-flex items-center rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-14 text-center">
                  <div className="mx-auto max-w-sm">
                    <p className="text-sm font-medium text-slate-700">
                      No announcements found
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Create one to display important updates to users.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}