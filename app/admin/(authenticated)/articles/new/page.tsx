"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle, getCategories, getTags } from "@/lib/admin-api";
import type { AdminCategory, AdminTag } from "@/lib/admin-types";
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

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [tags, setTags] = useState<AdminTag[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [publish, setPublish] = useState(false);
  const [isEmailProtected, setIsEmailProtected] = useState(false);
  const [allowedDomains, setAllowedDomains] = useState("");

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data));
    getTags().then((res) => setTags(res.data));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      await createArticle({
        title,
        body,
        excerpt: excerpt || null,
        category_id: categoryId ? Number(categoryId) : null,
        tag_ids: selectedTags,
        published_at: publish ? new Date().toISOString() : null,
        is_email_protected: isEmailProtected,
        allowed_email_domains: isEmailProtected && allowedDomains.trim()
          ? allowedDomains.split(",").map((d) => d.trim()).filter(Boolean)
          : null,
      });
      toast.success("Article created");
      router.push("/admin/articles");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create article");
    } finally {
      setLoading(false);
    }
  }

  function toggleTag(tagId: number) {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">New Article</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea
            id="excerpt"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={2}
            placeholder="Brief description..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="body">Body (Markdown)</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={20}
            className="font-mono text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  type="button"
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag.id)}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
          </div>
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
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Switch checked={publish} onCheckedChange={setPublish} id="publish" />
          <Label htmlFor="publish">Publish immediately</Label>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Article"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
