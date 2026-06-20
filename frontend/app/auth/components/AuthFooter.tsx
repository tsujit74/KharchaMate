"use client";

import React from "react";
import { AuthMode } from "../types/auth";
import Link from "next/link";

const AuthFooter: React.FC<{ mode: AuthMode }> = ({ mode }) => {
  return (
    <p className="text-center mt-6 text-sm text-gray-600">
      {mode === "login" 
        ? "Don't have an account? " 
        : "Already have an account? "}
      <Link
        href={mode === "login" ? "/signup" : "/login"}
        className="font-semibold text-black hover:text-gray-700 hover:underline transition-colors duration-200"
      >
        {mode === "login" ? "Sign up" : "Login"}
      </Link>
    </p>
  );
};

export default AuthFooter;