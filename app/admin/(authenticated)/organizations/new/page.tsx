"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import * as api from "@/lib/admin-api";
import { useAuth } from "@/components/admin/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewOrganizationPage() {
  const router = useRouter();
  const { isSuperAdmin } = useAuth();
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      slug: formData.get("slug") as string || undefined,
      domain: formData.get("domain") as string || null,
    };

    try {
      await api.createOrganization(data);
      toast.success("Organization created");
      router.push("/admin/organizations");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create organization");
    } finally {
      setSaving(false);
    }
  }

  if (!isSuperAdmin) {
    return <div className="p-8 text-center text-muted-foreground">Super Admin access required.</div>;
  }

  return (
    <div className="max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">New Organization</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required placeholder="Acme Corp" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (subdomain)</Label>
          <Input id="slug" name="slug" placeholder="acme (auto-generated from name if empty)" />
          <p className="text-xs text-muted-foreground">
            Used as the subdomain: slug.yourdomain.com
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="domain">Custom Domain (optional)</Label>
          <Input id="domain" name="domain" placeholder="help.acme.com" />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Creating..." : "Create Organization"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
