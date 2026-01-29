"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, UserPlus } from "lucide-react";
import { formatDateTime } from "@/app/utils/formatDateTime";
import { getMyGroups } from "../services/group.service";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";

type Member = {
  _id: string;
  name: string;
  email: string;
};

type Group = {
  _id: string;
  name: string;
  createdBy: string;
  members: Member[];
  createdAt: string;
  updatedAt: string;
};

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupLoading, setGroupLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push("/login")
      setGroupLoading(false);
      return;
    }

    const fetchGroups = async () => {
      try {
        const data = await getMyGroups();
        const sortedGroups = data.sort(
          (
            a: { updatedAt: string | number | Date },
            b: { updatedAt: string | number | Date },
          ) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
        setGroups(sortedGroups);
      } catch (err) {
        setError("Failed to load groups.");
      } finally {
        setGroupLoading(false);
      }
    };

    fetchGroups();
  }, [loading, isAuthenticated]);

  if (loading || groupLoading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 md:px-16 py-8">
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Your Groups</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track shared expenses
          </p>
        </div>

        <Link
          href="/groups/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition"
        >
          <Plus className="w-4 h-4" />
          New group
        </Link>
      </div>

      {/* Empty State */}
      {groups.length === 0 && (
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-xl border border-gray-200">
          <Users className="mx-auto w-10 h-10 text-gray-300 mb-4" />
          <h3 className="text-base font-semibold mb-1 text-gray-900">
            No groups yet
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Create a group to start splitting expenses.
          </p>
          <Link
            href="/groups/create"
            className="inline-flex px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium"
          >
            Create group
          </Link>
        </div>
      )}

      {/* Groups Grid */}
      {groups.length > 0 && (
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group) => (
            <div
              key={group._id}
              className="relative bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition"
            >
              {/* Add Member */}
              <Link
                href={`/groups/${group._id}/add-member`}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-4 right-4 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                title="Add member"
              >
                <UserPlus className="w-4 h-4 text-gray-600" />
              </Link>

              <Link href={`/groups/${group._id}`} className="block">
                <h2 className="text-base font-semibold text-gray-900 truncate mb-1">
                  {group.name}
                </h2>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                  <Users className="w-4 h-4" />
                  {group.members.length} members
                </div>

                {/* formatted date */}
                <p className="text-xs text-gray-400 mb-4">
                  Updated {formatDateTime(group.updatedAt).dateLabel}
                </p>

                <div className="flex -space-x-2">
                  {group.members.slice(0, 4).map((member) => (
                    <div
                      key={member._id}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-700 border border-white"
                      title={member.email}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  ))}

                  {group.members.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-xs font-semibold text-gray-500 border border-white">
                      +{group.members.length - 4}
                    </div>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
