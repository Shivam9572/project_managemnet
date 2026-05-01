import type { Metadata } from "next";
import dynamic from "next/dynamic";
import "./globals.css";

const ClientProviders = dynamic(() => import("@/components/ClientProviders"), { ssr: false });
export const metadata: Metadata = {
  title: "ProjectFlow",
  description: "Full-stack project management app with RBAC"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
