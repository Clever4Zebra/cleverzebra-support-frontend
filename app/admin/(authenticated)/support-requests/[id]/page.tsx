"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getSupportRequest, deleteSupportRequest } from "@/lib/admin-api";
import type { AdminSupportRequest } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function SupportRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [request, setRequest] = useState<AdminSupportRequest | null>(null);

  useEffect(() => {
    getSupportRequest(Number(id)).then((res) => setRequest(res.data));
  }, [id]);

  async function handleDelete() {
    await deleteSupportRequest(Number(id));
    toast.success("Support request deleted");
    router.push("/admin/support-requests");
  }

  if (!request)
    return <div className="text-muted-foreground">Loading...</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/support-requests")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete support request?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Request #{request.id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Contact Email:</span>{" "}
              {request.contact_email}
            </div>
            <div>
              <span className="font-medium">Date:</span>{" "}
              {new Date(request.created_at).toLocaleString()}
            </div>
            {request.walkthrough && (
              <div>
                <span className="font-medium">Walkthrough:</span>{" "}
                {request.walkthrough.title}
              </div>
            )}
            {request.walkthrough_step && (
              <div>
                <span className="font-medium">Step:</span>{" "}
                {request.walkthrough_step.title}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md">
              {request.description}
            </p>
          </div>

          {request.path_taken && request.path_taken.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Path Taken</h3>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {request.path_taken.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}

          {request.screenshots && request.screenshots.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Screenshots</h3>
              <div className="grid grid-cols-2 gap-4">
                {request.screenshots.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={url}
                      alt={`Screenshot ${i + 1}`}
                      className="rounded-md border object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
