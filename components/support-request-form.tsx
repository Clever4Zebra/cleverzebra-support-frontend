"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { submitSupportRequest } from "@/lib/api";

interface SupportRequestFormProps {
  walkthroughId: number;
  walkthroughStepId: number;
  pathTaken: number[];
}

export function SupportRequestForm({
  walkthroughId,
  walkthroughStepId,
  pathTaken,
}: SupportRequestFormProps) {
  const [resolved, setResolved] = useState<boolean | null>(null);
  const [description, setDescription] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (submitted) {
    return (
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
          Support request submitted
        </h3>
        <p className="mt-2 text-sm text-green-700 dark:text-green-300">
          We&apos;ve received your request and will get back to you as soon as
          possible.
        </p>
      </div>
    );
  }

  if (resolved === null) {
    return (
      <div className="mt-6 rounded-lg border p-6">
        <h3 className="text-lg font-semibold">Is your problem resolved?</h3>
        <div className="mt-4 flex gap-3">
          <Button onClick={() => setResolved(true)}>Yes, it&apos;s resolved</Button>
          <Button variant="outline" onClick={() => setResolved(false)}>
            No, I still need help
          </Button>
        </div>
      </div>
    );
  }

  if (resolved) {
    return (
      <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6 text-center dark:border-green-800 dark:bg-green-950">
        <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
          Glad we could help!
        </h3>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append("walkthrough_id", walkthroughId.toString());
    formData.append("walkthrough_step_id", walkthroughStepId.toString());
    formData.append("description", description);
    pathTaken.forEach((stepId) => {
      formData.append("path_taken[]", stepId.toString());
    });
    if (contactEmail) {
      formData.append("contact_email", contactEmail);
    }
    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("screenshots[]", file);
      });
    }

    try {
      await submitSupportRequest(formData);
      setSubmitted(true);
    } catch {
      setError("Failed to submit support request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border p-6">
      <h3 className="text-lg font-semibold">Submit a support request</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Describe your issue and we&apos;ll get back to you.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Describe your problem *
          </label>
          <textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={5000}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Please describe what you're experiencing..."
          />
        </div>

        <div>
          <label
            htmlFor="screenshots"
            className="block text-sm font-medium mb-1"
          >
            Screenshots (optional, max 5)
          </label>
          <input
            id="screenshots"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/80"
          />
        </div>

        <div>
          <label
            htmlFor="contact_email"
            className="block text-sm font-medium mb-1"
          >
            Email address (optional)
          </label>
          <input
            id="contact_email"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="your@email.com"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={submitting || !description.trim()}>
          {submitting ? "Submitting..." : "Submit support request"}
        </Button>
      </form>
    </div>
  );
}
