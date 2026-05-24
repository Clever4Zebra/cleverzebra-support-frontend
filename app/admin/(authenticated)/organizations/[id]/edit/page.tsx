"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Organization } from "@/lib/admin-types";
import * as api from "@/lib/admin-api";
import { useAuth } from "@/components/admin/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditOrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const orgId = Number(params.id);

  useEffect(() => {
    if (!isSuperAdmin) return;
    api
      .getOrganization(orgId)
      .then(({ data }) => setOrganization(data))
      .catch(() => toast.error("Failed to load organization"))
      .finally(() => setLoading(false));
  }, [orgId, isSuperAdmin]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string,
      domain: formData.get("domain") as string || null,
    };

    try {
      await api.updateOrganization(orgId, data);
      toast.success("Organization updated");
      router.push("/admin/organizations");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to update organization");
    } finally {
      setSaving(false);
    }
  }

  if (!isSuperAdmin) {
    return <div className="p-8 text-center text-muted-foreground">Super Admin access required.</div>;
  }

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading...</div>;
  }

  if (!organization) {
    return <div className="p-8 text-center text-muted-foreground">Organization not found.</div>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Edit Organization</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required defaultValue={organization.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (subdomain)</Label>
          <Input id="slug" name="slug" required defaultValue={organization.slug} />
          <p className="text-xs text-muted-foreground">
            Used as the subdomain: slug.yourdomain.com
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain">Custom Domain (optional)</Label>
          <Input id="domain" name="domain" defaultValue={organization.domain ?? ""} />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
