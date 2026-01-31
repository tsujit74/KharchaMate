"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Mail, UserPlus, ArrowRight } from "lucide-react";

import { addMember } from "@/app/services/group.service";
import { useAuth } from "@/app/context/authContext";

export default function AddMemberPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [pageLoading, setPageLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      setBtnLoading(true);
      await addMember(groupId, email.trim());
      setSuccess("Member added successfully");
      setEmail("");
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        router.replace("/login");
        return;
      }
      if (err.message === "FORBIDDEN") {
        setError("You are not allowed to add members.");
        return;
      }
      setError("Failed to add member. Try again.");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading || pageLoading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  return (
    <main className="min-h-screen bg-[#FCFCFD] flex items-center justify-center px-4">
      <div className="w-full max-w-[420px] animate-in fade-in zoom-in duration-500">
        <div className="bg-white border border-gray-100 shadow-xl shadow-black/[0.03] p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold">Add Group Member</h1>
            <p className="text-sm text-gray-500">
              Invite someone to this group
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleAddMember} className="space-y-5">
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 text-center">
                {error}
              </p>
            )}
            {success && (
              <p className="text-sm text-green-600 bg-green-50 p-3 text-center">
                {success}
              </p>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                placeholder="friend@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:bg-white focus:border-black transition"
              />
            </div>

            <button
              type="submit"
              disabled={btnLoading}
              className="w-full bg-black text-white font-bold py-4 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-70"
            >
              {btnLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <>
                  Add Member
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <button
            onClick={() => router.back()}
            className="mt-6 text-sm text-gray-500 hover:underline block mx-auto"
          >
            ← Back to group
          </button>
        </div>
      </div>
    </main>
  );
}
