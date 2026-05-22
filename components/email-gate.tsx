"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const STORAGE_KEY = "user_email";

function getStoredEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY);
}

function storeEmail(email: string): void {
  localStorage.setItem(STORAGE_KEY, email);
}

interface EmailGateProps {
  isProtected: boolean;
  children: React.ReactNode;
  onEmailSubmit: (email: string) => Promise<boolean>;
}

export function EmailGate({ isProtected, children, onEmailSubmit }: EmailGateProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [checking, setChecking] = useState(true);

  const tryAccess = useCallback(
    async (emailToTry: string) => {
      setLoading(true);
      setError(null);
      try {
        const success = await onEmailSubmit(emailToTry);
        if (success) {
          storeEmail(emailToTry);
          setAccessGranted(true);
          setShowDialog(false);
          return true;
        } else {
          setError("Your email domain does not have access to this content.");
          return false;
        }
      } catch {
        setError("Your email domain does not have access to this content.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [onEmailSubmit]
  );

  useEffect(() => {
    if (!isProtected) {
      setAccessGranted(true);
      setChecking(false);
      return;
    }

    const storedEmail = getStoredEmail();
    if (storedEmail) {
      tryAccess(storedEmail).then((success) => {
        if (!success) {
          setShowDialog(true);
        }
        setChecking(false);
      });
    } else {
      setShowDialog(true);
      setChecking(false);
    }
  }, [isProtected, tryAccess]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    await tryAccess(email.trim());
  }

  if (!isProtected || accessGranted) {
    return <>{children}</>;
  }

  if (checking) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        Checking access...
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="mx-auto max-w-md space-y-4">
          <div className="rounded-full bg-muted p-3 w-12 h-12 mx-auto flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Protected Content</h2>
          <p className="text-muted-foreground">
            This content is restricted. Please enter your email to verify access.
          </p>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Email Verification</DialogTitle>
              <DialogDescription>
                Enter your work email to access this content. Access is based on your email domain.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="gate-email">Email address</Label>
                <Input
                  id="gate-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  required
                />
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Verifying..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
