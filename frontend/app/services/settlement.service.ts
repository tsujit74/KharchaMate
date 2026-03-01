import { api } from "./api";


export const getGroupSettlement = async (groupId: string) => {
  if (!groupId?.trim()) throw new Error("INVALID_GROUP");

  try {
    const res = await api.get(
      `/blance/groups/${groupId}/settlement`
    );

    return res.data || {};
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    const status = err.response.status;

    if (status === 401) throw new Error("UNAUTHORIZED");
    if (status === 403) throw new Error("FORBIDDEN");
    if (status === 404) throw new Error("GROUP_NOT_FOUND");

    throw new Error("FAILED_SETTLEMENT");
  }
};


export const settlePayment = async (
  groupId: string,
  toUserId: string,
  amount: number
) => {
  if (!groupId?.trim()) throw new Error("INVALID_GROUP");
  if (!toUserId?.trim()) throw new Error("INVALID_USER");
  if (!amount || amount <= 0)
    throw new Error("INVALID_AMOUNT");

  try {
    const res = await api.post(
      `/blance/groups/${groupId}/pay`,
      {
        to: toUserId,
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
        err.response.data?.message || "INVALID_PAYMENT"
      );

    throw new Error("PAYMENT_FAILED");
  }
};


export const getPendingSettlements = async () => {
  try {
    const res = await api.get("/blance/pending");

    return Array.isArray(res.data)
      ? res.data
      : [];
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    throw new Error(
      err.response.data?.message ||
        "FAILED_FETCH_PENDING"
    );
  }
};


export const getMySettlementHistory = async () => {
  try {
    const res = await api.get("/blance/my-history");

    return Array.isArray(res.data)
      ? res.data
      : [];
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    throw new Error(
      err.response.data?.message ||
        "FAILED_FETCH_HISTORY"
    );
  }
};

export const getMyNetBalance = async () => {
  try {
    const res = await api.get(
      "/blance/my-net-balance"
    );

    return res.data || {
      totalOwed: 0,
      totalReceivable: 0,
      netBalance: 0,
    };
  } catch (err: any) {
    if (!err.response) throw new Error("NETWORK_ERROR");

    if (err.response.status === 401)
      throw new Error("UNAUTHORIZED");

    throw new Error(
      err.response.data?.message ||
        "FAILED_FETCH_NET_BALANCE"
    );
  }
};