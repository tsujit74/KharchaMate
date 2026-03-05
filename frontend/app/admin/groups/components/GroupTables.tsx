"use client";

type Group = {
  _id: string;
  name: string;
  createdBy?: { name: string };
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
};

export default function GroupsTable({
  groups,
  actionLoading,
  handleBlock,
  handleUnblock,
}: Props) {
  return (
    <div className="bg-white border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100/70">
            <tr className="text-gray-600">
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Creator</th>
              <th className="p-4 text-left font-semibold">Members</th>
              <th className="p-4 text-left font-semibold">Expenses</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {groups.map((group) => (
              <tr
                key={group._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="p-4 font-semibold">
                  {group.name}
                </td>

                <td className="p-4 text-gray-600">
                  {group.createdBy?.name || "—"}
                </td>

                <td className="p-4">{group.totalMembers}</td>

                <td className="p-4">{group.totalExpenses}</td>

                <td className="p-4">
                  {group.isBlocked ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">
                      ● Blocked
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                      ● Active
                    </span>
                  )}
                </td>

                <td className="p-4">
                  <button
                    disabled={actionLoading === group._id}
                    onClick={() =>
                      group.isBlocked
                        ? handleUnblock(group._id)
                        : handleBlock(group._id)
                    }
                    className={`min-w-[120px] px-4 py-1.5 text-xs font-semibold text-white transition
                    ${
                      group.isBlocked
                        ? "bg-green-600 hover:bg-green-700"
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
        <div className="p-10 text-center text-gray-500">
          No groups found
        </div>
      )}
    </div>
  );
}