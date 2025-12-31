"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Mail, UserPlus, ArrowRight } from "lucide-react";

export default function AddMemberPage() {
  const { groupId } = useParams();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/groups/add-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          groupId,
          email,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add member");
      }

      setSuccess("Member added successfully");
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FCFCFD] px-4">
      <div className="w-full max-w-md bg-white border border-gray-100 p-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Add Group Member</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleAddMember} className="space-y-4">
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
          {success && (
            <p className="text-sm text-green-600 text-center">{success}</p>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              required
              placeholder="friend@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100  text-sm focus:outline-none focus:border-black focus:bg-white transition"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-4  font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-70"
          >
            {loading ? "Adding..." : "Add Member"}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Back */}
        <button
          onClick={() => router.back()}
          className="mt-6 text-sm text-gray-500 hover:underline block mx-auto"
        >
          ← Back to group
        </button>
      </div>
    </main>
  );
}
