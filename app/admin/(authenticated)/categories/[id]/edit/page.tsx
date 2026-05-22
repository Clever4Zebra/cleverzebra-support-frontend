"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getCategory, updateCategory, getCategories } from "@/lib/admin-api";
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

export default function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [isEmailProtected, setIsEmailProtected] = useState(false);
  const [allowedDomains, setAllowedDomains] = useState("");

  useEffect(() => {
    Promise.all([getCategory(Number(id)), getCategories()]).then(
      ([catRes, allRes]) => {
        const cat = catRes.data;
        setName(cat.name);
        setSlug(cat.slug);
        setDescription(cat.description || "");
        setParentId(cat.parent_id ? String(cat.parent_id) : "");
        setIsEmailProtected(cat.is_email_protected);
        setAllowedDomains(cat.allowed_email_domains?.join(", ") || "");
        setCategories(allRes.data.filter((c) => c.id !== Number(id)));
        setFetching(false);
      }
    );
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await updateCategory(Number(id), {
        name,
        slug,
        description: description || null,
        parent_id: parentId ? Number(parentId) : null,
        is_email_protected: isEmailProtected,
        allowed_email_domains: isEmailProtected && allowedDomains.trim()
          ? allowedDomains.split(",").map((d) => d.trim()).filter(Boolean)
          : null,
      });
      toast.success("Category updated");
      router.push("/admin/categories");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  if (fetching) return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Category</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
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
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
