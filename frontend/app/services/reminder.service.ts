import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("UNAUTHORIZED");
  return { Authorization: `Bearer ${token}` };
};

export const sendReminder = async ({
  groupId,
  toUserId,
  amount,
}: {
  groupId: string;
  toUserId: string;
  amount: number;
}) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/reminders/send`,
      { groupId, toUserId, amount },
      { headers: getAuthHeader() },
    );

    return res.data;
  } catch (err: any) {
    if (err.response?.status === 429) throw new Error("REMINDER_COOLDOWN");
    if (err.response?.status === 400) throw new Error("INVALID_REMINDER");
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    throw new Error("FAILED_SEND_REMINDER");
  }
};

export const checkReminder = async ({
  groupId,
  toUserId,
  amount,
}: {
  groupId: string;
  toUserId: string;
  amount: number;
}) => {
  try {
    const res = await axios.get(`${API_URL}/api/reminders/check`, {
      params: { groupId, toUserId, amount },
      headers: getAuthHeader(),
    });

    return res.data as { sent: boolean; sentAt: string | null };
  } catch (err: any) {
    if (err.response?.status === 401) throw new Error("UNAUTHORIZED");
    throw new Error("FAILED_CHECK_REMINDER");
  }
};
