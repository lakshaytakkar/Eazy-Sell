import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";

interface AuthUser {
  id: number;
  authId: string;
  username: string;
  role: string;
  name: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  clientId: number | null;
  clientName: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ user: AuthUser; role: string }>;
  signup: (data: { email: string; password: string; name: string; city: string; phone?: string; role?: string }) => Promise<{ user: AuthUser }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

async function apiFetch(url: string, opts?: RequestInit) {
  const token = localStorage.getItem("ets_access_token");
  const headers: Record<string, string> = {
    ...(opts?.body ? { "Content-Type": "application/json" } : {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { ...opts, headers: { ...headers, ...opts?.headers } });
  return res;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    try {
      const res = await apiFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user;
      }
      setUser(null);
      return null;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("ets_access_token");
    if (token) {
      fetchMe().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchMe]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Login failed");
    }
    const data = await res.json();
    localStorage.setItem("ets_access_token", data.session.access_token);
    localStorage.setItem("ets_refresh_token", data.session.refresh_token);
    setUser(data.user);
    return { user: data.user, role: data.user.role };
  }, []);

  const signup = useCallback(async (signupData: { email: string; password: string; name: string; city: string; phone?: string; role?: string }) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signupData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Signup failed");
    }
    const data = await res.json();
    localStorage.setItem("ets_access_token", data.session.access_token);
    localStorage.setItem("ets_refresh_token", data.session.refresh_token);
    setUser(data.user);
    return { user: data.user };
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("ets_access_token");
    localStorage.removeItem("ets_refresh_token");
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
