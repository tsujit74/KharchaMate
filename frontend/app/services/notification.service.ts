import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("UNAUTHORIZED");
  return { Authorization: `Bearer ${token}` };
};

// Get all notifications of logged-in user
export const getNotifications = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/notifications`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    throw new Error("FAILED_FETCH_NOTIFICATIONS");
  }
};

// Mark single notification as read
export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const res = await axios.patch(
      `${API_URL}/api/notifications/${notificationId}/read`,
      {},
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch {
    throw new Error("FAILED_MARK_READ");
  }
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async () => {
  try {
    const res = await axios.patch(
      `${API_URL}/api/notifications/read-all`,
      {},
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch {
    throw new Error("FAILED_MARK_ALL_READ");
  }
};

export const getUnreadNotificationCount = async () => {
  const res = await axios.get(
    `${API_URL}/api/notifications/unread-count`,
    { headers: getAuthHeader() }
  );

  return res.data.count;
};
