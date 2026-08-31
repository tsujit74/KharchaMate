"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginUser, logoutUser } from "@/app/services/auth.service";
import { getUnreadNotificationCount } from "@/app/services/notification.service";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string | null;
};

type AuthContextType = {
  user: User | null;
  unreadNotifications: number;
  setUnreadNotifications: React.Dispatch<React.SetStateAction<number>>;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await getMe();
        const u = res.data.user;

        setUser({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          avatar: u.avatar ?? null,
        });

        setLoading(false);

        getUnreadNotificationCount()
          .then((count) => {
            setUnreadNotifications(count);
          })
          .catch(() => {
            setUnreadNotifications(0);
          });
      } catch {
        setUser(null);
        setUnreadNotifications(0);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: { email: string; password: string }) => {
    try {
      await loginUser(data);

      const userRes = await getMe();
      const u = userRes.data.user;

      setUser({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar ?? null,
      });

      const unread = await getUnreadNotificationCount();
      setUnreadNotifications(unread);

      if (u.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/dashboard");
      }
    } catch (err: any) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setUnreadNotifications(0);
      router.replace("/");
    }
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
