"use client";

type Group = {
  _id: string;
  name: string;
  createdBy?: {
    _id?: string;
    name?: string;
    email?: string;
  };
  totalMembers: number;
  totalExpenses: number;
  isBlocked: boolean;
  createdAt: string;
};

type Props = {
  groups: Group[];
  actionLoading: string | null;
  handleBlock: (id: string) => void;
  handleUnblock: (id: string) => void;
  onViewGroup: (id: string) => void; 
};

function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

function formatAmount(value?: number) {
  if (value === undefined || value === null) return "₹0";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

export default function GroupsTable({
  groups,
  actionLoading,
  handleBlock,
  handleUnblock,
  onViewGroup,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500">
              <th className="w-[20%] px-3 py-3 font-semibold">Name</th>
              <th className="w-[22%] px-3 py-3 font-semibold">Creator</th>
              <th className="w-[12%] px-3 py-3 font-semibold">Members</th>
              <th className="w-[14%] px-3 py-3 font-semibold">Expenses</th>
              <th className="w-[12%] px-3 py-3 font-semibold">Status</th>
              <th className="w-[12%] px-3 py-3 font-semibold">Created</th>
              <th className="w-[8%] px-3 py-3 font-semibold text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {groups.map((group) => (
               <tr
                key={group._id}
                className="transition hover:bg-slate-50/80 cursor-pointer"
                onClick={() => onViewGroup(group._id)} // click anywhere on row
              >
                <td className="px-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-950">
                      {group.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      Group ID: {group._id.slice(0, 6)}…{group._id.slice(-4)}
                    </p>
                  </div>
                </td>

                <td className="px-3 py-3 text-slate-600">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">
                      {group.createdBy?.name || "—"}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {group.createdBy?.email || ""}
                    </p>
                  </div>
                </td>

                <td className="px-3 py-3 font-medium text-slate-900">
                  {group.totalMembers}
                </td>

                <td className="px-3 py-3 font-medium text-slate-900">
                  {formatAmount(group.totalExpenses)}
                </td>

                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      group.isBlocked
                        ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                        : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    }`}
                  >
                    <span
                      className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                        group.isBlocked ? "bg-red-500" : "bg-emerald-500"
                      }`}
                    />
                    {group.isBlocked ? "Blocked" : "Active"}
                  </span>
                </td>

                <td className="px-3 py-3 text-slate-600">
                  {formatDate(group.createdAt)}
                </td>

                <td className="px-3 py-3 text-right">
                  <button
                    disabled={actionLoading === group._id}
                    onClick={() =>
                      group.isBlocked
                        ? handleUnblock(group._id)
                        : handleBlock(group._id)
                    }
                    className={`inline-flex min-w-[96px] items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      group.isBlocked
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {actionLoading === group._id
                      ? "Processing..."
                      : group.isBlocked
                      ? "Unblock"
                      : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {groups.length === 0 && (
        <div className="p-10 text-center text-sm text-slate-500">
          No groups found
        </div>
      )}
    </div>
  );
}