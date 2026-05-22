"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createCategory, getCategories } from "@/lib/admin-api";
import type { AdminCategory } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function NewCategoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [isEmailProtected, setIsEmailProtected] = useState(false);
  const [allowedDomains, setAllowedDomains] = useState("");

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createCategory({
        name,
        description: description || null,
        parent_id: parentId ? Number(parentId) : null,
        is_email_protected: isEmailProtected,
        allowed_email_domains: isEmailProtected && allowedDomains.trim()
          ? allowedDomains.split(",").map((d) => d.trim()).filter(Boolean)
          : null,
      });
      toast.success("Category created");
      router.push("/admin/categories");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">New Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Parent Category</Label>
          <Select value={parentId} onValueChange={setParentId}>
            <SelectTrigger>
              <SelectValue placeholder="None (root category)" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={isEmailProtected}
              onCheckedChange={setIsEmailProtected}
              id="email-protected"
            />
            <Label htmlFor="email-protected">Email protected</Label>
          </div>
          {isEmailProtected && (
            <div className="space-y-2">
              <Label htmlFor="allowed-domains">
                Allowed email domains (comma-separated)
              </Label>
              <Input
                id="allowed-domains"
                value={allowedDomains}
                onChange={(e) => setAllowedDomains(e.target.value)}
                placeholder="example.com, company.nl"
              />
              <p className="text-xs text-muted-foreground">
                Only users with email addresses from these domains will have access.
                Articles in this category will also be protected.
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Category"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
