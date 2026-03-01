import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
  
    if (
      typeof window !== "undefined" &&
      error.response?.status === 401
    ) {
   
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);