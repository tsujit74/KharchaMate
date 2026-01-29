import { api } from "./api";

export const loginUser = (data: { email: string; password: string }) =>
  api.post("/auth/login", data);

export const registerUser = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/auth/signup", data);

export const getMe = () => api.get("/auth/me");

export const logoutUser = () => api.post("/auth/logout");
