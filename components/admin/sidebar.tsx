"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderTree,
  Tags,
  Route,
  MessageSquare,
  Users,
  LayoutDashboard,
  Building2,
} from "lucide-react";
import { useAuth } from "./auth-provider";
import { OrgSwitcher } from "./org-switcher";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/tags", label: "Tags", icon: Tags },
  { href: "/admin/walkthroughs", label: "Walkthroughs", icon: Route },
  {
    href: "/admin/support-requests",
    label: "Support Requests",
    icon: MessageSquare,
  },
  { href: "/admin/users", label: "Members", icon: Users, roles: ["owner", "admin"] as string[] },
  { href: "/admin/organizations", label: "Organizations", icon: Building2, superAdminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, isSuperAdmin, currentRole } = useAuth();

  return (
    <aside className="w-64 border-r bg-muted/30 min-h-screen p-4">
      <div className="mb-4">
        <Link href="/admin" className="text-lg font-semibold">
          KB Admin
        </Link>
      </div>
      {user && <OrgSwitcher />}
      <nav className="space-y-1 mt-4">
        {navItems
          .filter((item) => {
            if ('superAdminOnly' in item && item.superAdminOnly) {
              return isSuperAdmin;
            }
            if ('roles' in item && item.roles) {
              return isSuperAdmin || (currentRole && item.roles.includes(currentRole));
            }
            return true;
          })
          .map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
      </nav>
    </aside>
  );
}
