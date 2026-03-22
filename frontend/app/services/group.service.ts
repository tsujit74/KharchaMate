import { api } from "./api";

export const getMyGroups = async () => {
  try {
    const res = await api.get("/groups/my-groups");

    if (!Array.isArray(res.data)) return [];

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401) throw new Error("UNAUTHORIZED");

    throw new Error("FAILED_GROUPS");
  }
};

export const createGroup = async (name: string) => {
  if (!name?.trim()) throw new Error("INVALID_NAME");

  try {
    const res = await api.post("/groups/create", {
      name: name.trim(),
    });

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401) throw new Error("UNAUTHORIZED");

    if (err.response.status === 400)
      throw new Error(err.response.data?.message || "INVALID_NAME");

    throw new Error("FAILED_CREATE_GROUP");
  }
};

export const getGroupById = async (groupId: string) => {
  if (!groupId) throw new Error("INVALID_GROUP");

  try {
    const res = await api.get(`/groups/${groupId}`);
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401) throw new Error("UNAUTHORIZED");

    if (err.response.status === 403) throw new Error("FORBIDDEN");

    if (err.response.status === 404) throw new Error("GROUP_NOT_FOUND");

    throw new Error("FAILED_GROUP");
  }
};

export const addMember = async (
  groupId: string,
  payload: { userId?: string; email?: string }
) => {
  if (!groupId || (!payload?.userId && !payload?.email?.trim())) {
    throw new Error("INVALID_DATA");
  }

  try {
    const res = await api.post(`/groups/${groupId}/add-member`, {
      userId: payload.userId,
      email: payload.email?.trim(),
    });

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;
    const message = err.response.data?.message;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 404) throw new Error("USER_NOT_FOUND");
    if (status === 409) throw new Error("ALREADY_MEMBER");

    if (status === 400) {
      throw new Error(message || "FAILED_ADD_MEMBER");
    }

    throw new Error("FAILED_ADD_MEMBER");
  }
};

export const removeMember = async (groupId: string, userId: string) => {
  if (!groupId || !userId) throw new Error("INVALID_DATA");

  try {
    const res = await api.post("/groups/remove-member", {
      groupId,
      userId,
    });

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401) throw new Error("UNAUTHORIZED");

    if (err.response.status === 403) throw new Error("FORBIDDEN");

    if (err.response.status === 400)
      throw new Error(err.response.data?.message || "REMOVE_NOT_ALLOWED");

    throw new Error("FAILED_REMOVE_MEMBER");
  }
};

export const toggleGroupStatus = async (groupId: string) => {
  if (!groupId) throw new Error("INVALID_GROUP");

  try {
    const res = await api.patch(`/groups/${groupId}/toggle-status`);

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
  limit: number = 10,
) => {
  if (!groupId) throw new Error("INVALID_GROUP");

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  try {
    const res = await api.get(
      `/expenses/${groupId}?page=${page}&limit=${limit}`,
    );

    return {
      expenses: Array.isArray(res.data.expenses) ? res.data.expenses : [],
      page: res.data.page || 1,
      totalPages: res.data.totalPages || 1,
      total: res.data.total || 0,
    };
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401) throw new Error("UNAUTHORIZED");

    if (err.response.status === 403) throw new Error("FORBIDDEN");

    throw new Error("FAILED_EXPENSES");
  }
};

export const updateGroupName = async (groupId: string, name: string) => {
  if (!groupId || !name?.trim()) throw new Error("INVALID_DATA");

  try {
    const res = await api.patch(`/groups/${groupId}/update-name`, {
      name: name.trim(),
    });

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401) throw new Error("UNAUTHORIZED");

    if (err.response.status === 403) throw new Error("FORBIDDEN");

    if (err.response.status === 400)
      throw new Error(err.response.data?.message || "INVALID_NAME");

    throw new Error("FAILED_UPDATE_GROUP_NAME");
  }
};

//Search users

export const searchUsers = async (query: string) => {
  if (!query?.trim()) return [];

  try {
    const res = await api.get(`/groups/users/search?q=${query.trim()}`);

    return Array.isArray(res.data) ? res.data : [];
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    throw new Error("FAILED_SEARCH_USERS");
  }
};

export const getRecentUsers = async () => {
  try {
    const res = await api.get("/groups/users/recent");

    return Array.isArray(res.data) ? res.data : [];
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    throw new Error("FAILED_RECENT_USERS");
  }
};