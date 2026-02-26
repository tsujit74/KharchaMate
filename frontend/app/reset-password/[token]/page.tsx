"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { resetPassword } from "@/app/services/auth.service";
import toast from "react-hot-toast";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200 shadow-x p-8 w-full max-w-[440px]">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-black text-white p-3 rounded-xl shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-center mb-2 tracking-tight">
          Reset Password
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          Create a new secure password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200git a text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-900 text-white py-4git a font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Update Password
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          Secure reset powered by KharchaMate
        </p>

      </div>
    </main>
  );
}