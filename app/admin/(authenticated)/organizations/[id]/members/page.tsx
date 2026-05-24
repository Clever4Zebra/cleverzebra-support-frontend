"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { OrganizationMember, OrganizationRole } from "@/lib/admin-types";
import * as api from "@/lib/admin-api";
import { useAuth } from "@/components/admin/auth-provider";
import { Button } from "@/components/ui/button";

const ROLES: OrganizationRole[] = ["owner", "admin", "editor", "viewer"];

export default function OrganizationMembersPage() {
  const params = useParams();
  const { isSuperAdmin } = useAuth();
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);

  const orgId = Number(params.id);

  useEffect(() => {
    if (!isSuperAdmin) return;
    loadMembers();
  }, [orgId, isSuperAdmin]);

  async function loadMembers() {
    try {
      const { data } = await api.getOrganizationMembers(orgId);
      setMembers(data);
    } catch {
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: number, role: string) {
    try {
      await api.updateOrganizationMember(orgId, userId, { role });
      setMembers((prev) =>
        prev.map((m) => (m.id === userId ? { ...m, role: role as OrganizationRole } : m))
      );
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  }

  async function handleRemove(userId: number) {
    if (!confirm("Remove this member from the organization?")) return;
    try {
      await api.removeOrganizationMember(orgId, userId);
      setMembers((prev) => prev.filter((m) => m.id !== userId));
      toast.success("Member removed");
    } catch {
      toast.error("Failed to remove member");
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
      <h1 className="text-2xl font-bold">Organization Members</h1>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-left font-medium">Role</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b">
                <td className="px-4 py-3 font-medium">
                  {member.name}
                  {member.is_super_admin && (
                    <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 rounded px-1.5 py-0.5">
                      Super Admin
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{member.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    className="rounded border px-2 py-1 text-sm"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleRemove(member.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No members in this organization yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
