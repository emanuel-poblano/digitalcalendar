"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  provider: "local" | "supabase";
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "lifeos-auth-user";
const USERS_KEY = "lifeos-auth-users";

function readStoredUsers(): Array<{ email: string; password: string; name: string }> {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStoredUsers(users: Array<{ email: string; password: string; name: string }>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUser = window.localStorage.getItem(STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readStoredUsers();
    const existing = users.find((candidate) => candidate.email === normalizedEmail);

    if (!existing || existing.password !== password) {
      throw new Error("Invalid email or password. Try the demo account or create a new one.");
    }

    const nextUser: AuthUser = {
      id: `${normalizedEmail}-${Date.now()}`,
      email: normalizedEmail,
      name: existing.name,
      provider: "local",
    };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    }

    setUser(nextUser);
  };

  const signUp = async (email: string, password: string, name: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const users = readStoredUsers();

    if (users.some((candidate) => candidate.email === normalizedEmail)) {
      throw new Error("An account already exists for this email.");
    }

    const nextUser: AuthUser = {
      id: `${normalizedEmail}-${Date.now()}`,
      email: normalizedEmail,
      name: name.trim() || "Demo user",
      provider: "local",
    };

    writeStoredUsers([...users, { email: normalizedEmail, password, name: nextUser.name }]);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    }

    setUser(nextUser);
  };

  const signOut = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setUser(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [loading, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
