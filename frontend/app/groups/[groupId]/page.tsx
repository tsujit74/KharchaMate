"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Users, IndianRupee, Plus, ArrowRight, UserPlus, Info } from "lucide-react";

import { useAuth } from "@/app/context/authContext";
import {
  getGroupSettlement,
  settlePayment,
} from "@/app/services/settlement.service";
import { getGroupById, getGroupExpenses } from "@/app/services/group.service";
import ExpenseCard from "@/app/components/Expenses/ExpenseCard";
import ReminderButton from "@/app/components/Reminder/ReminderButton";
import GroupInfoDrawer from "@/app/components/Groups/GroupInfoDrawer";

export default function GroupDetailsPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();

  const [expenses, setExpenses] = useState<any[]>([]);
  const [settlement, setSettlement] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [infoOpen, setInfoOpen] = useState(false);
  const [group, setGroup] = useState<any>(null);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!groupId) {
      setError("Invalid group");
      setPageLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setPageLoading(true);
        setError("");

        const [expenseData, settlementData, groupData] = await Promise.all([
          getGroupExpenses(groupId),
          getGroupSettlement(groupId),
          getGroupById(groupId),
        ]);

        setExpenses(expenseData);
        setSettlement(settlementData);
        setGroup(groupData);
      } catch (err: any) {
        if (err.message === "FORBIDDEN") {
          setError("You are not a member of this group.");
        } else {
          setError("Failed to load group details.");
        }
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [loading, isAuthenticated, groupId, router]);

  if (loading || pageLoading) {
    return <div className="p-10 text-center text-gray-500">Loading...</div>;
  }

  if (!isAuthenticated) return null;

  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  if (!settlement) {
    return (
      <div className="p-10 text-center text-gray-500">
        No access to this group.
      </div>
    );
  }

  const refreshExpenses = async () => {
  try {
    const [
      updatedGroup,
      updatedExpenses,
      updatedSettlement,
    ] = await Promise.all([
      getGroupById(groupId),          
      getGroupExpenses(groupId),
      getGroupSettlement(groupId),
    ]);

    setGroup(updatedGroup);        
    setExpenses(updatedExpenses);
    setSettlement(updatedSettlement);
  } catch (err) {
    console.error("Failed to refresh data", err);
  }
};


  const handleSettle = async (toId: string, amount: number) => {
    try {
      await settlePayment(groupId, toId, amount);
      const updated = await getGroupSettlement(groupId);
      setSettlement(updated);
    } catch {
      alert("Payment failed. Try again.");
    }
  };

  return (
    <main className="min-h-screen bg-[#FCFCFD] flex">
      <aside className="w-72 hidden md:block border-r bg-white p-4 sticky top-0 h-screen">
        <GroupMembersSidebar
          balances={settlement.balances}
          currentUserId={user?.id}
          groupId={groupId}
        />
      </aside>

      <section className="flex-1 px-4 md:px-10 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{settlement.group}</h1>
            <p className="text-sm text-gray-500">
              Track expenses & settlements
            </p>
          </div>

         <button
  onClick={() => setInfoOpen(true)}
  className="
    group
    flex items-center gap-2
    px-4 py-2
    border rounded-lg
    text-sm font-medium
    transition-all duration-200
    hover:bg-gray-50
    hover:border-gray-300
    active:scale-[0.98]
  "
>
  <Info
    className="
      w-4 h-4
      text-gray-500
      transition-transform duration-200
      group-hover:translate-x-0.5
    "
  />
  Group Info
</button>

        </div>

        {/* KPIs */}
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-4 mb-8">
          <Stat
            icon={IndianRupee}
            label="Total Spent"
            value={`₹${settlement.totalSpent}`}
          />
          <Stat
            icon={Users}
            label="Your Share"
            value={`₹${settlement.yourShare}`}
          />

          <Stat
            icon={Users}
            label="Members"
            value={settlement.balances.length}
          />
        </div>

        {/* Settlement */}
        <div className="max-w-6xl mx-auto bg-white rounded-xl border p-6 mb-10">
          <h2 className="font-semibold mb-4">Settlement</h2>

          {settlement.settlements.length === 0 ? (
            <p className="text-gray-500 text-sm">Everyone is settled 🎉</p>
          ) : (
            settlement.settlements
              //logged-in user's payments first
              .sort((a: any, b: any) => {
                const aIsMe = a.from === user?.id;
                const bIsMe = b.from === user?.id;
                return Number(bIsMe) - Number(aIsMe);
              })
              .map((s: any) => {
                const youOwe = s.from === user?.id;
                const someoneOwesYou = s.to === user?.id;
                const isViewer = !youOwe && !someoneOwesYou;

                const debtor = settlement.balances.find(
                  (b: any) => b.id === s.from,
                );

                const creditor = settlement.balances.find(
                  (b: any) => b.id === s.to,
                );

                // avoid crashes if data mismatches
                if (!debtor || !creditor) return null;

                return (
                  <div
                    key={`${s.from}-${s.to}`}
                    className={`flex justify-between items-center rounded-lg p-3 mb-2 border ${
                      youOwe
                        ? "bg-red-50 border-red-200"
                        : someoneOwesYou
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{s.fromName}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{s.toName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {youOwe && (
                        <button
                          onClick={() =>
                            router.push(
                              `/groups/${groupId}/settle?to=${creditor.id}&amount=${s.amount}`,
                            )
                          }
                          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                        >
                          Pay ₹{s.amount}
                        </button>
                      )}

                      {someoneOwesYou && (
                        <>
                          <span className="text-sm font-semibold text-gray-700">
                            ₹{s.amount}
                          </span>
                          <ReminderButton
                            groupId={groupId}
                            toUserId={debtor.id}
                            amount={s.amount}
                          />
                        </>
                      )}

                      {isViewer && (
                        <span className="text-sm font-semibold text-gray-500">
                          ₹{s.amount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
          )}
        </div>

        {/* Expenses */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between mb-4">
            <h2 className="font-semibold">Expenses</h2>
            <Link
              href={`/groups/${groupId}/add-expense`}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Expense
            </Link>
          </div>

          {expenses.length === 0 ? (
            <p className="text-gray-500 text-sm">No expenses yet.</p>
          ) : (
            expenses
              .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
              .map((e) => (
                <ExpenseCard
                  key={e._id}
                  expense={e}
                  currentUserId={user?.id}
                  onDeleted={refreshExpenses}
                  onUpdated={refreshExpenses}
                />
              ))
          )}
        </div>
      </section>
      <GroupInfoDrawer
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        group={group}
        currentUserId={user?.id}
        onRefresh={refreshExpenses}
      />
    </main>
  );
}

function GroupMembersSidebar({
  balances,
  currentUserId,
  groupId,
}: {
  balances: any[];
  currentUserId?: string;
  groupId: string;
}) {
  return (
    <>
      <h3 className="font-semibold mb-4">Group Members</h3>

      <div className="space-y-3">
        {balances.map((m) => {
          const isYou = m.id === currentUserId;
          const isOwed = m.balance > 0;

          return (
            <div
              key={m.id}
              className="flex justify-between items-center bg-gray-50 rounded-lg p-3"
            >
              <div>
                <p className="text-sm font-medium">
                  {m.name} {isYou && "(You)"}
                </p>
                <p className="text-xs text-gray-500">{m.email}</p>
              </div>

              <span
                className={`text-sm font-semibold ${
                  isOwed ? "text-green-600" : "text-red-500"
                }`}
              >
                ₹{Math.abs(m.balance)}
              </span>
            </div>
          );
        })}
      </div>

      <Link
        href={`/groups/${groupId}/add-member`}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 right-4 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
        title="Add member"
      >
        <UserPlus className="w-4 h-4 text-gray-600" />
      </Link>
    </>
  );
}

function Stat({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white border rounded-xl p-5 flex gap-4 items-center">
      <Icon className="w-7 h-7 text-gray-400" />
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}
