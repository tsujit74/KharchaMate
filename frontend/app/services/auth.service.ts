import { api } from "./api";

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
  mobile?: string;
}) => api.post("/auth/signup", data);

export const getMe = () => api.get("/auth/me");

export const logoutUser = () => api.post("/auth/logout");

export const forgotPassword = (email: string) => {
  return api.post("/auth/forgot-password", { email });
};

export const resetPassword = (token: string, password: string) => {
  return api.post(`/auth/reset-password/${token}`, { password });
};

export const googleLogin = () => {
  if (typeof window === "undefined") {
    throw new Error("GOOGLE_LOGIN_UNAVAILABLE");
  }

  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`;
};
