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
}: {
  groupId: string;
  description: string;
  amount: number;
}) => {
  if (!groupId || !description || !amount) throw new Error("INVALID_DATA");

  try {
    const res = await axios.post(
      `${API_URL}/api/expenses/add`,
      {
        groupId,
        description: description.trim(),
        amount,
      },
      { headers: getAuthHeader() },
    );

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
