import { api } from "./api";


export const getNotifications = async (
  page: number = 1,
  limit: number = 10
) => {
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  try {
    const res = await api.get("/notifications", {
      params: { page, limit },
    });

    return {
      notifications: Array.isArray(res.data?.notifications)
        ? res.data.notifications
        : [],
      page: res.data?.page || 1,
      totalPages: res.data?.totalPages || 1,
      total: res.data?.total || 0,
    };
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    throw new Error("FAILED_FETCH_NOTIFICATIONS");
  }
};


export const markNotificationAsRead = async (
  notificationId: string
) => {
  if (!notificationId?.trim())
    throw new Error("INVALID_NOTIFICATION");

  try {
    const res = await api.patch(
      `/notifications/${notificationId}/read`
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401)
      throw new Error("UNAUTHORIZED");

    if (status === 404)
      throw new Error("NOTIFICATION_NOT_FOUND");

    throw new Error("FAILED_MARK_READ");
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const res = await api.patch(
      "/notifications/read-all"
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    throw new Error("FAILED_MARK_ALL_READ");
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const res = await api.get(
      "/notifications/unread-count"
    );

    return typeof res.data?.count === "number"
      ? res.data.count
      : 0;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    throw new Error("FAILED_FETCH_UNREAD_COUNT");
  }
};