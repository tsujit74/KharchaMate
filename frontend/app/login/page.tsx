"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Chrome,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/authContext";

const LoginPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login({ email, password });

      router.push("/dashboard");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Something went wrong. Please try again.";

      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen bg-[#FCFCFD] flex mx-auto">
      <section className="w-full lg:w-1/2 flex items-center justify-center p-4 relative mx-auto">
        <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-100/40 blur-[120px]" />

        <div className="w-full max-w-[440px]">
          <div className="bg-white border border-gray-100 p-8 md:p-10">
            <h1 className="text-2xl font-bold text-center">Welcome back</h1>

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 ml-1">
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Password
                  </label>
                  <a className="text-xs font-bold hover:underline cursor-pointer">
                    Forgot?
                  </a>
                </div>

                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-4 bg-gray-50 border border-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}

              {/* Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 font-bold flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-4 text-center text-xs text-gray-400 uppercase">
              Or continue with
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-4">
              <button className="border py-3 flex justify-center gap-2 font-semibold text-sm">
                <Chrome className="w-4 h-4" /> Google
              </button>
              <button className="border py-3 flex justify-center gap-2 font-semibold text-sm">
                <Github className="w-4 h-4" /> Github
              </button>
            </div>
          </div>

          <p className="text-center mt-4 text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="font-bold text-black hover:underline">
              Create one
            </a>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
