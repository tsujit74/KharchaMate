"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "../context/authContext";
import { useDashboardData } from "./hooks/useDashboardData";

import AppSkeleton from "../components/ui/AppSkeleton";
import Announcements from "./components/Announcements";
import DashboardContent from "./components/DashboardContent";
import EditGroupNameModal from "../components/Groups/EditGroupNameModal";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  const dashboard = useDashboardData(isAuthenticated, loading);

  const [editGroupId, setEditGroupId] = useState<string | null>(null);
  const [editGroupName, setEditGroupName] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Loading state
  if (loading || dashboard.groupLoading) {
    return <AppSkeleton variant="dashboard" />;
  }

  if (!isAuthenticated) {
    return <AppSkeleton variant="dashboard" />;
  }

  // Error state
  if (dashboard.error) {
    return (
      <p className="p-10 text-center text-red-500 font-medium">
        {dashboard.error}
      </p>
    );
  }

  const firstName = user?.name?.split(" ")[0] || "User";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 sm:px-6 lg:px-10 py-5 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <Announcements />

        <DashboardContent
          userId={user?.id}
          firstName={firstName}
          groups={dashboard.groups}
          recentExpenses={dashboard.recentExpenses}
          pendingSettlements={dashboard.pendingSettlements}
          recentLoading={dashboard.recentLoading}
          pendingLoading={dashboard.pendingLoading}
          setEditGroupId={setEditGroupId}
          setEditGroupName={setEditGroupName}
        />
      </div>

      <EditGroupNameModal
        isOpen={!!editGroupId}
        groupId={editGroupId || ""}
        currentName={editGroupName}
        onClose={() => setEditGroupId(null)}
        onUpdated={(newName) => {
          dashboard.setGroups((prev) =>
            prev.map((g) =>
              g._id === editGroupId ? { ...g, name: newName } : g
            )
          );
        }}
      />
    </main>
  );
}