"use client";

import { useAuth } from "./auth-provider";
import { Building2, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

export function OrgSwitcher() {
  const { user, currentOrganization, setCurrentOrganization, isSuperAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user?.organizations?.length && !isSuperAdmin) {
    return null;
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2 rounded-md border px-3 py-2 text-sm",
          "hover:bg-muted transition-colors text-left"
        )}
      >
        <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate">
          {currentOrganization?.name ?? "All Organizations"}
        </span>
        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover p-1 shadow-md">
          {isSuperAdmin && (
            <button
              onClick={() => {
                setCurrentOrganization(null);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm",
                "hover:bg-accent hover:text-accent-foreground",
                !currentOrganization && "bg-accent text-accent-foreground"
              )}
            >
              All Organizations
            </button>
          )}
          {user?.organizations?.map((org) => (
            <button
              key={org.id}
              onClick={() => {
                setCurrentOrganization(org);
                setOpen(false);
              }}
              className={cn(
                "w-full flex items-center justify-between rounded-sm px-2 py-1.5 text-sm",
                "hover:bg-accent hover:text-accent-foreground",
                currentOrganization?.id === org.id && "bg-accent text-accent-foreground"
              )}
            >
              <span className="truncate">{org.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{org.role}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
