"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "@/app/services/auth.service";
import toast from "react-hot-toast";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await getMe();
        const user = res.data?.user;

        if (!user || user.role !== "admin") {
          toast.error("Access denied. Admin only.");
          router.replace("/dashboard");
          return;
        }
      } catch (err) {
        toast.error("Please login to continue.");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Checking access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm px-8 py-4">
        <h1 className="font-bold text-lg">KharchaMate Admin</h1>
      </div>

      <div className="max-w-7xl mx-auto py-8 px-6">
        {children}
      </div>
    </div>
  );
}