"use client";

import React from "react";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
};

type Props = {
  users: User[];
  actionLoading: string | null;
  handleBlock: (id: string) => void;
  handleUnblock: (id: string) => void;
};

function UsersTable({
  users,
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
              <th className="p-4 text-left font-semibold">User</th>
              <th className="p-4 text-left font-semibold">Role</th>
              <th className="p-4 text-left font-semibold">Status</th>
              <th className="p-4 text-left font-semibold">Joined</th>
              <th className="p-4 text-left font-semibold">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user._id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-900">
                      {user.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user.email}
                    </span>
                  </div>
                </td>

                <td className="p-4">
                  <span className="px-2.5 py-1 text-xs rounded-md bg-gray-100 text-gray-700 capitalize font-medium">
                    {user.role}
                  </span>
                </td>

                <td className="p-4">
                  {user.isBlocked ? (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-50 text-red-600 border border-red-200">
                      ● Blocked
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-50 text-green-600 border border-green-200">
                      ● Active
                    </span>
                  )}
                </td>

                <td className="p-4 text-gray-600">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>

                <td className="p-4">
                  <button
                    disabled={actionLoading === user._id}
                    onClick={() =>
                      user.isBlocked
                        ? handleUnblock(user._id)
                        : handleBlock(user._id)
                    }
                    className={`min-w-[110px] px-4 py-1.5 text-xs font-semibold text-white transition disabled:opacity-60
                    ${
                      user.isBlocked
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-red-600 hover:bg-red-700"
                    }`}
                  >
                    {actionLoading === user._id
                      ? "Processing..."
                      : user.isBlocked
                      ? "Unblock"
                      : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="p-10 text-center text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
}

export default React.memo(UsersTable);