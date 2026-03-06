import { api } from "./api";

export const getActiveAnnouncements = async () => {
  try {
    const res = await api.get("/announcements/active");

    return Array.isArray(res.data?.announcements)
      ? res.data.announcements
      : [];

  } catch (err: any) {

    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");

    throw new Error("FAILED_FETCH_ANNOUNCEMENTS");
  }
};