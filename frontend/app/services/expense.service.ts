import { api } from "./api";


export const getGroupDetails = async (groupId: string) => {
  if (!groupId?.trim()) throw new Error("INVALID_GROUP");

  try {
    const res = await api.get(`/groups/${groupId}`);
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401) throw new Error("UNAUTHORIZED");
    if (err.response.status === 403) throw new Error("FORBIDDEN");
    if (err.response.status === 404) throw new Error("GROUP_NOT_FOUND");

    throw new Error("FAILED_GROUP_DETAILS");
  }
};

export const addExpense = async ({
  groupId,
  description,
  amount,
  splitBetween,
  category,
}: {
  groupId: string;
  description: string;
  amount: number;
  splitBetween?: { user: string; amount: number }[];
  category?: string;
}) => {
  if (!groupId?.trim()) throw new Error("INVALID_GROUP");
  if (!description?.trim()) throw new Error("INVALID_DESCRIPTION");
  if (!amount || amount <= 0) throw new Error("INVALID_AMOUNT");

  try {
    const payload: any = {
      groupId,
      description: description.trim(),
      amount,
    };

    if (category?.trim()) {
      payload.category = category.trim();
    }

    if (Array.isArray(splitBetween) && splitBetween.length > 0) {
      const validSplit = splitBetween.filter(
        (s) => s.user && s.amount > 0
      );

      if (validSplit.length === 0)
        throw new Error("INVALID_SPLIT");

      payload.splitBetween = validSplit;
    }

    const res = await api.post("/expenses/add", payload);
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 400)
      throw new Error(err.response.data?.message || "INVALID_EXPENSE_DATA");

    throw new Error("FAILED_ADD_EXPENSE");
  }
};


export const getRecentExpenses = async () => {
  try {
    const res = await api.get("/expenses/recent");

    return Array.isArray(res.data) ? res.data : [];
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    throw new Error("FAILED_RECENT_EXPENSES");
  }
};


export const getMyExpenses = async (month?: string) => {
  try {
    const res = await api.get("/expenses/my/expenses", {
      params: month ? { month } : {},
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    throw new Error("FAILED_MY_EXPENSES");
  }
};

export const getMonthlySummary = async ({
  month,
  year,
}: {
  month: number;
  year: number;
}) => {
  if (!month || month < 1 || month > 12)
    throw new Error("INVALID_MONTH");

  if (!year || year < 2000)
    throw new Error("INVALID_YEAR");

  const monthString = `${year}-${String(month).padStart(2, "0")}`;

  try {
    const res = await api.get(
      "/expenses/my/monthly-summary",
      { params: { month: monthString } }
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    throw new Error("FAILED_MONTHLY_SUMMARY");
  }
};


export const updateExpense = async ({
  expenseId,
  description,
  amount,
  splitBetween,
}: {
  expenseId: string;
  description: string;
  amount: number;
  splitBetween?: { user: string; amount: number }[];
}) => {
  if (!expenseId?.trim())
    throw new Error("INVALID_EXPENSE");

  if (!description?.trim())
    throw new Error("INVALID_DESCRIPTION");

  if (!amount || amount <= 0)
    throw new Error("INVALID_AMOUNT");

  try {
    const payload: any = {
      description: description.trim(),
      amount,
    };

    if (Array.isArray(splitBetween) && splitBetween.length > 0) {
      const validSplit = splitBetween.filter(
        (s) => s.user && s.amount > 0
      );

      if (validSplit.length === 0)
        throw new Error("INVALID_SPLIT");

      payload.splitBetween = validSplit;
    }

    const res = await api.put(
      `/expenses/${expenseId}`,
      payload
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 400)
      throw new Error(err.response.data?.message || "UPDATE_NOT_ALLOWED");
    if (status === 404)
      throw new Error("EXPENSE_NOT_FOUND");

    throw new Error("FAILED_UPDATE_EXPENSE");
  }
};


export const deleteExpense = async (
  expenseId: string
) => {
  if (!expenseId?.trim())
    throw new Error("INVALID_EXPENSE");

  try {
    const res = await api.delete(
      `/expenses/${expenseId}`
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 400)
      throw new Error(
        err.response.data?.message ||
          "DELETE_NOT_ALLOWED"
      );
    if (status === 404)
      throw new Error("EXPENSE_NOT_FOUND");

    throw new Error("FAILED_DELETE_EXPENSE");
  }
};


export const getMyInsights = async ({
  filter,
  start,
  end,
}: {
  filter?: "this-month" | "last-month";
  start?: string;
  end?: string;
}) => {
  try {
    const params: any = {};

    if (filter) {
      if (!["this-month", "last-month"].includes(filter))
        throw new Error("INVALID_FILTER");
      params.filter = filter;
    }

    if (start && end) {
      params.start = start;
      params.end = end;
    }

    const res = await api.get(
      "/expenses/my/insights",
      { params }
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    if (err.response.status === 400)
      throw new Error(
        err.response.data?.message || "INVALID_FILTER"
      );

    throw new Error("FAILED_FETCH_INSIGHTS");
  }
};