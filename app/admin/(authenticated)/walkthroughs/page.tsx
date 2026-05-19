"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getWalkthroughs, deleteWalkthrough } from "@/lib/admin-api";
import type { AdminWalkthrough, PaginatedResponse } from "@/lib/admin-types";
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

export default function WalkthroughsPage() {
  const [data, setData] =
    useState<PaginatedResponse<AdminWalkthrough> | null>(null);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";

  function load() {
    const params: Record<string, string> = { page };
    if (search) params.search = search;
    getWalkthroughs(params).then(setData);
  }

  useEffect(() => {
    load();
  }, [page, search]);

  async function handleDelete(id: number) {
    await deleteWalkthrough(id);
    toast.success("Walkthrough deleted");
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Walkthroughs</h1>
        <Link href="/admin/walkthroughs/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Walkthrough
          </Button>
        </Link>
      </div>

      <Input
        placeholder="Search walkthroughs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((wt) => (
              <TableRow key={wt.id}>
                <TableCell className="font-medium">{wt.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{wt.type}</Badge>
                </TableCell>
                <TableCell>{wt.steps_count ?? 0}</TableCell>
                <TableCell>
                  <Badge
                    variant={wt.published_at ? "default" : "secondary"}
                  >
                    {wt.published_at ? "published" : "draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/admin/walkthroughs/${wt.id}/edit`}>
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
                          <AlertDialogTitle>
                            Delete walkthrough?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &ldquo;{wt.title}
                            &rdquo; and all its steps.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(wt.id)}
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
                  No walkthroughs found.
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
              onClick={() => router.push(`/admin/walkthroughs?page=${i + 1}`)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
