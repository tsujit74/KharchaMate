import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("UNAUTHORIZED");
  return { Authorization: `Bearer ${token}` };
};

export const getMyGroups = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/groups/my-groups`, {
      headers: getAuthHeader(),
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    throw new Error("FAILED_GROUPS");
  }
};

export const createGroup = async (name: string) => {
  if (!name?.trim()) throw new Error("INVALID_NAME");

  try {
    const res = await axios.post(
      `${API_URL}/api/groups/create`,
      { name: name.trim() },
      { headers: getAuthHeader() },
    );

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    throw new Error("FAILED_CREATE_GROUP");
  }
};

export const getGroupById = async (groupId: string) => {
  if (!groupId) throw new Error("INVALID_GROUP");

  try {
    const res = await axios.get(`${API_URL}/api/groups/${groupId}`, {
      headers: getAuthHeader(),
    });

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    throw new Error("FAILED_GROUP");
  }
};

export const addMember = async (groupId: string, email: string) => {
  if (!groupId || !email) throw new Error("INVALID_DATA");

  try {
    const res = await axios.post(
      `${API_URL}/api/groups/add-member`,
      { groupId, email },
      { headers: getAuthHeader() },
    );

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    throw new Error("FAILED_ADD_MEMBER");
  }
};

export const removeMember = async (groupId: string, userId: string) => {
  if (!groupId || !userId) throw new Error("INVALID_DATA");

  try {
    const res = await axios.post(
      `${API_URL}/api/groups/remove-member`,
      { groupId, userId },
      { headers: getAuthHeader() },
    );

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    if (err.response?.status === 400)
      throw new Error(err.response.data?.message || "REMOVE_NOT_ALLOWED");

    throw new Error("FAILED_REMOVE_MEMBER");
  }
};

export const toggleGroupStatus = async (groupId: string, p0: boolean) => {
  if (!groupId) throw new Error("INVALID_GROUP");

  try {
    const res = await axios.patch(
      `${API_URL}/api/groups/${groupId}/toggle-status`,
      {},
      { headers: getAuthHeader() },
    );

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    throw new Error("FAILED_TOGGLE_GROUP");
  }
};

export const getGroupExpenses = async (
  groupId: string,
  page: number = 1,
  limit: number = 10
) => {
  if (!groupId) throw new Error("INVALID_GROUP");

  try {
    const res = await axios.get(
      `${API_URL}/api/expenses/${groupId}?page=${page}&limit=${limit}`,
      {
        headers: getAuthHeader(),
      }
    );

    return {
      expenses: Array.isArray(res.data.expenses) ? res.data.expenses : [],
      page: res.data.page,
      totalPages: res.data.totalPages,
      total: res.data.total,
    };
  } catch (err: any) {
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    throw new Error("FAILED_EXPENSES");
  }
};

export const updateGroupName = async (groupId: string, name: string) => {
  if (!groupId || !name?.trim()) throw new Error("INVALID_DATA");

  try {
    const res = await axios.patch(
      `${API_URL}/api/groups/${groupId}/update-name`,
      { name: name.trim() },
      { headers: getAuthHeader() },
    );

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    throw new Error("FAILED_UPDATE_GROUP_NAME");
  }
};

