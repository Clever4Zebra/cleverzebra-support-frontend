"use client";

import { useAuth } from "./auth-provider";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function AdminHeader() {
  const { user, logout, currentRole, isSuperAdmin } = useAuth();

  const displayRole = isSuperAdmin ? "Super Admin" : currentRole ?? "—";

  return (
    <header className="border-b px-6 py-3 flex items-center justify-between bg-background">
      <h1 className="text-sm font-medium text-muted-foreground">
        Knowledgebase Admin
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          {user?.name}{" "}
          <span className="text-muted-foreground capitalize">
            ({displayRole})
          </span>
        </span>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
