import { api } from "./api";

export const sendReminder = async ({
  groupId,
  toUserId,
  amount,
}: {
  groupId: string;
  toUserId: string;
  amount: number;
}) => {
  if (!groupId?.trim()) throw new Error("INVALID_GROUP");
  if (!toUserId?.trim()) throw new Error("INVALID_USER");
  if (!amount || amount <= 0)
    throw new Error("INVALID_AMOUNT");

  try {
    const res = await api.post(
      "/reminders/send",
      {
        groupId,
        toUserId,
        amount,
      }
    );

    return res.data;
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 400)
      throw new Error(
        err.response.data?.message || "INVALID_REMINDER"
      );
    if (status === 429)
      throw new Error("REMINDER_COOLDOWN");

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
  if (!groupId?.trim()) throw new Error("INVALID_GROUP");
  if (!toUserId?.trim()) throw new Error("INVALID_USER");
  if (!amount || amount <= 0)
    throw new Error("INVALID_AMOUNT");

  try {
    const res = await api.get("/reminders/check", {
      params: {
        groupId,
        toUserId,
        amount,
      },
    });

    return {
      sent: !!res.data?.sent,
      sentAt: res.data?.sentAt || null,
    } as { sent: boolean; sentAt: string | null };
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    if (err.response.status === 400)
      throw new Error(
        err.response.data?.message || "INVALID_REMINDER"
      );

    throw new Error("FAILED_CHECK_REMINDER");
  }
};