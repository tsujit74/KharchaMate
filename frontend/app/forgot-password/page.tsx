"use client";

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { forgotPassword } from "@/app/services/auth.service";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      await forgotPassword(email);
      toast.success("Reset link sent to your email.");
      setEmail("");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFCFD] flex items-center justify-center p-4">
      <div className="bg-white border border-gray-100 p-8 w-full max-w-[440px]">
        <h1 className="text-2xl font-bold text-center mb-6">
          Forgot Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 font-bold flex items-center justify-center gap-2"
          >
            {loading ? "Sending..." : <>Send Link <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </main>
  );
}