"use client";

import { AuthProvider } from "@/app/context/authContext";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{ top: 80 }}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#0f172a",
            color: "#ffffff",
            borderRadius: "14px",
            padding: "12px 16px",
            fontSize: "14px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
          success: {
            style: {
              background: "#065f46",
            },
          },
          error: {
            style: {
              background: "#7f1d1d",
            },
            duration: 4500,
          },
        }}
      />
    </AuthProvider>
  );
}
