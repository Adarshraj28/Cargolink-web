"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { getSessionUser, login, logout, subscribe } from "./store";
import type { Role, User } from "./types";

interface AuthContextValue {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { user?: User; error?: string };
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  role: null,
  isAuthenticated: false,
  login: () => ({}),
  logout: () => {},
  refresh: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Subscribe to the store so the session stays in sync with every mutation
  // (login, logout, admin suspension, demo reset). The server snapshot is
  // always null so SSR and hydration stay consistent.
  const user = useSyncExternalStore(
    subscribe,
    () => getSessionUser(),
    () => null
  );

  const handleLogin = useCallback((email: string, password: string) => {
    return login(email, password);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, []);

  const refresh = useCallback(() => {
    // No-op — the store notifies subscribers on every mutation.
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        login: handleLogin,
        logout: handleLogout,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
