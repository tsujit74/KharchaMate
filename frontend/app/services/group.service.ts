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

export const getGroupExpenses = async (groupId: string) => {
  if (!groupId) throw new Error("INVALID_GROUP");

  try {
    const res = await axios.get(`${API_URL}/api/expenses/${groupId}`, {
      headers: getAuthHeader(),
    });

    return Array.isArray(res.data) ? res.data : [];
  } catch (err: any) {
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    throw new Error("FAILED_EXPENSES");
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

export const getGroupById = async (groupId: string) => {
  if (!groupId) throw new Error("INVALID_GROUP");

  try {
    const res = await axios.get(
      `${API_URL}/api/groups/${groupId}`,
      { headers: getAuthHeader() }
    );

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    throw new Error("FAILED_GROUP");
  }
};

