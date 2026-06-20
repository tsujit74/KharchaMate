"use client";

import React from "react";
import { Chrome, Github } from "lucide-react";
import toast from "react-hot-toast";

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    toast("Google authentication will be available soon.", {
      icon: "🚀",
      position: "top-center",
    });
  };

  const handleGithubLogin = () => {
    toast("GitHub authentication will be available soon.", {
      icon: "🚀",
      position: "top-center",
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 mt-6">
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20"
      >
        <Chrome className="h-5 w-5" />
        Google
      </button>

      <button
        type="button"
        onClick={handleGithubLogin}
        className="flex items-center justify-center gap-3 rounded-xl border border-gray-200 py-3.5 text-sm font-semibold transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-20"
      >
        <Github className="h-5 w-5" />
        GitHub
      </button>
    </div>
  );
};

export default SocialLogin;
