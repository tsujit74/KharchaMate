"use client";

import React from "react";
import { AuthMode } from "../types/auth";

const AuthHeader: React.FC<{ mode: AuthMode }> = ({ mode }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-center text-gray-900">
        {mode === "login" ? "Welcome Back" : "Create Account"}
      </h1>
      <p className="text-center text-gray-500 text-base mt-2">
        {mode === "login" 
          ? "Login to your account" 
          : "Join KharchaMate to track expenses"}
      </p>
    </div>
  );
};

export default AuthHeader;