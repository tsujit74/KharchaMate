"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Github,
  Chrome,
  User2Icon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/authContext";
import { registerUser } from "../services/auth.service";

const SignupPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  const validate = () => {
    if (!name.trim()) return "Name is required";
    if (!email.trim()) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email))
      return "Please enter a valid email";
    if (!password.trim()) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters";
    return "";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await registerUser({ name, email, password });
      router.push("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return null;

  return (
    <main className="min-h-screen bg-[#FCFCFD] flex mx-auto">
      <section className="w-full lg:w-1/2 flex items-center justify-center p-4 relative mx-auto">
        <div className="w-full max-w-[440px]">
          <div className="bg-white border border-gray-100 p-8 md:p-10">
            <h1 className="text-xl font-bold text-center mb-6">
              Create Account
            </h1>

            <form onSubmit={handleSignup} noValidate className="space-y-5">
              {/* Name */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 ml-1">
                  Name
                </label>
                <div className="relative mt-2">
                  <User2Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="Full name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 ml-1">
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-400 ml-1">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-11 pr-12 py-4 bg-gray-50 border text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
                    placeholder="Password"
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

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-4 font-bold flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <span className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    Sign Up <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="my-4 text-center text-xs text-gray-400 uppercase">
              Or continue with
            </div>

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
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-black hover:underline">
              Login
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignupPage;
