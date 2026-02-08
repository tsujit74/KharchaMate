import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("UNAUTHORIZED");
  return { Authorization: `Bearer ${token}` };
};

export const getGroupDetails = async (groupId: string) => {
  if (!groupId) throw new Error("INVALID_GROUP");

  try {
    const res = await axios.get(`${API_URL}/api/groups/${groupId}`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    throw new Error("FAILED_GROUP_DETAILS");
  }
};

export const addExpense = async ({
  groupId,
  description,
  amount,
  splitBetween,
}: {
  groupId: string;
  description: string;
  amount: number;
  splitBetween?: {
    user: string;
    amount: number;
  }[];
}) => {
  if (!groupId || !description || !amount) {
    throw new Error("INVALID_DATA");
  }

  try {
    const payload: any = {
      groupId,
      description: description.trim(),
      amount,
    };

    //ONLY attach when custom split is used
    if (Array.isArray(splitBetween) && splitBetween.length > 0) {
      payload.splitBetween = splitBetween;
    }

    const res = await axios.post(`${API_URL}/api/expenses/add`, payload, {
      headers: getAuthHeader(),
    });

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    throw new Error("FAILED_ADD_EXPENSE");
  }
};

export const getRecentExpenses = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/expenses/recent`, {
      headers: getAuthHeader(),
    });

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    throw new Error("FAILED_RECENT_EXPENSES");
  }
};

export const getMyExpenses = async (month?: string) => {
  try {
    const res = await axios.get(`${API_URL}/api/expenses/my/expenses`, {
      headers: getAuthHeader(),
      params: month ? { month } : {},
    });

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
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
  const monthString = `${year}-${String(month).padStart(2, "0")}`;

  const res = await axios.get(`${API_URL}/api/expenses/my/monthly-summary`, {
    headers: getAuthHeader(),
    params: { month: monthString },
  });

  return res.data;
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
  if (!expenseId) throw new Error("INVALID_EXPENSE");
  if (!description || !amount) throw new Error("INVALID_DATA");

  try {
    const payload: any = {
      description: description.trim(),
      amount,
    };

    if (splitBetween && splitBetween.length > 0) {
      payload.splitBetween = splitBetween;
    }

    const res = await axios.put(
      `${API_URL}/api/expenses/${expenseId}`,
      payload,
      {
        headers: getAuthHeader(),
      },
    );

    return res.data;
  } catch (err: any) {
    console.error("Update expense error:", err.response?.data || err.message);

    if (err.response) {
      const status = err.response.status;
      if (status === 401) throw new Error("UNAUTHORIZED");
      if (status === 403) throw new Error("FORBIDDEN");
      if (status === 400)
        throw new Error(err.response.data?.message || "UPDATE_NOT_ALLOWED");
      if (status === 404) throw new Error("EXPENSE_NOT_FOUND");
    }

    throw new Error("FAILED_UPDATE_EXPENSE");
  }
};

export const deleteExpense = async (expenseId: string) => {
  if (!expenseId) throw new Error("INVALID_EXPENSE");

  try {
    const res = await axios.delete(`${API_URL}/api/expenses/${expenseId}`, {
      headers: getAuthHeader(),
    });

    return res.data;
  } catch (err: any) {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 400) throw new Error(message || "Cannot delete this expense");

    throw new Error("FAILED_DELETE_EXPENSE");
  }
};

