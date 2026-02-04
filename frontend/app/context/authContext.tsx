"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser } from "@/app/services/auth.service";
import { getUnreadNotificationCount } from "@/app/services/notification.service";
import { useRouter } from "next/navigation";
import axios from "axios";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  unreadNotifications: number;
  setUnreadNotifications: React.Dispatch<React.SetStateAction<number>>;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const setupAxiosToken = (token: string | null) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // 🔁 Init auth
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

        const unread = await getUnreadNotificationCount();
        setUnreadNotifications(unread);
      } catch {
        localStorage.removeItem("accessToken");
        setupAxiosToken(null);
        setUser(null);
        setUnreadNotifications(0);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // 🔐 Login
  const login = async (data: { email: string; password: string }) => {
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

    const unread = await getUnreadNotificationCount();
    setUnreadNotifications(unread);

    router.push("/dashboard");
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("accessToken");
    setupAxiosToken(null);
    setUser(null);
    setUnreadNotifications(0);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        unreadNotifications,
        setUnreadNotifications,
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
