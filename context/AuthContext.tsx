"use client";

// ============================================================================
// StormSentinel Frontend — Auth Context
// Wraps the whole app. Any component can call useAuth() to get the current
// user, or login()/signup()/logout(). Token persists in localStorage so a
// page refresh doesn't log the user out.
// ============================================================================

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi, UserOut, ApiError } from "@/lib/api";

interface AuthContextValue {
  user: UserOut | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserOut | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // On mount, restore the session from whatever's in localStorage — a
  // page refresh shouldn't log the user out. The token itself is trusted
  // client-side here (JWT expiry is checked server-side on every real API
  // call); this is just to decide whether to show "logged in" UI.
  useEffect(() => {
    const stored = localStorage.getItem("stormsentinel_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("stormsentinel_user");
        localStorage.removeItem("stormsentinel_token");
      }
    }
    setIsLoading(false);
  }, []);

  function persistSession(token: string, userOut: UserOut) {
    localStorage.setItem("stormsentinel_token", token);
    localStorage.setItem("stormsentinel_user", JSON.stringify(userOut));
    setUser(userOut);
  }

  async function login(email: string, password: string) {
    setError(null);
    try {
      const result = await authApi.login(email, password);
      persistSession(result.access_token, result.user);
      router.push("/");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Login failed — try again");
      throw e;
    }
  }

  async function signup(email: string, password: string, displayName?: string) {
    setError(null);
    try {
      const result = await authApi.signup(email, password, displayName);
      persistSession(result.access_token, result.user);
      router.push("/");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Signup failed — try again");
      throw e;
    }
  }

  function logout() {
    localStorage.removeItem("stormsentinel_token");
    localStorage.removeItem("stormsentinel_user");
    setUser(null);
    router.push("/login");
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
