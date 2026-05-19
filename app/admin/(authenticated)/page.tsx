"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getStats } from "@/lib/admin-api";
import type { DashboardStats } from "@/lib/admin-types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, FolderTree, Route, MessageSquare, Users } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    getStats().then(setStats);
  }, []);

  const cards = [
    { label: "Articles", value: stats?.articles_count, icon: FileText, href: "/admin/articles" },
    { label: "Categories", value: stats?.categories_count, icon: FolderTree, href: "/admin/categories" },
    { label: "Walkthroughs", value: stats?.walkthroughs_count, icon: Route, href: "/admin/walkthroughs" },
    { label: "Support Requests", value: stats?.support_requests_count, icon: MessageSquare, href: "/admin/support-requests" },
    { label: "Users", value: stats?.users_count, icon: Users, href: "/admin/users" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <Link key={card.label} href={card.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.label}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats ? card.value : "—"}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
