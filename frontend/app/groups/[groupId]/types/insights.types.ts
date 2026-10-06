export type TrendUnit = "day" | "week" | "month";

export type GroupInsights = {
  group: {
    id: string;
    name: string;
    type: "NORMAL" | "ONGOING";
    isActive: boolean;
    memberCount: number;
  };
  summary: {
    totalSpent: number;
    yourShare: number;
    expenseCount: number;
    averageExpense: number;
    thisMonth?: number;
    avgPerMonth?: number | null;
  };
  trend: {
    unit: TrendUnit;
    points: { label: string; amount: number }[];
  };
  categories: { category: string; amount: number; percentage: number }[];
  members: { userId: string; name: string; paid: number; share: number }[];
  topExpenses: {
    id: string;
    description: string;
    amount: number;
    category: string;
    paidByName: string;
    createdAt: string;
  }[];
  budget: { amount: number; spent: number; remaining: number } | null;
  settlement: { balance: number; pendingCount: number };
};