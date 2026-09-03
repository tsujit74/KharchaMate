"use client";

import { useEffect, useState } from "react";
import { Users, ArrowRight, IndianRupeeIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { createGroup } from "@/app/services/group.service";
import { useAuth } from "@/app/context/authContext";
import toast from "react-hot-toast";

const CreateGroupPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [budget, setBudget] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [loading, isAuthenticated, router]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Group name is required.");
      toast.error("Group name is required.");
      return;
    }

   if (
  budget !== null &&
  (typeof budget !== "number" || budget < 0)
) {
  setError("Budget must be a valid non-negative number");
  toast.error("Budget must be a valid non-negative number");
  return;
}
    try {
      setSubmitting(true);

      await createGroup(name.trim(), budget);

      toast.success("Group created successfully");

      router.push("/dashboard");
    } catch (err: any) {
      switch (err.message) {
        case "UNAUTHORIZED":
          toast.error("Session expired. Please login again.");
          router.replace("/auth");
          break;

        case "INVALID_NAME":
          setError("Please enter a valid group name.");
          toast.error("Please enter a valid group name.");
          break;

        default:
          setError("Failed to create group. Try again.");
          toast.error("Failed to create group. Try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#FCFCFD] flex items-center justify-center relative overflow-hidden">
      {/* Background Blur */}
      <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-50/60 blur-[100px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-purple-50/60 blur-[100px] -z-10" />

      <div className="w-full max-w-[440px]">
        <div className="bg-white shadow-2xl shadow-black/[0.03] border border-gray-100 p-8 md:p-10">
          <h1 className="text-xl font-bold text-center mb-4">
            Create a new group
          </h1>

          <form onSubmit={handleCreate} className="space-y-6">
            {error && (
              <p className="text-sm text-red-500 bg-red-50 p-3 rounded">
                {error}
              </p>
            )}

            {/* Group Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                Group Name
              </label>

              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:bg-white focus:border-black transition"
                  placeholder="Goa Trip, Flat Expenses, Office Lunch..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                Group Budget{" "}
                <span className="text-xs lowercase">(Optional)</span>
              </label>

              <div className="relative">
                <IndianRupeeIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={budget ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    setBudget(value === "" ? null : Number(value));
                  }}
                  className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:bg-white focus:border-black transition"
                  placeholder="50000"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-black text-white font-bold py-4 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Group
                  <ArrowRight className="w-4 h-4" />
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
