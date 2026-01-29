"use client";

import { AuthProvider } from "@/app/context/authContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
