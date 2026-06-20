"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  User2Icon,
  Smartphone,
} from "lucide-react";
import { AuthMode, LoginData, SignupData } from "../types/auth";
import { useAuthHook } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { registerUser } from "@/app/services/auth.service";

const AuthForm: React.FC<{ mode: AuthMode }> = ({ mode }) => {
  const router = useRouter();
  const { login, isAuthenticated, loading, user } = useAuthHook();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace(user?.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [loading, isAuthenticated, router, user]);

  // VALIDATION
  const validateLogin = () => {
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format";
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Minimum 6 characters required";
    return "";
  };

  const validateSignup = () => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Invalid email format";
    if (!password.trim()) return "Password is required";
    if (password.length < 6) return "Minimum 6 characters required";
    if (mobile && !/^[0-9]{10}$/.test(mobile)) return "Invalid mobile number (10 digits)";
    return "";
  };

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const errMsg = validateLogin();
    if (errMsg) {
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setError("");

    try {
      const loginData: LoginData = { email, password };
      await login(loginData);
      toast.success("Welcome back! 🎉");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Login failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  // SIGNUP
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const errMsg = validateSignup();
    if (errMsg) {
      setError(errMsg);
      toast.error(errMsg);
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);
    setError("");

    try {
      const signupData: SignupData = { name, email, password, mobile };
      await registerUser(signupData);
      toast.success("Account created successfully! 🎉");
      router.push("/login");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Signup failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <form
      onSubmit={mode === "login" ? handleLogin : handleSignup}
      className="space-y-5"
      noValidate
    >
      {/* SIGNUP ONLY*/}
      {mode === "signup" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* NAME */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 mb-2 ml-1">
              Name
            </label>
            <div className="relative">
              <User2Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 pr-3 py-3.5 bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="Full name"
              />
            </div>
          </div>

          {/* MOBILE */}
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 mb-2 ml-1">
              Mobile <span className="text-gray-400">(Optional)</span>
            </label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setError("");
                }}
                className="w-full pl-10 pr-3 py-3.5 bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>
        </div>
      )}

      {/* ROW 2 - EMAIL + PASSWORD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* EMAIL */}
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 mb-2 ml-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="w-full pl-10 pr-3 py-3.5 bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
              placeholder="name@example.com"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 mb-2 ml-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full pl-10 pr-12 py-3.5 bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 hover:border-gray-400"
              placeholder="Min 6 characters"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {mode === "login" && (
            <div className="text-right mt-2">
              <Link
                href="/forgot-password"
                className="text-sm text-black hover:text-gray-700 hover:underline transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500 font-medium bg-red-50 border border-red-200 rounded-lg p-3">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 011.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="w-full bg-black text-white py-4 font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20"
      >
        {isLoading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <span>Processing...</span>
          </>
        ) : (
          <>
            {mode === "login" ? "Sign In" : "Sign Up"}
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
};

export default AuthForm;