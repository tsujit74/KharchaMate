"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, Plus, UserPlus } from "lucide-react";

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
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first.");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/groups/my-groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch groups");

        const data = await res.json();
        setGroups(data);
      } catch {
        setError("Failed to load groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your groups...
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <main className="min-h-screen bg-[#FCFCFD] px-6 md:px-16 py-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Groups</h1>
          <p className="text-gray-500 mt-1">Manage and track shared expenses</p>
        </div>

        <Link
          href="/groups/create"
          className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-semibold hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </Link>
      </div>

      {/* Empty State */}
      {groups.length === 0 && (
        <div className="max-w-xl mx-auto text-center bg-white p-10 rounded-2xl border border-gray-100 shadow-sm">
          <Users className="mx-auto w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No groups yet</h3>
          <p className="text-gray-500 mb-6">
            Create a group to start splitting expenses with friends.
          </p>
          <Link
            href="/groups/create"
            className="inline-block px-6 py-3 bg-black text-white rounded-xl font-semibold"
          >
            Create your first group
          </Link>
        </div>
      )}

      {/* Groups Grid */}
      {groups.length > 0 && (
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group._id}
              className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 group"
            >
              {/* Add Member Button */}
              <Link
                href={`/groups/${group._id}/add-member`}
                onClick={(e) => e.stopPropagation()}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black flex items-center justify-center hover:scale-105 transition"
                title="Add member"
              >
                <UserPlus className="text-white w-5 h-5" />
              </Link>

              {/* Card Click Area */}
              <Link href={`/groups/${group._id}`} className="block">
                {/* Group Name */}
                <h2 className="text-lg font-semibold mb-2 truncate">
                  {group.name}
                </h2>

                {/* Members Count */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">
                  <Users className="w-4 h-4" />
                  {group.members.length} members
                </div>

                {/* Member Avatars */}
                <div className="flex -space-x-2">
                  {group.members.slice(0, 4).map((member) => (
                    <div
                      key={member._id}
                      className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-700 border-2 border-white"
                      title={member.email}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                  ))}

                  {group.members.length > 4 && (
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500 border-2 border-white">
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
