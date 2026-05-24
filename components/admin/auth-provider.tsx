"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { AdminUser, AdminUserOrganization, OrganizationRole } from "@/lib/admin-types";
import * as api from "@/lib/admin-api";

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  currentOrganization: AdminUserOrganization | null;
  setCurrentOrganization: (org: AdminUserOrganization | null) => void;
  isSuperAdmin: boolean;
  currentRole: OrganizationRole | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentOrganization, setCurrentOrganization] = useState<AdminUserOrganization | null>(null);

  useEffect(() => {
    api
      .getUser()
      .then(({ user }) => {
        setUser(user);
        // Auto-select first org if user has organizations
        if (user.organizations?.length > 0 && !currentOrganization) {
          setCurrentOrganization(user.organizations[0]);
        }
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await api.login(email, password);
    setUser(user);
    if (user.organizations?.length > 0) {
      setCurrentOrganization(user.organizations[0]);
    }
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    setCurrentOrganization(null);
    window.location.href = "/admin/login";
  }, []);

  const isSuperAdmin = user?.is_super_admin ?? false;
  const currentRole = currentOrganization?.role ?? null;

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, currentOrganization, setCurrentOrganization, isSuperAdmin, currentRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
