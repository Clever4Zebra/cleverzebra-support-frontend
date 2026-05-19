import { AuthProvider } from "@/components/admin/auth-provider";
import { Toaster } from "@/components/ui/sonner";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
