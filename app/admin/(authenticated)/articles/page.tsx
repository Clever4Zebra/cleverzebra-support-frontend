"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getArticles, deleteArticle } from "@/lib/admin-api";
import type { AdminArticle, PaginatedResponse } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

function getStatus(article: AdminArticle) {
  if (!article.published_at) return "draft";
  if (new Date(article.published_at) > new Date()) return "scheduled";
  return "published";
}

export default function ArticlesPage() {
  const [data, setData] = useState<PaginatedResponse<AdminArticle> | null>(
    null
  );
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    const params: Record<string, string> = { page };
    if (search) params.search = search;
    getArticles(params).then(setData);
  }, [page, search]);

  async function handleDelete(id: number) {
    await deleteArticle(id);
    toast.success("Article deleted");
    const params: Record<string, string> = { page };
    if (search) params.search = search;
    getArticles(params).then(setData);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Articles</h1>
        <Link href="/admin/articles/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Article
          </Button>
        </Link>
      </div>

      <Input
        placeholder="Search articles..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.category?.name || "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      getStatus(article) === "published"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {getStatus(article)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {article.published_at
                    ? new Date(article.published_at).toLocaleDateString()
                    : "—"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/admin/articles/${article.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete article?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &ldquo;{article.title}
                            &rdquo;.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(article.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data && data.data.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No articles found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {data && data.meta.last_page > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: data.meta.last_page }, (_, i) => (
            <Button
              key={i + 1}
              variant={data.meta.current_page === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => router.push(`/admin/articles?page=${i + 1}`)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
