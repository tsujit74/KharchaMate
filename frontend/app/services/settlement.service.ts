import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("UNAUTHORIZED");
  return { Authorization: `Bearer ${token}` };
};

export const getGroupSettlement = async (groupId: string) => {
  try {
    const res = await axios.get(
      `${API_URL}/api/blance/groups/${groupId}/settlement`,
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch (err: any) {
    if (err.response?.status === 403) throw new Error("FORBIDDEN");
    throw new Error("FAILED_SETTLEMENT");
  }
};

export const settlePayment = async (
  groupId: string,
  toUserId: string,
  amount: number,
) => {
  try {
    const res = await axios.post(
      `${API_URL}/api/blance/groups/${groupId}/pay`,
      { to: toUserId, amount },
      { headers: getAuthHeader() },
    );
    return res.data;
  } catch {
    throw new Error("PAYMENT_FAILED");
  }
};

export const getPendingSettlements = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/blance/pending`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "FAILED_FETCH_PENDING");
  }
};

export const getMySettlementHistory = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/blance/my-history`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "FAILED_FETCH_HISTORY");
  }
};

export const getMyNetBalance = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/blance/my-net-balance`, {
      headers: getAuthHeader(),
    });
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "FAILED_FETCH_NET_BALANCE");
  }
};

