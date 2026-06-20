"use client";

import React from "react";
import { AuthMode } from "../types/auth";

const AuthToggle: React.FC<{
  mode: AuthMode;
  onToggle: (mode: AuthMode) => void;
}> = ({ mode, onToggle }) => {
  return (
    <div className="flex justify-center mb-5">
      <div className="flex border border-gray-200 rounded-xl p-1 bg-white shadow-sm">
        <button
          onClick={() => onToggle("login")}
          className={`px-8 py-2 rounded-lg font-semibold transition-all duration-300 ${
            mode === "login"
              ? "bg-black text-white shadow-md"
              : "text-gray-600 hover:text-black hover:bg-gray-50"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => onToggle("signup")}
          className={`px-8 py-2 rounded-lg font-semibold transition-all duration-300 ${
            mode === "signup"
              ? "bg-black text-white shadow-md"
              : "text-gray-600 hover:text-black hover:bg-gray-50"
          }`}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default AuthToggle;