"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSupportRequests, deleteSupportRequest } from "@/lib/admin-api";
import type { AdminSupportRequest, PaginatedResponse } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
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
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SupportRequestsPage() {
  const [data, setData] =
    useState<PaginatedResponse<AdminSupportRequest> | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "1";

  function load() {
    getSupportRequests({ page }).then(setData);
  }

  useEffect(() => {
    load();
  }, [page]);

  async function handleDelete(id: number) {
    await deleteSupportRequest(id);
    toast.success("Support request deleted");
    load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Support Requests</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Walkthrough</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="max-w-[300px] truncate">
                  {req.description}
                </TableCell>
                <TableCell>{req.contact_email}</TableCell>
                <TableCell>{req.walkthrough?.title || "—"}</TableCell>
                <TableCell>
                  {new Date(req.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/admin/support-requests/${req.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
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
                            Delete support request?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(req.id)}
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
                  No support requests.
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
              onClick={() =>
                router.push(`/admin/support-requests?page=${i + 1}`)
              }
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
