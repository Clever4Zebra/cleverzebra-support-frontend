"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import type { Organization } from "@/lib/admin-types";
import * as api from "@/lib/admin-api";
import { useAuth } from "@/components/admin/auth-provider";
import { Button } from "@/components/ui/button";

export default function OrganizationsPage() {
  const { isSuperAdmin } = useAuth();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSuperAdmin) return;
    loadOrganizations();
  }, [isSuperAdmin]);

  async function loadOrganizations() {
    try {
      const res = await api.getOrganizations();
      setOrganizations(res.data);
    } catch (err) {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this organization? This will remove all its content.")) {
      return;
    }
    try {
      await api.deleteOrganization(id);
      setOrganizations((prev) => prev.filter((o) => o.id !== id));
      toast.success("Organization deleted");
    } catch (err) {
      toast.error("Failed to delete organization");
    }
  }

  if (!isSuperAdmin) {
    return <div className="p-8 text-center text-muted-foreground">Super Admin access required.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <Button asChild>
          <Link href="/admin/organizations/new">
            <Plus className="mr-2 h-4 w-4" />
            New Organization
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Slug</th>
              <th className="px-4 py-3 text-left font-medium">Domain</th>
              <th className="px-4 py-3 text-center font-medium">Members</th>
              <th className="px-4 py-3 text-center font-medium">Articles</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((org) => (
              <tr key={org.id} className="border-b">
                <td className="px-4 py-3 font-medium">{org.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{org.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{org.domain || "—"}</td>
                <td className="px-4 py-3 text-center">{org.users_count ?? 0}</td>
                <td className="px-4 py-3 text-center">{org.articles_count ?? 0}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/organizations/${org.id}/members`}>
                        <Users className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/admin/organizations/${org.id}/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(org.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {organizations.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No organizations yet. Create your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
