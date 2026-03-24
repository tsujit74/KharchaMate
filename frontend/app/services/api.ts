"use client";

import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Ignore expected 401 from /auth/me
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("/auth/me")
    ) {
      return Promise.reject(error);
    }

    // Optional: log other errors only
    if (process.env.NODE_ENV === "development") {
      console.error(
        "API Error:",
        error?.response?.status,
        error?.response?.data
      );
    }

    return Promise.reject(error);
  }
);