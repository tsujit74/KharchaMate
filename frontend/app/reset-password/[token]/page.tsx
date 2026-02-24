"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/services/auth.service";
import toast from "react-hot-toast";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return toast.error("Password required");

    try {
      setLoading(true);
      await resetPassword(token as string, password);
      toast.success("Password updated successfully.");
      router.push("/login");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Invalid or expired token"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFCFD] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-100 p-8 w-full max-w-[440px]">
        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full px-4 py-4 bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 font-bold"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}