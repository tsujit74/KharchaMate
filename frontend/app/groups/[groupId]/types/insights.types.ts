export type TrendUnit = "day" | "week" | "month";

export type MonthAmount = { month: string; amount: number };

export type SuggestedTransfer = {
  fromUserId: string;
  fromName: string;
  toUserId: string;
  toName: string;
  amount: number;
};

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
    yourPaid: number;
    yourShare: number;
    expenseCount: number;
    averageExpense: number;
    thisMonth?: number;
    previousMonth?: number | null;
    monthlyChange?: number | null;
    monthlyChangeDirection?: "UP" | "DOWN" | "FLAT" | null;
    avgPerMonth?: number | null;
    yearToDate?: number;
    highestMonth?: MonthAmount | null;
    lowestMonth?: MonthAmount | null;
    projectedMonthEnd?: number | null;
    daysLeftInMonth?: number;
  };
  period?: {
    startedAt: string;
    lastExpenseAt: string | null;
    durationDays: number;
    dailyAverage: number;
  };
  trend: {
    unit: TrendUnit;
    points: { label: string; amount: number }[];
  };
  byWeekday: { label: string; amount: number }[];
  categories: { category: string; amount: number; percentage: number }[];
  topCategory?: { category: string; amount: number; percentage: number } | null;
  members: {
    userId: string;
    name: string;
    paid: number;
    share: number;
    settled: number;
    balance: number;
  }[];
  topPayer?: { userId: string; name: string; amount: number } | null;
  largestExpense?: {
    id: string;
    description: string;
    amount: number;
    category: string;
    paidByName: string;
    createdAt: string;
  } | null;
  topExpenses: {
    id: string;
    description: string;
    amount: number;
    category: string;
    paidByName: string;
    createdAt: string;
  }[];
  budget: {
    scope: "MONTH" | "TOTAL";
    amount: number;
    spent: number;
    remaining: number;
    percentageUsed: number;
  } | null;
  settlement: {
    balance: number;
    youAreOwed: number;
    youOwe: number;
    pendingCount: number;
    pendingOut: number;
    pendingIn: number;
    totalSettled: number;
    youPaidInSettlements: number;
    youReceivedInSettlements: number;
    suggestedTransfers: SuggestedTransfer[];
  };
};
