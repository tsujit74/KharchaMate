"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useAuth } from "../context/authContext";
import { formatDateTime } from "../utils/formatDateTime";

import AppSkeleton from "../components/ui/AppSkeleton";
import MonthlyExpenseSummary from "./components/MonthlyExpenses";
import ExpensesList from "./components/ExpensesList";

import ProfileHeader from "./components/ProfileHeader";
import ProfileKpis from "./components/ProfileKpis";
import ProfileTabs from "./components/ProfileTabs";
import Pagination from "./components/Pagination";

import { useProfileData } from "./hooks/useProfileData";

const ITEMS_PER_PAGE = 10;

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const {
    groups,
    settlements,
    history,
    loadingData,
  } = useProfileData();

  const [activeTab, setActiveTab] = useState<
    "all" | "paid" | "pending" | "history"
  >("all");

  const [selectedMonth, setSelectedMonth] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  if (loading || loadingData) {
    return <AppSkeleton variant="profile" />;
  }

  if (!user) return null;

  const filterByMonth = (date: string) => {
    if (!selectedMonth) return true;

    const d = new Date(date);
    const [year, month] = selectedMonth.split("-");

    return (
      d.getFullYear() === Number(year) &&
      d.getMonth() + 1 === Number(month)
    );
  };

  const baseItems =
    activeTab === "pending"
      ? settlements
          .filter(
            (s) => s.from === user.id || s.to === user.id
          )
          .map((s) => ({
            _id: s._id,
            description: `Payment to ${s.toName}`,
            amount: parseFloat(s.amount.toFixed(2)),
            group: {
              _id: s.groupId,
              name: s.groupName,
            },
            from: {
              _id: s.from,
              name: s.fromName,
            },
            to: {
              _id: s.to,
              name: s.toName,
            },
            createdAt: s.createdAt || "",
            status: "pending",
          }))
      : activeTab === "history"
      ? history
          .filter(
            (s) =>
              s.from._id === user.id ||
              s.to._id === user.id
          )
          .map((s) => ({
            _id: s._id,
            description: `Payment ${s.status}`,
            amount: parseFloat(s.amount.toFixed(2)),
            group: s.group,
            from: s.from,
            to: s.to,
            createdAt: s.settledAt || s.createdAt,
            status: s.status,
          }))
      : [];

  const monthFiltered = baseItems.filter((item) =>
    item.createdAt
      ? filterByMonth(item.createdAt)
      : true
  );

  const totalPages = Math.max(
    1,
    Math.ceil(
      monthFiltered.length / ITEMS_PER_PAGE
    )
  );

  const paginatedItems = monthFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <main className="min-h-screen bg-[#F7F8FA] px-6 md:px-16 py-8">
      <div className="max-w-7xl mx-auto mb-8">
        <ProfileHeader
          name={user.name}
          email={user.email}
        />
      </div>

      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white border rounded-2xl p-6">
          <MonthlyExpenseSummary />
        </div>
      </div>

      <ProfileKpis
        groupsCount={groups.length}
        pendingCount={
          settlements.filter(
            (s) => s.from === user.id
          ).length
        }
        historyCount={history.length}
      />

      <ProfileTabs
        activeTab={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
      />

      <div className="max-w-7xl mx-auto">
        {activeTab === "all" ? (
          <ExpensesList
            userId={user.id}
            mode="all"
          />
        ) : activeTab === "paid" ? (
          <ExpensesList
            userId={user.id}
            mode="paid"
          />
        ) : (
          <>
            <div className="mb-4">
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(
                    e.target.value
                  );
                  setCurrentPage(1);
                }}
                className="border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="space-y-3">
              {paginatedItems.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  {activeTab === "pending"
                    ? "No pending payments to make."
                    : "No payment records found."}
                </p>
              ) : (
                paginatedItems.map((item) => {
                  const dateLabel =
                    item.createdAt
                      ? formatDateTime(
                          item.createdAt
                        ).dateLabel
                      : "";

                  const youAreSender =
                    item.from._id === user.id;

                  const paidByText =
                    youAreSender
                      ? `You paid ${item.to.name}`
                      : `${item.from.name} paid you`;

                  return (
                    <div
                      key={item._id}
                      className="border p-4 rounded-xl flex justify-between items-center bg-white hover:shadow-sm transition"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {item.description}
                        </p>

                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.group.name} •{" "}
                          {paidByText}
                        </p>

                        {dateLabel && (
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {dateLabel}
                          </p>
                        )}
                      </div>

                      <p
                        className={`text-sm font-semibold tabular-nums ${
                          youAreSender
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {youAreSender
                          ? "-₹"
                          : "+₹"}
                        {item.amount.toFixed(2)}
                      </p>
                    </div>
                  );
                })
              )}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}