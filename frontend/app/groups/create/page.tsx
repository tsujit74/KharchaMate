"use client";

import { useState } from "react";
import { Users, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

const CreateGroupPage = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:5000/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        throw new Error("Failed to create group");
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFCFD] text-[#1A1A1E] flex items-center justify-center relative overflow-hidden">
      {/* Background Blur */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-50/60  blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-50/60  blur-[100px] -z-10" />

      <div className="w-full max-w-[440px] animate-in fade-in zoom-in duration-500">
        {/* Card */}
        <div className="bg-white shadow-2xl shadow-black/[0.03] border border-gray-100 p-8 md:p-10">
          <h1 className="text-xl font-bold tracking-tight text-center mb-3">
            Create a new group
          </h1>
          <form onSubmit={handleCreate} className="space-y-6">
            {/* Group Name */}
            <div className="space-y-2">
              {error && (
                <p className="text-sm text-red-500 bg-red-50 p-3">{error}</p>
              )}

              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                Group Name
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400 group-focus-within:text-black transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100  text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/5 focus:bg-white focus:border-black transition-all"
                  placeholder="Goa Trip, Flat Expenses, Office Lunch..."
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-bold py-4  shadow-lg shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white  animate-spin" />
              ) : (
                <>
                  Create Group
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateGroupPage;
