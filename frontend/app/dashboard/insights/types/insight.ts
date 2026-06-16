export type InsightResponse = {
  categoryBreakdown: { category: string; total: number }[];
  paidByYou: number;
  yourExpense: number;
  netBalance: number;
};

export type FilterType = "this-month" | "last-month" | "custom";
export type ChartType = "pie" | "bar";

export type CustomRange = {
  start: string;
  end: string;
};

export type CategoryType =
  | "ALL"
  | "FOOD"
  | "TRAVEL"
  | "RENT"
  | "SHOPPING"
  | "RECHARGE"
  | "OTHER";

export type InsightParams = {
  filter?: "this-month" | "last-month";
  start?: string;
  end?: string;
};

export type Expense = {
  _id: string;
  description: string;
  amount: number;
  category: CategoryType; 
  createdAt: string;
  group?: { name: string };
  paidBy: {
    name: string;
    email: string;
  };
};

export type ExpenseParams = {
  filter?: "this-month" | "last-month";
  start?: string;
  end?: string;
  category?: CategoryType; // ✅ FIX: strict type instead of string
  page?: number;
  limit?: number;
};