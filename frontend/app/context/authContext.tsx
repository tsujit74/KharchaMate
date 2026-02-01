"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser } from "@/app/services/auth.service";
import { useRouter } from "next/navigation";
import axios from "axios";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const setupAxiosToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      setupAxiosToken(token);

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getMe();
        const u = res.data.user;

        setUser({
          id: u._id,
          name: u.name,
          email: u.email,
        });
      } catch {
        setUser(null);
        localStorage.removeItem("accessToken");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    try {
      const res = await loginUser(data);
      const token = res.data.token;

      localStorage.setItem("accessToken", token);
      setupAxiosToken(token);

      const userRes = await getMe();
      const u = userRes.data.user;

      setUser({
        id: u._id,
        name: u.name,
        email: u.email,
      });

      router.push("/dashboard");
    } catch (err: any) {
      throw new Error(err?.response?.data?.message || "Login failed");
    }
  };

  const logout = async () => {
    try {
      
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("accessToken");
      setupAxiosToken(null);
      setUser(null);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
