"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, UserPlus, ArrowRight } from "lucide-react";

import {
  addMember,
  searchUsers,
  getRecentUsers,
} from "@/app/services/group.service";

import { useAuth } from "@/app/context/authContext";
import toast from "react-hot-toast";

type User = {
  _id: string;
  name: string;
  email: string;
};

export default function AddMemberPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [recent, setRecent] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [pageLoading, setPageLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const [error, setError] = useState("");

  // ✅ Auth check
  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (!groupId) {
      setError("Invalid group");
      return;
    }

    setPageLoading(false);
  }, [loading, isAuthenticated, groupId]);

  // ✅ Fetch recent users
  useEffect(() => {
    if (!groupId) return;

    getRecentUsers()
      .then(setRecent)
      .catch(() => {});
  }, [groupId]);

  // ✅ Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const data = await searchUsers(query);
        setResults(data);
      } catch {
        setResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // ✅ Add member
  const handleAdd = async () => {
    setError("");

    if (!selectedUser && !query.trim()) {
      setError("Select a user or enter email");
      toast.error("Select a user or enter email");
      return;
    }

    try {
      setBtnLoading(true);

      if (selectedUser) {
        await addMember(groupId, { userId: selectedUser._id });
      } else {
        await addMember(groupId, { email: query.trim() });
      }

      toast.success("Member added successfully");

      setSelectedUser(null);
      setQuery("");
      setResults([]);
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        router.replace("/login");
        return;
      }

      setError(err.message || "Failed to add member");
      toast.error(err.message || "Failed to add member");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading || pageLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 shadow">
        <h1 className="text-lg font-bold mb-4 text-center">
          Add Group Member
        </h1>

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        {/* Input */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            value={selectedUser ? selectedUser.email : query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedUser(null);
            }}
            placeholder="Search name or email"
            className="w-full pl-10 py-3 border"
          />
        </div>

        {/* Search Results */}
        {query && !selectedUser && (
          <div className="border mb-4 max-h-40 overflow-y-auto">
            {searchLoading && (
              <p className="p-2 text-sm text-gray-400">Searching...</p>
            )}

            {!searchLoading && results.length === 0 && (
              <p className="p-2 text-sm text-gray-400">No users found</p>
            )}

            {results.map((u) => (
              <div
                key={u._id}
                onClick={() => {
                  setSelectedUser(u);
                  setResults([]);
                }}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                <p className="text-sm font-medium">{u.name}</p>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>
            ))}
          </div>
        )}

        {/* Selected */}
        {selectedUser && (
          <div className="p-3 bg-green-50 mb-4 text-sm">
            Selected: {selectedUser.name}
          </div>
        )}

        {/* Recent Users */}
        {!query && recent.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Recent</p>
            {recent.map((u) => (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {u.name}
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <button
          onClick={handleAdd}
          disabled={btnLoading}
          className="w-full bg-black text-white py-3 flex justify-center items-center gap-2"
        >
          {btnLoading ? "Adding..." : "Add Member"}
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mt-4 text-sm text-gray-500 block mx-auto"
        >
          ← Back
        </button>
      </div>
    </main>
  );
}