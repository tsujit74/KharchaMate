"use client";

import { useContext } from "react";
import { AuthContext } from "@/app/context/authContext";

export const useAuthHook = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthHook must be used inside AuthProvider");
  return ctx;
};