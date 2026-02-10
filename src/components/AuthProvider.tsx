"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  clearUserFromStorage,
  loadUserFromStorage,
  saveUserToStorage,
  type User,
} from "@/lib/auth";

type AuthContextValue = {
  user: User | null;
  ready: boolean;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(loadUserFromStorage());
    setReady(true);
  }, []);

  const login = useCallback((u: User) => {
    setUser(u);
    saveUserToStorage(u);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearUserFromStorage();
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, logout }),
    [user, ready, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
