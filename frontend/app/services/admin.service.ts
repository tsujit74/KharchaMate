import { api } from "./api";

// Get Admin Dashboard Stats
export const getAdminStats = async () => {
  try {
    const res = await api.get("/admin/stats");
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    if (err.response.status === 403)
      throw new Error("FORBIDDEN");

    throw new Error("FAILED_FETCH_ADMIN_STATS");
  }
};

// Get All Users
export const getAllUsers = async () => {
  try {
    const res = await api.get("/admin/users");

    return Array.isArray(res.data?.users)
      ? res.data.users
      : [];
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    if (err.response.status === 403)
      throw new Error("FORBIDDEN");

    throw new Error("FAILED_FETCH_USERS");
  }
};

// Block User
export const blockUser = async (userId: string) => {
  if (!userId?.trim())
    throw new Error("INVALID_USER_ID");

  try {
    const res = await api.patch(
      `/admin/user/${userId}/block`
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401)
      throw new Error("UNAUTHORIZED");

    if (status === 403)
      throw new Error("FORBIDDEN");

    if (status === 404)
      throw new Error("USER_NOT_FOUND");

    throw new Error("FAILED_BLOCK_USER");
  }
};

// Unblock User
export const unblockUser = async (userId: string) => {
  if (!userId?.trim())
    throw new Error("INVALID_USER_ID");

  try {
    const res = await api.patch(
      `/admin/user/${userId}/unblock`
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401)
      throw new Error("UNAUTHORIZED");

    if (status === 403)
      throw new Error("FORBIDDEN");

    if (status === 404)
      throw new Error("USER_NOT_FOUND");

    throw new Error("FAILED_UNBLOCK_USER");
  }
};

export const getAllGroupsAdmin = async () => {
  try {
    const res = await api.get("/admin/groups");

    return Array.isArray(res.data?.groups)
      ? res.data.groups
      : [];
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");

    throw new Error("FAILED_FETCH_GROUPS");
  }
};

export const blockGroupAdmin = async (id: string) => {
  if (!id || typeof id !== "string" || !id.trim()) {
    throw new Error("INVALID_GROUP_ID");
  }

  try {
    const res = await api.patch(`/admin/groups/${id}/block`);
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 404) throw new Error("GROUP_NOT_FOUND");
    if (status === 400) throw new Error("GROUP_ALREADY_BLOCKED");

    throw new Error("FAILED_BLOCK_GROUP");
  }
};

export const unblockGroupAdmin = async (id: string) => {
  if (!id?.trim()) throw new Error("INVALID_GROUP_ID");

  try {
    const res = await api.patch(`/admin/groups/${id}/unblock`);
    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 404) throw new Error("GROUP_NOT_FOUND");
    if (status === 400) throw new Error("GROUP_NOT_BLOCKED");

    throw new Error("FAILED_UNBLOCK_GROUP");
  }
};